"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import {
  ShieldCheck,
  Calendar,
  Compass,
  MessageSquare,
  MapPin,
  Clock,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Home,
  Plus,
  FileCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { type AuthenticatedUser } from "@/lib/auth/demo-accounts";
import {
  LotusMotif,
  DiyaMotif,
} from "@/components/ui/cultural-patterns";

interface DashboardClientProps {
  user: AuthenticatedUser;
  locale: string;
}

export function DashboardClient({ user, locale }: DashboardClientProps) {
  const router = useRouter();
  const isHindi = locale === "hi";

  const [activeTab, setActiveTab] = useState<"itinerary" | "host" | "safety" | "saved">("itinerary");
  const [viewMode, setViewMode] = useState<"traveller" | "host">(
    user.role === "experience_provider" || user.role === "local_member" || user.role === "accommodation_host"
      ? "host"
      : "traveller"
  );
  const [checkInStatus, setCheckInStatus] = useState<"safe" | "in_transit" | "need_help">("safe");
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  // User initials for avatar
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const roleLabels: Record<string, { en: string; hi: string }> = {
    traveller: { en: "Verified Traveller", hi: "सत्यापित यात्री" },
    local_member: { en: "Local Resident & Host", hi: "स्थानीय निवासी व मेज़बान" },
    experience_provider: { en: "Master Artisan & Experience Provider", hi: "वरिष्ठ शिल्पकार व अनुभव प्रदाता" },
    accommodation_host: { en: "Heritage Accommodation Host", hi: "धरोहर आवास मेज़बान" },
    admin: { en: "Platform Administrator & Safety Lead", hi: "मंच प्रशासक व सुरक्षा प्रमुख" },
  };

  const currentRoleLabel = roleLabels[user.role] || { en: "Member", hi: "सदस्य" };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ==================================================================== */}
      {/* 1. HERO PROFILE & WELCOME BANNER                                     */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-sm journal-paper border border-rule shadow-card p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: User Avatar & Welcome */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xs bg-forest text-white flex items-center justify-center text-xl sm:text-2xl font-heading font-medium shadow-xs shrink-0 overflow-hidden border border-rule">
              {user.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={user.displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              {/* Online / Active Badge */}
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[11px] font-mono uppercase tracking-wider font-medium bg-forest/10 text-forest border border-forest/20">
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                <span>{isHindi ? currentRoleLabel.hi : currentRoleLabel.en}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium text-text">
                {isHindi ? `नमस्ते, ${user.displayName}!` : `Namaste, ${user.displayName}!`}
              </h1>
              <p className="text-xs text-secondary flex items-center gap-2 font-mono">
                <span>{user.email}</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isHindi ? "सत्यापित पहचान" : "Identity Verified"}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Quick Role Switcher & Sign Out */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-rule/60">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 journal-paper border border-rule rounded-xs text-xs font-mono uppercase tracking-wider shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("traveller")}
                className={`px-3 py-1.5 rounded-xs transition-all tactile-button ${
                  viewMode === "traveller"
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-secondary hover:text-text"
                }`}
              >
                {isHindi ? "यात्री दर्शन" : "Traveller View"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("host")}
                className={`px-3 py-1.5 rounded-xs transition-all tactile-button ${
                  viewMode === "host"
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-secondary hover:text-text"
                }`}
              >
                {isHindi ? "मेज़बान केंद्र" : "Host View"}
              </button>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="tap-target px-3.5 py-2 rounded-xs border border-rule hover:bg-warm/70 text-xs text-secondary hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 font-mono uppercase tracking-wider tactile-button"
              title={isHindi ? "लॉग आउट करें" : "Sign Out"}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHindi ? "लॉग आउट" : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="mt-6 pt-5 border-t border-rule grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 journal-paper rounded-xs border border-rule">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-secondary">
              {isHindi ? "आगामी मुलाकातें" : "Upcoming Meetups"}
            </span>
            <span className="text-xl font-heading font-semibold text-text mt-0.5 block">2</span>
          </div>
          <div className="p-3 journal-paper rounded-xs border border-rule">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-secondary">
              {isHindi ? "सांस्कृतिक अनुभव" : "Experiences Booked"}
            </span>
            <span className="text-xl font-heading font-semibold text-text mt-0.5 block">1</span>
          </div>
          <div className="p-3 journal-paper rounded-xs border border-rule">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-secondary">
              {isHindi ? "सक्रिय संदेश" : "Active Inquiries"}
            </span>
            <span className="text-xl font-heading font-semibold text-forest mt-0.5 block">3</span>
          </div>
          <div className="p-3 journal-paper rounded-xs border border-rule">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-secondary">
              {isHindi ? "सुरक्षा चेक-इन स्थिति" : "Safety Status"}
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isHindi ? "सक्रिय व सुरक्षित" : "Active & Verified"}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. DASHBOARD NAVIGATION TABS                                         */}
      {/* ==================================================================== */}
      <div className="flex items-center gap-2 border-b border-rule pb-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("itinerary")}
          className={`tap-target px-3.5 py-2 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all duration-150 flex items-center gap-2 shrink-0 tactile-button ${
            activeTab === "itinerary"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-secondary hover:text-text hover:bg-warm/60"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isHindi ? "मेरा यात्रा कार्यक्रम" : "My Itinerary & Meetups"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("host")}
          className={`tap-target px-3.5 py-2 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all duration-150 flex items-center gap-2 shrink-0 tactile-button ${
            activeTab === "host"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-secondary hover:text-text hover:bg-warm/60"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{isHindi ? "मेज़बान व अनुभव केंद्र" : "Host & Experience Workspace"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("safety")}
          className={`tap-target px-3.5 py-2 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all duration-150 flex items-center gap-2 shrink-0 tactile-button ${
            activeTab === "safety"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-secondary hover:text-text hover:bg-warm/60"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? "सुरक्षा एवं सहायता" : "Safety & Live Check-in"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={`tap-target px-3.5 py-2 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all duration-150 flex items-center gap-2 shrink-0 tactile-button ${
            activeTab === "saved"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-secondary hover:text-text hover:bg-warm/60"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isHindi ? "सहेजे गए अनुभव" : "Saved Experiences"}</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 3. TAB CONTENT: ITINERARY & MEETUPS                                  */}
      {/* ==================================================================== */}
      {activeTab === "itinerary" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-medium text-text">
                {isHindi ? "आगामी सांस्कृतिक गतिविधियां" : "Scheduled Cultural Activities"}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {isHindi
                  ? "सत्यापित स्थानीय निवासियों के साथ आपकी तय की गई मुलाकातें।"
                  : "Your confirmed cultural meetups and experiences with verified locals."}
              </p>
            </div>
            <Link
              href="/explore/experiences"
              className="tap-target inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xs text-xs font-mono uppercase tracking-wider font-semibold shadow-xs transition-colors tactile-button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? "नया अनुभव खोजें" : "Explore Experiences"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Meetup with Shanti Devi */}
            <div className="journal-paper border border-rule rounded-sm p-5 shadow-xs hover:shadow-card transition-all duration-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {isHindi ? "स्वीकृत मुलाकात" : "Confirmed Meetup"}
                  </span>
                  <h3 className="font-heading text-lg font-medium text-text">
                    {isHindi ? "शांति देवी के साथ पारंपरिक मिथिला चित्रकला" : "Mithila Painting Workshop with Shanti Devi"}
                  </h3>
                  <p className="text-xs text-secondary font-mono">
                    {isHindi ? "जितवारपुर, मधुबनी • लोक कला केंद्र" : "Jitwarpur, Madhubani • Folk Art Centre"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-terracotta shrink-0">
                  <LotusMotif className="w-5 h-5 text-terracotta" />
                </div>
              </div>

              <div className="p-3 bg-warm/50 rounded-xs text-xs space-y-2 border border-rule">
                <div className="flex items-center gap-2 text-text font-medium">
                  <Calendar className="w-3.5 h-3.5 text-forest" />
                  <span>{isHindi ? "कल, सुबह १०:०० बजे (२.५ घंटे)" : "Tomorrow, 10:00 AM (2.5 Hours)"}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{isHindi ? "सार्वजनिक मिलन स्थल: जितवारपुर ग्राम पंचायत परिसर" : "Public Venue: Jitwarpur Village Panchayat Perimeter"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-rule text-xs font-mono">
                <Link
                  href="/messages"
                  className="tap-target inline-flex items-center gap-1.5 text-forest hover:underline font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isHindi ? "मेज़बान को संदेश भेजें" : "Message Host"}</span>
                </Link>
                <Link
                  href="/safety"
                  className="tap-target inline-flex items-center gap-1 text-secondary hover:text-text"
                >
                  <span>{isHindi ? "सुरक्षा दिशानिर्देश" : "Safety Protocol"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Maithili Culinary Walk */}
            <div className="journal-paper border border-rule rounded-sm p-5 shadow-xs hover:shadow-card transition-all duration-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/80">
                    <Clock className="w-3 h-3 text-amber-700" />
                    {isHindi ? "आगामी शुक्रवार" : "Coming Friday"}
                  </span>
                  <h3 className="font-heading text-lg font-medium text-text">
                    {isHindi ? "पारंपरिक मैथिली पाक कला व भोजन" : "Maithili Culinary Heritage with Sunita Kumari"}
                  </h3>
                  <p className="text-xs text-secondary font-mono">
                    {isHindi ? "रांटी गांव, मधुबनी" : "Ranti Village, Madhubani"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-forest shrink-0">
                  <DiyaMotif className="w-5 h-5 text-forest" />
                </div>
              </div>

              <div className="p-3 bg-warm/50 rounded-xs text-xs space-y-2 border border-rule">
                <div className="flex items-center gap-2 text-text font-medium">
                  <Calendar className="w-3.5 h-3.5 text-forest" />
                  <span>{isHindi ? "शुक्रवार, दोपहर १२:०० बजे (३ घंटे)" : "Friday, 12:00 PM (3 Hours)"}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{isHindi ? "सार्वजनिक मिलन स्थल: रांटी उच्च विद्यालय गेट" : "Public Venue: Ranti High School Main Gate"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-rule text-xs font-mono">
                <Link
                  href="/messages"
                  className="tap-target inline-flex items-center gap-1.5 text-forest hover:underline font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isHindi ? "मेज़बान से संपर्क करें" : "Contact Host"}</span>
                </Link>
                <Link
                  href="/safety"
                  className="tap-target inline-flex items-center gap-1 text-secondary hover:text-text"
                >
                  <span>{isHindi ? "स्थान का नक्शा" : "Directions"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB CONTENT: HOST & EXPERIENCE WORKSPACE                          */}
      {/* ==================================================================== */}
      {activeTab === "host" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-medium text-text">
                {isHindi ? "मेज़बान एवं सांस्कृतिक अनुभव प्रबंधन" : "Host & Experience Workspace"}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {isHindi
                  ? "अपनी सांस्कृतिक प्रस्तुतियों, प्राप्त पूछताछ और सरकारी अनुपालन का प्रबंधन करें।"
                  : "Manage your cultural listings, incoming traveller enquiries, and compliance."}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard/compliance"
                className="tap-target inline-flex items-center gap-1.5 px-3.5 py-2 journal-paper hover:bg-warm/60 border border-rule rounded-xs text-xs font-mono uppercase tracking-wider text-text transition-colors tactile-button"
              >
                <FileCheck className="w-3.5 h-3.5 text-forest" />
                <span>{isHindi ? "फार्म सी / अनुपालन" : "Statutory Compliance"}</span>
              </Link>
              <Link
                href="/experiences/new"
                className="tap-target inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xs text-xs font-mono uppercase tracking-wider font-semibold shadow-xs transition-colors tactile-button"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? "नया अनुभव सूचीबद्ध करें" : "List New Experience"}</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Listing 1 */}
            <div className="journal-paper border border-rule rounded-sm p-5 shadow-xs space-y-4">
              <div className="relative w-full h-36 rounded-xs overflow-hidden bg-warm border border-rule">
                <Image
                  src="/images/exp-mithila-art.jpg"
                  alt="Mithila Folk Painting"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-emerald-800 text-white shadow-xs">
                  {isHindi ? "सक्रिय" : "Active"}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-base font-medium text-text">
                  {isHindi ? "मिथिला चित्रकला कार्यशाला" : "Mithila Painting Workshop"}
                </h3>
                <p className="text-xs text-secondary mt-0.5 font-mono">
                  {isHindi ? "२.५ घंटे • अधिकतम ६ प्रतिभागी" : "2.5 Hours • Max 6 participants"}
                </p>
              </div>
              <div className="pt-2 border-t border-rule flex items-center justify-between text-xs font-mono">
                <Link
                  href="/dashboard/experiences"
                  className="text-forest hover:underline font-medium"
                >
                  {isHindi ? "समय सारणी बदलें" : "Manage Schedules"}
                </Link>
                <span className="text-secondary">4 enquiries</span>
              </div>
            </div>

            {/* Listing 2 */}
            <div className="journal-paper border border-rule rounded-sm p-5 shadow-xs space-y-4">
              <div className="relative w-full h-36 rounded-xs overflow-hidden bg-warm border border-rule">
                <Image
                  src="/images/exp-pond.jpg"
                  alt="Temple Pond Walk"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-amber-800 text-white shadow-xs">
                  {isHindi ? "समीक्षाधीन" : "In Review"}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-base font-medium text-text">
                  {isHindi ? "राज परिसर व तालाब पदयात्रा" : "Raj Complex & Pond Walk"}
                </h3>
                <p className="text-xs text-secondary mt-0.5 font-mono">
                  {isHindi ? "२.० घंटे • दरभंगा नगर" : "2.0 Hours • Darbhanga City"}
                </p>
              </div>
              <div className="pt-2 border-t border-rule flex items-center justify-between text-xs font-mono">
                <Link
                  href="/dashboard/experiences"
                  className="text-forest hover:underline font-medium"
                >
                  {isHindi ? "विवरण देखें" : "View Details"}
                </Link>
                <span className="text-secondary">1 enquiry</span>
              </div>
            </div>

            {/* Compliance Quick Card */}
            <div className="journal-paper border border-rule rounded-sm p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xs bg-forest/10 border border-forest/20 flex items-center justify-center text-forest">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-medium text-text">
                  {isHindi ? "सरकारी अनुपालन एवं फॉर्म सी" : "Statutory Compliance (Form C)"}
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  {isHindi
                    ? "विदेशी अतिथियों के आगमन के २४ घंटे के भीतर स्थानीय पर्यटन विभाग और बीओआई को सूचित करने का वैधानिक दायित्व।"
                    : "Statutory 24h reporting requirement under the Registration of Foreigners Act 1939."}
                </p>
              </div>

              <Link
                href="/dashboard/compliance"
                className="w-full py-2.5 px-3 journal-paper hover:bg-warm/60 border border-rule rounded-xs text-xs font-mono uppercase tracking-wider text-text text-center transition-colors shadow-xs tactile-button"
              >
                {isHindi ? "अनुपालन रिकॉर्ड खोलें" : "Open Compliance Ledger"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB CONTENT: SAFETY & LIVE CHECK-IN                               */}
      {/* ==================================================================== */}
      {activeTab === "safety" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-xl font-medium text-text">
              {isHindi ? "सुरक्षा, आपातकालीन संपर्क एवं लाइव चेक-इन" : "Safety, Emergency Hotlines & Live Check-in"}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              {isHindi
                ? "आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। सभी मुलाकातें केवल पूर्व-निर्धारित सार्वजनिक स्थानों पर होती हैं।"
                : "Your safety is our top priority. All meetups take place strictly at pre-agreed public spots."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Check-in Widget */}
            <div className="journal-paper border border-rule rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-medium text-text">
                    {isHindi ? "लाइव मुलाक़ात चेक-इन" : "Live Meetup Check-In"}
                  </h3>
                  <p className="text-xs text-secondary">
                    {isHindi ? "अपने साथी और सुरक्षा दल को अपनी स्थिति बताएं" : "Share your immediate status with emergency support"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-secondary block font-medium">
                  {isHindi ? "वर्तमान स्थिति चुनें:" : "Select your current status:"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckInStatus("safe")}
                    className={`p-2.5 rounded-xs border text-xs font-mono transition-all tactile-button ${
                      checkInStatus === "safe"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-800 dark:text-emerald-200 shadow-xs font-semibold"
                        : "border-rule hover:bg-warm/60 text-secondary"
                    }`}
                  >
                    {isHindi ? "सुरक्षित पहुंच गया" : "Safely Arrived"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInStatus("in_transit")}
                    className={`p-2.5 rounded-xs border text-xs font-mono transition-all tactile-button ${
                      checkInStatus === "in_transit"
                        ? "bg-amber-50 dark:bg-amber-950/50 border-amber-600 text-amber-800 dark:text-amber-200 shadow-xs font-semibold"
                        : "border-rule hover:bg-warm/60 text-secondary"
                    }`}
                  >
                    {isHindi ? "मार्ग में हूँ" : "In Transit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInStatus("need_help")}
                    className={`p-2.5 rounded-xs border text-xs font-mono transition-all tactile-button ${
                      checkInStatus === "need_help"
                        ? "bg-red-50 dark:bg-red-950/50 border-red-600 text-red-800 dark:text-red-200 shadow-xs font-semibold"
                        : "border-rule hover:bg-warm/60 text-secondary"
                    }`}
                  >
                    {isHindi ? "सहायता चाहिए" : "Need Help"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCheckInSubmitted(true)}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xs text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-xs tactile-button"
              >
                {checkInSubmitted ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    {isHindi ? "चेक-इन दर्ज हो चुका है" : "Check-In Logged"}
                  </span>
                ) : (
                  <span>{isHindi ? "चेक-इन अपडेट करें" : "Update Check-In"}</span>
                )}
              </button>

              {checkInSubmitted && (
                <p className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {isHindi
                      ? "आपकी स्थिति सुरक्षित रूप से दर्ज कर ली गई है। सुरक्षा निगरानी सक्रिय है।"
                      : "Your status has been securely logged with timestamp. Safety watch is active."}
                  </span>
                </p>
              )}
            </div>

            {/* Emergency Hotline Strip */}
            <div className="journal-paper border border-rule rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-700 dark:text-red-300 shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-medium text-text">
                    {isHindi ? "आधिकारिक भारतीय आपातकालीन नंबर" : "Official Indian Emergency Hotlines"}
                  </h3>
                  <p className="text-xs text-secondary">
                    {isHindi ? "बिना सिम कार्ड के भी निःशुल्क उपलब्ध" : "Toll-free 24x7 government emergency assistance"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 font-mono">
                <a
                  href="tel:112"
                  className="flex items-center justify-between p-3 journal-paper hover:bg-red-50/60 dark:hover:bg-red-950/30 border border-rule rounded-xs text-xs transition-colors group tactile-button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-red-700 text-sm">112</span>
                    <span className="text-text font-medium font-body">
                      {isHindi ? "राष्ट्रीय आपातकालीन सहायता प्रणाली (ERSS)" : "National Emergency Response (All Emergencies)"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary group-hover:text-red-700" />
                </a>

                <a
                  href="tel:1091"
                  className="flex items-center justify-between p-3 journal-paper hover:bg-red-50/60 dark:hover:bg-red-950/30 border border-rule rounded-xs text-xs transition-colors group tactile-button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-terracotta text-sm">1091</span>
                    <span className="text-text font-medium font-body">
                      {isHindi ? "महिला सुरक्षा हेल्पलाइन" : "Women Safety & Protection Helpline"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary group-hover:text-terracotta" />
                </a>

                <a
                  href="tel:1363"
                  className="flex items-center justify-between p-3 journal-paper hover:bg-forest/10 border border-rule rounded-xs text-xs transition-colors group tactile-button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-forest text-sm">1363</span>
                    <span className="text-text font-medium font-body">
                      {isHindi ? "पर्यटन मंत्रालय बहुभाषी हेल्पलाइन" : "Ministry of Tourism Multi-Lingual Tourist Helpline"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary group-hover:text-forest" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB CONTENT: SAVED EXPERIENCES                                    */}
      {/* ==================================================================== */}
      {activeTab === "saved" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-xl font-medium text-text">
              {isHindi ? "सहेजे गए सांस्कृतिक अनुभव" : "Saved Cultural Experiences"}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              {isHindi
                ? "जिन्हें आप अपनी आगामी यात्रा में शामिल करना चाहते हैं।"
                : "Heritage sessions and artisan workshops saved to your cultural wishlist."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Item 1 */}
            <div className="journal-paper border border-rule rounded-sm overflow-hidden shadow-xs hover:shadow-card transition-all group">
              <div className="relative w-full h-44 bg-warm border-b border-rule">
                <Image
                  src="/images/exp-mithila-art.jpg"
                  alt="Mithila Painting"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta">
                  {isHindi ? "लोक चित्रकला • जितवारपुर" : "Folk Painting • Jitwarpur"}
                </span>
                <h3 className="font-heading text-base font-medium text-text group-hover:text-primary transition-colors">
                  {isHindi ? "पारंपरिक मिथिला चित्रकला कार्यशाला" : "Mithila Painting Workshop"}
                </h3>
                <Link
                  href="/experiences/exp-mithila-art"
                  className="inline-flex items-center gap-1 text-xs text-forest hover:underline pt-2 font-mono font-medium"
                >
                  <span>{isHindi ? "पूछताछ करें" : "Enquire & Book"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Item 2 */}
            <div className="journal-paper border border-rule rounded-sm overflow-hidden shadow-xs hover:shadow-card transition-all group">
              <div className="relative w-full h-44 bg-warm border-b border-rule">
                <Image
                  src="/images/exp-makhana.jpg"
                  alt="Makhana Harvest"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest">
                  {isHindi ? "जल कृषि • केवटी" : "Wetland Harvest • Keoti"}
                </span>
                <h3 className="font-heading text-base font-medium text-text group-hover:text-primary transition-colors">
                  {isHindi ? "मखाना जल कृषि एवं तालाब संस्कृति" : "Sacred Wetland & Makhana Harvest"}
                </h3>
                <Link
                  href="/experiences/exp-makhana-culture"
                  className="inline-flex items-center gap-1 text-xs text-forest hover:underline pt-2 font-mono font-medium"
                >
                  <span>{isHindi ? "पूछताछ करें" : "Enquire & Book"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Item 3 */}
            <div className="journal-paper border border-rule rounded-sm overflow-hidden shadow-xs hover:shadow-card transition-all group">
              <div className="relative w-full h-44 bg-warm border-b border-rule">
                <Image
                  src="/images/exp-cuisine.jpg"
                  alt="Culinary Traditions"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta">
                  {isHindi ? "पारंपरिक खान-पान • रांटी" : "Culinary Heritage • Ranti"}
                </span>
                <h3 className="font-heading text-base font-medium text-text group-hover:text-primary transition-colors">
                  {isHindi ? "पारंपरिक मैथिली पाक कला व भोजन" : "Maithili Culinary Heritage"}
                </h3>
                <Link
                  href="/experiences/exp-maithili-cuisine"
                  className="inline-flex items-center gap-1 text-xs text-forest hover:underline pt-2 font-mono font-medium"
                >
                  <span>{isHindi ? "पूछताछ करें" : "Enquire & Book"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
