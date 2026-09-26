"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import { Skeleton } from "@/components/ui/skeleton";
import type { Guest } from "@/types";

type GuestRecord = Guest & { headline?: string | null };

const guestSections = [
  { key: "Chief Guest", label: "Chief Guest" },
  { key: "Special Guest", label: "Special Guests" },
  { key: "VIP Guest", label: "VIP Guests" },
] as const;

export default function GuestsClient() {
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guests")
      .then((response) => response.json())
      .then((data) => setGuests(data.guests || []))
      .catch(() => setGuests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <PageHero title="Guest Appearances" description="Distinctive voices and special guests joining TEDxSMIU beyond the stage." gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)" />
      <section className="border-b border-neutral-800/80 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] w-full rounded-none border border-neutral-800 bg-neutral-900/60" />)}
            </div>
          ) : guests.length === 0 ? (
            <p className="border border-neutral-800 px-5 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">Guest profiles will be announced soon.</p>
          ) : (
              <div className="space-y-14">
              {guestSections.map((section) => {
                const sectionGuests = guests.filter((guest) =>
                  section.key === "VIP Guest"
                    ? !guest.guestType || !["Chief Guest", "Special Guest"].includes(guest.guestType)
                    : guest.guestType === section.key,
                );

                if (sectionGuests.length === 0) return null;

                return (
                  <div key={section.key}>
                    <div className="mb-6 flex items-end justify-between border-b border-neutral-800 pb-4">
                      <div>
                        <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#EB0028]">In conversation with TEDxSMIU</span>
                        <h3 className="mt-2 font-helvetica text-[20px] font-black uppercase tracking-tight text-white sm:text-2xl">{section.label}</h3>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{sectionGuests.length} {sectionGuests.length === 1 ? "profile" : "profiles"}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {sectionGuests.map((guest, index) => (
                        <motion.button type="button" key={guest.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4, delay: (index % 4) * 0.06 }} onClick={() => setSelectedGuest(guest)} className="group relative mx-auto h-[19rem] w-full max-w-[16rem] cursor-pointer overflow-hidden border border-neutral-800 bg-[#090909] text-left text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#EB0028] hover:shadow-[0_0_26px_rgba(235,0,40,0.2)] sm:h-[21rem] sm:max-w-[17rem] md:h-[22rem] md:max-w-[18rem] lg:h-[24rem]">
                          <Image src={guest.image} alt={guest.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="absolute inset-0 h-full w-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          <ArrowUpRight className="absolute right-3 top-3 z-20 h-4 w-4 text-[#EB0028] opacity-0 transition-opacity group-hover:opacity-100" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <AnimatePresence>
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGuest(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-neutral-800 bg-neutral-900 p-5 text-white shadow-2xl sm:p-8"><button type="button" onClick={() => setSelectedGuest(null)} aria-label="Close guest details" className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-white"><X className="h-5 w-5" /></button><div className="flex flex-col items-start gap-6 sm:flex-row"><div className="relative aspect-square w-full shrink-0 overflow-hidden border border-neutral-800 bg-neutral-950 sm:w-44"><Image src={selectedGuest.image} alt={selectedGuest.name} fill className="object-cover" /></div><div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#EB0028]">TEDxSMIU Guest</span><h2 className="mt-1 font-display text-2xl font-black uppercase text-white sm:text-3xl">{selectedGuest.name}</h2><p className="mt-1 text-sm text-neutral-300">{selectedGuest.title}</p></div></div><div className="mt-6 border-t border-neutral-800 pt-6"><h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">About the guest</h4><p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">{selectedGuest.bio || "Guest biography details will be updated soon."}</p></div></motion.div></div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}