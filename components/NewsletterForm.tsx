"use client";

import { useState } from "react";

type Props = {
  variant?: "row" | "stack";
  placeholder?: string;
};

export default function NewsletterForm({
  variant = "row",
  placeholder = "you@smiu.edu.pk",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus("done");
      setMessage("You're on the list.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`flex gap-3 ${
        variant === "row" ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-line bg-ink px-5 py-3 font-helvetica text-sm text-paper outline-none placeholder:text-paper-dim focus:border-red transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 border border-red bg-red px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-paper transition-all hover:bg-transparent hover:text-red disabled:opacity-60"
      >
        {status === "loading"
          ? "Sending…"
          : status === "done"
            ? "Subscribed ✓"
            : "Subscribe"}
      </button>
      {message && (
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.1em] ${
            status === "error" ? "text-red" : "text-paper-dim"
          } sm:self-center`}
        >
          {message}
        </p>
      )}
    </form>
  );
}