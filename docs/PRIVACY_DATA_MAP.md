# Privacy and Data Retention Map (PRIVACY_DATA_MAP.md)

Document Status: DRAFT FOR LAWYER REVIEW
Framework: Digital Personal Data Protection Act 2023 (India)
Document Version: 1.0 (Milestone 1)
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This document establishes the exact data inventory, collection justification, access boundaries, retention limits, and deletion procedures for every item of personal data processed across the platform.

---

## 1. Allowed Third-Party Data Processors

In strict accordance with platform privacy invariants, zero advertising networks, third-party tracking scripts, or external font CDNs are permitted. Only essential infrastructure processors are authorized:

| Processor Name | Function / Service Provided | Data Transferred | Data Center Location | Privacy Policy & DPA Status |
| :--- | :--- | :--- | :--- | :--- |
| Supabase Inc. | Managed PostgreSQL database, Auth, Storage, and Realtime messaging | Encrypted user records, messages, system logs | Mumbai, India (ap-south-1) | Validated SOC2 Type II, Indian data residency compliant |
| Vercel Inc. | Application edge hosting and serverless compute | Server access logs, temporary request payload execution | Mumbai, India (bom1 edge) | Strict enterprise DPA, PII scrubbing enabled |
| Resend Inc. | Transactional email delivery (OTPs, notifications, alerts) | Recipient email address, transaction notification text | Global infrastructure with encryption in transit | DPA executed, no marketing analytics tracked |
| Indian DLT SMS Provider | Mandatory transactional SMS OTP delivery | Recipient mobile number, numeric OTP string | Mumbai / New Delhi, India | Telecom Regulatory Authority of India (TRAI) DLT registered |
| Cloudflare Inc. | Turnstile bot protection on registration and auth endpoints | Non-biometric browser telemetry, IP hash | Global edge network with privacy preservation | Zero-cookie verification, no tracking profile created |
| Sentry (Optional) | Error telemetry with mandatory PII scrubbing | Sanitized stack traces, anonymized runtime exceptions | Configurable with strict client-side PII filter | PII scrubbing verified via test suite |

---

## 2. Comprehensive Field-by-Field Personal Data Inventory

### 2.1 User Core and Authentication (`users`, `user_roles`)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` (UUID) | System identifier | Internal / Public UUID | No | Lifetime of account | Irreversible hard delete on purge |
| `email` | Identity, login, transactional security alerts | Authenticated user & Admin | Encrypted | Lifetime of account | Anonymized on account deletion |
| `mobile_number` | Host verification, DLT compliance | Encrypted; private | Yes (`pgcrypto`) | Lifetime of account | Anonymized on account deletion |
| `birth_year` | Age verification (Adults only 18+) | Private / System only | No | Lifetime of account | Purged on account deletion |
| `created_at` | Audit trail | System / Admin | No | 7 years (statutory) | Preserved in anonymized security log |

### 2.2 Traveller Profile (`traveller_profiles`)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `full_name` | Private identity record | Private to user & Admin | Encrypted | Lifetime of account | Hard deleted on purge |
| `display_name` | Public community interaction | Public | No | Lifetime of account | Hard deleted on purge |
| `country_of_residence` | Cultural orientation and context | Public | No | Lifetime of account | Hard deleted on purge |
| `preferred_language` | UI localization and messaging | Public | No | Lifetime of account | Hard deleted on purge |
| `profile_photo_url` | Mutual recognition for meetups | Public (EXIF stripped) | Storage bucket ACL | Lifetime of account | Deleted from storage bucket on purge |
| `bio_intro` | Safety assessment by prospective hosts | Public | No | Lifetime of account | Hard deleted on purge |
| `interests` | Discovery matching | Public | No | Lifetime of account | Hard deleted on purge |
| `trusted_contact_email`| Emergency itinerary sharing | Private | Encrypted | Lifetime of account | Hard deleted on purge |

