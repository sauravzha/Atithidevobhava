"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import { useLocale } from "next-intl";

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adb_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adb_theme", "light");
    }
  };

  const switchLocale = (newLocale: "en" | "hi") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="w-full bg-surface border-b border-rule sticky top-0 z-40">
      <div className="site-container">
        <div className="flex items-center justify-between h-20">
          {/* Brand lockup */}
          <Link
            href="/"
            className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest py-1"
          >
            <span
              lang="hi"
              className="font-heading font-medium text-xl sm:text-2xl text-text leading-tight"
            >
              अतिथि देवो भवः
            </span>
            <span className="font-heading text-xs sm:text-sm text-secondary font-normal tracking-wide">
              Atithi Devo Bhava
            </span>
          </Link>

          {/* Desktop Navigation: Two-line bilingual labels */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6"
          >
            <Link
              href="/india"
              className="tap-target flex flex-col items-start text-left group"
            >
              <span lang="hi" className="text-xs font-medium text-text group-hover:text-primary transition-colors duration-[120ms]">
                भारत खोजें
              </span>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                Discover India
              </span>
            </Link>

            <Link
              href="/explore/people"
              className="tap-target flex flex-col items-start text-left group"
            >
              <span lang="hi" className="text-xs font-medium text-text group-hover:text-primary transition-colors duration-[120ms]">
                स्थानीय लोगों से मिलें
              </span>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                Meet Locals
              </span>
            </Link>

            <Link
              href="/explore/experiences"
              className="tap-target flex flex-col items-start text-left group"
            >
              <span lang="hi" className="text-xs font-medium text-text group-hover:text-primary transition-colors duration-[120ms]">
                सांस्कृतिक अनुभव
              </span>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                Experiences
              </span>
            </Link>

            <Link
              href="/explore/stays"
              className="tap-target flex flex-col items-start text-left group"
            >
              <span lang="hi" className="text-xs font-medium text-text group-hover:text-primary transition-colors duration-[120ms]">
                प्रवास
              </span>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                Stay
              </span>
            </Link>

            <Link
              href="/how-it-works"
              className="tap-target flex flex-col items-start text-left group"
            >
              <span lang="hi" className="text-xs font-medium text-text group-hover:text-primary transition-colors duration-[120ms]">
                यह कैसे काम करता है
              </span>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                How it works
              </span>
            </Link>
          </nav>

          {/* Right actions: Language toggle, theme toggle, Log in, Become a host */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex items-center border border-rule rounded-sm p-0.5 bg-page text-xs font-medium">
              <Globe className="w-3.5 h-3.5 text-secondary ml-1 mr-1.5" strokeWidth={1.5} />
              <button
                type="button"
                onClick={() => switchLocale("hi")}
                className={`tap-target px-2 py-1 rounded-sm transition-colors duration-[120ms] ${
                  locale === "hi"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-text"
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={`tap-target px-2 py-1 rounded-sm transition-colors duration-[120ms] ${
                  locale === "en"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-text"
                }`}
              >
                English
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="tap-target w-10 h-10 border border-rule hover:border-secondary rounded-sm flex items-center justify-center text-text transition-colors duration-[120ms]"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-text" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 text-text" strokeWidth={1.5} />
              )}
            </button>

            {/* Auth Link */}
            <Link
              href="/login"
              className="tap-target px-3 py-1.5 text-xs font-medium text-text hover:text-primary transition-colors duration-[120ms]"
            >
              {locale === "hi" ? "लॉग इन" : "Log in"}
            </Link>

            {/* Become a Host Button */}
            <Link
              href="/become-a-host"
              className="tap-target px-3.5 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm text-xs font-medium transition-colors duration-[120ms]"
            >
              {locale === "hi" ? "मेज़बान बनें" : "Become a host"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="tap-target w-10 h-10 border border-rule rounded-sm flex items-center justify-center text-text"
            >
              {isDark ? (
                <Sun className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="tap-target w-10 h-10 border border-rule rounded-sm flex items-center justify-center text-text"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden py-4 border-t border-rule space-y-3 bg-surface"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rule">
              <span className="text-xs text-secondary font-medium">
                Language / भाषा
              </span>
              <div className="inline-flex border border-rule rounded-sm p-0.5 bg-page text-xs">
                <button
                  type="button"
                  onClick={() => {
                    switchLocale("hi");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-sm ${locale === "hi" ? "bg-primary text-white" : "text-secondary"}`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchLocale("en");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-sm ${locale === "en" ? "bg-primary text-white" : "text-secondary"}`}
                >
                  English
                </button>
              </div>
            </div>

            <Link
              href="/india"
              onClick={() => setMobileMenuOpen(false)}
              className="tap-target block py-2 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">भारत खोजें</div>
              <div className="text-xs text-secondary">Discover India</div>
            </Link>

            <Link
              href="/explore/people"
              onClick={() => setMobileMenuOpen(false)}
              className="tap-target block py-2 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">स्थानीय लोगों से मिलें</div>
              <div className="text-xs text-secondary">Meet Locals</div>
            </Link>

            <Link
              href="/explore/experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="tap-target block py-2 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">सांस्कृतिक अनुभव</div>
              <div className="text-xs text-secondary">Experiences</div>
            </Link>

            <Link
              href="/explore/stays"
              onClick={() => setMobileMenuOpen(false)}
              className="tap-target block py-2 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">प्रवास (Stay)</div>
              <div className="text-xs text-secondary">Not open yet · केवल जानकारी</div>
            </Link>

            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="tap-target block py-2 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">यह कैसे काम करता है</div>
              <div className="text-xs text-secondary">How it works</div>
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target text-center py-2 text-sm font-medium border border-rule rounded-sm text-text"
              >
                {locale === "hi" ? "लॉग इन करें" : "Log in"}
              </Link>
              <Link
                href="/become-a-host"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target text-center py-2 text-sm font-medium bg-primary text-white rounded-sm"
              >
                {locale === "hi" ? "मेज़बान बनें" : "Become a host"}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
