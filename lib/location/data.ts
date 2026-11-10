/**
 * Location data service and official Indian administrative boundaries.
 * Hierarchy: Country -> State/UT -> District -> City/Town -> Locality.
 * Spec reference: Section 13 of docs/SPEC.md.
 */

export interface StateData {
  id: string;
  name: string;
  nameHi: string;
  kind: "state" | "union_territory";
  lgdCode: string;
  activeHostsCount?: number;
  publishedExperiencesCount?: number;
}

export interface DistrictData {
  id: string;
  stateId: string;
  name: string;
  nameHi: string;
  lgdCode: string;
  centroidLat: number;
  centroidLng: number;
  permitsNotice?: string;
  permitsReviewedByLawyer?: boolean;
}

export interface CityData {
  id: string;
  districtId: string;
  name: string;
  nameHi: string;
  lgdCode: string;
}

export interface CategoryData {
  slug: string;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  categoryGroup: string;
  pilotHighlights?: string[];
}

export const OFFICIAL_CATEGORIES: CategoryData[] = [
  {
    slug: "indian-food-and-cooking",
    nameEn: "Indian food and cooking",
    nameHi: "भारतीय खान-पान और पाक कला",
    descriptionEn: "Home kitchens, regional recipes, spice preparations, and family meal traditions.",
    descriptionHi: "पारिवारिक रसोई, पारंपरिक व्यंजन, मसालों की पहचान और घरेलू भोजन की परंपरा।",
    categoryGroup: "culinary",
    pilotHighlights: ["Makhana (Foxnut) roasting in Darbhanga", "Traditional Maithil thali preparation"]
  },
  {
    slug: "village-life",
    nameEn: "Village life",
    nameHi: "ग्रामीण जीवन और परंपरा",
    descriptionEn: "Authentic village routines, farming practices, community gatherings, and courtyard conversations.",
    descriptionHi: "ग्रामीण दिनचर्या, कृषि पद्धतियां, चौपाल की बैठकें और आंगन की बातचीत।",
    categoryGroup: "culture",
    pilotHighlights: ["Ranti and Jitwarpur village visits", "Pond ecology and village commons in Mithila"]
  },
  {
    slug: "art-and-handicrafts",
    nameEn: "Art and handicrafts",
    nameHi: "कला और हस्तशिल्प",
    descriptionEn: "Master artisans, traditional handlooms, painting traditions, and indigenous craft techniques.",
    descriptionHi: "हस्तशिल्प कलाकार, पारंपरिक हथकरघा, लोक चित्रकला और देशज शिल्प तकनीक।",
    categoryGroup: "craft",
    pilotHighlights: ["Mithila (Madhubani) painting on handmade paper", "Sikki golden grass weaving"]
  },
  {
    slug: "history-and-heritage",
    nameEn: "History and heritage",
    nameHi: "इतिहास और धरोहर",
    descriptionEn: "Local historical landmarks, oral family histories, community archives, and ancient sites.",
    descriptionHi: "स्थानीय ऐतिहासिक स्थल, मौखिक इतिहास, पारिवारिक अभिलेखागार और प्राचीन परंपराएं।",
    categoryGroup: "heritage",
    pilotHighlights: ["Raj Darbhanga architectural heritage", "Ancient Sanskrit learning traditions"]
  },
  {
    slug: "local-markets",
    nameEn: "Local markets",
    nameHi: "स्थानीय बाज़ार भ्रमण",
    descriptionEn: "Traditional community haats, seasonal vegetable markets, artisan stalls, and street conversations.",
    descriptionHi: "स्थानीय ग्रामीण हाट, मौसमी सब्जी मंडियां, शिल्पकारों के स्टाल और बाज़ार का जीवंत संवाद।",
    categoryGroup: "exploration",
    pilotHighlights: ["Darbhanga Tower bazaar walk", "Weekly rural haats in Madhubani"]
  },
  {
    slug: "traditional-festivals",
    nameEn: "Traditional festivals",
    nameHi: "पारंपरिक उत्सव और मेले",
    descriptionEn: "Community celebrations, seasonal rituals, folk ceremonies, and neighbourhood festivities.",
    descriptionHi: "सामुदायिक उत्सव, ऋतु अनुष्ठान, लोक पर्व और पारंपरिक पारिवारिक अनुष्ठान।",
    categoryGroup: "festivals",
    pilotHighlights: ["Chhath Puja riverbank rituals", "Sama Chakeva celebration in winter"]
  },
  {
    slug: "music-and-dance",
    nameEn: "Music and dance",
    nameHi: "संगीत और लोक नृत्य",
    descriptionEn: "Classical Gharanas, folk instruments, devotional songs, and traditional community performance.",
    descriptionHi: "शास्त्रीय घराना संगीत, लोक वाद्य, भक्ति पद और पारंपरिक लोक नृत्य।",
    categoryGroup: "performing_arts",
    pilotHighlights: ["Darbhanga Dhrupad tradition", "Maithili folk songs and Vidyapati padavali"]
  },
  {
    slug: "spiritual-and-cultural",
    nameEn: "Spiritual and cultural experiences",
    nameHi: "आध्यात्मिक और सांस्कृतिक अनुभव",
    descriptionEn: "Sacred groves, neighbourhood temples, meditation spaces, and reflective traditions.",
    descriptionHi: "पवित्र स्थल, स्थानीय मंदिर, ध्यान परंपराएं और दार्शनिक संवाद।",
    categoryGroup: "spirituality",
    pilotHighlights: ["Ahilya Sthan heritage", "Uchaitha Bhagwati temple and Kalidas lore"]
  },
  {
    slug: "nature-and-rural",
    nameEn: "Nature and rural experiences",
    nameHi: "प्रकृति और ग्रामीण परिवेश",
    descriptionEn: "Wetlands, seasonal migratory bird viewing, agroforestry, and serene country pathways.",
    descriptionHi: "आर्द्रभूमि, मौसमी प्रवासी पक्षी दर्शन, कृषि वानिकी और शांत ग्रामीण रास्ते।",
    categoryGroup: "nature",
    pilotHighlights: ["Kusheshwar Asthan bird sanctuary", "Orchard and pond ecosystems"]
  },
  {
    slug: "language-and-exchange",
    nameEn: "Language and cultural exchange",
    nameHi: "भाषा और सांस्कृतिक संवाद",
    descriptionEn: "Conversational practice, regional dialects, script appreciation, and shared cultural stories.",
    descriptionHi: "संवाद अभ्यास, स्थानीय बोलियां, लिपि परिचय और परस्पर सांस्कृतिक कहानियां।",
    categoryGroup: "exchange",
    pilotHighlights: ["Maithili language fundamentals and Tirhuta script introduction"]
  },
  {
    slug: "photography-walks",
    nameEn: "Photography walks",
    nameHi: "फ़ोटोग्राफ़ी पदयात्रा",
    descriptionEn: "Morning light in old quarters, architectural details, rural landscapes, and community portraits with consent.",
    descriptionHi: "प्रातःकालीन प्रकाश में पुराने मोहल्ले, स्थापत्य कला, ग्रामीण परिदृश्य और सम्मानजनक छायाचित्र।",
    categoryGroup: "visual_arts",
    pilotHighlights: ["Historic Darbhanga palace facades", "Village courtyards in Jitwarpur"]
  },
  {
    slug: "local-city-exploration",
    nameEn: "Local city exploration",
    nameHi: "स्थानीय नगर दर्शन",
    descriptionEn: "Neighbourhood walks, quiet lanes, historic institutions, and daily civic rhythm through a resident's perspective.",
    descriptionHi: "मोहल्ला दर्शन, शांत गलियां, ऐतिहासिक संस्थाएं और निवासियों के नजरिए से शहर का जीवन।",
    categoryGroup: "urban",
    pilotHighlights: ["Old Darbhanga city walk", "Bara Bazar and heritage pond circuit"]
  }
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStateBySlug(slug: string): StateData | undefined {
  const normalized = slug.toLowerCase().trim();
  return OFFICIAL_STATES.find(
    (s) => slugify(s.name) === normalized || s.id === normalized
  );
}

export function getDistrictBySlug(slug: string, stateId?: string): DistrictData | undefined {
  const normalized = slug.toLowerCase().trim();
  return OFFICIAL_DISTRICTS.find((d) => {
    const slug1 = slugify(d.name);
    const firstWord = d.name.split(" ")[0] ?? "";
    const slug2 = slugify(firstWord);
    const matchesSlug = slug1 === normalized || slug2 === normalized || d.id === normalized;
    if (stateId) {
      return matchesSlug && d.stateId === stateId;
    }
    return matchesSlug;
  });
}

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return OFFICIAL_CATEGORIES.find((c) => c.slug === slug);
}

