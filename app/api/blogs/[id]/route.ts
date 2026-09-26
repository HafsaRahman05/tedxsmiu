import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, and, isNull, or } from "drizzle-orm";
import { getSessionUser, requireContentMgrOrAbove, handleApiError } from "@/server/auth/helper";
import { BlogUpdateSchema } from "@/server/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const isStaff = user && ["SUPER_ADMIN", "ORGANIZER", "CONTENT_MGR"].includes(user.role || "");

    const [blogDetail] = await db
      .select()
      .from(blogs)
      .where(
        and(
          isNull(blogs.deletedAt),
          or(eq(blogs.id, id), eq(blogs.slug, id))
        )
      );

    if (!blogDetail) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (blogDetail.status !== "PUBLISHED" && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(blogDetail);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireContentMgrOrAbove();
    const { id } = await params;
    const body = await request.json();
    const parsed = BlogUpdateSchema.parse(body);

    const updated = await db
      .update(blogs)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(and(isNull(blogs.deletedAt), eq(blogs.id, id)))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
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
    await requireContentMgrOrAbove();
    const { id } = await params;

    const deleted = await db
      .update(blogs)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(isNull(blogs.deletedAt), eq(blogs.id, id)))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog post soft-deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
