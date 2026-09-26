import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { speakers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser, requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { SpeakerUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const body = await request.json();
    const parsed = SpeakerUpdateSchema.parse(body);

    const [currentSpeaker] = await db
      .select()
      .from(speakers)
      .where(eq(speakers.id, id));

    if (!currentSpeaker) {
      return NextResponse.json({ error: "Speaker profile not found" }, { status: 404 });
    }

    const isAdminOrOrganizer = user.role === "SUPER_ADMIN" || user.role === "ORGANIZER";
    const isLinkedUser = currentSpeaker.userId === user.id;

    if (!isAdminOrOrganizer && !isLinkedUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let updatePayload: any = {};

    if (isAdminOrOrganizer) {
      updatePayload = { ...parsed };
    } else {
      const { status, sortOrder, userId, ...allowedFields } = parsed;
      updatePayload = allowedFields;
    }

    if (updatePayload.socialLinks !== undefined) {
      updatePayload.socialLinks = Array.isArray(updatePayload.socialLinks)
        ? JSON.stringify(updatePayload.socialLinks)
        : updatePayload.socialLinks;
    }

    updatePayload.updatedAt = new Date();

    const updated = await db
      .update(speakers)
      .set(updatePayload)
      .where(eq(speakers.id, id))
      .returning();

    const speakerRes = updated[0];
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = speakerRes.socialLinks ? JSON.parse(speakerRes.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }

    return NextResponse.json({
      ...speakerRes,
      socialLinks: parsedSocialLinks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [speaker] = await db
      .select()
      .from(speakers)
      .where(eq(speakers.id, id));

    if (!speaker) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
    }

    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = speaker.socialLinks ? JSON.parse(speaker.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }

    const mappedSpeaker = {
      ...speaker,
      headline: speaker.headline || "TEDx Speaker",
      title: speaker.headline || "TEDx Speaker",
      image: speaker.imageUrl || "/images/speakers/speaker1.jpg",
      tags: ["TEDx Talk"],
      socialLinks: parsedSocialLinks,
    };

    return NextResponse.json({ speaker: mappedSpeaker });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;

    const deleted = await db
      .delete(speakers)
      .where(eq(speakers.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Speaker profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Speaker profile deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
