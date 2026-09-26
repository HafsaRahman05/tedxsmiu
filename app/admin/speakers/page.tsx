import { db } from "@/lib/db";
import { speakers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import SpeakersClient from "./SpeakersClient";

export const dynamic = "force-dynamic";

export default async function AdminSpeakersPage() {
  const rawSpeakers = await db
    .query.speakers.findMany({
      with: {
        eventSpeakers: {
          with: { event: true },
        },
      },
      orderBy: [desc(speakers.sortOrder), desc(speakers.createdAt)],
    });

  const initialSpeakers = rawSpeakers.map((s) => {
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = s.socialLinks ? JSON.parse(s.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }
    const eventYears: string[] = [];
    for (const entry of s.eventSpeakers) {
      if (entry.event?.date) {
        eventYears.push(new Date(entry.event.date).getFullYear().toString());
      }
    }

    return {
      ...s,
      socialLinks: parsedSocialLinks,
      eventYears,
    };
  });

  return <SpeakersClient initialSpeakers={initialSpeakers} />;
}
