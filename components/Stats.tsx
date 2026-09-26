"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "06", label: "Flagship Editions", sub: "Since Inception" },
  { value: "38", label: "Visionaries Hosted", sub: "Global & Local Thinkers" },
  { value: "4.2K", label: "Community Delegates", sub: "In-Person Audience" },
  { value: "1.1M+", label: "Talk Views", sub: "Global Reach via TED.com" },
];

export default function Stats() {
  return (
    <section id="impact" className="relative border-b border-white/10 bg-ink px-6 py-20 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Telemetry &amp; Reach
            </span>
            <h3 className="mt-2 font-helvetica text-2xl sm:text-3xl font-black uppercase text-white">
              Institutional Scale
            </h3>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            Official Licensed Impact Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/10 bg-surface p-6 sm:p-8 transition-colors hover:border-primary/50 group"
            >
              <span className="font-mono text-[10px] font-bold text-neutral-400 block pb-2">
                0{i + 1} // METRIC
              </span>
              <div className="font-helvetica text-4xl sm:text-5xl lg:text-6xl font-black text-white group-hover:text-primary transition-colors tracking-tight">
                {s.value}
              </div>
              <div className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-200">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-[10px] text-neutral-400">
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}