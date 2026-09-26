import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, eventSpeakers, eventSponsors } from "@/lib/db/schema";
import { eq, and, isNull, or } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { EventUpdateSchema } from "@/server/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const eventDetail = await db.query.events.findFirst({
      where: and(
        isNull(events.deletedAt),
        or(eq(events.id, id), eq(events.slug, id))
      ),
      with: {
        eventSpeakers: {
          with: {
            speaker: true,
          },
        },
        eventSponsors: {
          with: {
            sponsor: true,
          },
        },
        media: true,
        team: true,
      },
    });

    if (!eventDetail) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(eventDetail);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = await request.json();
    const parsed = EventUpdateSchema.parse(body);

    const { speakers: inputSpeakers, sponsors: inputSponsors, ...eventFields } = parsed;

    const updated = await db
      .update(events)
      .set({
        ...eventFields,
        updatedAt: new Date(),
      })
      .where(and(isNull(events.deletedAt), eq(events.id, id)))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Sync event speakers if provided
    if (inputSpeakers !== undefined) {
      await db.delete(eventSpeakers).where(eq(eventSpeakers.eventId, id));
      if (inputSpeakers.length > 0) {
        const speakerRecords = inputSpeakers.map((s) => ({
          id: crypto.randomUUID(),
          eventId: id,
          speakerId: s.speakerId,
          talkTitle: s.talkTitle,
          abstract: s.abstract || null,
          youtubeUrl: s.youtubeUrl || null,
          sortOrder: s.sortOrder || 0,
          createdAt: new Date(),
        }));
        await db.insert(eventSpeakers).values(speakerRecords);
      }
    }

    // Sync event partners if provided
    if (inputSponsors !== undefined) {
      await db.delete(eventSponsors).where(eq(eventSponsors.eventId, id));
      if (inputSponsors.length > 0) {
        const sponsorRecords = inputSponsors.map((sp) => ({
          id: crypto.randomUUID(),
          eventId: id,
          sponsorId: sp.sponsorId,
          tier: sp.tier || ("GOLD" as any),
          sortOrder: sp.sortOrder || 0,
          createdAt: new Date(),
        }));
        await db.insert(eventSponsors).values(sponsorRecords);
      }
    }

    return NextResponse.json(updated[0]);
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
      .update(events)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(isNull(events.deletedAt), eq(events.id, id)))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event soft-deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
