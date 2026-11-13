import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Bi } from "@/components/ui/bi";
import {
  ShieldCheck,
  KeyRound,
  FileText,
  Clock,
  ArrowRight,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Stay with a Local Resident (Phase 3 Roadmap) | पारिवारिक प्रवास - Atithi Devo Bhava",
  description:
    "Homestays and residential hospitality status. Opening in Phase 3 following full regulatory, Form C, and safety compliance.",
};

export default async function StaysDirectoryPage({
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
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              {isHindi ? "अन्वेषण" : "Field Directory"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "पारिवारिक प्रवास (चरण 3)" : "Family Homestays (Phase 3)"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-secondary mb-3">
              <Clock className="w-3.5 h-3.5 text-terracotta" />
              <span>{isHindi ? "माध्यम 3: पारिवारिक प्रवास · आगामी चरण" : "Product C · Residential Homestays · Coming Soon"}</span>
            </div>

            <Bi
              hindi="पारिवारिक आवास और प्रामाणिक होमस्टे"
              english="Traditional Courtyard Stays & Residential Homestays"
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
            />

            <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
              {isHindi
                ? "मिथिला के पारंपरिक दालान, ईंट-चूने की हवेलियों और ग्रामीण परिवारों के साथ ठहरने की परिकल्पना। उच्च सुरक्षा, कानूनी और फॉर्म-सी मानकों की पूर्णता के बाद ही इसे प्रारंभ किया जाएगा।"
                : "A vision for dignified stays in ancestral brick courtyards and artisan homes. Held to the highest standards of physical safety, verified background checks, and Form C statutory compliance before public launch."}
            </p>
          </div>

          {/* Phase 3 Badge */}
          <div className="journal-paper p-5 border border-rule/80 rounded-sm max-w-sm shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold mb-2">
              <AlertTriangle className="w-4 h-4 text-terracotta" />
              <span>{isHindi ? "पारदर्शी नीति: वर्तमान में बुकिंग बंद है" : "Honest Policy: No False Bookings"}</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed mb-3">
              {isHindi
                ? "हम कभी भी अधूरी या असत्यापित सेवाओं के लिए नकली बुकिंग बटन नहीं दिखाते। सुरक्षा और सरकारी अनुपालन पूरा होने तक आवास बुकिंग बंद रखी गई है।"
                : "We never display fake booking buttons or premature checkout. Residential accommodation will open strictly once physical inspections in Darbhanga and Madhubani conclude."}
            </p>
            <div className="text-[11px] font-mono text-secondary">
              {isHindi ? "अनुपालन ऑडिट प्रगति पर है" : "Phase 3 Compliance Audit Active"}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Visual Feature */}
      <section className="mb-14">
        <div className="relative aspect-[21/9] w-full rounded-sm overflow-hidden border border-rule bg-warm/30">
          <Image
            src="/images/exp-homestay.jpg"
            alt="Traditional Mithila residential courtyard with verandah and terracotta roof"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white max-w-2xl">
            <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-primary mb-3 inline-block">
              {isHindi ? "मिथिला दालान परंपरा" : "Ancestral Dalan Architecture"}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-medium text-white mb-2 leading-snug">
              {isHindi
                ? "अतिथियों के लिए अलग दालान और पारंपरिक पारिवारिक सत्कार"
                : "The Sacred Dalan: A Dedicated Guest Verandah Built for Respect"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-heading line-clamp-2 sm:line-clamp-none">
              {isHindi
                ? "मिथिला के वास्तुशिल्प में 'दालान' घर का वह बाहरी बैठक कक्ष होता है जहाँ आगंतुक का सम्मानपूर्वक स्वागत किया जाता है, बिना पारिवारिक अंतःकक्ष की निजता को प्रभावित किए।"
                : "In traditional Mithila home architecture, the 'Dalan' serves as a dignified guest pavilion—ensuring travelers enjoy warm hospitality without intruding upon the private family sanctum."}
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Framework: The 3 Pillars */}
      <section className="mb-16">
        <div className="border-b border-rule pb-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
            {isHindi ? "कड़े सुरक्षा मानक" : "Prerequisites to Opening"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "चरण 3 का त्रि-स्तरीय अनुपालन ढांचा" : "The 3-Pillar Verification Threshold"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="journal-paper p-6 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-primary mb-4">
                <FileText className="w-5 h-5 text-terracotta" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold block mb-1">
                {isHindi ? "स्तंभ 1: विधिक अनुपालन" : "Pillar 1: Legal & Form C"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "पर्यटन पंजीकरण एवं फॉर्म-सी" : "Statutory Form C & Tourism Registration"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "बिहार पर्यटन बोर्ड के होमस्टे नियमों के अंतर्गत पंजीकरण। विदेशी नागरिकों के ठहरने की स्थिति में आव्रजन ब्यूरो (BoI) के ऑनलाइन फॉर्म-सी अनुपालन का पूर्व परीक्षण।"
                  : "State Tourism Board certification and integrated Bureau of Immigration Form C submission pipelines for all international passport holders before receiving foreign travelers."}
              </p>
            </div>

            <ul className="pt-4 border-t border-rule/60 text-xs space-y-1.5 text-text">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "स्थानीय थाना अनापत्ति" : "Police clearance & verified records"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "फॉर्म-सी डिजिटल सत्यापन" : "Automated Form C guest registration"}</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="journal-paper p-6 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-forest mb-4">
                <ShieldCheck className="w-5 h-5 text-forest" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold block mb-1">
                {isHindi ? "स्तंभ 2: भौतिक सुरक्षा" : "Pillar 2: Physical Safety"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "प्रत्यक्ष स्थल निरीक्षण" : "Rigorous In-Person Inspections"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "प्रत्येक घर का प्रत्यक्ष निरीक्षण: निजी ताला-चाबी वाले कमरे, स्वच्छ पेयजल (RO/उबला पानी), प्राथमिक चिकित्सा किट, अग्निशमन उपकरण और आपातकालीन निकास की उपलब्धता।"
                  : "On-site safety audits verifying lockable private guest rooms, potable RO drinking water, basic first-aid gear, fire extinguishers, and unhindered emergency egress routes."}
              </p>
            </div>

            <ul className="pt-4 border-t border-rule/60 text-xs space-y-1.5 text-text">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "निजी लॉकेबल कमरा व खिड़की" : "Private lockable quarters"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "पेयजल व स्वच्छता ऑडिट" : "Sanitation & clean water certification"}</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="journal-paper p-6 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-primary mb-4">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold block mb-1">
                {isHindi ? "स्तंभ 3: पता व निजता संरक्षण" : "Pillar 3: Address Guard"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "72 घंटे पूर्व पता प्रकटीकरण" : "Centroid Shield & 72-Hour Release"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "मेजबान परिवार का सटीक आवासीय पता कभी भी सार्वजनिक मानचित्र पर नहीं दिखाया जाता। केवल पूर्ण रूप से सत्यापित व भुगतान की गई बुकिंग के 72 घंटे पूर्व ही पता प्रकट होगा।"
                  : "A host's exact home address is never public. Confirmed guests receive GPS coordinates strictly 72 hours prior to arrival, protecting both family dignity and guest security."}
              </p>
            </div>

            <ul className="pt-4 border-t border-rule/60 text-xs space-y-1.5 text-text">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "सार्वजनिक नक्शे पर केवल इलाका" : "Approximated area centroid only"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>{isHindi ? "आपसी सहमति सुरक्षा कोड" : "Cryptographic mutual consent key"}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Host Onboarding Call-out */}
      <section className="journal-paper p-8 sm:p-10 border border-rule rounded-sm bg-warm/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-forest font-semibold">
            <HeartHandshake className="w-4 h-4 text-forest" />
            <span>{isHindi ? "मेजबान परिवार पंजीकरण" : "Host Family Pre-Registration"}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "क्या आप अपने घर में अतिथियों का आदरपूर्वक स्वागत करना चाहते हैं?" : "Would You Like to Host Travelers in Your Traditional Home?"}
          </h2>
          <p className="text-sm text-secondary leading-relaxed font-heading">
            {isHindi
              ? "यदि आपके पास दरभंगा, मधुबनी या उत्तर बिहार में एक पारंपरिक दालान या स्वच्छ अतिथि कमरा है, तो आप अभी से अपनी प्रारंभिक रुचि दर्ज कर सकते हैं। हमारी टीम चरण 3 के निरीक्षण के दौरान आपसे संपर्क करेगी।"
              : "If you reside in Darbhanga or Madhubani with a welcoming guest room or ancestral dalan, register your preliminary interest today. Our local community coordinators will inspect your property as Phase 3 rolls out."}
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link
            href="/become-a-host"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-hover text-xs font-mono uppercase tracking-wider rounded-xs tactile-button transition-all shadow-xs"
          >
            <span>{isHindi ? "मेजबान आवेदन दर्ज करें" : "Submit Host Interest"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-surface border border-rule hover:border-secondary text-secondary hover:text-text text-xs font-mono uppercase tracking-wider rounded-xs tactile-button transition-colors"
          >
            <span>{isHindi ? "सुरक्षा मानक पढ़ें" : "Read Safety Code"}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
