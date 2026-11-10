# Threat Model and Abuse Vector Analysis (THREAT_MODEL.md)

Document Version: 1.0 (Milestone 1)
Scope: Atithi Devo Bhava Platform (Web, API, Realtime Messaging, Database, Storage)
Classification: Confidential - Security Engineering

## Methodology
This threat model utilizes STRIDE and abuse case analysis mapped against real-world vulnerabilities observed in hospitality marketplaces, social matching applications, and peer-to-peer tourism platforms in India. Each threat is evaluated for:
- Likelihood (Low, Medium, High)
- Impact (Low, Medium, High, Critical)
- Mitigation (Implemented technical, database, and process controls)
- Residual Risk (Remaining risk after mitigation and operational procedures)

---

## 1. Romance Scams and Financial Solicitation

### Abuse Pattern
Bad actor registers as a charming local or traveller, builds emotional rapport in messaging, manufactures a personal or medical crisis, and solicits financial transfers off-platform.

- Likelihood: High
- Impact: High
- Mitigations:
  1. Automated in-message heuristic scanner flags financial keywords (e.g., "bank transfer", "Google Pay", "UPI", "send money", "emergency loan", "crypto") and warns the user with prominent safety banners.
  2. One-click "Asked for money" report trigger routes immediately to urgent moderation queue.
  3. Platform rules explicitly state in onboarding that genuine cultural hosts and locals never request informal money transfers.
  4. Platform messaging blocks active hyperlink clicks (rendered as inert plain text) and forbids attachments.
- Residual Risk: Off-platform communication (once contact is mutually exchanged) cannot be monitored directly. Mitigation relies on friction prior to reveal and prominent warnings during contact exchange.

---

## 2. Fake Hosts and Impersonation

### Abuse Pattern
Fraudulent operator creates fictitious host profiles using stolen photographs of legitimate artists, families, or residences to solicit bookings, harvest personal info, or deceive international visitors.

- Likelihood: Medium
- Impact: High
- Mitigations:
  1. Tiered verification: Email OTP, Indian mobile OTP via DLT-registered templates.
  2. Identity verification requires government photo ID image (Aadhaar with number masked) cross-checked against a live selfie by human moderators (ManualReviewProvider).
  3. Image metadata analysis, hash checking, and visual spot-checks during moderation review.
  4. Stays (Phase 3) require mandatory 10-minute live video call with a moderator and proof of residence.
  5. Experience listings require admin approval before becoming searchable or published.
- Residual Risk: High-quality deceptive imagery or willing accomplices. Countered by community reporting, manual admin audits, and verified meetup reviews.

---

## 3. Stalking and Harassment

### Abuse Pattern
Predatory user obtains personal coordinates or contact info of another user (often solo female travellers or vulnerable local hosts) and tracks, follows, or harasses them in person or electronically.

- Likelihood: High
- Impact: Critical
- Mitigations:
  1. Exact residential addresses and geographic coordinates are never public. Coordinates are rounded to city/locality centroids.
  2. Public profiles expose only display name, verified badges, interests, and general district. Last names are kept private.
  3. Dual mutual consent contact exchange: Neither phone, email, nor WhatsApp is revealed until BOTH parties explicitly select and submit their consent.
  4. Stay address is revealed to the guest strictly 72 hours prior to scheduled check-in, only if booking is confirmed and contact exchange is completed.
  5. Instant one-sided block mechanism: immediately closes chat, severs contact access, revokes Realtime channel, and hides profile.
- Residual Risk: Contact details shared outside the platform in person during a meetup cannot be revoked. Mitigated by educating users to preserve in-app communications.

---

## 4. Predatory Hosts Targeting Women and Vulnerable Travellers

### Abuse Pattern
Male host offers free accommodation or cultural meetups with ulterior sexual or exploitative motives, attempting to isolate foreign or domestic female travellers.

