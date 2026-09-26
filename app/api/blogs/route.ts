import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getSessionUser, requireContentMgrOrAbove, handleApiError } from "@/server/auth/helper";
import { BlogInputSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const isStaff = user && ["SUPER_ADMIN", "ORGANIZER", "CONTENT_MGR"].includes(user.role || "");

    let conditions = [isNull(blogs.deletedAt)];

    if (!isStaff) {
      conditions.push(eq(blogs.status, "PUBLISHED"));
    }

    const result = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireContentMgrOrAbove();
    const body = await request.json();
    
    const parsed = BlogInputSchema.parse({
      ...body,
      authorId: user.id,
    });

    const id = crypto.randomUUID();
    const newBlog = {
      id,
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    await db.insert(blogs).values(newBlog);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
