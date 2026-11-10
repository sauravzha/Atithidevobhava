-- ==============================================================================
-- Seed: seed_taxonomy.sql
-- Description: The 12 Cultural Experience Categories and Indian Languages.
-- Spec reference: Section 7, 14 of docs/SPEC.md
-- ==============================================================================

-- 12 OFFICIAL CULTURAL EXPERIENCE CATEGORIES
INSERT INTO interests (slug, name_en, name_hi, category) VALUES
  ('indian-food-and-cooking', 'Indian food and cooking', 'भारतीय खान-पान और पाक कला', 'culinary'),
  ('village-life', 'Village life', 'ग्रामीण जीवन और परंपरा', 'culture'),
  ('art-and-handicrafts', 'Art and handicrafts', 'कला और हस्तशिल्प', 'craft'),
  ('history-and-heritage', 'History and heritage', 'इतिहास और धरोहर', 'heritage'),
  ('local-markets', 'Local markets', 'स्थानीय बाज़ार भ्रमण', 'exploration'),
  ('traditional-festivals', 'Traditional festivals', 'पारंपरिक उत्सव और मेले', 'festivals'),
  ('music-and-dance', 'Music and dance', 'संगीत और लोक नृत्य', 'performing_arts'),
  ('spiritual-and-cultural', 'Spiritual and cultural experiences', 'आध्यात्मिक और सांस्कृतिक अनुभव', 'spirituality'),
  ('nature-and-rural', 'Nature and rural experiences', 'प्रकृति और ग्रामीण परिवेश', 'nature'),
  ('language-and-exchange', 'Language and cultural exchange', 'भाषा और सांस्कृतिक संवाद', 'exchange'),
  ('photography-walks', 'Photography walks', 'फ़ोटोग्राफ़ी पदयात्रा', 'visual_arts'),
  ('local-city-exploration', 'Local city exploration', 'स्थानीय नगर दर्शन', 'urban')
ON CONFLICT (slug) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_hi = EXCLUDED.name_hi;

-- OFFICIAL INDIAN LANGUAGES
INSERT INTO languages (code, name_en, name_hi) VALUES
  ('hi', 'Hindi', 'हिंदी'),
  ('en', 'English', 'अंग्रेज़ी'),
  ('mai', 'Maithili', 'मैथिली'),
  ('bho', 'Bhojpuri', 'भोजपुरी'),
  ('bn', 'Bengali', 'বাংলা (बंगाली)'),
  ('ta', 'Tamil', 'தமிழ் (तमिल)'),
  ('te', 'Telugu', 'తెలుగు (तेलुगु)'),
  ('ml', 'Malayalam', 'മലയാളം (मलयालम)'),
  ('kn', 'Kannada', 'ಕನ್ನಡ (कन्नड़)'),
  ('mr', 'Marathi', 'मराठी'),
  ('gu', 'Gujarati', 'ગુજરાતી (गुजराती)'),
  ('pa', 'Punjabi', 'ਪੰਜਾਬੀ (पंजाबी)'),
  ('or', 'Odia', 'ଓଡ଼ିଆ (ओड़िया)'),
  ('as', 'Assamese', 'অসমীয়া (असमिया)'),
  ('ur', 'Urdu', 'اردو (उर्दू)')
ON CONFLICT (code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_hi = EXCLUDED.name_hi;
