import { z } from "zod";

/**
 * Valid report reasons per Section 12 of docs/SPEC.md.
 */
export const REPORT_REASONS = [
  "harassment",
  "unsafe_or_threatening",
  "asked_for_money",
  "fake_profile",
  "discrimination",
  "inappropriate_sexual_content",
  "suspected_trafficking_or_exploitation",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const URGENT_REPORT_REASONS: ReportReason[] = [
  "unsafe_or_threatening",
  "suspected_trafficking_or_exploitation",
  "harassment",
];

/**
 * Message transmission schema.
 * Text only, 1000 characters maximum, links rendered as plain text.
 */
export const sendMessageSchema = z.object({
  conversation_id: z.string().min(1, "Conversation reference is required"),
  body: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

/**
 * User block schema.
 * Immediately closes shared messaging channels and revokes contact visibility.
 */
export const blockUserSchema = z.object({
  blocked_id: z.string().min(1, "Target user reference is required"),
  reason: z.string().max(500).optional(),
});

export type BlockUserInput = z.infer<typeof blockUserSchema>;

/**
 * Incident report schema.
 * Automatically copies the last 20 messages into the evidence snapshot when from a conversation.
 */
export const createReportSchema = z.object({
  reported_user_id: z.string().min(1, "Reported person reference is required"),
  reason: z.enum(REPORT_REASONS, {
    errorMap: () => ({ message: "Please select a valid reason for this safety report" }),
  }),
  details: z
    .string()
    .min(10, "Please provide at least 10 characters detailing what happened")
    .max(2000, "Details cannot exceed 2000 characters"),
  target_entity: z.string().min(1, "Target entity is required"),
  target_id: z.string().optional(),
  conversation_id: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

/**
 * Blind review schema per Section 11.
 * Window: 14 days from completion.
 * Three 1-5 ratings, 20-800 chars text, and optional moderator-only private safety box.
 */
export const submitReviewSchema = z
  .object({
    connection_id: z.string().optional(),
    booking_id: z.string().optional(),
    rating_as_described: z
      .number({ invalid_type_error: "Rating must be between 1 and 5" })
      .int()
      .min(1, "Minimum rating is 1")
      .max(5, "Maximum rating is 5"),
    rating_communication: z
      .number({ invalid_type_error: "Rating must be between 1 and 5" })
      .int()
      .min(1, "Minimum rating is 1")
      .max(5, "Maximum rating is 5"),
    rating_felt_safe: z
      .number({ invalid_type_error: "Rating must be between 1 and 5" })
      .int()
      .min(1, "Minimum rating is 1")
      .max(5, "Maximum rating is 5"),
    review_text: z
      .string()
      .min(20, "Review must be at least 20 characters")
      .max(800, "Review cannot exceed 800 characters"),
    private_safety_notes: z
      .string()
      .max(1000, "Private safety notes cannot exceed 1000 characters")
      .optional(),
  })
  .refine((data) => data.connection_id || data.booking_id, {
    message: "Either connection_id or booking_id is required to anchor the review",
    path: ["connection_id"],
  });

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

/**
 * Safety Check-In schema.
 * Prompts on start/end dates: "I arrived safely" / "I need help".
 */
export const safetyCheckInSchema = z
  .object({
    connection_id: z.string().optional(),
    booking_id: z.string().optional(),
    prompt_type: z.enum(["arrival_start", "departure_end"], {
      errorMap: () => ({ message: "Prompt type must be arrival_start or departure_end" }),
    }),
    status: z.enum(["safe", "need_help"], {
      errorMap: () => ({ message: "Status must be safe or need_help" }),
    }),
  })
  .refine((data) => data.connection_id || data.booking_id, {
    message: "Either connection_id or booking_id is required",
    path: ["connection_id"],
  });

export type SafetyCheckInInput = z.infer<typeof safetyCheckInSchema>;

/**
 * Trip share with trusted contact schema.
 * Contact receives an expiring link with limited non-sensitive itinerary details.
 */
export const createTripShareSchema = z
  .object({
    connection_id: z.string().optional(),
    booking_id: z.string().optional(),
    trusted_email: z.string().email("A valid email address for your trusted contact is required"),
  })
  .refine((data) => data.connection_id || data.booking_id, {
    message: "Either connection_id or booking_id is required",
    path: ["connection_id"],
  });

export type CreateTripShareInput = z.infer<typeof createTripShareSchema>;

