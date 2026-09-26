"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Countdown from "@/components/Countdown";

export default function EventCard() {
  return (
    <div id="event-spotlight" className="w-full border border-white/15 bg-surface p-5 sm:p-5 md:p-5 lg:p-5 shadow-2xl relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-6"
        style={{
          backgroundImage: "url('/images/branding/PATTERN - white.png')",
          backgroundSize: "420px auto",
          backgroundPosition: "center",
          mixBlendMode: "screen",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,0,40,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />

      <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 rounded-none bg-primary animate-pulse" />
              Event Live
            </span>
            <span className="text-neutral-500 font-mono text-xs hidden sm:inline">•</span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400">
              Convergence 2026
            </span>
          </div>

          <h3 className="mt-3 font-helvetica text-2xl sm:text-3xl md:text-4xl tracking-tight text-white leading-tight">
            <span className="font-black text-primary">TEDx</span>SMIU — Convergence
          </h3>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-neutral-300 max-w-xl leading-relaxed">
            A full day of talks, installations, and conversation exploring where human ideas are headed next. Join a curated gathering of thinkers, builders, and changemakers at the heart of SMIU.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg font-mono">
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">2026</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">Edition</span>
            </div>
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">01 Oct</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">Event Date</span>
            </div>
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-primary">SMIU</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">Venue</span>
            </div>
          </div>
        
        </div>

        <div className="flex flex-col justify-between border border-white/15 bg-gradient-to-b from-surface-raised via-surface to-ink p-5 sm:p-8 text-center lg:col-span-5 h-full relative">
          <div className="border-b border-white/10 pb-5 sm:pb-6">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] text-neutral-400 uppercase">
              Event Status
            </span>
            <div className="mt-2 font-helvetica text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              Announced
            </div>
            <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary mt-2">
              Convergence 2026
            </div>
            <div className="mt-2 text-[11px] sm:text-xs text-neutral-300 font-mono">
              Main Auditorium • Sindh Madressatul Islam University, Karachi
            </div>
          </div>

          <div className="pt-3 sm:pt-4">
           <Countdown />
            <Button
              asChild
              className="w-full rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] py-5 sm:py-6 hover:bg-white hover:text-black border border-primary transition-all duration-300"
            >
              <Link href="/tickets">
                Reserve Your Pass →
              </Link>
            </Button>

            <span className="mt-3 block font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400">
              *Get updates on speakers, ticket drops, and community access.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
