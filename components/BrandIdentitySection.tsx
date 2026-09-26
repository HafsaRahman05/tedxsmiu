"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PATTERNS = [
  {
    id: "white",
    name: "Ajrak White Pattern",
    bgClass: "bg-black text-white",
    image: "/images/branding/PATTERN - white.png",
    patternBg: "bg-size-[100vh_auto] opacity-90 mix-blend-overlay",
    desc: "Used for dark section texture overlays and high-contrast backdrops.",
  },
  {
    id: "red",
    name: "TED Red Pattern",
    bgClass: "bg-neutral-950 text-white border-primary/30",
    image: "/images/branding/PATTERN - red.png",
    patternBg: "bg-size-[100vh_auto] opacity-50 mix-blend-screen",
    desc: "Used for high-energy CTA sections, keynotes, and prominent breaks.",
  },
  {
    id: "black",
    name: "Ajrak Black Pattern",
    bgClass: "bg-white text-black border-neutral-300",
    image: "/images/branding/PATTERN - black.png",
    patternBg: "bg-size-[100vh_auto] mix-blend-multiply",
    desc: "Used for light mode cards, document press assets, and print identity.",
  },
];

export default function BrandIdentitySection() {
  const [activePattern, setActivePattern] = useState(PATTERNS[0]);

  return (
    <section className="relative overflow-hidden border-t border-border bg-background px-6 py-28 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Brand Identity
            </span>
            <h2 className="mt-2 font-helvetica text-4xl font-black uppercase text-foreground sm:text-5xl">
              Heritage Meets Innovation
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
            The visual identity of TEDxSMIU honors Sindh’s rich Ajrak heritage while projecting forward into human innovation and global discourse.
          </p>
        </div>

        {/* Brand Grid Showcase */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          
          {/* 3D Emblem Hero Card (Span 7) */}
          <div className="relative overflow-hidden border border-border bg-neutral-950 p-8 lg:col-span-7 flex flex-col justify-between group">
            {/* Background Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-80 mix-blend-overlay pointer-events-none bg-repeat bg-size-[60vh_auto] transition-opacity duration-500 group-hover:opacity-25"
              style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
            />

            <div className="relative z-10">
              <span className="inline-block rounded-none border border-white/10 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Signature Mark
              </span>
              <h3 className="mt-4 font-helvetica text-2xl font-black uppercase text-white">
                The 3D Ajrak &quot;X&quot; Emblem
              </h3>
              <p className="mt-2 text-xs text-neutral-400 max-w-lg leading-relaxed">
                Combining solid TED Red with the intricate geometric floral motifs of traditional Sindhi Ajrak art and 3D SMIU typography contouring.
              </p>
            </div>

            {/* Centered Graphic */}
            <div className="relative z-10 my-8 flex items-center justify-center py-6">
              <motion.div
                whileHover={{ scale: 1.04, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-48 sm:w-64 md:w-72"
              >
                <Image
                  src="/images/branding/X main Logo.png"
                  alt="3D Ajrak X Emblem"
                  width={400}
                  height={400}
                  className="h-auto w-full object-contain filter drop-shadow-[0_15px_40px_rgba(235,0,40,0.3)]"
                />
              </motion.div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-neutral-400">
              <span>Official Emblem Mark</span>
              <span className="text-primary font-bold">TEDxSMIU 2026</span>
            </div>
          </div>

          {/* Official Logos Card (Span 5) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            
            {/* Dark Theme Logo Container */}
            <div className="relative overflow-hidden border border-border bg-black p-6 flex flex-col justify-between flex-1">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none bg-repeat bg-size-[60vh_auto]"
                style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
              />
              <span className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                Official Logo — Dark Theme
              </span>
              <div className="relative z-10 py-6 flex justify-center">
                <Image
                  src="/images/branding/X logo white.png"
                  alt="TEDxSMIU Logo White"
                  width={300}
                  height={70}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <span className="relative z-10 font-mono text-[10px] text-neutral-500">
                Used on dark backgrounds &amp; transparent headers
              </span>
            </div>

            {/* Light Theme Logo Container */}
            <div className="relative overflow-hidden border border-border bg-white p-6 flex flex-col justify-between flex-1">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none bg-repeat bg-size-[60vh_auto]"
                style={{ backgroundImage: "url('/images/branding/PATTERN - black.png')" }}
              />
              <span className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-neutral-600">
                Official Logo — Light Theme
              </span>
              <div className="relative z-10 py-6 flex justify-center">
                <Image
                  src="/images/branding/Tedx SMIU Black.png"
                  alt="TEDxSMIU Logo Black"
                  width={300}
                  height={70}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <span className="relative z-10 font-mono text-[10px] text-neutral-500">
                Used on white cards, press materials &amp; print
              </span>
            </div>

          </div>

        </div>

        {/* Pattern Suite Selector Row */}
        <div className="mt-12 border border-border bg-secondary/40 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
            <div>
              <h3 className="font-helvetica text-xl font-bold uppercase text-foreground">
                Ajrak Pattern System
              </h3>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                Intricate vector line motifs inspired by Sindh&apos;s heritage Ajrak textiles.
              </p>
            </div>

            {/* Pattern Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePattern(p)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all rounded-none border ${
                    activePattern.id === p.id
                      ? "border-primary bg-primary text-white font-bold"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Pattern Preview Area */}
          <div className="mt-6 relative h-48 w-full overflow-hidden border border-border flex items-center justify-center p-6 transition-all duration-300">
            <div 
              className={`absolute inset-0 bg-repeat ${activePattern.patternBg}`}
              style={{ backgroundImage: `url('${activePattern.image}')` }}
            />
            <div className="relative z-10 text-center bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 max-w-lg">
              <span className="font-mono text-xs font-bold uppercase text-primary tracking-widest">
                {activePattern.name}
              </span>
              <p className="mt-1 text-xs text-neutral-300">
                {activePattern.desc}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
