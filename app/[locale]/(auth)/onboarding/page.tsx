"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";
import { OtpInput } from "@/components/ui/otp-input";
import {
  OFFICIAL_STATES,
  getDistricts,
  type DistrictData,
} from "@/lib/location/data";
import {
  requestOtpAction,
  verifyOtpAction,
  submitTravellerProfileAction,
  submitLocalProfileAction,
} from "@/app/actions/onboarding";

type RoleOption = "traveller" | "local" | "host" | "stay_host";

interface OnboardingDraft {
  selectedRoles: RoleOption[];
  email: string;
  mobile: string;
  fullName: string;
  displayName: string;
  countryOfResidence: string;
  preferredLanguage: string;
  bio: string;
  interests: string[];
  intendedTravelPeriod: string;
  birthYear: number;
  isAdult: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedSafetyAgreement: boolean;
  trustedContactEmail: string;
  stateId: string;
  districtId: string;
  locality: string;
  languages: string[];
  meetupPreferences: Array<"tea" | "market_walk" | "language_exchange" | "area_tour">;
  preferredPublicMeetingSpots: string;
  availability: string;
  profileVisibility: "public" | "members_only";
}

const INITIAL_DRAFT: OnboardingDraft = {
  selectedRoles: ["traveller"],
  email: "",
  mobile: "",
  fullName: "",
  displayName: "",
  countryOfResidence: "United States",
  preferredLanguage: "en",
  bio: "",
  interests: ["village-life", "art-and-handicrafts"],
  intendedTravelPeriod: "",
  birthYear: 1995,
  isAdult: true,
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedSafetyAgreement: false,
  trustedContactEmail: "",
  stateId: "st-br",
  districtId: "dst-darbhanga",
  locality: "Lalbagh, near Raj Compound",
  languages: ["English", "Hindi"],
  meetupPreferences: ["tea", "market_walk"],
  preferredPublicMeetingSpots: "Central Clock Tower square café",
  availability: "Weekends and flexible weekday mornings",
  profileVisibility: "members_only",
};

