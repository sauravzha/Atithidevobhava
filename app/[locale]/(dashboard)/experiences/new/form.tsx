"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExperienceSchema,
  type CreateExperienceInput,
} from "@/lib/validation/experience";
import { createExperienceAction } from "@/app/actions/experiences";
import { OFFICIAL_CATEGORIES, OFFICIAL_STATES, getDistricts } from "@/lib/location/data";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";

interface FormProps {
  locale: string;
}

export function ExperienceCreationForm({ locale }: FormProps) {
  const isHindi = locale === "hi";
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateExperienceInput>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      title_en: "",
      title_hi: "",
      category: "art-and-handicrafts",
      description_en: "",
      description_hi: "",
      state_id: "st-br",
      district_id: "dst-madhubani",
      general_meeting_area: "",
      duration_minutes: 180,
      price_per_person_paise: 0,
      min_participants: 1,
      max_participants: 6,
      languages: ["Hindi", "English"],
      included: ["Handmade paper", "Natural mineral pigments", "Village tea"],
      excluded: ["Personal transport to village"],
      cancellation_policy:
        "Full flexibility up to 24 hours prior to scheduled meeting time.",
      safety_information:
        "Initial meeting is strictly at the village panchayat civic centre. Modest attire and flat walking shoes recommended.",
      images: [
        {
          image_url: "https://images.example.org/pilot/mithila-workshop-1.jpg",
          alt_text: "Traditional Mithila artisan demonstrating line painting using bamboo nibs",
          credit: "Artisan Family Archive / Atithi Devo Bhava Pilot",
          licence: "host-owned",
        },
      ],
    },
  });

  const onSubmit = async (data: CreateExperienceInput, submitForReview: boolean) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await createExperienceAction(data, submitForReview);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/dashboard/experiences");
    } else {
      setServerError(result.error);
    }
  };

  return (
    <form className="space-y-8">
      {serverError && (
        <Notice variant="error">
          <strong className="block mb-1 font-semibold">
            {isHindi ? "त्रुटि" : "Listing Submission Error"}
          </strong>
          <p className="text-xs">{serverError}</p>
        </Notice>
      )}

      {/* 1. Basic Information */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
          {isHindi ? "1. मूल विवरण" : "1. Core Information"}
        </h2>

        <Field
          label={isHindi ? "शीर्षक (अंग्रेजी)" : "Title (English)"}
          htmlFor="title_en"
          error={errors.title_en?.message}
          helperText={isHindi ? "संक्षिप्त और तथ्यात्मक रखें (न्यूनतम 5 अक्षर)" : "Keep it concise and descriptive (min 5 characters)"}
        >
          <input
            id="title_en"
            type="text"
            {...register("title_en")}
            placeholder="e.g. Traditional Mithila Painting & Natural Pigment Workshop"
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>

        <Field
          label={isHindi ? "शीर्षक (हिंदी)" : "Title (Hindi, optional)"}
          htmlFor="title_hi"
          error={errors.title_hi?.message}
        >
          <input
            id="title_hi"
            type="text"
            {...register("title_hi")}
            placeholder="उदा. जितवारपुर में पारंपरिक मिथिला चित्रकला कार्यशाला"
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary font-devanagari"
          />
        </Field>

        <Field
          label={isHindi ? "सांस्कृतिक श्रेणी" : "Cultural Category"}
          htmlFor="category"
          error={errors.category?.message}
          helperText={isHindi ? "12 आधिकारिक सांस्कृतिक श्रेणियों में से चुनें" : "Select one of the 12 official platform categories"}
        >
          <select
            id="category"
            {...register("category")}
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          >
            {OFFICIAL_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nameEn} ({cat.nameHi})
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={isHindi ? "विस्तृत विवरण (अंग्रेजी)" : "Detailed Description (English)"}
          htmlFor="description_en"
          error={errors.description_en?.message}
          helperText={isHindi ? "कम से कम 50 अक्षर" : "Minimum 50 characters describing what you genuinely provide"}
        >
          <textarea
            id="description_en"
            rows={5}
            {...register("description_en")}
            placeholder="Describe the cultural context, the flow of the session, what the visitor will observe or practice, and the history behind this tradition..."
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>

        <Field
          label={isHindi ? "विस्तृत विवरण (हिंदी, वैकल्पिक)" : "Detailed Description (Hindi, optional)"}
          htmlFor="description_hi"
          error={errors.description_hi?.message}
        >
          <textarea
            id="description_hi"
            rows={4}
            {...register("description_hi")}
            placeholder="इस अनुभव की परंपरा, गतिविधि और आगंतुक के लिए सीखने के तत्वों का विवरण दें..."
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary font-devanagari"
          />
        </Field>
      </section>

      {/* 2. Geography & Meeting Point */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
          {isHindi ? "2. स्थान एवं सार्वजनिक मिलन स्थल" : "2. Geography & Public Meeting Point"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={isHindi ? "राज्य" : "State"}
            htmlFor="state_id"
            error={errors.state_id?.message}
          >
            <select
              id="state_id"
              {...register("state_id")}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            >
              {OFFICIAL_STATES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.nameHi})
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={isHindi ? "जिला" : "District"}
            htmlFor="district_id"
            error={errors.district_id?.message}
          >
            <select
              id="district_id"
              {...register("district_id")}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            >
              {getDistricts("st-br").map((dst) => (
                <option key={dst.id} value={dst.id}>
                  {dst.name} ({dst.nameHi})
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label={isHindi ? "सामान्य सार्वजनिक मिलन स्थल" : "General Public Meeting Area"}
          htmlFor="general_meeting_area"
          error={errors.general_meeting_area?.message}
          helperText={
            isHindi
              ? "महत्वपूर्ण: किसी प्रसिद्ध सार्वजनिक नागरिक स्थल (जैसे पंचायत भवन, चौक) का नाम दें। निजी घर का पता कभी न लिखें।"
              : "Mandatory: A recognizable public civic spot (e.g. Village Panchayat Hall gate, Town Square). Never write a private residential address."
          }
        >
          <input
            id="general_meeting_area"
            type="text"
            {...register("general_meeting_area")}
            placeholder="e.g. Jitwarpur Village Panchayat Bhavan perimeter"
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>
      </section>

      {/* 3. Capacity & Duration */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
          {isHindi ? "3. अवधि एवं क्षमता" : "3. Duration & Group Capacity"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label={isHindi ? "अवधि (मिनटों में)" : "Duration (minutes)"}
            htmlFor="duration_minutes"
            error={errors.duration_minutes?.message}
            helperText="30 to 720 minutes"
          >
            <input
              id="duration_minutes"
              type="number"
              step={15}
              {...register("duration_minutes", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field
            label={isHindi ? "न्यूनतम समूह आकार" : "Min Participants"}
            htmlFor="min_participants"
            error={errors.min_participants?.message}
          >
            <input
              id="min_participants"
              type="number"
              {...register("min_participants", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field
            label={isHindi ? "अधिकतम समूह आकार" : "Max Participants"}
            htmlFor="max_participants"
            error={errors.max_participants?.message}
          >
            <input
              id="max_participants"
              type="number"
              {...register("max_participants", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            />
          </Field>
        </div>

        <div className="p-3 border border-rule rounded-sm bg-warm/20 text-xs text-secondary">
          <strong className="text-text block mb-1">
            {isHindi ? "चरण 1 मूल्य निर्धारण सूचना" : "Phase 1 Pricing Governance"}
          </strong>
          {isHindi
            ? "आधार मूल्य रिकॉर्ड किया जाता है लेकिन चरण 1 के दौरान आगंतुकों से पूरी तरह छुपा रहता है। कोई भुगतान संसाधित नहीं होता।"
            : "Base pricing is recorded for Phase 2 readiness, but strictly hidden from public view in Phase 1 enquiry mode. No payment processing occurs."}
        </div>
      </section>

      {/* 4. Safety & Cancellation */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
          {isHindi ? "4. सुरक्षा दिशानिर्देश और रद्दीकरण नीति" : "4. Safety & Cancellation Terms"}
        </h2>

        <Field
          label={isHindi ? "सुरक्षा दिशानिर्देश" : "Safety & Cultural Guidelines"}
          htmlFor="safety_information"
          error={errors.safety_information?.message}
          helperText="Minimum 20 characters"
        >
          <textarea
            id="safety_information"
            rows={3}
            {...register("safety_information")}
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>

        <Field
          label={isHindi ? "रद्दीकरण नीति" : "Cancellation Terms"}
          htmlFor="cancellation_policy"
          error={errors.cancellation_policy?.message}
          helperText="Specify notification timeline for schedule changes"
        >
          <input
            id="cancellation_policy"
            type="text"
            {...register("cancellation_policy")}
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>
      </section>

      {/* 5. Photos & Attribution */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-5">
        <h2 className="font-heading text-lg font-medium text-text border-b border-rule pb-2">
          {isHindi ? "5. प्रामाणिक तस्वीरें और लाइसेंस" : "5. Authentic Photography & Credit"}
        </h2>

        <Field
          label={isHindi ? "तस्वीर URL" : "Cover Photo URL"}
          htmlFor="cover_photo_url"
          error={errors.images?.[0]?.image_url?.message}
          helperText="Direct link to licensed or host-owned photo"
        >
          <input
            id="cover_photo_url"
            type="url"
            {...register("images.0.image_url")}
            className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={isHindi ? "विवरण (Alt Text)" : "Alt Text"}
            htmlFor="photo_alt_text"
            error={errors.images?.[0]?.alt_text?.message}
          >
            <input
              id="photo_alt_text"
              type="text"
              {...register("images.0.alt_text")}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field
            label={isHindi ? "फोटो क्रेडिट" : "Attribution Credit"}
            htmlFor="photo_credit"
            error={errors.images?.[0]?.credit?.message}
          >
            <input
              id="photo_credit"
              type="text"
              {...register("images.0.credit")}
              className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
            />
          </Field>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-rule">
        <Button
          type="button"
          variant="secondary"
          size="default"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => onSubmit(data, false))}
        >
          {isSubmitting
            ? isHindi
              ? "सहेजा जा रहा है..."
              : "Saving..."
            : isHindi
            ? "ड्राफ्ट के रूप में सहेजें"
            : "Save as Draft"}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="default"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => onSubmit(data, true))}
        >
          {isSubmitting
            ? isHindi
              ? "जमा किया जा रहा है..."
              : "Submitting..."
            : isHindi
            ? "समीक्षा हेतु जमा करें"
            : "Submit for Admin Review"}
        </Button>
      </div>
    </form>
  );
}
