import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="w-full bg-surface border-t border-rule mt-24">
      <div className="site-container py-12">
        {/* Top row: Brand summary and language selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 mb-8 border-b border-rule gap-6">
          <div>
            <span lang="hi" className="font-heading font-medium text-lg text-text block">
              अतिथि देवो भवः
            </span>
            <span className="font-heading text-xs text-secondary">
              Atithi Devo Bhava · Cultural Hospitality & Experience Marketplace
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-secondary">
            <span className="font-medium text-text">
              {locale === "hi" ? "भाषा / Language:" : "Language:"}
            </span>
            <Link
              href="/"
              locale="hi"
              className={`tap-target px-2 py-1 rounded-sm border ${
                locale === "hi"
                  ? "border-primary text-primary font-medium"
                  : "border-rule hover:border-secondary text-secondary"
              }`}
            >
              हिंदी
            </Link>
            <Link
              href="/"
              locale="en"
              className={`tap-target px-2 py-1 rounded-sm border ${
                locale === "en"
                  ? "border-primary text-primary font-medium"
                  : "border-rule hover:border-secondary text-secondary"
              }`}
            >
              English
            </Link>
          </div>
        </div>

        {/* Links grid: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 font-body text-xs">
          <div>
            <h2 className="font-medium text-secondary uppercase tracking-wider mb-3">
              {locale === "hi" ? "संस्था" : "Platform"}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "यह कैसे काम करता है" : "How it works"}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("safety")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium text-secondary uppercase tracking-wider mb-3">
              {locale === "hi" ? "समुदाय" : "Community"}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/become-a-host" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("hostRegister")}
                </Link>
              </li>
              <li>
                <Link href="/register?role=traveller" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("travellerRegister")}
                </Link>
              </li>
              <li>
                <Link href="/host-responsibilities" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "मेज़बान ज़िम्मेदारियां" : "Host responsibilities"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium text-secondary uppercase tracking-wider mb-3">
              {locale === "hi" ? "खोजें" : "Explore"}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/india" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "भारतीय राज्य और ज़िले" : "Indian States & Districts"}
                </Link>
              </li>
              <li>
                <Link href="/india/bihar/darbhanga" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "दरभंगा पायलट क्षेत्र" : "Darbhanga Pilot Region"}
                </Link>
              </li>
              <li>
                <Link href="/india/bihar/madhubani" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "मधुबनी पायलट क्षेत्र" : "Madhubani Pilot Region"}
                </Link>
              </li>
              <li>
                <Link href="/explore/experiences" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "सांस्कृतिक अनुभव" : "Cultural Experiences"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium text-secondary uppercase tracking-wider mb-3">
              {locale === "hi" ? "कानूनी और सहायता" : "Legal & Help"}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-text hover:text-primary transition-colors duration-[120ms]">
                  {locale === "hi" ? "आपातकालीन सहायता (112)" : "Emergency Help (112)"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom statement line */}
        <div className="pt-6 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-secondary">
          <p>
            © {new Date().getFullYear()} Atithi Devo Bhava (अतिथि देवो भवः).
          </p>
          <p className="font-medium text-forest">
            {t("noAds")}
          </p>
        </div>
      </div>
    </footer>
  );
}

