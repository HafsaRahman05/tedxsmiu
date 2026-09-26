import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { team } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { TeamInputSchema } from "@/server/validators";
import { cleanImageUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    let conditions = [];
    if (eventId) {
      conditions.push(eq(team.eventId, eventId));
    }

    const result = await db
      .select()
      .from(team)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(team.sortOrder));

    const mapped = result.map((m) => {
      let parsedSocialLinks = [];
      try {
        parsedSocialLinks = m.socialLinks ? JSON.parse(m.socialLinks) : [];
      } catch {
        parsedSocialLinks = [];
      }

      return {
        ...m,
        imageUrl: cleanImageUrl(m.imageUrl, "/images/speakers/speaker1.jpg"),
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
    const parsed = TeamInputSchema.parse(body);

    const id = crypto.randomUUID();
    const teamData = {
      id,
      name: parsed.name,
      department: parsed.department,
      role: parsed.role,
      designation: parsed.designation || null,
      imageUrl: parsed.imageUrl ? cleanImageUrl(parsed.imageUrl) : null,
      bio: parsed.bio || null,
      socialLinks: parsed.socialLinks ? JSON.stringify(parsed.socialLinks) : null,
      eventId: parsed.eventId || null,
      sortOrder: parsed.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(team).values(teamData);

    return NextResponse.json(
      {
        ...teamData,
        socialLinks: parsed.socialLinks || [],
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
