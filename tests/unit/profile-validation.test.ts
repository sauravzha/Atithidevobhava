import { describe, it, expect } from "vitest";
import {
  travellerProfileSchema,
  localProfileSchema,
  birthYearSchema,
  roleSelectionSchema,
  otpVerificationSchema,
} from "@/lib/validation/profile";

describe("Milestone 5: Profile Validation Schemas", () => {
  const currentYear = new Date().getFullYear();

  it("strictly enforces 18+ adult age on birth year", () => {
    // Valid adult birth years (18+)
    expect(birthYearSchema.safeParse(currentYear - 18).success).toBe(true);
    expect(birthYearSchema.safeParse(currentYear - 30).success).toBe(true);
    expect(birthYearSchema.safeParse(1975).success).toBe(true);

    // Minor birth years (< 18) must be rejected
    const minor17 = birthYearSchema.safeParse(currentYear - 17);
    expect(minor17.success).toBe(false);
    if (!minor17.success) {
      expect(minor17.error.issues[0]?.message).toContain("18 years or older");
    }

    const minor10 = birthYearSchema.safeParse(currentYear - 10);
    expect(minor10.success).toBe(false);
  });

  it("enforces 150+ characters bio requirement for travellers", () => {
    const shortBioData = {
      fullName: "Sarah Jenkins",
      displayName: "Sarah J",
      email: "sarah@example.com",
      countryOfResidence: "United Kingdom",
      preferredLanguage: "en",
      bio: "Short bio under 150 characters.", // Only 31 characters
      interests: ["art-and-handicrafts"],
      birthYear: 1992,
      isAdult: true,
      acceptedTerms: true,
      acceptedPrivacy: true,
      acceptedSafetyAgreement: true,
    };

    const shortResult = travellerProfileSchema.safeParse(shortBioData);
    expect(shortResult.success).toBe(false);
    if (!shortResult.success) {
      const bioIssue = shortResult.error.issues.find((i) => i.path.includes("bio"));
      expect(bioIssue?.message).toContain("at least 150 characters");
    }

    // Valid 150+ chars bio
    const validData = {
      ...shortBioData,
      bio: "I am a visual artist and researcher from Edinburgh visiting India to study traditional Mithila painting techniques, understand natural pigment extraction, and connect with local artisan families.",
    };
    expect(validData.bio.length).toBeGreaterThanOrEqual(150);
    const validResult = travellerProfileSchema.safeParse(validData);
    expect(validResult.success).toBe(true);
  });

  it("verifies zero passport, visa, or Aadhaar fields in schemas", () => {
    const travellerKeys = Object.keys(travellerProfileSchema.shape);
    expect(travellerKeys).not.toContain("passportNumber");
    expect(travellerKeys).not.toContain("passportScan");
    expect(travellerKeys).not.toContain("visaNumber");
    expect(travellerKeys).not.toContain("aadhaarNumber");

    const localKeys = Object.keys(localProfileSchema.shape);
    expect(localKeys).not.toContain("aadhaarNumber");
    expect(localKeys).not.toContain("passportNumber");
  });

  it("validates Indian mobile numbers and defaults local visibility to members_only", () => {
    const validLocalData = {
      legalFullName: "Amarnath Mishra",
      displayName: "Amarnath M.",
      email: "amarnath@example.com",
      mobile: "9876543210", // 10 digit Indian mobile starting with 9
      stateId: "st-br",
      districtId: "dst-darbhanga",
      locality: "Lalbagh, near Raj Compound",
      languages: ["Maithili", "Hindi"],
      interests: ["music-and-dance"],
      bio: "Classical music lover and retired teacher welcoming visitors to explore Darbhanga heritage and oral traditions.",
      meetupPreferences: ["tea", "area_tour"],
      preferredPublicMeetingSpots: "Central Clock Tower square tea stall",
      availability: "Weekend mornings",
      birthYear: 1968,
      isAdult: true,
      acceptedTerms: true,
      acceptedPrivacy: true,
      acceptedSafetyAgreement: true,
    };

    const parsed = localProfileSchema.parse(validLocalData);
    // Invariant: Default profileVisibility must be members_only!
    expect(parsed.profileVisibility).toBe("members_only");

    // Invalid mobile numbers
    const invalidMobile = { ...validLocalData, mobile: "1234567890" }; // Starts with 1
    expect(localProfileSchema.safeParse(invalidMobile).success).toBe(false);

    const tooShortMobile = { ...validLocalData, mobile: "98765" };
    expect(localProfileSchema.safeParse(tooShortMobile).success).toBe(false);
  });

  it("validates multi-role selection and OTP format", () => {
    // Role selection
    expect(roleSelectionSchema.safeParse({ roles: ["traveller"] }).success).toBe(true);
    expect(roleSelectionSchema.safeParse({ roles: ["local", "host"] }).success).toBe(true);
    expect(roleSelectionSchema.safeParse({ roles: [] }).success).toBe(false);

    // OTP validation
    expect(
      otpVerificationSchema.safeParse({
        identifier: "test@example.com",
        otp: "123456",
        type: "email",
      }).success
    ).toBe(true);

    expect(
      otpVerificationSchema.safeParse({
        identifier: "test@example.com",
        otp: "12345", // Only 5 digits
        type: "email",
      }).success
    ).toBe(false);
  });
});
