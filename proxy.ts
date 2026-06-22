import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic auth gate. This only checks for the presence of the session
// cookie to redirect — authoritative session/ownership checks happen
// server-side in pages and route handlers.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthPage = request.nextUrl.pathname === "/auth";

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, static assets, and
  // the public share routes (which are readable without auth).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|share).*)"],
};
