import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import TeamCard from "@/components/TeamCard"; 
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

  const gradients = [
    "linear-gradient(135deg,#7a1f19,#2b0f0d)",
    "linear-gradient(135deg,#16332c,#0b1210)",
    "linear-gradient(135deg,#241f4a,#10101a)",
    "linear-gradient(135deg,#3a2a10,#120d05)",
    "linear-gradient(135deg,#0e2a3a,#081116)",
    "linear-gradient(135deg,#3a1030,#120510)",
  ];

  const mappedTeam = teamList.map((t, i) => ({
    ...t,
    group: "Core Team",
    gradient: gradients[i % gradients.length]
  }));

  const groups = Array.from(new Set(mappedTeam.map((t) => t.group)));

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

      <section className="border-b border-white/10 bg-black px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-16">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#EB0028]">
                {group}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mappedTeam
                  .filter((t) => t.group === group)
                  .map((member) => (
                    <TeamCard key={member.id} member={member} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}