import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | अक्सर पूछे जाने वाले सवाल - Atithi Devo Bhava",
  description:
    "Common questions about registration, safety, mutual consent contact sharing, pilot regions, and hosting on Atithi Devo Bhava.",
};

export default async function FaqPage({
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
            {isHindi ? "अक्सर पूछे जाने वाले सवाल" : "FAQ"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <Bi
          hindi="अक्सर पूछे जाने वाले सवाल"
          english="Frequently Asked Questions"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "प्लेटफ़ॉर्म के संचालन, गोपनीयता मानकों और सहभागिता नियमों से जुड़े मुख्य प्रश्नों के उत्तर।"
            : "Clear answers on platform architecture, privacy invariants, hosting standards, and community safety."}
        </p>
      </header>

      <div className="space-y-12">
        {/* Section 1: For Travellers */}
        <section id="travellers">
          <h2 className="font-heading text-xl font-medium text-text border-b border-rule pb-3 mb-6">
            {isHindi ? "1. यात्रियों के लिए (For Travellers)" : "1. For Travellers"}
          </h2>

          <div className="space-y-6 text-xs text-secondary leading-relaxed">
            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "‘स्थानीय नागरिक से मिलें’ (Meet a Local) क्या है?" : "What is 'Meet a Local'?"}
              </h3>
              <p>
                {isHindi
                  ? "यह एक ऐसा माध्यम है जिसके द्वारा आप किसी भारतीय स्थानीय नागरिक से चाय, भाषा संवाद, बाज़ार भ्रमण या अनौपचारिक मोहल्ला वॉक के लिए जुड़ सकते हैं। यह कोई व्यावसायिक सेवा नहीं है और इसके लिए कोई शुल्क नहीं लिया जाता।"
                  : "It is an informal, non-commercial connection with an Indian resident for tea, conversational language practice, or a neighbourhood stroll. It requires no payment and no tourism business."}
              </p>
            </div>

            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "क्या पंजीकरण के लिए पासपोर्ट स्कैन या वीज़ा संख्या की आवश्यकता है?" : "Do I need to submit my passport scan or visa number?"}
              </h3>
              <p>
                {isHindi
                  ? "नहीं। अतिथि देवो भव यात्रियों से पासपोर्ट स्कैन या वीज़ा संख्या एकत्र या संग्रहीत नहीं करता है। केवल ईमेल सत्यापन, 18+ आयु पुष्टि और एक प्रामाणिक 150+ अक्षरों का परिचय आवश्यक है।"
                  : "No. Atithi Devo Bhava never collects or stores passport scans or visa numbers by default. Only email verification, 18+ confirmation, and a genuine 150+ character bio are required."}
              </p>
            </div>

            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "चरण 1 में अनुभवों का भुगतान कैसे होता है?" : "How do payments work in Phase 1?"}
              </h3>
              <p>
                {isHindi
                  ? "चरण 1 में सभी सांस्कृतिक अनुभव केवल पूछताछ मॉडल (Enquiry-Only) पर आधारित हैं। कोई मूल्य प्रदर्शित नहीं होता और कोई ऑनलाइन भुगतान नहीं लिया जाता। ऑनलाइन भुगतान प्रणाली चरण 2 में शुरू की जाएगी।"
                  : "In Phase 1, all cultural listings operate strictly as enquiry-only. No prices are shown and no payments are processed online. Integrated booking and payments open in Phase 2."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: For Local Members */}
        <section id="hosts">
          <h2 className="font-heading text-xl font-medium text-text border-b border-rule pb-3 mb-6">
            {isHindi ? "2. स्थानीय सदस्यों के लिए (For Local Members)" : "2. For Local Residents"}
          </h2>

          <div className="space-y-6 text-xs text-secondary leading-relaxed">
            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "स्थानीय सदस्य बनने की क्या पात्रता है?" : "What are the requirements to become a local member?"}
              </h3>
              <p>
                {isHindi
                  ? "आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए, आपके पास एक सक्रिय भारतीय मोबाइल नंबर (एसएमएस ओटीपी सत्यापित) होना चाहिए, और आप अपने शहर या जिले की संस्कृति को सम्मानपूर्वक साझा करने के इच्छुक हों।"
                  : "You must be 18 years or older, have a verified Indian mobile number (SMS OTP), and genuinely desire to share your local neighbourhood context with international visitors."}
              </p>
            </div>

            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "क्या मुझे किसी को अपने घर में ठहराना होगा?" : "Am I required to accommodate anyone in my home?"}
              </h3>
              <p>
                {isHindi
                  ? "बिल्कुल नहीं। स्थानीय सदस्य (Meet a Local) केवल सार्वजनिक स्थानों पर मिलने के लिए होते हैं। आवास की सुविधा (Stay with a Local) चरण 3 में एक अलग और कड़े अनुपालन ढांचे के तहत शुरू की जाएगी।"
                  : "Absolutely not. Local members meet in public spots only. Home accommodation (Stay with a Local) is an entirely separate tier subject to strict Phase 3 regulatory compliance."}
              </p>
            </div>

            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "क्या मेरा फ़ोन नंबर साइट पर सार्वजनिक रूप से दिखेगा?" : "Will my phone number be visible publicly?"}
              </h3>
              <p>
                {isHindi
                  ? "कभी नहीं। आपका मोबाइल नंबर हमारे सुरक्षित डेटाबेस में एन्क्रिप्टेड रहता है। संपर्क विवरण केवल तभी प्रकट होते हैं जब आप और संबंधित यात्री दोनों आपसी सहमति देते हैं।"
                  : "Never. Your mobile number is stored privately. Contact details are revealed strictly when both you and your counterpart mutually consent during a scheduled meetup."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Safety & Privacy */}
        <section id="safety">
          <h2 className="font-heading text-xl font-medium text-text border-b border-rule pb-3 mb-6">
            {isHindi ? "3. सुरक्षा और गोपनीयता (Safety & Privacy)" : "3. Safety & Privacy"}
          </h2>

          <div className="space-y-6 text-xs text-secondary leading-relaxed">
            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "सार्वजनिक मिलन स्थल नियम क्यों अनिवार्य है?" : "Why is the public meeting venue mandatory?"}
              </h3>
              <p>
                {isHindi
                  ? "पारस्परिक सुरक्षा और सहजता सुनिश्चित करने के लिए सभी प्रारंभिक बैठकें एक खुले और सुगम सार्वजनिक स्थल (जैसे कैफ़े, मुख्य चौक या पुस्तकालय परिसर) पर आयोजित की जानी चाहिए।"
                  : "To protect both sides, initial meetings must occur in open, visible public areas with standard civic foot traffic before any deeper engagement."}
              </p>
            </div>

            <div className="p-5 border border-rule rounded-sm bg-page">
              <h3 className="font-heading text-sm font-medium text-text mb-2">
                {isHindi ? "दो शिकायतों पर स्वतः निलंबन नियम क्या है?" : "What is the two-report automated de-indexing rule?"}
              </h3>
              <p>
                {isHindi
                  ? "यदि किसी खाते के विरुद्ध दो गंभीर सुरक्षा शिकायतें दर्ज होती हैं, तो डेटाबेस ट्रिगर द्वारा उस खाते को तुरंत खोज परिणामों से हटा दिया जाता है और प्रशासनिक समीक्षा तक रोक दिया जाता है।"
                  : "An automated PostgreSQL trigger immediately hides any profile that receives two urgent harassment or safety complaints, guaranteeing rapid prevention of further misconduct."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