- Likelihood: Medium
- Impact: Critical
- Mitigations:
  1. Dedicated Women Traveller Safety Section and verified "Women or Family Household" filter based on sworn host household declarations.
  2. First meetup rule enforced in UI: Initial meetups must take place in designated public locations (cafes, historic squares, town centres). UI explicitly forbids private initial meetings.
  3. Trip Share feature: Traveller can share verified itinerary with an off-platform trusted contact via expiring secure token.
  4. Mandatory check-in prompts on arrival date ("I arrived safely" / "I need help").
  5. Prominent emergency access (112 National Emergency, 1091 Women Helpline, 1363 Tourist Helpline) available even without JavaScript.
  6. "I need help" button triggers immediate real-time priority moderator alert and emergency contact email dispatch.
- Residual Risk: Host misrepresents household composition. Mitigated by video onboarding verification for homestay hosts and strict review scrutiny.

---

## 5. Exploitation and Human Trafficking Indicators

### Abuse Pattern
Organized criminal rings attempt to recruit vulnerable locals under the guise of hospitality employment, or offer illegal commercial hospitality involving coerced labour.

- Likelihood: Low to Medium
- Impact: Critical
- Mitigations:
  1. Adults only (18+). Strict age gate with year of birth and legal confirmation. Registration of minors is blocked.
  2. Special moderation queue flag: "Suspected trafficking or exploitation" immediately suspends account, alerts super_admin, and isolates account data for law enforcement handoff if subpoenaed.
  3. Experience listings must describe activities directly conducted by the verified individual, family, or registered artisan cooperative. Commercial third-party brokers are barred.
  4. Accommodation requires strict compliance records, verified ID, and adherence to foreigner registration laws (Form C / Form III).
- Residual Risk: Bad actors attempting off-platform luring. Addressed by continuous platform education, strict zero-tolerance policies, and immediate moderator dispatch.

---

## 6. Doxxing and Defamation Through Reviews

### Abuse Pattern
Malicious user submits public reviews revealing private home addresses, contact numbers, real identities, or defamatory claims following a disagreement.

- Likelihood: Medium
- Impact: Medium to High
- Mitigations:
  1. Blind review system: Reviews are published simultaneously only after both parties have submitted or the 14-day window expires. Neither party can view the other's review beforehand.
  2. Only completed connections or bookings can be reviewed.
  3. Pre-publication automated filter blocks phone numbers, email patterns, and explicit street addresses in review text.
  4. Separate private safety feedback box visible exclusively to moderators and hidden from public display.
  5. Moderator capability to redact or remove reviews that violate privacy policies, with mandatory written justification and immutable audit logging.
- Residual Risk: Subtly defamatory text that evades automated regex. Mitigated by post-publish moderation dispute workflows.

---

## 7. Account Takeover (ATO) and Session Hijacking

### Abuse Pattern
Attacker compromises user credentials through credential stuffing, phishing, or session interception to impersonate trusted hosts or message travellers.

- Likelihood: Medium
- Impact: High
- Mitigations:
  1. Primary auth via Email OTP and Phone OTP (no static passwords susceptible to credential stuffing).
  2. Where passwords exist, 12+ character minimum, breached-password check, and zxcvbn strength scoring.
  3. Mandatory Supabase AAL2 MFA (TOTP) for all administrative personnel (`super_admin`, `moderator`, `finance`, `content`).
  4. Session rotation on login and privilege change. Secure, HttpOnly, SameSite=Strict cookies.
  5. Nonce-based strict Content Security Policy (CSP) blocking XSS and inline script execution.
  6. Rate limiting on login and OTP generation using Redis / PostgreSQL sliding windows with exponential backoff lockout.
- Residual Risk: SIM swap targeting user's mobile phone. Mitigated by dual-factor email alerts on new logins from unrecognized devices.

---

## 8. Moderator Misuse and Insider Threat

