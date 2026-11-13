import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import {
  Mail,
  ShieldCheck,
  Clock,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Grievance Redressal | संपर्क एवं शिकायत निवारण - Atithi Devo Bhava",
  description:
    "Get in touch with the Atithi Devo Bhava operational team or contact our Resident Grievance Officer under Indian IT Rules 2021.",
};

export default async function ContactPage({
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
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "संपर्क एवं सहायता" : "Contact & Grievance"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-forest mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-forest" />
            <span>{isHindi ? "संवाद एवं शिकायत निवारण" : "Direct Operational Support"}</span>
          </div>

          <Bi
            hindi="संपर्क एवं सांविधिक शिकायत निवारण"
            english="Contact Desk & Statutory Grievance Redressal"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
          />

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
            {isHindi
              ? "प्लेटफ़ॉर्म संबंधी प्रश्नों, समुदाय सहयोग या किसी शिकायत के लिए हमारी टीम से संपर्क करें। भारतीय सूचना प्रौद्योगिकी नियम 2021 के अनुरूप समर्पित सहायता कक्ष।"
              : "Reach out to our operational team for community inquiries, partnerships, or official statutory grievance redressal under Indian IT Rules 2021."}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form Card */}
        <section className="lg:col-span-7 journal-paper p-6 sm:p-8 border border-rule rounded-sm shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-rule">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-terracotta block mb-0.5 font-semibold">
                {isHindi ? "सीधा संदेश" : "Direct Message"}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-medium text-text">
                {isHindi ? "सहायता संदेश भेजें" : "Send an Inquiry"}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-secondary">
              {isHindi ? "२४ घंटे में उत्तर" : "24h Response SLA"}
            </span>
          </div>

          <form className="space-y-5" action="/api/contact" method="POST">
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
                {isHindi ? "पूरा नाम *" : "Full Name *"}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2.5 border border-rule rounded-xs text-sm bg-surface text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body"
                placeholder={isHindi ? "आपका पूरा नाम" : "Your full name"}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
                {isHindi ? "ईमेल पता *" : "Email Address *"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2.5 border border-rule rounded-xs text-sm bg-surface text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
                {isHindi ? "विषय श्रेणी *" : "Inquiry Category *"}
              </label>
              <select
                id="topic"
                name="topic"
                className="w-full px-4 py-2.5 border border-rule rounded-xs text-sm bg-surface text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body"
              >
                <option value="general">{isHindi ? "सामान्य पूछताछ" : "General Inquiry"}</option>
                <option value="host">{isHindi ? "मेजबान पंजीकरण सहायता" : "Host Registration Assistance"}</option>
                <option value="safety">{isHindi ? "सुरक्षा या आचरण संबंधी चिंता" : "Safety or Conduct Concern"}</option>
                <option value="technical">{isHindi ? "तकनीकी समस्या" : "Technical Support"}</option>
                <option value="press">{isHindi ? "प्रेस या शोध पूछताछ" : "Press & Academic Research"}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
                {isHindi ? "संदेश *" : "Message *"}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2.5 border border-rule rounded-xs text-sm bg-surface text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body leading-relaxed"
                placeholder={isHindi ? "अपना संदेश विस्तार से लिखें..." : "Please describe your inquiry or feedback in detail..."}
              />
            </div>

            <p className="text-[11px] text-secondary font-heading italic">
              {isHindi
                ? "हम आपकी जानकारी का उपयोग केवल इस पूछताछ के उत्तर के लिए करते हैं। कोई प्रचार सामग्री या स्पैम कभी नहीं भेजा जाता।"
                : "Information submitted here is encrypted and processed solely to respond to your inquiry in compliance with DPDP Act 2023."}
            </p>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xs text-xs font-mono uppercase tracking-wider transition-all shadow-xs tactile-button"
            >
              <span>{isHindi ? "संदेश भेजें" : "Submit Message"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* Official Grievance Officer & Statutory Details */}
        <section className="lg:col-span-5 space-y-6">
          {/* Statutory Grievance Redressal Card */}
          <div className="journal-paper p-6 sm:p-7 border border-rule rounded-sm space-y-4">
            <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-2.5 py-1 text-terracotta inline-block">
              {isHindi ? "सांविधिक सूचना · IT नियम २०२१" : "Statutory Notice · IT Rules 2021"}
            </span>

            <h3 className="font-heading text-xl font-medium text-text">
              {isHindi ? "निवासी शिकायत अधिकारी (Grievance Officer)" : "Resident Grievance Officer"}
            </h3>

            <p className="text-xs text-secondary leading-relaxed font-heading">
              {isHindi
                ? "सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के अनुपालन में, शिकायतों के निवारण हेतु अधिकृत संपर्क विवरण निम्नलिखित हैं:"
                : "In strict accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are:"}
            </p>

            <div className="pt-3 text-xs font-mono text-text space-y-2 border-t border-rule/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                <span><strong>Authority:</strong> Grievance Redressal Cell</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-terracotta shrink-0" />
                <span><strong>Email:</strong> grievance@atithidevobhava.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span><strong>Jurisdiction:</strong> Mumbai / Bihar, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-forest shrink-0" />
                <span><strong>SLA:</strong> Ack in 24h, resolution in 15 days</span>
              </div>
            </div>
          </div>

          {/* Pilot Field Desk */}
          <div className="journal-paper p-6 sm:p-7 border border-rule rounded-sm space-y-3 bg-warm/20">
            <div className="flex items-center gap-2 text-forest text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>{isHindi ? "क्षेत्रीय परिचालन केंद्र" : "Regional Field Operations"}</span>
            </div>

            <h3 className="font-heading text-lg font-medium text-text">
              {isHindi ? "मिथिला पायलट डेस्क: दरभंगा व मधुबनी" : "Mithila Pilot Desk: Darbhanga & Madhubani"}
            </h3>

            <p className="text-xs text-secondary leading-relaxed font-heading">
              {isHindi
                ? "हमारा क्षेत्रीय पायलट केंद्र दरभंगा और मधुबनी जिलों में सक्रिय है। सामुदायिक समन्वयक मैथिली और हिंदी में प्रत्यक्ष सहायता के लिए उपलब्ध हैं।"
                : "Our dedicated field desk supports artisans, local guides, and travelers in Darbhanga and Madhubani. Local coordinators assist in Maithili, Hindi, and English."}
            </p>

            <div className="pt-2 text-xs font-mono text-secondary border-t border-rule/50">
              <span className="font-medium text-text">General Support:</span> support@atithidevobhava.in
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
