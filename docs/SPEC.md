ROLE
You are a complete product team: product strategist, senior full-stack architect (Next.js,
Postgres, Supabase), editorial UI designer, application security engineer, and QA
engineer. Build a real, working, production-oriented web application called "Atithi Devo
Bhava" (अतिथि देवो भव). Real auth, real database, real permissions, real messaging, real
admin tools. No mock data presented as real, and no claim that an untested feature works.
Do not ask me questions. Decide sensibly and list assumptions at the end. No emojis in
code, docs or the site.

WORKING METHOD
- First write docs/SPEC.md containing this whole prompt, then follow it.
- Build in the 13 milestones in section 29 and STOP after each one: summarise what you
  built, run the app and the tests, show real results, and wait for me to say "continue".
- Complete files only. No "..." and no TODO in security-critical code.
- Every integration that needs credentials (SMS, email, maps, payments, translation) is
  built behind an interface with a clearly labelled development fallback. Never pretend a
  real integration is active without credentials and a successful test.
- Write short human code comments that explain why, not what.

1. PRODUCT
Brand: Atithi Devo Bhava. Hindi identity: अतिथि देवो भवः.
Primary tagline: "Experience India through its people." Hindi: "भारत को लोगों के साथ महसूस कीजिए।"
Secondary line: "Meet locals. Explore cultures. Experience Indian hospitality." (sentence case)
A trusted platform connecting international travellers with Indian local people, families,
artists and communities, so visitors experience India through people, not only monuments.
It is NOT a hotel-booking site, an Airbnb clone, a social network, or a phone-number
directory. It is a three-sided local hospitality and experience marketplace with three
interconnected products:
  A. MEET A LOCAL: connect with an Indian resident for tea, a walk, a market visit,
     language exchange. Not a paid service by default, and the person needs no
     accommodation or tourism business.
  B. EXPLORE WITH A LOCAL: listed cultural experiences run by residents, artists and
     families (cooking, craft, village walks, music and dance, festivals, history).
  C. STAY WITH A LOCAL: eligible hosts offering hospitality or accommodation, with a
     higher verification and compliance threshold.
Personality: welcoming, trustworthy, human, culturally sensitive, simple, restrained.

2. LOCKED DECISIONS
- Stack: Next.js (App Router) + React + TypeScript strict + Tailwind CSS (custom theme, no
  default shadcn look; use shadcn primitives only if fully restyled) + Lucide icons (line,
  1.5 stroke, only where they carry meaning) + React Hook Form + Zod + next-intl.
- Backend: Supabase (Postgres 15+, Auth, Storage, Realtime) in the Mumbai region (ap-south-1),
  Next.js server actions and protected route handlers, Vercel (bom1). Extensions: PostGIS,
  pg_trgm, unaccent, btree_gist, pgcrypto, pg_cron.
- All secrets and the Supabase service-role key are server-only. Nothing secret in
  NEXT_PUBLIC variables. Never commit .env files.
- Adults only (18+) for every account. No minors and no children as registered users.
- The site never collects Aadhaar numbers, passport scans, or passport and visa numbers
  (see section 9 for the one optional exception, off by default).
- Contact details are revealed only when BOTH sides agree, per connection or booking.
- Exact home address and precise coordinates are never public.
- Chat is text only: no attachments, links shown as plain text.
- No third-party trackers, no ad pixels, no CDN for fonts or scripts. Self-host fonts
  (fontsource) and all libraries. Allowed processors are listed in docs/PRIVACY_DATA_MAP.md
  (Supabase, Vercel, Resend, SMS provider, Turnstile, optional Sentry with PII scrubbing).
- Geography data is imported from official sources (Local Government Directory and Census
  town lists as CSV that I provide). Never invent districts, towns or villages.
- No payment or price is shown to users until the relevant feature flag is on.

3. PHASES AND FEATURE FLAGS
All features are built, but gated by flags in platform_settings (admin can change them,
every change is audit-logged):
- PHASE 1 (ON at launch): registration, traveller and local profiles, location discovery,
  Meet a Local, Explore with a Local as ENQUIRY-ONLY listings (no price displayed, no
  payment), connection requests, private messaging, reviews, basic safety, admin
  moderation.
- PHASE 2 (flags OFF): PRICES_VISIBLE, PAYMENTS_ENABLED, calendar and slot booking,
  commissions, refunds, payouts, verified-booking reviews.
- PHASE 3 (flag OFF): STAYS_ENABLED, accommodation listings, stay requests, compliance
  centre, guest records, paid accommodation.
Seed schema, UI and tests for all phases now. A disabled feature shows an honest "Not open
yet" state, never a fake working screen.
Pilot region to support first: Darbhanga and Madhubani (Bihar). Target 30 to 50 real local
profiles and real traveller testers. Do not claim international demand that has not been
validated.

4. ROLES AND PERMISSIONS
A user can hold several roles at once through user_roles (no duplicate accounts), with a
role switcher in one unified dashboard.
- TRAVELLER: profile, search, send connection requests, enquire or book experiences, enquire
  about stays, save items, message accepted connections, review completed experiences,
  block and report.
