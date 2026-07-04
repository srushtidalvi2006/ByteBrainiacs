import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

// Routes that must always stay reachable without a session, even though
// they live under the /admin and /api/admin prefixes.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = await verifyAdminSessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  // API routes get a JSON 401 instead of a redirect, since callers are
  // fetch() calls, not a browser navigation.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
