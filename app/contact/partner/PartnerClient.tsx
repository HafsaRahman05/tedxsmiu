"use client";

import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PartnerClient() {
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
            Become a Partner
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-base">
            Partnering with TEDxSMIU aligns your brand with innovation, leadership, and impactful ideas. Fill out the application below to collaborate with us.
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
                Company / Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="Acme Corp"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Contact Person Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder="partner@company.com"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+92 300 0000000"
                className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
              Partnership Type
            </label>
            <select className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-[#EB0028] focus:outline-none">
              <option value="title" className="bg-black text-white">Title Sponsor</option>
              <option value="gold" className="bg-black text-white">Gold Sponsor</option>
              <option value="silver" className="bg-black text-white">Silver Sponsor</option>
              <option value="inkind" className="bg-black text-white">In-Kind / Logistics Partner</option>
              <option value="media" className="bg-black text-white">Media Partner</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
              How would you like to partner with TEDxSMIU?
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tell us about your organization's goals and how you'd like to collaborate..."
              className="mt-2 w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#EB0028] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-none bg-[#EB0028] px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Submit Proposal <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
