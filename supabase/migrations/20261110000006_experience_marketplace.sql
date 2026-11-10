-- ==============================================================================
-- Migration: 20261110000006_experience_marketplace.sql
-- Description: Experience marketplace, enquiry lifecycle, and admin moderation.
-- Spec reference: Section 3, 4, 7, 20, 23 of docs/SPEC.md
-- ==============================================================================

-- 1. EXPERIENCE MODERATION FUNCTION: moderate_experience()
-- Allows admins with moderator, content, or super_admin permissions to approve,
-- request changes, reject, or suspend an experience listing with mandatory audit logging.
CREATE OR REPLACE FUNCTION moderate_experience(
  p_experience_id UUID,
  p_admin_id UUID,
  p_decision TEXT,
  p_reason TEXT,
  p_feedback TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_old_status TEXT;
  v_new_status TEXT;
  v_provider_id UUID;
  v_title TEXT;
  v_has_permission BOOLEAN;
BEGIN
  -- Permission check
  SELECT EXISTS (
    SELECT 1 FROM admin_permissions
    WHERE admin_id = p_admin_id
      AND role IN ('super_admin', 'moderator', 'content')
  ) INTO v_has_permission;

  IF NOT v_has_permission THEN
    RAISE EXCEPTION 'Unauthorized: User lacks experience moderation permissions';
  END IF;

  -- Validate decision
  IF p_decision = 'approve' THEN
    v_new_status := 'published';
  ELSIF p_decision = 'request_changes' THEN
    v_new_status := 'changes_requested';
  ELSIF p_decision = 'reject' THEN
    v_new_status := 'rejected';
  ELSIF p_decision = 'suspend' THEN
    v_new_status := 'suspended';
  ELSE
    RAISE EXCEPTION 'Invalid moderation decision: %', p_decision;
  END IF;

  -- Require reason for rejections, suspensions, and changes requested
  IF p_decision IN ('reject', 'suspend', 'request_changes') AND (p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5) THEN
    RAISE EXCEPTION 'A clear reason (at least 5 characters) is mandatory for this moderation decision';
  END IF;

  -- Retrieve current experience status and provider
  SELECT status, provider_id, title_en
  INTO v_old_status, v_provider_id, v_title
  FROM experiences
  WHERE id = p_experience_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Experience not found: %', p_experience_id;
  END IF;

  -- Update experience status
  UPDATE experiences
  SET
    status = v_new_status,
    updated_at = NOW()
  WHERE id = p_experience_id;

  -- Insert mandatory append-only audit log
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_admin_id,
    'experience_moderated',
    'experience',
    p_experience_id,
    jsonb_build_object(
      'previous_status', v_old_status,
      'new_status', v_new_status,
      'decision', p_decision,
      'reason', p_reason,
      'feedback', p_feedback,
      'provider_id', v_provider_id,
      'title', v_title
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. EXPERIENCE SUBMISSION FUNCTION: submit_experience_for_review()
-- Provider submits a draft or revised experience for admin moderation.
CREATE OR REPLACE FUNCTION submit_experience_for_review(
  p_experience_id UUID,
  p_provider_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_exp RECORD;
BEGIN
  SELECT * INTO v_exp
  FROM experiences
  WHERE id = p_experience_id AND provider_id = p_provider_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Experience not found or user is not the owner';
  END IF;

  IF v_exp.status NOT IN ('draft', 'changes_requested') THEN
    RAISE EXCEPTION 'Only experiences in draft or changes_requested status can be submitted for review. Current status: %', v_exp.status;
  END IF;

  -- Completeness checks
  IF LENGTH(TRIM(v_exp.title_en)) < 5 THEN
    RAISE EXCEPTION 'Experience title must be at least 5 characters';
  END IF;

  IF LENGTH(TRIM(v_exp.description_en)) < 50 THEN
    RAISE EXCEPTION 'Experience description must be at least 50 characters';
  END IF;

  IF LENGTH(TRIM(v_exp.general_meeting_area)) < 5 THEN
    RAISE EXCEPTION 'A general public meeting area must be specified';
  END IF;

  IF v_exp.duration_minutes <= 0 THEN
    RAISE EXCEPTION 'Duration must be greater than zero';
  END IF;

  IF v_exp.min_participants > v_exp.max_participants THEN
    RAISE EXCEPTION 'Minimum participants cannot exceed maximum participants';
  END IF;

  -- Transition status
  UPDATE experiences
  SET
    status = 'pending_review',
    updated_at = NOW()
  WHERE id = p_experience_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. SUBMIT EXPERIENCE ENQUIRY: submit_experience_enquiry()
-- Implements Phase 1 Enquiry submission, creating an enquiry booking record and linked conversation.
CREATE OR REPLACE FUNCTION submit_experience_enquiry(
  p_experience_id UUID,
  p_schedule_id UUID,
  p_traveller_id UUID,
  p_participant_count INTEGER,
  p_message TEXT,
  p_idempotency_key TEXT
)
RETURNS UUID AS $$
DECLARE
  v_exp RECORD;
  v_schedule RECORD;
  v_booking_id UUID;
  v_conversation_id UUID;
  v_payments_enabled BOOLEAN;
  v_total_price INTEGER := 0;
BEGIN
  -- Idempotency check
  SELECT id INTO v_booking_id
  FROM experience_bookings
  WHERE idempotency_key = p_idempotency_key;

  IF v_booking_id IS NOT NULL THEN
    RETURN v_booking_id;
  END IF;

  -- Verify experience is published
  SELECT * INTO v_exp
  FROM experiences
  WHERE id = p_experience_id;

  IF NOT FOUND OR v_exp.status != 'published' THEN
    RAISE EXCEPTION 'Experience is not currently available for enquiries';
  END IF;

  -- Cannot enquire on own experience
  IF v_exp.provider_id = p_traveller_id THEN
    RAISE EXCEPTION 'Providers cannot submit enquiries on their own experiences';
  END IF;

  -- Validate participant count
  IF p_participant_count < v_exp.min_participants OR p_participant_count > v_exp.max_participants THEN
    RAISE EXCEPTION 'Participant count must be between % and %', v_exp.min_participants, v_exp.max_participants;
  END IF;

  -- Validate message
  IF LENGTH(TRIM(p_message)) < 20 THEN
    RAISE EXCEPTION 'Enquiry message must be at least 20 characters';
  END IF;

  -- Check if payments are enabled (Phase 2)
  SELECT COALESCE((value->>'enabled')::BOOLEAN, FALSE)
  INTO v_payments_enabled
  FROM platform_settings
  WHERE key = 'PAYMENTS_ENABLED';

  IF v_payments_enabled THEN
    v_total_price := v_exp.price_per_person_paise * p_participant_count;
  ELSE
    -- Phase 1 enquiry mode: zero price recorded
    v_total_price := 0;
  END IF;

  -- Verify or lock schedule if provided
  IF p_schedule_id IS NOT NULL THEN
    SELECT * INTO v_schedule
    FROM experience_schedules
    WHERE id = p_schedule_id AND experience_id = p_experience_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Specified schedule slot was not found';
    END IF;

    IF (v_schedule.booked_count + p_participant_count) > v_schedule.capacity THEN
      RAISE EXCEPTION 'Requested party size exceeds remaining capacity for this schedule';
    END IF;
  END IF;

  -- Insert booking record in pending status
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
    p_experience_id,
    p_schedule_id,
    p_traveller_id,
    p_participant_count,
    v_total_price,
    15.00,
    'pending',
    p_idempotency_key
  )
  RETURNING id INTO v_booking_id;

  -- Check or create conversation channel between traveller and provider
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE booking_id = v_booking_id;

  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (
      booking_id,
      created_at
    ) VALUES (
      v_booking_id,
      NOW()
    )
    RETURNING id INTO v_conversation_id;

    -- Add participants
    INSERT INTO conversation_participants (conversation_id, user_id, role)
    VALUES
      (v_conversation_id, p_traveller_id, 'traveller'),
      (v_conversation_id, v_exp.provider_id, 'provider');

    -- Insert initial enquiry message
    INSERT INTO messages (
      conversation_id,
      sender_id,
      content,
      created_at
    ) VALUES (
      v_conversation_id,
      p_traveller_id,
      p_message,
      NOW()
    );
  END IF;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RESPOND TO EXPERIENCE ENQUIRY: respond_to_experience_enquiry()
-- Provider accepts or declines an incoming enquiry.
CREATE OR REPLACE FUNCTION respond_to_experience_enquiry(
  p_booking_id UUID,
  p_provider_id UUID,
  p_decision TEXT,
  p_response_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_booking RECORD;
  v_exp RECORD;
  v_conversation_id UUID;
BEGIN
  SELECT b.* INTO v_booking
  FROM experience_bookings b
  JOIN experiences e ON e.id = b.experience_id
  WHERE b.id = p_booking_id AND e.provider_id = p_provider_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enquiry not found or user is not the host provider';
  END IF;

  IF v_booking.status != 'pending' THEN
    RAISE EXCEPTION 'Only pending enquiries can be answered. Current status: %', v_booking.status;
  END IF;

  SELECT * INTO v_exp FROM experiences WHERE id = v_booking.experience_id;

  IF p_decision = 'accept' THEN
    -- Transition to accepted
    UPDATE experience_bookings
    SET
      status = 'accepted',
      updated_at = NOW()
    WHERE id = p_booking_id;

    -- Update schedule capacity if schedule was bound
    IF v_booking.schedule_id IS NOT NULL THEN
      UPDATE experience_schedules
      SET booked_count = booked_count + v_booking.participant_count
      WHERE id = v_booking.schedule_id;
    END IF;

  ELSIF p_decision = 'decline' THEN
    -- Transition to cancelled
    UPDATE experience_bookings
    SET
      status = 'cancelled',
      updated_at = NOW()
    WHERE id = p_booking_id;

  ELSE
    RAISE EXCEPTION 'Invalid decision: %. Must be accept or decline', p_decision;
  END IF;

  -- If a response message was provided, append it to the conversation
  IF p_response_message IS NOT NULL AND LENGTH(TRIM(p_response_message)) > 0 THEN
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE booking_id = p_booking_id;

    IF v_conversation_id IS NOT NULL THEN
      INSERT INTO messages (
        conversation_id,
        sender_id,
        content,
        created_at
      ) VALUES (
        v_conversation_id,
        p_provider_id,
        p_response_message,
        NOW()
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
