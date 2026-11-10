import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, getDistricts, slugify } from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";

interface StatePageProps {
  params: Promise<{ locale: string; state: string }>;
}

export async function generateMetadata({
  params,
}: StatePageProps): Promise<Metadata> {
  const { state: stateSlug, locale } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    return { title: "Region Not Found | Atithi Devo Bhava" };
  }

  const title =
    locale === "hi"
      ? `${state.nameHi} में स्थानीय लोग और सांस्कृतिक अनुभव | Atithi Devo Bhava`
      : `Meet Locals and Cultural Experiences in ${state.name} | Atithi Devo Bhava`;

  return {
    title,
    description: `Connect with local residents, families, and cultural hosts in ${state.name} (${state.nameHi}). Verified community hospitality.`,
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { locale, state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const districts = getDistricts(state.id);
  const isBihar = state.id === "st-br";

  return (
    <div className="site-container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-secondary mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {locale === "hi" ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/india" className="hover:text-primary transition-colors">
              {locale === "hi" ? "भारत" : "India"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {locale === "hi" ? state.nameHi : state.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-secondary block mb-1">
              {state.kind === "state"
                ? locale === "hi" ? "राज्य (LGD कोड: " + state.lgdCode + ")" : "State (LGD Code: " + state.lgdCode + ")"
                : locale === "hi" ? "केंद्र शासित प्रदेश (LGD कोड: " + state.lgdCode + ")" : "Union Territory (LGD Code: " + state.lgdCode + ")"}
            </span>
            <Bi
              hindi={state.nameHi}
              english={state.name}
              as="h1"
              className="mb-2"
            />
            <p className="text-sm text-secondary">
              {locale === "hi"
                ? `${state.nameHi} में सत्यापित स्थानीय निवासियों, कारीगर परिवारों और सांस्कृतिक मेजबानों से जुड़ें।`
                : `Connect with verified residents, artisan families, and cultural hosts across ${state.name}.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/explore/people?stateId=${state.id}`}
              className="tap-target px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
            >
              {locale === "hi" ? "स्थानीय लोग देखें" : "View Locals"}
            </Link>
            <Link
              href={`/explore/experiences?stateId=${state.id}`}
              className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {locale === "hi" ? "अनुभव देखें" : "View Experiences"}
            </Link>
          </div>
        </div>
      </header>

      {/* Bihar Pilot Callout */}
      {isBihar && (
        <section className="mb-12 p-6 border border-primary/20 bg-warm/30 rounded-sm">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-1 block">
            {locale === "hi" ? "प्राथमिक पायलट क्षेत्र" : "Primary Pilot Region"}
          </span>
          <h2 className="font-heading text-xl font-medium text-text mb-2">
            {locale === "hi" ? "मिथिला सांस्कृतिक अंचल" : "The Mithila Cultural Landscape"}
          </h2>
          <p className="text-sm text-secondary leading-relaxed mb-4 max-w-3xl">
            {locale === "hi"
              ? "बिहार में हमारे प्रारंभिक परिचालन दरभंगा और मधुबनी जिलों पर केंद्रित हैं। यह क्षेत्र अपनी 2,500 वर्ष पुरानी कला परंपराओं, मैथिली भाषा, राज दरभंगा की स्थापत्य धरोहर, और सौहार्दपूर्ण पारिवारिक आतिथ्य के लिए जाना जाता है। 40 से अधिक स्थानीय नागरिक यहां आगंतुकों से मिलने और अपनी संस्कृति साझा करने के लिए तैयार हैं।"
              : "Operations in Bihar are currently focused on Darbhanga and Madhubani districts. Known for its ancient Mithila art traditions, Maithili literary heritage, Raj Darbhanga architecture, and hospitable family households, over 40 residents are active here to meet travelers and share cultural knowledge."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <Link
              href="/india/bihar/darbhanga"
              className="p-4 border border-rule bg-page rounded-sm hover:border-primary transition-colors"
            >
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {locale === "hi" ? "दरभंगा जिला" : "Darbhanga District"}
              </h3>
              <p className="text-xs text-secondary">
                {locale === "hi"
                  ? "ध्रुपद संगीत, ऐतिहासिक महल, तालाब और मखाना की खेती"
                  : "Dhrupad music, historic palaces, waterbodies, and foxnut farming"}
              </p>
            </Link>
            <Link
              href="/india/bihar/madhubani"
              className="p-4 border border-rule bg-page rounded-sm hover:border-primary transition-colors"
            >
              <h3 className="font-heading text-base font-medium text-text mb-1">
                {locale === "hi" ? "मधुबनी जिला" : "Madhubani District"}
              </h3>
              <p className="text-xs text-secondary">
                {locale === "hi"
                  ? "जितवारपुर और रांटी की मिथिला चित्रकला, सिक्की घास शिल्प"
                  : "Mithila wall and paper art in Jitwarpur and Ranti, Sikki grass weaving"}
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* Districts List */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "जिले" : "Districts"}
          </h2>
          <span className="text-xs text-secondary">
            {districts.length > 0
              ? `${districts.length} ${locale === "hi" ? "जिले प्रलेखित" : "districts mapped"}`
              : locale === "hi" ? "विस्तार की तैयारी" : "Mapping in progress"}
          </span>
        </div>

        {districts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts.map((district) => (
              <div
                key={district.id}
                className="p-5 border border-rule rounded-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      href={`/india/${slugify(state.name)}/${slugify(district.name)}`}
                      className="font-heading text-base font-medium text-text hover:text-primary transition-colors"
                    >
                      {locale === "hi" ? district.nameHi : district.name}
                    </Link>
                    <span className="text-[11px] text-secondary">
                      LGD: {district.lgdCode}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mb-3">
                    {locale === "hi" ? district.name : district.nameHi}
                  </p>
                  <p className="text-xs text-secondary/80">
                    {locale === "hi"
                      ? `केंद्र निर्देशांक: ${district.centroidLat.toFixed(2)}°N, ${district.centroidLng.toFixed(2)}°E`
                      : `Centroid: ${district.centroidLat.toFixed(2)}°N, ${district.centroidLng.toFixed(2)}°E`}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-rule/60 flex items-center justify-between text-xs">
                  <Link
                    href={`/india/${slugify(state.name)}/${slugify(district.name)}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {locale === "hi" ? "जिला प्रोफ़ाइल देखें" : "View District Profile"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-rule rounded-sm text-center max-w-lg mx-auto">
            <h3 className="font-heading text-base font-medium text-text mb-2">
              {locale === "hi" ? "पंजीकरण शीघ्र प्रारंभ होगा" : "Registration Opening Soon"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              {locale === "hi"
                ? `${state.nameHi} के लिए आधिकारिक प्रशासनिक सीमाओं और स्थानीय नियमों का सत्यापन जारी है। जैसे ही स्थानीय सदस्य जुड़ेंगे, यह सूची अद्यतित की जाएगी।`
                : `Official administrative boundaries and local guidelines for ${state.name} are currently being verified. Districts will become active as resident communities onboard.`}
            </p>
            <Link
              href="/become-a-host"
              className="inline-block text-xs text-primary font-medium hover:underline"
            >
              {locale === "hi" ? "स्थानीय सदस्य बनने के लिए आवेदन करें" : "Apply to become an early local host"}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
