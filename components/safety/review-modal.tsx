"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  submitReviewSchema,
  type SubmitReviewInput,
} from "@/lib/validation/safety";
import { submitBlindReviewAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { X, EyeOff } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  revieweeName: string;
  connectionId?: string;
  bookingId?: string;
  locale: string;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  revieweeName,
  connectionId,
  bookingId,
  locale,
  onSuccess,
}: ReviewModalProps) {
  const isHindi = locale === "hi";
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmitReviewInput>({
    resolver: zodResolver(submitReviewSchema),
    defaultValues: {
      connection_id: connectionId,
      booking_id: bookingId,
      rating_as_described: 5,
      rating_communication: 5,
      rating_felt_safe: 5,
      review_text: "",
      private_safety_notes: "",
    },
  });

  const reviewText = watch("review_text") || "";
  const charCount = reviewText.length;

  const ratingDescribed = watch("rating_as_described");
  const ratingComm = watch("rating_communication");
  const ratingSafe = watch("rating_felt_safe");

  if (!isOpen) return null;

  const onSubmit = async (data: SubmitReviewInput) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await submitBlindReviewAction(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      if (onSuccess) onSuccess();
    } else {
      setServerError(result.error || "Failed to submit review");
    }
  };

  const renderStarSelector = (
    field: "rating_as_described" | "rating_communication" | "rating_felt_safe",
    currentVal: number
  ) => {
    return (
      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(field, star, { shouldValidate: true })}
            className={`p-1.5 rounded-sm border transition-colors ${
              star <= currentVal
                ? "bg-forest/10 border-forest text-forest font-medium"
                : "border-rule text-secondary hover:text-text"
            }`}
          >
            <span className="text-xs px-1">{star}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-page border border-rule rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <EyeOff size={18} strokeWidth={1.5} className="text-primary" />
            <h2 className="font-heading text-lg font-medium text-text">
              {isHindi ? "गोपनीय अंध समीक्षा (Blind Review)" : "Blind Review"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-text"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <Notice variant="default">
              <strong className="block mb-1 font-semibold text-text">
                {isHindi ? "समीक्षा सफलतापूर्वक जमा की गई" : "Review Submitted"}
              </strong>
              <p className="text-xs leading-relaxed">
                {isHindi
                  ? "आपकी समीक्षा सहेज ली गई है। अंध समीक्षा नियम (धारा 11) के तहत, यह तब तक गोपनीय रहेगी जब तक दूसरा पक्ष भी समीक्षा प्रस्तुत न कर दे या 14 दिनों की अवधि समाप्त न हो जाए।"
                  : "Your review is recorded. Per Section 11, it remains confidential until the other person submits theirs or the 14-day window expires."}
              </p>
            </Notice>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="small" onClick={onClose}>
                {isHindi ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <Notice variant="error">
                <strong className="block mb-1 font-semibold">
                  {isHindi ? "त्रुटि" : "Error"}
                </strong>
                <p className="text-xs">{serverError}</p>
              </Notice>
            )}

            {/* Blind Review Notice */}
            <div className="p-3 bg-warm/25 border border-rule rounded-sm text-xs text-secondary space-y-1">
              <span className="font-medium text-text block">
                {isHindi ? "अंध समीक्षा नियम (धारा 11)" : "Blind Review System (Section 11)"}
              </span>
              <p>
                {isHindi
                  ? "निष्पक्षता बनाए रखने के लिए, दोनों पक्ष एक-दूसरे की समीक्षा तब तक नहीं पढ़ सकते जब तक दोनों अपनी समीक्षा जमा न कर दें।"
                  : "Reviews are blind. Neither party sees what the other wrote until both have submitted or the 14-day window closes."}
              </p>
            </div>

            <div className="text-xs text-secondary">
              {isHindi ? "अनुभव भागीदार: " : "Reviewing: "}
              <strong className="text-text">{revieweeName}</strong>
            </div>

            {/* 3 Numerical Ratings */}
            <div className="space-y-3 p-4 border border-rule/60 rounded-sm bg-warm/10">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text block">
                  {isHindi ? "1. जैसा वर्णित था (1 से 5):" : "1. As Described (1 to 5):"}
                </label>
                {renderStarSelector("rating_as_described", ratingDescribed)}
              </div>

              <div className="space-y-1 pt-2 border-t border-rule/40">
                <label className="text-xs font-medium text-text block">
                  {isHindi ? "2. संवाद और समन्वय (1 से 5):" : "2. Communication (1 to 5):"}
                </label>
                {renderStarSelector("rating_communication", ratingComm)}
              </div>

              <div className="space-y-1 pt-2 border-t border-rule/40">
                <label className="text-xs font-medium text-text block">
                  {isHindi ? "3. सुरक्षा और सम्मान का अनुभव (1 से 5):" : "3. Felt Safe & Respected (1 to 5):"}
                </label>
                {renderStarSelector("rating_felt_safe", ratingSafe)}
              </div>
            </div>

            {/* Review Text */}
            <Field
              label={isHindi ? "सार्वजनिक समीक्षा विवरण" : "Public Feedback"}
              htmlFor="review_text"
              error={errors.review_text?.message}
              helperText={
                isHindi
                  ? `सांस्कृतिक आदान-प्रदान का प्रामाणिक विवरण दें (20 से 800 अक्षर, ${charCount}/800)`
                  : `Constructive cultural feedback (20 to 800 characters, ${charCount}/800)`
              }
            >
              <textarea
                id="review_text"
                rows={4}
                {...register("review_text")}
                placeholder={
                  isHindi
                    ? "मिथिला कला कार्यशाला अत्यंत ज्ञानवर्धक रही। प्राकृतिक रंगों के निर्माण की विधि बहुत स्पष्ट थी..."
                    : "The cultural session was respectful and deeply informative. Meeting at the village panchayat centre went very smoothly..."
                }
                className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
              />
            </Field>

            {/* Private Safety Box */}
            <Field
              label={isHindi ? "निजी सुरक्षा टिप्पणी (केवल मॉडरेटर्स के लिए)" : "Private Safety Box (Moderators Only)"}
              htmlFor="private_safety_notes"
              helperText={
                isHindi
                  ? "यह टिप्पणी दूसरे व्यक्ति को कभी नहीं दिखाई जाएगी। केवल हमारी सुरक्षा टीम इसे पढ़ सकेगी।"
                  : "Strictly confidential. Never shown to the other person; accessible only to moderators."
              }
            >
              <textarea
                id="private_safety_notes"
                rows={2}
                {...register("private_safety_notes")}
                placeholder={
                  isHindi
                    ? "कोई संवेदनशील बात जो केवल मॉडरेशन टीम के संज्ञान में लानी हो..."
                    : "Any private feedback or safety concerns intended solely for moderators..."
                }
                className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
              />
            </Field>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-rule">
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="small"
                disabled={isSubmitting || charCount < 20 || charCount > 800}
              >
                {isSubmitting
                  ? isHindi
                    ? "जमा किया जा रहा है..."
                    : "Submitting..."
                  : isHindi
                  ? "समीक्षा जमा करें"
                  : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
