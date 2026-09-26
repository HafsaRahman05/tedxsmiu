"use client";

import React, { useState } from "react";
import { Check, Calendar, MapPin, Ticket, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Link from "next/link";

export default function GetTicketsPage() {
  const [selectedTier, setSelectedTier] = useState<string>("general");

  return (
    <PageShell>
    <main className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 px-6">
      {/* Background Red Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#EB0028]/15 blur-[140px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-6">
            <Ticket className="h-4 w-4 text-[#EB0028]" />
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
              TEDxSMIU Annual Conference 2026
            </span>
          </div>

          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
            Grab Your <span className="text-[#EB0028]">Seat</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-neutral-400 leading-relaxed">
            Join visionary speakers, innovators, and changemakers for an unforgettable day of transformative ideas, networking, and inspiration.
          </p>

          {/* Quick Event Info Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-300 font-mono">
            <div className="flex items-center gap-2 border border-white/10 rounded-lg px-4 py-2 bg-neutral-900/50">
              <Calendar className="h-4 w-4 text-[#EB0028]" />
              <span>October 1, 2026</span>
            </div>
            <div className="flex items-center gap-2 border border-white/10 rounded-lg px-4 py-2 bg-neutral-900/50">
              <MapPin className="h-4 w-4 text-[#EB0028]" />
              <span>SMIU Main Auditorium, Karachi</span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
          
          {/* Early Bird Ticket */}
          <div 
            onClick={() => setSelectedTier("student")}
            className="relative flex flex-col justify-between rounded-2xl border border-[#EB0028] bg-neutral-900/80 p-8 backdrop-blur-md cursor-pointer shadow-[0_0_35px_rgba(235,0,40,0.3)] transition-all duration-300 hover:border-[#EB0028] md:-translate-y-4"
          >
            {/* Featured Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#EB0028] px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
              Limited Offer
            </div>

            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                Early Bird Ticket
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-mono">40% OFF for a limited time</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">PKR 1,500</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Access to all TEDx Talk sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Early access to TEDxSMIU 2026</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Networking Refreshment Break</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Digital Certificate of Attendance</span>
                </li>
              </ul>
            </div>

            <Link
              href="/tickets/checkout?tier=earlyBird"
              className="mt-8 block w-full rounded-full bg-[#EB0028] py-3.5 text-center font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(235,0,40,0.4)] transition-all hover:bg-[#c00020]"
            >
              Select Early Bird Ticket
            </Link>
          </div>

          {/* General Pass */}
          <div 
            onClick={() => setSelectedTier("general")}
            className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/40 p-8 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-white/30"
          >
            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                General Pass
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-mono">Open to Professionals & General Public</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">PKR 2,500</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-neutral-200">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Full Conference Access (All Sessions)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Premium TEDxSMIU Gift Bag</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>High-Tea & Lunch Included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Priority Seating Zone</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#EB0028] mt-0.5 shrink-0" />
                  <span>Printed Certificate + Social Badge</span>
                </li>
              </ul>
            </div>

            <Link
              href="/tickets/checkout?tier=general"
              className="mt-8 block w-full rounded-full border border-white/20 bg-white/5 py-3.5 text-center font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Buy General Pass
            </Link>
          </div>

        </div>

        {/* Guarantee Banner */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#EB0028]/10 border border-[#EB0028]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-[#EB0028]" />
            </div>
            <div>
              <h4 className="font-bold text-white">100% Verified Tickets</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Instant digital ticket delivery with unique QR code verification.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400">Need corporate bulk tickets?</span>
            <Link href="/contact" className="text-xs font-mono text-[#EB0028] underline underline-offset-4">
              Contact Team
            </Link>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold uppercase md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#EB0028]" />
                What is the Early Bird Ticket?
              </h4>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                The Early Bird Ticket is available at PKR 1,500 with 40% off for a limited time. Complete payment and submit your transaction details to reserve your seat.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#EB0028]" />
                Are tickets refundable or transferable?
              </h4>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Tickets are non-refundable. However, you can transfer your ticket to another person at least 48 hours prior to the event by contacting our support team.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#EB0028]" />
                What is included in the Lunch / High-Tea?
              </h4>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                General and VIP passes include a full meal package along with tea/coffee breaks served during the networking sessions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
    </PageShell>
  );
}