/**
 * Hosts Database Service - Atithi Devo Bhava.
 * Manages host applications, verification workflows, and host profiles.
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";

export interface HostApplicationInput {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  propertyType: string;
  locationDistrict: string;
  locationState: string;
  locality: string;
  experienceDescription: string;
  householdAdultsCount?: number;
  hasChildren?: boolean;
  hasPets?: boolean;
  suggestedMeetingSpot?: string;
}

export interface HostApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  location_district: string;
  location_state: string;
  locality: string;
  experience_description: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  rejection_reason?: string | null;
  created_at: string;
}

/**
 * Submit a new host application.
 */
export async function submitHostApplication(
  input: HostApplicationInput
): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("host_applications")
    .insert({
      user_id: input.userId,
      full_name: input.fullName,
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      property_type: input.propertyType,
      location_district: input.locationDistrict,
      location_state: input.locationState,
      locality: input.locality,
      experience_description: input.experienceDescription,
      household_adults_count: input.householdAdultsCount || 1,
      has_children: input.hasChildren || false,
      has_pets: input.hasPets || false,
      suggested_meeting_spot: input.suggestedMeetingSpot || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Failed to submit application" };
  }

  return { success: true, applicationId: data.id };
}

/**
 * Get host profile for user.
 */
export async function getHostProfileByUserId(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("host_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * List pending host applications for admin review.
 */
export async function getPendingHostApplications(): Promise<HostApplication[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("host_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as HostApplication[];
}

/**
 * Approve or reject host application (Admin action).
 */
export async function reviewHostApplication(
  applicationId: string,
  decision: "approved" | "rejected",
  reviewerId: string,
  rejectionReason?: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { data: application, error: fetchErr } = await supabase
    .from("host_applications")
    .select("user_id")
    .eq("id", applicationId)
    .single();

  if (fetchErr || !application) return false;

  // Update application status
  const { error: appErr } = await supabase
    .from("host_applications")
    .update({
      status: decision,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (appErr) return false;

  // If approved, promote user role to 'host' and create active host_profile
  if (decision === "approved") {
    await supabase
      .from("profiles")
      .update({ role: "host", updated_at: new Date().toISOString() })
      .eq("id", application.user_id);

    await supabase.from("host_profiles").upsert(
      {
        user_id: application.user_id,
        status: "approved",
        verified_at: new Date().toISOString(),
        verified_by: reviewerId,
      },
      { onConflict: "user_id" }
    );
  }

  return true;
}

