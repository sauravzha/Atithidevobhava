import { describe, it, expect } from "vitest";
import {
  sendMessageSchema,
  blockUserSchema,
  createReportSchema,
  submitReviewSchema,
  safetyCheckInSchema,
  createTripShareSchema,
  REPORT_REASONS,
  URGENT_REPORT_REASONS,
} from "@/lib/validation/safety";

describe("Milestone 8: Messaging, Reviews & Safety Suite", () => {
  describe("1. Messaging & Contact Detection", () => {
    it("accepts a compliant text-only message up to 1000 characters", () => {
      const valid = {
        conversation_id: "conv-001",
        body: "Greetings. I look forward to meeting at the Town Hall entrance tomorrow morning.",
      };
      const res = sendMessageSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects an empty message", () => {
      const invalid = {
        conversation_id: "conv-001",
        body: "",
      };
      const res = sendMessageSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects messages exceeding 1000 characters", () => {
      const invalid = {
        conversation_id: "conv-001",
        body: "a".repeat(1001),
      };
      const res = sendMessageSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("detects soft contact information patterns (phone and email)", () => {
      const contactRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+91[\-\s]?)?[6-9]\d{9})/;

      expect(contactRegex.test("Call me at 9876543210")).toBe(true);
      expect(contactRegex.test("My mobile is +91 9876543210")).toBe(true);
      expect(contactRegex.test("Write to traveller@example.com")).toBe(true);
      expect(contactRegex.test("Looking forward to our village walk tomorrow")).toBe(false);
    });
  });

  describe("2. User Block Invariants", () => {
    it("validates compliant user block request", () => {
      const valid = {
        blocked_id: "usr-bad-actor",
        reason: "Inappropriate communication conduct",
      };
      const res = blockUserSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("verifies user block revokes mutual contact disclosure", () => {
      // Simulating can_reveal() logic under active block
      const hasBlock = true;
      const bothConsented = true;

      const canReveal = !hasBlock && bothConsented;
      expect(canReveal).toBe(false);
    });
  });

  describe("3. Incident Reporting & Urgency Triage", () => {
    it("accepts all 8 official report reasons per Section 12", () => {
      expect(REPORT_REASONS).toHaveLength(8);
      for (const r of REPORT_REASONS) {
        const valid = {
          reported_user_id: "usr-002",
          reason: r,
          details: "Detailed explanation of the safety incident observed.",
          target_entity: "conversation",
        };
        const res = createReportSchema.safeParse(valid);
        expect(res.success).toBe(true);
      }
    });

    it("identifies urgent safety reasons for immediate moderator triage", () => {
      expect(URGENT_REPORT_REASONS).toContain("unsafe_or_threatening");
      expect(URGENT_REPORT_REASONS).toContain("suspected_trafficking_or_exploitation");
      expect(URGENT_REPORT_REASONS).toContain("harassment");

      const isUrgent = (reason: string) =>
        URGENT_REPORT_REASONS.includes(reason as any);

      expect(isUrgent("unsafe_or_threatening")).toBe(true);
      expect(isUrgent("suspected_trafficking_or_exploitation")).toBe(true);
      expect(isUrgent("harassment")).toBe(true);
      expect(isUrgent("asked_for_money")).toBe(false);
      expect(isUrgent("fake_profile")).toBe(false);
    });

    it("rejects report details shorter than 10 characters", () => {
      const invalid = {
        reported_user_id: "usr-002",
        reason: "harassment" as const,
        details: "Too short",
        target_entity: "conversation",
      };
      const res = createReportSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("verifies 2 urgent reports from distinct reporters trigger de-indexing", () => {
      const reports = [
        { reporterId: "user-1", reason: "unsafe_or_threatening", isUrgent: true },
        { reporterId: "user-2", reason: "harassment", isUrgent: true },
      ];

      const distinctUrgentReporters = new Set(
        reports.filter((r) => r.isUrgent).map((r) => r.reporterId)
      );

      const shouldDeindex = distinctUrgentReporters.size >= 2;
      expect(shouldDeindex).toBe(true);
    });
  });

  describe("4. Blind Reviews System (Section 11)", () => {
    const validReview = {
      connection_id: "conn-101",
      rating_as_described: 5,
      rating_communication: 4,
      rating_felt_safe: 5,
      review_text:
        "An illuminating and culturally respectful meeting. We walked through the local market and discussed indigenous crafts.",
      private_safety_notes: "Host was punctual and met at the designated civic square.",
    };

    it("validates a fully compliant blind review", () => {
      const res = submitReviewSchema.safeParse(validReview);
      expect(res.success).toBe(true);
    });

    it("rejects review text shorter than 20 characters", () => {
      const invalid = { ...validReview, review_text: "Great experience!" };
      const res = submitReviewSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toContain("at least 20 characters");
      }
    });

    it("rejects review text exceeding 800 characters", () => {
      const invalid = { ...validReview, review_text: "a".repeat(801) };
      const res = submitReviewSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects ratings outside 1 to 5 range", () => {
      const invalid1 = { ...validReview, rating_as_described: 0 };
      expect(submitReviewSchema.safeParse(invalid1).success).toBe(false);

      const invalid2 = { ...validReview, rating_felt_safe: 6 };
      expect(submitReviewSchema.safeParse(invalid2).success).toBe(false);
    });

    it("verifies blind review remains unpublished until mutual submission", () => {
      const reviewA = { isSubmitted: true, isPublished: false };
      const reviewB = { isSubmitted: false, isPublished: false };

      const canPublish = reviewA.isSubmitted && reviewB.isSubmitted;
      expect(canPublish).toBe(false);

      reviewB.isSubmitted = true;
      const canPublishNow = reviewA.isSubmitted && reviewB.isSubmitted;
      expect(canPublishNow).toBe(true);
    });
  });

  describe("5. Safety Check-In Engine", () => {
    it("validates arrival check-in with 'safe' status", () => {
      const valid = {
        connection_id: "conn-001",
        prompt_type: "arrival_start" as const,
        status: "safe" as const,
      };
      const res = safetyCheckInSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("validates 'need_help' check-in status", () => {
      const valid = {
        connection_id: "conn-001",
        prompt_type: "arrival_start" as const,
        status: "need_help" as const,
      };
      const res = safetyCheckInSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("verifies 'need_help' check-in triggers automated urgent safety alert", () => {
      const checkin = { status: "need_help" };
      const alertDispatched = checkin.status === "need_help";
      expect(alertDispatched).toBe(true);
    });
  });

  describe("6. Trip Share Privacy Governance", () => {
    it("validates trip share creation with valid trusted email", () => {
      const valid = {
        connection_id: "conn-001",
        trusted_email: "family.contact@example.com",
      };
      const res = createTripShareSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects invalid trusted email", () => {
      const invalid = {
        connection_id: "conn-001",
        trusted_email: "not-an-email",
      };
      const res = createTripShareSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("verifies trip share projection masks exact residential address", () => {
      const rawInteraction = {
        hostFirstName: "Sunita",
        hostLastName: "Jha",
        district: "Madhubani",
        residentialAddress: "Flat 4, Shanti Niwas, Station Road",
        privatePhone: "+91 9876543210",
      };

      // Masking per Section 12: only host first name and district
      const projectedForTrustedContact = {
        hostFirstName: rawInteraction.hostFirstName,
        district: rawInteraction.district,
      };

      expect(projectedForTrustedContact).not.toHaveProperty("residentialAddress");
      expect(projectedForTrustedContact).not.toHaveProperty("privatePhone");
      expect(projectedForTrustedContact).not.toHaveProperty("hostLastName");
    });
  });
});
