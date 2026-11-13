import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";
import { OFFICIAL_CATEGORIES } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";
import { 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Filter,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cultural Experiences with Locals | स्थानीय लोगों के साथ अनुभव - Atithi Devo Bhava",
  description:
    "Explore authentic cultural, craft, culinary, and heritage experiences hosted by Indian residents and artisan families. Enquiry-only in Phase 1.",
};

const EXPERIENCE_IMAGES: Record<string, { src: string; alt: string; tag: string; tagHi: string }> = {
  "exp-br-01": {
    src: "/images/exp-mithila-art.jpg",
    alt: "Master artisan painting traditional Mithila motifs on handmade paper",
    tag: "National Award Artisan",
    tagHi: "राष्ट्रीय पुरस्कार प्राप्त कलाकार",
  },
  "exp-br-02": {
    src: "/images/exp-makhana.jpg",
    alt: "Wetland makhana harvesting and open-hearth roasting in Darbhanga",
    tag: "GI Tag Wetland Heritage",
    tagHi: "जी.आई. टैग आर्द्रभूमि विरासत",
  },
  "exp-br-03": {
    src: "/images/exp-folk-music.jpg",
    alt: "Classical Dhrupad singing in the historic temple courtyards",
    tag: "400-Year Mallick Gharana",
    tagHi: "400 वर्ष पुराना मल्लिक घराना",
  },
  "exp-br-04": {
    src: "/images/exp-cuisine.jpg",
    alt: "Traditional Sikki golden grass weaving by women collective",
    tag: "Women Craft Cooperative",
    tagHi: "महिला शिल्प सहकारी समिति",
  },
};

interface ExperiencesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    districtId?: string;
  }>;
}

