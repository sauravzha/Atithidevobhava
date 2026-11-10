import { describe, it, expect } from "vitest";
import {
  createConnectionRequestSchema,
  declineConnectionSchema,
  scheduleConnectionSchema,
  contactExchangeConsentSchema,
} from "@/lib/validation/connection";
import {
  createConnectionRequestAction,
  acceptConnectionAction,
  declineConnectionAction,
  withdrawConnectionAction,
  scheduleConnectionAction,
  completeConnectionAction,
  updateContactExchangeConsentAction,
} from "@/app/actions/connections";

describe("Milestone 6: Connection Request Validation Schemas", () => {
  it("enforces 50 to 600 characters message on connection creation", () => {
    const validData = {
      recipientId: "loc-br-01",
      purpose: "tea_or_coffee" as const,
      proposedDates: "Tomorrow morning 10 AM",
      suggestedPublicPlace: "Central Library lawn café",
      initialMessage:
        "Hello Amarnath ji. I would love to meet for a cup of tea to learn more about the Dhrupad classical music tradition of Darbhanga.", // 131 chars
      idempotencyKey: "idem_key_test_12345",
    };

    expect(createConnectionRequestSchema.safeParse(validData).success).toBe(true);

    // Message too short (< 50 characters)
    const tooShort = {
      ...validData,
      initialMessage: "Hi, let's meet tomorrow.", // 24 chars
    };
    const shortResult = createConnectionRequestSchema.safeParse(tooShort);
    expect(shortResult.success).toBe(false);
    if (!shortResult.success) {
      expect(shortResult.error.issues[0]?.message).toContain("at least 50 characters");
    }

    // Message too long (> 600 characters)
    const tooLong = {
      ...validData,
      initialMessage: "A".repeat(601),
    };
    expect(createConnectionRequestSchema.safeParse(tooLong).success).toBe(false);
  });

  it("validates decline and schedule schemas", () => {
    // Decline
    expect(
      declineConnectionSchema.safeParse({
        connectionId: "conn-123",
        declineReason: "busy_schedule",
      }).success
    ).toBe(true);

    // Schedule
    expect(
      scheduleConnectionSchema.safeParse({
        connectionId: "conn-123",
        scheduledAt: new Date().toISOString(),
        confirmedPublicPlace: "Town Hall public tea shop",
      }).success
    ).toBe(true);

    // Invalid date in schedule
    expect(
      scheduleConnectionSchema.safeParse({
        connectionId: "conn-123",
        scheduledAt: "invalid-date",
        confirmedPublicPlace: "Town Hall public tea shop",
      }).success
    ).toBe(false);
  });

  it("enforces selecting at least one channel in contact exchange", () => {
    // No channel selected
    const noChannel = contactExchangeConsentSchema.safeParse({
      connectionId: "conn-123",
      shareEmail: false,
      sharePhone: false,
      shareWhatsapp: false,
    });
    expect(noChannel.success).toBe(false);

    // At least one channel selected
    const withEmail = contactExchangeConsentSchema.safeParse({
      connectionId: "conn-123",
      shareEmail: true,
      sharePhone: false,
      shareWhatsapp: false,
      emailValue: "sarah@example.com",
    });
    expect(withEmail.success).toBe(true);
  });
});

