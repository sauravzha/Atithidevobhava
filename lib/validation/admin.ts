import { z } from "zod";

export const adminUserActionSchema = z.object({
  userId: z.string().uuid("Invalid user identifier"),
  action: z.enum(["suspend", "reactivate"]),
  reason: z
    .string()
    .min(5, "A reason of at least 5 characters is required for administrative auditing")
    .max(500, "Reason cannot exceed 500 characters"),
  permanent: z.boolean().optional().default(false),
});

export type AdminUserActionInput = z.input<typeof adminUserActionSchema>;

export const adminAccommodationReviewSchema = z.object({
  listingId: z.string().uuid("Invalid listing identifier"),
  decision: z.enum(["approve", "reject", "request_changes", "suspend"]),
  reason: z
    .string()
    .min(5, "A justification of at least 5 characters is mandatory for moderation decisions")
    .max(500, "Reason cannot exceed 500 characters"),
});

export type AdminAccommodationReviewInput = z.infer<typeof adminAccommodationReviewSchema>;

export const adminReportTriageSchema = z.object({
  reportId: z.string().uuid("Invalid report identifier"),
  action: z.enum(["resolve", "dismiss", "investigate", "suspend_user"]),
  notes: z
    .string()
    .min(5, "Resolution notes of at least 5 characters are required")
    .max(1000, "Notes cannot exceed 1,000 characters"),
});

export type AdminReportTriageInput = z.infer<typeof adminReportTriageSchema>;

export const adminIdViewSchema = z.object({
  verificationRecordId: z.string().uuid("Invalid verification record identifier"),
  reason: z
    .string()
    .min(5, "A written audit justification of at least 5 characters is required to view an identity document")
    .max(500, "Justification cannot exceed 500 characters"),
});

export type AdminIdViewInput = z.infer<typeof adminIdViewSchema>;

export const adminVerificationReviewSchema = z.object({
  verificationRecordId: z.string().uuid("Invalid verification record identifier"),
  decision: z.enum(["approve", "reject"]),
  reason: z
    .string()
    .min(5, "A reason of at least 5 characters is required for verification decision")
    .max(500, "Reason cannot exceed 500 characters"),
});

export type AdminVerificationReviewInput = z.infer<typeof adminVerificationReviewSchema>;