- LOCAL MEMBER: local profile, availability, receive and answer meetup requests, message
  accepted visitors, report, receive reviews.
- HOST / EXPERIENCE PROVIDER: everything a local member has, plus publish experiences,
  schedules, capacity, booking requests, earnings and payouts (Phase 2).
- ACCOMMODATION HOST (Phase 3): separate approval from the other roles. A local member or
  experience provider is NOT automatically eligible to host stays.
- ADMIN: granular permissions through admin_permissions (roles: super_admin, moderator,
  verification_reviewer, finance, content). No self-service escalation. MFA (Supabase
  AAL2) is mandatory for every admin. Only super_admin can permanently ban, change feature
  flags, change commission rates, or read ID documents.
Every dashboard route enforces role checks server-side. Middleware alone is never the only
authorisation layer.

5. ONBOARDING AND REGISTRATION
First screen: "How would you like to experience India?" with four choices (multi-select):
I am visiting India. I am a local resident. I want to host experiences. I want to offer
accommodation.
Use a multi-step form with a text progress line ("Step 2 of 5"), save-as-draft, and a plain
sentence explaining why each piece of data is needed. Never one giant form.
- Traveller: full name, display name, email (verified by OTP), country of residence, preferred
  language, photo, short introduction (150+ characters), interests, intended travel period,
  preferred destinations, birth year, "I am 18 or older" confirmation, accepted Terms and
  Privacy (consent record), Safety Agreement, optional trusted-contact email. No nationality
  or passport or visa data.
- Local member: full legal name (private), display name, email, verified mobile (SMS OTP,
  DLT-registered templates), state, district, city, languages, interests, introduction,
  meetup preferences, preferred public meeting areas, availability, photo, profile
  visibility (public or members-only, default members-only).
- Experience provider: the above plus a provider type (individual, family, business),
  what they genuinely offer, and any registrations they hold.
- Accommodation host: see section 8.
Signing up with an existing email shows the same success screen and emails the owner.
Auth errors are generic. New travellers: at most 2 pending requests for 7 days, and stay
enquiries only after the profile is complete.

6. PRODUCT A: MEET A LOCAL
Flow: traveller finds a local member, sends a request (purpose: tea or coffee, market walk,
language exchange, photography walk, local area tour, other; proposed dates; a suggested
PUBLIC meeting place; message of 50 to 600 characters). The local member accepts, declines
(fixed reasons; the traveller only sees "unable to meet this request") or asks a question.
Accepted opens the private chat. The pair can then agree a meetup date and public place,
which moves it to SCHEDULED. Either side can cancel before the date. After the date it
becomes COMPLETED and the reviews open.
Statuses: PENDING, ACCEPTED, DECLINED, EXPIRED (7 days), WITHDRAWN, SCHEDULED, COMPLETED,
CANCELLED. "Reported" is a flag with a moderation case, not a terminal state.
Rules: one open request per pair, verified email and complete profile needed, idempotency
key on create, transitions implemented as explicit database functions that reject illegal
changes. The first meeting is always suggested in a public place, with a reminder in the UI.
Make it clear in the UI whether a connection is free or a paid organised activity. A local
member is never required to host anyone.
Filters: state, district, city, languages, interests, availability, verification level,
meetup type.

7. PRODUCT B: EXPLORE WITH A LOCAL
Categories (12): Indian food and cooking; Village life; Art and handicrafts; History and
heritage; Local markets; Traditional festivals; Music and dance; Spiritual and cultural
experiences; Nature and rural experiences; Language and cultural exchange; Photography
walks; Local city exploration. Also interest-based discovery (for example Mithila painting
without knowing the place first).
Provider creates an experience: title, category, description (Hindi and/or English), state,
district, city, general meeting area (never an exact home address), duration, price per
person (hidden until PRICES_VISIBLE), min and max participants, dates and time slots,
languages, age limits only where legally appropriate, accessibility, included, excluded,
cancellation policy, safety information, photos (real only), host introduction, booking
requirements. The person listing must be able to describe what they genuinely provide.
Admin approval before publication (approve, reject, request changes, suspend).
Detail page: cover photo, title, host, location, duration, languages, group size, dates,
description, meeting point (general), included and excluded, cancellation terms, safety
information, reviews, and an Enquire button (Phase 1) or Book button (Phase 2).
Booking flow (the same engine for Phase 1 enquiry mode and Phase 2 booking mode):
select date, participants, check capacity, review final price, send enquiry or confirm
booking (per host setting), pay when enabled, confirmation, meeting instructions,
completion, review.
Booking statuses: DRAFT, PENDING, ACCEPTED, PAYMENT_PENDING, CONFIRMED, IN_PROGRESS,
COMPLETED, CANCELLED, REFUNDED, DISPUTED.
Double booking prevention: a Postgres function book_experience() that runs in one
transaction, locks the schedule row (FOR UPDATE), checks remaining capacity, and uses a
unique idempotency key. Test it with concurrent requests.

