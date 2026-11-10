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
 * Cashfree payment provider stub per Section 22 specification.
 * Clear interface waiting for merchant credentials and CA confirmation.
 */
export class CashfreePaymentProcessor implements PaymentProviderAdapter {
  public readonly providerName = "cashfree" as const;
  public readonly isDevelopmentFallback = false;

  private appId: string;
  private secretKey: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || "";
    this.secretKey = process.env.CASHFREE_SECRET_KEY || "";
  }

  public async createOrder(_params: PaymentOrderParams): Promise<PaymentOrderResult> {
    if (!this.appId || !this.secretKey) {
      throw new Error(
        "Cashfree integration is currently a stub pending credentials. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY."
      );
    }
    throw new Error("Cashfree order creation not yet implemented. Use Razorpay or development simulator.");
  }

  public async verifyPayment(
    _params: VerifyPaymentParams
  ): Promise<{ valid: boolean; error?: string }> {
    return {
      valid: false,
      error: "Cashfree verification stub: credentials not configured.",
    };
  }

  public async processRefund(_params: RefundParams): Promise<RefundResult> {
    throw new Error("Cashfree refund stub: credentials not configured.");
  }

  public verifyWebhookSignature(_rawBody: string, _signature: string): boolean {
    return false;
  }

  public parseWebhookPayload(_rawBody: string): WebhookEvent | null {
    return null;
  }
}
