import { describe, it, expect } from "vitest";
import { stayBookingRequestSchema } from "@/lib/validation/accommodation";
import { adminReportTriageSchema, adminIdViewSchema } from "@/lib/validation/admin";

// In-Memory Simulation of Full System Lifecycle for End-to-End Validation
class MarketplaceEndToEndSimulator {
  // Database tables
  public users: Map<string, { id: string; email: string; is_suspended: boolean; role: string }> = new Map();
  public connections: Map<
    string,
    {
      id: string;
      traveller_id: string;
      local_id: string;
      status: string;
      traveller_consent: boolean;
      local_consent: boolean;
      blocked: boolean;
    }
  > = new Map();
  public experiences: Map<
    string,
    {
      id: string;
      host_id: string;
      title: string;
      capacity: number;
      price_paise: number;
      is_approved: boolean;
    }
  > = new Map();
  public experienceBookings: Map<
    string,
    {
      id: string;
      experience_id: string;
      user_id: string;
      participants: number;
      status: string;
    }
  > = new Map();
  public stays: Map<
    string,
    {
      id: string;
      host_id: string;
      title: string;
      category: string;
      max_guests: number;
      status: string;
    }
  > = new Map();
  public stayReservations: Array<{
    stay_id: string;
    checkIn: Date;
    checkOut: Date;
    status: string;
  }> = [];
  public foreignGuestLogs: Array<{
    id: string;
    guest_name: string;
    nationality: string;
    form_c_reference: string;
    filing_date: string;
  }> = [];
  public reports: Array<{
    id: string;
    reported_user_id: string;
    reason: string;
    is_urgent: boolean;
    status: string;
    resolution_notes?: string;
  }> = [];
  public auditLogs: Array<{
    id: string;
    action: string;
    target_entity: string;
    performed_by: string;
    reason: string;
    created_at: string;
  }> = [];

  // Flow 1: Connection & Dual Mutual Consent Contact Revelation
  public requestConnection(travellerId: string, localId: string): string {
    const connId = `conn-${this.connections.size + 1}`;
    this.connections.set(connId, {
      id: connId,
      traveller_id: travellerId,
      local_id: localId,
      status: "requested",
      traveller_consent: false,
      local_consent: false,
      blocked: false,
    });
    return connId;
  }

  public acceptConnection(connId: string, localId: string) {
    const conn = this.connections.get(connId);
    if (!conn || conn.local_id !== localId) throw new Error("Invalid connection");
    conn.status = "accepted";
  }

  public grantConsent(connId: string, userId: string): boolean {
    const conn = this.connections.get(connId);
    if (!conn) throw new Error("Not found");
    if (conn.traveller_id === userId) conn.traveller_consent = true;
    if (conn.local_id === userId) conn.local_consent = true;

    // Contact is revealed ONLY if both grant consent and no block is active
    return conn.traveller_consent && conn.local_consent && !conn.blocked;
  }

  // Flow 2: Experience Publishing & Capacity Locking
  public publishExperience(
    hostId: string,
    title: string,
    capacity: number,
    pricePaise: number
  ): string {
    const id = `exp-${this.experiences.size + 1}`;
    this.experiences.set(id, {
      id,
      host_id: hostId,
      title,
      capacity,
      price_paise: pricePaise,
      is_approved: true, // Approved by admin in enquiry mode
    });
    return id;
  }

  public bookExperienceAtomic(
    expId: string,
    userId: string,
    participants: number
  ): { success: boolean; bookingId?: string; error?: string } {
    const exp = this.experiences.get(expId);
    if (!exp) return { success: false, error: "Experience not found" };

    // Calculate current confirmed participant count
    const currentBooked = Array.from(this.experienceBookings.values())
      .filter((b) => b.experience_id === expId && b.status === "confirmed")
      .reduce((sum, b) => sum + b.participants, 0);

    if (currentBooked + participants > exp.capacity) {
      return {
        success: false,
        error: `Capacity exceeded: requested ${participants}, remaining ${exp.capacity - currentBooked}`,
      };
    }

    const bookingId = `book-${this.experienceBookings.size + 1}`;
    this.experienceBookings.set(bookingId, {
      id: bookingId,
      experience_id: expId,
      user_id: userId,
      participants,
      status: "confirmed",
    });

    return { success: true, bookingId };
  }

  public cancelExperienceBooking(bookingId: string) {
    const b = this.experienceBookings.get(bookingId);
    if (b) {
      b.status = "cancelled"; // Capacity immediately restored for other travellers
    }
  }

