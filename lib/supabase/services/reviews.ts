/**
 * Reviews Service for Atithi Devo Bhava (अतिथि देवो भवः).
 * Manages verified guest reviews for listings and hosts.
 * Spec reference: Section 13, 20 of docs/SPEC.md.
 */

import { getSupabaseAdmin, getSupabaseClient } from "@/src/lib/supabase";

export interface CreateReviewParams {
  bookingId: string;
  listingId: string;
  authorId: string;
  hostId: string;
  rating: number;
  cleanlinessRating?: number;
  hospitalityRating?: number;
  culturalAuthenticityRating?: number;
  comment: string;
}

export interface ReviewRecord {
  id: string;
  booking_id: string;
  listing_id: string;
  author_id: string;
  host_id: string;
  rating: number;
  cleanliness_rating?: number | null;
  hospitality_rating?: number | null;
  cultural_authenticity_rating?: number | null;
  comment: string;
  is_verified_stay: boolean;
  is_published: boolean;
  created_at: string;
  author?: {
    display_name: string;
    avatar_url?: string | null;
  } | null;
}

/**
 * Creates a verified guest review.
 * Only allowed for confirmed, completed bookings.
 */
export async function createReview(
  params: CreateReviewParams
): Promise<{ success: boolean; data?: ReviewRecord; error?: string }> {
  try {
    const admin = getSupabaseAdmin();

    // Verify that the booking is confirmed/completed and belongs to the author
    const { data: booking, error: bErr } = await admin
      .from("bookings")
      .select("id, status, guest_id, listing_id")
      .eq("id", params.bookingId)
      .single();

    if (bErr || !booking) {
      return { success: false, error: "Booking record not found." };
    }

    if (booking.guest_id !== params.authorId) {
      return { success: false, error: "Unauthorized: only the booking guest can submit a review." };
    }

    if (booking.status !== "confirmed" && booking.status !== "completed") {
      return { success: false, error: "Reviews can only be submitted for completed stays." };
    }

    // Insert review
    const { data, error } = await admin
      .from("reviews")
      .insert({
        booking_id: params.bookingId,
        listing_id: params.listingId,
        author_id: params.authorId,
        host_id: params.hostId,
        rating: Math.min(5, Math.max(1, Math.round(params.rating))),
        cleanliness_rating: params.cleanlinessRating,
        hospitality_rating: params.hospitalityRating,
        cultural_authenticity_rating: params.culturalAuthenticityRating,
        comment: params.comment.trim(),
        is_verified_stay: true,
        is_published: true,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as ReviewRecord };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit review.",
    };
  }
}

/**
 * Retrieves published reviews for a specific listing.
 */
export async function getReviewsByListing(
  listingId: string
): Promise<{ success: boolean; data: ReviewRecord[]; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        author:profiles!reviews_author_id_fkey(display_name, avatar_url)
      `)
      .eq("listing_id", listingId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: (data as unknown as ReviewRecord[]) || [] };
  } catch (err: unknown) {
    return {
      success: false,
      data: [],
      error: err instanceof Error ? err.message : "Failed to fetch reviews.",
    };
  }
}

/**
 * Moderates a review (admin action).
 */
export async function setReviewPublicationStatus(
  reviewId: string,
  isPublished: boolean,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getSupabaseAdmin();

    const { error } = await admin
      .from("reviews")
      .update({ is_published: isPublished })
      .eq("id", reviewId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Log admin audit
    await admin.from("admin_audit_logs").insert({
      admin_id: adminId,
      action: isPublished ? "publish_review" : "unpublish_review",
      target_type: "review",
      target_id: reviewId,
      details: { is_published: isPublished },
    });

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update review status.",
    };
  }
}
