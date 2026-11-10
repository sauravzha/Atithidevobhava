"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReportSchema,
  REPORT_REASONS,
  type CreateReportInput,
  type ReportReason,
} from "@/lib/validation/safety";
import { createReportAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { ShieldAlert, X } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
  targetEntity: string;
  targetId?: string;
  conversationId?: string;
  locale: string;
}

const reasonLabelsEn: Record<ReportReason, string> = {
  harassment: "Harassment, abuse, or intimidation",
  unsafe_or_threatening: "Unsafe, dangerous, or threatening behaviour",
  asked_for_money: "Requested money, wire transfer, or unauthorized fees",
  fake_profile: "Fake profile, impersonation, or deceptive credentials",
  discrimination: "Discrimination or hate speech",
  inappropriate_sexual_content: "Inappropriate sexual content or advance",
  suspected_trafficking_or_exploitation: "Suspected trafficking or commercial exploitation",
  other: "Other safety or policy violation",
};

const reasonLabelsHi: Record<ReportReason, string> = {
  harassment: "उत्पीड़न, गाली-गलौज या धमकी",
  unsafe_or_threatening: "असुरक्षित, खतरनाक या डराने वाला आचरण",
  asked_for_money: "पैसे की मांग या अनधिकृत शुल्क",
  fake_profile: "नकली प्रोफ़ाइल या पहचान छिपाना",
  discrimination: "भेदभाव या नफरत भरा भाषण",
  inappropriate_sexual_content: "अनुचित यौन सामग्री या प्रस्ताव",
  suspected_trafficking_or_exploitation: "तस्करी या शोषण का संदेह",
  other: "अन्य सुरक्षा या नीति उल्लंघन",
};

export function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  targetEntity,
  targetId,
  conversationId,
  locale,
}: ReportModalProps) {
  const isHindi = locale === "hi";
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateReportInput>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      reported_user_id: reportedUserId,
      reason: "unsafe_or_threatening",
      details: "",
      target_entity: targetEntity,
      target_id: targetId,
      conversation_id: conversationId,
    },
  });

  const detailsText = watch("details") || "";

  if (!isOpen) return null;

  const onSubmit = async (data: CreateReportInput) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await createReportAction(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      reset();
    } else {
      setServerError(result.error || "Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-page border border-rule rounded-sm max-w-lg w-full p-6 space-y-5 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} strokeWidth={1.5} className="text-terracotta" />
            <h2 className="font-heading text-lg font-medium text-text">
              {isHindi ? "सुरक्षा या आचरण रिपोर्ट दर्ज करें" : "File a Safety Report"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-text transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <Notice variant="default">
              <strong className="block mb-1 font-semibold text-text">
                {isHindi ? "रिपोर्ट सफलतापूर्वक प्राप्त हुई" : "Report Successfully Received"}
              </strong>
              <p className="text-xs leading-relaxed">
                {isHindi
                  ? "आपकी रिपोर्ट हमारी सुरक्षा एवं मॉडरेशन टीम को भेज दी गई है। आपकी पहचान पूरी तरह गोपनीय रखी जाएगी।"
                  : "Your report has been forwarded to our moderation team for review. Your identity remains strictly confidential."}
              </p>
            </Notice>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="small" onClick={onClose}>
                {isHindi ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Notice variant="error">
                <strong className="block mb-1 font-semibold">
                  {isHindi ? "त्रुटि" : "Error"}
                </strong>
                <p className="text-xs">{serverError}</p>
              </Notice>
            )}

            <div className="text-xs text-secondary bg-warm/20 p-3 rounded-sm border border-rule">
              <span className="font-medium text-text block mb-1">
                {isHindi ? "गोपनीयता आश्वासन" : "Strict Reporter Confidentiality"}
              </span>
              {isHindi
                ? "धारा 12: रिपोर्टर की पहचान रिपोर्ट किए गए व्यक्ति को कभी नहीं बताई जाती।"
                : "Section 12: Your identity is strictly withheld from the reported individual."}
              {conversationId && (
                <span className="block mt-1 text-primary">
                  {isHindi
                    ? "जांच हेतु इस चैट के पिछले 20 संदेशों का स्नैपशॉट स्वचालित रूप से संलग्न किया जाएगा।"
                    : "A snapshot of the latest 20 messages will be automatically attached for moderator investigation."}
                </span>
              )}
            </div>

            <div className="text-xs text-secondary">
              {isHindi ? "रिपोर्ट की जा रही प्रोफ़ाइल: " : "Reporting: "}
              <strong className="text-text">{reportedUserName}</strong>
            </div>

            {/* Reason */}
            <Field
              label={isHindi ? "रिपोर्ट का कारण" : "Reason for Report"}
              htmlFor="report_reason"
              error={errors.reason?.message}
            >
              <select
                id="report_reason"
                {...register("reason")}
                className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {isHindi ? reasonLabelsHi[r] : reasonLabelsEn[r]}
                  </option>
                ))}
              </select>
            </Field>

            {/* Details */}
            <Field
              label={isHindi ? "विस्तृत विवरण" : "Details of Incident"}
              htmlFor="report_details"
              error={errors.details?.message}
              helperText={
                isHindi
                  ? `घटना और संदर्भ का स्पष्ट विवरण दें (न्यूनतम 10 अक्षर, ${detailsText.length}/2000)`
                  : `Please detail what occurred and the context (minimum 10 characters, ${detailsText.length}/2000)`
              }
            >
              <textarea
                id="report_details"
                rows={4}
                {...register("details")}
                placeholder={
                  isHindi
                    ? "कृपया विस्तार से बताएं कि क्या हुआ..."
                    : "Please describe what took place, including any statements or conduct..."
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
                disabled={isSubmitting || detailsText.length < 10}
              >
                {isSubmitting
                  ? isHindi
                    ? "दर्ज किया जा रहा है..."
                    : "Filing Report..."
                  : isHindi
                  ? "रिपोर्ट दर्ज करें"
                  : "Submit Safety Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
