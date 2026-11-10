-- ============================================================================
-- ATITHI DEVO BHAVA (अतिथि देवो भवः)
-- Migration: 20261110000008_booking_and_payments.sql
-- Description: Milestone 9 - Booking Engine, Concurrency Protection,
--              Commission Snapshots, Payment Provider Tracking, Double-Entry
--              Accounting Ledger, and Capacity-Restoring Cancellation.
-- ============================================================================

-- 1. ENHANCED ATOMIC BOOKING FUNCTION: book_experience()
-- Implements single-transaction capacity lock (SELECT FOR UPDATE) to prevent race conditions and overbooking.
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
  v_payments_enabled BOOLEAN;
  v_initial_status TEXT;
  v_conversation_id UUID;
BEGIN
  -- 1. Idempotency check: if booking with this key already exists, return existing ID
  SELECT id INTO v_booking_id
  FROM experience_bookings
  WHERE idempotency_key = p_idempotency_key;

  IF v_booking_id IS NOT NULL THEN
    RETURN v_booking_id;
  END IF;

  -- 2. Participant count validation
  IF p_participants <= 0 THEN
    RAISE EXCEPTION 'Participant count must be at least 1';
  END IF;

  -- 3. Lock schedule row FOR UPDATE to prevent concurrent race conditions
  SELECT * INTO v_schedule
  FROM experience_schedules
  WHERE id = p_schedule_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Schedule not found';
  END IF;

  -- 4. Verify schedule is active and in future
  IF v_schedule.start_time <= NOW() THEN
    RAISE EXCEPTION 'Cannot book a schedule slot that is in the past';
  END IF;

  -- 5. Capacity verification
  IF (v_schedule.booked_count + p_participants) > v_schedule.capacity THEN
    RAISE EXCEPTION 'Capacity exceeded. Requested: %, Available: %',
      p_participants, (v_schedule.capacity - v_schedule.booked_count);
  END IF;

  -- 6. Retrieve experience details for pricing snapshot and participant limits
  SELECT * INTO v_experience
  FROM experiences
  WHERE id = v_schedule.experience_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Experience not found';
  END IF;

  IF v_experience.status != 'published' THEN
    RAISE EXCEPTION 'Experience is not currently published';
  END IF;

  -- Enforce minimum and maximum group size limits
  IF p_participants < v_experience.min_participants THEN
    RAISE EXCEPTION 'Participant count % is below minimum required %',
      p_participants, v_experience.min_participants;
  END IF;

  IF p_participants > v_experience.max_participants THEN
    RAISE EXCEPTION 'Participant count % exceeds maximum allowed %',
      p_participants, v_experience.max_participants;
  END IF;

  -- Prevent self-booking by the provider
  IF v_experience.provider_id = p_traveller_id THEN
    RAISE EXCEPTION 'Providers cannot book their own experiences';
  END IF;

  -- 7. Snapshot pricing
  v_total_price := v_experience.price_per_person_paise * p_participants;

  -- Snapshot current platform commission rate (default 15.00%)
  SELECT COALESCE((value->>'rate_percent')::NUMERIC, 15.00)
  INTO v_commission_rate
  FROM platform_settings
  WHERE key = 'COMMISSION_RATE_EXPERIENCES';

  IF v_commission_rate IS NULL THEN
    v_commission_rate := 15.00;
  END IF;

  -- 8. Check PAYMENTS_ENABLED feature flag to determine initial booking status
  SELECT COALESCE((value->>'enabled')::BOOLEAN, FALSE)
  INTO v_payments_enabled
  FROM platform_settings
  WHERE key = 'PAYMENTS_ENABLED';

  IF v_payments_enabled IS TRUE THEN
    v_initial_status := 'payment_pending';
  ELSE
    v_initial_status := 'pending';
  END IF;

  -- 9. Increment booked count atomically on locked schedule row
  UPDATE experience_schedules
  SET booked_count = booked_count + p_participants,
      updated_at = NOW()
  WHERE id = p_schedule_id;

  -- 10. Create booking record
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
    v_initial_status,
    p_idempotency_key
  )
  RETURNING id INTO v_booking_id;

  -- 11. Find or create linked conversation between traveller and provider
  SELECT c.id INTO v_conversation_id
  FROM conversations c
  JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = p_traveller_id
  JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = v_experience.provider_id
  LIMIT 1;

  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (status)
    VALUES ('active')
    RETURNING id INTO v_conversation_id;

    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES
      (v_conversation_id, p_traveller_id),
      (v_conversation_id, v_experience.provider_id);
  END IF;

  -- 12. Notify provider of new booking
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_experience.provider_id,
    'booking_created',
    'New experience booking received',
    'A traveller has requested ' || p_participants || ' participant slot(s) for ' || v_experience.title_en || '.',
    '/dashboard/experiences'
  );

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. CAPACITY-RESTORING CANCELLATION FUNCTION: cancel_booking()
CREATE OR REPLACE FUNCTION cancel_booking(
  p_booking_id UUID,
  p_cancelled_by UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_booking RECORD;
  v_experience RECORD;
  v_other_user_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  -- Lock booking row FOR UPDATE
  SELECT * INTO v_booking
  FROM experience_bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  -- Check if caller is traveller, provider, or admin
  SELECT * INTO v_experience
  FROM experiences
  WHERE id = v_booking.experience_id;

  SELECT EXISTS (
    SELECT 1 FROM admin_permissions
    WHERE user_id = p_cancelled_by
      AND admin_role IN ('super_admin', 'moderator')
  ) INTO v_is_admin;

  IF p_cancelled_by != v_booking.traveller_id
     AND p_cancelled_by != v_experience.provider_id
     AND NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized to cancel this booking';
  END IF;

  -- Check current status permits cancellation
  IF v_booking.status IN ('completed', 'cancelled', 'refunded') THEN
    RAISE EXCEPTION 'Booking cannot be cancelled in its current status: %', v_booking.status;
  END IF;

  -- Restore capacity on schedule
  UPDATE experience_schedules
  SET booked_count = GREATEST(0, booked_count - v_booking.participant_count),
      updated_at = NOW()
  WHERE id = v_booking.schedule_id;

  -- Update booking status
  UPDATE experience_bookings
  SET status = 'cancelled',
      updated_at = NOW()
  WHERE id = p_booking_id;

  -- Identify counterpart user to notify
  IF p_cancelled_by = v_booking.traveller_id THEN
    v_other_user_id := v_experience.provider_id;
  ELSE
    v_other_user_id := v_booking.traveller_id;
  END IF;

  -- Send notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_other_user_id,
    'booking_cancelled',
    'Booking cancelled',
    'A booking for ' || v_experience.title_en || ' was cancelled. Reason: ' || COALESCE(p_reason, 'No reason provided') || '.',
    '/bookings/' || p_booking_id
  );

  -- Audit log entry
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'CANCEL_BOOKING',
    'experience_bookings',
    p_booking_id,
    p_cancelled_by,
    COALESCE(p_reason, 'Booking cancelled by participant')
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. PAYMENT CAPTURE AND DOUBLE-ENTRY ACCOUNTING LEDGER: record_payment_capture()
CREATE OR REPLACE FUNCTION record_payment_capture(
  p_booking_id UUID,
  p_payment_order_id TEXT,
  p_payment_id TEXT,
  p_amount_paise INTEGER,
  p_provider TEXT DEFAULT 'razorpay'
)
RETURNS UUID AS $$
DECLARE
  v_booking RECORD;
  v_experience RECORD;
  v_commission_amount INTEGER;
  v_host_amount INTEGER;
  v_payment_record_id UUID;
