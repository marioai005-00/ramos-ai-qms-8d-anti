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


PROJECT_ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT_RANGE = range(8765, 8776)
STATUS_PATH = "/__portal_status__"


class PortalHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802 - inherited HTTP handler API
        if self.path.split("?", 1)[0] == STATUS_PATH:
            payload = str(PROJECT_ROOT).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

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
