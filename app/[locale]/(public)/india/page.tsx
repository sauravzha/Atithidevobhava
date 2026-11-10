import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_STATES, getDistricts, slugify } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Regions of India | भारत के राज्य और क्षेत्र - Atithi Devo Bhava",
  description:
    "Explore Indian states and union territories. Discover local communities, resident hosts, and cultural heritage across India.",
};

export default async function IndiaDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const states = OFFICIAL_STATES.filter((s) => s.kind === "state");
  const unionTerritories = OFFICIAL_STATES.filter((s) => s.kind === "union_territory");

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
              {locale === "hi" ? "भारत" : "India"}
            </li>
          </ol>
        </nav>

        <Bi
          hindi="भारत के राज्य और केंद्र शासित प्रदेश"
          english="States and Union Territories of India"
          as="h1"
          className="mb-3"
        />
        <p className="font-heading text-lg text-secondary max-w-prose">
          {locale === "hi"
            ? "आधिकारिक स्थानीय शासन निर्देशिका (LGD) के आधार पर व्यवस्थित। स्थानीय लोगों से जुड़ने के लिए अपना गंतव्य चुनें।"
            : "Organised according to the official Local Government Directory (LGD). Select a state or territory to explore resident communities."}
        </p>
      </header>

      {/* Pilot Region Callout */}
      <section className="mb-12 p-6 border border-primary/20 bg-warm/30 rounded-sm">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-1 block">
            {locale === "hi" ? "सक्रिय पायलट क्षेत्र" : "Active Pilot Region"}
          </span>
          <h2 className="font-heading text-xl font-medium text-text mb-2">
            {locale === "hi" ? "बिहार: मिथिला अंचल (दरभंगा और मधुबनी)" : "Bihar: Mithila Region (Darbhanga & Madhubani)"}
          </h2>
          <p className="text-sm text-secondary leading-relaxed mb-4">
            {locale === "hi"
              ? "हमारा पहला चरण दरभंगा और मधुबनी जिलों में 40 से अधिक सत्यापित स्थानीय सदस्यों और परिवारों के साथ सक्रिय है। यहां मिथिला चित्रकला, मखाना की खेती, सुप्रसिद्ध ध्रुपद गायन और पारिवारिक भोजन का सीधा अनुभव उपलब्ध है।"
              : "Our initial focus is active in Darbhanga and Madhubani districts with over 40 verified residents and artisan families. Experience Mithila painting, makhana farming, traditional Dhrupad music, and home hospitality."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/india/bihar/darbhanga"
              className="tap-target px-4 py-2 bg-primary text-white text-xs font-medium rounded-sm hover:bg-primary-hover transition-colors"
            >
              {locale === "hi" ? "दरभंगा जिला देखें" : "Explore Darbhanga District"}
            </Link>
            <Link
              href="/india/bihar/madhubani"
              className="tap-target px-4 py-2 border border-primary text-primary text-xs font-medium rounded-sm hover:bg-warm transition-colors"
            >
              {locale === "hi" ? "मधुबनी जिला देखें" : "Explore Madhubani District"}
            </Link>
          </div>
        </div>
      </section>

      {/* 28 States Directory */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "28 राज्य" : "28 States"}
          </h2>
          <span className="text-xs text-secondary">
            {locale === "hi" ? "आधिकारिक सूची" : "Official Census and LGD index"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.map((state) => {
            const stateDistricts = getDistricts(state.id);
            const hasActiveMembers = (state.activeHostsCount ?? 0) > 0;

            return (
              <div
                key={state.id}
                className="p-4 border border-rule rounded-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      href={`/india/${slugify(state.name)}`}
                      className="font-heading text-base font-medium text-text hover:text-primary transition-colors"
                    >
                      {locale === "hi" ? state.nameHi : state.name}
                    </Link>
                    {hasActiveMembers && (
                      <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-medium">
                        {locale === "hi" ? "सक्रिय" : "Active"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary mb-3">
                    {locale === "hi" ? state.name : state.nameHi}
                  </p>
                </div>

                <div className="pt-3 border-t border-rule/60 flex items-center justify-between text-xs text-secondary">
                  <span>
                    {stateDistricts.length > 0
                      ? `${stateDistricts.length} ${locale === "hi" ? "जिले सूचीबद्ध" : "districts mapped"}`
                      : locale === "hi" ? "विस्तार में" : "Expanding soon"}
                  </span>
                  <Link
                    href={`/india/${slugify(state.name)}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {locale === "hi" ? "विवरण" : "View"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Union Territories */}
      <section>
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "8 केंद्र शासित प्रदेश" : "8 Union Territories"}
          </h2>
          <span className="text-xs text-secondary">
            {locale === "hi" ? "संघ राज्य क्षेत्र" : "Union Territories"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unionTerritories.map((ut) => (
            <div
              key={ut.id}
              className="p-4 border border-rule rounded-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <Link
                  href={`/india/${slugify(ut.name)}`}
                  className="font-heading text-base font-medium text-text hover:text-primary transition-colors block mb-1"
                >
                  {locale === "hi" ? ut.nameHi : ut.name}
                </Link>
                <p className="text-xs text-secondary mb-3">
                  {locale === "hi" ? ut.name : ut.nameHi}
                </p>
              </div>

              <div className="pt-3 border-t border-rule/60 flex items-center justify-between text-xs text-secondary">
                <span className="text-[11px] text-secondary">
                  {locale === "hi" ? "पंजीकरण शीघ्र" : "Registration opening soon"}
                </span>
                <Link
                  href={`/india/${slugify(ut.name)}`}
                  className="text-primary hover:underline font-medium"
                >
                  {locale === "hi" ? "विवरण" : "View"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
