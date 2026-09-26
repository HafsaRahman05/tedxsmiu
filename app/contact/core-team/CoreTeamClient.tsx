"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CoreTeamClient() {
  return (
    <main className="min-h-screen bg-black pt-20 text-white flex flex-col justify-between">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10 w-full my-auto">
        {/* Back Link */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#EB0028] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Contact
        </Link>

        {/* Heading */}
        <div className="mt-8">
          <h1 className="mt-2 font-display text-4xl font-black uppercase md:text-6xl text-white">
            Core Team Application
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-base">
            The Core Team drives the vision, planning, and execution of TEDxSMIU.
          </p>
        </div>

        {/* Closed State Banner / Card */}
        <div className="mt-12 rounded-none border border-white/10 bg-white/[0.02] p-8 md:p-12 text-center backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028]">
            <Bell className="h-6 w-6" />
          </div>

          <h2 className="mt-6 font-display text-2xl font-bold uppercase text-white md:text-3xl">
            Applications Are Currently Closed
          </h2>
          
          <p className="mx-auto mt-4 max-w-lg font-mono text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
            Core Team recruitment for the upcoming edition has officially ended. Connect with us on social media or reach out to get notified when new positions open up.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 border border-[#EB0028] bg-[#EB0028] px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#EB0028] sm:w-auto"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
