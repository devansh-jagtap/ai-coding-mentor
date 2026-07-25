# AI Coding Mentor

A Python and Next.js AI mentor that teaches coding step by step with persistent chat memory, progress tracking, and a structured learning roadmap.

## Project Structure

```text
AI-Coding_Mentor/
  api.py                  # Local Python HTTP API for the frontend
  app.py                  # CLI entry point
  client/                 # Next.js frontend
  mentor_ai/
    config.py             # Environment and model settings
    memory.py             # Persistent chat and progress helpers
    mentor.py             # Gemini client and mentor response flow
    prompts.py            # Mentor teaching instructions
  memory.json             # Local conversation history
  requirements.txt        # Python dependencies
  .env.example            # Example environment variables
```

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env`.
4. Add your Gemini API key to `.env`:

```text
GEMINI_API_KEY=your_api_key_here
```

## Run

Start the Python backend:

```powershell
.\.venv\Scripts\python.exe api.py
```

Then start the Next.js frontend in another terminal:

```powershell
cd client
npm.cmd run dev
```

Open `http://localhost:3000`.

You can still run the CLI version:

```powershell
python app.py
```

Type `exit` or `quit` to end the session.

## Frontend to Backend Connection

For now, the app uses a simple local Python HTTP server with no extra backend framework:

```text
Browser
  calls Next.js /api/mentor/*
Next.js API proxy
  calls PYTHON_API_URL, default http://127.0.0.1:8000
Python api.py
  exposes /health, /progress, /chat, /reset-chat
mentor_ai package
  calls Gemini and writes persistent memory to memory.json
```

Later, `api.py` can be upgraded to FastAPI without changing the mentor engine.

See `docs/connection.md` for the full connection flow and test commands.

## Test

```powershell
python -m unittest discover -s tests
```

## Commands

```text
/help                 Show commands
/topics               Show the learning roadmap
/progress             Show saved progress
/history              Show recent saved messages
/topic <name/number>  Set the active topic
/done                 Mark the active topic as completed
/reset-chat           Clear chat history only
/reset-all            Clear chat history and progress
```

## What Is Persistent

The app saves local learning state in `memory.json`:

- recent conversation messages
- active topic
- completed topics
- basic student profile fields

The mentor only sends the most recent messages to the model by default, controlled by `MAX_HISTORY_MESSAGES`, so old conversations stay saved without making every request too large.

## Suggested Next Features

- Upgrade `api.py` to FastAPI when dependency installation is available.
- Add streaming responses for the chat screen.
- Move memory from `memory.json` to SQLite or Postgres.
