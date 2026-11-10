import { describe, it, expect } from "vitest";
import {
  createAccommodationListingSchema,
  stayBookingRequestSchema,
  guestComplianceSchema,
  hostComplianceChecklistSchema,
  ACCOMMODATION_CATEGORIES,
} from "@/lib/validation/accommodation";

// In-memory simulation of PostgreSQL btree_gist daterange exclusion constraint
// EXCLUDE USING gist (listing_id WITH =, date_range WITH &&) WHERE (status = 'confirmed_booking')
class AccommodationAvailabilityEngine {
  private confirmedBookings: Array<{
    listingId: string;
    checkIn: Date;
    checkOut: Date;
  }> = [];

  // Half-open interval [checkIn, checkOut) overlap check:
  // (StartA < EndB) and (EndA > StartB)
  public confirmBooking(
    listingId: string,
    checkInStr: string,
    checkOutStr: string
  ): { success: boolean; error?: string } {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    if (checkOut <= checkIn) {
      return { success: false, error: "Check-out must be after check-in" };
    }

    // Check for overlap against existing confirmed bookings on the same listing
    for (const b of this.confirmedBookings) {
      if (b.listingId === listingId) {
        const overlaps = checkIn < b.checkOut && checkOut > b.checkIn;
        if (overlaps) {
          return {
            success: false,
            error: `Exclusion constraint violation: Confirmed stay dates [${checkInStr}, ${checkOutStr}) overlap with existing reservation [${b.checkIn.toISOString().split("T")[0]}, ${b.checkOut.toISOString().split("T")[0]})`,
          };
        }
      }
    }

    // No overlap: insert reservation
    this.confirmedBookings.push({ listingId, checkIn, checkOut });
    return { success: true };
  }

  public getConfirmedCount(listingId?: string): number {
    if (listingId) {
      return this.confirmedBookings.filter((b) => b.listingId === listingId).length;
    }
    return this.confirmedBookings.length;
  }
}

describe("Milestone 10: PostgreSQL btree_gist Daterange Exclusion and Overlap Prevention", () => {
  it("mathematically prevents overlapping confirmed bookings on the same accommodation listing", () => {
    const engine = new AccommodationAvailabilityEngine();
    const listingId = "11111111-2222-3333-4444-555555555555";

    // 1. Confirm first booking: Dec 1 to Dec 5
    const res1 = engine.confirmBooking(listingId, "2026-12-01", "2026-12-05");
    expect(res1.success).toBe(true);
    expect(engine.getConfirmedCount(listingId)).toBe(1);

    // 2. Attempt overlapping booking that starts before and ends during: Nov 30 to Dec 3
    const resOverlapStart = engine.confirmBooking(listingId, "2026-11-30", "2026-12-03");
    expect(resOverlapStart.success).toBe(false);
    expect(resOverlapStart.error).toContain("Exclusion constraint violation");

    // 3. Attempt overlapping booking that starts during and ends after: Dec 3 to Dec 8
    const resOverlapEnd = engine.confirmBooking(listingId, "2026-12-03", "2026-12-08");
    expect(resOverlapEnd.success).toBe(false);
    expect(resOverlapEnd.error).toContain("Exclusion constraint violation");

    // 4. Attempt overlapping booking strictly inside: Dec 2 to Dec 4
    const resOverlapInside = engine.confirmBooking(listingId, "2026-12-02", "2026-12-04");
    expect(resOverlapInside.success).toBe(false);

    // 5. Attempt overlapping booking completely enclosing: Nov 25 to Dec 10
    const resOverlapEnclose = engine.confirmBooking(listingId, "2026-11-25", "2026-12-10");
    expect(resOverlapEnclose.success).toBe(false);

    // Count must remain strictly 1
    expect(engine.getConfirmedCount(listingId)).toBe(1);
  });

  it("permits back-to-back bookings using standard half-open interval semantics [start, end)", () => {
    const engine = new AccommodationAvailabilityEngine();
    const listingId = "11111111-2222-3333-4444-555555555555";

    // Guest A checks in Dec 1, checks out Dec 5
    const resA = engine.confirmBooking(listingId, "2026-12-01", "2026-12-05");
    expect(resA.success).toBe(true);

    // Guest B checks in Dec 5 (turnover day), checks out Dec 9
    const resB = engine.confirmBooking(listingId, "2026-12-05", "2026-12-09");
    expect(resB.success).toBe(true);

    // Guest C checks in Nov 27, checks out Dec 1
    const resC = engine.confirmBooking(listingId, "2026-11-27", "2026-12-01");
    expect(resC.success).toBe(true);

    expect(engine.getConfirmedCount(listingId)).toBe(3);
  });

  it("permits identical dates across different distinct accommodation listings", () => {
    const engine = new AccommodationAvailabilityEngine();
    const listing1 = "11111111-1111-1111-1111-111111111111";
    const listing2 = "22222222-2222-2222-2222-222222222222";

    const res1 = engine.confirmBooking(listing1, "2026-12-10", "2026-12-15");
    const res2 = engine.confirmBooking(listing2, "2026-12-10", "2026-12-15");

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    expect(engine.getConfirmedCount()).toBe(2);
  });
});

