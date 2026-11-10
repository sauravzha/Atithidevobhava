import { describe, it, expect } from "vitest";
import {
  adminUserActionSchema,
  adminAccommodationReviewSchema,
  adminReportTriageSchema,
  adminIdViewSchema,
  adminVerificationReviewSchema,
} from "@/lib/validation/admin";

// In-memory simulation of Section 23 Administrative Governance & Moderation Engine
class AdminGovernanceEngine {
  public users: Map<
    string,
    { id: string; email: string; is_suspended: boolean; is_permanent_ban: boolean }
  > = new Map();

  public adminRoles: Map<
    string,
    "super_admin" | "moderator" | "verification_reviewer" | "finance" | "content"
  > = new Map();

  public accommodations: Map<
    string,
    { id: string; title: string; status: "pending_review" | "approved" | "rejected" | "suspended" }
  > = new Map();

  public reports: Map<
    string,
    {
      id: string;
      reported_user_id: string;
      is_urgent: boolean;
      status: "pending" | "investigating" | "resolved" | "dismissed";
      resolution_notes?: string;
    }
  > = new Map();

  public verificationRecords: Map<
    string,
    {
      id: string;
      user_id: string;
      verification_type: string;
      status: "pending" | "approved" | "rejected";
      id_document_image_path: string;
    }
  > = new Map();

  public auditLogs: Array<{
    id: string;
    action: string;
    target_entity: string;
    target_id: string;
    performed_by: string;
    reason: string;
    created_at: string;
  }> = [];

  // Register admin user with a specific role
  public registerAdmin(
    adminId: string,
    role: "super_admin" | "moderator" | "verification_reviewer" | "finance" | "content"
  ) {
    this.adminRoles.set(adminId, role);
  }

  // 1. admin_suspend_user() simulation
  public suspendUser(
    adminId: string,
    userId: string,
    reason: string,
    permanent: boolean = false
  ): { success: boolean; error?: string } {
    const adminRole = this.adminRoles.get(adminId);
    if (!adminRole || !["super_admin", "moderator"].includes(adminRole)) {
      return { success: false, error: "Unauthorized: requires super_admin or moderator role" };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: "Written justification of at least 5 characters is mandatory" };
    }

    if (permanent && adminRole !== "super_admin") {
      return { success: false, error: "Permanent bans are strictly restricted to super_admin" };
    }

    const targetUser = this.users.get(userId);
    if (!targetUser) {
      return { success: false, error: "Target user not found" };
    }

    targetUser.is_suspended = true;
    targetUser.is_permanent_ban = permanent;

