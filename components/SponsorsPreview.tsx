"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

type SponsorPreviewItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
};

function isSponsorPreviewItem(value: unknown): value is SponsorPreviewItem {
  if (typeof value !== "object" || value === null) return false;

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "logoUrl" in value &&
    typeof value.logoUrl === "string" &&
    value.logoUrl.trim().length > 0 &&
    "websiteUrl" in value &&
    (typeof value.websiteUrl === "string" || value.websiteUrl === null)
  );
}

export default function SponsorsPreview() {
  const [sponsorsList, setSponsorsList] = useState<SponsorPreviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [marquee, setMarquee] = useState({ copies: 1, distance: 0 });
  const galleryRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/sponsors")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Sponsors request failed: ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Sponsors response was not a list");
        }

        setSponsorsList(data.filter(isSponsorPreviewItem));
      })
      .catch((error: unknown) => {
        console.error("Unable to load sponsor logos for the homepage.", error);
        setSponsorsList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || sponsorsList.length < 2) {
      setMarquee({ copies: 1, distance: 0 });
      return;
    }

    const viewport = galleryRef.current;
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
  }, [loading, sponsorsList.length]);

  if (!loading && sponsorsList.length === 0) return null;

  return (
    <section
      id="partners"
      className="relative border-b border-white/10 bg-ink px-4 py-12 sm:px-6 sm:py-16 lg:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-3  pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.25em]">
              Together, Ideas Move Forward
            </span>
            <h2 className="mt-2 font-helvetica text-2xl font-black uppercase tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
              Our Partners
            </h2>
          </div>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary underline underline-offset-8 transition-colors hover:text-white sm:text-xs sm:tracking-[0.15em]"
          >
            View All Partners →
          </Link>
        </div>

        <div
          ref={galleryRef}
          role="region"
          aria-label="TEDxSMIU partners"
          className="sponsor-marquee-viewport mt-6 overflow-hidden py-2"
        >
          {loading ? (
            <div className="flex gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[5.5rem] w-[8rem] shrink-0 animate-pulse bg-surface sm:h-24 sm:w-36"
                />
              ))}
            </div>
          ) : (
            <div
              className="sponsor-marquee-track"
              style={{
                "--sponsor-marquee-distance": `${-marquee.distance}px`,
                "--sponsor-marquee-duration": `${Math.max(marquee.distance / 45, 12)}s`,
              } as CSSProperties}
            >
              {Array.from({ length: marquee.copies }, (_, copyIndex) => (
                <div
                  key={copyIndex}
                  ref={copyIndex === 0 ? firstSetRef : undefined}
                  aria-hidden={copyIndex > 0 || undefined}
                  className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {sponsorsList.map((sponsor) => {
                    const logo = (
                      <span className="relative block h-[5.5rem] w-[8rem] shrink-0 overflow-hidden transition-transform duration-300 hover:scale-[1.03] sm:h-24 sm:w-36">
                        <Image
                          src={sponsor.logoUrl}
                          alt={`${sponsor.name} logo`}
                          fill
                          sizes="(max-width: 940px) 200px, 144px"
                          className="object-cover"
                        />
                      </span>
                    );

                    return sponsor.websiteUrl ? (
                      <a
                        key={`${copyIndex}-${sponsor.id}`}
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
                        key={`${copyIndex}-${sponsor.id}`}
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
          )}
        </div>
      </div>
    </section>
  );
}
