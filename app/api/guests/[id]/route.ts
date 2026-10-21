import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema";
import { handleApiError, requireAdminOrOrganizer } from "@/server/auth/helper";
import { GuestUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const parsed = GuestUpdateSchema.parse(await request.json());
    const updatePayload = {
      ...parsed,
      socialLinks:
        parsed.socialLinks === undefined
          ? undefined
          : JSON.stringify(parsed.socialLinks ?? []),
      updatedAt: new Date(),
    };
    const [updated] = await db
      .update(guests)
      .set(updatePayload)
      .where(eq(guests.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Guest profile not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const [deleted] = await db
      .delete(guests)
      .where(eq(guests.id, id))
      .returning({ id: guests.id });

    if (!deleted) {
      return NextResponse.json({ error: "Guest profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
