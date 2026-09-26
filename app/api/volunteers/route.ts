import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser, requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { VolunteerInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    let conditions = [];
    if (eventId) {
      conditions.push(eq(volunteers.eventId, eventId));
    }

    const result = await db
      .select()
      .from(volunteers)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const parsed = VolunteerInputSchema.parse({
      ...body,
      userId: user.id,
    });

    const [existing] = await db
      .select()
      .from(volunteers)
      .where(
        and(
          eq(volunteers.eventId, parsed.eventId),
          eq(volunteers.userId, user.id)
        )
      );

    if (existing) {
      return NextResponse.json({ error: "Already applied as a volunteer for this event" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const newApplication = {
      id,
      eventId: parsed.eventId,
      userId: user.id,
      status: "SUBMITTED" as any,
      teamPreference: parsed.teamPreference,
      assignedRole: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(volunteers).values(newApplication);
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
