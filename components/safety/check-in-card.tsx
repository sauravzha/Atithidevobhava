"use client";

import { useState } from "react";
import { submitSafetyCheckInAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ShieldCheck, AlertOctagon, Check } from "lucide-react";

interface CheckInCardProps {
  connectionId?: string;
  bookingId?: string;
  promptType: "arrival_start" | "departure_end";
  locale: string;
}

export function SafetyCheckInCard({
  connectionId,
  bookingId,
  promptType,
  locale,
}: CheckInCardProps) {
  const isHindi = locale === "hi";
  const [status, setStatus] = useState<"pending" | "safe" | "need_help">("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCheckIn = async (selectedStatus: "safe" | "need_help") => {
    setIsSubmitting(true);
    setMessage(null);

    const result = await submitSafetyCheckInAction({
      connection_id: connectionId,
      booking_id: bookingId,
      prompt_type: promptType,
      status: selectedStatus,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStatus(selectedStatus);
      if (selectedStatus === "safe") {
        setMessage(
          isHindi
            ? "सुरक्षित आगमन दर्ज किया गया। आपकी यात्रा सुखद हो!"
            : "Safe arrival recorded. Have a wonderful cultural exchange!"
        );
      } else {
        setMessage(
          isHindi
            ? "आपातकालीन सुरक्षा अलर्ट हमारी ऑन-ड्यूटी मॉडरेशन टीम को भेज दिया गया है।"
            : "Urgent safety alert dispatched to our on-duty moderation team."
        );
      }
    } else {
      setMessage(result.error || "Failed to record check-in");
    }
  };

  return (
    <div className="p-4 border border-rule rounded-sm bg-warm/20 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} strokeWidth={1.5} className="text-primary" />
        <h3 className="font-heading text-sm font-medium text-text">
          {promptType === "arrival_start"
            ? isHindi
              ? "सुरक्षा चेक-इन: क्या आप बैठक स्थल पर सुरक्षित पहुँच गए हैं?"
              : "Safety Check-In: Have you arrived safely at the public meeting venue?"
            : isHindi
            ? "सुरक्षा चेक-इन: क्या सत्र शांतिपूर्वक संपन्न हो गया है?"
            : "Safety Check-In: Has your session concluded safely?"}
        </h3>
      </div>

      {status === "pending" ? (
        <div className="space-y-2">
          <p className="text-xs text-secondary leading-relaxed">
            {isHindi
              ? "आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। कृपया अपनी स्थिति की पुष्टि करें।"
              : "Your safety is our core priority. Please confirm your status upon reaching the public venue."}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={() => handleCheckIn("safe")}
              disabled={isSubmitting}
            >
              <Check size={13} strokeWidth={1.5} className="mr-1" />
              <span>{isHindi ? "मैं सुरक्षित पहुँच गया/गई हूँ" : "I Arrived Safely"}</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => handleCheckIn("need_help")}
              disabled={isSubmitting}
              className="text-terracotta border-terracotta/40 hover:bg-terracotta/10"
            >
              <AlertOctagon size={13} strokeWidth={1.5} className="mr-1" />
              <span>{isHindi ? "मुझे सहायता चाहिए" : "I Need Help"}</span>
            </Button>
          </div>
        </div>
      ) : (
        <Notice variant={status === "safe" ? "default" : "error"}>
          <p className="text-xs">{message}</p>
        </Notice>
      )}
    </div>
  );
}
