-- ============================================================================
-- ATITHI DEVO BHAVA (अतिथि देवो भवः)
-- Migration: 20261110000009_accommodation_and_compliance.sql
-- Description: Milestone 10 - Accommodation and Compliance Module (Phase 3)
--              btree_gist daterange exclusion constraint, stay booking state
--              machine, foreign guest reporting duty (Form C / Form III),
--              and minimal DPDP-compliant guest registry.
-- ============================================================================

-- Ensure btree_gist extension is active for composite daterange exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. EXTEND ACCOMMODATION LISTINGS WITH DETAILED HOUSEHOLD AND VERIFICATION ATTRIBUTES
ALTER TABLE accommodation_listings
  ADD COLUMN IF NOT EXISTS household_adults_count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS has_children BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_pets BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS other_residents_description TEXT,
  ADD COLUMN IF NOT EXISTS verification_tier TEXT NOT NULL CHECK (verification_tier IN ('tier_1_day_only', 'tier_2_stay_approved')) DEFAULT 'tier_1_day_only',
  ADD COLUMN IF NOT EXISTS video_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS room_photos_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. ENHANCE ACCOMMODATION AVAILABILITY EXCLUSION CONSTRAINT
-- Confirmed stay dates must NEVER overlap for the same listing.
-- Utilizes btree_gist to enforce: listing_id = listing_id AND date_range && date_range
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'accommodation_availability_no_overlap_confirmed'
  ) THEN
    -- Check if table already has exclusion constraint
    BEGIN
      ALTER TABLE accommodation_availability
        ADD CONSTRAINT accommodation_availability_no_overlap_confirmed
        EXCLUDE USING gist (listing_id WITH =, date_range WITH &&)
        WHERE (status = 'confirmed_booking');
    EXCEPTION
      WHEN others THEN
        -- If constraint already present under default name, ignore
        NULL;
    END;
  END IF;
END $$;

-- 3. FUNCTION: submit_stay_booking_request()
-- Atomically validates check-in/out, 14-night max limit, 2-guest max limit,
-- and availability before creating a pending request.
CREATE OR REPLACE FUNCTION submit_stay_booking_request(
  p_listing_id UUID,
  p_traveller_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_adult_count INTEGER,
  p_child_count INTEGER,
  p_idempotency_key TEXT,
  p_special_requirements TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_listing RECORD;
  v_request_id UUID;
  v_stay_enabled BOOLEAN;
  v_nights INTEGER;
  v_conflicting_confirmed INTEGER;
BEGIN
  -- 1. Idempotency check
  SELECT id INTO v_request_id
  FROM accommodation_booking_requests
  WHERE idempotency_key = p_idempotency_key;

  IF v_request_id IS NOT NULL THEN
    RETURN v_request_id;
  END IF;

  -- 2. Validate dates
  IF p_check_in < CURRENT_DATE THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;

  IF p_check_out <= p_check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;

  v_nights := p_check_out - p_check_in;
  IF v_nights > 14 THEN
    RAISE EXCEPTION 'Maximum stay duration in the initial release is 14 nights (requested: %)', v_nights;
  END IF;

  -- 3. Validate guest count (max 2 guests)
  IF p_adult_count < 1 OR p_adult_count > 2 THEN
    RAISE EXCEPTION 'Adult count must be 1 or 2 (requested: %)', p_adult_count;
  END IF;

  IF (p_adult_count + p_child_count) > 2 THEN
    RAISE EXCEPTION 'Total guests cannot exceed 2 in the initial release (requested: %)', (p_adult_count + p_child_count);
  END IF;

  -- 4. Check listing status
  SELECT * INTO v_listing
  FROM accommodation_listings
  WHERE id = p_listing_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Accommodation listing not found';
  END IF;

  IF v_listing.status != 'approved' THEN
    RAISE EXCEPTION 'This accommodation listing is not approved for bookings';
  END IF;

  IF v_listing.host_id = p_traveller_id THEN
    RAISE EXCEPTION 'Hosts cannot book their own accommodation';
  END IF;

  -- 5. Check for overlapping confirmed bookings
  SELECT COUNT(*) INTO v_conflicting_confirmed
  FROM accommodation_availability
  WHERE listing_id = p_listing_id
    AND status = 'confirmed_booking'
    AND date_range && daterange(p_check_in, p_check_out, '[)');

  IF v_conflicting_confirmed > 0 THEN
    RAISE EXCEPTION 'Requested stay dates overlap with an existing confirmed booking';
  END IF;

  -- 6. Insert booking request
  INSERT INTO accommodation_booking_requests (
    listing_id,
    traveller_id,
    check_in,
    check_out,
    adult_count,
    child_count,
    status,
    idempotency_key
  ) VALUES (
    p_listing_id,
    p_traveller_id,
    p_check_in,
    p_check_out,
    p_adult_count,
    p_child_count,
    'pending',
    p_idempotency_key
  )
  RETURNING id INTO v_request_id;

  -- 7. Notify host
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_listing.host_id,
    'stay_request_received',
    'New stay request received',
    'A traveller has requested to stay from ' || p_check_in || ' to ' || p_check_out || ' (' || v_nights || ' nights).',
    '/dashboard/stays'
  );

  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. FUNCTION: confirm_stay_booking()