// All 28 States and 8 Union Territories explicitly defined
export const OFFICIAL_STATES: StateData[] = [
  // 28 States
  { id: "st-ap", name: "Andhra Pradesh", nameHi: "आंध्र प्रदेश", kind: "state", lgdCode: "28" },
  { id: "st-ar", name: "Arunachal Pradesh", nameHi: "अरुणाचल प्रदेश", kind: "state", lgdCode: "12" },
  { id: "st-as", name: "Assam", nameHi: "असम", kind: "state", lgdCode: "18" },
  { id: "st-br", name: "Bihar", nameHi: "बिहार", kind: "state", lgdCode: "10", activeHostsCount: 42, publishedExperiencesCount: 8 },
  { id: "st-cg", name: "Chhattisgarh", nameHi: "छत्तीसगढ़", kind: "state", lgdCode: "22" },
  { id: "st-ga", name: "Goa", nameHi: "गोवा", kind: "state", lgdCode: "30" },
  { id: "st-gj", name: "Gujarat", nameHi: "गुजरात", kind: "state", lgdCode: "24" },
  { id: "st-hr", name: "Haryana", nameHi: "हरियाणा", kind: "state", lgdCode: "06" },
  { id: "st-hp", name: "Himachal Pradesh", nameHi: "हिमाचल प्रदेश", kind: "state", lgdCode: "02" },
  { id: "st-jh", name: "Jharkhand", nameHi: "झारखंड", kind: "state", lgdCode: "20" },
  { id: "st-ka", name: "Karnataka", nameHi: "कर्नाटक", kind: "state", lgdCode: "29" },
  { id: "st-kl", name: "Kerala", nameHi: "केरल", kind: "state", lgdCode: "32", activeHostsCount: 14, publishedExperiencesCount: 4 },
  { id: "st-mp", name: "Madhya Pradesh", nameHi: "मध्य प्रदेश", kind: "state", lgdCode: "23" },
  { id: "st-mh", name: "Maharashtra", nameHi: "महाराष्ट्र", kind: "state", lgdCode: "27" },
  { id: "st-mn", name: "Manipur", nameHi: "मणिपुर", kind: "state", lgdCode: "14" },
  { id: "st-ml", name: "Meghalaya", nameHi: "मेघालय", kind: "state", lgdCode: "17", activeHostsCount: 6, publishedExperiencesCount: 2 },
  { id: "st-mz", name: "Mizoram", nameHi: "मिज़ोरम", kind: "state", lgdCode: "15" },
  { id: "st-nl", name: "Nagaland", nameHi: "नागालैंड", kind: "state", lgdCode: "13" },
  { id: "st-or", name: "Odisha", nameHi: "ओडिशा", kind: "state", lgdCode: "21" },
  { id: "st-pb", name: "Punjab", nameHi: "पंजाब", kind: "state", lgdCode: "03" },
  { id: "st-rj", name: "Rajasthan", nameHi: "राजस्थान", kind: "state", lgdCode: "08", activeHostsCount: 18, publishedExperiencesCount: 5 },
  { id: "st-sk", name: "Sikkim", nameHi: "सिक्किम", kind: "state", lgdCode: "11" },
  { id: "st-tn", name: "Tamil Nadu", nameHi: "तमिलनाडु", kind: "state", lgdCode: "33" },
  { id: "st-ts", name: "Telangana", nameHi: "तेलंगाना", kind: "state", lgdCode: "36" },
  { id: "st-tr", name: "Tripura", nameHi: "त्रिपुरा", kind: "state", lgdCode: "16" },
  { id: "st-up", name: "Uttar Pradesh", nameHi: "उत्तर प्रदेश", kind: "state", lgdCode: "09", activeHostsCount: 16, publishedExperiencesCount: 3 },
  { id: "st-uk", name: "Uttarakhand", nameHi: "उत्तराखंड", kind: "state", lgdCode: "05" },
  { id: "st-wb", name: "West Bengal", nameHi: "पश्चिम बंगाल", kind: "state", lgdCode: "19" },

  // 8 Union Territories
  { id: "ut-an", name: "Andaman and Nicobar Islands", nameHi: "अंडमान और निकोबार द्वीपसमूह", kind: "union_territory", lgdCode: "35" },
  { id: "ut-ch", name: "Chandigarh", nameHi: "चंडीगढ़", kind: "union_territory", lgdCode: "04" },
  { id: "ut-dh", name: "Dadra and Nagar Haveli and Daman and Diu", nameHi: "दादरा और नगर हवेली एवं दमन और दीव", kind: "union_territory", lgdCode: "38" },
  { id: "ut-dl", name: "Delhi", nameHi: "दिल्ली", kind: "union_territory", lgdCode: "07" },
  { id: "ut-jk", name: "Jammu and Kashmir", nameHi: "जम्मू और कश्मीर", kind: "union_territory", lgdCode: "01" },
  { id: "ut-la", name: "Ladakh", nameHi: "लद्दाख", kind: "union_territory", lgdCode: "37" },
  { id: "ut-ld", name: "Lakshadweep", nameHi: "लक्षद्वीप", kind: "union_territory", lgdCode: "31" },
  { id: "ut-py", name: "Puducherry", nameHi: "पुदुचेरी", kind: "union_territory", lgdCode: "34" },
];