8. PRODUCT C: STAY WITH A LOCAL (Phase 3, STAYS_ENABLED off)
Categories: free cultural hospitality; cost-sharing; registered paid homestay; family
accommodation; eligible paying guest; private guest room; other legally permitted. Never
present unpaid hospitality as commercial accommodation or the reverse.
Listing: public host profile, general location, accommodation type, rooms, guests, private
or shared room, bathroom, food, languages, household introduction (adult count, children
yes or no, pets yes or no, anyone else living there), house rules, availability, price or
free, photos, accessibility, nearby attractions, verification and registration status.
Eligibility (two tiers):
- Tier 1 (meeting and guiding only) needs no stay approval.
- Stay approval needs: ID check, a short video or 4 photos of the guest room, a 10-minute
  video call with a moderator, and ONE of: a reference (the site emails them) or a prior
  completed meetup or experience with a positive review. Paid listings also need the
  registration details required for that state, checked by an admin.
Request flow: traveller enquiry (check-in, check-out, adults, children where applicable,
country of residence, languages, introduction, requirements) goes to the host, who accepts,
declines or asks for information. They chat, confirm terms, pay when enabled, the stay
happens, then both can review. STAY requests: at most 14 nights, at most 2 guests in the
first release. Availability uses a daterange column with an exclusion constraint (btree_gist)
so confirmed bookings never overlap.
Compliance module (separate, per host category):
- Host checklist, links to official government resources, and reminders for the foreign
  guest reporting duty (24 hours is stated in your source; the lawyer must confirm the
  exact rule, form and timeline: the older rules called it Form C, the 2025 rules are
  stated to call it Form III).
- Guest record: by default store ONLY guest name, nationality, arrival and departure dates,
  and "form submitted: yes or no, date, reference". Passport or visa numbers are NOT
  stored by default. An optional setting guest_document_numbers_enabled (off, super_admin
  only, requires a documented lawyer sign-off in platform_settings) would store them
  encrypted, visible only to that host and logged, with a retention period that auto-deletes.
- Do NOT say the site is an official reporting service. Do NOT submit anything to a
  government system without a legally authorised, technically supported integration.
- Distinguish commercial accommodation from non-commercial residential hospitality.
- Audit logs, retention and deletion settings.
- Require legal and operational review before overnight commercial stays are enabled.

9. CONTACT EXCHANGE (applies to A, B and C)
One function can_reveal(connection_or_booking, viewer, field) in Postgres decides everything
and is used by every query, view and endpoint.
1. The option appears only after ACCEPTED, as a banner in the chat.
2. Each side separately picks what to share (email, phone, WhatsApp). A host may add
   "address for the stay" for stays and for private-home experiences.
3. Nothing is revealed until BOTH confirm. Until then each sees "Waiting for the other person".
4. After both confirm, each sees the other's chosen fields, not the address.
5. The address is revealed to the traveller 72 hours before the start date, only if the
   exchange is complete and the booking is still ACCEPTED or CONFIRMED. It is hidden again
   the day after the end date.
6. Block hides everything immediately and closes the chat.
7. Contact fields are encrypted at rest (pgcrypto or Supabase Vault with rotating keys).
   Every reveal is written to the audit log.

