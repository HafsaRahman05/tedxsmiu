import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, eventSpeakers, eventSponsors } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { EventInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let conditions = [isNull(events.deletedAt)];

    if (status) {
      const validStatuses = ["UPCOMING", "ACTIVE", "PAST"];
      if (validStatuses.includes(status)) {
        conditions.push(eq(events.status, status as any));
      }
    }

    const result = await db.query.events.findMany({
      where: and(...conditions),
      orderBy: [desc(events.date)],
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
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const body = await request.json();
    const parsed = EventInputSchema.parse(body);

    const { speakers: inputSpeakers, sponsors: inputSponsors, ...eventFields } = parsed;

    const id = crypto.randomUUID();
    const newEvent = {
      id,
      ...eventFields,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    await db.insert(events).values(newEvent);

    // Insert linked speakers into event_speakers junction table
    if (inputSpeakers && inputSpeakers.length > 0) {
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

    // Insert linked partners into event_sponsors junction table
    if (inputSponsors && inputSponsors.length > 0) {
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

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
