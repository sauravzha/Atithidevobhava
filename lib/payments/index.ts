import type { PaymentProviderAdapter, PaymentProviderType } from "./types";
import { DevPaymentProcessor } from "./development";
import { RazorpayPaymentProcessor } from "./razorpay";
import { CashfreePaymentProcessor } from "./cashfree";

export * from "./types";
export * from "./development";
export * from "./razorpay";
export * from "./cashfree";
export * from "./reconciliation";

/**
 * Returns the configured payment provider adapter based on environment.
 * Invariant: If Razorpay credentials are missing, falls back to the clearly
 * labelled development simulator without claiming live bank operations.
 */
export function getPaymentProvider(preferredProvider?: PaymentProviderType): PaymentProviderAdapter {
  const provider =
    preferredProvider ||
    (process.env.PAYMENT_PROVIDER as PaymentProviderType) ||
    "development";

  if (provider === "razorpay") {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      return new RazorpayPaymentProcessor();
    }
    // Fall back safely to development mode with a descriptive warning
    console.warn(
      "[PaymentProvider] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Falling back to development simulator."
    );
    return new DevPaymentProcessor();
  }

  if (provider === "cashfree") {
    return new CashfreePaymentProcessor();
  }

  return new DevPaymentProcessor();
}

/**
 * Calculates platform commission and host payout from total price.
 * Default commission rate for experiences is 15%.
 */
export function calculateCommission(
  totalPricePaise: number,
  commissionRatePercent = 15.0
): { platformFeePaise: number; hostPayoutPaise: number } {
  const platformFeePaise = Math.round(totalPricePaise * (commissionRatePercent / 100));
  const hostPayoutPaise = totalPricePaise - platformFeePaise;
  return { platformFeePaise, hostPayoutPaise };
}

/**
 * Verifies that a set of double-entry ledger lines is strictly balanced:
 * Sum(debit) == Sum(credit).
 */
export function verifyLedgerBalance(
  entries: Array<{ debit_paise: number; credit_paise: number }>
): boolean {
  if (entries.length === 0) return true;
  const totalDebit = entries.reduce((acc, curr) => acc + curr.debit_paise, 0);
  const totalCredit = entries.reduce((acc, curr) => acc + curr.credit_paise, 0);
  return totalDebit === totalCredit;
}
