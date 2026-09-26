import { NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;

    if (typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    // In production: persist to a mailing list provider or database table
    return NextResponse.json({ ok: true, message: "Subscribed." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
