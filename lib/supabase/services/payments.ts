/**
 * Payments Database Service - Atithi Devo Bhava.
 * Manages Razorpay orders, signatures, webhook logs, and status transitions.
 * Invariants: Monetary amounts strictly in integer paise (INR), duplicate webhook protection.
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";
import crypto from "crypto";

export interface PaymentRecord {
  id: string;
  booking_id: string;
  user_id: string;
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  amount_paise: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  created_at: string;
}

/**
 * Create a new payment record when an order is created.
 */
export async function createPaymentRecord(
  bookingId: string,
  userId: string,
  amountPaise: number,
  razorpayOrderId: string
): Promise<PaymentRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      booking_id: bookingId,
      user_id: userId,
      provider: "razorpay",
      razorpay_order_id: razorpayOrderId,
      amount_paise: amountPaise,
      currency: "INR",
      status: "created",
    })
    .select()
    .single();

  if (error || !data) {
    console.warn("Failed to create payment record:", error?.message);
    return null;
  }
  return data as PaymentRecord;
}

/**
 * Verify Razorpay payment signature using HMAC SHA256.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

/**
 * Record successful payment capture and confirm booking.
 */
export async function recordPaymentCapture(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature?: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  // 1. Update payment record
  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .update({
      status: "captured",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature || null,
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .select("booking_id")
    .single();

  if (payErr || !payment) return false;

  // 2. Confirm the corresponding booking
  const { error: bkgErr } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.booking_id);

  return !bkgErr;
}

/**
 * Record idempotent webhook event.
 */
export async function recordWebhookEvent(
  eventId: string,
  eventType: string,
  payload: Record<string, unknown>
): Promise<{ alreadyProcessed: boolean }> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("payment_events")
    .select("id, processed")
    .eq("event_id", eventId)
    .single();

  if (existing) {
    return { alreadyProcessed: true };
  }

  await supabase.from("payment_events").insert({
    event_id: eventId,
    event_type: eventType,
    payload,
    processed: true,
    processed_at: new Date().toISOString(),
  });

  return { alreadyProcessed: false };
}

