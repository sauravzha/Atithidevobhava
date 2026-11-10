"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsentBannerProps {
  className?: string;
  lang?: "en" | "hi";
}

/**
 * Editorial Privacy & Cookie Notice.
 * Notice is informational: Atithi Devo Bhava uses NO third-party trackers,
 * NO ad pixels, and NO marketing cookies. Only secure, essential session cookies are used.
 */
export function ConsentBanner({ className, lang = "en" }: ConsentBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("adb_privacy_notice_acknowledged");
    if (!hasSeenNotice) {
      setDismissed(false);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("adb_privacy_notice_acknowledged", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  const isHindi = lang === "hi";

  return (
    <aside
      role="complementary"
      aria-label={isHindi ? "गोपनीयता सूचना" : "Privacy notice"}
      className={cn(
        "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50",
        "bg-surface border border-rule rounded-sm p-4 text-text",
        "transition-opacity duration-[120ms]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="space-y-2">
          <h2 className="font-heading font-medium text-sm text-text">
            {isHindi ? "विज्ञापन-मुक्त और ट्रैकिंग-रहित मंच" : "Zero ads. Zero tracking."}
          </h2>
          <p className="font-body text-xs text-secondary leading-relaxed">
            {isHindi
              ? "हम किसी भी तीसरे पक्ष के ट्रैकर या विज्ञापन कुकीज़ का उपयोग नहीं करते हैं। केवल सुरक्षित सत्र कुकीज़ का उपयोग किया जाता है।"
              : "We do not use third-party analytics, advertising pixels, or cross-site trackers. Only essential authentication session cookies are used."}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="tap-target px-3 py-1.5 text-xs font-medium border border-primary text-primary hover:bg-primary hover:text-white rounded-sm transition-colors duration-[120ms]"
            >
              {isHindi ? "समझ गया" : "Understood"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

