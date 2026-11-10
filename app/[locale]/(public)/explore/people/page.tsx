import type { Metadata } from "next";
import Link from "next/link";
import { PILOT_LOCALS } from "@/lib/data/pilot-locals";
import { Bi } from "@/components/ui/bi";

export const metadata: Metadata = {
  title: "Meet a Local Resident | स्थानीय निवासियों से मिलें - Atithi Devo Bhava",
  description:
    "Connect with verified Indian residents for tea, walking tours, market visits, and language exchange. Respectful, non-commercial community hospitality.",
};

interface PeoplePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    stateId?: string;
    districtId?: string;
    meetupType?: string;
    language?: string;
  }>;
}

export default async function PeopleDirectoryPage({
  params,
  searchParams,
}: PeoplePageProps) {
  const { locale } = await params;
  const { stateId, districtId, meetupType, language } = await searchParams;

  // Filter pilot locals
  let filteredLocals = [...PILOT_LOCALS];

  if (stateId) {
    filteredLocals = filteredLocals.filter((l) => l.stateId === stateId);
  }

  if (districtId) {
    filteredLocals = filteredLocals.filter((l) => l.districtId === districtId);
  }

  if (meetupType) {
    filteredLocals = filteredLocals.filter((l) =>
      l.meetupTypes.includes(meetupType as any)
    );
  }

  if (language) {
    const langLower = language.toLowerCase();
    filteredLocals = filteredLocals.filter((l) =>
      l.languages.some((lang) => lang.toLowerCase().includes(langLower))
    );
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
            {isHindi ? "स्थानीय निवासी" : "Meet a Local"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
              {isHindi ? "माध्यम 1: स्थानीय निवासी से मिलें" : "Product A: Meet a Local"}
            </span>
            <Bi
              hindi="सत्यापित स्थानीय नागरिक"
              english="Verified Local Residents"
              as="h1"
              className="mb-2"
            />
            <p className="text-sm text-secondary max-w-prose">
              {isHindi
                ? "चाय, भाषा संवाद, बाज़ार भ्रमण या मोहल्ला वॉक के लिए स्थानीय निवासियों से संपर्क करें। यह कोई व्यावसायिक सेवा नहीं है।"
                : "Connect with local residents for informal conversation, tea, market walks, or language exchange. Non-commercial by default."}
            </p>
          </div>

          <div className="text-xs text-secondary bg-warm/20 p-3 border border-rule rounded-sm max-w-xs">
            <span className="font-semibold text-text block mb-1">
              {isHindi ? "सार्वजनिक बैठक नियम" : "Public Meeting Protocol"}
            </span>
            {isHindi
              ? "पहली मुलाकात हमेशा सार्वजनिक स्थानों पर आयोजित की जाती है। फ़ोन नंबर दोनों पक्षों की सहमति के बाद ही दिखता है।"
              : "First meetings are always held in public places. Contact numbers are revealed strictly with mutual consent."}
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <section className="mb-8 p-4 border border-rule rounded-sm bg-warm/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-text">
              {isHindi ? "फ़िल्टर:" : "Filter:"}
            </span>
            <Link
              href="/explore/people"
              className={`px-3 py-1.5 rounded-sm border ${
                !districtId
                  ? "bg-primary text-white border-primary"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "सभी जिले" : "All Districts"}
            </Link>
            <Link
              href="/explore/people?districtId=dst-darbhanga"
              className={`px-3 py-1.5 rounded-sm border ${
                districtId === "dst-darbhanga"
                  ? "bg-primary text-white border-primary"
                  : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "दरभंगा" : "Darbhanga"}
            </Link>
            <Link
              href="/explore/people?districtId=dst-madhubani"
              className={`px-3 py-1.5 rounded-sm border ${
                districtId === "dst-madhubani"
                  ? "bg-primary text-white border-primary"
                : "border-rule text-secondary hover:text-text"
              }`}
            >
              {isHindi ? "मधुबनी" : "Madhubani"}
            </Link>
          </div>

          <span className="text-xs text-secondary">
            {filteredLocals.length} {isHindi ? "स्थानीय सदस्य सक्रिय" : "active residents"}
          </span>
        </div>
      </section>

      {/* Local Profiles List */}
      <section className="mb-14">
        {filteredLocals.length > 0 ? (
          <div className="divide-y divide-rule border-t border-b border-rule">
            {filteredLocals.map((local) => (
              <article
                key={local.id}
                className="py-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-warm/10 transition-colors px-2"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg font-medium text-text">
                      {isHindi ? local.displayNameHi : local.displayName}
                    </h2>
                    {local.verified && (
                      <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-medium">
                        {isHindi ? "सत्यापित नागरिक" : "Verified Local"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-secondary">
                    {isHindi ? local.localityHi : local.locality} •{" "}
                    {isHindi ? local.districtNameHi : local.districtName}
                  </p>

                  <p className="text-sm text-text leading-relaxed max-w-2xl">
                    {isHindi ? local.bioHi : local.bioEn}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-secondary font-medium">
                      {isHindi ? "भाषाएं:" : "Languages:"}
                    </span>
                    {(isHindi ? local.languagesHi : local.languages).map((lang) => (
                      <span
                        key={lang}
                        className="text-xs px-2 py-0.5 border border-rule rounded-sm bg-page text-secondary"
                      >
                        {lang}
                      </span>
                    ))}

                    <span className="text-xs text-secondary font-medium ml-2">
                      {isHindi ? "रुचियां:" : "Interests:"}
                    </span>
                    {(isHindi ? local.interestsHi : local.interests).map((interest) => (
                      <span
                        key={interest}
                        className="text-xs px-2 py-0.5 border border-rule/60 rounded-sm bg-warm/30 text-secondary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-secondary pt-1">
                    <span className="font-medium text-text">
                      {isHindi ? "सुझावित सार्वजनिक मिलन स्थल: " : "Suggested Public Spot: "}
                    </span>
                    {isHindi ? local.preferredPublicSpotHi : local.preferredPublicSpotEn}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <Link
                    href={`/messages/new?recipientId=${local.id}`}
                    className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium text-center transition-colors"
                  >
                    {isHindi ? "मुलाकात का अनुरोध भेजें" : "Request Meetup"}
                  </Link>
                  <span className="text-[11px] text-secondary text-center">
                    {isHindi ? "निशुल्क सांस्कृतिक संवाद" : "Free community exchange"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-rule rounded-sm text-center max-w-lg mx-auto">
            <h3 className="font-heading text-lg font-medium text-text mb-2">
              {isHindi ? "इस क्षेत्र में अभी कोई पंजीकृत स्थानीय सदस्य नहीं है" : "No Registered Locals in this Selection"}
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              {isHindi
                ? "हमारा पहला चरण बिहार के दरभंगा और मधुबनी जिलों पर केंद्रित है। अन्य जिलों में सत्यापन के बाद स्थानीय सदस्यों को जोड़ा जाएगा।"
                : "Our active pilot is focused on Darbhanga and Madhubani districts in Bihar. Other areas will onboard progressively."}
            </p>
            <Link
              href="/become-a-host"
              className="tap-target inline-block px-4 py-2 border border-primary text-primary hover:bg-warm rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "अपने शहर में स्थानीय सदस्य बनें" : "Apply to become a local in your town"}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
