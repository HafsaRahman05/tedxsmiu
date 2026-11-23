import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { handleApiError } from "@/server/auth/helper";
import { PublicReviewInputSchema } from "@/server/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Honeypot: bots fill the hidden field; pretend success.
    if (typeof body?.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true });
    }

    const parsed = PublicReviewInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid review" },
        { status: 400 },
      );
    }

    await db.insert(reviews).values({
      id: crypto.randomUUID(),
      ...parsed.data,
      approved: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
