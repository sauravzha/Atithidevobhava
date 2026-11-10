"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  Home,
  Users,
  MapPin,
  Coffee,
  Info,
  ShieldAlert,
} from "lucide-react";
import { submitStayBookingRequestAction } from "@/app/actions/accommodation";

interface ListingData {
  id: string;
  title: string;
  title_hi: string;
  accommodation_type: string;
  room_type: string;
  bathroom_type: string;
  max_guests: number;
  room_count: number;
  food_provided: string;
  general_location: string;
  household_adults_count: number;
  has_children: boolean;
  has_pets: boolean;
  other_residents_description: string;
  house_rules: string;
  price_per_night_paise: number;
  status: string;
  verification_tier: string;
  host_id: string;
  host_display_name: string;
}

interface Props {
  listing: ListingData;
  isHindi: boolean;
  staysEnabled: boolean;
  pricesVisible: boolean;
}

export function StayDetailClient({
  listing,
  isHindi,
  staysEnabled,
  pricesVisible,
}: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [introduction, setIntroduction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isFree = listing.accommodation_type === "free_cultural_hospitality" || listing.price_per_night_paise === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!staysEnabled) {
      setErrorMessage(
        isHindi
          ? "पारिवारिक प्रवास वर्तमान में चरण 3 अनुपालन सत्यापन में है। प्रत्यक्ष बुकिंग अभी खुली नहीं है।"
          : "Stay with a Local is not open yet. Bookings are disabled under Phase 3 compliance."
      );
      return;
    }

    if (!checkIn || !checkOut) {
      setErrorMessage(isHindi ? "कृपया आगमन और प्रस्थान तिथियां चुनें" : "Please select check-in and check-out dates");
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffDays = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setErrorMessage(isHindi ? "प्रस्थान तिथि आगमन तिथि के बाद होनी चाहिए" : "Check-out date must be after check-in date");
      return;
    }

    if (diffDays > 14) {
      setErrorMessage(isHindi ? "अधिकतम प्रवास अवधि 14 रातें है" : "Maximum stay duration is 14 nights");
      return;
    }

    if (introduction.trim().length < 20) {
      setErrorMessage(
        isHindi
          ? "कृपया कम से कम 20 अक्षरों में अपना परिचय और यात्रा उद्देश्य लिखें"
          : "Please write an introduction of at least 20 characters explaining your visit"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `stay_${listing.id.slice(0, 8)}_${Date.now()}`;
      const res = await submitStayBookingRequestAction({
        listingId: listing.id,
        checkIn,
        checkOut,
        adultCount,
        childCount: 0,
        introduction: introduction.trim(),
        idempotencyKey,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit stay request");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        isHindi
          ? "आपका प्रवास अनुरोध सूत्रधार को भेज दिया गया है। वे संदेश कक्ष में आपसे संपर्क करेंगे।"
          : "Your stay request was sent to the host. They will review and reply in messages."
      );
      setIntroduction("");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case "free_cultural_hospitality":
        return isHindi ? "निःशुल्क सांस्कृतिक आतिथ्य" : "Free Cultural Hospitality";
      case "cost_sharing":
        return isHindi ? "लागत-साझा प्रवास" : "Cost-Sharing Stay";
      case "registered_paid_homestay":
        return isHindi ? "पंजीकृत सशुल्क होमस्टे" : "Registered Paid Homestay";
      case "family_accommodation":
        return isHindi ? "पारिवारिक आवास" : "Family Accommodation";
      case "eligible_paying_guest":
        return isHindi ? "योग्य पेइंग गेस्ट" : "Eligible Paying Guest";
      case "private_guest_room":
        return isHindi ? "निजी अतिथि कक्ष" : "Private Guest Room";
      default:
        return isHindi ? "कानूनी रूप से अनुमत प्रवास" : "Permitted Residential Hospitality";
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="border-b border-rule pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-warm border border-rule rounded-sm text-secondary">
            {getCategoryLabel(listing.accommodation_type)}
          </span>
          <StatusLabel
            status={
              listing.verification_tier === "tier_2_stay_approved"
                ? "Tier 2: Stay Approved"
                : "Tier 1: Host Verified"
            }
            variant="success"
          />
        </div>

        <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
          {isHindi ? listing.title_hi : listing.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1">
            <Users size={13} strokeWidth={1.5} className="text-forest" />
            {isHindi ? "मेजबान:" : "Hosted by:"} <strong className="text-text font-medium">{listing.host_display_name}</strong>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} strokeWidth={1.5} className="text-terracotta" />
            {listing.general_location}
          </span>
        </div>
      </header>

      {/* Honest Phase 3 Gating Notice */}
      {!staysEnabled && (
        <Notice variant="warning">
          <strong className="block font-semibold mb-1">
            {isHindi ? "चरण 3: आवास सत्यापन प्रगति पर" : "Phase 3: Accommodation Verification in Progress"}
          </strong>
          <p className="text-xs leading-relaxed">
            {isHindi
              ? "अतिथि देवो भव पर रहने की सुविधा (Stay with a Local) अभी खुली नहीं है। भारतीय विदेशी नागरिक पंजीकरण (Form C / Form III) और प्रत्यक्ष आवासीय सुरक्षा निरीक्षण की पूर्णता के बाद ही इसे सक्रिय किया जाएगा। यह पृष्ठ पूर्वावलोकन हेतु है।"
              : "Stay with a Local is currently closed for bookings under Phase 3. Full activation occurs following local physical audits and statutory foreign guest reporting verification. This listing is displayed for transparency and preview."}
          </p>
        </Notice>
      )}

      {/* Main Grid: Details Left, Stay Request Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* Household Information */}
          <section className="p-5 border border-rule rounded-sm bg-paper space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-text uppercase tracking-wider border-b border-rule pb-2">
              <Home size={14} strokeWidth={1.5} className="text-forest" />
              <span>{isHindi ? "पारिवारिक गृह व्यवस्था" : "Household & Resident Profile"}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-secondary block">
                  {isHindi ? "वयस्क निवासी:" : "Adult Residents:"}
                </span>
                <span className="font-medium text-text">
                  {listing.household_adults_count} {isHindi ? "वयस्क" : "adult(s)"}
                </span>
              </div>

              <div>
                <span className="text-secondary block">
                  {isHindi ? "घर में बच्चे:" : "Children in Home:"}
                </span>
                <span className="font-medium text-text">
                  {listing.has_children ? (isHindi ? "हाँ" : "Yes") : isHindi ? "नहीं" : "No"}
                </span>
              </div>

              <div>
                <span className="text-secondary block">
                  {isHindi ? "घर में पालतू पशु:" : "Pets on Premises:"}
                </span>
                <span className="font-medium text-text">
                  {listing.has_pets ? (isHindi ? "हाँ" : "Yes") : isHindi ? "नहीं" : "No"}
                </span>
              </div>

              <div>
                <span className="text-secondary block">
                  {isHindi ? "अधिकतम अतिथि:" : "Capacity Limit:"}
                </span>
                <span className="font-medium text-forest font-mono">
                  {listing.max_guests} {isHindi ? "व्यक्ति (नियमबद्ध)" : "guests (strict max)"}
                </span>
              </div>
            </div>

            {listing.other_residents_description && (
              <div className="pt-2 border-t border-rule text-xs">
                <span className="text-secondary block mb-1">
                  {isHindi ? "पारिवारिक परिचय:" : "About the Household:"}
                </span>
                <p className="text-text leading-relaxed">{listing.other_residents_description}</p>
              </div>
            )}
          </section>

          {/* Quarters & Facilities */}
          <section className="space-y-4">
            <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
              {isHindi ? "अतिथि कक्ष और सुविधाएं" : "Quarters & Living Arrangements"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-rule rounded-sm bg-warm/20 space-y-1">
                <span className="text-secondary block">{isHindi ? "कक्ष का प्रकार" : "Room Configuration"}:</span>
                <span className="font-medium text-text capitalize">
                  {listing.room_type.replace("_", " ")}
                </span>
              </div>

              <div className="p-3 border border-rule rounded-sm bg-warm/20 space-y-1">
                <span className="text-secondary block">{isHindi ? "स्नानघर का प्रकार" : "Bathroom Access"}:</span>
                <span className="font-medium text-text capitalize">
                  {listing.bathroom_type.replace("_", " ")}
                </span>
              </div>
            </div>

            {listing.food_provided && (
              <div className="p-4 border border-rule rounded-sm bg-paper flex items-start gap-3 text-xs">
                <Coffee size={16} strokeWidth={1.5} className="text-forest mt-0.5" />
                <div>
                  <span className="font-medium text-text block mb-0.5">
                    {isHindi ? "भोजन और पेय व्यवस्था" : "Meals & Dining Arrangements"}
                  </span>
                  <p className="text-secondary leading-relaxed">{listing.food_provided}</p>
                </div>
              </div>
            )}
          </section>

          {/* House Rules */}
          {listing.house_rules && (
            <section className="space-y-3">
              <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
                {isHindi ? "गृह नियम और सांस्कृतिक मर्यादा" : "House Rules & Cultural Guidelines"}
              </h2>
              <div className="p-4 border border-rule rounded-sm bg-paper text-xs text-secondary leading-relaxed space-y-2">
                <p>{listing.house_rules}</p>
                <p className="text-[11px] text-secondary font-medium">
                  {isHindi
                    ? "नोट: पारिवारिक आवास में भारतीय सांस्कृतिक मर्यादा, रात्रि विश्राम समय और घरेलू अनुशासन का सम्मान अनिवार्य है।"
                    : "Please respect family quiet hours, residential privacy, and modest cultural etiquette."}
                </p>
              </div>
            </section>
          )}

          {/* Address Privacy Notice */}
          <div className="p-4 bg-warm border border-rule rounded-sm space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-text">
              <Info size={13} strokeWidth={1.5} className="text-forest" />
              <span>{isHindi ? "पता सुरक्षा नीति" : "Address Privacy Policy"}</span>
            </div>
            <p className="text-secondary leading-relaxed text-[11px]">
              {isHindi
                ? "मेजबान के घर का सटीक पता और जीपीएस निर्देशांक कभी भी सार्वजनिक नहीं किए जाते हैं। पुष्टि की गई बुकिंग पर प्रवास तिथि से ठीक 72 घंटे पूर्व ही अधिकृत अतिथि को पता और संपर्क प्रकट किया जाता है।"
                : "Exact home addresses and coordinates are never publicly shown. Confirmed guests receive exact arrival instructions strictly 72 hours prior to scheduled check-in."}
            </p>
          </div>
        </div>

        {/* Right Column: Stay Request Form */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="p-6 border border-rule rounded-sm bg-paper shadow-xs space-y-6">
            <header className="border-b border-rule pb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-secondary">
                  {isHindi ? "प्रवास दर" : "Hospitality Rate"}:
                </span>
                {isFree ? (
                  <span className="font-mono font-semibold text-forest text-sm">
                    {isHindi ? "निःशुल्क सांस्कृतिक आतिथ्य" : "Free (Cultural Hospitality)"}
                  </span>
                ) : pricesVisible ? (
                  <span className="font-mono font-semibold text-text text-base">
                    INR {(listing.price_per_night_paise / 100).toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-secondary">/ night</span>
                  </span>
                ) : (
                  <span className="text-xs text-secondary font-mono">
                    {isHindi ? "चरण 2/3 में घोषित" : "Phase 2/3 Rate"}
                  </span>
                )}
              </div>
            </header>

            {successMessage && (
              <Notice variant="default">
                <p className="text-xs">{successMessage}</p>
              </Notice>
            )}

            {errorMessage && (
              <Notice variant="error">
                <p className="text-xs">{errorMessage}</p>
              </Notice>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text mb-1">
                    {isHindi ? "आगमन तिथि" : "Check-in"}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-1">
                    {isHindi ? "प्रस्थान तिथि" : "Check-out"}
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "अतिथि संख्या (अधिकतम 2)" : "Adult Guests (Max 2)"}
                </label>
                <select
                  value={adultCount}
                  onChange={(e) => setAdultCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                >
                  <option value={1}>1 adult</option>
                  <option value={2}>2 adults (maximum)</option>
                </select>
                <span className="text-[11px] text-secondary mt-1 block">
                  {isHindi
                    ? "सुरक्षा नियमों के अनुसार प्रारंभिक चरण में अधिकतम 2 अतिथि अनुमत हैं।"
                    : "Strict maximum of 2 guests permitted under safety rules."}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "परिचय और यात्रा उद्देश्य" : "Introduction & Travel Purpose"}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    isHindi
                      ? "अपने बारे में, अपनी यात्रा के उद्देश्य और मेजबान परिवार से जुड़ने के कारण के बारे में कम से कम 20 अक्षरों में लिखें..."
                      : "Introduce yourself, explain the purpose of your visit to the district, and any special cultural interests (min 20 characters)..."
                  }
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting || !staysEnabled}
                >
                  {isSubmitting
                    ? isHindi
                      ? "प्रसंस्करण..."
                      : "Submitting..."
                    : !staysEnabled
                    ? isHindi
                      ? "बुकिंग अभी खुली नहीं है (चरण 3)"
                      : "Booking Not Open Yet (Phase 3)"
                    : isHindi
                    ? "प्रवास अनुरोध भेजें"
                    : "Send Stay Request"}
                </Button>
              </div>
            </form>

            <div className="pt-3 border-t border-rule space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                <ShieldAlert size={12} strokeWidth={1.5} className="text-terracotta" />
                <span>
                  {isHindi
                    ? "राष्ट्रीय आपातकालीन हेल्पलाइन: 112 | महिला: 1091"
                    : "National Emergency Helpline: 112 | Women: 1091"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
