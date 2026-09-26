import { db } from "@/lib/db";
import { team, events } from "@/lib/db/schema";
import { isNull, desc, asc } from "drizzle-orm";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const rawTeam = await db
    .select()
    .from(team)
    .orderBy(asc(team.sortOrder), desc(team.createdAt));

  const initialTeam = rawTeam.map((m) => {
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = m.socialLinks ? JSON.parse(m.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }
    return {
      ...m,
      socialLinks: parsedSocialLinks,
    };
  });

  const initialEvents = await db
    .select({
      id: events.id,
      title: events.title,
    })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.date));

  return <TeamClient initialTeam={initialTeam} events={initialEvents} />;
}
