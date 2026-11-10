# Master Implementation Plan: Atithi Devo Bhava (अतिथि देवो भवः)

Document Version: 1.0 (Milestone 1)
Author: Product & Engineering Team
Project: Real, Production-Oriented Three-Sided Cultural Hospitality Platform

---

## 1. Architectural Blueprint and System Topology

### 1.1 Core Tenets
1. Production-Oriented Realism: Real authentication, real database tables, real permissions, real messaging, real administrative controls. No mock data presented as real; no unverified claims.
2. Editorial Restraint: Monocle and Kinfolk aesthetic discipline. Text-led, generous whitespace, 1px ruled borders, 12-column asymmetric grid, zero emojis, zero gradients, zero AI-generated visual clichés.
3. Defense in Depth: Row Level Security (RLS) on every table with default DENY; server-side role enforcement; strict Content Security Policy; encrypted PII at rest via `pgcrypto`; immutable audit logs.
4. Privacy and Cultural Sensitivity: Adults only (18+); dual mutual consent contact reveal (`can_reveal()`); zero storage of Aadhaar numbers; minimal guest record tracking; strict alignment with India's DPDP Act 2023.
5. Provider Abstraction: Every external dependency (SMS, Email, Maps, Payments, Translation) is wrapped behind a strict interface with a labelled development fallback.

### 1.2 Technology Stack
- Frontend: Next.js 14+ (App Router), React 18/19, TypeScript strict mode, Tailwind CSS (bespoke editorial theme), Lucide icons (stroke width 1.5, strictly semantic), React Hook Form + Zod, next-intl.
- Backend / Persistence: Supabase PostgreSQL 15+ in ap-south-1 (Mumbai). Extensions: `postgis`, `pg_trgm`, `unaccent`, `btree_gist`, `pgcrypto`, `pg_cron`.
- Hosting / Edge: Vercel (bom1 region).
- Typography: Self-hosted via `@fontsource`. Headings: Newsreader + Tiro Devanagari Hindi. Body/UI: IBM Plex Sans + IBM Plex Sans Devanagari.
- Testing Suite: Vitest (unit & integration), pgTAP / custom SQL RLS verification harnesses, Playwright (end-to-end multi-context browser workflows), axe-core (WCAG 2.2 AA accessibility validation).

---

## 2. Comprehensive Milestone Breakdown

### Milestone 1: Specification Analysis, Implementation Plan, and Risk Assessment
- Scope:
  - Deep-dive analysis of product specification, standing rules, and operational constraints.
  - Author `docs/SPEC.md` containing the full prompt verbatim.
  - Author `CLAUDE.md` with standing operational and safety rules.
  - Author `docs/PROGRESS.md` tracking all 13 milestones and real state.
  - Author `docs/DECISIONS.md` logging locked choices, sensible defaults, and alternatives.
  - Author `docs/THREAT_MODEL.md` detailing abuse cases, STRIDE evaluations, and mitigations.
  - Author `docs/RISKS.md` evaluating legal, technical, safety, and localization risks.
  - Author `docs/IMPLEMENTATION_PLAN.md` (this master roadmap).
  - Configure `.gitignore` to prevent secret leakage.
- Verification: Clean git repository, valid markdown files, zero emojis, documented plan.

---

