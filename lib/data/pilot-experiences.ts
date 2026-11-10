/**
 * Pilot region cultural experiences for Darbhanga and Madhubani (Bihar).
 * Spec reference: Section 3, 7, and 29 of docs/SPEC.md.
 * Phase 1 status: ENQUIRY-ONLY. No prices displayed, no payment processor invoked.
 */

export interface ExperienceListing {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  categorySlug: string;
  categoryNameEn: string;
  categoryNameHi: string;
  hostName: string;
  hostNameHi: string;
  hostRoleEn: string;
  hostRoleHi: string;
  stateId: string;
  districtId: string;
  districtName: string;
  districtNameHi: string;
  generalAreaEn: string;
  generalAreaHi: string;
  durationEn: string;
  durationHi: string;
  maxParticipants: number;
  languages: string[];
  languagesHi: string[];
  descriptionEn: string;
  descriptionHi: string;
  highlightsEn: string[];
  highlightsHi: string[];
  includedEn: string[];
  includedHi: string[];
}

export const PILOT_EXPERIENCES: ExperienceListing[] = [
  {
    id: "exp-br-01",
    slug: "mithila-art-natural-pigments-jitwarpur",
    titleEn: "Mithila Painting and Natural Pigment Craft in Jitwarpur",
    titleHi: "जितवारपुर में मिथिला चित्रकला और प्राकृतिक रंग निर्माण",
    categorySlug: "art-and-handicrafts",
    categoryNameEn: "Art and handicrafts",
    categoryNameHi: "कला और हस्तशिल्प",
    hostName: "Sunita Devi Jha",
    hostNameHi: "सुनीता देवी झा",
    hostRoleEn: "Master Artisan",
    hostRoleHi: "वरिष्ठ शिल्पकार",
    stateId: "st-br",
    districtId: "dst-madhubani",
    districtName: "Madhubani",
    districtNameHi: "मधुबनी",
    generalAreaEn: "Jitwarpur Village Panchayat Bhavan perimeter",
    generalAreaHi: "जितवारपुर ग्राम पंचायत भवन का खुला परिसर",
    durationEn: "3 hours",
    durationHi: "3 घंटे",
    maxParticipants: 6,
    languages: ["Maithili", "Hindi"],
    languagesHi: ["मैथिली", "हिंदी"],
    descriptionEn: "Spend a morning with an artisan family in Jitwarpur understanding the symbolism of Kohbar and Aripan motifs. Learn how mineral stones, soot, and peepal bark are prepared into natural dyes before practicing line-drawing on handmade paper using bamboo nibs.",
    descriptionHi: "जितवारपुर के कलाकार परिवार के साथ कोहबर और अरिपन प्रतीकों की गहराई समझें। बांस की कलम से हस्तनिर्मित कागज पर रेखांकन करने से पूर्व खनिज पत्थरों, काजल और पीपल की छाल से प्राकृतिक रंग तैयार करने की प्रक्रिया सीखें।",
    highlightsEn: [
      "Preparation of natural pigments from local plant and mineral extracts",
      "Traditional line-work demonstration using bamboo twigs",
      "Hands-on practice piece on Lokta handmade paper to keep",
    ],
    highlightsHi: [
      "स्थानीय वनस्पतियों और खनिजों से प्राकृतिक रंग तैयार करने की विधि",
      "बांस की टहनियों से पारंपरिक रेखांकन का प्रत्यक्ष प्रदर्शन",
      "हस्तनिर्मित कागज पर स्वयं अभ्यास और अपनी कलाकृति साथ ले जाने की सुविधा",
    ],
    includedEn: ["Handmade paper and natural pigments", "Herbal tea and village jaggery snack"],
    includedHi: ["हस्तनिर्मित कागज़ और प्राकृतिक रंग", "हर्बल चाय और पारंपरिक गुड़ जलपान"],
  },
  {
    id: "exp-br-02",
    slug: "makhana-farming-roasting-darbhanga",
    titleEn: "Makhana Harvesting and Traditional Roasting by the Wetlands",
    titleHi: "आर्द्रभूमि किनारे मखाना तुड़ाई और पारंपरिक भुनाई",
    categorySlug: "indian-food-and-cooking",
    categoryNameEn: "Indian food and cooking",
    categoryNameHi: "भारतीय खान-पान और पाक कला",
    hostName: "Rameshwar Choudhary",
    hostNameHi: "रामेश्वर चौधरी",
    hostRoleEn: "Pond Cultivator & Merchant",
    hostRoleHi: "तालाब कृषक एवं व्यापारी",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    districtName: "Darbhanga",
    districtNameHi: "दरभंगा",
    generalAreaEn: "Harahi Lake agricultural wetland perimeter",
    generalAreaHi: "हराही झील के निकटवर्ती कृषि आर्द्रभूमि क्षेत्र",
    durationEn: "2.5 hours",
    durationHi: "2.5 घंटे",
    maxParticipants: 8,
    languages: ["Maithili", "Hindi"],
    languagesHi: ["मैथिली", "हिंदी"],
    descriptionEn: "Discover the indigenous water-farming heritage of Mithila. Learn how thorny gorgon nut pods are collected from fresh pond beds, graded under morning sun, and popped with wooden mallets over open clay furnaces into pure white makhana.",
    descriptionHi: "मिथिला की जल-कृषि परंपरा को समझें। देखें कि मीठे पानी के तालाबों से कांटेदार कंद कैसे एकत्र किए जाते हैं, धूप में छांटे जाते हैं, और मिट्टी की भट्टी पर लकड़ी की थापी से फोड़कर शुद्ध मखाना तैयार किया जाता है।",
    highlightsEn: [
      "Field demonstration of traditional pond bed seed harvesting",
      "Live observation of high-heat clay oven popping technique",
      "Tasting of freshly roasted spiced foxnuts with local black salt",
    ],
    highlightsHi: [
      "तालाब के तल से बीज निकालने का पारंपरिक प्रदर्शन",
      "मिट्टी की विशेष भट्ठी पर उच्च ताप पर मखाना फोड़ने का प्रत्यक्ष अवलोकन",
      "सेंधा नमक और देसी घी में ताजे भुने मखाने का स्वाद",
    ],
    includedEn: ["Tasting of fresh wood-fired makhana", "Pond wetland walking guide"],
    includedHi: ["ताज़ा भुने मखाने का स्वाद", "तालाब किनारे मार्गदर्शन"],
  },
  {
    id: "exp-br-03",
    slug: "darbhanga-dhrupad-heritage-walk",
    titleEn: "Darbhanga Dhrupad Music Heritage and Temple Walk",
    titleHi: "दरभंगा ध्रुपद संगीत धरोहर और मंदिर पदयात्रा",
    categorySlug: "music-and-dance",
    categoryNameEn: "Music and dance",
    categoryNameHi: "संगीत और लोक नृत्य",
    hostName: "Vidyadhar Mallick",
    hostNameHi: "विद्याधर मल्लिक",
    hostRoleEn: "Classical Musician",
    hostRoleHi: "शास्त्रीय संगीतकार",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    districtName: "Darbhanga",
    districtNameHi: "दरभंगा",
    generalAreaEn: "Lalbagh Raj Compound gates",
    generalAreaHi: "लालबाग राज परिसर का मुख्य द्वार",
    durationEn: "2 hours",
    durationHi: "2 घंटे",
    maxParticipants: 10,
    languages: ["Maithili", "Hindi", "English"],
    languagesHi: ["मैथिली", "हिंदी", "अंग्रेज़ी"],
    descriptionEn: "An acoustic and historical exploration through the Lalbagh quarter of Darbhanga. Hear about the 400-year genealogy of the Darbhanga Mallick Gharana, understand the microtones of Dhrupad alapa, and appreciate ancient temple stone acoustics.",
    descriptionHi: "दरभंगा के लालबाग क्षेत्र में एक संगीतमय और ऐतिहासिक पदयात्रा। दरभंगा मल्लिक घराने की 400 वर्ष पुरानी परंपरा को जानें, ध्रुपद आलाप के सूक्ष्म स्वरों को समझें और प्राचीन मंदिरों की ध्वनि-शिल्प का अनुभव करें।",
    highlightsEn: [
      "Introduction to Dhrupad vocal microtones and four-part composition",
      "Acoustic demonstration at the historic Shyama Kali temple precinct",
      "Reading of 14th-century poet Vidyapati's devotional verses",
    ],
    highlightsHi: [
      "ध्रुपद के चार भागों (स्थायी, अंतरा, संचारी, आभोग) का परिचय",
      "ऐतिहासिक श्यामा माई मंदिर परिसर में ध्वनि-शिल्प का अनुभव",
      "महाकवि विद्यापति के 14वीं शताब्दी के पदों का श्रवण",
    ],
    includedEn: ["Guided acoustic walking tour", "Poetry text card in Devanagari and Roman script"],
    includedHi: ["संगीतमय पदयात्रा", "देवनागरी और रोमन लिपि में पद संग्रह पत्रक"],
  },
  {
    id: "exp-br-04",
    slug: "sikki-grass-weaving-ranti",
    titleEn: "Sikki Golden Grass Weaving Workshop in Ranti",
    titleHi: "रांटी में सिक्की सुनहरी घास शिल्प कार्यशाला",
    categorySlug: "art-and-handicrafts",
    categoryNameEn: "Art and handicrafts",
    categoryNameHi: "कला और हस्तशिल्प",
    hostName: "Priyanka Kumari",
    hostNameHi: "प्रियंका कुमारी",
    hostRoleEn: "Women's Craft Collective Lead",
    hostRoleHi: "महिला शिल्प समूह प्रमुख",
    stateId: "st-br",
    districtId: "dst-madhubani",
    districtName: "Madhubani",
    districtNameHi: "मधुबनी",
    generalAreaEn: "Ranti Community Center entrance",
    generalAreaHi: "रांटी सामुदायिक केंद्र का मुख्य द्वार",
    durationEn: "2 hours",
    durationHi: "2 घंटे",
    maxParticipants: 6,
    languages: ["Maithili", "Hindi"],
    languagesHi: ["मैथिली", "हिंदी"],
    descriptionEn: "Learn how wild golden river grass (Sikki) gathered after the monsoon is split with needles and coiled into functional baskets, toys, and protective amulets. Directly supports rural women artisan collectives in Madhubani.",
    descriptionHi: "सीखें कि मानसून के बाद नदियों के किनारे उगने वाली सुनहरी सिक्की घास को सुइयों से कैसे चीरा जाता है और पारंपरिक डलिया, खिलौने और आभूषण बनाए जाते हैं। यह सीधा सहयोग मधुबनी की ग्रामीण महिला कलाकारों को मिलता है।",
    highlightsEn: [
      "Introduction to wetland grass harvesting and natural boiling methods",
      "Coiling techniques using the traditional 'Takua' needle",
      "Create a woven coaster to take home",
    ],
    highlightsHi: [
      "घास की कटाई और रंगाई की प्राकृतिक विधि",
      "पारंपरिक तकुआ सुई से बुनाई तकनीक",
      "स्वयं एक छोटा कोस्टर बनाकर साथ ले जाने का अवसर",
    ],
    includedEn: ["Sikki grass bundle and crafting needle", "Village herbal infusion"],
    includedHi: ["सिक्की घास का बंडल और तकुआ", "हर्बल काढ़ा"],
  },
];

export function getPilotExperiences(categorySlug?: string, districtId?: string): ExperienceListing[] {
  return PILOT_EXPERIENCES.filter((e) => {
    if (categorySlug && e.categorySlug !== categorySlug) return false;
    if (districtId && e.districtId !== districtId) return false;
    return true;
  });
}

export function getExperienceBySlug(slug: string): ExperienceListing | undefined {
  return PILOT_EXPERIENCES.find((e) => e.slug === slug);
}
