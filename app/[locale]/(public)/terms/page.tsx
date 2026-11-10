import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Terms of Service | सेवा की शर्तें - Atithi Devo Bhava",
  description:
    "Terms of service, adult age requirement (18+), platform code of conduct, and legal framework of Atithi Devo Bhava.",
};

export default async function TermsPage({
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
            {isHindi ? "सेवा की शर्तें" : "Terms of Service"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-secondary block mb-1">
          {isHindi ? "कानूनी अनुबंध" : "Legal Agreement"}
        </span>
        <Bi
          hindi="सेवा की शर्तें और उपयोग नियम"
          english="Terms of Service & Community Agreement"
          as="h1"
          className="mb-3"
        />
        <p className="text-xs text-secondary">
          {isHindi
            ? "अंतिम अद्यतन: नवंबर 2026 • भारत के कानूनों के अधीन संचालित"
            : "Last Updated: November 2026 • Governed by the Laws of the Republic of India"}
        </p>
      </header>

      {/* Terms Content */}
      <div className="space-y-8 text-xs text-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "1. वयस्क आयु अनिवार्यता (18+)" : "1. Strict 18+ Age Requirement"}
          </h2>
          <p>
            {isHindi
              ? "अतिथि देवो भव पर पंजीकरण के लिए प्रत्येक उपयोगकर्ता का कम से कम 18 वर्ष का वयस्क होना अनिवार्य है। हम नाबालिगों या बच्चों को पंजीकृत उपयोगकर्ता के रूप में स्वीकार नहीं करते हैं।"
              : "Registration on Atithi Devo Bhava is strictly restricted to adults aged 18 years or older. We do not permit minors to hold accounts or initiate requests under any circumstances."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "2. सार्वजनिक स्थल और सुरक्षा प्रोटोकॉल" : "2. Public Venue & Safety Protocol"}
          </h2>
          <p>
            {isHindi
              ? "यात्री और स्थानीय सदस्य के बीच पहली मुलाकात हमेशा एक अनुशंसित सार्वजनिक स्थल पर आयोजित की जानी चाहिए। किसी भी सदस्य द्वारा सुरक्षा नियमों का उल्लंघन करने पर खाता तत्काल निलंबित किया जा सकता है।"
              : "All initial meetups must be held in designated public spaces. Attempting to force private secluded venues prior to mutual familiarity violates our terms and warrants immediate suspension."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "3. आचार संहिता और शून्य सहिष्णुता" : "3. Code of Conduct & Zero Harassment"}
          </h2>
          <p>
            {isHindi
              ? "प्लेटफ़ॉर्म पर किसी भी प्रकार का उत्पीड़न, अभद्र भाषा, अवांछित संपर्क, भेदभाव, या गैर-कानूनी वाणिज्यिक गतिविधियों के प्रति शून्य सहिष्णुता की नीति है। दो गंभीर शिकायतों पर संबंधित खाते को स्वतः सार्वजनिक खोज से हटा दिया जाता है।"
              : "We enforce zero tolerance for harassment, derogatory language, unsolicited solicitations, discrimination, or unlawful commercial exploits. Receiving two urgent safety reports triggers immediate automated search de-indexing."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "4. चरण 1 पूछताछ मॉडल" : "4. Phase 1 Enquiry-Only Model"}
          </h2>
          <p>
            {isHindi
              ? "चरण 1 के अंतर्गत सांस्कृतिक अनुभव केवल पूछताछ के आधार पर सूचीबद्ध हैं। किसी भी पक्ष द्वारा ऑफ-प्लेटफ़ॉर्म अग्रिम नकद भुगतान या असुरक्षित वायर ट्रांसफर की मांग करना वर्जित है।"
              : "In Phase 1, cultural experiences are enquiry-only. Demanding unverified advance cash transfers or off-platform wire remittances is strictly prohibited."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "5. अधिकार क्षेत्र और कानून" : "5. Governing Law & Jurisdiction"}
          </h2>
          <p>
            {isHindi
              ? "ये शर्तें भारत गणराज्य के कानूनों के अनुसार शासित और व्याख्यायित की जाएंगी। किसी भी विवाद का निपटारा मुंबई, महाराष्ट्र स्थित सक्षम न्यायालयों के अनन्य क्षेत्राधिकार में होगा।"
              : "These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra."}
          </p>
        </section>
      </div>
    </div>
  );
}

