-- ==============================================================================
-- Migration: 20261110000007_messaging_reviews_safety.sql
-- Description: Realtime messaging, blind reviews, safety reporting, blocks, check-ins, trip share.
-- Spec reference: Section 9, 10, 11, 12, 19, 20 of docs/SPEC.md
-- ==============================================================================

-- 1. SEND MESSAGE FUNCTION: send_message()
-- Realtime messaging function enforcing RLS, block restrictions, 1000-char limits,
-- and contact sharing advisory detection.
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id UUID,
  p_sender_id UUID,
  p_body TEXT
)
RETURNS UUID AS $$
DECLARE
  v_conv RECORD;
  v_recipient_id UUID;
  v_message_id UUID;
  v_has_contact_pattern BOOLEAN := FALSE;
  v_msg_count INTEGER;
BEGIN
  -- Verify conversation existence and status
  SELECT * INTO v_conv
  FROM conversations
  WHERE id = p_conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  IF NOT v_conv.is_active OR v_conv.is_read_only THEN
    RAISE EXCEPTION 'This conversation is closed and no longer accepting new messages';
  END IF;

  -- Verify sender is a conversation participant
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_sender_id
  ) THEN
    RAISE EXCEPTION 'Sender is not an authorized participant in this conversation';
  END IF;

  -- Determine other participant
  SELECT user_id INTO v_recipient_id
  FROM conversation_participants
  WHERE conversation_id = p_conversation_id AND user_id != p_sender_id
  LIMIT 1;

  -- Check if blocked
  IF v_recipient_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM blocked_users
      WHERE (blocker_id = p_sender_id AND blocked_id = v_recipient_id)
         OR (blocker_id = v_recipient_id AND blocked_id = p_sender_id)
    ) THEN
      RAISE EXCEPTION 'Messaging is unavailable due to an active user block';
    END IF;
  END IF;

  -- Body length validation
  IF LENGTH(TRIM(p_body)) < 1 OR LENGTH(p_body) > 1000 THEN
    RAISE EXCEPTION 'Message body must be between 1 and 1000 characters';
  END IF;

  -- Rate limit: maximum 20 messages per minute from the same sender
  SELECT COUNT(*) INTO v_msg_count
  FROM messages
  WHERE sender_id = p_sender_id
    AND created_at >= (NOW() - INTERVAL '1 minute');

  IF v_msg_count >= 20 THEN
    RAISE EXCEPTION 'Rate limit exceeded: You may send at most 20 messages per minute';
  END IF;

  -- Soft contact detection pattern (email or 10-digit Indian mobile number)
  IF p_body ~* '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
     OR p_body ~* '(\+91[\-\s]?)?[6-9]\d{9}' THEN
    v_has_contact_pattern := TRUE;
  END IF;

  -- Insert message
  INSERT INTO messages (
    conversation_id,
    sender_id,
    body,
    is_plain_text_only,
    contains_contact_warning,
    created_at
  ) VALUES (
    p_conversation_id,
    p_sender_id,
    p_body,
    TRUE,
    v_has_contact_pattern,
    NOW()
  )
  RETURNING id INTO v_message_id;

  -- Update conversation timestamp
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = p_conversation_id;

  -- In-app notification for recipient
  IF v_recipient_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      body,
      link_url,
      created_at
    ) VALUES (
      v_recipient_id,
      'new_message',
      'New message received',
      SUBSTRING(p_body FROM 1 FOR 80),
      '/messages/' || p_conversation_id::TEXT,
      NOW()
    );
  END IF;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. BLOCK USER FUNCTION: block_user()
