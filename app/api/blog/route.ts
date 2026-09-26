import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getSessionUser, handleApiError } from "@/server/auth/helper";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const isStaff = user && ["SUPER_ADMIN", "ORGANIZER", "CONTENT_MGR"].includes(user.role || "");

    let conditions = [isNull(blogs.deletedAt)];

    if (!isStaff) {
      conditions.push(eq(blogs.status, "PUBLISHED"));
    }

    const result = await db.query.blogs.findMany({
      where: and(...conditions),
      orderBy: desc(blogs.publishedAt),
      with: {
        author: true,
      },
    });

    const posts = result.map((b) => ({
      id: b.id,
      title: b.title,
      excerpt: b.excerpt || "",
      author: b.author?.name || "TEDxSMIU Team",
      date: b.publishedAt || b.createdAt,
      tag: "Community",
      gradient: "linear-gradient(135deg, #110303, #EB0028)",
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    return handleApiError(error);
  }
}
