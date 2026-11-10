-- ==============================================================================
-- Migration: 20261110000004_public_views.sql
-- Description: Sanitized public views strictly projecting non-sensitive attributes.
-- Spec reference: Section 2, 9, 20 of docs/SPEC.md
-- ==============================================================================

-- 1. SANITIZED PUBLIC VIEW: v_public_people
-- Never exposes legal names, exact residential coordinates, private contacts, or address.
CREATE OR REPLACE VIEW v_public_people AS
SELECT
  lmp.user_id,
  lmp.display_name,
  lmp.bio_intro,
  lmp.photo_url,
  lmp.visibility,
  s.name AS state_name,
  s.name_hi AS state_name_hi,
  d.name AS district_name,
  d.name_hi AS district_name_hi,
  c.name AS city_name,
  lmp.preferred_public_meeting_area,
  lmp.availability_summary,
  (lmp.email_verified_at IS NOT NULL) AS is_email_verified,
  (lmp.mobile_verified_at IS NOT NULL) AS is_mobile_verified,
  EXISTS (
    SELECT 1 FROM verification_records vr
    WHERE vr.user_id = lmp.user_id
      AND vr.verification_type = 'identity_id_check'
      AND vr.status = 'approved'
  ) AS is_identity_verified,
  ARRAY(
    SELECT lang.name_en
    FROM user_languages ul
    JOIN languages lang ON lang.id = ul.language_id
    WHERE ul.user_id = lmp.user_id
  ) AS languages,
  ARRAY(
    SELECT intr.name_en
    FROM user_interests ui
    JOIN interests intr ON intr.id = ui.interest_id
    WHERE ui.user_id = lmp.user_id
  ) AS interests,
  lmp.created_at
FROM local_member_profiles lmp
JOIN states s ON s.id = lmp.state_id
JOIN districts d ON d.id = lmp.district_id
LEFT JOIN cities c ON c.id = lmp.city_id
JOIN users u ON u.id = lmp.user_id
WHERE lmp.is_complete = TRUE
  AND u.is_suspended = FALSE;

-- 2. SANITIZED PUBLIC VIEW: v_public_experiences
-- Prices are masked unless PRICES_VISIBLE is enabled in platform_settings.
CREATE OR REPLACE VIEW v_public_experiences AS
SELECT
  e.id,
  e.title_en,
  e.title_hi,
  e.slug,
  e.category,
  e.description_en,
  e.description_hi,
  s.name AS state_name,
  d.name AS district_name,
  c.name AS city_name,
  e.general_meeting_area,
  e.duration_minutes,
  CASE
    WHEN (SELECT (value->>'enabled')::BOOLEAN FROM platform_settings WHERE key = 'PRICES_VISIBLE') IS TRUE
    THEN e.price_per_person_paise
    ELSE NULL
  END AS price_per_person_paise,
  e.min_participants,
  e.max_participants,
  e.included,
  e.excluded,
  e.cancellation_policy,
  e.safety_information,
  lmp.display_name AS host_display_name,
  lmp.photo_url AS host_photo_url,
  e.created_at
FROM experiences e
JOIN local_member_profiles lmp ON lmp.user_id = e.provider_id
JOIN states s ON s.id = e.state_id
JOIN districts d ON d.id = e.district_id
JOIN cities c ON c.id = e.city_id
JOIN users u ON u.id = e.provider_id
WHERE e.status = 'published'
  AND u.is_suspended = FALSE;

-- 3. SANITIZED PUBLIC VIEW: v_public_locations
-- Aggregated live counts by state and district
CREATE OR REPLACE VIEW v_public_locations AS
SELECT
  d.id AS district_id,
  d.name AS district_name,
  d.name_hi AS district_name_hi,
  s.id AS state_id,
  s.name AS state_name,
  s.name_hi AS state_name_hi,
  d.centroid_lat,
  d.centroid_lng,
  d.permits_notice,
  (
    SELECT COUNT(*)
    FROM local_member_profiles lmp
    WHERE lmp.district_id = d.id AND lmp.visibility = 'public'
  ) AS public_hosts_count,
  (
    SELECT COUNT(*)
    FROM experiences exp
    WHERE exp.district_id = d.id AND exp.status = 'published'
  ) AS published_experiences_count
FROM districts d
JOIN states s ON s.id = d.state_id;
