# AI Coding Mentor

A command-line AI mentor that teaches coding and AI step by step with persistent chat memory, progress tracking, and a structured learning roadmap.

## Project Structure

```text
AI-Coding_Mentor/
  app.py                  # CLI entry point
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

```powershell
python app.py
```

Type `exit` or `quit` to end the session.

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

- Add tests for memory migration and command behavior.
- Add a FastAPI backend when you are ready to turn this into a web app.
- Add a simple frontend chat UI.
