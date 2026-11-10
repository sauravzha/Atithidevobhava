# API Architecture and Endpoint Specification (API.md)

Document Version: 1.0 (Milestone 1)
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This specification defines the server actions, protected route handlers, sanitized public views, and webhook handlers comprising the platform's API surface.

---

## 1. Design Conventions and Security Standards

1. Transport and Protocol: All communication occurs over HTTPS / TLS 1.3 with strict HSTS headers.
2. Authentication: Handled via Supabase Auth session cookies (`sb-*-auth-token`) verified server-side.
3. Input Validation: Every incoming payload is validated against a strict Zod schema before database interaction.
4. Error Responses: Standardized, secure JSON format with human-readable error messages and zero stack traces or raw SQL leakages:
   ```json
   {
     "error": {
       "code": "VALIDATION_FAILED",
       "message": "Please review the highlighted fields.",
       "details": []
     }
   }
   ```
5. Rate Limiting: Enforced via Redis / PostgreSQL sliding window token buckets with exponential lockout on sensitive endpoints (Login: 5/min, OTP request: 3/min, Messages: 20/min, Meetup requests: 10/day).
6. Idempotency: All mutating operations (connection requests, bookings, financial webhooks) require a unique UUID `idempotency_key`.

---

## 2. Public Endpoints and Sanitized Views

Public endpoints return sanitized data queries strictly projected through PostgreSQL security views. Raw user tables are inaccessible to anonymous callers.

### 2.1 Location Discovery
- `GET /api/locations/states`: Retrieves list of Indian states and union territories with active host inventory.
- `GET /api/locations/districts?stateId=<uuid>`: Retrieves official districts within a specified state.
- `GET /api/locations/cities?districtId=<uuid>`: Retrieves official cities and towns within a specified district.
- `GET /api/locations/autocomplete?q=<query>`: Fast search over official LGD boundaries with `pg_trgm` matching.

### 2.2 Public Directory
- `GET /api/directory/people`: Filters public local profiles (`v_public_people`). Excludes last names, exact addresses, and contact numbers.
  - Query params: `state`, `district`, `city`, `interest`, `language`, `cursor`, `limit`.
- `GET /api/directory/experiences`: Filters published cultural experiences (`v_public_experiences`). Prices omitted while `PRICES_VISIBLE=false`.
  - Query params: `category`, `state`, `district`, `cursor`, `limit`.
- `GET /api/directory/experiences/:slug`: Detailed listing information with general meeting area, host intro, inclusions, exclusions, and approved reviews.

---

## 3. Protected Server Actions and Endpoints

### 3.1 Authentication and Onboarding
- `POST /api/auth/otp/send`: Initiates email or DLT SMS OTP dispatch with rate limit protection.
- `POST /api/auth/otp/verify`: Verifies 6-digit OTP and establishes session cookie.
- `POST /api/onboarding/traveller`: Submits completed traveller profile with consent logs.
- `POST /api/onboarding/local`: Submits completed local member profile.

### 3.2 "Meet a Local" Connection Management
- `POST /api/connections/request`: Initiates connection request from traveller to local member.
  - Body: `target_user_id`, `purpose`, `proposed_dates`, `suggested_public_place`, `message`, `idempotency_key`.
- `POST /api/connections/:id/respond`: Local member responds to pending request.
  - Body: `action` ("ACCEPT" | "DECLINE" | "ASK_QUESTION"), `decline_reason` (optional).
- `POST /api/connections/:id/schedule`: Proposes finalized meetup date and confirmed public venue.
- `POST /api/connections/:id/cancel`: Either party cancels scheduled meetup prior to execution.

### 3.3 Contact Exchange Protocol (`can_reveal()`)
- `POST /api/connections/:id/contact-exchange/consent`: Participant specifies contact fields to share.
  - Body: `share_email` (bool), `share_phone` (bool), `share_whatsapp` (bool).
- `GET /api/connections/:id/contact-exchange`: Evaluates `can_reveal()` and returns decrypted contact details ONLY IF mutual consent is satisfied.

### 3.4 Experience Management and Bookings
- `POST /api/experiences`: Experience provider drafts or updates a listing.
- `POST /api/experiences/:id/submit`: Submits listing to administrative review queue.
- `POST /api/experiences/:id/enquire`: Traveller submits date enquiry (Phase 1 Enquiry Mode).
- `POST /api/experiences/:id/book`: Initiates booking transaction invoking PostgreSQL `book_experience()` with row locking (Phase 2 Booking Mode).

### 3.5 Messaging and Safety
- `GET /api/messages/conversations`: Retrieves authenticated user's active conversations.
- `POST /api/messages/send`: Transmits text message (max 1000 chars, plain text links).
- `POST /api/safety/report`: Submits incident report on user, listing, or message thread.
- `POST /api/safety/block`: Blocks target user, closing chat and de-indexing access immediately.
- `POST /api/safety/help-alert`: Triggers emergency panic notification to on-duty moderators and trusted contact.
- `POST /api/reviews/submit`: Submits blind review on completed interaction.

---

## 4. Webhooks Architecture

### 4.1 Payment Provider Webhook (Phase 2)
- Endpoint: `POST /api/webhooks/payments`
- Provider: Razorpay (production) / DevPaymentProvider (development simulation)
- Verification: Validates `X-Razorpay-Signature` using HMAC-SHA256 against raw request body.
- Idempotency: Checks `payment_webhook_events` table before executing state mutation; duplicate webhook events return HTTP 200 immediately without reprocessing.
- Action: On `order.paid`, updates booking status to `CONFIRMED`, triggers double-entry ledger credit, and issues customer confirmation receipt.

---

## 5. Administrative API (`/api/admin/*`)

Restricted exclusively to administrative roles with verified AAL2 TOTP sessions. All endpoints mandate a `reason` parameter and record append-only entries in `admin_audit_logs`.

- `GET /api/admin/metrics`: Aggregated platform statistics from real database rows.
- `GET /api/admin/verifications/pending`: Queue of identity verification requests.
- `GET /api/admin/verifications/:id/signed-url`: Generates 15-minute signed URL for masked ID viewer.
- `POST /api/admin/verifications/:id/decision`: Approves or rejects verification with written reason.
- `POST /api/admin/listings/:id/moderate`: Approves, rejects, or requests changes on listings.
- `POST /api/admin/reports/:id/action`: Resolves or escalates safety reports.
- `POST /api/admin/settings/flags`: Updates platform feature flags (Super Admin only).
