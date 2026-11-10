/**
 * Zod validation schemas for user onboarding, roles, traveller profiles,
 * local member profiles, and experience providers.
 * Spec reference: Section 2, 4, 5, 8, and 9 of docs/SPEC.md.
 * Invariants: Adults only (18+), zero passport/visa/Aadhaar data,
 * default members_only visibility for locals, 150+ char bio for travellers.
 */

import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();
const MINIMUM_ADULT_AGE = 18;
const MAXIMUM_AGE = 120;

/**
 * 18+ Adult birth year validation.
 * Ensures the registrant is strictly 18 or older.
 */
export const birthYearSchema = z
  .number({
    required_error: "Birth year is required.",
    invalid_type_error: "Birth year must be a valid four-digit year.",
  })
  .int()
  .min(CURRENT_YEAR - MAXIMUM_AGE, `Birth year must be after ${CURRENT_YEAR - MAXIMUM_AGE}.`)
  .max(
    CURRENT_YEAR - MINIMUM_ADULT_AGE,
    `You must be 18 years or older to register. Registrants born after ${
      CURRENT_YEAR - MINIMUM_ADULT_AGE
    } are not eligible.`
  );

/**
 * Role selection schema: First screen of onboarding.
 * "How would you like to experience India?"
 */
export const roleSelectionSchema = z.object({
  roles: z
    .array(
      z.enum(["traveller", "local", "host", "stay_host"], {
        required_error: "Please select at least one role to continue.",
      })
    )
    .min(1, "Please select at least one role to continue."),
});

export type RoleSelectionInput = z.infer<typeof roleSelectionSchema>;

/**
 * Traveller Profile Schema.
 * Spec reference: Section 5 of docs/SPEC.md.
 * Note: Zero passport, visa, or nationality fields are included.
 */
export const travellerProfileSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required." })
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  displayName: z
    .string({ required_error: "Display name is required." })
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9\s._-]+$/, "Display name contains unsupported symbols."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Please provide a valid email address."),
  countryOfResidence: z
    .string({ required_error: "Country of residence is required." })
    .trim()
    .min(2, "Please select your country of residence."),
  preferredLanguage: z
    .string({ required_error: "Preferred language is required." })
    .default("en"),
  photoUrl: z.string().url("Please upload a valid photo URL.").optional().or(z.literal("")),
  // Spec: Short introduction must be 150+ characters
  bio: z
    .string({ required_error: "Introduction is required." })
    .trim()
    .min(
      150,
      "Introduction must be at least 150 characters to help local hosts understand your background and intent."
    )
    .max(2000, "Introduction cannot exceed 2000 characters."),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one cultural or travel interest."),
  intendedTravelPeriod: z.string().trim().max(100).optional(),
  preferredDestinations: z.array(z.string()).optional().default([]),
  birthYear: birthYearSchema,
  isAdult: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm you are 18 years of age or older.",
    }),
  }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service." }),
  }),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy." }),
  }),
  acceptedSafetyAgreement: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm adherence to the Public Meeting Safety Agreement.",
    }),
  }),
  trustedContactEmail: z
    .string()
    .trim()
    .email("Please enter a valid trusted-contact email address.")
    .optional()
    .or(z.literal("")),
});

export type TravellerProfileInput = z.infer<typeof travellerProfileSchema>;

/**
 * Local Member Profile Schema.
 * Spec reference: Section 5 and 6 of docs/SPEC.md.
 * Note: Legal full name is strictly private. Visibility defaults to members_only.
 */
