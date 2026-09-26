import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registrations, events } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { requireUser, handleApiError } from "@/server/auth/helper";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const isStaff = ["SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"].includes(user.role || "");

    let result;
    if (isStaff && eventId) {
      result = await db
        .select()
        .from(registrations)
        .where(eq(registrations.eventId, eventId));
    } else {
      result = await db
        .select()
        .from(registrations)
        .where(eq(registrations.userId, user.id));
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.deletedAt) {
      return NextResponse.json({ error: "Event has been deleted" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.userId, user.id)
        )
      );

    if (existing) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 });
    }

    const [registrationsCount] = await db
      .select({ val: count() })
      .from(registrations)
      .where(eq(registrations.eventId, eventId));

    const totalCount = registrationsCount?.val || 0;
    if (totalCount >= event.capacity) {
      return NextResponse.json({ error: "Event has reached maximum capacity" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const qrCodeHash = crypto
      .createHash("sha256")
      .update(`${id}:${user.email}:${eventId}`)
      .digest("hex");

    const newRegistration = {
      id,
      eventId,
      userId: user.id,
      status: "CONFIRMED" as any,
      qrCodeHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(registrations).values(newRegistration);
    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
