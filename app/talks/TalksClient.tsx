"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import type { Talk } from "@/types";

export default function TalksClient() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/talks")
      .then((r) => r.json())
      .then((d) => setTalks(d.talks))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(talks.map((t) => t.category));
    return ["All", ...Array.from(set)];
  }, [talks]);

  const filtered =
    filter === "All" ? talks : talks.filter((t) => t.category === filter);

  return (
    <PageShell>
      <PageHero
        title="Talks"
        description="Every talk from past events, in one archive. Filter by topic and settle in."
        gradient="linear-gradient(135deg, #0a0a0a, #1a0205, #000000)"
      />

      <section className="border-b border-white/10 bg-black px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-none border px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  filter === c
                    ? "border-[#EB0028] bg-[#EB0028] text-white"
                    : "border-white/10 bg-black text-neutral-400 hover:border-[#EB0028] hover:text-[#EB0028]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] animate-pulse rounded-none border border-white/10 bg-white/[0.04]"
                  />
                ))
              : filtered.map((t, i) => (
                  <motion.article
                    key={t.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                    className="group overflow-hidden rounded-none border border-white/10 bg-white/[0.02]"
                  >
                    <div
                      className="relative flex aspect-video items-end p-5 transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ background: t.gradient }}
                    >
                      <span className="rounded-none border border-white/10 bg-black/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                        {t.duration}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-14 w-14 items-center justify-center rounded-none border border-white/30 bg-black/60 backdrop-blur transition-transform group-hover:scale-110">
                          <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white" />
                        </span>
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="mt-2 font-display text-lg font-black uppercase leading-tight text-white">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-400">
                        {t.summary}
                      </p>
                      <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                        {t.speaker}
                      </p>
                    </div>
                  </motion.article>
                ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
