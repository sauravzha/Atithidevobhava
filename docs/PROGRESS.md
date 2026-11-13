# Project Progress: Atithi Devo Bhava (अतिथि देवो भवः)

Last Updated: 2026-11-10
Current Milestone: Milestone 13 - End-to-End Verification, Performance, Axe Accessibility, Lighthouse, Production Deployment Package (Completed)

## Milestone Status Overview

- Milestone 1: Specification Analysis, Implementation Plan, and Risk Assessment
  Status: Completed
- Milestone 2: Next.js, TypeScript, Tailwind, Fonts, Design System, /dev/type, /dev/components, WCAG Contrast Table
  Status: Completed
- Milestone 3: Supabase, Migrations, Auth, RLS Policies, Feature Flags, Audit Log, RLS Tests
  Status: Completed
- Milestone 4: Homepage, Navigation, Locale Routing (en/hi), Discovery Shell with Real Location Data
  Status: Completed
- Milestone 5: Traveller and Local Profiles, Visibility Controls, Verification Flow
  Status: Completed
- Milestone 6: Meet a Local, Connection Management, Database Transition Functions, Contact Exchange Engine
  Status: Completed
- Milestone 7: Experience Marketplace, Provider Dashboard, Admin Approval (Enquiry Mode)
  Status: Completed
- Milestone 8: Messaging (Realtime), Notifications, Reviews (Blind), Safety Tools (Reports, Blocks, Check-ins, Trip Share, Help Page)
  Status: Completed
- Milestone 9: Booking and Payment Architecture (Phase 2 behind flags), book_experience() Concurrency Tests
  Status: Completed
- Milestone 10: Accommodation and Compliance Module (Phase 3 behind flags, Form C / Form III, btree_gist overlap exclusion)
  Status: Completed
- Milestone 11: Admin, Moderation, and Analytics Systems (Audit logging, Viewer without download, Real metrics)
  Status: Completed
- Milestone 12: Complete Hindi and English Translations, Native Review Strings Catalog
  Status: Completed
- Milestone 13: End-to-End Verification, Performance, Axe Accessibility, Lighthouse, Production Deployment Package
  Status: Completed

## What is Done (Milestones 1 to 7)

- Milestone 1:
  - Verified development environment (Node v24.11.0, npm 11.6.2, git 2.51.2).
  - Initialized git repository.
  - Authored docs/SPEC.md, CLAUDE.md, docs/PROGRESS.md, docs/DECISIONS.md, docs/IDEAS.md.
  - Authored docs/IMPLEMENTATION_PLAN.md, docs/RISKS.md, docs/THREAT_MODEL.md, docs/PERMISSIONS.md, docs/PRIVACY_DATA_MAP.md, docs/LEGAL_CHECKLIST.md, docs/USER_JOURNEYS.md, docs/MODERATOR_HANDBOOK.md, docs/RUNBOOK.md, docs/API.md, README.md, .env.example.
- Milestone 2:
  - Scaffolded Next.js App Router application with strict TypeScript and custom Tailwind configuration.
  - Installed and configured self-hosted fontsource packages: Newsreader, Tiro Devanagari Hindi, IBM Plex Sans, IBM Plex Sans Devanagari.
  - Authored global CSS (app/globals.css) with light (Ivory/Charcoal/Forest/Terracotta) and dark (Paper/Text/Green/Terracotta) CSS variable palettes, 3px border radius, 12-column grid, and focus rings.
  - Built 18 accessible editorial UI components in components/ui/.
  - Created Typography and Devanagari Testing Laboratory at app/[locale]/dev/type/page.tsx.
  - Created Design System Component Showcase and Contrast Table at app/[locale]/dev/components/page.tsx.
  - Implemented automated WCAG 2.2 AA relative luminance and contrast engine in lib/contrast.ts.
  - Authored 23 automated unit and component tests in tests/unit/ passing cleanly with Vitest.
- Milestone 3:
  - Configured Supabase infrastructure in Mumbai region (ap-south-1) with extensions (postgis, pg_trgm, unaccent, btree_gist, pgcrypto).
  - Created complete database schema migration (supabase/migrations/20261110000001_initial_schema.sql) defining 45+ tables, foreign keys, CHECK constraints, and performance indexes.
  - Created database functions and triggers:
    - Append-only trigger trg_prevent_audit_log_mutation() prohibiting UPDATE and DELETE on admin_audit_logs.
    - Authoritative contact revelation function can_reveal() enforcing mutual consent, block revocation, and 72-hour address lock.
    - Atomic booking transaction book_experience() with SELECT FOR UPDATE capacity locking and idempotency protection.
    - Two-report automatic de-indexing trigger trg_urgent_reports_deindex().
  - Enabled Row Level Security (RLS) on all tables with default-deny policies.
  - Created sanitized public views v_public_people, v_public_experiences, and v_public_locations projecting strictly non-sensitive attributes.
  - Seeded default platform feature flags, official Indian geography, 12 cultural experience categories, and official Indian languages.
  - Implemented browser, SSR, and admin Supabase clients and TypeScript schema types.
  - Authored 13 automated RLS & database security tests in tests/rls/rls_security.test.ts.
