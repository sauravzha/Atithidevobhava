import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Help Center & Support | सहायता केंद्र - Atithi Devo Bhava",
  description:
    "Find answers to common questions, view emergency helplines, or submit a support enquiry to our team.",
};

export default async function HelpPage({
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
            {isHindi ? "सहायता केंद्र" : "Help Center"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-8">
        <Bi
          hindi="सहायता केंद्र और संपर्क"
          english="Help Center & Support"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "प्लेटफ़ॉर्म के उपयोग, सुरक्षा नियमों या किसी समस्या के समाधान के लिए मार्गदर्शन।"
            : "Guidance on using the platform, understanding safety standards, or contacting our support team."}
        </p>
      </header>

      {/* Standalone Emergency Callout (Zero JS dependency) */}
      <section
        className="mb-10 p-5 border border-red-700 bg-red-50 text-red-950 rounded-sm"
        aria-label="Immediate Emergency Contact"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-900 block">
              {isHindi ? "आपातकालीन स्थिति में सीधे डायल करें" : "Direct Emergency Helplines (India)"}
            </span>
            <p className="text-xs text-red-900 mt-0.5">
              {isHindi
                ? "राष्ट्रीय आपातकाल: 112 • महिला हेल्पलाइन: 1091 • पर्यटक हेल्पलाइन: 1363"
                : "National Emergency: 112 • Women Helpline: 1091 • Tourist Helpline: 1363"}
            </p>
          </div>
          <Link
            href="/safety"
            className="text-xs font-semibold text-red-950 underline hover:text-red-800"
          >
            {isHindi ? "संपूर्ण सुरक्षा दिशानिर्देश" : "Full Safety Protocol"} →
          </Link>
        </div>
      </section>

      {/* Help Topics */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h2 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "खाता और सत्यापन" : "Account & Verification"}
            </h2>
            <ul className="text-xs text-secondary space-y-2">
              <li>
                <Link href="/faq#account" className="hover:text-primary transition-colors">
                  {isHindi ? "ईमेल और मोबाइल सत्यापन कैसे काम करता है?" : "How mobile OTP verification works"}
                </Link>
              </li>
              <li>
                <Link href="/faq#account" className="hover:text-primary transition-colors">
                  {isHindi ? "हम आधार या पासपोर्ट क्यों नहीं मांगते?" : "Why we don't store Aadhaar or passports"}
                </Link>
              </li>
              <li>
                <Link href="/faq#account" className="hover:text-primary transition-colors">
                  {isHindi ? "अपनी प्रोफ़ाइल दृश्यता कैसे बदलें?" : "Changing profile visibility settings"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h2 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "मुलाकात और संवाद" : "Meetups & Messaging"}
            </h2>
            <ul className="text-xs text-secondary space-y-2">
              <li>
                <Link href="/faq#meetups" className="hover:text-primary transition-colors">
                  {isHindi ? "सार्वजनिक मिलन स्थल का चयन कैसे करें?" : "Choosing safe public meeting points"}
                </Link>
              </li>
              <li>
                <Link href="/faq#meetups" className="hover:text-primary transition-colors">
                  {isHindi ? "फ़ोन नंबर कब और कैसे साझा होता है?" : "When are phone numbers revealed?"}
                </Link>
              </li>
              <li>
                <Link href="/faq#meetups" className="hover:text-primary transition-colors">
                  {isHindi ? "यदि स्थानीय सदस्य उपलब्ध न हो तो क्या करें?" : "What if a resident declines or is busy?"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-warm/10">
            <h2 className="font-heading text-base font-medium text-text mb-2">
              {isHindi ? "सुरक्षा और शिकायतें" : "Safety & Grievances"}
            </h2>
            <ul className="text-xs text-secondary space-y-2">
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  {isHindi ? "सुरक्षा दिशा-निर्देश और नियम" : "Platform safety code of conduct"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {isHindi ? "शिकायत अधिकारी (Grievance Officer)" : "Contacting the Grievance Officer"}
                </Link>
              </li>
              <li>
                <Link href="/faq#safety" className="hover:text-primary transition-colors">
                  {isHindi ? "अनुचित व्यवहार की रिपोर्ट कैसे करें?" : "Reporting inappropriate conduct"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Support Form / Contact Box */}
      <section className="p-6 border border-rule bg-page rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-lg font-medium text-text mb-1">
            {isHindi ? "क्या आपका प्रश्न अभी भी अनुत्तरित है?" : "Still have an unanswered question?"}
          </h2>
          <p className="text-xs text-secondary">
            {isHindi
              ? "हमारी सामुदायिक सहायता टीम 24 घंटे के भीतर उत्तर देती है।"
              : "Our community support team typically responds within 24 hours."}
          </p>
        </div>

        <Link
          href="/contact"
          className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium whitespace-nowrap transition-colors"
        >
          {isHindi ? "सहायता संदेश भेजें" : "Send Support Message"}
        </Link>
      </section>
    </div>
  );
}

