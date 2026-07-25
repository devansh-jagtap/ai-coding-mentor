import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = `${PYTHON_API_URL}/${path.join("/")}`;
  const body = request.method === "GET" ? undefined : await request.text();

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("Content-Type") ?? "application/json",
      },
      body,
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Python backend is not reachable",
        detail: `Start the backend with: .\\.venv\\Scripts\\python.exe api.py`,
        target: targetUrl,
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
