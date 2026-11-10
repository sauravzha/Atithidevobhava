-- ==============================================================================
-- Seed: seed_locations.sql
-- Description: Official geography seeding for India.
-- All 28 States and 8 Union Territories explicitly written out.
-- Pilot districts: Darbhanga and Madhubani (Bihar) + Varanasi, Jaipur, Kochi, Shillong.
-- Spec reference: Section 13 of docs/SPEC.md
-- ==============================================================================

-- 1. COUNTRY: INDIA
INSERT INTO countries (id, code, name, name_hi)
VALUES ('00000000-0000-0000-0000-000000000356', 'IND', 'India', 'भारत')
ON CONFLICT (code) DO NOTHING;

-- 2. ALL 28 STATES
INSERT INTO states (country_id, name, name_hi, kind, lgd_code) VALUES
  ('00000000-0000-0000-0000-000000000356', 'Andhra Pradesh', 'आंध्र प्रदेश', 'state', '28'),
  ('00000000-0000-0000-0000-000000000356', 'Arunachal Pradesh', 'अरुणाचल प्रदेश', 'state', '12'),
  ('00000000-0000-0000-0000-000000000356', 'Assam', 'असम', 'state', '18'),
  ('00000000-0000-0000-0000-000000000356', 'Bihar', 'बिहार', 'state', '10'),
  ('00000000-0000-0000-0000-000000000356', 'Chhattisgarh', 'छत्तीसगढ़', 'state', '22'),
  ('00000000-0000-0000-0000-000000000356', 'Goa', 'गोवा', 'state', '30'),
  ('00000000-0000-0000-0000-000000000356', 'Gujarat', 'गुजरात', 'state', '24'),
  ('00000000-0000-0000-0000-000000000356', 'Haryana', 'हरियाणा', 'state', '06'),
  ('00000000-0000-0000-0000-000000000356', 'Himachal Pradesh', 'हिमाचल प्रदेश', 'state', '02'),
  ('00000000-0000-0000-0000-000000000356', 'Jharkhand', 'झारखंड', 'state', '20'),
  ('00000000-0000-0000-0000-000000000356', 'Karnataka', 'कर्नाटक', 'state', '29'),
  ('00000000-0000-0000-0000-000000000356', 'Kerala', 'केरल', 'state', '32'),
  ('00000000-0000-0000-0000-000000000356', 'Madhya Pradesh', 'मध्य प्रदेश', 'state', '23'),
  ('00000000-0000-0000-0000-000000000356', 'Maharashtra', 'महाराष्ट्र', 'state', '27'),
  ('00000000-0000-0000-0000-000000000356', 'Manipur', 'मणिपुर', 'state', '14'),
  ('00000000-0000-0000-0000-000000000356', 'Meghalaya', 'मेघालय', 'state', '17'),
  ('00000000-0000-0000-0000-000000000356', 'Mizoram', 'मिज़ोरम', 'state', '15'),
  ('00000000-0000-0000-0000-000000000356', 'Nagaland', 'नागालैंड', 'state', '13'),
  ('00000000-0000-0000-0000-000000000356', 'Odisha', 'ओडिशा', 'state', '21'),
  ('00000000-0000-0000-0000-000000000356', 'Punjab', 'पंजाब', 'state', '03'),
  ('00000000-0000-0000-0000-000000000356', 'Rajasthan', 'राजस्थान', 'state', '08'),
  ('00000000-0000-0000-0000-000000000356', 'Sikkim', 'सिक्किम', 'state', '11'),
  ('00000000-0000-0000-0000-000000000356', 'Tamil Nadu', 'तमिलनाडु', 'state', '33'),
  ('00000000-0000-0000-0000-000000000356', 'Telangana', 'तेलंगाना', 'state', '36'),
  ('00000000-0000-0000-0000-000000000356', 'Tripura', 'त्रिपुरा', 'state', '16'),
  ('00000000-0000-0000-0000-000000000356', 'Uttar Pradesh', 'उत्तर प्रदेश', 'state', '09'),
  ('00000000-0000-0000-0000-000000000356', 'Uttarakhand', 'उत्तराखंड', 'state', '05'),
  ('00000000-0000-0000-0000-000000000356', 'West Bengal', 'पश्चिम बंगाल', 'state', '19')
