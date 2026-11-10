export type PaymentProviderType = "development" | "razorpay" | "cashfree";

export interface PaymentOrderParams {
  bookingId: string;
  amountPaise: number;
  currency: string;
  receipt: string;
  customerName: string;
  customerEmail: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  orderId: string;
  amountPaise: number;
  currency: string;
  provider: PaymentProviderType;
  checkoutPayload: Record<string, unknown>;
  isDevSimulation: boolean;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface RefundParams {
  paymentId: string;
  amountPaise: number;
  reason: string;
  notes?: Record<string, string>;
}

export interface RefundResult {
  refundId: string;
  paymentId: string;
  amountPaise: number;
  status: "pending" | "completed" | "failed";
}

export interface WebhookEvent {
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  orderId?: string;
  paymentId?: string;
  amountPaise?: number;
}

export interface PaymentProviderAdapter {
  readonly providerName: PaymentProviderType;
  readonly isDevelopmentFallback: boolean;

  createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult>;

  verifyPayment(params: VerifyPaymentParams): Promise<{ valid: boolean; error?: string }>;

  processRefund(params: RefundParams): Promise<RefundResult>;

  verifyWebhookSignature(rawBody: string, signature: string): boolean;

  parseWebhookPayload(rawBody: string): WebhookEvent | null;
}