### Milestone 2: Next.js, TypeScript, Tailwind, Design System, /dev/type, /dev/components, Contrast Table
- Scope:
  - Initialize Next.js project with App Router, TypeScript strict mode, and Tailwind CSS.
  - Configure bespoke Tailwind color palette (Light: Ivory `#F7F5F0`, Charcoal `#252723`, Forest Green `#596B57`, Deep Green `#455345`, Terracotta `#A45E46`, Terracotta-text `#8A4A35`, Warm Grey `#E9E5DE`, Secondary Text `#66655F`, Error `#A4332B`; Dark: Paper `#141613`, Text `#ECE9E2`, Secondary `#A8A69D`, Rule `#2E302B`, Green `#8FA88C`, Hover `#A9BFA6`, Terracotta `#D08A6E`, Error `#E0817A`).
  - Install and self-host fonts via `@fontsource` (Newsreader, Tiro Devanagari Hindi, IBM Plex Sans, IBM Plex Sans Devanagari). Set font-display swap, configure Latin and Devanagari subsets.
  - Implement base layout: 12-column grid, max width 1120px, 1px ruled borders, 3px border radius, no box shadows except 2px forest green focus ring with offset.
  - Build core UI components in `components/ui/`:
    - `Bi`: Bilingual heading component rendering Hindi line first, English line smaller beneath.
    - `Button`: Primary, secondary, text-link variants with minimum 44px tap target.
    - `Field`: Accessible form field with label above, helper text, and error with the word "Error" / "त्रुटि".
    - `OtpInput`: 6-digit accessible OTP input with auto-advance and paste support.
    - `Select`: Accessible, searchable select with keyboard navigation.
    - `Table`: Ruled editorial table.
    - `ListingRow` and `PersonRow`: Editorial list rows replacing standard cards.
    - `StatusLabel`: Text with 1px border; no bright rounded pills.
    - `VerificationLabel`: Verification badge with precise check glyph and verified date.
    - `Notice`: Left 2px ruled callout component.
    - `Toast`: Non-intrusive accessible notification toast.
    - `Dialog`: Accessible modal with strict focus trap.
    - `CalendarRange`: Accessible range date picker starting on Monday.
    - `PhotoUploader`: Accessible file input with client-side EXIF/GPS stripping notification.
    - `Figure`: Image component refusing to render without alt text, credit, and license.
  - Implement `/dev/type` typography testing page: test complex conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध), matras, numerals, and mixed Hindi/English baselines at 320px, 768px, and 1280px.
  - Implement `/dev/components` component showcase page documenting every component state in light and dark mode.
  - Build an automated WCAG AA contrast ratio verification table proving compliance (4.5:1 for regular text, 3:1 for large text and UI elements).
- Verification:
  - Project builds without errors (`npm run build`).
  - Type checking passes with zero errors (`tsc --noEmit`).
  - Linting passes cleanly (`npm run lint`).
  - Contrast table verifies WCAG 2.2 AA across all color pairs.
  - Responsive layouts verify cleanly at 320px, 768px, 1280px with no horizontal overflow.

---

### Milestone 3: Supabase Architecture, Migrations, Auth, RLS Policies, Feature Flags, Audit Log, RLS Tests
- Scope:
  - Initialize Supabase schema migrations in `supabase/migrations/`.
  - Enable required extensions: `postgis`, `pg_trgm`, `unaccent`, `btree_gist`, `pgcrypto`, `pg_cron`.
  - Author DDL for all core tables with UUID primary keys, foreign keys, constraints, and audit timestamps:
    - User Identity & Roles: `users`, `user_roles`, `admin_permissions`, `admin_users`, `admin_audit_logs`.
    - Profiles: `traveller_profiles`, `local_member_profiles`, `host_profiles`, `experience_providers`.
    - Geography: `countries`, `states`, `districts`, `cities`, `localities`.
    - Taxonomy: `interests`, `user_interests`, `languages`, `user_languages`.
    - Meetups & Connections: `connections`, `conversations`, `conversation_participants`, `messages`, `contact_exchanges`.
    - Experiences: `experiences`, `experience_images`, `experience_schedules`, `experience_bookings`, `experience_booking_participants`.
    - Accommodation: `accommodation_listings`, `accommodation_images`, `accommodation_availability`, `accommodation_booking_requests`.
    - Trust & Safety: `reviews`, `verification_records`, `reports`, `blocked_users`, `notifications`, `trip_shares`, `check_ins`, `consent_records`.
    - Financial & Compliance: `payments`, `refunds`, `payout_records`, `ledger_entries`, `payment_webhook_events`, `host_compliance_records`, `guest_records`.
    - System & Privacy: `platform_settings`, `data_export_jobs`, `deletion_jobs`, `translation_records`, `email_log`, `waitlist_subscriptions`.
  - Implement Row Level Security (RLS) on every table:
    - Default `DENY` policy.
    - Role-based separation for `anonymous`, `traveller`, `local_member`, `experience_provider`, `accommodation_host`, `moderator`, `super_admin`.
    - Strict object-level privacy (users access only their own records; travellers read only their bookings; accepted participants read chat messages).
    - Dedicated sanitized database views for public queries (excluding private names, private town data, contacts, and exact addresses).
  - Implement immutable audit logging:
    - Trigger on `admin_audit_logs` preventing `UPDATE` and `DELETE` actions.
    - Automated logging of administrative status updates, verification reviews, and sensitive data accesses.
  - Implement feature flag management in `platform_settings`:
    - Flags: `PRICES_VISIBLE` (false), `PAYMENTS_ENABLED` (false), `STAYS_ENABLED` (false), `MACHINE_TRANSLATION_ENABLED` (false), `GUEST_DOCUMENT_NUMBERS_ENABLED` (false).
  - Author automated RLS verification test suite (testing anonymous access, cross-user IDOR access attempts, and privilege escalation prevention).
