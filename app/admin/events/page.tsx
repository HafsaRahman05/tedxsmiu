import { db } from "@/lib/db";
import { events, speakers, sponsors } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const initialEvents = await db.query.events.findMany({
    where: isNull(events.deletedAt),
    orderBy: [desc(events.date)],
    with: {
      eventSpeakers: {
        with: {
          speaker: true,
        },
      },
      eventSponsors: {
        with: {
          sponsor: true,
        },
      },
    },
  });

  const availableSpeakers = await db
    .select({
      id: speakers.id,
      name: speakers.name,
      imageUrl: speakers.imageUrl,
    })
    .from(speakers)
    .orderBy(desc(speakers.createdAt));

  const availableSponsors = await db
    .select({
      id: sponsors.id,
      name: sponsors.name,
      logoUrl: sponsors.logoUrl,
    })
    .from(sponsors)
    .orderBy(desc(sponsors.createdAt));

  return (
    <EventsClient
      initialEvents={initialEvents}
      availableSpeakers={availableSpeakers}
      availableSponsors={availableSponsors}
    />
  );
}
