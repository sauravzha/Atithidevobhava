import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Stay with a Local Resident (Phase 3) | पारिवारिक प्रवास - Atithi Devo Bhava",
  description:
    "Homestays and residential hospitality status. Opening in Phase 3 following full regulatory and safety compliance.",
};

export default async function StaysDirectoryPage({
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
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              {isHindi ? "अन्वेषण" : "Explore"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "पारिवारिक प्रवास (चरण 3)" : "Stay with a Local (Phase 3)"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-secondary">
            {isHindi ? "माध्यम 3: पारिवारिक प्रवास" : "Product C: Stay with a Local"}
          </span>
          <span className="text-xs text-secondary">•</span>
          <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-sm font-medium">
            {isHindi ? "चरण 3 में प्रारंभ होगा" : "Opening in Phase 3"}
          </span>
        </div>

        <Bi
          hindi="पारिवारिक आवास और होमस्टे"
          english="Residential Hospitality and Family Stays"
          as="h1"
          className="mb-2"
        />

        <p className="text-sm text-secondary max-w-prose">
          {isHindi
            ? "भारतीय परिवारों के साथ प्रामाणिक होमस्टे और अतिथि सत्कार। यह सुविधा कानूनी व सुरक्षा अनुपालन के बाद चरण 3 में शुरू होगी।"
            : "Authentic family homestays and community accommodation. Opening in Phase 3 following stringent regulatory and safety verification."}
        </p>
      </header>

      {/* Honest Status Notice */}
      <section className="mb-12">
        <Notice variant="default">
          <div className="space-y-2 py-1">
            <h2 className="font-heading text-base font-medium text-text">
              {isHindi ? "पारदर्शी सूचना: आवास बुकिंग अभी खुली नहीं है" : "Honest Notice: Accommodation Booking is Not Open Yet"}
            </h2>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "अतिथि देवो भव पर हम कभी भी अधूरी या असत्यापित सुविधाओं को काम करती हुई नहीं दिखाते। रहने की सुविधा (Stay with a Local) के लिए भारतीय कानूनों के अनुसार उच्च सत्यापन स्तर, स्थानीय पुलिस नियम, विदेशी नागरिकों के लिए फॉर्म-सी (Form C) अनुपालन, और शारीरिक सुरक्षा निरीक्षण आवश्यक होते हैं। इसलिए, यह सुविधा चरण 3 में सुरक्षा मानकों की पूर्णता के बाद ही शुरू की जाएगी।"
                : "Atithi Devo Bhava never presents non-functioning features as active. Residential homestays carry a higher legal and safety threshold in India, requiring local compliance, Form C readiness for international guests, physical safety checks, and host vetting. Consequently, homestay listings will open in Phase 3 once the full compliance framework is operational."}
            </p>
          </div>
        </Notice>
      </section>

      {/* Compliance Roadmap & Requirements */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "चरण 3 अनुपालन ढांचा" : "Phase 3 Compliance Framework"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1 block">
              {isHindi ? "स्तंभ 1" : "Pillar 1"}
            </span>
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "कानूनी और नियामक अनुपालन" : "Regulatory Compliance"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "राज्य पर्यटन बोर्ड के होमस्टे नियमों का पालन, स्थानीय निकाय पंजीकरण, और अंतरराष्ट्रीय आगंतुकों के लिए अधिकृत फॉर्म-सी पंजीकरण केंद्र।"
                : "State Tourism Board registration compliance, municipal permissions, and automated Form C preparation guidance for foreign passport holders."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1 block">
              {isHindi ? "स्तंभ 2" : "Pillar 2"}
            </span>
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "शारीरिक सुरक्षा मानक" : "Physical Safety Standards"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "प्राथमिक चिकित्सा किट, धुआं पहचान उपकरण, बंद होने वाले निजी कक्ष, सुरक्षित पेयजल और आपातकालीन निकास मार्गों का प्रत्यक्ष सत्यापन।"
                : "Direct physical check of lockable private quarters, clean drinking water, fire safety, first-aid provisions, and emergency exit accessibility."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1 block">
              {isHindi ? "स्तंभ 3" : "Pillar 3"}
            </span>
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "गोपनीयता और पता सुरक्षा" : "Address & Privacy Guard"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "मेजबान के घर का सटीक पता कभी भी सार्वजनिक नहीं किया जाएगा। केवल पुष्टि की गई बुकिंग के 72 घंटे पूर्व ही अधिकृत अतिथि को पता प्राप्त होगा।"
                : "Exact home addresses are never public. Confirmed guests receive address and location centroid strictly within 72 hours of scheduled check-in."}
            </p>
          </div>
        </div>
      </section>

      {/* Action / Next steps */}
      <section className="p-8 border border-rule rounded-sm bg-page flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-base font-medium text-text mb-1">
            {isHindi ? "क्या आप अपने घर में अतिथियों का स्वागत करना चाहते हैं?" : "Would you like to host visitors in your home?"}
          </h3>
          <p className="text-xs text-secondary max-w-xl">
            {isHindi
              ? "आप अभी से अपनी प्रारंभिक रुचि दर्ज कर सकते हैं। जैसे ही चरण 3 आपके जिले में खुलेगा, हमारी अनुपालन टीम आपसे संपर्क करेगी।"
              : "Register your preliminary interest now. Our compliance team will reach out as Phase 3 verification opens in your district."}
          </p>
        </div>

        <Link
          href="/become-a-host"
          className="tap-target px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium whitespace-nowrap transition-colors"
        >
          {isHindi ? "आवास मेजबानी हेतु पंजीकरण करें" : "Register Host Interest"}
        </Link>
      </section>
    </div>
  );
}
