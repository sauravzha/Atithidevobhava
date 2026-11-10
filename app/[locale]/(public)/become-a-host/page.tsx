import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Become a Host | मेजबान बनें - Atithi Devo Bhava",
  description:
    "Join as a local resident, artisan, or cultural host. Welcome international travelers to your community with dignity, safety, and cultural pride.",
};

export default async function BecomeAHostPage({
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
            {isHindi ? "मेजबान बनें" : "Become a Host"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
          {isHindi ? "समुदाय में शामिल हों" : "Join the Community"}
        </span>
        <Bi
          hindi="अपने शहर और संस्कृति के मेजबान बनें"
          english="Welcome Visitors to Your Town & Living Traditions"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "यदि आप अपनी संस्कृति, स्थानीय बाज़ार, पाक परंपरा या कला को आगंतुकों के साथ सम्मानपूर्वक साझा करना चाहते हैं, तो अतिथि देवो भव से जुड़ें।"
            : "Share your heritage, neighbourhood stories, culinary craft, or artisan skills with visitors seeking respectful cultural connection."}
        </p>
      </header>

      {/* Three Host Roles */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "मेजबानी के तीन स्वरूप" : "Three Ways to Host"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-rule rounded-sm bg-warm/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
                {isHindi ? "स्वरूप 1" : "Role A"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "स्थानीय नागरिक (Meet a Local)" : "Local Member"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {isHindi
                  ? "चाय पर बातचीत, बाज़ार की सैर या भाषा संवाद। इसके लिए किसी आवास या व्यवसाय की आवश्यकता नहीं है। यह निशुल्क और पूरी तरह आपकी सुविधानुसार है।"
                  : "Meet travelers for informal tea, market strolls, or language practice. No accommodation or business required. Free and flexible."}
              </p>
            </div>
            <span className="text-xs text-secondary font-medium">
              {isHindi ? "पात्रता: भारतीय निवासी, 18+, सत्यापित मोबाइल" : "Eligibility: Resident, 18+, Mobile verified"}
            </span>
          </div>

          <div className="p-6 border border-rule rounded-sm bg-warm/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
                {isHindi ? "स्वरूप 2" : "Role B"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "अनुभव प्रदाता (Experience Host)" : "Experience Provider"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {isHindi
                  ? "पारंपरिक कला, पाककला, संगीत या शिल्प कार्यशालाएं संचालित करें। प्रारंभिक चरण में केवल पूछताछ मॉडल सक्रिय है; ऑनलाइन भुगतान चरण 2 में शुरू होगा।"
                  : "Conduct structured craft, culinary, music, or heritage workshops. Operating as enquiry-only in Phase 1; payments open in Phase 2."}
              </p>
            </div>
            <span className="text-xs text-secondary font-medium">
              {isHindi ? "पात्रता: कारीगर, परिवार, पारंपरिक गुरु" : "Eligibility: Artisan, Cook, Heritage practitioner"}
            </span>
          </div>

          <div className="p-6 border border-rule rounded-sm bg-warm/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  {isHindi ? "स्वरूप 3" : "Role C"}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-sm font-medium">
                  {isHindi ? "चरण 3" : "Phase 3"}
                </span>
              </div>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {isHindi ? "आवास मेजबान (Stay Host)" : "Accommodation Host"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {isHindi
                  ? "अपने पारिवारिक घर में अतिथियों को ठहराएं। इसके लिए फॉर्म-सी, स्थानीय पुलिस अनुपालन और शारीरिक सुरक्षा निरीक्षण आवश्यक है।"
                  : "Host guests in private family quarters. Requires separate approval, Form C readiness, and physical safety compliance."}
              </p>
            </div>
            <span className="text-xs text-secondary font-medium">
              {isHindi ? "पात्रता: अलग आवेदन और अनुपालन सत्यापन" : "Eligibility: Separate regulatory vetting"}
            </span>
          </div>
        </div>
      </section>

      {/* What We Ask of Hosts */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "मेजबानों से हमारी अपेक्षाएं" : "Our Standards for Local Hosts"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-secondary leading-relaxed">
          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "1. सार्वजनिक मिलन स्थल नियम" : "1. Public Meeting Rule"}
            </h3>
            <p>
              {isHindi
                ? "यात्रियों से पहली मुलाकात हमेशा एक सुरक्षित सार्वजनिक स्थल पर होनी चाहिए। जब तक पारस्परिक विश्वास न बने, निजी घर पर न बुलाएं।"
                : "First meetings with travelers must take place in an open, public area (café, square, library) to ensure mutual comfort."}
            </p>
          </div>

          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "2. कोई अग्रिम नकद लेन-देन नहीं" : "2. No Advance Cash Requests"}
            </h3>
            <p>
              {isHindi
                ? "यात्रियों से अग्रिम नकद, वायर ट्रांसफर या अपारदर्शी भुगतान की मांग करना पूरी तरह वर्जित है।"
                : "Soliciting advance cash wire transfers or non-transparent payments is strictly prohibited."}
            </p>
          </div>

          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "3. सांस्कृतिक सम्मान और गरिमा" : "3. Cultural Dignity & Respect"}
            </h3>
            <p>
              {isHindi
                ? "सभी आगंतुकों के साथ उनकी राष्ट्रीयता, पृष्ठभूमि या भाषा के प्रति सम्मानपूर्वक व्यवहार करें।"
                : "Treat all international guests with courtesy and mutual respect, sharing authentic local context."}
            </p>
          </div>

          <div className="p-4 border border-rule rounded-sm">
            <h3 className="font-heading text-sm font-medium text-text mb-1">
              {isHindi ? "4. गोपनीयता का संरक्षण" : "4. Respect Mutual Privacy"}
            </h3>
            <p>
              {isHindi
                ? "यात्री का संपर्क नंबर और विवरण केवल मंच के भीतर सुरक्षित रखें। किसी तीसरे पक्ष से साझा न करें।"
                : "Never disclose a traveler's contact number or personal details to unauthorized third parties."}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="p-8 border border-primary/30 bg-warm/30 rounded-sm text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-xl font-medium text-text mb-2">
          {isHindi ? "पंजीकरण शुरू करने के लिए तैयार हैं?" : "Ready to Start as a Host?"}
        </h2>
        <p className="text-xs text-secondary leading-relaxed mb-6">
          {isHindi
            ? "पंजीकरण प्रक्रिया में केवल 5 मिनट लगते हैं। अपने विवरण दर्ज करें और हमारे पायलट समुदाय का हिस्सा बनें।"
            : "The onboarding steps take about 5 minutes. Enter your location details and become part of our verified community."}
        </p>
        <Link
          href="/onboarding?role=local"
          className="tap-target inline-block px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          {isHindi ? "मेजबान पंजीकरण प्रारंभ करें" : "Begin Host Registration"}
        </Link>
      </section>
    </div>
  );
}
