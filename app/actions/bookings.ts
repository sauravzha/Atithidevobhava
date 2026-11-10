"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFeatureFlag } from "@/lib/supabase/flags";
import { getPaymentProvider } from "@/lib/payments";
import {
  createBookingSchema,
  confirmPaymentSchema,
  cancelBookingSchema,
  type CreateBookingInput,
  type ConfirmPaymentInput,
  type CancelBookingInput,
} from "@/lib/validation/booking";

export interface BookingActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Creates an experience booking atomically.
 * Gated by feature flags:
 * - If PAYMENTS_ENABLED is off, booking enters 'pending' enquiry mode.
 * - If PAYMENTS_ENABLED is on, creates a payment order with the active provider.
 */
export async function createBookingAction(
  rawInput: CreateBookingInput
): Promise<BookingActionResult<{ bookingId: string; orderResult?: unknown; enquiryMode?: boolean }>> {
  const parsed = createBookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed. Please check participant details.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Authentication required. Please sign in to book an experience.",
    };
  }

  const adminClient = createAdminClient();

  try {
    // 1. Check feature flags
    const paymentsEnabled = await getFeatureFlag("PAYMENTS_ENABLED");

    // 2. Execute atomic database booking function
    const { data: bookingId, error: rpcErr } = await adminClient.rpc("book_experience", {
      p_schedule_id: parsed.data.scheduleId,
      p_traveller_id: user.id,
      p_participants: parsed.data.participantCount,
      p_idempotency_key: parsed.data.idempotencyKey,
    });

    if (rpcErr || !bookingId) {
      return {
        success: false,
        error: rpcErr?.message || "Failed to reserve slots. The slot may be fully booked.",
      };
    }

    // 3. Insert participant names
    const participantRows = parsed.data.participantNames.map((name) => ({
      booking_id: bookingId,
      name: name.trim(),
    }));

    await adminClient.from("experience_booking_participants").insert(participantRows);

    // 4. Fetch booking and experience details for payment order
    const { data: booking } = await adminClient
      .from("experience_bookings")
      .select("id, total_price_paise, experience_id")
      .eq("id", bookingId)
      .single();

    if (!paymentsEnabled || !booking || booking.total_price_paise === 0) {
      // Enquiry mode or free experience: Return success without payment order
      return {
        success: true,
        data: {
          bookingId,
          enquiryMode: !paymentsEnabled,
        },
      };
    }

    // 5. Create payment order via payment provider
    const { data: userProfile } = await adminClient
      .from("traveller_profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    const paymentProvider = getPaymentProvider();
    const orderResult = await paymentProvider.createOrder({
      bookingId,
      amountPaise: booking.total_price_paise,
      currency: "INR",
      receipt: `rcpt_${bookingId.slice(0, 8)}`,
      customerName: userProfile?.full_name || "Guest Traveller",
      customerEmail: user.email || "guest@atithidevobhava.in",
    });

    return {
      success: true,
      data: {
        bookingId,
        orderResult,
        enquiryMode: false,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred while booking.",
    };
  }
}

/**
 * Confirms payment signature and transitions booking to 'confirmed'.
 * Writes balanced double-entry ledger rows and notifies host and guest.
 */
export async function confirmPaymentAction(
  rawInput: ConfirmPaymentInput
): Promise<BookingActionResult<{ paymentId: string }>> {
  const parsed = confirmPaymentSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid payment confirmation parameters",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Authentication required to confirm payment.",
    };
  }

  const adminClient = createAdminClient();

  try {
    // 1. Verify booking exists and caller is traveller
    const { data: booking, error: bErr } = await adminClient
      .from("experience_bookings")
      .select("id, traveller_id, total_price_paise, status")
      .eq("id", parsed.data.bookingId)
      .single();

    if (bErr || !booking) {
      return { success: false, error: "Booking record not found" };
    }

    if (booking.traveller_id !== user.id) {
      return { success: false, error: "Unauthorized: only the booking owner can confirm payment" };
    }

    // 2. Verify signature with payment provider
    const paymentProvider = getPaymentProvider();
    const verifyResult = await paymentProvider.verifyPayment({
      orderId: parsed.data.orderId,
      paymentId: parsed.data.paymentId,
      signature: parsed.data.signature,
    });

    if (!verifyResult.valid) {
      return {
        success: false,
        error: verifyResult.error || "Payment signature verification failed.",
      };
    }

    // 3. Atomically record payment capture, transition booking, and insert balanced ledger entries
    const { data: paymentRecordId, error: captureErr } = await adminClient.rpc(
      "record_payment_capture",
      {
        p_booking_id: parsed.data.bookingId,
        p_payment_order_id: parsed.data.orderId,
        p_payment_id: parsed.data.paymentId,
        p_amount_paise: booking.total_price_paise,
        p_provider: paymentProvider.providerName,
      }
    );

    if (captureErr || !paymentRecordId) {
      return {
        success: false,
        error: captureErr?.message || "Failed to record payment capture in database.",
      };
    }

    return {
      success: true,
      data: { paymentId: paymentRecordId },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error confirming payment.",
    };
  }
}

/**
 * Cancels a booking, releases schedule capacity, and logs audit record.
 */
export async function cancelBookingAction(
  rawInput: CancelBookingInput
): Promise<BookingActionResult<{ cancelled: boolean }>> {
  const parsed = cancelBookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed for cancellation",
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
    const { data: success, error: cancelErr } = await adminClient.rpc("cancel_booking", {
      p_booking_id: parsed.data.bookingId,
      p_cancelled_by: user.id,
      p_reason: parsed.data.reason,
    });

    if (cancelErr || !success) {
      return {
        success: false,
        error: cancelErr?.message || "Failed to cancel booking.",
      };
    }

    return {
      success: true,
      data: { cancelled: true },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error cancelling booking.",
    };
  }
}

/**
 * Fetches booking details with authorization check.
 */
export async function getBookingDetailsAction(bookingId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const adminClient = createAdminClient();

  const { data: booking, error: bErr } = await adminClient
    .from("experience_bookings")
    .select(`
      id,
      experience_id,
      schedule_id,
      traveller_id,
      participant_count,
      total_price_paise,
      commission_rate_snapshot,
      status,
      created_at,
      experiences (
        id,
        title_en,
        title_hi,
        provider_id,
        general_meeting_area,
        duration_minutes,
        category,
        cancellation_policy
      ),
      experience_schedules (
        id,
        start_time,
        end_time
      ),
      experience_booking_participants (
        id,
        name
      ),
      payments (
        id,
        amount_paise,
        status,
        provider,
        created_at
      )
    `)
    .eq("id", bookingId)
    .single();

  if (bErr || !booking) {
    return { success: false, error: "Booking not found" };
  }

  // Check authorization: traveller, provider, or admin
  const isTraveller = booking.traveller_id === user.id;
  const isProvider = (booking.experiences as { provider_id?: string })?.provider_id === user.id;

  const { data: adminPerm } = await adminClient
    .from("admin_permissions")
    .select("admin_role")
    .eq("user_id", user.id)
    .single();

  const isAdmin = Boolean(adminPerm);

  if (!isTraveller && !isProvider && !isAdmin) {
    return { success: false, error: "Unauthorized access to booking" };
  }

  return {
    success: true,
    data: booking,
    isTraveller,
    isProvider,
    isAdmin,
  };
}