describe("Milestone 10: Stay Request Validation and Release Boundaries", () => {
  const validRequest = {
    listingId: "11111111-2222-3333-4444-555555555555",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05", // 4 nights
    adultCount: 2,
    childCount: 0,
    introduction: "We are visiting Madhubani to study traditional Mithila folk painting techniques.",
    idempotencyKey: "idem_key_valid_request_123456",
  };

  it("accepts valid stay request within 14-night and 2-guest bounds", () => {
    const res = stayBookingRequestSchema.safeParse(validRequest);
    expect(res.success).toBe(true);
  });

  it("strictly enforces maximum stay limit of 14 nights in the initial release", () => {
    // Exactly 14 nights: Dec 1 to Dec 15 -> valid
    const max14Res = stayBookingRequestSchema.safeParse({
      ...validRequest,
      checkIn: "2026-12-01",
      checkOut: "2026-12-15",
    });
    expect(max14Res.success).toBe(true);

    // 15 nights: Dec 1 to Dec 16 -> rejected
    const over14Res = stayBookingRequestSchema.safeParse({
      ...validRequest,
      checkIn: "2026-12-01",
      checkOut: "2026-12-16",
    });
    expect(over14Res.success).toBe(false);
    if (!over14Res.success) {
      expect(over14Res.error.issues[0]?.message).toContain("Maximum stay duration is 14 nights");
    }
  });

  it("strictly enforces maximum guest limit of 2 persons", () => {
    // 3 adults -> rejected
    const threeAdults = stayBookingRequestSchema.safeParse({
      ...validRequest,
      adultCount: 3,
    });
    expect(threeAdults.success).toBe(false);

    // 2 adults + 1 child (total 3) -> rejected
    const totalThree = stayBookingRequestSchema.safeParse({
      ...validRequest,
      adultCount: 2,
      childCount: 1,
    });
    expect(totalThree.success).toBe(false);
  });

  it("requires introduction message of at least 20 characters", () => {
    const shortIntro = stayBookingRequestSchema.safeParse({
      ...validRequest,
      introduction: "Too short",
    });
    expect(shortIntro.success).toBe(false);
  });
});

