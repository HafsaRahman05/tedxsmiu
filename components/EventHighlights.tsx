"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cleanImageUrl } from "@/lib/utils";

type EventSpeaker = {
  id: string;
  youtubeUrl: string | null;
  speaker: {
    name: string;
    headline: string | null;
    imageUrl: string | null;
  } | null;
};

type EventSponsor = {
  id: string;
  tier: string | null;
  sponsor: {
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
  } | null;
};

type EventHighlightsProps = {
  eventTitle: string;
  eventYear: number;
  speakers: EventSpeaker[];
  sponsors: EventSponsor[];
};

function useMarquee(itemCount: number) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [marquee, setMarquee] = useState({ copies: 2, distance: 0 });

  useEffect(() => {
    if (itemCount < 2) {
      setMarquee({ copies: 1, distance: 0 });
      return;
    }

    const viewport = viewportRef.current;
    const firstSet = firstSetRef.current;
    if (!viewport || !firstSet) return;

    const updateMarquee = () => {
      const distance = firstSet.getBoundingClientRect().width;
      const viewportWidth = viewport.clientWidth;
      if (!distance || !viewportWidth) return;

      setMarquee({
        copies: Math.max(2, Math.ceil(viewportWidth / distance) + 1),
        distance,
      });
    };

    updateMarquee();
    const observer = new ResizeObserver(updateMarquee);
    observer.observe(viewport);
    observer.observe(firstSet);
    return () => observer.disconnect();
  }, [itemCount]);

  return { viewportRef, firstSetRef, marquee };
}

export default function EventHighlights({
  eventTitle,
  eventYear,
  speakers,
  sponsors,
}: EventHighlightsProps) {
  const speakerMarquee = useMarquee(speakers.length);
  const sponsorMarquee = useMarquee(sponsors.length);

  return (
    <>
      {speakers.length > 0 && (
        <section id="talks" className="border-b border-white/10 bg-ink px-4 py-16 sm:px-6 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
                  The Stage · {eventYear}
                </span>
                <h2 className="mt-2 font-helvetica text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  Speakers ({speakers.length})
                </h2>
              </div>
              <Link
                href={`/speakers#event-year-${eventYear}`}
                className="inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary underline underline-offset-8 transition-colors hover:text-white sm:self-auto"
              >
                Show more speakers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              ref={speakerMarquee.viewportRef}
              role="region"
              aria-label={`${eventYear} event speakers`}
              className="speaker-marquee-viewport overflow-hidden py-2"
            >
              <div
                className="speaker-marquee-track"
                style={{
                  "--speaker-marquee-distance": `${-speakerMarquee.marquee.distance}px`,
                  "--speaker-marquee-duration": `${Math.max(speakerMarquee.marquee.distance / 40, 12)}s`,
                } as CSSProperties}
              >
                {Array.from({ length: speakerMarquee.marquee.copies }, (_, copyIndex) => (
                  <div
                    key={copyIndex}
                    ref={copyIndex === 0 ? speakerMarquee.firstSetRef : undefined}
                    aria-hidden={copyIndex > 0 || undefined}
                    className="speaker-marquee-copy flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                  >
                    {speakers.map((eventSpeaker, index) => {
                      const speaker = eventSpeaker.speaker;
                      return (
                        <article
                          key={`${copyIndex}-${eventSpeaker.id || index}`}
                          className="group relative h-[15rem] w-[12rem] shrink-0 overflow-hidden border border-neutral-800 bg-[#090909] text-white sm:h-64 sm:w-[13rem] md:h-[17rem] md:w-56 lg:h-[18rem] lg:w-[15rem]"
                        >
                          <Image
                            src={cleanImageUrl(speaker?.imageUrl, "/images/speakers/speaker1.jpg")}
                            alt={speaker?.name || "TEDx speaker"}
                            fill
                            sizes="240px"
                            className="object-cover object-top grayscale brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                          {eventSpeaker.youtubeUrl && (
                            <a
                              href={eventSpeaker.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={copyIndex === 0 ? undefined : -1}
                              aria-label={`Watch ${speaker?.name || "speaker"}'s talk`}
                              className="absolute right-3 top-3 border border-white/30 bg-black/75 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:border-primary hover:text-primary"
                            >
                              Watch talk
                            </a>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-primary">
                              {eventTitle}
                            </span>
                            <h3 className="mt-1 line-clamp-2 font-helvetica text-base font-black uppercase text-white sm:text-lg">
                              {speaker?.name || "TEDx Speaker"}
                            </h3>
                            <p className="mt-1 line-clamp-1 text-xs text-neutral-300">
                              {speaker?.headline || "Speaker"}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {sponsors.length > 0 && (
        <section id="partners" className="border-b border-white/10 bg-surface px-4 py-14 sm:px-6 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
                  Institutional Allies · {eventYear}
                </span>
                <h2 className="mt-2 font-helvetica text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Partners &amp; Sponsors
                </h2>
              </div>
              <Link
                href={`/partners#event-year-${eventYear}`}
                className="inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary underline underline-offset-8 transition-colors hover:text-white sm:self-auto"
              >
                Show more partners <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              ref={sponsorMarquee.viewportRef}
              role="region"
              aria-label={`${eventYear} event partners and sponsors`}
              className="sponsor-marquee-viewport overflow-hidden py-2"
            >
              <div
                className="sponsor-marquee-track"
                style={{
                  "--sponsor-marquee-distance": `${-sponsorMarquee.marquee.distance}px`,
                  "--sponsor-marquee-duration": `${Math.max(sponsorMarquee.marquee.distance / 45, 12)}s`,
                } as CSSProperties}
              >
                {Array.from({ length: sponsorMarquee.marquee.copies }, (_, copyIndex) => (
                  <div
                    key={copyIndex}
                    ref={copyIndex === 0 ? sponsorMarquee.firstSetRef : undefined}
                    aria-hidden={copyIndex > 0 || undefined}
                    className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                  >
                    {sponsors.map((eventSponsor, index) => {
                      const sponsor = eventSponsor.sponsor;
                      if (!sponsor) return null;

                      const logo = (
                        <span className="relative flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden bg-transparent transition-transform duration-300 hover:scale-[1.03] sm:h-28 sm:w-44">
                          {sponsor.logoUrl ? (
                            <Image
                              src={cleanImageUrl(sponsor.logoUrl, "/images/hero/hero1.png")}
                              alt={`${sponsor.name} logo`}
                              fill
                              sizes="176px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="line-clamp-3 text-center font-helvetica text-xs font-black uppercase text-black">
                              {sponsor.name}
                            </span>
                          )}
                        </span>
                      );

                      return sponsor.websiteUrl ? (
                        <a
                          key={`${copyIndex}-${eventSponsor.id || index}`}
                          href={sponsor.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${sponsor.name} website`}
                          tabIndex={copyIndex === 0 ? undefined : -1}
                          className="block shrink-0"
                        >
                          {logo}
                        </a>
                      ) : (
                        <div
                          key={`${copyIndex}-${eventSponsor.id || index}`}
                          aria-label={`${sponsor.name} logo`}
                          className="shrink-0"
                        >
                          {logo}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
