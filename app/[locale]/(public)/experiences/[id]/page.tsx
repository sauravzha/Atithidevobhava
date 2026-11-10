import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PILOT_EXPERIENCES, type ExperienceListing } from "@/lib/data/pilot-experiences";
import { Bi } from "@/components/ui/bi";
import { StatusLabel } from "@/components/ui/status-label";
import { VerificationLabel } from "@/components/ui/verification-label";
import { Notice } from "@/components/ui/notice";
import { ExperienceEnquiryForm } from "./enquiry-form";
import {
  MapPin,
  Clock,
  Users,
  Languages,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

interface ExperiencePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { id } = await params;
  const exp = PILOT_EXPERIENCES.find((e) => e.id === id || e.slug === id);

  if (!exp) {
    return {
      title: "Cultural Experience - Atithi Devo Bhava",
    };
  }

  return {
    title: `${exp.titleEn} | ${exp.titleHi} - Atithi Devo Bhava`,
    description: exp.descriptionEn.slice(0, 160),
  };
}

export default async function ExperienceDetailPage({
  params,
}: ExperiencePageProps) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  // Match experience by id or slug
  const exp: ExperienceListing | undefined = PILOT_EXPERIENCES.find(
    (e) => e.id === id || e.slug === id
  );

  if (!exp) {
    notFound();
  }

  return (
    <div className="site-container py-10">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              {isHindi ? "अन्वेषण" : "Explore"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/explore/experiences" className="hover:text-primary transition-colors">
              {isHindi ? "अनुभव" : "Experiences"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium truncate max-w-xs" aria-current="page">
            {isHindi ? exp.titleHi : exp.titleEn}
          </li>
        </ol>
      </nav>

      {/* Main Grid: Left Column Details, Right Column Enquiry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-8">
          {/* Header & Category */}
          <header className="border-b border-rule pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-warm border border-rule rounded-sm text-secondary">
                {isHindi ? exp.categoryNameHi : exp.categoryNameEn}
              </span>
              <StatusLabel
                status={isHindi ? "चरण 1: पूछताछ केवल" : "Phase 1: Enquiry Only"}
                variant="warning"
              />
            </div>

            <Bi
              hindi={exp.titleHi}
              english={exp.titleEn}
              as="h1"
              className="text-2xl md:text-3xl font-heading font-normal text-text leading-tight"
            />

            <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={1.5} className="text-primary" />
                {isHindi ? exp.districtNameHi : exp.districtName}, {isHindi ? "बिहार" : "Bihar"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.5} className="text-primary" />
                {isHindi ? exp.durationHi : exp.durationEn}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users size={14} strokeWidth={1.5} className="text-primary" />
                {isHindi ? `अधिकतम ${exp.maxParticipants} प्रतिभागी` : `Up to ${exp.maxParticipants} people`}
              </span>
            </div>
          </header>

          {/* Host Profile Card */}
          <section className="p-5 border border-rule rounded-sm bg-warm/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-secondary block">
                  {isHindi ? "सांस्कृतिक सूत्रधार और मेजबान" : "Cultural Facilitator & Host"}
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg font-medium text-text">
                    {isHindi ? exp.hostNameHi : exp.hostName}
                  </h2>
                  <VerificationLabel label={isHindi ? "टीम द्वारा जाँचा गया" : "Identity checked by our team"} />
                </div>
                <p className="text-xs text-secondary">
                  {isHindi ? exp.hostRoleHi : exp.hostRoleEn} • {isHindi ? exp.districtNameHi : exp.districtName}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-secondary">
                <Languages size={14} strokeWidth={1.5} className="text-primary" />
                <span>{(isHindi ? exp.languagesHi : exp.languages).join(", ")}</span>
              </div>
            </div>
          </section>

          {/* General Meeting Point & Safety */}
          <section className="p-5 border border-rule rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-text font-medium text-sm">
              <MapPin size={16} strokeWidth={1.5} className="text-primary" />
              <span>{isHindi ? "सामान्य सार्वजनिक मिलन स्थल" : "General Public Meeting Area"}</span>
            </div>
            <p className="text-xs text-text">
              {isHindi ? exp.generalAreaHi : exp.generalAreaEn}
            </p>
            <p className="text-[11px] text-secondary leading-relaxed bg-warm/30 p-2.5 rounded-sm border border-rule">
              {isHindi
                ? "सुरक्षा नियम: सटीक बैठक स्थल हमेशा सार्वजनिक नागरिक स्थानों पर तय किए जाते हैं। निजी आवासीय पते कभी सार्वजनिक रूप से प्रदर्शित नहीं होते।"
                : "Safety rule: Meeting points are designated at civic public landmarks. Exact coordination is completed directly with your host after enquiry acceptance."}
            </p>
          </section>

          {/* Detailed Description */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-text border-b border-rule pb-2">
              {isHindi ? "अनुभव का विवरण" : "About this Experience"}
            </h2>
            <p className="text-sm text-text leading-relaxed whitespace-pre-line">
              {isHindi ? exp.descriptionHi : exp.descriptionEn}
            </p>
          </section>

          {/* Highlights */}
          {exp.highlightsEn && exp.highlightsEn.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
                {isHindi ? "मुख्य पहलू" : "Experience Elements"}
              </h2>
              <ul className="space-y-2 text-xs text-text">
                {(isHindi ? exp.highlightsHi : exp.highlightsEn).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} strokeWidth={1.5} className="text-forest mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Included and Excluded */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 border border-rule rounded-sm space-y-2">
              <h3 className="text-xs font-semibold uppercase text-text tracking-wider">
                {isHindi ? "शामिल है" : "What is Provided"}
              </h3>
              <ul className="space-y-1.5 text-xs text-secondary">
                {(isHindi ? exp.includedHi : exp.includedEn).map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={12} strokeWidth={1.5} className="text-forest" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border border-rule rounded-sm space-y-2">
              <h3 className="text-xs font-semibold uppercase text-text tracking-wider">
                {isHindi ? "शामिल नहीं" : "Not Included"}
              </h3>
              <ul className="space-y-1.5 text-xs text-secondary">
                <li className="flex items-center gap-2">
                  <X size={12} strokeWidth={1.5} className="text-terracotta" />
                  <span>{isHindi ? "निजी वाहन और यात्रा व्यवस्था" : "Private transport to meeting point"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <X size={12} strokeWidth={1.5} className="text-terracotta" />
                  <span>{isHindi ? "व्यक्तिगत खरीदारी" : "Personal souvenirs or purchases"}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cancellation Policy & Safety */}
          <section className="space-y-3 pt-2">
            <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
              {isHindi ? "रद्दीकरण नीति और सुरक्षा" : "Cancellation & Safety Notes"}
            </h2>
            <div className="text-xs text-secondary space-y-2 leading-relaxed">
              <p>
                <span className="font-medium text-text">
                  {isHindi ? "रद्दीकरण: " : "Cancellation: "}
                </span>
                {isHindi
                  ? "कृपया बैठक से कम से कम 24 घंटे पूर्व अपने सूत्रधार को सूचित करें।"
                  : "Please inform your host at least 24 hours prior to the scheduled meeting time if you need to adjust or withdraw."}
              </p>
              <p>
                <span className="font-medium text-text">
                  {isHindi ? "मौसम और तैयारी: " : "Preparedness: "}
                </span>
                {isHindi
                  ? "आरामदायक सूती वस्त्र और चलने योग्य जूते पहनें। सार्वजनिक शिष्टाचार और सांस्कृतिक मर्यादा का सम्मान करें।"
                  : "Comfortable cotton footwear and modest cultural attire recommended. Please respect local customs."}
              </p>
            </div>
          </section>
        </article>

        {/* Right Column: Enquiry Form & Notice */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Phase 1 Advisory Notice */}
          <Notice variant="warning">
            <strong className="font-semibold block mb-1">
              {isHindi ? "प्रारंभिक चरण: केवल पूछताछ" : "Phase 1: Cultural Enquiry"}
            </strong>
            <p className="text-xs leading-relaxed">
              {isHindi
                ? "अतिथि देवो भवः के प्रारंभिक पायलट चरण में सभी अनुभव पूछताछ आधारित हैं। कोई मूल्य प्रदर्शित नहीं किया गया है और कोई ऑनलाइन भुगतान नहीं लिया जाता।"
                : "During our pilot in Darbhanga and Madhubani, listings operate in enquiry mode. Connect directly with verified resident hosts without payment barriers."}
            </p>
          </Notice>

          {/* Interactive Enquiry Form Component */}
          <div className="p-6 border border-rule rounded-sm bg-page shadow-xs">
            <h2 className="font-heading text-lg font-medium text-text mb-4 pb-2 border-b border-rule">
              {isHindi ? "मेजबान से संपर्क करें" : "Enquire with Host"}
            </h2>
            <ExperienceEnquiryForm
              experienceId={exp.id}
              maxParticipants={exp.maxParticipants}
              locale={locale}
            />
          </div>

          {/* Emergency Helpline Banner */}
          <div className="p-4 border border-rule rounded-sm bg-warm/20 text-xs text-secondary space-y-2">
            <span className="font-semibold text-text flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-primary" />
              {isHindi ? "राष्ट्रीय आपातकालीन हेल्पलाइन" : "National Emergency Support"}
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-text font-medium">112</span>: {isHindi ? "अखिल भारतीय आपातकालीन" : "All-India Emergency"}
              </div>
              <div>
                <span className="text-text font-medium">1363</span>: {isHindi ? "पर्यटक हेल्पलाइन" : "Tourist Helpline"}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
