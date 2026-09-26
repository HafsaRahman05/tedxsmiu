"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Talk } from "@/types";

export default function TalksCarousel() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/talks")
      .then((r) => r.json())
      .then((d) => setTalks(d.talks))
      .catch(() => setTalks([]))
      .finally(() => setLoading(false));
  }, []);

  const cardWidth = 320; // px
  const gap = 24;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, talks.length - 1));
    setIndex(clamped);
  };

  return (
    <section id="talks" className="border-b border-line bg-surface px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="mt-3 font-helvetica text-4xl font-black uppercase text-paper sm:text-5xl">
              Watch &amp; Rewatch
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous talk"
              className="flex h-11 w-11 items-center justify-center border border-line bg-ink text-paper transition-colors hover:border-red hover:text-red disabled:opacity-30 disabled:hover:border-line disabled:hover:text-paper"
            >
              ←
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index >= talks.length - 1}
              aria-label="Next talk"
              className="flex h-11 w-11 items-center justify-center border border-line bg-ink text-paper transition-colors hover:border-red hover:text-red disabled:opacity-30 disabled:hover:border-line disabled:hover:text-paper"
            >
              →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 w-80 shrink-0 animate-pulse border border-line bg-ink"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex gap-6"
              drag="x"
              dragConstraints={{
                left: -((cardWidth + gap) * (talks.length - 1)),
                right: 0,
              }}
              animate={{ x: -(cardWidth + gap) * index }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onDragEnd={(_: any, info: any) => {
                if (info.offset.x < -80) goTo(index + 1);
                else if (info.offset.x > 80) goTo(index - 1);
              }}
            >
              {talks.map((talk) => (
                <div
                  key={talk.id}
                  className="w-80 shrink-0 select-none overflow-hidden border border-line bg-ink"
                >
                  <div
                    className="flex aspect-[4/3] items-end p-5"
                    style={{ background: talk.gradient }}
                  >
                    <span className="border border-line/40 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper backdrop-blur">
                      {talk.duration}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mt-2 font-helvetica text-lg font-bold text-paper leading-tight">
                      {talk.title}
                    </h3>
                    <p className="mt-2 font-helvetica text-xs text-paper-dim">
                      {talk.speaker}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}