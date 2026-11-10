-- ==============================================================================
-- Seed: seed_platform_settings.sql
-- Description: Default feature flags and initial commission rates.
-- Spec reference: Section 3, 22 of docs/SPEC.md
-- ==============================================================================

INSERT INTO platform_settings (key, value, description)
VALUES
  ('PRICES_VISIBLE', '{"enabled": false}', 'Phase 2: Displays experience and accommodation prices to prospective travellers.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('PAYMENTS_ENABLED', '{"enabled": false}', 'Phase 2: Enables online booking payments via Razorpay.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('STAYS_ENABLED', '{"enabled": false}', 'Phase 3: Enables residential homestay listings, requests, and compliance centre.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('MACHINE_TRANSLATION_ENABLED', '{"enabled": false}', 'Enables automated machine translation with mandatory user consent notice.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('GUEST_DOCUMENT_NUMBERS_ENABLED', '{"enabled": false}', 'Strictly disabled. Requires super_admin documented lawyer sign-off to store encrypted passport numbers.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('COMMISSION_RATE_EXPERIENCES', '{"rate_percent": 15.00}', 'Platform commission rate snapshot applied to experience bookings.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('COMMISSION_RATE_STAYS', '{"rate_percent": 12.00}', 'Platform commission rate snapshot applied to stay bookings.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO platform_settings (key, value, description)
VALUES
  ('COMMISSION_RATE_MEETUPS', '{"rate_percent": 0.00}', 'Free cultural connection requests have 0% fee.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
