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
  Calendar,
  Search,
  Languages,
  MapPin,
  Star,
  Music,
  Heart,
  Footprints,
  BookOpen,
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
      titleEn: "Mithila Painting Workshop",
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
    },
    {
      id: "exp-maithili-cuisine",
      titleEn: "Maithili Culinary Heritage",
      titleHi: "पारंपरिक मैथिली पाक कला व भोजन",
      locationEn: "Ranti Village, Madhubani",
      locationHi: "रांटी गांव, मधुबनी",
      durationEn: "3.0 Hours",
      durationHi: "३.० घंटे",
      categoryEn: "Culinary Heritage",
      categoryHi: "पारंपरिक खान-पान",
      hostEn: "Sunita Kumari",
      hostHi: "सुनीता कुमारी",
      rating: "4.9",
      reviewsCount: 18,
      image: "/images/exp-cuisine.jpg",
      icon: UtensilsCrossed,
      link: "/experiences/exp-maithili-cuisine",
    },
    {
      id: "exp-darbhanga-heritage",
      titleEn: "Historic Temple Pond Walk",
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
      hostEn: "Local Farmer Collective",
      hostHi: "स्थानीय कृषक समुदाय",
      rating: "4.8",
      reviewsCount: 15,
      image: "/images/exp-makhana.jpg",
      icon: TreePine,
      link: "/experiences/exp-makhana-culture",
    },
  ];

  // 12 Cultural Heritage Categories
  const culturalCategories = [
    { titleEn: "Mithila Painting", titleHi: "मिथिला चित्रकला", icon: Palette, slug: "mithila-painting" },
    { titleEn: "Culinary Traditions", titleHi: "पारंपरिक खान-पान", icon: UtensilsCrossed, slug: "culinary-traditions" },
    { titleEn: "Folk Music & Poetry", titleHi: "लोक संगीत व पदावली", icon: Music, slug: "folk-music-poetry" },
    { titleEn: "Palaces & Temples", titleHi: "राज प्रासाद व मंदिर", icon: Landmark, slug: "palaces-temples" },
    { titleEn: "Handloom & Weaving", titleHi: "हथकरघा एवं बुनाई", icon: Sparkles, slug: "handloom-weaving" },
    { titleEn: "Sikki Grass Craft", titleHi: "सिक्की घास शिल्प", icon: TreePine, slug: "sikki-grass-craft" },
    { titleEn: "Sacred Aripan Art", titleHi: "पवित्र अरिपन रेखांकन", icon: LotusMotif, slug: "sacred-aripan" },
    { titleEn: "Rural Farming Life", titleHi: "ग्रामीण जीवन व कृषि", icon: Home, slug: "rural-farming" },
    { titleEn: "Ayurveda & Flora", titleHi: "पारंपरिक जड़ी-बूटी", icon: Heart, slug: "ayurveda-flora" },
    { titleEn: "Maithili Oral Lore", titleHi: "मैथिली भाषा व कथाएं", icon: BookOpen, slug: "maithili-oral-lore" },
    { titleEn: "Ponds & Ghats", titleHi: "पवित्र पोखर व घाट", icon: Footprints, slug: "ponds-ghats" },
    { titleEn: "Fairs & Melas", titleHi: "क्षेत्रीय मेले व उत्सव", icon: Compass, slug: "fairs-melas" },
  ];

  // Verified Local Residents Spotlight
  const localHosts = [
    {
      id: "shanti-devi",
      nameEn: "Shanti Devi",
      nameHi: "शांति देवी",
      roleEn: "Master Folk Painter • State Awardee",
      roleHi: "वरिष्ठ मिथिला चित्रकार • राज्य पुरस्कार प्राप्त",
      locationEn: "Jitwarpur, Madhubani",
      locationHi: "जितवारपुर, मधुबनी",
      languagesEn: "Maithili, Hindi",
      languagesHi: "मैथिली, हिन्दी",
      meetingEn: "Jitwarpur Village Artists Centre",
      meetingHi: "जितवारपुर ग्राम कलाकार केंद्र",
      image: "/images/host-shanti-devi.jpg",
      experienceYears: "28+",
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
    },
  ];

  return (
    <>
      {/* Smooth initial boot loading screen */}
      <InitialLoader />

      <div className="site-container py-6 sm:py-10 space-y-16 sm:space-y-24">
        {/* ==================================================================== */}
        {/* SECTION 1: HERO SECTION WITH INDIAN CULTURAL HARMONY                */}
        {/* ==================================================================== */}
        <section className="relative pt-2 sm:pt-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <FadeIn direction="up" delayMs={100} once={false} className="lg:col-span-7 space-y-6">
              {/* Pilot Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-rule/80 rounded-full text-xs font-medium text-secondary shadow-2xs">
                <LotusMotif className="w-4 h-4 text-terracotta shrink-0" />
                <span>
                  {isHindi
                    ? "सत्यापित सांस्कृतिक आतिथ्य मंच · उत्तरी बिहार पायलट (मिथिला)"
                    : "Verified Cultural Hospitality Platform • North Bihar Pilot (Mithila)"}
                </span>
              </div>

              {/* Bilingual Headline & Sanskrit Invocation */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-terracotta uppercase">
                  <DiyaMotif className="w-3.5 h-3.5 text-terracotta" />
                  <span>{isHindi ? "अतिथि सत्कार परंपरा" : "Sacred Indian Hospitality Tradition"}</span>
                </div>
                <h1
                  lang="hi"
                  className="font-heading text-3xl sm:text-5xl lg:text-[3.25rem] font-medium text-text leading-[1.25] tracking-tight"
                >
                  भारत को लोगों के साथ महसूस कीजिए ।
                </h1>
                <p className="font-heading text-lg sm:text-2xl text-secondary font-normal">
                  Experience India through its people, families and living cultures.
                </p>
                <p className="text-xs sm:text-sm font-serif italic text-forest">
                  {isHindi
                    ? "अतिथि देवो भवः — अतिथि साक्षात ईश्वर का स्वरूप हैं।"
                    : "Atithi Devo Bhava — The Guest is Equivalent to the Divine."}
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="font-body text-sm sm:text-base text-secondary leading-relaxed max-w-xl">
                {isHindi
                  ? "स्थानीय परिवारों के साथ बैठें, पारंपरिक मिथिला चित्रकला सीखें, ऐतिहासिक पोखरों का इतिहास जानें और भारत की पवित्र आतिथ्य परंपरा को आदरपूर्वक समझें।"
                  : "Sit with local families, learn ancient folk painting in village courtyards, walk centuries-old temple ponds, and share in India's respectful hospitality traditions."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/explore/experiences"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#283827] hover:bg-[#1e2b1d] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <Compass className="w-4 h-4" strokeWidth={2} />
                  <span>{isHindi ? "अनुभव खोजें" : "Explore Experiences"}</span>
                </Link>

                <StoryModal buttonText={isHindi ? "संस्कृति देखें" : "Watch Story"} />

                <Link
                  href="/explore/people"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-terracotta/80 text-terracotta hover:bg-terracotta/10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  <Users className="w-4 h-4" strokeWidth={1.75} />
                  <span>{isHindi ? "नागरिकों से मिलें" : "Meet a Local"}</span>
                </Link>
              </div>

              {/* Trust & Scale Strip */}
              <div className="pt-4 border-t border-rule/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="block font-heading text-base font-semibold text-text">45+</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "सत्यापित मेज़बान" : "Verified Hosts"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-base font-semibold text-text">12</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "सांस्कृतिक विधाएं" : "Heritage Domains"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-base font-semibold text-forest">100%</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "व्यक्तिगत सत्यापन" : "ID Checked"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-base font-semibold text-terracotta">2</span>
                  <span className="text-secondary text-[11px]">
                    {isHindi ? "पायलट ज़िले (मिथिला)" : "Pilot Districts"}
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Right Hero Image (5 Cols) with Authentic Master Artisan */}
            <FadeIn direction="up" delayMs={250} once={false} className="lg:col-span-5">
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg border-2 border-rule/80 group bg-surface">
                <Image
                  src="/images/hero-artisan.jpg"
                  alt="Mithila master artisan hand painting traditional folk art mural in a village courtyard"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Traditional lighting overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Floating Top Rating Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20 text-white text-xs flex items-center gap-1.5 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#E4B07A] text-[#E4B07A]" />
                  <span className="font-semibold">5.0</span>
                  <span className="text-white/75 text-[11px]">(24 meetups)</span>
                </div>

                {/* Cultural caption badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-full text-[11px] font-medium border border-white/20">
                    <LotusMotif className="w-3.5 h-3.5 text-terracotta" />
                    <span>Jitwarpur, Madhubani • Mithilanchal</span>
                  </div>
                  <h3 className="font-heading text-base font-medium text-white drop-shadow-xs">
                    {isHindi
                      ? "शांति देवी — वरिष्ठ लोक चित्रकार एवं मेज़बान"
                      : "Master Artisan Shanti Devi — Living Folk Traditions"}
                  </h3>
                  <p className="text-xs text-white/80 leading-snug">
                    {isHindi
                      ? "आंगन में प्राकृतिक रंगों से पारंपरिक अरिपन और कोहबर भित्तिचित्रों का सृजन।"
                      : "Demonstrating handmade bamboo brush painting with natural mineral pigments."}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 2: 4 PILLARS OF SACRED INDIAN HOSPITALITY                    */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          <FadeIn direction="up" delayMs={100} once={false} className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— भारतीय आतिथ्य के चार स्तम्भ —" : "— FOUR PILLARS OF INDIAN HOSPITALITY —"}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-medium text-text">
              {isHindi ? "संस्कृति, सम्मान और मानवीय संबंध" : "Culture, Respect & Human Connection"}
            </h2>
          </FadeIn>

          <FadeIn direction="up" delayMs={150} once={false}>
            <div className="border border-rule/90 py-6 sm:py-8 px-6 bg-surface/70 rounded-lg shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Stay with Locals */}
                <div className="flex items-start gap-3.5 p-3 rounded-md hover:bg-warm/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warm border border-rule flex items-center justify-center shrink-0 text-terracotta">
                    <Home className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-medium text-text">
                      {isHindi ? "अतिथि सत्कार" : "Family Hospitality"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "पारंपरिक घरों में रहें और वास्तविक पारिवारिक स्नेह का अनुभव करें।"
                        : "Experience real warmth in village and heritage homes with home-cooked meals."}
                    </p>
                  </div>
                </div>

                {/* 2. Learn & Create */}
                <div className="flex items-start gap-3.5 p-3 rounded-md hover:bg-warm/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warm border border-rule flex items-center justify-center shrink-0 text-forest">
                    <Palette className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-medium text-text">
                      {isHindi ? "पारंपरिक शिल्प" : "Hands-on Crafts"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "कलाकारों के साथ बैठें और प्राकृतिक रंगों से चित्रकला सीखें।"
                        : "Sit with master painters, potters and weavers in their courtyards."}
                    </p>
                  </div>
                </div>

                {/* 3. Live the Culture */}
                <div className="flex items-start gap-3.5 p-3 rounded-md hover:bg-warm/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warm border border-rule flex items-center justify-center shrink-0 text-terracotta">
                    <DiyaMotif className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-medium text-text">
                      {isHindi ? "जीवित परंपराएं" : "Living Traditions"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "मंदिर तालाब, संध्या आरती, लोक संगीत और स्थानीय उत्सव।"
                        : "Temple ponds, evening folk music, and seasonal cultural celebrations."}
                    </p>
                  </div>
                </div>

                {/* 4. Support Communities */}
                <div className="flex items-start gap-3.5 p-3 rounded-md hover:bg-warm/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warm border border-rule flex items-center justify-center shrink-0 text-forest">
                    <TreePine className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-medium text-text">
                      {isHindi ? "सामुदायिक सशक्तिकरण" : "Community Support"}
                    </h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {isHindi
                        ? "आपकी यात्रा से स्थानीय ग्रामीण परिवारों को सीधा संबल मिलता है।"
                        : "Every visit provides direct, dignified livelihood to local families."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 3: UNIFIED SEARCH & ACTIVE PILOT REGION (2 COLUMNS)          */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Search Component (7 cols) */}
            <FadeIn direction="up" delayMs={100} once={false} className="lg:col-span-7">
              <UnifiedSearch />
            </FadeIn>

            {/* Right: Active Pilot Region Card (5 cols) */}
            <FadeIn direction="up" delayMs={200} once={false} className="lg:col-span-5">
              <div className="border border-rule/90 rounded-md p-6 bg-surface shadow-xs relative overflow-hidden space-y-4">
                {/* Header row with Title + Palace Sketch */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-terracotta uppercase tracking-wider block mb-1">
                      {isHindi ? "सक्रिय पायलट क्षेत्र" : "ACTIVE PILOT REGION"}
                    </span>
                    <h2 className="font-heading text-xl font-medium text-text leading-tight flex items-center gap-1.5">
                      <JharokhaMotif className="w-5 h-5 text-terracotta shrink-0" />
                      <span>{isHindi ? "दरभंगा एवं मधुबनी (बिहार)" : "Darbhanga & Madhubani (Bihar)"}</span>
                    </h2>
                    <p className="text-xs text-secondary mt-0.5 font-heading">
                      North Gangetic Cultural Belt • Mithilanchal
                    </p>
                  </div>

                  <div className="w-12 h-12 shrink-0 rounded-sm bg-warm/30 border border-rule/60 flex items-center justify-center p-1">
                    <Image
                      src="/images/darbhanga-palace-sketch.png"
                      alt="Darbhanga Raj Palace Architectural Motif"
                      width={44}
                      height={44}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-secondary leading-relaxed">
                  {isHindi
                    ? "हमारी सामुदायिक गतिविधियां उत्तरी बिहार के मिथिला सांस्कृतिक क्षेत्र से शुरू होती हैं। सदियों पुरानी लोक चित्रकला, पारंपरिक खान-पान, और पारिवारिक आतिथ्य का सीधे स्थानीय परिवारों के साथ अनुभव करें।"
                    : "Our community operations begin in the Mithila cultural belt of Northern Bihar. Experience centuries-old folk painting, traditional cuisine, and family hospitality directly with verified residents."}
                </p>

                {/* Cultural Highlights Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 bg-warm/60 border border-rule/80 rounded-full text-secondary">
                    Jitwarpur & Ranti Painting
                  </span>
                  <span className="px-2 py-0.5 bg-warm/60 border border-rule/80 rounded-full text-secondary">
                    Raj Darbhanga Architecture
                  </span>
                  <span className="px-2 py-0.5 bg-warm/60 border border-rule/80 rounded-full text-secondary">
                    Makhana & Pond Ecosystems
                  </span>
                </div>

                {/* Metrics Rows */}
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
                      <Landmark className="w-3.5 h-3.5 text-terracotta" strokeWidth={1.75} />
                      <span>{isHindi ? "सांस्कृतिक विषय:" : "Key Cultural Interests:"}</span>
                    </span>
                    <span className="text-text font-medium text-right">Mithila Art, Pond Heritage, Cuisine</span>
                  </div>

                  <div className="flex items-center justify-between text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
                      <span>{isHindi ? "मुख्य भाषाएं:" : "Primary Languages:"}</span>
                    </span>
                    <span className="text-text font-medium">Maithili, Hindi, English</span>
                  </div>
                </div>

                {/* District Navigation Links */}
                <div className="pt-2 border-t border-rule/70 flex items-center justify-between text-xs font-medium">
                  <Link
                    href="/india/bihar/darbhanga"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isHindi ? "दरभंगा ज़िला →" : "Darbhanga District →"}</span>
                  </Link>
                  <Link
                    href="/india/bihar/madhubani"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isHindi ? "मधुबनी ज़िला →" : "Madhubani District →"}</span>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 4: FEATURED CULTURAL OFFERINGS (4 RICH HIGH-RES CARDS)       */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— हमारे सांस्कृतिक अनुभव —" : "— FEATURED CULTURAL EXPERIENCES —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-text">
              {isHindi ? "उत्तरी बिहार में पारंपरिक सांस्कृतिक अनुभव" : "Living Traditions & Cultural Experiences in North Bihar"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "मिथिला कला से लेकर ग्रामीण जीवन तक, ऐसे अनुभवों से जुड़ें जो आपको लोगों, संस्कृति और दैनिक परंपराओं से जोड़ते हैं।"
                : "From ancient Mithila painting to wetland pond harvests, connect directly with verified local residents."}
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
                  className="group bg-surface border border-rule/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Photo with Category Pill & Rating */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-warm-grey">
                      <Image
                        src={item.image}
                        alt={item.titleEn}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Category Pill Top Left */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
                        {isHindi ? item.categoryHi : item.categoryEn}
                      </div>

                      {/* Rating Top Right */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#E4B07A] text-[#E4B07A]" />
                        <span>{item.rating}</span>
                      </div>

                      {/* Location Chip Bottom Left */}
                      <div className="absolute bottom-2 left-3 text-white text-xs flex items-center gap-1 font-medium drop-shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span>{isHindi ? item.locationHi : item.locationEn}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <IconComp className="w-4 h-4 text-terracotta shrink-0 mt-0.5" strokeWidth={1.75} />
                        <h3 className="font-heading text-sm font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                          {isHindi ? item.titleHi : item.titleEn}
                        </h3>
                      </div>

                      {/* Host & Duration Line */}
                      <div className="text-xs text-secondary space-y-1 border-t border-rule/60 pt-2">
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

                  {/* Card Bottom Action */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-rule/50 mt-1">
                    <span className="text-[11px] font-medium text-forest">
                      {isHindi ? "पायलट पूछताछ उपलब्ध" : "Pilot Enquiry Open"}
                    </span>
                    <Link
                      href={item.link}
                      className="w-8 h-8 rounded-full border border-rule group-hover:border-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center text-secondary transition-all duration-200"
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

        {/* Traditional Madhubani Folk Pattern Divider */}
        <MadhubaniBorder />

        {/* ==================================================================== */}
        {/* SECTION 5: SPOTLIGHT ON VERIFIED LOCAL RESIDENTS                     */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-forest uppercase tracking-widest block">
              {isHindi ? "— सत्यापित स्थानीय नागरिक —" : "— MEET VERIFIED LOCAL PEOPLE —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-text">
              {isHindi ? "उत्तरी बिहार के स्थानीय निवासियों से मिलें" : "Connect with Local Residents in North Bihar"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "चाय पर बात करें, मोहल्ले में टहलें और स्थानीय परिवारों के जीवन को प्रत्यक्ष रूप से जानें।"
                : "Meet local scholars, artists, and families for tea and walks at designated public meeting venues."}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {localHosts.map((host, idx) => (
              <FadeIn
                key={host.id}
                direction="up"
                delayMs={idx * 150}
                once={false}
                className="bg-surface border border-rule/80 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center sm:items-start"
              >
                {/* Host Portrait */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-terracotta/40 shadow-xs bg-warm">
                  <Image
                    src={host.image}
                    alt={host.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Host Details */}
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-heading text-lg font-medium text-text">
                      {isHindi ? host.nameHi : host.nameEn}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      {isHindi ? "सत्यापित" : "Verified"}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-terracotta">
                    {isHindi ? host.roleHi : host.roleEn}
                  </p>

                  <div className="text-xs text-secondary space-y-1 pt-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{isHindi ? host.locationHi : host.locationEn}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{isHindi ? host.languagesHi : host.languagesEn}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-text/80 font-medium">
                      <Compass className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span>{isHindi ? host.meetingHi : host.meetingEn}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/connections/new?target=${host.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>{isHindi ? "मुलाक़ात का प्रस्ताव भेजें →" : "Request Meetup →"}</span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/explore/people"
              className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-text uppercase tracking-wider"
            >
              <span>{isHindi ? "सभी स्थानीय नागरिक देखें →" : "Browse All Verified Locals →"}</span>
            </Link>
          </div>
        </section>

        {/* Traditional Aripan Geometric Divider */}
        <AripanDivider />

        {/* ==================================================================== */}
        {/* SECTION 6: 12 CULTURAL HERITAGE DOMAINS OF INDIA                     */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— सांस्कृतिक श्रेणियां —" : "— 12 CULTURAL HERITAGE DOMAINS —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text">
              {isHindi ? "मिथिला एवं भारत की सांस्कृतिक विधाएं" : "Explore Traditions Across 12 Cultural Facets"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "हमारी श्रेणियां भारत के जीवित सांस्कृतिक रूपों को सम्मान और प्रमाणिकता के साथ प्रस्तुत करती हैं।"
                : "Discover authentic aspects of Indian heritage categorized across 12 official domains."}
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {culturalCategories.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <FadeIn key={cat.slug} direction="up" delayMs={idx * 40} once={false}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="p-3.5 bg-surface border border-rule/80 hover:border-terracotta/80 rounded-lg flex flex-col items-center text-center space-y-2 shadow-2xs hover:shadow-xs transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-warm/60 group-hover:bg-terracotta/10 flex items-center justify-center text-terracotta transition-colors">
                      <CatIcon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xs font-medium text-text group-hover:text-primary transition-colors leading-tight">
                        {isHindi ? cat.titleHi : cat.titleEn}
                      </h3>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 7: HOW IT WORKS (3 EASY STEPS WITH VILLAGE ETCHING)         */}
        {/* ==================================================================== */}
        <section className="space-y-8 pt-4 pb-4">
          <FadeIn direction="up" once={false} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— यह कैसे काम करता है —" : "— HOW IT WORKS —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-text">
              {isHindi ? "तीन सरल चरणों में अपनी सांस्कृतिक यात्रा की योजना बनाएं" : "Plan Your Cultural Visit in 3 Easy Steps"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "गोपनीयता और आपसी सहमति पर आधारित एक सरल और पारदर्शी प्रक्रिया।"
                : "A simple, privacy-first process founded on mutual consent and verified community trust."}
            </p>
          </FadeIn>

          <div className="relative pt-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <FadeIn direction="up" delayMs={100} once={false} className="text-center space-y-3 px-4">
                <div className="w-16 h-16 rounded-full bg-warm/80 border-2 border-rule mx-auto flex items-center justify-center text-text shadow-xs">
                  <Search className="w-6 h-6 text-terracotta" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-lg font-medium text-text">
                  {isHindi ? "१. खोजें (1. Discover)" : "1. Discover"}
                </h3>
                <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
                  {isHindi
                    ? "सत्यापित स्थानीय नागरिक, पारंपरिक कार्यशालाएं और सांस्कृतिक स्थान खोजें।"
                    : "Find verified local residents, traditional workshops, and cultural experiences."}
                </p>
              </FadeIn>

              {/* Step 2 */}
              <FadeIn direction="up" delayMs={200} once={false} className="text-center space-y-3 px-4">
                <div className="w-16 h-16 rounded-full bg-warm/80 border-2 border-rule mx-auto flex items-center justify-center text-text shadow-xs">
                  <Calendar className="w-6 h-6 text-forest" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-lg font-medium text-text">
                  {isHindi ? "२. योजना बनाएं (2. Plan & Connect)" : "2. Plan & Connect"}
                </h3>
                <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
                  {isHindi
                    ? "तारीख चुनें, अपने मेज़बान से सार्वजनिक बैठक स्थल पर जुड़ें और पुष्टि करें।"
                    : "Choose a date, connect with your host for a public meeting, and confirm details."}
                </p>
              </FadeIn>

              {/* Step 3 */}
              <FadeIn direction="up" delayMs={300} once={false} className="text-center space-y-3 px-4">
                <div className="w-16 h-16 rounded-full bg-warm/80 border-2 border-rule mx-auto flex items-center justify-center text-text shadow-xs">
                  <Users className="w-6 h-6 text-terracotta" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-lg font-medium text-text">
                  {isHindi ? "३. अनुभव प्राप्त करें (3. Experience)" : "3. Experience"}
                </h3>
                <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
                  {isHindi
                    ? "स्थानीय परिवारों के साथ रहें, सीधे सीखें और परस्पर आदर का भाव साझा करें।"
                    : "Stay with local families, learn traditions directly, and share mutual respect."}
                </p>
              </FadeIn>
            </div>

            {/* Traditional Village Etching Illustration Across Bottom */}
            <div className="relative w-full h-24 sm:h-32 mt-6 overflow-hidden opacity-60 dark:opacity-40 pointer-events-none">
              <Image
                src="/images/village-landscape-etching.png"
                alt="Traditional Indian rural village landscape illustration"
                fill
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 8: TRUST, SAFETY & PRIVACY STANDARDS                        */}
        {/* ==================================================================== */}
        <FadeIn direction="up" once={false} className="border-t border-rule/80 pt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rule pb-4">
            <div>
              <span className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1">
                {isHindi ? "सुरक्षा और निष्ठा" : "SAFETY & INTEGRITY"}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-medium text-text">
                {isHindi ? "विश्वास, सुरक्षा और गोपनीयता के मानक" : "Trust, Safety & Privacy Standards"}
              </h2>
            </div>
            <Link
              href="/safety"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{isHindi ? "सुरक्षा दिशानिर्देश पढ़ें →" : "Read Safety Protocol →"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Identity Verification */}
            <div className="p-5 bg-surface border border-rule/80 rounded-sm space-y-2 shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "१००% व्यक्तिगत सत्यापन" : "100% ID Verified"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "प्रत्येक मेज़बान नागरिक की पहचान प्रशासनिक रूप से सत्यापित की जाती है। कोई छद्म या अनाम प्रोफाइल नहीं।"
                  : "Every local resident and host profile is reviewed individually. Zero anonymous or unvetted accounts."}
              </p>
            </div>

            {/* 2. Dual Mutual Consent */}
            <div className="p-5 bg-surface border border-rule/80 rounded-sm space-y-2 shadow-2xs">
              <Lock className="w-6 h-6 text-terracotta" strokeWidth={1.5} />
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "आपसी सहमति से संपर्क" : "Dual Mutual Consent"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "व्यक्तिगत फोन नंबर और संपर्क तब तक पूरी तरह सुरक्षित रहते हैं जब तक दोनों पक्ष सहमति न दें।"
                  : "Phone numbers and full email addresses remain private until both parties explicitly agree to reveal."}
              </p>
            </div>

            {/* 3. Public Meeting Protocol */}
            <div className="p-5 bg-surface border border-rule/80 rounded-sm space-y-2 shadow-2xs">
              <Compass className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "सार्वजनिक बैठक स्थल" : "Public Venues First"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "सभी प्रारंभिक मुलाक़ातें और अनुभव प्रसिद्ध सार्वजनिक स्थलों — जैसे मंदिर परिसर, हाट या चाय चौपाल — पर शुरू होते हैं।"
                  : "Initial meetings commence exclusively at well-known public locations like village haats or temple courtyards."}
              </p>
            </div>

            {/* 4. Zero Ad Trackers */}
            <div className="p-5 bg-surface border border-rule/80 rounded-sm space-y-2 shadow-2xs">
              <EyeOff className="w-6 h-6 text-secondary" strokeWidth={1.5} />
              <h3 className="font-heading text-sm font-medium text-text">
                {isHindi ? "शून्य विज्ञापन ट्रैकर" : "Zero Ad Trackers"}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {isHindi
                  ? "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम के पूर्ण अनुपालन में। कोई विज्ञापन नहीं, कोई व्यावसायिक बिक्री नहीं।"
                  : "Full compliance with the Indian DPDP Act. We never sell your personal data or execute third-party ad tracking."}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ==================================================================== */}
        {/* SECTION 9: BOTTOM CALL-TO-ACTION BANNER                             */}
        {/* ==================================================================== */}
        <FadeIn direction="up" once={false}>
          <div className="relative rounded-xl overflow-hidden shadow-md bg-[#253624] text-white">
            {/* Background Image with Dark Landscape */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src="/images/mithila-landscape-banner.jpg"
                alt="Mithila rural landscape"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c2a1b] via-[#253624]/90 to-[#2e432d]/80" />

            <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
                  <h3 className="font-heading text-lg sm:text-xl font-medium tracking-wide">
                    {isHindi ? "सांस्कृतिक समुदाय का हिस्सा बनें" : "Be Part of Our Cultural Community"}
                  </h3>
                  <p className="text-xs text-white/80 max-w-md leading-relaxed">
                    {isHindi
                      ? "अपना घर खोलें, अपनी संस्कृति साझा करें और मिथिला की आतिथ्य परंपरा में दुनिया का स्वागत करें।"
                      : "Open your home, share your culture, and welcome the world to the warmth of Mithila."}
                  </p>
                </div>
              </div>

              {/* Right CTA Button */}
              <div className="shrink-0">
                <Link
                  href="/become-a-host"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E4B07A] hover:bg-[#d8a167] text-[#253624] rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
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
