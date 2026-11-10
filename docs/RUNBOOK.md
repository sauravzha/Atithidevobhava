# Operational Runbook and Disaster Recovery (RUNBOOK.md)

Document Version: 1.0 (Milestone 1)
Classification: Engineering Operations
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This document provides operational instructions for deployment, migration management, routine maintenance jobs, backup verification, and incident disaster recovery.

---

## 1. Development and Local Environment Setup

### 1.1 Prerequisites
- Node.js v20+ or v24+ (verified with v24.11.0).
- npm v10+ (verified with v11.6.2).
- Git v2.40+ (verified with v2.51.2).
- Supabase CLI installed locally for migration testing and pgTAP execution.

### 1.2 Initial Workspace Setup
1. Clone repository and install pinned dependencies:
   ```bash
   npm ci
   ```
2. Copy environment template and configure server-side credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Initialize Supabase local database or connect to remote Mumbai project:
   ```bash
   npx supabase start
   npx supabase db push
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

---

## 2. Database Migrations and Schema Updates

1. Golden Rule: Never edit a migration file that has already been pushed to a remote environment. Always create a new incremental migration file.
2. Generating a new migration:
   ```bash
   npx supabase migration new <migration_name>
   ```
3. Testing migrations against a clean local database:
   ```bash
   npx supabase db reset
   ```
4. Applying migrations to Supabase Mumbai project:
   ```bash
   npx supabase db push
   ```

---

## 3. Routine Automated Maintenance Jobs (pg_cron)

The platform relies on automated database cron jobs to fulfill privacy commitments under the DPDP Act 2023:

### 3.1 7-Day Identity Document Image Purge
- Target: Documents in `verification_records` where status is `APPROVED` or `REJECTED` and decision timestamp is older than 7 days.
- Action: Invokes edge function to delete the underlying binary file in the private Supabase bucket and sets `id_document_image_path = NULL` in database.
- Schedule: Runs daily at 02:00 IST (`30 20 * * *` UTC).

### 3.2 12-Month Message Retention Purge
- Target: Messages in `messages` associated with completed connections or bookings older than 12 months, where no active safety report is attached.
- Action: Overwrites message body text with `[Message archived and purged in accordance with data retention policy]`.
- Schedule: Runs weekly on Sunday at 03:00 IST (`30 21 * * 0` UTC).

### 3.3 14-Day Account Deletion Execution
- Target: Records in `deletion_jobs` where status is `PENDING` and request timestamp is older than 14 days.
- Action: Irreversibly purges personal profile columns, storage bucket media, and encrypts retained transaction records.
- Schedule: Runs daily at 04:00 IST (`30 22 * * *` UTC).

---

## 4. Backup Verification and Point-In-Time Recovery (PITR) Drill

### 4.1 Production Backup Policy
- Supabase automated daily backups in ap-south-1 (Mumbai).
- Point-In-Time-Recovery (PITR) enabled with 7-day log retention.
- Off-site encrypted database dumps executed weekly and stored in immutable regional object storage.

### 4.2 Quarterly Restoration Drill Procedure
1. Create isolated test restore project in Supabase.
2. Trigger Point-In-Time restore to a designated timestamp 24 hours prior.
3. Execute automated health check script against restored instance:
   - Verify table counts across `users`, `connections`, `experiences`, `ledger_entries`.
   - Verify that triggers on `admin_audit_logs` remain intact.
   - Run pgTAP test suite against restored database.
4. Record restoration drill log in `docs/DRILL_LOGS.md` with restore duration, checksum validation, and engineer sign-off.
5. Terminate test restore instance.

---

## 5. Security Incident and Data Breach Response Plan

In the event of an identified vulnerability, unauthorized access, or database anomaly:

1. Containment (Hour 0 - 1):
   - Rotate Supabase service-role keys, database passwords, and API provider secrets immediately.
   - Isolate affected network endpoints via Cloudflare / Vercel firewall rules.
   - If session compromise is suspected, execute global session revocation in Supabase Auth.
2. Triage & Assessment (Hour 1 - 3):
   - Super Admin and Security Engineer examine immutable `admin_audit_logs` to ascertain breach scope.
   - Identify whether any personal data or encrypted fields were exfiltrated.
3. Statutory Reporting (Within 6 Hours):
   - Under Indian CERT-In guidelines, submit formal cyber incident report within 6 hours of identification.
   - Under DPDP Act provisions, notify the Data Protection Board of India and affected data principals detailing nature of breach, affected records, and remedial measures taken.
4. Remediation & Post-Mortem (Within 48 Hours):
   - Patch underlying code vulnerability; author regression test proving prevention.
   - Document complete incident chronology in post-mortem report.