describe("Milestone 6: Connection Lifecycle State Machine", () => {
  it("transitions connection cleanly: PENDING -> ACCEPTED -> SCHEDULED -> COMPLETED", async () => {
    // 1. Create request
    const createRes = await createConnectionRequestAction({
      recipientId: "loc-br-02",
      purpose: "market_walk",
      proposedDates: "Next Sunday, 9 AM",
      suggestedPublicPlace: "Madhubani Town Hall central gates",
      initialMessage:
        "Namaste Sunita ji. I am visiting Madhubani to observe the traditional weekly artisan market and would appreciate walking with a resident.",
      idempotencyKey: "idem_lifecycle_test_" + Date.now(),
    });

    expect(createRes.success).toBe(true);
    const connId = createRes.data!.connectionId;

    // 2. Accept (local member)
    const acceptRes = await acceptConnectionAction(connId);
    expect(acceptRes.success).toBe(true);
    expect(acceptRes.message).toContain("accepted");

    // 3. Schedule meetup
    const scheduleRes = await scheduleConnectionAction({
      connectionId: connId,
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      confirmedPublicPlace: "Madhubani Town Hall central gates",
    });
    expect(scheduleRes.success).toBe(true);

    // 4. Complete meetup
    const completeRes = await completeConnectionAction(connId);
    expect(completeRes.success).toBe(true);
    expect(completeRes.message).toContain("completed");

    // 5. Illegal transition: Cannot transition completed connection back to PENDING or ACCEPTED
    const illegalAccept = await acceptConnectionAction(connId);
    expect(illegalAccept.success).toBe(false);
  });

  it("handles decline and withdrawal from PENDING", async () => {
    // Test withdrawal
    const req1 = await createConnectionRequestAction({
      recipientId: "loc-br-03",
      purpose: "tea_or_coffee",
      proposedDates: "Tomorrow",
      suggestedPublicPlace: "Tower Clock square",
      initialMessage:
        "Hello Rameshwar ji. Would like to meet for a short tea conversation to discuss Makhana pond ecology.",
      idempotencyKey: "idem_withdraw_" + Date.now(),
    });
    const withdrawRes = await withdrawConnectionAction(req1.data!.connectionId);
    expect(withdrawRes.success).toBe(true);

    // Test decline
    const req2 = await createConnectionRequestAction({
      recipientId: "loc-br-04",
      purpose: "language_exchange",
      proposedDates: "Next Friday",
      suggestedPublicPlace: "Ranti Community Center",
      initialMessage:
        "Hello Priyanka ji. Interested in learning basic Maithili conversational phrases during my stay.",
      idempotencyKey: "idem_decline_" + Date.now(),
    });
    const declineRes = await declineConnectionAction({
      connectionId: req2.data!.connectionId,
      declineReason: "busy_schedule",
    });
    expect(declineRes.success).toBe(true);
    expect(declineRes.message).toContain("unable to meet");
  });
});

describe("Milestone 6: Dual Mutual Consent Contact Exchange Engine", () => {
  it("withholds contact disclosure until BOTH parties confirm", async () => {
    // Setup accepted connection
    const createRes = await createConnectionRequestAction({
      recipientId: "loc-br-05",
      purpose: "tea_or_coffee",
      proposedDates: "Saturday morning",
      suggestedPublicPlace: "Harahi Lake promenade",
      initialMessage:
        "Hello Vidyadhar ji. I would be honored to meet and talk about classical Mallick Gharana traditions.",
      idempotencyKey: "idem_exchange_" + Date.now(),
    });
    const connId = createRes.data!.connectionId;
    await acceptConnectionAction(connId);

    // First party (traveller) confirms consent
    const travellerConsent = await updateContactExchangeConsentAction(
      {
        connectionId: connId,
        shareEmail: true,
        sharePhone: false,
        shareWhatsapp: false,
        emailValue: "traveller@example.com",
      },
      "traveller"
    );
    expect(travellerConsent.success).toBe(true);
    // Invariant: bothConfirmed MUST be false after only one confirmation!
    expect(travellerConsent.data?.bothConfirmed).toBe(false);
    expect(travellerConsent.message).toContain("Waiting for the other person");

    // Second party (local) confirms consent
    const localConsent = await updateContactExchangeConsentAction(
      {
        connectionId: connId,
        shareEmail: true,
        sharePhone: true,
        shareWhatsapp: false,
        emailValue: "local@example.com",
        phoneValue: "+919876543210",
      },
      "local"
    );
    expect(localConsent.success).toBe(true);
    // Invariant: bothConfirmed MUST be true once both have confirmed!
    expect(localConsent.data?.bothConfirmed).toBe(true);
    expect(localConsent.message).toContain("Both parties have confirmed");
  });
});

