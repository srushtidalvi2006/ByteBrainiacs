import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const VALID_STATUSES = ["pending", "approved", "rejected"] as const;
type Status = (typeof VALID_STATUSES)[number];

// PATCH /api/admin/teams/:id
// Protected by middleware.ts. Body: { status: "approved" | "rejected" | "pending", note?: string }
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { status?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.status !== "string" || !VALID_STATUSES.includes(body.status as Status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` },
      { status: 422 }
    );
  }

  if (body.note !== undefined && typeof body.note !== "string") {
    return NextResponse.json({ error: "Note must be a string." }, { status: 422 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("teams")
    .update({
      status: body.status,
      reviewed_at: new Date().toISOString(),
      review_note: body.note ?? null,
    })
    .eq("id", id)
    .select("*, members(*)")
    .single();

  if (error) {
    console.error("Failed to update team status:", error);
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update team." }, { status: 500 });
  }

  return NextResponse.json({ team: data });
}

// DELETE /api/admin/teams/:id
// Protected by middleware.ts. Members cascade-delete via the FK constraint.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("teams").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete team:", error);
    return NextResponse.json({ error: "Could not delete team." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