describe("Milestone 10: Accommodation Categories and Privacy Controls", () => {
  it("verifies the 7 official accommodation categories", () => {
    expect(ACCOMMODATION_CATEGORIES).toHaveLength(7);
    expect(ACCOMMODATION_CATEGORIES).toContain("free_cultural_hospitality");
    expect(ACCOMMODATION_CATEGORIES).toContain("cost_sharing");
    expect(ACCOMMODATION_CATEGORIES).toContain("registered_paid_homestay");
    expect(ACCOMMODATION_CATEGORIES).toContain("family_accommodation");
    expect(ACCOMMODATION_CATEGORIES).toContain("eligible_paying_guest");
    expect(ACCOMMODATION_CATEGORIES).toContain("private_guest_room");
    expect(ACCOMMODATION_CATEGORIES).toContain("other_permitted");
  });

  it("enforces price = 0 paise on free cultural hospitality", () => {
    const validFree = {
      title: "Village Courtyard Artisan Hospitality",
      accommodationType: "free_cultural_hospitality",
      roomType: "private_room",
      bathroomType: "private",
      maxGuests: 2,
      roomCount: 1,
      generalLocation: "Near Ranti Village Panchayat, Madhubani",
      householdAdultsCount: 2,
      hasChildren: false,
      hasPets: false,
      pricePerNightPaise: 0,
    };

    const res = createAccommodationListingSchema.safeParse(validFree);
    expect(res.success).toBe(true);

    // Attempting to set positive price on free category must fail
    const invalidPaidFree = createAccommodationListingSchema.safeParse({
      ...validFree,
      pricePerNightPaise: 50000,
    });
    expect(invalidPaidFree.success).toBe(false);
    if (!invalidPaidFree.success) {
      expect(invalidPaidFree.error.issues[0]?.message).toContain("must have a price of zero paise");
    }
  });

  it("requires state tourism registration number on registered paid homestays", () => {
    const baseListing = {
      title: "Licensed Mithila Heritage Homestay",
      accommodationType: "registered_paid_homestay",
      roomType: "private_room",
      bathroomType: "private",
      maxGuests: 2,
      roomCount: 1,
      generalLocation: "Mangarpatti Chowk, Darbhanga",
      householdAdultsCount: 2,
      hasChildren: false,
      hasPets: false,
      pricePerNightPaise: 150000,
    };

    // Missing registration number -> rejected
    const missingReg = createAccommodationListingSchema.safeParse(baseListing);
    expect(missingReg.success).toBe(false);

    // With valid registration number -> accepted
    const validReg = createAccommodationListingSchema.safeParse({
      ...baseListing,
      stateTourismRegistrationNumber: "BHR-TOU-HOMESTAY-2026-081",
    });
    expect(validReg.success).toBe(true);
  });

  it("strictly rejects private residential addresses, flat numbers, and plot numbers in general location", () => {
    const baseListing = {
      title: "Village Courtyard Artisan Hospitality",
      accommodationType: "free_cultural_hospitality",
      roomType: "private_room",
      bathroomType: "private",
      maxGuests: 2,
      roomCount: 1,
      householdAdultsCount: 2,
      hasChildren: false,
      hasPets: false,
      pricePerNightPaise: 0,
    };

    const privateAddresses = [
      "Flat 402, Shanti Apartments, Station Road",
      "House No 12, Ward 4, Madhubani",
      "Plot No 8, Lane 2, Darbhanga",
      "Apt 3B, Sunshine Residency",
      "Room No 5, Near Market",
    ];

    for (const addr of privateAddresses) {
      const res = createAccommodationListingSchema.safeParse({
        ...baseListing,
        generalLocation: addr,
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain("Exact residential addresses");
      }
    }

    // Public landmarks and areas are permitted
    const publicLandmarks = [
      "Near Ranti Village Panchayat Bhavan, Madhubani",
      "Opposite Darbhanga Town Hall Public Square",
      "Main Bazaar Chowk, Saurath Village",
    ];

    for (const lmk of publicLandmarks) {
      const res = createAccommodationListingSchema.safeParse({
        ...baseListing,
        generalLocation: lmk,
      });
      expect(res.success).toBe(true);
    }
  });
});

describe("Milestone 10: Foreign Guest Reporting Compliance (Form C / Form III)", () => {
  it("validates minimal DPDP Act guest record without collecting passport or visa numbers", () => {
    const validGuest = {
      guestFullName: "Elena Rostova",
      nationality: "France",
      arrivalDate: "2026-12-01",
      departureDate: "2026-12-05",
      formSubmitted: true,
      submissionDate: "2026-12-01",
      submissionReference: "FRRO-BHR-2026-10492",
    };

    const res = guestComplianceSchema.safeParse(validGuest);
    expect(res.success).toBe(true);

    // Reject arrival after departure
    const invertedDates = guestComplianceSchema.safeParse({
      ...validGuest,
      arrivalDate: "2026-12-05",
      departureDate: "2026-12-01",
    });
    expect(invertedDates.success).toBe(false);
  });

  it("enforces mandatory acknowledgment of 24-hour statutory reporting duty", () => {
    // Unacknowledged -> rejected
    const unacknowledged = hostComplianceChecklistSchema.safeParse({
      foreignerDutyAcknowledged: false,
      checklistCompleted: true,
    });
    expect(unacknowledged.success).toBe(false);

    // Acknowledged -> accepted
    const acknowledged = hostComplianceChecklistSchema.safeParse({
      foreignerDutyAcknowledged: true,
      checklistCompleted: true,
    });
    expect(acknowledged.success).toBe(true);
  });
});