BEGIN
  -- Lock booking row
  SELECT * INTO v_booking
  FROM experience_bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  SELECT * INTO v_experience
  FROM experiences
  WHERE id = v_booking.experience_id;

  -- Calculate exact commission and host payout
  -- Using commission_rate_snapshot captured on the booking row
  v_commission_amount := ROUND(p_amount_paise * (v_booking.commission_rate_snapshot / 100.0));
  v_host_amount := p_amount_paise - v_commission_amount;

  -- Insert or update payments record
  INSERT INTO payments (
    booking_id,
    amount_paise,
    currency,
    payment_order_id,
    payment_id,
    provider,
    status
  ) VALUES (
    p_booking_id,
    p_amount_paise,
    'INR',
    p_payment_order_id,
    p_payment_id,
    p_provider,
    'captured'
  )
  ON CONFLICT (payment_order_id) DO UPDATE
  SET payment_id = EXCLUDED.payment_id,
      status = 'captured',
      updated_at = NOW()
  RETURNING id INTO v_payment_record_id;

  -- Confirm booking
  UPDATE experience_bookings
  SET status = 'confirmed',
      updated_at = NOW()
  WHERE id = p_booking_id;

  -- 4. Balanced Double-Entry Accounting Ledger Entries
  -- Invariant: Sum of debit_paise MUST exactly equal Sum of credit_paise
  -- Line 1: Debit traveller receivable (incoming funds)
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    p_payment_id,
    'traveller_funds',
    p_amount_paise,
    0,
    p_booking_id,
    v_booking.traveller_id
  );

  -- Line 2: Credit host payable (net earnings held for host payout)
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    p_payment_id,
    'host_payable',
    0,
    v_host_amount,
    p_booking_id,
    v_experience.provider_id
  );

  -- Line 3: Credit platform commission revenue
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    p_payment_id,
    'platform_commission',
    0,
    v_commission_amount,
    p_booking_id,
    NULL
  );

  -- Notify both parties
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_booking.traveller_id,
    'payment_confirmed',
    'Payment confirmed',
    'Your booking for ' || v_experience.title_en || ' is confirmed.',
    '/bookings/' || p_booking_id
  ), (
    v_experience.provider_id,
    'booking_confirmed',
    'Booking confirmed and paid',
    'A booking of INR ' || (p_amount_paise / 100) || ' for ' || v_experience.title_en || ' is confirmed.',
    '/dashboard/experiences'
  );

  RETURN v_payment_record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. PAYMENT REFUND AND REVERSING LEDGER: record_payment_refund()
