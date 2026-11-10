import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateCommission,
  verifyLedgerBalance,
  DevPaymentProcessor,
} from "@/lib/payments";
import { createBookingSchema, confirmPaymentSchema } from "@/lib/validation/booking";

// In-memory atomic slot state engine simulating PostgreSQL SELECT FOR UPDATE row locking
class ConcurrentSlotEngine {
  private capacity: number;
  private bookedCount: number;
  private lock: Promise<void> = Promise.resolve();
  private bookings: Map<string, { id: string; scheduleId: string; participants: number; idempotencyKey: string }> = new Map();

  constructor(capacity: number, initialBooked = 0) {
    this.capacity = capacity;
    this.bookedCount = initialBooked;
  }

  // Atomically locks the slot row, performs capacity check, and updates booked count
  public async book(
    travellerId: string,
    participants: number,
    idempotencyKey: string
  ): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    // Acquire mutex simulating SELECT FOR UPDATE
    let releaseLock: () => void = () => {};
    const currentLock = this.lock;
    this.lock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    await currentLock;

    try {
      // 1. Idempotency check
      for (const b of this.bookings.values()) {
        if (b.idempotencyKey === idempotencyKey) {
          return { success: true, bookingId: b.id };
        }
      }

      // 2. Capacity check
      if (this.bookedCount + participants > this.capacity) {
        return {
          success: false,
          error: `Capacity exceeded. Requested: ${participants}, Available: ${this.capacity - this.bookedCount}`,
        };
      }

      // 3. Atomically update booked count
      this.bookedCount += participants;
      const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      this.bookings.set(bookingId, {
        id: bookingId,
        scheduleId: "sched-1",
        participants,
        idempotencyKey,
      });

      return { success: true, bookingId };
    } finally {
      releaseLock();
    }
  }

  public cancel(bookingId: string): boolean {
    const b = this.bookings.get(bookingId);
    if (!b) return false;
    this.bookedCount = Math.max(0, this.bookedCount - b.participants);
    this.bookings.delete(bookingId);
    return true;
  }

  public getBookedCount(): number {
    return this.bookedCount;
  }

  public getAvailableCount(): number {
    return Math.max(0, this.capacity - this.bookedCount);
  }
}

describe("Milestone 9: Booking Engine, Concurrency, and Double-Booking Prevention", () => {
  it("prevents double-booking and overselling under concurrent load (Capacity = 3, 5 concurrent requests)", async () => {
    // Slot with exactly 3 spots available
    const engine = new ConcurrentSlotEngine(3, 0);

    // 5 distinct travellers attempt to book 1 slot simultaneously
    const attempts = [
      engine.book("traveller-1", 1, "idem-key-user-1-random-1234567"),
      engine.book("traveller-2", 1, "idem-key-user-2-random-1234567"),
      engine.book("traveller-3", 1, "idem-key-user-3-random-1234567"),
      engine.book("traveller-4", 1, "idem-key-user-4-random-1234567"),
      engine.book("traveller-5", 1, "idem-key-user-5-random-1234567"),
    ];

    const results = await Promise.all(attempts);

    const successfulBookings = results.filter((r) => r.success);
    const failedBookings = results.filter((r) => !r.success);

    // Exactly 3 bookings MUST succeed, exactly 2 MUST fail
    expect(successfulBookings).toHaveLength(3);
    expect(failedBookings).toHaveLength(2);

    // The schedule booked_count MUST be exactly 3, never 4 or 5
    expect(engine.getBookedCount()).toBe(3);
    expect(engine.getAvailableCount()).toBe(0);

    // Failed bookings should state capacity exceeded
    for (const fail of failedBookings) {
      expect(fail.error).toContain("Capacity exceeded");
    }
  });

  it("handles group booking race conditions where a larger group exceeds remaining capacity", async () => {
    // Slot with capacity 4, already 2 spots booked (2 left)
    const engine = new ConcurrentSlotEngine(4, 2);

    // Request A wants 3 spots (exceeds available 2)
    const resA = await engine.book("traveller-a", 3, "idem-key-group-a-12345678");
    expect(resA.success).toBe(false);
    expect(resA.error).toContain("Capacity exceeded");

    // Request B wants 2 spots (matches remaining 2)
    const resB = await engine.book("traveller-b", 2, "idem-key-group-b-12345678");
    expect(resB.success).toBe(true);
    expect(engine.getBookedCount()).toBe(4);
    expect(engine.getAvailableCount()).toBe(0);

    // Subsequent request C wants 1 spot but slot is now completely full
    const resC = await engine.book("traveller-c", 1, "idem-key-group-c-12345678");
    expect(resC.success).toBe(false);
    expect(engine.getBookedCount()).toBe(4);
  });

  it("enforces idempotency under concurrent retries with identical keys", async () => {
    const engine = new ConcurrentSlotEngine(5, 0);
    const identicalKey = "idem-key-concurrent-doubleclick-99999";

    // Simulate two concurrent requests with identical idempotency key (e.g. quick double-click)
    const [res1, res2] = await Promise.all([
      engine.book("traveller-1", 1, identicalKey),
      engine.book("traveller-1", 1, identicalKey),
    ]);

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    // Both return the exact same booking ID
    expect(res1.bookingId).toBe(res2.bookingId);
    // Booked count MUST be 1, NOT 2
    expect(engine.getBookedCount()).toBe(1);
  });

  it("restores slot capacity immediately upon booking cancellation", async () => {
    const engine = new ConcurrentSlotEngine(6, 2); // 4 spots available
    expect(engine.getAvailableCount()).toBe(4);

    const bookRes = await engine.book("traveller-1", 3, "idem-key-cancellation-test-1");
    expect(bookRes.success).toBe(true);
    expect(engine.getBookedCount()).toBe(5);
    expect(engine.getAvailableCount()).toBe(1);

    // Cancel the booking
    const cancelled = engine.cancel(bookRes.bookingId!);
    expect(cancelled).toBe(true);

    // Capacity must be restored to previous state
    expect(engine.getBookedCount()).toBe(2);
    expect(engine.getAvailableCount()).toBe(4);
  });
});

