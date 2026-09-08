"""Launch the local AI-QMS portal with cache disabled.

The server binds to localhost only. Re-running the launcher reuses a server
that already serves this project, or selects the next free local port.
"""

from __future__ import annotations

import functools
import time
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import base64
import io
import os
import socket
import threading
import zipfile
import xml.etree.ElementTree as ET
from email.parser import BytesParser
from email import policy
import urllib.error

PROJECT_ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT_RANGE = range(8765, 8776)
STATUS_PATH = "/__portal_status__"
AI_STATUS_PATH = "/__api__/ai/status"
AI_DISPATCH_PATH = "/__api__/ai/dispatch"
DOCUMENT_PARSE_PATH = "/__api__/documents/parse"

AI_PROVIDER_TIMEOUT_SECONDS = 45
AI_PROVIDER_RESPONSE_BYTES = 2 * 1024 * 1024


def read_json_response(response) -> dict:
    raw = response.read(AI_PROVIDER_RESPONSE_BYTES + 1)
    if len(raw) > AI_PROVIDER_RESPONSE_BYTES:
        raise ValueError("AI provider response exceeded 2 MB")
    value = json.loads(raw.decode("utf-8"))
    if not isinstance(value, dict):
        raise ValueError("AI provider returned a non-object response")
    return value


def parse_structured_text(result: dict[str, object]) -> object | None:
    if not result.get("success") or not isinstance(result.get("text"), str):
        return None
    raw_text = result["text"].strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    elif raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    try:
        return json.loads(raw_text.strip())
    except (TypeError, ValueError):
        return None


def normalize_structured_output(task: str, value: object) -> object:
    if not isinstance(value, dict) or task not in {"d5_draft", "d6_draft", "d7_draft", "d8_draft"}:
        return value
    normalized = json.loads(json.dumps(value))
    for key in ("confirmedFacts", "inferences", "missingInformation", "recommendations"):
        items = normalized.get(key)
        if isinstance(items, list):
            normalized[key] = [
                item if isinstance(item, str) else json.dumps(item, ensure_ascii=False, separators=(",", ":"))
                for item in items
            ]
    groups = normalized.get("groups")
    if not isinstance(groups, dict):
        return normalized
    string_row_fields = {
        "d5_draft": {"candidates": ("title", "Occurrence")},
        "d6_draft": {"validationTests": ("testName", "")},
        "d7_draft": {"systemUpdates": ("changeContent", ""), "horizontalDeployment": ("action", "")},
        "d8_draft": {"checklist": ("item", "AI Recommendation")},
    }
    for group, (field, category) in string_row_fields[task].items():
        rows = groups.get(group)
        if isinstance(rows, list):
            converted = []
            for row in rows:
                if isinstance(row, str):
                    safe_row = {field: row}
                    if task == "d5_draft":
                        safe_row["causeType"] = category
                    elif task == "d8_draft":
                        safe_row["cat"] = category
                    converted.append(safe_row)
                else:
                    converted.append(row)
            groups[group] = converted
    return normalized


def structured_output_errors(task: str, value: object) -> list[str]:
    if task == "intake_extract":
        if not isinstance(value, dict):
            return ["intake output must be an object"]
        text_fields = ("customer", "customerContact", "customerEmail", "product", "partNumber",
                       "internalPartNumber", "lotNumber", "mfgSite", "incidentSite", "claimTitle",
                       "agentReasoning")
        errors = [f"{key} must be text or null" for key in text_fields
                  if value.get(key) is not None and not isinstance(value.get(key), str)]
        for key in ("defectQty", "inspectQty"):
            field_value = value.get(key)
            if field_value is not None and (isinstance(field_value, bool) or not isinstance(field_value, int) or field_value < 0):
                errors.append(f"{key} must be a non-negative integer or null")
        for key in ("lineStop", "safetyRisk", "recurrentDefect"):
            if value.get(key) is not None and not isinstance(value.get(key), bool):
                errors.append(f"{key} must be boolean or null")
        confidence = value.get("confidenceScore")
        if confidence is not None and (isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1):
            errors.append("confidenceScore must be between 0 and 1")
        if value.get("sourceEvidence") is not None and not isinstance(value.get("sourceEvidence"), dict):
            errors.append("sourceEvidence must be an object")
        return errors

    groups = {
        "d5_draft": {"candidates"},
        "d6_draft": {"validationTests"},
        "d7_draft": {"systemUpdates", "horizontalDeployment"},
        "d8_draft": {"checklist"},
    }
    if task not in groups:
        return []
    if not isinstance(value, dict):
        return ["late-stage output must be an object"]
    errors = []
    for key in ("confirmedFacts", "inferences", "missingInformation", "recommendations"):
        if value.get(key) is not None and (not isinstance(value[key], list) or any(not isinstance(item, str) for item in value[key])):
            errors.append(f"{key} must be a string array")
    output_groups = value.get("groups")
    if not isinstance(output_groups, dict):
        errors.append("groups must be an object")
        return errors
    for key in groups[task]:
        rows = output_groups.get(key)
        if rows is not None and (not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows)):
            errors.append(f"groups.{key} must be an object array")
        elif isinstance(rows, list) and len(rows) > 20:
            errors.append(f"groups.{key} exceeds 20 rows")
    return errors


