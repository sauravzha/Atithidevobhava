import { describe, it, expect } from "vitest";
import {
  sanitizeLocalProfile,
  type RawLocalProfile,
} from "@/lib/profile/sanitizer";
import { OtpManager, ResendEmailOtpService, IndianSmsOtpService } from "@/lib/auth/otp";

describe("Milestone 5: Profile Sanitization & Access Control", () => {
  const mockRawProfile: RawLocalProfile = {
    id: "loc_darbhanga_01",
    userId: "usr_uuid_12345",
    legalFullName: "Amarnath Mishra Private Legal",
    displayName: "Amarnath M.",
    email: "amarnath.private@example.com",
    mobile: "+919876543210",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    stateName: "Bihar",
    districtName: "Darbhanga",
    localityCentroid: "Lalbagh, near Raj Compound",
    exactResidentialAddress: "House 42, Private Lane, Lalbagh, 846004", // Secret
    exactLat: 26.152289, // Secret
    exactLng: 85.897144, // Secret
    languages: ["Maithili", "Hindi", "English"],
    interests: ["Dhrupad music", "Mithila history"],
    bio: "Retired Sanskrit teacher and classical music enthusiast.",
    meetupPreferences: ["tea", "area_tour"],
    preferredPublicMeetingSpots: "Central Clock Tower square café",
    availability: "Weekend mornings",
    profileVisibility: "members_only",
    emailVerified: true,
    mobileVerified: true,
    communityVouched: true,
    memberSince: "November 2026",
  };

  it("strictly conceals legal full name, phone number, and exact coordinates from all views", () => {
    // Sanitized view for a registered member
    const memberView = sanitizeLocalProfile(mockRawProfile, "registered_viewer_user_id");

    // 1. Legal full name is stripped
    expect((memberView as any).legalFullName).toBeUndefined();
    expect(memberView.displayName).toBe("Amarnath M.");

    // 2. Private phone and email are stripped
    expect((memberView as any).email).toBeUndefined();
    expect((memberView as any).mobile).toBeUndefined();

    // 3. Exact residential address and exact coordinates are stripped
    expect((memberView as any).exactResidentialAddress).toBeUndefined();
    expect((memberView as any).exactLat).toBeUndefined();
    expect((memberView as any).exactLng).toBeUndefined();

    // 4. Locality centroid and general area are retained
    expect(memberView.generalArea).toBe("Lalbagh, near Raj Compound");
  });

  it("enforces restricted barrier for anonymous viewers when profile is members_only", () => {
    // Anonymous viewer (null or undefined)
    const anonymousView = sanitizeLocalProfile(mockRawProfile, null);

    expect(anonymousView.isRestricted).toBe(true);
    expect(anonymousView.languages).toEqual([]);
    expect(anonymousView.interests).toEqual([]);
    expect(anonymousView.bio).toContain("visible to registered members only");
    expect(anonymousView.preferredPublicMeetingSpots).toBe("Available to registered members.");
  });

  it("allows public viewing when profileVisibility is explicitly public", () => {
    const publicProfile: RawLocalProfile = {
      ...mockRawProfile,
      profileVisibility: "public",
    };

    const anonymousView = sanitizeLocalProfile(publicProfile, null);
    expect(anonymousView.isRestricted).toBe(false);
    expect(anonymousView.languages).toEqual(["Maithili", "Hindi", "English"]);
    expect(anonymousView.bio).toBe("Retired Sanskrit teacher and classical music enthusiast.");
  });
});

describe("Milestone 5: OTP Lifecycle and Development Fallback", () => {
  it("generates, hashes, and validates OTP correctly with test code support", async () => {
    const emailService = new ResendEmailOtpService();
    const smsService = new IndianSmsOtpService();
    const otpManager = new OtpManager(emailService, smsService);

    // Request email OTP in dev mode
    const req = await otpManager.requestOtp("traveller@example.com", "email");
    expect(req.success).toBe(true);
    expect(req.isDevFallback).toBe(true); // Verifies dev fallback without real credentials

    // Verify with invalid code
    const badVerify = await otpManager.verifyOtp("traveller@example.com", "999999");
    expect(badVerify.valid).toBe(false);
    expect(badVerify.error).toContain("Incorrect verification code");

    // Verify with test code bypass (123456)
    const goodVerify = await otpManager.verifyOtp("traveller@example.com", "123456");
    expect(goodVerify.valid).toBe(true);
  });
});

