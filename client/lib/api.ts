export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  created_at?: string;
};

export type ProgressResponse = {
  summary: string;
  topics: string[];
  history: ChatMessage[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/mentor${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.detail ?? errorBody.error ?? message;
    } catch {
      // Keep the status message when the response is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getProgress() {
  return request<ProgressResponse>("/progress");
}

export function sendMessage(message: string) {
  return request<{ answer: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export function resetChat() {
  return request<{ status: string }>("/reset-chat", {
    method: "POST",
  });
}