def parse_document(filename: str, content: bytes) -> dict:
    if len(content) > 20 * 1024 * 1024:
        raise ValueError("Document exceeds 20 MB parsing limit")
    ext = Path(filename).suffix.lower()
    if ext == ".txt":
        if content.startswith((b"\xff\xfe", b"\xfe\xff")):
            text = content.decode("utf-16")
        else:
            try:
                text = content.decode("utf-8-sig")
            except UnicodeError:
                text = content.decode("cp949")
    elif ext == ".eml":
        message = BytesParser(policy=policy.default).parsebytes(content)
        body = message.get_body(preferencelist=("plain",))
        if body is None:
            html_body = message.get_body(preferencelist=("html",))
            if html_body:
                text = "\n".join(f"{key}: {message.get(key, '')}" for key in ("From", "To", "Date", "Subject"))
                text += "\n" + html_body.get_content()
            else:
                text = "\n".join(f"{key}: {message.get(key, '')}" for key in ("From", "To", "Date", "Subject"))
        else:
            text = "\n".join(f"{key}: {message.get(key, '')}" for key in ("From", "To", "Date", "Subject"))
            text += "\n" + body.get_content()
    elif ext == ".docx":
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            entries = archive.infolist()
            if len(entries) > 2000 or sum(e.file_size for e in entries) > 20 * 1024 * 1024:
                raise ValueError("DOCX expanded size exceeds parsing limit")
            xml = archive.read("word/document.xml")
            if b"<!DOCTYPE" in xml.upper() or b"<!ENTITY" in xml.upper():
                raise ValueError("Unsupported XML declarations")
            root = ET.fromstring(xml)
            ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
            text = "\n".join("".join(n.text or "" for n in para.iter(ns + "t")) for para in root.iter(ns + "p"))
    else:
        raise ValueError(f"Unsupported document format: {ext}")
    return {"success": True, "text": text[:100000], "truncated": len(text) > 100000}


def load_env() -> dict[str, str]:
    env_file = PROJECT_ROOT / ".env"
    env_vars: dict[str, str] = {}
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env_vars[k.strip()] = v.strip()
    for key in ("GROQ_API_KEY", "GEMINI_API_KEY"):
        if os.environ.get(key):
            env_vars[key] = os.environ[key]
    return env_vars


def call_groq(prompt: str, system_prompt: str = "", model: str = "openai/gpt-oss-20b") -> dict[str, object]:
    env = load_env()
    api_key = env.get("GROQ_API_KEY", "")
    if not api_key:
        return {"success": False, "error": "GROQ_API_KEY is not configured in .env"}

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 3072
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RAMOS-QMS/1.0"
        }
    )
    start_t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=AI_PROVIDER_TIMEOUT_SECONDS) as res:
            data = read_json_response(res)
            content = data["choices"][0]["message"]["content"].strip()
            return {
                "success": True,
                "engine": "groq",
                "model": model,
                "text": content,
                "latencyMs": int((time.time() - start_t) * 1000)
            }
    except urllib.error.HTTPError as err:
        return {"success": False, "engine": "groq", "error": f"Groq HTTP {err.code}"}
    except Exception as err:
        return {"success": False, "engine": "groq", "error": str(err)}


