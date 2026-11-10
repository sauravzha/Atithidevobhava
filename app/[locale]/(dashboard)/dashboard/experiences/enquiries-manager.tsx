"use client";

import { useState } from "react";
import Link from "next/link";
import { respondToExperienceEnquiryAction } from "@/app/actions/experiences";
import { Button } from "@/components/ui/button";
import { StatusLabel } from "@/components/ui/status-label";
import { Notice } from "@/components/ui/notice";
import {
  Calendar,
  Users,
  MessageSquare,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

interface EnquiryItem {
  id: string;
  experienceId: string;
  experienceTitleEn: string;
  experienceTitleHi: string;
  travellerName: string;
  travellerResidence: string;
  participantCount: number;
  proposedDate: string;
  preferredLanguage: string;
  message: string;
  status: "pending" | "accepted" | "cancelled";
  createdAt: string;
}

interface EnquiriesManagerProps {
  initialEnquiries: EnquiryItem[];
  locale: string;
}

export function EnquiriesManager({
  initialEnquiries,
  locale,
}: EnquiriesManagerProps) {
  const isHindi = locale === "hi";
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRespond = async (
    bookingId: string,
    decision: "accept" | "decline"
  ) => {
    setProcessingId(bookingId);
    setActionError(null);
    setActionSuccess(null);

    const result = await respondToExperienceEnquiryAction({
      booking_id: bookingId,
      decision,
      response_message:
        decision === "accept"
          ? isHindi
            ? "नमस्ते, आपकी पूछताछ स्वीकार कर ली गई है। आइए मिलकर नागरिक मिलन स्थल और समय तय करें।"
            : "Greetings, your cultural enquiry is accepted. Let us coordinate the public meeting time and details."
          : isHindi
          ? "इस तिथि पर सत्र आयोजित करने में असमर्थ हैं।"
          : "Unable to host this requested session on the proposed date.",
    });

    setProcessingId(null);

    if (result.success) {
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === bookingId
            ? { ...item, status: decision === "accept" ? "accepted" : "cancelled" }
            : item
        )
      );
      setActionSuccess(
        decision === "accept"
          ? isHindi
            ? "पूछताछ स्वीकार कर ली गई। यात्री के साथ सुरक्षित चैट शुरू हो गई है।"
            : "Enquiry accepted. You may now message the traveler directly."
          : isHindi
          ? "पूछताछ अस्वीकार कर दी गई।"
          : "Enquiry politely declined."
      );
    } else {
      setActionError(result.error || "Failed to process enquiry response");
    }
  };

  return (
    <div className="space-y-4">
      {actionSuccess && (
        <Notice variant="default">
          <strong className="block mb-1 font-semibold">
            {isHindi ? "सफलता" : "Action Completed"}
          </strong>
          <p className="text-xs">{actionSuccess}</p>
        </Notice>
      )}

      {actionError && (
        <Notice variant="error">
          <strong className="block mb-1 font-semibold">
            {isHindi ? "त्रुटि" : "Action Failed"}
          </strong>
          <p className="text-xs">{actionError}</p>
        </Notice>
      )}

      {enquiries.length === 0 ? (
        <div className="p-8 border border-dashed border-rule rounded-sm text-center">
          <p className="text-xs text-secondary">
            {isHindi
              ? "अभी कोई नई सांस्कृतिक पूछताछ प्राप्त नहीं हुई है।"
              : "No cultural enquiries received at this time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const isPending = enq.status === "pending";
            const isAccepted = enq.status === "accepted";

            const statusText =
              enq.status === "accepted"
                ? isHindi
                  ? "स्वीकृत"
                  : "Accepted"
                : enq.status === "pending"
                ? isHindi
                  ? "समीक्षाधीन"
                  : "Pending"
                : isHindi
                ? "रद्द"
                : "Cancelled";

            const statusVariant =
              enq.status === "accepted"
                ? ("success" as const)
                : enq.status === "pending"
                ? ("warning" as const)
                : ("error" as const);

            return (
              <div
                key={enq.id}
                className="p-5 border border-rule rounded-sm bg-page space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule/60 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs text-secondary font-medium">
                      {isHindi ? enq.experienceTitleHi : enq.experienceTitleEn}
                    </span>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-medium text-text">
                        {enq.travellerName}
                      </h3>
                      <span className="text-xs text-secondary">
                        ({enq.travellerResidence})
                      </span>
                    </div>
                  </div>

                  <StatusLabel status={statusText} variant={statusVariant} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} strokeWidth={1.5} className="text-primary" />
                    {isHindi ? "प्रस्तावित तिथि: " : "Requested: "}
                    <strong className="text-text font-medium">{enq.proposedDate}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users size={13} strokeWidth={1.5} className="text-primary" />
                    {enq.participantCount} {isHindi ? "व्यक्ति" : "people"}
                  </span>
                  <span>•</span>
                  <span>
                    {isHindi ? "पसंदीदा भाषा: " : "Language: "}
                    <span className="text-text font-medium">{enq.preferredLanguage}</span>
                  </span>
                </div>

                <div className="p-3 bg-warm/20 border border-rule/60 rounded-sm text-xs text-text leading-relaxed">
                  <strong className="font-semibold text-secondary block text-[11px] uppercase tracking-wider mb-1">
                    {isHindi ? "यात्री का संदेश: " : "Traveler Message: "}
                  </strong>
                  &ldquo;{enq.message}&rdquo;
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                    <ShieldCheck size={13} strokeWidth={1.5} className="text-forest" />
                    <span>
                      {isHindi
                        ? "सार्वजनिक मिलन स्थल नियम लागू"
                        : "Public civic meeting rule enforced"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <Button
                          variant="secondary"
                          size="small"
                          disabled={processingId === enq.id}
                          onClick={() => handleRespond(enq.id, "decline")}
                        >
                          <X size={12} strokeWidth={1.5} className="mr-1 text-terracotta" />
                          <span>{isHindi ? "अस्वीकार करें" : "Decline"}</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="small"
                          disabled={processingId === enq.id}
                          onClick={() => handleRespond(enq.id, "accept")}
                        >
                          <Check size={12} strokeWidth={1.5} className="mr-1" />
                          <span>{isHindi ? "पूछताछ स्वीकार करें" : "Accept Enquiry"}</span>
                        </Button>
                      </>
                    ) : isAccepted ? (
                      <Link
                        href={`/connections`}
                        className="tap-target px-3 py-1.5 bg-forest text-white rounded-sm text-xs font-medium inline-flex items-center gap-1.5 hover:bg-forest/90 transition-colors"
                      >
                        <MessageSquare size={13} strokeWidth={1.5} />
                        <span>{isHindi ? "संदेश भेजें" : "Message Traveler"}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-secondary italic">
                        {isHindi ? "यह पूछताछ बंद कर दी गई है" : "Enquiry closed"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
