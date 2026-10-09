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

type Props = {
  preview?: boolean;
  eventId?: string;
  eventTitle?: string;
  year?: number;
};

const PLACEHOLDER_CATEGORIES = [
  "Main stage moments",
  "Audience energy",
  "Speakers & talks",
  "Community highlights",
];

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
  const imageItems = collection.items.filter((item) => item.type === "IMAGE").slice(0, 4);
  const coverImage = imageItems[0]?.url ?? collection.coverImageUrl;
  const category = collection.albumName || "Event highlights";
  const date = collection.eventDate
    ? new Date(collection.eventDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;
  const mediaCount = collection.items.length;

  return (
    <Link
      href={galleryCollectionHref(collection)}
      className={`group relative isolate min-h-[230px] overflow-hidden border border-white/10 bg-[#101014] ${
        index % 5 === 0 ? "md:row-span-2 md:min-h-[470px]" : ""
      } ${index % 5 === 3 ? "md:col-span-2" : ""}`}
    >
      {imageItems.length > 1 ? (
        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1 transition-transform duration-700 group-hover:scale-[1.03]">
          {imageItems.map((item, imageIndex) => (
            <div
              key={item.id}
              className={`relative overflow-hidden ${
                imageIndex === 0 && imageItems.length === 3 ? "row-span-2" : ""
              }`}
            >
              <Image
                src={item.url}
                alt={item.altText || category}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : coverImage ? (
        <Image
          src={coverImage}
          alt={category}
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
      {collection.items.some((item) => item.type === "VIDEO") && (
        <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/60 text-white backdrop-blur">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
          <span className="border border-primary/70 bg-primary/15 px-2.5 py-1 text-white">
            {category}
          </span>
          {date && <span>{date}</span>}
        </div>
        <h3 className="max-w-xl font-helvetica text-2xl font-black uppercase leading-tight text-white sm:text-3xl">
          {collection.eventTitle}
        </h3>
        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
            {mediaCount} {mediaCount === 1 ? "moment" : "moments"}
            {collection.talks.some((talk) => talk.youtubeUrl)
              ? ` · ${collection.talks.filter((talk) => talk.youtubeUrl).length} talks`
              : ""}
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors group-hover:text-primary">
            Explore <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GalleryArchive({
  preview = false,
  eventId,
  eventTitle,
  year,
}: Props) {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All moments");

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

  const collections = useMemo(
    () => buildGalleryCollections(events, media),
    [events, media],
  );
  const eventCollections = useMemo(
    () => eventId
      ? collections.filter((collection) => collection.eventId === eventId)
      : collections,
    [collections, eventId],
  );
  const categories = useMemo(
    () => [
      "All moments",
      ...Array.from(
        new Set(eventCollections.map((collection) => collection.albumName || "Event highlights")),
      ),
    ],
    [eventCollections],
  );
  const filteredCollections =
    activeCategory === "All moments"
      ? eventCollections
      : eventCollections.filter(
          (collection) =>
            (collection.albumName || "Event highlights") === activeCategory,
        );
  const visibleCollections = preview
    ? filteredCollections.slice(0, 4)
    : filteredCollections;

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
              {eventTitle ? `TEDxSMIU ${year ?? ""}` : "From our events"}
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
                : "A living archive of the people, conversations, and moments that bring the TEDxSMIU community together."}
            </p>
          </div>
          {preview && (!eventId || filteredCollections.length > 0) && (
            <Link
              href={eventId ? `/gallery/${eventId}/all` : "/gallery"}
              className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-primary hover:text-white transition-colors underline underline-offset-8"
            >
              {eventId ? "Show more gallery" : "Visit the gallery"} <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {!preview && categories.length > 1 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0  px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  activeCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-white/15 bg-white/[0.02] text-neutral-400 hover:border-primary/60 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
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

        {!preview && !loading && !error && filteredCollections.length > 0 && (
          <p className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5" />
            Albums and categories are updated by the TEDxSMIU team
          </p>
        )}
      </div>
    </section>
  );
}
