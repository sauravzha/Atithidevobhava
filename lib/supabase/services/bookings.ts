/**
 * Bookings Database Service - Atithi Devo Bhava.
 * Manages reservations, atomic concurrency locking, double-booking prevention,
 * and integer paise financial totals.
 */

import { getSupabaseAdmin, getSupabaseClient } from "@/src/lib/supabase";

export interface BookingInput {
  listingId: string;
  guestId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestCount: number;
  idempotencyKey?: string;
}

export interface BookingRecord {
  id: string;
  booking_code: string;
  listing_id: string;
  guest_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_nights: number;
  base_amount_paise: number;
  service_fee_paise: number;
  taxes_paise: number;
  total_amount_paise: number;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "disputed";
  cancellation_reason?: string | null;
  created_at: string;
  listing?: {
    title: string;
    featured_image_url?: string | null;
    district: string;
    state: string;
  };
  guest?: {
    display_name: string;
    email: string;
    phone?: string | null;
  };
  host?: {
    display_name: string;
    phone?: string | null;
  };
}

/**
 * Create a new booking atomically using the database function.
 */
export async function createBooking(
  input: BookingInput
): Promise<{
  success: boolean;
  bookingId?: string;
  bookingCode?: string;
  totalAmountPaise?: number;
  nights?: number;
  error?: string;
}> {
  const supabase = getSupabaseAdmin();
  const idempotencyKey = input.idempotencyKey || `adb-bkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    const { data, error } = await supabase.rpc("book_listing", {
      p_listing_id: input.listingId,
      p_guest_id: input.guestId,
      p_check_in: input.checkIn,
      p_check_out: input.checkOut,
      p_guest_count: input.guestCount,
      p_idempotency_key: idempotencyKey,
    });

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to create booking" };
    }

    const res = data as {
      success: boolean;
      booking_id: string;
      booking_code: string;
      total_amount_paise: number;
      nights: number;
    };

    return {
      success: true,
      bookingId: res.booking_id,
      bookingCode: res.booking_code,
      totalAmountPaise: res.total_amount_paise,
      nights: res.nights,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error executing booking transaction",
    };
  }
}

/**
 * Fetch booking details by ID.
 */
export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      listing:listings (title, featured_image_url, district, state),
      guest:profiles!guest_id (display_name, email, phone),
      host:profiles!host_id (display_name, phone)
    `)
    .eq("id", bookingId)
    .single();

  if (error || !data) return null;
  return data as unknown as BookingRecord;
}

/**
 * Fetch bookings for a guest.
 */
export async function getBookingsByGuestId(guestId: string): Promise<BookingRecord[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      listing:listings (title, featured_image_url, district, state),
      host:profiles!host_id (display_name, phone)
    `)
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as BookingRecord[];
}

/**
 * Fetch bookings for a host's listings.
 */
export async function getBookingsByHostId(hostId: string): Promise<BookingRecord[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      listing:listings (title, featured_image_url, district, state),
      guest:profiles!guest_id (display_name, email, phone)
    `)
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as BookingRecord[];
}

/**
 * Cancel a booking with reason.
 */
export async function cancelBooking(
  bookingId: string,
  cancelledBy: string,
  reason: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_by: cancelledBy,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  return !error;
}