10. MESSAGING
Realtime text messaging with Supabase Realtime, protected by RLS so only accepted
participants can read or subscribe. Features: conversation list, read status, timestamps,
unread count, in-app notifications, block, report (copies the last 20 messages into the
report). 1000 characters per message, 20 per minute. Links display as plain text. A message
that looks like a phone number or email shows a soft warning ("Use Share contact, it is
safer") and still sends. Chat is read-only 30 days after completion and closed on cancel or
block. Messages are deleted 12 months after completion unless tied to an open report.
Optional machine translation (flag OFF by default) must show a consent notice because
message text goes to a third party, and must label output "machine-translated". Never rely
on hidden URLs as a security mechanism.

11. REVIEWS
Window opens at COMPLETED and lasts 14 days. Blind: published when both submit or the
window closes. Three 1 to 5 ratings (as described, communication, felt safe), text of 20 to
800 characters, and a private safety box visible only to moderators. Only completed
connections or bookings can be reviewed. Moderators can remove policy-breaking reviews
with a written reason (audit-logged). Show review scores only when enough real reviews
exist. No fake or demo reviews may ever look real.

12. TRUST, IDENTITY AND SAFETY
Verification levels, shown with precise labels and the date checked: Email verified; Mobile
verified; Identity checked by our team; Address checked (when required); Experience
provider checked; Accommodation registration or eligibility checked. Never imply a badge
guarantees trustworthiness. Add a plain line: "A badge shows what we checked, not a
guarantee."
Identity check in V1: one government photo ID image (Aadhaar only with the number masked)
plus a selfie, reviewed by a moderator through a provider interface (ManualReviewProvider
now, DigiLockerProvider as a documented stub). The image is stored in a private bucket,
viewed only through short-lived signed URLs with access logged, and deleted within 7 days
of the decision, leaving only a verified flag and a reference.
Safety features: report account, experience, accommodation or message; block; cancel;
incident report; moderation queue; admin investigation; suspension; appeal process.
Reasons: harassment, unsafe or threatening behaviour, asked for money, fake profile,
discrimination, inappropriate sexual content, suspected trafficking or exploitation, other.
Urgent reasons go to a priority queue and email the on-duty moderator immediately. A person
with 2 urgent reports from different users is hidden from search until reviewed. The
reporter is never revealed.
Traveller safety: see verification and reviews, share trip plans with one trusted contact
(the contact confirms by email link, then receives only host first name, district and
dates through an expiring link; never an address), public first-meeting reminders,
check-in prompts on the start and end date ("I arrived safely / I need help"), a Help page
(112 emergency, 1091 women helpline, 1363 tourist helpline, embassy advice, notify trusted
contact) that works without JavaScript. "I need help" must trigger a real moderator alert
and a real email. If there is no working incident process behind a button, do not build the
button.
Host safety: review guest profiles, accept or decline freely, set availability and house
rules, control contact exchange, report misconduct.
Provide a women-traveller safety section and a "women or family household" filter based on
what hosts declare.
Moderation process documented in docs/MODERATOR_HANDBOOK.md.

13. INDIA LOCATION ENGINE
Hierarchy: Country, State or Union Territory, District, City or Town or Village, Locality.
Tables: countries, states (kind: state or union territory), districts (LGD code, source
version date), cities, localities. Import commands read my official CSV files and fail
loudly on unknown parents. The 28 states and 8 union territories are written out
explicitly. District lists must come from the CSV, because they change over time.
Admin tools to update locations (audit-logged). Features: state, district and city
autocomplete, dependent selects, nearby search with radius (PostGIS), list and map views,
location landing pages. Map: MapLibre GL with OpenStreetMap-based tiles (self-hosted
PMTiles or a privacy-respecting tile provider, listed in the privacy map). Mapbox is an
allowed alternative if documented. Show only approximate or public meeting locations,
never private residential coordinates (round or snap to locality centroids). Preserve
official place names and never auto-translate them.
Notices for areas that may need permits for foreigners come from a config table with
source URL and a reviewed_by_lawyer flag and show only when reviewed.

14. DISCOVERY AND SEARCH
Two entry paths: by location (state, district, city, dates, connection type, category) and
by interest (food, traditional art, village life, local history, meeting families,
festivals, markets, regional traditions).
One unified search with four modes: People, Experiences, Stays, Places.
- People filters: state, district, city, languages, interests, availability, verification,
  meetup type.
- Experience filters: category, state, district, price range (when visible), duration,
  languages, group size, date, rating (when enough reviews), accessibility.
- Stay filters: state, district, city, dates, guests, price (when visible), room type,
  stay category, food, verified eligibility, languages, accessibility.
- Sort: relevance, newest, price (when visible), rating (when enough reviews), availability.
Never rank or filter by sensitive personal attributes. Filters run as real database
queries (Postgres full-text with the 'simple' configuration plus pg_trgm for Hindi and
English, since Postgres has no Hindi stemmer; PostGIS for radius), with cursor pagination
and proper indexes. No frontend-only mock filtering.

15. DASHBOARDS (shared navigation, role-specific items, backend-enforced)
- Traveller: Overview, Discover People, Explore Experiences, Find Accommodation, My
  Connections, My Bookings, Messages, Saved, Travel Plans, My Reviews, Profile, Settings,
  Help and Safety. Overview shows upcoming experiences, pending requests, accepted
  connections, upcoming stays, recent conversations, saved items.
- Local member: Overview, My Profile, Meetup Requests, My Availability, Messages, My
  Experiences, Reviews, Safety Centre, Settings.
- Experience provider: Overview, My Experiences, Create Experience, Booking Requests,
  Calendar, Messages, Customers, Reviews, Earnings, Payouts (Phase 2), Verification, Settings.
- Accommodation host (Phase 3): Overview, Accommodation Listings, Availability, Guest
  Requests, Bookings, Messages, Guest Records, Compliance Centre, Reviews, Earnings,
  Verification, Settings.
Account settings include: language, visibility, notification preferences, export my data,
delete my account (14-day grace, then a purge job that removes profile data, photos,
contact fields and ID images, turns messages into "Deleted user", anonymises reviews, and
keeps only minimal safety and financial records for the legally required period, marked
"lawyer to confirm").

16. ROUTES
Public: /, /explore, /explore/people, /explore/experiences, /explore/stays,
/experiences/[slug], /people/[slug], /hosts/[slug], /india, /india/[state],
/india/[state]/[district], /categories/[slug], /how-it-works, /become-a-host, /about,
/safety, /help, /contact, /faq, /privacy, /terms, /host-responsibilities, /login,
/register, 404, 500.
Protected: /dashboard, /dashboard/messages, /dashboard/connections, /dashboard/bookings,
/dashboard/experiences, /dashboard/accommodation, /dashboard/settings.
Admin: /admin, /admin/users, /admin/hosts, /admin/experiences, /admin/accommodation,
/admin/bookings, /admin/reports, /admin/verifications, /admin/locations,
/admin/analytics, /admin/settings, /admin/audit-logs.
Locale routing with next-intl: English default (no prefix), Hindi at /hi. Add hreflang
and canonical tags.

17. HOMEPAGE (text-led, editorial; NOT a template layout)
Header: left, "अतिथि देवो भव" in the Hindi heading font with "Atithi Devo Bhava" beneath in
small Newsreader. Nav as two-line bilingual labels: Discover India, Meet Locals,
Experiences, Stay, How it works. Right: language toggle (हिंदी | English), theme toggle,
Log in, Become a host. Light and quiet.
Hero (left 7 columns, right 5 columns, no centred hero):
 H1 "Experience India through its people." with "भारत को लोगों के साथ महसूस कीजिए।"
 Paragraph: "Meet local people, join a cooking or craft session, or stay with a family. Everyone
 is checked by a person. Contact details are shared only when both of you agree."
 Search form with text tabs People | Experiences | Stays | Places; dependent State,
 District, City selects; Date; Guests (only when relevant); button "Explore India /
 भारत देखें". Secondary text link "Become a local host".
Sections, each separated by a 1px rule, never coloured bands:
 1. Three ways to experience India: three full-width ruled rows (not three cards), each with
    a number, bilingual title (Meet a local, Explore with a local, Stay with a local), two
    plain sentences, and a link. A photo may appear only if a real, licensed photo exists.
    Stay shows "Not open yet" while STAYS_ENABLED is off.
 2. By interest: a ruled two-column list of the 12 categories with the number of live
    listings.
 3. By state: a ruled table of states with live host and experience counts. Start with the
    states that have inventory.
 4. Experiences: the latest real published experiences as ruled rows. If none exist: an
    honest empty state, never invented examples.
 5. Local community: only members who chose public visibility. Empty state if none.
 6. Stay with a local: one paragraph, honest status.
 7. How it works: three plain numbered rows (Discover, Connect, Experience).
 8. Trust and safety: a short paragraph and links to the Safety page.
 9. Become a host: one paragraph and a link.
 10. Stories from India: editorial articles from a simple CMS table or MDX, hidden if there
     are none.
Footer: About, Contact, Safety, Terms, Privacy, FAQs, Host registration, Traveller
registration, language selector, and one line "No ads. No tracking." The long brand line
("Every place has a story. Every home has a welcome. Every person has a connection to
share.") appears only on the About page.

18. DESIGN SYSTEM (must NOT look AI-generated)
Direction: Kinfolk and Monocle editorial restraint, boutique hospitality, a magazine more
than an app. Calm, text-led, flat, generous whitespace, strong grid.
Palette (CSS variables and Tailwind theme):
 Light: ivory #F7F5F0 (page), white #FFFFFF (inputs and sheets), charcoal #252723 (text),
 forest green #596B57 (primary actions, links, verified), deep green #455345 (hover),
 terracotta #A45E46 (small markers only: step numbers, category labels, never body
 text), terracotta-text #8A4A35 (when terracotta must be text), warm grey #E9E5DE (rules and
 quiet surfaces), secondary text #66655F (the supplied #77766F fails AA contrast, do not
 use it for text), error #A4332B.
 Dark: paper #141613, text #ECE9E2, secondary #A8A69D, rule #2E302B, green #8FA88C,
 hover #A9BFA6, terracotta #D08A6E, error #E0817A.
 Print a contrast table proving WCAG AA (4.5:1 text, 3:1 large text and UI).
