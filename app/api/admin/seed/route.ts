import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Strict Security Guard: Require valid SEED_SECRET in all environments via header
    const configuredSecret = process.env.SEED_SECRET;
    const providedSecret = request.headers.get("x-seed-secret");

    if (!configuredSecret || !providedSecret || providedSecret !== configuredSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing seed secret header.",
        },
        { status: 401 }
      );
    }

    // 2. Validate required environment variables for seeding
    const adminEmail = process.env.ADMIN_SEED_EMAIL;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    const adminName = process.env.ADMIN_SEED_NAME || "TEDxSMIU Admin";

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Configuration error: ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD environment variables must be set.",
        },
        { status: 500 }
      );
    }

    // 3. Only allow seeding if the user table is completely empty
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