-- Atomically confirms a stay request, locks date_range in accommodation_availability,
-- and creates an initial guest record for compliance tracking.
CREATE OR REPLACE FUNCTION confirm_stay_booking(
  p_request_id UUID,
  p_host_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_request RECORD;
  v_listing RECORD;
  v_traveller RECORD;
BEGIN
  -- Lock request row FOR UPDATE
  SELECT * INTO v_request
  FROM accommodation_booking_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stay booking request not found';
  END IF;

  SELECT * INTO v_listing
  FROM accommodation_listings
  WHERE id = v_request.listing_id;

  IF v_listing.host_id != p_host_id THEN
    RAISE EXCEPTION 'Unauthorized: only the listing host can confirm this stay request';
  END IF;

  IF v_request.status != 'pending' AND v_request.status != 'accepted' THEN
    RAISE EXCEPTION 'Request cannot be confirmed in current status: %', v_request.status;
  END IF;

  -- 1. Insert into accommodation_availability with date_range
  -- The btree_gist exclusion constraint will automatically reject if there is an overlapping confirmed booking
  INSERT INTO accommodation_availability (
    listing_id,
    booked_by_booking_id,
    date_range,
    status
  ) VALUES (
    v_request.listing_id,
    v_request.id,
    daterange(v_request.check_in, v_request.check_out, '[)'),
    'confirmed_booking'
  );

  -- 2. Update request status to confirmed
  UPDATE accommodation_booking_requests
  SET status = 'confirmed',
      updated_at = NOW()
  WHERE id = p_request_id;

  -- 3. Retrieve traveller profile to initialize minimal DPDP-compliant guest record
  SELECT * INTO v_traveller
  FROM traveller_profiles
  WHERE user_id = v_request.traveller_id;

  INSERT INTO guest_records (
    host_id,
    guest_full_name_encrypted,
    nationality,
    arrival_date,
    departure_date,
    form_submitted
  ) VALUES (
    p_host_id,
    COALESCE(v_traveller.full_name, 'Guest Traveller'),
    COALESCE(v_traveller.country_of_residence, 'Unspecified'),
    v_request.check_in,
    v_request.check_out,
    FALSE
  );

  -- 4. Notify traveller
  INSERT INTO notifications (
    user_id,
    type,
    title,
    body,
    action_url
  ) VALUES (
    v_request.traveller_id,
    'stay_confirmed',
    'Stay request confirmed',
    'Your stay with ' || v_listing.title || ' from ' || v_request.check_in || ' to ' || v_request.check_out || ' is confirmed.',
    '/stays/' || v_listing.id
  );

  -- 5. Audit log
  INSERT INTO admin_audit_logs (
    action,
    target_entity,
    target_id,
    performed_by,
    reason
  ) VALUES (
    'CONFIRM_STAY_BOOKING',
    'accommodation_booking_requests',
    p_request_id,
    p_host_id,
    'Host confirmed stay booking request'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. FUNCTION: record_guest_compliance()
-- Updates foreign guest reporting (Form C / Form III) reference for host compliance.
CREATE OR REPLACE FUNCTION record_guest_compliance(
  p_guest_record_id UUID,
  p_host_id UUID,
  p_form_submitted BOOLEAN,
  p_submission_date DATE,
  p_submission_reference TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_record RECORD;
BEGIN
  SELECT * INTO v_record
  FROM guest_records
  WHERE id = p_guest_record_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Guest compliance record not found';
  END IF;

  IF v_record.host_id != p_host_id THEN
    RAISE EXCEPTION 'Unauthorized: only the host can update guest compliance records';
  END IF;

  UPDATE guest_records
  SET form_submitted = p_form_submitted,
      submission_date = p_submission_date,
      submission_reference = p_submission_reference,
      updated_at = NOW()
  WHERE id = p_guest_record_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

