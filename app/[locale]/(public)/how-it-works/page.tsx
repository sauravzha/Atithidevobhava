import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import {
  Users,
  Compass,
  Coffee,
  Lock,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | यह कैसे काम करता है - Atithi Devo Bhava",
  description:
    "A guide to connecting with Indian residents, exploring living cultures, and understanding our safety and mutual consent principles.",
};

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const steps = [
    {
      number: "01",
      titleEn: "Create Profile & State Cultural Intent",
      titleHi: "प्रोफ़ाइल बनाएं और अपनी रुचि बताएं",
      descEn:
        "Verify your email, confirm 18+ adult age, and write a genuine introduction. We strictly adhere to data minimization: zero passport scans or Aadhaar numbers are collected.",
      descHi:
        "ईमेल सत्यापन, १८+ आयु पुष्टि और अपना परिचय दर्ज करें। हम डेटा न्यूनीकरण का पालन करते हैं: कभी भी पासपोर्ट स्कैन या आधार संख्या नहीं मांगते।",
      icon: Users,
    },
    {
      number: "02",
      titleEn: "Find a Resident & Propose a Public Meetup",
      titleHi: "स्थानीय नागरिक चुनें और सार्वजनिक मिलन का प्रस्ताव दें",
      descEn:
        "Search by district, language, and interests. The initial encounter must always be proposed in a recommended, bustling public venue (tea stall, temple promenade, or library square).",
      descHi:
        "जनपद, भाषा और रुचि के आधार पर स्थानीय निवासी चुनें। पहली मुलाकात हमेशा एक अनुशंसित सार्वजनिक स्थल (विश्वविद्यालय चाय स्टॉल, मंदिर प्रांगण या मुख्य चौक) पर होती है।",
      icon: Coffee,
    },
    {
      number: "03",
      titleEn: "Private Chat & Mutual Consent Contact Reveal",
      titleHi: "स्वीकृति के बाद निजी संवाद व आपसी सहमति से संपर्क",
      descEn:
        "Once accepted, secure text-only chat activates. Phone numbers and private handles remain strictly encrypted until BOTH parties independently opt in via the in-app consent trigger.",
      descHi:
        "अनुरोध स्वीकार होने पर सुरक्षित चैट शुरू होती है। फ़ोन नंबर कभी सार्वजनिक नहीं होते; दोनों पक्षों द्वारा सहमति देने के बाद ही संपर्क प्रदर्शित होता है।",
      icon: Lock,
    },
    {
      number: "04",
      titleEn: "Complete Meetup & Submit Dual Blind Reviews",
      titleHi: "मुलाकात पूरी करें और निष्पक्ष द्विपक्षीय समीक्षा लिखें",
      descEn:
        "Both participants submit blind reviews that remain hidden until both have submitted or 14 days elapse, preventing any retaliatory bias and maintaining community integrity.",
      descHi:
        "मुलाकात के बाद दोनों पक्ष गोपनीय समीक्षा लिखते हैं। समीक्षाएं १४ दिनों तक या दोनों पक्षों द्वारा लिखे जाने तक छिपी रहती हैं, जिससे निष्पक्षता बनी रहती है।",
      icon: HeartHandshake,
    },
  ];

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
            {isHindi ? "यह कैसे काम करता है" : "How It Works"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-forest mb-3">
            <Compass className="w-3.5 h-3.5 text-forest" />
            <span>{isHindi ? "प्रक्रिया व मार्गदर्शिका" : "Platform Methodology · Pilot Protocol"}</span>
          </div>

          <Bi
            hindi="अतिथि देवो भवः कैसे कार्य करता है"
            english="How Atithi Devo Bhava Works"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
          />

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
            {isHindi
              ? "अंतरराष्ट्रीय यात्रियों को भारतीय स्थानीय लोगों, परिवारों और कलाकारों से जोड़ने का एक सरल, मानवीय और सुरक्षित मंच। व्यावसायिक बिचौलियों से दूर, वास्तविक आतिथ्य का सम्मान।"
              : "A restrained, human platform connecting international visitors with verified Indian residents and artisan communities. Grounded in dignity, public spaces, and mutual consent."}
          </p>
        </div>
      </header>

      {/* The Three Pathways of Hospitality */}
      <section className="mb-16">
        <div className="border-b border-rule pb-4 mb-8 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
              {isHindi ? "सहभागिता के तीन माध्यम" : "The Core Triad"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
              {isHindi ? "अन्वेषण के तीन स्वरूप" : "Three Modes of Cultural Exchange"}
            </h2>
          </div>
          <span className="text-xs font-mono text-terracotta">
            {isHindi ? "उत्तरी बिहार पायलट" : "Active Field Pilot"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product A */}
          <div className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                  {isHindi ? "माध्यम 1" : "Product A"}
                </span>
                <span className="text-[11px] font-mono text-forest">
                  {isHindi ? "निःशुल्क" : "Non-commercial"}
                </span>
              </div>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "स्थानीय नागरिक से मिलें" : "Meet a Local Resident"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "चाय के कप पर संवाद, विद्यापति के पदों की चर्चा, या मोहल्ला वॉक। गैर-व्यावसायिक, पारस्परिक सम्मान पर आधारित मित्रता।"
                  : "Connect with a resident for tea, conversational practice, or an informal neighborhood walk. Free by default with zero commercial obligation."}
              </p>
            </div>
            <Link
              href="/explore/people"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:underline pt-2 border-t border-rule/50"
            >
              <span>{isHindi ? "नागरिक देखें" : "Explore Locals"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product B */}
          <div className="journal-paper p-6 sm:p-7 border border-rule rounded-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                  {isHindi ? "माध्यम 2" : "Product B"}
                </span>
                <span className="text-[11px] font-mono text-terracotta">
                  {isHindi ? "केवल पूछताछ" : "Phase 1: Enquiry"}
                </span>
              </div>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "स्थानीय के साथ अनुभव" : "Living Cultural Immersions"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "जितवारपुर में मिथिला पेंटिंग, आर्द्रभूमि में मखाना तुड़ाई, या ध्रुपद संगीत। वरिष्ठ कारीगरों और परिवारों द्वारा संचालित सत्र।"
                  : "Structured masterclasses led by master artisans and families (Mithila painting, pond makhana popping, Dhrupad alapa). Enquiry-only in Phase 1."}
              </p>
            </div>
            <Link
              href="/explore/experiences"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-terracotta hover:underline pt-2 border-t border-rule/50"
            >
              <span>{isHindi ? "अनुभव देखें" : "Explore Crafts"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product C */}
          <div className="journal-paper p-6 sm:p-7 border border-rule rounded-sm bg-warm/20 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
                  {isHindi ? "माध्यम 3" : "Product C"}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-surface border border-rule rounded-xs text-secondary">
                  {isHindi ? "चरण 3 में" : "Phase 3"}
                </span>
              </div>
              <h3 className="font-heading text-xl font-medium text-text mb-2">
                {isHindi ? "पारिवारिक आवास और दालान" : "Ancestral Dalan Stays"}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "पारंपरिक मिथिला हवेलियों में ठहरने का अनुभव। भौतिक सुरक्षा व विदेशी अतिथि फॉर्म-सी सत्यापन के बाद ही बुकिंग शुरू होगी।"
                  : "Residential homestays with verified families. Opening in Phase 3 following physical inspections and Bureau of Immigration Form C compliance."}
              </p>
            </div>
            <Link
              href="/explore/stays"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-secondary hover:text-text hover:underline pt-2 border-t border-rule/50"
            >
              <span>{isHindi ? "अनुपालन स्थिति" : "Read Standards"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Step by Step Timeline */}
      <section className="mb-16">
        <div className="border-b border-rule pb-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
            {isHindi ? "यात्रियों के लिए मार्गदर्शिका" : "Traveller Journey"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "सहभागिता की 4-चरणीय प्रक्रिया" : "The 4-Step Engagement Protocol"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="journal-paper p-6 sm:p-8 border border-rule rounded-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-bold text-terracotta">
                      {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-xs bg-warm/60 border border-rule flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-medium text-text mb-2 leading-snug">
                    {isHindi ? step.titleHi : step.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                    {isHindi ? step.descHi : step.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-rule/50 flex items-center gap-1.5 text-[11px] font-mono text-forest">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? "सत्यापित सुरक्षा मानक" : "Verified Protocol"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Safety & Trust Covenant */}
      <section className="journal-paper p-8 sm:p-10 border border-rule rounded-sm bg-warm/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-primary inline-block">
            {isHindi ? "संस्थागत सुरक्षा प्रतिज्ञा" : "Safety & Trust Covenant"}
          </span>

          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "पारस्परिक सुरक्षा, सम्मान एवं संप्रभुता" : "Four Non-Negotiable Guarantees"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-body text-secondary">
            <div className="p-3 bg-surface border border-rule rounded-xs space-y-1">
              <span className="font-mono text-terracotta font-semibold block text-[11px] uppercase">
                {isHindi ? "1. पते की गोपनीयता" : "1. Address Guard"}
              </span>
              <p className="leading-relaxed">
                {isHindi
                  ? "निजी आवासीय पते और जीपीएस निर्देशांक कभी भी सार्वजनिक रूप से प्रदर्शित नहीं होते।"
                  : "Exact residential coordinates are never public. Approximated area centroids only."}
              </p>
            </div>

            <div className="p-3 bg-surface border border-rule rounded-xs space-y-1">
              <span className="font-mono text-forest font-semibold block text-[11px] uppercase">
                {isHindi ? "2. केवल वयस्क (१८+)" : "2. 18+ Adults Only"}
              </span>
              <p className="leading-relaxed">
                {isHindi
                  ? "केवल वयस्क (१८+) पंजीकृत हो सकते हैं। नाबालिगों का कोई खाता नहीं होता।"
                  : "All accounts require self-declaration and ID verification for adults 18+."}
              </p>
            </div>

            <div className="p-3 bg-surface border border-rule rounded-xs space-y-1">
              <span className="font-mono text-primary font-semibold block text-[11px] uppercase">
                {isHindi ? "3. दो-शिकायत ट्रिगर" : "3. Two-Strike De-Indexing"}
              </span>
              <p className="leading-relaxed">
                {isHindi
                  ? "दो गंभीर शिकायतों पर संबंधित खाते को तुरंत खोज परिणामों से हटा दिया जाता है।"
                  : "Automated database trigger removes profiles from search upon two urgent reports."}
              </p>
            </div>

            <div className="p-3 bg-surface border border-rule rounded-xs space-y-1">
              <span className="font-mono text-terracotta font-semibold block text-[11px] uppercase">
                {isHindi ? "4. 24x7 हेल्पलाइन (112)" : "4. Emergency 112"}
              </span>
              <p className="leading-relaxed">
                {isHindi
                  ? "भारत में २४ घंटे राष्ट्रीय आपातकालीन सेवा 112 सीधे उपलब्ध है।"
                  : "Official national distress helpline 112 and tourist hotline 1363 integrated."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
