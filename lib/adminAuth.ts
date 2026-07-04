import "server-only";
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "bb_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a long random " +
        "string in .env.local (see .env.local.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Checks a submitted password against the single shared admin password. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set in the environment.");
  }
  // Lengths differ in the common case, so this isn't fully constant-time,
  // but it avoids short-circuiting on the first mismatched character.
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Issues a signed, short-lived session token for the admin cookie. */
export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

/** Returns true if the given cookie value is a valid, unexpired admin session. */
export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;
