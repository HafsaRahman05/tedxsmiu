import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema";
import GuestsClient from "./GuestsClient";

export const dynamic = "force-dynamic";

export default async function AdminGuestsPage() {
  const initialGuests = await db
    .select()
    .from(guests)
    .orderBy(desc(guests.sortOrder), desc(guests.createdAt));

  return <GuestsClient initialGuests={initialGuests} />;
}
