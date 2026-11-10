"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFeatureFlag } from "@/lib/supabase/flags";
import {
  createAccommodationListingSchema,
  stayBookingRequestSchema,
  guestComplianceSchema,
  hostComplianceChecklistSchema,
  type CreateAccommodationListingInput,
  type StayBookingRequestInput,
  type GuestComplianceInput,
  type HostComplianceChecklistInput,
} from "@/lib/validation/accommodation";

export interface AccommodationActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Creates a draft accommodation listing.
 */
export async function createAccommodationListingAction(
  rawInput: CreateAccommodationListingInput
): Promise<AccommodationActionResult<{ listingId: string }>> {
  const parsed = createAccommodationListingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed for accommodation listing",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to create a listing" };
  }

  const adminClient = createAdminClient();

  try {
    const { data: listing, error: insertErr } = await adminClient
      .from("accommodation_listings")
      .insert({
        host_id: user.id,
        title: parsed.data.title,
        accommodation_type: parsed.data.accommodationType,
        room_type: parsed.data.roomType,
        bathroom_type: parsed.data.bathroomType,
        max_guests: parsed.data.maxGuests,
        room_count: parsed.data.roomCount,
        food_provided: parsed.data.foodProvided || null,
        general_location: parsed.data.generalLocation,
        household_adults_count: parsed.data.householdAdultsCount,
        has_children: parsed.data.hasChildren,
        has_pets: parsed.data.hasPets,
        other_residents_description: parsed.data.otherResidentsDescription || null,
        house_rules: parsed.data.houseRules || null,
        price_per_night_paise: parsed.data.pricePerNightPaise,
        status: "draft",
      })
      .select("id")
      .single();

    if (insertErr || !listing) {
      return {
        success: false,
        error: insertErr?.message || "Failed to create accommodation listing",
      };
    }

    // Ensure user has accommodation_host role assigned
    await adminClient.from("user_roles").upsert(
      { user_id: user.id, role: "accommodation_host" },
      { onConflict: "user_id,role" }
    );

    return {
      success: true,
      data: { listingId: listing.id },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error creating accommodation listing",
    };
  }
}

/**
 * Submits an accommodation listing for admin review.
 * Enforces Tier 2 stay approval prerequisites.
 */
export async function submitAccommodationForReviewAction(
  listingId: string
): Promise<AccommodationActionResult<{ submitted: boolean }>> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  try {
    const { data: listing, error: lErr } = await adminClient
      .from("accommodation_listings")
      .select("id, host_id, status, accommodation_type")
      .eq("id", listingId)
      .single();

    if (lErr || !listing) {
      return { success: false, error: "Listing not found" };
    }

    if (listing.host_id !== user.id) {
      return { success: false, error: "Unauthorized: only the host can submit this listing" };
    }

    // Verify compliance record exists
    const { data: compliance } = await adminClient
      .from("host_compliance_records")
      .select("foreigner_duty_acknowledged")
      .eq("host_id", user.id)
      .single();

    if (!compliance?.foreigner_duty_acknowledged) {
      return {
        success: false,
        error: "You must complete the host compliance checklist and acknowledge the foreign guest reporting duty before submitting for review.",
      };
    }

    const { error: updateErr } = await adminClient
      .from("accommodation_listings")
      .update({
        status: "pending_review",
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Log to admin_audit_logs
    await adminClient.from("admin_audit_logs").insert({
      action: "SUBMIT_ACCOMMODATION_REVIEW",
      target_entity: "accommodation_listings",
      target_id: listingId,
      performed_by: user.id,
      reason: "Host submitted accommodation for safety & compliance review",
    });

    return {
      success: true,
      data: { submitted: true },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error submitting listing for review",
    };
  }
}

/**
 * Submits a stay booking request.
 * Strictly gated by STAYS_ENABLED feature flag.
 */
export async function submitStayBookingRequestAction(
  rawInput: StayBookingRequestInput
): Promise<AccommodationActionResult<{ requestId: string; noticeMode?: boolean }>> {
  const parsed = stayBookingRequestSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed for stay booking request",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to request a stay" };
  }

  // Feature Flag: STAYS_ENABLED must be checked
  const staysEnabled = await getFeatureFlag("STAYS_ENABLED");
  if (!staysEnabled) {
    return {
      success: false,
      error: "Stay with a Local is not open yet. Verification and compliance audits in our pilot districts (Darbhanga & Madhubani) are currently in progress.",
    };
  }

  const adminClient = createAdminClient();

  try {
    const { data: requestId, error: rpcErr } = await adminClient.rpc(
      "submit_stay_booking_request",
      {
        p_listing_id: parsed.data.listingId,
        p_traveller_id: user.id,
        p_check_in: parsed.data.checkIn,
        p_check_out: parsed.data.checkOut,
        p_adult_count: parsed.data.adultCount,
        p_child_count: parsed.data.childCount,
        p_idempotency_key: parsed.data.idempotencyKey,
        p_special_requirements: parsed.data.introduction,
      }
    );

    if (rpcErr || !requestId) {
      return {
        success: false,
        error: rpcErr?.message || "Failed to submit stay request. Dates may conflict with another booking.",
      };
    }

    return {
      success: true,
      data: { requestId },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error processing stay request",
    };
  }
}

