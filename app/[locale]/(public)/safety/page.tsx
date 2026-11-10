import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Safety Guidelines & Emergency Numbers | सुरक्षा दिशानिर्देश - Atithi Devo Bhava",
  description:
    "Safety protocol, public meeting standards, mutual consent contact sharing, and all-India emergency contacts (112, 1091, 1363).",
};

export default async function SafetyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-12">
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
            {isHindi ? "सुरक्षा" : "Safety"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-8">
        <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
          {isHindi ? "संरक्षण और दिशानिर्देश" : "Protection & Protocols"}
        </span>
        <Bi
          hindi="सुरक्षा दिशानिर्देश और आपातकालीन संपर्क"
          english="Safety Guidelines and Emergency Helplines"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "यात्रियों और स्थानीय नागरिकों दोनों के लिए एक सुरक्षित, पारदर्शी और सम्मानजनक वातावरण।"
            : "Clear standards and institutional protections designed for both international travelers and Indian residents."}
        </p>
      </header>

      {/* Emergency Contacts Banner (Accessible with/without JavaScript) */}
      <section
        className="mb-12 p-6 border-2 border-red-700 bg-red-50 text-red-950 rounded-sm"
        aria-labelledby="emergency-heading"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-red-200">
          <div>
            <h2 id="emergency-heading" className="font-heading text-lg font-bold text-red-950">
              {isHindi ? "भारत में 24x7 राष्ट्रीय आपातकालीन हेल्पलाइन" : "24x7 All-India Emergency Helplines"}
            </h2>
            <p className="text-xs text-red-900 mt-1">
              {isHindi
                ? "यदि आप किसी तात्कालिक संकट या सुरक्षा खतरे में हैं, तो सीधे इन सरकारी नंबरों पर कॉल करें।"
                : "If you are in immediate distress or facing a security threat, dial these official helplines immediately."}
            </p>
          </div>
          <span className="text-xs font-semibold uppercase px-3 py-1 bg-red-200 text-red-950 rounded-sm self-start md:self-auto">
            {isHindi ? "टोल-फ्री नंबर" : "Toll-Free in India"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white border border-red-300 rounded-sm shadow-xs">
            <span className="block text-2xl font-bold text-red-700 font-mono">112</span>
            <span className="block text-xs font-semibold text-red-950 mt-1">
              {isHindi ? "अखिल भारतीय आपातकालीन नंबर" : "National Emergency (All-in-One)"}
            </span>
            <span className="block text-[11px] text-red-800 mt-0.5">
              {isHindi ? "पुलिस, अग्निशमन, एम्बुलेंस" : "Police, Fire, Ambulance"}
            </span>
          </div>

          <div className="p-4 bg-white border border-red-300 rounded-sm shadow-xs">
            <span className="block text-2xl font-bold text-red-700 font-mono">1091</span>
            <span className="block text-xs font-semibold text-red-950 mt-1">
              {isHindi ? "महिला सुरक्षा हेल्पलाइन" : "Women in Distress Helpline"}
            </span>
            <span className="block text-[11px] text-red-800 mt-0.5">
              {isHindi ? "24 घंटे महिला सहायता" : "24x7 Dedicated Assistance"}
            </span>
          </div>

          <div className="p-4 bg-white border border-red-300 rounded-sm shadow-xs">
            <span className="block text-2xl font-bold text-red-700 font-mono">1363</span>
            <span className="block text-xs font-semibold text-red-950 mt-1">
              {isHindi ? "पर्यटन हेल्पलाइन (पर्यटन मंत्रालय)" : "Tourist Helpline (Incredible India)"}
            </span>
            <span className="block text-[11px] text-red-800 mt-0.5">
              {isHindi ? "बहुभाषी सहायता सेवा" : "Multi-lingual guidance"}
            </span>
          </div>

          <div className="p-4 bg-white border border-red-300 rounded-sm shadow-xs">
            <span className="block text-2xl font-bold text-red-700 font-mono">1070</span>
            <span className="block text-xs font-semibold text-red-950 mt-1">
              {isHindi ? "राज्य आपदा प्रबंधन" : "Disaster Management"}
            </span>
            <span className="block text-[11px] text-red-800 mt-0.5">
              {isHindi ? "प्राकृतिक आपदा सहायता" : "Severe Weather & Relief"}
            </span>
          </div>
        </div>
      </section>

      {/* Safety Protocol Columns */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "प्लेटफ़ॉर्म सुरक्षा मानक" : "Platform Safety Standards"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-secondary leading-relaxed">
          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "1. पहली मुलाकात केवल सार्वजनिक स्थान पर" : "1. Public Meeting Rule"}
            </h3>
            <p>
              {isHindi
                ? "यात्रियों और स्थानीय सदस्यों के बीच पहली मुलाकात हमेशा एक सुरक्षित और खुले सार्वजनिक स्थान (जैसे प्रतिष्ठित कैफ़े, विश्वविद्यालय पुस्तकालय परिसर, या मुख्य चौराहा) पर होनी चाहिए। जब तक दोनों पक्ष पूरी तरह सहज न हों, किसी के निजी आवास पर न जाएं।"
                : "Initial meetups between travelers and locals must always occur in a well-lit, open public venue (campus tea stall, museum courtyard, central bazaar café). Never agree to a private secluded venue for a first encounter."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "2. आपसी सहमति से ही संपर्क नंबर साझा" : "2. Mutual Consent Contact Exchange"}
            </h3>
            <p>
              {isHindi
                ? "हम कभी भी किसी का फ़ोन नंबर सार्वजनिक रूप से नहीं दिखाते। चैट के दौरान जब दोनों पक्ष अलग-अलग ‘संपर्क साझा करें’ बटन दबाते हैं, केवल तभी नंबर दिखता है। किसी भी पक्ष द्वारा ब्लॉक करने पर संपर्क तुरंत वापस ले लिया जाता है।"
                : "Phone numbers are never publicly listed. A host and traveler's contact info is revealed only if BOTH explicitly opt in via the in-app consent trigger. If either blocks the other, access is revoked instantly via database functions."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "3. पते और निर्देशांक की पूर्ण गोपनीयता" : "3. Private Residential Address Guard"}
            </h3>
            <p>
              {isHindi
                ? "किसी भी स्थानीय सदस्य का घर का पता या सटीक जीपीएस निर्देशांक साइट पर नहीं होता। केवल प्रशासनिक ब्लॉक या नगर निकाय का सामान्य दायरा दिखाया जाता है। होमस्टे का पता भी केवल पुष्टि के बाद ही मिलता है।"
                : "Precise residential coordinates are never exposed. We store and show only locality centroids (500m-2km radius). For stays (Phase 3), the exact address is released strictly within 72 hours of scheduled check-in."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "4. दो शिकायतों पर स्वतः निलंबन" : "4. Two-Report Automated Search Removal"}
            </h3>
            <p>
              {isHindi
                ? "यदि किसी खाते के विरुद्ध दो गंभीर सुरक्षा शिकायतें दर्ज होती हैं, तो डेटाबेस ट्रिगर द्वारा उस खाते को तुरंत खोज परिणामों से हटा दिया जाता है और प्रशासनिक जांच पूरी होने तक रोक दिया जाता है।"
                : "When an account receives two urgent safety or harassment reports, an automated database trigger instantly de-indexes the profile from search and public views pending human moderator investigation."}
            </p>
          </div>
        </div>
      </section>

      {/* Reporting & Harassment */}
      <section className="p-6 border border-rule bg-page rounded-sm">
        <h2 className="font-heading text-lg font-medium text-text mb-2">
          {isHindi ? "चिंता या घटना की रिपोर्ट कैसे करें" : "How to Report a Concern or Safety Violation"}
        </h2>
        <p className="text-xs text-secondary leading-relaxed mb-4 max-w-2xl">
          {isHindi
            ? "हर संदेश और प्रोफ़ाइल पर एक ‘रिपोर्ट’ बटन उपलब्ध है। हमारी सुरक्षा टीम 2 घंटे के भीतर गंभीर रिपोर्टों की समीक्षा करती है। आप हमारे सहायता केंद्र पर भी सीधे लिख सकते हैं।"
            : "Every profile and message thread features a discreet 'Report' option. Our moderation team reviews urgent reports within 2 hours. You can also contact support directly."}
        </p>
        <Link
          href="/help"
          className="tap-target inline-block px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
        >
          {isHindi ? "सहायता केंद्र पर जाएं" : "Visit Help Center"}
        </Link>
      </section>
    </div>
  );
}