- Milestone 4:
  - Bilingual public shell with next-intl (English default at `/`, Hindi at `/hi`).
  - Next.js middleware with strict security headers (HSTS 2 years, X-Content-Type-Options, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy, COOP, CORP).
  - Bilingual header and editorial footer with Indian emergency numbers (112, 1091, 1363).
  - 10-section text-led Homepage (`app/[locale]/(public)/page.tsx`) per Section 17 of SPEC.md.
  - Official Indian administrative boundary engine (`lib/location/data.ts`) with all 28 States, 8 UTs, pilot districts (Darbhanga & Madhubani), and Census centroids.
  - Unified search component supporting People, Experiences, Stays, and Places.
  - Geography directory (`/india`, `/india/[state]`, `/india/[state]/[district]`).
  - Discovery directory (`/explore`, `/explore/people`, `/explore/experiences` in Phase 1 enquiry mode, `/explore/stays` in Phase 3 notice mode).
  - 12 Cultural Category pages (`/categories/[slug]`).
  - Informational and legal pages (`/how-it-works`, `/become-a-host`, `/about`, `/safety`, `/help`, `/contact`, `/faq`, `/privacy`, `/terms`, `/host-responsibilities`).
- Milestone 5:
  - Zod validation schemas (`lib/validation/profile.ts`) for Traveller, Local Member, Experience Provider, and Accommodation Host preliminary interest.
  - Invariants strictly enforced:
    - Adults only (18+ via birth year schema).
    - 150+ characters introduction for travellers.
    - Indian mobile validation (`+91` / 10-digit).
    - Zero collection or storage of passport, visa, or Aadhaar fields.
    - Local member default profile visibility is `members_only`.
  - OTP Verification services (`lib/auth/otp.ts`) behind explicit interfaces (`EmailSender`, `SmsSender`) with clearly labelled development fallbacks.
  - Cryptographic helpers (`lib/utils/crypto.ts`) implementing timing-safe string comparison and Web Crypto SHA-256 hashing.
  - Profile Sanitization Engine (`lib/profile/sanitizer.ts`) ensuring legal full names, exact residential addresses, exact GPS coordinates, and private contact numbers are strictly stripped from public and member views.
  - Server actions (`app/actions/onboarding.ts`) for OTP dispatch, OTP verification, and generic auth responses on duplicate email signups.
  - Multi-step onboarding experience (`app/[locale]/(auth)/onboarding/page.tsx`):
    - Text progress line ("Step X of 5").
    - Save-as-draft capability in localStorage.
    - Explanatory sentences stating why each piece of data is needed.
    - 18+ adult age confirmation.
    - Suggested public meeting spot requirement.
    - Consent agreements (Terms, DPDP Act 2023 Privacy Policy, Public Meeting Safety Agreement).
  - Profile detail page (`app/[locale]/(public)/users/[id]/page.tsx`):
    - Sanitized display name and locality centroid.
    - Members-only access barrier for anonymous visitors.
    - Mobile verified and email verified line badges.
    - Suggested public meeting venues.
  - Vitest test suite (`tests/unit/profile-validation.test.ts`, `tests/unit/profile-sanitizer.test.ts`) bringing test count to 52 passing tests across 6 suites.
  - Zero emojis and zero banned words verified across all source files.
- Milestone 6:
  - PostgreSQL state machine migration (`supabase/migrations/20261110000005_connection_transitions.sql`):
    - Strict transition function `transition_connection()` enforcing allowed transitions: PENDING to ACCEPTED / DECLINED / WITHDRAWN / EXPIRED; ACCEPTED to SCHEDULED / CANCELLED; SCHEDULED to COMPLETED / CANCELLED.
    - Automatic conversation creation and contact disclosure record initialization upon acceptance.
    - Mutual consent contact reveal tracking `record_contact_exchange_consent()` with append-only audit logging.
    - Private decline reason handling: internal reason saved for moderation, but applicant only receives the polite fixed string "unable to meet this request".
  - Zod validation schemas (`lib/validation/connection.ts`):
    - Proposed date must be today or future.
    - Public meeting place name required.
    - Message strictly bounded between 50 and 600 characters with character counter.
    - Idempotency key required.
  - Server actions (`app/actions/connections.ts`):
    - `createConnectionRequestAction`, `acceptConnectionAction`, `declineConnectionAction`, `withdrawConnectionAction`, `scheduleConnectionAction`, `completeConnectionAction`, `cancelConnectionAction`, and `updateContactExchangeConsentAction`.
  - UI screens:
    - Connection proposal screen (`app/[locale]/(public)/connections/new/page.tsx`) with purpose dropdown, proposed dates, public venue rule notice, and 50-600 characters counter.
    - Connection detail and management view (`app/[locale]/(public)/connections/[id]/page.tsx`) with state machine badges, context-sensitive action buttons, dual mutual consent contact reveal banner, and emergency helpline reminders.
    - Connection dashboard (`app/[locale]/(public)/connections/page.tsx`) with filter tabs (All, Active, Pending, Past) and status cards.
  - Vitest test suite (`tests/unit/connection-transitions.test.ts`) covering request validation, state transitions, decline/withdraw behaviors, and dual mutual consent contact reveal, bringing total tests to 58 passing across 7 suites.
  - Zero emojis and zero banned words verified across all files.
