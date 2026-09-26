import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema";
import { handleApiError } from "@/server/auth/helper";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(guests)
      .where(eq(guests.status, "ACTIVE"))
      .orderBy(desc(guests.eventYear), desc(guests.sortOrder), desc(guests.createdAt));

    return NextResponse.json({
      guests: result.map((guest) => {
        let socialLinks: unknown[] = [];
        try {
          socialLinks = guest.socialLinks ? JSON.parse(guest.socialLinks) : [];
        } catch {
          socialLinks = guest.socialLinks ? [guest.socialLinks] : [];
        }

        return {
          ...guest,
          guestType: guest.guestType || "VIP Guest",
          name: guest.guestName,
          title: guest.organizationHeading
            ? `${guest.roleTitle} · ${guest.organizationHeading}`
            : guest.roleTitle,
          bio: guest.bioDetails,
          tags: ["Guest appearance"],
          image: guest.imageUrl?.trim() || "/images/team/lead.jpg",
          socialLinks,
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}