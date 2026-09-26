import { getCurrentSession } from "@/server/auth";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: "GUEST" | "ATTENDEE" | "VOLUNTEER" | "SPEAKER" | "CONTENT_MGR" | "ORGANIZER" | "SUPER_ADMIN";
  bio?: string | null;
  phone?: string | null;
  studentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSessionUser() {
  const sessionData = await getCurrentSession();
  return (sessionData?.user as AuthenticatedUser | undefined) || null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    const err = new Error("Unauthorized");
    (err as any).statusCode = 401;
    throw err;
  }
  return user;
}

export async function requireAdminOrOrganizer() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ORGANIZER") {
    const err = new Error("Forbidden: Insufficient privileges");
    (err as any).statusCode = 403;
    throw err;
  }
  return user;
}

export async function requireContentMgrOrAbove() {
  const user = await requireUser();
  const allowed = ["SUPER_ADMIN", "ORGANIZER", "CONTENT_MGR"];
  if (!allowed.includes(user.role || "")) {
    const err = new Error("Forbidden: Insufficient privileges");
    (err as any).statusCode = 403;
    throw err;
  }
  return user;
}

export async function requireVolunteerOrAbove() {
  const user = await requireUser();
  const allowed = ["SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"];
  if (!allowed.includes(user.role || "")) {
    const err = new Error("Forbidden: Insufficient privileges");
    (err as any).statusCode = 403;
    throw err;
  }
  return user;
}

// Error handling helper for Route Handlers
export function handleApiError(error: any) {
  console.error("API Error:", error);
  const status = error.statusCode || 500;
  
  // In production, sanitize 500 internal server errors to prevent leaking database/stack trace info
  const isProd = process.env.NODE_ENV === "production";
  const message =
    status >= 500 && isProd
      ? "An unexpected error occurred. Please try again later."
      : error.message || "Internal Server Error";

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
