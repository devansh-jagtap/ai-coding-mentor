"use client";

import { FormEvent, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Play,
  Send,
  Sparkles,
} from "lucide-react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

const roadmap = [
  "Python foundations",
  "Debugging practice",
  "Prompt engineering",
  "AI agents",
  "FastAPI backend",
  "Full-stack projects",
];

const backendSteps = [
  "Next.js sends your message to the Python API.",
  "FastAPI calls the mentor engine and saves memory.",
  "The UI receives the answer and refreshes progress.",
];

function Button({ children, href, variant = "primary" }: ButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-[#1f6f5b] text-white hover:bg-[#195a4b]"
      : "border border-black/12 bg-white text-[#262421] hover:bg-black/[0.03]";

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold shadow-sm transition-colors ${classes}`}
    >
      {children}
    </Link>
  );
}

function PromptLauncher() {
  const [prompt, setPrompt] = useState("Teach me Python functions like I am a beginner");

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = `/chatbot?prompt=${encodeURIComponent(prompt)}`;
  }

  return (
    <form onSubmit={submitPrompt} className="mt-6 rounded-lg border border-black/10 bg-white p-3 shadow-sm">
      <label htmlFor="mentor-prompt" className="sr-only">
        Mentor prompt
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="mentor-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-md border border-black/10 bg-[#f8faf9] px-3 text-sm text-[#262421] outline-none focus:border-[#1f6f5b]"
          placeholder="Ask the mentor what you want to learn"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#262421] px-4 text-sm font-semibold text-white hover:bg-black"
        >
          <Send className="h-4 w-4" />
          Ask
        </button>
      </div>
    </form>
  );
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-[#111827] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Bot className="h-4 w-4 text-[#7dd3b8]" />
          Mentor session
        </div>
        <div className="rounded-md bg-[#7dd3b8]/12 px-2 py-1 text-xs font-medium text-[#bdf4df]">
          memory on
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4 p-5">
          <div className="max-w-[82%] rounded-lg bg-white/10 px-4 py-3 text-sm leading-6 text-white/86">
            What should I learn first for AI coding?
          </div>
          <div className="ml-auto max-w-[88%] rounded-lg bg-[#f7f4ed] px-4 py-3 text-sm leading-6 text-[#24211f]">
            Start with Python variables, functions, lists, and debugging. Then build a tiny CLI app before moving to APIs.
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-white/45">
              <Code2 className="h-4 w-4" />
              Mini challenge
            </div>
            <pre className="mt-3 overflow-x-auto text-sm leading-6 text-[#bdf4df]">
              <code>{`def greet(name):\n    return f"Hello, {name}"`}</code>
            </pre>
          </div>
        </div>

        <aside className="border-t border-white/10 bg-white/[0.03] p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase text-white/40">Progress</p>
          <div className="mt-4 space-y-3">
            {["Python foundations", "Prompt engineering", "FastAPI"].map((item, index) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/72">
                <CheckCircle2 className={`h-4 w-4 ${index === 0 ? "text-[#7dd3b8]" : "text-white/25"}`} />
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8f5f1] text-[#1f6f5b]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#262421]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-black/58">{description}</p>
    </article>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#262421]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f7f4ed]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#262421] text-white">
              <Bot className="h-5 w-5" />
            </span>
            AI Coding Mentor
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-black/58 md:flex">
            <a href="#roadmap" className="hover:text-black">
              Roadmap
            </a>
            <a href="#backend" className="hover:text-black">
              Backend
            </a>
            <a href="#features" className="hover:text-black">
              Features
            </a>
          </nav>

          <Button href="/chatbot" variant="secondary">
            Open Chat
          </Button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/62 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#1f6f5b]" />
            Python backend plus Next.js frontend
          </div>

          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] text-[#24211f] sm:text-6xl lg:text-7xl">
            Learn coding with a mentor that remembers your progress.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-black/62 sm:text-lg">
            Ask questions, practice Python and AI concepts, track completed topics, and continue from your saved learning history.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/chatbot">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#backend" variant="secondary">
              See Connection
              <GitBranch className="h-4 w-4" />
            </Button>
          </div>

          <PromptLauncher />
        </div>

        <ProductPreview />
      </section>

      <section id="roadmap" className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1f6f5b]">Roadmap</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#24211f]">A practical path from basics to AI apps.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-black/58">
              The mentor uses this path as context, but it adapts to the question you ask right now.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f8faf9] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#262421] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-black/72">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="backend" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1f6f5b]">Connection</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#24211f]">How the frontend talks to Python.</h2>
            <p className="mt-4 text-sm leading-7 text-black/60">
              For now, Next.js calls a FastAPI server running locally. Later we can refine authentication, streaming responses, database storage, and deployment.
            </p>
          </div>

          <div className="grid gap-3">
            {backendSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e8f5f1] text-sm font-semibold text-[#1f6f5b]">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-black/68">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-black/10 bg-[#eef4f1]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Feature
              icon={<BookOpenCheck className="h-5 w-5" />}
              title="Persistent learning"
              description="Saved chat history and active topics help the mentor continue instead of starting over."
            />
            <Feature
              icon={<Database className="h-5 w-5" />}
              title="Python memory layer"
              description="The backend owns conversation memory today, and can later move to SQLite or Postgres."
            />
            <Feature
              icon={<Play className="h-5 w-5" />}
              title="Ready to use"
              description="Start both servers locally and the Next.js chat screen will call the Python mentor API."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
