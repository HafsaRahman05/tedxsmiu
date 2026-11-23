"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const inputClassName =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
const labelClassName =
  "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating) {
      setStatus("error");
      setFeedback("Pick a rating from 1 to 5.");
      return;
    }
    setStatus("loading");
    setFeedback("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          rating,
          message,
          website: String(formData.get("website") || ""),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "The review could not be sent.");
      }

      setStatus("done");
      setFeedback("Thanks! Your review will appear once the team approves it.");
      setName("");
      setEmail("");
      setRating(0);
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "The review could not be sent.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className={labelClassName}>Name</span>
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
          <span className={labelClassName}>Email (not shown publicly)</span>
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

      <fieldset className="space-y-2">
        <legend className={labelClassName}>Rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                className="peer sr-only"
              />
              <span className="sr-only">{value} star{value > 1 ? "s" : ""}</span>
              <Star
                aria-hidden="true"
                className={`h-7 w-7 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary ${
                  value <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className={labelClassName}>Your review</span>
        <textarea
          required
          minLength={10}
          maxLength={2000}
          rows={5}
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
          {status === "loading" ? "Sending" : "Submit review"}
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
