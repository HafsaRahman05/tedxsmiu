"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { cleanImageUrl } from "@/lib/utils";

interface Leader {
  id: string;
  roleTitle: string;
  category: string;
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
  {
    id: "lead1",
    roleTitle: "Lead Organizer",
    category: "LEAD",
    name: "Hasnain Ali",
    designation: "TEDxSMIU Lead Organizer",
    institution: "TEDxSMIU Organizing Committee",
    bio: "Spearheading executive production, volunteer operations, speaker relations, and community outreach.",
    imageUrl: "/images/team/lead.jpg",
  },
];

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>(DEFAULT_LEADERSHIP);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/leadership")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (!Array.isArray(data) || !isMounted) return;

        const mappedLeaders = data
          .filter((member: any) => member && member.name)
          .sort((a: any, b: any) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
          .map((member: any) => ({
            id: member.id || `${member.name}-${member.role || "member"}`,
            roleTitle: member.role || member.designation || "Team Member",
            category: String(
              member.leadershipType ||
                member.leadership_type ||
                member.role ||
                "LEAD"
            ).toUpperCase(),
            name: member.name,
            designation: member.designation || member.role || "Team Member",
            institution: member.department || "TEDxSMIU",
            bio: member.bio || "Leadership profile information will be updated soon.",
            imageUrl: member.imageUrl || member.image_url || "/images/team/lead.jpg",
          }));

        setLeaders(mappedLeaders.length > 0 ? mappedLeaders : DEFAULT_LEADERSHIP);
      })
      .catch(() => {
        if (isMounted) setLeaders(DEFAULT_LEADERSHIP);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateOverflowState = () => {
      const el = rowRef.current;
      if (el) {
        setHasOverflow(el.scrollWidth > el.clientWidth + 1);
      }
    };

    updateOverflowState();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateOverflowState);
      return () => window.removeEventListener("resize", updateOverflowState);
    }

    const observer = new ResizeObserver(updateOverflowState);
    if (rowRef.current) observer.observe(rowRef.current);

    return () => observer.disconnect();
  }, [leaders, loading]);

  return (
    <section id="leadership" className="relative border-b border-white/10 bg-ink px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
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

        <div className="relative mt-8 sm:mt-12">
          {loading ? (
            <div className="flex gap-4 sm:gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="h-[19rem] w-[16rem] shrink-0 animate-pulse border border-white/10 bg-neutral-900 sm:h-[21rem] sm:w-[17rem] md:h-[22rem] md:w-[18rem] lg:h-[24rem]"
                />
              ))}
            </div>
          ) : (
            <div 
              ref={rowRef}
              onScroll={(event) => {
                if (event.currentTarget.scrollLeft > 8) setIsScrolled(true);
              }}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
            >
              {leaders.map((leader, idx) => {
                const safeImageSrc = cleanImageUrl(leader.imageUrl, "/images/team/lead.jpg");

                return (
                  <motion.button
                    type="button"
                    key={leader.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                    onClick={() => setSelectedLeader(leader)}
                    className="group relative h-[19rem] w-[16rem] shrink-0 snap-start cursor-pointer overflow-hidden border border-neutral-800 bg-[#090909] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#EB0028] hover:shadow-[0_0_26px_rgba(235,0,40,0.2)] sm:h-[21rem] sm:w-[17rem] md:h-[22rem] md:w-[18rem] lg:h-[24rem]"
                  >
                    <Image
                      src={safeImageSrc}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="absolute inset-0 h-full w-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                    />
                    <div className="absolute top-3 right-3 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5] text-[#EB0028] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                    </div>
                    <div className="absolute top-3 left-3 z-20 rounded-full border border-primary/40 bg-ink/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                      {leader.roleTitle}
                    </div>
                    <div className="relative z-10 flex h-full flex-col justify-end p-4 text-left sm:p-5">
                      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
                        <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{leader.name}</h3>
                        <p className="text-xs text-gray-200 sm:text-sm">{leader.designation}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {!loading && leaders.length > 1 && hasOverflow && !isScrolled && (
            <div aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-0.5 px-2 py-1 text-[9px] font-mono uppercase text-white/70">
              <ArrowRight className="h-3 w-3" />
              <span>Swipe Left</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedLeader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.button
              type="button"
              aria-label="Close leadership details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeader(null)}
              className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-leader-title"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-left text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                aria-label="Close leadership details"
                className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-neutral-400 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-y-auto p-5 sm:p-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 sm:w-44">
                    <Image
                      src={cleanImageUrl(selectedLeader.imageUrl, "/images/team/lead.jpg")}
                      alt={selectedLeader.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#EB0028]">
                      {selectedLeader.roleTitle}
                    </span>
                    <h2 id="preview-leader-title" className="mt-1 font-display text-2xl font-black uppercase text-white sm:text-3xl">
                      {selectedLeader.name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-neutral-300">{selectedLeader.designation}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{selectedLeader.institution}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-800 pt-6">
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">About the Leader</h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">{selectedLeader.bio}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}