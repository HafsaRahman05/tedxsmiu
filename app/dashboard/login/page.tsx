"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={submit}
      className="w-full max-w-sm rounded-none border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
    >
      <h1 className="mt-3 font-display text-3xl font-black uppercase text-white">
        Sign In
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-none border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#EB0028]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-none border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#EB0028]"
          />
        </label>

        {error && (
          <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#EB0028]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-none bg-[#EB0028] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block font-mono text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 transition-colors hover:text-[#EB0028]"
      >
        ← Back to site
      </Link>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#EB0028]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-10 bottom-1/4 h-80 w-80 rounded-full bg-[#EB0028]/5 blur-[140px]" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}