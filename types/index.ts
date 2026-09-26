export type Speaker = {
  id: string;
  name: string;
  title: string;
  bio: string;
  gradient: string;
  tags: string[];
  image: string;
  eventYear?: number;
  socialLinks?: Array<{ platform: string; url: string }> | string | null;
};

export type Guest = Speaker & {
  guestType?: "Chief Guest" | "Special Guest" | "VIP Guest" | string | null;
};

export type Talk = {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  category: string;
  gradient: string;
  summary: string;
  youtubeUrl?: string | null;
};

export type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  body: string;
  tag: string;
  gradient: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department?: string;
  designation?: string;
  image?: string;
  imageUrl?: string | null;
  bio?: string | null;
  socialLinks?: Array<{ platform: string; url: string }> | string | null;
  gradient: string;
};

export type Partner = {
  id: string;
  name: string;
  tier: "GOLD" | "SILVER" | "IN_KIND" | "TITLE" | "Title" | "Gold" | "Silver" | "Community";
  websiteUrl?: string | null;
  logoUrl?: string | null;
};

export type EventData = {
  id: string;
  title: string;
  theme: string;
  slug: string;
  date: string;
  venue: string;
  capacity: number;
  status: "PAST" | "UPCOMING" | "DRAFT";
  description: string;
};

export const GRADIENTS = [
  "linear-gradient(135deg,#7a1f19,#2b0f0d)",
  "linear-gradient(135deg,#16332c,#0b1210)",
  "linear-gradient(135deg,#241f4a,#10101a)",
  "linear-gradient(135deg,#3a2a10,#120d05)",
  "linear-gradient(135deg,#0e2a3a,#081116)",
  "linear-gradient(135deg,#3a1030,#120510)",
];
