import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PILOT_LOCALS } from "@/lib/data/pilot-locals";
import { Bi } from "@/components/ui/bi";
import {
  ShieldCheck,
  MapPin,
  Coffee,
  Languages,
  BookOpen,
  ArrowRight,
  Lock,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Meet a Local Resident | स्थानीय निवासियों से मिलें - Atithi Devo Bhava",
  description:
    "Connect with verified Indian residents for tea, walking tours, market visits, and language exchange. Respectful, non-commercial community hospitality.",
};

const LOCAL_PORTRAITS: Record<string, { src: string; caption: string }> = {
  "loc-br-01": {
    src: "/images/hero-artisan.jpg",
    caption: "Retired Sanskrit teacher & Dhrupad historian in Darbhanga",
  },
  "loc-br-02": {
    src: "/images/host-shanti-devi.jpg",
    caption: "Mithila folk artist & cultural custodian in Jitwarpur",
  },
  "loc-br-03": {
    src: "/images/host-rameshwar-jha.jpg",
    caption: "Wetland makhana cultivator & dry-fruit merchant",
  },
  "loc-br-04": {
    src: "/images/exp-cuisine.jpg",
    caption: "Sikki grass craft collective coordinator in Ranti",
  },
  "loc-br-05": {
    src: "/images/exp-folk-music.jpg",
    caption: "Hereditary Dhrupad vocalist of Mallick Gharana",
  },
};

interface PeoplePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    stateId?: string;
    districtId?: string;
    meetupType?: string;
    language?: string;
  }>;
}

