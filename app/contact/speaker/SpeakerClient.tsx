"use client";

import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SpeakerClient() {
  return (
    <main className="min-h-screen bg-black pt-20 text-white">
      <Navbar/>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        
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
            Nominate / Apply as Speaker
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-base">
            Do you have an idea worth spreading? We are looking for unique voices, fresh insights, and inspiring stories for the TEDxSMIU stage.
          </p>
        </div>

        {/* Application Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 space-y-6 rounded-none border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Profession / Title
              </label>
              <input
                type="text"
                required
                placeholder="AI Researcher / Educator"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                LinkedIn Profile / Website
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
              Talk Title / Core Idea
            </label>
            <input
              type="text"
              required
              placeholder="What is your idea in one sentence?"
              className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
              Detailed Description of your Talk
            </label>
            <textarea
              rows={5}
              required
              placeholder="Explain why this idea is novel, important, and relevant for our audience..."
              className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-none bg-[#EB0028] px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Submit Application <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      <Footer/>
    </main>
  );
}