Fonts (self-hosted via fontsource, font-display swap, latin and devanagari subsets; verify
package names and weights before installing):
 Headings: "Newsreader", "Tiro Devanagari Hindi", Georgia, serif.
 Body and UI: "IBM Plex Sans", "IBM Plex Sans Devanagari", system-ui, sans-serif.
 Line heights: body 1.65 Hindi, 1.5 English; headings 1.4 Hindi, 1.25 English. Hindi body
 6 percent larger so x-heights match. Heading weight 500, never bold. Max line length 66
 characters. Build /dev/type to test conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध), matras, numerals
 and mixed Hindi and English baselines at 320, 768 and 1280px.
Shape and layout: radius 3px, 1px borders, no shadows except a 2px green focus ring with
offset, 12-column grid, max width 1120px, spacing scale 4, 8, 12, 16, 24, 32, 48, 72, 96,
left-aligned text, asymmetric 7/5 and 8/4 splits, ruled lists and tables instead of
cards.
Photography: documentary style, real, properly licensed or commissioned or supplied by hosts,
with a mandatory caption and credit field. A Figure component refuses to render an image
without alt text, credit and licence. No stock-looking people, no AI-generated images, no
illustrations. If no real photo exists, the layout stays text-led and looks finished.
NEVER INCLUDE: emojis, gradients, glass or blur, glowing blobs, purple or blue-violet,
neon, heavy shadows, icon-in-circle grids, three-column feature rows, stat counters used
as boasting, testimonial carousels, "why choose us" blocks, logo walls, cartoon art,
floating decorations, clip-art, mandalas, paisley, rangoli, temple silhouettes, ethnic
patterns, hover-lift, scroll animations, parallax, autoplay, marquees, repeated identical
card sections. Motion is 120ms colour transitions only, and prefers-reduced-motion is
respected.
Components (document each on /dev/components): Bi (bilingual heading: Hindi line first,
English line smaller and grey beneath, one heading element with lang attributes), Button
(primary, secondary, text link, 44px minimum), Field (label above, helper text, inline
error with the word "Error" or "त्रुटि", never colour alone), OTP input, searchable Select,
ruled Table, ListingRow, PersonRow, StatusLabel (bordered text, no coloured pills),
VerificationLabel ("Mobile verified" with a small check glyph and date), Notice (left 2px
rule), Toast, Dialog (focus trap), range Calendar (keyboard accessible, Monday start),
PhotoUploader (crop, EXIF and GPS stripped, explains it), MapView, ConsentBanner (only if
a non-essential cookie exists; avoid needing one).
Copy rules: short concrete sentences that say what happens, who sees what, and what it
costs. Banned words: seamless, unlock, elevate, journey, empower, curated, gateway,
immerse, authentic experience, hidden gems, tapestry, vibrant, nestled, embark, premium,
unique, "beyond the ordinary". No exclamation marks. No em dashes in site copy. No
cliches about India. All-caps taglines become sentence case. Hindi is natural spoken Hindi,
not word-for-word translation, and each Hindi string carries _review: "native speaker".
Accessibility and responsive: WCAG 2.2 AA, skip link, landmarks, logical headings, visible
focus, announced errors, 44px tap targets, 200 percent text resize, no horizontal scroll
from 320px to wide desktop. Mobile first. Test small mobile, mobile, tablet, laptop, large
desktop.

