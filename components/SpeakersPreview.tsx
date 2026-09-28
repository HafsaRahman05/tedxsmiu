"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import type { Speaker } from "@/types";
import { cleanImageUrl } from "@/lib/utils";

const SPEAKER_FALLBACK_IMAGE = "/images/team/lead.jpg";
type SpeakerSocialLink = { url: string; label: string };

function normalizeSocialLinks(value: Speaker["socialLinks"]): SpeakerSocialLink[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .filter((link) => link && typeof link.url === "string")
      .map((link) => ({ url: link.url, label: link.platform || "Social link" }));
  }

  if (typeof value === "string") {
    try {
      return normalizeSocialLinks(JSON.parse(value));
    } catch {
      return value.trim() ? [{ url: value.trim(), label: "Social link" }] : [];
    }
  }

  return [];
}

function SocialLinkIcon({ url }: { url: string }) {
  const value = url.toLowerCase();
  if (value.includes("instagram")) return <FaInstagram className="h-3.5 w-3.5" />;
  if (value.includes("linkedin")) return <FaLinkedinIn className="h-3.5 w-3.5" />;
  if (value.includes("facebook")) return <FaFacebookF className="h-3.5 w-3.5" />;
  if (value.includes("twitter") || value.includes("x.com")) return <FaXTwitter className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}

export default function SpeakersPreview() {
  const [speakersList, setSpeakersList] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasScrolledGallery, setHasScrolledGallery] = useState(false);

  useEffect(() => {
    fetch("/api/speakers")
      .then((r) => r.json())
      .then((d) => {
        if (d.speakers && d.speakers.length > 0) {
          // Keep the latest event year's speakers together, prioritizing featured names.
          const priority = ["ali-zaryoun", "fahad", "bizenjo", "yousuf", "qureshi", "azekah"];
          const sorted = [...d.speakers].sort((a, b) => {
            const yearDifference = (Number(b.eventYear) || 0) - (Number(a.eventYear) || 0);
            if (yearDifference !== 0) return yearDifference;

            const aName = (a.name || "").toLowerCase();
            const bName = (b.name || "").toLowerCase();
            const aIdx = priority.findIndex((p) => aName.includes(p));
            const bIdx = priority.findIndex((p) => bName.includes(p));
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return 0;
          });
          const latestYear = Math.max(...sorted.map((speaker) => Number(speaker.eventYear) || 0));
          setSpeakersList(sorted.filter((speaker) => Number(speaker.eventYear) === latestYear));
        }
      })
      .catch(() => {
        setSpeakersList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="speakers" className="relative border-b border-white/10 bg-ink px-4 sm:px-6 py-16 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              The Voice of TEDxSMIU
            </span>
            <h2 className="mt-2 sm:mt-3 font-helvetica text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              Featured Speakers
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/speakers"
              className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary hover:text-white transition-colors underline underline-offset-8"
            >
              View All Speakers &amp; Talks →
            </Link>
          </div>
        </div>

        {/* Horizontal editorial speaker gallery */}
        <div className="relative mt-8 sm:mt-12">
          <div
            onScroll={(event) => {
              if (event.currentTarget.scrollLeft > 8) setHasScrolledGallery(true);
            }}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
          >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[19rem] w-[16rem] shrink-0 snap-start animate-pulse border border-white/10 bg-surface sm:h-[21rem] sm:w-[17rem] md:h-[22rem] md:w-[18rem] lg:h-[24rem]"
                />
              ))
            : speakersList.map((speaker, idx) => {
                const safeImage = cleanImageUrl(speaker.image, SPEAKER_FALLBACK_IMAGE);
                return (
                  <motion.button
                    type="button"
                    key={speaker.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                    onClick={() => setSelectedSpeaker(speaker)}
                    className="group relative h-[19rem] w-[16rem] shrink-0 snap-start cursor-pointer overflow-hidden border border-neutral-800 bg-[#090909] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#EB0028] hover:shadow-[0_0_26px_rgba(235,0,40,0.2)] sm:h-[21rem] sm:w-[17rem] md:h-[22rem] md:w-[18rem] lg:h-[24rem]"
                  >
                    <Image
                      src={safeImage}
                      alt={speaker.name}
                      fill
                      priority={idx < 4}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="touch-normal-image absolute inset-0 h-full w-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                    />
                    <div className="absolute top-3 right-3 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5] text-[#EB0028] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                    </div>
                      <div className="relative z-10 flex h-full flex-col justify-end p-4 text-left sm:p-5">
                      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
                        {/* <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EB0028] sm:text-xs">
                          {speaker.tags?.[0] || "Speaker"}
                        </span> */}
                        <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{speaker.name}</h3>
                        <p className="text-xs text-gray-200 sm:text-sm">{speaker.title}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
          </div>
          {!loading && speakersList.length > 1 && !hasScrolledGallery && (
            <div aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-0.5 px-2 py-1 text-[9px] font-mono uppercase text-white/70">
              <ArrowRight className="h-3 w-3" />
              <span>Swipe Left</span>
              
            </div>
          )}
        </div>

      </div>
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.button type="button" aria-label="Close speaker details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSpeaker(null)} className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md" />
            <motion.div role="dialog" aria-modal="true" aria-labelledby="preview-speaker-title" initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-left text-white shadow-2xl">
              <button type="button" onClick={() => setSelectedSpeaker(null)} aria-label="Close speaker details" className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-neutral-400 transition-colors hover:text-white"><X className="h-5 w-5" /></button>
              <div className="overflow-y-auto p-5 sm:p-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 sm:w-44"><Image src={cleanImageUrl(selectedSpeaker.image, SPEAKER_FALLBACK_IMAGE)} alt={selectedSpeaker.name} fill className="object-cover" /></div>
                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#EB0028]">TEDxSMIU Speaker</span>
                    <h2 id="preview-speaker-title" className="mt-1 font-display text-2xl font-black uppercase text-white sm:text-3xl">{selectedSpeaker.name}</h2>
                    <p className="mt-1 text-sm font-medium text-neutral-300">{selectedSpeaker.title}</p>
                    {/* {selectedSpeaker.tags?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{selectedSpeaker.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 bg-neutral-950 px-2.5 py-0.5 font-mono text-[10px] uppercase text-neutral-400"><Tag className="h-2.5 w-2.5 text-[#EB0028]" />{tag}</span>)}</div>} */}
                    {normalizeSocialLinks(selectedSpeaker.socialLinks).length > 0 && <div className="mt-4 flex items-center gap-2">{normalizeSocialLinks(selectedSpeaker.socialLinks).map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label} className="text-neutral-400 transition-all duration-200 hover:scale-110 hover:text-[#EB0028]"><SocialLinkIcon url={link.url} /></a>)}</div>}
                  </div>
                </div>
                <div className="mt-6 border-t border-neutral-800 pt-6"><h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">About the Speaker</h4><p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">{selectedSpeaker.bio || "Biography details for this speaker will be updated soon."}</p></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}