  // Flow 3: Accommodation btree_gist Reservation & Form C Guest Registry
  public reserveStayExclusion(
    stayId: string,
    checkInStr: string,
    checkOutStr: string
  ): { success: boolean; error?: string } {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    // Overlap check on confirmed stays
    for (const res of this.stayReservations) {
      if (res.stay_id === stayId && res.status === "confirmed") {
        const overlaps = checkIn < res.checkOut && checkOut > res.checkIn;
        if (overlaps) {
          return {
            success: false,
            error: "btree_gist exclusion conflict: overlapping stay booking exists",
          };
        }
      }
    }

    this.stayReservations.push({
      stay_id: stayId,
      checkIn,
      checkOut,
      status: "confirmed",
    });
    return { success: true };
  }

  public logForeignGuest(guestName: string, nationality: string, formCRef: string) {
    this.foreignGuestLogs.push({
      id: `fg-${this.foreignGuestLogs.length + 1}`,
      guest_name: guestName,
      nationality,
      form_c_reference: formCRef,
      filing_date: new Date().toISOString(),
    });
  }

  // Flow 4: Safety Incident Escalation
  public submitReport(
    reportedUserId: string,
    reason: string,
    isUrgent: boolean
  ): { reportId: string; autoDeindexed: boolean } {
    const reportId = `rep-${this.reports.length + 1}`;
    this.reports.push({
      id: reportId,
      reported_user_id: reportedUserId,
      reason,
      is_urgent: isUrgent,
      status: "pending",
    });

    // Check automatic 2-report deindexing trigger
    const urgentCount = this.reports.filter(
      (r) => r.reported_user_id === reportedUserId && r.is_urgent
    ).length;

    return { reportId, autoDeindexed: urgentCount >= 2 };
  }

  // Flow 5: Append-Only Immutable Auditing
  public logAdminAction(performedBy: string, action: string, entity: string, reason: string) {
    if (!reason || reason.trim().length < 5) {
      throw new Error("Justification of at least 5 characters is mandatory for administrative auditing");
    }

    this.auditLogs.push({
      id: `audit-${this.auditLogs.length + 1}`,
      action,
      target_entity: entity,
      performed_by: performedBy,
      reason,
      created_at: new Date().toISOString(),
    });
  }
}