-- Blocks user, immediately closes all shared conversations, and logs the action.
CREATE OR REPLACE FUNCTION block_user(
  p_blocker_id UUID,
  p_blocked_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF p_blocker_id = p_blocked_id THEN
    RAISE EXCEPTION 'Cannot block oneself';
  END IF;

  -- Insert into blocked_users
  INSERT INTO blocked_users (
    blocker_id,
    blocked_id,
    reason,
    created_at
  ) VALUES (
    p_blocker_id,
    p_blocked_id,
    p_reason,
    NOW()
  )
  ON CONFLICT (blocker_id, blocked_id) DO NOTHING;

  -- Close all mutual conversations
  UPDATE conversations
  SET
    is_active = FALSE,
    is_read_only = TRUE,
    closed_at = NOW(),
    updated_at = NOW()
  WHERE id IN (
    SELECT cp1.conversation_id
    FROM conversation_participants cp1
    JOIN conversation_participants cp2 ON cp2.conversation_id = cp1.conversation_id
    WHERE cp1.user_id = p_blocker_id AND cp2.user_id = p_blocked_id
  );

  -- Log action
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_blocker_id,
    'user_blocked',
    'user',
    p_blocked_id,
    jsonb_build_object(
      'blocker_id', p_blocker_id,
      'blocked_id', p_blocked_id,
      'reason', p_reason
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE SAFETY REPORT FUNCTION: create_safety_report()
-- Creates safety incident report. If conversation_id is provided, automatically captures
-- the last 20 messages into snapshot_messages for moderator investigation.
CREATE OR REPLACE FUNCTION create_safety_report(
  p_reporter_id UUID,
  p_reported_user_id UUID,
  p_reason TEXT,
  p_details TEXT,
  p_target_entity TEXT,
  p_target_id UUID DEFAULT NULL,
  p_conversation_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_is_urgent BOOLEAN := FALSE;
  v_report_id UUID;
  v_snapshot JSONB := NULL;
BEGIN
  -- Validate reason
  IF p_reason NOT IN (
    'harassment',
    'unsafe_or_threatening',
    'asked_for_money',
    'fake_profile',
    'discrimination',
    'inappropriate_sexual_content',
    'suspected_trafficking_or_exploitation',
    'other'
  ) THEN
    RAISE EXCEPTION 'Invalid report reason: %', p_reason;
  END IF;

  -- Mark urgency
  IF p_reason IN ('unsafe_or_threatening', 'suspected_trafficking_or_exploitation', 'harassment') THEN
    v_is_urgent := TRUE;
  END IF;

  -- Capture snapshot of last 20 messages if conversation is provided
  IF p_conversation_id IS NOT NULL THEN
    SELECT jsonb_agg(m_row) INTO v_snapshot
    FROM (
      SELECT id, sender_id, body, created_at
      FROM messages
      WHERE conversation_id = p_conversation_id
      ORDER BY created_at DESC
      LIMIT 20
    ) m_row;
  END IF;

  -- Insert report
  INSERT INTO reports (
    reporter_id,
    reported_user_id,
    target_entity,
    target_id,
    reason,
    is_urgent,
    details,
    snapshot_messages,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_reporter_id,
    p_reported_user_id,
    p_target_entity,
    p_target_id,
    p_reason,
    v_is_urgent,
    p_details,
    v_snapshot,
    'pending',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_report_id;

  -- Audit log
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_reporter_id,
    'safety_report_filed',
    'user',
    p_reported_user_id,
    jsonb_build_object(
      'report_id', v_report_id,
      'reason', p_reason,
      'is_urgent', v_is_urgent,
      'target_entity', p_target_entity
    )
  );

  RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. SUBMIT BLIND REVIEW FUNCTION: submit_blind_review()
-- Enforces 14-day completion window. Both reviews remain unpublished until
-- either both parties have submitted or the 14-day window expires.
CREATE OR REPLACE FUNCTION submit_blind_review(
  p_reviewer_id UUID,
  p_connection_id UUID,
  p_booking_id UUID,
  p_rating_described INTEGER,
  p_rating_comm INTEGER,
  p_rating_safe INTEGER,
  p_text TEXT,
  p_safety_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_reviewee_id UUID;
  v_completed_at TIMESTAMPTZ;
  v_other_review RECORD;
  v_review_id UUID;
  v_is_mutual BOOLEAN := FALSE;
BEGIN
  -- Validate rating ranges
  IF p_rating_described < 1 OR p_rating_described > 5
     OR p_rating_comm < 1 OR p_rating_comm > 5
     OR p_rating_safe < 1 OR p_rating_safe > 5 THEN
    RAISE EXCEPTION 'All ratings must be between 1 and 5';
  END IF;

  -- Validate text length (20 to 800 characters)
  IF LENGTH(TRIM(p_text)) < 20 OR LENGTH(p_text) > 800 THEN
    RAISE EXCEPTION 'Review text must be between 20 and 800 characters';
  END IF;

  -- Identify reviewee and verify completed state
  IF p_connection_id IS NOT NULL THEN
    SELECT
      CASE WHEN traveller_id = p_reviewer_id THEN local_member_id ELSE traveller_id END,
      updated_at
    INTO v_reviewee_id, v_completed_at
    FROM connections
    WHERE id = p_connection_id AND status = 'COMPLETED';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Connection not found or not yet completed';
    END IF;

    -- Check other party review
    SELECT * INTO v_other_review
    FROM reviews
    WHERE connection_id = p_connection_id AND reviewer_id = v_reviewee_id;

  ELSIF p_booking_id IS NOT NULL THEN
    SELECT
      CASE WHEN b.traveller_id = p_reviewer_id THEN e.provider_id ELSE b.traveller_id END,
      b.updated_at
    INTO v_reviewee_id, v_completed_at
    FROM experience_bookings b
    JOIN experiences e ON e.id = b.experience_id
    WHERE b.id = p_booking_id AND b.status = 'completed';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Experience booking not found or not yet completed';
    END IF;

    -- Check other party review
    SELECT * INTO v_other_review
    FROM reviews
    WHERE booking_id = p_booking_id AND reviewer_id = v_reviewee_id;
  ELSE
    RAISE EXCEPTION 'Either connection_id or booking_id must be provided';
  END IF;

  -- Check 14-day review window
  IF NOW() > (v_completed_at + INTERVAL '14 days') THEN
    RAISE EXCEPTION 'The 14-day review window for this completed interaction has closed';
  END IF;

  -- Determine if mutual submission is achieved
  IF v_other_review.id IS NOT NULL THEN
    v_is_mutual := TRUE;
  END IF;

  -- Insert current review
  INSERT INTO reviews (
    connection_id,
    booking_id,
    reviewer_id,
    reviewee_id,
    rating_as_described,
    rating_communication,
    rating_felt_safe,
    review_text,
    private_safety_notes,
    is_published,
    published_at,
    created_at
  ) VALUES (
    p_connection_id,
    p_booking_id,
    p_reviewer_id,
    v_reviewee_id,
    p_rating_described,
    p_rating_comm,
    p_rating_safe,
    p_text,
    p_safety_notes,
    v_is_mutual, -- True if both have now submitted
    CASE WHEN v_is_mutual THEN NOW() ELSE NULL END,
    NOW()
  )
  RETURNING id INTO v_review_id;

  -- If mutual, also publish the other party's review
  IF v_is_mutual THEN
    UPDATE reviews
    SET
      is_published = TRUE,
      published_at = NOW()
    WHERE id = v_other_review.id;
  END IF;

  RETURN v_review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SAFETY CHECK-IN FUNCTION: submit_safety_check_in()
-- Traveller check-in on start and end dates. "need_help" triggers immediate alert.
CREATE OR REPLACE FUNCTION submit_safety_check_in(
  p_user_id UUID,
  p_connection_id UUID,
  p_booking_id UUID,
  p_prompt_type TEXT,
  p_status TEXT
)
RETURNS UUID AS $$
DECLARE
  v_checkin_id UUID;
  v_alert_dispatched BOOLEAN := FALSE;
  v_reported_user_id UUID;
BEGIN
  IF p_prompt_type NOT IN ('arrival_start', 'departure_end') THEN
    RAISE EXCEPTION 'Invalid prompt_type: %', p_prompt_type;
  END IF;

  IF p_status NOT IN ('safe', 'need_help') THEN
    RAISE EXCEPTION 'Invalid check-in status: %', p_status;
  END IF;

  IF p_status = 'need_help' THEN
    v_alert_dispatched := TRUE;
  END IF;

  INSERT INTO check_ins (
    user_id,
    connection_id,
    booking_id,
    prompt_type,
    status,
    alert_dispatched,
    created_at
  ) VALUES (
    p_user_id,
    p_connection_id,
    p_booking_id,
    p_prompt_type,
    p_status,
    v_alert_dispatched,
    NOW()
  )
  RETURNING id INTO v_checkin_id;

  -- If "need_help", automatically generate urgent incident report and admin audit alert
  IF v_alert_dispatched THEN
    IF p_connection_id IS NOT NULL THEN
      SELECT CASE WHEN traveller_id = p_user_id THEN local_member_id ELSE traveller_id END
      INTO v_reported_user_id
      FROM connections WHERE id = p_connection_id;
    ELSIF p_booking_id IS NOT NULL THEN
      SELECT CASE WHEN b.traveller_id = p_user_id THEN e.provider_id ELSE b.traveller_id END
      INTO v_reported_user_id
      FROM experience_bookings b
      JOIN experiences e ON e.id = b.experience_id
      WHERE b.id = p_booking_id;
    END IF;

    IF v_reported_user_id IS NOT NULL THEN
      PERFORM create_safety_report(
        p_user_id,
        v_reported_user_id,
        'unsafe_or_threatening',
        'AUTOMATED SAFETY ALERT: User triggered "I need help" during ' || p_prompt_type || ' check-in.',
        'safety_checkin',
        v_checkin_id,
        NULL
      );
    END IF;
  END IF;

  RETURN v_checkin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TRIP SHARE CREATION: create_trip_share()
CREATE OR REPLACE FUNCTION create_trip_share(
  p_traveller_id UUID,
  p_connection_id UUID,
  p_booking_id UUID,
  p_trusted_email TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Generate secure random 32-character hex token
  v_token := encode(gen_random_bytes(16), 'hex');

  INSERT INTO trip_shares (
    traveller_id,
    connection_id,
    booking_id,
    token,
    trusted_contact_email_encrypted,
    is_confirmed,
    expires_at,
    created_at
  ) VALUES (
    p_traveller_id,
    p_connection_id,
    p_booking_id,
    v_token,
    p_trusted_email,
    FALSE,
    NOW() + INTERVAL '7 days',
    NOW()
  );

  RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

