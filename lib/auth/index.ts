import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "GUEST",
                input: false,
            },
            bio: {
                type: "string",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            studentId: {
                type: "string",
                required: false,
            },
        }
    },
    plugins: [nextCookies()],
});