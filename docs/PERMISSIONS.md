# Role and Permission Matrix (PERMISSIONS.md)

Document Version: 1.0 (Milestone 1)
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This document specifies the exact authorization boundaries, capability assignments, and access policies enforced across the platform's multi-role architecture.

---

## 1. Identity Model Overview

1. Multi-Role Capability: A single authenticated user record in `users` can hold multiple roles simultaneously through records in `user_roles`. Duplicate accounts are prohibited.
2. Dashboard Role Switcher: Users toggle their active perspective in a single unified dashboard interface.
3. Server-Side Enforcement: Role checks and object-level permissions are strictly enforced on the server in Server Actions, Route Handlers, and Row Level Security (RLS) policies. Middleware serves as an initial routing guard, never the sole authorization boundary.
4. Administrative Isolation: Administrative privileges require explicit assignments in `admin_permissions` with mandatory Supabase AAL2 Multi-Factor Authentication (TOTP).

---

## 2. Core User Roles and Capabilities

| Capability / Action | Anonymous Visitor | Traveller | Local Member | Experience Provider | Accommodation Host (Phase 3) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Browse public directory (people, experiences, places) | Yes (sanitized) | Yes | Yes | Yes | Yes |
| View detailed experience info (enquiry mode) | Yes | Yes | Yes | Yes | Yes |
| Initiate "Meet a Local" connection request | No | Yes (max 2 if new) | No | No | No |
| Respond to meetup requests (Accept / Decline) | No | No | Yes | Yes | Yes |
| Participate in Realtime messaging | No | Accepted only | Accepted only | Accepted only | Accepted only |
| Mutually reveal contact details (`can_reveal()`) | No | Accepted only | Accepted only | Accepted only | Accepted only |
| Submit experience listing for review | No | No | No | Yes | Yes |
| Manage experience schedules and time slots | No | No | No | Yes | Yes |
| Submit accommodation listing for review | No | No | No | No | Yes (Tier 2 verified) |
| Manage stay calendar and availability | No | No | No | No | Yes |
| Access guest compliance reporting records | No | No | No | No | Yes (own guests only) |
| Submit blind review on completed interaction | No | Yes | Yes | Yes | Yes |
| Report user, listing, or message | No | Yes | Yes | Yes | Yes |
| Block user | No | Yes | Yes | Yes | Yes |
| Initiate "I need help" emergency alert | No | Yes | Yes | Yes | Yes |
| Share trip with trusted contact | No | Yes | No | No | No |
| Export personal data (DPDP Act) | No | Yes | Yes | Yes | Yes |
| Request account deletion (14-day purge grace) | No | Yes | Yes | Yes | Yes |

---

## 3. Administrative Roles and Granular Permissions

Administrative permissions are assigned via `admin_permissions` and require verified AAL2 TOTP sessions. Self-service privilege escalation is strictly barred.

| Administrative Function | `content` | `finance` | `verification_reviewer` | `moderator` | `super_admin` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Access `/admin` base dashboard | Yes | Yes | Yes | Yes | Yes |
| View aggregated platform metrics | Yes | Yes | Yes | Yes | Yes |
| Review and publish editorial stories/articles | Yes | No | No | No | Yes |
| Review and publish experience listings | Yes | No | No | Yes | Yes |
| Review and approve accommodation listings | No | No | No | Yes | Yes |
| Inspect identity verification documents (signed URL) | No | No | Yes | No | Yes |
| Approve or reject identity verifications | No | No | Yes | No | Yes |
| Investigate safety reports and incident queue | No | No | No | Yes | Yes |
| Issue temporary user suspensions (pending review) | No | No | No | Yes | Yes |
| Issue permanent user bans | No | No | No | No | Yes |
| Inspect financial ledgers and payout records | No | Yes | No | No | Yes |
| Trigger refunds or payout reconciliations | No | Yes | No | No | Yes |
| Modify platform commission rates | No | No | No | No | Yes |
| Toggle platform feature flags (`platform_settings`) | No | No | No | No | Yes |
| Inspect raw tamper-proof audit trail | No | No | No | No | Yes |

---

## 4. Permission Invariants and Hard Security Rules

1. Anti-Escalation Invariant: A user can never update their own records in `user_roles` or `admin_permissions`. All role modifications require an authenticated `super_admin` action.
2. Intersite Data Isolation: A traveller can never view or query bookings, connections, or messages belonging to another traveller (prevention of IDOR).
3. Contact Reveal Invariant: Contact information remains cryptographically encrypted and unqueryable until `can_reveal()` evaluates to `true` via mutual, dual-sided consent.
4. Document Protection Invariant: Identity verification images are stored in a private bucket with zero public read permissions. Signed URLs expire in 15 minutes, and watermarked views are logged in `admin_audit_logs`.
5. Audit Log Inviolability: The `admin_audit_logs` table has a database trigger that rejects all `UPDATE` and `DELETE` queries, ensuring an immutable record of all administrative actions.