    this.auditLogs.push({
      id: `log-${this.auditLogs.length + 1}`,
      action: permanent ? "PERMANENT_BAN_USER" : "SUSPEND_USER",
      target_entity: "users",
      target_id: userId,
      performed_by: adminId,
      reason,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  }

  // 2. admin_moderate_accommodation() simulation
  public moderateAccommodation(
    adminId: string,
    listingId: string,
    decision: "approve" | "reject" | "request_changes" | "suspend",
    reason: string
  ): { success: boolean; error?: string } {
    const adminRole = this.adminRoles.get(adminId);
    if (!adminRole || !["super_admin", "moderator"].includes(adminRole)) {
      return { success: false, error: "Unauthorized: moderation requires super_admin or moderator" };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: "Justification of at least 5 characters is mandatory" };
    }

    const listing = this.accommodations.get(listingId);
    if (!listing) {
      return { success: false, error: "Accommodation listing not found" };
    }

    let nextStatus: "pending_review" | "approved" | "rejected" | "suspended";
    switch (decision) {
      case "approve":
        nextStatus = "approved";
        break;
      case "reject":
        nextStatus = "rejected";
        break;
      case "request_changes":
        nextStatus = "pending_review";
        break;
      case "suspend":
        nextStatus = "suspended";
        break;
    }

    listing.status = nextStatus;

    this.auditLogs.push({
      id: `log-${this.auditLogs.length + 1}`,
      action: `MODERATE_ACCOMMODATION_${decision.toUpperCase()}`,
      target_entity: "accommodation_listings",
      target_id: listingId,
      performed_by: adminId,
      reason,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  }

  // 3. admin_triage_report() simulation
  public triageReport(
    adminId: string,
    reportId: string,
    action: "resolve" | "dismiss" | "investigate" | "suspend_user",
    notes: string
  ): { success: boolean; error?: string } {
    const adminRole = this.adminRoles.get(adminId);
    if (!adminRole || !["super_admin", "moderator"].includes(adminRole)) {
      return { success: false, error: "Unauthorized: only super_admin or moderator can triage reports" };
    }

    if (!notes || notes.trim().length < 5) {
      return { success: false, error: "Resolution notes of at least 5 characters are required" };
    }

    const report = this.reports.get(reportId);
    if (!report) {
      return { success: false, error: "Report not found" };
    }

    if (action === "suspend_user") {
      const user = this.users.get(report.reported_user_id);
      if (user) {
        user.is_suspended = true;
      }
      report.status = "resolved";
    } else if (action === "investigate") {
      report.status = "investigating";
    } else if (action === "resolve") {
      report.status = "resolved";
    } else if (action === "dismiss") {
      report.status = "dismissed";
    }

    report.resolution_notes = notes;

    this.auditLogs.push({
      id: `log-${this.auditLogs.length + 1}`,
      action: `TRIAGE_REPORT_${action.toUpperCase()}`,
      target_entity: "reports",
      target_id: reportId,
      performed_by: adminId,
      reason: notes,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  }

  // 4. admin_log_id_document_view() simulation
  public viewIdDocument(
    adminId: string,
    verificationRecordId: string,
    reason: string
  ): { success: boolean; documentRef?: string; error?: string } {
    const adminRole = this.adminRoles.get(adminId);
    if (!adminRole || !["super_admin", "verification_reviewer"].includes(adminRole)) {
      return { success: false, error: "Unauthorized: only super_admin or verification_reviewer can view identity documents" };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: "Justification of at least 5 characters is mandatory before viewing identity documents" };
    }

    const record = this.verificationRecords.get(verificationRecordId);
    if (!record) {
      return { success: false, error: "Verification record not found" };
    }

    this.auditLogs.push({
      id: `log-${this.auditLogs.length + 1}`,
      action: "VIEW_IDENTITY_DOCUMENT",
      target_entity: "verification_records",
      target_id: verificationRecordId,
      performed_by: adminId,
      reason,
      created_at: new Date().toISOString(),
    });

    return { success: true, documentRef: record.id_document_image_path };
  }

  // 5. get_admin_metrics() simulation
  public getMetrics() {
    return {
      total_users: this.users.size,
      suspended_users: Array.from(this.users.values()).filter((u) => u.is_suspended).length,
      active_accommodations: Array.from(this.accommodations.values()).filter((a) => a.status === "approved").length,
      pending_accommodations: Array.from(this.accommodations.values()).filter((a) => a.status === "pending_review").length,
      pending_reports: Array.from(this.reports.values()).filter((r) => r.status === "pending").length,
      urgent_reports: Array.from(this.reports.values()).filter((r) => r.is_urgent && r.status === "pending").length,
      total_audit_events: this.auditLogs.length,
    };
  }
}

describe("Milestone 11: Administrative Validation Schemas", () => {
  it("validates administrative user suspension with mandatory justification", () => {
    const valid = adminUserActionSchema.safeParse({
      userId: "11111111-1111-4111-8111-111111111111",
      action: "suspend",
      reason: "Suspicious solicitations reported by multiple verified travellers",
      permanent: false,
    });
    expect(valid.success).toBe(true);

    const invalidShortReason = adminUserActionSchema.safeParse({
      userId: "11111111-1111-4111-8111-111111111111",
      action: "suspend",
      reason: "bad",
    });
    expect(invalidShortReason.success).toBe(false);
  });

  it("validates accommodation review decision with required reason", () => {
    const valid = adminAccommodationReviewSchema.safeParse({
      listingId: "22222222-2222-4222-8222-222222222222",
      decision: "request_changes",
      reason: "Household composition description requires clarification regarding separate guest quarters",
    });
    expect(valid.success).toBe(true);

    const invalidDecision = adminAccommodationReviewSchema.safeParse({
      listingId: "22222222-2222-4222-8222-222222222222",
      decision: "unknown_decision",
      reason: "Valid reason text here",
    });
    expect(invalidDecision.success).toBe(false);
  });

  it("validates safety report triage inputs", () => {
    const valid = adminReportTriageSchema.safeParse({
      reportId: "33333333-3333-4333-8333-333333333333",
      action: "suspend_user",
      notes: "Account immediately suspended following verified harassment in chat transcript snapshot",
    });
    expect(valid.success).toBe(true);

    const shortNotes = adminReportTriageSchema.safeParse({
      reportId: "33333333-3333-4333-8333-333333333333",
      action: "resolve",
      notes: "done",
    });
    expect(shortNotes.success).toBe(false);
  });

  it("enforces mandatory written justification before ID document view", () => {
    const valid = adminIdViewSchema.safeParse({
      verificationRecordId: "44444444-4444-4444-8444-444444444444",
      reason: "Verifying government ID against local member host application",
    });
    expect(valid.success).toBe(true);

    const blankReason = adminIdViewSchema.safeParse({
      verificationRecordId: "44444444-4444-4444-8444-444444444444",
      reason: "   ",
    });
    expect(blankReason.success).toBe(false);
  });

  it("validates verification record review schema", () => {
    const valid = adminVerificationReviewSchema.safeParse({
      verificationRecordId: "44444444-4444-4444-8444-444444444444",
      decision: "approve",
      reason: "Official artisan society identity documents verified and cross-checked",
    });
    expect(valid.success).toBe(true);
  });
});

describe("Milestone 11: Administrative Access Control & Role Boundaries", () => {
  it("allows moderator to suspend a user temporarily, but rejects permanent ban", () => {
    const engine = new AdminGovernanceEngine();
    const moderatorId = "mod-101";
    const userId = "user-201";

    engine.registerAdmin(moderatorId, "moderator");
    engine.users.set(userId, {
      id: userId,
      email: "traveller@example.com",
      is_suspended: false,
      is_permanent_ban: false,
    });

    // 1. Moderator attempts permanent ban -> should fail
    const permResult = engine.suspendUser(
      moderatorId,
      userId,
      "Major misconduct reported in village stay",
      true
    );
    expect(permResult.success).toBe(false);
    expect(permResult.error).toContain("Permanent bans are strictly restricted to super_admin");

    // 2. Moderator issues temporary suspension -> should succeed
    const tempResult = engine.suspendUser(
      moderatorId,
      userId,
      "Temporary suspension pending safety review",
      false
    );
    expect(tempResult.success).toBe(true);
    expect(engine.users.get(userId)?.is_suspended).toBe(true);
    expect(engine.users.get(userId)?.is_permanent_ban).toBe(false);
  });

  it("allows super_admin to issue permanent bans", () => {
    const engine = new AdminGovernanceEngine();
    const superAdminId = "super-101";
    const userId = "user-202";

    engine.registerAdmin(superAdminId, "super_admin");
    engine.users.set(userId, {
      id: userId,
      email: "badactor@example.com",
      is_suspended: false,
      is_permanent_ban: false,
    });

    const result = engine.suspendUser(
      superAdminId,
      userId,
      "Confirmed identity fraud and multiple policy violations",
      true
    );
    expect(result.success).toBe(true);
    expect(engine.users.get(userId)?.is_suspended).toBe(true);
    expect(engine.users.get(userId)?.is_permanent_ban).toBe(true);
  });

  it("rejects moderation actions from unauthorized regular users", () => {
    const engine = new AdminGovernanceEngine();
    const regularUserId = "normal-user-1";
    const targetListingId = "stay-301";

    engine.accommodations.set(targetListingId, {
      id: targetListingId,
      title: "Madhubani Courtyard Homestay",
      status: "pending_review",
    });

    const modResult = engine.moderateAccommodation(
      regularUserId,
      targetListingId,
      "approve",
      "I think this looks good"
    );
    expect(modResult.success).toBe(false);
    expect(modResult.error).toContain("Unauthorized");
  });
});

describe("Milestone 11: Safety Report Triage & Cascading User Suspension", () => {
  it("cascades user suspension upon safety incident triage with action 'suspend_user'", () => {
    const engine = new AdminGovernanceEngine();
    const moderatorId = "mod-102";
    const reportedUserId = "user-bad-behavior";
    const reportId = "report-501";

    engine.registerAdmin(moderatorId, "moderator");
    engine.users.set(reportedUserId, {
      id: reportedUserId,
      email: "harasser@example.com",
      is_suspended: false,
      is_permanent_ban: false,
    });
    engine.reports.set(reportId, {
      id: reportId,
      reported_user_id: reportedUserId,
      is_urgent: true,
      status: "pending",
    });

    const triageResult = engine.triageReport(
      moderatorId,
      reportId,
      "suspend_user",
      "Confirmed abusive message patterns in 20-message transcript snapshot"
    );

    expect(triageResult.success).toBe(true);
    // Verified: reported user is suspended
    expect(engine.users.get(reportedUserId)?.is_suspended).toBe(true);
    // Verified: report is resolved
    expect(engine.reports.get(reportId)?.status).toBe("resolved");
    expect(engine.reports.get(reportId)?.resolution_notes).toContain("abusive message patterns");
  });
});

describe("Milestone 11: Section 23 Identity Document Audited Access Control", () => {
  it("strictly enforces justification requirement before viewing ID and records audit log", () => {
    const engine = new AdminGovernanceEngine();
    const reviewerId = "reviewer-1";
    const verifId = "verif-record-901";

    engine.registerAdmin(reviewerId, "verification_reviewer");
    engine.verificationRecords.set(verifId, {
      id: verifId,
      user_id: "host-401",
      verification_type: "identity_id_check",
      status: "pending",
      id_document_image_path: "/secure-vault/gov-id-record-901.enc",
    });

    // 1. Attempt to view without justification -> fails
    const failView = engine.viewIdDocument(reviewerId, verifId, "");
    expect(failView.success).toBe(false);
    expect(failView.error).toContain("Justification of at least 5 characters is mandatory");

    // 2. View with valid written justification -> succeeds and creates audit log
    const okView = engine.viewIdDocument(
      reviewerId,
      verifId,
      "Auditing artisan identity credentials for Mithila cultural host onboarding"
    );
    expect(okView.success).toBe(true);
    expect(okView.documentRef).toBe("/secure-vault/gov-id-record-901.enc");

    // 3. Verify audit log entry was created
    const logEntry = engine.auditLogs.find(
      (l) => l.action === "VIEW_IDENTITY_DOCUMENT" && l.target_id === verifId
    );
    expect(logEntry).toBeDefined();
    expect(logEntry?.performed_by).toBe(reviewerId);
    expect(logEntry?.reason).toContain("artisan identity credentials");
  });

  it("blocks finance or content moderators from viewing identity documents", () => {
    const engine = new AdminGovernanceEngine();
    const financeAdminId = "finance-admin-1";
    const verifId = "verif-record-902";

    engine.registerAdmin(financeAdminId, "finance");
    engine.verificationRecords.set(verifId, {
      id: verifId,
      user_id: "host-402",
      verification_type: "identity_id_check",
      status: "pending",
      id_document_image_path: "/secure-vault/gov-id-record-902.enc",
    });

    const res = engine.viewIdDocument(
      financeAdminId,
      verifId,
      "Just checking financial documents"
    );
    expect(res.success).toBe(false);
    expect(res.error).toContain("Unauthorized: only super_admin or verification_reviewer");
  });
});

describe("Milestone 11: Real Operational Telemetry Metrics Grounding", () => {
  it("calculates accurate telemetry directly from database state with zero synthetic inflation", () => {
    const engine = new AdminGovernanceEngine();

    engine.users.set("u1", { id: "u1", email: "u1@test.com", is_suspended: false, is_permanent_ban: false });
    engine.users.set("u2", { id: "u2", email: "u2@test.com", is_suspended: true, is_permanent_ban: false });
    engine.users.set("u3", { id: "u3", email: "u3@test.com", is_suspended: false, is_permanent_ban: false });

    engine.accommodations.set("a1", { id: "a1", title: "Stay 1", status: "approved" });
    engine.accommodations.set("a2", { id: "a2", title: "Stay 2", status: "pending_review" });

    engine.reports.set("r1", { id: "r1", reported_user_id: "u2", is_urgent: true, status: "pending" });
    engine.reports.set("r2", { id: "r2", reported_user_id: "u1", is_urgent: false, status: "pending" });

    const metrics = engine.getMetrics();

    expect(metrics.total_users).toBe(3);
    expect(metrics.suspended_users).toBe(1);
    expect(metrics.active_accommodations).toBe(1);
    expect(metrics.pending_accommodations).toBe(1);
    expect(metrics.pending_reports).toBe(2);
    expect(metrics.urgent_reports).toBe(1);
  });
});