- Verification:
  - Migrations apply cleanly.
  - RLS tests pass for all user roles.
  - Audit log triggers reject tampering.
  - Feature flags query correctly.

---

### Milestone 4: Homepage, Navigation, Locale Routing, and Discovery Shell with Real Location Data
- Scope:
  - Implement `next-intl` localization structure: English default, Hindi at `/hi`.
  - Author bilingual message dictionaries (`messages/en.json` and `messages/hi.json`).
  - Build site layout and header:
    - Left: Bilingual brand lockup with "अतिथि देवो भव" in Hindi heading font and "Atithi Devo Bhava" in Newsreader.
    - Navigation: Two-line bilingual links (Discover India / भारत खोजें, Meet Locals / स्थानीय लोगों से मिलें, Experiences / अनुभव, Stay / प्रवास, How it works / यह कैसे काम करता है).
    - Right: Language toggle (हिंदी | English), theme toggle (Light / Dark), Log in, Become a host.
  - Build text-led, asymmetric editorial Homepage:
    - Hero section (7-col left, 5-col right split): H1 "Experience India through its people." / "भारत को लोगों के साथ महसूस कीजिए।" + descriptive text.
    - Multi-mode unified search form: People | Experiences | Stays | Places tabs with dependent State, District, City dropdowns, Date, Guests.
    - Section 1: Three ways to experience India (full-width ruled rows, not cards).
    - Section 2: 12 cultural categories with live inventory counters.
    - Section 3: Ruled table of states with live host and experience counts.
    - Section 4: Latest real published experiences (honest empty state if none).
    - Section 5: Local community members with public visibility (honest empty state if none).
    - Section 6: Stay with a local (honest "Not open yet" status while `STAYS_ENABLED` is off).
    - Section 7: How it works (3 numbered ruled rows: Discover, Connect, Experience).
    - Section 8: Trust and Safety section.
    - Section 9: Become a Host callout.
    - Section 10: Stories from India.
    - Footer with bilingual legal, safety, and informational links and "No ads. No tracking." declaration.
  - Implement official Indian Location Engine:
    - Seed official data for pilot districts: Darbhanga and Madhubani (Bihar), plus Varanasi (UP), Jaipur (Rajasthan), Kochi (Kerala), Shillong (Meghalaya).
    - Build location landing pages: `/india`, `/india/[state]`, `/india/[state]/[district]`.
    - Autocomplete endpoints for dependent state -> district -> city selection.
    - Centroid-snapping logic ensuring private coordinates are never rendered on public maps.
- Verification:
  - App runs and renders smoothly at `/` and `/hi`.
  - Language toggle switches locales seamlessly with proper hreflang and canonical headers.
  - Location hierarchy resolves valid districts and fails on invalid entities.
  - Zero mock data masquerading as real; clean empty states display when inventory is zero.

---

### Milestone 5: Traveller and Local Profiles, Visibility Controls, and Verification Flow
- Scope:
  - Multi-step registration and onboarding engine:
    - Progress indicator ("Step 2 of 5"), save-as-draft capability, and plain explanatory rationale for each requested field.
    - Four onboarding intent choices: "I am visiting India", "I am a local resident", "I want to host experiences", "I want to offer accommodation".
  - Traveller Profile System:
    - Full name, public display name, email OTP verification, country of residence, preferred language, profile photo with EXIF stripping, 150+ character bio, interests, travel dates, preferred destinations, birth year (18+ confirmation), legal consent records (Terms, Privacy, Safety Agreement), optional trusted-contact email.
    - Restriction: At most 2 pending connection requests in first 7 days for new travellers.
  - Local Member Profile System:
    - Legal name (private), public display name, email OTP, Indian mobile OTP (DLT template interface), state, district, city, languages spoken, interests, bio, meetup preferences, preferred public meeting locations, availability schedule, photo, visibility setting (public vs members-only, default members-only).
  - Experience Provider Profile System:
    - Extended profile attributes: provider type (individual, family, registered cooperative), craft description, registration credentials.
  - Verification Flow:
    - Tiered verification badges: Email verified, Mobile verified, Identity checked by team, Address checked, Experience provider checked, Accommodation checked.
    - Identity verification module: Private bucket upload for masked government ID image (Aadhaar with number masked) and live selfie.
    - `IdentityVerificationProvider` interface: `ManualReviewProvider` for moderator review and `DigiLockerProvider` stub.
    - 7-day automatic purge job for raw identity images upon decision, retaining only verified flag and verification reference hash.
