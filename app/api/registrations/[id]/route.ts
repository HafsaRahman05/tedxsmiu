import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser, handleApiError } from "@/server/auth/helper";
import { RegistrationStatusSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();

    const isStaff = ["SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"].includes(user.role);
    if (!isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = body;
    const parsedStatus = RegistrationStatusSchema.parse(status);

    const updated = await db
      .update(registrations)
      .set({
        status: parsedStatus as any,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
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
    const user = await requireUser();
    const { id } = await params;

    const [registration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const isAdminOrOrganizer = user.role === "SUPER_ADMIN" || user.role === "ORGANIZER";
    const isOwnRegistration = registration.userId === user.id;

    if (!isAdminOrOrganizer && !isOwnRegistration) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .delete(registrations)
      .where(eq(registrations.id, id));

    return NextResponse.json({ message: "Registration cancelled and removed successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
