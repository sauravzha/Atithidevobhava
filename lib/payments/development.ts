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
 * Clearly labelled development-mode payment simulator.
 * Invariant: Never pretend a real integration is active without credentials.
 * Used for local development and test automation.
 */
export class DevPaymentProcessor implements PaymentProviderAdapter {
  public readonly providerName = "development" as const;
  public readonly isDevelopmentFallback = true;

  private secret = "dev_secret_simulation_only";

  public async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const orderId = `order_dev_${Date.now()}_${params.bookingId.slice(0, 8)}`;
    return {
      orderId,
      amountPaise: params.amountPaise,
      currency: params.currency,
      provider: "development",
      checkoutPayload: {
        devMode: true,
        notice: "Development Payment Simulator (No actual money is charged)",
        orderId,
        amount: params.amountPaise,
        currency: params.currency,
        bookingId: params.bookingId,
      },
      isDevSimulation: true,
    };
  }

  public async verifyPayment(
    params: VerifyPaymentParams
  ): Promise<{ valid: boolean; error?: string }> {
    if (!params.orderId || !params.paymentId || !params.signature) {
      return { valid: false, error: "Missing required payment verification parameters" };
    }

    // In dev simulation, valid signatures must match our expected HMAC format
    const expected = crypto
      .createHmac("sha256", this.secret)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    if (params.signature === expected || params.signature.startsWith("sig_dev_valid_")) {
      return { valid: true };
    }

    return { valid: false, error: "Invalid payment simulation signature" };
  }

  public async processRefund(params: RefundParams): Promise<RefundResult> {
    return {
      refundId: `rfnd_dev_${Date.now()}`,
      paymentId: params.paymentId,
      amountPaise: params.amountPaise,
      status: "completed",
    };
  }

  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const expected = crypto
      .createHmac("sha256", this.secret)
      .update(rawBody)
      .digest("hex");

    return signature === expected || signature.startsWith("sig_dev_webhook_");
  }

  public parseWebhookPayload(rawBody: string): WebhookEvent | null {
    try {
      const data = JSON.parse(rawBody);
      return {
        eventId: data.event_id || `evt_dev_${Date.now()}`,
        eventType: data.event || "payment.captured",
        payload: data,
        orderId: data.payload?.payment?.entity?.order_id,
        paymentId: data.payload?.payment?.entity?.id,
        amountPaise: data.payload?.payment?.entity?.amount,
      };
    } catch {
      return null;
    }
  }

  /**
   * Helper to generate a valid simulation signature in automated tests.
   */
  public generateTestSignature(orderId: string, paymentId: string): string {
    return crypto
      .createHmac("sha256", this.secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
  }
}
