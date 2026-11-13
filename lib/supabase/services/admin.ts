/**
 * Admin Database Service - Atithi Devo Bhava.
 * Aggregates real platform statistics, handles moderation, and logs immutable audit trails.
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";

export interface PlatformMetrics {
  totalUsers: number;
  totalHosts: number;
  totalListings: number;
  pendingHostApplications: number;
  pendingListingApprovals: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenueRupees: number;
  recentBookings: Array<{
    id: string;
    booking_code: string;
    total_amount_paise: number;
    status: string;
    created_at: string;
  }>;
}

/**
 * Fetch platform-wide metrics directly from Supabase tables.
 */
export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const supabase = getSupabaseAdmin();

  const [
    usersCount,
    hostsCount,
    listingsCount,
    pendingAppsCount,
    pendingListingsCount,
    bookingsCount,
    confirmedBookingsCount,
    cancelledBookingsCount,
    paymentsCount,
    failedPaymentsCount,
    recentBookingsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "host"),
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("host_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending_approval"),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "captured"),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "failed"),
    supabase
      .from("bookings")
      .select("id, booking_code, total_amount_paise, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Aggregate revenue from captured payments
  let totalRevenueRupees = 0;
  const { data: captured } = await supabase
    .from("payments")
    .select("amount_paise")
    .eq("status", "captured");

  if (captured && captured.length > 0) {
    const totalPaise = captured.reduce((sum, p) => sum + (p.amount_paise || 0), 0);
    totalRevenueRupees = Math.round(totalPaise / 100);
  }

  return {
    totalUsers: usersCount.count || 0,
    totalHosts: hostsCount.count || 0,
    totalListings: listingsCount.count || 0,
    pendingHostApplications: pendingAppsCount.count || 0,
    pendingListingApprovals: pendingListingsCount.count || 0,
    totalBookings: bookingsCount.count || 0,
    confirmedBookings: confirmedBookingsCount.count || 0,
    cancelledBookings: cancelledBookingsCount.count || 0,
    successfulPayments: paymentsCount.count || 0,
    failedPayments: failedPaymentsCount.count || 0,
    totalRevenueRupees,
    recentBookings: recentBookingsRes.data || [],
  };
}

/**
 * Record an immutable administrative activity log.
 */
export async function recordAdminAuditLog(
  action: string,
  targetEntity: string,
  targetId: string,
  performedBy: string,
  reason: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdmin();
  try {
    await supabase.from("admin_audit_logs").insert({
      action,
      target_entity: targetEntity,
      target_id: targetId,
      performed_by: performedBy,
      reason,
      metadata: metadata || null,
    });
  } catch (err) {
    console.warn("Failed to record admin audit log:", err);
  }
}

/**
 * Fetch recent admin audit logs.
 */
export async function getAdminAuditLogs(limit: number = 20) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select(`
      *,
      performer:profiles!performed_by (display_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

