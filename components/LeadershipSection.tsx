"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cleanImageUrl } from "@/lib/utils";

interface Leader {
  id: string;
  roleTitle: string;
  category: "VC" | "PATRON" | "LICENSEE" | "LEAD";
  name: string;
  designation: string;
  institution: string;
  bio: string;
  imageUrl: string;
}

const DEFAULT_LEADERSHIP: Leader[] = [
  {
    id: "vc",
    roleTitle: "Vice Chancellor",
    category: "VC",
    name: "Prof. Dr. Mujeeb-U-Ddin Sahrai Memon",
    designation: "Vice Chancellor",
    institution: "Sindh Madressatul Islam University",
    bio: "Championing academic excellence, research innovation, and institutional stewardship at SMIU.",
    imageUrl: "/images/team/vc.jpg",
  },
  {
    id: "patron",
    roleTitle: "Patron",
    category: "PATRON",
    name: "Wafa Mansoor Buriro",
    designation: "Academic Patron & Advisor",
    institution: "Sindh Madressatul Islam University",
    bio: "Providing institutional mentorship, faculty guidance, and strategic support for TEDxSMIU.",
    imageUrl: "/images/team/patron.jpg",
  },
  {
    id: "licensee",
    roleTitle: "Licensee",
    category: "LICENSEE",
    name: "Asad Ullah",
    designation: "TEDx Licensee",
    institution: "TEDxSMIU",
    bio: "Holding the official license from TED Conferences, maintaining curatorial standards and brand integrity.",
    imageUrl: "/images/team/licensee.jpg",
  },
  {
    id: "lead",
    roleTitle: "Lead Organizer",
    category: "LEAD",
    name: "Ali Mehdi Abro",
    designation: "TEDxSMIU Lead Organizer",
    institution: "TEDxSMIU Organizing Committee",
    bio: "Spearheading executive production, volunteer operations, speaker relations, and community outreach.",
    imageUrl: "/images/team/lead.jpg",
  },
];

export default function LeadershipSection() {
  const [leaders] = useState<Leader[]>(DEFAULT_LEADERSHIP);

  return (
    <section id="leadership" className="relative border-b border-white/10 bg-surface px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              Institutional Leadership &amp; Direction
            </span>
            <h2 className="mt-2 sm:mt-3 font-helvetica text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              Patrons &amp; Leadership
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary hover:text-white transition-colors underline underline-offset-8"
            >
              Meet Full Organizing Team →
            </Link>
          </div>
        </div>

        {/* 4-Column Leadership Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {leaders.map((leader, idx) => {
            const safeImageSrc = cleanImageUrl(leader.imageUrl, "/images/speakers/speaker1.jpg");
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative border border-white/10 bg-ink flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-primary"
              >
                <div>
                  {/* Image / Portrait Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                    <Image
                      src={safeImageSrc}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top filter grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90" />

                    {/* Role Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="border border-primary/40 bg-ink/90 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                        {leader.roleTitle}
                      </span>
                    </div>

                    {/* Index */}
                    <div className="absolute top-3 right-3">
                      <span className="font-mono text-xs font-bold text-white/50">
                        0{idx + 1} //
                      </span>
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="p-4 sm:p-5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block pb-1">
                      {leader.designation}
                    </span>
                    <h3 className="font-helvetica text-base sm:text-lg font-black uppercase text-white leading-tight group-hover:text-primary transition-colors">
                      {leader.name}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {leader.bio}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tag */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                  <span className="truncate max-w-[180px]">{leader.institution}</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
