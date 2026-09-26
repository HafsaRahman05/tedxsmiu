import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { team } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { TeamUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = await request.json();
    const parsed = TeamUpdateSchema.parse(body);

    let updatePayload: any = { ...parsed };
    if (updatePayload.socialLinks !== undefined) {
      updatePayload.socialLinks = Array.isArray(updatePayload.socialLinks)
        ? JSON.stringify(updatePayload.socialLinks)
        : updatePayload.socialLinks;
    }

    updatePayload.updatedAt = new Date();

    const updated = await db
      .update(team)
      .set(updatePayload)
      .where(eq(team.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const memberRes = updated[0];
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = memberRes.socialLinks ? JSON.parse(memberRes.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }

    return NextResponse.json({
      ...memberRes,
      socialLinks: parsedSocialLinks,
    });
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
      .delete(team)
      .where(eq(team.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
