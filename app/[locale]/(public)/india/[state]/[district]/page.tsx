import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getStateBySlug,
  getDistrictBySlug,
  getCities,
  slugify,
} from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";
import {
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface DistrictPageProps {
  params: Promise<{ locale: string; state: string; district: string }>;
}

export async function generateMetadata({
  params,
}: DistrictPageProps): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug, locale } = await params;
  const state = getStateBySlug(stateSlug);
  const district = state ? getDistrictBySlug(districtSlug, state.id) : undefined;

  if (!state || !district) {
    return { title: "District Not Found | Atithi Devo Bhava" };
  }

  const title =
    locale === "hi"
      ? `${district.nameHi} (${state.nameHi}) में स्थानीय लोग और अनुभव | Atithi Devo Bhava`
      : `Meet Locals in ${district.name}, ${state.name} | Atithi Devo Bhava`;

  return {
    title,
    description: `Connect with local people, families, and cultural hosts in ${district.name}, ${state.name}. Experience local hospitality and traditions.`,
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { locale, state: stateSlug, district: districtSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const district = state ? getDistrictBySlug(districtSlug, state.id) : undefined;

  if (!state || !district) {
    notFound();
  }

  const cities = getCities(district.id);
  const isDarbhanga = district.id === "dst-darbhanga";
  const isMadhubani = district.id === "dst-madhubani";
  const isPilot = isDarbhanga || isMadhubani;
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
            <Link href="/india" className="hover:text-primary transition-colors">
              {isHindi ? "भारत" : "India"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li>
            <Link
              href={`/india/${slugify(state.name)}`}
              className="hover:text-primary transition-colors"
            >
              {isHindi ? state.nameHi : state.name}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? district.nameHi : district.name}
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="border-b border-rule pb-10 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-secondary">
                {isHindi ? "जिला जनपद निर्देशिका" : "District Territory"}
              </span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-xs font-mono text-secondary">
                LGD: {district.lgdCode}
              </span>
              {isPilot && (
                <>
                  <span className="text-xs text-secondary">•</span>
                  <span className="heritage-stamp text-[10px] font-mono uppercase px-2 py-0.5 text-forest">
                    {isHindi ? "सक्रिय पायलट जनपद" : "Active Pilot District"}
                  </span>
                </>
              )}
            </div>

            <Bi
              hindi={district.nameHi}
              english={district.name}
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text mb-4 leading-tight"
            />

            <p className="text-base sm:text-lg text-secondary leading-relaxed font-heading">
              {isHindi
                ? `${state.nameHi} के अंतर्गत ऐतिहासिक जिला। स्थानीय निवासियों, कारीगर परिवारों और जीवित परंपराओं से सीधे जुड़ें।`
                : `Historic district in ${state.name}. Connect directly with verified residents, hereditary artisans, and cultural custodians.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/explore/people?districtId=${district.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-rule hover:border-secondary text-secondary hover:text-text rounded-sm text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{isHindi ? "स्थानीय लोग देखें" : "View Locals"}</span>
            </Link>
            <Link
              href={`/explore/experiences?districtId=${district.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isHindi ? "सांस्कृतिक अनुभव" : "View Experiences"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Legal or Permit Notice if needed */}
      {district.permitsNotice && (
        <div className="mb-8">
          <Notice variant="warning">
            <p className="text-xs leading-relaxed font-mono">
              <strong>
                {isHindi ? "कानूनी अनुमति सूचना: " : "Legal Permit Advisory: "}
              </strong>
              {district.permitsNotice}
            </p>
          </Notice>
        </div>
      )}

      {/* Darbhanga Cultural Feature Spread */}
      {isDarbhanga && (
        <section className="journal-paper border border-rule rounded-sm overflow-hidden mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-primary inline-block mb-3">
                  {isHindi ? "राज दरभंगा एवं संगीत घराना" : "The Raj Darbhanga Archive"}
                </span>

                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text mb-4">
                  {isHindi ? "ध्रुपद, संस्कृत विद्यापीठ और तालाबों का नगर" : "Seat of Classical Dhrupad & Royal Aquatic Architecture"}
                </h2>

                <p className="text-sm sm:text-base text-secondary leading-relaxed font-heading mb-6">
                  {isHindi
                    ? "दरभंगा मिथिला की ऐतिहासिक राजधानी रहा है। यह अपनी समृद्ध ध्रुपद संगीत परंपरा (दरभंगा घराना), संस्कृत पाण्डित्य, और महाराजा कामेश्वर सिंह के पुस्तकालय व ऐतिहासिक महलों के लिए पूरे भारत में प्रतिष्ठित है। जिले का दैनिक जीवन तालाबों, मखाना और मछली पालन, और आम-लीची के बगीचों से गहराई से जुड़ा हुआ है।"
                    : "Darbhanga was the seat of the Raj Darbhanga and remains one of India's classical music capitals, home to the centuries-old Darbhanga Dhrupad tradition. Its civic landscape is defined by vast historic ponds (pokhari), water chestnut cultivation, makhana farming, and quiet scholastic institutions."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rule/60 text-xs font-mono">
                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "संवाद भाषाएं" : "Languages"}
                    </span>
                    <span className="text-text font-medium">
                      {isHindi ? "मैथिली, हिंदी, उर्दू" : "Maithili, Hindi, Urdu"}
                    </span>
                  </div>

                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "विशिष्ट पहचान" : "Key Heritage"}
                    </span>
                    <span className="text-terracotta font-medium">
                      {isHindi ? "ध्रुपद, मखाना, लालबाग" : "Dhrupad & Makhana"}
                    </span>
                  </div>

                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "सत्यापित सदस्य" : "Active Locals"}
                    </span>
                    <span className="text-forest font-medium">
                      {isHindi ? "24 सक्रिय नागरिक" : "24 Verified Hosts"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rule flex items-center gap-3">
                <Link
                  href="/explore/experiences?districtId=dst-darbhanga"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary hover:underline"
                >
                  <span>{isHindi ? "दरभंगा के सभी अनुभव देखें" : "Explore Darbhanga Immersions"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:min-h-full lg:col-span-5 bg-warm/30 border-t lg:border-t-0 lg:border-l border-rule">
              <Image
                src="/images/darbhanga-palace-sketch.png"
                alt="Architectural etching of Darbhanga Raj palace facade"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-6"
              />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-[11px] font-mono text-secondary bg-surface/90 px-3 py-1 rounded-xs border border-rule">
                  {isHindi ? "राज दरभंगा ऐतिहासिक महल रेखांकन" : "Historical Line Sketch of Raj Palace Facade"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Madhubani Cultural Feature Spread */}
      {isMadhubani && (
        <section className="journal-paper border border-rule rounded-sm overflow-hidden mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-terracotta inline-block mb-3">
                  {isHindi ? "विश्वप्रसिद्ध मिथिला चित्रकला" : "Mithila Painting Epicentre"}
                </span>

                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text mb-4">
                  {isHindi ? "जितवारपुर, रांटी और जीवित लोक कला परंपरा" : "Village Courtyard Ateliers & Natural Pigment Dyes"}
                </h2>

                <p className="text-sm sm:text-base text-secondary leading-relaxed font-heading mb-6">
                  {isHindi
                    ? "मधुबनी जिला अपनी विश्वप्रसिद्ध मिथिला चित्रकला (मधुबनी पेंटिंग) और सिक्की सुनहरी घास शिल्प का वैश्विक केंद्र है। जितवारपुर और रांटी गांवों में पीढ़ियों से महिलाएं अपने आंगनों और दीवारों पर प्राकृतिक रंगों से अनुष्ठानिक और लोक गाथाओं का अंकन करती रही हैं। यहाँ ग्रामीण जीवन शांत, सहयोगात्मक और प्रकृति के चक्रों से बंधा हुआ है।"
                    : "Madhubani is globally celebrated for Mithila painting, traditionally practiced on mud-plastered walls and handmade paper. In villages like Jitwarpur and Ranti, family courtyards double as creative ateliers where natural mineral and vegetable dyes are prepared. Sikki golden grass weaving and community haats are woven into everyday life."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rule/60 text-xs font-mono">
                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "संवाद भाषाएं" : "Languages"}
                    </span>
                    <span className="text-text font-medium">
                      {isHindi ? "मैथिली, हिंदी" : "Maithili, Hindi"}
                    </span>
                  </div>

                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "विशिष्ट पहचान" : "Key Heritage"}
                    </span>
                    <span className="text-terracotta font-medium">
                      {isHindi ? "जितवारपुर कला, सिक्की घास" : "Mithila Art & Sikki"}
                    </span>
                  </div>

                  <div className="p-3 bg-surface border border-rule rounded-sm">
                    <span className="text-[10px] uppercase text-secondary block mb-1">
                      {isHindi ? "सत्यापित सदस्य" : "Active Locals"}
                    </span>
                    <span className="text-forest font-medium">
                      {isHindi ? "18 सक्रिय नागरिक" : "18 Verified Hosts"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rule flex items-center gap-3">
                <Link
                  href="/explore/experiences?districtId=dst-madhubani"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terracotta hover:underline"
                >
                  <span>{isHindi ? "मधुबनी के सभी अनुभव देखें" : "Explore Madhubani Immersions"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:min-h-full lg:col-span-5 bg-warm/30 border-t lg:border-t-0 lg:border-l border-rule">
              <Image
                src="/images/village-landscape-etching.png"
                alt="Traditional village landscape etching of rural Mithila"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-6"
              />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-[11px] font-mono text-secondary bg-surface/90 px-3 py-1 rounded-xs border border-rule">
                  {isHindi ? "पारंपरिक मिथिला ग्रामीण परिदृश्य रेखांकन" : "Rural Mithila Landscape Etching"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Administrative Towns and Localities */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between border-b border-rule pb-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-1">
              {isHindi ? "नागरिक निकाय" : "Administrative Mapping"}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-medium text-text">
              {isHindi ? "प्रशासनिक नगर और निकाय" : "Administrative Towns & Municipalities"}
            </h2>
          </div>
          <span className="text-xs font-mono text-secondary">
            {cities.length} {isHindi ? "निकाय प्रलेखित" : "urban bodies mapped"}
          </span>
        </div>

        {cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="journal-paper p-5 border border-rule rounded-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-heading text-lg font-medium text-text mb-1">
                    {isHindi ? city.nameHi : city.name}
                  </h3>
                  <p className="text-xs text-secondary font-mono mb-2">
                    {isHindi ? city.name : city.nameHi}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-terracotta pt-2 border-t border-rule/50">
                  LGD Code: {city.lgdCode}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-secondary italic font-heading">
            {isHindi
              ? "इस जिले के कस्बों और नगर निकायों का आधिकारिक डेटा प्रलेखन जारी है।"
              : "Administrative urban bodies for this district are currently being indexed."}
          </p>
        )}
      </section>

      {/* Privacy and Public Safety Guarantee */}
      <footer className="journal-paper p-6 sm:p-8 border border-rule rounded-sm bg-warm/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-forest text-xs font-mono uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>{isHindi ? "सुरक्षा और आवासीय गोपनीयता सिद्धांत" : "Centroid Privacy Protocol"}</span>
          </div>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-heading">
            {isHindi
              ? "अतिथि देवो भव पर किसी भी स्थानीय नागरिक का निजी आवासीय पता या सटीक जीपीएस निर्देशांक कभी भी सार्वजनिक रूप से प्रदर्शित नहीं किया जाता है। सभी प्रारंभिक मुलाकातें अनुशंसित सार्वजनिक स्थानों (जैसे कैफ़े, मुख्य चौक या पुस्तकालय) पर आयोजित की जाती हैं।"
              : "Exact residential addresses and private GPS coordinates are never published. All initial interactions occur in vetted public venues, protecting host families and visitors."}
          </p>
        </div>

        <Link
          href="/safety"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-rule hover:border-secondary text-secondary hover:text-text rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shrink-0"
        >
          <span>{isHindi ? "सुरक्षा दिशानिर्देश" : "Safety Standards"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </div>
  );
}