ON CONFLICT (lgd_code) DO NOTHING;

-- 3. ALL 8 UNION TERRITORIES
INSERT INTO states (country_id, name, name_hi, kind, lgd_code) VALUES
  ('00000000-0000-0000-0000-000000000356', 'Andaman and Nicobar Islands', 'अंडमान और निकोबार द्वीपसमूह', 'union_territory', '35'),
  ('00000000-0000-0000-0000-000000000356', 'Chandigarh', 'चंडीगढ़', 'union_territory', '04'),
  ('00000000-0000-0000-0000-000000000356', 'Dadra and Nagar Haveli and Daman and Diu', 'दादरा और नगर हवेली एवं दमन और दीव', 'union_territory', '38'),
  ('00000000-0000-0000-0000-000000000356', 'Delhi', 'दिल्ली', 'union_territory', '07'),
  ('00000000-0000-0000-0000-000000000356', 'Jammu and Kashmir', 'जम्मू और कश्मीर', 'union_territory', '01'),
  ('00000000-0000-0000-0000-000000000356', 'Ladakh', 'लद्दाख', 'union_territory', '37'),
  ('00000000-0000-0000-0000-000000000356', 'Lakshadweep', 'लक्षद्वीप', 'union_territory', '31'),
  ('00000000-0000-0000-0000-000000000356', 'Puducherry', 'पुदुचेरी', 'union_territory', '34')
ON CONFLICT (lgd_code) DO NOTHING;

-- 4. PILOT DISTRICTS (Darbhanga and Madhubani in Bihar)
INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'Darbhanga', 'दरभंगा', '192', '2026-01-01', 26.1522, 85.8971
FROM states WHERE lgd_code = '10'
ON CONFLICT (lgd_code) DO NOTHING;

INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'Madhubani', 'मधुबनी', '193', '2026-01-01', 26.3541, 86.0716
FROM states WHERE lgd_code = '10'
ON CONFLICT (lgd_code) DO NOTHING;

-- Expansion pilot districts
INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'Varanasi', 'वाराणसी', '173', '2026-01-01', 25.3176, 82.9739
FROM states WHERE lgd_code = '09'
ON CONFLICT (lgd_code) DO NOTHING;

INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'Jaipur', 'जयपुर', '106', '2026-01-01', 26.9124, 75.7873
FROM states WHERE lgd_code = '08'
ON CONFLICT (lgd_code) DO NOTHING;

INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'Ernakulam', 'एर्नाकुलम (कोच्चि)', '555', '2026-01-01', 9.9816, 76.2999
FROM states WHERE lgd_code = '32'
ON CONFLICT (lgd_code) DO NOTHING;

INSERT INTO districts (state_id, name, name_hi, lgd_code, source_version_date, centroid_lat, centroid_lng)
SELECT id, 'East Khasi Hills', 'पूर्वी खासी हिल्स (शिलांग)', '274', '2026-01-01', 25.5788, 91.8933
FROM states WHERE lgd_code = '17'
ON CONFLICT (lgd_code) DO NOTHING;

-- 5. PILOT CITIES / TOWNS
INSERT INTO cities (district_id, name, name_hi, lgd_code)
SELECT id, 'Darbhanga Municipal Corporation', 'दरभंगा नगर निगम', '243456'
FROM districts WHERE lgd_code = '192';

INSERT INTO cities (district_id, name, name_hi, lgd_code)
SELECT id, 'Benipur', 'बेनीपुर', '243457'
FROM districts WHERE lgd_code = '192';

INSERT INTO cities (district_id, name, name_hi, lgd_code)
SELECT id, 'Madhubani Nagar Parishad', 'मधुबनी नगर परिषद', '243460'
FROM districts WHERE lgd_code = '193';

INSERT INTO cities (district_id, name, name_hi, lgd_code)
SELECT id, 'Jhanjharpur', 'झंझारपुर', '243461'
FROM districts WHERE lgd_code = '193';
