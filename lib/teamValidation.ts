export type TeamType = "solo" | "duo" | "trio";
export type TeamStatus = "pending" | "approved" | "rejected";
export type TeamSource = "registration" | "admin_created";

export interface MemberInput {
  name: string;
  email: string;
  phone?: string;
  college: string;
  course: string;
  year: string;
  github?: string;
  linkedin?: string;
}

export interface TeamInput {
  name: string;
  type: TeamType;
  category?: string;
  experience?: string;
  members: MemberInput[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIA_PHONE_RE = /^(?:\+91|91|0)?[6-9]\d{9}$/;

const MEMBER_COUNT_BY_TYPE: Record<TeamType, number> = {
  solo: 1,
  duo: 2,
  trio: 3,
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a team payload shared by the public registration endpoint and
 * the admin "create team" endpoint. Both must produce data that fits the
 * same schema, so the rules live in one place.
 */
export function validateTeamInput(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== "object" || input === null) {
    return { valid: false, errors: ["Request body must be a JSON object."] };
  }

  const body = input as Record<string, unknown>;

  if (typeof body.name !== "string" || !body.name.trim()) {
    errors.push("Team name is required.");
  }

  if (body.type !== "solo" && body.type !== "duo" && body.type !== "trio") {
    errors.push("Team type must be one of: solo, duo, trio.");
  }

  if (body.category !== undefined && typeof body.category !== "string") {
    errors.push("Category must be a string.");
  }

  if (body.experience !== undefined && typeof body.experience !== "string") {
    errors.push("Experience must be a string.");
  }

  if (!Array.isArray(body.members)) {
    errors.push("Members must be an array.");
    return { valid: false, errors };
  }

  const expectedCount =
    body.type === "solo" || body.type === "duo" || body.type === "trio"
      ? MEMBER_COUNT_BY_TYPE[body.type]
      : null;

  if (expectedCount !== null && body.members.length !== expectedCount) {
    errors.push(
      `A ${String(body.type)} team must have exactly ${expectedCount} member(s); received ${body.members.length}.`
    );
  }

  if (body.members.length === 0) {
    errors.push("At least one member is required.");
  }

  const seenEmails = new Set<string>();

  body.members.forEach((rawMember, index) => {
    const label = `Member ${index + 1}`;
    if (typeof rawMember !== "object" || rawMember === null) {
      errors.push(`${label}: must be an object.`);
      return;
    }
    const member = rawMember as Record<string, unknown>;

    if (typeof member.name !== "string" || !member.name.trim()) {
      errors.push(`${label}: full name is required.`);
    }

    if (typeof member.email !== "string" || !member.email.trim()) {
      errors.push(`${label}: email is required.`);
    } else if (!EMAIL_RE.test(member.email)) {
      errors.push(`${label}: email is not valid.`);
    } else {
      const normalized = member.email.trim().toLowerCase();
      if (seenEmails.has(normalized)) {
        errors.push(`${label}: duplicate email within the same team.`);
      }
      seenEmails.add(normalized);
    }

    if (typeof member.college !== "string" || !member.college.trim()) {
      errors.push(`${label}: college name is required.`);
    }

    if (typeof member.course !== "string" || !member.course.trim()) {
      errors.push(`${label}: course is required.`);
    }

    if (typeof member.year !== "string" || !member.year.trim()) {
      errors.push(`${label}: year is required.`);
    }

    if (member.phone !== undefined && member.phone !== "" && typeof member.phone === "string") {
      if (!INDIA_PHONE_RE.test(member.phone.replace(/\s/g, ""))) {
        errors.push(`${label}: phone number is not a valid 10-digit Indian mobile number.`);
      }
    }

    if (member.github !== undefined && typeof member.github !== "string") {
      errors.push(`${label}: GitHub profile must be a string.`);
    }

    if (member.linkedin !== undefined && typeof member.linkedin !== "string") {
      errors.push(`${label}: LinkedIn profile must be a string.`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/** Narrows + trims a validated payload into the shape the DB layer expects. */
export function normalizeTeamInput(input: Record<string, unknown>): TeamInput {
  const members = (input.members as Record<string, unknown>[]).map((m) => ({
    name: (m.name as string).trim(),
    email: (m.email as string).trim().toLowerCase(),
    phone: m.phone ? (m.phone as string).trim() : undefined,
    college: (m.college as string).trim(),
    course: (m.course as string).trim(),
    year: (m.year as string).trim(),
    github: m.github ? (m.github as string).trim() : undefined,
    linkedin: m.linkedin ? (m.linkedin as string).trim() : undefined,
  }));

  return {
    name: (input.name as string).trim(),
    type: input.type as TeamType,
    category: input.category ? (input.category as string).trim() : undefined,
    experience: input.experience ? (input.experience as string).trim() : undefined,
    members,
  };
}
