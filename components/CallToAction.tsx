"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section id="register" className="relative overflow-hidden border-t border-white/10 bg-ink px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-32 text-paper">
      
      {/* Background Red Ajrak Architectural Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-screen bg-repeat bg-[length:90vh_auto]"
        style={{ backgroundImage: "url('/images/branding/PATTERN - red.png')" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        
        {/* Main Header */}
        <div className="text-center max-w-4xl mx-auto">
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
            Get Involved
          </span>

          <h2 className="mt-3 sm:mt-4 font-helvetica text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
            Be in the Room Where Karachi&apos;s Next Ideas Take Stage
          </h2>

          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl font-helvetica text-xs sm:text-base md:text-lg font-normal leading-relaxed text-neutral-300 px-2">
            Whether you want to be the first to know when the next edition launches, nominate a speaker, or partner with our mission, there is a place for you at TEDxSMIU.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Pathway 1: Stay Updated */}
          <div className="border border-white/15 bg-surface p-6 sm:p-8 flex flex-col justify-between hover:border-primary transition-all duration-300 group">
            <div>
              <span className="font-mono text-xs font-bold text-primary">
                01 // STAY INFORMED
              </span>
              <h3 className="mt-2 sm:mt-3 font-helvetica text-lg sm:text-xl font-black uppercase text-white">
                Event Announcements
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Be the first to receive notifications when our next edition theme is revealed and ticket registrations open.
              </p>
            </div>

            <Button
              asChild
              className="mt-6 sm:mt-8 w-full rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-wider py-5 sm:py-6 hover:bg-white hover:text-black border border-primary transition-all"
            >
              <Link href="/contact">
                Get Announcements →
              </Link>
            </Button>
          </div>

          {/* Pathway 2: Speak / Nominate */}
          <div className="border border-white/15 bg-surface p-6 sm:p-8 flex flex-col justify-between hover:border-primary transition-all duration-300 group">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-primary transition-colors">
                02 // CURATE
              </span>
              <h3 className="mt-2 sm:mt-3 font-helvetica text-lg sm:text-xl font-black uppercase text-white">
                Nominate a Speaker
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Do you or someone you know have an idea worth spreading? Our curatorial team reviews speaker proposals year-round.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-6 sm:mt-8 w-full rounded-none border-white/20 bg-transparent text-white font-mono text-xs font-bold uppercase tracking-wider py-5 sm:py-6 hover:border-primary hover:text-primary transition-all"
            >
              <Link href="/contact">
                Nominate a Talk →
              </Link>
            </Button>
          </div>

          {/* Pathway 3: Partner */}
          <div className="border border-white/15 bg-surface p-6 sm:p-8 flex flex-col justify-between hover:border-primary transition-all duration-300 group">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-primary transition-colors">
                03 // SUPPORT
              </span>
              <h3 className="mt-2 sm:mt-3 font-helvetica text-lg sm:text-xl font-black uppercase text-white">
                Become a Partner
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Align your organization with intellectual innovation, research, and high-caliber youth leadership across Pakistan.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-6 sm:mt-8 w-full rounded-none border-white/20 bg-transparent text-white font-mono text-xs font-bold uppercase tracking-wider py-5 sm:py-6 hover:border-primary hover:text-primary transition-all"
            >
              <Link href="/partners">
                Partner With Us →
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}