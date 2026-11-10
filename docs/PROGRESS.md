# Project Progress: Atithi Devo Bhava (अतिथि देवो भवः)

Last Updated: 2026-11-10
Current Milestone: Milestone 4 - Public Shell, Homepage, Geography Discovery, and Category Discovery

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
  Status: Ready to Start (Waiting for user confirmation to continue)
- Milestone 6: Meet a Local, Connection Management, Database Transition Functions, Contact Exchange Engine
  Status: Not Started
- Milestone 7: Experience Marketplace, Provider Dashboard, Admin Approval (Enquiry Mode)
  Status: Not Started
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

## What is Done (Milestones 1, 2, 3, & 4)
- Milestone 1:
  - Verified development environment (Node v24.11.0, npm 11.6.2, git 2.51.2).
  - Initialized git repository.
  - Authored docs/SPEC.md, CLAUDE.md, docs/PROGRESS.md, docs/DECISIONS.md, docs/IDEAS.md.
  - Authored docs/IMPLEMENTATION_PLAN.md, docs/RISKS.md, docs/THREAT_MODEL.md, docs/PERMISSIONS.md, docs/PRIVACY_DATA_MAP.md, docs/LEGAL_CHECKLIST.md, docs/USER_JOURNEYS.md, docs/MODERATOR_HANDBOOK.md, docs/RUNBOOK.md, docs/API.md, README.md, .env.example.
- Milestone 2:
  - Scaffolded Next.js App Router application with strict TypeScript and custom Tailwind configuration.
  - Installed and configured self-hosted fontsource packages: Newsreader, Tiro Devanagari Hindi, IBM Plex Sans, IBM Plex Sans Devanagari.
  - Authored global CSS (app/globals.css) with light (Ivory/Charcoal/Forest/Terracotta) and dark (Paper/Text/Green/Terracotta) CSS variable palettes, 3px border radius, 12-column grid, and focus rings.
  - Built 18 accessible editorial UI components in components/ui/ (Bi, Button, Field, OtpInput, Select, RuledTable, ListingRow, PersonRow, StatusLabel, VerificationLabel, Notice, Toast, Dialog, CalendarRange, PhotoUploader, MapView, ConsentBanner, Figure).
  - Created Typography and Devanagari Testing Laboratory at app/[locale]/dev/type/page.tsx testing conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध), matras, numerals, and mixed baselines at 320px, 768px, 1280px.
  - Created Design System Component Showcase and Contrast Table at app/[locale]/dev/components/page.tsx.
  - Implemented automated WCAG 2.2 AA relative luminance and contrast engine in lib/contrast.ts.
  - Authored 23 automated unit and component tests in tests/unit/ passing cleanly with Vitest.
- Milestone 3:
  - Configured Supabase infrastructure in Mumbai region (ap-south-1) with extensions (postgis, pg_trgm, unaccent, btree_gist, pgcrypto).
  - Created complete database schema migration (supabase/migrations/20261110000001_initial_schema.sql) defining 45+ tables, foreign keys, CHECK constraints, and performance indexes.
  - Created database functions and triggers (supabase/migrations/20261110000002_functions_and_triggers.sql):
    - Append-only trigger trg_prevent_audit_log_mutation() prohibiting UPDATE and DELETE on admin_audit_logs.
    - Authoritative contact revelation function can_reveal() enforcing mutual consent, block revocation, and 72-hour address lock.
    - Atomic booking transaction book_experience() with SELECT FOR UPDATE capacity locking and idempotency protection.
    - Two-report automatic de-indexing trigger trg_urgent_reports_deindex().
  - Enabled Row Level Security (RLS) on all tables with default-deny policies (supabase/migrations/20261110000003_row_level_security.sql).
  - Created sanitized public views v_public_people, v_public_experiences, and v_public_locations (supabase/migrations/20261110000004_public_views.sql) projecting strictly non-sensitive attributes.
  - Seeded default platform feature flags and commission rates (supabase/seed/seed_platform_settings.sql).
  - Seeded official Indian geography with all 28 States and 8 Union Territories and pilot districts (supabase/seed/seed_locations.sql).
  - Seeded 12 cultural experience categories and official Indian languages (supabase/seed/seed_taxonomy.sql).
  - Implemented browser client (lib/supabase/client.ts), SSR server client (lib/supabase/server.ts), administrative service-role client (lib/supabase/admin.ts), and feature flags engine (lib/supabase/flags.ts).
  - Generated complete TypeScript schema types (types/database.ts).
  - Authored 13 automated RLS & database security tests in tests/rls/rls_security.test.ts (36 total tests passing).
