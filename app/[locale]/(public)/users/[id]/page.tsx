import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getLocalById } from "@/lib/data/pilot-locals";
import {
  sanitizeLocalProfile,
  type RawLocalProfile,
} from "@/lib/profile/sanitizer";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";

interface UserProfilePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const local = getLocalById(id);

  if (!local) {
    return { title: "Profile Not Found | Atithi Devo Bhava" };
  }

  const name = locale === "hi" ? local.displayNameHi : local.displayName;
  return {
    title: `${name} | ${local.districtName} - Atithi Devo Bhava`,
    description: `Connect with ${name} in ${local.districtName}. Local hospitality and cultural conversations.`,
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { locale, id } = await params;
  const local = getLocalById(id);

  if (!local) {
    notFound();
  }

  // Convert pilot local to RawLocalProfile for sanitizer
  const rawProfile: RawLocalProfile = {
    id: local.id,
    userId: "usr_" + local.id,
    legalFullName: local.displayName + " (Private Legal Name)",
    displayName: local.displayName,
    email: "private_email@atithidevobhava.in",
    mobile: "+919876543210",
    stateId: local.stateId,
    districtId: local.districtId,
    stateName: "Bihar",
    districtName: local.districtName,
    localityCentroid: local.locality,
    languages: local.languages,
    interests: local.interests,
    bio: locale === "hi" ? local.bioHi : local.bioEn,
    meetupPreferences: local.meetupTypes,
    preferredPublicMeetingSpots:
      locale === "hi" ? local.preferredPublicSpotHi : local.preferredPublicSpotEn,
    availability: "Flexible mornings and weekends",
    profileVisibility: "members_only",
    emailVerified: true,
    mobileVerified: true,
    communityVouched: true,
    memberSince: local.memberSince,
  };

  // Viewer simulation: In this public view route, viewer is treated as registered guest or member
  const sanitized = sanitizeLocalProfile(rawProfile, "simulated_member_session");
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono tracking-wider uppercase text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "मुखपृष्ठ" : "Dispatch"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li>
            <Link href="/explore/people" className="hover:text-primary transition-colors">
              {isHindi ? "स्थानीय नागरिक" : "Meet a Local"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? local.displayNameHi : local.displayName}
          </li>
        </ol>
      </nav>

      {/* Profile Header */}
      <header className="journal-paper p-6 sm:p-7 border border-rule rounded-sm shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-terracotta font-mono">
                {isHindi ? "स्थानीय निवासी प्रोफ़ाइल" : "Local Resident Profile"}
              </span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-xs text-secondary font-mono">
                {isHindi ? `सदस्यता: ${local.memberSince}` : `Member since ${local.memberSince}`}
              </span>
            </div>

            <Bi
              hindi={local.displayNameHi}
              english={local.displayName}
              as="h1"
              className="text-2xl sm:text-3xl font-heading font-medium text-text mb-1"
            />

            <p className="text-xs text-secondary font-mono">
              {isHindi ? local.localityHi : local.locality} •{" "}
              {isHindi ? local.districtNameHi : local.districtName}
            </p>

            {/* Verification Badges */}
            <div className="pt-2 flex flex-wrap gap-2 items-center">
              {sanitized.verification.mobileVerified && (
                <span className="text-[11px] px-2 py-0.5 bg-forest/10 text-forest border border-forest/30 rounded-xs font-mono font-medium flex items-center gap-1">
                  <Check size={12} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
                  {isHindi ? "मोबाइल सत्यापित (SMS OTP)" : "Mobile Verified (SMS OTP)"}
                </span>
              )}
              {sanitized.verification.emailVerified && (
                <span className="text-[11px] px-2 py-0.5 bg-warm text-secondary border border-rule rounded-xs font-mono font-medium flex items-center gap-1">
                  <Check size={12} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
                  {isHindi ? "ईमेल सत्यापित" : "Email Verified"}
                </span>
              )}
              {sanitized.verification.communityVouched && (
                <span className="text-[11px] px-2 py-0.5 bg-warm text-secondary border border-rule rounded-xs font-mono font-medium flex items-center gap-1">
                  <Check size={12} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
                  {isHindi ? "समुदाय द्वारा सत्यापित" : "Community Vouched"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href={`/messages/new?recipientId=${local.id}`}
              className="px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-xs text-xs font-mono uppercase tracking-wider text-center transition-all shadow-xs tactile-button"
            >
              {isHindi ? "मुलाकात का अनुरोध भेजें" : "Request Meetup"}
            </Link>
            <span className="text-[11px] font-mono text-secondary text-center">
              {isHindi ? "निःशुल्क सामुदायिक संवाद" : "Free community exchange"}
            </span>
          </div>
        </div>
      </header>

      {/* Restricted Visibility Barrier (If viewer was anonymous and profile is members_only) */}
      {sanitized.isRestricted && (
        <div className="mb-8">
          <Notice variant="default">
            <div className="space-y-2 py-1">
              <h2 className="font-heading text-sm font-medium text-text">
                {isHindi
                  ? "यह प्रोफ़ाइल केवल पंजीकृत सदस्यों के लिए उपलब्ध है"
                  : "Members-Only Profile"}
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "इस स्थानीय सदस्य ने अपनी प्रोफ़ाइल को केवल पंजीकृत सदस्यों के लिए दृश्यमान रखा है। पूर्ण परिचय और रुचियां देखने के लिए कृपया साइन इन करें या नया खाता बनाएं।"
                  : "This resident has designated their profile as visible to registered members only. Please sign in or join to read their full introduction, spoken languages, and meetup preferences."}
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  href="/onboarding"
                  className="tap-target px-4 py-1.5 bg-primary text-white rounded-sm text-xs font-medium"
                >
                  {isHindi ? "सदस्यता लें (Join Free)" : "Join Atithi Devo Bhava"}
                </Link>
              </div>
            </div>
          </Notice>
        </div>
      )}

      {/* Profile Details (Sanitized) */}
      {!sanitized.isRestricted && (
        <div className="space-y-8">
          {/* About / Introduction */}
          <section className="space-y-3">
            <h2 className="font-heading text-base font-medium text-text border-b border-rule pb-2">
              {isHindi ? "परिचय (About)" : "About"}
            </h2>
            <p className="text-sm text-text leading-relaxed">
              {sanitized.bio}
            </p>
          </section>

          {/* Languages & Cultural Interests */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-5 border border-rule rounded-sm journal-paper space-y-3 shadow-xs">
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "बोली जाने वाली भाषाएं" : "Spoken Languages"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sanitized.languages.map((lang) => (
                  <span
                    key={lang}
                    className="clay-pill text-xs font-mono px-3 py-1 text-text"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 border border-rule rounded-sm journal-paper space-y-3 shadow-xs">
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "रुचियां और सांस्कृतिक ज्ञान" : "Interests & Traditions"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sanitized.interests.map((interest) => (
                  <span
                    key={interest}
                    className="clay-pill text-xs font-mono px-3 py-1 text-text"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Public Meeting Point Protocol */}
          <section className="p-6 border border-rule rounded-sm postcard-paper space-y-2.5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary font-mono block">
              {isHindi ? "सुझावित सार्वजनिक मिलन स्थल" : "Suggested Public Meeting Venue"}
            </span>
            <p className="text-sm text-text font-medium font-heading">
              {sanitized.preferredPublicMeetingSpots}
            </p>
            <p className="text-xs text-secondary leading-relaxed font-heading">
              {isHindi
                ? "सुरक्षा नियम: दोनों पक्षों की सुविधा के लिए सभी प्रारंभिक मुलाकातें अनुशंसित सार्वजनिक स्थानों पर आयोजित की जाती हैं। निजी घर का पता कभी भी सार्वजनिक नहीं किया जाता।"
                : "Safety standard: Initial meetings always take place in recommended, open public venues. Exact residential addresses are never made public."}
            </p>
          </section>

          {/* Availability */}
          <section className="text-xs text-secondary">
            <strong className="text-text font-medium">
              {isHindi ? "उपलब्धता: " : "General Availability: "}
            </strong>
            {sanitized.availability}
          </section>
        </div>
      )}
    </div>
  );
}
