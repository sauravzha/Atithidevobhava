/**
 * Unified Server Authentication Helper.
 * Server-only: Reads HTTP-only cookies and Supabase user context.
 */

import { getCurrentSession, type AuthUserSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type AuthenticatedUser, type DemoProfile, PRESET_DEMO_ACCOUNTS } from "@/lib/auth/demo-accounts";

export type { AuthenticatedUser, DemoProfile };
export { PRESET_DEMO_ACCOUNTS };

/**
 * Retrieve the current authenticated user across all active auth providers:
 * 1. Primary: Secure HTTP-only adb_session cookie
 * 2. Secondary: Native Supabase Auth session token (if configured)
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // 1. Check HTTP-only session cookie
  try {
    const session: AuthUserSession | null = await getCurrentSession();
    if (session && session.userId) {
      return {
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        photoUrl: session.photoUrl,
        role: session.role as AuthenticatedUser["role"],
        isAdult: session.isAdult,
        provider: session.provider as AuthenticatedUser["provider"],
      };
    }
  } catch {
    // Proceed to secondary check
  }

  // 2. Check Supabase client user
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id) {
      return {
        id: user.id,
        email: user.email || "member@atithidevobhava.in",
        displayName:
          (user.user_metadata?.displayName as string) ||
          (user.user_metadata?.name as string) ||
          (user.email ? user.email.split("@")[0] || "Verified Member" : "Verified Member"),
        photoUrl: (user.user_metadata?.photoUrl as string) || null,
        role: (user.user_metadata?.role as AuthenticatedUser["role"]) || "traveller",
        isAdult: true,
        provider: "otp",
      };
    }
  } catch {
    // Supabase client might be placeholder or unconfigured in dev
  }

  return null;
}