export default async function PeopleDirectoryPage({
  params,
  searchParams,
}: PeoplePageProps) {
  const { locale } = await params;
  const { districtId, meetupType, language } = await searchParams;

  let filteredLocals = [...PILOT_LOCALS];

  if (districtId) {
    filteredLocals = filteredLocals.filter((l) => l.districtId === districtId);
  }

  if (meetupType) {
    filteredLocals = filteredLocals.filter((l) =>
      l.meetupTypes.includes(meetupType as any)
    );
  }

  if (language) {
    const langLower = language.toLowerCase();
    filteredLocals = filteredLocals.filter((l) =>
      l.languages.some((lang) => lang.toLowerCase().includes(langLower))
    );
  }

  const isHindi = locale === "hi";

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
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "स्थानीय नागरिक" : "Verified Locals"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-forest mb-3">
              <UserCheck className="w-3.5 h-3.5 text-forest" />
              <span>{isHindi ? "माध्यम 1: स्थानीय नागरिक से मिलें" : "Product A · Human-Centred Meetups"}</span>
            </div>

            <Bi
              hindi="सत्यापित स्थानीय नागरिक और सांस्कृतिक मार्गदर्शक"
              english="Verified Local Residents & Cultural Custodians"
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
            />

            <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
              {isHindi
                ? "चाय के कप पर इतिहास संवाद, गांव के हाट में टहलना या मैथिली भाषा का आदान-प्रदान। यह कोई व्यावसायिक टूर-गाइड सेवा नहीं, बल्कि वास्तविक आतिथ्य का मानवीय सेतु है।"
                : "Connect with verified residents for conversation over morning chai, temple pond walks, or living crafts. Non-commercial, respectful, and strictly mutual."}
            </p>
          </div>

          {/* Privacy Protocol Badge */}
          <div className="journal-paper p-5 border border-rule/80 rounded-sm max-w-sm shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary font-semibold mb-2">
              <Lock className="w-4 h-4 text-terracotta" />
              <span>{isHindi ? "सार्वजनिक बैठक एवं निजता नियम" : "Public Venue Protocol"}</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed mb-3">
              {isHindi
                ? "सभी प्रारंभिक मुलाकातें केवल प्रतिष्ठित सार्वजनिक स्थानों (विश्वविद्यालय चाय स्टॉल, पुस्तकालय, सरोवर तट) पर होती हैं। निजी पते व फोन नंबर दोनों पक्षों की सहमति के बिना प्रकट नहीं किए जाते।"
                : "All initial encounters occur exclusively at designated public spots. Private addresses and phone numbers are guarded by cryptographic mutual consent."}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-forest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHindi ? "100% सरकारी पहचान पत्र सत्यापित" : "Government ID Verified Residents"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tactile Filter Bar */}
      <section className="mb-12 p-5 bg-warm/30 border border-rule rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary mr-2">
            {isHindi ? "जनपद फ़िल्टर:" : "District:"}
          </span>
          <Link
            href="/explore/people"
            className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
              !districtId
                ? "bg-text text-page font-medium shadow-xs"
                : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
            }`}
          >
            {isHindi ? "सभी जिले (5)" : "All Districts (5)"}
          </Link>
          <Link
            href="/explore/people?districtId=dst-darbhanga"
            className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
              districtId === "dst-darbhanga"
                ? "bg-text text-page font-medium shadow-xs"
                : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
            }`}
          >
            {isHindi ? "दरभंगा (3)" : "Darbhanga (3)"}
          </Link>
          <Link
            href="/explore/people?districtId=dst-madhubani"
            className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
              districtId === "dst-madhubani"
                ? "bg-text text-page font-medium shadow-xs"
                : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
            }`}
          >
            {isHindi ? "मधुबनी (2)" : "Madhubani (2)"}
          </Link>
        </div>

        <div className="text-xs font-mono text-secondary">
          {filteredLocals.length} {isHindi ? "सत्यापित नागरिक सक्रिय" : "Verified Hosts Available"}
        </div>
      </section>

      {/* Editorial Residents Directory */}
      <section className="mb-20 space-y-8">
        {filteredLocals.map((local, idx) => {
          const portrait = LOCAL_PORTRAITS[local.id] || {
            src: "/images/hero-artisan.jpg",
            caption: local.locality,
          };
          const isReversed = idx % 2 === 1;

          return (
            <article
              key={local.id}
              className="journal-paper border border-rule rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Resident Photographic Portrait */}
              <div
                className={`relative min-h-[260px] md:min-h-full md:col-span-4 bg-warm/40 border-b md:border-b-0 ${
                  isReversed ? "md:order-last md:border-l border-rule" : "md:border-r border-rule"
                }`}
              >
                <Image
                  src={portrait.src}
                  alt={isHindi ? local.displayNameHi : local.displayName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent md:hidden" />

                {/* Verified Identity Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-forest text-white text-[11px] font-mono px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isHindi ? "सत्यापित नागरिक" : "Verified Resident"}</span>
                  </span>
                </div>

                {/* Member Since Footnote */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[11px] font-mono text-white/90 bg-charcoal/60 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-white/20">
                    {isHindi ? "सदस्य: " : "Resident Since: "}{local.memberSince}
                  </span>
                </div>
              </div>

              {/* Editorial Biography & Context */}
              <div className="p-6 sm:p-8 md:col-span-8 flex flex-col justify-between space-y-6">
                <div>
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-terracotta">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-semibold">{isHindi ? local.localityHi : local.locality}</span>
                      <span>·</span>
                      <span>{isHindi ? local.districtNameHi : local.districtName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {local.meetupTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 bg-warm text-[10px] font-mono uppercase tracking-wider text-secondary border border-rule rounded-xs"
                        >
                          {type === "tea" && (isHindi ? "चाय संवाद" : "Chai Meetup")}
                          {type === "market_walk" && (isHindi ? "हाट भ्रमण" : "Market Walk")}
                          {type === "language_exchange" && (isHindi ? "भाषा आदान-प्रदान" : "Language")}
                          {type === "area_tour" && (isHindi ? "परिसर वॉक" : "Heritage Walk")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text mb-3">
                    {isHindi ? local.displayNameHi : local.displayName}
                  </h2>

                  {/* Bio */}
                  <p className="text-sm sm:text-base text-secondary leading-relaxed font-heading mb-5">
                    {isHindi ? local.bioHi : local.bioEn}
                  </p>

                  {/* Languages & Interests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rule/60 text-xs">
                    <div>
                      <span className="font-mono text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2 font-medium">
                        <Languages className="w-3.5 h-3.5 text-primary" />
                        {isHindi ? "संवाद भाषाएं:" : "Spoken Languages:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isHindi ? local.languagesHi : local.languages).map((lang) => (
                          <span
                            key={lang}
                            className="px-2.5 py-1 bg-surface border border-rule rounded-sm text-text font-mono text-[11px]"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-terracotta" />
                        {isHindi ? "सांस्कृतिक रुचियां:" : "Heritage Knowledge:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isHindi ? local.interestsHi : local.interests).map((interest) => (
                          <span
                            key={interest}
                            className="px-2.5 py-1 bg-warm/50 border border-rule rounded-sm text-secondary font-mono text-[11px]"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Public Spot & Action */}
                <div className="pt-5 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <div className="flex items-center gap-1.5 text-xs text-text font-medium mb-1">
                      <Coffee className="w-3.5 h-3.5 text-primary" />
                      <span>{isHindi ? "प्रस्तावित सार्वजनिक मिलन स्थल:" : "Proposed Public Meeting Venue:"}</span>
                    </div>
                    <p className="text-xs text-secondary font-mono">
                      {isHindi ? local.preferredPublicSpotHi : local.preferredPublicSpotEn}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    <Link
                      href={`/messages/new?recipientId=${local.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>{isHindi ? "मुलाकात का अनुरोध" : "Request Meetup"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] font-mono text-secondary">
                      {isHindi ? "निःशुल्क सांस्कृतिक संवाद · कोई शुल्क नहीं" : "Non-commercial cultural exchange"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Safety Notice Footer */}
      <footer className="p-8 border border-rule rounded-sm bg-warm/20 text-center max-w-3xl mx-auto">
        <h3 className="font-heading text-lg font-medium text-text mb-2">
          {isHindi ? "पारस्परिक सम्मान एवं सुरक्षा आचार संहिता" : "Mutual Dignity & Community Code"}
        </h3>
        <p className="text-xs text-secondary leading-relaxed font-heading">
          {isHindi
            ? "अतिथि देवो भवः के सभी सदस्य स्वेच्छा से सांस्कृतिक आदान-प्रदान के लिए समय देते हैं। कृपया उनकी पारिवारिक मर्यादा, निजता और स्थानीय परंपराओं का पूर्ण सम्मान करें।"
            : "Every registered local resident offers their time voluntarily to share authentic culture. Travelers are expected to honor local social customs, modesty, and family boundaries."}
        </p>
      </footer>
    </div>
  );
}
