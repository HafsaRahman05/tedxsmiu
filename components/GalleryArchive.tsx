"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Play } from "lucide-react";
import {
  buildGalleryCollections,
  galleryCollectionHref,
  type GalleryCollection,
  type GalleryEvent,
  type GalleryMedia,
} from "@/lib/gallery";
import { editionYearFromEvent } from "@/lib/editions";

type Props = {
  preview?: boolean;
  eventId?: string;
  eventTitle?: string;
  year?: number;
  initialEdition?: string;
};

const PINNED_EDITIONS = [2026, 2023];

const PLACEHOLDER_CATEGORIES = [
  "Main stage moments",
  "Audience energy",
  "Speakers & talks",
  "Community highlights",
];

function readEdition(value?: string | null) {
  if (!value || value.toLowerCase() === "all") return "All";
  return /^(19|20)\d{2}$/.test(value) ? value : "All";
}

function mediaEditionYear(item: GalleryMedia, events: GalleryEvent[]) {
  if (item.year) return item.year;
  const event = events.find((candidate) => candidate.id === item.eventId);
  return editionYearFromEvent(event);
}

function GalleryPlaceholder({
  index,
  eventTitle,
}: {
  index: number;
  eventTitle?: string;
}) {
  return (
    <div
      className={`group relative isolate min-h-[230px] overflow-hidden border border-white/15 bg-[#101014] ${
        index === 0 ? "md:row-span-2 md:min-h-[470px]" : ""
      } ${index === 3 ? "md:col-span-2" : ""}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-repeat bg-[length:300px_auto] opacity-[0.045] mix-blend-screen sm:bg-[length:380px_auto]"
        style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 transition-colors group-hover:from-black/80" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
          {eventTitle || "TEDxSMIU · Past events"}
        </span>
        <h3 className="mt-2 max-w-sm font-helvetica text-lg font-black uppercase leading-tight text-white sm:text-xl">
          {PLACEHOLDER_CATEGORIES[index]}
        </h3>
      </div>
    </div>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: GalleryCollection;
  index: number;
}) {
  const coverImage =
    collection.items.find((item) => item.type === "IMAGE")?.url ??
    collection.coverImageUrl;
  const category = collection.albumName || "Event highlights";

  return (
    <Link
      href={galleryCollectionHref(collection)}
      className={`group relative isolate min-h-[230px] overflow-hidden border border-white/10 bg-[#101014] ${
        index % 5 === 0 ? "md:row-span-2 md:min-h-[470px]" : ""
      } ${index % 5 === 3 ? "md:col-span-2" : ""}`}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={collection.albumName || collection.eventTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[#17090d] bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/images/branding/PATTERN - red.png')" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
      <span className="absolute left-5 bottom-5 border border-primary/70 bg-black/70 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-7 sm:bottom-7">
        {category}
      </span>
      {collection.items.some((item) => item.type === "VIDEO") && (
        <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/60 text-white backdrop-blur">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}
    </Link>
  );
}

export default function GalleryArchive({
  preview = false,
  eventId,
  eventTitle,
  year,
  initialEdition,
}: Props) {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [edition, setEdition] = useState(() => readEdition(initialEdition));
  const showEditionFilter = !preview && !eventId;

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        const [eventsResponse, mediaResponse] = await Promise.all([
          fetch("/api/events", { signal: controller.signal }),
          fetch(
            eventId ? `/api/media?eventId=${encodeURIComponent(eventId)}` : "/api/media",
            { signal: controller.signal },
          ),
        ]);
        if (!eventsResponse.ok || !mediaResponse.ok) {
          throw new Error("Gallery data could not be loaded.");
        }

        const [eventData, mediaData] = await Promise.all([
          eventsResponse.json(),
          mediaResponse.json(),
        ]);
        setEvents(eventData);
        setMedia(mediaData);
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") return;
        console.error("Unable to load the TEDxSMIU gallery:", cause);
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadGallery();
    return () => controller.abort();
  }, [eventId]);

  const editions = useMemo(() => {
    const years = new Set<number>(PINNED_EDITIONS);
    for (const event of events) {
      const eventYear = editionYearFromEvent(event);
      if (eventYear) years.add(eventYear);
    }
    for (const item of media) {
      const itemYear = mediaEditionYear(item, events);
      if (itemYear) years.add(itemYear);
    }
    return ["All", ...Array.from(years).sort((yearA, yearB) => yearB - yearA).map(String)];
  }, [events, media]);

  const scopedMedia = useMemo(() => {
    if (!showEditionFilter || edition === "All") return media;
    return media.filter((item) => String(mediaEditionYear(item, events) ?? "") === edition);
  }, [edition, events, media, showEditionFilter]);

  const collections = useMemo(
    () => buildGalleryCollections(
      events,
      scopedMedia,
      showEditionFilter ? edition === "All" : !eventId,
    ),
    [edition, eventId, events, scopedMedia, showEditionFilter],
  );
  const eventCollections = useMemo(
    () => eventId
      ? collections.filter((collection) => collection.eventId === eventId)
      : collections,
    [collections, eventId],
  );
  const visibleCollections = preview
    ? eventCollections.slice(0, 4)
    : eventCollections;

  useEffect(() => {
    if (!showEditionFilter) return;
    const syncFromUrl = () => setEdition(readEdition(new URLSearchParams(window.location.search).get("year")));
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [showEditionFilter]);

  const chooseEdition = (next: string) => {
    setEdition(next);
    if (!showEditionFilter) return;
    const url = next === "All" ? "/gallery" : `/gallery?year=${next}`;
    window.history.pushState(null, "", url);
  };

  return (
    <section
      id="gallery"
      className={`relative isolate overflow-hidden border-b border-white/10 bg-black px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24 ${
        preview ? "" : "pt-28 sm:pt-32 lg:pt-36"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-repeat bg-[length:300px_auto] opacity-[0.065] mix-blend-screen sm:bg-[length:380px_auto] lg:bg-[length:460px_auto]"
        style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              <span className="h-px w-5 bg-primary" />
              {eventTitle
                ? `TEDxSMIU ${year ?? ""}`
                : showEditionFilter && edition !== "All"
                  ? `TEDxSMIU ${edition}`
                  : "From our events"}
            </span>
            <h2 className="mt-4 font-helvetica text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              {eventTitle ? (
                <>Event <span className="italic text-primary">Gallery</span></>
              ) : (
                <>Where ideas <span className="italic text-primary">ignite</span></>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              {eventTitle
                ? `Photos, videos, and speaker talks from ${eventTitle}.`
                : showEditionFilter && edition !== "All"
                  ? `Photographs, videos, and talks from the ${edition} edition.`
                  : "A living archive of the people, conversations, and moments that bring the TEDxSMIU community together."}
            </p>
          </div>
          {preview && (!eventId || eventCollections.length > 0) && (
            <Link
              href={eventId ? `/gallery/${eventId}/all` : "/gallery"}
              className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary hover:text-white transition-colors underline underline-offset-8"
            >
              {eventId ? "Show more gallery" : "Visit the gallery"} <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {showEditionFilter && (
          <div className="mb-8">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-neutral-400 sm:text-sm">
              Event edition
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {editions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseEdition(option)}
                  className={`shrink-0 border px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] transition-colors sm:px-6 sm:py-3.5 sm:text-base ${
                    edition === option
                      ? "border-primary bg-primary text-white"
                      : "border-white/15 bg-white/[0.02] text-neutral-400 hover:border-primary/60 hover:text-white"
                  }`}
                >
                  {option === "All" ? "All events" : option}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: preview ? 3 : 6 }).map((_, index) => (
              <div
                key={index}
                className={`min-h-[230px] animate-pulse  bg-white/[0.035] ${
                  index === 0 ? "md:row-span-2 md:min-h-[470px]" : ""
                }`}
              />
            ))}
          </div>
        ) : error ? (
          <div className=" bg-white/[0.03] px-6 py-12 text-center">
            <p className="text-sm text-neutral-300">
              The gallery could not be loaded right now. Please try again shortly.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : showEditionFilter && edition !== "All" && visibleCollections.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <p className="font-helvetica text-2xl font-black uppercase text-white">
              TEDxSMIU {edition}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
              Photographs from this edition will appear here once they are added to the {edition} event.
            </p>
          </div>
        ) : visibleCollections.length > 0 ? (
          <div className="grid auto-rows-[minmax(230px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCollections.map((collection, index) => (
              <CollectionCard
                key={collection.key}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        ) : eventId ? (
          <div className="grid auto-rows-[minmax(230px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_CATEGORIES.map((_, index) => (
              <GalleryPlaceholder
                key={index}
                index={index}
                eventTitle={`${eventTitle || "TEDxSMIU"} · ${year ?? ""}`}
              />
            ))}
          </div>
        ) : (
          <div className="grid auto-rows-[minmax(230px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_CATEGORIES.map((_, index) => (
              <GalleryPlaceholder key={index} index={index} />
            ))}
          </div>
        )}

        {!preview && !loading && !error && visibleCollections.length > 0 && (
          <p className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5" />
            Albums and categories are updated by the TEDxSMIU team
          </p>
        )}
      </div>
    </section>
  );
}
