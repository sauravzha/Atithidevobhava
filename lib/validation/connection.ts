/**
 * Validation schemas for Connection Requests (Meet a Local) and Mutual Contact Exchanges.
 * Spec reference: Section 6 and Section 9 of docs/SPEC.md.
 */

import { z } from "zod";

export const connectionPurposeEnum = z.enum(
  [
    "tea_or_coffee",
    "market_walk",
    "language_exchange",
    "photography_walk",
    "local_area_tour",
    "other",
  ],
  {
    required_error: "Please select a purpose for your meetup request.",
  }
);

export type ConnectionPurpose = z.infer<typeof connectionPurposeEnum>;

/**
 * Connection Request Schema.
 * Spec rules:
 * - Purpose: tea or coffee, market walk, language exchange, photography walk, local area tour, other
 * - Proposed dates
 * - Suggested PUBLIC meeting place
 * - Message: 50 to 600 characters
 */
export const createConnectionRequestSchema = z.object({
  recipientId: z.string({ required_error: "Recipient ID is required." }).min(1),
  purpose: connectionPurposeEnum,
  proposedDates: z
    .string({ required_error: "Please propose one or more dates." })
    .trim()
    .min(3, "Proposed dates must be at least 3 characters.")
    .max(100, "Proposed dates cannot exceed 100 characters."),
  suggestedPublicPlace: z
    .string({ required_error: "A suggested public meeting place is required." })
    .trim()
    .min(5, "Suggested public venue must be at least 5 characters.")
    .max(200, "Venue description cannot exceed 200 characters."),
  initialMessage: z
    .string({ required_error: "A personal introductory message is required." })
    .trim()
    .min(50, "Introductory message must be at least 50 characters to explain your intent.")
    .max(600, "Introductory message cannot exceed 600 characters."),
  idempotencyKey: z.string().min(10, "Idempotency key required."),
});

export type CreateConnectionRequestInput = z.infer<typeof createConnectionRequestSchema>;

/**
 * Decline Connection Schema.
 * Traveller only sees "unable to meet this request".
 */
export const declineConnectionSchema = z.object({
  connectionId: z.string().min(1),
  declineReason: z.enum([
    "busy_schedule",
    "away_from_area",
    "not_a_good_fit",
    "other",
  ]),
});

export type DeclineConnectionInput = z.infer<typeof declineConnectionSchema>;

/**
 * Schedule Connection Schema.
 */
export const scheduleConnectionSchema = z.object({
  connectionId: z.string().min(1),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "A valid scheduled date and time is required.",
  }),
  confirmedPublicPlace: z
    .string()
    .trim()
    .min(5, "Confirmed public venue must be at least 5 characters.")
    .max(200),
});

export type ScheduleConnectionInput = z.infer<typeof scheduleConnectionSchema>;

/**
 * Contact Exchange Consent Schema.
 * Governs mutual contact reveal per Section 9.
 */
export const contactExchangeConsentSchema = z
  .object({
    connectionId: z.string().min(1),
    shareEmail: z.boolean().default(false),
    sharePhone: z.boolean().default(false),
    shareWhatsapp: z.boolean().default(false),
    emailValue: z.string().email().optional().or(z.literal("")),
    phoneValue: z.string().optional().or(z.literal("")),
    whatsappValue: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => data.shareEmail || data.sharePhone || data.shareWhatsapp,
    {
      message: "Please select at least one contact channel (email, phone, or WhatsApp) to share.",
      path: ["sharePhone"],
    }
  );

export type ContactExchangeConsentInput = z.infer<typeof contactExchangeConsentSchema>;
