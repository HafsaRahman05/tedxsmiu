import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Production Security Guard: Require explicit seed secret in production
    const isProd = process.env.NODE_ENV === "production";
    const seedSecret = request.headers.get("x-seed-secret") || request.nextUrl.searchParams.get("secret");

    if (isProd && (!process.env.SEED_SECRET || seedSecret !== process.env.SEED_SECRET)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Seeding is restricted in production.",
        },
        { status: 403 }
      );
    }

    // 2. Only allow seeding if the user table is completely empty
    const [userCount] = await db.select({ value: count() }).from(user);
    if (userCount && userCount.value > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Seeding is disabled: Users already exist in the database.",
        },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@tedxsmiu.com";
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || "AdminPassword123!";
    const adminName = "TEDxSMIU Admin";

    // Register initial admin user via Better Auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });

    if (signUpResult?.user?.id) {
      await db
        .update(user)
        .set({ role: "SUPER_ADMIN" })
        .where(eq(user.id, signUpResult.user.id));
    } else {
      await db
        .update(user)
        .set({ role: "SUPER_ADMIN" })
        .where(eq(user.email, adminEmail));
    }

    return NextResponse.json({
      success: true,
      message: "Admin user seeded successfully",
      user: {
        email: adminEmail,
        role: "SUPER_ADMIN",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed admin user",
      },
      { status: 500 }
    );
  }
}
