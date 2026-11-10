import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedSearch } from "@/components/search/unified-search";
import { OFFICIAL_CATEGORIES } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Explore India with Locals | भारत की खोज - Atithi Devo Bhava",
  description:
    "Discover local people, cultural experiences, and heritage regions across India. Connect with verified residents.",
};

export default async function ExploreIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="site-container py-12">
      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <nav className="text-xs text-secondary mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                {locale === "hi" ? "होम" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text font-medium" aria-current="page">
              {locale === "hi" ? "अन्वेषण" : "Explore"}
            </li>
          </ol>
        </nav>

        <Bi
          hindi="स्थानीय लोगों और संस्कृतियों की खोज करें"
          english="Discover Local Residents and Cultural Traditions"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {locale === "hi"
            ? "स्थानीय निवासियों से मिलें, पारंपरिक कला व पाककला सीखें, और वास्तविक भारत को लोगों के माध्यम से समझें।"
            : "Connect with Indian residents for tea or walks, learn regional arts and recipes, and experience India through people."}
        </p>
      </header>

      {/* Unified Search Section */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-secondary mb-4">
          {locale === "hi" ? "स्थान या गतिविधि के आधार पर खोजें" : "Search by Location or Activity"}
        </h2>
        <UnifiedSearch />
      </section>

      {/* Product Pillars Quick Access */}
      <section className="mb-14">
        <div className="border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "अन्वेषण के तीन माध्यम" : "Three Ways to Connect"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Meet a Local */}
          <div className="p-6 border border-rule rounded-sm hover:border-primary/50 transition-colors flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-2 block">
                {locale === "hi" ? "पहला माध्यम" : "Product A"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {locale === "hi" ? "स्थानीय निवासी से मिलें" : "Meet a Local"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {locale === "hi"
                  ? "चाय, भाषा संवाद, बाज़ार भ्रमण या स्थानीय मोहल्ला वॉक के लिए स्थानीय निवासी से संपर्क करें। यह कोई सशुल्क सेवा नहीं है।"
                  : "Connect with a resident for tea, language practice, or an informal neighbourhood walk. Non-commercial by default."}
              </p>
            </div>
            <Link
              href="/explore/people"
              className="text-xs font-medium text-primary hover:underline"
            >
              {locale === "hi" ? "स्थानीय नागरिक देखें" : "Browse local residents"} →
            </Link>
          </div>

          {/* Explore with a Local */}
          <div className="p-6 border border-rule rounded-sm hover:border-primary/50 transition-colors flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-2 block">
                {locale === "hi" ? "दूसरा माध्यम" : "Product B"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {locale === "hi" ? "स्थानीय के साथ अनुभव" : "Explore with a Local"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {locale === "hi"
                  ? "स्थानीय कलाकारों, रसोइयों और परिवारों द्वारा आयोजित सांस्कृतिक अनुभव। प्रारंभिक चरण में केवल पूछताछ उपलब्ध है।"
                  : "Structured cultural experiences led by artisans and families. Operating as enquiry-only in Phase 1."}
              </p>
            </div>
            <Link
              href="/explore/experiences"
              className="text-xs font-medium text-primary hover:underline"
            >
              {locale === "hi" ? "सांस्कृतिक अनुभव देखें" : "Browse cultural experiences"} →
            </Link>
          </div>

          {/* Stay with a Local */}
          <div className="p-6 border border-rule rounded-sm bg-warm/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-secondary">
                  {locale === "hi" ? "तीसरा माध्यम" : "Product C"}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-warm border border-rule rounded-sm text-secondary font-medium">
                  {locale === "hi" ? "चरण 3 में" : "Phase 3"}
                </span>
              </div>
              <h3 className="font-heading text-lg font-medium text-text mb-2">
                {locale === "hi" ? "स्थानीय परिवार के साथ रहें" : "Stay with a Local"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {locale === "hi"
                  ? "पारिवारिक प्रवास और होमस्टे। यह सुविधा उच्च सत्यापन और कानूनी अनुपालन व्यवस्था के साथ चरण 3 में खोली जाएगी।"
                  : "Family homestays and residential hospitality. Opening in Phase 3 following full compliance verification."}
              </p>
            </div>
            <Link
              href="/explore/stays"
              className="text-xs font-medium text-secondary hover:text-text hover:underline"
            >
              {locale === "hi" ? "अनुपालन स्थिति पढ़ें" : "Read compliance status"} →
            </Link>
          </div>
        </div>
      </section>

      {/* 12 Cultural Categories */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "12 सांस्कृतिक श्रेणियां" : "12 Cultural Categories"}
          </h2>
          <span className="text-xs text-secondary">
            {locale === "hi" ? "विषय अनुसार खोजें" : "Browse by category"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {OFFICIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="p-4 border border-rule rounded-sm hover:border-primary transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="font-heading text-base font-medium text-text mb-1">
                  {locale === "hi" ? cat.nameHi : cat.nameEn}
                </h3>
                <p className="text-xs text-secondary line-clamp-2 mb-3">
                  {locale === "hi" ? cat.descriptionHi : cat.descriptionEn}
                </p>
              </div>
              <span className="text-xs text-primary font-medium hover:underline">
                {locale === "hi" ? "श्रेणी देखें" : "View Category"} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pilot Regions Spotlight */}
      <section className="p-6 border border-rule bg-warm/20 rounded-sm">
        <h2 className="font-heading text-lg font-medium text-text mb-2">
          {locale === "hi" ? "पायलट क्षेत्र: दरभंगा और मधुबनी" : "Active Pilot: Darbhanga & Madhubani"}
        </h2>
        <p className="text-xs text-secondary leading-relaxed mb-4 max-w-2xl">
          {locale === "hi"
            ? "हमारा पहला परिचालन बिहार के दरभंगा और मधुबनी जिलों में केंद्रित है, जहाँ 40 से अधिक सत्यापित स्थानीय नागरिक और कारीगर सक्रिय हैं। पूरे भारत में अन्य क्षेत्रों के लिए पंजीकरण चरणबद्ध तरीके से खोला जाएगा।"
            : "Operations are currently focused in Darbhanga and Madhubani districts (Bihar), where over 40 verified residents and artisans are active. Other Indian regions will open progressively."}
        </p>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/india/bihar/darbhanga"
            className="text-primary hover:underline"
          >
            {locale === "hi" ? "दरभंगा जिले के स्थानीय लोग" : "Darbhanga locals"} →
          </Link>
          <Link
            href="/india/bihar/madhubani"
            className="text-primary hover:underline"
          >
            {locale === "hi" ? "मधुबनी जिले के स्थानीय लोग" : "Madhubani locals"} →
          </Link>
        </div>
      </section>
    </div>
  );
}
