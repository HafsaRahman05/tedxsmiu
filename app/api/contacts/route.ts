import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import { ContactInputSchema } from "@/server/validators";

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
    const parsed = ContactInputSchema.parse(body);

    const id = crypto.randomUUID();
    const newInquiry = {
      id,
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(contacts).values(newInquiry);
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
