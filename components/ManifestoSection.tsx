"use client";

import Link from "next/link";

const PILLARS = [
  {
    index: "01",
    tag: "Literature & Culture",
    title: "Poetic Thought & Cultural Reimagination",
    desc: "How philosophical inquiry, Urdu literature, and vernacular craft challenge dogmatic conventions and awaken cultural confidence.",
  },
  {
    index: "02",
    tag: "Medicine & Health",
    title: "Medical Innovation & Humanitarian Impact",
    desc: "From reconstructive surgery to accessible pathology labs—how health pioneers bring life-altering care to underserved communities.",
  },
  {
    index: "03",
    tag: "Tech & Leadership",
    title: "Assistive Bionics & Grassroots Alliances",
    desc: "Developing 3D-printed prosthetics and building purpose-driven youth coalitions across Pakistan to solve systemic challenges.",
  },
];

export default function ManifestoSection() {
  return (
    <section id="theme" className="relative border-b border-white/10 bg-ink px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
              The Curatorial Vision
            </span>
            <h2 className="mt-3 font-helvetica text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              Ideas Worth Spreading
            </h2>
          </div>

          <p className="max-w-md font-helvetica text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            At Sindh Madressatul Islam University, TEDxSMIU convenes live local speakers to spark deep discussions, celebrate local innovations, and foster lasting connections.
          </p>
        </div>

        {/* Two-Column Asymmetrical Grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Provocation / Manifesto Box */}
          <div className="lg:col-span-5 border border-white/10 bg-surface p-8 lg:p-10 flex flex-col justify-between h-full relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              [SMIU PLATFORM]
            </div>

            <div>
              <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                Karachi as the Crucible
              </span>
              <blockquote className="mt-6 font-helvetica text-xl sm:text-2xl font-bold leading-snug text-white">
                &ldquo;Together, we witnessed the transformation of thought into tangible reality at SMIU.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm text-neutral-300 leading-relaxed">
                Sindh Madressatul Islam University was founded in 1885 to bridge traditional heritage with modern inquiry. TEDxSMIU continues that 140-year mission by giving a platform to fearless ideas that shape Pakistan’s future.
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-400">Curated under official license</span>
              <a
                href="https://www.ted.com/tedx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider text-primary hover:text-white transition-colors underline underline-offset-4"
              >
                About TEDx ↗
              </a>
            </div>
          </div>

          {/* Right Column: Three Thematic Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="group border border-white/10 bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-primary/60 hover:bg-surface-raised"
              >
                <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-white/10 text-neutral-400 group-hover:text-white transition-colors">
                  <span className="text-primary font-bold text-sm tracking-widest">{pillar.index} //</span>
                  <span className="uppercase tracking-[0.2em]">{pillar.tag}</span>
                </div>

                <h3 className="mt-4 font-helvetica text-xl sm:text-2xl font-black uppercase text-white tracking-tight group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
