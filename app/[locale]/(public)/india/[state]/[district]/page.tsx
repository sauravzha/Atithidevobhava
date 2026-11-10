import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStateBySlug,
  getDistrictBySlug,
  getCities,
  slugify,
} from "@/lib/location/data";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";

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
          <li>
            <Link
              href={`/india/${slugify(state.name)}`}
              className="hover:text-primary transition-colors"
            >
              {locale === "hi" ? state.nameHi : state.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {locale === "hi" ? district.nameHi : district.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold tracking-wider uppercase text-secondary">
                {locale === "hi" ? "जिला निर्देशिका" : "District Directory"}
              </span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-xs text-secondary">
                LGD Code: {district.lgdCode}
              </span>
              {isPilot && (
                <>
                  <span className="text-xs text-secondary">•</span>
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-medium">
                    {locale === "hi" ? "सक्रिय पायलट जिला" : "Active Pilot District"}
                  </span>
                </>
              )}
            </div>

            <Bi
              hindi={district.nameHi}
              english={district.name}
              as="h1"
              className="mb-2"
            />

            <p className="text-sm text-secondary">
              {locale === "hi"
                ? `${state.nameHi} के अंतर्गत प्रशासनिक जिला। स्थानीय निवासियों से सीधे जुड़ें।`
                : `District in ${state.name}. Connect directly with verified residents and cultural hosts.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/explore/people?districtId=${district.id}`}
              className="tap-target px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
            >
              {locale === "hi" ? "स्थानीय लोग देखें" : "View Locals"}
            </Link>
            <Link
              href={`/explore/experiences?districtId=${district.id}`}
              className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {locale === "hi" ? "अनुभव देखें" : "View Experiences"}
            </Link>
          </div>
        </div>
      </header>

      {/* Legal or Permit Notice if needed */}
      {district.permitsNotice && (
        <div className="mb-8">
          <Notice variant="warning">
            <p className="text-xs leading-relaxed">
              <strong>
                {locale === "hi" ? "कानूनी अनुमति सूचना: " : "Legal Permit Advisory: "}
              </strong>
              {district.permitsNotice}
            </p>
          </Notice>
        </div>
      )}

      {/* Pilot District Cultural Profiles */}
      {isDarbhanga && (
        <section className="mb-12 p-6 border border-rule bg-warm/20 rounded-sm">
          <h2 className="font-heading text-xl font-medium text-text mb-3">
            {locale === "hi" ? "दरभंगा की सांस्कृतिक धरोहर" : "Cultural Profile: Darbhanga"}
          </h2>
          <div className="space-y-4 text-sm text-secondary leading-relaxed">
            <p>
              {locale === "hi"
                ? "दरभंगा मिथिला की ऐतिहासिक राजधानी रहा है। यह अपनी समृद्ध ध्रुपद संगीत परंपरा (दरभंगा घराना), संस्कृत पाण्डित्य, और महाराजा कामेश्वर सिंह के पुस्तकालय व ऐतिहासिक महलों के लिए पूरे भारत में प्रतिष्ठित है। जिले का दैनिक जीवन तालाबों, मखाना और मछली पालन, और आम-लीची के बगीचों से गहराई से जुड़ा हुआ है।"
                : "Darbhanga was the seat of the Raj Darbhanga and remains one of India's classical music capitals, home to the centuries-old Darbhanga Dhrupad tradition. Its civic landscape is defined by vast historic ponds (pokhari), water chestnut cultivation, makhana farming, and quiet scholastic institutions."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "बोली जाने वाली भाषाएं" : "Primary Languages"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "मैथिली, हिंदी, उर्दू" : "Maithili, Hindi, Urdu"}
                </span>
              </div>
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "विशिष्ट सांस्कृतिक पहचान" : "Key Traditions"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "ध्रुपद गायन, मखाना, विद्यापति पद" : "Dhrupad recital, Makhana processing"}
                </span>
              </div>
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "सत्यापित स्थानीय सदस्य" : "Active Verified Locals"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "24 सदस्य सक्रिय" : "24 residents active"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {isMadhubani && (
        <section className="mb-12 p-6 border border-rule bg-warm/20 rounded-sm">
          <h2 className="font-heading text-xl font-medium text-text mb-3">
            {locale === "hi" ? "मधुबनी की कला और ग्रामीण परंपरा" : "Cultural Profile: Madhubani"}
          </h2>
          <div className="space-y-4 text-sm text-secondary leading-relaxed">
            <p>
              {locale === "hi"
                ? "मधुबनी जिला अपनी विश्वप्रसिद्ध मिथिला चित्रकला (मधुबनी पेंटिंग) और सिक्की सुनहरी घास शिल्प का वैश्विक केंद्र है। जितवारपुर और रांटी गांवों में पीढ़ियों से महिलाएं अपने आंगनों और दीवारों पर प्राकृतिक रंगों से अनुष्ठानिक और लोक गाथाओं का अंकन करती रही हैं। यहाँ ग्रामीण जीवन शांत, सहयोगात्मक और प्रकृति के चक्रों से बंधा हुआ है।"
                : "Madhubani is globally celebrated for Mithila painting, traditionally practiced on mud-plastered walls and handmade paper. In villages like Jitwarpur and Ranti, family courtyards double as creative ateliers where natural mineral and vegetable dyes are prepared. Sikki golden grass weaving and community haats are woven into everyday life."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "बोली जाने वाली भाषाएं" : "Primary Languages"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "मैथिली, हिंदी" : "Maithili, Hindi"}
                </span>
              </div>
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "विशिष्ट सांस्कृतिक पहचान" : "Key Traditions"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "मिथिला चित्रकला, सिक्की घास, ग्रामीण हाट" : "Mithila wall art, Sikki weaving, rural haats"}
                </span>
              </div>
              <div className="p-3 border border-rule/80 bg-page rounded-sm">
                <span className="text-xs font-semibold text-text block mb-1">
                  {locale === "hi" ? "सत्यापित स्थानीय सदस्य" : "Active Verified Locals"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "hi" ? "18 सदस्य सक्रिय" : "18 residents active"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Administrative Towns and Localities */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-6">
          <h2 className="font-heading text-xl font-medium text-text">
            {locale === "hi" ? "प्रशासनिक नगर और निकाय" : "Administrative Towns & Municipalities"}
          </h2>
          <span className="text-xs text-secondary">
            {cities.length} {locale === "hi" ? "निकाय प्रलेखित" : "urban bodies mapped"}
          </span>
        </div>

        {cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="p-4 border border-rule rounded-sm hover:border-primary/40 transition-colors"
              >
                <h3 className="font-heading text-base font-medium text-text mb-1">
                  {locale === "hi" ? city.nameHi : city.name}
                </h3>
                <p className="text-xs text-secondary mb-2">
                  {locale === "hi" ? city.name : city.nameHi}
                </p>
                <div className="text-[11px] text-secondary">
                  LGD Code: {city.lgdCode}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-secondary italic">
            {locale === "hi"
              ? "इस जिले के कस्बों और नगर निकायों का आधिकारिक डेटा प्रलेखन जारी है।"
              : "Administrative urban bodies for this district are currently being indexed."}
          </p>
        )}
      </section>

      {/* Privacy and Public Safety Guarantee */}
      <section className="p-5 border border-rule rounded-sm bg-warm/10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
          {locale === "hi" ? "सुरक्षा और गोपनीयता सिद्धांत" : "Safety & Address Privacy Principle"}
        </h3>
        <p className="text-xs text-secondary leading-relaxed">
          {locale === "hi"
            ? "अतिथि देवो भव पर किसी भी स्थानीय नागरिक का निजी आवासीय पता या सटीक जीपीएस निर्देशांक कभी भी सार्वजनिक रूप से प्रदर्शित नहीं किया जाता है। सभी प्रारंभिक मुलाकातें अनुशंसित सार्वजनिक स्थानों (जैसे कैफ़े, मुख्य चौक या पुस्तकालय) पर आयोजित की जाती हैं। संपर्क विवरण केवल दोनों पक्षों की आपसी सहमति के बाद ही साझा किए जाते हैं।"
            : "Exact residential addresses and private GPS coordinates are never published on Atithi Devo Bhava. First meetings are always conducted in suggested public venues. Contact details are revealed strictly with mutual two-way consent."}
        </p>
      </section>
    </div>
  );
}
