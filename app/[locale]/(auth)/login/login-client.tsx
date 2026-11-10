"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, Mail, Phone, ArrowRight, AlertCircle, Info, Loader2 } from "lucide-react";
import { signInWithGoogleFirebase, isFirebaseConfigured } from "@/lib/auth/firebase";
import { requestOtpAction, verifyOtpAction } from "@/app/actions/onboarding";
import { OtpInput } from "@/components/ui/otp-input";

export function LoginClient() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const router = useRouter();

  const isHindi = locale === "hi";

  // Auth form states
  const [otpChannel, setOtpChannel] = useState<"mobile" | "email">("mobile");
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);

  // Status and feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devSimulationActive, setDevSimulationActive] = useState(!isFirebaseConfigured());

  // Handle Google Firebase Authentication
  const handleGoogleSignIn = async () => {
    if (!isAdultConfirmed) {
      setErrorMessage(
        isHindi
          ? "प्रवेश करने से पहले १८ वर्ष या अधिक आयु की पुष्टि करना आवश्यक है।"
          : "You must confirm you are 18 years of age or older before continuing."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithGoogleFirebase();

      if (!result.success || !result.user) {
        setErrorMessage(
          result.error ||
            (isHindi
              ? "गूगल प्रमाणीकरण पूरा नहीं हो सका। कृपया पुनः प्रयास करें।"
              : "Unable to complete Google sign-in. Please try again.")
        );
        setIsLoading(false);
        return;
      }

      if (result.isDevSimulation) {
        setDevSimulationActive(true);
      }

      // Sync session to server
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
              ? "सत्र प्रारंभ करने में त्रुटि। कृपया पुनः प्रयास करें।"
              : "Failed to establish user session. Please try again.")
        );
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        isHindi
          ? `नमस्ते, ${result.user.displayName || "अतिथि"}! आपका स्वागत है।`
          : `Welcome, ${result.user.displayName || "Guest"}! Redirecting to dashboard...`
      );

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch {
      setErrorMessage(
        isHindi
          ? "एक अप्रत्याशित त्रुटि उत्पन्न हुई। कृपया पुनः प्रयास करें।"
          : "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  // Handle Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(
        isHindi
          ? otpChannel === "mobile"
            ? "कृपया अपना मोबाइल नंबर दर्ज करें।"
            : "कृपया अपना ईमेल पता दर्ज करें।"
          : otpChannel === "mobile"
          ? "Please enter your 10-digit mobile number."
          : "Please enter your email address."
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtpAction(identifier, otpChannel);
      if (!result.success) {
        setErrorMessage(result.error || "Failed to dispatch verification code.");
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setSuccessMessage(
        result.message ||
          (isHindi
            ? "सत्यापन कोड भेज दिया गया है।"
            : "Verification code sent successfully.")
      );
      setIsLoading(false);
    } catch {
      setErrorMessage("Unable to send verification code. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode;
    if (code.length !== 6) {
      setErrorMessage(
        isHindi
          ? "कृपया ६ अंकों का सत्यापन कोड दर्ज करें।"
          : "Please enter the full 6-digit verification code."
      );
      return;
    }

    if (!isAdultConfirmed) {
      setErrorMessage(
        isHindi
          ? "प्रवेश करने से पहले १८ वर्ष या अधिक आयु की पुष्टि करना आवश्यक है।"
          : "You must confirm you are 18 years of age or older before continuing."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const verifyResult = await verifyOtpAction(identifier, code, otpChannel);
      if (!verifyResult.success) {
        setErrorMessage(verifyResult.error || "Incorrect verification code.");
        setIsLoading(false);
        return;
      }

      // Sync session to server via Google/Session endpoint
      const syncResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: "otp_" + identifier.replace(/[^a-zA-Z0-9]/g, ""),
          email: otpChannel === "email" ? identifier.trim().toLowerCase() : `${identifier.replace(/\D/g, "")}@phone.atithidevobhava.in`,
          displayName: identifier.split("@")[0] || "Verified Member",
          isAdultConfirmed: true,
        }),
      });

      const syncData = await syncResponse.json();
      if (!syncResponse.ok || !syncData.success) {
        setErrorMessage("Session creation failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        isHindi ? "सत्यापन सफल! आगे बढ़ रहे हैं..." : "Verification successful! Redirecting..."
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch {
      setErrorMessage("Verification failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Brand & Editorial Heading */}
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
          {t("loginTitle")}
        </h1>
        <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
          {t("loginSubtitle")}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-surface border border-rule rounded-sm p-6 sm:p-8 shadow-sm">
        {/* Development Mode Notice (When Firebase credentials not configured) */}
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
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-sm flex items-start gap-2 text-xs text-red-800 dark:text-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" strokeWidth={1.75} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-sm flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" strokeWidth={1.75} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Primary Action: Google Firebase Sign-In Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
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
            <span>{isLoading ? t("signingIn") : t("continueWithGoogle")}</span>
          </button>
        </div>

        {/* Visual Rule Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rule" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-3 text-secondary font-medium">
              {t("orOtp")}
            </span>
          </div>
        </div>

        {/* OTP Authentication Alternative */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Channel Tabs: Mobile vs Email */}
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-page border border-rule rounded-sm text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setOtpChannel("mobile");
                  setIdentifier("");
                }}
                className={`py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                  otpChannel === "mobile"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-text"
                }`}
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{t("mobileTab")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpChannel("email");
                  setIdentifier("");
                }}
                className={`py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                  otpChannel === "email"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-text"
                }`}
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{t("emailTab")}</span>
              </button>
            </div>

            {/* Input field */}
            <div>
              <label
                htmlFor="auth-identifier"
                className="block text-xs font-medium text-text mb-1"
              >
                {otpChannel === "mobile"
                  ? isHindi
                    ? "भारतीय मोबाइल नंबर"
                    : "Indian Mobile Number"
                  : isHindi
                  ? "ईमेल पता"
                  : "Email Address"}
              </label>

              {otpChannel === "mobile" ? (
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-medium text-secondary">
                    +91
                  </span>
                  <input
                    id="auth-identifier"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    disabled={isLoading}
                    className="w-full pl-12 pr-3 py-2 text-sm bg-page border border-rule rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-muted"
                  />
                </div>
              ) : (
                <input
                  id="auth-identifier"
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm bg-page border border-rule rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-muted"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-text hover:bg-neutral-800 text-surface dark:text-neutral-900 dark:bg-neutral-100 rounded-sm text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t("sendCode")}</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs text-secondary">
                {isHindi ? "सत्यापन कोड भेजा गया:" : "Verification code sent to:"}{" "}
                <strong className="text-text">{identifier}</strong>
              </span>
            </div>

            <div className="flex justify-center py-2">
              <OtpInput
                length={6}
                value={otpCode}
                onChange={setOtpCode}
                onComplete={(code) => handleVerifyOtp(code)}
                disabled={isLoading}
                lang={locale}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otpCode.length !== 6}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-sm text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t("verifyAndLogin")}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode("");
                }}
                disabled={isLoading}
                className="px-3 py-2.5 border border-rule text-secondary hover:text-text rounded-sm text-xs transition-colors"
              >
                {isHindi ? "बदलें" : "Change"}
              </button>
            </div>
          </div>
        )}

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
          {t("noAccount")}{" "}
          <Link
            href="/onboarding"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>{t("joinCommunity")}</span>
            <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </p>
      </div>
    </div>
  );
}
