import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Contact Us & Grievance Redressal | संपर्क एवं शिकायत निवारण - Atithi Devo Bhava",
  description:
    "Get in touch with the Atithi Devo Bhava team or contact our Resident Grievance Officer under Indian IT Rules 2021.",
};

export default async function ContactPage({
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
            {isHindi ? "संपर्क" : "Contact"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <Bi
          hindi="संपर्क एवं शिकायत निवारण"
          english="Contact Us & Grievance Redressal"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {isHindi
            ? "प्लेटफ़ॉर्म संबंधी प्रश्नों, सहयोग या किसी शिकायत के लिए हमारी टीम से संपर्क करें।"
            : "Reach out to our operational team for platform questions, partnerships, or official grievance redressal."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section>
          <h2 className="font-heading text-lg font-medium text-text mb-4">
            {isHindi ? "सहायता संदेश भेजें" : "Send a Message"}
          </h2>

          <form className="space-y-4" action="/api/contact" method="POST">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "पूरा नाम *" : "Full Name *"}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                placeholder={isHindi ? "आपका नाम" : "Your name"}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "ईमेल पता *" : "Email Address *"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "विषय श्रेणी *" : "Inquiry Topic *"}
              </label>
              <select
                id="topic"
                name="topic"
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
              >
                <option value="general">{isHindi ? "सामान्य पूछताछ" : "General Inquiry"}</option>
                <option value="host">{isHindi ? "मेजबान पंजीकरण सहायता" : "Host Registration Assistance"}</option>
                <option value="safety">{isHindi ? "सुरक्षा या आचरण संबंधी चिंता" : "Safety or Conduct Concern"}</option>
                <option value="technical">{isHindi ? "तकनीकी समस्या" : "Technical Support"}</option>
                <option value="press">{isHindi ? "प्रेस या शोध पूछताछ" : "Press & Research"}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "संदेश *" : "Message *"}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                placeholder={isHindi ? "अपना संदेश विस्तार से लिखें..." : "Please describe your inquiry..."}
              />
            </div>

            <p className="text-[11px] text-secondary">
              {isHindi
                ? "हम आपकी जानकारी केवल इस पूछताछ के उत्तर के लिए उपयोग करते हैं। कोई प्रचार सामग्री नहीं भेजी जाती।"
                : "Information submitted here is used solely to respond to your inquiry. No marketing emails are ever sent."}
            </p>

            <button
              type="submit"
              className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {isHindi ? "संदेश भेजें" : "Submit Message"}
            </button>
          </form>
        </section>

        {/* Official Grievance Officer & Statutory Details */}
        <section className="space-y-8">
          <div className="p-6 border border-rule rounded-sm bg-warm/15 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
              {isHindi ? "सांविधिक सूचना (Statutory Notice)" : "Statutory Notice"}
            </span>
            <h2 className="font-heading text-lg font-medium text-text">
              {isHindi ? "निवासी शिकायत अधिकारी (Grievance Officer)" : "Resident Grievance Officer"}
            </h2>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के अनुपालन में, शिकायतों के निवारण हेतु विवरण निम्नलिखित हैं:"
                : "In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are:"}
            </p>

            <div className="pt-2 text-xs text-text space-y-1.5 font-mono border-t border-rule/60">
              <div><strong>Name:</strong> Grievance Redressal Cell</div>
              <div><strong>Email:</strong> grievance@atithidevobhava.in</div>
              <div><strong>Location:</strong> Mumbai, Maharashtra, India</div>
              <div><strong>Response SLA:</strong> Acknowledgement in 24 hours, resolution within 15 days</div>
            </div>
          </div>

          <div className="p-6 border border-rule rounded-sm bg-page space-y-3">
            <h3 className="font-heading text-base font-medium text-text">
              {isHindi ? "ऑपरेशन्स एवं पायलट केंद्र" : "Operations & Pilot Desk"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "हमारा वर्तमान क्षेत्रीय पायलट केंद्र दरभंगा और मधुबनी (बिहार) में स्थित है। सामुदायिक समन्वयक स्थानीय भाषा में सहायता के लिए उपलब्ध हैं।"
                : "Our active operational desk supports the Mithila pilot region (Darbhanga & Madhubani, Bihar). Community coordinators provide local language support in Maithili and Hindi."}
            </p>
            <div className="text-xs text-secondary">
              <span className="font-medium text-text">General Support:</span> support@atithidevobhava.in
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
