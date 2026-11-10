# User Journeys and Operational Workflows (USER_JOURNEYS.md)

Document Version: 1.0 (Milestone 1)
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This document maps the end-to-end user journeys for each primary actor across the three interconnected product tiers (Meet a Local, Explore with a Local, Stay with a Local).

---

## 1. Journey: International Traveller

### 1.1 Discovery and Exploration
1. Landing: International traveller arrives at `/` (or `/hi`), discovering the text-led editorial showcase of Indian cultural regions, pilot districts (Darbhanga and Madhubani), and verified local residents.
2. Search: Executes search via unified search engine selecting "People" or "Experiences" filtered by State (Bihar), District (Madhubani), and Interest (Mithila painting, culinary traditions).
3. Public Profile Review: Reviews local profile (`/people/[slug]`), inspecting verified badges (Email verified, Mobile verified, Identity checked), spoken languages, bio, and declared public meeting areas. Exact address and contact numbers are inaccessible.

### 1.2 Onboarding and Profile Completion
1. Intent Selection: Clicks "Connect" or "Register", selecting "I am visiting India".
2. Multi-Step Form:
   - Step 1: Legal full name, public display name, email, country of residence.
   - Step 2: Email verification via 6-digit OTP.
   - Step 3: Profile photo upload (EXIF and GPS metadata automatically stripped).
   - Step 4: 150+ character introduction, interests, intended travel dates, birth year (confirming 18+).
   - Step 5: Statutory consent (Terms, Privacy, Safety Agreement), optional trusted-contact email for Trip Share.
3. Anti-Spam Guard: Profile enters active state, subject to a limit of at most 2 pending meetup requests during the first 7 days.

### 1.3 "Meet a Local" Connection Request
1. Request Initiation: From the local member's profile, clicks "Request Meetup". Selects purpose (e.g., "Art studio walk and tea"), proposes 2 date options, suggests a designated public location (e.g., "Town Hall cafe"), and drafts a personal message (50 to 600 characters).
2. Status Tracking: Connection request enters `PENDING` state. Dashboard displays pending queue.

### 1.4 Communication and Mutual Contact Exchange
1. Acceptance: Local member accepts the request. Status transitions to `ACCEPTED`.
2. Secure Messaging: Private text chat opens in `/dashboard/messages`. Traveller and local discuss meeting details.
3. Mutual Contact Reveal:
   - Banner appears in chat: "Share Contact Details".
   - Traveller selects preferred contact to reveal (e.g., WhatsApp). UI indicates "Waiting for the other person".
   - Local member selects their contact to reveal.
   - Once both have submitted consent, `can_reveal()` evaluates to true, and both see each other's chosen details.
4. Scheduling: Parties confirm meetup date and public venue; status transitions to `SCHEDULED`.
5. Trip Share: Traveller shares itinerary with trusted contact; trusted contact receives an expiring secure link displaying host first name, district, and date (never home address).

### 1.5 Meetup, Safety Prompts, and Blind Review
1. Day of Meetup: System triggers arrival check-in prompt: "Did you meet safely?" with options "Yes, all is well" or "I need help".
2. Completion: Following the meetup date, connection transitions to `COMPLETED`.
3. Blind Review: 14-day review window opens. Traveller rates three 1-5 dimensions (As described, Communication, Felt safe), writes public feedback (20-800 characters), and optionally submits private safety feedback to moderators. Review publishes only when local member also submits or the 14-day window expires.

---

## 2. Journey: Local Member

### 2.1 Registration and Verification
1. Onboarding: Selects "I am a local resident".
2. Contact Verification: Submits legal name, public display name, email, and Indian mobile number. Completes mandatory Indian DLT SMS OTP verification.
3. Profile Setup: Selects State, District, City, languages spoken, cultural interests, bio, preferred public meeting spots, and profile visibility (members-only by default).
4. Identity Verification: Submits masked government photo ID (Aadhaar with number masked) and live selfie to secure moderation queue.

