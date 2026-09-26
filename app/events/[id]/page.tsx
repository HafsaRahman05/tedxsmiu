import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Mic, ArrowLeft, ExternalLink, Award } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { events, eventSpeakers, eventSponsors } from "@/lib/db/schema";
import { eq, and, isNull, or, asc } from "drizzle-orm";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { cleanImageUrl } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const event = await db.query.events.findFirst({
      where: and(
        isNull(events.deletedAt),
        or(eq(events.id, id), eq(events.slug, id))
      ),
    });

    if (!event) return constructMetadata({ title: "Event Not Found", noIndex: true });

    return constructMetadata({
      title: `${event.title} — ${event.theme || "TEDxSMIU"}`,
      description: event.description || "Official TEDxSMIU flagship event at Sindh Madressatul Islam University.",
      path: `/events/${event.slug || event.id}`,
    });
  } catch {
    return constructMetadata({ title: "Event | TEDxSMIU", path: `/events/${id}` });
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  let eventDetail: any = null;
  try {
    eventDetail = await db.query.events.findFirst({
      where: and(
        isNull(events.deletedAt),
        or(eq(events.id, id), eq(events.slug, id))
      ),
      with: {
        eventSpeakers: {
          with: {
            speaker: true,
          },
          orderBy: [asc(eventSpeakers.sortOrder)],
        },
        eventSponsors: {
          with: {
            sponsor: true,
          },
          orderBy: [asc(eventSponsors.sortOrder)],
        },
      },
    });
  } catch (err) {
    console.error("Error fetching event details:", err);
  }

  if (!eventDetail) {
    notFound();
  }

  const eventYear = eventDetail.date ? new Date(eventDetail.date).getFullYear().toString() : "2023";
  const formattedDate = eventDetail.date
    ? new Date(eventDetail.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Wednesday, September 20, 2023";

  const speakersList = eventDetail.eventSpeakers || [];
  const sponsorsList = eventDetail.eventSponsors || [];
  const safeCoverImage = cleanImageUrl(eventDetail.coverImageUrl, "/images/hero/smiu garden view.jpg");

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" },
          { name: eventDetail.title, item: `/events/${eventDetail.slug || eventDetail.id}` },
        ])}
      />

      {/* 1. Editorial Event Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black pt-28 sm:pt-36 pb-16 lg:pt-40 lg:pb-24 text-white">
        
        {/* Background Image with Vignette */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src={safeCoverImage}
            alt={eventDetail.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay bg-repeat"
            style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')", backgroundSize: "400px auto" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          
          {/* Back Navigation Link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Events
          </Link>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-primary/40 bg-primary/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  {eventDetail.status === "PAST" ? "Archived Flagship Edition" : "Upcoming Event"}
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  Edition // {eventYear}
                </span>
              </div>

              <h1 className="mt-4 font-helvetica text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.92]">
                {eventDetail.title}
              </h1>

              {eventDetail.theme && (
                <div className="mt-3 font-helvetica text-2xl sm:text-3xl font-bold text-neutral-200">
                  Theme: <span className="text-primary font-black">&ldquo;{eventDetail.theme}&rdquo;</span>
                </div>
              )}
            </div>

            {/* Quick Metrics Tile */}
            <div className="lg:col-span-4 border border-white/15 bg-surface/80 p-5 sm:p-6 backdrop-blur-md">
              <div className="space-y-3 font-mono text-xs text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-400">Date</span>
                    <span className="text-white font-bold">{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-white/10 pt-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-400">Venue</span>
                    <span className="text-white font-bold">{eventDetail.venue || "Sir Shahnawaz Bhutto Auditorium"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-400">Capacity</span>
                    <span className="text-white font-bold">{eventDetail.capacity || 300} Delegates</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-400">Speakers</span>
                    <span className="text-primary font-bold">{speakersList.length || 11} Talks</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Event Narrative & Curatorial Description */}
      <section className="border-b border-white/10 bg-surface px-4 sm:px-6 py-16 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            
            <div className="lg:col-span-4">
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Curatorial Statement
              </span>
              <h2 className="mt-2 font-helvetica text-2xl sm:text-3xl font-black uppercase text-white">
                Transforming Thought Into Reality
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="prose prose-invert max-w-none font-helvetica text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300 space-y-4 whitespace-pre-line">
                {eventDetail.description || "Together, we witnessed the transformation of thought into tangible reality."}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Keynote Talks & Curated Speakers */}
      {speakersList.length > 0 && (
        <section id="talks" className="border-b border-white/10 bg-ink px-4 sm:px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            
            <div className="border-b border-white/10 pb-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  The Stage
                </span>
                <h2 className="mt-2 font-helvetica text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                  Keynote Talks &amp; Speakers ({speakersList.length})
                </h2>
              </div>
              <span className="font-mono text-xs text-neutral-400">
                Delivered Live at SMIU
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakersList.map((es: any, idx: number) => {
                const sp = es.speaker || {};
                const speakerPhoto = cleanImageUrl(sp.imageUrl, "/images/speakers/speaker1.jpg");

                return (
                  <div
                    key={es.id || idx}
                    className="border border-white/10 bg-surface flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-primary group"
                  >
                    <div>
                      {/* Speaker Photo */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                        <Image
                          src={speakerPhoto}
                          alt={sp.name || "Speaker"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top filter grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="border border-white/20 bg-ink/90 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                            Talk 0{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-helvetica text-lg font-black uppercase text-white group-hover:text-primary transition-colors">
                          {sp.name || "TEDx Speaker"}
                        </h3>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400 font-semibold line-clamp-1">
                          {sp.headline || "Speaker"}
                        </p>

                        <div className="mt-4 pt-3 border-t border-white/5">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary block">
                            Talk Title
                          </span>
                          <h4 className="mt-1 font-helvetica text-base font-bold text-white">
                            {es.talkTitle || "TEDx Keynote Talk"}
                          </h4>
                          {es.abstract && (
                            <p className="mt-2 text-xs text-neutral-300 leading-relaxed line-clamp-3">
                              {es.abstract}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                      <span>Sir Shahnawaz Bhutto Auditorium</span>
                      {es.youtubeUrl && (
                        <a
                          href={es.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                          Watch Talk <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 4. Event Sponsors & Institutional Partners */}
      {sponsorsList.length > 0 && (
        <section className="border-b border-white/10 bg-surface px-4 sm:px-6 py-16 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            
            <div className="border-b border-white/10 pb-6 mb-10">
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Institutional Allies
              </span>
              <h2 className="mt-2 font-helvetica text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Partners &amp; Sponsors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sponsorsList.map((esp: any, idx: number) => {
                const sp = esp.sponsor || {};
                return (
                  <div
                    key={esp.id || idx}
                    className="border border-white/10 bg-ink p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-primary"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-primary font-bold uppercase tracking-widest pb-3 border-b border-white/5">
                        <span>Tier: {esp.tier || sp.tier || "PARTNER"}</span>
                        <Award className="h-3.5 w-3.5" />
                      </div>

                      <h3 className="mt-4 font-helvetica text-xl font-bold uppercase text-white">
                        {sp.name || "Partner"}
                      </h3>
                    </div>

                    {sp.websiteUrl && (
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-primary transition-colors"
                      >
                        Visit Partner Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 5. Venue Information & Directions */}
      <section className="bg-ink px-4 sm:px-6 py-16 sm:py-20 lg:px-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="border border-white/15 bg-surface p-6 sm:p-10 lg:p-12 grid gap-8 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-8">
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Venue &amp; Location
              </span>
              <h3 className="mt-2 font-helvetica text-2xl sm:text-3xl font-black uppercase text-white">
                Sir Shahnawaz Bhutto Auditorium
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                Sindh Madressatul Islam University, I.I. Chundrigar Road, Karachi 74000, Pakistan. A premier 300-seat acoustic hall equipped with broadcast infrastructure and accessible seating.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Button
                asChild
                className="w-full rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-[0.15em] py-6 hover:bg-white hover:text-black border border-primary transition-all"
              >
                <Link href="/contact">
                  Contact Curatorial Team →
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>
    </PageShell>
  );
}
