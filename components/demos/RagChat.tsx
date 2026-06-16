"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Quels sont les projets d'Axel ?",
  "Parle-moi de RISE",
  "Quelles sont ses compétences en IA ?",
  "Où en est son alternance ?",
];

export default function RagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/demo/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.status === 429) {
        setError(
          "Limite atteinte — la démo est protégée contre les abus. Réessaie dans une heure."
        );
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");

      const { answer } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="flex flex-col h-[560px] rounded-xl border border-border bg-surface overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange/10 border border-orange/20 flex items-center justify-center text-xl">
              💬
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                Pose-moi une question sur Axel
              </p>
              <p className="text-sm text-muted">
                Projets, compétences, parcours — je réponds en temps réel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:border-orange/40 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-orange text-white rounded-br-sm"
                  : "bg-border text-text rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-border rounded-xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-900/40 text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border flex gap-2 bg-bg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Quelles sont ses compétences en IA ?"
          className="flex-1 bg-surface rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted border border-border focus:outline-none focus:border-orange/60 transition-colors"
          disabled={loading}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-lg bg-orange text-white text-sm font-medium disabled:opacity-40 hover:bg-orange/90 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          →
        </button>
      </form>
    </div>
  );
}