def call_gemini(prompt: str, system_prompt: str = "", image_base64: str = "", model: str = "", attachments: list | None = None) -> dict[str, object]:
    env = load_env()
    api_key = env.get("GEMINI_API_KEY", "")
    if not api_key:
        return {"success": False, "error": "GEMINI_API_KEY is not configured in .env"}

    parts: list[dict[str, object]] = []
    if system_prompt:
        parts.append({"text": f"[System Context]\n{system_prompt}\n"})
    parts.append({"text": prompt})

    if image_base64:
        mime_type = "image/png"
        raw_b64 = image_base64
        if "data:" in image_base64 and ";base64," in image_base64:
            header, raw_b64 = image_base64.split(";base64,", 1)
            mime_type = header.replace("data:", "")
        parts.append({
            "inlineData": {
                "mimeType": mime_type,
                "data": raw_b64
            }
        })

    for attachment in attachments or []:
        if isinstance(attachment, dict) and "dataUrl" in attachment and ";base64," in attachment["dataUrl"]:
            header, encoded = attachment["dataUrl"].split(";base64,", 1)
            mime = header.replace("data:", "")
            parts.append({"text": "Source filename: " + attachment.get("name", "document")})
            parts.append({"inlineData": {"mimeType": mime, "data": encoded}})

    payload = json.dumps({
        "contents": [{"parts": parts}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 3072
        }
    }).encode("utf-8")

    candidate_models = [model] if model else ["gemini-flash-lite-latest", "gemini-flash-latest", "gemini-pro-latest"]
    last_err = None

    for m in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "x-goog-api-key": api_key,
                "Content-Type": "application/json",
                "User-Agent": "RAMOS-QMS/1.0"
            }
        )
        start_t = time.time()
        try:
            with urllib.request.urlopen(req, timeout=AI_PROVIDER_TIMEOUT_SECONDS) as res:
                data = read_json_response(res)
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                return {
                    "success": True,
                    "engine": "gemini",
                    "model": m,
                    "text": text,
                    "latencyMs": int((time.time() - start_t) * 1000)
                }
        except urllib.error.HTTPError as err:
            last_err = f"Gemini HTTP {err.code}"
            continue
        except Exception as err:
            last_err = str(err)
            continue

    return {"success": False, "engine": "gemini", "error": last_err or "Unknown Gemini error"}


class PortalHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        # Only browser assets are public; never serve .env, Git, source or input files.
        target = Path(self.translate_path(self.path)).resolve()
        try:
            relative = target.relative_to(Path(self.directory).resolve())
        except ValueError:
            self.send_error(403, "Private path")
            return None
        if (relative.as_posix() != "index.html" and relative.as_posix() != "."
                and (not relative.parts or relative.parts[0] not in {"js", "css", "assets"})):
            self.send_error(403, "Private path")
            return None
        if any(part.startswith(".") for part in relative.parts):
            self.send_error(403, "Private path")
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(403, "Directory listing disabled")
        return None

    def do_GET(self) -> None:  # noqa: N802
        clean_path = self.path.split("?", 1)[0]
        if clean_path == STATUS_PATH:
            payload = str(PROJECT_ROOT).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
            return

        if clean_path == AI_STATUS_PATH:
            env = load_env()
            groq_ready = bool(env.get("GROQ_API_KEY"))
            gemini_ready = bool(env.get("GEMINI_API_KEY"))
            res_data = {
                "status": "ok",
                "dualEngine": True,
                "groq": {"available": groq_ready, "recommendedFor": "Ultra-fast text, D2 5W2H, IS/IS NOT, 5-Why inference"},
                "gemini": {"available": gemini_ready, "recommendedFor": "Multimodal PDF/Claim visual inspection & deep audits"},
                "activeEngine": "auto"
            }
            body = json.dumps(res_data).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self) -> None:  # noqa: N802
        clean_path = self.path.split("?", 1)[0]
        if clean_path in (DOCUMENT_PARSE_PATH, AI_DISPATCH_PATH):
            port = self.server.server_port
            allowed_hosts = {f"{HOST}:{port}", f"localhost:{port}"}
            client_host = self.headers.get("Host", "")
            if client_host and client_host not in allowed_hosts:
                self.send_error(403, "Local host required")
                return
            origin = self.headers.get("Origin")
            if origin and origin not in {f"http://{host}" for host in allowed_hosts}:
                try:
                    content_len = int(self.headers.get("Content-Length", "0"))
                    if 0 < content_len <= 32 * 1024 * 1024:
                        self.rfile.read(content_len)
                except Exception:
                    pass
                self.send_error(403, "Same-origin request required")
                return
            try:
                content_len = int(self.headers.get("Content-Length", "0"))
                if not 0 < content_len <= 32 * 1024 * 1024:
                    self.send_error(413, "Invalid request size")
                    return
                raw_body = self.rfile.read(content_len).decode("utf-8")
                params = json.loads(raw_body)
                if not isinstance(params, dict):
                    raise ValueError("Expected object")
                if any(not isinstance(params.get(key, ""), str) for key in
                       ("prompt", "systemPrompt", "task", "engine", "imageBase64")):
                    raise ValueError("Expected string fields")
                if len(params.get("prompt", "")) > 200000 or len(params.get("systemPrompt", "")) > 50000:
                    raise ValueError("AI text input exceeds size limit")
            except (ValueError, UnicodeError):
                self.send_error(400, "Invalid JSON request")
                return

            if clean_path == DOCUMENT_PARSE_PATH:
                try:
                    filename, data_url = params.get("filename"), params.get("dataUrl")
                    if not isinstance(filename, str) or not isinstance(data_url, str) or not data_url.startswith("data:") or ";base64," not in data_url:
                        raise ValueError("Filename and base64 data URL required")
                    content = base64.b64decode(data_url.split(";base64,", 1)[1], validate=True)
                    result = parse_document(filename, content)
                    status = 200
                except (ValueError, KeyError, zipfile.BadZipFile, ET.ParseError, UnicodeError, RuntimeError, NotImplementedError) as error:
                    result = {"success": False, "error": str(error)}
                    status = 422
                body = json.dumps(result).encode("utf-8")
                self.send_response(status)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            prompt = params.get("prompt", "").strip()
            system_prompt = params.get("systemPrompt", "").strip()
            task = params.get("task", "quick_draft")
            attachments = params.get("attachments", [])
            try:
                if not isinstance(attachments, list) or len(attachments) > 10:
                    raise ValueError("Invalid attachment list")
                for attachment in attachments:
                    if not isinstance(attachment, dict) or not isinstance(attachment.get("name"), str) or not isinstance(attachment.get("dataUrl"), str):
                        raise ValueError("Invalid attachment")
                    header, encoded = attachment["dataUrl"].split(";base64,", 1)
                    if header not in {"data:application/pdf", "data:image/png", "data:image/jpeg", "data:image/webp"}:
                        raise ValueError("Unsupported media")
                    base64.b64decode(encoded, validate=True)
            except ValueError:
                self.send_error(400, "Invalid media attachments")
                return
            engine_pref = params.get("engine", "auto")
            image_b64 = params.get("imageBase64", "")

            if task == "d3_containment_actions":
                if not system_prompt:
                    system_prompt = """You are an elite semiconductor 8D facilitator at RAMOS.
RAMOS is a fabless memory module company with NO internal manufacturing lines.
GOC (Global Operations Center), Strategic Sourcing (LGE Sales/CS), and R&D FA handle all operations.
Generate strictly valid JSON array of 5 Interim Containment Action (ICA) objects with keys: "id", "target", "action", "owner", "due", "status", "result".

STRICT OWNER & TARGET MAPPING RULES:
1. "사내 창고 (RAK4 완제품 / RAK5 출하대기)" & "CTST (MES 내 공정재고)":
   - owner MUST be "조철민 그룹장_P.Pro (자원운영그룹)"
   - action: ERP RAK4/5 출하 전면 잠금(Shipment Lock) 및 CTST MES 재공품 즉시 HOLD 태그 부착
2. "외주 가공처 (TechL SMT / TEST 라인)":
   - owner MUST be "김혜원 Pro (외주운영그룹)"
   - action: TechL 외주 생산라인에 작업 중지(Line Stop) 및 SHORT TEST 잔여 배치 긴급 격리 통보
3. "운송 중 물류 (In-Transit 출하 트럭)":
   - owner MUST be "남서현 Pro (전략소싱팀 LGE 영업)"
   - action: 금일 평택행 출하 트럭 송장 추적, 운송사 유선 통보하여 하차 중단 및 오창 창고 회차 조치
4. "고객사 (LGE 평택 DTV SMT 라인 및 창고)":
   - owner MUST be "이하영 Pro (전략소싱팀 LGE CS)"
   - action: LGE 평택 DTV SMT 3라인 실장 투입 즉시 중단 공문 발송 및 고객 보관 재고 물리적 격리 요청
5. "고객사 현장 전기 선별 (0.8Ω Short 선별 지원)":
   - owner MUST be "박재환 팀장_S.Pro (Flash개발2팀 FA Lead)"
   - action: LGE 평택 현장 엔지니어 급파, VCC-VSS 저항 측정 지그 투입하여 실장 모듈 100% 전기적 전수 선별

Format each "due" realistically (e.g. 2시간 이내, 4시간 이내, 24시간 이내).
Always write in professional Korean. Return strictly valid JSON array without markdown."""

            if task == "d2_problem_statement":
                if not system_prompt:
                    system_prompt = """You are a master 8D problem-solving facilitator and senior semiconductor QA director at RAMOS.
Synthesize the provided 5W2H facts and IS/IS NOT boundary data into a single, authoritative, IATF 16949-compliant 'Standard Problem Statement' in Korean.
STRICT 8D DISCIPLINE RULES:
1. State strictly VERIFIED FACTS only.
2. NEVER include root cause speculations, assumptions, or '...때문으로 추정됨' statements.
3. Clearly state: [Customer & Incident Station], [Affected Product & Lot], [Operating/Environmental Condition], [Exact Failure Mode & Specification Violated], and [Defect Scope: Defect Qty / Total Qty / PPM].
4. Output a polished, concise, executive-level 2-3 sentence paragraph in formal Korean.
5. Return ONLY the problem statement text without any headers, quotes, or markdown."""

            if task == "d2_is_is_not":
                if not system_prompt:
                    system_prompt = """You are an elite semiconductor quality director at RAMOS, specialized in 8D Kepner-Tregoe IS / IS NOT boundary analysis.
Analyze the quality defect claim (Severity, Customer, Product, Part No, Lot No, Incident Site, Symptom, PPM, Line Stop).
DYNAMIC DEPTH RULE:
- If requested count is 6~8 or the issue is Critical / Line Stop, dynamically generate 6 to 8 exhaustive, engineering-grade comparison rows covering:
  1. "제품 / LOT (What - 대상)"
  2. "불량 모드 (What - 결함 특성)"
  3. "공장 / 라인 (Where - 위치)"
  4. "기판 실장 위치 (Where - PCB 위치)"
  5. "발생 시점 (When - 공정 타이밍)"
  6. "작업 환경 (When - 조건/추세)"
  7. "외주 가공 조건 (How - 외주 OSAT SMT 조건)"
  8. "불량률 및 범위 (How Many - 규모/집중도)"

Return strictly a JSON array of objects with keys: "factor", "is", "isNot", "difference", "verificationStatus"."""

            if task == "intake_extract":
                if not system_prompt:
                    system_prompt = (
                        "You are an expert AI quality triage agent for RAMOS semiconductor 8D system. "
                        "Extract all customer defect information from the provided claim document/email into a strictly valid JSON object. "
                        "Fields: customer, customerContact, customerEmail, product, partNumber, internalPartNumber, lotNumber, "
                        "mfgSite, incidentSite, defectQty (integer), inspectQty (integer), lineStop (boolean), safetyRisk (boolean), "
                        "recurrentDefect (boolean), claimTitle, agentReasoning, confidenceScore (0.0 to 1.0), sourceEvidence (object mapping field to quote)."
                    )
                if not prompt:
                    prompt = "Please analyze the attached customer quality claim document/image and extract the requested quality fields as JSON."

            late_stage_contracts = {
                "d5_draft": '{"confirmedFacts":[],"inferences":[],"missingInformation":[],"recommendations":[],"groups":{"candidates":[{"causeType":"Occurrence|Escape|System","title":"","rationale":"","rootCauseElimination":"","feasibility":"","costImpact":"","riskLevel":"","owner":"","due":"","verificationPlan":""}]}}',
                "d6_draft": '{"confirmedFacts":[],"inferences":[],"missingInformation":[],"recommendations":[],"groups":{"validationTests":[{"actionId":"","testName":"","condition":"","acceptanceCriteria":"","owner":"","sampleSize":500,"failQty":0,"result":"PASS"}]}}',
                "d7_draft": '{"confirmedFacts":[],"inferences":[],"missingInformation":[],"recommendations":[],"groups":{"systemUpdates":[{"actionId":"","docName":"","changeContent":"","owner":"","due":"","status":"Completed"}],"horizontalDeployment":[{"actionId":"","product":"","sameRisk":"","action":"","owner":"","status":"Completed"}]}}',
                "d8_draft": '{"confirmedFacts":[],"inferences":[],"missingInformation":[],"recommendations":[],"groups":{"checklist":[{"cat":"Closure","item":"","evidence":"","checked":true}]}}',
            }
            if task in late_stage_contracts:
                system_prompt += (
                    "\nReturn exactly one JSON object matching this task contract. "
                    "Every required group must be an array of objects, even when empty. "
                    "Contract: " + late_stage_contracts[task]
                )

            # Routing decision
            result = None
            if attachments or image_b64 or engine_pref == "gemini" or (engine_pref == "auto" and (image_b64 or task in ("vision", "multimodal", "deep_audit", "intake_extract", "d5_draft", "d6_draft", "d7_draft", "d8_draft"))):
                result = call_gemini(prompt, system_prompt, image_b64, attachments=attachments)
                if not result.get("success") and not image_b64 and not attachments:
                    fallback_result = call_groq(prompt, system_prompt)
                    if fallback_result.get("success"):
                        result = fallback_result
                        result["fallbackFrom"] = "gemini"
            else:
                result = call_groq(prompt, system_prompt)
                if not result.get("success"):
                    fallback_result = call_gemini(prompt, system_prompt, image_b64, attachments=attachments)
                    if fallback_result.get("success"):
                        result = fallback_result
                        result["fallbackFrom"] = "groq"

            # Parse and validate structured AI outputs
            parsed = normalize_structured_output(task, parse_structured_text(result or {}))
            schema_errors = structured_output_errors(task, parsed)
            structured_tasks = {"intake_extract", "d5_draft", "d6_draft", "d7_draft", "d8_draft"}
            if task in structured_tasks and parsed is None:
                schema_errors = ["provider did not return valid JSON"]
            if schema_errors and not image_b64 and not attachments:
                first_engine = result.get("engine") if isinstance(result, dict) else None
                alternate = call_groq(prompt, system_prompt) if first_engine == "gemini" else call_gemini(prompt, system_prompt)
                alternate_parsed = normalize_structured_output(task, parse_structured_text(alternate))
                alternate_errors = structured_output_errors(task, alternate_parsed)
                if task in structured_tasks and alternate_parsed is None:
                    alternate_errors = ["provider did not return valid JSON"]
                if alternate.get("success") and not alternate_errors:
                    alternate["fallbackFrom"] = first_engine or "unknown"
                    result, parsed, schema_errors = alternate, alternate_parsed, []
            if parsed is not None:
                result["parsedJson"] = parsed
            if task in structured_tasks:
                result["schemaValid"] = not schema_errors
                if schema_errors:
                    result["schemaWarning"] = "; ".join(schema_errors[:3])

            request_id = params.get("requestId")
            if isinstance(request_id, str) and len(request_id) <= 100:
                result["requestId"] = request_id

            body = json.dumps(result).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, _format: str, *args: object) -> None:
        return