### Abuse Pattern
Disgruntled or compromised moderator browses private identity documents (Aadhaar cards, selfies), leaks contact details, or arbitrarily bans competitors.

- Likelihood: Low to Medium
- Impact: Critical
- Mitigations:
  1. Granular role-based permissions (`admin_permissions` table): Super Admin, Moderator, Verification Reviewer, Finance, Content.
  2. Principle of least privilege: Only `super_admin` can permanently ban, change platform flags, or inspect raw identity documents.
  3. Secure ID image viewer: Displays documents via short-lived signed URLs with no download button, watermarked with moderator ID.
  4. Immutable audit log: `admin_audit_logs` table has a database trigger that disallows `UPDATE` and `DELETE` even for database superusers.
  5. Ephemeral ID retention: ID verification images are permanently deleted within 7 days of approval or rejection, leaving only an immutable status flag and hash.
- Residual Risk: Physical photography of screen by rogue administrator. Mitigated by watermarking, restricted reviewer access, and strict internal hiring vetting.

---

## 9. Payment Fraud, Chargebacks, and Double Booking

### Abuse Pattern
Attacker initiates simultaneous booking requests across multiple tabs or automated scripts to trigger double bookings, or submits stolen cards to extract host payouts.

- Likelihood: Medium
- Impact: High
- Mitigations:
  1. Postgres transaction isolation: `book_experience()` function locks schedule rows using `SELECT FOR UPDATE`, verifies remaining seat capacity, and validates a unique idempotency key within a single atomic transaction.
  2. Stays availability enforced at the database level with a `daterange` column and an exclusion constraint (`btree_gist`), guaranteeing mathematical impossibility of overlapping confirmed stays.
  3. Payment webhooks (Razorpay) verified cryptographically via HMAC-SHA256 signatures before modifying any booking state.
  4. Webhook idempotency table (`payment_webhook_events`) prevents duplicate transaction execution.
  5. Payouts ledger uses strict double-entry accounting (`ledger_entries`) with separate hold periods.
- Residual Risk: External bank-level payment processor downtime or cardholder chargeback claims. Mitigated by clear cancellation policies and audit records.

---

## 10. Data Breach and PII Leakage

### Abuse Pattern
Attacker attempts SQL injection, insecure direct object references (IDOR), or misconfigured storage buckets to dump user databases or private documents.

- Likelihood: Medium
- Impact: Critical
- Mitigations:
  1. Row Level Security (RLS) enabled on all 40+ PostgreSQL tables with default `DENY`.
  2. Public API queries execute strictly against sanitized views or stored procedures; raw user tables are never exposed to anonymous requests.
  3. Parameterized queries via Supabase client and Zod validation on every server action and route handler.
  4. Sensitive fields (contact numbers, phone, email, stay address, compliance details) encrypted at rest using `pgcrypto`.
  5. Private Supabase Storage bucket for identity verification files; public access denied at bucket policy level.
  6. Automated log scrubber removes PII, auth tokens, OTPs, and message bodies prior to output.
- Residual Risk: Zero-day vulnerability in underlying infrastructure. Mitigated by defense-in-depth, encrypted columns, and minimal data retention.

---

## 11. Astroturfing, Sybil Attacks, and False Reporting

### Abuse Pattern
Malicious host creates multiple dummy accounts to report a competitor or leave bogus negative reports to get them de-indexed.

- Likelihood: Medium
- Impact: Medium
- Mitigations:
  1. Unverified new accounts are restricted: maximum 2 pending connection requests for the first 7 days.
  2. De-indexing threshold requires at least 2 distinct urgent reports from separate, verified users with completed interactions.
  3. All reports undergo human moderation investigation; automated suspensions require human review confirmation.
  4. Full audit trail of reporting history; repeated frivolous reporting triggers report-abuse penalties against the reporter.
- Residual Risk: Coordinated harassment ring. Mitigated by device fingerprinting, IP rate limiting, and moderator cross-investigation.
