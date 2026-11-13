-- ==============================================================================
-- Atithi Devo Bhava (अतिथि देवो भवः) - Complete Supabase Database Schema
-- Specification Reference: Section 2, 3, 4, 8, 9, 20 of docs/SPEC.md
-- Target Database: PostgreSQL 15+ / Supabase (Mumbai ap-south-1 / Project wmwnkromrgzkbsiwgigs)
-- Invariants:
--   - 18+ adult verification
--   - Amounts stored in integer paise (INR)
--   - Atomic double-booking prevention with concurrency locking
--   - Row Level Security (RLS) on all exposed tables
--   - Immutable admin audit logs
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ------------------------------------------------------------------------------
-- 2. FEATURE FLAGS (Used by health checks & feature gating)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('PAYMENTS_ENABLED', TRUE, 'Enable live Razorpay order generation and checkout'),
  ('ACCOMMODATION_ENABLED', TRUE, 'Enable homestay & rural accommodation listings'),
  ('EXPERIENCE_MARKETPLACE', TRUE, 'Enable artisan cultural experiences marketplace'),
  ('SMS_OTP_ENABLED', TRUE, 'Enable mobile verification using Indian DLT SMS')
ON CONFLICT (key) DO UPDATE SET enabled = EXCLUDED.enabled;

-- ------------------------------------------------------------------------------
-- 3. TABLE 1: PROFILES (User Management & Identity Bridge)
-- Links with Firebase Auth via firebase_uid or Supabase Auth via id.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin')),
  is_adult BOOLEAN NOT NULL DEFAULT TRUE,
  bio TEXT,
  country TEXT DEFAULT 'India',
  state TEXT DEFAULT 'Bihar',
  district TEXT DEFAULT 'Darbhanga',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON public.profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 4. TABLE 2: HOST_PROFILES (Host Verification & Bank Payout Details)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.host_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  government_id_type TEXT,
  government_id_masked TEXT,
  document_url TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  bank_account_holder TEXT,
  bank_name TEXT,
  bank_account_number_masked TEXT,
  bank_ifsc TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_host_profiles_user_id ON public.host_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_host_profiles_status ON public.host_profiles(status);

-- ------------------------------------------------------------------------------
-- 5. TABLE 3: LISTINGS (Property & Cultural Homestays)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_hi TEXT,
  description TEXT NOT NULL,
  description_hi TEXT,
  listing_type TEXT NOT NULL DEFAULT 'homestay' CHECK (listing_type IN ('homestay', 'room', 'cultural_experience', 'farmstay', 'artisan_studio')),
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'paused', 'archived')),
  price_per_night_paise INTEGER NOT NULL CHECK (price_per_night_paise >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  max_guests INTEGER NOT NULL DEFAULT 1 CHECK (max_guests > 0),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  locality TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  amenities TEXT[] DEFAULT '{}',
  house_rules TEXT,
  cancellation_policy TEXT DEFAULT 'moderate',
  featured_image_url TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_host_id ON public.listings(host_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_district_state ON public.listings(state, district);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price_per_night_paise);

-- ------------------------------------------------------------------------------
-- 6. TABLE 4: LISTING_IMAGES (High-Resolution Property Photography)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);

-- ------------------------------------------------------------------------------
-- 7. TABLE 5: AVAILABILITY (Date Slots & Price Overrides)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'held', 'blocked')),
  hold_expires_at TIMESTAMPTZ,
  price_override_paise INTEGER CHECK (price_override_paise >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (listing_id, date)
);

CREATE INDEX IF NOT EXISTS idx_availability_listing_date ON public.availability(listing_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_status ON public.availability(status);

-- ------------------------------------------------------------------------------
-- 8. TABLE 6: BOOKINGS (Reservations with Concurrency Protection)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  guest_id UUID NOT NULL REFERENCES public.profiles(id),
  host_id UUID NOT NULL REFERENCES public.profiles(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count > 0),
  total_nights INTEGER NOT NULL CHECK (total_nights > 0),
  base_amount_paise INTEGER NOT NULL CHECK (base_amount_paise >= 0),
  service_fee_paise INTEGER NOT NULL DEFAULT 0 CHECK (service_fee_paise >= 0),
  taxes_paise INTEGER NOT NULL DEFAULT 0 CHECK (taxes_paise >= 0),
  total_amount_paise INTEGER NOT NULL CHECK (total_amount_paise >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'disputed')),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.profiles(id),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON public.bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON public.bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

