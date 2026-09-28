"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Users, Mic } from "lucide-react";
import { cleanImageUrl } from "@/lib/utils";

interface PastEventCardProps {
  id: string;
  slug?: string | null;
  year: string;
  title: string;
  theme?: string | null;
  date: string;
  venue: string;
  description: string;
  image?: string | null;
  speakersCount?: number;
  capacity?: number;
  reverse?: boolean;
}

export default function PastEventCard({
  id,
  slug,
  year,
  title,
  theme,
  date,
  venue,
  description,
  image,
  speakersCount = 11,
  capacity = 300,
  reverse = false,
}: PastEventCardProps) {
  const eventLink = `/events/${slug || id}`;
  const safeImage = cleanImageUrl(image, "/images/hero/smiu garden view.jpg");

  return (
    <div
      className={`border border-white/10 bg-surface p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-primary/60 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Event Banner Image Container */}
      <div className="lg:col-span-6 relative border border-white/10 bg-ink overflow-hidden group">
        <Link href={eventLink} className="block aspect-[16/10] sm:aspect-video overflow-hidden relative">
          <Image
            src={safeImage}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={safeImage.includes("cdn-s2.toolzu.com")}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className="border border-primary/40 bg-ink/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
              Flagship Archive
            </span>
          </div>

          {/* Year Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="font-mono text-2xl sm:text-3xl font-black text-white/40">
              {year}
            </span>
          </div>
        </Link>
      </div>

      {/* Event Details */}
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span>Edition // {year}</span>
          </div>

          <h3 className="mt-2 font-helvetica text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase">
            {title}
          </h3>

          {theme && (
            <div className="mt-1 font-mono text-xs sm:text-sm font-bold text-neutral-300 tracking-wider">
              Theme: <span className="text-primary">&ldquo;{theme}&rdquo;</span>
            </div>
          )}

          {/* Date & Location */}
          <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider text-neutral-400 border-y border-white/5 py-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{venue}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 flex items-center gap-6 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-primary" />
              <span><strong className="text-white">{speakersCount}</strong> Keynote Talks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span><strong className="text-white">{capacity}</strong> Attendees</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 font-helvetica text-xs sm:text-sm font-normal leading-relaxed text-neutral-300 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <Link
            href={eventLink}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary hover:text-white transition-colors underline underline-offset-8"
          >
            Explore Event Details &amp; Talks <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}