export default async function ExperiencesDirectoryPage({
  params,
  searchParams,
}: ExperiencesPageProps) {
  const { locale } = await params;
  const { category, districtId } = await searchParams;

  let filtered = [...PILOT_EXPERIENCES];

  if (category) {
    filtered = filtered.filter((e) => e.categorySlug === category);
  }

  if (districtId) {
    filtered = filtered.filter((e) => e.districtId === districtId);
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
            {isHindi ? "सांस्कृतिक अनुभव" : "Living Traditions"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>{isHindi ? "अन्वेषण माध्यम 2: स्थानीय कारीगरों के संग" : "Curated Field Immersion · Northern Bihar"}</span>
            </div>
            
            <Bi
              hindi="सांस्कृतिक अनुभव और जीवित शिल्पकला"
              english="Cultural Immersions & Living Craft Traditions"
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
            />
            
            <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
              {isHindi
                ? "मिथिला के वरिष्ठ चित्रकारों, तालाब कृषकों और शास्त्रीय संगीत घरानों द्वारा संचालित अंतरंग कार्यशालाएं। व्यावसायिक पर्यटन से दूर, वास्तविक सांस्कृतिक आदान-प्रदान।"
                : "Intimate, respectful sessions led by master painters, aquatic cultivators, and hereditary musicians in Mithila. Grounded in community livelihoods, not commercial tour buses."}
            </p>
          </div>

          {/* Phase 1 Trust Badge */}
          <div className="journal-paper p-5 border border-rule/80 rounded-sm max-w-sm shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>{isHindi ? "पायलट चरण: केवल निःशुल्क पूछताछ" : "Phase 1: Curated Enquiry Only"}</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed mb-3">
              {isHindi
                ? "प्रारंभिक चरण में कोई अप्रमाणित बुकिंग शुल्क नहीं लिया जाता। हम पहले आपकी रुचि और मेजबान की उपलब्धता का सीधा समन्वय करते हैं।"
                : "Zero commercial markups or automated transactions in Phase 1. Every session is coordinated directly with the artisan family to guarantee dignity."}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-terracotta">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{isHindi ? "दरभंगा एवं मधुबनी जिला पायलट" : "Darbhanga & Madhubani Active Pilots"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tactile Filter Bar */}
      <section className="mb-12 p-5 bg-warm/30 border border-rule rounded-sm">
        <div className="flex flex-col gap-4">
          {/* District Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-primary" />
              {isHindi ? "जिला जनपद:" : "District:"}
            </span>
            <Link
              href={`/explore/experiences${category ? `?category=${category}` : ""}`}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
                !districtId
                  ? "bg-text text-page font-medium shadow-xs"
                  : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
              }`}
            >
              {isHindi ? "समस्त जिले (2)" : "All Districts (2)"}
            </Link>
            <Link
              href={`/explore/experiences?districtId=dst-darbhanga${category ? `&category=${category}` : ""}`}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
                districtId === "dst-darbhanga"
                  ? "bg-text text-page font-medium shadow-xs"
                  : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
              }`}
            >
              {isHindi ? "दरभंगा (Darbhanga)" : "Darbhanga (Raj Precinct)"}
            </Link>
            <Link
              href={`/explore/experiences?districtId=dst-madhubani${category ? `&category=${category}` : ""}`}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
                districtId === "dst-madhubani"
                  ? "bg-text text-page font-medium shadow-xs"
                  : "bg-surface border border-rule text-secondary hover:text-text hover:border-secondary"
              }`}
            >
              {isHindi ? "मधुबनी (Madhubani)" : "Madhubani (Artisan Villages)"}
            </Link>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-rule/60">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary mr-2">
              {isHindi ? "सांस्कृतिक श्रेणी:" : "Category:"}
            </span>
            <Link
              href={`/explore/experiences${districtId ? `?districtId=${districtId}` : ""}`}
              className={`px-3 py-1 text-xs rounded-sm transition-all ${
                !category
                  ? "bg-primary text-white font-medium"
                  : "bg-surface border border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "सभी विधाएं" : "All Traditions"}
            </Link>
            {OFFICIAL_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/explore/experiences?category=${cat.slug}${districtId ? `&districtId=${districtId}` : ""}`}
                className={`px-3 py-1 text-xs rounded-sm transition-all ${
                  category === cat.slug
                    ? "bg-primary text-white font-medium"
                    : "bg-surface border border-rule text-secondary hover:text-text"
                }`}
              >
                {isHindi ? cat.nameHi : cat.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Catalog Grid */}
      <section className="mb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filtered.map((item) => {
              const imgData = EXPERIENCE_IMAGES[item.id] || {
                src: "/images/exp-mithila-art.jpg",
                alt: item.titleEn,
                tag: "Verified Heritage",
                tagHi: "सत्यापित विरासत",
              };

              return (
                <article
                  key={item.id}
                  className="group journal-paper border border-rule rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-warm/30 border-b border-rule">
                    <Image
                      src={imgData.src}
                      alt={imgData.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent pointer-events-none" />

                    {/* Heritage Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="heritage-stamp text-[11px] font-mono font-semibold uppercase px-2.5 py-1 text-primary">
                        {isHindi ? imgData.tagHi : imgData.tag}
                      </span>
                    </div>

                    {/* Category pill */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs font-mono uppercase tracking-wider bg-charcoal/70 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-white/20">
                        {isHindi ? item.categoryNameHi : item.categoryNameEn}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary mb-3">
                        <span className="inline-flex items-center gap-1.5 text-text font-medium">
                          <MapPin className="w-3.5 h-3.5 text-terracotta" />
                          {isHindi ? item.districtNameHi : item.districtName}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          {isHindi ? item.durationHi : item.durationEn}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-secondary" />
                          {item.maxParticipants} {isHindi ? "व्यक्ति अधिकतम" : "max guests"}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-heading text-xl sm:text-2xl font-medium text-text mb-2.5 leading-snug group-hover:text-primary transition-colors">
                        <Link href={`/experiences/${item.id}`}>
                          {isHindi ? item.titleHi : item.titleEn}
                        </Link>
                      </h2>

                      {/* Artisan Host Credit */}
                      <p className="text-xs text-secondary font-mono mb-4">
                        <span className="text-text font-semibold">
                          {isHindi ? item.hostNameHi : item.hostName}
                        </span>
                        {" · "}
                        <span className="italic">{isHindi ? item.hostRoleHi : item.hostRoleEn}</span>
                      </p>

                      {/* Narrative Description */}
                      <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                        {isHindi ? item.descriptionHi : item.descriptionEn}
                      </p>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="pt-4 border-t border-rule/60 space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-secondary block font-semibold">
                        {isHindi ? "कार्यशाला के प्रमुख बिंदु:" : "Field Highlights:"}
                      </span>
                      <ul className="space-y-1.5">
                        {(isHindi ? item.highlightsHi : item.highlightsEn).slice(0, 2).map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-text">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Action Rule */}
                    <div className="pt-5 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-terracotta uppercase tracking-wider block font-medium">
                          {isHindi ? "सत्यापित गैर-व्यावसायिक सत्र" : "Direct Artisan Session"}
                        </span>
                        <span className="text-xs text-secondary">
                          {isHindi ? "निःशुल्क पूछताछ व समन्वय" : "Enquiry-Only · Phase 1"}
                        </span>
                      </div>

                      <Link
                        href={`/experiences/${item.id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-mono uppercase tracking-wider transition-all duration-200 group-hover:shadow-xs"
                      >
                        <span>{isHindi ? "विवरण व पूछताछ" : "View & Enquire"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-16 border border-dashed border-rule rounded-sm text-center max-w-xl mx-auto bg-warm/20">
            <h3 className="font-heading text-xl font-medium text-text mb-3">
              {isHindi ? "इस श्रेणी में अभी कोई सत्यापित अनुभव नहीं है" : "No Experiences in this Selection"}
            </h3>
            <p className="text-sm text-secondary leading-relaxed mb-6 font-heading">
              {isHindi
                ? "हम केवल उन परंपराओं को प्रकाशित करते हैं जिनकी सांस्कृतिक प्रामाणिकता, सम्मान और सुरक्षा मानकों की प्रत्यक्ष पुष्टि की जा चुकी हो।"
                : "We list immersions exclusively after community consent, fair artisan compensation review, and physical verification."}
            </p>
            <Link
              href="/explore/experiences"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-primary-hover transition-colors"
            >
              <span>{isHindi ? "समस्त अनुभव देखें" : "View All Pilot Immersions"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Cultural Footnote */}
      <footer className="border-t border-rule pt-8 text-center max-w-2xl mx-auto">
        <p className="font-heading text-sm text-secondary italic">
          {isHindi
            ? "«अतिथि देवो भवः केवल एक मुहावरा नहीं, वरन मिथिला के हर आंगन का जीवित संकल्प है।»"
            : "«Atithi Devo Bhava is not mere hospitality; it is the sacred covenant of every traditional courtyard in Mithila.»"}
        </p>
      </footer>
    </div>
  );
}
