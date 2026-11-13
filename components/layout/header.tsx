"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useLocale } from "next-intl";

interface UserSessionInfo {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string | null;
  role: string;
}

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSessionInfo | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check auth session
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
          } else if (isMounted) {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) setUser(null);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Handle outside click for user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const isRouteActive = (route: string) => {
    if (route === "/india") return pathname.startsWith("/india");
    if (route === "/explore/people") return pathname.startsWith("/explore/people");
    if (route === "/explore/experiences") return pathname.startsWith("/explore/experiences") || pathname.startsWith("/experiences");
    if (route === "/explore/stays") return pathname.startsWith("/explore/stays") || pathname.startsWith("/stays");
    if (route === "/how-it-works") return pathname.startsWith("/how-it-works");
    return false;
  };

  return (
    <header className="w-full organic-glass sticky top-0 z-40 transition-all border-b border-rule/80">
      {/* 2px Cultural Heritage Rule */}
      <div className="h-[2px] w-full bg-gradient-to-r from-forest via-[#D4AF37] to-terracotta opacity-85" />
      
      <div className="site-container">
        <div className="flex items-center justify-between h-20">
          {/* Brand lockup with official logo */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest py-1 group shrink-0"
          >
            <Image
              src="/images/logo.png"
              alt="Atithi Devo Bhava - अतिथि देवो भवः"
              width={200}
              height={68}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] dark:brightness-110"
            />
          </Link>

          {/* Desktop Navigation: Two-line bilingual labels with active indicators */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 h-full"
          >
            <Link
              href="/india"
              className="tap-target flex flex-col items-start text-left group relative py-2 h-full justify-center"
            >
              <span
                lang="hi"
                className={`text-xs font-medium transition-colors ${
                  isRouteActive("/india") ? "text-primary font-semibold" : "text-text group-hover:text-primary"
                }`}
              >
                भारत को जानें
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isRouteActive("/india") ? "text-terracotta font-medium" : "text-secondary group-hover:text-primary"
                }`}
              >
                Discover India
              </span>
              {isRouteActive("/india") && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
              )}
            </Link>

            <Link
              href="/explore/people"
              className="tap-target flex flex-col items-start text-left group relative py-2 h-full justify-center"
            >
              <span
                lang="hi"
                className={`text-xs font-medium transition-colors ${
                  isRouteActive("/explore/people") ? "text-primary font-semibold" : "text-text group-hover:text-primary"
                }`}
              >
                स्थानीय लोगों से मिलें
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isRouteActive("/explore/people") ? "text-terracotta font-medium" : "text-secondary group-hover:text-primary"
                }`}
              >
                Meet Locals
              </span>
              {isRouteActive("/explore/people") && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
              )}
            </Link>

            <Link
              href="/explore/experiences"
              className="tap-target flex flex-col items-start text-left group relative py-2 h-full justify-center"
            >
              <span
                lang="hi"
                className={`text-xs font-medium transition-colors ${
                  isRouteActive("/explore/experiences") ? "text-primary font-semibold" : "text-text group-hover:text-primary"
                }`}
              >
                सांस्कृतिक अनुभव
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isRouteActive("/explore/experiences") ? "text-terracotta font-medium" : "text-secondary group-hover:text-primary"
                }`}
              >
                Living Crafts
              </span>
              {isRouteActive("/explore/experiences") && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
              )}
            </Link>

            <Link
              href="/explore/stays"
              className="tap-target flex flex-col items-start text-left group relative py-2 h-full justify-center"
            >
              <span
                lang="hi"
                className={`text-xs font-medium transition-colors ${
                  isRouteActive("/explore/stays") ? "text-primary font-semibold" : "text-text group-hover:text-primary"
                }`}
              >
                कहाँ ठहरें
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isRouteActive("/explore/stays") ? "text-terracotta font-medium" : "text-secondary group-hover:text-primary"
                }`}
              >
                Stays (Phase 3)
              </span>
              {isRouteActive("/explore/stays") && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
              )}
            </Link>

            <Link
              href="/how-it-works"
              className="tap-target flex flex-col items-start text-left group relative py-2 h-full justify-center"
            >
              <span
                lang="hi"
                className={`text-xs font-medium transition-colors ${
                  isRouteActive("/how-it-works") ? "text-primary font-semibold" : "text-text group-hover:text-primary"
                }`}
              >
                यह कैसे काम करता है
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isRouteActive("/how-it-works") ? "text-terracotta font-medium" : "text-secondary group-hover:text-primary"
                }`}
              >
                How It Works
              </span>
              {isRouteActive("/how-it-works") && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta" />
              )}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex items-center border border-rule/90 rounded-sm p-0.5 bg-warm/50 text-xs font-mono shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-secondary ml-1.5 mr-1" strokeWidth={1.5} />
              <button
                type="button"
                onClick={() => switchLocale("hi")}
                className={`px-2.5 py-1 rounded-xs transition-all duration-150 ${
                  locale === "hi"
                    ? "bg-primary text-white shadow-2xs font-semibold"
                    : "text-secondary hover:text-text"
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={`px-2.5 py-1 rounded-xs transition-all duration-150 ${
                  locale === "en"
                    ? "bg-primary text-white shadow-2xs font-semibold"
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
              className="tap-target w-9 h-9 border border-rule/80 hover:border-secondary rounded-sm flex items-center justify-center text-text transition-colors shadow-2xs bg-surface/80"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-text" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 text-text" strokeWidth={1.5} />
              )}
            </button>

            {/* Authenticated User Controls vs Anonymous Visitor */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="tap-target inline-flex items-center gap-2 pl-2 pr-3 py-1 bg-surface hover:bg-warm/40 border border-rule/90 rounded-sm transition-all shadow-2xs font-mono"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-xs bg-forest text-white font-medium text-xs flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                  <span className="text-xs font-medium text-text max-w-[100px] truncate">
                    {user.displayName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 journal-paper border border-rule rounded-sm shadow-card py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-rule/70">
                      <p className="text-xs font-semibold text-text truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[11px] text-secondary truncate mt-0.5 font-mono">
                        {user.email}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider bg-forest/10 border border-forest/30 text-forest">
                        <ShieldCheck className="w-3 h-3 text-forest" />
                        <span>{user.role === "admin" ? "Platform Admin" : "Verified Member"}</span>
                      </span>
                    </div>

                    {/* Links */}
                    <div className="py-1 text-xs">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-warm/50 text-text font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-forest" />
                        <span>{locale === "hi" ? "डैशबोर्ड" : "Dashboard"}</span>
                      </Link>

                      <Link
                        href="/dashboard/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-warm/50 text-text transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{locale === "hi" ? "मेरी गतिविधियां" : "My Bookings & Meetups"}</span>
                      </Link>

                      <Link
                        href="/messages"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-warm/50 text-text transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-secondary" />
                        <span>{locale === "hi" ? "संदेश" : "Messages"}</span>
                      </Link>

                      <Link
                        href="/safety"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-warm/50 text-text transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-terracotta" />
                        <span>{locale === "hi" ? "सुरक्षा केंद्र" : "Safety Hub & Hotline"}</span>
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-warm/50 text-text font-medium text-terracotta transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{locale === "hi" ? "प्रशासक पोर्टल" : "Admin Portal"}</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-rule/70 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{locale === "hi" ? "लॉग आउट करें" : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono">
                <Link
                  href="/login"
                  className="tap-target px-3.5 py-1.5 text-xs text-text hover:text-primary transition-colors uppercase tracking-wider font-medium"
                >
                  {locale === "hi" ? "लॉग इन" : "Log in"}
                </Link>

                <Link
                  href="/become-a-host"
                  className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xs text-xs font-medium uppercase tracking-wider transition-all shadow-xs"
                >
                  {locale === "hi" ? "मेज़बान बनें" : "Become a Host"}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="tap-target w-9 h-9 border border-rule/80 rounded-sm flex items-center justify-center text-text bg-surface/80"
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
              className="tap-target w-9 h-9 border border-rule/80 rounded-sm flex items-center justify-center text-text bg-surface/80"
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
            className="md:hidden py-5 border-t border-rule space-y-4 journal-paper rounded-sm p-4 animate-in slide-in-from-top-2 shadow-card"
          >
            {/* Authenticated User Banner on Mobile */}
            {user && (
              <div className="p-3.5 bg-warm/50 rounded-xs border border-rule flex items-center justify-between mb-3 font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xs bg-forest text-white font-medium text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text">{user.displayName}</p>
                    <p className="text-[11px] text-secondary">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1 bg-primary text-white text-[11px] rounded-xs font-medium uppercase tracking-wider"
                >
                  {locale === "hi" ? "डैशबोर्ड" : "Dashboard"}
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-rule font-mono">
              <span className="text-xs text-secondary font-medium">
                Language / भाषा
              </span>
              <div className="inline-flex border border-rule rounded-sm p-0.5 bg-surface text-xs">
                <button
                  type="button"
                  onClick={() => {
                    switchLocale("hi");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-xs ${locale === "hi" ? "bg-primary text-white font-medium shadow-2xs" : "text-secondary"}`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchLocale("en");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-xs ${locale === "en" ? "bg-primary text-white font-medium shadow-2xs" : "text-secondary"}`}
                >
                  English
                </button>
              </div>
            </div>

            <Link
              href="/india"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">भारत खोजें</div>
              <div className="text-xs text-secondary font-mono">Discover India</div>
            </Link>

            <Link
              href="/explore/people"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">स्थानीय लोगों से मिलें</div>
              <div className="text-xs text-secondary font-mono">Meet Locals</div>
            </Link>

            <Link
              href="/explore/experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">सांस्कृतिक अनुभव</div>
              <div className="text-xs text-secondary font-mono">Living Crafts</div>
            </Link>

            <Link
              href="/explore/stays"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">प्रवास (Stay)</div>
              <div className="text-xs text-secondary font-mono">Notice Mode · केवल जानकारी</div>
            </Link>

            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-rule/50"
            >
              <div lang="hi" className="text-sm font-medium text-text">यह कैसे काम करता है</div>
              <div className="text-xs text-secondary font-mono">How it works</div>
            </Link>

            <div className="pt-3 flex flex-col gap-2 font-mono">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="tap-target text-center py-2.5 text-xs font-semibold border border-red-300 dark:border-red-900 text-red-700 rounded-xs uppercase tracking-wider"
                >
                  {locale === "hi" ? "लॉग आउट करें" : "Sign Out"}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target text-center py-2.5 text-xs font-semibold border border-rule rounded-xs text-text hover:bg-page uppercase tracking-wider"
                  >
                    {locale === "hi" ? "लॉग इन करें" : "Log in"}
                  </Link>
                  <Link
                    href="/become-a-host"
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target text-center py-2.5 text-xs font-semibold bg-primary text-white rounded-xs shadow-xs uppercase tracking-wider"
                  >
                    {locale === "hi" ? "मेज़बान बनें" : "Become a host"}
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
