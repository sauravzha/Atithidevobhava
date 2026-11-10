import { z } from "zod";

/**
 * 12 Official Cultural Categories per Section 7 of docs/SPEC.md.
 */
export const EXPERIENCE_CATEGORIES = [
  "indian-food-and-cooking",
  "village-life",
  "art-and-handicrafts",
  "history-and-heritage",
  "local-markets",
  "traditional-festivals",
  "music-and-dance",
  "spiritual-and-cultural-experiences",
  "nature-and-rural-experiences",
  "language-and-cultural-exchange",
  "photography-walks",
  "local-city-exploration",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

/**
 * Pattern detecting private residential address indicators to prevent public exposure.
 */
const PRIVATE_RESIDENCE_PATTERN =
  /\b(flat\s*(no|number)?|house\s*(no|number)?|apartment|apt\s*(no|number)?|room\s*(no|number)?|plot\s*(no|number)?|door\s*(no|number)?)\b/i;

/**
 * Experience creation and modification schema.
 */
export const experienceImageSchema = z.object({
  image_url: z.string().url("A valid image URL is required"),
  alt_text: z.string().min(5, "Descriptive alt text of at least 5 characters is required"),
  credit: z.string().min(2, "Photo credit and photographer attribution is required"),
  licence: z.string().min(2, "Licence verification (e.g. licensed, proprietary, host-owned) is required"),
});

export const createExperienceSchema = z
  .object({
    title_en: z
      .string()
      .min(5, "English title must be at least 5 characters")
      .max(120, "English title cannot exceed 120 characters"),
    title_hi: z.string().max(150, "Hindi title cannot exceed 150 characters").optional(),
    category: z.enum(EXPERIENCE_CATEGORIES, {
      errorMap: () => ({ message: "Please select one of the 12 official cultural categories" }),
    }),
    description_en: z
      .string()
      .min(50, "English description must be at least 50 characters")
      .max(3000, "English description cannot exceed 3000 characters"),
    description_hi: z.string().max(3500).optional(),
    state_id: z.string().min(1, "State is required"),
    district_id: z.string().min(1, "District is required"),
    city_id: z.string().optional(),
    general_meeting_area: z
      .string()
      .min(5, "General meeting area must be at least 5 characters")
      .max(200, "General meeting area cannot exceed 200 characters")
      .refine(
        (val) => !PRIVATE_RESIDENCE_PATTERN.test(val),
        "Meeting area must be a public landmark or civic place, never a private residential address"
      ),
    duration_minutes: z
      .number({ invalid_type_error: "Duration in minutes must be a number" })
      .int("Duration must be an integer")
      .min(30, "Duration must be at least 30 minutes")
      .max(720, "Duration cannot exceed 12 hours (720 minutes)"),
    price_per_person_paise: z
      .number({ invalid_type_error: "Price must be a number" })
      .int()
      .min(0, "Price cannot be negative")
      .default(0),
    min_participants: z
      .number({ invalid_type_error: "Minimum participants must be a number" })
      .int()
      .min(1, "Minimum participants must be at least 1")
      .max(50, "Minimum participants cannot exceed 50")
      .default(1),
    max_participants: z
      .number({ invalid_type_error: "Maximum participants must be a number" })
      .int()
      .min(1, "Maximum participants must be at least 1")
      .max(50, "Maximum participants cannot exceed 50")
      .default(6),
    languages: z
      .array(z.string())
      .min(1, "At least one spoken language must be specified"),
    included: z.array(z.string()).default([]),
    excluded: z.array(z.string()).default([]),
    cancellation_policy: z
      .string()
      .min(10, "Cancellation policy description of at least 10 characters is required"),
    safety_information: z
      .string()
      .min(20, "Safety and preparedness guidelines must be at least 20 characters"),
    booking_requirements: z.string().optional(),
    images: z
      .array(experienceImageSchema)
      .min(1, "At least one licensed photo of the experience is required"),
  })
  .refine((data) => data.min_participants <= data.max_participants, {
    message: "Minimum participants cannot be greater than maximum participants",
    path: ["min_participants"],
  });

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;

/**
 * Phase 1 Cultural Enquiry Schema.
 */
export const experienceEnquirySchema = z.object({
  experience_id: z.string().min(1, "Experience reference is required"),
  schedule_id: z.string().optional(),
  proposed_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Proposed date must be in YYYY-MM-DD format")
    .optional(),
  participant_count: z
    .number({ invalid_type_error: "Participant count must be a number" })
    .int()
    .min(1, "At least 1 participant is required")
    .max(50, "Participant count cannot exceed 50"),
  message: z
    .string()
    .min(20, "Enquiry message must be at least 20 characters")
    .max(1000, "Enquiry message cannot exceed 1000 characters"),
  preferred_language: z.string().min(1, "Preferred language is required"),
  safety_acknowledged: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge the public meeting safety guidelines" }),
  }),
  idempotency_key: z.string().min(8, "Idempotency key is required"),
});

export type ExperienceEnquiryInput = z.infer<typeof experienceEnquirySchema>;

/**
 * Admin Moderation Review Schema.
 */
export const adminReviewExperienceSchema = z
  .object({
    experience_id: z.string().min(1, "Experience reference is required"),
    decision: z.enum(["approve", "reject", "request_changes", "suspend"], {
      errorMap: () => ({ message: "Decision must be approve, reject, request_changes, or suspend" }),
    }),
    reason: z.string().max(1000).optional(),
    feedback: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      if (data.decision !== "approve") {
        return !!data.reason && data.reason.trim().length >= 5;
      }
      return true;
    },
    {
      message: "A mandatory reason (at least 5 characters) is required when rejecting, requesting changes, or suspending",
      path: ["reason"],
    }
  );

export type AdminReviewExperienceInput = z.infer<typeof adminReviewExperienceSchema>;

/**
 * Experience Schedule Slot Schema.
 */
export const createScheduleSchema = z
  .object({
    experience_id: z.string().min(1, "Experience reference is required"),
    start_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "A valid start date-time is required",
    }),
    end_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "A valid end date-time is required",
    }),
    capacity: z
      .number({ invalid_type_error: "Capacity must be a number" })
      .int()
      .min(1, "Capacity must be at least 1")
      .max(50, "Capacity cannot exceed 50"),
  })
  .refine(
    (data) => new Date(data.end_time).getTime() > new Date(data.start_time).getTime(),
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;

/**
 * Provider Enquiry Response Schema.
 */
export const respondToEnquirySchema = z.object({
  booking_id: z.string().min(1, "Booking reference is required"),
  decision: z.enum(["accept", "decline"], {
    errorMap: () => ({ message: "Decision must be accept or decline" }),
  }),
  response_message: z.string().max(1000).optional(),
});

export type RespondToEnquiryInput = z.infer<typeof respondToEnquirySchema>;
