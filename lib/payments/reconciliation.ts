import { createAdminClient } from "@/lib/supabase/admin";

export interface ReconciliationResult {
  expiredBookingsProcessed: number;
  capacityRestored: number;
  ledgerAnomaliesDetected: number;
  errors: string[];
}

/**
 * Reconciles pending bookings and accounting ledger balances.
 * Security Invariant: Uses admin client to release expired locks and audit anomalies.
 */
export async function runBookingReconciliation(
  staleTimeoutMinutes = 30
): Promise<ReconciliationResult> {
  const adminClient = createAdminClient();
  const result: ReconciliationResult = {
    expiredBookingsProcessed: 0,
    capacityRestored: 0,
    ledgerAnomaliesDetected: 0,
    errors: [],
  };

  try {
    const cutoffTime = new Date(Date.now() - staleTimeoutMinutes * 60 * 1000).toISOString();

    // 1. Fetch expired payment_pending bookings
    const { data: expiredBookings, error: fetchErr } = await adminClient
      .from("experience_bookings")
      .select("id, schedule_id, participant_count, status, created_at")
      .eq("status", "payment_pending")
      .lt("created_at", cutoffTime);

    if (fetchErr) {
      result.errors.push(`Failed to fetch stale bookings: ${fetchErr.message}`);
      return result;
    }

    if (expiredBookings && expiredBookings.length > 0) {
      for (const booking of expiredBookings) {
        // Mark as cancelled due to payment expiration
        const { error: updateErr } = await adminClient
          .from("experience_bookings")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.id);

        if (updateErr) {
          result.errors.push(`Failed to cancel booking ${booking.id}: ${updateErr.message}`);
          continue;
        }

        // Restore schedule capacity
        const { data: schedule } = await adminClient
          .from("experience_schedules")
          .select("booked_count")
          .eq("id", booking.schedule_id)
          .single();

        if (schedule) {
          const newCount = Math.max(0, schedule.booked_count - booking.participant_count);
          await adminClient
            .from("experience_schedules")
            .update({
              booked_count: newCount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", booking.schedule_id);

          result.capacityRestored += booking.participant_count;
        }

        result.expiredBookingsProcessed += 1;

        // Log to admin_audit_logs
        await adminClient.from("admin_audit_logs").insert({
          action: "EXPIRE_STALE_BOOKING",
          target_entity: "experience_bookings",
          target_id: booking.id,
          reason: `Automatic reconciliation expired unpaid booking after ${staleTimeoutMinutes} minutes`,
        });
      }
    }

    // 2. Audit double-entry ledger balance: Sum(debit) MUST equal Sum(credit) across every transaction_ref
    const { data: ledgerEntries, error: ledgerErr } = await adminClient
      .from("ledger_entries")
      .select("transaction_ref, debit_paise, credit_paise");

    if (!ledgerErr && ledgerEntries) {
      const balancesByTx: Record<string, { debit: number; credit: number }> = {};
      for (const entry of ledgerEntries) {
        const tx = balancesByTx[entry.transaction_ref] || { debit: 0, credit: 0 };
        tx.debit += entry.debit_paise;
        tx.credit += entry.credit_paise;
        balancesByTx[entry.transaction_ref] = tx;
      }

      for (const [txRef, bal] of Object.entries(balancesByTx)) {
        if (bal.debit !== bal.credit) {
          result.ledgerAnomaliesDetected += 1;
          result.errors.push(
            `Ledger imbalance on transaction ${txRef}: Debit=${bal.debit}, Credit=${bal.credit}`
          );
        }
      }
    }
  } catch (err: unknown) {
    result.errors.push(err instanceof Error ? err.message : String(err));
  }

  return result;
}
