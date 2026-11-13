import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  OFFICIAL_CATEGORIES,
} from "@/lib/location/data";
import { getPilotExperiences } from "@/lib/data/pilot-experiences";
import { Bi } from "@/components/ui/bi";
import {
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const CATEGORY_COVERS: Record<string, string> = {
  "art-and-handicrafts": "/images/exp-mithila-art.jpg",
  "indian-food-and-cooking": "/images/exp-cuisine.jpg",
  "music-and-dance": "/images/exp-folk-music.jpg",
  "village-life": "/images/exp-homestay.jpg",
  "nature-and-wildlife": "/images/exp-pond.jpg",
  "heritage-and-history": "/images/mithila-landscape-banner.jpg",
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | Atithi Devo Bhava" };
  }

  const title =
    locale === "hi"
      ? `${category.nameHi} - सांस्कृतिक विरासत | Atithi Devo Bhava`
      : `${category.nameEn} - Cultural Heritage | Atithi Devo Bhava`;

  return {
    title,
    description: `${category.descriptionEn} Connect with local Indian residents and artisan families.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const experiences = getPilotExperiences(category.slug);
  const otherCategories = OFFICIAL_CATEGORIES.filter((c) => c.slug !== category.slug);
  const isHindi = locale === "hi";

  const coverImage = CATEGORY_COVERS[category.slug] || "/images/mithila-landscape-banner.jpg";

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
            {isHindi ? category.nameHi : category.nameEn}
          </li>
        </ol>
      </nav>

      {/* Editorial Category Feature Hero */}
      <header className="journal-paper border border-rule rounded-sm overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono tracking-wider uppercase text-primary mb-4">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>{isHindi ? "विशिष्ट सांस्कृतिक परंपरा" : "Living Heritage Domain"}</span>
              </div>

              <Bi
                hindi={category.nameHi}
                english={category.nameEn}
                as="h1"
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
              />

              <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading mb-6">
                {isHindi ? category.descriptionHi : category.descriptionEn}
              </p>

              {category.pilotHighlights && category.pilotHighlights.length > 0 && (
                <div className="pt-4 border-t border-rule/60 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold block">
                    {isHindi ? "मिथिला पायलट में प्रमुख आकर्षण:" : "Mithila Pilot Focus:"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {category.pilotHighlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 bg-warm/60 border border-rule rounded-sm text-xs font-mono text-text"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-rule flex items-center gap-4 text-xs font-mono text-secondary">
              <span className="flex items-center gap-1.5 text-forest font-medium">
                <ShieldCheck className="w-4 h-4" />
                {isHindi ? "समुदाय द्वारा सत्यापित" : "Community Verified"}
              </span>
              <span>·</span>
              <span>{isHindi ? "चरण 1: केवल पूछताछ मॉडल" : "Phase 1: Enquiry-Only"}</span>
            </div>
          </div>

          <div className="relative min-h-[260px] lg:min-h-full lg:col-span-5 bg-warm/30 border-t lg:border-t-0 lg:border-l border-rule">
            <Image
              src={coverImage}
              alt={category.nameEn}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="heritage-stamp text-[11px] font-mono font-semibold uppercase px-2.5 py-1 text-primary">
                {isHindi ? "उत्तरी बिहार क्षेत्र" : "Northern Bihar Field Archive"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Listed Experiences in this Category */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between border-b border-rule pb-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
              {isHindi ? "सत्यापित कार्यशालाएं" : "Curated Immersions"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
              {isHindi ? "इस श्रेणी के अंतर्गत सक्रिय सत्र" : "Active Experiences in this Domain"}
            </h2>
          </div>
          <span className="text-xs font-mono text-secondary">
            {experiences.length > 0
              ? `${experiences.length} ${isHindi ? "सत्र उपलब्ध" : "sessions active"}`
              : isHindi ? "समीक्षा प्रगति पर" : "Verification in progress"}
          </span>
        </div>

        {experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((item) => (
              <article
                key={item.id}
                className="journal-paper border border-rule rounded-sm p-6 sm:p-7 flex flex-col justify-between hover:border-primary/60 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-secondary">
                    <span className="inline-flex items-center gap-1.5 text-text font-medium">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      {isHindi ? item.districtNameHi : item.districtName}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {isHindi ? item.durationHi : item.durationEn}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-medium text-text leading-snug">
                    <Link href={`/experiences/${item.id}`} className="hover:text-primary transition-colors">
                      {isHindi ? item.titleHi : item.titleEn}
                    </Link>
                  </h3>

                  <p className="text-xs text-secondary font-mono">
                    <span className="font-semibold text-text">
                      {isHindi ? item.hostNameHi : item.hostName}
                    </span>{" "}
                    ({isHindi ? item.hostRoleHi : item.hostRoleEn})
                  </p>

                  <p className="text-sm text-secondary leading-relaxed font-heading line-clamp-3">
                    {isHindi ? item.descriptionHi : item.descriptionEn}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-rule flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-secondary">
                    {isHindi ? "निशुल्क पूछताछ (चरण 1)" : "Enquiry-only · Phase 1"}
                  </span>
                  <Link
                    href={`/experiences/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>{isHindi ? "विवरण व पूछताछ" : "View Details"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="journal-paper p-12 border border-dashed border-rule rounded-sm text-center max-w-xl mx-auto bg-warm/20">
            <BookOpen className="w-8 h-8 text-secondary/60 mx-auto mb-3" />
            <h3 className="font-heading text-xl font-medium text-text mb-2">
              {isHindi
                ? "इस श्रेणी में नए अनुभवों की समीक्षा जारी है"
                : "New Experiences Under Community Review"}
            </h3>
            <p className="text-sm text-secondary leading-relaxed mb-6 font-heading">
              {isHindi
                ? "अतिथि देवो भव पर हम केवल उन सांस्कृतिक अनुभवों को प्रकाशित करते हैं जिनकी गुणवत्ता और प्रत्यक्ष मेजबानी की पुष्टि हमारे सामुदायिक दिशानिर्देशों के तहत हो चुकी हो।"
                : "We publish experiences only after in-person community verification and safety review with local host families in Mithila."}
            </p>
            <Link
              href="/become-a-host"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-primary-hover transition-colors"
            >
              <span>{isHindi ? "मेजबान के रूप में आवेदन करें" : "Apply to Host in this Category"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Other Categories Index */}
      <section className="pt-10 border-t border-rule">
        <h2 className="font-heading text-xl font-medium text-text mb-6">
          {isHindi ? "अन्य सांस्कृतिक विधाएं" : "Explore Other Heritage Domains"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="journal-paper p-4 border border-rule/80 rounded-sm hover:border-primary transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <span className="font-heading text-sm font-medium text-text block mb-1 group-hover:text-primary transition-colors">
                  {isHindi ? c.nameHi : c.nameEn}
                </span>
                <span className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                  {isHindi ? c.descriptionHi : c.descriptionEn}
                </span>
              </div>
              <div className="pt-2 mt-2 flex items-center gap-1 text-[11px] font-mono text-terracotta group-hover:translate-x-1 transition-transform">
                <span>{isHindi ? "अन्वेषण" : "Explore"}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
