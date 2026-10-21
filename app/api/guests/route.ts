import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema";
import { handleApiError, requireAdminOrOrganizer } from "@/server/auth/helper";
import { GuestInputSchema } from "@/server/validators";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(guests)
      .where(eq(guests.status, "ACTIVE"))
      .orderBy(desc(guests.sortOrder), desc(guests.eventYear), desc(guests.createdAt));

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

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const parsed = GuestInputSchema.parse(await request.json());
    const guestData = {
      id: crypto.randomUUID(),
      guestName: parsed.guestName,
      guestType: parsed.guestType,
      roleTitle: parsed.roleTitle,
      organizationHeading: parsed.organizationHeading || null,
      bioDetails: parsed.bioDetails || null,
      imageUrl: parsed.imageUrl || null,
      socialLinks: JSON.stringify(parsed.socialLinks || []),
      eventId: parsed.eventId || null,
      eventYear: parsed.eventYear,
      sortOrder: parsed.sortOrder,
      status: parsed.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [created] = await db.insert(guests).values(guestData).returning();
    return NextResponse.json(
      { ...created, socialLinks: parsed.socialLinks || [] },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}