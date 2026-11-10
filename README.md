# Atithi Devo Bhava (अतिथि देवो भवः)

> "Experience India through its people."
> "भारत को लोगों के साथ महसूस कीजिए।"
> Meet locals. Explore cultures. Experience Indian hospitality.

Atithi Devo Bhava is a production-oriented, three-sided cultural hospitality and experience platform connecting international travellers with Indian residents, families, artisans, and communities. The platform provides three interconnected tiers:
1. Meet a Local: Non-commercial cultural connections (tea, neighbourhood walks, language exchange).
2. Explore with a Local: Listed cultural experiences run directly by residents and artisans (cooking, traditional crafts, heritage walks, music, festivals).
3. Stay with a Local: Homestay and residential cultural hospitality with rigorous Tier 2 verification and compliance controls (Phase 3).

---

## Production Hosting Warning

Before deploying to production, verify hosting tier terms and service level agreements:
- Data Residency: Database must reside in the Mumbai region (ap-south-1) and application edge must run in Mumbai (bom1) to ensure optimal latency and Indian data sovereignty compliance.
- Plan Limits: Free tiers on cloud platforms often enforce hard concurrency limits, pause inactive compute instances, exclude automated backups, and prohibit commercial transactions. Ensure production utilizes paid enterprise or pro tiers with automated point-in-time recovery (PITR) and high-availability backups.

---

## Core Technical Stack

- Frontend Framework: Next.js (App Router), React, TypeScript strict mode.
- Design System: Custom editorial styling via Tailwind CSS (Kinfolk/Monocle restraint, 1px ruled borders, 12-column grid, no default component-library look, zero emojis, zero gradients).
- Fonts: Self-hosted via `@fontsource` (Newsreader, Tiro Devanagari Hindi, IBM Plex Sans, IBM Plex Sans Devanagari).
- Icons: Lucide icons (stroke width 1.5, strictly semantic).
- Database & Backend: Supabase PostgreSQL 15+ in Mumbai (ap-south-1). Extensions: `postgis`, `pg_trgm`, `unaccent`, `btree_gist`, `pgcrypto`, `pg_cron`.
- Security: Nonce-based Content Security Policy (CSP), strict Row Level Security (RLS) on all tables, encrypted contact exchange via `pgcrypto`, immutable audit logs.
- Localization: Bilingual with `next-intl` (English default, Hindi at `/hi`).
- Forms & Validation: React Hook Form + Zod.
- Testing: Vitest (unit/integration), pgTAP (database RLS), Playwright (end-to-end), axe-core (WCAG 2.2 AA).

---

## Pilot Region: Darbhanga and Madhubani (Bihar)

The initial platform pilot focuses on the Mithila cultural belt in Northern Bihar (Darbhanga and Madhubani districts). Real cultural experiences and local community connections spotlight traditional Mithila painting, Maithili culinary traditions, local village architecture, and pond heritage.

---

## Feature Flags and Phased Rollout

All features are built into the architecture, gated by server-controlled flags in `platform_settings`:
- Phase 1 (Active at launch): User registration, traveller/local profiles, location discovery, Meet a Local, Explore with a Local (enquiry mode only; no prices displayed; no payments), private messaging, blind reviews, safety tooling, admin moderation.
- Phase 2 (`PRICES_VISIBLE=false`, `PAYMENTS_ENABLED=false`): Experience pricing display, online calendar booking, Razorpay integration, double-entry ledger, payouts.
- Phase 3 (`STAYS_ENABLED=false`): Accommodation listings, Tier 2 host verification, mathematical overlap exclusion (`btree_gist`), foreigner reporting compliance centre (Form C / Form III).

---

## Repository Documentation Index

All technical, legal, and operational manuals are maintained in the `/docs` directory:
- `docs/SPEC.md`: Complete master specification and prompt rules.
- `CLAUDE.md`: Standing operational rules and safety boundaries.
- `docs/IMPLEMENTATION_PLAN.md`: Comprehensive 13-milestone engineering roadmap.
- `docs/PROGRESS.md`: Live milestone status and progress tracking.
- `docs/DECISIONS.md`: Architectural decisions log and rationales.
- `docs/RISKS.md`: Strategic, technical, safety, and legal risk register.
- `docs/THREAT_MODEL.md`: Abuse case analysis (STRIDE) and counter-mitigations.
- `docs/PERMISSIONS.md`: Role and permission matrix across all 7 user and admin roles.
- `docs/PRIVACY_DATA_MAP.md`: Field-by-field DPDP Act data inventory and retention periods.
- `docs/LEGAL_CHECKLIST.md`: Legal counsel and Chartered Accountant review questions.
- `docs/USER_JOURNEYS.md`: End-to-end workflows for travellers, locals, providers, and admins.
- `docs/MODERATOR_HANDBOOK.md`: Safety incident handling and moderation operations manual.
- `docs/RUNBOOK.md`: Deployment, migrations, maintenance cron jobs, and disaster recovery.
- `docs/API.md`: Server actions, protected endpoints, sanitized views, and webhooks.

---

## Local Development Quickstart

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Configure local environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run migrations and start Supabase:
   ```bash
   npx supabase start
   npx supabase db push
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` for English and `http://localhost:3000/hi` for Hindi.
   Visit `http://localhost:3000/dev/type` to test typography and `http://localhost:3000/dev/components` to view the component catalog and contrast table.