19. BILINGUAL SYSTEM
English default, Hindi fully supported with next-intl. Translate navigation, forms,
validation errors, notifications, emails, system messages and dashboard labels. Headings
and navigation always show both languages (Hindi first). Body copy follows the locale.
Users can write profiles in Hindi, English or both, and original text is preserved. Names
and official place names are never auto-translated. Machine translation (if enabled) is
labelled. All strings live in locale JSON files, none hard-coded in components. Hosts
default to Hindi-first after login based on preferred_language; travellers default to
English. Emails are sent in the recipient's language.

20. DATABASE (PostgreSQL via Supabase, migrations and seed scripts)
UUID primary keys, foreign keys, created_at and updated_at, CHECK constraints on status
fields, indexes, transactions for multi-step operations, soft delete where justified,
structured financial records, retention rules. No important searchable data in loose JSON.
Private verification data lives in separate tables and a private bucket.
Tables: users (profiles), user_roles, admin_permissions, traveller_profiles,
local_member_profiles, host_profiles, experience_providers, countries, states, districts,
cities, localities, interests, user_interests, languages, user_languages, experiences,
experience_images, experience_schedules, experience_bookings,
experience_booking_participants, accommodation_listings, accommodation_images,
accommodation_availability, accommodation_booking_requests, connections, conversations,
conversation_participants, messages, contact_exchanges, saved_items, reviews,
verification_records, reports, blocked_users, notifications, payments, refunds,
payout_records, ledger_entries, payment_webhook_events, host_compliance_records,
guest_records, trip_shares, check_ins, consent_records, waitlist_subscriptions,
data_export_jobs, deletion_jobs, admin_users, admin_audit_logs (append-only, update and
delete blocked by trigger), platform_settings (feature flags, commission rates with
history), translation_records, email_log.
RLS on every table, default deny:
- Users edit only permitted fields of their own profile and cannot change their roles.
- Hosts manage only their own experiences and listings.
- Travellers read only their own bookings.
- Only accepted participants can read a conversation's messages.
- Only authorised admins read verification records, and every read is logged.
- Public queries use dedicated views or functions that return only public columns
  (never last name, private town, contact or address).
Write pgTAP or equivalent RLS tests for each role (anonymous, traveller, local, provider,
accommodation host, moderator, admin) and for cross-user access attempts (IDOR).

21. SECURITY ENGINEERING
- Auth: Supabase Auth with email OTP, phone OTP for local members and hosts (SMS provider
  that supports Indian DLT templates, through a send-sms hook), Cloudflare Turnstile on
  signup, OTP resend and password reset, secure sessions and revocation, password reset,
  optional TOTP MFA for users, mandatory for every admin. Passwords 12+ characters with a
  breached-password check. Session rotation on login and privilege change.
- Application: Zod validation on every server action and route handler, output encoding,
  parameterised queries only, rate limiting on login, OTP, requests, messages, reports,
  uploads, booking and password reset (Upstash Redis in the Mumbai region, or a
  Postgres-based limiter) with exponential lockout, secure cookies, CSRF protection for
  route handlers, safe error messages.
