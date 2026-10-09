"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
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

  const highlightedLeaders = leaders.filter(isVipLeader).sort((a, b) => a.sortOrder - b.sortOrder);
  const organizerLeaders = leaders.filter((l) => !isVipLeader(l));

  return (
    <section id="leadership" className="relative border-b border-line bg-ink px-4 py-16 sm:px-6 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-line pb-6 md:flex-row md:items-end md:justify-between sm:pb-8">
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              Institutional Leadership &amp; Direction
            </span>
            <h2 className="mt-2 font-helvetica text-2xl font-black uppercase tracking-tight text-paper sm:mt-3 sm:text-4xl lg:text-5xl">
              Patrons &amp; Leadership
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary underline underline-offset-8 transition-colors hover:text-paper sm:text-xs sm:tracking-[0.15em]"
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
                className="h-[22rem] w-full animate-pulse border border-line bg-surface"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-12">
            {/* VIP SECTION: VC & PATRON (Dynamically fetched from DB) */}
            {highlightedLeaders.length > 0 && (
              <div className="flex flex-col gap-6 lg:gap-8">
                {highlightedLeaders.map((leader, index) => {
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
                      className={`group relative flex min-h-[34rem] w-full flex-col overflow-hidden border border-line bg-surface text-left text-paper transition-colors duration-300 hover:border-primary sm:min-h-[30rem] md:flex-row ${
                        index === 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="relative h-[20rem] w-full shrink-0 overflow-hidden sm:h-[24rem] md:h-auto md:w-[46%]">
                        <Image
                          src={safeImageSrc}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 46vw"
                          priority={index < 2}
                          className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent md:from-transparent md:via-transparent md:to-surface/25 ${
                            index === 0 ? "md:bg-gradient-to-l" : "md:bg-gradient-to-r"
                          }`}
                        />
                      </div>

                      <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-9 lg:p-12">
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs">
                            {leader.roleTitle}
                          </span>
                          <h3 className="mt-3 text-2xl font-black leading-tight text-paper sm:text-3xl lg:text-4xl">
                            {leader.name}
                          </h3>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted sm:text-xs">
                            {leader.institution}
                          </p>
                        </div>

                        <p className="mt-6 max-w-3xl text-sm leading-7 text-paper-dim sm:text-base">
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
                <div className="mb-6 border-b border-line pb-3">
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
                    Organizing Executive Team
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        className="group relative h-[24rem] w-full cursor-pointer overflow-hidden border border-line bg-surface text-left text-paper transition-colors duration-300 hover:border-primary"
                      >
                        <Image
                          src={safeImageSrc}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="absolute inset-0 h-full w-full object-contain transition-all duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:brightness-85 [@media(hover:hover)]:group-hover:scale-105 [@media(hover:hover)]:group-hover:grayscale-0 [@media(hover:hover)]:group-hover:brightness-100"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                            {leader.roleTitle}
                          </p>
                          <h3 className="mt-2 text-xl font-black leading-tight text-paper">
                            {leader.name}
                          </h3>
                        </div>
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
              className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-surface text-left text-paper shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                aria-label="Close leadership details"
                className="absolute right-4 top-4 z-20 border border-line bg-ink/80 p-2 text-paper-dim transition-colors hover:text-paper"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-y-auto p-5 sm:p-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden border border-line bg-ink sm:w-44">
                    <Image
                      src={cleanImageUrl(selectedLeader.imageUrl, "/images/team/lead.jpg")}
                      alt={selectedLeader.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                      {selectedLeader.roleTitle}
                    </span>
                    <h2 id="preview-leader-title" className="mt-1 font-display text-2xl font-black uppercase text-paper sm:text-3xl">
                      {selectedLeader.name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-paper-dim">{selectedLeader.designation}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-paper-muted">{selectedLeader.institution}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-line pt-6">
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-paper-muted">About the Leader</h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-paper-dim">{selectedLeader.bio}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}