- Verification:
  - Registration flows complete across traveller and local roles.
  - Email and SMS OTP verifications simulate properly via development providers.
  - Profile visibility controls prevent unauthenticated access to members-only profiles.
  - Identity uploads land in private storage and generate short-lived signed URLs.

---

### Milestone 6: Meet a Local, Connection Management, and Contact Exchange Engine
- Scope:
  - Meet a Local discovery directory (`/explore/people`):
    - Real database queries filtering by state, district, city, languages, interests, availability, verification level, meetup type.
    - Full-text search using Postgres simple configuration and `pg_trgm`.
  - Connection Request Flow:
    - Traveller initiates request: selects purpose (tea or coffee, market walk, language exchange, photography walk, local area tour, other), proposed dates, suggested PUBLIC meeting venue, message (50 to 600 characters).
    - Idempotency key prevents duplicate requests.
    - Local member receives request in dashboard, with actions: Accept, Decline (fixed reasons; traveller sees generic "unable to meet this request"), or Ask a Question.
  - Finite State Machine in Database:
    - Status transitions managed by strict PostgreSQL function: `PENDING` -> `ACCEPTED` -> `SCHEDULED` -> `COMPLETED` / `CANCELLED` / `EXPIRED` (7 days) / `WITHDRAWN`.
    - Illegal state transitions rejected at database level.
  - Contact Exchange Engine (Section 9):
    - Implemented via PostgreSQL function `can_reveal(connection_or_booking_id, viewer_id, field)`.
    - Banner appears in chat only after status is `ACCEPTED`.
    - Each participant independently selects fields to reveal (Email, Phone, WhatsApp).
    - Status remains "Waiting for other person" until BOTH submit consent.
    - Fields revealed only after mutual confirmation; stay address revealed strictly 72 hours prior to scheduled start.
    - Immediate block action severs access and closes communication.
    - Sensitive contact values encrypted at rest using `pgcrypto`. Every reveal event recorded in `admin_audit_logs`.
- Verification:
  - Connection request lifecycle tests verify valid and invalid state transitions.
  - Contact exchange tests prove contact details remain completely inaccessible until both parties consent.
  - Stalking and block tests prove immediate revocation.

---

### Milestone 7: Experience Marketplace, Provider Dashboard, and Admin Approval (Enquiry Mode)
- Scope:
  - 12 Cultural Experience Categories: Indian food and cooking, Village life, Art and handicrafts, History and heritage, Local markets, Traditional festivals, Music and dance, Spiritual and cultural experiences, Nature and rural experiences, Language and cultural exchange, Photography walks, Local city exploration.
  - Experience Creation Wizard for Providers:
    - Title, category, bilingual description (Hindi and/or English), state, district, city, general meeting area (never private address), duration, price per person (stored in paise, hidden until `PRICES_VISIBLE=true`), min/max group capacity, schedules and time slots, languages, accessibility notes, inclusions, exclusions, cancellation policy, safety information, real photos with credit/license fields.
  - Administrative Moderation Workflow:
    - Statuses: `DRAFT` -> `PENDING_REVIEW` -> `PUBLISHED` / `CHANGES_REQUESTED` / `REJECTED` / `SUSPENDED`.
    - Admin review portal with reason-mandated audit logging.
  - Experience Detail Page (`/experiences/[slug]`):
    - Ruled editorial layout: cover photo, title, bilingual description, host profile, general meeting point, duration, group size, included/excluded, cancellation terms, safety notice, reviews.
    - Phase 1 Action: "Send Enquiry" button (prices hidden; no payment processed).
  - Experience Discovery (`/explore/experiences`):
    - Category filtering, location filtering, date availability, language selection.
- Verification:
  - Providers create experiences; unpublished experiences remain hidden from public search.
  - Admin approval workflow changes state and logs reviewer action.
  - Prices are completely hidden while `PRICES_VISIBLE=false`.
  - Enquiries route properly to provider dashboard.