// Pilot and expansion districts
export const OFFICIAL_DISTRICTS: DistrictData[] = [
  // Pilot Region: Bihar
  {
    id: "dst-darbhanga",
    stateId: "st-br",
    name: "Darbhanga",
    nameHi: "दरभंगा",
    lgdCode: "192",
    centroidLat: 26.1522,
    centroidLng: 85.8971,
  },
  {
    id: "dst-madhubani",
    stateId: "st-br",
    name: "Madhubani",
    nameHi: "मधुबनी",
    lgdCode: "193",
    centroidLat: 26.3541,
    centroidLng: 86.0716,
  },

  // Expansion Region: Uttar Pradesh
  {
    id: "dst-varanasi",
    stateId: "st-up",
    name: "Varanasi",
    nameHi: "वाराणसी",
    lgdCode: "173",
    centroidLat: 25.3176,
    centroidLng: 82.9739,
  },

  // Expansion Region: Rajasthan
  {
    id: "dst-jaipur",
    stateId: "st-rj",
    name: "Jaipur",
    nameHi: "जयपुर",
    lgdCode: "106",
    centroidLat: 26.9124,
    centroidLng: 75.7873,
  },

  // Expansion Region: Kerala
  {
    id: "dst-ernakulam",
    stateId: "st-kl",
    name: "Ernakulam (Kochi)",
    nameHi: "एर्नाकुलम (कोच्चि)",
    lgdCode: "555",
    centroidLat: 9.9816,
    centroidLng: 76.2999,
  },

  // Expansion Region: Meghalaya
  {
    id: "dst-east-khasi-hills",
    stateId: "st-ml",
    name: "East Khasi Hills (Shillong)",
    nameHi: "पूर्वी खासी हिल्स (शिलांग)",
    lgdCode: "274",
    centroidLat: 25.5788,
    centroidLng: 91.8933,
    permitsNotice: "Certain remote border areas require Protected Area Permits for non-Indian passport holders.",
    permitsReviewedByLawyer: false,
  },
];

