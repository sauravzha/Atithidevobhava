import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Host Responsibilities & Legal Standards | मेजबान उत्तरदायित्व - Atithi Devo Bhava",
  description:
    "Legal, cultural, and safety obligations for local hosts in India under Atithi Devo Bhava guidelines.",
};

export default async function HostResponsibilitiesPage({
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
            {isHindi ? "मेजबान उत्तरदायित्व" : "Host Responsibilities"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-secondary block mb-1">
          {isHindi ? "दिशानिर्देश एवं मानक" : "Standards & Guidelines"}
        </span>
        <Bi
          hindi="मेजबानों के कानूनी एवं सांस्कृतिक उत्तरदायित्व"
          english="Host Responsibilities & Cultural Standards"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "भारतीय आतिथ्य परंपरा की गरिमा और कानूनी अनुपालन को बनाए रखने के लिए आवश्यक दिशा-निर्देश।"
            : "Clear guidance for local residents and artisans welcoming international travelers to their communities."}
        </p>
      </header>

      {/* Responsibilities list */}
      <div className="space-y-8 text-xs text-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "1. सार्वजनिक स्थल और यात्री सुरक्षा" : "1. Public Venues & Visitor Comfort"}
          </h2>
          <p>
            {isHindi
              ? "‘स्थानीय नागरिक से मिलें’ (Meet a Local) के अंतर्गत सभी मुलाकातें खुले, सार्वजनिक और सुरक्षित स्थानों पर होनी चाहिए। किसी भी यात्री पर अपने निजी घर आने का दबाव न बनाएं।"
              : "For Meet a Local encounters, all gatherings must occur in recognized public spaces (cafés, libraries, public gardens). Never pressure a visitor to visit private residences during early meetings."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "2. सांस्कृतिक प्रामाणिकता और कारीगरों का सम्मान" : "2. Cultural Authenticity & Fair Collaboration"}
          </h2>
          <p>
            {isHindi
              ? "सांस्कृतिक अनुभवों (जैसे मिथिला चित्रकला या पाककला) का संचालन करते समय, स्थानीय कारीगरों और परिवारों के योगदान का पूरा सम्मान करें और उन्हें उचित भागीदारी दें।"
              : "When hosting cultural workshops (such as Mithila painting or culinary sessions), honor indigenous artisan techniques and ensure equitable distribution of value within the artisan household."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "3. वित्तीय पारदर्शिता और कोई अग्रिम नकद नहीं" : "3. Financial Transparency & No Off-Platform Demands"}
          </h2>
          <p>
            {isHindi
              ? "चरण 1 में सभी अनुभव केवल पूछताछ मॉडल पर आधारित हैं। यात्रियों से अग्रिम नकद, व्यक्तिगत वायर ट्रांसफर या अपंजीकृत शुल्कों की मांग करना सख्त मना है।"
              : "In Phase 1, experiences operate as enquiry-only. Soliciting off-platform cash deposits, unauthorized wire transfers, or unlisted fees is strictly prohibited and grounds for immediate removal."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "4. स्थानीय कानून और नियम" : "4. Respect for Local Indian Regulations"}
          </h2>
          <p>
            {isHindi
              ? "मेजबानों को अपने राज्य और जिले के स्थानीय कानूनों, सार्वजनिक शांति नियमों और अनुमतियों का पूरी तरह पालन करना चाहिए। संरक्षित या प्रतिबंधित क्षेत्रों में बिना वैध परमिट के यात्रियों को ले जाना वर्जित है।"
              : "Hosts must comply with local municipal guidelines, state tourism standards, and permit regulations. Taking travelers into protected, tribal, or restricted border areas without lawful permits is strictly forbidden."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "5. आगंतुक गोपनीयता" : "5. Traveler Privacy Protection"}
          </h2>
          <p>
            {isHindi
              ? "यात्रियों द्वारा साझा की गई व्यक्तिगत जानकारी, यात्रा कार्यक्रम और संपर्क विवरण को गोपनीय रखें। किसी तीसरे पक्ष को उनकी जानकारी न दें।"
              : "Keep all visitor contact details, itineraries, and communication private. Never disclose a traveler's personal data or whereabouts to commercial entities or unauthorized individuals."}
          </p>
        </section>
      </div>
    </div>
  );
}
