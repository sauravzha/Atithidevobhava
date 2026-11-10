# Comprehensive Risk Register (RISKS.md)

Project: Atithi Devo Bhava (अतिथि देवो भवः)
Document Version: 1.0 (Milestone 1)

This document establishes the strategic, technical, legal, operational, and safety risks associated with building and launching the Atithi Devo Bhava platform, alongside concrete architectural and procedural mitigations.

---

## 1. Regulatory and Compliance Risks

### 1.1 Digital Personal Data Protection Act 2023 (DPDP Act)
- Risk: Non-compliance with consent notices, purpose limitation, data erasure requests, or child data restrictions under Indian DPDP law.
- Severity: Critical.
- Impact: Substantial regulatory fines, legal injunctions, and loss of operating reputation.
- Mitigation:
  1. Complete purpose-specific consent logs (`consent_records` table) capturing timestamp, IP, version, and exact clause agreed.
  2. Strict adults-only policy (18+ confirmed with year of birth). Minors prohibited from registration.
  3. Real data export and deletion workflows (`data_export_jobs`, `deletion_jobs`). Account deletion executes a real 14-day grace purge that scrubs all PII, images, contacts, and encrypts retained financial records.
  4. Privacy data mapping (`docs/PRIVACY_DATA_MAP.md`) defining collection rationale and retention period for every single field.
  5. Grievance officer contact details and statutory notice clearly posted.

### 1.2 Foreigner Registration Duties (Form C / Form III)
- Risk: Confusion among hosts regarding legal requirements to report international guests staying overnight, risking police scrutiny or host harassment.
- Severity: High.
- Impact: Criminal liability for accommodation hosts under the Foreigners Act; regulatory scrutiny of the platform.
- Mitigation:
  1. Stays module (Phase 3) is gated behind `STAYS_ENABLED=false` until legal clarity is established.
  2. Clear compliance module educating hosts on official reporting obligations without falsely presenting the platform as an official reporting service.
  3. Default data minimalism: Platform does NOT collect or store passport or visa numbers by default. Only guest name, nationality, and stay dates are recorded.
  4. Explicit warning that hosts offering commercial homestays must possess local state tourism registration.
  5. Consultation questions compiled in `docs/LEGAL_CHECKLIST.md` for qualified Indian legal counsel.

### 1.3 Goods and Services Tax (GST) and Financial Regulations
- Risk: Incorrect classification of marketplace facilitator obligations, TCS/TDS deductions, or holding customer funds without an authorized RBI payment aggregator license.
- Severity: High.
- Impact: Tax penalties, frozen payment accounts, regulatory notice from RBI.
- Mitigation:
  1. Payments are disabled in Phase 1 (`PAYMENTS_ENABLED=false`); platform operates strictly in enquiry-only mode.
  2. The platform never holds customer funds or operates an internal digital wallet. All settlements leverage authorized Indian payment aggregator escrow and split-payment mechanisms (Razorpay Route).
  3. Double-entry ledger architecture (`ledger_entries`) logs exact fee splits and snapshots commission rates at the moment of booking.
  4. Complete Chartered Accountant review checklist maintained in `docs/LEGAL_CHECKLIST.md`.

---

## 2. Safety, Abuse, and Trust Risks

### 2.1 Solo Female Traveller Safety
- Risk: Female international travellers encountering inappropriate behaviour, stalking, or harassment by local members or hosts.
- Severity: Critical.
- Impact: Severe physical or psychological harm to users; catastrophic loss of trust and platform shutdown.
- Mitigation:
  1. Mandatory public meeting point rule for initial meetups in Meet a Local.
  2. Mutual consent contact reveal: No phone, email, or social handle is revealed until both parties explicitly opt in after request acceptance.
  3. Live trip sharing with an off-platform trusted contact who receives encrypted itinerary updates.
  4. Verified "Women or Family Household" filter and dedicated women's safety portal.
  5. Direct access to 112 Emergency and 1091 Women Helpline, working even without JavaScript.
  6. "I need help" panic trigger generating immediate priority admin alerts and emergency contact dispatch.

