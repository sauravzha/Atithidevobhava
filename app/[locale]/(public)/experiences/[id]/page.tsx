import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
  Camera,
} from "lucide-react";

interface ExperiencePageProps {
  params: Promise<{ locale: string; id: string }>;
}

const EXPERIENCE_IMAGES: Record<string, { src: string; caption: string; tag: string; tagHi: string }> = {
  "exp-br-01": {
    src: "/images/exp-mithila-art.jpg",
    caption: "Master artisan drawing intricate Kohbar motifs using natural pigments on handmade Lokta paper in Jitwarpur",
    tag: "National Award Artisan Heritage",
    tagHi: "राष्ट्रीय पुरस्कार प्राप्त शिल्पकार",
  },
  "exp-br-02": {
    src: "/images/exp-makhana.jpg",
    caption: "Harvesting fresh gorgon nut pods from the pristine temple wetlands of Darbhanga before traditional wood-fire roasting",
    tag: "GI Tag Wetland Agriculture",
    tagHi: "जी.आई. टैग आर्द्रभूमि कृषि",
  },
  "exp-br-03": {
    src: "/images/exp-folk-music.jpg",
    caption: "Dhrupad recital and microtonal voice demonstration within the historic Shyama Kali temple precinct",
    tag: "400-Year Mallick Gharana Tradition",
    tagHi: "400 वर्ष पुरानी मल्लिक घराना परंपरा",
  },
  "exp-br-04": {
    src: "/images/exp-cuisine.jpg",
    caption: "Artisans splitting wild golden river grass and coiling ceremonial baskets using the traditional Takua needle",
    tag: "Women Artisan Craft Collective",
    tagHi: "महिला शिल्प सहकारी समूह",
  },
};

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

  const exp: ExperienceListing | undefined = PILOT_EXPERIENCES.find(
    (e) => e.id === id || e.slug === id
  );

  if (!exp) {
    notFound();
  }

  const imgData = EXPERIENCE_IMAGES[exp.id] || {
    src: "/images/exp-mithila-art.jpg",
    caption: "Living cultural heritage of Mithila, Northern Bihar",
    tag: "Verified Heritage Immersion",
    tagHi: "सत्यापित सांस्कृतिक सत्र",
  };

  return (
    <div className="site-container py-10 sm:py-16">
      {/* Editorial Breadcrumb */}
      <nav className="text-xs font-mono tracking-wider uppercase text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "मुखपृष्ठ" : "Dispatch"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              {isHindi ? "अन्वेषण" : "Field Directory"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li>
            <Link href="/explore/experiences" className="hover:text-primary transition-colors">
              {isHindi ? "अनुभव" : "Living Crafts"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium truncate max-w-xs" aria-current="page">
            {isHindi ? exp.titleHi : exp.titleEn}
          </li>
        </ol>
      </nav>

      {/* Hero Visual Frame with Documentary Image */}
      <div className="mb-10 journal-paper border border-rule rounded-sm overflow-hidden">
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full bg-warm/30">
          <Image
            src={imgData.src}
            alt={exp.titleEn}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent pointer-events-none" />

          {/* Stamp Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-primary">
              {isHindi ? imgData.tagHi : imgData.tag}
            </span>
          </div>

          {/* Photo Caption */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white max-w-2xl flex items-start gap-2 text-xs font-heading">
            <Camera className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-80" />
            <span className="opacity-90">{imgData.caption}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details, Right Column Enquiry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-8">
          {/* Header & Category */}
          <header className="border-b border-rule pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono tracking-wider uppercase px-2.5 py-1 bg-warm border border-rule rounded-xs text-secondary">
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
              className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium text-text leading-tight"
            />

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary pt-2">
              <span className="flex items-center gap-1.5 text-text font-medium">
                <MapPin size={14} className="text-terracotta" />
                {isHindi ? exp.districtNameHi : exp.districtName}, {isHindi ? "बिहार" : "Bihar"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-secondary" />
                {isHindi ? exp.durationHi : exp.durationEn}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-secondary" />
                {isHindi ? `अधिकतम ${exp.maxParticipants} प्रतिभागी` : `Up to ${exp.maxParticipants} guests`}
              </span>
            </div>
          </header>

          {/* Host Profile Card */}
          <section className="journal-paper p-6 border border-rule rounded-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-secondary block">
                  {isHindi ? "सांस्कृतिक सूत्रधार और मेजबान" : "Cultural Facilitator & Host"}
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-medium text-text">
                    {isHindi ? exp.hostNameHi : exp.hostName}
                  </h2>
                  <VerificationLabel label={isHindi ? "पहचान जाँची गई" : "Verified Host"} />
                </div>
                <p className="text-xs text-secondary font-mono">
                  {isHindi ? exp.hostRoleHi : exp.hostRoleEn} • {isHindi ? exp.districtNameHi : exp.districtName}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-secondary bg-surface p-2 rounded-sm border border-rule">
                <Languages size={14} className="text-primary" />
                <span>{(isHindi ? exp.languagesHi : exp.languages).join(", ")}</span>
              </div>
            </div>
          </section>

          {/* General Meeting Point & Safety */}
          <section className="journal-paper p-6 border border-rule rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-text font-medium text-sm font-heading">
              <MapPin size={16} className="text-primary" />
              <span>{isHindi ? "सामान्य सार्वजनिक मिलन स्थल" : "General Public Meeting Area"}</span>
            </div>
            <p className="text-xs sm:text-sm text-text font-mono">
              {isHindi ? exp.generalAreaHi : exp.generalAreaEn}
            </p>
            <p className="text-[11px] text-secondary leading-relaxed bg-warm/40 p-3 rounded-sm border border-rule">
              {isHindi
                ? "सार्वजनिक सुरक्षा नियम: पहली मुलाकात हमेशा प्रतिष्ठित सार्वजनिक नागरिक स्थानों पर तय की जाती है। निजी आवासीय पते कभी सार्वजनिक रूप से प्रदर्शित नहीं होते।"
                : "Public Venue Standard: Initial sessions convene strictly at vetted public landmarks. Precise coordinates are coordinated directly upon mutual confirmation."}
            </p>
          </section>

          {/* Detailed Description */}
          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-text border-b border-rule pb-3">
              {isHindi ? "अनुभव का पूर्ण विवरण" : "Field Narrative & Immersion"}
            </h2>
            <p className="text-base text-secondary leading-relaxed whitespace-pre-line font-heading">
              {isHindi ? exp.descriptionHi : exp.descriptionEn}
            </p>
          </section>

          {/* Highlights */}
          {exp.highlightsEn && exp.highlightsEn.length > 0 && (
            <section className="journal-paper p-6 border border-rule rounded-sm space-y-4">
              <h2 className="font-heading text-lg font-medium text-text border-b border-rule/60 pb-2">
                {isHindi ? "कार्यशाला के मुख्य पहलू" : "Immersion Highlights"}
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-text">
                {(isHindi ? exp.highlightsHi : exp.highlightsEn).map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={16} className="text-forest mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Included and Excluded */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="journal-paper p-5 border border-rule rounded-sm space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase text-forest tracking-wider">
                {isHindi ? "सत्र में शामिल" : "Included in Session"}
              </h3>
              <ul className="space-y-2 text-xs text-secondary">
                {(isHindi ? exp.includedHi : exp.includedEn).map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-forest shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="journal-paper p-5 border border-rule rounded-sm space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase text-terracotta tracking-wider">
                {isHindi ? "शामिल नहीं" : "Not Included"}
              </h3>
              <ul className="space-y-2 text-xs text-secondary">
                <li className="flex items-center gap-2">
                  <X size={14} className="text-terracotta shrink-0" />
                  <span>{isHindi ? "मिलन स्थल तक निजी वाहन" : "Private transport to meeting point"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <X size={14} className="text-terracotta shrink-0" />
                  <span>{isHindi ? "व्यक्तिगत खरीदारी" : "Personal purchases or souvenirs"}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cancellation Policy & Safety */}
          <section className="space-y-3 pt-2">
            <h2 className="font-heading text-xl font-medium text-text border-b border-rule pb-2">
              {isHindi ? "रद्दीकरण नीति और तैयारी" : "Cancellation & Modesty Standards"}
            </h2>
            <div className="text-xs sm:text-sm text-secondary space-y-2 leading-relaxed font-heading">
              <p>
                <span className="font-medium text-text">
                  {isHindi ? "समयबद्धता: " : "Advance Notice: "}
                </span>
                {isHindi
                  ? "कृपया सत्र से कम से कम 24 घंटे पूर्व अपने सूत्रधार को सूचित करें यदि आपको कार्यक्रम में बदलाव करना हो।"
                  : "Please inform your host at least 24 hours prior to scheduled meeting time if you need to reschedule."}
              </p>
              <p>
                <span className="font-medium text-text">
                  {isHindi ? "सांस्कृतिक शिष्टाचार: " : "Cultural Etiquette: "}
                </span>
                {isHindi
                  ? "आरामदायक सूती वस्त्र और चलने योग्य जूते पहनें। पारिवारिक आंगन और मंदिर परिसरों में स्थानीय मर्यादा का सम्मान करें।"
                  : "Modest cotton attire and walking footwear recommended. Respect family courtyard boundaries and sacred sites."}
              </p>
            </div>
          </section>
        </article>

        {/* Right Column: Enquiry Form & Notice */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Phase 1 Advisory Notice */}
          <Notice variant="warning">
            <strong className="font-semibold block mb-1">
              {isHindi ? "प्रारंभिक चरण: केवल पूछताछ" : "Phase 1: Direct Artisan Enquiry"}
            </strong>
            <p className="text-xs leading-relaxed">
              {isHindi
                ? "अतिथि देवो भवः के प्रारंभिक पायलट चरण में सभी अनुभव पूछताछ आधारित हैं। कोई मूल्य प्रदर्शित नहीं किया गया है और कोई ऑनलाइन भुगतान नहीं लिया जाता।"
                : "During our pilot in Darbhanga and Madhubani, listings operate in non-commercial enquiry mode. Connect directly with verified resident hosts."}
            </p>
          </Notice>

          {/* Interactive Enquiry Form Component */}
          <div className="journal-paper p-6 border border-rule rounded-sm shadow-xs">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>{isHindi ? "सांस्कृतिक संपर्क" : "Direct Engagement"}</span>
            </div>
            <h2 className="font-heading text-xl font-medium text-text mb-4 pb-2 border-b border-rule">
              {isHindi ? "मेजबान से संपर्क करें" : "Enquire with Host"}
            </h2>
            <ExperienceEnquiryForm
              experienceId={exp.id}
              maxParticipants={exp.maxParticipants}
              locale={locale}
            />
          </div>

          {/* Emergency Helpline Banner */}
          <div className="journal-paper p-5 border border-rule rounded-sm text-xs text-secondary space-y-2">
            <span className="font-semibold text-text flex items-center gap-1.5 font-mono uppercase tracking-wider text-[11px]">
              <ShieldCheck size={14} className="text-forest" />
              {isHindi ? "24x7 राष्ट्रीय आपातकालीन हेल्पलाइन" : "National Emergency Support"}
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
              <div>
                <span className="text-primary font-bold">112</span>: {isHindi ? "अखिल भारतीय आपातकालीन" : "All-India Emergency"}
              </div>
              <div>
                <span className="text-forest font-bold">1363</span>: {isHindi ? "पर्यटक हेल्पलाइन" : "Tourist Helpline"}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
