import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/adminAuth";

// POST /api/admin/login
// Public endpoint (excluded from middleware auth) that checks the submitted
// password against the single shared ADMIN_PASSWORD and, on success, sets
// a signed, httpOnly session cookie.
export async function POST(request: NextRequest) {
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.password !== "string" || !body.password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  let isCorrect: boolean;
  try {
    isCorrect = verifyAdminPassword(body.password);
  } catch (err) {
    console.error("Admin login misconfigured:", err);
    return NextResponse.json({ error: "Admin login is not configured on the server." }, { status: 500 });
  }

  if (!isCorrect) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
