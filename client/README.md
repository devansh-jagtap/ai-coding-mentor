# AI Coding Mentor Frontend

Next.js frontend for the AI Coding Mentor. The browser calls Next.js API routes, then Next.js forwards those requests to the local Python backend at `http://127.0.0.1:8000` by default.

## Setup

Create `.env.local` if you want to override the backend URL:

```text
PYTHON_API_URL=http://127.0.0.1:8000
```

## Run

Start the Python backend from the project root:

```powershell
.\.venv\Scripts\python.exe api.py
```

Then start this frontend:

```powershell
npm.cmd run dev
```

Open `http://localhost:3000`.

## Pages

- `/` polished landing page
- `/chatbot` connected chat interface

## Backend Endpoints

- `GET /health`
- `GET /progress`
- `POST /chat`
- `POST /reset-chat`
