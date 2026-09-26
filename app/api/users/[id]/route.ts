import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser, handleApiError } from "@/server/auth/helper";
import { ProfileUpdateSchema, UserRoleUpdateSchema } from "@/server/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireUser();
    const body = await request.json();

    const isAdminOrSuper = currentUser.role === "SUPER_ADMIN" || currentUser.role === "ORGANIZER";
    const isOwnProfile = currentUser.id === id;

    if (!isAdminOrSuper && !isOwnProfile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let updatePayload: any = {};

    if (isOwnProfile) {
      const parsedProfile = ProfileUpdateSchema.parse(body);
      updatePayload = { ...updatePayload, ...parsedProfile };
    }

    if (isAdminOrSuper && body.role) {
      const parsedRole = UserRoleUpdateSchema.parse({ role: body.role });
      updatePayload.role = parsedRole.role;
    }

    updatePayload.updatedAt = new Date();

    const updated = await db
      .update(user)
      .set(updatePayload)
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        phone: user.phone,
        studentId: user.studentId,
        updatedAt: user.updatedAt,
      });

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