### 2.3 Local Member & Host Profile (`local_member_profiles`, `host_profiles`)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `legal_name` | Host verification and KYC | Private to user & Admin | Encrypted | Lifetime of account | Hard deleted on purge |
| `display_name` | Public profile identity | Public | No | Lifetime of account | Hard deleted on purge |
| `state_id`, `district_id` | Geographic discovery | Public | No | Lifetime of account | Retained in anonymous location counts |
| `city_id`, `locality_id` | Approximate regional discovery | Public (approximate) | No | Lifetime of account | Retained in anonymous location counts |
| `exact_home_address` | Guest stay guidance (stays only) | Cryptographic reveal only | Yes (`pgcrypto`) | Lifetime of listing | Hard deleted on purge |
| `preferred_public_meeting_area` | Safe initial meetup guidance | Public | No | Lifetime of listing | Hard deleted on purge |
| `contact_email` | Direct communication after mutual consent | Cryptographic reveal only | Yes (`pgcrypto`) | Lifetime of account | Hard deleted on purge |
| `contact_phone` | Direct communication after mutual consent | Cryptographic reveal only | Yes (`pgcrypto`) | Lifetime of account | Hard deleted on purge |
| `contact_whatsapp` | Direct communication after mutual consent | Cryptographic reveal only | Yes (`pgcrypto`) | Lifetime of account | Hard deleted on purge |

### 2.4 Identity Verification Records (`verification_records`, private bucket)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_document_image_path` | Visual identity check by reviewer | Private bucket; signed URL | Private bucket ACL | Maximum 7 days post-decision | Automated pg_cron purge job deletes file from bucket |
| `selfie_image_path` | Face matching against ID photo | Private bucket; signed URL | Private bucket ACL | Maximum 7 days post-decision | Automated pg_cron purge job deletes file from bucket |
| `verification_status` | Community trust signal | Public badge | No | Lifetime of account | Preserved as verified history |
| `verification_reference` | Verification decision hash | Admin only | No | 7 years (audit requirement) | Anonymized reference retained |

### 2.5 Realtime Messaging (`conversations`, `messages`)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `message_text` | Communication between accepted users | Accepted participants only | No | 12 months post-interaction | Automated pg_cron purge job scrubs text |
| `sender_id`, `recipient_id`| Thread delivery routing | Participants & Admin | No | 12 months post-interaction | Masked to "Deleted user" on account deletion |

### 2.6 Guest Compliance Records (Phase 3 Stays) (`guest_records`)
| Field Name | Collection Justification | Visibility Level | Encryption at Rest | Retention Period | Deletion / Purge Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `guest_full_name` | Foreign guest reporting record | Host & Admin | Encrypted | 3 years (statutory requirement) | Purged at conclusion of statutory period |
| `nationality` | Foreign guest reporting record | Host & Admin | No | 3 years (statutory requirement) | Purged at conclusion of statutory period |
| `arrival_date`, `departure_date` | Compliance auditing | Host & Admin | No | 3 years (statutory requirement) | Purged at conclusion of statutory period |
| `form_submission_reference`| Verification of police reporting | Host & Admin | No | 3 years (statutory requirement) | Purged at conclusion of statutory period |
| `document_numbers` (Optional, OFF) | Emergency encrypted backup | Host only (audit logged) | High-security key vault | Auto-deleted 30 days post-stay | Scheduled job purges cryptographic cipher |

---

## 3. Account Deletion and Purge Workflow

1. User Request: User triggers account deletion in `/dashboard/settings`.
2. 14-Day Revocation Grace Period: Account enters pending deletion state. Active listings and profile are de-indexed immediately from search.
3. Automated Purge Job (`deletion_jobs`):
   - User profile records are permanently erased from `traveller_profiles`, `local_member_profiles`, and `host_profiles`.
   - Photos and media are removed from Supabase Storage buckets.
   - Encrypted contact fields in `contact_exchanges` are overwritten and destroyed.
   - Identity verification records in `verification_records` are permanently purged.
   - In past messages, user display names are scrubbed to "Deleted user".
   - Historical reviews are anonymized (reviewer name replaced with "Former community member").
   - Immutable financial transaction records (`ledger_entries`) and statutory safety incident reports are retained for the legally mandated period (7 years) with personal identifiers severed.
