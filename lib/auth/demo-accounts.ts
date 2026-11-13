/**
 * Predefined verified demo profiles for one-click testing and demonstration.
 * Client-safe: Contains zero server-side dependencies.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string | null;
  role: "traveller" | "local_member" | "experience_provider" | "accommodation_host" | "admin";
  isAdult: boolean;
  provider: "google" | "otp" | "demo";
}

export interface DemoProfile {
  id: string;
  name: string;
  nameHi: string;
  email: string;
  role: AuthenticatedUser["role"];
  roleLabelEn: string;
  roleLabelHi: string;
  locationEn: string;
  locationHi: string;
  avatar: string;
  bioEn: string;
  bioHi: string;
}

export const PRESET_DEMO_ACCOUNTS: DemoProfile[] = [
  {
    id: "usr_sarah_traveller",
    name: "Sarah Jenkins",
    nameHi: "सारा जेनकिंस",
    email: "sarah.jenkins@example.com",
    role: "traveller",
    roleLabelEn: "Verified Traveller",
    roleLabelHi: "सत्यापित यात्री",
    locationEn: "London, UK • Visiting Mithila",
    locationHi: "लंदन, यूके • मिथिला यात्रा पर",
    avatar: "/images/host-shanti-devi.jpg",
    bioEn: "Visiting North Bihar to explore Mithila folk painting and rural heritage.",
    bioHi: "मिथिला लोक चित्रकला और ग्रामीण संस्कृति को समझने के लिए उत्तरी बिहार की यात्रा।",
  },
  {
    id: "usr_shanti_artisan",
    name: "Shanti Devi",
    nameHi: "शांति देवी",
    email: "shanti.devi@mithila.example.com",
    role: "experience_provider",
    roleLabelEn: "Master Artisan & Host",
    roleLabelHi: "वरिष्ठ शिल्पकार व मेज़बान",
    locationEn: "Jitwarpur, Madhubani",
    locationHi: "जितवारपुर, मधुबनी",
    avatar: "/images/host-shanti-devi.jpg",
    bioEn: "State Awardee Mithila painter sharing village workshops in Jitwarpur.",
    bioHi: "जितवारपुर में पारंपरिक मिथिला कला कार्यशालाएं संचालित करने वाली राज्य पुरस्कार विजेता।",
  },
  {
    id: "usr_rameshwar_local",
    name: "Rameshwar Jha",
    nameHi: "रामेश्वर झा",
    email: "rameshwar.jha@mithila.example.com",
    role: "local_member",
    roleLabelEn: "Local Resident & Guide",
    roleLabelHi: "स्थानीय नागरिक व मार्गदर्शक",
    locationEn: "Darbhanga City, Bihar",
    locationHi: "दरभंगा नगर, बिहार",
    avatar: "/images/host-rameshwar-jha.jpg",
    bioEn: "Cultural historian offering walking tours around Darbhanga's historic Raj ponds.",
    bioHi: "दरभंगा के ऐतिहासिक राज पोखरों और धरोहर स्थलों के जानकार।",
  },
  {
    id: "usr_admin_platform",
    name: "Platform Moderator",
    nameHi: "मंच संचालक",
    email: "moderator@atithidevobhava.in",
    role: "admin",
    roleLabelEn: "Platform Admin & Safety Lead",
    roleLabelHi: "सुरक्षा व मंच प्रबंधक",
    locationEn: "Atithi Devo Bhava Operations",
    locationHi: "अतिथि देवो भवः केंद्रीय संचालन",
    avatar: "/images/logo.png",
    bioEn: "Community safety, host verifications, and cultural moderation officer.",
    bioHi: "सामुदायिक सुरक्षा और मेज़बान सत्यापन का दायित्व।",
  },
];

