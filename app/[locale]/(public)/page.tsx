import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { UnifiedSearch } from "@/components/search/unified-search";
import { FadeIn } from "@/components/ui/fade-in";
import { InitialLoader } from "@/components/ui/initial-loader";
import { StoryModal } from "@/components/ui/story-modal";
import {
  MadhubaniBorder,
  JharokhaMotif,
  LotusMotif,
  DiyaMotif,
  AripanDivider,
} from "@/components/ui/cultural-patterns";
import {
  Users,
  Compass,
  Home,
  ShieldCheck,
  Palette,
  UtensilsCrossed,
  TreePine,
  Landmark,
  ArrowRight,
  Lock,
  EyeOff,
  Sparkles,
  Languages,
  MapPin,
  Star,
  Music,
  Heart,
  Footprints,
  BookOpen,
  CheckCircle2,
  FileText,
  BadgeCheck,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // 4 Featured Cultural Experiences from North Bihar Pilot
  const featuredOfferings = [
    {
      id: "exp-mithila-art",
      titleEn: "Mithila Painting in Village Courtyards",
      titleHi: "पारंपरिक मिथिला चित्रकला कार्यशाला",
      locationEn: "Jitwarpur, Madhubani",
      locationHi: "जितवारपुर, मधुबनी",
      durationEn: "2.5 Hours",
      durationHi: "२.५ घंटे",
      categoryEn: "Folk Painting",
      categoryHi: "लोक चित्रकला",
      hostEn: "Shanti Devi (State Awardee)",
      hostHi: "शांति देवी (राज्य पुरस्कार प्राप्त)",
      rating: "5.0",
      reviewsCount: 24,
      image: "/images/exp-mithila-art.jpg",
      icon: Palette,
      link: "/experiences/exp-mithila-art",
      narrativeEn: "Learn the ancient techniques of preparing bamboo nibs and natural mineral pigments from clay, soot, and flowers.",
      narrativeHi: "बांस की कलम और मिट्टी, कालिख व फूलों से प्राकृतिक रंग तैयार करने की सदियों पुरानी विधि सीखें।",
    },
    {
      id: "exp-maithili-cuisine",
      titleEn: "Heritage Maithil Family Dining",
      titleHi: "पारंपरिक मैथिली पाक कला व भोजन",
      locationEn: "Ranti Village, Madhubani",
      locationHi: "रांटी गांव, मधुबनी",
      durationEn: "3.0 Hours",
      durationHi: "३.० घंटे",
      categoryEn: "Culinary Heritage",
      categoryHi: "पारंपरिक खान-पान",
      hostEn: "Sunita Kumari & Family",
      hostHi: "सुनीता कुमारी एवं परिवार",
      rating: "4.9",
      reviewsCount: 18,
      image: "/images/exp-cuisine.jpg",
      icon: UtensilsCrossed,
      link: "/experiences/exp-maithili-cuisine",
      narrativeEn: "Participate in family food preparation featuring seasonal Tilkor leaves, fragrant Govindbhog rice, and roasted makhana.",
      narrativeHi: "तिलकोर के पत्ते, सुगंधित गोविंदभोग चावल और देशी घी में भुने मखाने के साथ पारंपरिक पारिवारिक भोजन का आनंद।",
    },
    {
      id: "exp-darbhanga-heritage",
      titleEn: "Raj Architecture & Temple Pond Walk",
      titleHi: "ऐतिहासिक तालाब व राज धरोहर पदयात्रा",
      locationEn: "Raj Complex, Darbhanga",
      locationHi: "राज परिसर, दरभंगा",
      durationEn: "2.0 Hours",
      durationHi: "२.० घंटे",
      categoryEn: "Architectural Heritage",
      categoryHi: "धरोहर स्थापत्य",
      hostEn: "Rameshwar Jha",
      hostHi: "रामेश्वर झा",
      rating: "4.9",
      reviewsCount: 22,
      image: "/images/exp-pond.jpg",
      icon: Landmark,
      link: "/experiences/exp-darbhanga-heritage",
      narrativeEn: "A walking exploration of centuries-old hydraulic architecture, red brick towers, and sacred temple ghats.",
      narrativeHi: "लाल ईंटों के महलों, सदियों पुरानी जल संचयन प्रणाली और ऐतिहासिक मंदिर घाटों का प्रामाणिक मार्गदर्शन।",
    },
    {
      id: "exp-makhana-culture",
      titleEn: "Sacred Wetland & Makhana Harvest",
      titleHi: "मखाना जल कृषि एवं तालाब संस्कृति",
      locationEn: "Keoti, Darbhanga",
      locationHi: "केवटी, दरभंगा",
      durationEn: "3.5 Hours",
      durationHi: "३.५ घंटे",
      categoryEn: "Rural Agriculture",
      categoryHi: "ग्रामीण जल कृषि",
      hostEn: "Mallah Fisherman Collective",
      hostHi: "स्थानीय मल्लाह समुदाय",
      rating: "4.8",
      reviewsCount: 15,
      image: "/images/exp-makhana.jpg",
      icon: TreePine,
      link: "/experiences/exp-makhana-culture",
      narrativeEn: "Witness traditional diving and roasting of Euryale ferox (fox nuts) in freshwater wetlands sustaining local livelihoods.",
      narrativeHi: "तालाबों के तल से मखाना बीजों को निकालने और खिले हुए सफेद मखाने तैयार करने की पारंपरिक जल कृषि को समझें।",
    },
  ];

  // 12 Cultural Heritage Domains
  // Spotlight 3 domains with full editorial essays + 9 domains in an editorial catalog
  const spotlightDomains = [
    {
      slug: "mithila-painting",
      titleEn: "Mithila Folk Painting & Sacred Aripan",
      titleHi: "मिथिला चित्रकला एवं पवित्र अरिपन",
      image: "/images/exp-mithila-art.jpg",
      icon: Palette,
      taglineEn: "Centuries of ritual courtyard art, mineral dyes & bamboo stylus drawing.",
      taglineHi: "प्राकृतिक रंगों, बांस की कलम और आंगन की भित्तियों पर रची जाने वाली सदियों पुरानी लोक परंपरा।",
    },
    {
      slug: "culinary-traditions",
      titleEn: "Living Maithil Culinary Heritage",
      titleHi: "मैथिल पाक परंपरा एवं भोजन संस्कृति",
      image: "/images/exp-cuisine.jpg",
      icon: UtensilsCrossed,
      taglineEn: "Slow earthen cooking, seasonal wild greens, Chura-Dahi & ceremonial sweets.",
      taglineHi: "मिट्टी के चूल्हे की धीमी आंच, मौसमी साग-सब्जियां, चूड़ा-दही और मांगलिक उत्सवों का पारंपरिक स्वाद।",
    },
    {
      slug: "ponds-ghats",
      titleEn: "Aquatic Architecture & Temple Ponds",
      titleHi: "ऐतिहासिक पोखर, घाट एवं जल संस्कृति",
      image: "/images/exp-pond.jpg",
      icon: Footprints,
      taglineEn: "Ancient wetland conservation, Raj-era ghats & evening sacred litanies.",
      taglineHi: "राज दरभंगा काल के ऐतिहासिक जल स्रोत, संध्या कालीन आरती और ग्रामीण तालाब पारिस्थितिकी।",
    },
  ];

  const editorialCatalogDomains = [
    { slug: "folk-music-poetry", titleEn: "Folk Music & Vidyapati Lore", titleHi: "विद्यापति पदावली व लोक संगीत", icon: Music, highlightEn: "Maithili ragas & songs", highlightHi: "मैथिली राग व गीत" },
    { slug: "palaces-temples", titleEn: "Palaces & Ancient Shrines", titleHi: "राज प्रासाद व मंदिर स्थापत्य", icon: Landmark, highlightEn: "Red brick heritage", highlightHi: "लाल ईंटों की धरोहर" },
    { slug: "handloom-weaving", titleEn: "Tussar Silk & Handloom", titleHi: "तसर रेशम व हथकरघा बुनाई", icon: Sparkles, highlightEn: "Village artisan looms", highlightHi: "पारंपरिक ग्रामीण करघे" },
    { slug: "sikki-grass-craft", titleEn: "Golden Sikki Grass Craft", titleHi: "स्वर्ण सिक्की घास हस्तशिल्प", icon: TreePine, highlightEn: "GI-tagged indigenous craft", highlightHi: "भौगोलिक संकेतक (GI) प्राप्त शिल्प" },
    { slug: "sacred-aripan", titleEn: "Sacred Floor Geometry", titleHi: "मांगलिक अरिपन रेखांकन", icon: LotusMotif, highlightEn: "Rice powder ritual motifs", highlightHi: "पिठार (चावल के लेप) से निर्मित ज्यामिति" },
    { slug: "rural-farming", titleEn: "Village Life & Wetland Farming", titleHi: "ग्रामीण जीवन व मखाना कृषि", icon: Home, highlightEn: "Living farming traditions", highlightHi: "परंपरागत किसान जीवन" },
    { slug: "ayurveda-flora", titleEn: "Ayurveda & Gangetic Flora", titleHi: "पारंपरिक जड़ी-बूटी व वनस्पति", icon: Heart, highlightEn: "Indigenous wellness lore", highlightHi: "प्राचीन देसी औषधीय ज्ञान" },
    { slug: "maithili-oral-lore", titleEn: "Maithili Oral Lore & Tales", titleHi: "मैथिली वाचिक परंपरा व कथाएं", icon: BookOpen, highlightEn: "Ancient literary tradition", highlightHi: "मिथिला की प्राचीन कथा-संस्कृति" },
    { slug: "fairs-melas", titleEn: "Seasonal Haats & Folk Fairs", titleHi: "क्षेत्रीय हाट, मेले व उत्सव", icon: Compass, highlightEn: "Living village commerce", highlightHi: "ग्रामीण समाज और लोक मेले" },
  ];

  // Verified Local Residents Spotlight
  const localHosts = [
    {
      id: "shanti-devi",
      nameEn: "Shanti Devi",
      nameHi: "शांति देवी",
      roleEn: "Master Folk Painter • State Awardee",
      roleHi: "वरिष्ठ लोक चित्रकार • राज्य पुरस्कार प्राप्त",
      locationEn: "Jitwarpur, Madhubani",
      locationHi: "जितवारपुर, मधुबनी",
      languagesEn: "Maithili, Hindi",
      languagesHi: "मैथिली, हिन्दी",
      meetingEn: "Jitwarpur Village Artists Centre (Public Area)",
      meetingHi: "जितवारपुर ग्राम कलाकार केंद्र (सार्वजनिक स्थल)",
      image: "/images/host-shanti-devi.jpg",
      experienceYears: "28+",
      bioEn: "Specializes in traditional natural dyes prepared from leaves, clay and flower extracts on handmade rag paper.",
      bioHi: "हस्तनिर्मित कागज़ पर पत्तों, मिट्टी और फूलों के रस से प्राकृतिक रंग बनाकर पारंपरिक भित्ति व पटचित्र बनाती हैं।",
    },
    {
      id: "rameshwar-jha",
      nameEn: "Rameshwar Jha",
      nameHi: "रामेश्वर झा",
      roleEn: "Cultural Historian & Raj Heritage Guide",
      roleHi: "संस्कृति इतिहासकार एवं राज धरोहर मार्गदर्शक",
      locationEn: "Darbhanga City",
      locationHi: "दरभंगा नगर",
      languagesEn: "Maithili, Hindi, English",
      languagesHi: "मैथिली, हिन्दी, अंग्रेज़ी",
      meetingEn: "Darbhanga Tower Public Square",
      meetingHi: "दरभंगा टावर सार्वजनिक चौक",
      image: "/images/host-rameshwar-jha.jpg",
      experienceYears: "16+",
      bioEn: "An authority on medieval Mithila kingdoms, pond network hydrology, and regional Sanskrit libraries.",
      bioHi: "मध्यकालीन मिथिला राजवंशों, प्राचीन पोखर जल प्रणालियों और स्थानीय संस्कृत पांडुलिपियों के विशेषज्ञ।",
    },
  ];

  return (
    <>
      {/* Initial load transition */}
      <InitialLoader />

      <div className="site-container py-6 sm:py-10 space-y-20 sm:space-y-28">
        {/* ==================================================================== */}
        {/* SECTION 1: HERO COVER STORY — INDIAN HERITAGE EDITORIAL              */}
        {/* ==================================================================== */}
        <section className="relative pt-2 sm:pt-4">
          {/* Subtle Top Cultural Masthead */}
          <div className="flex items-center justify-between border-b border-rule/80 pb-3 mb-8 text-xs font-serif tracking-wider text-secondary">
            <span className="uppercase text-[11px] font-semibold text-terracotta">
              {isHindi ? "अतिथि सत्कार परंपरा" : "Sacred Indian Hospitality Tradition"}
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-secondary/80">
              Mithilanchal Pilot • Vol. 1
            </span>
            <span className="text-[11px] text-forest font-medium">
              {isHindi ? "उत्तरी बिहार पायलट परियोजना" : "Northern Bihar Pilot"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (7 cols): Editorial Typography & Invocation */}
            <FadeIn direction="up" delayMs={100} once={false} className="lg:col-span-7 space-y-6">
              {/* Pilot Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-rule/80 rounded-full text-xs font-medium text-secondary shadow-2xs">
                <LotusMotif className="w-3.5 h-3.5 text-terracotta shrink-0" />
                <span>
                  {isHindi
                    ? "सत्यापित सांस्कृतिक आतिथ्य मंच · दरभंगा एवं मधुबनी"
                    : "Verified Cultural Hospitality Platform • Darbhanga & Madhubani"}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1
                  lang="hi"
                  className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-medium text-text leading-[1.2] tracking-tight"
                >
                  भारत को लोगों के साथ महसूस कीजिए ।
                </h1>
                <p className="font-heading text-xl sm:text-2xl text-secondary font-normal leading-snug">
                  Experience India through its people, families, and living traditions.
                </p>

                {/* Vedic Shloka Citation */}
                <div className="p-3.5 rounded-lg border-l-2 border-forest bg-forest/5 text-xs font-serif italic text-forest space-y-1">
                  <p className="font-medium">
                    मातृदेवो भव । पितृदेवो भव । आचार्यदेवो भव । अतिथिदेवो भव ॥
                  </p>
                  <p className="text-[11px] text-secondary not-italic font-sans">
                    {isHindi
                      ? "तैत्तिरीयोपनिषद् — अतिथि साक्षात ईश्वर का स्वरूप हैं।"
                      : "Taittiriya Upanishad: The guest is welcomed as an embodiment of the Divine."}
                  </p>
                </div>
              </div>

              {/* Editorial Narrative */}
              <p className="font-body text-sm sm:text-base text-secondary leading-relaxed max-w-xl">
                {isHindi
                  ? "होटलों की औपचारिकता से दूर, स्थानीय ग्रामीण परिवारों के आंगन में बैठें। प्राकृतिक रंगों से मिथिला चित्रकला सीखें, ऐतिहासिक राज पोखरों का इतिहास समझें और भारत की प्रामाणिक अतिथि परंपरा का आदरपूर्वक अनुभव करें।"
                  : "Step beyond commercial hotel corridors into the living courtyards of verified resident families. Master natural folk painting, walk centuries-old temple ponds, and share in India's respectful hospitality traditions."}
              </p>

              {/* Primary Call to Action Controls */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/explore/experiences"
                  className="tactile-button inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xs text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs"
                >
                  <Compass className="w-4 h-4" strokeWidth={2} />
                  <span>{isHindi ? "सांस्कृतिक अनुभव खोजें" : "Explore Experiences"}</span>
                </Link>

                <StoryModal buttonText={isHindi ? "संस्कृति देखें" : "Watch Story"} />

                <Link
                  href="/explore/people"
                  className="tactile-button inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-terracotta/80 text-terracotta hover:bg-terracotta/10 rounded-xs text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-150"
                >
                  <Users className="w-4 h-4" strokeWidth={1.75} />
                  <span>{isHindi ? "नागरिकों से मिलें" : "Meet a Local"}</span>
                </Link>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-6 border-t border-rule/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div className="border-r border-rule/60 pr-3">
                  <span className="block font-heading text-xl font-semibold text-text">45+</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "सत्यापित मेज़बान" : "Verified Hosts"}
                  </span>
                </div>
                <div className="border-r border-rule/60 pr-3">
                  <span className="block font-heading text-xl font-semibold text-text">12</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "सांस्कृतिक विधाएं" : "Heritage Domains"}
                  </span>
                </div>
                <div className="border-r border-rule/60 pr-3">
                  <span className="block font-heading text-xl font-semibold text-forest">100%</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "पहचान सत्यापित" : "ID Verified"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-xl font-semibold text-terracotta">2</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "पायलट ज़िले (मिथिला)" : "Pilot Districts"}
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Right Column (5 cols): Large Authentic Documentary Photography */}
            <FadeIn direction="up" delayMs={250} once={false} className="lg:col-span-5">
              <div className="relative postcard-paper rounded-sm overflow-hidden group border border-rule/90 shadow-card">
                <div className="relative aspect-[4/5] w-full bg-cream">
                  <Image
                    src="/images/hero-artisan.jpg"
                    alt="Mithila master artisan hand painting traditional folk art mural in a village courtyard"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle photographic vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Stamp badge top right */}
                  <div className="absolute top-4 right-4 clay-pill px-3 py-1.5 text-text text-xs flex items-center gap-1.5 shadow-sm font-mono">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="font-semibold">5.0</span>
                    <span className="text-secondary text-[11px]">(24 meetups)</span>
                  </div>

                  {/* Field note documentary caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-xs text-[11px] font-mono border border-white/20">
                      <LotusMotif className="w-3.5 h-3.5 text-terracotta" />
                      <span>Jitwarpur, Madhubani • Mithilanchal</span>
                    </div>
                    <h2 className="font-heading text-lg font-medium text-white drop-shadow-xs">
                      {isHindi
                        ? "शांति देवी — वरिष्ठ लोक चित्रकार एवं मेज़बान"
                        : "Master Artisan Shanti Devi — Living Folk Art"}
                    </h2>
                    <p className="text-xs text-white/85 leading-snug">
                      {isHindi
                        ? "आंगन में प्राकृतिक खनिज रंगों और बांस की कलम से पारंपरिक अरिपन सृजन।"
                        : "Hand-grinding natural mineral dyes for ceremonial courtyard floor and wall art."}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 2: 4 PILLARS OF INDIAN HOSPITALITY (JOURNAL SPREAD)          */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          <FadeIn direction="up" delayMs={100} once={false} className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— भारतीय आतिथ्य के चार स्तम्भ —" : "— FOUR PILLARS OF INDIAN HOSPITALITY —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
              {isHindi ? "संस्कृति, सम्मान और मानवीय संबंध" : "Culture, Respect & Human Connection"}
            </h2>
          </FadeIn>

          <FadeIn direction="up" delayMs={150} once={false}>
            <div className="journal-paper p-6 sm:p-8 rounded-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Family Hospitality */}
                <div className="flex items-start gap-4 p-3 rounded-xs hover:bg-cream/40 transition-colors">
                  <div className="w-10 h-10 rounded-xs bg-warm border border-rule flex items-center justify-center shrink-0 text-terracotta">
                    <Home className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-text">
                      {isHindi ? "अतिथि सत्कार" : "Family Hospitality"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "पारंपरिक घरों में रहें और वास्तविक पारिवारिक स्नेह और भोजन का अनुभव करें।"
                        : "Experience real warmth in village courtyards and heritage homes with family-cooked meals."}
                    </p>
                  </div>
                </div>

                {/* 2. Hands-on Crafts */}
                <div className="flex items-start gap-4 p-3 rounded-xs hover:bg-cream/40 transition-colors">
                  <div className="w-10 h-10 rounded-xs bg-warm border border-rule flex items-center justify-center shrink-0 text-forest">
                    <Palette className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-text">
                      {isHindi ? "पारंपरिक शिल्प" : "Hands-on Crafts"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "कलाकारों के साथ बैठें और प्राकृतिक रंगों से सदियों पुरानी चित्रकला सीखें।"
                        : "Sit with master painters, potters and weavers in their courtyards."}
                    </p>
                  </div>
                </div>

                {/* 3. Living Traditions */}
                <div className="flex items-start gap-4 p-3 rounded-xs hover:bg-cream/40 transition-colors">
                  <div className="w-10 h-10 rounded-xs bg-warm border border-rule flex items-center justify-center shrink-0 text-terracotta">
                    <DiyaMotif className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-text">
                      {isHindi ? "जीवित परंपराएं" : "Living Traditions"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "मंदिर तालाब, संध्या आरती, विद्यापति लोक संगीत और क्षेत्रीय उत्सव।"
                        : "Temple ponds, evening Vidyapati folk poetry, and seasonal agrarian celebrations."}
                    </p>
                  </div>
                </div>

                {/* 4. Dignified Support */}
                <div className="flex items-start gap-4 p-3 rounded-xs hover:bg-cream/40 transition-colors">
                  <div className="w-10 h-10 rounded-xs bg-warm border border-rule flex items-center justify-center shrink-0 text-forest">
                    <TreePine className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-text">
                      {isHindi ? "सामुदायिक सशक्तिकरण" : "Community Support"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "आपकी यात्रा से स्थानीय ग्रामीण परिवारों व कलाकारों को सीधा संबल मिलता है।"
                        : "Every visit provides direct, dignified livelihood to indigenous artisan families."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 3: DISCOVER MITHILA & CONCIERGE SEARCH (ASYMMETRIC SPREAD)   */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Unified Search (7 cols) */}
            <FadeIn direction="up" delayMs={100} once={false} className="lg:col-span-7">
              <UnifiedSearch />
            </FadeIn>

            {/* Right: Active Pilot Region Card (5 cols) */}
            <FadeIn direction="up" delayMs={200} once={false} className="lg:col-span-5">
              <div className="postcard-paper rounded-sm p-6 sm:p-7 space-y-4 border border-rule/90 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-terracotta uppercase tracking-wider block mb-1">
                      {isHindi ? "सक्रिय पायलट क्षेत्र" : "ACTIVE PILOT REGION"}
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-medium text-text leading-tight flex items-center gap-2">
                      <JharokhaMotif className="w-5 h-5 text-terracotta shrink-0" />
                      <span>{isHindi ? "दरभंगा एवं मधुबनी (बिहार)" : "Darbhanga & Madhubani (Bihar)"}</span>
                    </h2>
                    <p className="text-xs text-secondary mt-1 font-heading">
                      North Gangetic Cultural Belt • Mithilanchal
                    </p>
                  </div>

                  <div className="w-14 h-14 shrink-0 rounded-lg bg-cream border border-rule/70 flex items-center justify-center p-1.5 shadow-2xs">
                    <Image
                      src="/images/darbhanga-palace-sketch.png"
                      alt="Darbhanga Raj Palace Architectural Motif"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  {isHindi
                    ? "हमारी सामुदायिक गतिविधियां उत्तरी बिहार के मिथिला सांस्कृतिक क्षेत्र से प्रारंभ होती हैं। सदियों पुरानी लोक चित्रकला, पारंपरिक खान-पान और पारिवारिक आतिथ्य का सीधे स्थानीय परिवारों के साथ अनुभव करें।"
                    : "Our community operations begin in the ancient cultural heartland of Northern Bihar. Experience centuries-old folk painting, traditional cuisine, and authentic family hospitality directly with verified residents."}
                </p>

                {/* Regional Highlight Tags */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 bg-cream border border-rule/80 rounded-full text-secondary">
                    Jitwarpur & Ranti Painting
                  </span>
                  <span className="px-2.5 py-1 bg-cream border border-rule/80 rounded-full text-secondary">
                    Raj Darbhanga Architecture
                  </span>
                  <span className="px-2.5 py-1 bg-cream border border-rule/80 rounded-full text-secondary">
                    Makhana & Wetland Ecosystems
                  </span>
                </div>

                {/* Regional Metrics */}
                <div className="space-y-2 border-t border-rule/70 pt-3 text-xs">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
                      <span>{isHindi ? "सत्यापित स्थानीय मेज़बान:" : "Verified Local Hosts:"}</span>
                    </span>
                    <span className="font-mono text-text font-medium">45+ Hosts</span>
                  </div>
                  <div className="flex items-center justify-between text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
                      <span>{isHindi ? "मुख्य भाषाएं:" : "Primary Languages:"}</span>
                    </span>
                    <span className="text-text font-medium">Maithili, Hindi, English</span>
                  </div>
                </div>

                {/* District Links */}
                <div className="pt-3 border-t border-rule/70 flex items-center justify-between text-xs font-semibold">
                  <Link
                    href="/india/bihar/darbhanga"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isHindi ? "दरभंगा ज़िला →" : "Darbhanga Heritage Trail →"}</span>
                  </Link>
                  <Link
                    href="/india/bihar/madhubani"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isHindi ? "मधुबनी ज़िला →" : "Madhubani Craft Trail →"}</span>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 4: 12 HERITAGE DOMAINS (EDITORIAL SPREAD, NOT 12 CARDS)      */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— सांस्कृतिक श्रेणियां —" : "— 12 HERITAGE DOMAINS OF INDIA —"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text">
              {isHindi ? "मिथिला एवं भारत की सांस्कृतिक विधाएं" : "The 12 Cultural Facets of Living Heritage"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "हमारी श्रेणियां भारत के जीवित सांस्कृतिक रूपों को सम्मान और प्रमाणिकता के साथ प्रस्तुत करती हैं।"
                : "A curated taxonomy documenting indigenous traditions from master artists and heritage scholars."}
            </p>
          </FadeIn>

          {/* Part A: 3 Visual Spotlight Domains (Large Editorial Features) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightDomains.map((spot, idx) => {
              const SpotIcon = spot.icon;
              return (
                <FadeIn key={spot.slug} direction="up" delayMs={idx * 120} once={false}>
                  <Link
                    href={`/categories/${spot.slug}`}
                    className="group block postcard-paper rounded-sm overflow-hidden hover:shadow-card transition-all duration-300 border border-rule/90"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                      <Image
                        src={spot.image}
                        alt={spot.titleEn}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-xs text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/20">
                        <SpotIcon className="w-3.5 h-3.5 text-terracotta" />
                        <span>{isHindi ? "प्रमुख विधा" : "Featured Domain"}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-heading text-lg font-medium leading-tight">
                          {isHindi ? spot.titleHi : spot.titleEn}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-secondary leading-relaxed">
                        {isHindi ? spot.taglineHi : spot.taglineEn}
                      </p>
                      <div className="pt-2 text-xs font-mono font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{isHindi ? "विस्तृत विवरण देखें" : "Explore Domain"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {/* Part B: 9 Typographical & Motif Facets (Editorial Magazine Index) */}
          <FadeIn direction="up" delayMs={200} once={false}>
            <div className="journal-paper p-6 sm:p-8 rounded-sm border border-rule">
              <div className="border-b border-rule/70 pb-3 mb-6 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-secondary font-medium">
                  {isHindi ? "शेष सांस्कृतिक विधाएं" : "Complete Cultural Catalog"}
                </span>
                <span className="text-[11px] font-mono text-terracotta font-medium">
                  9 Verified Heritage Collections
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {editorialCatalogDomains.map((domain) => {
                  const DomainIcon = domain.icon;
                  return (
                    <Link
                      key={domain.slug}
                      href={`/categories/${domain.slug}`}
                      className="group flex items-start gap-3.5 pb-4 border-b border-rule/60 hover:border-terracotta transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xs bg-warm border border-rule/80 flex items-center justify-center shrink-0 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                        <DomainIcon className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <h4 className="font-heading text-sm font-medium text-text group-hover:text-primary transition-colors">
                          {isHindi ? domain.titleHi : domain.titleEn}
                        </h4>
                        <p className="text-[11px] text-secondary">
                          {isHindi ? domain.highlightHi : domain.highlightEn}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-secondary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Traditional Madhubani Folk Pattern Divider */}
        <MadhubaniBorder />

        {/* ==================================================================== */}
        {/* SECTION 5: FEATURED EXPERIENCES (PHASE 1 ENQUIRY-ONLY MODEL)         */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— हमारे सांस्कृतिक अनुभव —" : "— FEATURED CULTURAL EXPERIENCES —"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text">
              {isHindi ? "उत्तरी बिहार में पारंपरिक सांस्कृतिक अनुभव" : "Living Traditions & Workshops in North Bihar"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "मिथिला कला से लेकर ग्रामीण जीवन तक, ऐसे अनुभवों से जुड़ें जो आपको लोगों, संस्कृति और दैनिक परंपराओं से जोड़ते हैं।"
                : "Engage directly with verified local artisans and cultural custodians in their home villages."}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOfferings.map((item, index) => {
              const IconComp = item.icon;
              return (
                <FadeIn
                  key={item.id}
                  direction="up"
                  delayMs={index * 120}
                  once={false}
                  className="group postcard-paper rounded-sm overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-rule/90"
                >
                  <div>
                    {/* Card Photo with Category Pill & Rating */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                      <Image
                        src={item.image}
                        alt={item.titleEn}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Category Pill Top Left */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xs border border-white/20">
                        {isHindi ? item.categoryHi : item.categoryEn}
                      </div>

                      {/* Rating Top Right */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-xs border border-white/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{item.rating}</span>
                      </div>

                      {/* Location Chip Bottom Left */}
                      <div className="absolute bottom-2.5 left-3 text-white text-xs flex items-center gap-1 font-mono drop-shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span>{isHindi ? item.locationHi : item.locationEn}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <IconComp className="w-4 h-4 text-terracotta shrink-0 mt-0.5" strokeWidth={1.75} />
                        <h3 className="font-heading text-sm font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                          {isHindi ? item.titleHi : item.titleEn}
                        </h3>
                      </div>

                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                        {isHindi ? item.narrativeHi : item.narrativeEn}
                      </p>

                      {/* Host & Duration */}
                      <div className="text-xs text-secondary space-y-1 border-t border-rule/60 pt-2 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-secondary">
                            {isHindi ? "मेज़बान:" : "Host:"}
                          </span>
                          <span className="font-medium text-text text-[11px]">
                            {isHindi ? item.hostHi : item.hostEn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-secondary">
                            {isHindi ? "अवधि:" : "Duration:"}
                          </span>
                          <span className="font-medium text-text text-[11px]">
                            {isHindi ? item.durationHi : item.durationEn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Clear Enquiry-Only Label */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-rule/50 mt-2 font-mono">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest">
                      <CheckCircle2 className="w-3 h-3" />
                      {isHindi ? "पूछताछ उपलब्ध" : "Pilot Enquiry Only"}
                    </span>
                    <Link
                      href={item.link}
                      className="w-7 h-7 rounded-xs border border-rule group-hover:border-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center text-secondary transition-all duration-150 tactile-button"
                      aria-label={`View ${item.titleEn}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 6: MEET VERIFIED LOCAL RESIDENTS (PORTRAIT-LED STORYTELLING) */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-forest uppercase tracking-widest block font-mono">
              {isHindi ? "— सत्यापित स्थानीय नागरिक —" : "— MEET VERIFIED LOCAL RESIDENTS —"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text">
              {isHindi ? "उत्तरी बिहार के स्थानीय निवासियों से मिलें" : "Human Connection Through Mutual Respect"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "चाय पर बात करें, मोहल्ले में टहलें और स्थानीय परिवारों के जीवन को प्रत्यक्ष रूप से जानें।"
                : "Connect with local scholars, artists, and residents for tea, neighborhood strolls, and language exchange at designated public venues."}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {localHosts.map((host, idx) => (
              <FadeIn
                key={host.id}
                direction="up"
                delayMs={idx * 150}
                once={false}
                className="journal-paper rounded-sm p-6 shadow-xs hover:shadow-card transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-rule/90"
              >
                {/* Host Portrait */}
                <div className="relative w-32 h-32 rounded-xs overflow-hidden shrink-0 border border-rule/80 bg-cream shadow-xs">
                  <Image
                    src={host.image}
                    alt={host.nameEn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-white/95 dark:bg-black/90 p-1 rounded-xs text-forest shadow-xs">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Host Details */}
                <div className="space-y-2.5 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-heading text-lg font-medium text-text">
                      {isHindi ? host.nameHi : host.nameEn}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      {isHindi ? "प्रशासनिक सत्यापित" : "ID Verified"}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-terracotta font-serif">
                    {isHindi ? host.roleHi : host.roleEn}
                  </p>

                  <p className="text-xs text-secondary leading-relaxed">
                    {isHindi ? host.bioHi : host.bioEn}
                  </p>

                  {/* Public Details */}
                  <div className="text-xs text-secondary space-y-1.5 pt-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{isHindi ? host.locationHi : host.locationEn}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Languages className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{isHindi ? host.languagesHi : host.languagesEn}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-text/90 font-medium">
                      <Compass className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span>{isHindi ? host.meetingHi : host.meetingEn}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-rule/60">
                    <Link
                      href={`/connections/new?target=${host.id}`}
                      className="tactile-button inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface hover:bg-cream border border-rule text-xs font-mono font-semibold uppercase tracking-wider text-primary rounded-xs transition-colors shadow-2xs"
                    >
                      <span>{isHindi ? "मुलाक़ात का प्रस्ताव भेजें →" : "Request Public Meetup →"}</span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/explore/people"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-secondary hover:text-text uppercase tracking-wider"
            >
              <span>{isHindi ? "सभी स्थानीय नागरिक देखें →" : "Browse All Verified Residents →"}</span>
            </Link>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 7: STAY WITH A LOCAL (HONEST PHASE 3 COMPLIANCE ROADMAP)    */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          <FadeIn direction="up" once={false}>
            <div className="postcard-paper p-6 sm:p-10 rounded-sm relative overflow-hidden space-y-6 border border-rule/90 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/70 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-terracotta">
                      {isHindi ? "माध्यम ३: पारिवारिक प्रवास" : "PRODUCT C: STAY WITH A LOCAL"}
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-xs bg-cream border border-rule font-medium text-secondary">
                      {isHindi ? "चरण ३ — आगामी" : "Phase 3 • Coming Soon"}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
                    {isHindi ? "पारिवारिक आवास और ग्रामीण होमस्टे का दृष्टिकोण" : "Residential Hospitality & Homestay Compliance"}
                  </h2>
                </div>

                <Link
                  href="/explore/stays"
                  className="tactile-button inline-flex items-center gap-1.5 px-4 py-2 border border-rule rounded-xs text-xs font-mono font-semibold uppercase tracking-wider text-text hover:bg-cream transition-colors shadow-2xs"
                >
                  <span>{isHindi ? "अनुपालन ढांचा पढ़ें →" : "Read Compliance Standards →"}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-secondary">
                <div className="p-4 rounded-xl bg-cream/40 border border-rule/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-forest shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-text">
                    {isHindi ? "१. कानूनी व विदेशी नागरिक दायित्व" : "1. Statutory Duty (Form C)"}
                  </h3>
                  <p>
                    {isHindi
                      ? "विदेशी आगंतुकों के लिए भारतीय नियमों के अनुसार २४ घंटे के भीतर फॉर्म-सी (Form C) व पुलिस अनुपालन अनिवार्य है।"
                      : "Mandatory compliance with Indian immigration laws, including 24-hour statutory Form C reporting for international guests."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream/40 border border-rule/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-terracotta shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-text">
                    {isHindi ? "२. भौतिक सुरक्षा व निरीक्षण" : "2. Physical Safety Inspections"}
                  </h3>
                  <p>
                    {isHindi
                      ? "स्वच्छता, निजी शयनकक्ष, सुरक्षित परिसर और पारिवारिक सहमति का स्वतंत्र ऑन-साइट सत्यापन।"
                      : "Independent on-site inspection of room locks, hygiene, privacy boundaries, and verified multi-generational household consent."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream/40 border border-rule/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-forest shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-text">
                    {isHindi ? "३. पारदर्शी प्रारंभ" : "3. Transparent Rollout"}
                  </h3>
                  <p>
                    {isHindi
                      ? "अतिथि देवो भव पर हम असत्यापित सुविधाओं को काम करता हुआ नहीं दिखाते। पूर्ण अनुपालन के पश्चात ही बुकिंग खुलेगी।"
                      : "We never advertise inactive features as live. Homestay bookings will unlock in Phase 3 strictly following full compliance."}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 8: TRUST, SAFETY & PRIVACY STANDARDS                        */}
        {/* ==================================================================== */}
        <FadeIn direction="up" once={false} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-rule/80 pb-4">
            <div>
              <span className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1">
                {isHindi ? "सुरक्षा और निष्ठा" : "SAFETY & INTEGRITY"}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
                {isHindi ? "विश्वास, सुरक्षा और गोपनीयता के मानक" : "Trust, Safety & Privacy Standards"}
              </h2>
            </div>
            <Link
              href="/safety"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{isHindi ? "सुरक्षा दिशानिर्देश पढ़ें →" : "Read Safety Protocol →"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Identity Verification */}
            <div className="p-6 journal-paper rounded-sm space-y-3 shadow-xs hover:shadow-card transition-all border border-rule/90">
              <div className="w-10 h-10 rounded-xs bg-forest/10 flex items-center justify-center text-forest border border-forest/20">
                <ShieldCheck className="w-5 h-5 text-forest" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {isHindi ? "१००% व्यक्तिगत सत्यापन" : "100% ID Verified"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "प्रत्येक मेज़बान नागरिक की पहचान प्रशासनिक रूप से सत्यापित की जाती है। कोई छद्म या अनाम खाता नहीं।"
                  : "Every local resident and host profile is reviewed individually. Zero anonymous or unvetted accounts."}
              </p>
            </div>

            {/* 2. Dual Mutual Consent */}
            <div className="p-6 journal-paper rounded-sm space-y-3 shadow-xs hover:shadow-card transition-all border border-rule/90">
              <div className="w-10 h-10 rounded-xs bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Lock className="w-5 h-5 text-terracotta" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {isHindi ? "आपसी सहमति से संपर्क" : "Dual Mutual Consent"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "व्यक्तिगत फोन नंबर और संपर्क तब तक पूरी तरह सुरक्षित रहते हैं जब तक दोनों पक्ष सहमति न दें।"
                  : "Phone numbers and full email addresses remain private until both parties explicitly agree to reveal."}
              </p>
            </div>

            {/* 3. Public Meeting Protocol */}
            <div className="p-6 journal-paper rounded-sm space-y-3 shadow-xs hover:shadow-card transition-all border border-rule/90">
              <div className="w-10 h-10 rounded-xs bg-forest/10 flex items-center justify-center text-forest border border-forest/20">
                <Compass className="w-5 h-5 text-forest" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {isHindi ? "सार्वजनिक बैठक स्थल" : "Public Venues First"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "सभी प्रारंभिक मुलाक़ातें और अनुभव प्रसिद्ध सार्वजनिक स्थलों — जैसे मंदिर परिसर, हाट या कलाकार केंद्रों — पर शुरू होते हैं।"
                  : "Initial meetings commence exclusively at well-known public locations like village haats or temple courtyards."}
              </p>
            </div>

            {/* 4. Zero Ad Trackers */}
            <div className="p-6 journal-paper rounded-sm space-y-3 shadow-xs hover:shadow-card transition-all border border-rule/90">
              <div className="w-10 h-10 rounded-xs bg-secondary/10 flex items-center justify-center text-secondary border border-rule">
                <EyeOff className="w-5 h-5 text-secondary" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {isHindi ? "शून्य विज्ञापन ट्रैकर" : "Zero Ad Trackers"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम के पूर्ण अनुपालन में। कोई विज्ञापन नहीं, कोई डेटा बिक्री नहीं।"
                  : "Full compliance with the Indian DPDP Act. We never sell your personal data or execute third-party ad tracking."}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ==================================================================== */}
        {/* SECTION 9: COLOPHON & COMMUNITY CALL TO ACTION                      */}
        {/* ==================================================================== */}
        <FadeIn direction="up" once={false}>
          <div className="relative rounded-sm overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-[#234033] text-white border border-forest">
            <div className="absolute inset-0 opacity-25">
              <Image
                src="/images/mithila-landscape-banner.jpg"
                alt="Mithila rural landscape"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A3026] via-[#234033]/90 to-[#2F5242]/85" />

            <div className="relative z-10 px-6 sm:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Brand Lockup */}
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="Atithi Devo Bhava"
                    width={180}
                    height={60}
                    className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/20 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-heading text-xl sm:text-2xl font-medium tracking-wide">
                    {isHindi ? "सांस्कृतिक समुदाय का हिस्सा बनें" : "Be Part of Our Cultural Community"}
                  </h3>
                  <p className="text-xs text-white/80 max-w-md leading-relaxed font-body">
                    {isHindi
                      ? "अपना घर खोलें, अपनी संस्कृति साझा करें और मिथिला की आतिथ्य परंपरा में दुनिया का स्वागत करें।"
                      : "Open your village home, share your art, and welcome travelers with the sacred warmth of Mithila."}
                  </p>
                </div>
              </div>

              {/* Right CTA Button */}
              <div className="shrink-0">
                <Link
                  href="/become-a-host"
                  className="tactile-button inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E4B07A] hover:bg-[#d8a167] text-[#1A3026] rounded-xs text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs"
                >
                  <span>{isHindi ? "मेज़बान बनें →" : "Become a Host"}</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
