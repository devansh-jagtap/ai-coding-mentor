import os

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


if load_dotenv:
    load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
MAX_HISTORY_MESSAGES = int(os.getenv("MAX_HISTORY_MESSAGES", "12"))


def require_api_key() -> str:
    if not API_KEY:
        raise RuntimeError(
            "Missing GEMINI_API_KEY. Add it to your .env file before starting the mentor."
        )

    return API_KEY
