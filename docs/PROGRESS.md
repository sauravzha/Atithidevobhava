# Project Progress: Atithi Devo Bhava (अतिथि देवो भवः)

Last Updated: 2026-11-10
Current Milestone: Milestone 9 - Booking and Payment Architecture (Phase 2 behind flags)

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
  Status: Ready to Start (Waiting for user confirmation to continue)
- Milestone 9: Booking and Payment Architecture (Phase 2 behind flags), book_experience() Concurrency Tests
  Status: Not Started
- Milestone 10: Accommodation and Compliance Module (Phase 3 behind flags, Form C / Form III, btree_gist overlap exclusion)
  Status: Not Started
- Milestone 11: Admin, Moderation, and Analytics Systems (Audit logging, Viewer without download, Real metrics)
  Status: Not Started
- Milestone 12: Complete Hindi and English Translations, Native Review Strings Catalog
  Status: Not Started
- Milestone 13: End-to-End Verification, Performance, Axe Accessibility, Lighthouse, Production Deployment Package
  Status: Not Started

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

## What is Half-Done
- Milestone 9 complete; awaiting user confirmation ("continue") to begin Milestone 10.

## What is Next
- Milestone 10: Accommodation and Compliance Module (Phase 3 behind flag `STAYS_ENABLED`), accommodation listings, room availability calendar with PostgreSQL `btree_gist` daterange exclusion constraint to prevent overlapping stay bookings, Form C / Form III foreign guest registration compliance centre, and host compliance checklist.

## What is Broken
- None. Build, lint, types, and all 110 tests are 100% green.
