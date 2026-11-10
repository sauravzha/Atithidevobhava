import { z } from "zod";

export const createBookingSchema = z.object({
  experienceId: z.string().uuid("Invalid experience identifier"),
  scheduleId: z.string().uuid("Invalid schedule identifier"),
  participantCount: z
    .number({ invalid_type_error: "Participant count must be a number" })
    .int("Participant count must be a whole number")
    .min(1, "At least 1 participant is required")
    .max(50, "Group size cannot exceed 50 participants"),
  participantNames: z
    .array(z.string().min(2, "Participant name must be at least 2 characters").max(100))
    .min(1, "At least one participant name is required"),
  idempotencyKey: z
    .string()
    .min(16, "Idempotency key must be at least 16 characters")
    .max(128, "Idempotency key too long"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const confirmPaymentSchema = z.object({
  bookingId: z.string().uuid("Invalid booking identifier"),
  orderId: z.string().min(1, "Order identifier required"),
  paymentId: z.string().min(1, "Payment identifier required"),
  signature: z.string().min(1, "Signature required"),
});

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid("Invalid booking identifier"),
  reason: z
    .string()
    .min(5, "A reason of at least 5 characters is required")
    .max(500, "Reason cannot exceed 500 characters"),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

export const paymentWebhookSchema = z.object({
  provider: z.enum(["development", "razorpay", "cashfree"]),
  rawBody: z.string().min(1),
  signature: z.string().min(1),
});

export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;

