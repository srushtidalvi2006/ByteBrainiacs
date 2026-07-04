import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeTeamInput, validateTeamInput } from "@/lib/teamValidation";

// GET /api/admin/teams?status=pending|approved|rejected|all
// Protected by middleware.ts. Returns every team with its nested members,
// most recent first, optionally filtered by status.
export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const status = request.nextUrl.searchParams.get("status");

  let query = supabase
    .from("teams")
    .select("*, members(*)")
    .order("created_at", { ascending: false })
    .order("member_order", { referencedTable: "members", ascending: true });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to list teams:", error);
    return NextResponse.json({ error: "Could not load teams." }, { status: 500 });
  }

  return NextResponse.json({ teams: data });
}

// POST /api/admin/teams
// Protected by middleware.ts. Lets an admin directly create a solo or duo
// (or trio) team on behalf of members who registered outside the normal
// flow — e.g. by email or in person. Admin-created teams are auto-approved
// since an admin is vouching for them directly.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { valid, errors } = validateTeamInput(body);
  if (!valid) {
    return NextResponse.json({ error: "Validation failed.", details: errors }, { status: 422 });
  }

  const team = normalizeTeamInput(body as Record<string, unknown>);
  const supabase = getSupabaseAdmin();

  const { data: teamRow, error: teamError } = await supabase
    .from("teams")
    .insert({
      name: team.name,
      type: team.type,
      category: team.category ?? null,
      experience: team.experience ?? null,
      status: "approved",
      source: "admin_created",
      reviewed_at: new Date().toISOString(),
      review_note: "Created directly by admin.",
    })
    .select("id")
    .single();

  if (teamError || !teamRow) {
    console.error("Failed to insert admin-created team:", teamError);
    return NextResponse.json({ error: "Could not create team. Please try again." }, { status: 500 });
  }

  const memberRows = team.members.map((member, index) => ({
    team_id: teamRow.id,
    member_order: index + 1,
    name: member.name,
    email: member.email,
    phone: member.phone ?? null,
    college: member.college,
    course: member.course,
    year: member.year,
    github: member.github ?? null,
    linkedin: member.linkedin ?? null,
  }));

  const { error: membersError } = await supabase.from("members").insert(memberRows);

  if (membersError) {
    console.error("Failed to insert members for admin-created team:", membersError);
    await supabase.from("teams").delete().eq("id", teamRow.id);

    if (membersError.code === "23505") {
      return NextResponse.json(
        { error: "One of the member emails is already used elsewhere in this team." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create team. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, teamId: teamRow.id }, { status: 201 });
}
