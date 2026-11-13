/**
 * Listings Database Service - Atithi Devo Bhava.
 * Manages property listings, image attachments, search filters, and approval workflows.
 */

import { getSupabaseAdmin, getSupabaseClient } from "@/src/lib/supabase";

export interface ListingInput {
  hostId: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  listingType?: "homestay" | "room" | "cultural_experience" | "farmstay" | "artisan_studio";
  pricePerNightPaise: number;
  maxGuests: number;
  bedrooms?: number;
  bathrooms?: number;
  state: string;
  district: string;
  locality?: string;
  amenities?: string[];
  houseRules?: string;
  featuredImageUrl?: string;
}

export interface ListingRecord {
  id: string;
  host_id: string;
  title: string;
  title_hi?: string | null;
  description: string;
  description_hi?: string | null;
  listing_type: string;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "paused";
  price_per_night_paise: number;
  currency: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  state: string;
  district: string;
  locality?: string | null;
  amenities: string[];
  featured_image_url?: string | null;
  created_at: string;
  host?: {
    display_name: string;
    avatar_url?: string | null;
  };
}

/**
 * Fetch approved listings for public marketplace search.
 */
export async function getApprovedListings(filters?: {
  district?: string;
  state?: string;
  maxPricePaise?: number;
  guestsCount?: number;
  listingType?: string;
}): Promise<ListingRecord[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("listings")
    .select(`
      *,
      host:profiles!host_id (display_name, avatar_url)
    `)
    .eq("status", "approved");

  if (filters?.district) {
    query = query.ilike("district", `%${filters.district}%`);
  }
  if (filters?.state) {
    query = query.ilike("state", `%${filters.state}%`);
  }
  if (filters?.maxPricePaise) {
    query = query.lte("price_per_night_paise", filters.maxPricePaise);
  }
  if (filters?.guestsCount) {
    query = query.gte("max_guests", filters.guestsCount);
  }
  if (filters?.listingType) {
    query = query.eq("listing_type", filters.listingType);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as ListingRecord[];
}

/**
 * Fetch a single listing by ID with images.
 */
export async function getListingById(id: string): Promise<{
  listing: ListingRecord | null;
  images: Array<{ id: string; image_url: string; caption?: string }>;
}> {
  const supabase = getSupabaseClient();

  const [listingRes, imagesRes] = await Promise.all([
    supabase
      .from("listings")
      .select(`
        *,
        host:profiles!host_id (display_name, avatar_url, phone, email)
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("listing_images")
      .select("id, image_url, caption, display_order")
      .eq("listing_id", id)
      .order("display_order", { ascending: true }),
  ]);

  return {
    listing: (listingRes.data as unknown as ListingRecord) || null,
    images: imagesRes.data || [],
  };
}

/**
 * Create a new property listing (Pending admin review).
 */
export async function createListing(
  input: ListingInput
): Promise<{ success: boolean; listingId?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("listings")
    .insert({
      host_id: input.hostId,
      title: input.title,
      title_hi: input.titleHi || null,
      description: input.description,
      description_hi: input.descriptionHi || null,
      listing_type: input.listingType || "homestay",
      price_per_night_paise: input.pricePerNightPaise,
      max_guests: input.maxGuests,
      bedrooms: input.bedrooms || 1,
      bathrooms: input.bathrooms || 1,
      state: input.state,
      district: input.district,
      locality: input.locality || null,
      amenities: input.amenities || [],
      house_rules: input.houseRules || null,
      featured_image_url: input.featuredImageUrl || null,
      status: "pending_approval",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Failed to create listing" };
  }

  return { success: true, listingId: data.id };
}

/**
 * Fetch listings belonging to a specific host.
 */
export async function getListingsByHostId(hostId: string): Promise<ListingRecord[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as ListingRecord[];
}

/**
 * Fetch all pending listings for admin moderation.
 */
export async function getPendingListings(): Promise<ListingRecord[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      host:profiles!host_id (display_name, email)
    `)
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as ListingRecord[];
}

/**
 * Review listing (Approve or Reject).
 */
export async function reviewListing(
  listingId: string,
  decision: "approved" | "rejected",
  reviewerId: string,
  rejectionReason?: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("listings")
    .update({
      status: decision,
      approved_by: reviewerId,
      approved_at: decision === "approved" ? new Date().toISOString() : null,
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  return !error;
}

