import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;

    const deleted = await db
      .delete(media)
      .where(eq(media.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Media item deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
