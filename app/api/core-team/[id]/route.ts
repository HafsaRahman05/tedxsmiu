import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { coreTeamImages } from "@/lib/db/schema";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { CoreTeamMemberProfileSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminOrOrganizer();
    const { id } = await params;
    const body = CoreTeamMemberProfileSchema.parse(await request.json());

    const [updated] = await db
      .update(coreTeamImages)
      .set({
        name: body.name || null,
        designation: body.designation || null,
        bio: body.bio || null,
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
        socialLinks: JSON.stringify(body.socialLinks),
      })
      .where(eq(coreTeamImages.id, id))
      .returning({ id: coreTeamImages.id });

    if (!updated) {
      return NextResponse.json(
        { error: "Core team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
