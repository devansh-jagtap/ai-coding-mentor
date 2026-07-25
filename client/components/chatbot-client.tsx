"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RotateCcw, Send, Terminal } from "lucide-react";
import { ChatMessage, getProgress, resetChat, sendMessage } from "@/lib/api";

const starterPrompts = [
  "Teach me Python variables with a tiny exercise",
  "Help me debug this code step by step",
  "What should I learn before building AI agents?",
];

export default function ChatbotClient({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [progress, setProgress] = useState("Loading saved progress...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProgress()
      .then((data) => {
        setMessages(data.history);
        setProgress(data.summary);
      })
      .catch(() => {
        setProgress("Backend is not connected yet. Start the Python API on port 8000.");
      });
  }, []);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  async function submitMessage(event?: FormEvent<HTMLFormElement>, override?: string) {
    event?.preventDefault();

    const text = (override ?? input).trim();
    if (!text || isLoading) return;

    setError("");
    setInput("");
    setIsLoading(true);
    setMessages((current) => [...current, { role: "user", text }]);

    try {
      const response = await sendMessage(text);
      setMessages((current) => [...current, { role: "assistant", text: response.answer }]);
      const nextProgress = await getProgress();
      setProgress(nextProgress.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the backend.");
    } finally {
      setIsLoading(false);
    }
  }

  async function clearChat() {
    await resetChat();
    setMessages([]);
    const nextProgress = await getProgress();
    setProgress(nextProgress.summary);
  }

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#211f1d]">
      <header className="border-b border-black/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-black/70">
            <ArrowLeft className="h-4 w-4" />
            Landing
          </Link>
          <button
            type="button"
            onClick={clearChat}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-medium text-black/70 shadow-sm hover:bg-black/[0.03]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="space-y-4">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-black/70">
              <Terminal className="h-4 w-4" />
              Mentor Progress
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-[#211f1d] p-4 text-xs leading-6 text-[#f8f3e7]">
              {progress}
            </pre>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-black/70">Try a starter prompt</p>
            <div className="mt-3 space-y-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitMessage(undefined, prompt)}
                  className="w-full rounded-md border border-black/10 bg-[#f6f2ea] px-3 py-2 text-left text-sm text-black/70 hover:bg-[#eee6d8]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="flex min-h-[calc(100vh-8rem)] flex-col rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-4">
            <h1 className="text-xl font-semibold">AI Coding Mentor</h1>
            <p className="mt-1 text-sm text-black/55">
              Connected to the Python mentor backend with saved local memory.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-72 items-center justify-center text-center">
                <div>
                  <p className="text-lg font-semibold text-black/75">Start with one coding question.</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-black/50">
                    The backend will save the conversation and use it to continue your learning path.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[min(760px,90%)] rounded-lg px-4 py-3 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-[#211f1d] text-white"
                        : "border border-black/10 bg-[#f8f5ee] text-black/75"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-black/50">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mentor is thinking...
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={submitMessage} className="border-t border-black/10 p-4">
            <div className="flex gap-3 rounded-lg border border-black/10 bg-[#f8f5ee] p-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Python, AI agents, FastAPI, debugging..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-black/35"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#256f5a] text-white disabled:cursor-not-allowed disabled:bg-black/20"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