- Headers via middleware: nonce-based CSP (no unsafe-inline for scripts; default-src 'self';
  script-src 'self' 'nonce-...'; style-src 'self'; img-src 'self' data: and the Supabase
  storage origin; font-src 'self'; connect-src 'self' the Supabase project URL and wss
  Realtime URL; frame-src only Turnstile; frame-ancestors 'none'; object-src 'none';
  base-uri 'self'; form-action 'self'), HSTS, nosniff, X-Frame-Options DENY,
  Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy denying everything
  except camera on the selfie page, COOP and CORP.
- Uploads: allowlist, magic-byte check, decompression-bomb guard, size limits, re-encode
  to WebP, strip EXIF and GPS, random filenames, private buckets for anything sensitive,
  signed short-lived URLs, optional malware scan hook.
- Sensitive fields (contact details, optional guest document numbers) are encrypted at
  rest with key rotation. Logs contain no PII, OTPs, tokens or message bodies, with a
  scrubber test.
- Webhooks: signature verification, idempotency through payment_webhook_events, never
  trust a frontend redirect as proof of payment.
- Dependency pinning, lockfile committed, npm audit and gitleaks in CI.
- Privacy: collect the minimum, define retention for every field in
  docs/PRIVACY_DATA_MAP.md, consent records, export and deletion that really purge,
  grievance officer page, breach runbook, adult-only policy. Align with India's DPDP Act
  2023 and its rules; mark every legal text "DRAFT FOR LAWYER REVIEW".

22. BOOKING AND PAYMENT ARCHITECTURE (Phase 2, PAYMENTS_ENABLED off)
Build a reusable booking engine for experiences and eligible stays. Payment interface with
a Razorpay adapter (Cashfree stub) and a development-mode fake that is clearly labelled.
Requirements: server-created orders; verified webhooks; reconciliation job; refunds;
duplicate webhook prevention; booking-to-payment links; a host payout ledger (double-entry
ledger_entries); service-fee calculation using the commission rate snapshot stored on the
booking at the time of booking; receipts; transaction history. Proposed initial settings
(configurable in the admin UI, NOT industry-standard rates): experiences 15 percent,
paid accommodation 10 to 15 percent, free meetups 0, free hospitality 0. Tax fields and
breakdowns exist, but tax rates and the marketplace's tax obligations are configured only
after a CA confirms them. Do not hold customer funds or run a wallet; use the provider's
marketplace or split-payment features only after the provider approves the merchant.
Until approved, the site runs in enquiry-only mode.

23. ADMIN AND MODERATION
Separate admin interface, dense and table-based, keyboard shortcuts, reason required on
every action, every sensitive action and sensitive read audit-logged.
- Overview: users by type, active experiences, listings, pending verifications, pending
  reports, active and completed bookings, commission and revenue summaries only from real
  payment data.
- User management: search, filter, view, suspend, reactivate, review reports.
- Experience moderation: approve, reject, request changes, suspend, remove content.
- Accommodation moderation: review eligibility and registration details, approve, reject,
  request information, suspend.
- Safety: incidents, reports, appeals, suspicious behaviour.
- Finance: payments, refunds, commissions, payouts, reconciliation.
- Locations: states, districts, cities.
- Content: stories, FAQs, legal pages.
- ID images open in a viewer with no download button, with every view logged.

24. SEO, PERFORMANCE, ANALYTICS
Server rendering where useful, unique titles and descriptions, sitemap, robots.txt,
canonical URLs, hreflang, structured data where eligible, social metadata, next/image
optimisation, lazy loading, pagination, caching, efficient queries. Index public state,
district, category, experience and opted-in profile pages. Never index dashboards,
messages, admin or members-only profiles. Targets: Lighthouse mobile performance 90+,
accessibility 100, initial JS under 180 KB gzipped on Home and Explore, good Core Web
Vitals, usable on slow 3G.
Analytics: first-party, cookie-less event tables and an admin dashboard. Acquisition
(visitors, registrations by role, conversion), engagement (searches, requests, accepted
requests, conversations, saves), marketplace (published experiences, booking requests,
confirmed and completed bookings, cancellation rate, average booking value), supply
quality (active hosts, acceptance rate, listing completeness, response time, verification
completion, retention), revenue (gross booking value, commission, refunds, payment fees,
net contribution by product and destination). Never present registrations as bookings.
Keep revenue, booking volume and gross booking value clearly separate.

25. DEMO DATA
A seed script, clearly labelled DEMO everywhere it appears, for six places: Darbhanga and
Madhubani (Bihar), Jaipur (Rajasthan), Kochi (Kerala), Varanasi (Uttar Pradesh), Shillong
(Meghalaya). Sample people: a local student, a traditional painting artist, a family
offering a cooking session, a local history enthusiast, an eligible homestay provider, a
photography enthusiast. Demo accounts are visibly marked. Never create fake reviews, fake
identity checks or fake completed bookings that look real. Provide a script that deletes
all demo data before production.