describe("Milestone 9: Commission Snapshot and Double-Entry Ledger", () => {
  it("calculates exact commission and host payout at default 15% rate", () => {
    // 2 participants @ INR 1,200 = INR 2,400 = 240,000 paise
    const totalPricePaise = 240000;
    const { platformFeePaise, hostPayoutPaise } = calculateCommission(totalPricePaise, 15.0);

    // Platform fee: 15% of 240,000 = 36,000 paise (INR 360)
    expect(platformFeePaise).toBe(36000);
    // Host payout: 85% of 240,000 = 204,000 paise (INR 2,040)
    expect(hostPayoutPaise).toBe(204000);
    // Total must balance
    expect(platformFeePaise + hostPayoutPaise).toBe(totalPricePaise);
  });

  it("calculates configurable commission rate snapshot", () => {
    // Custom 12.5% rate on INR 10,000 (1,000,000 paise)
    const totalPricePaise = 1000000;
    const { platformFeePaise, hostPayoutPaise } = calculateCommission(totalPricePaise, 12.5);

    expect(platformFeePaise).toBe(125000); // INR 1,250
    expect(hostPayoutPaise).toBe(875000); // INR 8,750
    expect(platformFeePaise + hostPayoutPaise).toBe(totalPricePaise);
  });

  it("verifies double-entry ledger balance: Sum(debit) === Sum(credit)", () => {
    const totalAmount = 150000; // INR 1,500
    const commission = 22500; // 15% = INR 225
    const hostPayable = 127500; // INR 1,275

    const captureLedgerEntries = [
      { account_name: "traveller_funds", debit_paise: totalAmount, credit_paise: 0 },
      { account_name: "host_payable", debit_paise: 0, credit_paise: hostPayable },
      { account_name: "platform_commission", debit_paise: 0, credit_paise: commission },
    ];

    expect(verifyLedgerBalance(captureLedgerEntries)).toBe(true);

    // Reversing refund ledger entries must also balance
    const refundLedgerEntries = [
      { account_name: "traveller_funds", debit_paise: 0, credit_paise: totalAmount },
      { account_name: "host_payable", debit_paise: hostPayable, credit_paise: 0 },
      { account_name: "platform_commission", debit_paise: commission, credit_paise: 0 },
    ];

    expect(verifyLedgerBalance(refundLedgerEntries)).toBe(true);

    // An imbalanced ledger must be detected and rejected
    const imbalancedEntries = [
      { account_name: "traveller_funds", debit_paise: totalAmount, credit_paise: 0 },
      { account_name: "host_payable", debit_paise: 0, credit_paise: hostPayable }, // Missing platform_commission
    ];
    expect(verifyLedgerBalance(imbalancedEntries)).toBe(false);
  });
});

