import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  OFFICIAL_CATEGORIES,
} from "@/lib/location/data";
import { getPilotExperiences } from "@/lib/data/pilot-experiences";
import { Bi } from "@/components/ui/bi";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

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
      ? `${category.nameHi} - स्थानीय अनुभव | Atithi Devo Bhava`
      : `${category.nameEn} - Cultural Experiences | Atithi Devo Bhava`;

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

  return (
    <div className="site-container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-secondary mb-4" aria-label="Breadcrumb">
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
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? category.nameHi : category.nameEn}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-secondary block mb-1">
          {isHindi ? "सांस्कृतिक श्रेणी" : "Cultural Category"}
        </span>
        <Bi
          hindi={category.nameHi}
          english={category.nameEn}
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose mb-4">
          {isHindi ? category.descriptionHi : category.descriptionEn}
        </p>

        {category.pilotHighlights && category.pilotHighlights.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2 items-center text-xs text-secondary">
            <span className="font-medium text-text">
              {isHindi ? "मिथिला पायलट में विशेष:" : "Pilot Highlights:"}
            </span>
            {category.pilotHighlights.map((highlight) => (
              <span
                key={highlight}
                className="px-2.5 py-1 bg-warm/50 border border-rule rounded-sm text-text"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Experiences in this Category */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "सूचीबद्ध अनुभव" : "Listed Experiences"}
          </h2>
          <span className="text-xs text-secondary">
            {experiences.length > 0
              ? `${experiences.length} ${isHindi ? "अनुभव सक्रिय" : "experiences active"}`
              : isHindi ? "समीक्षा जारी" : "Vetting in progress"}
          </span>
        </div>

        {experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((item) => (
              <article
                key={item.id}
                className="p-6 border border-rule rounded-sm hover:border-primary/50 transition-colors flex flex-col justify-between bg-page"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span>
                      {isHindi ? item.districtNameHi : item.districtName}
                    </span>
                    <span>
                      {isHindi ? item.durationHi : item.durationEn}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-medium text-text leading-snug">
                    {isHindi ? item.titleHi : item.titleEn}
                  </h3>

                  <p className="text-xs text-secondary">
                    <span className="font-medium text-text">
                      {isHindi ? item.hostNameHi : item.hostName}
                    </span>{" "}
                    ({isHindi ? item.hostRoleHi : item.hostRoleEn})
                  </p>

                  <p className="text-xs text-text leading-relaxed">
                    {isHindi ? item.descriptionHi : item.descriptionEn}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-rule flex items-center justify-between gap-3">
                  <span className="text-[11px] text-secondary">
                    {isHindi ? "पूछताछ केवल (चरण 1)" : "Enquiry-only (Phase 1)"}
                  </span>
                  <Link
                    href={`/messages/new?experienceId=${item.id}`}
                    className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
                  >
                    {isHindi ? "पूछताछ भेजें" : "Send Enquiry"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-rule rounded-sm text-center max-w-lg mx-auto">
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi
                ? "इस श्रेणी में नए अनुभवों की समीक्षा जारी है"
                : "New Experiences Currently Under Community Review"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              {isHindi
                ? "अतिथि देवो भव पर हम केवल उन सांस्कृतिक अनुभवों को प्रकाशित करते हैं जिनकी गुणवत्ता और प्रत्यक्ष मेजबानी की पुष्टि हमारे सामुदायिक दिशानिर्देशों के तहत हो चुकी हो।"
                : "We publish experiences only after in-person community verification and safety review with host families."}
            </p>
            <Link
              href="/become-a-host"
              className="inline-block text-xs text-primary font-medium hover:underline"
            >
              {isHindi
                ? "क्या आप इस श्रेणी में अनुभव साझा करना चाहते हैं? आवेदन करें"
                : "Do you host an experience in this category? Apply to host"} →
            </Link>
          </div>
        )}
      </section>

      {/* Other Categories */}
      <section className="pt-8 border-t border-rule">
        <h2 className="font-heading text-base font-medium text-text mb-4">
          {isHindi ? "अन्य श्रेणियां देखें" : "Explore Other Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="p-3 border border-rule/70 rounded-sm hover:border-primary transition-colors text-secondary hover:text-text"
            >
              <span className="font-medium block mb-1">
                {isHindi ? c.nameHi : c.nameEn}
              </span>
              <span className="text-[11px] text-secondary line-clamp-1">
                {isHindi ? c.descriptionHi : c.descriptionEn}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