/**
 * Confirms a stay booking request and engages the btree_gist exclusion lock.
 */
export async function confirmStayBookingAction(
  requestId: string
): Promise<AccommodationActionResult<{ confirmed: boolean }>> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  try {
    const { data: confirmed, error: rpcErr } = await adminClient.rpc("confirm_stay_booking", {
      p_request_id: requestId,
      p_host_id: user.id,
    });

    if (rpcErr || !confirmed) {
      return {
        success: false,
        error: rpcErr?.message || "Failed to confirm stay. Date range may overlap with an existing reservation.",
      };
    }

    return {
      success: true,
      data: { confirmed: true },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error confirming stay booking",
    };
  }
}

/**
 * Saves host compliance checklist and foreign guest reporting acknowledgement.
 */
export async function saveHostComplianceChecklistAction(
  rawInput: HostComplianceChecklistInput
): Promise<AccommodationActionResult<{ saved: boolean }>> {
  const parsed = hostComplianceChecklistSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please complete all mandatory compliance declarations",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  try {
    const { error: upsertErr } = await adminClient.from("host_compliance_records").upsert({
      host_id: user.id,
      checklist_completed: true,
      foreigner_duty_acknowledged: true,
      state_tourism_registration_number: parsed.data.stateTourismRegistrationNumber || null,
      updated_at: new Date().toISOString(),
    });

    if (upsertErr) {
      return { success: false, error: upsertErr.message };
    }

    // Log to admin_audit_logs
    await adminClient.from("admin_audit_logs").insert({
      action: "ACKNOWLEDGE_FOREIGN_GUEST_DUTY",
      target_entity: "host_compliance_records",
      target_id: user.id,
      performed_by: user.id,
      reason: "Host completed compliance checklist and acknowledged Form C / Form III 24h duty",
    });

    return {
      success: true,
      data: { saved: true },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error saving compliance checklist",
    };
  }
}

/**
 * Records a foreign guest entry for host statutory tracking (Form C / Form III).
 * Invariant: Never stores passport or visa numbers by default.
 */
export async function recordGuestComplianceEntryAction(
  rawInput: GuestComplianceInput
): Promise<AccommodationActionResult<{ recordId: string }>> {
  const parsed = guestComplianceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed for guest compliance entry",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  try {
    const { data: record, error: insertErr } = await adminClient
      .from("guest_records")
      .insert({
        host_id: user.id,
        guest_full_name_encrypted: parsed.data.guestFullName,
        nationality: parsed.data.nationality,
        arrival_date: parsed.data.arrivalDate,
        departure_date: parsed.data.departureDate,
        form_submitted: parsed.data.formSubmitted,
        submission_date: parsed.data.submissionDate || null,
        submission_reference: parsed.data.submissionReference || null,
      })
      .select("id")
      .single();

    if (insertErr || !record) {
      return {
        success: false,
        error: insertErr?.message || "Failed to record guest entry",
      };
    }

    return {
      success: true,
      data: { recordId: record.id },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error recording guest compliance entry",
    };
  }
}

/**
 * Fetches host compliance overview and guest registry.
 */
export async function getHostComplianceRecordsAction() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  const { data: compliance } = await adminClient
    .from("host_compliance_records")
    .select("*")
    .eq("host_id", user.id)
    .single();

  const { data: guestRecords } = await adminClient
    .from("guest_records")
    .select("*")
    .eq("host_id", user.id)
    .order("arrival_date", { ascending: false });

  return {
    success: true,
    data: {
      compliance: compliance || null,
      guestRecords: guestRecords || [],
    },
  };
}

