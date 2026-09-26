import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanImageUrl(url?: string | null, fallback = "/images/team/lead.jpg"): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Extract real URL if wrapped in markdown like [url](url) or [text](url)
  const match = trimmed.match(/https?:\/\/[^\s\]\)]+/);
  if (match && match[0]) {
    return match[0];
  }

  // Valid relative path
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return fallback;
}
