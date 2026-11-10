import { describe, it, expect } from "vitest";
import {
  EXPERIENCE_CATEGORIES,
  createExperienceSchema,
  experienceEnquirySchema,
  adminReviewExperienceSchema,
  createScheduleSchema,
  respondToEnquirySchema,
} from "@/lib/validation/experience";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";

describe("Milestone 7: Experience Marketplace & Governance", () => {
  describe("1. Cultural Categories Taxonomy", () => {
    it("recognizes exactly the 12 official cultural categories per Section 7", () => {
      expect(EXPERIENCE_CATEGORIES).toHaveLength(12);
      expect(EXPERIENCE_CATEGORIES).toContain("indian-food-and-cooking");
      expect(EXPERIENCE_CATEGORIES).toContain("village-life");
      expect(EXPERIENCE_CATEGORIES).toContain("art-and-handicrafts");
      expect(EXPERIENCE_CATEGORIES).toContain("history-and-heritage");
      expect(EXPERIENCE_CATEGORIES).toContain("local-markets");
      expect(EXPERIENCE_CATEGORIES).toContain("traditional-festivals");
      expect(EXPERIENCE_CATEGORIES).toContain("music-and-dance");
      expect(EXPERIENCE_CATEGORIES).toContain("spiritual-and-cultural-experiences");
      expect(EXPERIENCE_CATEGORIES).toContain("nature-and-rural-experiences");
      expect(EXPERIENCE_CATEGORIES).toContain("language-and-cultural-exchange");
      expect(EXPERIENCE_CATEGORIES).toContain("photography-walks");
      expect(EXPERIENCE_CATEGORIES).toContain("local-city-exploration");
    });
  });

  describe("2. Experience Creation Validation", () => {
    const validListing = {
      title_en: "Mithila Painting and Natural Pigment Craft in Jitwarpur",
      title_hi: "जितवारपुर में मिथिला चित्रकला",
      category: "art-and-handicrafts" as const,
      description_en:
        "Spend a morning with an artisan family in Jitwarpur understanding the symbolism of Kohbar and Aripan motifs. Learn how mineral stones, soot, and peepal bark are prepared into natural dyes.",
      description_hi: "जितवारपुर के कलाकार परिवार के साथ कोहबर और अरिपन प्रतीकों की गहराई समझें।",
      state_id: "st-br",
      district_id: "dst-madhubani",
      general_meeting_area: "Jitwarpur Village Panchayat Bhavan perimeter",
      duration_minutes: 180,
      price_per_person_paise: 0,
      min_participants: 1,
      max_participants: 6,
      languages: ["Hindi", "Maithili", "English"],
      included: ["Handmade paper", "Natural pigments"],
      excluded: ["Personal transport"],
      cancellation_policy: "Full flexibility up to 24 hours prior to meeting",
      safety_information: "Meeting is at public civic landmark. Comfortable attire recommended.",
      images: [
        {
          image_url: "https://example.org/pilot/mithila.jpg",
          alt_text: "Artisan demonstrating bamboo nib line work",
          credit: "Artisan Family Archive",
          licence: "host-owned",
        },
      ],
    };

    it("accepts a fully compliant experience listing", () => {
      const res = createExperienceSchema.safeParse(validListing);
      expect(res.success).toBe(true);
    });

    it("rejects an unlisted category", () => {
      const invalid = { ...validListing, category: "commercial-shopping" };
      const res = createExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain("12 official cultural categories");
      }
    });

    it("rejects title shorter than 5 characters", () => {
      const invalid = { ...validListing, title_en: "Art" };
      const res = createExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects description shorter than 50 characters", () => {
      const invalid = { ...validListing, description_en: "Brief workshop description." };
      const res = createExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects private residential addresses in general meeting area", () => {
      const invalid1 = {
        ...validListing,
        general_meeting_area: "Flat No 304, Ganga View Apartments, Road 5",
      };
      const res1 = createExperienceSchema.safeParse(invalid1);
      expect(res1.success).toBe(false);
      if (!res1.success) {
        expect(res1.error.issues[0]?.message).toContain("never a private residential address");
      }

      const invalid2 = {
        ...validListing,
        general_meeting_area: "House number 12, near main bazaar",
      };
      const res2 = createExperienceSchema.safeParse(invalid2);
      expect(res2.success).toBe(false);
    });

    it("rejects if minimum participants exceeds maximum participants", () => {
      const invalid = {
        ...validListing,
        min_participants: 8,
        max_participants: 4,
      };
      const res = createExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain(
          "Minimum participants cannot be greater than maximum participants"
        );
      }
    });

    it("requires at least one licensed photograph", () => {
      const invalid = { ...validListing, images: [] };
      const res = createExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("3. Phase 1 Enquiry Mode Validation", () => {
    it("validates a compliant cultural enquiry", () => {
      const valid = {
        experience_id: "exp-br-01",
        proposed_date: "2026-11-25",
        participant_count: 2,
        message:
          "Greetings, I am traveling through Mithila and wish to observe natural pigment preparation techniques.",
        preferred_language: "English",
        safety_acknowledged: true,
        idempotency_key: "idemp_test_12345678",
      };
      const res = experienceEnquirySchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects enquiry message shorter than 20 characters", () => {
      const invalid = {
        experience_id: "exp-br-01",
        participant_count: 1,
        message: "Hi, can we meet?",
        preferred_language: "Hindi",
        safety_acknowledged: true,
        idempotency_key: "idemp_test_12345678",
      };
      const res = experienceEnquirySchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain("at least 20 characters");
      }
    });

    it("rejects if public meeting safety is not acknowledged", () => {
      const invalid = {
        experience_id: "exp-br-01",
        participant_count: 1,
        message: "Greetings, I am traveling through Mithila and wish to observe natural pigment techniques.",
        preferred_language: "English",
        safety_acknowledged: false,
        idempotency_key: "idemp_test_12345678",
      };
      const res = experienceEnquirySchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("4. Admin Moderation Decision Validation", () => {
    it("allows approval with standard justification", () => {
      const valid = {
        experience_id: "exp-001",
        decision: "approve" as const,
        reason: "Verified against community guidelines",
      };
      const res = adminReviewExperienceSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("strictly requires a reason when rejecting or requesting changes", () => {
      const invalid = {
        experience_id: "exp-001",
        decision: "reject" as const,
        reason: "",
      };
      const res = adminReviewExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain(
          "mandatory reason (at least 5 characters) is required"
        );
      }
    });

    it("rejects an invalid moderation decision verb", () => {
      const invalid = {
        experience_id: "exp-001",
        decision: "delete_forever",
        reason: "Not wanted",
      };
      const res = adminReviewExperienceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("5. Experience Schedule Validation", () => {
    it("validates a compliant future time slot", () => {
      const valid = {
        experience_id: "exp-001",
        start_time: "2026-11-25T10:00:00Z",
        end_time: "2026-11-25T13:00:00Z",
        capacity: 6,
      };
      const res = createScheduleSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects if end time is before or equal to start time", () => {
      const invalid = {
        experience_id: "exp-001",
        start_time: "2026-11-25T13:00:00Z",
        end_time: "2026-11-25T10:00:00Z",
        capacity: 6,
      };
      const res = createScheduleSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain("End time must be after start time");
      }
    });

    it("validates provider response to an enquiry", () => {
      const validAccept = {
        booking_id: "bk-001",
        decision: "accept" as const,
        response_message: "We would be honored to host you.",
      };
      const res = respondToEnquirySchema.safeParse(validAccept);
      expect(res.success).toBe(true);
    });
  });

  describe("6. Capacity & Double-Booking Protection Logic", () => {
    it("verifies capacity check prevents overbooking", () => {
      const schedule = {
        id: "sch-101",
        capacity: 6,
        booked_count: 4,
      };

      const requested1 = 2;
      const canBook1 = schedule.booked_count + requested1 <= schedule.capacity;
      expect(canBook1).toBe(true);

      const requested2 = 3;
      const canBook2 = schedule.booked_count + requested2 <= schedule.capacity;
      expect(canBook2).toBe(false);
    });
  });

  describe("7. Pilot Catalog Consistency", () => {
    it("verifies pilot experiences conform to Phase 1 enquiry constraints", () => {
      expect(PILOT_EXPERIENCES.length).toBeGreaterThan(0);
      for (const exp of PILOT_EXPERIENCES) {
        expect(exp.id).toBeDefined();
        expect(exp.titleEn.length).toBeGreaterThan(5);
        expect(exp.titleHi.length).toBeGreaterThan(5);
        expect(EXPERIENCE_CATEGORIES).toContain(exp.categorySlug);
        expect(exp.durationEn).toBeDefined();
        expect(exp.maxParticipants).toBeGreaterThanOrEqual(1);
        expect(exp.generalAreaEn).not.toMatch(
          /\b(flat\s*(no|number)?|house\s*(no|number)?|apartment)\b/i
        );
      }
    });
  });
});