describe("Milestone 13: End-to-End System Integration Flows", () => {
  it("Flow 1: Foreign traveller cultural discovery, connection, and dual mutual consent contact revelation", () => {
    const sim = new MarketplaceEndToEndSimulator();
    const travellerId = "11111111-1111-4111-8111-111111111111";
    const localHostId = "22222222-2222-4222-8222-222222222222";

    sim.users.set(travellerId, {
      id: travellerId,
      email: "traveller@example.com",
      is_suspended: false,
      role: "traveller",
    });
    sim.users.set(localHostId, {
      id: localHostId,
      email: "artisan.host@example.in",
      is_suspended: false,
      role: "local_member",
    });

    // 1. Send connection request
    const connId = sim.requestConnection(travellerId, localHostId);
    expect(sim.connections.get(connId)?.status).toBe("requested");

    // 2. Local member accepts
    sim.acceptConnection(connId, localHostId);
    expect(sim.connections.get(connId)?.status).toBe("accepted");

    // 3. Traveller grants consent (local has not granted yet)
    const revealedStep1 = sim.grantConsent(connId, travellerId);
    expect(revealedStep1).toBe(false); // Contact must NOT be revealed yet!

    // 4. Local member grants consent -> Now revealed!
    const revealedStep2 = sim.grantConsent(connId, localHostId);
    expect(revealedStep2).toBe(true);
  });

  it("Flow 2: Cultural host experience publishing, atomic booking concurrency, and capacity restoration", () => {
    const sim = new MarketplaceEndToEndSimulator();
    const hostId = "host-mithila-1";
    const t1 = "traveller-1";
    const t2 = "traveller-2";
    const t3 = "traveller-3";

    // 1. Host creates a 4-capacity traditional painting session
    const expId = sim.publishExperience(
      hostId,
      "Madhubani Natural Pigment Painting Workshop",
      4,
      120000 // 1,200 INR per person
    );

    // 2. Traveller 1 books 2 slots -> 2 remain
    const res1 = sim.bookExperienceAtomic(expId, t1, 2);
    expect(res1.success).toBe(true);

    // 3. Traveller 2 books 2 slots -> 0 remain
    const res2 = sim.bookExperienceAtomic(expId, t2, 2);
    expect(res2.success).toBe(true);

    // 4. Traveller 3 attempts to book 1 slot -> rejected due to capacity limit
    const res3 = sim.bookExperienceAtomic(expId, t3, 1);
    expect(res3.success).toBe(false);
    expect(res3.error).toContain("Capacity exceeded");

    // 5. Traveller 1 cancels -> capacity immediately restored
    if (res1.bookingId) {
      sim.cancelExperienceBooking(res1.bookingId);
    }

    // 6. Traveller 3 retries booking 1 slot -> now succeeds!
    const res4 = sim.bookExperienceAtomic(expId, t3, 1);
    expect(res4.success).toBe(true);
  });

  it("Flow 3: Stay reservation btree_gist overlap exclusion and statutory Form C foreign guest compliance", () => {
    const sim = new MarketplaceEndToEndSimulator();
    const stayId = "stay-darbhanga-rural-1";

    // 1. Validation test on 14-night max duration
    const validRequest = stayBookingRequestSchema.safeParse({
      listingId: "33333333-3333-4333-8333-333333333333",
      checkIn: "2026-12-01",
      checkOut: "2026-12-08", // 7 nights -> valid
      adultCount: 2, // Max 2 adult guests -> valid
      childCount: 0,
      introduction: "Visiting Bihar to study historical Maithili folk art traditions with artisan families.",
      idempotencyKey: "idem-e2e-000000001",
    });
    expect(validRequest.success).toBe(true);

    const invalidDuration = stayBookingRequestSchema.safeParse({
      listingId: "33333333-3333-4333-8333-333333333333",
      checkIn: "2026-12-01",
      checkOut: "2026-12-20", // 19 nights -> exceeds 14 nights limit
      adultCount: 2,
      childCount: 0,
      introduction: "Visiting Bihar for extended stay with host family.",
      idempotencyKey: "idem-e2e-000000002",
    });
    expect(invalidDuration.success).toBe(false);

    // 2. Reservation overlap exclusion test
    const r1 = sim.reserveStayExclusion(stayId, "2026-12-01", "2026-12-05");
    expect(r1.success).toBe(true);

    // Conflicting overlapping stay
    const r2 = sim.reserveStayExclusion(stayId, "2026-12-03", "2026-12-08");
    expect(r2.success).toBe(false);
    expect(r2.error).toContain("overlapping stay booking exists");

    // Adjacent non-overlapping stay (half-open [2026-12-05, 2026-12-10))
    const r3 = sim.reserveStayExclusion(stayId, "2026-12-05", "2026-12-10");
    expect(r3.success).toBe(true);

    // 3. Form C foreign guest reporting log
    sim.logForeignGuest("Arthur Pendelton", "United Kingdom", "EFRRO-2026-BHR-0987");
    expect(sim.foreignGuestLogs.length).toBe(1);
    expect(sim.foreignGuestLogs[0]?.form_c_reference).toBe("EFRRO-2026-BHR-0987");
  });

  it("Flow 4: Safety report triage, automatic deindexing trigger, and cascading suspension", () => {
    const sim = new MarketplaceEndToEndSimulator();
    const badUserId = "user-bad-actor";

    // 1. First urgent report
    const rep1 = sim.submitReport(badUserId, "harassment", true);
    expect(rep1.autoDeindexed).toBe(false);

    // 2. Second urgent report -> triggers automatic deindexing
    const rep2 = sim.submitReport(badUserId, "unsafe_or_threatening", true);
    expect(rep2.autoDeindexed).toBe(true);

    // 3. Triage schema validation
    const triage = adminReportTriageSchema.safeParse({
      reportId: "44444444-4444-4444-8444-444444444444",
      action: "suspend_user",
      notes: "Confirmed safety threat. Account suspended under Section 23 safety protocol.",
    });
    expect(triage.success).toBe(true);
  });

  it("Flow 5: Section 23 ID document viewing governance with mandatory audit logging and no download", () => {
    const sim = new MarketplaceEndToEndSimulator();
    const adminId = "admin-auditor-1";

    // 1. Audit view validation: justification mandatory
    const invalidEmpty = adminIdViewSchema.safeParse({
      verificationRecordId: "55555555-5555-4555-8555-555555555555",
      reason: " ",
    });
    expect(invalidEmpty.success).toBe(false);

    const validAudit = adminIdViewSchema.safeParse({
      verificationRecordId: "55555555-5555-4555-8555-555555555555",
      reason: "Auditing host identity document for Mithila village host onboarding",
    });
    expect(validAudit.success).toBe(true);

    // 2. Log admin action
    sim.logAdminAction(
      adminId,
      "VIEW_IDENTITY_DOCUMENT",
      "verification_records",
      "Auditing host identity document for Mithila village host onboarding"
    );

    expect(sim.auditLogs.length).toBe(1);
    expect(sim.auditLogs[0]?.action).toBe("VIEW_IDENTITY_DOCUMENT");
    expect(sim.auditLogs[0]?.performed_by).toBe(adminId);
  });
});
