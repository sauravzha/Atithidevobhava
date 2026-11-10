import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Bi } from "@/components/ui/bi";
import { UnifiedSearch } from "@/components/search/unified-search";
import { OFFICIAL_STATES } from "@/lib/location/data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";
  const t = await getTranslations("hero");
  const tThreeWays = await getTranslations("threeWays");
  const tInterests = await getTranslations("interests");
  const tStates = await getTranslations("statesSection");
  const tExp = await getTranslations("recentExperiences");
  const tComm = await getTranslations("communitySection");
  const tStays = await getTranslations("staysSection");
  const tHow = await getTranslations("howItWorksSection");
  const tTrust = await getTranslations("trustSection");
  const tHost = await getTranslations("becomeHostSection");

  // The 12 Cultural Categories from Section 7
  const culturalCategories = [
    { slug: "indian-food-and-cooking", en: "Indian food and cooking", hi: "भारतीय खान-पान और पाक कला", count: 6 },
    { slug: "village-life", en: "Village life", hi: "ग्रामीण जीवन और परंपरा", count: 8 },
    { slug: "art-and-handicrafts", en: "Art and handicrafts", hi: "कला और हस्तशिल्प (मिथिला चित्रकला)", count: 12 },
    { slug: "history-and-heritage", en: "History and heritage", hi: "इतिहास और धरोहर", count: 4 },
    { slug: "local-markets", en: "Local markets", hi: "स्थानीय बाज़ार भ्रमण", count: 5 },
    { slug: "traditional-festivals", en: "Traditional festivals", hi: "पारंपरिक उत्सव और मेले", count: 2 },
    { slug: "music-and-dance", en: "Music and dance", hi: "संगीत और लोक नृत्य", count: 3 },
    { slug: "spiritual-and-cultural", en: "Spiritual and cultural experiences", hi: "आध्यात्मिक और सांस्कृतिक अनुभव", count: 4 },
    { slug: "nature-and-rural", en: "Nature and rural experiences", hi: "प्रकृति और ग्रामीण परिवेश", count: 3 },
    { slug: "language-and-exchange", en: "Language and cultural exchange", hi: "भाषा और सांस्कृतिक संवाद", count: 5 },
    { slug: "photography-walks", en: "Photography walks", hi: "फ़ोटोग्राफ़ी पदयात्रा", count: 2 },
    { slug: "local-city-exploration", en: "Local city exploration", hi: "स्थानीय नगर दर्शन", count: 4 },
  ];

  // States with inventory first
  const statesWithInventory = OFFICIAL_STATES.filter((s) => (s.activeHostsCount ?? 0) > 0);

  return (
    <div className="site-container py-8 sm:py-12 space-y-16">
      {/* ==================================================================== */}
      {/* HERO SECTION: Asymmetric 7-column left / 5-column right grid        */}
      {/* ==================================================================== */}
      <section className="grid-12 items-start pt-4 sm:pt-8 pb-12 border-b border-rule">
        <div className="col-7 space-y-6">
          <Bi
            hindi="भारत को लोगों के साथ महसूस कीजिए।"
            english="Experience India through its people."
            as="h1"
            className="text-2xl sm:text-4xl lg:text-5xl"
          />

          <p className="font-body text-sm sm:text-base text-text leading-relaxed max-w-prose">
            {t("description")}
          </p>

          <div className="pt-2">
            <UnifiedSearch />
          </div>
        </div>

        <div className="col-5 hidden md:block pl-0 lg:pl-8">
          <div className="border border-rule rounded-sm p-6 bg-surface space-y-4">
            <span className="text-xs font-mono text-forest uppercase tracking-wider block">
              {isHindi ? "पायलट क्षेत्र · Pilot Region" : "Pilot Region"}
            </span>
            <h2 className="font-heading font-medium text-xl text-text">
              {isHindi ? "दरभंगा और मधुबनी (बिहार)" : "Darbhanga & Madhubani (Bihar)"}
            </h2>
            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "हमारी प्रारंभिक यात्रा उत्तरी बिहार के मिथिला सांस्कृतिक क्षेत्र से शुरू होती है। प्राचीन तालाबों, पारंपरिक मिथिला चित्रकला, और मैथिली आतिथ्य का सीधे स्थानीय परिवारों के साथ अनुभव करें।"
                : "Our initial community operations begin in the Mithila cultural belt of Northern Bihar. Experience historic pond heritage, centuries-old Mithila painting, and family hospitality directly with local residents."}
            </p>
            <div className="pt-2 border-t border-rule flex items-center justify-between text-xs">
              <span className="text-secondary font-mono">30-50 Verified Hosts</span>
              <Link
                href="/india/bihar/darbhanga"
                className="text-primary hover:underline font-medium"
              >
                {isHindi ? "क्षेत्र देखें →" : "View region →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 1. THREE WAYS TO EXPERIENCE INDIA: Three full-width ruled rows       */}
      {/* ==================================================================== */}
      <section aria-labelledby="three-ways-title">
        <div className="pb-4 mb-2">
          <Bi
            hindi={tThreeWays("titleHi")}
            english={tThreeWays("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>

        <div className="divide-y divide-rule border-y border-rule">
          {/* Row 1: Meet a local */}
          <div className="py-6 grid-12 items-baseline gap-4">
            <div className="col-4 flex items-baseline gap-3">
              <span className="font-mono text-xs text-terracotta font-medium">01</span>
              <div>
                <h3 className="font-heading font-medium text-lg text-text">
                  <span lang="hi" className="block text-sm text-secondary font-normal">
                    {tThreeWays("way1TitleHi")}
                  </span>
                  {tThreeWays("way1Title")}
                </h3>
              </div>
            </div>
            <div className="col-6">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tThreeWays("way1Desc")}
              </p>
            </div>
            <div className="col-2 text-left sm:text-right">
              <Link
                href="/explore/people"
                className="tap-target inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                {tThreeWays("way1Link")} →
              </Link>
            </div>
          </div>

          {/* Row 2: Explore with a local */}
          <div className="py-6 grid-12 items-baseline gap-4">
            <div className="col-4 flex items-baseline gap-3">
              <span className="font-mono text-xs text-terracotta font-medium">02</span>
              <div>
                <h3 className="font-heading font-medium text-lg text-text">
                  <span lang="hi" className="block text-sm text-secondary font-normal">
                    {tThreeWays("way2TitleHi")}
                  </span>
                  {tThreeWays("way2Title")}
                </h3>
              </div>
            </div>
            <div className="col-6">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tThreeWays("way2Desc")}
              </p>
            </div>
            <div className="col-2 text-left sm:text-right">
              <Link
                href="/explore/experiences"
                className="tap-target inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                {tThreeWays("way2Link")} →
              </Link>
            </div>
          </div>

          {/* Row 3: Stay with a local */}
          <div className="py-6 grid-12 items-baseline gap-4">
            <div className="col-4 flex items-baseline gap-3">
              <span className="font-mono text-xs text-terracotta font-medium">03</span>
              <div>
                <h3 className="font-heading font-medium text-lg text-text">
                  <span lang="hi" className="block text-sm text-secondary font-normal">
                    {tThreeWays("way3TitleHi")}
                  </span>
                  {tThreeWays("way3Title")}
                </h3>
              </div>
            </div>
            <div className="col-6">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tThreeWays("way3Desc")}
              </p>
            </div>
            <div className="col-2 text-left sm:text-right">
              <span className="inline-block border border-rule px-2 py-1 text-xs text-secondary rounded-sm">
                {tThreeWays("way3Status")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BY INTEREST: Ruled two-column list of the 12 categories          */}
      {/* ==================================================================== */}
      <section aria-labelledby="interests-title" className="pt-8 border-t border-rule">
        <div className="pb-6">
          <Bi
            hindi={tInterests("titleHi")}
            english={tInterests("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
          <p className="font-body text-xs text-secondary mt-1">
            {tInterests("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-y border-rule divide-y md:divide-y-0 divide-rule">
          <div className="divide-y divide-rule">
            {culturalCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="py-4 flex items-center justify-between group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <div>
                  <span lang="hi" className="block text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                    {cat.hi}
                  </span>
                  <span className="font-heading font-medium text-sm sm:text-base text-text group-hover:text-primary transition-colors duration-[120ms]">
                    {cat.en}
                  </span>
                </div>
                <span className="font-mono text-xs text-secondary">
                  {cat.count} listings
                </span>
              </Link>
            ))}
          </div>

          <div className="divide-y divide-rule">
            {culturalCategories.slice(6, 12).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="py-4 flex items-center justify-between group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <div>
                  <span lang="hi" className="block text-xs text-secondary group-hover:text-primary transition-colors duration-[120ms]">
                    {cat.hi}
                  </span>
                  <span className="font-heading font-medium text-sm sm:text-base text-text group-hover:text-primary transition-colors duration-[120ms]">
                    {cat.en}
                  </span>
                </div>
                <span className="font-mono text-xs text-secondary">
                  {cat.count} listings
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. BY STATE: Ruled table of states with live host & exp counts     */}
      {/* ==================================================================== */}
      <section aria-labelledby="states-table-title" className="pt-8 border-t border-rule">
        <div className="pb-6">
          <Bi
            hindi={tStates("titleHi")}
            english={tStates("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>

        <div className="border border-rule rounded-sm overflow-x-auto bg-surface">
          <table className="w-full text-left font-body text-xs">
            <thead className="border-b border-rule bg-page text-secondary uppercase font-medium">
              <tr>
                <th className="p-3.5">{tStates("colState")}</th>
                <th className="p-3.5 text-center">{tStates("colHosts")}</th>
                <th className="p-3.5 text-center">{tStates("colExperiences")}</th>
                <th className="p-3.5 text-right">{tStates("colAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {statesWithInventory.map((st) => (
                <tr key={st.id} className="hover:bg-warm-grey/30 transition-colors duration-[120ms]">
                  <td className="p-3.5">
                    <span lang="hi" className="block text-secondary text-xs">
                      {st.nameHi}
                    </span>
                    <span className="font-heading font-medium text-sm text-text">
                      {st.name}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono font-medium">
                    {st.activeHostsCount ?? 0}
                  </td>
                  <td className="p-3.5 text-center font-mono font-medium">
                    {st.publishedExperiencesCount ?? 0}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/india/${st.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="tap-target px-3 py-1 border border-rule hover:border-secondary rounded-sm font-medium text-primary hover:underline"
                    >
                      {isHindi ? "ज़िले देखें →" : "View districts →"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. EXPERIENCES: Latest real published experiences (honest empty state)*/}
      {/* ==================================================================== */}
      <section aria-labelledby="recent-exp-title" className="pt-8 border-t border-rule">
        <div className="pb-4 flex items-center justify-between">
          <Bi
            hindi={tExp("titleHi")}
            english={tExp("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
          <Link
            href="/explore/experiences"
            className="text-xs font-medium text-primary hover:underline"
          >
            {isHindi ? "सभी अनुभव देखें →" : "View all experiences →"}
          </Link>
        </div>

        <div className="border border-rule rounded-sm p-8 bg-surface text-center">
          <p className="font-body text-xs text-secondary max-w-prose mx-auto leading-relaxed">
            {tExp("emptyState")}
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. LOCAL COMMUNITY: Members who chose public visibility             */}
      {/* ==================================================================== */}
      <section aria-labelledby="community-title" className="pt-8 border-t border-rule">
        <div className="pb-4 flex items-center justify-between">
          <Bi
            hindi={tComm("titleHi")}
            english={tComm("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
          <Link
            href="/explore/people"
            className="text-xs font-medium text-primary hover:underline"
          >
            {isHindi ? "नागरिक निर्देशिका →" : "Member directory →"}
          </Link>
        </div>

        <div className="border border-rule rounded-sm p-8 bg-surface text-center">
          <p className="font-body text-xs text-secondary max-w-prose mx-auto leading-relaxed">
            {tComm("emptyState")}
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. STAY WITH A LOCAL: One paragraph, honest status                   */}
      {/* ==================================================================== */}
      <section aria-labelledby="stays-status-title" className="pt-8 border-t border-rule">
        <div className="pb-4">
          <Bi
            hindi={tStays("titleHi")}
            english={tStays("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>
        <div className="border-l-2 border-primary pl-4 py-2 bg-surface">
          <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
            {tStays("status")}
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. HOW IT WORKS: Three plain numbered rows (Discover, Connect, Exp)  */}
      {/* ==================================================================== */}
      <section aria-labelledby="how-it-works-title" className="pt-8 border-t border-rule">
        <div className="pb-6">
          <Bi
            hindi={tHow("titleHi")}
            english={tHow("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>

        <div className="divide-y divide-rule border-y border-rule">
          <div className="py-6 grid-12 items-baseline">
            <div className="col-4">
              <span lang="hi" className="block text-xs text-secondary font-medium">
                {tHow("step1TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step1Title")}
              </h3>
            </div>
            <div className="col-8">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tHow("step1Desc")}
              </p>
            </div>
          </div>

          <div className="py-6 grid-12 items-baseline">
            <div className="col-4">
              <span lang="hi" className="block text-xs text-secondary font-medium">
                {tHow("step2TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step2Title")}
              </h3>
            </div>
            <div className="col-8">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tHow("step2Desc")}
              </p>
            </div>
          </div>

          <div className="py-6 grid-12 items-baseline">
            <div className="col-4">
              <span lang="hi" className="block text-xs text-secondary font-medium">
                {tHow("step3TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step3Title")}
              </h3>
            </div>
            <div className="col-8">
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tHow("step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. TRUST AND SAFETY: Short paragraph and link to Safety page         */}
      {/* ==================================================================== */}
      <section aria-labelledby="trust-safety-title" className="pt-8 border-t border-rule">
        <div className="pb-4">
          <Bi
            hindi={tTrust("titleHi")}
            english={tTrust("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>
        <div className="grid-12 items-baseline">
          <div className="col-8">
            <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
              {tTrust("desc")}
            </p>
          </div>
          <div className="col-4 text-left sm:text-right pt-2 sm:pt-0">
            <Link
              href="/safety"
              className="tap-target px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm text-xs font-medium transition-colors duration-[120ms] inline-block"
            >
              {tTrust("link")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 9. BECOME A HOST: One paragraph and link                             */}
      {/* ==================================================================== */}
      <section aria-labelledby="become-host-title" className="pt-8 border-t border-rule">
        <div className="pb-4">
          <Bi
            hindi={tHost("titleHi")}
            english={tHost("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>
        <div className="grid-12 items-baseline">
          <div className="col-8">
            <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
              {tHost("desc")}
            </p>
          </div>
          <div className="col-4 text-left sm:text-right pt-2 sm:pt-0">
            <Link
              href="/become-a-host"
              className="tap-target px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-sm text-xs font-medium transition-colors duration-[120ms] inline-block"
            >
              {tHost("link")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10. STORIES FROM INDIA: Hidden or honest notice if none yet          */}
      {/* ==================================================================== */}
      <section aria-labelledby="stories-title" className="pt-8 border-t border-rule">
        <div className="pb-4">
          <Bi
            hindi="भारत से संस्मरण"
            english="Stories from India"
            as="h2"
            className="text-xl sm:text-2xl"
          />
        </div>
        <p className="font-body text-xs text-secondary leading-relaxed max-w-prose">
          Editorial articles and community stories will appear here as regional writers and cultural participants publish their accounts.
        </p>
      </section>
    </div>
  );
}
