-- ============================================================================
-- ATITHI DEVO BHAVA (अतिथि देवो भवः)
-- Migration: 20261110000010_admin_moderation_analytics.sql
-- Description: Milestone 11 - Admin Moderation, User Suspension, Safety Triage,
--              ID Document Audit Logging, and Real Analytics Engine.
-- ============================================================================

-- 1. USER SUSPENSION: admin_suspend_user()
CREATE OR REPLACE FUNCTION admin_suspend_user(
  p_user_id UUID,
  p_admin_id UUID,
  p_reason TEXT,
  p_permanent BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  -- Mandate reason length
  IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
    RAISE EXCEPTION 'A detailed written reason of at least 5 characters is mandatory for moderation auditing.';
  END IF;

  -- Verify admin permissions
  SELECT admin_role INTO v_admin_role
  FROM admin_permissions
  WHERE user_id = p_admin_id;

  IF v_admin_role IS NULL OR v_admin_role NOT IN ('super_admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized: only super_admin or moderator can suspend users.';
  END IF;

  -- Permanent ban is restricted strictly to super_admin
  IF p_permanent AND v_admin_role != 'super_admin' THEN
    RAISE EXCEPTION 'Unauthorized: permanent bans require super_admin authorization.';
  END IF;

  -- Suspend user record
  UPDATE users
  SET is_suspended = TRUE,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Record in append-only admin_audit_logs
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    CASE WHEN p_permanent THEN 'PERMANENT_BAN_USER' ELSE 'SUSPEND_USER' END,
    'users',
    p_user_id,
    p_admin_id,
    p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. USER REACTIVATION: admin_reactivate_user()
CREATE OR REPLACE FUNCTION admin_reactivate_user(
  p_user_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
    RAISE EXCEPTION 'A detailed written reason of at least 5 characters is mandatory for reactivation.';
  END IF;

  SELECT admin_role INTO v_admin_role
  FROM admin_permissions
  WHERE user_id = p_admin_id;

  IF v_admin_role IS NULL OR v_admin_role NOT IN ('super_admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized: only super_admin or moderator can reactivate users.';
  END IF;

  UPDATE users
  SET is_suspended = FALSE,
      updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'REACTIVATE_USER',
    'users',
    p_user_id,
    p_admin_id,
    p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. ACCOMMODATION MODERATION: admin_moderate_accommodation()
CREATE OR REPLACE FUNCTION admin_moderate_accommodation(
  p_listing_id UUID,
  p_admin_id UUID,
  p_decision TEXT,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
  v_target_status TEXT;
  v_target_tier TEXT;
  v_host_id UUID;
  v_title TEXT;
BEGIN
  IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
    RAISE EXCEPTION 'A detailed written reason of at least 5 characters is mandatory for accommodation moderation.';
  END IF;

  SELECT admin_role INTO v_admin_role
  FROM admin_permissions
  WHERE user_id = p_admin_id;

  IF v_admin_role IS NULL OR v_admin_role NOT IN ('super_admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized: only super_admin or moderator can review accommodation listings.';
  END IF;

  SELECT host_id, title INTO v_host_id, v_title
  FROM accommodation_listings
  WHERE id = p_listing_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Accommodation listing not found.';
  END IF;

  CASE p_decision
    WHEN 'approve' THEN
      v_target_status := 'approved';
      v_target_tier := 'tier_2_stay_approved';
    WHEN 'reject' THEN
      v_target_status := 'rejected';
      v_target_tier := 'tier_1_day_only';
    WHEN 'request_changes' THEN
      v_target_status := 'pending_review';
      v_target_tier := 'tier_1_day_only';
    WHEN 'suspend' THEN
      v_target_status := 'suspended';
      v_target_tier := 'tier_1_day_only';
    ELSE
      RAISE EXCEPTION 'Invalid moderation decision: %', p_decision;
  END CASE;

  UPDATE accommodation_listings
  SET status = v_target_status,
      verification_tier = v_target_tier,
      updated_at = NOW()
  WHERE id = p_listing_id;

  -- Notify host
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_host_id,
    'accommodation_moderated',
    'Accommodation listing status updated',
    'Your listing "' || v_title || '" was set to ' || v_target_status || '. Reason: ' || p_reason,
    '/stays/' || p_listing_id
  );

  -- Log action
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'MODERATE_ACCOMMODATION_' || UPPER(p_decision),
    'accommodation_listings',
    p_listing_id,
    p_admin_id,
    p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. SAFETY REPORT TRIAGE: admin_triage_report()
CREATE OR REPLACE FUNCTION admin_triage_report(
  p_report_id UUID,
  p_admin_id UUID,
  p_action TEXT,
  p_notes TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
  v_report RECORD;
  v_new_status TEXT;
BEGIN
  IF p_notes IS NULL OR LENGTH(TRIM(p_notes)) < 5 THEN
    RAISE EXCEPTION 'Written resolution notes of at least 5 characters are required.';
  END IF;

  SELECT admin_role INTO v_admin_role
  FROM admin_permissions
  WHERE user_id = p_admin_id;

  IF v_admin_role IS NULL OR v_admin_role NOT IN ('super_admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized: only super_admin or moderator can triage reports.';
  END IF;

  SELECT * INTO v_report
  FROM reports
  WHERE id = p_report_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report record not found.';
  END IF;

  CASE p_action
    WHEN 'resolve' THEN v_new_status := 'resolved';
    WHEN 'dismiss' THEN v_new_status := 'dismissed';
    WHEN 'investigate' THEN v_new_status := 'investigating';
    WHEN 'suspend_user' THEN v_new_status := 'resolved';
    ELSE RAISE EXCEPTION 'Invalid triage action: %', p_action;
  END CASE;

  -- Update report status
  UPDATE reports
  SET status = v_new_status,
      resolution_notes = p_notes,
      reviewed_by = p_admin_id,
      reviewed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_report_id;

  -- If action involves suspending the reported user
  IF p_action = 'suspend_user' THEN
    PERFORM admin_suspend_user(
      v_report.reported_user_id,
      p_admin_id,
      'User suspended following investigation of report ' || p_report_id || ': ' || p_notes,
      FALSE
    );
  END IF;

  -- Audit log entry
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'TRIAGE_REPORT_' || UPPER(p_action),
    'reports',
    p_report_id,
    p_admin_id,
    p_notes
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. SECURE ID DOCUMENT VIEW AUDITING: admin_log_id_document_view()
-- Invariant: Every view of an identity verification document must be audit logged with a written justification.
CREATE OR REPLACE FUNCTION admin_log_id_document_view(
  p_verification_record_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
    RAISE EXCEPTION 'A mandatory written justification of at least 5 characters is required to view an identity document.';
  END IF;

  SELECT admin_role INTO v_admin_role
  FROM admin_permissions
  WHERE user_id = p_admin_id;

  IF v_admin_role IS NULL OR v_admin_role NOT IN ('super_admin', 'verification_reviewer') THEN
    RAISE EXCEPTION 'Unauthorized: only super_admin or verification_reviewer can view identity verification documents.';
  END IF;

  -- Log every single view event into append-only admin_audit_logs
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'VIEW_IDENTITY_DOCUMENT',
    'verification_records',
    p_verification_record_id,
    p_admin_id,
    p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. REAL ANALYTICS ENGINE: get_admin_metrics()
-- Computes real platform metrics directly from live tables. Zero mock data.
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS JSONB AS $$
DECLARE
  v_metrics JSONB;
  v_total_users INTEGER;
  v_travellers INTEGER;
  v_local_members INTEGER;
  v_experience_providers INTEGER;
  v_accommodation_hosts INTEGER;
  v_active_experiences INTEGER;
  v_active_stays INTEGER;
  v_pending_verifications INTEGER;
  v_pending_reports INTEGER;
  v_total_bookings INTEGER;
  v_confirmed_bookings INTEGER;
  v_gross_booking_paise BIGINT;
  v_platform_commission_paise BIGINT;
BEGIN
  -- Count total users
  SELECT COUNT(*) INTO v_total_users FROM users;

  -- Count users by role
  SELECT COUNT(DISTINCT user_id) INTO v_travellers FROM user_roles WHERE role = 'traveller';
  SELECT COUNT(DISTINCT user_id) INTO v_local_members FROM user_roles WHERE role = 'local_member';
  SELECT COUNT(DISTINCT user_id) INTO v_experience_providers FROM user_roles WHERE role = 'experience_provider';
  SELECT COUNT(DISTINCT user_id) INTO v_accommodation_hosts FROM user_roles WHERE role = 'accommodation_host';

  -- Count active listings
  SELECT COUNT(*) INTO v_active_experiences FROM experiences WHERE status = 'published';
  SELECT COUNT(*) INTO v_active_stays FROM accommodation_listings WHERE status = 'approved';

  -- Count pending queues
  SELECT COUNT(*) INTO v_pending_verifications FROM verification_records WHERE status = 'pending';
  SELECT COUNT(*) INTO v_pending_reports FROM reports WHERE status IN ('pending', 'investigating');

  -- Count bookings
  SELECT COUNT(*) INTO v_total_bookings FROM experience_bookings;
  SELECT COUNT(*) INTO v_confirmed_bookings FROM experience_bookings WHERE status = 'confirmed';

  -- Compute revenue directly from real captured payments
  SELECT COALESCE(SUM(amount_paise), 0) INTO v_gross_booking_paise
  FROM payments
  WHERE status = 'captured';

  -- Compute real platform commission revenue from ledger_entries
  SELECT COALESCE(SUM(credit_paise), 0) INTO v_platform_commission_paise
  FROM ledger_entries
  WHERE account_name = 'platform_commission';

  v_metrics := jsonb_build_object(
    'total_users', v_total_users,
    'users_by_role', jsonb_build_object(
      'travellers', v_travellers,
      'local_members', v_local_members,
      'experience_providers', v_experience_providers,
      'accommodation_hosts', v_accommodation_hosts
    ),
    'active_experiences', v_active_experiences,
    'active_stays', v_active_stays,
    'pending_verifications', v_pending_verifications,
    'pending_reports', v_pending_reports,
    'bookings', jsonb_build_object(
      'total', v_total_bookings,
      'confirmed', v_confirmed_bookings
    ),
    'financials', jsonb_build_object(
      'gross_booking_paise', v_gross_booking_paise,
      'platform_commission_paise', v_platform_commission_paise
    ),
    'generated_at', NOW()
  );

  RETURN v_metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
