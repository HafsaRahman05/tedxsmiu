import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import TeamClient from "./TeamClient";
import { db } from "@/lib/db";
import { team as teamTable } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Organizing Team",
  description:
    "Meet the dedicated student organizers, curators, and volunteers behind TEDxSMIU at Sindh Madressatul Islam University.",
  path: "/team",
});

export default async function TeamPage() {
  const teamList = await db
    .select()
    .from(teamTable)
    .orderBy(desc(teamTable.sortOrder), desc(teamTable.createdAt));

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
        description="Entirely student-run, entirely volunteer. Here's who put this year's event together."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />
      <TeamClient initialTeam={teamList} />
    </PageShell>
  );
}