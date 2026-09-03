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
import urllib.error

PROJECT_ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT_RANGE = range(8765, 8776)
STATUS_PATH = "/__portal_status__"
AI_STATUS_PATH = "/__api__/ai/status"
AI_DISPATCH_PATH = "/__api__/ai/dispatch"


def load_env() -> dict[str, str]:
    env_file = PROJECT_ROOT / ".env"
    env_vars: dict[str, str] = {}
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env_vars[k.strip()] = v.strip()
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
        "max_tokens": 1024
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
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode("utf-8"))
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


def call_gemini(prompt: str, system_prompt: str = "", image_base64: str = "", model: str = "") -> dict[str, object]:
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

    payload = json.dumps({
        "contents": [{"parts": parts}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 2048}
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
            with urllib.request.urlopen(req, timeout=12) as res:
                data = json.loads(res.read().decode("utf-8"))
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
    def do_GET(self) -> None:  # noqa: N802 - inherited HTTP handler API
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
                "gemini": {"available": gemini_ready, "recommendedFor": "Multimodal vision, PDF/document parsing, deep FA inspection"},
                "activeEngines": [e for e, ok in [("groq", groq_ready), ("gemini", gemini_ready)] if ok]
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
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self) -> None:  # noqa: N802
        clean_path = self.path.split("?", 1)[0]
        if clean_path == AI_DISPATCH_PATH:
            content_len = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
            try:
                params = json.loads(raw_body)
            except Exception:
                params = {}

            prompt = params.get("prompt", "").strip()
            system_prompt = params.get("systemPrompt", "").strip()
            task = params.get("task", "quick_draft")
            engine_pref = params.get("engine", "auto")
            image_b64 = params.get("imageBase64", "")

            if task == "d2_is_is_not":
                if not system_prompt:
                    system_prompt = """You are an elite semiconductor/electronics quality engineering specialist at RAMOS, specialized in 8D Kepner-Tregoe IS / IS NOT problem boundary analysis.
Analyze the provided quality defect claim (Customer, Product, Part No, Lot No, Incident Line, Symptom, PPM) and produce an exact, engineering-grade 4-row comparison matrix.
Return ONLY a valid JSON array containing exactly 4 objects with keys "factor", "is", "isNot", "difference".
Do NOT use vague placeholders like '[확인 필요]'. Provide concrete, realistic technical engineering contrasts:
1. factor: "제품 / LOT (What)"
   - is: Affected product, part number, and failing Lot number.
   - isNot: Adjacent lots or identical models that did NOT fail (e.g. 직전 정상 출하 Lot #EM2608-DTV00 또는 동일 라인 동시 실장 타 DateCode 로트).
   - difference: Key manufacturing/raw material differences (e.g. 특정 Wafer Inked NAND Die 패키징 공정 차이 및 패키지 실장 DateCode 국한).
2. factor: "발생 위치 (Where)"
   - is: Specific customer factory, line and station (e.g. LGE 평택 DTV Main Board SMT 3라인 Reflow 후 검사기).
   - isNot: Comparable lines or locations that did NOT fail (e.g. 동일 평택 1, 2라인 및 구미 DTV 실장 라인 동일 모델 투입분).
   - difference: Specific equipment/process profile difference (e.g. 3라인 Reflow 8-Zone Peak 온도 편차 248℃ vs 타라인 242℃ 조건 차이).
3. factor: "시점 / 공정 조건 (When)"
   - is: Specific operational timing (e.g. SMT 리플로우 직후 U-Boot Cold Boot 통전 검사 시점).
   - isNot: Non-failing operational timing (e.g. SMT 리플로우 전 입고 수입검사(IQC) 단계 및 상온 장시간 방치 후 재부팅 시).
   - difference: Thermal/mechanical stress conditions (e.g. Lead-Free 260℃ 납땜 열응력 직후 솔더볼 팽창 및 내부 단락 유발 조건).
4. factor: "불량 현상 (How Much)"
   - is: Exact electrical failure mode (e.g. Boot CID Read Timeout 및 VCC-VSS 전원-접지간 저저항 Short 0.8Ω).
   - isNot: Other similar failure modes NOT observed (e.g. Data I/O 파형 불량, Firmware 손상, 또는 간헐적 재부팅 현상).
   - difference: Electrical signature differences (e.g. 전원단 완전 단락으로 인한 대전류 유입 및 VCC 강하 현상에 한정됨).
Always write all JSON field values in natural, professional Korean (한국어로 작성할 것). Ensure output is strictly valid JSON with no markdown wrapping."""

            if task == "triage_rationale":
                if not system_prompt:
                    system_prompt = """You are sjkim (Master QA / Senior Pro of Quality Innovation Team) at RAMOS.
Write a highly professional, rigorous Quality Review Opinion & 8D Issuance Rationale in Korean.
Format your response in 4 clear, numbered bullet points with titles:
1. [고객사 생산라인 영향 및 긴급도 평가]: Evaluate customer line impact (e.g. Line Stop risk at LGE DTV SMT line).
2. [불량률(PPM) 및 정식 8D 발행 타당성]: Justify formal 8D issuance based on PPM and severity.
3. [초동 조치(D3) 및 출하/WIP 락 지시]: Direct immediate 24h containment actions (ERP FG shipment lock, MES WIP quarantine).
4. [주관부서 핵심 원인분석 방향]: Direct engineering/FA investigation focus (Flash 개발실, Decap, CS SEM, C102 MLCC, Inked NAND margin).
Maintain an authoritative, precise tone fitting a senior automotive/semiconductor Master QA expert."""

            if task == "intake_extract":
                if not system_prompt:
                    system_prompt = (
                        "You are the RAMOS AI-QMS Intake Triage Agent specialized in semiconductor/electronics quality management.\n"
                        'Extract quality claim metadata from customer documents (emails, notices, photos).\n'
                        'Return ONLY a valid JSON object matching this schema:\n'
                        '{\n'
                        '  "customer": "Customer company name (e.g. LGE, LG Electronics)",\n'
                        '  "customerContact": "Customer contact person name and title",\n'
                        '  "customerEmail": "Customer email if available",\n'
                        '  "product": "Product name and model (e.g. eMMC 5.1 64GB, PCIe Gen4 SSD)",\n'
                        '  "partNumber": "Part number",\n'
                        '  "lotNumber": "Lot number",\n'
                        '  "mfgSite": "Manufacturing site (e.g. RAMOS 오창 1공장)",\n'
                        '  "incidentSite": "Incident location / customer factory",\n'
                        '  "defectQty": defect quantity as integer,\n'
                        '  "inspectQty": total inspection or input quantity as integer,\n'
                        '  "claimTitle": "Detailed failure symptom and claim description",\n'
                        '  "lineStop": true or false,\n'
                        '  "safetyRisk": true or false,\n'
                        '  "recurrentDefect": true or false,\n'
                        '  "confidenceScore": confidence between 0.80 and 0.99,\n'
                        '  "agentReasoning": "Brief 1-line explanation of key defect clues detected"\n'
                        "}"
                    )
                if not prompt:
                    prompt = "Please analyze the attached customer quality claim document/image and extract all 14 quality fields as JSON."

            # Routing decision
            result = None
            if engine_pref == "gemini" or (engine_pref == "auto" and (image_b64 or task in ("vision", "multimodal", "deep_audit", "intake_extract"))):
                result = call_gemini(prompt, system_prompt, image_b64)
                if not result.get("success") and not image_b64:
                    # Fallback to groq if gemini fails and no image is involved
                    fallback_result = call_groq(prompt, system_prompt)
                    if fallback_result.get("success"):
                        result = fallback_result
                        result["fallbackFrom"] = "gemini"
            else:
                result = call_groq(prompt, system_prompt)
                if not result.get("success"):
                    # Fallback to gemini if groq fails
                    fallback_result = call_gemini(prompt, system_prompt, image_b64)
                    if fallback_result.get("success"):
                        result = fallback_result
                        result["fallbackFrom"] = "groq"

            # Parse JSON if output is structured
            if result and result.get("success") and isinstance(result.get("text"), str):
                raw_text = result["text"].strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                elif raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                raw_text = raw_text.strip()

                try:
                    parsed = json.loads(raw_text)
                    result["parsedJson"] = parsed
                except Exception:
                    pass

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

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, _format: str, *args: object) -> None:
        return


def project_server_is_running(port: int) -> bool:
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
        try:
            server = ThreadingHTTPServer((HOST, port), handler)
            selected_port = port
            break
        except OSError:
            continue

    if server is None or selected_port is None:
        raise RuntimeError("No local portal port is available (8765-8775).")

    open_portal(selected_port)
    server.serve_forever()


if __name__ == "__main__":
    main()
