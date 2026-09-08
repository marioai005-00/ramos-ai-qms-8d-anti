"""HTTP regression tests with synthetic files and mocked AI only."""
import base64
import io
import json
import zipfile
from unittest.mock import patch
import functools
import http.client
import importlib.util
from pathlib import Path
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer

spec = importlib.util.spec_from_file_location("portal", Path(__file__).resolve().parents[1] / "portal_server.py")
portal = importlib.util.module_from_spec(spec)
spec.loader.exec_module(portal)

class PortalTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        (root / "index.html").write_text("Test portal")
        (root / ".env").write_text("SYNTHETIC_TEST_ONLY=1")
        (root / "js").mkdir()
        (root / "js" / "app.js").write_text("// test")
        (root / "input").mkdir()
        (root / "input" / "test.txt").write_text("private")
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(portal.PortalHandler, directory=self.temp.name))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temp.cleanup()

    def request(self, method, path, body=None, headers=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=3)
        conn.request(method, path, body=body, headers=headers or {})
        response = conn.getresponse()
        status = response.status
        response.read()
        conn.close()
        return status

    def test_public_assets(self):
        self.assertEqual(self.request("GET", "/"), 200)
        self.assertEqual(self.request("GET", "/js/app.js?v=1"), 200)

    def test_private_paths_get_and_head(self):
        for method in ("GET", "HEAD"):
            for path in ("/.env", "/%2eenv", "/.git/config", "/input/test.txt", "/portal_server.py", "/js/../.env", "/js/"):
                with self.subTest(method=method, path=path):
                    self.assertEqual(self.request(method, path), 403)

    def test_bad_json_and_types(self):
        for body in ("[]", "null", "{", '{"prompt":null}', '{"task":12}'):
            self.assertEqual(self.request("POST", portal.AI_DISPATCH_PATH, body), 400)

    def test_foreign_origin(self):
        self.assertEqual(self.request("POST", portal.AI_DISPATCH_PATH, "{}", {"Origin":"https://example.com"}), 403)

    def test_local_documents(self):
        self.assertEqual(portal.parse_document("test.txt", "한글 수량 0".encode("cp949"))["text"], "한글 수량 0")
        self.assertIn("Synthetic claim", portal.parse_document("test.eml", b"Subject: Synthetic\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nSynthetic claim")["text"])
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as archive:
            archive.writestr("word/document.xml", '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Synthetic DOCX</w:t></w:r></w:p></w:body></w:document>')
        self.assertEqual(portal.parse_document("test.docx", buffer.getvalue())["text"], "Synthetic DOCX")
        self.assertTrue(portal.parse_document("large.txt", b"x" * 100001)["truncated"])
        with self.assertRaises(ValueError):
            portal.parse_document("test.msg", b"unsupported")

    def test_parse_endpoint_never_calls_ai(self):
        with patch.object(portal, "call_gemini", side_effect=AssertionError("No AI")), patch.object(portal, "call_groq", side_effect=AssertionError("No AI")):
            body = json.dumps({"filename": "test.txt", "dataUrl": "data:text/plain;base64," + base64.b64encode(b"Synthetic").decode()})
            self.assertEqual(self.request("POST", portal.DOCUMENT_PARSE_PATH, body), 200)
            self.assertEqual(self.request("POST", portal.DOCUMENT_PARSE_PATH, body, {"Origin": "https://example.com"}), 403)
            for data in ({}, {"filename":"x.txt","dataUrl":"data:;base64,!"}, {"filename":"x.docx","dataUrl":"data:;base64,eA=="}):
                self.assertEqual(self.request("POST", portal.DOCUMENT_PARSE_PATH, json.dumps(data)), 422)

    def test_media_routes_to_gemini_without_text_fallback(self):
        attachment = {"name": "synthetic.pdf", "dataUrl": "data:application/pdf;base64," + base64.b64encode(b"%PDF synthetic").decode()}
        payload = json.dumps({"task":"intake_extract", "prompt":"Synthetic", "attachments":[attachment]})
        with patch.object(portal, "call_gemini", return_value={"success":False,"error":"synthetic failure"}) as gemini, patch.object(portal, "call_groq", return_value={"success":True}) as groq:
            self.assertEqual(self.request("POST", portal.AI_DISPATCH_PATH, payload), 200)
            self.assertEqual(gemini.call_args.kwargs["attachments"], [attachment])
            groq.assert_not_called()

    def test_invalid_media_is_rejected_before_ai(self):
        payload = {"task":"intake_extract", "prompt":"Synthetic", "attachments":[{"name":"bad.svg","dataUrl":"data:image/svg+xml;base64,PHN2Zz4="}]}
        with patch.object(portal, "call_gemini", side_effect=AssertionError("No AI")), patch.object(portal, "call_groq", side_effect=AssertionError("No AI")):
            self.assertEqual(self.request("POST", portal.AI_DISPATCH_PATH, json.dumps(payload)), 400)

    def test_late_stage_gemini_routing(self):
        for task in ("d5_draft", "d6_draft", "d7_draft", "d8_draft"):
            with self.subTest(task=task):
                with patch.object(portal, "call_gemini", return_value={"success":True, "engine":"gemini", "text":'{"groups":{}}'}) as gemini:
                    status = self.request("POST", portal.AI_DISPATCH_PATH, json.dumps({"task":task, "prompt":"Context"}))
                    self.assertEqual(status, 200)
                    self.assertTrue(gemini.called)

    def test_groq_fallback_when_gemini_fails_text(self):
        with patch.object(portal, "call_gemini", return_value={"success":False, "engine":"gemini", "error":"quota"}) as gemini, patch.object(portal, "call_groq", return_value={"success":True, "engine":"groq", "text":"{\"groups\":{}}"}) as groq:
            status = self.request("POST", portal.AI_DISPATCH_PATH, json.dumps({"task":"d5_draft", "prompt":"Context"}))
            self.assertEqual(status, 200)
            self.assertTrue(gemini.called)
            self.assertTrue(groq.called)

if __name__ == "__main__":
    unittest.main()