export const localProfileSchema = z.object({
  legalFullName: z
    .string({ required_error: "Full legal name is required for verification." })
    .trim()
    .min(2, "Legal full name must be at least 2 characters.")
    .max(100, "Legal full name cannot exceed 100 characters."),
  displayName: z
    .string({ required_error: "Public display name is required." })
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name cannot exceed 50 characters."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Please enter a valid email address."),
  // Indian mobile number: 10 digits prefixed optionally by +91
  mobile: z
    .string({ required_error: "Mobile number is required for SMS OTP verification." })
    .trim()
    .regex(
      /^(?:\+91|91)?[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
    ),
  stateId: z.string({ required_error: "Please select your state or union territory." }),
  districtId: z.string({ required_error: "Please select your district." }),
  cityId: z.string().optional().or(z.literal("")),
  locality: z
    .string({ required_error: "General neighborhood or locality is required." })
    .trim()
    .min(2, "Locality must be at least 2 characters.")
    .max(100, "Locality must be a general area name, not a full residential address."),
  languages: z
    .array(z.string())
    .min(1, "Please select at least one language you speak comfortably."),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one cultural or community interest."),
  bio: z
    .string({ required_error: "Introduction is required." })
    .trim()
    .min(100, "Introduction must be at least 100 characters.")
    .max(2000, "Introduction cannot exceed 2000 characters."),
  meetupPreferences: z
    .array(z.enum(["tea", "market_walk", "language_exchange", "area_tour"]))
    .min(1, "Please select at least one meetup preference."),
  preferredPublicMeetingSpots: z
    .string({ required_error: "Preferred public meeting area is required." })
    .trim()
    .min(5, "Please specify a known public area (e.g., campus library square, central tea stall).")
    .max(200, "Meeting spot description cannot exceed 200 characters."),
  availability: z
    .string({ required_error: "Availability details are required." })
    .trim()
    .min(3, "Please describe when you are generally available (e.g., weekend mornings).")
    .max(100),
  photoUrl: z.string().url("Please upload a valid photo URL.").optional().or(z.literal("")),
  // Spec: Profile visibility default is members-only!
  profileVisibility: z.enum(["public", "members_only"]).default("members_only"),
  birthYear: birthYearSchema,
  isAdult: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm you are 18 years of age or older.",
    }),
  }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service." }),
  }),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy." }),
  }),
  acceptedSafetyAgreement: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm adherence to the Public Meeting Safety Agreement.",
    }),
  }),
});

export type LocalProfileInput = z.infer<typeof localProfileSchema>;

/**
 * Experience Provider Schema.
 * Extends local member with provider type and craft/culinary specialization.
 */
export const experienceProviderSchema = localProfileSchema.extend({
  providerType: z.enum(["individual", "family", "business"], {
    required_error: "Please specify whether you host as an individual, family, or registered business.",
  }),
  offeringsSummary: z
    .string({ required_error: "Please describe what cultural sessions you genuinely offer." })
    .trim()
    .min(50, "Description must be at least 50 characters.")
    .max(1000),
  heldRegistrations: z.string().trim().max(200).optional().or(z.literal("")),
});

export type ExperienceProviderInput = z.infer<typeof experienceProviderSchema>;

/**
 * Accommodation Host Preliminary Interest Schema (Phase 3).
 * Spec reference: Section 8 of docs/SPEC.md.
 */
export const accommodationHostInterestSchema = z.object({
  userId: z.string().uuid(),
  accommodationType: z.enum([
    "free_cultural_hospitality",
    "cost_sharing",
    "registered_paid_homestay",
    "family_accommodation",
    "eligible_paying_guest",
    "private_guest_room",
  ]),
  guestRoomCount: z.number().int().min(1).max(5),
  maxGuestsAllowed: z.number().int().min(1).max(4),
  hasPrivateBathroom: z.boolean(),
  stateId: z.string(),
  districtId: z.string(),
  householdSummary: z
    .string()
    .trim()
    .min(30, "Please describe your household (number of adults, family traditions).")
    .max(500),
  hasFireSafetyKit: z.boolean(),
  understandsFormCDuty: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge foreign guest reporting duties (Form C / Form III) under Indian law.",
    }),
  }),
});

export type AccommodationHostInterestInput = z.infer<typeof accommodationHostInterestSchema>;

/**
 * OTP Verification Schema.
 */
export const otpVerificationSchema = z.object({
  identifier: z.string().trim().min(3),
  otp: z
    .string()
    .trim()
    .length(6, "Verification code must be exactly 6 digits.")
    .regex(/^\d{6}$/, "Verification code must contain digits only."),
  type: z.enum(["email", "mobile"]),
});

export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