26. TESTING (run it and report the real results)
- Unit and integration tests for auth, profiles, visibility, roles, requests, accept and
  decline and block, experience create and publish and search, booking with the double
  booking race test, cancellation, accommodation submit and approve and enquiry and
  availability overlap, messaging access, blocked-user contact, role escalation, upload
  validation, rate limits, webhook signatures and idempotency, contact reveal across
  (state, consent, time to start, blocked), deletion purge, ID image deletion after 7 days,
  feature flags hiding disabled features.
- RLS tests per role (section 20).
- Playwright end to end: traveller registration to request, local member approval and
  chat, contact exchange between two browser contexts, experience enquiry, report, language
  switch, admin moderation.
- axe accessibility checks on every page in both languages and both themes, plus layout
  checks at 320px, 768px, 1280px and a large desktop.
Never mark a milestone complete if its core requirement still uses mock data.

27. FOLDER STRUCTURE
app/ (routes, including (public), (dashboard), (admin))
components/ (ui, layout, forms)
features/ auth, traveller, local-community, experiences, accommodation, connections,
 messaging, bookings, payments, safety, admin
lib/ supabase, security, validation, i18n, location, email, payments, flags
types/, hooks/, actions/, messages/ (hi.json, en.json), public/
supabase/ migrations/, seed/, tests/ (RLS), functions/
tests/ (unit, integration, e2e), docs/
Keep UI, database logic, business rules and permissions separate. No giant files.

28. DEPLOYMENT AND DOCUMENTS
Vercel (bom1) and Supabase (ap-south-1). Provide .env.example with every variable
explained, migration and seed instructions, admin account setup with mandatory MFA, backups
and recovery with a tested restore drill, a production checklist, CI with lint, type
check, unit, RLS, Playwright, npm audit and gitleaks. Write, in plain English with no
filler: README.md, docs/SPEC.md, docs/PERMISSIONS.md (role and permission matrix),
docs/API.md, docs/USER_JOURNEYS.md, docs/THREAT_MODEL.md (romance scams, fake hosts,
stalking, predatory hosts targeting women, impersonation, trafficking-risk patterns,
doxxing through reviews, account takeover, moderator misuse, payment fraud, data breach; each
with likelihood, impact, mitigation, residual risk), docs/PRIVACY_DATA_MAP.md,
docs/MODERATOR_HANDBOOK.md, docs/RUNBOOK.md, and docs/LEGAL_CHECKLIST.md.
docs/LEGAL_CHECKLIST.md lists as questions for professionals: foreigner reporting duties
and the current form and timeline; whether free hosting and guiding fall outside homestay
and tourist-guide rules; state homestay and accommodation registration; permit rules for
protected and restricted areas; GST and any marketplace tax duties (CA); payment provider
merchant onboarding and any regulatory limits on holding funds; DPDP Act duties (consent,
retention, breach notification, grievance officer, cross-border transfer); Terms, Privacy
and retention periods.

29. MILESTONES (stop after each, run it, test it, show real results)
 1. Analyse this spec and produce a complete implementation plan and risk list.
 2. Set up Next.js, TypeScript, Tailwind, fonts and the design system, with /dev/type and
    /dev/components pages and the contrast table.
 3. Configure Supabase, migrations, Auth, RLS, feature flags and the audit log, with RLS tests.
 4. Build the homepage, navigation, locale routing and the discovery shell with real
    location data.
 5. Build traveller and local profiles, visibility controls, verification flow.
 6. Build Meet a Local and connection management with the contact exchange.
 7. Build the experience marketplace, provider dashboard and admin approval (enquiry mode).
 8. Build messaging, notifications, reviews and the safety tools (reports, blocks,
    check-ins, trip share, Help page).
 9. Build the booking and payment architecture behind flags, with the double-booking test.
10. Build the accommodation and compliance module behind its flag.
11. Build the full admin, moderation and analytics systems.
12. Complete Hindi and English translations, with a list of Hindi strings for native review.
13. Test everything, optimise, run Lighthouse and axe, and prepare deployment.
After every milestone: run the app, check for errors, run the relevant tests, verify
database operations, check mobile layouts, check server-side permissions, and fix problems
before continuing.

30. FINAL CHECK AFTER MILESTONE 13
Show the real output of all tests, linters and audits. Prove with automated tests that:
(a) a logged-out request never returns last name, private town, contact, address or ID
data; (b) a user cannot read another user's connection, booking, chat or contact; (c)
contact and address stay hidden until the section 9 rules are met; (d) a blocked user
cannot message; (e) ID images are deleted after 7 days; (f) deleting an account purges
what the privacy map promises; (g) feature flags truly hide Phase 2 and Phase 3 features;
(h) concurrent bookings cannot exceed capacity. List anything you could not verify and
why. The most important quality of this product is not the number of features but the
quality of the human connections it creates. Build a trustworthy community and experience
marketplace, not another travel website.

