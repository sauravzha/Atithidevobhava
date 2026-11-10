import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Bi } from "@/components/ui/bi";
import { UnifiedSearch } from "@/components/search/unified-search";
import { OFFICIAL_STATES } from "@/lib/location/data";
import {
  Users,
  Compass,
  Home,
  MapPin,
  ShieldCheck,
  Palette,
  UtensilsCrossed,
  TreePine,
  Landmark,
  ShoppingBag,
  Sparkles,
  Music,
  Sun,
  Languages,
  Camera,
  CheckCircle2,
  ArrowRight,
  Lock,
  EyeOff,
} from "lucide-react";

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

  // The 12 Cultural Categories from Section 7 with semantic Lucide icons & subtitles
  const culturalCategories = [
    {
      slug: "indian-food-and-cooking",
      en: "Indian food and cooking",
      hi: "भारतीय खान-पान और पाक कला",
      desc: isHindi ? "पारंपरिक पारिवारिक व्यंजन और मसाले" : "Traditional family recipes and regional spices",
      icon: UtensilsCrossed,
      count: 6,
    },
    {
      slug: "village-life",
      en: "Village life",
      hi: "ग्रामीण जीवन और परंपरा",
      desc: isHindi ? "कृषि, लोक परंपराएं और सामुदायिक संस्कृति" : "Agrarian customs, folk traditions and community culture",
      icon: TreePine,
      count: 8,
    },
    {
      slug: "art-and-handicrafts",
      en: "Art and handicrafts",
      hi: "कला और हस्तशिल्प (मिथिला चित्रकला)",
      desc: isHindi ? "प्राकृतिक रंगों से पारंपरिक भित्ति व पट चित्र" : "Centuries-old folk painting and natural dye crafts",
      icon: Palette,
      count: 12,
    },
    {
      slug: "history-and-heritage",
      en: "History and heritage",
      hi: "इतिहास और धरोहर",
      desc: isHindi ? "प्राचीन राजमहल, तालाब व स्थापत्य" : "Historic palace complexes, ancient wetlands and architecture",
      icon: Landmark,
      count: 4,
    },
    {
      slug: "local-markets",
      en: "Local markets",
      hi: "स्थानीय बाज़ार भ्रमण",
      desc: isHindi ? "साप्ताहिक ग्रामीण हाट और शिल्पी बाज़ार" : "Weekly village haats and local artisan bazaars",
      icon: ShoppingBag,
      count: 5,
    },
    {
      slug: "traditional-festivals",
      en: "Traditional festivals",
      hi: "पारंपरिक उत्सव और मेले",
      desc: isHindi ? "सामा-चकेवा, छठ, मधुश्रावणी व लोक पर्व" : "Seasonal celebrations, ritual gatherings and fairs",
      icon: Sparkles,
      count: 2,
    },
    {
      slug: "music-and-dance",
      en: "Music and dance",
      hi: "संगीत और लोक नृत्य",
      desc: isHindi ? "मैथिली लोकगीत, ध्रुपद व शास्त्रीय वादन" : "Maithili folk ballads, dhrupad and classical instruments",
      icon: Music,
      count: 3,
    },
    {
      slug: "spiritual-and-cultural",
      en: "Spiritual and cultural experiences",
      hi: "आध्यात्मिक और सांस्कृतिक अनुभव",
      desc: isHindi ? "प्राचीन मंदिर, ध्यान स्थल और दर्शन" : "Sacred temple architecture, meditation and oral traditions",
      icon: Sun,
      count: 4,
    },
    {
      slug: "nature-and-rural",
      en: "Nature and rural experiences",
      hi: "प्रकृति और ग्रामीण परिवेश",
      desc: isHindi ? "ऐतिहासिक पोखर, मखाना खेत और आम के बाग़" : "Historic pond wetlands, makhana wetlands and orchards",
      icon: Compass,
      count: 3,
    },
    {
      slug: "language-and-exchange",
      en: "Language and cultural exchange",
      hi: "भाषा और सांस्कृतिक संवाद",
      desc: isHindi ? "मैथिली व हिंदी भाषा अभ्यास और साहित्य" : "Maithili and Hindi oral exchange with local scholars",
      icon: Languages,
      count: 5,
    },
    {
      slug: "photography-walks",
      en: "Photography walks",
      hi: "फ़ोटोग्राफ़ी पदयात्रा",
      desc: isHindi ? "सांस्कृतिक परिदृश्य और जीवन की तस्वीरें" : "Visual documentation of rural folk ways and crafts",
      icon: Camera,
      count: 2,
    },
    {
      slug: "local-city-exploration",
      en: "Local city exploration",
      hi: "स्थानीय नगर दर्शन",
      desc: isHindi ? "मोहल्लों की पदयात्रा और चाय चौपाल संवाद" : "Neighbourhood walks, chai stall conversations and towns",
      icon: MapPin,
      count: 4,
    },
  ];

  // Verified Pilot Region Sample Experiences (Section 7)
  const pilotExperiences = [
    {
      id: "exp-mithila-art",
      category: isHindi ? "कला और हस्तशिल्प" : "Art and Handicrafts",
      titleEn: "Mithila Painting and Natural Pigment Workshop",
      titleHi: "जितवारपुर में मिथिला चित्रकला एवं प्राकृतिक रंग निर्माण",
      location: "Jitwarpur, Madhubani",
      locationHi: "जितवारपुर, मधुबनी (बिहार)",
      host: "Sunita Devi & Artisan Family",
      hostBadge: isHindi ? "सत्यापित राज्य शिल्पी परिवार" : "State Awardee Artisan Family",
      duration: "3 Hours",
      groupSize: isHindi ? "अधिकतम ४ प्रतिभागी" : "Max 4 Participants",
      materials: isHindi ? "सामग्री शामिल" : "Materials Included",
      desc: isHindi
        ? "बांस की तीलियों और प्राकृतिक वनस्पति रंगों (काजल, हल्दी, पत्तों के रस) से पारंपरिक कोहबर एवं अरिपन कला की तकनीक सीधे स्थानीय कलाकारों से सीखें।"
        : "Learn centuries-old Kohbar and Aripan motifs using handmade bamboo twigs and natural dyes extracted from leaves, flowers, and ground minerals.",
    },
    {
      id: "exp-darbhanga-heritage",
      category: isHindi ? "इतिहास और धरोहर" : "History and Heritage",
      titleEn: "Historic Pokhar (Pond) Heritage and Raj Darbhanga Palace Walk",
      titleHi: "दरभंगा राज और ऐतिहासिक तालाब धरोहर पदयात्रा",
      location: "Darbhanga Town",
      locationHi: "दरभंगा नगर (बिहार)",
      host: "Rameshwar Jha",
      hostBadge: isHindi ? "धरोहर शिक्षक एवं शोधकर्ता" : "Heritage Researcher",
      duration: "2.5 Hours",
      groupSize: isHindi ? "अधिकतम ६ व्यक्ति" : "Max 6 Guests",
      materials: isHindi ? "प्रातःकालीन चाय शामिल" : "Morning Tea Included",
      desc: isHindi
        ? "दरभंगा की ऐतिहासिक जल-संरक्षण प्रणाली, प्राचीन पोखरों का संजाल, आनंद बाग़ महल परिसर और मिथिला के सांस्कृतिक इतिहास का अध्ययन।"
        : "Study Darbhanga's historical interconnected wetland architecture, Raj Darbhanga royal history, and community conservation practices.",
    },
    {
      id: "exp-maithili-cuisine",
      category: isHindi ? "खान-पान और पाक कला" : "Indian Food & Cooking",
      titleEn: "Maithili Culinary Traditions and Makhana Processing",
      titleHi: "मैथिली पारंपरिक पाक कला और मखाना प्रसंस्करण",
      location: "Saurath, Madhubani",
      locationHi: "सौरठ, मधुबनी (बिहार)",
      host: "Anand Mishra",
      hostBadge: isHindi ? "कृषक एवं स्थानीय मार्गदर्शक" : "Organic Farmer & Cultural Host",
      duration: "3 Hours",
      groupSize: isHindi ? "अधिकतम ४ व्यक्ति" : "Max 4 Guests",
      materials: isHindi ? "पारंपरिक भोजन शामिल" : "Family Meal Included",
      desc: isHindi
        ? "मीठे पानी के मखाने की कटाई का प्रत्यक्ष अवलोकन, सरसों के तेल में पारंपरिक मैथिली सब्ज़ियों की तैयारी और पारिवारिक चौके में भोजन।"
        : "Observe freshwater makhana (foxnut) harvesting and prepare regional seasonal vegetarian curries using heirloom brass utensils.",
    },
  ];

  // Verified Pilot Community Members
  const pilotMembers = [
    {
      id: "loc-sunita",
      name: "Sunita Devi",
      nameHi: "सुनीता देवी",
      role: isHindi ? "पारंपरिक मिथिला चित्रकार" : "Mithila Folk Artist",
      district: isHindi ? "मधुबनी (बिहार)" : "Madhubani (Bihar)",
      languages: isHindi ? "मैथिली, हिंदी" : "Maithili, Hindi",
      meetingPoint: isHindi ? "जितवारपुर शिल्प केंद्र" : "Jitwarpur Village Craft Centre",
      verifiedYears: "30+ Years Practicing",
    },
    {
      id: "loc-rameshwar",
      name: "Rameshwar Jha",
      nameHi: "रामेश्वर झा",
      role: isHindi ? "संस्कृत शिक्षक एवं धरोहर शोधकर्ता" : "Sanskrit Educator & Folklorist",
      district: isHindi ? "दरभंगा (बिहार)" : "Darbhanga (Bihar)",
      languages: isHindi ? "मैथिली, हिंदी, English" : "Maithili, Hindi, English",
      meetingPoint: isHindi ? "श्यामा माई मंदिर परिसर" : "Shyama Mai Temple Complex",
      verifiedYears: "Local Resident",
    },
    {
      id: "loc-anand",
      name: "Anand Mishra",
      nameHi: "आनंद मिश्र",
      role: isHindi ? "कृषि विशेषज्ञ एवं सांस्कृतिक मार्गदर्शक" : "Agronomist & Community Host",
      district: isHindi ? "मधुबनी (बिहार)" : "Madhubani (Bihar)",
      languages: isHindi ? "मैथिली, हिंदी, English" : "Maithili, Hindi, English",
      meetingPoint: isHindi ? "सौरठ सभा गाछी" : "Saurath Sabha Gaachhi",
      verifiedYears: "Family Farm",
    },
  ];

  // States with live inventory
  const statesWithInventory = OFFICIAL_STATES.filter((s) => (s.activeHostsCount ?? 0) > 0);

  return (
    <div className="site-container py-8 sm:py-12 space-y-20">
      {/* ==================================================================== */}
      {/* HERO SECTION: Editorial Presentation with Warm Architectural Tone    */}
      {/* ==================================================================== */}
      <section className="grid-12 items-start pt-2 sm:pt-6 pb-12 border-b border-rule">
        <div className="col-7 space-y-6">
          {/* Cultural eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule rounded-sm text-xs font-mono text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
            <span>
              {isHindi
                ? "सत्यापित सांस्कृतिक आतिथ्य मंच · उत्तरी बिहार पायलट"
                : "Verified Cultural Hospitality Platform · Northern Bihar Pilot"}
            </span>
          </div>

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

          {/* Trust Highlights Row */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-secondary border-t border-rule/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0" strokeWidth={1.5} />
              <span>{isHindi ? "व्यक्तिगत सत्यापन" : "100% Vetted Hosts"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-terracotta shrink-0" strokeWidth={1.5} />
              <span>{isHindi ? "आपसी सहमति से संपर्क" : "Dual Mutual Consent"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-forest shrink-0" strokeWidth={1.5} />
              <span>{isHindi ? "सार्वजनिक बैठक स्थल" : "Public Meetup First"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-secondary shrink-0" strokeWidth={1.5} />
              <span>{isHindi ? "शून्य विज्ञापन ट्रैकर" : "Zero Ad Trackers"}</span>
            </div>
          </div>
        </div>

        {/* Pilot Region Highlight Showcase */}
        <div className="col-5 hidden md:block pl-0 lg:pl-8">
          <div className="border border-rule/90 rounded-sm p-6 bg-surface space-y-5 shadow-xs relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-terracotta" />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-forest uppercase tracking-wider px-2 py-0.5 bg-forest/10 rounded-sm">
                {isHindi ? "सक्रिय पायलट क्षेत्र" : "Active Pilot Region"}
              </span>
              <span className="text-xs font-mono text-secondary">
                Mithila Belt
              </span>
            </div>

            <div>
              <h2 className="font-heading font-medium text-2xl text-text leading-snug">
                {isHindi ? "दरभंगा एवं मधुबनी (बिहार)" : "Darbhanga & Madhubani (Bihar)"}
              </h2>
              <p className="font-heading text-xs text-secondary mt-0.5">
                North Gangetic Cultural Belt · Mithilanchal
              </p>
            </div>

            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "हमारी प्रारंभिक यात्रा उत्तरी बिहार के ऐतिहासिक मिथिला सांस्कृतिक क्षेत्र से शुरू होती है। प्राचीन तालाबों, पारंपरिक मिथिला चित्रकला, और मैथिली आतिथ्य का सीधे स्थानीय परिवारों के साथ अनुभव करें।"
                : "Our community operations begin in the Mithila cultural belt of Northern Bihar. Experience centuries-old folk painting, freshwater wetland heritage, and family hospitality directly with verified residents."}
            </p>

            <div className="space-y-2 border-t border-rule pt-4 text-xs">
              <div className="flex items-center justify-between text-secondary">
                <span>{isHindi ? "सत्यापित मेज़बान नागरिक:" : "Verified Local Hosts:"}</span>
                <span className="font-mono text-text font-medium">30-50 Hosts</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>{isHindi ? "सांस्कृतिक विषय:" : "Key Cultural Themes:"}</span>
                <span className="text-text font-medium">Mithila Art, Pond Heritage, Cuisine</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>{isHindi ? "मुख्य भाषाएं:" : "Primary Languages:"}</span>
                <span className="text-text font-medium">Maithili, Hindi, English</span>
              </div>
            </div>

            <div className="pt-2 border-t border-rule flex items-center justify-between text-xs">
              <Link
                href="/india/bihar/darbhanga"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>{isHindi ? "दरभंगा ज़िला →" : "Darbhanga District →"}</span>
              </Link>
              <Link
                href="/india/bihar/madhubani"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>{isHindi ? "मधुबनी ज़िला →" : "Madhubani District →"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 1. THREE WAYS TO EXPERIENCE INDIA: Refined 3-Column Editorial Cards  */}
      {/* ==================================================================== */}
      <section aria-labelledby="three-ways-title" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <Bi
            hindi={tThreeWays("titleHi")}
            english={isHindi ? "Three ways to experience India" : tThreeWays("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
          <span className="text-xs font-mono text-secondary">
            {isHindi ? "तीन परस्पर जुड़े उत्पाद" : "Three Interconnected Products"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01: Meet a local */}
          <div className="border border-rule rounded-sm p-6 bg-surface flex flex-col justify-between hover:border-forest hover:shadow-xs transition-all duration-150">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-terracotta font-semibold">01</span>
                <div className="w-8 h-8 rounded-full bg-warm-grey/50 flex items-center justify-center text-primary">
                  <Users className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                  {isHindi ? "Meet a local" : tThreeWays("way1TitleHi")}
                </span>
                <h3 className="font-heading font-medium text-lg text-text">
                  {tThreeWays("way1Title")}
                </h3>
              </div>

              <p className="font-body text-xs text-secondary leading-relaxed">
                {tThreeWays("way1Desc")}
              </p>

              <ul className="space-y-1.5 pt-2 border-t border-rule/60 text-xs text-secondary font-body">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "चाय एवं मोहल्ला पदयात्रा" : "Neighbourhood walks and tea"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "भाषा व सांस्कृतिक संवाद" : "Language and cultural exchange"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "निःशुल्क एवं गैर-व्यावसायिक" : "Non-commercial by default"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-rule mt-6">
              <Link
                href="/explore/people"
                className="tap-target inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <span>{tThreeWays("way1Link")}</span>
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Card 02: Explore with a local */}
          <div className="border border-rule rounded-sm p-6 bg-surface flex flex-col justify-between hover:border-forest hover:shadow-xs transition-all duration-150">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-terracotta font-semibold">02</span>
                <div className="w-8 h-8 rounded-full bg-warm-grey/50 flex items-center justify-center text-primary">
                  <Compass className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                  {isHindi ? "Explore with a local" : tThreeWays("way2TitleHi")}
                </span>
                <h3 className="font-heading font-medium text-lg text-text">
                  {tThreeWays("way2Title")}
                </h3>
              </div>

              <p className="font-body text-xs text-secondary leading-relaxed">
                {tThreeWays("way2Desc")}
              </p>

              <ul className="space-y-1.5 pt-2 border-t border-rule/60 text-xs text-secondary font-body">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "पारंपरिक कला व चित्रकला सत्र" : "Traditional art workshops"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "पारिवारिक चौके में पाक कला" : "Home culinary sessions"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "सूक्ष्म समूह (अधिकतम ४-६)" : "Small groups (max 4-6)"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-rule mt-6">
              <Link
                href="/explore/experiences"
                className="tap-target inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <span>{tThreeWays("way2Link")}</span>
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Card 03: Stay with a local */}
          <div className="border border-rule rounded-sm p-6 bg-surface flex flex-col justify-between hover:border-forest hover:shadow-xs transition-all duration-150">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-terracotta font-semibold">03</span>
                <div className="w-8 h-8 rounded-full bg-warm-grey/50 flex items-center justify-center text-primary">
                  <Home className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                  {isHindi ? "Stay with a local" : tThreeWays("way3TitleHi")}
                </span>
                <h3 className="font-heading font-medium text-lg text-text">
                  {tThreeWays("way3Title")}
                </h3>
              </div>

              <p className="font-body text-xs text-secondary leading-relaxed">
                {tThreeWays("way3Desc")}
              </p>

              <ul className="space-y-1.5 pt-2 border-t border-rule/60 text-xs text-secondary font-body">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "सत्यापित पारिवारिक आतिथ्य" : "Verified family hospitality"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? "विदेशी पंजीकरण (Form C) अनुपालन" : "Form C / FRRO compliance"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="inline-block px-1.5 py-0.5 bg-warm-grey/60 text-[10px] text-secondary font-mono rounded-xs">
                    {tThreeWays("way3Status")}
                  </span>
                  <span>{isHindi ? "तृतीय चरण में सक्रिय होगा" : "Phase 3 In Preparation"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-rule mt-6 flex items-center justify-between">
              <Link
                href="/explore/stays"
                className="tap-target inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <span>{tThreeWays("way3Link")}</span>
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </Link>
              <span className="text-[10px] font-mono text-secondary">Phase 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BY INTEREST: 12 Cultural Categories in Refined Editorial Cards    */}
      {/* ==================================================================== */}
      <section aria-labelledby="interests-title" className="pt-8 border-t border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <div>
            <Bi
              hindi={tInterests("titleHi")}
              english={isHindi ? "Explore by cultural tradition" : tInterests("title")}
              as="h2"
              className="text-xl sm:text-2xl"
            />
            <p className="font-body text-xs text-secondary mt-1">
              {tInterests("subtitle")}
            </p>
          </div>
          <span className="text-xs font-mono text-secondary">
            12 Cultural Disciplines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {culturalCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="p-4 bg-surface border border-rule rounded-sm flex items-start gap-3.5 group hover:border-forest hover:shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <div className="w-9 h-9 rounded-sm bg-warm-grey/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-150 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <span lang="hi" className="block text-xs text-secondary group-hover:text-primary transition-colors duration-150 truncate">
                    {cat.hi}
                  </span>
                  <span className="font-heading font-medium text-sm text-text block group-hover:text-primary transition-colors duration-150 truncate">
                    {cat.en}
                  </span>
                  <p className="font-body text-[11px] text-secondary mt-0.5 line-clamp-1">
                    {cat.desc}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-secondary">
                      {cat.count} listings
                    </span>
                    <span className="text-primary group-hover:translate-x-0.5 transition-transform duration-150 inline-block font-medium">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. VERIFIED EXPERIENCES: Live Showcase from Pilot Area (Darbhanga)   */}
      {/* ==================================================================== */}
      <section aria-labelledby="recent-exp-title" className="pt-8 border-t border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <div>
            <Bi
              hindi={tExp("titleHi")}
              english={isHindi ? "Published cultural experiences" : tExp("title")}
              as="h2"
              className="text-xl sm:text-2xl"
            />
            <p className="font-body text-xs text-secondary mt-1">
              {isHindi
                ? "उत्तरी बिहार के मिथिला पायलट क्षेत्र में सत्यापित स्थानीय नागरिकों द्वारा संचालित सत्र।"
                : "Active cultural sessions organized by verified local residents in the Mithila pilot belt."}
            </p>
          </div>
          <Link
            href="/explore/experiences"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>{isHindi ? "सभी अनुभव देखें" : "View all experiences"}</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilotExperiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-rule rounded-sm p-6 bg-surface flex flex-col justify-between hover:border-forest hover:shadow-xs transition-all duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-terracotta font-medium px-2 py-0.5 bg-terracotta/10 rounded-sm">
                    {exp.category}
                  </span>
                  <span className="text-secondary font-mono text-[11px]">
                    {exp.duration}
                  </span>
                </div>

                <div>
                  <span lang="hi" className="block text-xs text-secondary">
                    {exp.titleHi}
                  </span>
                  <h3 className="font-heading font-medium text-base text-text mt-0.5">
                    {exp.titleEn}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-forest shrink-0" strokeWidth={1.5} />
                  <span>{isHindi ? exp.locationHi : exp.location}</span>
                </div>

                <p className="font-body text-xs text-secondary leading-relaxed">
                  {exp.desc}
                </p>

                <div className="pt-2 border-t border-rule/60 flex items-center justify-between text-[11px] text-secondary">
                  <span className="font-medium text-text">{exp.host}</span>
                  <span className="font-mono text-forest">{exp.groupSize}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-rule mt-4 flex items-center justify-between">
                <span className="text-[11px] text-secondary">
                  {exp.materials}
                </span>
                <Link
                  href="/explore/experiences"
                  className="tap-target px-3 py-1 bg-page border border-rule hover:border-primary text-primary rounded-sm text-xs font-medium transition-colors"
                >
                  {isHindi ? "विवरण देखें →" : "Details →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. VERIFIED COMMUNITY: Local Members Showcase (Mithila Pilot)        */}
      {/* ==================================================================== */}
      <section aria-labelledby="community-title" className="pt-8 border-t border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <div>
            <Bi
              hindi={tComm("titleHi")}
              english={isHindi ? "Local community members" : tComm("title")}
              as="h2"
              className="text-xl sm:text-2xl"
            />
            <p className="font-body text-xs text-secondary mt-1">
              {isHindi
                ? "वे स्थानीय नागरिक जिन्होंने आगंतुकों से मिलने के लिए सार्वजनिक सहमति दी है।"
                : "Verified residents who chose public visibility to connect with respectful visitors."}
            </p>
          </div>
          <Link
            href="/explore/people"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>{isHindi ? "नागरिक निर्देशिका" : "Member directory"}</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilotMembers.map((member) => (
            <div
              key={member.id}
              className="border border-rule rounded-sm p-6 bg-surface flex flex-col justify-between hover:border-forest hover:shadow-xs transition-all duration-150"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest/10 border border-forest/30 flex items-center justify-center font-heading font-medium text-forest text-base">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-base text-text">
                        {isHindi ? member.nameHi : member.name}
                      </h3>
                      <span className="text-xs text-secondary block">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-forest bg-forest/10 px-2 py-0.5 rounded-sm">
                    <ShieldCheck className="w-3 h-3" strokeWidth={1.5} />
                    <span>ID Vetted</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-secondary border-t border-rule/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span>{isHindi ? "ज़िला:" : "District:"}</span>
                    <span className="text-text font-medium">{member.district}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isHindi ? "संवाद भाषाएं:" : "Languages:"}</span>
                    <span className="text-text font-medium">{member.languages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isHindi ? "सार्वजनिक बैठक स्थल:" : "Public Meeting:"}</span>
                    <span className="text-text font-medium">{member.meetingPoint}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rule mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-secondary">
                  {member.verifiedYears}
                </span>
                <Link
                  href="/explore/people"
                  className="tap-target px-3 py-1 bg-primary text-white rounded-sm text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                  {isHindi ? "संवाद अनुरोध →" : "Connect →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. BY STATE: Ruled directory of states with live host & exp counts   */}
      {/* ==================================================================== */}
      <section aria-labelledby="states-table-title" className="pt-8 border-t border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <div>
            <Bi
              hindi={tStates("titleHi")}
              english={isHindi ? "Explore by state and region" : tStates("title")}
              as="h2"
              className="text-xl sm:text-2xl"
            />
            <p className="font-body text-xs text-secondary mt-1">
              {isHindi
                ? "सभी २८ भारतीय राज्यों और ८ केंद्र शासित प्रदेशों का भौगोलिक अनुक्रमण।"
                : "Official index of all 28 Indian States and 8 Union Territories with verified inventory."}
            </p>
          </div>
          <Link
            href="/india"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>{isHindi ? "सभी राज्य एवं केंद्र शासित प्रदेश" : "View all states & UTs"}</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="border border-rule rounded-sm overflow-x-auto bg-surface">
          <table className="w-full text-left font-body text-xs">
            <thead className="border-b border-rule bg-page text-secondary uppercase font-medium">
              <tr>
                <th className="p-3.5">{tStates("colState")}</th>
                <th className="p-3.5 text-center">{tStates("colHosts")}</th>
                <th className="p-3.5 text-center">{tStates("colExperiences")}</th>
                <th className="p-3.5 text-center">Status</th>
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
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-sm bg-forest/10 text-forest">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                      <span>Pilot Active</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/india/${st.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="tap-target px-3 py-1 border border-rule hover:border-secondary rounded-sm font-medium text-primary hover:underline inline-block"
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
      {/* 6. STAY WITH A LOCAL FAMILY (Phase 3 Honest Notice)                  */}
      {/* ==================================================================== */}
      <section aria-labelledby="stays-status-title" className="pt-8 border-t border-rule space-y-4">
        <Bi
          hindi={tStays("titleHi")}
          english={isHindi ? "Stay with a local family" : tStays("title")}
          as="h2"
          className="text-xl sm:text-2xl"
        />
        <div className="border-l-2 border-primary pl-5 py-3 bg-surface rounded-r-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-forest">
            <span className="w-2 h-2 rounded-full bg-forest" />
            <span>Phase 3 Notice · Regulatory & Operational Standards</span>
          </div>
          <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
            {tStays("status")}
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. HOW IT WORKS: Connected 3-Step Flow (Discover, Connect, Exp)     */}
      {/* ==================================================================== */}
      <section aria-labelledby="how-it-works-title" className="pt-8 border-t border-rule space-y-6">
        <div className="border-b border-rule pb-4">
          <Bi
            hindi={tHow("titleHi")}
            english={isHindi ? "How it works" : tHow("title")}
            as="h2"
            className="text-xl sm:text-2xl"
          />
          <p className="font-body text-xs text-secondary mt-1">
            {isHindi
              ? "तीन सरल एवं सुरक्षित चरणों में भारतीय संस्कृति से जुड़ें।"
              : "A simple, privacy-first process to connect with local people across India."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="border border-rule rounded-sm p-6 bg-surface space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-mono text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span className="text-[11px] font-mono text-secondary">
                Step 01
              </span>
            </div>
            <div>
              <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                {isHindi ? "1. Discover" : tHow("step1TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step1Title")}
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
              {tHow("step1Desc")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-rule rounded-sm p-6 bg-surface space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-mono text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span className="text-[11px] font-mono text-secondary">
                Step 02
              </span>
            </div>
            <div>
              <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                {isHindi ? "2. Connect" : tHow("step2TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step2Title")}
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
              {tHow("step2Desc")}
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-rule rounded-sm p-6 bg-surface space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-mono text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span className="text-[11px] font-mono text-secondary">
                Step 03
              </span>
            </div>
            <div>
              <span lang={isHindi ? "en" : "hi"} className="block text-xs text-secondary font-medium">
                {isHindi ? "3. Experience" : tHow("step3TitleHi")}
              </span>
              <h3 className="font-heading font-medium text-lg text-text">
                {tHow("step3Title")}
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
              {tHow("step3Desc")}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. TRUST, SAFETY AND PRIVACY PILLARS                                */}
      {/* ==================================================================== */}
      <section aria-labelledby="trust-safety-title" className="pt-8 border-t border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
          <div>
            <Bi
              hindi={tTrust("titleHi")}
              english={isHindi ? "Trust and community safety" : tTrust("title")}
              as="h2"
              className="text-xl sm:text-2xl"
            />
            <p className="font-body text-xs text-secondary mt-1">
              {tTrust("desc")}
            </p>
          </div>
          <Link
            href="/safety"
            className="tap-target px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm text-xs font-medium transition-colors duration-[120ms] inline-flex items-center gap-1.5"
          >
            <span>{tTrust("link")}</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-rule rounded-sm bg-surface space-y-2">
            <div className="w-8 h-8 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-medium text-sm text-text">
              {isHindi ? "प्रत्येक सदस्य की व्यक्तिगत जांच" : "Human Identity Review"}
            </h3>
            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "सभी स्थानीय सदस्यों और मेज़बानों के पहचान प्रमाण पत्रों की व्यक्तिगत समीक्षा की जाती है।"
                : "Every local host is reviewed by a person. Zero anonymous accounts or fake listings."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-surface space-y-2">
            <div className="w-8 h-8 rounded-sm bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-medium text-sm text-text">
              {isHindi ? "आपसी सहमति से संपर्क साझा" : "Dual Mutual Consent"}
            </h3>
            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "फ़ोन नंबर और ईमेल केवल तभी साझा होते हैं जब दोनों पक्ष स्पष्ट रूप से सहमत होते हैं।"
                : "Contact details are shared only when both traveller and host mutually approve."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-surface space-y-2">
            <div className="w-8 h-8 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-medium text-sm text-text">
              {isHindi ? "सार्वजनिक बैठक स्थल" : "Public Meeting Protocol"}
            </h3>
            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "प्रारंभिक मुलाक़ातें सदैव ऐतिहासिक परिसरों, चाय चौपालों या शिल्प केंद्रों पर होती हैं।"
                : "Initial meetups occur exclusively in designated public cultural areas and craft centres."}
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm bg-surface space-y-2">
            <div className="w-8 h-8 rounded-sm bg-secondary/10 flex items-center justify-center text-secondary">
              <EyeOff className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-medium text-sm text-text">
              {isHindi ? "गोपनीयता एवं शून्य ट्रैकर" : "Zero Tracking Cookies"}
            </h3>
            <p className="font-body text-xs text-secondary leading-relaxed">
              {isHindi
                ? "मंच पर कोई विज्ञापन ट्रैकर या तृतीय-पक्ष स्क्रिप्ट नहीं है। भारतीय DPDP कानून का पूर्ण अनुपालन।"
                : "No advertising pixels or marketing trackers. Fully compliant with India's DPDP Act."}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 9. BECOME A HOST: Editorial CTA Box                                  */}
      {/* ==================================================================== */}
      <section aria-labelledby="become-host-title" className="pt-8 border-t border-rule">
        <div className="border border-rule rounded-sm p-8 bg-surface">
          <div className="grid-12 items-center gap-6">
            <div className="col-8 space-y-3">
              <Bi
                hindi={tHost("titleHi")}
                english={isHindi ? "Share your culture with travellers" : tHost("title")}
                as="h2"
                className="text-xl sm:text-2xl"
              />
              <p className="font-body text-xs sm:text-sm text-text leading-relaxed max-w-prose">
                {tHost("desc")}
              </p>
            </div>
            <div className="col-4 text-left sm:text-right">
              <Link
                href="/become-a-host"
                className="tap-target px-5 py-3 bg-primary hover:bg-primary-hover text-white rounded-sm text-xs font-medium transition-colors duration-[120ms] inline-flex items-center gap-2 shadow-xs"
              >
                <span>{tHost("link")}</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 10. ANCIENT PHILOSOPHY & CULTURAL STATEMENT                          */}
      {/* ==================================================================== */}
      <section aria-labelledby="stories-title" className="pt-8 border-t border-rule pb-4">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span lang="hi" className="font-heading text-lg sm:text-xl text-primary block font-medium">
            मातृदेवो भव। पितृदेवो भव। आचार्यदेवो भव। अतिथिदेवो भव॥
          </span>
          <p className="font-heading text-xs text-secondary italic">
            Taittiriya Upanishad (तैत्तिरीयोपनिषद्) · Siksha Valli
          </p>
          <p className="font-body text-xs text-secondary leading-relaxed">
            {isHindi
              ? "अतिथि देवो भवः केवल एक नाम नहीं, अपितु भारतीय सभ्यता का शाश्वत मूल्य है। हमारा उद्देश्य व्यावसायिक पर्यटन से इतर, अंतरराष्ट्रीय यात्रियों को भारतीय नागरिकों, कलाकारों और परिवारों से सीधे, आदरपूर्ण और सुरक्षित रूप से जोड़ना है।"
              : "Hospitality in India is rooted in genuine human encounter and mutual respect. We connect respectful international visitors with verified Indian residents, traditional artists, and families for uncommercialized cultural exchange."}
          </p>
        </div>
      </section>
    </div>
  );
}
