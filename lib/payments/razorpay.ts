import crypto from "node:crypto";
import type {
  PaymentProviderAdapter,
  PaymentOrderParams,
  PaymentOrderResult,
  VerifyPaymentParams,
  RefundParams,
  RefundResult,
  WebhookEvent,
} from "./types";

/**
 * Production Razorpay Payment Provider Adapter.
 * Adheres strictly to Section 22 of the specification:
 * Server-created orders, verified webhooks, HMAC-SHA256 signatures,
 * and refunds without holding customer funds.
 */
export class RazorpayPaymentProcessor implements PaymentProviderAdapter {
  public readonly providerName = "razorpay" as const;
  public readonly isDevelopmentFallback = false;

  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  }

  private assertCredentials(): void {
    if (!this.keyId || !this.keySecret) {
      throw new Error(
        "Razorpay credentials missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
      );
    }
  }

  public async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    this.assertCredentials();

    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: params.amountPaise,
        currency: params.currency || "INR",
        receipt: params.receipt,
        notes: {
          bookingId: params.bookingId,
          ...params.notes,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Razorpay order creation failed: ${errorData.error?.description || response.statusText}`
      );
    }

    const orderData = await response.json();

    return {
      orderId: orderData.id,
      amountPaise: orderData.amount,
      currency: orderData.currency,
      provider: "razorpay",
      checkoutPayload: {
        key: this.keyId,
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Atithi Devo Bhava",
        description: "Cultural Experience Booking",
        prefill: {
          name: params.customerName,
          email: params.customerEmail,
        },
      },
      isDevSimulation: false,
    };
  }

  public async verifyPayment(
    params: VerifyPaymentParams
  ): Promise<{ valid: boolean; error?: string }> {
    this.assertCredentials();

    if (!params.orderId || !params.paymentId || !params.signature) {
      return { valid: false, error: "Missing required signature fields" };
    }

    const payload = `${params.orderId}|${params.paymentId}`;
    const expected = crypto
      .createHmac("sha256", this.keySecret)
      .update(payload)
      .digest("hex");

    // Timing-safe comparison to prevent side-channel timing attacks
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(params.signature);

    if (
      expectedBuffer.length === actualBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      return { valid: true };
    }

    return { valid: false, error: "Signature mismatch: verification failed" };
  }

  public async processRefund(params: RefundParams): Promise<RefundResult> {
    this.assertCredentials();

    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${params.paymentId}/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: params.amountPaise,
          notes: {
            reason: params.reason,
            ...params.notes,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Razorpay refund failed: ${err.error?.description || response.statusText}`);
    }

    const refundData = await response.json();

    return {
      refundId: refundData.id,
      paymentId: params.paymentId,
      amountPaise: refundData.amount,
      status: refundData.status === "processed" ? "completed" : "pending",
    };
  }

  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookSecret) {
      return false;
    }

    const expected = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(signature);

    return (
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf)
    );
  }

  public parseWebhookPayload(rawBody: string): WebhookEvent | null {
    try {
      const data = JSON.parse(rawBody);
      return {
        eventId: data.event_id || data.id,
        eventType: data.event,
        payload: data,
        orderId: data.payload?.payment?.entity?.order_id,
        paymentId: data.payload?.payment?.entity?.id,
        amountPaise: data.payload?.payment?.entity?.amount,
      };
    } catch {
      return null;
    }
  }
}
