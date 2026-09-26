import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionUser, requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { SponsorInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const isAdminOrOrganizer = user && (user.role === "SUPER_ADMIN" || user.role === "ORGANIZER");

    let conditions = [];
    if (!isAdminOrOrganizer) {
      conditions.push(eq(sponsors.status, "CONFIRMED"));
    }

    const result = await db
      .select()
      .from(sponsors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(sponsors.createdAt));

    const mapped = result.map((s) => {
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

    return NextResponse.json(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const body = await request.json();
    const parsed = SponsorInputSchema.parse(body);

    const id = crypto.randomUUID();
    const sponsorData = {
      id,
      name: parsed.name,
      logoUrl: parsed.logoUrl || null,
      websiteUrl: parsed.websiteUrl || null,
      socialLinks: parsed.socialLinks ? JSON.stringify(parsed.socialLinks) : null,
      eventYear: parsed.eventYear,
      tier: parsed.tier || "GOLD",
      status: parsed.status || "CONFIRMED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(sponsors).values(sponsorData);
    
    return NextResponse.json(
      {
        ...sponsorData,
        socialLinks: parsed.socialLinks || [],
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