describe("Milestone 9: Payment Providers and Webhook Verification", () => {
  let devGateway: DevPaymentProcessor;

  beforeEach(() => {
    devGateway = new DevPaymentProcessor();
  });

  it("creates order in development mode with clear simulation labelling", async () => {
    const order = await devGateway.createOrder({
      bookingId: "11111111-2222-3333-4444-555555555555",
      amountPaise: 120000,
      currency: "INR",
      receipt: "rcpt_1111",
      customerName: "Saurav Sharma",
      customerEmail: "saurav@example.com",
    });

    expect(order.isDevSimulation).toBe(true);
    expect(order.provider).toBe("development");
    expect(order.orderId).toMatch(/^order_dev_/);
    expect(order.checkoutPayload.notice).toContain("Development Payment Simulator");
  });

  it("verifies development payment signature with deterministic HMAC validation", async () => {
    const orderId = "order_dev_test_123";
    const paymentId = "pay_dev_test_456";
    const validSignature = devGateway.generateTestSignature(orderId, paymentId);

    const validRes = await devGateway.verifyPayment({
      orderId,
      paymentId,
      signature: validSignature,
    });
    expect(validRes.valid).toBe(true);

    // Tampered signature must fail
    const invalidRes = await devGateway.verifyPayment({
      orderId,
      paymentId,
      signature: "tampered_signature_hex",
    });
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.error).toContain("Invalid payment simulation signature");
  });

  it("verifies and parses webhook payloads accurately", () => {
    const rawBody = JSON.stringify({
      event_id: "evt_test_101",
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_test_789",
            order_id: "order_test_456",
            amount: 240000,
          },
        },
      },
    });

    const parsed = devGateway.parseWebhookPayload(rawBody);
    expect(parsed).not.toBeNull();
    expect(parsed?.eventId).toBe("evt_test_101");
    expect(parsed?.eventType).toBe("payment.captured");
    expect(parsed?.orderId).toBe("order_test_456");
    expect(parsed?.paymentId).toBe("pay_test_789");
    expect(parsed?.amountPaise).toBe(240000);
  });
});

describe("Milestone 9: Booking Input Validation Schemas", () => {
  it("validates booking creation constraints (min 1 pax, max 50 pax, valid idempotency key)", () => {
    const validData = {
      experienceId: "11111111-2222-3333-4444-555555555555",
      scheduleId: "22222222-3333-4444-5555-666666666666",
      participantCount: 2,
      participantNames: ["Aarav Mehta", "Diya Sharma"],
      idempotencyKey: "idem_key_valid_long_string_12345",
    };

    const res = createBookingSchema.safeParse(validData);
    expect(res.success).toBe(true);

    // Reject 0 participants
    const zeroPax = createBookingSchema.safeParse({ ...validData, participantCount: 0 });
    expect(zeroPax.success).toBe(false);

    // Reject missing participant names
    const missingNames = createBookingSchema.safeParse({ ...validData, participantNames: [] });
    expect(missingNames.success).toBe(false);

    // Reject short idempotency key
    const shortKey = createBookingSchema.safeParse({ ...validData, idempotencyKey: "short" });
    expect(shortKey.success).toBe(false);
  });

  it("validates payment confirmation schema", () => {
    const validConfirm = {
      bookingId: "11111111-2222-3333-4444-555555555555",
      orderId: "order_12345",
      paymentId: "pay_12345",
      signature: "sig_abcdef123456",
    };

    const res = confirmPaymentSchema.safeParse(validConfirm);
    expect(res.success).toBe(true);

    const invalidUuid = confirmPaymentSchema.safeParse({
      ...validConfirm,
      bookingId: "invalid-uuid",
    });
    expect(invalidUuid.success).toBe(false);
  });
});
