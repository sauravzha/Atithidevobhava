import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Lock,
  Coffee,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Standards & Emergency Numbers | सुरक्षा दिशानिर्देश - Atithi Devo Bhava",
  description:
    "Safety protocol, public meeting standards, mutual consent contact sharing, DPDP compliance, and all-India emergency contacts (112, 1091, 1363).",
};

export default async function SafetyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-10 sm:py-16">
      {/* Editorial Breadcrumb */}
      <nav className="text-xs font-mono tracking-wider uppercase text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "मुखपृष्ठ" : "Dispatch"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "सुरक्षा दिशानिर्देश" : "Trust & Safety Code"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-forest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>{isHindi ? "संरक्षण व संस्थागत मानक" : "Institutional Safeguards · All India Protocol"}</span>
          </div>

          <Bi
            hindi="सुरक्षा दिशानिर्देश एवं 24x7 राष्ट्रीय हेल्पलाइन"
            english="Trust, Safety Protocols & National Emergency Helplines"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
          />

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
            {isHindi
              ? "अतिथि देवो भवः की नींव सुरक्षा, पारस्परिक सहमति और गरिमा पर टिकी है। यात्री और स्थानीय नागरिक दोनों के अधिकारों की रक्षा के लिए हमारे प्रोटोकॉल भारतीय विधियों और डिजिटल गोपनीयता मानकों पर आधारित हैं।"
              : "Hospitality in India begins with inviolable safety and mutual dignity. Built on statutory Indian emergency channels, verified host registries, and the Digital Personal Data Protection (DPDP) Act."}
          </p>
        </div>
      </header>

      {/* 24x7 All-India Emergency Helplines Banner */}
      <section
        className="mb-14 p-6 sm:p-8 border-2 border-primary/40 bg-warm/30 rounded-sm relative overflow-hidden"
        aria-labelledby="emergency-heading"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-rule">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold mb-1">
              <PhoneCall className="w-4 h-4 text-terracotta" />
              <span>{isHindi ? "तात्कालिक सहायता चैनल" : "Immediate Response Grid"}</span>
            </div>
            <h2 id="emergency-heading" className="font-heading text-xl sm:text-2xl font-medium text-text">
              {isHindi ? "भारत में 24x7 राष्ट्रीय आपातकालीन हेल्पलाइन" : "24x7 All-India Official Emergency Helplines"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary font-heading mt-1">
              {isHindi
                ? "यदि आप किसी तात्कालिक संकट, चिकित्सा आपातकाल या सुरक्षा खतरे में हैं, तो सीधे इन सरकारी नंबरों पर कॉल करें।"
                : "If you are in immediate distress or facing an urgent safety threat, contact these official helplines instantly without requiring data access."}
            </p>
          </div>
          <span className="text-xs font-mono uppercase px-3 py-1 bg-primary text-white rounded-xs self-start md:self-auto font-medium">
            {isHindi ? "टोल-फ्री सरकारी नंबर" : "Govt Toll-Free Numbers"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {/* 112 */}
          <div className="journal-paper p-5 border border-rule rounded-sm hover:border-primary transition-all">
            <span className="block text-3xl font-mono font-bold text-primary mb-1">112</span>
            <span className="block text-xs font-mono font-semibold uppercase text-text mb-1">
              {isHindi ? "अखिल भारतीय आपातकालीन सेवा" : "National Emergency (All-in-One)"}
            </span>
            <span className="block text-xs text-secondary">
              {isHindi ? "पुलिस, अग्निशमन, एम्बुलेंस" : "Police, Fire & Ambulance Integration"}
            </span>
            <a
              href="tel:112"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-terracotta hover:underline"
            >
              <span>{isHindi ? "कॉल करें: 112" : "Dial 112 Direct"}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* 1091 */}
          <div className="journal-paper p-5 border border-rule rounded-sm hover:border-primary transition-all">
            <span className="block text-3xl font-mono font-bold text-terracotta mb-1">1091</span>
            <span className="block text-xs font-mono font-semibold uppercase text-text mb-1">
              {isHindi ? "महिला सुरक्षा हेल्पलाइन" : "Women Safety Helpline"}
            </span>
            <span className="block text-xs text-secondary">
              {isHindi ? "24x7 समर्पित सहायता डेस्क" : "Round-the-Clock Support for Women"}
            </span>
            <a
              href="tel:1091"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-terracotta hover:underline"
            >
              <span>{isHindi ? "कॉल करें: 1091" : "Dial 1091 Direct"}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* 1363 */}
          <div className="journal-paper p-5 border border-rule rounded-sm hover:border-primary transition-all">
            <span className="block text-3xl font-mono font-bold text-forest mb-1">1363</span>
            <span className="block text-xs font-mono font-semibold uppercase text-text mb-1">
              {isHindi ? "पर्यटन हेल्पलाइन (पर्यटन मंत्रालय)" : "Incredible India Tourist Helpline"}
            </span>
            <span className="block text-xs text-secondary">
              {isHindi ? "12 भाषाओं में बहुभाषी मार्गदर्शन" : "Multilingual Support in 12 Languages"}
            </span>
            <a
              href="tel:1363"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-terracotta hover:underline"
            >
              <span>{isHindi ? "कॉल करें: 1363" : "Dial 1363 Direct"}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* 1070 */}
          <div className="journal-paper p-5 border border-rule rounded-sm hover:border-primary transition-all">
            <span className="block text-3xl font-mono font-bold text-text mb-1">1070</span>
            <span className="block text-xs font-mono font-semibold uppercase text-text mb-1">
              {isHindi ? "राज्य आपदा प्रबंधन" : "Disaster Relief Helpline"}
            </span>
            <span className="block text-xs text-secondary">
              {isHindi ? "बाढ़, आंधी व प्राकृतिक आपदा" : "Severe Weather & Flood Guidance"}
            </span>
            <a
              href="tel:1070"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-terracotta hover:underline"
            >
              <span>{isHindi ? "कॉल करें: 1070" : "Dial 1070 Direct"}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Platform Safety Standards */}
      <section className="mb-16">
        <div className="border-b border-rule pb-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
            {isHindi ? "डिजिटल व मानवीय सुरक्षा" : "Core Platform Framework"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "अतिथि देवो भवः के 4 सुरक्षा स्तंभ" : "The Four Pillars of In-Person Safety"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Public Meeting */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-primary mb-4">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold block mb-1">
                {isHindi ? "स्तंभ 1: सार्वजनिक स्थल नियम" : "Pillar 1: The Public Venue Covenant"}
              </span>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "पहली मुलाकात सदैव सार्वजनिक स्थान पर" : "First Encounters in Public Spaces Only"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "यात्री और स्थानीय सदस्य के बीच पहली बातचीत किसी प्रसिद्ध खुले सार्वजनिक स्थल (जैसे विश्वविद्यालय परिसर की चाय की दुकान, श्यामा माई मंदिर प्रांगण या टावर चौक कैफे) पर ही होनी चाहिए। कभी भी पहली बार किसी एकांत या निजी आवास पर सीधे न जाएं।"
                  : "First-time interactions between travelers and local residents must occur at vetted, well-trafficked public landmarks (campus tea stalls, temple promenades, central haat cafes). Private quarters are strictly off-limits for initial introductions."}
              </p>
            </div>
            <div className="pt-4 border-t border-rule/60 text-xs font-mono text-terracotta">
              {isHindi ? "शून्य समझौता सुरक्षा नीति" : "Mandatory platform community rule"}
            </div>
          </article>

          {/* Pillar 2: Mutual Consent */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-terracotta mb-4">
                <Lock className="w-5 h-5 text-terracotta" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold block mb-1">
                {isHindi ? "स्तंभ 2: पारस्परिक सहमति" : "Pillar 2: Mutual Consent Gating"}
              </span>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "फ़ोन नंबर व संपर्क केवल आपसी सहमति से" : "Zero Public Phone Numbers or Spam"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "प्लेटफ़ॉर्म पर किसी भी सदस्य का फ़ोन नंबर कभी सार्वजनिक रूप से प्रदर्शित नहीं होता। जब दोनों पक्ष चैट में 'संपर्क साझा करें' पर अलग-अलग सहमति देते हैं, केवल तभी संपर्क प्रकट होता है। किसी भी पक्ष द्वारा ब्लॉक करने पर पहुंच तुरंत समाप्त हो जाती है।"
                  : "Neither phone numbers nor private communication handles are ever indexed publicly. Direct contact details are decrypted strictly when BOTH participants trigger mutual consent in chat. Revocation by either party is instant."}
              </p>
            </div>
            <div className="pt-4 border-t border-rule/60 text-xs font-mono text-forest">
              {isHindi ? "डेटाबेस स्तर पर एन्क्रिप्टेड नियंत्रण" : "Cryptographically gated database functions"}
            </div>
          </article>

          {/* Pillar 3: Address Centroid Shield */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-forest mb-4">
                <MapPin className="w-5 h-5 text-forest" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold block mb-1">
                {isHindi ? "स्तंभ 3: आवासीय गोपनीयता" : "Pillar 3: Centroid Shielding"}
              </span>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "आवासीय पते का 72 घंटे पूर्व प्रकटीकरण" : "Approximate Centroid & 72-Hour Release"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "सार्वजनिक खोज में केवल मोहल्ले का सामान्य दायरा (500 मीटर से 2 किमी) प्रदर्शित होता है। पारिवारिक आवास (चरण 3) का सटीक जीपीएस पता केवल पुष्टि की गई बुकिंग के 72 घंटे पूर्व ही अधिकृत अतिथि को जारी किया जाता है।"
                  : "Search maps only display district and neighborhood centroids (approx 1-2 km radius). For verified residential stays, precise street addresses are revealed to the confirmed traveler exactly 72 hours before arrival."}
              </p>
            </div>
            <div className="pt-4 border-t border-rule/60 text-xs font-mono text-terracotta">
              {isHindi ? "पारिवारिक निजता संरक्षण" : "Family privacy protection standard"}
            </div>
          </article>

          {/* Pillar 4: Two-Report Strike Trigger */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-text mb-4">
                <ShieldAlert className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-text font-semibold block mb-1">
                {isHindi ? "स्तंभ 4: त्वरित कार्रवाई ट्रिगर" : "Pillar 4: Automated Moderation"}
              </span>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "दो शिकायतों पर स्वतः खोज से विलोपन" : "Two-Report Automated Search Removal"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "यदि किसी भी खाते या अनुभव के विरुद्ध दो अलग-अलग उपयोगकर्ताओं द्वारा सुरक्षा या दुर्व्यवहार की शिकायत दर्ज होती है, तो डेटाबेस ट्रिगर द्वारा उस प्रोफ़ाइल को तुरंत सार्वजनिक दृश्य से हटा दिया जाता है जब तक कि मानवीय जांच पूरी न हो।"
                  : "If an account receives two independent safety or misconduct reports, database triggers automatically delist the profile from search indexes instantly while our human moderation council investigates."}
              </p>
            </div>
            <div className="pt-4 border-t border-rule/60 text-xs font-mono text-forest">
              {isHindi ? "2 घंटे के भीतर मानवीय समीक्षा" : "2-Hour urgent safety review SLA"}
            </div>
          </article>
        </div>
      </section>

      {/* DPDP Act 2023 Compliance & Privacy Rights */}
      <section className="journal-paper p-8 sm:p-10 border border-rule rounded-sm mb-16 bg-warm/20">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-forest font-semibold">
            <CheckCircle2 className="w-4 h-4 text-forest" />
            <span>{isHindi ? "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP) 2023" : "DPDP Act 2023 Statutory Compliance"}</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "आपकी व्यक्तिगत जानकारी पर केवल आपका अधिकार" : "Your Privacy & Data Rights in India"}
          </h2>

          <p className="text-sm sm:text-base text-secondary leading-relaxed font-heading">
            {isHindi
              ? "अतिथि देवो भवः किसी तीसरे पक्ष के विज्ञापन ट्रैकर का उपयोग नहीं करता, न ही आपका डेटा किसी मार्केटिंग एजेंसी को बेचता है। आपका पहचान पत्र, फोन नंबर और बुकिंग रिकॉर्ड एन्क्रिप्टेड रूप में सुरक्षित हैं, और आप जब चाहें अपने खाते और डेटा को हटाने का अनुरोध कर सकते हैं।"
              : "Atithi Devo Bhava is built in strict adherence to India's Digital Personal Data Protection Act. We deploy zero third-party commercial ad trackers, sell zero personal information, and guarantee complete data erasure upon account deletion."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rule/60 text-xs font-mono text-text">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
              <span>{isHindi ? "शून्य विज्ञापन ट्रैकर" : "Zero 3rd-party ad trackers"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
              <span>{isHindi ? "एन्क्रिप्टेड पहचान पत्र" : "Encrypted KYC data storage"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
              <span>{isHindi ? "एक-क्लिक डेटा विलोपन" : "One-click data deletion right"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Reporting Hotline & Support */}
      <section className="p-8 border border-rule rounded-sm bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-xl font-medium text-text mb-1">
            {isHindi ? "क्या आपको किसी सुरक्षा समस्या की रिपोर्ट करनी है?" : "Need to Report a Safety Concern or Incident?"}
          </h2>
          <p className="text-xs sm:text-sm text-secondary font-heading max-w-xl">
            {isHindi
              ? "हर प्रोफ़ाइल और चैट संदेश में एक गोपनीय 'रिपोर्ट' विकल्प होता है। आप सीधे हमारी सुरक्षा टीम से भी संपर्क कर सकते हैं।"
              : "Every profile and message thread features a confidential 'Report' option. For expedited escalation, contact our safety desk directly."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
          >
            <span>{isHindi ? "सुरक्षा डेस्क से संपर्क" : "Contact Safety Desk"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