- Milestone 4:
  - Bilingual public shell with next-intl (English default at `/`, Hindi at `/hi`).
  - Next.js middleware with strict security headers (HSTS 2 years, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy, COOP, CORP).
  - Bilingual header with two-line navigation, language switcher (`EN` / `हिन्दी`), theme switcher, and accessible mobile drawer.
  - Bilingual editorial footer with 4-column directory, Indian emergency numbers, and "No ads. No tracking." declaration.
  - 10-section text-led Homepage (`app/[locale]/(public)/page.tsx`) per Section 17 of SPEC.md.
  - Official Indian administrative boundary engine (`lib/location/data.ts`) with all 28 States, 8 UTs, pilot districts, and Census centroids.
  - Unified search component (`components/search/unified-search.tsx`) supporting People, Experiences, Stays, and Places with dynamic cascading dropdowns.
  - Geography directory:
    - `/india`: Complete index of 28 States & 8 Union Territories with pilot spotlight.
    - `/india/[state]`: State landing page (e.g. `/india/bihar`) with district index, cultural profiles, and LGD codes.
    - `/india/[state]/[district]`: District landing page (e.g. `/india/bihar/darbhanga`, `/india/bihar/madhubani`) with urban bodies, culture profiles, and centroid coordinates.
  - Discovery directory:
    - `/explore`: Unified exploration hub with search, pillar links, and category directory.
    - `/explore/people`: Product A (Meet a Local) directory with verified pilot resident profiles, language badges, and public meeting spot recommendations.
    - `/explore/experiences`: Product B (Explore with a Local) directory in Phase 1 ENQUIRY-ONLY mode (no prices displayed, no payment gateway invoked).
    - `/explore/stays`: Product C (Stay with a Local) directory with honest "Not open yet" Phase 3 notice and compliance framework explanation.
  - 12 Cultural Category pages:
    - `/categories/[slug]`: Dedicated landing pages for all 12 cultural categories with pilot highlights and listed experiences.
  - Complete Informational and Legal pages:
    - `/how-it-works`: Editorial walkthrough of Meet a Local, Explore with a Local, and Stay with a Local.
    - `/become-a-host`: Onboarding guide and criteria for local residents, artisans, and families.
    - `/about`: Non-commercial founding philosophy, Sanskrit origin, and Mithila pilot context.
    - `/safety`: Comprehensive safety protocol, public venue mandate, mutual consent contact reveal, and emergency helplines.
    - `/help`: Categorized help center with emergency callout accessible without JavaScript.
    - `/contact`: Support inquiry form and Resident Grievance Officer details under Indian IT Rules 2021.
    - `/faq`: Categorized FAQs for Travellers, Local Residents, Safety, and Platform Ethics.
    - `/privacy`: Full Privacy Policy compliant with India's DPDP Act 2023 (zero ad trackers, no Aadhaar/passport storage, data minimization).
    - `/terms`: Terms of Service enforcing 18+ strict requirement, zero harassment tolerance, and two-report automated search de-indexing.
    - `/host-responsibilities`: Legal and cultural obligations for hosts in India.
  - Tests & Verification:
    - 43 automated tests passing cleanly with Vitest (unit contrast, unit components, unit geography, and RLS security).
    - Production build compiles cleanly with zero errors across all routes.
    - Zero emojis and zero banned words across all application files.

## What is Half-Done
- Milestone 4 complete; awaiting user confirmation ("continue") to begin Milestone 5.

## What is Next
- Milestone 5: Traveller and local profiles, multi-step onboarding, visibility controls, and verification flow.

## What is Broken
- None. Build, lint, types, and all 43 tests are 100% green.
