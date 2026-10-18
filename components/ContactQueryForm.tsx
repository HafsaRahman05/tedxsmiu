"use client";

import { useState } from "react";

const inputClassName =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export default function ContactQueryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: String(formData.get("website") || ""),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "The message could not be sent.");
      }

      setStatus("done");
      setFeedback("Your message is on its way to the organizing team.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "The message could not be sent.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Name
          </span>
          <input
            required
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className={inputClassName}
          />
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </span>
          <input
            required
            type="email"
            maxLength={200}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Subject
        </span>
        <input
          required
          minLength={4}
          maxLength={160}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Message
        </span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${inputClassName} resize-y`}
        />
      </label>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="border border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-transparent hover:text-primary disabled:opacity-60"
        >
          {status === "loading" ? "Sending" : "Send query"}
        </button>
        {feedback && (
          <p
            role="status"
            className={`font-mono text-[11px] uppercase tracking-[0.08em] ${
              status === "error" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
}