// Towns in pilot districts
export const OFFICIAL_CITIES: CityData[] = [
  { id: "cty-dar-mc", districtId: "dst-darbhanga", name: "Darbhanga Municipal Corporation", nameHi: "दरभंगा नगर निगम", lgdCode: "243456" },
  { id: "cty-dar-ben", districtId: "dst-darbhanga", name: "Benipur", nameHi: "बेनीपुर", lgdCode: "243457" },
  { id: "cty-mad-np", districtId: "dst-madhubani", name: "Madhubani Nagar Parishad", nameHi: "मधुबनी नगर परिषद", lgdCode: "243460" },
  { id: "cty-mad-jhan", districtId: "dst-madhubani", name: "Jhanjharpur", nameHi: "झंझारपुर", lgdCode: "243461" },
  { id: "cty-var-mc", districtId: "dst-varanasi", name: "Varanasi Municipal Corporation", nameHi: "वाराणसी नगर निगम", lgdCode: "243470" },
  { id: "cty-jai-mc", districtId: "dst-jaipur", name: "Jaipur Greater Municipal Corporation", nameHi: "जयपुर ग्रेटर नगर निगम", lgdCode: "243480" },
  { id: "cty-koc-mc", districtId: "dst-ernakulam", name: "Kochi Municipal Corporation", nameHi: "कोच्चि नगर निगम", lgdCode: "243490" },
  { id: "cty-shl-mb", districtId: "dst-east-khasi-hills", name: "Shillong Municipal Board", nameHi: "शिलांग नगर बोर्ड", lgdCode: "243500" },
];