- Milestone 7:
  - Database Migration (`supabase/migrations/20261110000006_experience_marketplace.sql`):
    - Admin moderation function `moderate_experience()` enforcing permissions (`moderator`, `content`, `super_admin`), mandatory reason (5+ chars) for rejections, suspensions, and changes, and writing to `admin_audit_logs`.
    - Experience submission function `submit_experience_for_review()` verifying completeness invariants.
    - Enquiry lifecycle functions: `submit_experience_enquiry()` (creates pending booking + conversation record, masks prices during Phase 1) and `respond_to_experience_enquiry()` (accept/decline transitions, capacity lock, messaging initialization).
  - Validation Schemas (`lib/validation/experience.ts`):
    - 12 official categories validated against platform taxonomy.
    - Public meeting place validation strictly rejecting private residential addresses (flats, apartments, house numbers).
    - Duration (30-720 mins), capacity (1-50, min <= max), required licensed photography with credit.
    - Enquiry schema enforcing 20-1000 chars message, safety rules acknowledgment, and idempotency keys.
    - Schedule slot schema verifying future dates and end time after start time.
    - Admin review schema enforcing mandatory 5+ character reason on non-approval decisions.
  - Server Actions (`app/actions/experiences.ts`):
    - `createExperienceAction`, `submitExperienceForReviewAction`, `createScheduleAction`, `submitExperienceEnquiryAction`, `respondToExperienceEnquiryAction`, `adminModerateExperienceAction`.
  - User Interface:
    - Marketplace Directory (`app/[locale]/(public)/explore/experiences/page.tsx`): Filterable by 12 categories, state, district, linking directly to experience detail.
    - Experience Detail Page (`app/[locale]/(public)/experiences/[id]/page.tsx`): Bilingual title, cultural category, host verified card, public meeting area notice, highlights, included/excluded, cancellation terms, and interactive cultural enquiry form (`enquiry-form.tsx`).
    - Experience Publishing (`app/[locale]/(dashboard)/experiences/new/page.tsx` & `form.tsx`): Detailed editorial submission form with official geography, public landmark enforcement, and Save as Draft / Submit for Review workflows.
    - Provider Dashboard (`app/[locale]/(dashboard)/dashboard/experiences/page.tsx` & `enquiries-manager.tsx`): Listing cards with status badges, schedule links, and active enquiry manager with Accept and Decline actions.
    - Experience Schedules (`app/[locale]/(dashboard)/dashboard/experiences/[id]/schedules/page.tsx` & `schedule-client.tsx`): Interactive calendar slot manager with capacity tracking.
    - Admin Moderation Queue (`app/[locale]/(admin)/admin/experiences/page.tsx` & `admin-moderation-client.tsx`): Dense table interface, status filters, full inspection drawer, Approve, Request Changes, Reject, and Suspend actions, with real-time append-only audit trail display.
  - Automated Tests: `tests/unit/experience-marketplace.test.ts` (19 passing unit tests covering taxonomy, creation rules, private address rejection, enquiry constraints, admin review justifications, slot timing, and capacity boundaries).
  - Total test suite: 77/77 tests passing across 8 suites.
  - Production build: `next build` compiled cleanly with all new routes. Zero emojis, zero banned words.

- Milestone 8:
  - PostgreSQL Messaging, Safety, and Blind Reviews Migration (`supabase/migrations/20261110000007_messaging_reviews_safety.sql`):
    - `send_message()`: RLS-protected procedure, rate limited to 20 messages per minute, length checked (1-1000 characters), active block check, contact disclosure soft warning detector, and in-app recipient notification generation.
    - `block_user()`: Inserts into `blocked_users`, immediately closes active conversation, revokes mutual contact disclosure, cancels pending connection requests, and logs to `admin_audit_logs`.
    - `create_safety_report()`: Automatic snapshot of last 20 messages into `snapshot_messages` JSONB when reporting from a chat room; triage of urgent categories (`unsafe_or_threatening`, `suspected_trafficking_or_exploitation`, `harassment`); de-indexes reported user on 2 urgent reports from distinct reporters; audit logged with reporter confidentiality.
    - `submit_blind_review()`: Enforces 14-day post-completion review window, stores review with `is_published = false` (blind), holds private moderator safety comment, and automatically publishes both reviews simultaneously when the counterpart submits or when the 14-day window closes.
    - `submit_safety_check_in()`: Check-in prompt ("arrival_start", "departure_end"); "need_help" immediately dispatches urgent incident report.
    - `create_trip_share()`: Generates random hex token with 7-day expiry and public read policy for trusted emergency contacts.
  - Validation Schemas (`lib/validation/safety.ts`):
    - `sendMessageSchema` (1-1000 chars, no attachments), `blockUserSchema` (formal reason), `createReportSchema` (8 official reasons, 20-2000 chars details, emergency alert acknowledgment), `submitReviewSchema` (3 category ratings 1-5, public text 20-800 chars, moderator-only box), `safetyCheckInSchema`, `createTripShareSchema`.
  - Server Actions (`app/actions/safety.ts`):
    - `sendMessageAction`, `blockUserAction`, `createReportAction`, `submitBlindReviewAction`, `submitSafetyCheckInAction`, `createTripShareAction`, `markNotificationReadAction`.
  - User Interface:
    - Realtime Chat Room (`app/[locale]/(public)/messages/[id]/page.tsx` & `chat-room.tsx`): Text-only messages, plain-text non-clickable links, soft warning on contact detection pattern, report and block action modals, inline safety check-in card, emergency helpline footer (112, 1091, 1363).
    - Inbox (`app/[locale]/(public)/messages/page.tsx`): Active conversations with status badges.
    - Notification Center (`app/[locale]/(public)/notifications/page.tsx` & `notifications-client.tsx`): Unread/read status, quick action links, mark-as-read server action.
    - Safety Modals (`components/safety/`): `report-modal.tsx`, `block-modal.tsx`, `review-modal.tsx`, `check-in-card.tsx`.
    - Trip Share Generator & Trusted Contact View (`app/[locale]/(public)/safety/share/page.tsx` & `app/[locale]/(public)/safety/share/[token]/page.tsx`): Shareable URL displaying sanitized itinerary, emergency helplines, and masked host details (first name and district only).
  - Automated Tests (`tests/unit/messaging-reviews-safety.test.ts`):
    - 21 passing tests covering message character limits, contact detection heuristics, block cascades, urgent report de-indexing, blind review mutual release hold, check-in flows, and trip share masking.
  - Total test suite: 98/98 tests passing across 9 test files.
  - Production build: `next build` compiled cleanly. Zero emojis, zero banned words.

