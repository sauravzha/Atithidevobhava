/**
 * Pilot region verified local members for Darbhanga and Madhubani (Bihar).
 * Spec reference: Section 3, 5, and 6 of docs/SPEC.md.
 * All profiles adhere to the privacy protocol: display name only, no phone numbers,
 * no private addresses, and public meeting places.
 */

export interface LocalProfile {
  id: string;
  displayName: string;
  displayNameHi: string;
  stateId: string;
  districtId: string;
  districtName: string;
  districtNameHi: string;
  locality: string;
  localityHi: string;
  languages: string[];
  languagesHi: string[];
  interests: string[];
  interestsHi: string[];
  bioEn: string;
  bioHi: string;
  meetupTypes: Array<"tea" | "market_walk" | "language_exchange" | "area_tour">;
  preferredPublicSpotEn: string;
  preferredPublicSpotHi: string;
  verified: boolean;
  memberSince: string;
}

export const PILOT_LOCALS: LocalProfile[] = [
  {
    id: "loc-br-01",
    displayName: "Amarnath Mishra",
    displayNameHi: "अमरनाथ मिश्र",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    districtName: "Darbhanga",
    districtNameHi: "दरभंगा",
    locality: "Lalbagh, near Raj Darbhanga Complex",
    localityHi: "लालबाग, राज दरभंगा परिसर के पास",
    languages: ["Maithili", "Hindi", "English"],
    languagesHi: ["मैथिली", "हिंदी", "अंग्रेज़ी"],
    interests: ["Dhrupad music", "Mithila history", "Traditional library archives"],
    interestsHi: ["ध्रुपद संगीत", "मिथिला इतिहास", "पारंपरिक पुस्तकालय"],
    bioEn: "Retired Sanskrit teacher and classical music enthusiast. I enjoy sharing oral histories of the Raj Darbhanga library and walking through the historic tank gardens.",
    bioHi: "सेवानिवृत्त संस्कृत शिक्षक और शास्त्रीय संगीत प्रेमी। मुझे राज दरभंगा पुस्तकालय का इतिहास साझा करने और ऐतिहासिक तालाबों के किनारे टहलने में आनंद आता है।",
    meetupTypes: ["tea", "area_tour"],
    preferredPublicSpotEn: "Kameshwar Singh Sanskrit University campus tea stall",
    preferredPublicSpotHi: "कामेश्वर सिंह संस्कृत विश्वविद्यालय परिसर की चाय दुकान",
    verified: true,
    memberSince: "November 2026",
  },
  {
    id: "loc-br-02",
    displayName: "Sunita Devi Jha",
    displayNameHi: "सुनीता देवी झा",
    stateId: "st-br",
    districtId: "dst-madhubani",
    districtName: "Madhubani",
    districtNameHi: "मधुबनी",
    locality: "Jitwarpur Artisan Village",
    localityHi: "जितवारपुर कलाकार ग्राम",
    languages: ["Maithili", "Hindi"],
    languagesHi: ["मैथिली", "हिंदी"],
    interests: ["Mithila painting", "Natural pigment extraction", "Courtyard stories"],
    interestsHi: ["मिथिला चित्रकला", "प्राकृतिक रंग निर्माण", "आंगन की लोकगाथाएं"],
    bioEn: "Third-generation Mithila artist in Jitwarpur village. I welcome visitors to see how we grind mineral stones, bark, and leaves to create ceremonial colors on handmade paper.",
    bioHi: "जितवारपुर गांव की तीसरी पीढ़ी की मिथिला कलाकार। मैं आगंतुकों का स्वागत करती हूं ताकि वे देख सकें कि हम हस्तनिर्मित कागज पर रंगों के लिए पत्थरों, छाल और पत्तियों का उपयोग कैसे करते हैं।",
    meetupTypes: ["tea", "language_exchange"],
    preferredPublicSpotEn: "Jitwarpur Village Panchayat Bhavan courtyard",
    preferredPublicSpotHi: "जितवारपुर ग्राम पंचायत भवन का खुला परिसर",
    verified: true,
    memberSince: "November 2026",
  },
  {
    id: "loc-br-03",
    displayName: "Rameshwar Choudhary",
    displayNameHi: "रामेश्वर चौधरी",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    districtName: "Darbhanga",
    districtNameHi: "दरभंगा",
    locality: "Bara Bazar, Municipal Area",
    localityHi: "बड़ा बाज़ार, नगर निगम क्षेत्र",
    languages: ["Maithili", "Hindi", "Urdu"],
    languagesHi: ["मैथिली", "हिंदी", "उर्दू"],
    interests: ["Makhana farming", "Haat culture", "Spices and culinary traditions"],
    interestsHi: ["मखाना उत्पादन", "ग्रामीण हाट", "पारंपरिक मसाले और व्यंजन"],
    bioEn: "Makhana grower and dry-fruit merchant. Passionate about showing guests how foxnut seeds are harvested from local ponds and popped by hand over wood fires.",
    bioHi: "मखाना उत्पादक और व्यापारी। मेहमानों को यह दिखाने में रुचि है कि तालाबों से मखाना कैसे निकाला जाता है और पारंपरिक भट्ठियों पर हाथ से कैसे फोड़ा जाता है।",
    meetupTypes: ["market_walk", "tea"],
    preferredPublicSpotEn: "Darbhanga Tower Clock Square café",
    preferredPublicSpotHi: "दरभंगा टॉवर चौक के समीप जलपान गृह",
    verified: true,
    memberSince: "November 2026",
  },
  {
    id: "loc-br-04",
    displayName: "Priyanka Kumari",
    displayNameHi: "प्रियंका कुमारी",
    stateId: "st-br",
    districtId: "dst-madhubani",
    districtName: "Madhubani",
    districtNameHi: "मधुबनी",
    locality: "Ranti Village",
    localityHi: "रांटी गांव",
    languages: ["Maithili", "Hindi", "English"],
    languagesHi: ["मैथिली", "हिंदी", "अंग्रेज़ी"],
    interests: ["Sikki golden grass craft", "Rural youth education", "Village cooperatives"],
    interestsHi: ["सिक्की सुनहरी घास शिल्प", "ग्रामीण शिक्षा", "महिला स्वयं सहायता समूह"],
    bioEn: "Community coordinator working with women artisans in Ranti. I can introduce travelers to traditional Sikki grass weaving and village cooperative workshops.",
    bioHi: "रांटी में महिला शिल्पकारों के साथ सामुदायिक समन्वयक। मैं आगंतुकों को पारंपरिक सिक्की घास की बुनाई और महिला सहकारी समितियों से परिचित करा सकती हूं।",
    meetupTypes: ["tea", "area_tour", "language_exchange"],
    preferredPublicSpotEn: "Ranti Community Center entrance",
    preferredPublicSpotHi: "रांटी सामुदायिक केंद्र का मुख्य द्वार",
    verified: true,
    memberSince: "November 2026",
  },
  {
    id: "loc-br-05",
    displayName: "Vidyadhar Mallick",
    displayNameHi: "विद्याधर मल्लिक",
    stateId: "st-br",
    districtId: "dst-darbhanga",
    districtName: "Darbhanga",
    districtNameHi: "दरभंगा",
    locality: "Mishratola",
    localityHi: "मिश्रटोला",
    languages: ["Maithili", "Hindi"],
    languagesHi: ["मैथिली", "हिंदी"],
    interests: ["Dhrupad vocal traditions", "Pakhawaj percussion", "Poetry of Vidyapati"],
    interestsHi: ["ध्रुपद गायकी", "पखावज वादन", "विद्यापति पदावली"],
    bioEn: "Associated with the Darbhanga Mallick Dhrupad tradition. Glad to meet lovers of classical Indian poetry and explain the microtonal nuances of ancient morning ragas.",
    bioHi: "दरभंगा मल्लिक ध्रुपद परंपरा से जुड़े गायक। भारतीय शास्त्रीय संगीत और विद्यापति के पदों में रुचि रखने वाले आगंतुकों से मिलने और चर्चा करने में प्रसन्नता।",
    meetupTypes: ["tea", "language_exchange"],
    preferredPublicSpotEn: "Harahi Lake northern embankment promenade",
    preferredPublicSpotHi: "हराही झील का उत्तरी बांध परिसर",
    verified: true,
    memberSince: "November 2026",
  },
];

export function getPilotLocals(districtId?: string): LocalProfile[] {
  if (!districtId) return PILOT_LOCALS;
  return PILOT_LOCALS.filter((l) => l.districtId === districtId);
}

export function getLocalById(id: string): LocalProfile | undefined {
  return PILOT_LOCALS.find((l) => l.id === id);
}

