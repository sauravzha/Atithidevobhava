"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  createExperienceSchema,
  experienceEnquirySchema,
  adminReviewExperienceSchema,
  createScheduleSchema,
  respondToEnquirySchema,
  type CreateExperienceInput,
  type ExperienceEnquiryInput,
  type AdminReviewExperienceInput,
  type CreateScheduleInput,
  type RespondToEnquiryInput,
} from "@/lib/validation/experience";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Helper to slugify English title.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server action to create a new experience listing (Product B).
 * Experiences start in 'draft' or 'pending_review' status.
 */
export async function createExperienceAction(
  input: CreateExperienceInput,
  submitForReview: boolean = false
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required to publish experiences" };
    }

    const validation = createExperienceSchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Validation failed. Please correct the highlighted errors.",
        fieldErrors,
      };
    }

    const validData = validation.data;
    const baseSlug = slugify(validData.title_en);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
    const status = submitForReview ? "pending_review" : "draft";

    const adminClient = getAdminSupabaseClient();

    // Ensure experience_providers entry exists
    await adminClient
      .from("experience_providers")
      .upsert(
        {
          user_id: user.id,
          provider_type: "individual",
          genuine_offer_description: validData.description_en.slice(0, 300),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    // Insert experience record
    const { data: expData, error: expError } = await adminClient
      .from("experiences")
      .insert({
        provider_id: user.id,
        title_en: validData.title_en,
        title_hi: validData.title_hi || validData.title_en,
        slug: uniqueSlug,
        category: validData.category,
        description_en: validData.description_en,
        description_hi: validData.description_hi || validData.description_en,
        state_id: validData.state_id,
        district_id: validData.district_id,
        city_id: validData.city_id || null,
        general_meeting_area: validData.general_meeting_area,
        duration_minutes: validData.duration_minutes,
        price_per_person_paise: validData.price_per_person_paise,
        min_participants: validData.min_participants,
        max_participants: validData.max_participants,
        included: validData.included,
        excluded: validData.excluded,
        cancellation_policy: validData.cancellation_policy,
        safety_information: validData.safety_information,
        booking_requirements: validData.booking_requirements || null,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, slug")
      .single();

    if (expError || !expData) {
      return { success: false, error: expError?.message || "Failed to create experience listing" };
    }

    // Insert photos
    if (validData.images.length > 0) {
      const imagesToInsert = validData.images.map((img, idx) => ({
        experience_id: expData.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        credit: img.credit,
        licence: img.licence,
        display_order: idx,
      }));

      await adminClient.from("experience_images").insert(imagesToInsert);
    }

    revalidatePath("/dashboard/experiences");
    revalidatePath("/explore/experiences");

    return {
      success: true,
      data: { id: expData.id, slug: expData.slug },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}

/**
 * Server action to submit an experience for admin review.
 */
export async function submitExperienceForReviewAction(
  experienceId: string
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    const adminClient = getAdminSupabaseClient();
    const { error } = await adminClient.rpc("submit_experience_for_review", {
      p_experience_id: experienceId,
      p_provider_id: user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/experiences");
    revalidatePath(`/experiences/${experienceId}`);

    return { success: true, data: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}

/**
 * Server action to add a scheduled time slot to an experience.
 */
export async function createScheduleAction(
  input: CreateScheduleInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    const validation = createScheduleSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid schedule data",
      };
    }

    const valid = validation.data;
    const adminClient = getAdminSupabaseClient();

    // Verify ownership
    const { data: exp, error: expError } = await adminClient
      .from("experiences")
      .select("id, provider_id")
      .eq("id", valid.experience_id)
      .single();

    if (expError || !exp || exp.provider_id !== user.id) {
      return { success: false, error: "Experience not found or user is not the host" };
    }

    const { data: schedule, error: schedError } = await adminClient
      .from("experience_schedules")
      .insert({
        experience_id: valid.experience_id,
        start_time: valid.start_time,
        end_time: valid.end_time,
        capacity: valid.capacity,
        booked_count: 0,
      })
      .select("id")
      .single();

    if (schedError || !schedule) {
      return { success: false, error: schedError?.message || "Failed to create schedule slot" };
    }

    revalidatePath(`/dashboard/experiences/${valid.experience_id}/schedules`);
    return { success: true, data: { id: schedule.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}

/**
 * Server action to submit a Phase 1 enquiry for an experience.
 * Prices remain masked and no payment processor is invoked.
 */
export async function submitExperienceEnquiryAction(
  input: ExperienceEnquiryInput
): Promise<ActionResult<{ bookingId: string }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please log in to submit a cultural enquiry" };
    }

    const validation = experienceEnquirySchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Validation failed. Please correct the highlighted errors.",
        fieldErrors,
      };
    }

    const valid = validation.data;
    const adminClient = getAdminSupabaseClient();

    // Call database transition function
    const { data: bookingId, error: rpcError } = await adminClient.rpc(
      "submit_experience_enquiry",
      {
        p_experience_id: valid.experience_id,
        p_schedule_id: valid.schedule_id || null,
        p_traveller_id: user.id,
        p_participant_count: valid.participant_count,
        p_message: valid.message,
        p_idempotency_key: valid.idempotency_key,
      }
    );

    if (rpcError) {
      return { success: false, error: rpcError.message };
    }

    revalidatePath(`/experiences/${valid.experience_id}`);
    revalidatePath("/dashboard/experiences");

    return { success: true, data: { bookingId } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}

/**
 * Server action for experience provider to accept or decline an enquiry.
 */
export async function respondToExperienceEnquiryAction(
  input: RespondToEnquiryInput
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    const validation = respondToEnquirySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid response data",
      };
    }

    const valid = validation.data;
    const adminClient = getAdminSupabaseClient();

    const { error: rpcError } = await adminClient.rpc("respond_to_experience_enquiry", {
      p_booking_id: valid.booking_id,
      p_provider_id: user.id,
      p_decision: valid.decision,
      p_response_message: valid.response_message || null,
    });

    if (rpcError) {
      return { success: false, error: rpcError.message };
    }

    revalidatePath("/dashboard/experiences");
    return { success: true, data: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}

/**
 * Server action for administrative moderation of experience listings.
 * Enforces role checks and writes append-only audit log records.
 */
export async function adminModerateExperienceAction(
  input: AdminReviewExperienceInput
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Administrative authentication required" };
    }

    const validation = adminReviewExperienceSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      };
    }

    const valid = validation.data;
    const adminClient = getAdminSupabaseClient();

    // Moderate experience via security definer function
    const { error: rpcError } = await adminClient.rpc("moderate_experience", {
      p_experience_id: valid.experience_id,
      p_admin_id: user.id,
      p_decision: valid.decision,
      p_reason: valid.reason || "Approved by content moderator",
      p_feedback: valid.feedback || null,
    });

    if (rpcError) {
      return { success: false, error: rpcError.message };
    }

    revalidatePath("/admin/experiences");
    revalidatePath(`/experiences/${valid.experience_id}`);
    revalidatePath("/explore/experiences");

    return { success: true, data: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error occurred";
    return { success: false, error: msg };
  }
}
