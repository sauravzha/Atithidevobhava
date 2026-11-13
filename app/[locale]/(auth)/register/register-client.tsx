"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Globe2,
  Home,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { LotusMotif } from "@/components/ui/cultural-patterns";

export function RegisterClient({ initialRole }: { initialRole?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const isHindi = locale === "hi";

  const [selectedRole, setSelectedRole] = useState<"traveller" | "local">(
    initialRole === "host" || initialRole === "local" ? "local" : "traveller"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Firebase Email & Password Registration
  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdultConfirmed) {
      setErrorMessage(
        isHindi
          ? "पंजीकरण के लिए १८ वर्ष या अधिक आयु की पुष्टि करना आवश्यक है।"
          : "You must confirm you are 18 years of age or older before registering."
      );
      return;
    }

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage(
        isHindi
          ? "कृपया नाम, ईमेल और पासवर्ड दर्ज करें।"
          : "Please enter your name, email, and password."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        isHindi
          ? "पासवर्ड कम से कम ८ अक्षरों का होना चाहिए।"
          : "Password must be at least 8 characters long."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await signUpWithEmail(
        email,
        password,
        fullName.trim(),
        selectedRole
      );

      if (!res.success || !res.user) {
        setErrorMessage(res.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        isHindi
          ? `नमस्ते, ${fullName}! आपका खाता बन गया है।`
          : `Welcome, ${fullName}! Your account has been created.`
      );

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch {
      setErrorMessage("An unexpected registration error occurred.");
      setIsLoading(false);
    }
  };

  // 2. Google Registration with Firebase
  const handleGoogleSignUp = async () => {
    if (!isAdultConfirmed) {
      setErrorMessage(
        isHindi
          ? "पंजीकरण के लिए १८ वर्ष या अधिक आयु की पुष्टि करना आवश्यक है।"
          : "You must confirm you are 18 years of age or older before registering."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithGoogle(selectedRole);

      if (!result.success || !result.user) {
        setErrorMessage(result.error || "Unable to complete Google registration. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        isHindi
          ? `नमस्ते, ${result.user.displayName}! आपका पंजीकरण सफल रहा।`
          : `Welcome, ${result.user.displayName}! Registration successful.`
      );

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch {
      setErrorMessage("An unexpected error occurred during Google registration.");
      setIsLoading(false);
    }
  };

  // 3. Fast 1-Click Dev Setup
  const handleQuickRegister = async (role: "traveller" | "local") => {
    setIsLoading(true);
    setErrorMessage(null);

    const devEmail =
      role === "traveller"
        ? `traveller.pilot.${Date.now().toString(36)}@example.com`
        : `host.pilot.${Date.now().toString(36)}@mithila.example.com`;
    const name =
      role === "traveller"
        ? (isHindi ? "नया पंजीकृत यात्री" : "Verified Pilot Traveller")
        : (isHindi ? "नया स्थानीय मेज़बान" : "Verified Pilot Resident");

    try {
      const response = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: devEmail,
          name,
          role: role === "traveller" ? "traveller" : "local_member",
          provider: "demo",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage("Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Registration error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-3">
        <Link href="/" className="inline-block group mb-2">
          <Image
            src="/images/logo.png"
            alt="Atithi Devo Bhava - अतिथि देवो भवः"
            width={240}
            height={82}
            priority
            className="h-12 w-auto mx-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:brightness-110"
          />
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-medium">
          <LotusMotif className="w-3.5 h-3.5 text-forest" />
          <span>{isHindi ? "नया सदस्य पंजीकरण" : "New Member Registration"}</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-text">
          {isHindi ? "अतिथि देवो भवः से जुड़ें" : "Join Atithi Devo Bhava"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto leading-relaxed">
          {isHindi
            ? "सम्मान, गरिमा और पारस्परिक सहमति के साथ भारत की जीवित परंपराओं से जुड़ें।"
            : "Connect with living Indian cultural traditions founded on mutual dignity and safety."}
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="journal-paper border border-rule rounded-sm p-6 sm:p-10 shadow-card space-y-6">
        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xs text-xs text-red-800 dark:text-red-200 flex items-start gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xs text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Role Selector: Traveller vs Local */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-text font-medium">
            {isHindi ? "आप किस रूप में जुड़ना चाहते हैं?" : "How would you like to participate?"}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Traveller Role Choice */}
            <button
              type="button"
              onClick={() => setSelectedRole("traveller")}
              className={`p-3.5 rounded-xs border text-left transition-all duration-150 tactile-button ${
                selectedRole === "traveller"
                  ? "bg-forest/10 border-forest ring-1 ring-forest/30 shadow-xs"
                  : "bg-surface border-rule hover:border-secondary/60 text-secondary"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xs flex items-center justify-center ${
                    selectedRole === "traveller"
                      ? "bg-forest text-white"
                      : "bg-warm border border-rule text-secondary"
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">
                    {isHindi ? "मैं यात्री हूँ" : "I am Visiting"}
                  </p>
                  <p className="text-[10px] text-secondary font-mono">
                    {isHindi ? "संस्कृति अनुभव" : "Explore cultures & meet locals"}
                  </p>
                </div>
              </div>
            </button>

            {/* Local Resident Role Choice */}
            <button
              type="button"
              onClick={() => setSelectedRole("local")}
              className={`p-3.5 rounded-xs border text-left transition-all duration-150 tactile-button ${
                selectedRole === "local"
                  ? "bg-terracotta/10 border-terracotta ring-1 ring-terracotta/30 shadow-xs"
                  : "bg-surface border-rule hover:border-secondary/60 text-secondary"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xs flex items-center justify-center ${
                    selectedRole === "local"
                      ? "bg-terracotta text-white"
                      : "bg-warm border border-rule text-secondary"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">
                    {isHindi ? "मैं स्थानीय निवासी हूँ" : "I am a Local Resident"}
                  </p>
                  <p className="text-[10px] text-secondary font-mono">
                    {isHindi ? "मेज़बानी व कला" : "Host walks, craft & heritage"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Email/Password Registration Form */}
        <form onSubmit={handleEmailPasswordSignUp} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text font-medium">
              {isHindi ? "पूरा नाम" : "Full Name"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Jenkins / Shanti Devi"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pl-10 bg-surface border border-rule rounded-xs text-xs text-text placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body"
              />
              <User className="w-4 h-4 text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text font-medium">
              {isHindi ? "ईमेल पता" : "Email Address"}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pl-10 bg-surface border border-rule rounded-xs text-xs text-text placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body"
              />
              <Mail className="w-4 h-4 text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text font-medium">
              {isHindi ? "पासवर्ड (न्यूनतम ८ अक्षर)" : "Password (min 8 characters)"}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pl-10 bg-surface border border-rule rounded-xs text-xs text-text placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body"
              />
              <Lock className="w-4 h-4 text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          {/* 18+ Adult Age Invariant Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdultConfirmed}
                onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-rule text-forest focus:ring-forest"
              />
              <span className="text-[11px] text-secondary leading-snug">
                {isHindi
                  ? "मैं पुष्टि करता/करती हूँ कि मेरी आयु १८ वर्ष या अधिक है (वयस्क-मात्र मंच)।"
                  : "I confirm I am 18 years of age or older (Adults-only platform requirement)."}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isAdultConfirmed}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-xs shadow-xs text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 disabled:opacity-60 tactile-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isHindi ? "खाता बन रहा है..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <span>{isHindi ? "पंजीकरण पूरा करें" : "Create Account with Email"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Visual Rule Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rule" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-secondary font-mono text-[11px] uppercase tracking-wider">
              {isHindi ? "अथवा गूगल खाते से" : "or register with Google"}
            </span>
          </div>
        </div>

        {/* Google Registration */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading || !isAdultConfirmed}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface hover:bg-warm/70 border border-rule rounded-xs shadow-xs text-xs font-mono uppercase tracking-wider font-semibold text-text transition-all duration-150 disabled:opacity-60 tactile-button"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>{isHindi ? "गूगल से पंजीकरण करें" : "Sign up with Google"}</span>
        </button>

        {/* 1-Click Fast Register (Dev helper) */}
        <div className="space-y-2 pt-2 border-t border-rule/60">
          <div className="flex items-center justify-between text-xs text-secondary">
            <span className="font-mono uppercase tracking-wider text-[11px] font-medium">
              {isHindi ? "त्वरित परीक्षण पंजीकरण:" : "1-Click Fast Registration:"}
            </span>
            <span className="text-[11px] text-forest font-mono font-semibold">Dev Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRegister("traveller")}
              disabled={isLoading}
              className="p-2.5 journal-paper hover:bg-warm/60 border border-rule rounded-xs text-xs font-semibold text-text text-left flex items-center justify-between transition-all shadow-xs group tactile-button"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-forest" />
                <span>{isHindi ? "यात्री (१-क्लिक)" : "Traveller (1-Click)"}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-secondary group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickRegister("local")}
              disabled={isLoading}
              className="p-2.5 journal-paper hover:bg-warm/60 border border-rule rounded-xs text-xs font-semibold text-text text-left flex items-center justify-between transition-all shadow-xs group tactile-button"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>{isHindi ? "मेज़बान (१-क्लिक)" : "Local Host (1-Click)"}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-secondary group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center mt-6 text-xs text-secondary">
        <span>{isHindi ? "क्या आपका खाता पहले से है?" : "Already have an account?"}</span>{" "}
        <Link
          href="/login"
          className="font-semibold text-forest hover:text-forest/80 underline underline-offset-4 ml-1"
        >
          {isHindi ? "यहाँ प्रवेश करें" : "Sign in here"}
        </Link>
      </div>

      {/* Trust Notice */}
      <div className="mt-8 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-forest" />
          <span>
            {isHindi
              ? "डीपीडीपी अधिनियम २०२३ के अंतर्गत शून्य विज्ञापन-ट्रैकर्स एवं कड़े गोपनीयता मानक।"
              : "Zero ad-trackers, DPDP Act 2023 compliance & encrypted session protection."}
          </span>
        </div>
      </div>
    </div>
  );
}
