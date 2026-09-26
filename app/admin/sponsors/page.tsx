import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import SponsorsClient from "./SponsorsClient";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const rawSponsors = await db
    .select()
    .from(sponsors)
    .orderBy(desc(sponsors.createdAt));

  const initialSponsors = rawSponsors.map((s) => {
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = s.socialLinks ? JSON.parse(s.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }
    return {
      ...s,
      socialLinks: parsedSocialLinks,
    };
  });

  return <SponsorsClient initialSponsors={initialSponsors} />;
}
