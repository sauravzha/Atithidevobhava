import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get("x-razorpay-signature") ||
      request.headers.get("x-payment-signature") ||
      "";

    const paymentProvider = getPaymentProvider();

    // Verify webhook signature
    const isValid = paymentProvider.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = paymentProvider.parseWebhookPayload(rawBody);
    if (!event) {
      return NextResponse.json(
        { error: "Malformed webhook payload" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Deduplicate event using database ON CONFLICT protection
    const { data: isNew, error: hookErr } = await adminClient.rpc("record_payment_webhook", {
      p_provider: paymentProvider.providerName,
      p_event_id: event.eventId,
      p_event_type: event.eventType,
      p_payload: event.payload,
    });

    if (hookErr) {
      return NextResponse.json(
        { error: "Database error recording webhook" },
        { status: 500 }
      );
    }

    if (!isNew) {
      // Duplicate event: successfully acknowledged without re-processing
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }

    // Process payment capture if event is payment.captured or order.paid
    if (event.eventType === "payment.captured" || event.eventType === "order.paid") {
      if (event.orderId && event.paymentId && event.amountPaise) {
        // Find booking associated with payment order
        const { data: payment } = await adminClient
          .from("payments")
          .select("booking_id")
          .eq("payment_order_id", event.orderId)
          .single();

        if (payment?.booking_id) {
          await adminClient.rpc("record_payment_capture", {
            p_booking_id: payment.booking_id,
            p_payment_order_id: event.orderId,
            p_payment_id: event.paymentId,
            p_amount_paise: event.amountPaise,
            p_provider: paymentProvider.providerName,
          });
        }
      }
    }

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error processing webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