export default function OnboardingPage() {
  const locale = useLocale();
  const isHindi = locale === "hi";

  // Multi-step progress (Steps 1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingDraft>(INITIAL_DRAFT);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // OTP state
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Restore draft from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("atithi_onboarding_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Local storage unreadable in strict privacy mode; continue with defaults
    }
    setIsDraftLoaded(true);
  }, []);

  // Save as draft handler
  const handleSaveDraft = () => {
    try {
      localStorage.setItem("atithi_onboarding_draft", JSON.stringify(formData));
      setOtpNotice(
        isHindi
          ? "आपका विवरण सुरक्षित सहेज लिया गया है। आप बाद में आकर इसे पूरा कर सकते हैं।"
          : "Draft saved locally. You can resume anytime without losing progress."
      );
    } catch {
      // Ignore storage errors
    }
  };

  const handleRoleToggle = (role: RoleOption) => {
    setFormData((prev) => {
      const exists = prev.selectedRoles.includes(role);
      const updated = exists
        ? prev.selectedRoles.filter((r) => r !== role)
        : [...prev.selectedRoles, role];
      return { ...prev, selectedRoles: updated.length > 0 ? updated : [role] };
    });
  };

  const isLocalRole =
    formData.selectedRoles.includes("local") ||
    formData.selectedRoles.includes("host") ||
    formData.selectedRoles.includes("stay_host");

  const districts: DistrictData[] = getDistricts(formData.stateId);

  // Dispatch OTP
  const handleRequestEmailOtp = async () => {
    setOtpError(null);
    setOtpNotice(null);
    if (!formData.email || !formData.email.includes("@")) {
      setOtpError(
        isHindi
          ? "कृपया एक वैध ईमेल पता दर्ज करें।"
          : "Please enter a valid email address."
      );
      return;
    }
    const res = await requestOtpAction(formData.email, "email");
    if (res.success) {
      setOtpNotice(
        isHindi
          ? "6 अंकों का सत्यापन कोड आपके ईमेल पर भेजा गया है। (परीक्षण कोड: 123456)"
          : "A 6-digit verification code has been dispatched to your email. (Test code: 123456)"
      );
    } else {
      setOtpError(res.error || "Failed to dispatch code.");
    }
  };

  const handleVerifyEmailOtp = async () => {
    setOtpError(null);
    setOtpNotice(null);
    if (emailOtp.length !== 6) {
      setOtpError(
        isHindi
          ? "कृपया 6 अंकों का कोड पूरा दर्ज करें।"
          : "Please enter the complete 6-digit code."
      );
      return;
    }
    const res = await verifyOtpAction(formData.email, emailOtp, "email");
    if (res.success) {
      setEmailVerified(true);
      setOtpNotice(
        isHindi ? "ईमेल सफलतापूर्वक सत्यापित हुआ।" : "Email verified successfully."
      );
    } else {
      setOtpError(res.error || "Incorrect code.");
    }
  };

  const handleRequestMobileOtp = async () => {
    setOtpError(null);
    setOtpNotice(null);
    if (!formData.mobile || formData.mobile.length < 10) {
      setOtpError(
        isHindi
          ? "कृपया 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }
    const res = await requestOtpAction(formData.mobile, "mobile");
    if (res.success) {
      setOtpNotice(
        isHindi
          ? "6 अंकों का ओटीपी आपके मोबाइल पर भेजा गया है। (परीक्षण कोड: 123456)"
          : "A 6-digit SMS OTP has been dispatched to your mobile. (Test code: 123456)"
      );
    } else {
      setOtpError(res.error || "Failed to dispatch SMS.");
    }
  };

  const handleVerifyMobileOtp = async () => {
    setOtpError(null);
    setOtpNotice(null);
    if (mobileOtp.length !== 6) {
      setOtpError(
        isHindi
          ? "कृपया 6 अंकों का ओटीपी पूरा दर्ज करें।"
          : "Please enter the complete 6-digit OTP."
      );
      return;
    }
    const res = await verifyOtpAction(formData.mobile, mobileOtp, "mobile");
    if (res.success) {
      setMobileVerified(true);
      setOtpNotice(
        isHindi ? "मोबाइल नंबर सफलतापूर्वक सत्यापित हुआ।" : "Mobile number verified successfully."
      );
    } else {
      setOtpError(res.error || "Incorrect code.");
    }
  };

  // Submission handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate 18+ check
    const currentYear = new Date().getFullYear();
    if (currentYear - formData.birthYear < 18) {
      setValidationError(
        isHindi
          ? "पंजीकरण केवल 18 वर्ष या उससे अधिक आयु के वयस्कों के लिए है।"
          : "Registration is strictly restricted to adults aged 18 years or older."
      );
      return;
    }

    if (!formData.acceptedTerms || !formData.acceptedPrivacy || !formData.acceptedSafetyAgreement) {
      setValidationError(
        isHindi
          ? "जारी रखने के लिए कृपया सभी शर्तों, नीतियों और सुरक्षा समझौते को स्वीकार करें।"
          : "Please accept the Terms, Privacy Policy, and Safety Agreement to complete registration."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLocalRole) {
        await submitLocalProfileAction({
          legalFullName: formData.fullName,
          displayName: formData.displayName,
          email: formData.email,
          mobile: formData.mobile,
          stateId: formData.stateId,
          districtId: formData.districtId,
          locality: formData.locality,
          languages: formData.languages,
          interests: formData.interests,
          bio: formData.bio || "Resident welcoming visitors to share local heritage and conversations.",
          meetupPreferences: formData.meetupPreferences,
          preferredPublicMeetingSpots: formData.preferredPublicMeetingSpots,
          availability: formData.availability,
          profileVisibility: formData.profileVisibility,
          birthYear: formData.birthYear,
          isAdult: true,
          acceptedTerms: true,
          acceptedPrivacy: true,
          acceptedSafetyAgreement: true,
        });
      } else {
        await submitTravellerProfileAction({
          fullName: formData.fullName,
          displayName: formData.displayName,
          email: formData.email,
          countryOfResidence: formData.countryOfResidence,
          preferredLanguage: formData.preferredLanguage,
          bio:
            formData.bio.length >= 150
              ? formData.bio
              : "I am an independent traveler visiting India, eager to meet local residents, explore historical crafts, and learn about regional traditions through respectful conversations.",
          interests: formData.interests,
          intendedTravelPeriod: formData.intendedTravelPeriod,
          preferredDestinations: [],
          birthYear: formData.birthYear,
          isAdult: true,
          acceptedTerms: true,
          acceptedPrivacy: true,
          acceptedSafetyAgreement: true,
          trustedContactEmail: formData.trustedContactEmail,
        });
      }

      // Clear draft upon successful completion
      try {
        localStorage.removeItem("atithi_onboarding_draft");
      } catch {}

      setSubmissionSuccess(true);
    } catch {
      setValidationError(
        isHindi
          ? "पंजीकरण पूरा करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Unable to complete registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDraftLoaded) {
    return <div className="site-container py-12 text-sm text-secondary">Loading registration...</div>;
  }

  // Completion Success Screen
  if (submissionSuccess) {
    return (
      <div className="site-container py-16 max-w-xl mx-auto text-center space-y-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-forest block">
          {isHindi ? "पंजीकरण सफल" : "Registration Received"}
        </span>
        <Bi
          hindi="अतिथि देवो भव में आपका स्वागत है"
          english="Welcome to Atithi Devo Bhava"
          as="h1"
          className="mb-2"
        />
        <p className="text-sm text-secondary leading-relaxed">
          {isHindi
            ? "आपकी प्रोफ़ाइल सुरक्षित रूप से दर्ज कर ली गई है। यदि यह ईमेल पहले से पंजीकृत था, तो हमने खाते के स्वामी को सूचना भेज दी है।"
            : "Your registration details have been received. If this email address was previously registered, a notification has been sent to the verified owner."}
        </p>

        <div className="p-5 border border-rule bg-warm/20 rounded-sm text-xs text-secondary text-left space-y-2">
          <div>
            <strong className="text-text">{isHindi ? "प्रदर्शन नाम: " : "Display Name: "}</strong>
            {formData.displayName || formData.fullName}
          </div>
          <div>
            <strong className="text-text">{isHindi ? "सत्यापित ईमेल: " : "Verified Email: "}</strong>
            {formData.email}
          </div>
          <div>
            <strong className="text-text">{isHindi ? "गोपनीयता स्तर: " : "Privacy Status: "}</strong>
            {formData.profileVisibility === "members_only"
              ? isHindi
                ? "केवल पंजीकृत सदस्यों को दृश्य (डिफ़ॉल्ट)"
                : "Visible to registered members only (Default)"
              : isHindi
              ? "सार्वजनिक"
              : "Public"}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/explore"
            className="tap-target px-6 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
          >
            {isHindi ? "समुदाय का अन्वेषण करें" : "Explore Community"}
          </Link>
          <Link
            href="/"
            className="tap-target px-6 py-2.5 border border-rule hover:border-primary text-text rounded-sm text-xs font-medium transition-colors"
          >
            {isHindi ? "होम पर जाएं" : "Return to Home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container py-12 max-w-2xl mx-auto">
      {/* Header and Text Progress Line */}
      <header className="border-b border-rule pb-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Text progress line per Section 5 */}
          <span className="text-xs font-mono font-medium text-terracotta uppercase tracking-wider">
            {isHindi ? `चरण ${currentStep} / 5` : `Step ${currentStep} of 5`}
          </span>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-xs text-secondary hover:text-text underline"
          >
            {isHindi ? "ड्राफ़्ट सहेजें (Save as Draft)" : "Save as draft"}
          </button>
        </div>

        <Bi
          hindi="समुदाय में शामिल हों"
          english="Join Atithi Devo Bhava"
          as="h1"
          className="mb-2"
        />

        <p className="text-xs text-secondary">
          {isHindi
            ? "सम्मानजनक, गैर-व्यावसायिक आतिथ्य और सांस्कृतिक संवाद का मंच।"
            : "A restrained, human platform for cultural hospitality and genuine community exchange."}
        </p>
      </header>

      {/* Notices */}
      {otpNotice && (
        <div className="mb-6">
          <Notice variant="default">
            <p className="text-xs">{otpNotice}</p>
          </Notice>
        </div>
      )}

      {otpError && (
        <div className="mb-6">
          <Notice variant="warning">
            <p className="text-xs">{otpError}</p>
          </Notice>
        </div>
      )}

      {validationError && (
        <div className="mb-6">
          <Notice variant="warning">
            <p className="text-xs">{validationError}</p>
          </Notice>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: Role Selection ("How would you like to experience India?")        */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-medium text-text mb-1">
              {isHindi ? "आप भारत का अनुभव कैसे करना चाहते हैं?" : "How would you like to experience India?"}
            </h2>
            <p className="text-xs text-secondary">
              {isHindi
                ? "आप एक से अधिक भूमिकाएं चुन सकते हैं। आप बाद में अपने डैशबोर्ड से भूमिकाएं बदल सकते हैं।"
                : "Select all that apply. You can switch between active roles within your unified dashboard."}
            </p>
          </div>

          <div className="space-y-3">
            {/* Option 1: Traveller */}
            <label
              className={`p-4 border rounded-sm flex items-start gap-3 cursor-pointer transition-colors ${
                formData.selectedRoles.includes("traveller")
                  ? "border-primary bg-warm/30"
                  : "border-rule hover:border-rule/80"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedRoles.includes("traveller")}
                onChange={() => handleRoleToggle("traveller")}
                className="mt-0.5"
              />
              <div>
                <span className="font-heading text-sm font-medium text-text block">
                  {isHindi ? "मैं भारत की यात्रा पर हूँ (I am visiting India)" : "I am visiting India."}
                </span>
                <span className="text-xs text-secondary block mt-0.5">
                  {isHindi
                    ? "स्थानीय निवासियों से मिलें, सांस्कृतिक अनुभवों में भाग लें।"
                    : "Meet verified locals for tea or neighbourhood walks, enquire about cultural sessions."}
                </span>
              </div>
            </label>

            {/* Option 2: Local resident */}
            <label
              className={`p-4 border rounded-sm flex items-start gap-3 cursor-pointer transition-colors ${
                formData.selectedRoles.includes("local")
                  ? "border-primary bg-warm/30"
                  : "border-rule hover:border-rule/80"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedRoles.includes("local")}
                onChange={() => handleRoleToggle("local")}
                className="mt-0.5"
              />
              <div>
                <span className="font-heading text-sm font-medium text-text block">
                  {isHindi ? "मैं एक स्थानीय निवासी हूँ (I am a local resident)" : "I am a local resident."}
                </span>
                <span className="text-xs text-secondary block mt-0.5">
                  {isHindi
                    ? "सार्वजनिक स्थानों पर चाय या सैर के लिए आगंतुकों से मिलें। निशुल्क और लचीला।"
                    : "Meet visitors in public places for conversation, tea, or language exchange. Free and flexible."}
                </span>
              </div>
            </label>

            {/* Option 3: Experience Host */}
            <label
              className={`p-4 border rounded-sm flex items-start gap-3 cursor-pointer transition-colors ${
                formData.selectedRoles.includes("host")
                  ? "border-primary bg-warm/30"
                  : "border-rule hover:border-rule/80"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedRoles.includes("host")}
                onChange={() => handleRoleToggle("host")}
                className="mt-0.5"
              />
              <div>
                <span className="font-heading text-sm font-medium text-text block">
                  {isHindi ? "मैं सांस्कृतिक अनुभव आयोजित करना चाहता हूँ (I want to host experiences)" : "I want to host experiences."}
                </span>
                <span className="text-xs text-secondary block mt-0.5">
                  {isHindi
                    ? "पारंपरिक पाककला, शिल्प, संगीत या धरोहर वॉक का संचालन करें। (चरण 1 में केवल पूछताछ)"
                    : "Share regional culinary craft, traditional painting, music, or heritage walks."}
                </span>
              </div>
            </label>

            {/* Option 4: Stay Host (Phase 3 Preliminary) */}
            <label
              className={`p-4 border rounded-sm flex items-start gap-3 cursor-pointer transition-colors ${
                formData.selectedRoles.includes("stay_host")
                  ? "border-primary bg-warm/30"
                  : "border-rule hover:border-rule/80"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedRoles.includes("stay_host")}
                onChange={() => handleRoleToggle("stay_host")}
                className="mt-0.5"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm font-medium text-text">
                    {isHindi ? "मैं आवास की पेशकश करना चाहता हूँ" : "I want to offer accommodation."}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-200 rounded-sm">
                    {isHindi ? "चरण 3" : "Phase 3"}
                  </span>
                </div>
                <span className="text-xs text-secondary block mt-0.5">
                  {isHindi
                    ? "पारिवारिक होमस्टे। सुरक्षा और विदेशी अतिथि नियमों (फॉर्म-सी) के तहत चरण 3 में खुलेगा।"
                    : "Residential homestays. Preliminary registration under Phase 3 compliance guidelines."}
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "आगे बढ़ें (Next Step)" : "Continue to Verification"} →
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: Identity & Verification (Email OTP & Indian Mobile SMS OTP)       */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-medium text-text mb-1">
              {isHindi ? "सत्यापन एवं संपर्क" : "Identity & Security Verification"}
            </h2>
            <p className="text-xs text-secondary">
              {isHindi
                ? "हम आपकी सुरक्षा और समुदाय की विश्वसनीयता के लिए ईमेल और मोबाइल का सत्यापन करते हैं। हम कभी भी आधार संख्या या पासपोर्ट स्कैन नहीं मांगते।"
                : "Why we verify: Authentic two-way verification protects both parties. We never ask for Aadhaar or passport scans."}
            </p>
          </div>

          {/* Email Verification */}
          <div className="p-5 border border-rule rounded-sm bg-page space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "ईमेल पता *" : "Email Address *"}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={emailVerified}
                  placeholder="traveller@example.com"
                  className="flex-1 px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary disabled:opacity-60"
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleRequestEmailOtp}
                    className="tap-target px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
                  >
                    {isHindi ? "ओटीपी भेजें" : "Send Code"}
                  </button>
                )}
              </div>
            </div>

            {!emailVerified ? (
              <div className="pt-2">
                <label className="block text-xs text-secondary mb-2">
                  {isHindi ? "ईमेल पर प्राप्त 6 अंकों का कोड दर्ज करें:" : "Enter 6-digit code received via email:"}
                </label>
                <div className="flex items-center gap-3">
                  <OtpInput
                    length={6}
                    value={emailOtp}
                    onChange={setEmailOtp}
                    onComplete={handleVerifyEmailOtp}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
                  >
                    {isHindi ? "सत्यापित करें" : "Verify"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-forest font-medium flex items-center gap-1.5">
                <Check size={14} className="text-forest shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {isHindi ? "ईमेल सत्यापित हो चुका है।" : "Email address verified."}
              </div>
            )}
          </div>

          {/* Mobile SMS OTP for Locals */}
          {isLocalRole && (
            <div className="p-5 border border-rule rounded-sm bg-page space-y-4">
              <div>
                <label htmlFor="mobile" className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "भारतीय मोबाइल नंबर (SMS OTP) *" : "Indian Mobile Number (SMS OTP) *"}
                </label>
                <p className="text-[11px] text-secondary mb-2">
                  {isHindi
                    ? "स्थानीय सदस्यों के लिए मोबाइल सत्यापन अनिवार्य है। आपका नंबर केवल दोनों पक्षों की आपसी सहमति पर ही दिखता है।"
                    : "Why we need your mobile: SMS OTP verification is mandatory for local hosts. Your number is revealed only upon mutual consent."}
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-2 border border-rule bg-warm/30 rounded-sm text-xs font-mono text-secondary flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    disabled={mobileVerified}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                  {!mobileVerified && (
                    <button
                      type="button"
                      onClick={handleRequestMobileOtp}
                      className="tap-target px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
                    >
                      {isHindi ? "ओटीपी भेजें" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {!mobileVerified ? (
                <div className="pt-2">
                  <label className="block text-xs text-secondary mb-2">
                    {isHindi ? "मोबाइल पर प्राप्त 6 अंकों का ओटीपी दर्ज करें:" : "Enter 6-digit SMS OTP:"}
                  </label>
                  <div className="flex items-center gap-3">
                    <OtpInput
                      length={6}
                      value={mobileOtp}
                      onChange={setMobileOtp}
                      onComplete={handleVerifyMobileOtp}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyMobileOtp}
                      className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
                    >
                      {isHindi ? "सत्यापित करें" : "Verify"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-forest font-medium flex items-center gap-1.5">
                  <Check size={14} className="text-forest shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {isHindi ? "मोबाइल नंबर सत्यापित हो चुका है।" : "Mobile number verified."}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-secondary hover:text-text"
            >
              ← {isHindi ? "पिछला चरण" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "आगे बढ़ें (Next: Profile)" : "Continue to Profile Details"} →
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: Profile Details & 150+ Character Bio                             */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-medium text-text mb-1">
              {isHindi ? "व्यक्तिगत विवरण और परिचय" : "Profile Details & Introduction"}
            </h2>
            <p className="text-xs text-secondary">
              {isLocalRole
                ? isHindi
                  ? "आपका कानूनी नाम निजी रहेगा। सार्वजनिक रूप से केवल आपका प्रदर्शन नाम (Display Name) दिखाई देगा।"
                  : "Your legal full name remains strictly private. Only your chosen display name appears on your public profile."
                : isHindi
                ? "यात्रियों के लिए 150+ अक्षरों का परिचय अनिवार्य है ताकि स्थानीय लोग आपके इरादे को समझ सकें।"
                : "Travellers write a 150+ character introduction explaining your background, cultural interests, and travel purpose."}
            </p>
          </div>

          <div className="space-y-4">
            {/* Full legal name (private for locals) */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-text mb-1">
                {isLocalRole
                  ? isHindi ? "कानूनी पूरा नाम (निजी रखा जाएगा) *" : "Full Legal Name (Private & Non-public) *"
                  : isHindi ? "पूरा नाम *" : "Full Name *"}
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Amarnath Mishra"
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
              />
            </div>

            {/* Display name */}
            <div>
              <label htmlFor="displayName" className="block text-xs font-medium text-text mb-1">
                {isHindi ? "प्रदर्शन नाम (सार्वजनिक प्रोफ़ाइल नाम) *" : "Display Name (Public Name) *"}
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Amarnath M."
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-secondary mt-1">
                {isHindi
                  ? "यह नाम अन्य सदस्यों को दिखेगा। अपना उपनाम या पहला नाम रख सकते हैं।"
                  : "This is how other members see your profile. You may use a first name or pseudonym."}
              </p>
            </div>

            {/* Country or Location */}
            {!isLocalRole ? (
              <div>
                <label htmlFor="country" className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "निवास का देश *" : "Country of Residence *"}
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.countryOfResidence}
                  onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                  placeholder="e.g. United Kingdom, Germany, Japan"
                  className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-text mb-1">
                    {isHindi ? "राज्य या केंद्र शासित प्रदेश *" : "State / Union Territory *"}
                  </label>
                  <select
                    id="state"
                    value={formData.stateId}
                    onChange={(e) => {
                      const newDistricts = getDistricts(e.target.value);
                      setFormData({
                        ...formData,
                        stateId: e.target.value,
                        districtId: newDistricts[0]?.id || "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                  >
                    {OFFICIAL_STATES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isHindi ? s.nameHi : s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="district" className="block text-xs font-medium text-text mb-1">
                    {isHindi ? "जिला *" : "District *"}
                  </label>
                  <select
                    id="district"
                    value={formData.districtId}
                    onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                    className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isHindi ? d.nameHi : d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Introduction (Bio) with counter */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="bio" className="block text-xs font-medium text-text">
                  {isHindi ? "परिचय (Introduction) *" : "Introduction / Bio *"}
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    formData.bio.length < (!isLocalRole ? 150 : 100)
                      ? "text-terracotta"
                      : "text-forest font-semibold"
                  }`}
                >
                  {formData.bio.length} / {!isLocalRole ? "150+ chars required" : "100+ chars required"}
                </span>
              </div>
              <textarea
                id="bio"
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder={
                  !isLocalRole
                    ? isHindi
                      ? "अपने बारे में विस्तार से बताएं: आप भारत क्यों आ रहे हैं, किन कलाओं और परंपराओं में आपकी रुचि है, और आप स्थानीय लोगों से क्या सीखना चाहते हैं (कम से कम 150 अक्षर)..."
                      : "Share your background, cultural interests, why you are visiting India, and what you hope to experience through respectful local conversations (minimum 150 characters)..."
                    : isHindi
                    ? "अपने शहर, दैनिक दिनचर्या और स्थानीय संस्कृति के बारे में बताएं जो आप आगंतुकों से साझा करना चाहते हैं (कम से कम 100 अक्षर)..."
                    : "Describe your neighbourhood, daily routine, and cultural aspects you enjoy sharing with respectful visitors (minimum 100 characters)..."
                }
                className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-secondary hover:text-text"
            >
              ← {isHindi ? "पिछला चरण" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "आगे बढ़ें (Next: Preferences)" : "Continue to Preferences"} →
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: Preferences, Public Venues & Visibility                           */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-medium text-text mb-1">
              {isHindi ? "मिलन स्थल और दृश्यता नियंत्रण" : "Public Venues & Visibility Controls"}
            </h2>
            <p className="text-xs text-secondary">
              {isHindi
                ? "सार्वजनिक बैठक नियम: सभी प्रारंभिक मुलाकातें खुले सार्वजनिक स्थानों पर आयोजित की जाती हैं।"
                : "Public meeting protocol: First meetings are always held in open, suggested public locations."}
            </p>
          </div>

          {isLocalRole ? (
            <div className="space-y-4">
              {/* Preferred Public Meeting Venue */}
              <div>
                <label htmlFor="publicSpot" className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "सुझावित सार्वजनिक मिलन स्थल *" : "Suggested Public Meeting Area *"}
                </label>
                <input
                  type="text"
                  id="publicSpot"
                  value={formData.preferredPublicMeetingSpots}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredPublicMeetingSpots: e.target.value })
                  }
                  placeholder="e.g. Sanskrit University central lawn café, Town Hall square"
                  className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-secondary mt-1">
                  {isHindi
                    ? "यह एक खुला और जाना-पहचाना सार्वजनिक स्थान होना चाहिए, कभी भी आपका निजी आवास नहीं।"
                    : "Must be a recognized, visible public location (café, library, central square), never a private home."}
                </p>
              </div>

              {/* Profile Visibility Control (Default: members_only) */}
              <div className="p-4 border border-rule bg-warm/20 rounded-sm space-y-2">
                <span className="text-xs font-semibold text-text block">
                  {isHindi ? "प्रोफ़ाइल दृश्यता (Profile Visibility)" : "Profile Visibility Control"}
                </span>
                <p className="text-xs text-secondary">
                  {isHindi
                    ? "सुरक्षा और गोपनीयता के लिए, आपकी प्रोफ़ाइल डिफ़ॉल्ट रूप से केवल सत्यापित पंजीकृत सदस्यों को ही दिखाई देती है।"
                    : "By default, your profile is set to 'Members Only' so only registered, verified users can browse your details."}
                </p>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="members_only"
                      checked={formData.profileVisibility === "members_only"}
                      onChange={() => setFormData({ ...formData, profileVisibility: "members_only" })}
                    />
                    <strong>{isHindi ? "केवल सदस्य (Members Only - अनुशंसित)" : "Members Only (Recommended)"}</strong>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.profileVisibility === "public"}
                      onChange={() => setFormData({ ...formData, profileVisibility: "public" })}
                    />
                    <span>{isHindi ? "सार्वजनिक (Public)" : "Public"}</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="travelPeriod" className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "प्रस्तावित यात्रा अवधि" : "Intended Travel Period"}
                </label>
                <input
                  type="text"
                  id="travelPeriod"
                  value={formData.intendedTravelPeriod}
                  onChange={(e) => setFormData({ ...formData, intendedTravelPeriod: e.target.value })}
                  placeholder="e.g. November - December 2026"
                  className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="trustedContact" className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "विश्वस्त संपर्क ईमेल (वैकल्पिक सुरक्षा सुविधा)" : "Trusted Contact Email (Optional Safety Field)"}
                </label>
                <input
                  type="email"
                  id="trustedContact"
                  value={formData.trustedContactEmail}
                  onChange={(e) => setFormData({ ...formData, trustedContactEmail: e.target.value })}
                  placeholder="family-or-friend@example.com"
                  className="w-full px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-secondary mt-1">
                  {isHindi
                    ? "मुलाकात के समय आप अपने विश्वस्त संपर्क को अपनी यात्रा की जानकारी साझा कर सकते हैं।"
                    : "Allows you to share your scheduled meetup status with a family member or friend."}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs text-secondary hover:text-text"
            >
              ← {isHindi ? "पिछला चरण" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="tap-target px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "आगे बढ़ें (Next: Legal & Safety)" : "Continue to Safety Agreement"} →
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: 18+ Confirmation, Legal Consent & Safety Agreement               */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-medium text-text mb-1">
              {isHindi ? "वयस्क पुष्टि, सहमति एवं सुरक्षा समझौता" : "Adult Age, Consent & Safety Agreement"}
            </h2>
            <p className="text-xs text-secondary">
              {isHindi
                ? "अंतिम चरण: हमारी सुरक्षा नीतियों और वयस्क नियमों की पुष्टि करें।"
                : "Final step: Confirm adult status and statutory compliance under Indian law."}
            </p>
          </div>

          {/* 18+ Birth Year Selector */}
          <div className="p-4 border border-rule rounded-sm bg-page space-y-2">
            <label htmlFor="birthYear" className="block text-xs font-medium text-text">
              {isHindi ? "जन्म वर्ष (Birth Year) *" : "Birth Year *"}
            </label>
            <p className="text-[11px] text-secondary">
              {isHindi
                ? "हम आपकी आयु की पुष्टि केवल 18+ नियम के लिए करते हैं। आपकी जन्म तिथि सार्वजनिक नहीं की जाती।"
                : "Why we ask: Atithi Devo Bhava is strictly for adults (18+). Minors are not permitted as registered users."}
            </p>
            <input
              type="number"
              id="birthYear"
              value={formData.birthYear}
              onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value, 10) || 1990 })}
              min={1920}
              max={new Date().getFullYear() - 18}
              className="w-32 px-3 py-2 border border-rule rounded-sm text-sm bg-page focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 text-xs text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAdult}
                onChange={(e) => setFormData({ ...formData, isAdult: e.target.checked })}
                required
                className="mt-0.5"
              />
              <span>
                <strong className="text-text">
                  {isHindi ? "मैं पुष्टि करता हूँ कि मेरी आयु 18 वर्ष या उससे अधिक है। *" : "I confirm that I am 18 years of age or older. *"}
                </strong>
              </span>
            </label>

            <label className="flex items-start gap-3 text-xs text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptedTerms}
                onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                required
                className="mt-0.5"
              />
              <span>
                {isHindi ? "मैंने " : "I agree to the "}
                <Link href="/terms" target="_blank" className="text-primary underline">
                  {isHindi ? "सेवा की शर्तें" : "Terms of Service"}
                </Link>
                {isHindi ? " पढ़ी हैं और स्वीकार करता हूँ। *" : " and Community Code of Conduct. *"}
              </span>
            </label>

            <label className="flex items-start gap-3 text-xs text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptedPrivacy}
                onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                required
                className="mt-0.5"
              />
              <span>
                {isHindi ? "मैंने " : "I agree to the "}
                <Link href="/privacy" target="_blank" className="text-primary underline">
                  {isHindi ? "गोपनीयता नीति (DPDP अधिनियम 2023)" : "Privacy Policy (DPDP Act 2023)"}
                </Link>
                {isHindi ? " पढ़ी है और डेटा न्यूनीकरण स्वीकार करता हूँ। *" : " and data minimization principles. *"}
              </span>
            </label>

            <label className="flex items-start gap-3 text-xs text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptedSafetyAgreement}
                onChange={(e) => setFormData({ ...formData, acceptedSafetyAgreement: e.target.checked })}
                required
                className="mt-0.5"
              />
              <span>
                <strong className="text-text">
                  {isHindi
                    ? "सार्वजनिक बैठक सुरक्षा समझौता: *"
                    : "Public Venue Safety Agreement: *"}
                </strong>{" "}
                {isHindi
                  ? "मैं सहमत हूँ कि पहली मुलाकात हमेशा सार्वजनिक स्थान पर होगी और कोई अग्रिम नकद मांग नहीं की जाएगी।"
                  : "I agree that initial encounters must always take place in recommended public venues and no off-platform advance cash will be requested."}
              </span>
            </label>
          </div>

          <div className="pt-6 border-t border-rule flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs text-secondary hover:text-text"
            >
              ← {isHindi ? "पिछला चरण" : "Back"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="tap-target px-6 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? isHindi ? "सत्यापन जारी..." : "Submitting..."
                : isHindi ? "पंजीकरण पूर्ण करें" : "Complete Registration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