CREATE OR REPLACE FUNCTION record_payment_refund(
  p_payment_id UUID,
  p_reason TEXT
)
RETURNS UUID AS $$
DECLARE
  v_payment RECORD;
  v_booking RECORD;
  v_experience RECORD;
  v_commission_amount INTEGER;
  v_host_amount INTEGER;
  v_refund_id UUID;
BEGIN
  SELECT * INTO v_payment
  FROM payments
  WHERE id = p_payment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment record not found';
  END IF;

  IF v_payment.status = 'refunded' THEN
    RAISE EXCEPTION 'Payment is already refunded';
  END IF;

  SELECT * INTO v_booking
  FROM experience_bookings
  WHERE id = v_payment.booking_id
  FOR UPDATE;

  SELECT * INTO v_experience
  FROM experiences
  WHERE id = v_booking.experience_id;

  v_commission_amount := ROUND(v_payment.amount_paise * (v_booking.commission_rate_snapshot / 100.0));
  v_host_amount := v_payment.amount_paise - v_commission_amount;

  -- Create refund record
  INSERT INTO refunds (
    payment_id,
    amount_paise,
    reason,
    status
  ) VALUES (
    p_payment_id,
    v_payment.amount_paise,
    p_reason,
    'completed'
  )
  RETURNING id INTO v_refund_id;

  -- Update payment status
  UPDATE payments
  SET status = 'refunded',
      updated_at = NOW()
  WHERE id = p_payment_id;

  -- Update booking status and restore schedule capacity
  UPDATE experience_bookings
  SET status = 'refunded',
      updated_at = NOW()
  WHERE id = v_payment.booking_id;

  UPDATE experience_schedules
  SET booked_count = GREATEST(0, booked_count - v_booking.participant_count),
      updated_at = NOW()
  WHERE id = v_booking.schedule_id;

  -- Reversing balanced double-entry accounting ledger entries
  -- Line 1: Credit traveller funds (outgoing refund)
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    'REFUND_' || v_refund_id,
    'traveller_funds',
    0,
    v_payment.amount_paise,
    v_booking.id,
    v_booking.traveller_id
  );

  -- Line 2: Debit host payable (reversing host credit)
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    'REFUND_' || v_refund_id,
    'host_payable',
    v_host_amount,
    0,
    v_booking.id,
    v_experience.provider_id
  );

  -- Line 3: Debit platform commission (reversing platform revenue)
  INSERT INTO ledger_entries (
    transaction_ref,
    account_name,
    debit_paise,
    credit_paise,
    booking_id,
    user_id
  ) VALUES (
    'REFUND_' || v_refund_id,
    'platform_commission',
    v_commission_amount,
    0,
    v_booking.id,
    NULL
  );

  RETURN v_refund_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. WEBHOOK IDEMPOTENCY RECORDING: record_payment_webhook()
CREATE OR REPLACE FUNCTION record_payment_webhook(
  p_provider TEXT,
  p_event_id TEXT,
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  v_inserted_id UUID;
BEGIN
  INSERT INTO payment_webhook_events (
    provider,
    event_id,
    event_type,
    payload,
    processed_at
  ) VALUES (
    p_provider,
    p_event_id,
    p_event_type,
    p_payload,
    NOW()
  )
  ON CONFLICT (event_id) DO NOTHING
  RETURNING id INTO v_inserted_id;

  -- Returns TRUE if this is a newly recorded event, FALSE if it was already processed (duplicate)
  RETURN (v_inserted_id IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

