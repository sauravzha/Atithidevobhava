"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, MapPin, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";

interface StoryModalProps {
  buttonText?: string;
  className?: string;
}

/**
 * Story Modal displaying the cultural story of the Mithila region pilot.
 * Opens an accessible overlay with artisan photographs, oral heritage quotes, and background.
 */
export function StoryModal({ buttonText, className }: StoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isHindi = locale === "hi";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "inline-flex items-center justify-center gap-2 px-5 py-3 border border-rule hover:border-forest text-text bg-surface/80 hover:bg-surface rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-sm"}
        aria-haspopup="dialog"
      >
        <Play className="w-3.5 h-3.5 text-forest fill-forest/20" strokeWidth={2} />
        <span>{buttonText || (isHindi ? "कहानी देखें" : "Watch Story")}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface border border-rule rounded-sm shadow-xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image Header */}
            <div className="relative h-56 sm:h-64 w-full bg-charcoal overflow-hidden">
              <Image
                src="/images/hero-artisan.jpg"
                alt="Mithila artisan creating traditional folk painting"
                fill
                className="object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                className="absolute top-3 right-3 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-forest text-[11px] font-medium rounded-full mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>Jitwarpur Village, Madhubani</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-medium">
                  {isHindi
                    ? "जितवारपुर की जीवित परंपरा: दीवारों से कागज़ तक"
                    : "The Living Walls of Jitwarpur: Mithila Folk Traditions"}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="font-heading text-sm sm:text-base text-text leading-relaxed italic border-l-2 border-terracotta pl-3">
                {isHindi
                  ? "“हमारी कला केवल चित्र नहीं है, यह हमारी प्रार्थना, हमारे उत्सव और हमारी मिट्टी की पहचान है।”"
                  : "“Our painting is not merely decoration. It is our prayer, our seasonal celebration, and our connection to the earth.”"}
              </p>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {isHindi
                  ? "उत्तरी बिहार के जितवारपुर और रांटी गांवों में, हर घर की महिलाएं सदियों से प्राकृतिक वनस्पति रंगों — हल्दी, कत्था, नील और मदार के दूध — से कोहबर और अरिपन बनाती आई हैं। अतिथि देवो भवः के माध्यम से, आप इन कलाकारों के घरों में बैठकर सीधे इस कला को सीख सकते हैं।"
                  : "In the artisan hamlets of Jitwarpur and Ranti in Northern Bihar, women have passed down wall mural traditions across generations using pigments extracted from turmeric, soot, indigo, and forest leaves. Through Atithi Devo Bhava, visitors sit alongside practitioner families in their courtyards to learn these techniques directly."}
              </p>

              <div className="p-3.5 bg-warm/30 border border-rule rounded-sm flex items-start gap-2.5 text-xs text-text">
                <Sparkles className="w-4 h-4 text-terracotta shrink-0 mt-0.5" strokeWidth={1.75} />
                <p>
                  {isHindi
                    ? "प्रत्येक अनुभव में प्रत्यक्ष सामग्री, पारंपरिक चाय, और स्थानीय कारीगर परिवारों के लिए सीधा पारिश्रमिक शामिल है।"
                    : "Every local experience provides hands-on natural materials, home-brewed tea, and direct economic compensation for local artisan households."}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {isHindi ? "समझ गया" : "Close Story"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
