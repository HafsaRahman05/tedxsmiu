import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    if (request.nextUrl.pathname !== "/dashboard/login") {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
    return NextResponse.next();
  }

  // Retrieve role safely without using 'any', as better-auth infers it 
  // from the additionalFields configured in lib/auth/index.ts
  const role = session.user.role;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (role !== "SUPER_ADMIN" && role !== "ORGANIZER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};