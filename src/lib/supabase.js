/**
 * Supabase JavaScript Client for Atithi Devo Bhava (अतिथि देवो भवः).
 * Spec reference: Section 2, 3, 20 of docs/SPEC.md.
 * Invariants: Row Level Security (RLS) enforcement, support for both publishable
 * and secret keys, zero tracking cookies, safe browser/server boundary.
 */

import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wmwnkromrgzkbsiwgigs.supabase.co";
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  "";

/**
 * Standard public Supabase client for browser/client-side operations.
 * Subject to Row Level Security (RLS) policies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Factory function to create a new client instance.
 */
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Administrative Supabase client with service role key.
 * SECURITY INVARIANT: Strictly server-side only. Bypasses RLS.
 */
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("Security Violation: getSupabaseAdmin() must never be executed in client-side code.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default supabase;

