# Legal and Regulatory Review Checklist (LEGAL_CHECKLIST.md)

Document Status: DRAFT FOR LAWYER REVIEW AND CHARTERED ACCOUNTANT REVIEW
Project: Atithi Devo Bhava (अतिथि देवो भवः)
Document Version: 1.0 (Milestone 1)

This checklist compiles critical legal, regulatory, and tax questions that must be formally reviewed and signed off by qualified Indian legal counsel and a practicing Chartered Accountant (CA) prior to enabling live commercial transactions or overnight stays.

---

## 1. Foreigner Reporting Duties and Guest Compliance

### Questions for Legal Counsel:
1. Exact Statutory Timeline and Reporting Form:
   - What is the current statutory timeline for residential hosts accommodating foreign nationals to submit guest reports to the Foreigners Regional Registration Office (FRRO / FRO)?
   - Under current legal notifications (including transition between the Foreigners Order 1948 Form C framework and the 2025 Bureau of Immigration Form III proposals), what is the precise form number, digital portal requirement, and mandatory submission deadline (e.g., 24 hours from arrival)?
2. Platform Liability vs. Host Responsibility:
   - Does the platform incur intermediary liability under Section 79 of the Information Technology Act or provisions of the Foreigners Act if an individual host fails to submit the mandatory foreign guest reporting form?
   - Is our educational checklist and compliance reminder notice legally sufficient to demonstrate platform due diligence?
3. Non-Commercial Residential Hospitality:
   - Does a resident providing free, unpaid hospitality (cultural exchange, tea, staying in a spare bedroom without consideration) trigger the statutory reporting requirements under the Foreigners Act?
   - What documentation must a non-commercial host retain to establish that hospitality was gratuitous rather than an unregistered commercial guesthouse?
4. Document Number Storage and DPDP Act:
   - Given that our default data model deliberately avoids storing foreign passport or visa numbers, does enabling optional encrypted storage of passport details create higher compliance obligations or regulatory liability under Indian cybersecurity directives (CERT-In) and DPDP Act 2023?

---

## 2. Homestay, Tourism, and Local Guide Regulations

### Questions for Legal Counsel:
1. Tourist Guiding vs. Informal Cultural Walks:
   - Do informal community meetups (e.g., tea walks, Mithila art demonstrations, neighbourhood market strolls) run by residents without a professional tour guide license violate state tourism acts or archaeological site guiding regulations?
   - Does introducing a marketplace commission in Phase 2 change the classification of these informal activities into regulated commercial travel agency or tour operator services?
2. State-Specific Homestay Registration:
   - In our pilot state of Bihar (Darbhanga and Madhubani), what are the specific criteria and local district administration registration requirements for a residence to qualify as an authorized "Bed & Breakfast" or "Homestay"?
   - What are the corresponding registration prerequisites in our expansion states (Rajasthan, Kerala, Uttar Pradesh, Meghalaya)?
3. Household Definition and Capacity Limits:
   - What are the maximum room and guest capacity thresholds before a private home is legally classified as a commercial hotel or lodge under local municipal and state legislation?

---

## 3. Protected Areas, Restricted Areas, and Foreigner Permits

### Questions for Legal Counsel:
1. Protected Area Permits (PAP) and Restricted Area Permits (RAP):
   - What specific districts in pilot and expansion states (e.g., portions of Meghalaya or borderline regions) require foreigners to obtain a Protected Area Permit (PAP) or Restricted Area Permit (RAP)?
   - How should our platform notice engine verify and display permit requirements to prospective international visitors prior to booking confirmation?
2. Legal Disclaimer Standards:
   - What exact wording is required to ensure the platform is not held liable if a foreign visitor enters an area requiring permits without appropriate governmental clearances?

---

## 4. Taxation, GST, and Marketplace Intermediary Obligations

### Questions for Chartered Accountant (CA):
1. Goods and Services Tax (GST) Liability:
   - Under Section 9(5) of the Central Goods and Services Tax (CGST) Act, is the platform liable to pay GST on accommodation services provided by unregistered individual hosts?
   - What is the tax classification and GST rate applicable to platform service fees / commissions on cultural experiences (15%) versus homestays (10-15%)?
2. Tax Collection at Source (TCS) and Tax Deducted at Source (TDS):
   - What are our exact obligations under Section 52 of the CGST Act regarding electronic commerce operator TCS collection and filing?
   - What are our obligations under Section 194-O of the Income Tax Act regarding TDS on gross payments to resident hosts?
3. Invoicing and Billing Architecture:
   - Does the platform need to issue a dual invoice (one on behalf of the host for the experience/stay fee, and one on behalf of the platform for the service fee)?
   - What mandatory GSTIN, HSN/SAC codes, and state disclosure details must appear on customer receipts?

---

## 5. Payment Aggregator and RBI Regulations

### Questions for Legal Counsel & Payment Specialist:
1. Holding Customer Funds:
   - Can the platform receive payments directly into a standard current account, or must all transactions flow through an RBI-authorized Payment Aggregator escrow account with automated split-settlement (e.g., Razorpay Route)?
2. Merchant Classification and Onboarding:
   - What Know Your Customer (KYC) documentation is legally required to onboard local hosts to receive bank payouts?
3. Refund and Chargeback Compliance:
   - What mandatory refund timeframes apply under the Consumer Protection (E-Commerce) Rules 2020?

---

## 6. Digital Personal Data Protection Act 2023 (DPDP Act)

### Questions for Legal Counsel:
1. Consent Architecture:
   - Does our multi-step purpose-specific consent mechanism (`consent_records`) fully satisfy Section 6 requirements for clear, informed, and unconditional consent?
2. Data Fiduciary Obligations:
   - Given our adult-only policy (18+), what specific verification steps are deemed legally reasonable under the DPDP Act to verify age without processing intrusive identity documents?
3. Cross-Border Data Transfers:
   - What restrictions apply when processing data of international travellers whose country of origin may have extraterritorial privacy laws (e.g., GDPR in the European Union)?
4. Grievance Redressal and Data Protection Officer:
   - What are the statutory requirements for appointing a resident Grievance Officer in India, and what are the mandatory turnaround timelines for resolving privacy complaints?
5. Data Breach Notification:
   - What is the mandated CERT-In (6 hours) and Data Protection Board notification procedure in the event of an identified security incident or data breach?

