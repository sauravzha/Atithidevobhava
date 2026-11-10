import type { Metadata } from "next";
import { Bi } from "@/components/ui/bi";
import { ShieldCheck, MapPin, Calendar, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Trusted Contact Itinerary View | विश्वसनीय संपर्क दृश्य - Atithi Devo Bhava",
  description:
    "Secure, privacy-governed itinerary summary for a verified trusted contact.",
};

interface TokenPageProps {
  params: Promise<{ locale: string; token: string }>;
}

export default async function TrustedContactViewPage({
  params,
}: TokenPageProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // Projected non-sensitive itinerary details
  const itinerary = {
    travellerFirstName: "Elena",
    hostFirstName: "Sunita",
    districtName: isHindi ? "मधुबनी" : "Madhubani",
    stateName: isHindi ? "बिहार" : "Bihar",
    dates: "2026-11-20",
    interactionType: isHindi ? "सांस्कृतिक अनुभव (शिल्प)" : "Cultural Experience (Living Craft)",
    publicAreaNote: isHindi
      ? "यह बैठक जितवारपुर ग्राम पंचायत भवन के खुले नागरिक परिसर में तय की गई है।"
      : "Designated at the open civic perimeter of the Jitwarpur Village Panchayat Bhavan.",
    expiresAt: "2026-11-27T00:00:00Z",
  };

  return (
    <div className="site-container py-10 max-w-2xl space-y-8">
      {/* Header */}
      <header className="border-b border-rule pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-forest">
          <ShieldCheck size={16} strokeWidth={1.5} />
          <span>{isHindi ? "सत्यापित विश्वसनीय संपर्क दृश्य" : "Verified Trusted Contact View"}</span>
        </div>
        <Bi
          hindi={`${itinerary.travellerFirstName} की यात्रा योजना का सारांश`}
          english={`Itinerary Summary for ${itinerary.travellerFirstName}`}
          as="h1"
          className="text-2xl md:text-3xl font-heading font-normal text-text"
        />
        <p className="text-xs text-secondary leading-relaxed">
          {isHindi
            ? "आपको यह लिंक यात्रा सुरक्षा के लिए एक विश्वसनीय संपर्क के रूप में प्रदान किया गया है।"
            : "You have been provided this expiring link as a designated emergency contact."}
        </p>
      </header>

      {/* Itinerary Summary Card */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <div className="space-y-1 border-b border-rule pb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            {isHindi ? "गतिविधि विवरण" : "Interaction Summary"}
          </span>
          <h2 className="font-heading text-lg font-medium text-text">
            {itinerary.interactionType}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-secondary font-medium">
              {isHindi ? "यात्री:" : "Traveler:"}
            </span>
            <p className="font-heading text-base font-medium text-text">
              {itinerary.travellerFirstName}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-secondary font-medium">
              {isHindi ? "स्थानीय मेजबान (पहला नाम):" : "Host Facilitator (First Name):"}
            </span>
            <p className="font-heading text-base font-medium text-text">
              {itinerary.hostFirstName}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-secondary font-medium">
              {isHindi ? "गंतव्य जिला एवं राज्य:" : "Destination District & State:"}
            </span>
            <p className="text-text font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin size={13} strokeWidth={1.5} className="text-primary" />
              <span>{itinerary.districtName}, {itinerary.stateName}</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-secondary font-medium">
              {isHindi ? "निर्धारित तिथि:" : "Scheduled Date:"}
            </span>
            <p className="text-text font-medium flex items-center gap-1.5 mt-0.5">
              <Calendar size={13} strokeWidth={1.5} className="text-primary" />
              <span>{itinerary.dates}</span>
            </p>
          </div>
        </div>

        {/* Public Area Confirmation */}
        <div className="p-3.5 border border-rule rounded-sm bg-warm/20 text-xs text-secondary space-y-1">
          <strong className="text-text block font-medium">
            {isHindi ? "सार्वजनिक नागरिक स्थल की पुष्टि" : "Civic Public Venue Standard"}
          </strong>
          <p className="leading-relaxed">{itinerary.publicAreaNote}</p>
        </div>
      </section>

      {/* Emergency Assistance Box */}
      <section className="p-6 border border-rule rounded-sm bg-warm/15 space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall size={16} strokeWidth={1.5} className="text-primary" />
          <h2 className="font-heading text-base font-medium text-text">
            {isHindi ? "राष्ट्रीय आपातकालीन सहायता संपर्क (भारत)" : "National Emergency Contacts (India)"}
          </h2>
        </div>

        <p className="text-xs text-secondary leading-relaxed">
          {isHindi
            ? "यदि आप अपने संपर्क से संपर्क स्थापित करने में असमर्थ हैं या किसी सहायता की आवश्यकता है:"
            : "If you have safety concerns or are unable to establish contact with the traveler:"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 border border-rule rounded-sm bg-page space-y-1">
            <span className="text-lg font-heading font-medium text-text block">112</span>
            <span className="text-[11px] text-secondary">
              {isHindi ? "अखिल भारतीय आपातकालीन" : "All-India Emergency"}
            </span>
          </div>

          <div className="p-3 border border-rule rounded-sm bg-page space-y-1">
            <span className="text-lg font-heading font-medium text-text block">1091</span>
            <span className="text-[11px] text-secondary">
              {isHindi ? "महिला हेल्पलाइन" : "Women Helpline"}
            </span>
          </div>

          <div className="p-3 border border-rule rounded-sm bg-page space-y-1">
            <span className="text-lg font-heading font-medium text-text block">1363</span>
            <span className="text-[11px] text-secondary">
              {isHindi ? "पर्यटक हेल्पलाइन" : "Tourist Helpline"}
            </span>
          </div>
        </div>
      </section>

      {/* Expiry and Privacy Assurance */}
      <div className="text-[11px] text-secondary text-center pt-2">
        {isHindi
          ? "यह लिंक यात्रा की तिथि के 7 दिनों के बाद स्वतः समाप्त हो जाएगा। अतिथि देवो भवः सुरक्षा प्रोटोकॉल।"
          : "This secure link expires automatically 7 days after the scheduled visit. Atithi Devo Bhava Safety Protocol."}
      </div>
    </div>
  );
}
