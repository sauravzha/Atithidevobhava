# Architectural and Operational Decisions (DECISIONS.md)

This log records locked decisions, sensible defaults adopted where the specification allows discretion, alternatives evaluated, and the rationale for each choice.

## Locked Architectural Decisions

### 1. Framework and Runtime
- Decision: Next.js 14+ (App Router), React 18/19, TypeScript in strict mode, Node.js 24 runtime.
- Alternatives Considered: Remix, Astro, SvelteKit.
- Reason: Strict specification requirement. App Router provides native streaming, server actions, route handlers, and edge/node runtime flexibility on Vercel bom1.

### 2. Database and State Store
- Decision: Supabase PostgreSQL 15+ hosted in ap-south-1 (Mumbai). Required extensions: `postgis`, `pg_trgm`, `unaccent`, `btree_gist`, `pgcrypto`, `pg_cron`.
- Alternatives Considered: Neon, AWS RDS, CockroachDB.
- Reason: Strict specification requirement. Supabase provides managed PostgreSQL, Row-Level Security (RLS), Realtime subscriptions for secure messaging, and Storage with private buckets.

### 3. Styling and Design System
- Decision: Tailwind CSS with custom editorial configuration (Kinfolk/Monocle restraint, boutique hospitality). No default component library styles; bespoke components based on editorial grid and 1px ruled borders. Lucide icons (stroke width 1.5, strictly semantic).
- Palette: Light mode (Ivory `#F7F5F0`, Charcoal `#252723`, Forest Green `#596B57`, Terracotta `#A45E46`, Warm Grey `#E9E5DE`, Secondary `#66655F`). Dark mode (Paper `#141613`, Text `#ECE9E2`, Rule `#2E302B`, Green `#8FA88C`, Terracotta `#D08A6E`).
- Fonts: Self-hosted via `@fontsource`. Headings: Newsreader, Tiro Devanagari Hindi. Body/UI: IBM Plex Sans, IBM Plex Sans Devanagari.
- Alternatives Considered: Tailwind default palette, Shadcn default UI, Google Fonts CDN.
- Reason: Strict specification ban on CDNs, default shadcn looks, AI-generated aesthetic clichés, gradients, floating blobs, or emojis.

### 4. Internationalization and Routing
- Decision: `next-intl` with English default (no prefix) and Hindi at `/hi`. Bilingual headings throughout (Hindi primary, English subtitle). Natural spoken Hindi, not literal machine translation.
- Alternatives Considered: i18next, react-intl.
- Reason: First-class App Router integration, server-component support, clean URL routing, and metadata/hreflang handling.

### 5. Identity, Privacy, and DPDP Compliance
- Decision: Adults only (18+). No minors. No Aadhaar numbers stored under any circumstances (masked image reviewed and permanently deleted within 7 days). No passport or visa scans stored.
- Data Model: Contact details encrypted at rest using `pgcrypto`. Dual mutual consent gating via PostgreSQL function `can_reveal()`.
- Audit Logging: Append-only `admin_audit_logs` protected by PostgreSQL trigger preventing UPDATE and DELETE.
- Alternatives Considered: Plaintext database columns, client-side gating.
- Reason: Security in depth, legal compliance with India DPDP Act 2023, and protection against stalking and romance scam patterns.

### 6. Provider Integrations and Fallbacks
- Decision: Every credential-requiring provider (SMS, Email, Maps, Payments, Translation) is wrapped behind a TypeScript interface with a clearly labelled development provider:
  - SMS: `SmsProvider` interface -> `DltSmsProvider` (production) and `DevSmsProvider` (development logging).
  - Email: `EmailProvider` interface -> `ResendEmailProvider` (production) and `DevEmailProvider` (development logging).
  - Maps: `MapProvider` interface -> `MapLibreProvider` (OpenStreetMap/PMTiles) and fallback.
  - Payments: `PaymentProvider` interface -> `RazorpayProvider` (production) and `DevPaymentProvider` (development simulation).
  - Identity Check: `IdentityVerificationProvider` interface -> `ManualReviewProvider` (active) and `DigiLockerProvider` (stub).
- Alternatives Considered: Hardcoding external SDKs or throwing unhandled errors when credentials are absent.
- Reason: Strict specification requirement. Never claim an untested external service works without valid credentials and successful tests.

### 7. Financial Precision
- Decision: All monetary figures are stored as integers in paise (INR 1.00 = 100 paise), never IEEE floating-point numbers. Double-entry ledger architecture (`ledger_entries`).
- Alternatives Considered: NUMERIC(10, 2), FLOAT.
- Reason: Eliminates rounding errors in fee splits, commission deductions, refunds, and financial reconciliation.

### 8. Location Hierarchy and Pilot Region
- Decision: Official Indian hierarchy: Country -> State/UT -> District -> City/Town/Village -> Locality. Data derived strictly from official Local Government Directory (LGD) and Census definitions. Pilot region: Darbhanga and Madhubani (Bihar).
- Alternatives Considered: Free-form user text strings, Google Places API.
- Reason: Strict specification requirement. Never invent districts or administrative boundaries. Prevents geographic ambiguity in rural and tier-2/3 regions.
