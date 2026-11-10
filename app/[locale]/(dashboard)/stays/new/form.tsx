"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Home } from "lucide-react";
import {
  createAccommodationListingAction,
  submitAccommodationForReviewAction,
} from "@/app/actions/accommodation";
import { type AccommodationCategoryType } from "@/lib/validation/accommodation";

interface Props {
  isHindi: boolean;
}

export function CreateStayListingForm({ isHindi }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [accommodationType, setAccommodationType] = useState<AccommodationCategoryType>("free_cultural_hospitality");
  const [roomType, setRoomType] = useState<"private_room" | "shared_room">("private_room");
  const [bathroomType, setBathroomType] = useState<"private" | "shared">("private");
  const [maxGuests, setMaxGuests] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [foodProvided, setFoodProvided] = useState("");
  const [generalLocation, setGeneralLocation] = useState("");
  const [householdAdultsCount, setHouseholdAdultsCount] = useState(2);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [otherResidentsDescription, setOtherResidentsDescription] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [pricePerNightRupees, setPricePerNightRupees] = useState(0);
  const [stateTourismRegNumber, setStateTourismRegNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFreeCategory = accommodationType === "free_cultural_hospitality";

  const handleSubmit = async (submitForReview: boolean) => {
    setErrorMessage(null);

    // Validate private address
    const privatePattern = /\b(flat|apartment|apt|house\s*no|plot\s*no|h\.?\s*no|room\s*no|lane\s*\d|street\s*\d)\b/i;
    if (privatePattern.test(generalLocation)) {
      setErrorMessage(
        isHindi
          ? "निजी आवासीय पता या फ्लैट नंबर लिखना मना है। कृपया केवल सार्वजनिक क्षेत्र या लैंडमार्क का नाम दें।"
          : "Exact street address or flat number is forbidden. Please provide a general public landmark or neighborhood name."
      );
      return;
    }

    if (accommodationType === "registered_paid_homestay" && !stateTourismRegNumber.trim()) {
      setErrorMessage(
        isHindi
          ? "पंजीकृत होमस्टे हेतु राज्य पर्यटन विभाग पंजीकरण संख्या अनिवार्य है"
          : "State tourism registration number is mandatory for registered paid homestay"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const pricePaise = isFreeCategory ? 0 : Math.round(pricePerNightRupees * 100);

      const res = await createAccommodationListingAction({
        title: title.trim(),
        accommodationType,
        roomType,
        bathroomType,
        maxGuests,
        roomCount,
        foodProvided: foodProvided.trim() || undefined,
        generalLocation: generalLocation.trim(),
        householdAdultsCount,
        hasChildren,
        hasPets,
        otherResidentsDescription: otherResidentsDescription.trim() || undefined,
        houseRules: houseRules.trim() || undefined,
        pricePerNightPaise: pricePaise,
        stateTourismRegistrationNumber: stateTourismRegNumber.trim() || undefined,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Failed to create listing");
        setIsSubmitting(false);
        return;
      }

      const listingId = res.data.listingId;

      if (submitForReview) {
        const reviewRes = await submitAccommodationForReviewAction(listingId);
        if (!reviewRes.success) {
          // Stayed in draft due to missing checklist
          setErrorMessage(reviewRes.error || "Listing saved as draft, but review submission needs compliance checklist.");
          setIsSubmitting(false);
          router.push(`/dashboard/compliance`);
          return;
        }
      }

      router.push(`/stays/${listingId}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error creating listing");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(false);
      }}
      className="space-y-8"
    >
      {errorMessage && (
        <Notice variant="error">
          <p className="text-xs">{errorMessage}</p>
        </Notice>
      )}

      {/* Step 1: Category & Title */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
          {isHindi ? "1. आवास श्रेणी और शीर्षक" : "1. Accommodation Category & Title"}
        </h2>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi ? "आवास श्रेणी (7 कानूनी श्रेणियां):" : "Accommodation Category (7 Permitted Categories):"}
          </label>
          <select
            value={accommodationType}
            onChange={(e) => {
              const val = e.target.value as AccommodationCategoryType;
              setAccommodationType(val);
              if (val === "free_cultural_hospitality") setPricePerNightRupees(0);
            }}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          >
            <option value="free_cultural_hospitality">
              Free Cultural Hospitality (निःशुल्क सांस्कृतिक आतिथ्य - No commercial charge)
            </option>
            <option value="cost_sharing">
              Cost Sharing (वास्तविक लागत साझा - Utilities and groceries only)
            </option>
            <option value="registered_paid_homestay">
              Registered Paid Homestay (पंजीकृत होमस्टे - State tourism license required)
            </option>
            <option value="family_accommodation">
              Family Accommodation (पारिवारिक अतिथि आवास)
            </option>
            <option value="eligible_paying_guest">
              Eligible Paying Guest (योग्य पेइंग गेस्ट)
            </option>
            <option value="private_guest_room">
              Private Guest Room (पृथक निजी अतिथि कक्ष)
            </option>
            <option value="other_permitted">
              Other Legally Permitted Hospitality (अन्य कानूनी रूप से अनुमत)
            </option>
          </select>
          <span className="text-[11px] text-secondary mt-1 block">
            {isHindi
              ? "नियम: निःशुल्क आतिथ्य को व्यावसायिक होमस्टे के रूप में पेश नहीं किया जा सकता।"
              : "Rule: Never present unpaid cultural hospitality as commercial accommodation or the reverse."}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi ? "आवास शीर्षक (उदा. पारंपरिक मैथिल आंगन अतिथि कक्ष):" : "Listing Title:"}
          </label>
          <input
            type="text"
            required
            minLength={5}
            maxLength={120}
            placeholder={
              isHindi
                ? "उदा. मधुबनी गांव में कलाकार परिवार का अतिथि कक्ष"
                : "e.g. Traditional Artisan Family Guest Room in Ranti Village"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          />
        </div>
      </section>

      {/* Step 2: Quarters Configuration */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
          {isHindi ? "2. अतिथि कक्ष और सुविधाएं" : "2. Quarters Configuration"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi ? "कक्ष का प्रकार:" : "Room Type:"}
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as typeof roomType)}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            >
              <option value="private_room">Private Room (निजी कक्ष)</option>
              <option value="shared_room">Shared Room (साझा कक्ष)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi ? "स्नानघर का प्रकार:" : "Bathroom Type:"}
            </label>
            <select
              value={bathroomType}
              onChange={(e) => setBathroomType(e.target.value as typeof bathroomType)}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            >
              <option value="private">Private Bathroom (निजी स्नानघर)</option>
              <option value="shared">Shared Family Bathroom (साझा स्नानघर)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi ? "अधिकतम अतिथि (प्रारंभिक अधिकतम 2):" : "Max Guests (Max 2 in Release 1):"}
            </label>
            <select
              value={maxGuests}
              onChange={(e) => setMaxGuests(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests (Maximum)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi ? "कक्षों की संख्या:" : "Number of Rooms Offered:"}
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi ? "भोजन और पेय व्यवस्था:" : "Meals and Dining Arrangements:"}
          </label>
          <input
            type="text"
            placeholder={
              isHindi
                ? "उदा. ताजा घरेलू मैथिल नाश्ता और शाम की चाय शामिल है।"
                : "e.g. Home-cooked vegetarian breakfast and tea included."
            }
            value={foodProvided}
            onChange={(e) => setFoodProvided(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          />
        </div>
      </section>

      {/* Step 3: Household Transparency */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-rule pb-2">
          <Home size={16} strokeWidth={1.5} className="text-forest" />
          <h2 className="font-heading text-lg text-text">
            {isHindi ? "3. पारिवारिक गृह व्यवस्था और पारदर्शी विवरण" : "3. Household Transparency"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text mb-1">
              {isHindi ? "घर में वयस्क निवासी:" : "Adult Residents in Home:"}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={householdAdultsCount}
              onChange={(e) => setHouseholdAdultsCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="hasChildren"
              checked={hasChildren}
              onChange={(e) => setHasChildren(e.target.checked)}
              className="text-forest focus:ring-forest"
            />
            <label htmlFor="hasChildren" className="font-medium text-text cursor-pointer">
              {isHindi ? "घर में बच्चे हैं" : "Children live in home"}
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="hasPets"
              checked={hasPets}
              onChange={(e) => setHasPets(e.target.checked)}
              className="text-forest focus:ring-forest"
            />
            <label htmlFor="hasPets" className="font-medium text-text cursor-pointer">
              {isHindi ? "पालतू पशु हैं" : "Pets on premises"}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi ? "घर के अन्य सदस्यों का संक्षिप्त विवरण:" : "Other Household Members Description:"}
          </label>
          <textarea
            rows={2}
            placeholder={
              isHindi
                ? "उदा. माता-पिता और सूत्रधार घर में रहते हैं। शांतिपूर्ण कलाप्रेमी परिवार।"
                : "e.g. Host resides with parents. Quiet artisan household."
            }
            value={otherResidentsDescription}
            onChange={(e) => setOtherResidentsDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          />
        </div>
      </section>

      {/* Step 4: Location, Landmark & House Rules */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
          {isHindi ? "4. सार्वजनिक मिलन क्षेत्र और गृह नियम" : "4. Public Landmark & House Rules"}
        </h2>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi
              ? "सामान्य सार्वजनिक क्षेत्र / लैंडमार्क (सटीक घर का पता कभी न लिखें):"
              : "General Area Landmark (NEVER write exact house/flat numbers):"}
          </label>
          <input
            type="text"
            required
            minLength={5}
            maxLength={120}
            placeholder={
              isHindi
                ? "उदा. रांटी ग्राम पंचायत भवन के पास, मधुबनी"
                : "e.g. Near Ranti Village Panchayat Bhavan, Madhubani"
            }
            value={generalLocation}
            onChange={(e) => setGeneralLocation(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          />
          <span className="text-[11px] text-secondary mt-1 block">
            {isHindi
              ? "सुरक्षा नियम: निजी घर का पता बुकिंग की पुष्टि होने के 72 घंटे पूर्व ही अधिकृत अतिथि को प्रकट होता है।"
              : "Security Rule: Exact residential address is revealed strictly 72 hours before confirmed stay."}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1">
            {isHindi ? "गृह नियम और सांस्कृतिक शिष्टाचार:" : "House Rules & Modesty Guidelines:"}
          </label>
          <textarea
            rows={3}
            placeholder={
              isHindi
                ? "उदा. कमरे में जूते पहनना वर्जित है। सांस्कृतिक मर्यादा का पालन करें।"
                : "e.g. No footwear inside guest rooms. Modest cultural dress respected on premises."
            }
            value={houseRules}
            onChange={(e) => setHouseRules(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
          />
        </div>
      </section>

      {/* Step 5: Pricing & State Tourism Registration */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
          {isHindi ? "5. मूल्य और पर्यटन विभाग पंजीकरण" : "5. Pricing & Tourism Registration"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi ? "प्रति रात्रि मूल्य (INR):" : "Price Per Night (INR):"}
            </label>
            <input
              type="number"
              min={0}
              disabled={isFreeCategory}
              value={pricePerNightRupees}
              onChange={(e) => setPricePerNightRupees(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest disabled:bg-warm/40"
            />
            {isFreeCategory && (
              <span className="text-[11px] text-forest font-medium mt-1 block">
                {isHindi ? "निःशुल्क सांस्कृतिक आतिथ्य हेतु मूल्य 0 रहता है।" : "Price locked to zero for Free Cultural Hospitality."}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">
              {isHindi
                ? "राज्य पर्यटन विभाग पंजीकरण संख्या (सशुल्क होमस्टे हेतु):"
                : "State Tourism Registration Number (Paid Homestay):"}
            </label>
            <input
              type="text"
              placeholder="e.g. BHR-TOU-HST-2026-0042"
              value={stateTourismRegNumber}
              onChange={(e) => setStateTourismRegNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
        <Button
          type="button"
          variant="secondary"
          size="default"
          disabled={isSubmitting}
          onClick={() => handleSubmit(false)}
        >
          {isHindi ? "ड्राफ्ट के रूप में सहेजें" : "Save as Draft"}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="default"
          disabled={isSubmitting}
          onClick={() => handleSubmit(true)}
        >
          {isSubmitting
            ? isHindi
              ? "समीक्षा हेतु भेजा जा रहा है..."
              : "Submitting..."
            : isHindi
            ? "सत्यापन एवं समीक्षा हेतु भेजें"
            : "Submit for Stay Approval"}
        </Button>
      </div>
    </form>
  );
}
