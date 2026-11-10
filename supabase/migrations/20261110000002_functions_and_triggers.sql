-- ==============================================================================
-- Migration: 20261110000002_functions_and_triggers.sql
-- Description: Core database functions, triggers, immutability guards, and contact revelation engine.
-- Spec reference: Section 7, 9, 12, 20 of docs/SPEC.md
-- ==============================================================================

-- 1. IMMUTABLE AUDIT LOG TRIGGER
-- Prohibits UPDATE and DELETE operations on admin_audit_logs to guarantee tamper-proof audit trails.
CREATE OR REPLACE FUNCTION trg_prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security Violation: admin_audit_logs is an append-only table. UPDATE and DELETE operations are forbidden.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON admin_audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON admin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION trg_prevent_audit_log_mutation();

-- 2. CONTACT REVELATION ENGINE: can_reveal()
-- Single authoritative evaluation function governing all contact and address disclosures.
-- Rules:
-- 1. Evaluates mutual consent.
-- 2. Checks active blocking state (blocks immediately revoke revelation).
-- 3. Address is revealed to guest strictly 72 hours before scheduled start for accepted/confirmed bookings.
CREATE OR REPLACE FUNCTION can_reveal(
  p_connection_or_booking_id UUID,
  p_viewer_id UUID,
  p_field TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_connection BOOLEAN;
  v_other_user_id UUID;
  v_status TEXT;
  v_scheduled_time TIMESTAMPTZ;
  v_is_blocked BOOLEAN;
  v_mutual_consent_count INTEGER;
  v_field_consented BOOLEAN := FALSE;
BEGIN
  -- Check if this is a connection (Meet a Local)
  SELECT TRUE,
         CASE WHEN traveller_id = p_viewer_id THEN local_member_id ELSE traveller_id END,
         status,
         scheduled_at
  INTO v_is_connection, v_other_user_id, v_status, v_scheduled_time
  FROM connections
  WHERE id = p_connection_or_booking_id;

  -- If not a connection, check if it is an experience booking
  IF v_is_connection IS NULL THEN
    SELECT FALSE,
           CASE WHEN eb.traveller_id = p_viewer_id THEN exp.provider_id ELSE eb.traveller_id END,
           eb.status,
           es.start_time
    INTO v_is_connection, v_other_user_id, v_status, v_scheduled_time
    FROM experience_bookings eb
    JOIN experiences exp ON exp.id = eb.experience_id
    JOIN experience_schedules es ON es.id = eb.schedule_id
    WHERE eb.id = p_connection_or_booking_id;
  END IF;

  -- If entity not found or viewer is not a participant, deny access immediately
  IF v_other_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Immediate revocation check: if either user has blocked the other, reveal is DENIED
  SELECT EXISTS (
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = p_viewer_id AND blocked_id = v_other_user_id)
       OR (blocker_id = v_other_user_id AND blocked_id = p_viewer_id)
  ) INTO v_is_blocked;

  IF v_is_blocked THEN
    RETURN FALSE;
  END IF;

  -- Status check: reveals are only possible for ACCEPTED, SCHEDULED, or CONFIRMED interactions
  IF v_status NOT IN ('ACCEPTED', 'SCHEDULED', 'CONFIRMED') THEN
    RETURN FALSE;
  END IF;

  -- Mutual consent verification: both participants must have confirmed contact exchange
  SELECT COUNT(*)
  INTO v_mutual_consent_count
  FROM contact_exchanges
  WHERE (connection_id = p_connection_or_booking_id OR booking_id = p_connection_or_booking_id)
    AND confirmed_at IS NOT NULL;

  IF v_mutual_consent_count < 2 THEN
    RETURN FALSE;
  END IF;

  -- Check if target user has explicitly consented to share the requested field
  IF p_field = 'email' THEN
    SELECT share_email INTO v_field_consented
    FROM contact_exchanges
    WHERE (connection_id = p_connection_or_booking_id OR booking_id = p_connection_or_booking_id)
      AND user_id = v_other_user_id;
  ELSIF p_field = 'phone' THEN
    SELECT share_phone INTO v_field_consented
    FROM contact_exchanges
    WHERE (connection_id = p_connection_or_booking_id OR booking_id = p_connection_or_booking_id)
      AND user_id = v_other_user_id;
  ELSIF p_field = 'whatsapp' THEN
    SELECT share_whatsapp INTO v_field_consented
    FROM contact_exchanges
    WHERE (connection_id = p_connection_or_booking_id OR booking_id = p_connection_or_booking_id)
      AND user_id = v_other_user_id;
  ELSIF p_field = 'address' THEN
    -- Address rule: revealed strictly 72 hours before start time, and only if host consented to share address
    SELECT share_address INTO v_field_consented
    FROM contact_exchanges
    WHERE (connection_id = p_connection_or_booking_id OR booking_id = p_connection_or_booking_id)
      AND user_id = v_other_user_id;

    IF v_field_consented AND v_scheduled_time IS NOT NULL THEN
      -- Must be within 72 hours of scheduled start time
      IF NOW() >= (v_scheduled_time - INTERVAL '72 hours') AND NOW() <= (v_scheduled_time + INTERVAL '24 hours') THEN
        RETURN TRUE;
      ELSE
        RETURN FALSE;
      END IF;
    ELSE
      RETURN FALSE;
    END IF;
  END IF;

  RETURN COALESCE(v_field_consented, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ATOMIC BOOKING FUNCTION: book_experience()
-- Implements single-transaction capacity lock (SELECT FOR UPDATE) to prevent race conditions and double bookings.
CREATE OR REPLACE FUNCTION book_experience(
  p_schedule_id UUID,
  p_traveller_id UUID,
  p_participants INTEGER,
  p_idempotency_key TEXT
)
RETURNS UUID AS $$
DECLARE
  v_schedule RECORD;
  v_experience RECORD;
  v_booking_id UUID;
  v_total_price INTEGER;
  v_commission_rate NUMERIC(5, 2);
BEGIN
  -- Idempotency check: if booking with this key already exists, return existing ID
  SELECT id INTO v_booking_id
  FROM experience_bookings
  WHERE idempotency_key = p_idempotency_key;

  IF v_booking_id IS NOT NULL THEN
    RETURN v_booking_id;
  END IF;

  -- Lock schedule row FOR UPDATE to prevent concurrent race conditions
  SELECT * INTO v_schedule
  FROM experience_schedules
  WHERE id = p_schedule_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Schedule not found';
  END IF;

  -- Capacity verification
  IF (v_schedule.booked_count + p_participants) > v_schedule.capacity THEN
    RAISE EXCEPTION 'Capacity exceeded. Requested: %, Available: %',
      p_participants, (v_schedule.capacity - v_schedule.booked_count);
  END IF;

  -- Retrieve experience details for pricing snapshot
  SELECT * INTO v_experience
  FROM experiences
  WHERE id = v_schedule.experience_id;

  v_total_price := v_experience.price_per_person_paise * p_participants;

  -- Snapshot current platform commission rate
  SELECT COALESCE((value->>'rate_percent')::NUMERIC, 15.00)
  INTO v_commission_rate
  FROM platform_settings
  WHERE key = 'COMMISSION_RATE_EXPERIENCES';

  IF v_commission_rate IS NULL THEN
    v_commission_rate := 15.00;
  END IF;

  -- Increment booked count on schedule
  UPDATE experience_schedules
  SET booked_count = booked_count + p_participants
  WHERE id = p_schedule_id;

  -- Create booking record
  INSERT INTO experience_bookings (
    experience_id,
    schedule_id,
    traveller_id,
    participant_count,
    total_price_paise,
    commission_rate_snapshot,
    status,
    idempotency_key
  ) VALUES (
    v_experience.id,
    p_schedule_id,
    p_traveller_id,
    p_participants,
    v_total_price,
    v_commission_rate,
    'pending',
    p_idempotency_key
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. TWO-REPORT AUTO DE-INDEXING TRIGGER
-- If an account receives 2 urgent reports from different users, automatically hide from search results
CREATE OR REPLACE FUNCTION trg_check_urgent_reports()
RETURNS TRIGGER AS $$
DECLARE
  v_distinct_urgent_reporters INTEGER;
BEGIN
  IF NEW.is_urgent THEN
    SELECT COUNT(DISTINCT reporter_id)
    INTO v_distinct_urgent_reporters
    FROM reports
    WHERE reported_user_id = NEW.reported_user_id
      AND is_urgent = TRUE
      AND status IN ('pending', 'investigating');

    IF v_distinct_urgent_reporters >= 2 THEN
      -- Temporarily set profile visibility to members_only and record audit log
      UPDATE local_member_profiles
      SET visibility = 'members_only'
      WHERE user_id = NEW.reported_user_id;

      INSERT INTO admin_audit_logs (
        action,
        target_entity,
        target_id,
        performed_by,
        reason,
        metadata
      ) VALUES (
        'AUTO_DEINDEX_DUE_TO_REPORTS',
        'users',
        NEW.reported_user_id,
        NEW.reported_user_id,
        'Account de-indexed from public search following 2 independent urgent safety reports.',
        jsonb_build_object('trigger_report_id', NEW.id, 'distinct_reporters', v_distinct_urgent_reporters)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_urgent_reports_deindex ON reports;
CREATE TRIGGER trg_urgent_reports_deindex
AFTER INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION trg_check_urgent_reports();
