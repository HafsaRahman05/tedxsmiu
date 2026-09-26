import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { speakers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionUser, requireUser, handleApiError } from "@/server/auth/helper";
import { SpeakerInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const isAdminOrOrganizer = user && (user.role === "SUPER_ADMIN" || user.role === "ORGANIZER");

    let conditions = [];
    if (!isAdminOrOrganizer) {
      conditions.push(eq(speakers.status, "ACCEPTED"));
    }

    const result = await db
      .select()
      .from(speakers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(speakers.eventYear), desc(speakers.sortOrder), desc(speakers.createdAt));

    const mapped = result.map((s, index) => {
      const gradients = [
        "linear-gradient(135deg,#7a1f19,#2b0f0d)",
        "linear-gradient(135deg,#16332c,#0b1210)",
        "linear-gradient(135deg,#241f4a,#10101a)",
        "linear-gradient(135deg,#3a1030,#120510)",
      ];

      let parsedSocialLinks = [];
      try {
        parsedSocialLinks = s.socialLinks ? JSON.parse(s.socialLinks) : [];
      } catch {
        parsedSocialLinks = s.socialLinks ? [s.socialLinks] : [];
      }

      if (typeof parsedSocialLinks === "string") {
        parsedSocialLinks = parsedSocialLinks ? [parsedSocialLinks] : [];
      } else if (parsedSocialLinks && !Array.isArray(parsedSocialLinks) && typeof parsedSocialLinks.url === "string") {
        parsedSocialLinks = [parsedSocialLinks];
      }

      return {
        ...s,
        headline: s.headline || "TEDx Speaker",
        socialLinks: parsedSocialLinks,
        gradient: gradients[index % gradients.length],
        title: s.headline || "TEDx Speaker",
        tags: ["TEDx Talk"],
        image: s.imageUrl && s.imageUrl.trim() !== "" ? s.imageUrl : "/images/team/lead.jpg",
      };
    });

    return NextResponse.json({ speakers: mapped });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = SpeakerInputSchema.parse(body);

    const isAdminOrOrganizer = user.role === "SUPER_ADMIN" || user.role === "ORGANIZER";

    const id = crypto.randomUUID();
    const speakerData = {
      id,
      userId: isAdminOrOrganizer ? (parsed.userId || null) : user.id,
      name: parsed.name,
      headline: parsed.headline || null,
      bio: parsed.bio || null,
      imageUrl: parsed.imageUrl || null,
      socialLinks: parsed.socialLinks ? JSON.stringify(parsed.socialLinks) : null,
      eventYear: parsed.eventYear,
      status: isAdminOrOrganizer ? (parsed.status || "ACCEPTED") : ("SUBMITTED" as any),
      sortOrder: parsed.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(speakers).values(speakerData);
    
    return NextResponse.json(
      {
        ...speakerData,
        socialLinks: parsed.socialLinks || [],
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