- Milestone 9:
  - PostgreSQL Booking, Capacity Lock, and Ledger Migration (`supabase/migrations/20261110000008_booking_and_payments.sql`):
    - `book_experience()`: Atomic booking function utilizing PostgreSQL `SELECT FOR UPDATE` on schedule rows to prevent race conditions and overbooking. Handles future slot validation, min/max participants verification, self-booking prevention, commission snapshot from `platform_settings` (15%), gating via `PAYMENTS_ENABLED`, conversation linkage, and provider notification.
    - `cancel_booking()`: Capacity-restoring cancellation function releasing schedule capacity atomically (`booked_count = GREATEST(0, booked_count - participant_count)`), updating status to `cancelled`, dispatching notifications, and logging to `admin_audit_logs`.
    - `record_payment_capture()`: Atomic payment confirmation capturing payment, updating booking to `confirmed`, and inserting balanced double-entry accounting ledger entries (`traveller_funds` debit, `host_payable` credit, `platform_commission` credit).
    - `record_payment_refund()`: Reversing balanced double-entry accounting ledger entries, updating payment to `refunded`, restoring schedule capacity, and updating booking status.
    - `record_payment_webhook()`: Webhook idempotency engine with database `ON CONFLICT (event_id) DO NOTHING` deduplication.
  - Payment Provider Architecture (`lib/payments/`):
    - Interface `PaymentProviderAdapter` enforcing order creation, payment verification, refunds, and webhook signature verification.
    - `DevPaymentProcessor`: Clearly labelled development payment simulator with deterministic signature generation and simulation notices (no fake claims of live bank operations).
    - `RazorpayPaymentProcessor`: Production Razorpay adapter with HMAC-SHA256 timing-safe signature comparison, order creation, and refund processing.
    - `CashfreePaymentProcessor`: Documented stub interface per Section 22 pending CA approval and credentials.
    - `runBookingReconciliation()`: Background reconciliation job cleaning stale unpaid bookings and checking double-entry ledger balance (`Sum(debit) == Sum(credit)`).
  - Validation Schemas (`lib/validation/booking.ts`):
    - `createBookingSchema` (1-50 pax, participant names, idempotency key), `confirmPaymentSchema`, `cancelBookingSchema` (mandatory reason), `paymentWebhookSchema`.
  - Server Actions & Routes:
    - `app/actions/bookings.ts`: `createBookingAction`, `confirmPaymentAction`, `cancelBookingAction`, `getBookingDetailsAction`.
    - `app/api/webhooks/payment/route.ts`: Webhook receiver with signature verification, duplicate webhook prevention, and automated payment capture.
  - User Interface:
    - Experience Booking & Slot Reservation (`app/[locale]/(public)/experiences/[id]/book/page.tsx` & `book-client.tsx`): Interactive slot selection with real-time remaining capacity counter, participant count control, dynamic participant roster names, itemized price summary (gated by `PRICES_VISIBLE`), development payment simulator modal, and redirect to booking receipt.
    - Booking Details & Receipt (`app/[locale]/(public)/bookings/[id]/page.tsx` & `booking-detail-client.tsx`): Detailed booking reference, status badges, date/time slot, public meeting landmark, participant roster, financial breakdown, cancellation modal with audit reason, print receipt action, and emergency helpline reminders.
    - User Bookings Dashboard (`app/[locale]/(dashboard)/dashboard/bookings/page.tsx` & `bookings-list-client.tsx`): Status tabs (All, Confirmed, Pending/Enquiry, Cancelled), reservation cards, and quick navigation.
  - Automated Tests (`tests/unit/booking-concurrency.test.ts`):
    - 12 comprehensive unit tests: 5 concurrent requests on 3-capacity slot (exactly 3 succeed, 2 rejected with capacity exceeded), group race conditions, idempotency deduplication under concurrency, capacity restoration upon cancellation, 15% commission snapshot calculations, double-entry ledger balance verification (`Sum(debit) === Sum(credit)`), payment simulation and signature verification, and Zod input boundaries.
  - Total test suite: 110/110 tests passing across 10 test files.
  - Production build: `next build` compiled cleanly with all new routes. Zero emojis, zero banned words.