### 2.2 Managing Requests and Availability
1. Receiving Request: Receives email notification and dashboard alert for incoming meetup request.
2. Evaluation: Reviews traveller profile, verified badges, country of residence, and proposed public meeting place.
3. Decision: Chooses to Accept, Decline (selecting a fixed reason; traveller receives polite generic notice), or Ask a Question in-app.
4. Safety Control: Local member retains unilateral right to cancel, block, or report at any stage.

---

## 3. Journey: Experience Provider

### 3.1 Listing Creation
1. Provider Profile: Extends local profile with provider details (individual, family, or artisan cooperative).
2. Listing Authoring: Navigates to `/dashboard/experiences/new`. Submits experience title, 12-category selection (e.g., "Mithila Painting Workshop"), bilingual description, general neighborhood meeting point (never private home address), duration, min/max group size, schedule slots, inclusions/exclusions, safety instructions, and original documentary photos with photographer credits.
3. Admin Moderation: Listing enters `PENDING_REVIEW` queue. Moderator reviews for authenticity and safety guidelines. Upon approval, status changes to `PUBLISHED`.

### 3.2 Handling Enquiries and Bookings
1. Phase 1 (Enquiry Mode): Prospective travellers submit date enquiries without price or payment processing. Provider coordinates directly in messaging.
2. Phase 2 (Booking Mode behind flags): When `PAYMENTS_ENABLED` is activated by super_admin, travellers submit date and participant count. The atomic `book_experience()` Postgres function locks the schedule row, verifies remaining capacity, and issues a confirmed booking upon verified payment webhook.

---

## 4. Journey: Accommodation Host (Phase 3, Behind Flags)

### 4.1 Strict Tier 2 Eligibility Verification
1. Application: Local member applies to offer cultural hospitality or registered homestay.
2. Verification Gates:
   - Must hold verified government ID.
   - Submits 4 photos or video walkthrough of private guest room and bathroom.
   - Completes 10-minute video interview with a platform moderator.
   - Obtains a verified community reference or has previously completed a verified meetup with positive reviews.
   - Paid listings submit state tourism registration certificates.
3. Admin Decision: Moderator inspects submission and grants Tier 2 accommodation hosting eligibility.

### 4.2 Managing Stays and Compliance Reporting
1. Enquiry Review: Host reviews traveller enquiry (check-in, check-out, guests). Overlap prevention is guaranteed via PostgreSQL `daterange` exclusion constraint.
2. Pre-Stay Address Protection: Exact residence address is cryptographically hidden until 72 hours prior to confirmed check-in date.
3. Compliance Center: Host accesses compliance checklist with statutory foreigner reporting guidance (Form C / Form III). Host records guest arrival, nationality, and police reporting reference in DPDP-compliant `guest_records`.

---

## 5. Journey: Administrator and Safety Moderator

### 5.1 Daily Moderation and Safety Operations
1. Secure Authentication: Admin authenticates via Supabase Auth with mandatory AAL2 Multi-Factor Authentication (TOTP).
2. Triage Dashboard (`/admin`): Inspects urgent safety reports, pending verifications, and listing approvals.
3. Priority Incident Investigation (`/admin/reports`):
   - Urgent reports (harassment, extortion, safety threats) trigger immediate moderator investigation.
   - Inspects reported message thread context (last 20 messages securely extracted).
   - Actions: Dismiss, issue warning, temporary suspension, or permanent ban (super_admin).
4. Identity Verification Review (`/admin/verifications`):
   - Opens masked ID image and selfie in secure viewer (signed 15-minute URL, watermarked, download disabled).
   - Verifies face match and name alignment. Approves or rejects with written justification.
   - Automated `pg_cron` job permanently deletes raw ID image files within 7 days.
5. Audit Verification: All administrative decisions, status mutations, and document inspections automatically append immutable entries to `admin_audit_logs`.
