import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { coreTeamImages, team } from "@/lib/db/schema";
import CoreTeamMembersClient from "./CoreTeamMembersClient";

export const dynamic = "force-dynamic";

export default async function AdminCoreTeamMembersPage() {
  const records = await db
    .select({
      id: coreTeamImages.id,
      teamId: coreTeamImages.teamId,
      teamName: team.name,
      department: team.department,
      imageUrl: coreTeamImages.imageUrl,
      name: coreTeamImages.name,
      designation: coreTeamImages.designation,
      bio: coreTeamImages.bio,
      socialLinks: coreTeamImages.socialLinks,
      sortOrder: coreTeamImages.sortOrder,
    })
    .from(coreTeamImages)
    .innerJoin(team, eq(coreTeamImages.teamId, team.id))
    .orderBy(asc(team.department), asc(coreTeamImages.sortOrder));

  const profiles = records.map((record) => {
    let socialLinks = [];
    try {
      socialLinks = JSON.parse(record.socialLinks);
    } catch (error) {
      console.error(`Invalid core team social links for ${record.id}`, error);
    }
    return { ...record, socialLinks };
  });

  return <CoreTeamMembersClient profiles={profiles} />;
}
