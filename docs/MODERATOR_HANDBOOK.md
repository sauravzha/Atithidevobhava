# Safety and Moderation Operations Manual (MODERATOR_HANDBOOK.md)

Document Version: 1.0 (Milestone 1)
Classification: Internal - Safety and Moderation Operations
Project: Atithi Devo Bhava (अतिथि देवो भवः)

This handbook provides standard operating procedures, investigation protocols, and decision rubrics for platform moderators and safety administrators.

---

## 1. Core Operating Principles

1. Protection of Human Life and Safety: Immediate physical safety takes precedence over platform rules, commercial metrics, and host availability.
2. Anonymity of Reporters: The identity of a reporting user is strictly confidential and must never be disclosed to the reported party or any third party under any circumstances.
3. Written Justification for Every Action: Every moderation action (suspension, listing rejection, review redaction, document approval) requires a concise, factual written explanation logged in `admin_audit_logs`.
4. Principle of Least Privilege: Access identity verification documents and private message contexts only when required for an active investigation.
5. Zero Tolerance for Exploitation: Suspected human trafficking, sexual solicitation, intimidation, or extortion results in immediate account de-indexing and emergency escalation.

---

## 2. Priority Incident Triage and Report Categories

All incident reports submitted via the application are categorized into standard buckets with deterministic triage SLAs:

| Incident Category | Severity | Initial Response SLA | System Action | Required Operational Steps |
| :--- | :--- | :--- | :--- | :--- |
| Suspected Trafficking or Exploitation | Critical | Immediate (< 15 mins) | Account de-indexed; alert sent to Super Admin | Freeze account, preserve immutable audit snapshot, prepare law enforcement dossier |
| Unsafe or Threatening Behaviour | Critical | Immediate (< 30 mins) | Priority moderation queue | Contact user via verified channel; verify physical safety; issue suspension |
| Harassment or Inappropriate Sexual Content | High | Within 2 hours | Priority moderation queue | Inspect thread context (last 20 messages); issue warning or 30-day suspension |
| Asked for Money / Financial Solicitation | High | Within 4 hours | Flagged for scam review | Verify payment details, inspect transaction logs; suspend fraudulent profile |
| Discrimination or Hate Speech | Medium | Within 12 hours | Standard queue | Evaluate against cultural guidelines; warn or remove listing |
| Fake Profile / Impersonation | Medium | Within 24 hours | Standard queue | Request identity re-verification; suspend if unverified |
| Other Policy Violations | Low | Within 48 hours | Standard queue | Standard ticket resolution |

### The Two-Report Automatic De-Indexing Rule
If an account receives two independent Urgent or High-severity reports from separate verified users, the database trigger automatically de-indexes the profile and all active listings from public search results pending human moderation review.

---

## 3. Emergency "I Need Help" Panic Protocol

When a traveller or host presses the "I need help" button in the application:

1. Immediate Notification:
   - High-priority SMS and email alert dispatched to the on-duty emergency moderator.
   - Automated notification dispatched to the user's registered Trusted Contact with their last recorded check-in location (general district) and active host display name.
2. Moderator Action:
   - Check the user's active connection / stay status immediately.
   - Attempt direct contact via registered phone or emergency email.
   - If user reports an active emergency or fails to respond under suspicious circumstances, provide immediate assistance to connect the user with local Indian emergency services:
     - National Emergency Hotline: 112
     - Women Helpline (All India): 1091
     - National Tourist Helpline (Multi-lingual): 1363
     - Local District Police Control Room (Darbhanga: 06272-222222; Madhubani: 06276-222222)
3. Incident Logging: Record full chronological timeline in the incident log with timestamped entries.

---

## 4. Handling Identity Verification Documents

1. Accessing Identity Records:
   - Access is restricted exclusively to `verification_reviewer` and `super_admin` roles with active AAL2 MFA.
   - Documents are viewed strictly inside the web viewer via temporary signed URLs (15-minute expiration).
   - Downloading or taking unwatermarked captures of raw identity cards is strictly prohibited and constitutes a termination violation.
2. Review Rubric:
   - Verify that the government photo ID has the national identification number (e.g., Aadhaar number) properly masked. If unmasked, reject immediately with reason: "Aadhaar number must be masked before upload".
   - Cross-examine the face on the photo ID against the live selfie submission.
   - Confirm that the legal name matches the name on the ID card.
3. Decision and Purge:
   - Record decision: Approved or Rejected, citing clear policy reason.
   - Confirm that the 7-day automatic deletion timer is active for the uploaded image assets.

---

## 5. Review Moderation and Redaction Guidelines

1. Policy-Breaking Review Criteria:
   - Reviews containing private phone numbers, physical residential addresses, email addresses, or social media handles.
   - Reviews containing vulgarity, hate speech, or explicit threats.
   - Retaliatory reviews where an investigation establishes malicious intent following a refused extortion attempt.
2. Redaction Procedure:
   - Moderators never edit review ratings or opinions simply because a host disagrees with a negative score.
   - If PII or defamatory slurs appear, the moderator redacts the specific offensive text, appending a system note: `[Redacted by moderator for privacy policy violation - Case #XXXX]`.
   - Complete original text is preserved in the secure audit table for legal compliance.

