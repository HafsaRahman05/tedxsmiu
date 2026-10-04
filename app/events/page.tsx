import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PastEventCard from "@/components/PastEventCard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Events | TEDxSMIU",
  description:
    "Explore upcoming and past TEDxSMIU flagship events, curatorial themes, keynote speakers, and venue archives at Sindh Madressatul Islam University.",
  path: "/events",
});

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let eventList: any[] = [];
  try {
    eventList = await db.query.events.findMany({
      where: isNull(events.deletedAt),
      orderBy: [desc(events.date)],
      with: {
        eventSpeakers: {
          with: {
            speaker: true,
          },
        },
        eventSponsors: {
          with: {
            sponsor: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Failed to fetch events from database:", err);
    eventList = [];
  }

  // Separate upcoming vs past events
  const pastEvents = eventList.filter((e) => e.status === "PAST");
  const upcomingEvents = eventList.filter((e) => e.status === "UPCOMING" || e.status === "ACTIVE");
  const nextEvent = upcomingEvents[0];
  const nextEventDate = nextEvent?.date
    ? new Date(nextEvent.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" },
        ])}
      />
      <PageHero
        title="Events"
        description="A continuum of radical inquiry, live talks, and transformative ideas at Sindh Madressatul Islam University."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />

      {/* 1. Announced Event Spotlight */}
      {/* <section className="bg-ink px-4 sm:px-6 py-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="border border-white/15 bg-surface p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-repeat"
              style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')", backgroundSize: "400px auto" }}
            />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="flex flex-col lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    <span className="h-2 w-2 rounded-none bg-primary animate-pulse" />
                    Event Live
                  </span>
                  <span className="text-neutral-500 font-mono text-xs hidden sm:inline">•</span>
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400">
                    Convergence 2026
                  </span>
                </div>

                <h2 className="mt-3 font-helvetica text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  <span className="font-black text-primary">TEDx</span>SMIU — Convergence
                </h2>

                <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
                  A full day of talks, installations, and conversation exploring where human ideas are headed next. Join a curated gathering of thinkers, builders, and changemakers at the heart of SMIU.
                </p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg font-mono">
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">11</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">Speakers</span>
            </div>
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">300</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">Delegates</span>
            </div>
            <div className="border border-white/10 bg-ink p-2.5 sm:p-3 text-center">
              <span className="block text-lg sm:text-2xl font-black text-primary">100%</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400">SMIU Powered</span>
            </div>
          </div>
       
              </div>
              

              <div className="flex flex-col justify-between border border-white/15 bg-gradient-to-b from-surface-raised via-surface to-ink p-5 sm:p-8 text-center lg:col-span-5 h-full relative">
                <div className="border-b border-white/10 pb-5 sm:pb-6">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] text-neutral-400 uppercase">
                    Event Status
                  </span>
                  <div className="mt-2 font-helvetica text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                    Announced
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary mt-2">
                    Convergence 2026
                  </div>
                  <div className="mt-2 text-[11px] sm:text-xs text-neutral-300 font-mono">
                    Main Auditorium • Sindh Madressatul Islam University, Karachi
                  </div>
                </div>
              
                <div className="pt-5 sm:pt-6">
                  <Button
                    asChild
                    className="w-full rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] py-5 sm:py-6 hover:bg-white hover:text-black border border-primary transition-all duration-300"
                  >
                    <Link href="/tickets">
                      Reserve Your Pass →
                    </Link>
                  </Button>

                  <span className="mt-3 block font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400">
                    *Get updates on speakers, ticket drops, and community access.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* 2. Past Flagship Events Archive */}
      <section className="px-4 sm:px-6 py-2 lg:px-12 text-white">
        <div className="mx-auto w-full max-w-7xl">
          
          {/* <div className="border-b border-white/10 pb-8 mb-12">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Event Archive
            </span>
            <h2 className="mt-2 font-helvetica text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              Past Flagship Editions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl">
              Relive the milestone gathe rings, provocative ideas, and groundbreaking talks delivered on the TEDxSMIU stage.
            </p>
          </div> */}

          <div className="space-y-12 sm:space-y-16">
            {pastEvents.length > 0 ? (
              pastEvents.map((ev, idx) => {
                const eventYear = ev.date ? new Date(ev.date).getFullYear().toString() : "2023";
                const formattedDate = ev.date
                  ? new Date(ev.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "September 20, 2023";

                return (
                  <PastEventCard
                    key={ev.id}
                    id={ev.id}
                    slug={ev.slug}
                    year={eventYear}
                    title={ev.title}
                    theme={ev.theme}
                    date={formattedDate}
                    venue={ev.venue || "Sir Shahnawaz Bhutto Auditorium, SMIU"}
                    description={ev.description || "Together, we witnessed the transformation of thought into tangible reality."}
                    image={
                      eventYear === "2023"
                        ? "https://res.cloudinary.com/rhgtzwu8/image/upload/v1790569694/copy_of_from_riveting_talks_to_awe-inspiring_performances_tedxsmiu_was_an_event_to_remember_take.webp"
                        : ev.coverImageUrl || "/images/hero/smiu garden view.jpg"
                    }
                    speakersCount={ev.eventSpeakers?.length || 11}
                    capacity={ev.capacity || 300}
                    reverse={idx % 2 !== 0}
                  />
                );
              })
            ) : (
              /* Safe Fallback for 2023 Landmark Event */
              <PastEventCard
                id="31091f15-610e-45dd-8722-9726d723fa63"
                slug="2023"
                year="2023"
                title="TEDxSMIU 2023"
                theme="Break The Shackles"
                date="September 20, 2023"
                venue="Sir Shahnawaz Bhutto Auditorium"
                description="Let this be the day we remember, let it not mark an end, but rather a beginning in the historic legacy of Sindh Madressatul Islam University (SMIU). Together, we witnessed the transformation of thought into tangible reality."
                image="https://res.cloudinary.com/rhgtzwu8/image/upload/v1790569694/copy_of_from_riveting_talks_to_awe-inspiring_performances_tedxsmiu_was_an_event_to_remember_take.webp"
                speakersCount={11}
                capacity={300}
              />
            )}
          </div>

        </div>
      </section>
    </PageShell>
  );
}