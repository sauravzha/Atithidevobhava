import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { UnifiedSearch } from "@/components/search/unified-search";
import { FadeIn } from "@/components/ui/fade-in";
import { InitialLoader } from "@/components/ui/initial-loader";
import { StoryModal } from "@/components/ui/story-modal";
import {
  Users,
  Compass,
  Home,
  ShieldCheck,
  Palette,
  UtensilsCrossed,
  TreePine,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Lock,
  EyeOff,
  Sparkles,
  Calendar,
  Search,
  Languages,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // 4 Featured Cultural Offerings from the Pilot
  const featuredOfferings = [
    {
      id: "exp-mithila-art",
      titleEn: "Mithila Art Workshop",
      titleHi: "मिथिला चित्रकला कार्यशाला",
      subtitleEn: "Learn from local artists in their homes.",
      subtitleHi: "स्थानीय कलाकारों के साथ उनके घरों में चित्रकला सीखें।",
      image: "/images/exp-mithila-art.jpg",
      icon: Palette,
      link: "/experiences/exp-mithila-art",
    },
    {
      id: "exp-maithili-cuisine",
      titleEn: "Local Cuisine",
      titleHi: "स्थानीय मैथिली पाक कला",
      subtitleEn: "Cook and eat with local families.",
      subtitleHi: "स्थानीय परिवारों के साथ पारंपरिक भोजन बनाएं और स्वाद लें।",
      image: "/images/exp-cuisine.jpg",
      icon: UtensilsCrossed,
      link: "/experiences/exp-maithili-cuisine",
    },
    {
      id: "exp-darbhanga-heritage",
      titleEn: "Pond Heritage Walk",
      titleHi: "ऐतिहासिक तालाब धरोहर पदयात्रा",
      subtitleEn: "Explore historic tanks and stories.",
      subtitleHi: "दरभंगा के प्राचीन पोखरों और धरोहर स्थलों का अन्वेषण।",
      image: "/images/exp-pond.jpg",
      icon: Landmark,
      link: "/experiences/exp-darbhanga-heritage",
    },
    {
      id: "exp-village-homestay",
      titleEn: "Village Homestay",
      titleHi: "ग्रामीण पारिवारिक आवास",
      subtitleEn: "Stay, learn and live the local way.",
      subtitleHi: "रहें, सीखें और स्थानीय जीवन का प्रत्यक्ष अनुभव करें।",
      image: "/images/exp-homestay.jpg",
      icon: Home,
      link: "/explore/stays",
    },
  ];

  return (
    <>
      {/* Smooth initial boot loading screen */}
      <InitialLoader />

      <div className="site-container py-6 sm:py-10 space-y-16 sm:space-y-24">
        {/* ==================================================================== */}
        {/* SECTION 1: HERO SECTION                                             */}
        {/* ==================================================================== */}
        <section className="relative pt-2 sm:pt-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <FadeIn direction="up" delayMs={100} className="lg:col-span-7 space-y-6">
              {/* Pilot Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-rule/80 rounded-full text-xs font-medium text-secondary shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" strokeWidth={2} />
                <span>
                  {isHindi
                    ? "सत्यापित सांस्कृतिक आतिथ्य मंच · उत्तरी बिहार पायलट"
                    : "Verified Cultural Hospitality Platform • North Bihar Pilot"}
                </span>
              </div>

              {/* Bilingual Headline */}
              <div className="space-y-2">
                <h1
                  lang="hi"
                  className="font-heading text-3xl sm:text-5xl lg:text-[3.25rem] font-medium text-text leading-[1.25] tracking-tight"
                >
                  भारत को लोगों के साथ महसूस कीजिए ।
                </h1>
                <p className="font-heading text-xl sm:text-2xl lg:text-3xl text-secondary font-normal">
                  Experience India through its people.
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="font-body text-sm sm:text-base text-secondary leading-relaxed max-w-xl">
                {isHindi
                  ? "स्थानीय परिवारों के साथ रहें, पारंपरिक कला सत्रों में भाग लें, जीवित धरोहर को समझें और भारत की सच्ची आतिथ्य परंपरा का अनुभव करें।"
                  : "Stay with local families, participate in traditional craft sessions, explore living heritage, and discover the real India — warm, respectful, and full of stories."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/explore/experiences"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#283827] hover:bg-[#1e2b1d] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <Compass className="w-4 h-4" strokeWidth={2} />
                  <span>{isHindi ? "अनुभव खोजें" : "Explore Experiences"}</span>
                </Link>

                <StoryModal buttonText={isHindi ? "कहानी देखें" : "Watch Story"} />
              </div>
            </FadeIn>

            {/* Right Hero Image (5 Cols) */}
            <FadeIn direction="up" delayMs={250} className="lg:col-span-5">
              <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-rule/70 group bg-surface">
                <Image
                  src="/images/hero-artisan.jpg"
                  alt="Mithila artisan creating traditional folk painting in her courtyard"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Subtle soft lighting overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Cultural caption badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-xs rounded-full text-[11px] font-medium mb-1">
                    <Palette className="w-3.5 h-3.5 text-terracotta" strokeWidth={2} />
                    <span>Jitwarpur, Madhubani</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {isHindi
                      ? "पारंपरिक मिथिला चित्रकला का प्रत्यक्ष सृजन"
                      : "Master artisan demonstrating living folk motifs"}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 2: 4-PILLAR VALUE PROPOSITION STRIP                         */}
        {/* ==================================================================== */}
        <FadeIn direction="up" delayMs={100}>
          <div className="border-y border-rule/80 py-6 sm:py-8 bg-surface/50 rounded-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* 1. Stay with Locals */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-warm/50 border border-rule flex items-center justify-center shrink-0 text-terracotta">
                  <Home className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-medium text-text">
                    {isHindi ? "स्थानीय लोगों के साथ रहें" : "Stay with Locals"}
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    {isHindi ? "सच्चे आतिथ्य का अनुभव" : "Experience real hospitality"}
                  </p>
                </div>
              </div>

              {/* 2. Learn & Create */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-warm/50 border border-rule flex items-center justify-center shrink-0 text-forest">
                  <Palette className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-medium text-text">
                    {isHindi ? "सीखें और बनाएं" : "Learn & Create"}
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    {isHindi ? "हाथों से शिल्प सत्र" : "Hands-on craft sessions"}
                  </p>
                </div>
              </div>

              {/* 3. Live the Culture */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-warm/50 border border-rule flex items-center justify-center shrink-0 text-terracotta">
                  <Sparkles className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-medium text-text">
                    {isHindi ? "संस्कृति को जिएं" : "Live the Culture"}
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    {isHindi ? "उत्सव, खान-पान और परंपराएं" : "Festivals, food & traditions"}
                  </p>
                </div>
              </div>

              {/* 4. Support Communities */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-warm/50 border border-rule flex items-center justify-center shrink-0 text-forest">
                  <TreePine className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-medium text-text">
                    {isHindi ? "समुदाय को सहयोग दें" : "Support Communities"}
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    {isHindi ? "सीधा आर्थिक लाभ" : "Travel that gives back"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ==================================================================== */}
        {/* SECTION 3: UNIFIED SEARCH & ACTIVE PILOT REGION (2 COLUMNS)          */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Search Component (7 cols) */}
            <FadeIn direction="up" delayMs={100} className="lg:col-span-7">
              <UnifiedSearch />
            </FadeIn>

            {/* Right: Active Pilot Region Card (5 cols) */}
            <FadeIn direction="up" delayMs={200} className="lg:col-span-5">
              <div className="border border-rule/90 rounded-md p-6 bg-surface shadow-xs relative overflow-hidden space-y-4">
                {/* Header row with Title + Palace Sketch */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-terracotta uppercase tracking-wider block mb-1">
                      {isHindi ? "सक्रिय पायलट क्षेत्र" : "ACTIVE PILOT REGION"}
                    </span>
                    <h2 className="font-heading text-xl font-medium text-text leading-tight">
                      {isHindi ? "दरभंगा एवं मधुबनी (बिहार)" : "Darbhanga & Madhubani (Bihar)"}
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

                {/* Metrics Rows */}
                <div className="space-y-2 border-t border-rule/70 pt-3 text-xs">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
                      <span>{isHindi ? "सत्यापित स्थानीय मेज़बान:" : "Verified Local Hosts:"}</span>
                    </span>
                    <span className="font-mono text-text font-medium">30 - 50 Hosts</span>
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

        {/* ==================================================================== */}
        {/* SECTION 4: EXPLORE OUR OFFERINGS (4 CARDS GRID)                     */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <FadeIn direction="up" className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block">
              {isHindi ? "— हमारे सांस्कृतिक अनुभव —" : "— EXPLORE OUR OFFERINGS —"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-text">
              {isHindi ? "उत्तरी बिहार में पारंपरिक सांस्कृतिक अनुभव" : "Living Traditions & Cultural Experiences in North Bihar"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {isHindi
                ? "मिथिला कला से लेकर ग्रामीण जीवन तक, ऐसे अनुभवों से जुड़ें जो आपको लोगों, संस्कृति और दैनिक परंपराओं से जोड़ते हैं।"
                : "From Mithila art to village life, discover experiences that connect you with people, culture, and everyday traditions."}
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
                  className="group bg-surface border border-rule/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Photo */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-warm-grey">
                      <Image
                        src={item.image}
                        alt={item.titleEn}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <IconComp className="w-4 h-4 text-terracotta shrink-0" strokeWidth={1.75} />
                        <h3 className="font-heading text-sm font-semibold text-text group-hover:text-primary transition-colors">
                          {isHindi ? item.titleHi : item.titleEn}
                        </h3>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed pl-6">
                        {isHindi ? item.subtitleHi : item.subtitleEn}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="p-4 pt-0 flex justify-end">
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

        {/* ==================================================================== */}
        {/* SECTION 5: HOW IT WORKS (3 EASY STEPS WITH VILLAGE ETCHING)         */}
        {/* ==================================================================== */}
        <section className="space-y-8 pt-4 pb-4">
          <FadeIn direction="up" className="text-center max-w-2xl mx-auto space-y-2">
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
              <FadeIn direction="up" delayMs={100} className="text-center space-y-3 px-4">
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
              <FadeIn direction="up" delayMs={200} className="text-center space-y-3 px-4">
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
              <FadeIn direction="up" delayMs={300} className="text-center space-y-3 px-4">
                <div className="w-16 h-16 rounded-full bg-warm/80 border-2 border-rule mx-auto flex items-center justify-center text-text shadow-xs">
                  <Users className="w-6 h-6 text-terracotta" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-lg font-medium text-text">
                  {isHindi ? "३. अनुभव प्राप्त करें (3. Experience)" : "3. Experience"}
                </h3>
                <p className="text-xs text-secondary leading-relaxed max-w-xs mx-auto">
                  {isHindi
                    ? "स्थानीय परिवारों के साथ रहें, सीधे सीखें और परंपरा का हिस्सा बनें।"
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
        {/* SECTION 6: TRUST, SAFETY & PRIVACY STANDARDS                        */}
        {/* ==================================================================== */}
        <FadeIn direction="up" className="border-t border-rule/80 pt-12 space-y-6">
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
        {/* SECTION 7: BOTTOM CALL-TO-ACTION BANNER                             */}
        {/* ==================================================================== */}
        <FadeIn direction="up">
          <div className="relative rounded-xl overflow-hidden shadow-md bg-[#253624] text-white">
            {/* Background Image with Dark Landscape */}
            <div className="absolute inset-0 opacity-25">
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
