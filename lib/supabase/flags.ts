import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";

export type FeatureFlagKey =
  | "PRICES_VISIBLE"
  | "PAYMENTS_ENABLED"
  | "STAYS_ENABLED"
  | "MACHINE_TRANSLATION_ENABLED"
  | "GUEST_DOCUMENT_NUMBERS_ENABLED";

export interface FeatureFlagValue {
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Reads the current state of a platform feature flag from platform_settings.
 * Defaults safely to false if not found or if database query fails.
 */
export async function getFeatureFlag(key: FeatureFlagKey): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return false;
    }

    const flagVal = data.value as FeatureFlagValue | null;
    return Boolean(flagVal?.enabled);
  } catch {
    // Fail closed: if check fails, feature remains disabled
    return false;
  }
}

/**
 * Updates a platform feature flag.
 * Security Invariant: Super Admin role and mandatory written reason required.
 * Automatically records an append-only row in admin_audit_logs.
 */
export async function setFeatureFlag(
  key: FeatureFlagKey,
  enabled: boolean,
  updatedByUserId: string,
  reason: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
  if (!reason || reason.trim().length < 10) {
    return {
      success: false,
      error: "A detailed written reason of at least 10 characters is mandatory for auditing.",
    };
  }

  const adminClient = createAdminClient();

  // Verify that the updating user holds super_admin permission
  const { data: perm, error: permErr } = await adminClient
    .from("admin_permissions")
    .select("admin_role")
    .eq("user_id", updatedByUserId)
    .eq("admin_role", "super_admin")
    .single();

  if (permErr || !perm) {
    return {
      success: false,
      error: "Authorization Error: Only super_admin can modify platform feature flags.",
    };
  }

  // Update platform_settings
  const { error: updateErr } = await adminClient
    .from("platform_settings")
    .upsert({
      key,
      value: { enabled },
      updated_by: updatedByUserId,
      updated_at: new Date().toISOString(),
    });

  if (updateErr) {
    return {
      success: false,
      error: `Database error updating flag: ${updateErr.message}`,
    };
  }

  // Log to immutable admin_audit_logs
  await adminClient.from("admin_audit_logs").insert({
    action: "UPDATE_FEATURE_FLAG",
    target_entity: "platform_settings",
    performed_by: updatedByUserId,
    reason,
    ip_address: ipAddress ?? null,
    metadata: { flag_key: key, new_state: enabled },
  });

  return { success: true };
}
