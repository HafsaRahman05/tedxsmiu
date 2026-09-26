import { db } from "@/lib/db";
import { media, events } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import MediaClient from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const initialMedia = await db
    .select()
    .from(media)
    .orderBy(desc(media.createdAt));

  const initialEvents = await db
    .select({
      id: events.id,
      title: events.title,
    })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.date));

  return <MediaClient initialMedia={initialMedia} events={initialEvents} />;
}
