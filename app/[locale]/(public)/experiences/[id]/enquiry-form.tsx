"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceEnquirySchema,
  type ExperienceEnquiryInput,
} from "@/lib/validation/experience";
import { submitExperienceEnquiryAction } from "@/app/actions/experiences";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { ShieldCheck } from "lucide-react";

interface EnquiryFormProps {
  experienceId: string;
  maxParticipants: number;
  locale: string;
}

export function ExperienceEnquiryForm({
  experienceId,
  maxParticipants,
  locale,
}: EnquiryFormProps) {
  const isHindi = locale === "hi";
  const [serverError, setServerError] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExperienceEnquiryInput>({
    resolver: zodResolver(experienceEnquirySchema),
    defaultValues: {
      experience_id: experienceId,
      participant_count: 1,
      proposed_date: todayStr,
      preferred_language: isHindi ? "Hindi" : "English",
      message: "",
      safety_acknowledged: true,
      idempotency_key: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    },
  });

  const messageText = watch("message") || "";
  const charCount = messageText.length;

  const onSubmit = async (data: ExperienceEnquiryInput) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await submitExperienceEnquiryAction(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessBookingId(result.data.bookingId);
    } else {
      setServerError(result.error);
    }
  };

  if (successBookingId) {
    return (
      <div className="space-y-4">
        <Notice variant="default">
          <strong className="font-semibold block mb-1">
            {isHindi ? "पूछताछ सफलतापूर्वक भेजी गई" : "Enquiry Successfully Sent"}
          </strong>
          <p className="text-xs leading-relaxed">
            {isHindi
              ? "आपकी पूछताछ मेजबान को भेज दी गई है। मेजबान की स्वीकृति के पश्चात आप सीधे संदेश भेजकर सार्वजनिक बैठक का विवरण तय कर सकेंगे।"
              : "Your enquiry has been forwarded to the cultural host. Once accepted, a direct messaging channel will open to finalize meeting details."}
          </p>
        </Notice>

        <div className="pt-2">
          <Link
            href="/connections"
            className="w-full inline-flex items-center justify-center tap-target px-4 py-2.5 bg-primary text-white text-xs font-medium rounded-sm hover:bg-primary-hover transition-colors"
          >
            {isHindi ? "मेरी पूछताछ और संपर्क देखें" : "View My Enquiries & Connections"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <Notice variant="error">
          <strong className="font-semibold block mb-1">
            {isHindi ? "त्रुटि" : "Unable to Submit"}
          </strong>
          <p className="text-xs">{serverError}</p>
        </Notice>
      )}

      {/* Participants */}
      <Field
        label={isHindi ? "प्रतिभागियों की संख्या" : "Number of Participants"}
        htmlFor="participant_count"
        error={errors.participant_count?.message}
        helperText={isHindi ? `अधिकतम सीमा: ${maxParticipants}` : `Capacity limit: ${maxParticipants}`}
      >
        <select
          id="participant_count"
          {...register("participant_count", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:outline-hidden focus:ring-1 focus:ring-primary"
        >
          {Array.from({ length: maxParticipants }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {isHindi ? (num === 1 ? "व्यक्ति" : "व्यक्ति") : num === 1 ? "person" : "people"}
            </option>
          ))}
        </select>
      </Field>

      {/* Proposed Date */}
      <Field
        label={isHindi ? "प्रस्तावित तिथि" : "Proposed Date"}
        htmlFor="proposed_date"
        error={errors.proposed_date?.message}
        helperText={isHindi ? "वांछित तिथि का चयन करें" : "Select your intended date of visit"}
      >
        <input
          id="proposed_date"
          type="date"
          min={todayStr}
          {...register("proposed_date")}
          className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:outline-hidden focus:ring-1 focus:ring-primary"
        />
      </Field>

      {/* Preferred Language */}
      <Field
        label={isHindi ? "संवाद की पसंदीदा भाषा" : "Preferred Communication Language"}
        htmlFor="preferred_language"
        error={errors.preferred_language?.message}
      >
        <select
          id="preferred_language"
          {...register("preferred_language")}
          className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:outline-hidden focus:ring-1 focus:ring-primary"
        >
          <option value="Hindi">हिंदी (Hindi)</option>
          <option value="English">English</option>
          <option value="Maithili">मैथिली (Maithili)</option>
        </select>
      </Field>

      {/* Message */}
      <Field
        label={isHindi ? "मेजबान के लिए संदेश" : "Message to Host"}
        htmlFor="message"
        error={errors.message?.message}
        helperText={
          isHindi
            ? `अपने सांस्कृतिक हित और यात्रा संदर्भ का संक्षेप में उल्लेख करें (${charCount}/1000)`
            : `Mention your cultural interests and visit context (min 20 characters, ${charCount}/1000)`
        }
      >
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          placeholder={
            isHindi
              ? "नमस्ते, मैं बिहार की मिथिला कला परंपरा में गहरी रुचि रखता हूँ। क्या हम 25 तारीख को मिल सकते हैं?"
              : "Greetings, I am traveling through Mithila and am keen to learn about the traditional painting methods and natural dye preparation..."
          }
          className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:outline-hidden focus:ring-1 focus:ring-primary"
        />
      </Field>

      {/* Safety Agreement Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-secondary">
          <input
            type="checkbox"
            {...register("safety_acknowledged")}
            className="mt-0.5 rounded-sm border-rule text-primary focus:ring-primary"
          />
          <span className="text-[11px] leading-relaxed">
            {isHindi
              ? "मैं सहमत हूँ कि पहली बैठक हमेशा एक सार्वजनिक नागरिक स्थल पर होगी और मैं सुरक्षा दिशानिर्देशों का पालन करूँगा/करूँगी।"
              : "I acknowledge that initial meetings must take place at recognized public civic landmarks and agree to community safety guidelines."}
          </span>
        </label>
        {errors.safety_acknowledged && (
          <p className="text-[11px] text-terracotta mt-1">
            {errors.safety_acknowledged.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <Button
          type="submit"
          variant="primary"
          size="default"
          className="w-full justify-center"
          disabled={isSubmitting || charCount < 20 || charCount > 1000}
        >
          {isSubmitting
            ? isHindi
              ? "भेजा जा रहा है..."
              : "Submitting..."
            : isHindi
            ? "सांस्कृतिक पूछताछ भेजें"
            : "Send Cultural Enquiry"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-secondary pt-1">
        <ShieldCheck size={12} strokeWidth={1.5} className="text-forest" />
        <span>{isHindi ? "निःशुल्क सांस्कृतिक संपर्क (चरण 1)" : "Free cultural enquiry (Phase 1)"}</span>
      </div>
    </form>
  );
}
