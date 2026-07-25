# Frontend and Backend Connection

The app has three layers:

```text
Browser
  -> Next.js frontend
  -> Next.js API proxy
  -> Python backend
  -> Gemini mentor engine
  -> memory.json
```

## 1. Browser to Next.js

The chat UI lives in:

```text
client/components/chatbot-client.tsx
```

When the user sends a message, it calls:

```text
client/lib/api.ts
```

That file sends requests to relative URLs like:

```text
/api/mentor/chat
/api/mentor/progress
```

This is important because the browser talks to the same Next.js app instead of calling Python directly.

## 2. Next.js to Python

The Next.js proxy route lives here:

```text
client/app/api/mentor/[...path]/route.ts
```

It receives browser requests and forwards them to:

```text
http://127.0.0.1:8000
```

You can override that with:

```text
PYTHON_API_URL=http://127.0.0.1:8000
```

## 3. Python API to Mentor Engine

The Python API lives here:

```text
api.py
```

It exposes:

```text
GET  /health
GET  /progress
POST /chat
POST /reset-chat
```

For `/chat`, Python calls:

```text
mentor_ai/mentor.py
```

That file builds the prompt, sends the message to Gemini, and saves successful chat history in `memory.json`.

## How to Run

Terminal 1:

```powershell
.\.venv\Scripts\python.exe api.py
```

Terminal 2:

```powershell
cd client
npm.cmd run dev
```

Open:

```text
http://localhost:3000/chatbot
```

## How to Test the Connection

Test Python directly:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Test Python through Next.js:

```powershell
Invoke-RestMethod http://localhost:3000/api/mentor/health
```

If both return `ok`, the frontend and backend are connected.

If chat still fails after that, the issue is likely the Gemini API key, model name, or network access from Python to Gemini.
