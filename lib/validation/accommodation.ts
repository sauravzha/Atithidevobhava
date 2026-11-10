import { z } from "zod";

export const ACCOMMODATION_CATEGORIES = [
  "free_cultural_hospitality",
  "cost_sharing",
  "registered_paid_homestay",
  "family_accommodation",
  "eligible_paying_guest",
  "private_guest_room",
  "other_permitted",
] as const;

export type AccommodationCategoryType = (typeof ACCOMMODATION_CATEGORIES)[number];

// Rejects private street addresses, house numbers, and flat numbers
const privateAddressPattern = /\b(flat|apartment|apt|house\s*no|plot\s*no|h\.?\s*no|room\s*no|lane\s*\d|street\s*\d)\b/i;

export const createAccommodationListingSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title cannot exceed 120 characters"),
    accommodationType: z.enum(ACCOMMODATION_CATEGORIES, {
      errorMap: () => ({ message: "Please select a permitted accommodation category" }),
    }),
    roomType: z.enum(["private_room", "shared_room"]),
    bathroomType: z.enum(["private", "shared"]),
    maxGuests: z
      .number({ invalid_type_error: "Maximum guests must be a number" })
      .int()
      .min(1, "At least 1 guest required")
      .max(2, "Maximum guests cannot exceed 2 in the initial release"),
    roomCount: z
      .number({ invalid_type_error: "Room count must be a number" })
      .int()
      .min(1, "At least 1 room required")
      .max(10, "Room count cannot exceed 10"),
    foodProvided: z.string().max(200).optional(),
    generalLocation: z
      .string()
      .min(5, "General area landmark must be at least 5 characters")
      .max(120, "General area cannot exceed 120 characters")
      .refine(
        (val) => !privateAddressPattern.test(val),
        "Exact residential addresses, flat numbers, and plot numbers are forbidden. Use a public landmark or locality name."
      ),
    householdAdultsCount: z
      .number({ invalid_type_error: "Household adult count must be a number" })
      .int()
      .min(1, "At least 1 adult resident in the home is required")
      .max(20, "Household adult count cannot exceed 20"),
    hasChildren: z.boolean().default(false),
    hasPets: z.boolean().default(false),
    otherResidentsDescription: z.string().max(300).optional(),
    houseRules: z.string().max(500).optional(),
    pricePerNightPaise: z
      .number({ invalid_type_error: "Price must be a number" })
      .int()
      .min(0, "Price cannot be negative"),
    stateTourismRegistrationNumber: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      // Invariant: Free cultural hospitality must have price = 0
      if (data.accommodationType === "free_cultural_hospitality") {
        return data.pricePerNightPaise === 0;
      }
      return true;
    },
    {
      message: "Free cultural hospitality listings must have a price of zero paise.",
      path: ["pricePerNightPaise"],
    }
  )
  .refine(
    (data) => {
      // Invariant: Registered paid homestay requires registration number
      if (data.accommodationType === "registered_paid_homestay") {
        return Boolean(
          data.stateTourismRegistrationNumber &&
            data.stateTourismRegistrationNumber.trim().length >= 3
        );
      }
      return true;
    },
    {
      message: "State tourism department registration number is required for registered paid homestays.",
      path: ["stateTourismRegistrationNumber"],
    }
  );

export type CreateAccommodationListingInput = z.infer<typeof createAccommodationListingSchema>;

export const stayBookingRequestSchema = z
  .object({
    listingId: z.string().uuid("Invalid listing identifier"),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-in date format (YYYY-MM-DD)"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-out date format (YYYY-MM-DD)"),
    adultCount: z
      .number({ invalid_type_error: "Adult count must be a number" })
      .int()
      .min(1, "At least 1 adult is required")
      .max(2, "At most 2 adults in the initial release"),
    childCount: z
      .number({ invalid_type_error: "Child count must be a number" })
      .int()
      .min(0, "Child count cannot be negative")
      .max(1, "At most 1 child accompanied by adults"),
    introduction: z
      .string()
      .min(20, "Please introduce yourself in at least 20 characters")
      .max(1000, "Introduction cannot exceed 1,000 characters"),
    idempotencyKey: z
      .string()
      .min(16, "Idempotency key must be at least 16 characters")
      .max(128),
  })
  .refine(
    (data) => {
      const inDate = new Date(data.checkIn);
      const outDate = new Date(data.checkOut);
      return outDate > inDate;
    },
    {
      message: "Check-out date must be strictly after check-in date",
      path: ["checkOut"],
    }
  )
  .refine(
    (data) => {
      const inDate = new Date(data.checkIn);
      const outDate = new Date(data.checkOut);
      const diffDays = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 14;
    },
    {
      message: "Maximum stay duration is 14 nights in the initial release",
      path: ["checkOut"],
    }
  )
  .refine(
    (data) => {
      return data.adultCount + data.childCount <= 2;
    },
    {
      message: "Total guests (adults + children) cannot exceed 2 in the initial release",
      path: ["adultCount"],
    }
  );

export type StayBookingRequestInput = z.infer<typeof stayBookingRequestSchema>;

export const guestComplianceSchema = z
  .object({
    guestFullName: z
      .string()
      .min(2, "Guest name must be at least 2 characters")
      .max(100, "Guest name cannot exceed 100 characters"),
    nationality: z
      .string()
      .min(2, "Nationality must be at least 2 characters")
      .max(60, "Nationality cannot exceed 60 characters"),
    arrivalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid arrival date format"),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid departure date format"),
    formSubmitted: z.boolean().default(false),
    submissionDate: z.string().optional(),
    submissionReference: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      const arr = new Date(data.arrivalDate);
      const dep = new Date(data.departureDate);
      return dep >= arr;
    },
    {
      message: "Departure date must be on or after arrival date",
      path: ["departureDate"],
    }
  );

export type GuestComplianceInput = z.infer<typeof guestComplianceSchema>;

export const hostComplianceChecklistSchema = z.object({
  foreignerDutyAcknowledged: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge your legal duty to report foreign guests (Form C / Form III) within 24 hours of arrival.",
    }),
  }),
  checklistCompleted: z.boolean().default(true),
  stateTourismRegistrationNumber: z.string().max(100).optional(),
});

export type HostComplianceChecklistInput = z.infer<typeof hostComplianceChecklistSchema>;
