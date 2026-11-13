/**
 * Profiles Database Service - Atithi Devo Bhava.
 * Maps and synchronizes user profiles with Supabase PostgreSQL.
 * Bridges Firebase Authentication identities seamlessly.
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";

export interface Profile {
  id: string;
  firebase_uid?: string | null;
  email: string;
  full_name?: string | null;
  display_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  role: "guest" | "host" | "admin";
  is_adult: boolean;
  bio?: string | null;
  country?: string;
  state?: string;
  district?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch profile by Supabase UUID.
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

/**
 * Fetch profile by Firebase UID.
 */
export async function getProfileByFirebaseUid(firebaseUid: string): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

/**
 * Synchronize Firebase Authenticated User into Supabase `profiles`.
 */
export async function syncFirebaseUserToSupabase(user: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role?: "guest" | "host" | "admin";
}): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  const cleanEmail = user.email.trim().toLowerCase();
  const cleanDisplayName = user.displayName?.trim() || cleanEmail.split("@")[0] || "User";
  const userRole = user.role || "guest";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        firebase_uid: user.uid,
        email: cleanEmail,
        display_name: cleanDisplayName,
        avatar_url: user.photoURL || null,
        role: userRole,
        is_adult: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) {
    console.warn("Failed to sync profile in Supabase:", error.message);
    return null;
  }

  return data as Profile;
}

/**
 * Update user profile fields.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.warn("Failed to update profile:", error.message);
    return null;
  }

  return data as Profile;
}

