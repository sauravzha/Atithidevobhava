import { createClient } from "@supabase/supabase-js";

/**
 * Creates an administrative Supabase client using the service-role key.
 * Security Invariant: Strictly server-side. Bypasses RLS for system triggers,
 * automated cron routines, and audit logging. NEVER import or execute in client bundles.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Security Error: createAdminClient cannot be called from browser client code.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    // Development fallback client
    return createClient(
      "https://placeholder-project.supabase.co",
      "placeholder-service-role-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

