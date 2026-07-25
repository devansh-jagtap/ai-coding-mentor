import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

from mentor_ai.memory import TOPICS, get_history, get_progress_summary, reset_history
from mentor_ai.mentor import ask_ai


HOST = "127.0.0.1"
PORT = 8000
ALLOWED_ORIGINS = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}


class MentorApiHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/health":
            self.send_json({"status": "ok", "service": "AI Coding Mentor API"})
        elif path == "/progress":
            self.send_json(
                {
                    "summary": get_progress_summary(),
                    "topics": TOPICS,
                    "history": get_history()[-8:],
                }
            )
        else:
            self.send_json({"error": "Not found"}, status=404)

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/chat":
            data = self.read_json()
            message = str(data.get("message", "")).strip()

            if not message:
                self.send_json({"error": "Message is required"}, status=400)
                return

            self.send_json({"answer": ask_ai(message)})
        elif path == "/reset-chat":
            reset_history()
            self.send_json({"status": "ok"})
        else:
            self.send_json({"error": "Not found"}, status=404)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}

        raw_body = self.rfile.read(length).decode("utf-8")
        return json.loads(raw_body)

    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")

        self.send_response(status)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_cors_headers(self):
        origin = self.headers.get("Origin")
        allowed_origin = origin if origin in ALLOWED_ORIGINS else "http://localhost:3000"

        self.send_header("Access-Control-Allow-Origin", allowed_origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, format, *args):
        return


def run():
    server = HTTPServer((HOST, PORT), MentorApiHandler)
    print(f"AI Coding Mentor API running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