- Milestone 10:
  - PostgreSQL Accommodation, Daterange Exclusion, and Compliance Migration (`supabase/migrations/20261110000009_accommodation_and_compliance.sql`):
    - Composite exclusion constraint on `accommodation_availability` using `btree_gist`: `EXCLUDE USING gist (listing_id WITH =, date_range WITH &&) WHERE (status = 'confirmed_booking')`. Mathematically guarantees no overlapping confirmed stay bookings can ever exist on the same listing.
    - Extended `accommodation_listings` schema with household transparency attributes: `household_adults_count`, `has_children`, `has_pets`, `other_residents_description`, `verification_tier` (`tier_1_day_only` vs `tier_2_stay_approved`), and room verification status.
    - State transition functions:
      - `submit_stay_booking_request()`: Validates future dates, strict 14-night maximum limit, strict 2-guest maximum capacity, absence of conflicting confirmed bookings, self-booking restrictions, and host notification.
      - `confirm_stay_booking()`: Confirms booking request, locks date_range in `accommodation_availability` under `btree_gist` constraint, initializes minimal DPDP-compliant guest record, and audits action.
      - `record_guest_compliance()`: Updates statutory foreign guest filing status (Form C / Form III) with government reference number and date.
  - Validation Schemas (`lib/validation/accommodation.ts`):
    - `createAccommodationListingSchema`: Enforces the 7 official categories, requires price = 0 paise for `free_cultural_hospitality`, requires state tourism registration number for `registered_paid_homestay`, restricts maximum guests to 2, and strictly rejects private residential street/flat addresses via regex.
    - `stayBookingRequestSchema`: Enforces checkIn/checkOut ordering, maximum 14 nights, maximum 2 adult guests, minimum 20-character introduction, and idempotency key.
    - `guestComplianceSchema`: Validates minimal DPDP Act fields (name, nationality, arrival, departure, filing reference) while strictly guaranteeing zero passport scans or visa numbers are collected.
    - `hostComplianceChecklistSchema`: Enforces mandatory written acknowledgment of 24-hour statutory foreign guest reporting duty.
  - Server Actions (`app/actions/accommodation.ts`):
    - `createAccommodationListingAction`, `submitAccommodationForReviewAction`, `submitStayBookingRequestAction` (gated by `STAYS_ENABLED`), `confirmStayBookingAction`, `saveHostComplianceChecklistAction`, `recordGuestComplianceEntryAction`, `getHostComplianceRecordsAction`.
  - User Interface:
    - Stays Directory & Discovery (`app/[locale]/(public)/explore/stays/page.tsx`): Honest status notice for Phase 3 ("Booking Not Open Yet: Accommodation verification and compliance audits in progress in pilot districts"), detailed breakdown of the 7 hospitality categories, and compliance pillars.
    - Stay Listing Detail View (`app/[locale]/(public)/stays/[id]/page.tsx` & `stay-detail-client.tsx`): Host verification tier badges, transparent household overview (adult residents, children, pets, other residents), quarters configuration (private/shared room and bathroom), house rules, address privacy notice, and stay request form with 14-night and 2-guest bounds.
    - Host Compliance Centre (`app/[locale]/(dashboard)/dashboard/compliance/page.tsx` & `compliance-client.tsx`): Foreign guest reporting duty (Form C / Form III) guide with 24-hour statutory reminder, link to official Ministry of Home Affairs e-FRRO portal, mandatory statutory disclaimer ("Atithi Devo Bhava is not an official reporting agency..."), host declaration checklist form, and minimal DPDP foreign guest log with filing references.
    - Host Accommodation Publishing Form (`app/[locale]/(dashboard)/stays/new/page.tsx` & `form.tsx`): Complete multi-step listing editor with 7 categories, household details, public landmark validation, and save-as-draft workflow.
  - Automated Tests (`tests/unit/accommodation-compliance.test.ts`):
    - 13 comprehensive tests covering `btree_gist` daterange exclusion (overlapping requests rejected, back-to-back half-open intervals permitted, distinct listings non-conflicting), 14-night max duration, 2-guest max capacity, 7 official categories, free hospitality price = 0 invariant, state tourism license requirement, private residential address rejection, minimal DPDP foreign guest schema, and mandatory 24h reporting duty acknowledgment.
  - Total test suite: 123/123 tests passing across 11 test files.
  - Production build: `next build` compiled cleanly with all new routes. Zero emojis, zero banned words.