---

### Milestone 8: Messaging, Notifications, Reviews, and Comprehensive Safety Tools
- Scope:
  - Supabase Realtime Text Messaging:
    - Direct communication between accepted connection or booking participants.
    - RLS policy restricts channel subscriptions strictly to authenticated participants.
    - Message length cap: 1000 characters; rate limit: 20 messages per minute.
    - Hyperlinks rendered as non-clickable plain text; file attachments prohibited.
    - Phone number and email regex scanner displays soft safety warning ("Use Share contact, it is safer").
    - Conversation lifecycle: Read-only 30 days post completion; terminated on cancel or block; 12-month automated deletion job.
  - Notification Engine:
    - In-app notification center for connection requests, status changes, and messages.
  - Blind Review System (Section 11):
    - Opens upon reaching `COMPLETED` status; remains open for 14 days.
    - Blind publishing: Reviews published only when both submit or the 14-day window closes.
    - Ratings: 3 structured 1-5 scales (As described, Communication, Felt safe) + 20-800 character public text.
    - Separate private safety box visible exclusively to moderators.
    - Review score calculation logic: aggregate rating displayed only when at least 3 genuine reviews exist.
  - Safety Tools Suite (Section 12):
    - Reporting System: Report user, experience, accommodation, or message with categories (Harassment, Unsafe behaviour, Asked for money, Fake profile, Discrimination, Inappropriate sexual content, Suspected trafficking, Other).
    - Urgent report routing: Emails on-duty moderator; two urgent reports from separate users hides profile from search pending review.
    - Block feature: Sever all connections, hide profiles, terminate chat.
    - Trip Share: Traveller shares itinerary with trusted contact via secure expiring token (displays host first name, district, dates; never residential address).
    - Check-in Prompts: Automated prompts on arrival date ("I arrived safely" / "I need help").
    - Standalone Help Page (`/help`): Emergency numbers (112 Emergency, 1091 Women Helpline, 1363 Tourist Helpline) and real "I need help" alert dispatch, functional without JavaScript.
- Verification:
  - Realtime messaging sends and receives between two authenticated sessions.
  - Plain text link rendering verified; contact attempt warning triggers.
  - Blind reviews remain private until both parties submit.
  - Urgent reports de-index offending profiles upon 2 reports.
  - Emergency Help page works with JavaScript disabled.

---

