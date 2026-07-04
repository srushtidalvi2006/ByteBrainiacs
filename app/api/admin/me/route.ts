import { NextResponse } from "next/server";

// GET /api/admin/me
// Protected by middleware.ts — reaching this handler at all means the
// session cookie was valid, so we just confirm that back to the client.
export async function GET() {
  return NextResponse.json({ authenticated: true });
}