### 2.2 Exploitative or Fake Homestays
- Risk: Bad actors posting squalid or unsafe accommodation, or attempting bait-and-switch operations.
- Severity: High.
- Impact: Traveller stranded, exposed to danger, or scammed in an unfamiliar environment.
- Mitigation:
  1. Tiered host eligibility: Stays require government ID check, video walkthrough or 4 photos of guest room, 10-minute video call with a moderator, and community references or prior positive meetup reviews.
  2. Address revealed only 72 hours prior to arrival, only if booking is confirmed.
  3. Blind review mechanism preventing retaliatory reviews.

---

## 3. Technical and Architectural Risks

### 3.1 Race Conditions in Bookings (Double Booking)
- Risk: Concurrent booking requests on the same experience time slot or accommodation date range, resulting in oversold capacity.
- Severity: High.
- Impact: Conflicted travellers, host embarrassment, payment refund disputes.
- Mitigation:
  1. Atomic Postgres transaction: `book_experience()` executes with row-level locks (`SELECT FOR UPDATE`), validating remaining capacity before decrementing.
  2. Accommodation availability utilizes PostgreSQL `daterange` with an exclusion constraint (`btree_gist`), guaranteeing at the database engine level that no overlapping confirmed stay can exist.
  3. Automated concurrency stress tests simulating simultaneous booking requests.

### 3.2 Row Level Security (RLS) Leakage or IDOR
- Risk: Flawed RLS policy allowing a traveller or host to access another user's private messages, bookings, or identity documents.
- Severity: Critical.
- Impact: Massive privacy breach, identity theft, unauthorized data disclosure.
- Mitigation:
  1. Default DENY policy on all 40+ database tables.
  2. Public endpoints query sanitized PostgreSQL views that exclude sensitive fields (`last_name`, `phone`, `email`, `home_address`).
  3. Postgres function `can_reveal()` acts as single source of truth for contact details.
  4. Comprehensive pgTAP automated test suite verifying every role and explicit IDOR cross-user access attempts.

### 3.3 Dependency and Credential Security
- Risk: Accidental commitment of Supabase service-role keys or API secrets, or malicious third-party npm package injection.
- Severity: Critical.
- Impact: Full database compromise.
- Mitigation:
  1. Supabase service-role key is strictly server-side. Zero secret keys exposed to `NEXT_PUBLIC_*`.
  2. Git pre-commit guards, strict `.gitignore`, and gitleaks scans in CI.
  3. No CDN scripts or third-party fonts at runtime; all fonts self-hosted via `@fontsource`.
  4. Locked package dependencies (`package-lock.json`) and automated security vulnerability audits (`npm audit`).

---

## 4. Operational and Localization Risks

### 4.1 Devanagari Typography and Hindi Baseline Alignment
- Risk: Broken conjuncts, clipped matras, or misaligned baselines between Latin and Devanagari text on diverse screen sizes.
- Severity: Medium.
- Impact: Unprofessional appearance, unreadable Hindi copy, poor accessibility for native speakers.
- Mitigation:
  1. Dedicated typography testing laboratory (`/dev/type`) testing complex conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध), matras, and numerals at 320px, 768px, and 1280px.
  2. Self-hosted high-quality Devanagari fonts (Tiro Devanagari Hindi, IBM Plex Sans Devanagari).
  3. Proportional height scaling: Hindi body text sized 6% larger than Latin to equalize perceived x-height.

### 4.2 Stiff or Inaccurate Hindi Translations
- Risk: Robotic, word-for-word machine translation alienating native Hindi speakers or confusing local hosts.
- Severity: Medium.
- Impact: Host drop-off, misunderstanding of safety or house rules.
- Mitigation:
  1. Natural spoken Hindi authored by native speakers, avoiding overly Sanskritized or literal translations.
  2. Translation catalog (`messages/hi.json`) with an audit registry marking each string for native speaker review (`_review: "native speaker"`).
  3. Strict ban on promotional cliches and travel jargon.

### 4.3 Pilot Region Cold Start
- Risk: Launching without sufficient local supply in the pilot region (Darbhanga and Madhubani), leaving travellers with empty searches.
- Severity: Medium.
- Impact: Early abandonment, perceived platform failure.
- Mitigation:
  1. Initial pilot concentrated exclusively on Darbhanga and Madhubani (Bihar), with target of 30 to 50 real local profiles and cultural artisans (Mithila painting, Maithili cuisine, village heritage).
  2. Honest empty states that state pilot availability rather than displaying fake inventory or artificial demand.