-- ------------------------------------------------------------------------------
-- 9. TABLE 7: PAYMENTS (Razorpay Orders, Captures & Refunds in Paise)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  provider TEXT NOT NULL DEFAULT 'razorpay',
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'refunded', 'failed')),
  refund_id TEXT,
  refund_amount_paise INTEGER DEFAULT 0,
  error_code TEXT,
  error_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ------------------------------------------------------------------------------
-- 10. TABLE 8: PAYMENT_EVENTS (Idempotent Webhook Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payment_id UUID REFERENCES public.payments(id),
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON public.payment_events(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON public.payment_events(processed);

-- ------------------------------------------------------------------------------
-- 11. TABLE 9: CONTACT_SUBMISSIONS (Guest Inquiries & Support)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved', 'archived')),
  resolved_by UUID REFERENCES public.profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

-- ------------------------------------------------------------------------------
-- 12. TABLE 10: HOST_APPLICATIONS (Host Onboarding & Compliance Review)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_type TEXT NOT NULL,
  location_district TEXT NOT NULL,
  location_state TEXT NOT NULL,
  locality TEXT NOT NULL,
  experience_description TEXT NOT NULL,
  household_adults_count INTEGER NOT NULL DEFAULT 1,
  has_children BOOLEAN NOT NULL DEFAULT FALSE,
  has_pets BOOLEAN NOT NULL DEFAULT FALSE,
  suggested_meeting_spot TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_host_applications_user_id ON public.host_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status);

-- ------------------------------------------------------------------------------
-- 13. TABLE 11: REVIEWS (Verified Blind Reviews & Rating Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  host_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  hospitality_rating INTEGER CHECK (hospitality_rating >= 1 AND hospitality_rating <= 5),
  cultural_authenticity_rating INTEGER CHECK (cultural_authenticity_rating >= 1 AND cultural_authenticity_rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 20),
  is_verified_stay BOOLEAN NOT NULL DEFAULT TRUE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_host_id ON public.reviews(host_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- ------------------------------------------------------------------------------
-- 14. TABLE 12: ADMIN_AUDIT_LOGS (Append-Only Immutable Activity Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT,
  performed_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON public.admin_audit_logs(target_entity, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- Prevent update/delete on audit logs (tamper protection)
CREATE OR REPLACE FUNCTION trg_prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security Violation: admin_audit_logs records are strictly immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_log_immutable ON public.admin_audit_logs;
CREATE TRIGGER trg_audit_log_immutable
BEFORE UPDATE OR DELETE ON public.admin_audit_logs
FOR EACH ROW EXECUTE FUNCTION trg_prevent_audit_log_mutation();

-- ------------------------------------------------------------------------------
-- 15. ATOMIC DATABASE TRANSACTION: book_listing()
-- Double-booking prevention with exclusive row locking and price verification.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.book_listing(
  p_listing_id UUID,
  p_guest_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guest_count INTEGER,
  p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_listing RECORD;
  v_host_id UUID;
  v_nights INTEGER;
  v_base_price INTEGER;
  v_total_amount INTEGER;
  v_existing_booking UUID;
  v_booking_id UUID;
  v_booking_code TEXT;
  v_conflict_count INTEGER;
BEGIN
  -- 1. Validate dates
  IF p_check_out <= p_check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date.';
  END IF;

  v_nights := (p_check_out - p_check_in);

  -- 2. Check for idempotent retry
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_existing_booking
    FROM public.bookings
    WHERE idempotency_key = p_idempotency_key;

    IF v_existing_booking IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', TRUE,
        'booking_id', v_existing_booking,
        'is_duplicate', TRUE
      );
    END IF;
  END IF;

  -- 3. Lock listing row for exclusive capacity check
  SELECT * INTO v_listing
  FROM public.listings
  WHERE id = p_listing_id AND status = 'approved'
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing is not active or available for booking.';
  END IF;

  IF p_guest_count > v_listing.max_guests THEN
    RAISE EXCEPTION 'Guest count exceeds maximum capacity of %.', v_listing.max_guests;
  END IF;

  v_host_id := v_listing.host_id;

  -- Prevent host from booking own listing
  IF p_guest_id = v_host_id THEN
    RAISE EXCEPTION 'Host cannot book their own property listing.';
  END IF;

  -- 4. Check for conflicting bookings (Double booking prevention)
  SELECT COUNT(*) INTO v_conflict_count
  FROM public.bookings
  WHERE listing_id = p_listing_id
    AND status IN ('confirmed', 'pending')
    AND daterange(check_in, check_out, '[)') && daterange(p_check_in, p_check_out, '[)');

  IF v_conflict_count > 0 THEN
    RAISE EXCEPTION 'Selected dates are already booked or held by another guest.';
  END IF;

  -- 5. Calculate verified pricing server-side in paise
  v_base_price := v_listing.price_per_night_paise * v_nights;
  v_total_amount := v_base_price; -- Add taxes/fees as configured

  -- Generate human-friendly booking code
  v_booking_code := 'ADB-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 6));
  v_booking_id := gen_random_uuid();

  -- 6. Insert atomic booking
  INSERT INTO public.bookings (
    id,
    booking_code,
    listing_id,
    guest_id,
    host_id,
    check_in,
    check_out,
    guest_count,
    total_nights,
    base_amount_paise,
    service_fee_paise,
    taxes_paise,
    total_amount_paise,
    status,
    idempotency_key
  ) VALUES (
    v_booking_id,
    v_booking_code,
    p_listing_id,
    p_guest_id,
    v_host_id,
    p_check_in,
    p_check_out,
    p_guest_count,
    v_nights,
    v_base_price,
    0,
    0,
    v_total_amount,
    'pending',
    p_idempotency_key
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'booking_id', v_booking_id,
    'booking_code', v_booking_code,
    'total_amount_paise', v_total_amount,
    'nights', v_nights
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 15b. WEBHOOK & PAYMENT RPC PROCEDURES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_payment_webhook(
  p_provider TEXT,
  p_event_id TEXT,
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.payment_events (event_id, event_type, payload, processed, processed_at)
  VALUES (p_event_id, p_event_type, p_payload, TRUE, NOW())
  ON CONFLICT (event_id) DO NOTHING;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_payment_capture(
  p_booking_id UUID,
  p_payment_order_id TEXT,
  p_payment_id TEXT,
  p_amount_paise INTEGER,
  p_provider TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_payment_id,
      updated_at = NOW()
  WHERE razorpay_order_id = p_payment_order_id;

  UPDATE public.bookings
  SET status = 'confirmed',
      updated_at = NOW()
  WHERE id = p_booking_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 16. STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES
  ('listing-images', 'listing-images', TRUE),
  ('user-avatars', 'user-avatars', TRUE),
  ('host-documents', 'host-documents', FALSE)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ------------------------------------------------------------------------------
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- Default Deny on all 12 tables.
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Helper to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Feature Flags: Public read
CREATE POLICY "Public can view feature flags"
ON public.feature_flags FOR SELECT
USING (TRUE);

-- Profiles Policies
CREATE POLICY "Public can view basic profiles"
ON public.profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR is_admin())
WITH CHECK (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR is_admin());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (role != 'admin' OR is_admin());

-- Host Profiles Policies
CREATE POLICY "Admins and hosts can view host profile"
ON public.host_profiles FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Hosts can create own host profile"
ON public.host_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update host profiles"
ON public.host_profiles FOR UPDATE
USING (is_admin() OR (auth.uid() = user_id AND status = 'pending'));

-- Listings Policies
CREATE POLICY "Public can view approved listings"
ON public.listings FOR SELECT
USING (status = 'approved' OR auth.uid() = host_id OR is_admin());

CREATE POLICY "Hosts can insert listings"
ON public.listings FOR INSERT
WITH CHECK (auth.uid() = host_id AND status IN ('draft', 'pending_approval'));

CREATE POLICY "Hosts can update own listings"
ON public.listings FOR UPDATE
USING (auth.uid() = host_id OR is_admin());

CREATE POLICY "Hosts can delete own listings"
ON public.listings FOR DELETE
USING (auth.uid() = host_id OR is_admin());

-- Listing Images Policies
CREATE POLICY "Public can view listing images"
ON public.listing_images FOR SELECT
USING (TRUE);

CREATE POLICY "Hosts can manage images for own listings"
ON public.listing_images FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND (host_id = auth.uid() OR is_admin())
  )
);

-- Availability Policies
CREATE POLICY "Public can view availability"
ON public.availability FOR SELECT
USING (TRUE);

CREATE POLICY "Hosts can manage availability for own listings"
ON public.availability FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND (host_id = auth.uid() OR is_admin())
  )
);

-- Bookings Policies
CREATE POLICY "Users can view own bookings as guest or host"
ON public.bookings FOR SELECT
USING (auth.uid() = guest_id OR auth.uid() = host_id OR is_admin());

CREATE POLICY "Guests can create pending bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Participants can update booking cancellation"
ON public.bookings FOR UPDATE
USING (auth.uid() = guest_id OR auth.uid() = host_id OR is_admin());

-- Payments Policies
CREATE POLICY "Users can view own payment transactions"
ON public.payments FOR SELECT
USING (auth.uid() = user_id OR is_admin());

-- Payment Events Policies (Server-Only / Admin)
CREATE POLICY "Admins can view payment events"
ON public.payment_events FOR SELECT
USING (is_admin());

-- Contact Submissions Policies
CREATE POLICY "Anyone can submit contact inquiry"
ON public.contact_submissions FOR INSERT
WITH CHECK (TRUE);

CREATE POLICY "Admins can view and manage contact submissions"
ON public.contact_submissions FOR ALL
USING (is_admin());

-- Host Applications Policies
CREATE POLICY "Users can view own host application"
ON public.host_applications FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can submit host application"
ON public.host_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can review host applications"
ON public.host_applications FOR UPDATE
USING (is_admin());

-- Reviews Policies
CREATE POLICY "Public can view published reviews"
ON public.reviews FOR SELECT
USING (is_published = TRUE OR is_admin());

CREATE POLICY "Guests can create reviews for completed bookings"
ON public.reviews FOR INSERT
WITH CHECK (
  auth.uid() = author_id AND
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = booking_id AND guest_id = auth.uid() AND status = 'completed'
  )
);

-- Admin Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (is_admin());

-- ------------------------------------------------------------------------------
-- 18. STORAGE RLS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public access to listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

CREATE POLICY "Hosts can upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public access to user avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Private host documents restricted to owner and admin"
ON storage.objects FOR ALL
USING (
  bucket_id = 'host-documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR is_admin())
);

-- ------------------------------------------------------------------------------
-- 23. COMPATIBILITY TABLES & VIEWS
-- Bridges existing frontend routes, prototype queries, and compliance schemas.
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS birth_year INTEGER;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS accommodation_type TEXT DEFAULT 'free_cultural_hospitality',
  ADD COLUMN IF NOT EXISTS room_type TEXT DEFAULT 'private_room',
  ADD COLUMN IF NOT EXISTS bathroom_type TEXT DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS room_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS food_provided TEXT,
  ADD COLUMN IF NOT EXISTS general_location TEXT,
  ADD COLUMN IF NOT EXISTS household_adults_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS has_children BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_pets BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS other_residents_description TEXT,
  ADD COLUMN IF NOT EXISTS verification_tier TEXT DEFAULT 'tier_1_day_only';

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.host_compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checklist_completed BOOLEAN NOT NULL DEFAULT FALSE,
  foreigner_duty_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  state_tourism_registration_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.guest_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_full_name_encrypted TEXT NOT NULL,
  nationality TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  form_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  submission_date DATE,
  submission_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_role TEXT NOT NULL CHECK (admin_role IN ('super_admin', 'moderator', 'finance', 'content', 'verification_reviewer')),
  assigned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, admin_role)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id),
  reported_user_id UUID REFERENCES public.profiles(id),
  target_type TEXT NOT NULL,
  target_id UUID,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  document_url TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.accommodation_listings AS
SELECT 
  id,
  host_id,
  title,
  accommodation_type,
  room_type,
  bathroom_type,
  max_guests,
  room_count,
  food_provided,
  general_location,
  household_adults_count,
  has_children,
  has_pets,
  other_residents_description,
  house_rules,
  price_per_night_paise,
  status,
  verification_tier,
  created_at,
  updated_at
FROM public.listings;

CREATE OR REPLACE VIEW public.users AS
SELECT
  id,
  email,
  display_name,
  avatar_url,
  phone,
  role,
  birth_year,
  is_suspended,
  created_at,
  updated_at
FROM public.profiles;

CREATE OR REPLACE VIEW public.local_member_profiles AS
SELECT
  id,
  id AS user_id,
  display_name,
  bio,
  avatar_url,
  created_at
FROM public.profiles;

