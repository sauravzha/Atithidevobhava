-- ==============================================================================
-- Migration: 20261110000001_initial_schema.sql
-- Description: Core extensions, tables, foreign keys, and indexes for Atithi Devo Bhava.
-- Spec reference: Section 2, 3, 4, 8, 9, 20 of docs/SPEC.md
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. USERS AND ROLES
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  mobile_number_encrypted TEXT,
  birth_year INTEGER NOT NULL CHECK (birth_year <= EXTRACT(YEAR FROM CURRENT_DATE) - 18),
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('traveller', 'local_member', 'experience_provider', 'accommodation_host')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_role TEXT NOT NULL CHECK (admin_role IN ('super_admin', 'moderator', 'verification_reviewer', 'finance', 'content')),
  granted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, admin_role)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  mfa_enforced BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable audit log table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id UUID,
  performed_by UUID NOT NULL,
  reason TEXT NOT NULL,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS traveller_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  full_name_encrypted TEXT,
  country_of_residence TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  photo_url TEXT,
  bio_intro TEXT NOT NULL CHECK (char_length(bio_intro) >= 150),
  intended_travel_start DATE,
  intended_travel_end DATE,
  preferred_destinations TEXT[],
  trusted_contact_email_encrypted TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id),
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('state', 'union_territory')),
  lgd_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id),
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  lgd_code TEXT NOT NULL UNIQUE,
  source_version_date DATE,
  centroid_lat NUMERIC(9, 6),
  centroid_lng NUMERIC(9, 6),
  permits_notice TEXT,
  permits_reviewed_by_lawyer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID NOT NULL REFERENCES districts(id),
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  lgd_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  centroid_lat NUMERIC(9, 6),
  centroid_lng NUMERIC(9, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS local_member_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  legal_name_encrypted TEXT,
  state_id UUID REFERENCES states(id),
  district_id UUID REFERENCES districts(id),
  city_id UUID REFERENCES cities(id),
  locality_id UUID REFERENCES localities(id),
  bio_intro TEXT NOT NULL,
  preferred_public_meeting_area TEXT NOT NULL,
  availability_summary TEXT,
  photo_url TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'members_only')) DEFAULT 'members_only',
  email_verified_at TIMESTAMPTZ,
  mobile_verified_at TIMESTAMPTZ,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS host_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  household_intro TEXT NOT NULL,
  adult_count INTEGER NOT NULL DEFAULT 1,
  has_children BOOLEAN NOT NULL DEFAULT FALSE,
  has_pets BOOLEAN NOT NULL DEFAULT FALSE,
  anyone_else_living_there TEXT,
  house_rules TEXT,
  verified_tier_1_at TIMESTAMPTZ,
  verified_tier_2_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_providers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('individual', 'family', 'business')),
  genuine_offer_description TEXT NOT NULL,
  registrations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TAXONOMY (INTERESTS AND LANGUAGES)
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_languages (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  fluency TEXT NOT NULL DEFAULT 'fluent',
  PRIMARY KEY (user_id, language_id)
);

-- 5. EXPERIENCES (PRODUCT B)
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id),
  district_id UUID NOT NULL REFERENCES districts(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  general_meeting_area TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_per_person_paise INTEGER NOT NULL DEFAULT 0,
  min_participants INTEGER NOT NULL DEFAULT 1,
  max_participants INTEGER NOT NULL DEFAULT 6,
  included TEXT[],
  excluded TEXT[],
  cancellation_policy TEXT NOT NULL,
  safety_information TEXT NOT NULL,
  booking_requirements TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'published', 'changes_requested', 'rejected', 'suspended')) DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  credit TEXT NOT NULL,
  licence TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL,
  booked_count INTEGER NOT NULL DEFAULT 0 CHECK (booked_count <= capacity),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id),
  schedule_id UUID NOT NULL REFERENCES experience_schedules(id),
  traveller_id UUID NOT NULL REFERENCES users(id),
  participant_count INTEGER NOT NULL CHECK (participant_count > 0),
  total_price_paise INTEGER NOT NULL DEFAULT 0,
  commission_rate_snapshot NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'accepted', 'payment_pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded', 'disputed')) DEFAULT 'pending',
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES experience_bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ACCOMMODATION (PRODUCT C - PHASE 3)
CREATE TABLE IF NOT EXISTS accommodation_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  accommodation_type TEXT NOT NULL CHECK (accommodation_type IN ('free_cultural_hospitality', 'cost_sharing', 'registered_paid_homestay', 'family_accommodation', 'eligible_paying_guest', 'private_guest_room', 'other_permitted')),
  room_type TEXT NOT NULL CHECK (room_type IN ('private_room', 'shared_room')),
  bathroom_type TEXT NOT NULL CHECK (bathroom_type IN ('private', 'shared')),
  max_guests INTEGER NOT NULL CHECK (max_guests <= 2),
  room_count INTEGER NOT NULL DEFAULT 1,
  food_provided TEXT,
  general_location TEXT NOT NULL,
  house_rules TEXT,
  price_per_night_paise INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'suspended')) DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accommodation_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES accommodation_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  credit TEXT NOT NULL,
  licence TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exclusion constraint ensures confirmed bookings never overlap mathematically
CREATE TABLE IF NOT EXISTS accommodation_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES accommodation_listings(id) ON DELETE CASCADE,
  booked_by_booking_id UUID,
  date_range DATERANGE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'blocked', 'confirmed_booking')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  EXCLUDE USING gist (listing_id WITH =, date_range WITH &&) WHERE (status = 'confirmed_booking')
);

