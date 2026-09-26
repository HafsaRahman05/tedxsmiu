import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { SponsorUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = await request.json();
    const parsed = SponsorUpdateSchema.parse(body);

    let updatePayload: any = { ...parsed };
    if (updatePayload.socialLinks !== undefined) {
      updatePayload.socialLinks = Array.isArray(updatePayload.socialLinks)
        ? JSON.stringify(updatePayload.socialLinks)
        : updatePayload.socialLinks;
    }

    updatePayload.updatedAt = new Date();

    const updated = await db
      .update(sponsors)
      .set(updatePayload)
      .where(eq(sponsors.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const sponsorRes = updated[0];
    let parsedSocialLinks = [];
    try {
      parsedSocialLinks = sponsorRes.socialLinks ? JSON.parse(sponsorRes.socialLinks) : [];
    } catch {
      parsedSocialLinks = [];
    }

    return NextResponse.json({
      ...sponsorRes,
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
      .delete(sponsors)
      .where(eq(sponsors.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
