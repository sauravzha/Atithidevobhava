"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, AlertCircle, Info, Loader2, Globe2, Home } from "lucide-react";
import { signInWithGoogleFirebase, isFirebaseConfigured } from "@/lib/auth/firebase";

export function RegisterClient({ initialRole }: { initialRole?: string }) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const router = useRouter();

  const isHindi = locale === "hi";

  const [selectedRole, setSelectedRole] = useState<"traveller" | "local">(
    initialRole === "host" || initialRole === "local" ? "local" : "traveller"
  );
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devSimulationActive, setDevSimulationActive] = useState(!isFirebaseConfigured());
  const [isFirebaseConsoleSetupNeeded, setIsFirebaseConsoleSetupNeeded] = useState(false);

  const handleGoogleSignUp = async (options?: { forceSimulation?: boolean }) => {
    if (!isAdultConfirmed) {
      setErrorMessage(
        isHindi
          ? "पंजीकरण के लिए १८ वर्ष या अधिक आयु की पुष्टि करना आवश्यक है।"
          : "You must confirm you are 18 years of age or older before registering."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithGoogleFirebase(undefined, options);

      if (!result.success || !result.user) {
        if (
          result.errorCode === "auth/configuration-not-found" ||
          result.errorCode === "auth/operation-not-allowed" ||
          result.errorCode === "auth/unauthorized-domain"
        ) {
          setIsFirebaseConsoleSetupNeeded(true);
        }
        setErrorMessage(
          result.error ||
            (isHindi
              ? "गूगल प्रमाणीकरण पूरा नहीं हो सका। कृपया पुनः प्रयास करें।"
              : "Unable to complete Google registration. Please try again.")
        );
        setIsLoading(false);
        return;
      }

      setIsFirebaseConsoleSetupNeeded(false);
      if (result.isDevSimulation) {
        setDevSimulationActive(true);
      }

      // Sync user profile session
      const syncResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoUrl: result.user.photoURL,
          idToken: result.idToken,
          isAdultConfirmed: true,
        }),
      });

      const syncData = await syncResponse.json();

      if (!syncResponse.ok || !syncData.success) {
        setErrorMessage(
          syncData.error ||
            (isHindi
              ? "सत्र प्रारंभ करने में त्रुटि।"
              : "Failed to establish registration session.")
        );
        setIsLoading(false);
        return;
      }

      // Route to onboarding wizard to finalize profile
      router.push(`/onboarding?role=${selectedRole}`);
    } catch {
      setErrorMessage(
        isHindi
          ? "एक अप्रत्याशित त्रुटि उत्पन्न हुई। कृपया पुनः प्रयास करें।"
          : "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group mb-4">
          <Image
            src="/images/logo.png"
            alt="Atithi Devo Bhava - अतिथि देवो भवः"
            width={240}
            height={82}
            priority
            className="h-12 w-auto mx-auto object-contain transition-transform duration-150 group-hover:scale-[1.02] dark:brightness-110"
          />
        </Link>
        <h1 className="font-heading text-2xl font-medium text-text mb-2">
          {isHindi ? "अतिथि देवो भवः से जुड़ें" : "Join Atithi Devo Bhava"}
        </h1>
        <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
          {isHindi
            ? "सम्मान, गरिमा और पारस्परिक सहमति के साथ भारत की जीवित परंपराओं से जुड़ें।"
            : "Connect with living Indian cultural traditions founded on mutual dignity and safety."}
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-surface border border-rule rounded-sm p-6 sm:p-8 shadow-sm">
        {/* Development Mode Notice */}
        {devSimulationActive && (
          <div className="mb-6 p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-sm flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="font-medium">{t("devModeNotice")}</p>
              <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                {t("devModeDescription")}
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-sm text-xs text-red-800 dark:text-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" strokeWidth={1.75} />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>

            {isFirebaseConsoleSetupNeeded && (
              <div className="mt-3 pt-3 border-t border-red-200/80 dark:border-red-800/60 space-y-2">
                <a
                  href="https://console.firebase.google.com/project/studio-5645738071-b5b38/authentication"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>{isHindi ? "गूगल साइन-इन सक्षम करने के लिए फायरबेस कंसोल खोलें" : "Open Firebase Console to enable Google Sign-In"}</span>
                  <ArrowRight className="w-3 h-3" strokeWidth={2} />
                </a>
                <button
                  type="button"
                  onClick={() => handleGoogleSignUp({ forceSimulation: true })}
                  className="w-full py-2 px-3 bg-surface hover:bg-page border border-rule rounded-sm text-xs font-medium text-text transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>{isHindi ? "सिमुलेशन मोड से खाता बनाएं" : "Register with Development Simulation"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Selection Segment */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
            {isHindi ? "आप किस रूप में जुड़ना चाहते हैं?" : "How would you like to participate?"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("traveller")}
              className={`p-3.5 border rounded-sm text-left transition-all ${
                selectedRole === "traveller"
                  ? "border-primary bg-primary/5 text-text ring-1 ring-primary"
                  : "border-rule bg-page text-secondary hover:text-text"
              }`}
            >
              <Globe2 className="w-4 h-4 mb-2 text-primary" strokeWidth={1.75} />
              <div className="text-xs font-medium text-text mb-0.5">
                {isHindi ? "यात्री" : "Traveller"}
              </div>
              <div className="text-[11px] text-secondary">
                {isHindi ? "संस्कृति और लोगों से मिलें" : "Visiting India"}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("local")}
              className={`p-3.5 border rounded-sm text-left transition-all ${
                selectedRole === "local"
                  ? "border-primary bg-primary/5 text-text ring-1 ring-primary"
                  : "border-rule bg-page text-secondary hover:text-text"
              }`}
            >
              <Home className="w-4 h-4 mb-2 text-primary" strokeWidth={1.75} />
              <div className="text-xs font-medium text-text mb-0.5">
                {isHindi ? "स्थानीय निवासी / मेज़बान" : "Local Host"}
              </div>
              <div className="text-[11px] text-secondary">
                {isHindi ? "अपनी परंपरा साझा करें" : "Resident in India"}
              </div>
            </button>
          </div>
        </div>

        {/* Primary Action: Google Registration */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleGoogleSignUp()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm shadow-sm text-sm font-medium text-text transition-colors duration-150 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
            <span>
              {isLoading
                ? t("signingIn")
                : isHindi
                ? "गूगल के साथ खाता बनाएं"
                : "Register with Google"}
            </span>
          </button>
        </div>

        {/* Visual Rule Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rule" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-secondary font-medium">
              {isHindi ? "या फॉर्म भरकर पंजीकरण करें" : "Or register using form"}
            </span>
          </div>
        </div>

        {/* Continue to Detailed Onboarding Form */}
        <Link
          href={`/onboarding?role=${selectedRole}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rule hover:border-primary text-text rounded-sm text-xs font-medium uppercase tracking-wider transition-colors"
        >
          <span>{isHindi ? "विस्तृत फॉर्म भरें" : "Complete Registration Form"}</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>

        {/* 18+ Adult Confirmation Checkbox */}
        <div className="mt-6 pt-5 border-t border-rule">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isAdultConfirmed}
              onChange={(e) => setIsAdultConfirmed(e.target.checked)}
              className="mt-0.5 rounded-sm border-rule text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-[11px] text-secondary leading-snug">
              {t("adultDeclaration")}
            </span>
          </label>
        </div>
      </div>

      {/* Safety & Legal Notices */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-[11px] text-secondary">
          {t("termsNotice")}{" "}
          <Link href="/terms" className="underline hover:text-primary">
            {isHindi ? "सेवा की शर्तें" : "Terms"}
          </Link>{" "}
          &bull;{" "}
          <Link href="/privacy" className="underline hover:text-primary">
            {isHindi ? "गोपनीयता नीति" : "Privacy"}
          </Link>
        </p>

        <p className="text-xs text-secondary">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>{t("loginButton")}</span>
            <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </p>
      </div>
    </div>
  );
}
