import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        bio: user.bio,
        phone: user.phone,
        studentId: user.studentId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