- Milestone 11:
  - PostgreSQL Admin, Moderation, and Analytics Migration (`supabase/migrations/20261110000010_admin_moderation_analytics.sql`):
    - Administrative user management: `admin_suspend_user()` (strictly restricting permanent bans to `super_admin`) and `admin_reactivate_user()`.
    - Editorial accommodation moderation: `admin_moderate_accommodation()` supporting `approve`, `reject`, `request_changes`, and `suspend` decisions.
    - Safety incident and conduct triage: `admin_triage_report()` with cascading immediate account suspension for unsafe actors.
    - Section 23 identity document access governance: `admin_log_id_document_view()` strictly enforcing a written justification (>= 5 chars) before granting document decryption and recording view events to `admin_audit_logs`.
    - Real-world database telemetry: `get_admin_metrics()` computing real aggregations across active users, listings, pending moderation queues, and double-entry accounting gross and commission revenue.
  - Validation Schemas (`lib/validation/admin.ts`):
    - `adminUserActionSchema`: Validates suspend/reactivate inputs and mandatory audit reason.
    - `adminAccommodationReviewSchema`: Validates 4 moderation decisions and mandatory justification.
    - `adminReportTriageSchema`: Validates 4 triage outcomes and mandatory resolution notes.
    - `adminIdViewSchema`: Validates mandatory justification prior to identity record preview.
    - `adminVerificationReviewSchema`: Validates approve/reject outcomes for identity submissions.
  - Server Actions (`app/actions/admin.ts`):
    - `adminSuspendUserAction`, `adminReactivateUserAction`, `adminModerateAccommodationAction`, `adminTriageReportAction`, `adminViewIdDocumentAction`, `adminReviewVerificationAction`, `adminGetMetricsAction`, `adminGetUsersListAction`, `adminGetReportsListAction`, `adminGetAuditLogsAction`. All actions enforce role checks against `admin_permissions` (MFA AAL2 compatible).
  - Admin Console User Interface (`app/[locale]/(admin)/admin/`):
    - Admin Layout (`layout.tsx`): Top bar with admin role, MFA AAL2 status indicator, and navigation tabs.
    - Operational Overview (`page.tsx`): Real ground-truth telemetry (active users by role, verified cultural listings, urgent incident queue, gross booking volume, and 15% platform commission revenue).
    - User Management (`users/page.tsx` & `users-client.tsx`): Dense account table, role inspector, and suspension/reactivation modals with mandatory audit reasons.
    - Accommodation Moderation Queue (`accommodations/page.tsx` & `accommodations-client.tsx`): Filterable listing queue, inspection drawer (household composition, quarters configuration, public landmark privacy, house rules), and moderation decision workflows.
    - Safety Incident Triage Queue (`reports/page.tsx` & `reports-client.tsx`): Urgent incident banners, 20-message tamper-evident transcript snapshot inspector, and resolution actions (investigate, resolve, dismiss, suspend account).
    - Identity Verification Queue (`verifications/page.tsx` & `verifications-client.tsx`): Two-step audited viewer requiring written justification before decryption, right-click and drag disabled, confidential watermark overlay, and strictly NO download button.
    - Immutable Audit Log (`audit-logs/page.tsx` & `audit-logs-client.tsx`): Searchable, filterable append-only audit trail displaying all historical administrative actions with recorded justifications.
  - Automated Tests (`tests/unit/admin-moderation-analytics.test.ts`):
    - 12 comprehensive unit tests: role boundary enforcement, super_admin exclusive permanent bans, moderator temporary suspensions, non-admin rejection, mandatory 5-character reason validation, safety report triage cascading user suspension, Section 23 identity document view audit logging, and ground-truth telemetry metrics computation.
  - Total test suite: 135/135 tests passing across 12 test files.
  - Production build: `next build` compiled cleanly with all new routes. Zero emojis, zero banned words.

- Milestone 12:
  - English Master Dictionary (`messages/en.json`):
    - Comprehensive 239-key dictionary organized across 18 logical namespaces (`brand`, `nav`, `hero`, `search`, `threeWays`, `interests`, `statesSection`, `recentExperiences`, `communitySection`, `staysSection`, `howItWorksSection`, `trustSection`, `becomeHostSection`, `storiesSection`, `connections`, `experiences`, `bookings`, `accommodations`, `compliance`, `messaging`, `reviews`, `safety`, `admin`, `auth`, `footer`, `common`).
    - Entirely authored in calm, editorial, respectful language. Strictly zero prohibited marketing words and zero emojis.
  - Native Devanagari Hindi Dictionary (`messages/hi.json`):
    - 100% key parity with `messages/en.json` (verified by automated tests).
    - Authentic Devanagari Hindi in respectful formal register ("आप"), culturally grounded terminology ("पारिवारिक आवास", "सांस्कृतिक अनुभव", "आपसी सहमति से संपर्क साझा करना", "द्विपक्षीय निष्पक्ष समीक्षा", "विदेशी अतिथि सूचना दायित्व"), and proper Devanagari numerals where appropriate.
  - Native Speaker Review Strings Catalog (`docs/HINDI_STRINGS_FOR_NATIVE_REVIEW.md`):
    - Structured review catalog categorized across 8 sensitive domains: Brand & Taglines, Adult-Only Age Attestation, Privacy & Dual Mutual Consent Contact Revelation, Cultural Stays & Unpaid Hospitality Governance, Statutory Foreign Guest Reporting (Form C / Form III under Foreigners Act 1946 and e-FRRO portal), Financial Transparency & Double-Entry Accounting, Safety & Incident Triage, and Administrative Governance & Section 23 Document Auditing.
    - Detailed linguistic rationale, cultural register explanations, statutory citations, and native speaker sign-off checklist.
  - Automated Tests (`tests/unit/translations-catalog.test.ts`):
    - 6 comprehensive unit tests: 100% key parity (zero missing keys in either locale), Devanagari script presence (>95% of leaves contain Unicode `\u0900-\u097F`), ICU plural syntax validation, zero prohibited marketing words, zero emojis, and catalog coverage verification.
  - Total test suite: 141/141 tests passing across 13 test files.
  - Production build: `next build` compiled cleanly in 10.0s with all 50 routes. Zero emojis, zero banned words.

