import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { ContactUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = await request.json();
    const parsed = ContactUpdateSchema.parse(body);

    const updated = await db
      .update(contacts)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 });
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
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
