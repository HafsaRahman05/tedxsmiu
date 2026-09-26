import { db } from "@/lib/db";
import { attendeeRegistrations, registrations, events } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import RegistrationsClient from "./RegistrationsClient";
import AttendeeRegistrationsTable from "./AttendeeRegistrationsTable";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const initialRegistrations = await db.query.registrations.findMany({
    orderBy: desc(registrations.createdAt),
    with: {
      user: true,
      event: true,
    },
  });

  const initialEvents = await db
    .select({
      id: events.id,
      title: events.title,
    })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.date));

  const attendeeFormSubmissions = await db
    .select()
    .from(attendeeRegistrations)
    .orderBy(desc(attendeeRegistrations.createdAt));

  return (
    <div className="space-y-12">
      <AttendeeRegistrationsTable registrations={attendeeFormSubmissions} />
      <RegistrationsClient initialRegistrations={initialRegistrations as any} events={initialEvents} />
    </div>
  );
}