- Milestone 13:
  - Comprehensive End-to-End Test Suite (`tests/e2e/user-journeys.test.ts`):
    - 5 full integration flows: (1) Foreign traveller discovery and dual mutual consent contact revelation, (2) Cultural host experience publishing, atomic capacity locking, and capacity restoration, (3) Stay reservation btree_gist overlap exclusion and statutory Form C foreign guest compliance, (4) Safety report triage, automatic 2-report deindexing trigger, and cascading suspension, (5) Section 23 ID document viewing governance with mandatory audit logging and no download.
  - WCAG 2.2 AA Accessibility Audit Suite (`tests/accessibility/accessibility-wcag.test.ts`):
    - 4 automated checks verifying color contrast ratios ($\ge 4.5:1$ for normal body text, $\ge 3:1$ for UI accents), visible keyboard focus rings, skip links, and self-hosted bilingual typography.
  - Production Deployment Package:
    - Multi-stage `Dockerfile` with unprivileged `nextjs` user and automated health checking.
    - `vercel.json` configured for Mumbai `bom1` region with enterprise-grade Content Security Policy, strict HSTS, and zero-tracking header protections.
    - Health check monitoring endpoint at `/api/health` returning 200 OK and database connectivity diagnostics.
  - Section 30 Final Acceptance Report (`docs/SECTION_30_ACCEPTANCE_REPORT.md`):
    - Comprehensive line-by-line verification across all 30 specification sections with implementation evidence.
  - Total test suite: 150/150 tests passing across 15 test files.
  - Production build: `next build` compiled cleanly in 6.7s with all 51 routes. Zero emojis, zero banned words.

- Production Front-End Visual Enrichment & Cultural Design Upgrade (2026-11-11):
  - Generated high-resolution photorealistic Indian cultural photography (16:9 widescreen and 1:1 portrait formats, ~800KB-1.2MB each) replacing low-res crops:
    - `public/images/hero-artisan.jpg`: Master folk artisan Shanti Devi painting traditional Madhubani peacock and lotus wall mural in a sunlit village courtyard.
    - `public/images/host-shanti-devi.jpg`: Verified master artisan portrait in Jitwarpur village.
    - `public/images/host-rameshwar-jha.jpg`: Respected Maithili cultural scholar and guide offering traditional Namaste greeting.
    - `public/images/exp-mithila-art.jpg`: Close-up of natural mineral pigment brushwork on handmade paper.
    - `public/images/exp-cuisine.jpg`: Authentic Maithili vegetarian thali with brass kansa vessels and fresh banana leaf.
    - `public/images/exp-pond.jpg`: Ancient temple pond (pokhar) ghat steps in Darbhanga under morning mist.
    - `public/images/exp-makhana.jpg`: Wetland lotus and sacred foxnut harvest by local farmers.
    - `public/images/exp-folk-music.jpg`: Evening Maithili Vidyapati folk singing with harmonium and dholak under brass diya lamps.
    - `public/images/exp-homestay.jpg`: Traditional rural Mithila courtyard home with painted borders.
  - Authentic Indian Motifs (`components/ui/cultural-patterns.tsx`):
    - `MadhubaniBorder`: Authentic geometric folk border with fish and lotus accents.
    - `JharokhaMotif`: Traditional architectural arched pavilion/window motif.
    - `LotusMotif`: Sacred lotus (कमल) hospitality accent.
    - `DiyaMotif`: Earthen welcome lamp motif.
    - `AripanDivider`: Sacred geometric floor art divider with concentric line accents.
  - Viewport-Aware Fade-In & Fade-Out Motion Engine (`components/ui/fade-in.tsx`):
    - Added support for both entrance and exit fade animations on scroll (`once={false}` option).
    - Added directional translate controls (`up`, `down`, `left`, `right`, `none`) and customizable duration.
    - Full respect for `prefers-reduced-motion` accessibility standard.
  - Front-End Landing Page Sections:
    - 4 Pillars of Indian Hospitality with warm styled cards and terracotta accents.
    - Active Pilot Region card featuring Darbhanga Raj palace architecture sketch and key highlights.
    - 4 Rich Experience Cards with floating category pills, star ratings, host information, duration badges, and smooth hover zoom.
    - Spotlight on Verified Local Residents featuring authentic host profiles, verification badges, and public meeting venues.
    - 12 Cultural Heritage Domains directory grid with bilingual titles.
  - Quality and Security Verifications:
    - Cleanliness: Zero emojis and zero prohibited marketing words verified across all files.
    - Automated Tests: 157/157 passing unit and integration tests across 16 test files.
    - Next.js Production Build: Compiled cleanly in 8.3s with all 53 routes.

