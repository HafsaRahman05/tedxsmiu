import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { MediaInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const albumName = searchParams.get("albumName");

    let conditions = [];
    if (eventId) {
      conditions.push(eq(media.eventId, eventId));
    }
    if (albumName) {
      conditions.push(eq(media.albumName, albumName));
    }

    const result = await db
      .select()
      .from(media)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const body = await request.json();
    const parsed = MediaInputSchema.parse(body);

    const id = crypto.randomUUID();
    const newMedia = {
      id,
      ...parsed,
      createdAt: new Date(),
    };

    await db.insert(media).values(newMedia);
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
