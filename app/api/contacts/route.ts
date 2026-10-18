import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { PublicContactInputSchema } from "@/server/validators";
import { sendContactQuery } from "@/lib/mail";

export async function GET(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let conditions = [];
    if (category) {
      conditions.push(eq(contacts.category, category as any));
    }
    if (status) {
      conditions.push(eq(contacts.status, status as any));
    }

    const result = await db
      .select()
      .from(contacts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(contacts.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body?.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true });
    }

    const parsed = PublicContactInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid inquiry" },
        { status: 400 },
      );
    }

    await sendContactQuery(parsed.data);

    const id = crypto.randomUUID();
    try {
      await db.insert(contacts).values({
        id,
        name: parsed.data.name,
        email: parsed.data.email,
        category: "GENERAL",
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: "NEW",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (dbError) {
      console.error("Contact email was sent, but the inquiry was not saved:", dbError);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
