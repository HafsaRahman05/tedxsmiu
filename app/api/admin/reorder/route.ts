import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";

const tableNames = {
  team: "team",
  speakers: "speakers",
  guests: "guests",
  sponsors: "sponsors",
} as const;

type ReorderEntity = keyof typeof tableNames;

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid reorder request" }, { status: 400 });
    }

    const { entity, ids } = body as { entity?: unknown; ids?: unknown };
    if (
      typeof entity !== "string" ||
      !Object.hasOwn(tableNames, entity) ||
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.length > 1000 ||
      !ids.every((id): id is string => typeof id === "string" && id.length > 0) ||
      new Set(ids).size !== ids.length
    ) {
      return NextResponse.json({ error: "Invalid reorder request" }, { status: 400 });
    }

    const tableName = tableNames[entity as ReorderEntity];
    const idValues = ids.map((id) => sql`${id}`);
    const orderCases = ids.map((id, index) => sql`WHEN ${id} THEN ${ids.length - index}`);

    await db.transaction(async (tx) => {
      const existing = await tx.execute(
        sql`SELECT "id" FROM ${sql.identifier(tableName)} WHERE "id" IN (${sql.join(idValues, sql`, `)})`,
      );
      if (existing.rows.length !== ids.length) {
        const error = new Error("One or more profiles could not be found");
        Object.assign(error, { statusCode: 400 });
        throw error;
      }

      await tx.execute(
        sql`UPDATE ${sql.identifier(tableName)}
            SET "sort_order" = CASE "id" ${sql.join(orderCases, sql` `)} END
            WHERE "id" IN (${sql.join(idValues, sql`, `)})`,
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
