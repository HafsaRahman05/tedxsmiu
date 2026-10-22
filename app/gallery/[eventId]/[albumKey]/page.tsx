import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDownToLine, ArrowLeft, ExternalLink, Play } from "lucide-react";
import { and, asc, desc, eq, isNull, or } from "drizzle-orm";
import PageShell from "@/components/PageShell";
import { db } from "@/lib/db";
import { events, eventSpeakers, media } from "@/lib/db/schema";
import { decodeGalleryAlbum } from "@/lib/gallery";
import { cleanImageUrl } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import GalleryImagePreview from "@/components/GalleryImagePreview";

const MOSAIC_TILE_CLASSES = [
  "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
  "col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1",
  "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 lg:col-span-1 lg:row-span-2",
  "col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-2 lg:row-span-1",
  "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1",
  "col-span-1 row-span-2 sm:col-span-2 sm:row-span-1 lg:col-span-1 lg:row-span-2",
  "col-span-2 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-1",
  "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1",
] as const;

type Props = { params: Promise<{ eventId: string; albumKey: string }> };

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Gallery Collection",
  description: "Photographs, videos, and speaker talks from TEDxSMIU events.",
  path: "/gallery",
});

function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
      return id
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`
        : null;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function getDownloadUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "res.cloudinary.com" && parsed.pathname.includes("/upload/")) {
      parsed.pathname = parsed.pathname.replace("/upload/", "/upload/fl_attachment/");
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}

function getFileName(url: string, fallback: string) {
  try {
    const fileName = new URL(url).pathname.split("/").pop();
    return fileName ? decodeURIComponent(fileName) : fallback;
  } catch {
    return fallback;
  }
}

export default async function GalleryCollectionPage({ params }: Props) {
  const { eventId, albumKey } = await params;
  const acrossEvents = eventId === "category";
  const showAllAlbums = albumKey === "all";
  const albumName = showAllAlbums ? null : decodeGalleryAlbum(albumKey);
  if (albumName === undefined) notFound();

  const event =
    eventId === "community" || acrossEvents
      ? null
      : await db.query.events.findFirst({
          where: and(eq(events.id, eventId), isNull(events.deletedAt)),
          with: {
            eventSpeakers: {
              orderBy: [asc(eventSpeakers.sortOrder)],
              with: { speaker: true },
            },
          },
        });

  if (eventId !== "community" && !acrossEvents && !event) notFound();

  const conditions = acrossEvents
    ? []
    : [eventId === "community" ? isNull(media.eventId) : eq(media.eventId, eventId)];
  if (!showAllAlbums) {
    conditions.push(albumName === null ? isNull(media.albumName) : eq(media.albumName, albumName));
  }
  if (event) {
    conditions.push(or(
      eq(media.year, new Date(event.date).getFullYear()),
      isNull(media.year),
    )!);
  }
  const assets = await db
    .select()
    .from(media)
    .where(and(...conditions))
    .orderBy(desc(media.createdAt));
  const talks =
    event?.eventSpeakers.filter((item) => item.youtubeUrl) ?? [];

  if (assets.length === 0 && talks.length === 0) notFound();

  const title = showAllAlbums
    ? "Event Gallery"
    : albumName || "Community highlights";
  const displayTitle = event
    ? `${title} · ${new Date(event.date).getFullYear()}`
    : title;
  const eventTitle = acrossEvents
    ? "All event years"
    : event?.title ?? "TEDxSMIU Community";

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#100609] px-4 pb-12 pt-28 text-white sm:px-6 sm:pb-16 sm:pt-36 lg:px-12 lg:pt-40">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-repeat bg-[length:300px_auto] opacity-[0.035] mix-blend-screen sm:bg-[length:380px_auto] lg:bg-[length:460px_auto]"
          style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href={
              event
                ? `/gallery?year=${new Date(event.date).getFullYear()}`
                : "/gallery"
            }
            className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to gallery
          </Link>
          <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.23em] text-primary">
            {eventTitle}
          </p>
          <h1 className="mt-3 max-w-4xl font-helvetica text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {displayTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            {assets.length} {assets.length === 1 ? "moment" : "moments"}
            {talks.length > 0 ? ` and ${talks.length} speaker talks` : ""} from
            this TEDxSMIU collection.
          </p>
        </div>
      </section>

      {assets.length > 0 && (
        <section className="bg-ink px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-7xl">
            

            <div className="grid auto-rows-[110px] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[180px] lg:grid-cols-6 lg:gap-4">
              {assets.map((asset, index) => {
                const embedUrl =
                  asset.type === "VIDEO" ? getEmbedUrl(asset.url) : null;

                return (
                  <article
                    key={asset.id}
                    className={`relative min-h-0 overflow-hidden border border-white/10 bg-white/[0.025] ${MOSAIC_TILE_CLASSES[index % MOSAIC_TILE_CLASSES.length]}`}
                  >
                    <div className="absolute inset-0 overflow-hidden bg-[#160a0d]">
                      {asset.type === "IMAGE" ? (
                        <GalleryImagePreview
                          src={cleanImageUrl(asset.url, "/images/hero/hero1.png")}
                          alt={asset.altText || displayTitle}
                        />
                      ) : embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={asset.altText || "TEDxSMIU event video"}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <video
                          src={asset.url}
                          controls
                          preload="metadata"
                          className="h-full w-full object-contain"
                        >
                          Your browser does not support embedded video.
                        </video>
                      )}
                      {asset.type === "IMAGE" && (
                        <a
                          href={getDownloadUrl(asset.url)}
                          download={getFileName(asset.url, "tedxsmiu-moment")}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute right-3 top-3 inline-flex items-center gap-2 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white  transition-colors hover:text-primary hover:text-primary"
                          aria-label={`Download ${asset.altText || "image"}`}
                        >
                          <ArrowDownToLine className="h-4.5 w-4.5" />

                        </a>
                      )}
                      {asset.type === "VIDEO" && !embedUrl && (
                        <a
                          href={asset.url}
                          download={getFileName(asset.url, "tedxsmiu-video")}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute right-3 top-3 inline-flex items-center gap-2 border border-white/30 bg-black/75 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur transition-colors hover:border-primary hover:bg-primary"
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                          Download
                        </a>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 p-4">
                      <p className="min-w-0 text-sm text-neutral-300">
                        {asset.altText || (asset.type === "IMAGE" ? title : "Event video")}
                      </p>
                      {asset.type === "VIDEO" && embedUrl && (
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-neutral-500 transition-colors hover:text-primary"
                          aria-label="Open video on its original platform"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {talks.length > 0 && (
        <section className="border-t border-white/10 bg-[#0e0e11] px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 border-b border-white/10 pb-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                Ideas worth spreading
              </p>
              <h2 className="mt-2 font-helvetica text-2xl font-black uppercase text-white sm:text-3xl">
                Speakers & talks
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {talks.map((talk) => {
                const embedUrl = talk.youtubeUrl ? getEmbedUrl(talk.youtubeUrl) : null;

                return (
                  <article
                    key={talk.id}
                    className="overflow-hidden border border-white/10 bg-black"
                  >
                    {embedUrl ? (
                      <div className="relative aspect-video bg-[#160a0d]">
                        <iframe
                          src={embedUrl}
                          title={`${talk.talkTitle} by ${talk.speaker?.name || "Guest Speaker"}`}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <a
                        href={talk.youtubeUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="flex aspect-video items-center justify-center gap-3 bg-[#160a0d] font-mono text-xs font-bold uppercase tracking-[0.15em] text-white hover:text-primary"
                      >
                        <Play className="h-5 w-5 fill-current" /> Watch this talk
                      </a>
                    )}
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary/50 bg-[#1b1114]">
                        {talk.speaker?.imageUrl ? (
                          <Image
                            src={cleanImageUrl(talk.speaker.imageUrl, "/images/team/lead.jpg")}
                            alt={talk.speaker.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-helvetica text-xl font-black text-primary">
                            {(talk.speaker?.name || "T").charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-helvetica text-lg font-black uppercase leading-tight text-white">
                          {talk.talkTitle}
                        </h3>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                          {talk.speaker?.name || "Guest Speaker"}
                        </p>
                      </div>
                      {talk.youtubeUrl && (
                        <a
                          href={talk.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto shrink-0 text-neutral-500 transition-colors hover:text-primary"
                          aria-label={`Open ${talk.talkTitle} on its original platform`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
