import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "About Us | हमारे बारे में - Atithi Devo Bhava",
  description:
    "The origin, philosophy, and architectural commitments of Atithi Devo Bhava (अतिथि देवो भवः). Connecting visitors with India through living people.",
};

export default async function AboutPage({
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
            {isHindi ? "हमारे बारे में" : "About Us"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
          {isHindi ? "दर्शन और प्रतिबद्धता" : "Philosophy & Architecture"}
        </span>
        <Bi
          hindi="अतिथि देवो भवः"
          english="Atithi Devo Bhava"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "भारत को लोगों के साथ महसूस कीजिए। एक सम्मानित, शांत और गैर-व्यावसायिक सांस्कृतिक मंच।"
            : "Experience India through its people. A restrained, human cultural hospitality platform."}
        </p>
      </header>

      {/* Origin Story */}
      <section className="mb-14 max-w-3xl space-y-4 text-sm text-secondary leading-relaxed">
        <h2 className="font-heading text-xl font-medium text-text">
          {isHindi ? "प्राचीन परंपरा, आधुनिक तकनीक" : "Ancient Ethos, Modern Architecture"}
        </h2>
        <p>
          {isHindi
            ? "‘अतिथि देवो भव’ का उद्गम तैत्तिरीय उपनिषद् के प्रसिद्ध उपदेश से हुआ है: ‘मातृदेवो भव। पितृदेवो भव। आचार्यदेवो भव। अतिथिदेवो भव।’ भारतीय संस्कृति में अतिथि का सत्कार केवल एक औपचारिकता नहीं, बल्कि एक पवित्र मानवीय संबंध है।"
            : "The phrase 'Atithi Devo Bhava' originates from the ancient Taittiriya Upanishad: 'Matridevo Bhava, Pitridevo Bhava, Acharyadevo Bhava, Atithidevo Bhava.' In Indian civilizational ethos, welcoming a visitor is not a transactional service, but a sacred human relationship."}
        </p>
        <p>
          {isHindi
            ? "अधिकांश पर्यटन मंच भारत को केवल स्मारकों, होटलों और पर्यटन पैकेज के रूप में प्रस्तुत करते हैं। परंतु भारत की वास्तविक आत्मा उसके मोहल्लों, कारीगरों, परिवारों, लोक संगीत और दैनिक जीवन में बसती है। अतिथि देवो भव अंतरराष्ट्रीय आगंतुकों को भारतीय नागरिकों से सीधे जोड़ने के उद्देश्य से बनाया गया है।"
            : "Most commercial travel portals reduce India to monuments, generic hotels, and standardized tour itineraries. Yet the living heart of India resides in its family courtyards, artisan villages, oral literatures, and neighbourhood haats. Atithi Devo Bhava connects international visitors with Indian residents directly, with dignity and mutual respect."}
        </p>
      </section>

      {/* What We Are NOT */}
      <section className="mb-14 p-6 border border-rule bg-warm/10 rounded-sm">
        <h2 className="font-heading text-lg font-medium text-text mb-4">
          {isHindi ? "हम क्या नहीं हैं" : "What We Are Not"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-secondary">
          <div className="p-3 bg-page border border-rule/60 rounded-sm">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "कोई होटल बुकिंग साइट नहीं" : "Not a Hotel Booking Engine"}
            </span>
            {isHindi
              ? "हम वाणिज्यिक होटलों या व्यावसायिक रिसॉर्ट्स को सूचीबद्ध नहीं करते।"
              : "We do not list commercial hotels, corporate resorts, or mass tourism packages."}
          </div>
          <div className="p-3 bg-page border border-rule/60 rounded-sm">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "कोई Airbnb का प्रतिरूप नहीं" : "Not an Airbnb Clone"}
            </span>
            {isHindi
              ? "हमारा प्राथमिक उत्पाद लोगों से मिलना (Meet a Local) है, न कि अचल संपत्ति का किराया।"
              : "Our foundational product is human connection (Meet a Local), not short-term real estate rental."}
          </div>
          <div className="p-3 bg-page border border-rule/60 rounded-sm">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "कोई सोशल नेटवर्क नहीं" : "Not a Social Network"}
            </span>
            {isHindi
              ? "कोई सार्वजनिक फ़ीड, कोई लाइक या फॉलोअर्स नहीं। केवल प्रामाणिक आमने-सामने संवाद।"
              : "No public feeds, no vanity metrics, and no engagement loops. Only purposeful direct dialogue."}
          </div>
          <div className="p-3 bg-page border border-rule/60 rounded-sm">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "कोई फ़ोन नंबर निर्देशिका नहीं" : "Not a Phone Directory"}
            </span>
            {isHindi
              ? "संपर्क नंबर कभी भी सार्वजनिक नहीं होते; दोनों पक्षों की सहमति के बिना कोई विवरण प्रकट नहीं होता।"
              : "Phone numbers and addresses are strictly concealed behind mutual two-way consent."}
          </div>
        </div>
      </section>

      {/* Architectural Commitments */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "डिजिटल संप्रभुता और गोपनीयता सिद्धांत" : "Privacy & Architectural Commitments"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-secondary leading-relaxed">
          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "शून्य विज्ञापन और शून्य ट्रैकर" : "Zero Ads & Zero Trackers"}
            </h3>
            <p>
              {isHindi
                ? "हमारी वेबसाइट पर कोई विज्ञापन नहीं है, कोई तीसरे पक्ष के ट्रैकर पिक्सल नहीं हैं। सभी फ़ॉन्ट और लाइब्रेरी स्वयं-होस्ट की गई हैं।"
                : "No third-party trackers, no ad pixels, and no external CDN fonts. Self-hosted typography with minimal data footprint."}
            </p>
          </div>

          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "डेटा न्यूनीकरण (Data Minimization)" : "Strict Data Minimization"}
            </h3>
            <p>
              {isHindi
                ? "हम कभी भी आधार संख्या, पासपोर्ट स्कैन या वीज़ा संख्या एकत्र या संग्रहीत नहीं करते हैं।"
                : "We do not collect or store Aadhaar numbers, passport scans, or visa numbers by default."}
            </p>
          </div>

          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "मुंबई डेटा सेंटर (ap-south-1)" : "Indian Data Residency"}
            </h3>
            <p>
              {isHindi
                ? "सभी डेटाबेस और सर्वर भारत के मुंबई क्षेत्र में स्थित हैं, जो भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के अनुकूल हैं।"
                : "Hosted in Supabase Mumbai (ap-south-1) and Vercel Mumbai (bom1), compliant with DPDP Act 2023."}
            </p>
          </div>
        </div>
      </section>

      {/* Pilot Region: Mithila */}
      <section className="p-6 border border-rule bg-warm/20 rounded-sm">
        <h2 className="font-heading text-lg font-medium text-text mb-2">
          {isHindi ? "मिथिला पायलट: दरभंगा और मधुबनी" : "Our Active Pilot: Mithila Region"}
        </h2>
        <p className="text-xs text-secondary leading-relaxed mb-4 max-w-2xl">
          {isHindi
            ? "हमारा पहला चरण बिहार के दरभंगा और मधुबनी जिलों में 40 से अधिक स्थानीय नागरिकों और परिवारों के साथ प्रारंभ हुआ है। हम अंतरराष्ट्रीय मांग के झूठे दावे किए बिना, वास्तविक स्थानीय समुदाय की शक्ति पर विश्वास करते हैं।"
            : "Operations began in Darbhanga and Madhubani districts (Bihar) with over 40 local residents. We value genuine grassroots community grounding over premature claims of unvalidated scale."}
        </p>
        <div className="flex gap-4 text-xs font-medium">
          <Link href="/india/bihar/darbhanga" className="text-primary hover:underline">
            {isHindi ? "दरभंगा जिला देखें" : "Darbhanga District"} →
          </Link>
          <Link href="/india/bihar/madhubani" className="text-primary hover:underline">
            {isHindi ? "मधुबनी जिला देखें" : "Madhubani District"} →
          </Link>
        </div>
      </section>
    </div>
  );
}
