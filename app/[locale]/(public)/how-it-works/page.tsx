import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

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
            {isHindi ? "यह कैसे काम करता है" : "How It Works"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <Bi
          hindi="यह कैसे काम करता है"
          english="How Atithi Devo Bhava Works"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "अंतरराष्ट्रीय यात्रियों को भारतीय स्थानीय लोगों, परिवारों और कलाकारों से जोड़ने का एक सरल, मानवीय और सुरक्षित मंच।"
            : "A restrained, human platform connecting travelers with Indian residents, families, and artisan communities."}
        </p>
      </header>

      {/* Three Products Overview */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "तीन प्रमुख माध्यम" : "Three Ways to Connect"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
              {isHindi ? "माध्यम 1" : "Product A"}
            </span>
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi ? "स्थानीय निवासी से मिलें" : "Meet a Local"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "चाय, भाषा संवाद, बाज़ार की सैर या मोहल्ला वॉक के लिए स्थानीय निवासी से संपर्क करें। यह निशुल्क है और किसी पर्यटन व्यवसाय की आवश्यकता नहीं है।"
                : "Connect with a resident for tea, conversational practice, or an informal neighborhood walk. Free by default with no commercial obligations."}
            </p>
          </div>

          <div className="p-6 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
              {isHindi ? "माध्यम 2" : "Product B"}
            </span>
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi ? "स्थानीय के साथ अनुभव" : "Explore with a Local"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "स्थानीय कलाकारों और परिवारों द्वारा आयोजित सांस्कृतिक सत्र (पाक कला, शिल्प, संगीत, लोक उत्सव)। प्रारंभिक चरण में केवल पूछताछ उपलब्ध है।"
                : "Structured sessions hosted by resident artisans and families (culinary, craft, music, rituals). Enquiry-only in Phase 1."}
            </p>
          </div>

          <div className="p-6 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1 block">
              {isHindi ? "माध्यम 3 (चरण 3)" : "Product C (Phase 3)"}
            </span>
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi ? "स्थानीय परिवार के साथ रहें" : "Stay with a Local"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "सत्यापित भारतीय परिवारों के साथ होमस्टे। यह सुविधा उच्च सुरक्षा और विदेशी अतिथि अनुपालन (फॉर्म-सी) सत्यापन के बाद चरण 3 में खुलेगी।"
                : "Residential homestays with vetted families. Opening in Phase 3 following stringent safety inspection and Form C readiness."}
            </p>
          </div>
        </div>
      </section>

      {/* Step by Step for Travellers */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "यात्रियों के लिए चरण-दर-चरण प्रक्रिया" : "Step-by-Step for Travellers"}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-heading text-sm font-semibold shrink-0">
              1
            </span>
            <div>
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {isHindi ? "प्रोफ़ाइल बनाएं और अपनी रुचि बताएं" : "Create Profile & State Intent"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "ईमेल सत्यापन, 18+ आयु पुष्टि और 150+ अक्षरों का संक्षिप्त परिचय आवश्यक है। हम कभी भी पासपोर्ट स्कैन, वीज़ा नंबर या आधार विवरण नहीं मांगते।"
                  : "Verify your email, confirm 18+ adult age, and write a genuine 150+ character introduction. We never collect or store passport scans or visa numbers."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-heading text-sm font-semibold shrink-0">
              2
            </span>
            <div>
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {isHindi ? "स्थानीय निवासी खोजें और सार्वजनिक मिलन का प्रस्ताव भेजें" : "Find a Local & Propose a Public Meetup"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "स्थान, भाषा और रुचि के आधार पर स्थानीय निवासी चुनें। पहली मुलाकात हमेशा एक अनुशंसित सार्वजनिक स्थल (जैसे कैफ़े या मुख्य चौक) पर प्रस्तावित की जाती है।"
                  : "Search by district, language, and interests. The initial meeting must always be proposed in a recommended public place."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-heading text-sm font-semibold shrink-0">
              3
            </span>
            <div>
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {isHindi ? "स्वीकृति के बाद निजी संवाद और आपसी सहमति से संपर्क साझाकरण" : "Private Chat & Mutual Consent Contact Reveal"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "अनुरोध स्वीकार होने पर सुरक्षित चैट सक्रिय होती है। फ़ोन नंबर या संपर्क विवरण केवल तभी प्रदर्शित होते हैं जब दोनों पक्ष स्पष्ट रूप से सहमति दें।"
                  : "Once the host accepts, text-only private messaging opens. Phone numbers and contacts are revealed strictly when both parties explicitly opt in."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-heading text-sm font-semibold shrink-0">
              4
            </span>
            <div>
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {isHindi ? "मुलाकात पूरी करें और द्विपक्षीय समीक्षा लिखें" : "Complete Meetup & Write Blind Reviews"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "मुलाकात के बाद दोनों पक्ष एक-दूसरे की समीक्षा लिखते हैं। समीक्षाएं निष्पक्षता बनाए रखने के लिए 14 दिन तक या दोनों पक्षों द्वारा लिखे जाने तक छिपी रहती हैं।"
                  : "After the meeting, both write blind reviews that remain hidden until both submit or 14 days elapse, preventing retaliatory bias."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Trust Pillars */}
      <section className="p-6 border border-rule bg-warm/20 rounded-sm">
        <h2 className="font-heading text-lg font-medium text-text mb-3">
          {isHindi ? "हमारी सुरक्षा प्रतिज्ञा" : "Our Safety Commitments"}
        </h2>
        <ul className="text-xs text-secondary space-y-2 list-disc list-inside">
          <li>
            {isHindi
              ? "निजी आवासीय पते और जीपीएस निर्देशांक कभी भी सार्वजनिक रूप से प्रदर्शित नहीं होते।"
              : "Exact residential addresses and GPS coordinates are never made public."}
          </li>
          <li>
            {isHindi
              ? "केवल वयस्क (18+) पंजीकृत हो सकते हैं। नाबालिगों का कोई खाता नहीं होता।"
              : "Adults only (18+). No minors permitted as registered users."}
          </li>
          <li>
            {isHindi
              ? "दो गंभीर शिकायतों पर संबंधित खाते को तुरंत खोज परिणामों से हटा दिया जाता है।"
              : "Automated de-indexing from public search upon receiving two urgent safety reports."}
          </li>
          <li>
            {isHindi
              ? "भारत में 24 घंटे राष्ट्रीय आपातकालीन सेवा 112 उपलब्ध है।"
              : "24x7 India National Emergency Helpline 112 is always accessible."}
          </li>
        </ul>
      </section>
    </div>
  );
}
