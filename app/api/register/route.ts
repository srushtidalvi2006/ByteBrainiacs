import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeTeamInput, validateTeamInput } from "@/lib/teamValidation";

// POST /api/register
// Public endpoint used by the registration form. Always creates the team
// with status "pending" — only an admin can approve or reject it.
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
      status: "pending",
      source: "registration",
    })
    .select("id")
    .single();

  if (teamError || !teamRow) {
    console.error("Failed to insert team:", teamError);
    return NextResponse.json({ error: "Could not save registration. Please try again." }, { status: 500 });
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
    console.error("Failed to insert members:", membersError);
    // Roll back the orphaned team row so we don't leave half-written data.
    await supabase.from("teams").delete().eq("id", teamRow.id);

    if (membersError.code === "23505") {
      return NextResponse.json(
        { error: "One of the member emails is already used elsewhere in this team." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not save registration. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, teamId: teamRow.id }, { status: 201 });
}
