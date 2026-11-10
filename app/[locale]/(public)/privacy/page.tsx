import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Privacy Policy | गोपनीयता नीति - Atithi Devo Bhava",
  description:
    "Compliant with the Digital Personal Data Protection (DPDP) Act 2023. Strict data minimization, zero ad trackers, and mutual consent disclosure.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-xs text-secondary mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-secondary block mb-1">
          {isHindi ? "कानूनी अनुपालन • DPDP अधिनियम 2023" : "Legal Framework • DPDP Act 2023"}
        </span>
        <Bi
          hindi="गोपनीयता नीति और डेटा संरक्षण"
          english="Privacy Policy & Data Protection"
          as="h1"
          className="mb-3"
        />
        <p className="text-xs text-secondary">
          {isHindi
            ? "अंतिम अद्यतन: नवंबर 2026 • डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के तहत तैयार"
            : "Last Updated: November 2026 • Formulated under India's Digital Personal Data Protection Act, 2023"}
        </p>
      </header>

      {/* Body Content */}
      <div className="space-y-8 text-xs text-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "1. हमारा मूल सिद्धांत: डेटा न्यूनीकरण" : "1. Foundational Principle: Data Minimization"}
          </h2>
          <p>
            {isHindi
              ? "अतिथि देवो भव (Atithi Devo Bhava) डेटा न्यूनीकरण के सख्त सिद्धांत पर संचालित होता है। हम केवल वही न्यूनतम जानकारी एकत्र करते हैं जो उपयोगकर्ताओं के बीच सुरक्षित और प्रामाणिक संवाद स्थापित करने के लिए आवश्यक हो।"
              : "Atithi Devo Bhava is built upon strict data minimization. We collect only the absolute minimum data required to establish authentic, safe communication between travelers and local residents."}
          </p>
          <div className="p-4 bg-warm/20 border border-rule rounded-sm text-text space-y-1">
            <strong>{isHindi ? "हम क्या कभी एकत्र या संग्रहीत नहीं करते:" : "What We NEVER Collect or Store by Default:"}</strong>
            <ul className="list-disc list-inside space-y-0.5 text-secondary">
              <li>{isHindi ? "आधार संख्या या बायोमेट्रिक डेटा" : "Aadhaar numbers or biometric details"}</li>
              <li>{isHindi ? "पासपोर्ट की स्कैन प्रतियां या वीज़ा संख्या" : "Passport scans or visa identification numbers"}</li>
              <li>{isHindi ? "निजी आवासीय पते या सटीक घर के जीपीएस निर्देशांक" : "Exact residential addresses or precise home coordinates"}</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "2. द्विपक्षीय सहमति से संपर्क प्रकटीकरण" : "2. Dual Mutual Consent Contact Disclosure"}
          </h2>
          <p>
            {isHindi
              ? "प्लेटफ़ॉर्म पर किसी भी उपयोगकर्ता का फ़ोन नंबर या संपर्क विवरण सार्वजनिक रूप से प्रदर्शित नहीं होता है। किसी भी मुलाक़ात के लिए, फ़ोन नंबर केवल तभी प्रकट होता है जब दोनों पक्ष (यात्री और स्थानीय सदस्य) अलग-अलग इन-ऐप सहमति प्रदान करते हैं। यदि कोई भी पक्ष दूसरे को ब्लॉक करता है, तो संपर्क विवरण तुरंत वापस ले लिया जाता है।"
              : "Personal phone numbers are never publicly listed. Contact information is revealed strictly when BOTH parties independently trigger mutual consent within an active scheduled meetup. Blocking immediately revokes disclosure."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "3. शून्य विज्ञापन और शून्य तृतीय-पक्ष ट्रैकर" : "3. Zero Advertising & Zero Third-Party Trackers"}
          </h2>
          <p>
            {isHindi
              ? "हमारी वेबसाइट पर कोई व्यावसायिक विज्ञापन नहीं हैं, कोई व्यवहारिक ट्रैकिंग पिक्सेल (जैसे मेटा पिक्सेल या गूगल विज्ञापन टैग) नहीं हैं। सभी वेब फ़ॉन्ट स्वयं-होस्ट किए गए हैं और किसी बाहरी सर्वर से उपयोगकर्ता का आईपी पता साझा नहीं होता।"
              : "We run zero commercial advertising, zero third-party behavioral trackers, and zero ad pixels. All web typography is self-hosted locally on our application bundle to prevent third-party IP leakage."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "4. अधिकृत डेटा प्रोसेसर और निवास (Data Residency)" : "4. Authorized Processors & Indian Data Residency"}
          </h2>
          <p>
            {isHindi
              ? "हमारा प्राथमिक डेटाबेस और एप्लिकेशन भारत के मुंबई क्षेत्र (ap-south-1) में स्थित सर्वरों पर संचालित होता है:"
              : "Our primary databases and computational clusters operate within the Mumbai region (ap-south-1) of India:"}
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Supabase:</strong> {isHindi ? "डेटाबेस, प्रमाणीकरण और भंडारण (मुंबई ap-south-1)" : "Database, Auth, and Storage (Mumbai ap-south-1)"}</li>
            <li><strong>Vercel:</strong> {isHindi ? "एप्लिकेशन सर्विंग और सुरक्षा हेडर (मुंबई bom1)" : "Application Serving & Edge Security (Mumbai bom1)"}</li>
            <li><strong>Resend / DLT SMS:</strong> {isHindi ? "लेन-देन संबंधी ओटीपी और सूचनाएं" : "Transactional security OTP delivery"}</li>
            <li><strong>Cloudflare Turnstile:</strong> {isHindi ? "गोपनीयता-अनुकूल बॉट-रोधी सत्यापन" : "Privacy-preserving anti-bot challenge"}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "5. डेटा स्वामी के अधिकार (DPDP अधिनियम 2023)" : "5. Your Rights Under DPDP Act 2023"}
          </h2>
          <p>
            {isHindi
              ? "भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के तहत आपके पास निम्नलिखित अधिकार हैं:"
              : "Under India's Digital Personal Data Protection Act, 2023, you hold the following statutory rights:"}
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>{isHindi ? "जानकारी प्राप्त करने का अधिकार:" : "Right to Access:"}</strong> {isHindi ? "अपने संसाधित किए जा रहे डेटा का सारांश देखना।" : "Summary of processed personal data."}</li>
            <li><strong>{isHindi ? "सुधार और अद्यतन का अधिकार:" : "Right to Correction:"}</strong> {isHindi ? "किसी भी गलत या अधूरे व्यक्तिगत डेटा को सुधारना।" : "Updating inaccurate or incomplete personal records."}</li>
            <li><strong>{isHindi ? "डेटा मिटाने का अधिकार:" : "Right to Erasure:"}</strong> {isHindi ? "अपना खाता बंद करने और व्यक्तिगत डेटा हटाने का अनुरोध (30 दिनों में पूर्ण)।" : "Account closure and personal data deletion within 30 days."}</li>
            <li><strong>{isHindi ? "शिकायत निवारण का अधिकार:" : "Right to Grievance Redressal:"}</strong> {isHindi ? "हमारे शिकायत अधिकारी से सीधे संपर्क करना।" : "Direct recourse to our Resident Grievance Officer."}</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-rule">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "6. शिकायत अधिकारी संपर्क" : "6. Grievance Officer Contact"}
          </h2>
          <p>
            {isHindi
              ? "डेटा संरक्षण संबंधी किसी भी प्रश्न या शिकायत के लिए:"
              : "For all data protection inquiries, consent revocations, or statutory grievances:"}
          </p>
          <div className="p-3 bg-page border border-rule font-mono text-[11px] space-y-0.5">
            <div>Email: grievance@atithidevobhava.in</div>
            <div>Subject: Data Protection Grievance / DPDP Inquiry</div>
          </div>
        </section>
      </div>
    </div>
  );
}