CREATE TABLE IF NOT EXISTS accommodation_booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES accommodation_listings(id),
  traveller_id UUID NOT NULL REFERENCES users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL CHECK (check_out > check_in AND (check_out - check_in) <= 14),
  adult_count INTEGER NOT NULL CHECK (adult_count <= 2),
  child_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MEET A LOCAL CONNECTIONS (PRODUCT A)
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  local_member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('tea_or_coffee', 'market_walk', 'language_exchange', 'photography_walk', 'local_area_tour', 'other')),
  suggested_public_place TEXT NOT NULL,
  proposed_dates TEXT NOT NULL,
  initial_message TEXT NOT NULL CHECK (char_length(initial_message) BETWEEN 50 AND 600),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN', 'SCHEDULED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
  decline_reason TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_different_parties CHECK (traveller_id <> local_member_id)
);

CREATE UNIQUE INDEX idx_unique_active_connection
  ON connections(traveller_id, local_member_id)
  WHERE status IN ('PENDING', 'ACCEPTED', 'SCHEDULED');

-- 8. CONVERSATIONS AND MESSAGING
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES experience_bookings(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_read_only BOOLEAN NOT NULL DEFAULT FALSE,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_conv_has_parent CHECK (connection_id IS NOT NULL OR booking_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  is_plain_text_only BOOLEAN NOT NULL DEFAULT TRUE,
  contains_contact_warning BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CONTACT EXCHANGE (SECTION 9)
CREATE TABLE IF NOT EXISTS contact_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES experience_bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  share_email BOOLEAN NOT NULL DEFAULT FALSE,
  share_phone BOOLEAN NOT NULL DEFAULT FALSE,
  share_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
  share_address BOOLEAN NOT NULL DEFAULT FALSE,
  encrypted_phone TEXT,
  encrypted_email TEXT,
  encrypted_whatsapp TEXT,
  encrypted_address TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (connection_id, user_id)
);

-- 10. REVIEWS (SECTION 11 - BLIND REVIEW ENGINE)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES connections(id),
  booking_id UUID REFERENCES experience_bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  rating_as_described INTEGER NOT NULL CHECK (rating_as_described BETWEEN 1 AND 5),
  rating_communication INTEGER NOT NULL CHECK (rating_communication BETWEEN 1 AND 5),
  rating_felt_safe INTEGER NOT NULL CHECK (rating_felt_safe BETWEEN 1 AND 5),
  review_text TEXT NOT NULL CHECK (char_length(review_text) BETWEEN 20 AND 800),
  private_safety_notes TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  redacted_at TIMESTAMPTZ,
  redacted_by UUID REFERENCES users(id),
  redact_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_review_has_context CHECK (connection_id IS NOT NULL OR booking_id IS NOT NULL),
  UNIQUE (reviewer_id, connection_id),
  UNIQUE (reviewer_id, booking_id)
);

-- 11. TRUST, IDENTITY AND SAFETY
CREATE TABLE IF NOT EXISTS verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('email', 'mobile', 'identity_id_check', 'address_check', 'experience_provider', 'accommodation_host')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'ManualReviewProvider',
  id_document_image_path TEXT,
  selfie_image_path TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  decision_reason TEXT,
  auto_purge_scheduled_at TIMESTAMPTZ,
  purge_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID NOT NULL REFERENCES users(id),
  target_entity TEXT NOT NULL,
  target_id UUID,
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'unsafe_or_threatening', 'asked_for_money', 'fake_profile', 'discrimination', 'inappropriate_sexual_content', 'suspected_trafficking_or_exploitation', 'other')),
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  details TEXT NOT NULL,
  snapshot_messages JSONB,
  status TEXT NOT NULL CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')) DEFAULT 'pending',
  assigned_to UUID REFERENCES users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id),
  CONSTRAINT chk_no_self_block CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. FINANCIAL AND COMPLIANCE (PHASE 2 & 3)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES experience_bookings(id),
  amount_paise INTEGER NOT NULL CHECK (amount_paise >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_order_id TEXT NOT NULL UNIQUE,
  payment_id TEXT,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  status TEXT NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')) DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payout_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id),
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  transfer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Double-entry accounting ledger
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT NOT NULL,
  account_name TEXT NOT NULL,
  debit_paise INTEGER NOT NULL DEFAULT 0,
  credit_paise INTEGER NOT NULL DEFAULT 0,
  booking_id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS host_compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  checklist_completed BOOLEAN NOT NULL DEFAULT FALSE,
  foreigner_duty_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  state_tourism_registration_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Minimal DPDP-compliant guest records (zero passport numbers by default)
CREATE TABLE IF NOT EXISTS guest_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 13. SAFETY SUITE AND PRIVACY
CREATE TABLE IF NOT EXISTS trip_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES experience_bookings(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  trusted_contact_email_encrypted TEXT NOT NULL,
  is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES experience_bookings(id) ON DELETE CASCADE,
  prompt_type TEXT NOT NULL CHECK (prompt_type IN ('arrival_start', 'departure_end')),
  status TEXT NOT NULL CHECK (status IN ('safe', 'need_help')),
  alert_dispatched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  version TEXT NOT NULL,
  ip_address TEXT,
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waitlist_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role_intent TEXT,
  region_interest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deletion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  purge_scheduled_at TIMESTAMPTZ NOT NULL,
  purge_completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('pending', 'cancelled', 'completed')) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT NOT NULL,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('person', 'experience', 'stay')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS translation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  is_machine_translated BOOLEAN NOT NULL DEFAULT TRUE,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email_hash TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and search
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_district ON cities(district_id);
CREATE INDEX IF NOT EXISTS idx_local_member_profiles_location ON local_member_profiles(state_id, district_id, city_id);
CREATE INDEX IF NOT EXISTS idx_experiences_location ON experiences(state_id, district_id, status);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category, status);
CREATE INDEX IF NOT EXISTS idx_connections_traveller ON connections(traveller_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_local ON connections(local_member_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, is_urgent);