export function getStates(): StateData[] {
  return OFFICIAL_STATES;
}

export function getStateById(id: string): StateData | undefined {
  return OFFICIAL_STATES.find((s) => s.id === id || s.lgdCode === id);
}

export function getDistricts(stateId?: string): DistrictData[] {
  if (!stateId) return OFFICIAL_DISTRICTS;
  return OFFICIAL_DISTRICTS.filter((d) => d.stateId === stateId);
}

export function getDistrictById(id: string): DistrictData | undefined {
  return OFFICIAL_DISTRICTS.find((d) => d.id === id || d.lgdCode === id);
}

export function getCities(districtId?: string): CityData[] {
  if (!districtId) return OFFICIAL_CITIES;
  return OFFICIAL_CITIES.filter((c) => c.districtId === districtId);
}

export function searchLocations(query: string): Array<{
  id: string;
  type: "state" | "district" | "city";
  title: string;
  titleHi: string;
  subtitle: string;
  href: string;
}> {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();

  const results: Array<{
    id: string;
    type: "state" | "district" | "city";
    title: string;
    titleHi: string;
    subtitle: string;
    href: string;
  }> = [];

  // Search states
  for (const s of OFFICIAL_STATES) {
    if (s.name.toLowerCase().includes(q) || s.nameHi.includes(q)) {
      results.push({
        id: s.id,
        type: "state",
        title: s.name,
        titleHi: s.nameHi,
        subtitle: s.kind === "state" ? "State" : "Union Territory",
        href: `/india/${slugify(s.name)}`,
      });
    }
  }

  // Search districts
  for (const d of OFFICIAL_DISTRICTS) {
    if (d.name.toLowerCase().includes(q) || d.nameHi.includes(q)) {
      const state = getStateById(d.stateId);
      results.push({
        id: d.id,
        type: "district",
        title: d.name,
        titleHi: d.nameHi,
        subtitle: state ? `District in ${state.name}` : "District",
        href: `/india/${state ? slugify(state.name) : "state"}/${slugify(d.name)}`,
      });
    }
  }

  // Search cities
  for (const c of OFFICIAL_CITIES) {
    if (c.name.toLowerCase().includes(q) || c.nameHi.includes(q)) {
      const district = getDistrictById(c.districtId);
      results.push({
        id: c.id,
        type: "city",
        title: c.name,
        titleHi: c.nameHi,
        subtitle: district ? `Town in ${district.name}` : "Town",
        href: `/explore?cityId=${c.id}`,
      });
    }
  }

  return results.slice(0, 10);
}
