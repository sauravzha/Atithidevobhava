import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const isHindi = locale === "hi";

  return (
    <footer className="w-full bg-surface border-t border-rule mt-24 relative overflow-hidden">
      {/* Top Heritage Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-forest via-[#D4AF37] to-terracotta opacity-80" />

      <div className="site-container py-14 sm:py-16">
        {/* Vedic Upanishadic Invocation Banner */}
        <div className="mb-12 pb-8 border-b border-rule/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta font-semibold block">
              {isHindi ? "वैदिक मूल दर्शन · तैत्तिरीय उपनिषद्" : "Vedic Foundation · Taittiriya Upanishad"}
            </span>
            <p className="font-heading text-lg sm:text-xl text-text font-medium italic">
              «मातृदेवो भव। पितृदेवो भव। आचार्यदेवो भव। अतिथिदेवो भव।»
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary">
            <span className="inline-flex items-center gap-1.5 text-forest font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? "१००% सत्यापित पहचान" : "100% ID Verified Community"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 text-terracotta font-medium">
              <HeartHandshake className="w-3.5 h-3.5" />
              {isHindi ? "आपसी सहमति से संवाद" : "Mutual Consent Gated"}
            </span>
          </div>
        </div>

        {/* Brand Summary & Language Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-10 mb-10 border-b border-rule gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Atithi Devo Bhava - अतिथि देवो भवः"
              width={180}
              height={61}
              className="h-10 sm:h-12 w-auto object-contain dark:brightness-110"
            />
            <div className="hidden sm:block border-l border-rule pl-4">
              <span className="font-heading text-xs text-secondary block max-w-xs leading-relaxed">
                {isHindi
                  ? "सांस्कृतिक आतिथ्य एवं अनुभव मंच · उत्तरी बिहार (मिथिला) पायलट"
                  : "Cultural Hospitality & Experience Marketplace · Northern Bihar Pilot"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-secondary font-medium">
              {isHindi ? "भाषा / Language:" : "Language:"}
            </span>
            <div className="inline-flex items-center p-0.5 rounded-sm bg-warm/50 border border-rule">
              <Link
                href="/"
                locale="hi"
                className={`px-3 py-1 rounded-xs transition-all ${
                  locale === "hi"
                    ? "bg-primary text-white font-medium shadow-2xs"
                    : "text-secondary hover:text-text"
                }`}
              >
                हिंदी
              </Link>
              <Link
                href="/"
                locale="en"
                className={`px-3 py-1 rounded-xs transition-all ${
                  locale === "en"
                    ? "bg-primary text-white font-medium shadow-2xs"
                    : "text-secondary hover:text-text"
                }`}
              >
                English
              </Link>
            </div>
          </div>
        </div>

        {/* Links grid: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 mb-14 text-xs font-body">
          {/* Col 1 */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold text-secondary uppercase tracking-wider mb-4">
              {isHindi ? "संस्था एवं दर्शन" : "Platform & Ethos"}
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-secondary hover:text-primary transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "यह कैसे काम करता है" : "How it works"}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-secondary hover:text-primary transition-colors">
                  {t("safety")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary hover:text-primary transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold text-secondary uppercase tracking-wider mb-4">
              {isHindi ? "समुदाय एवं नागरिक" : "Community & Hosts"}
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/become-a-host" className="text-secondary hover:text-primary transition-colors">
                  {t("hostRegister")}
                </Link>
              </li>
              <li>
                <Link href="/register?role=traveller" className="text-secondary hover:text-primary transition-colors">
                  {t("travellerRegister")}
                </Link>
              </li>
              <li>
                <Link href="/host-responsibilities" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "मेज़बान ज़िम्मेदारियां" : "Host responsibilities"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-secondary hover:text-primary transition-colors">
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold text-secondary uppercase tracking-wider mb-4">
              {isHindi ? "अन्वेषण क्षेत्र" : "Field Regions"}
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/india" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "भारतीय राज्य और ज़िले" : "Indian States & Districts"}
                </Link>
              </li>
              <li>
                <Link href="/india/bihar/darbhanga" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "दरभंगा पायलट क्षेत्र" : "Darbhanga Pilot Region"}
                </Link>
              </li>
              <li>
                <Link href="/india/bihar/madhubani" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "मधुबनी पायलट क्षेत्र" : "Madhubani Pilot Region"}
                </Link>
              </li>
              <li>
                <Link href="/explore/experiences" className="text-secondary hover:text-primary transition-colors">
                  {isHindi ? "सांस्कृतिक अनुभव" : "Living Cultural Immersions"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold text-secondary uppercase tracking-wider mb-4">
              {isHindi ? "विधिक एवं आपातकालीन" : "Legal & Safety Grid"}
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-secondary hover:text-primary transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary hover:text-primary transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-secondary hover:text-primary transition-colors flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-terracotta" />
                  <span>{isHindi ? "आपातकालीन हेल्पलाइन (112)" : "Emergency Helpline (112)"}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & sovereign statement line */}
        <div className="pt-8 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-secondary">
          <p>
            © {new Date().getFullYear()} Atithi Devo Bhava (अतिथि देवो भवः). All rights reserved.
          </p>
          <p className="text-forest font-medium">
            {t("noAds")}
          </p>
        </div>
      </div>
    </footer>
  );
}
