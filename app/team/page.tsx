import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import TeamClient from "./TeamClient";
import { db } from "@/lib/db";
import { events, team as teamTable } from "@/lib/db/schema";
import { desc, isNull } from "drizzle-orm";

import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Organizing Team",
  description:
    "Meet the dedicated student organizers, curators, and volunteers behind TEDxSMIU at Sindh Madressatul Islam University.",
  path: "/team",
});

type TeamPageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const { year } = await searchParams;
  const [teamList, eventList] = await Promise.all([
    db
      .select()
      .from(teamTable)
      .orderBy(desc(teamTable.sortOrder), desc(teamTable.createdAt)),
    db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        date: events.date,
      })
      .from(events)
      .where(isNull(events.deletedAt)),
  ]);

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Team", item: "/team" },
        ])}
      />
      <PageHero
        title="Team"
        description="Entirely student-run, entirely volunteer. Switch editions to meet the people behind each TEDxSMIU event."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />
      <TeamClient
        initialTeam={teamList}
        events={eventList.map((event) => ({
          ...event,
          date: event.date ? event.date.toISOString() : null,
        }))}
        initialYear={year}
      />
    </PageShell>
  );
}