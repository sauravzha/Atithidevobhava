# Project Progress: Atithi Devo Bhava (अतिथि देवो भवः)

Last Updated: 2026-11-10
Current Milestone: Milestone 7 - Experience Marketplace, Provider Dashboard, Admin Approval (Enquiry Mode)

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
  Status: Ready to Start (Waiting for user confirmation to continue)
- Milestone 8: Messaging (Realtime), Notifications, Reviews (Blind), Safety Tools (Reports, Blocks, Check-ins, Trip Share, Help Page)
  Status: Not Started
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

## What is Half-Done
- Milestone 7 complete; awaiting user confirmation ("continue") to begin Milestone 8.

## What is Next
- Milestone 8: Messaging (Supabase Realtime text-only, no attachments, links as plain text), Notifications center, Blind reviews (14-day hold or mutual submit), and Safety tools (report modal with 20-message transcript snapshot, block user, safety check-in, trip share, Help center).

## What is Broken
- None. Build, lint, types, and all 77 tests are 100% green.
