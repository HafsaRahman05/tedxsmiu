import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadership } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { handleApiError } from "@/server/auth/helper";
import { cleanImageUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventYear = searchParams.get("eventYear");

    let conditions = [];

    if (eventYear) {
      conditions.push(eq(leadership.eventYear, Number(eventYear)));
    }

    const result = await db
      .select()
      .from(leadership)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(leadership.sortOrder), asc(leadership.createdAt));

    const mapped = result.map((member) => {
      let parsedSocialLinks = [];
      try {
        parsedSocialLinks = member.socialLinks ? JSON.parse(member.socialLinks) : [];
      } catch {
        parsedSocialLinks = [];
      }

      return {
        ...member,
        imageUrl: cleanImageUrl(member.imageUrl, "/images/team/lead.jpg"),
        socialLinks: parsedSocialLinks,
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}
