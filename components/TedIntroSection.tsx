"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TedIntroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-ink px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
      {/* Background Image of SMIU Main Building */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/hero/smiu-main-building.jpg"
          alt="SMIU Main Building"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30 brightness-90 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-8 sm:mb-12 md:mb-16">
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
            The Foundation &amp; Movement
          </span>
          <h2 className="mt-2 sm:mt-3 font-helvetica text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.92]">
            WHAT IS <br />
            <span className="text-primary">TED &amp; TEDx?</span>
          </h2>
        </div>

        {/* Two-Column Explainer Grid */}
        <div className="grid gap-5 sm:gap-8 grid-cols-1 md:grid-cols-2">
          
          {/* Left Column - TED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between border border-white/15 bg-black/80 p-5 sm:p-8 lg:p-10 backdrop-blur-md transition-colors hover:border-primary/50"
          >
            <div>
              <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 sm:mb-6">
                Global Foundation
              </p>
              <h3 className="font-helvetica text-2xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight">
                TED
              </h3>
              <p className="mt-3 sm:mt-4 font-helvetica text-xs sm:text-sm md:text-base leading-relaxed text-neutral-300 font-normal">
                TED is a global non-profit organization devoted to Ideas Worth Spreading. Beginning as a 4-day conference in California, TED has grown to support world-changing ideas through global conferences, TED.com, and various initiatives.
              </p>
            </div>
            <a
              href="https://www.ted.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary underline decoration-primary underline-offset-8 transition-colors hover:text-white hover:decoration-white"
            >
              Visit Official TED Website →
            </a>
          </motion.div>

          {/* Right Column - TEDx */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-between border border-white/15 bg-black/80 p-5 sm:p-8 lg:p-10 backdrop-blur-md transition-colors hover:border-primary/50"
          >
            <div>
              <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 sm:mb-6">
                Local Movement
              </p>
              <h3 className="font-helvetica text-2xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight">
                TEDx
              </h3>
              <p className="mt-3 sm:mt-4 font-helvetica text-xs sm:text-sm md:text-base leading-relaxed text-neutral-300 font-normal">
                In the spirit of ideas worth spreading, TED created TEDx — a program of local, self-organized events. At TEDxSMIU, live local speakers and recorded talks combine to spark deep discussion right here on campus.
              </p>
            </div>
            <a
              href="https://www.ted.com/tedx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary underline decoration-primary underline-offset-8 transition-colors hover:text-white hover:decoration-white"
            >
              Visit Official TEDx Program →
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
