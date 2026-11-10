import type { Metadata } from "next";
import Link from "next/link";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";
import { OFFICIAL_CATEGORIES } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Cultural Experiences with Locals | स्थानीय लोगों के साथ अनुभव - Atithi Devo Bhava",
  description:
    "Explore authentic cultural, craft, culinary, and heritage experiences hosted by Indian residents and artisan families. Enquiry-only in Phase 1.",
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
            {isHindi ? "सांस्कृतिक अनुभव" : "Cultural Experiences"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
              {isHindi ? "माध्यम 2: स्थानीय के साथ अनुभव" : "Product B: Explore with a Local"}
            </span>
            <Bi
              hindi="सांस्कृतिक अनुभव और शिल्प"
              english="Cultural Experiences & Living Crafts"
              as="h1"
              className="mb-2"
            />
            <p className="text-sm text-secondary max-w-prose">
              {isHindi
                ? "कारीगरों, रसोइयों और परिवारों द्वारा संचालित अनुभव। प्रारंभिक चरण में केवल पूछताछ उपलब्ध है; कोई ऑनलाइन भुगतान नहीं लिया जाता।"
                : "Structured sessions hosted by resident artisans, cooks, and families. Operating as enquiry-only in Phase 1 with no online payments."}
            </p>
          </div>

          <div className="text-xs text-secondary bg-warm/20 p-3 border border-rule rounded-sm max-w-xs">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "चरण 1: केवल पूछताछ मॉडल" : "Phase 1: Enquiry-Only Model"}
            </span>
            {isHindi
              ? "मूल्य प्रदर्शन और ऑनलाइन भुगतान सुरक्षा ऑडिट और समुदाय सत्यापन के बाद अगले चरण में सक्रिय किए जाएंगे।"
              : "Price display and online payments are scheduled for Phase 2 following full host and compliance validation."}
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="mb-8 p-4 border border-rule rounded-sm bg-warm/10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-text">
              {isHindi ? "जिला फ़िल्टर:" : "District:"}
            </span>
            <Link
              href={`/explore/experiences${category ? `?category=${category}` : ""}`}
              className={`px-3 py-1 rounded-sm border ${
                !districtId
                  ? "bg-primary text-white border-primary"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "सभी जिले" : "All Districts"}
            </Link>
            <Link
              href={`/explore/experiences?districtId=dst-darbhanga${category ? `&category=${category}` : ""}`}
              className={`px-3 py-1 rounded-sm border ${
                districtId === "dst-darbhanga"
                  ? "bg-primary text-white border-primary"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "दरभंगा" : "Darbhanga"}
            </Link>
            <Link
              href={`/explore/experiences?districtId=dst-madhubani${category ? `&category=${category}` : ""}`}
              className={`px-3 py-1 rounded-sm border ${
                districtId === "dst-madhubani"
                  ? "bg-primary text-white border-primary"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "मधुबनी" : "Madhubani"}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-rule/50">
            <span className="font-medium text-text">
              {isHindi ? "श्रेणी फ़िल्टर:" : "Category:"}
            </span>
            <Link
              href={`/explore/experiences${districtId ? `?districtId=${districtId}` : ""}`}
              className={`px-2.5 py-0.5 rounded-sm border ${
                !category
                  ? "bg-text text-page border-text font-medium"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "सभी श्रेणियां" : "All Categories"}
            </Link>
            {OFFICIAL_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/explore/experiences?category=${cat.slug}${districtId ? `&districtId=${districtId}` : ""}`}
                className={`px-2.5 py-0.5 rounded-sm border ${
                  category === cat.slug
                    ? "bg-text text-page border-text font-medium"
                    : "border-rule text-secondary hover:text-text"
                }`}
              >
                {isHindi ? cat.nameHi : cat.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Directory */}
      <section className="mb-14">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="p-6 border border-rule rounded-sm hover:border-primary/50 transition-colors flex flex-col justify-between bg-page"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-warm text-secondary border border-rule rounded-sm">
                      {isHindi ? item.categoryNameHi : item.categoryNameEn}
                    </span>
                    <span className="text-xs text-secondary">
                      {isHindi ? item.durationHi : item.durationEn}
                    </span>
                  </div>

                  <h2 className="font-heading text-lg font-medium text-text leading-snug">
                    {isHindi ? item.titleHi : item.titleEn}
                  </h2>

                  <div className="text-xs text-secondary">
                    <span className="font-medium text-text">
                      {isHindi ? item.hostNameHi : item.hostName}
                    </span>{" "}
                    ({isHindi ? item.hostRoleHi : item.hostRoleEn}) •{" "}
                    {isHindi ? item.districtNameHi : item.districtName}
                  </div>

                  <p className="text-xs text-text leading-relaxed">
                    {isHindi ? item.descriptionHi : item.descriptionEn}
                  </p>

                  <div className="pt-2 border-t border-rule/60 text-xs text-secondary space-y-1">
                    <div>
                      <span className="font-medium text-text">
                        {isHindi ? "सामान्य मिलन क्षेत्र: " : "General Meeting Area: "}
                      </span>
                      {isHindi ? item.generalAreaHi : item.generalAreaEn}
                    </div>
                    <div>
                      <span className="font-medium text-text">
                        {isHindi ? "अधिकतम प्रतिभागी: " : "Max Group Size: "}
                      </span>
                      {item.maxParticipants} {isHindi ? "व्यक्ति" : "people"}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-rule flex items-center justify-between gap-3">
                  <span className="text-[11px] text-secondary font-medium">
                    {isHindi ? "निशुल्क पूछताछ (चरण 1)" : "Enquiry-only (Phase 1)"}
                  </span>
                  <Link
                    href={`/experiences/${item.id}`}
                    className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
                  >
                    {isHindi ? "विवरण देखें और पूछताछ करें" : "View Details & Enquire"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-rule rounded-sm text-center max-w-lg mx-auto">
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi ? "इस श्रेणी में अभी कोई सूचीबद्ध अनुभव नहीं है" : "No Experiences in this Selection"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              {isHindi
                ? "हम केवल उन अनुभवों को प्रकाशित करते हैं जिनकी गुणवत्ता और सांस्कृतिक प्रामाणिकता की समीक्षा की गई हो।"
                : "We list experiences exclusively after direct community verification and host review."}
            </p>
            <Link
              href="/explore/experiences"
              className="text-xs text-primary font-medium hover:underline"
            >
              {isHindi ? "सभी अनुभव देखें" : "View all available experiences"}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
