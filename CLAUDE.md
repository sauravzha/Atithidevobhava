STANDING RULES FOR THIS PROJECT (read at the start of every session)

START AND END OF EVERY SESSION
- Read docs/SPEC.md, docs/DECISIONS.md and docs/PROGRESS.md before doing anything.
- At the end, update docs/PROGRESS.md: what is done, what is half-done, what is next,
  what is broken. Never leave the repo in a state that does not build.

HONESTY
- Never say something works unless you ran it and saw it work. Paste the real command and
  the real output. If a test fails, say it failed. If you skipped something, say so.
- Never invent facts: district names, laws, form numbers, tax rates, prices, statistics,
  reviews, quotes, photos, user testimonials. If a fact is needed and you do not have a
  source, write "UNKNOWN: needs source" in the code or doc and tell me. Do not guess.
- Never mark a task done while it still uses mock data, hard-coded sample data or a TODO.

SCOPE
- Build only the current milestone. No bonus features, no refactoring of finished
  milestones unless a bug requires it. Write extra ideas in docs/IDEAS.md instead of
  building them.
- When something is ambiguous, pick the safest sensible default, write it in
  docs/DECISIONS.md (decision, alternatives, reason), and keep going. Ask me only when you
  need a credential, a file, or a legal fact I must supply. When you need one, stop and
  list exactly what you need.

SECURITY
- Deny by default. Least privilege everywhere.
- Never disable RLS, CSRF, CSP, rate limiting or validation to make something work. Find
  and fix the cause.
- The Supabase service-role key and every other secret stays on the server. Never in
  client code, never in logs, never in the repo.
- Never log personal data, OTPs, tokens or message text.
- Every new table gets RLS and a test in the same commit. Every new endpoint gets
  validation, an auth check, an object-level permission check and a rate limit.
- For every new feature, add 3 lines to docs/THREAT_MODEL.md: how could someone abuse
  this, what stops them, what is left over.
- Every new personal-data field gets a row in docs/PRIVACY_DATA_MAP.md (why, who sees it,
  how long it is kept, how it is deleted).

DATABASE
- Migrations only. Never edit a migration that has already run. Never run destructive SQL
  (DROP, TRUNCATE, bulk DELETE) against anything but the local database. Never touch
  production data from this session.
- Money amounts are stored as integers in paise, never floats.
- All dates are stored in UTC and shown in Asia/Kolkata for hosts and in the traveller's
  chosen timezone for travellers.

CODE QUALITY
- TypeScript strict, no "any", no ts-ignore without a comment explaining why.
- Small files and small functions. Name things by the domain (connection, experience,
  contactExchange), not by technique (helper, utils2).
- Every screen has loading, empty and error states, written in plain bilingual language.
  Never show a stack trace or a raw error code to a user.
- Every new npm package needs a one-line reason in docs/DECISIONS.md. Prefer well-maintained
  packages with a recent release. No package that loads remote scripts or fonts at runtime.

GIT
- One branch per milestone, small commits with plain messages, tests run before every commit.
- Never commit .env files, keys, database dumps, ID images, or real user data.

UI AND COPY
- Before building a page, write a 3-line layout description. After building it, check it
  against the "NEVER INCLUDE" list in the spec and against the banned-word list. Fix
  violations before showing it to me.
- Take screenshots at 320px and 1280px, in English and Hindi, in light and dark. Look at
  them. Describe any problem you see and fix it.
- No lorem ipsum. No placeholder photos. No "coming soon" pages that pretend to work.
- Every string goes in the locale files. Every Hindi string is marked for native review.

DEFINITION OF DONE (all must be true before you say a milestone is finished)
- Build passes. Type check passes. Lint passes. Unit, integration and RLS tests pass.
- Playwright tests for the milestone pass. axe reports no violations.
- No console errors. No TODO or FIXME left. No mock data in a finished feature.
- Works at 320px with no horizontal scroll, in both languages and both themes.
- Docs updated (PROGRESS, DECISIONS, PERMISSIONS, THREAT_MODEL, PRIVACY_DATA_MAP).
- You listed what you could not verify.

PRODUCTION HOSTING WARNING (put in the README)
- Check the hosting plan terms before launch. Free tiers can have usage limits, can pause
  inactive projects, may exclude backups, and some plans do not allow commercial use.
  Choose plans that include backups and the data region I need (Mumbai).