def local_port_is_open(port: int) -> bool:
    try:
        with socket.create_connection((HOST, port), timeout=0.08):
            pass
    except OSError:
        return False
    return True


def project_server_is_running(port: int) -> bool:
    if not local_port_is_open(port):
        return False
    try:
        with urllib.request.urlopen(
            f"http://{HOST}:{port}{STATUS_PATH}", timeout=0.4
        ) as response:
            return response.read().decode("utf-8") == str(PROJECT_ROOT)
    except Exception:
        return False


def open_portal(port: int) -> None:
    cache_key = int(time.time())
    webbrowser.open(f"http://{HOST}:{port}/?v={cache_key}", new=2)


def main() -> None:
    for port in PORT_RANGE:
        if project_server_is_running(port):
            open_portal(port)
            return

    handler = functools.partial(PortalHandler, directory=str(PROJECT_ROOT))
    server = None
    selected_port = None
    for port in PORT_RANGE:
        if local_port_is_open(port):
            continue
        try:
            server = ThreadingHTTPServer((HOST, port), handler)
            selected_port = port
            break
        except OSError:
            continue

    if server is None or selected_port is None:
        raise RuntimeError("No local portal port is available (8765-8775).")

    threading.Thread(target=open_portal, args=(selected_port,), daemon=True).start()
    server.serve_forever()


if __name__ == "__main__":
    main()