### Milestone 9: Booking and Payment Architecture (Phase 2 behind flags)
- Scope:
  - Booking State Machine:
    - Statuses: `DRAFT`, `PENDING`, `ACCEPTED`, `PAYMENT_PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `REFUNDED`, `DISPUTED`.
  - Concurrency & Double Booking Prevention:
    - PostgreSQL function `book_experience()` executed in an atomic transaction.
    - Row-level lock (`SELECT FOR UPDATE`) on schedule row.
    - Strict seat capacity validation and idempotency key check.
  - Payment Interface & Adapters:
    - `PaymentProvider` interface: `createOrder`, `verifyWebhook`, `processRefund`.
    - `RazorpayPaymentProvider` implementing HMAC-SHA256 signature verification and order creation.
    - `DevPaymentProvider` clearly labelled for development mode.
    - Webhook idempotency via `payment_webhook_events`.
  - Financial Ledger:
    - Double-entry ledger architecture (`ledger_entries`) recording gross booking value, commission snapshot, payment processing fees, and host payout liability.
    - All monetary figures stored as integers in paise.
  - Gated Execution:
    - Features remain behind `PRICES_VISIBLE=false` and `PAYMENTS_ENABLED=false`. UI renders honest "Not open yet" notices.
- Verification:
  - Concurrent booking stress test executes simultaneous booking attempts, proving zero overbooking.
  - Webhook signature verification tests validate valid payloads and reject forged requests.
  - Duplicate webhook events are rejected idempotently.
  - Feature flag verification proves payment flows are inaccessible when flags are off.

---

### Milestone 10: Accommodation and Compliance Module (Phase 3 behind flags)
- Scope:
  - Accommodation Categories: Free cultural hospitality, Cost-sharing, Registered paid homestay, Family accommodation, Eligible paying guest, Private guest room, Other legally permitted.
  - Listing Builder:
    - Host profile, general location, accommodation type, room configuration, bathrooms, meals, languages spoken, household introduction (adult count, children, pets), house rules, photos, accessibility, verification status.
  - Tiered Host Eligibility Engine:
    - Tier 1: Meetup and cultural guiding (no stay permissions).
    - Tier 2 (Stay Approval): Verified government ID, 4 room photos or video walkthrough, 10-minute moderator video interview, and reference check or prior completed positive meetup review.
  - Mathematical Overlap Prevention:
    - Availability model uses PostgreSQL `daterange` with `EXCLUDE USING gist (listing_id WITH =, date_range WITH &&)`.
    - Impossible for overlapping confirmed bookings to exist at database engine level.
  - Compliance & Foreigner Reporting Module:
    - Host compliance guide regarding foreigner reporting duties (Form C / Form III).
    - Minimalist guest record repository: records guest name, nationality, arrival date, departure date, and reporting submission reference.
    - Zero default storage of passport or visa numbers.
    - Optional encrypted storage (`guest_document_numbers_enabled`) disabled by default, requiring super_admin approval and documented legal sign-off.
  - Gated Execution:
    - Gated behind `STAYS_ENABLED=false`.
- Verification:
  - Database exclusion constraint rejects overlapping date range inserts.
  - Host eligibility verification workflow enforces required checks.
  - Guest records capture only permissible DPDP-compliant metadata.
  - Public routes display honest disabled status while flag is off.

---

### Milestone 11: Full Admin, Moderation, and Analytics Systems
- Scope:
  - Granular Administrative Roles (`admin_permissions`):
    - Roles: `super_admin`, `moderator`, `verification_reviewer`, `finance`, `content`.
    - Mandatory Supabase AAL2 MFA (TOTP) enforcement for administrative login.
  - Dense, Keyboard-Accessible Table-Based Admin Interface:
    - `/admin`: Dashboard metrics overview (real database aggregates; zero fake statistics).
    - `/admin/users`: User search, profile inspection, suspension, reactivation.
    - `/admin/verifications`: ID image viewer rendering short-lived signed URLs with no download option, watermarked with reviewer ID. Every view written to `admin_audit_logs`.
    - `/admin/experiences` and `/admin/accommodation`: Listing review, change requests, approvals, suspensions.
    - `/admin/reports`: Priority safety moderation queue, report investigation, escalation, and action log.
    - `/admin/locations`: Official administrative boundary management.
    - `/admin/finance`: Payment audits, refund execution, ledger inspection, reconciliation.
    - `/admin/settings`: Feature flag toggle panel with mandatory change reason and audit recording.
    - `/admin/audit-logs`: Append-only, tamper-proof audit trail viewer.
  - First-Party Cookie-Less Analytics:
    - Event tracking tables: `analytics_events`.
    - Tracks acquisition, searches, connections, published experiences, booking volume, and gross booking value without third-party tracking scripts.
- Verification:
  - Admin access denied to non-admin roles and users without AAL2 MFA.
  - ID image views write immutable records to `admin_audit_logs`.
  - Feature flag updates require written reason and log to audit table.
  - Admin audit log triggers prevent record deletion or alteration.

---

### Milestone 12: Complete Hindi and English Translations & Localization Review
- Scope:
  - Full internationalization coverage across all routes, navigation, forms, validation messages, error notices, transactional emails, and system alerts.
  - Ensure headings and navigation display bilingual format (Hindi primary, English subtitle).
  - Validate natural, culturally attuned spoken Hindi authored for native speakers.
  - Assemble translation review inventory in `docs/HINDI_TRANSLATION_CATALOG.md` marking every string with `_review: "native speaker"`.
  - Verify that personal names, official place names, and user-generated biographies remain uncorrupted by automated translation.
  - Validate `/dev/type` across mobile (320px), tablet (768px), and desktop (1280px) to verify baseline alignment and conjunct rendering.
- Verification:
  - All UI strings resolve from locale dictionaries with zero hardcoded strings.
  - Language switching operates seamlessly across all routes.
  - Zero Devanagari font rendering defects or baseline collisions.

---

### Milestone 13: End-to-End Verification, Performance, Accessibility, and Production Hardening
- Scope:
  - Full automated test suite execution:
    - Unit and integration tests (Auth, Profiles, Visibility, Connections, Contact Exchange, Experiences, Bookings, Concurrency, Messaging, Reviews, Safety, Deletion Purge).
    - RLS role security tests (Anonymous, Traveller, Local, Provider, Host, Moderator, Super Admin).
    - Playwright multi-role end-to-end tests (Registration, Connection Request, Chat, Contact Exchange, Experience Enquiry, Moderation).
    - axe-core accessibility audit across all public, dashboard, and admin views in light and dark mode.
  - Lighthouse performance optimization:
    - Mobile performance 90+, Accessibility 100, Best Practices 100, SEO 100.
    - Initial JavaScript bundle under 180 KB gzipped on Home and Explore.
    - Zero third-party tracking scripts; zero CDN dependencies.
  - Production Deployment Package:
    - `.env.example` documenting every secret and configuration variable.
    - Database backup, point-in-time recovery runbook, and restoration drill documentation (`docs/RUNBOOK.md`).
    - Final production readiness checklist (`docs/PRODUCTION_CHECKLIST.md`).
    - Section 30 Final Automated Proofs:
      - (a) Logged-out requests never expose last names, private towns, contacts, or addresses.
      - (b) Cross-user data isolation verified (no IDOR).
      - (c) Contact and stay address remain hidden until Section 9 criteria are met.
      - (d) Blocked users cannot message.
      - (e) ID images are permanently purged after 7 days.
      - (f) Account deletion purges PII and scrubs historical associations.
      - (g) Feature flags completely hide Phase 2 and Phase 3 features.
      - (h) Concurrent bookings cannot exceed capacity.
- Verification:
  - Clean test run with real terminal output.
  - Zero test failures, zero linting errors, zero type errors.

---

## 3. Data Architecture and Relationships

```
+--------------------------------------------------------------------------------------------------+
|                                        DATA MODEL CORE                                           |
+--------------------------------------------------------------------------------------------------+

  [ auth.users ]
        |
        v
  [ users ] <--------------------+---------------------+--------------------+
        |                        |                     |                    |
        +--> [ user_roles ]      +--> [ user_interests]|                    |
        +--> [ admin_permissions]                      +--> [ user_languages]
        |
        +----------------------------+-----------------------------+
        |                            |                             |
        v                            v                             v
  [ traveller_profiles ]    [ local_member_profiles ]     [ host_profiles ]
                                     |                             |
                                     +----------------------+      |
                                                            |      |
                                                            v      v
                                                  [ experience_providers ]
                                                            |
                                                            v
                                                     [ experiences ]
                                                            |
                                                            +--> [ experience_schedules ]
                                                            |           |
                                                            |           v
                                                            +--> [ experience_bookings ]
                                                                        |
                                                                        +--> [ payments ]
                                                                        +--> [ reviews ]

  [ connections ]
        |
        +--> [ conversations ] ---> [ messages ]
        |
        +--> [ contact_exchanges ] (governed by can_reveal() in Postgres)

  [ accommodation_listings ] ---> [ accommodation_availability ] (btree_gist daterange exclusion)
                                  [ accommodation_booking_requests ]
                                  [ host_compliance_records ]
                                  [ guest_records ] (DPDP compliant)

  [ admin_audit_logs ] (immutable, trigger-protected against UPDATE and DELETE)
  [ platform_settings ] (feature flags, commission rates with historical snapshots)
```

---

## 4. Security, Authorization, and Privacy Matrix

1. Public View Gating:
   - Anonymous visitors only query database views `v_public_experiences`, `v_public_people`, `v_public_locations`.
   - Views project ONLY display name, verified badges, interests, general district/city centroid, and approved experience details.
   - Exact coordinates, street addresses, phone numbers, email addresses, and last names are never exposed in public views.
2. Contact Exchange Gating:
   - Handled exclusively via `can_reveal(connection_id, viewer_id, field)`.
   - Returns boolean `true` ONLY IF status is `ACCEPTED` AND both parties have registered mutual consent in `contact_exchanges`.
   - Stay address returns `true` strictly within 72 hours prior to scheduled start.
3. Verification Document Isolation:
   - Uploads stored in private Supabase bucket `verification_documents`.
   - Access restricted to `verification_reviewer` and `super_admin` via short-lived signed URLs (15-minute TTL).
   - Images auto-purged within 7 days of review decision.
4. Administrative Protection:
   - Mandatory AAL2 MFA for all admin accounts.
   - Administrative actions require explicit written justification and record immutable rows in `admin_audit_logs`.
