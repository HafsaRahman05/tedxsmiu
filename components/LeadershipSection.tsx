"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, X } from "lucide-react";
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
  sortOrder: number;
}

const DEFAULT_LEADERSHIP: Leader[] = [
  {
  id: "leadership-mujeebuddin-sahrai-memon",
  roleTitle: "Vice Chancellor, Sindh Madressatul Islam University",
  category: "CHIEF",
  name: "Prof. Dr. Mujeebuddin Sahrai Memon",
  designation: "Vice Chancellor",
  institution: "Sindh Madressatul Islam University",
  bio: "Prof. Dr. Mujeebuddin Sahrai Memon, Vice Chancellor of SMIU, is leading one of South Asia's oldest institutions and the alma mater of Quaid-e-Azam Mohammad Ali Jinnah, the founder of Pakistan. With over 32 years of academic and administrative experience, including two tenures as Vice Chancellor of Sindh Agriculture University and recognition as HEC's Best University Teacher, his leadership has shaped institutions across Sindh. His continued support and belief in student-led initiatives like TEDxSMIU have been instrumental in bringing this vision to life, and we are deeply grateful for his guidance.",
  imageUrl: "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790916831/vc.png",
  sortOrder: 1,
},

{
  id: "leadership-wafa-mansoor-buriro",
  roleTitle: "Patron, TEDxSMIU 2.0 | Assistant Professor, SMIU",
  category: "CHIEF",
  name: "Wafa Mansoor Buriro",
  designation: "Patron",
  institution: "Sindh Madressatul Islam University",
  bio: "Behind every idea that takes the TEDxSMIU stage is the quiet guidance of our Patron, Wafa Mansoor. An Assistant Professor at SMIU and a Pak-US Exchange Alumnus, with profound expertise in Linguistics and English Language Teaching, he has a rare gift for turning complex ideas into clarity and direction. His mentorship shapes the vision and spirit that carries TEDxSMIU 2.0 forward, and we are deeply grateful for his unwavering support.",
  imageUrl: "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790916848/sir_wafa.png",
  sortOrder: 2,
},

{
  id: "leadership-asadullah",
  roleTitle: "License Holder & Organizer, TEDxSMIU 2.0",
  category: "LEAD",
  name: "Asadullah",
  designation: "License Holder & Organizer",
  institution: "TEDxSMIU",
  bio: "Asadullah holds the official TEDx license and serves as Organizer of TEDxSMIU 2.0, carrying the responsibility that makes the entire event possible under TED's name, a role built on trust, leadership, and accountability. With prior leadership experience in the Literary Society, he led teams and organized multiple events, taking ideas from planning through to execution. Today, he brings that same leadership to TEDxSMIU 2.0, coordinating people and shaping the event's direction, anchoring the foundation TEDxSMIU stands on and turning a license into a platform for ideas and impact.",
  imageUrl: "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790620537/asadullah.png",
  sortOrder: 3,
},

{
  id: "leadership-ali-mehdi-abro",
  roleTitle: "Lead Organizer, TEDxSMIU",
  category: "LEAD",
  name: "Ali Mehdi Abro",
  designation: "Lead Organizer",
  institution: "TEDxSMIU",
  bio: "Ali Mehdi Abro leads TEDxSMIU 2.0, steering an 80+ member organization across 12 departments with the same instinct for people and purpose that has defined his journey so far, from a cybersecurity background to leading the SMIU Literary Society as President, and working behind the scenes with TEDxClifton and KhiNext'26. Under his direction, every department moves like one, shaped by a single vision he's determined to see through. What sets him apart isn't the ability to manage scale, it's the discipline to turn that vision into an event this university will remember.",
  imageUrl: "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790916853/ali_mehdi.png",
  sortOrder: 4,
},

{
  id: "leadership-hasnain-ali",
  roleTitle: "Co-Lead Organizer, TEDxSMIU 2.0",
  category: "LEAD",
  name: "Hasnain Ali",
  designation: "Co-Lead Organizer",
  institution: "TEDxSMIU",
  bio: "Hasnain Ali serves as Co-Lead Organizer of TEDxSMIU 2.0, contributing to the vision, planning, and execution of the event, from speakers and guests to volunteers and on-ground operations. With a foundation in Software Engineering and Cybersecurity, he approaches challenges with structure and precision, an ability sharpened further through his experience in student-led leadership, coordinating diverse teams and turning ideas into purposeful experiences. Beyond the logistics, Hasnain sees TEDxSMIU as a platform built around people and ideas, driven by the ambition to create a space where compelling perspectives are heard and conversations continue to resonate long after the event ends.",
  imageUrl: "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790916862/kasnain_ali.png",
  sortOrder: 5,
},
];

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>(DEFAULT_LEADERSHIP);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/leadership")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (!Array.isArray(data) || !isMounted) return;

        const mappedLeaders: Leader[] = data
          .filter((member: any) => member && member.name)
          .map((member: any) => ({
            id: member.id || `${member.name}-${member.role || "member"}`,
            roleTitle: member.role || member.designation || "Team Member",
            category: String(
              member.leadershipType ||
                member.leadership_type ||
                member.category ||
                member.role ||
                "LEAD"
            ).toUpperCase(),
            name: member.name,
            designation: member.designation || member.role || "Team Member",
            institution: member.department || member.institution || "TEDxSMIU",
            bio: member.bio || "Leadership profile information will be updated soon.",
            imageUrl: member.imageUrl || member.image_url || "/images/team/lead.jpg",
            sortOrder: Number(member.sortOrder ?? member.sort_order ?? 999),
          }));

        if (mappedLeaders.length > 0) {
          // Sort strictly according to DB sortOrder
          mappedLeaders.sort((a, b) => a.sortOrder - b.sortOrder);
          setLeaders(mappedLeaders);
        } else {
          setLeaders(DEFAULT_LEADERSHIP);
        }
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

  // Database category or role checking for Top Highlighted Section
  const isVipLeader = (l: Leader) => {
    const cat = l.category.toUpperCase();
    const role = l.roleTitle.toUpperCase();
    return (
      cat.includes("VC") ||
      cat.includes("PATRON") ||
      role.includes("CHANCELLOR") ||
      role.includes("PATRON") ||
      l.id === "vc" ||
      l.id === "patron"
    );
  };

  const highlightedLeaders = leaders.filter(isVipLeader);
  const organizerLeaders = leaders.filter((l) => !isVipLeader(l));

  return (
    <section id="leadership" className="relative border-b border-white/10 bg-ink px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
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

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[22rem] w-full animate-pulse border border-white/10 bg-neutral-900 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-12">
            {/* VIP SECTION: VC & PATRON (Dynamically fetched from DB) */}
            {highlightedLeaders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {highlightedLeaders.map((leader) => {
                  const safeImageSrc = cleanImageUrl(leader.imageUrl, "/images/team/lead.jpg");
                  return (
                    <motion.button
                      type="button"
                      key={leader.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      onClick={() => setSelectedLeader(leader)}
                      className="group relative flex flex-col sm:flex-row h-auto sm:h-[22rem] w-full overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-[#180507] via-[#0d0d0d] to-[#080808] text-white shadow-[0_0_20px_rgba(235,0,40,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_35px_rgba(235,0,40,0.3)]"
                    >

                      <div className="relative h-[18rem] sm:h-full sm:w-1/2 shrink-0 overflow-hidden">
                        <Image
                          src={safeImageSrc}
                          alt={leader.name}
                          fill
                          priority
                          className="object-cover grayscale brightness-90 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0d0d0d]" />
                      </div>

                      <div className="relative z-10 flex flex-1 flex-col justify-between p-6 text-left">
                        <div>
                          {/* <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-primary/80">
                              {leader.institution}
                            </span>
                            <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div> */}
                          <h3 className="mt-3 text-xl font-extrabold text-white sm:text-2xl leading-snug">
                            {leader.name}
                          </h3>
                           <span className="font-extrabold text-[11px] font-bold uppercase tracking-[0.1em] text-primary/89">
                              {leader.roleTitle}
                            </span>
                          {/* <div className="absolute  z-30 flex items-center gap-1.5 px-3 py-1 backdrop-blur-md">
                            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                              {leader.roleTitle}
                            </span>
                          </div> */}
                        </div>

                        <p className="mt-4  text-xs leading-relaxed text-neutral-400">
                          {leader.bio}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* ORGANIZERS SECTION (Ordered by sortOrder from DB: Asad -> Ali -> Hasnain) */}
            {organizerLeaders.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                  <ShieldCheck className="h-4 w-4 text-neutral-400" />
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Organizing Executive Team
                  </h4>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {organizerLeaders.map((leader, idx) => {
                    const safeImageSrc = cleanImageUrl(leader.imageUrl, "/images/team/lead.jpg");
                    return (
                      <motion.button
                        type="button"
                        key={leader.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        onClick={() => setSelectedLeader(leader)}
                        className="group relative h-[19rem] w-[16rem] shrink-0 snap-start cursor-pointer overflow-hidden border border-neutral-800 bg-[#090909] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#EB0028] hover:shadow-[0_0_26px_rgba(235,0,40,0.2)] sm:h-[21rem] sm:w-[17rem] md:h-[22rem] md:w-[18rem] lg:h-[24rem]"
                      >
                        <Image
                          src={safeImageSrc}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:brightness-85 [@media(hover:hover)]:group-hover:scale-105 [@media(hover:hover)]:group-hover:grayscale-0 [@media(hover:hover)]:group-hover:brightness-100"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-0 [@media(hover:none)]:hidden" />

                        <div className="absolute top-3 right-3 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <ArrowUpRight className="h-4 w-4 stroke-[2.5] text-[#EB0028] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                        </div>

                        
{/* 
                        <div className="relative z-10 flex h-full flex-col justify-end p-5 text-left">
                          <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
                            <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                              {leader.name}
                            </h3>
                            <p className="text-xs text-neutral-300">{leader.designation}</p>
                          </div>
                        </div> */}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
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