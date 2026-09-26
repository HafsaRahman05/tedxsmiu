"use client";

import Image from "next/image";

const HIGHLIGHTS = [
  {
    title: "1885 Victorian-Saracenic Heritage",
    desc: "Sindh Madressatul Islam University’s historic Talpur House and limestone halls provide a dramatic architectural counterpoint to modern discourse.",
  },
  {
    title: "The Financial Heart of Karachi",
    desc: "Situated on I.I. Chundrigar Road—the economic and media nerve center of Pakistan—TEDxSMIU convenes industry leaders with emerging youth innovators.",
  },
  {
    title: "The Alma Mater of the Quaid",
    desc: "Founded by Hassan Ally Bey Effendi and educating Pakistan's founder Quaid-e-Azam Muhammad Ali Jinnah, SMIU has stood for modern enlightenment for 140 years.",
  },
  {
    title: "Student Innovation & Labs",
    desc: "Experience live student-engineered installations, robotics prototypes, and creative design exhibits between keynote sessions.",
  },
];

export default function CampusExperience() {
  return (
    <section id="experience" className="relative border-b border-white/10 bg-surface px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-32 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              Historic Ground // Radical Ideas
            </span>
            <h2 className="mt-2 sm:mt-3 font-helvetica text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              The SMIU Experience
            </h2>
          </div>

          <p className="max-w-md font-helvetica text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
            TEDxSMIU is not housed in a sterile corporate hotel. It takes place within one of South Asia’s most historic and enduring centers of learning.
          </p>
        </div>

        {/* 2-Column Split: Image Feature + Highlights */}
        <div className="mt-8 sm:mt-14 grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-6 relative border border-white/10 bg-ink overflow-hidden group">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/hero/smiu-night-view.jpg"
                alt="Sindh Madressatul Islam University Main Campus at Night"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-5 sm:p-8 border-t border-white/10 bg-ink">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Campus Landmark
              </span>
              <h3 className="mt-2 font-helvetica text-xl sm:text-2xl font-black uppercase text-white">
                Main Auditorium &amp; Historic Quad
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                A 300-seat intimate auditorium featuring precision acoustics, live multi-camera broadcast capture, and step-free accessibility.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Editorial Feature Blocks */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {HIGHLIGHTS.map((item, idx) => (
              <div
                key={idx}
                className="border border-white/10 bg-ink p-5 sm:p-6 transition-all duration-300 hover:border-primary hover:bg-surface-raised"
              >
                <span className="font-mono text-xs font-bold text-primary">
                  0{idx + 1} //
                </span>
                <h4 className="mt-2 sm:mt-3 font-helvetica text-sm sm:text-base font-bold uppercase text-white leading-snug">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
