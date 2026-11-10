-- ==============================================================================
-- Migration: 20261110000005_connection_transitions.sql
-- Description: Connection lifecycle state machine and contact exchange functions.
-- Spec reference: Section 6 and Section 9 of docs/SPEC.md.
-- ==============================================================================

-- 1. Explicit connection state transition function
CREATE OR REPLACE FUNCTION transition_connection(
  p_connection_id UUID,
  p_new_status TEXT,
  p_actor_id UUID,
  p_decline_reason TEXT DEFAULT NULL,
  p_scheduled_at TIMESTAMPTZ DEFAULT NULL,
  p_cancelled_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_conn RECORD;
  v_is_traveller BOOLEAN;
  v_is_local BOOLEAN;
  v_conversation_id UUID;
BEGIN
  -- Fetch existing connection row with exclusive lock
  SELECT * INTO v_conn
  FROM connections
  WHERE id = p_connection_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Connection request not found: %', p_connection_id;
  END IF;

  v_is_traveller := (v_conn.traveller_id = p_actor_id);
  v_is_local := (v_conn.local_member_id = p_actor_id);

  IF NOT (v_is_traveller OR v_is_local) THEN
    RAISE EXCEPTION 'Unauthorized: Actor % is not a participant in connection %', p_actor_id, p_connection_id;
  END IF;

  -- Validate legal state transitions per Section 6
  CASE v_conn.status
    -- From PENDING
    WHEN 'PENDING' THEN
      IF p_new_status = 'ACCEPTED' THEN
        IF NOT v_is_local THEN
          RAISE EXCEPTION 'Only the local member can accept a pending request.';
        END IF;

        -- Create conversation thread for text messaging if not present
        INSERT INTO conversations (connection_id)
        VALUES (p_connection_id)
        ON CONFLICT DO NOTHING
        RETURNING id INTO v_conversation_id;

        -- Initialize participants
        IF v_conversation_id IS NOT NULL THEN
          INSERT INTO conversation_participants (conversation_id, user_id)
          VALUES
            (v_conversation_id, v_conn.traveller_id),
            (v_conversation_id, v_conn.local_member_id)
          ON CONFLICT DO NOTHING;
        END IF;

        -- Initialize contact exchange records for both parties
        INSERT INTO contact_exchanges (connection_id, user_id)
        VALUES
          (p_connection_id, v_conn.traveller_id),
          (p_connection_id, v_conn.local_member_id)
        ON CONFLICT DO NOTHING;

      ELSIF p_new_status = 'DECLINED' THEN
        IF NOT v_is_local THEN
          RAISE EXCEPTION 'Only the local member can decline a pending request.';
        END IF;
      ELSIF p_new_status = 'WITHDRAWN' THEN
        IF NOT v_is_traveller THEN
          RAISE EXCEPTION 'Only the traveller can withdraw their pending request.';
        END IF;
      ELSIF p_new_status = 'EXPIRED' THEN
        -- Automated expiry allowed
        NULL;
      ELSE
        RAISE EXCEPTION 'Illegal transition from PENDING to %', p_new_status;
      END IF;

    -- From ACCEPTED
    WHEN 'ACCEPTED' THEN
      IF p_new_status = 'SCHEDULED' THEN
        IF p_scheduled_at IS NULL THEN
          RAISE EXCEPTION 'A scheduled meetup date and time is required to move to SCHEDULED.';
        END IF;
      ELSIF p_new_status = 'CANCELLED' THEN
        -- Either party can cancel an accepted connection
        NULL;
      ELSE
        RAISE EXCEPTION 'Illegal transition from ACCEPTED to %', p_new_status;
      END IF;

    -- From SCHEDULED
    WHEN 'SCHEDULED' THEN
      IF p_new_status = 'COMPLETED' THEN
        -- Completed after the scheduled time
        NULL;
      ELSIF p_new_status = 'CANCELLED' THEN
        -- Either party can cancel before the meetup
        NULL;
      ELSE
        RAISE EXCEPTION 'Illegal transition from SCHEDULED to %', p_new_status;
      END IF;

    -- Terminal states
    WHEN 'DECLINED', 'WITHDRAWN', 'EXPIRED', 'COMPLETED', 'CANCELLED' THEN
      RAISE EXCEPTION 'Cannot transition connection from terminal status %', v_conn.status;

    ELSE
      RAISE EXCEPTION 'Unknown connection status: %', v_conn.status;
  END CASE;

  -- Apply status update
  UPDATE connections
  SET
    status = p_new_status,
    decline_reason = CASE WHEN p_new_status = 'DECLINED' THEN p_decline_reason ELSE decline_reason END,
    scheduled_at = CASE WHEN p_new_status = 'SCHEDULED' THEN p_scheduled_at ELSE scheduled_at END,
    completed_at = CASE WHEN p_new_status = 'COMPLETED' THEN NOW() ELSE completed_at END,
    cancelled_at = CASE WHEN p_new_status = 'CANCELLED' THEN NOW() ELSE cancelled_at END,
    cancelled_by = CASE WHEN p_new_status = 'CANCELLED' THEN p_actor_id ELSE cancelled_by END,
    updated_at = NOW()
  WHERE id = p_connection_id;

  RETURN jsonb_build_object(
    'connection_id', p_connection_id,
    'previous_status', v_conn.status,
    'new_status', p_new_status,
    'updated_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Contact exchange consent update function
CREATE OR REPLACE FUNCTION record_contact_exchange_consent(
  p_connection_id UUID,
  p_user_id UUID,
  p_share_email BOOLEAN,
  p_share_phone BOOLEAN,
  p_share_whatsapp BOOLEAN,
  p_encrypted_email TEXT DEFAULT NULL,
  p_encrypted_phone TEXT DEFAULT NULL,
  p_encrypted_whatsapp TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_status TEXT;
  v_both_confirmed BOOLEAN := FALSE;
  v_count INTEGER;
BEGIN
  -- Check connection status is ACCEPTED or SCHEDULED
  SELECT status INTO v_status
  FROM connections
  WHERE id = p_connection_id;

  IF v_status NOT IN ('ACCEPTED', 'SCHEDULED') THEN
    RAISE EXCEPTION 'Contact exchange is only accessible for ACCEPTED or SCHEDULED connections.';
  END IF;

  -- Upsert contact exchange choice
  INSERT INTO contact_exchanges (
    connection_id,
    user_id,
    share_email,
    share_phone,
    share_whatsapp,
    encrypted_email,
    encrypted_phone,
    encrypted_whatsapp,
    confirmed_at,
    updated_at
  )
  VALUES (
    p_connection_id,
    p_user_id,
    p_share_email,
    p_share_phone,
    p_share_whatsapp,
    p_encrypted_email,
    p_encrypted_phone,
    p_encrypted_whatsapp,
    NOW(),
    NOW()
  )
  ON CONFLICT (connection_id, user_id) DO UPDATE SET
    share_email = EXCLUDED.share_email,
    share_phone = EXCLUDED.share_phone,
    share_whatsapp = EXCLUDED.share_whatsapp,
    encrypted_email = COALESCE(EXCLUDED.encrypted_email, contact_exchanges.encrypted_email),
    encrypted_phone = COALESCE(EXCLUDED.encrypted_phone, contact_exchanges.encrypted_phone),
    encrypted_whatsapp = COALESCE(EXCLUDED.encrypted_whatsapp, contact_exchanges.encrypted_whatsapp),
    confirmed_at = NOW(),
    updated_at = NOW();

  -- Check if both parties have confirmed
  SELECT COUNT(*) INTO v_count
  FROM contact_exchanges
  WHERE connection_id = p_connection_id
    AND confirmed_at IS NOT NULL;

  IF v_count >= 2 THEN
    v_both_confirmed := TRUE;
  END IF;

  RETURN jsonb_build_object(
    'connection_id', p_connection_id,
    'user_id', p_user_id,
    'confirmed', TRUE,
    'both_confirmed', v_both_confirmed
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

