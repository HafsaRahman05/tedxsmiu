import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser, requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { VolunteerUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = await request.json();
    const parsed = VolunteerUpdateSchema.parse(body);

    const updated = await db
      .update(volunteers)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(volunteers.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Volunteer application not found" }, { status: 404 });
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

    const [application] = await db
      .select()
      .from(volunteers)
      .where(eq(volunteers.id, id));

    if (!application) {
      return NextResponse.json({ error: "Volunteer application not found" }, { status: 404 });
    }

    const isAdminOrOrganizer = user.role === "SUPER_ADMIN" || user.role === "ORGANIZER";
    const isOwnApplication = application.userId === user.id;

    if (!isAdminOrOrganizer && !isOwnApplication) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .delete(volunteers)
      .where(eq(volunteers.id, id));

    return NextResponse.json({ message: "Volunteer application deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
