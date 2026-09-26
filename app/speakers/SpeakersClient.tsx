"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import type { Speaker } from "@/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Tag, ArrowUpRight, Globe } from "lucide-react";

// Speaker interface extension
interface ExtendedSpeaker extends Speaker {
  imageUrl?: string | null;
  headline?: string | null;
  socialLinks?: any;
  eventYear?: number;
}

// Inline Social SVG Icons
const SocialIcon = ({ url }: { url: string }) => {
  const lUrl = url.toLowerCase();

  if (lUrl.includes("linkedin")) {
    return (
      <span className="font-sans text-base font-black leading-none tracking-[-0.08em]">in</span>
    );
  }
  if (lUrl.includes("twitter") || lUrl.includes("x.com")) {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (lUrl.includes("instagram")) {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (lUrl.includes("facebook")) {
    return (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  return <Globe className="h-3.5 w-3.5" />;
};

// Helper to normalize social links array
const parseSocialLinks = (links: any): string[] => {
  if (!links) return [];
  let parsed = links;
  if (typeof links === "string") {
    const value = links.trim();
    if (!value) return [];
    try {
      parsed = JSON.parse(value);
    } catch {
      return [value];
    }
  }
  if (typeof parsed === "string") return parsed.trim() ? [parsed.trim()] : [];
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => (typeof item === "string" ? item : item?.url || ""))
      .filter(Boolean);
  }
  if (parsed && typeof parsed === "object" && typeof parsed.url === "string") {
    return [parsed.url];
  }
  if (parsed && typeof parsed === "object") {
    return Object.values(parsed).filter(
      (value): value is string => typeof value === "string" && value.startsWith("http"),
    );
  }
  return [];
};

const normalizeImageSrc = (src: string) => {
  try {
    return decodeURI(src);
  } catch {
    return src;
  }
};

export default function SpeakersClient() {
  const [speakers, setSpeakers] = useState<ExtendedSpeaker[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [selectedSpeaker, setSelectedSpeaker] = useState<ExtendedSpeaker | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/speakers"),
      fetch("/api/events"),
    ])
      .then(async ([speakerRes, eventRes]) => {
        const speakerData = await speakerRes.json();
        const eventData = await eventRes.json();

        setSpeakers(speakerData.speakers || []);
        setEvents(Array.isArray(eventData) ? eventData : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const set = new Set<string>();
    speakers.forEach((speaker) => set.add(String(speaker.eventYear || 2023)));
    return ["All", ...Array.from(set).sort((yearA, yearB) => Number(yearB) - Number(yearA))];
  }, [speakers]);

  const speakerSections = useMemo(() => {
    const eventSections = Array.from(
      speakers.reduce((groups, speaker) => {
        const year = speaker.eventYear || 2023;
        const group = groups.get(year) || [];
        group.push(speaker);
        groups.set(year, group);
        return groups;
      }, new Map<number, ExtendedSpeaker[]>()),
    )
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, yearSpeakers]) => {
        const event = events.find((candidate) => {
          const eventYear = candidate.date ? new Date(candidate.date).getFullYear() : null;
          return eventYear === year;
        });
        const eventTitle = event?.title || `TEDxSMIU ${year}`;

        return {
          id: event?.id || `event-${year}`,
          title: eventTitle,
          year: String(year),
          theme: event?.theme || "Ideas worth spreading",
          status: event?.status || (year < new Date().getFullYear() ? "PAST" : "UPCOMING"),
          speakers: yearSpeakers.map((speaker) => {
            const rawSpeaker = speaker as ExtendedSpeaker;

            return {
              ...rawSpeaker,
              image: rawSpeaker.imageUrl || rawSpeaker.image || "/images/speakers/speaker1.jpg",
              title: rawSpeaker.headline || rawSpeaker.title || "TEDx Speaker",
              tags: [eventTitle],
            };
          }),
        };
      });

    const fallbackSection = {
      id: "all-speakers",
      title: "TEDxSMIU 2023",
      year: "2023",
      theme: "Archive of ideas and voices",
      status: "PAST",
      speakers: speakers,
    };

    if (eventSections.length > 0) {
      return eventSections;
    }

    return [fallbackSection];
  }, [events, speakers]);

  const filteredSections = useMemo(() => {
    return speakerSections
      .map((section) => ({
        ...section,
        speakers: filter === "All"
          ? section.speakers
          : section.year === filter ? section.speakers : [],
      }))
      .filter((section) => section.speakers.length > 0);
  }, [speakerSections, filter]);

  return (
    <PageShell>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-[-5%] top-[10%] z-0 hidden md:block opacity-20 select-none w-[450px] lg:w-[600px] aspect-square">
          <Image
            src="/images/branding/X main Logo.png"
            alt="TEDxSMIU 3D X Emblem"
            fill
            sizes="(max-width: 768px) 0vw, 600px"
            className="object-contain filter drop-shadow-[0_20px_60px_rgba(235,0,40,0.35)]"
            priority
          />
        </div>

        <PageHero
          title="Speakers"
          description="Visionary minds, researchers, and creators bringing ideas worth spreading to TEDxSMIU."
          gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
        />

        <section className="relative z-10 border-b border-neutral-800/80 bg-neutral-950 px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 sm:mb-10 flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setFilter(year)}
                  className={`rounded-none border px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
                    filter === year
                      ? "border-[#EB0028] bg-[#EB0028] text-white shadow-[0_0_12px_rgba(235,0,40,0.4)]"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="space-y-16">
              {loading
                ? Array.from({ length: 2 }).map((_, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-5">
                      <div className="h-7 w-40 animate-pulse rounded bg-neutral-800" />
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((__, cardIndex) => (
                          <Skeleton
                            key={cardIndex}
                            className="aspect-[3/4] w-full rounded-none border border-neutral-800 bg-neutral-900/60"
                          />
                        ))}
                      </div>
                    </div>
                  ))
                : filteredSections.map((section) => (
                    <div key={section.id} className="space-y-6">
                      <div className="flex flex-col gap-2 border-b border-neutral-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#EB0028]">
                            {section.status === "PAST" ? "Archive edition" : "Current edition"}
                          </span>
                          <h2 className="mt-2 font-helvetica text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                            {section.title}
                          </h2>
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          {section.theme}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
                        {section.speakers.map((s: any, i: number) => {
                          return (
                            <motion.div
                              key={s.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.15 }}
                              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                              onClick={() => setSelectedSpeaker(s)}
                              className="group relative mx-auto h-[19rem] w-full max-w-[16rem] cursor-pointer overflow-hidden border border-neutral-800 bg-[#090909] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#EB0028] hover:shadow-[0_0_26px_rgba(235,0,40,0.2)] sm:h-[21rem] sm:max-w-[17rem] md:h-[22rem] md:max-w-[18rem] lg:h-[24rem]"
                            >
                              <Image
                                src={normalizeImageSrc(s.image || "/images/speakers/speaker1.jpg")}
                                alt={s.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="absolute inset-0 h-full w-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                              />
                              <div className="absolute top-3 right-3 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                <ArrowUpRight className="h-4 w-4 stroke-[2.5] text-[#EB0028] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:h-4 sm:w-4" />
                              </div>

                              <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
                                <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EB0028] sm:text-xs">
                                    {s.tags?.[0] || "Speaker"}
                                  </span>
                                  <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{s.name}</h3>
                                  <p className="text-xs text-gray-200 sm:text-sm">{s.title}</p>
                                </div>

                                
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </div>

      {/* SPEAKER DETAILS POPUP MODAL DIALOG */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-white shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-y-auto p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative aspect-square w-full sm:w-44 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                    <Image
                      src={normalizeImageSrc(selectedSpeaker.image)}
                      alt={selectedSpeaker.name}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), 176px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#EB0028]">
                      TEDxSMIU Speaker
                    </span>

                    <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase text-white">
                      {selectedSpeaker.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-300 font-medium">
                      {selectedSpeaker.title}
                    </p>

                    {selectedSpeaker.tags && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedSpeaker.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-neutral-950 px-2.5 py-0.5 font-mono text-[10px] uppercase text-neutral-400"
                          >
                            <Tag className="h-2.5 w-2.5 text-[#EB0028]" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* DETAIL POPUP SOCIAL LINKS (ALWAYS FALLBACK DEMO LINKS IF EMPTY) */}
                    {parseSocialLinks(selectedSpeaker.socialLinks).length > 0 && (
                      <div className="mt-4 flex items-center gap-2 ">
                        {parseSocialLinks(selectedSpeaker.socialLinks).map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-[#EB0028] hover:scale-110 transition-all duration-200"
                          >
                            <SocialIcon url={url} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    About the Speaker
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedSpeaker.bio || "Biography details for this speaker will be updated soon."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}