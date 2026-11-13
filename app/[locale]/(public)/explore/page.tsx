import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedSearch } from "@/components/search/unified-search";
import { OFFICIAL_CATEGORIES } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";
import {
  Users,
  Compass,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Field Directory: Explore India with Locals | भारत की खोज - Atithi Devo Bhava",
  description:
    "Discover local people, cultural experiences, and heritage regions across India. Connect with verified residents in Darbhanga and Madhubani.",
};

export default async function ExploreIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "अन्वेषण निर्देशिका" : "Field Directory"}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-terracotta mb-3">
            <Compass className="w-3.5 h-3.5 text-terracotta" />
            <span>{isHindi ? "उत्तरी बिहार पायलट निर्देशिका" : "Mithila Regional Pilot Archive"}</span>
          </div>

          <Bi
            hindi="जीवित संस्कृतियों और नागरिकों की खोज"
            english="Discover Verified Residents & Living Heritage Traditions"
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
          />

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
            {isHindi
              ? "स्थानीय निवासियों से मिलें, पारंपरिक कला व पाककला सीखें, और वास्तविक भारत को लोगों के माध्यम से समझें। व्यावसायिक बिचौलियों से मुक्त, सम्मानपूर्ण मानवीय संबंध।"
              : "Engage directly with local families, master painters, and wetland growers. A curated, community-first marketplace celebrating North Bihar's cultural wealth."}
          </p>
        </div>
      </header>

      {/* Unified Search Section */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider uppercase text-secondary">
            {isHindi ? "स्थान या सांस्कृतिक विषय के आधार पर अन्वेषण करें" : "Search by Territory, Tradition or Host"}
          </h2>
          <span className="text-[11px] font-mono text-terracotta">
            {isHindi ? "दरभंगा एवं मधुबनी सक्रिय" : "Darbhanga & Madhubani Live"}
          </span>
        </div>
        <div className="organic-glass p-2 sm:p-3 rounded-sm border border-rule/80 shadow-xs">
          <UnifiedSearch />
        </div>
      </section>

      {/* The Three Pathways of Hospitality */}
      <section className="mb-16">
        <div className="border-b border-rule pb-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
            {isHindi ? "सत्कार के तीन स्वरूप" : "Three Modes of Cultural Exchange"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "अन्वेषण के तीन मानवीय माध्यम" : "Three Ways to Connect in Mithila"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Product A: Meet a Local */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm hover:border-primary/60 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider uppercase text-primary">
                  {isHindi ? "माध्यम 1" : "Product A"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-forest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isHindi ? "सत्यापित" : "Verified"}
                </span>
              </div>

              <div className="w-12 h-12 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-primary">
                <Users className="w-6 h-6 text-forest" />
              </div>

              <h3 className="font-heading text-xl font-medium text-text group-hover:text-primary transition-colors">
                {isHindi ? "स्थानीय नागरिक से मिलें" : "Meet a Local Resident"}
              </h3>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "चाय के कप पर संवाद, विद्यापति के पदों की चर्चा, या मोहल्ला वॉक। गैर-व्यावसायिक, पारस्परिक सम्मान पर आधारित मित्रता।"
                  : "Informal conversations over chai, campus walks, or market strolls. Non-commercial, respectful, and strictly mutual."}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-rule/60">
              <Link
                href="/explore/people"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform"
              >
                <span>{isHindi ? "स्थानीय नागरिक देखें" : "Browse Verified Locals"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* Product B: Cultural Immersions */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm hover:border-primary/60 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider uppercase text-terracotta">
                  {isHindi ? "माध्यम 2" : "Product B"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-terracotta">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isHindi ? "केवल पूछताछ" : "Enquiry-Only"}
                </span>
              </div>

              <div className="w-12 h-12 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-terracotta">
                <Compass className="w-6 h-6 text-terracotta" />
              </div>

              <h3 className="font-heading text-xl font-medium text-text group-hover:text-primary transition-colors">
                {isHindi ? "स्थानीय के साथ अनुभव" : "Living Cultural Immersions"}
              </h3>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "जितवारपुर में मिथिला पेंटिंग, आर्द्रभूमि में मखाना तुड़ाई, या ध्रुपद संगीत। वरिष्ठ कारीगरों और परिवारों द्वारा संचालित सत्र।"
                  : "Hands-on workshops in natural pigments, traditional gorgon nut roasting, and hereditary temple music."}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-rule/60">
              <Link
                href="/explore/experiences"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-terracotta group-hover:translate-x-1 transition-transform"
              >
                <span>{isHindi ? "सांस्कृतिक अनुभव देखें" : "Explore Immersions"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* Product C: Stay with a Local */}
          <article className="journal-paper p-6 sm:p-7 border border-rule rounded-sm bg-warm/20 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider uppercase text-secondary">
                  {isHindi ? "माध्यम 3" : "Product C"}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-surface border border-rule rounded-xs text-secondary">
                  {isHindi ? "चरण 3 में प्रारंभ" : "Phase 3 Roadmap"}
                </span>
              </div>

              <div className="w-12 h-12 rounded-sm bg-warm/80 border border-rule flex items-center justify-center text-secondary">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>

              <h3 className="font-heading text-xl font-medium text-text">
                {isHindi ? "पारिवारिक आवास और दालान" : "Ancestral Dalan Stays"}
              </h3>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
                {isHindi
                  ? "पारंपरिक मिथिला हवेलियों में ठहरने का अनुभव। भौतिक सुरक्षा व फॉर्म-सी पंजीकरण की पूर्णता के बाद ही बुकिंग शुरू होगी।"
                  : "Residential homestays in traditional family homes. Opening once in-person physical inspections conclude."}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-rule/60">
              <Link
                href="/explore/stays"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-secondary hover:text-text group-hover:translate-x-1 transition-transform"
              >
                <span>{isHindi ? "अनुपालन स्थिति पढ़ें" : "Read Compliance Standards"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 12 Heritage Domains Directory */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between border-b border-rule pb-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
              {isHindi ? "सांस्कृतिक विधाएं" : "Heritage Domains"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
              {isHindi ? "12 सांस्कृतिक श्रेणियां" : "The 12 Cultural Facets of Mithila"}
            </h2>
          </div>
          <span className="text-xs font-mono text-secondary">
            {isHindi ? "विषय अनुसार अनुक्रमणिका" : "Thematic Index"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OFFICIAL_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="journal-paper p-5 border border-rule rounded-sm hover:border-primary/60 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-secondary mb-2">
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-wider text-terracotta">{cat.categoryGroup}</span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-medium text-text mb-1.5 group-hover:text-primary transition-colors">
                  {isHindi ? cat.nameHi : cat.nameEn}
                </h3>
                <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                  {isHindi ? cat.descriptionHi : cat.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-rule/50 flex items-center justify-between text-xs font-mono text-terracotta">
                <span>{isHindi ? "अन्वेषण करें" : "Explore"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pilot Territory Focus */}
      <section className="journal-paper p-8 sm:p-10 border border-rule rounded-sm bg-warm/20 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-primary inline-block">
            {isHindi ? "सक्रिय परिचालन क्षेत्र" : "Field Pilot Jurisdiction"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
            {isHindi ? "दरभंगा एवं मधुबनी: मिथिला का हृदयस्थल" : "Darbhanga & Madhubani: The Living Heart of Mithila"}
          </h2>
          <p className="text-sm text-secondary leading-relaxed font-heading">
            {isHindi
              ? "हमारा पहला परिचालन बिहार के दरभंगा और मधुबनी जिलों में केंद्रित है, जहाँ 40 से अधिक सत्यापित स्थानीय नागरिक और कारीगर सक्रिय हैं। पूरे भारत में अन्य क्षेत्रों के लिए पंजीकरण चरणबद्ध तरीके से खोला जाएगा।"
              : "Active operations are currently grounded in Darbhanga and Madhubani districts, encompassing ancient royal libraries, living artisan courtyards, and wetland agricultural ecosystems."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/india/bihar/darbhanga"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-hover text-xs font-mono uppercase tracking-wider rounded-sm transition-colors shadow-xs"
            >
              <span>{isHindi ? "दरभंगा जनपद" : "Explore Darbhanga"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/india/bihar/madhubani"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-rule hover:border-secondary text-secondary hover:text-text text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
            >
              <span>{isHindi ? "मधुबनी जनपद" : "Explore Madhubani"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
