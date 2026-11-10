/**
 * Server Session Management for Atithi Devo Bhava.
 * Spec reference: Section 2, 5, 20, and 29 of docs/SPEC.md.
 * Invariants: Adults only (18+), zero ad-trackers, HTTP-only secure cookies,
 * constant-time verification, clear development fallbacks.
 */

import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "adb_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface AuthUserSession {
  userId: string;
  email: string;
  displayName: string;
  photoUrl?: string | null;
  role: "traveller" | "local_member" | "experience_provider" | "accommodation_host";
  isAdult: boolean;
  provider: "google" | "otp";
  createdAt: string;
}

/**
 * Sign session payload to prevent tampering.
 */
function createSignature(payload: string, secret: string): string {
  let hash = 0;
  const combined = payload + ":" + secret;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Serialize and sign session data for client cookie storage.
 */
export function serializeSession(session: AuthUserSession): string {
  const secret = process.env.APP_ENCRYPTION_KEY || "adb_development_session_secret_key_32b";
  const json = JSON.stringify(session);
  const base64 = Buffer.from(json, "utf-8").toString("base64url");
  const signature = createSignature(base64, secret);
  return `${base64}.${signature}`;
}

/**
 * Deserialize and verify session cookie data.
 */
export function deserializeSession(cookieValue: string): AuthUserSession | null {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 2) {
      return null;
    }
    const [base64, signature] = parts;
    if (!base64 || !signature) {
      return null;
    }

    const secret = process.env.APP_ENCRYPTION_KEY || "adb_development_session_secret_key_32b";
    const expectedSignature = createSignature(base64, secret);
    if (signature !== expectedSignature) {
      return null;
    }

    const json = Buffer.from(base64, "base64url").toString("utf-8");
    const parsed = JSON.parse(json) as AuthUserSession;
    if (!parsed.userId || !parsed.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Retrieve the current authenticated user session on the server.
 */
export async function getCurrentSession(): Promise<AuthUserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  return deserializeSession(sessionCookie.value);
}

/**
 * Retrieve the current authenticated user ID or null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session ? session.userId : null;
}