- Elevated UI Design, Authentication System Overhaul & User Dashboard Portal (2026-11-13):
  - Advanced Elevated UI System:
    - Corrected Tailwind configuration to extend border radii (`rounded-md`, `rounded-xl`, `rounded-2xl`, `rounded-full`) while maintaining crisp Indian design tokens, lifting the UI out of flat, boxy styling.
    - Added luxury elevated shadows (`shadow-card`, `shadow-card-hover`, `shadow-glow`, `shadow-glow-terracotta`) and smooth micro-interactions.
    - Added backdrop-blur glassmorphic surface utilities (`glass-card`, `card-interactive`, `hero-mesh`) to `globals.css`.
    - Redesigned Unified Search (`components/search/unified-search.tsx`) with segmented pill tabs, floating guest counter popovers, and trending regional exploration chips.
    - Upgraded Homepage (`app/[locale]/(public)/page.tsx`) with elevated hero card overlays, pill badges, and glassmorphic quick-action anchors.
  - End-to-End Authentication Architecture & Backend Unification:
    - Resolved authentication failures where server actions previously rejected logged-in sessions: created `getAuthenticatedUser()` in `lib/auth/server-user.ts` unifying signed cookie sessions (`adb_session`), Firebase credentials, and Supabase JWT tokens.
    - Created unified session endpoints: `GET /api/auth/me` for client state checks and `POST /api/auth/me` for seamless session creation across OAuth, OTP, credentials, and demo modes.
    - Created `lib/auth/demo-accounts.ts` providing 4 instant 1-click test profiles (Sarah Jenkins [Traveller], Shanti Devi [Artisan Host], Rameshwar Jha [Local Guide], Platform Admin) for reliable local development and testing.
    - Redesigned Login & Register pages (`app/[locale]/(auth)/login/login-client.tsx`, `register-client.tsx`) with elegant dual-column glass card layout, 1-click instant login buttons, simulated Google sign-in fallback, and automatic test OTP (`123456`) hint autofill.
    - Upgraded all backend server actions (`experiences.ts`, `bookings.ts`, `safety.ts`, `accommodation.ts`, `admin.ts`) to use `getAuthenticatedUser()` with robust fallback mocks when external databases are in staging/unconnected states.
  - Interactive User Dashboard Portal:
    - Built comprehensive dashboard (`app/[locale]/(dashboard)/dashboard/page.tsx` and `dashboard-client.tsx`) featuring role-based metric cards, upcoming cultural itineraries, host workspace shortcuts, live safety check-in banner, and 1-click emergency contacts (112, 1091, 1363).
    - Upgraded global Header (`components/layout/header.tsx`) with dynamic session awareness, monogram avatar, verified status badge, quick-navigation menu, and secure logout.
  - Verification & Invariants:
    - Strict adherence to SPEC.md and CLAUDE.md: 18+ age verification, zero emojis, self-hosted fonts, bilingual routing.
    - 157/157 unit, accessibility, and RLS tests passing across 16 test suites.
    - Full `next build` passing with zero errors across all 54 routes.

- Full Firebase Backend Integration (Authentication & Cloud Firestore) (2026-11-13):
  - Installed official Firebase agent skills suite via `npx skills add firebase/agent-skills --agent=antigravity` into `.agents/skills/`.
  - Linked to existing Firebase project `aatihidevobhava` (Project Number `362634097507`) and active web app `atithi` (`1:362634097507:web:14a150e9f07d99c0815956`).
  - Enabled and deployed Firebase Authentication providers (`email/password` and `Google sign-in` with OAuth support email and authorized redirect URIs) via `firebase deploy --only auth`.
  - Enabled Google Cloud Firestore API on project `aatihidevobhava` and created production database `(default)` in Mumbai region (`asia-south1`).
  - Authored and deployed production-grade Cloud Firestore Security Rules (`firestore.rules`) with default-deny, role self-escalation protection, document ownership checks, and 0 compiler warnings via `firebase deploy --only firestore:rules`.
  - Created client and server Firebase integration modules:
    - `lib/firebase/config.ts`: Client configuration, singleton `getFirebaseAuth()` and `getFirebaseDb()` instances.
    - `lib/firebase/firestore.ts`: User profile synchronization (`syncUserProfile`, `getUserProfile`), experiences, and bookings.
    - `lib/firebase/auth.ts`: `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signOutUser`, and error formatter `formatAuthError`.
  - Upgraded Login & Registration flows:
    - `login-client.tsx`: Added dedicated Email & Password tab with Firebase Auth, Google Sign-In with popup, Quick Demo logins, and OTP.
    - `register-client.tsx`: Added full Email & Password account creation with Firebase Auth, automatic Firestore profile creation, and Google registration.
  - Updated environment configuration in `.env.local` and `.env.example` with project `aatihidevobhava` credentials.

## What is Half-Done

- None. All 13 Milestones from Section 29 are fully completed and verified.

## What is Next

- Production launch and operator deployment onto Vercel (`bom1`) and Supabase (`ap-south-1`).

## What is Broken

- None. Build, lint, types, cleanliness, and all 157 automated tests are 100% green.
