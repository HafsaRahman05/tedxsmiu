import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventSpeakers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { handleApiError } from "@/server/auth/helper";

export async function GET() {
  try {
    const list = await db.query.eventSpeakers.findMany({
      orderBy: [desc(eventSpeakers.createdAt)],
      with: {
        speaker: true,
      },
    });

    const talks = list.map((es) => ({
      id: es.id,
      title: es.talkTitle,
      summary: es.abstract || "",
      speaker: es.speaker?.name || "Guest Speaker",
      category: "TEDxTalk",
      duration: "18:00",
      youtubeUrl: es.youtubeUrl,
      gradient: "linear-gradient(135deg, #EB0028, #1a0205)",
    }));

    return NextResponse.json({ talks });
  } catch (error) {
    return handleApiError(error);
  }
}
