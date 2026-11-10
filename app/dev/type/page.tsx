"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";

type ViewportWidth = "320px" | "768px" | "1280px" | "100%";

export default function TypographyDevPage() {
  const [selectedWidth, setSelectedWidth] = useState<ViewportWidth>("100%");
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="site-container py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-rule gap-4">
        <div>
          <Link
            href="/"
            className="text-xs font-medium text-secondary hover:text-text transition-colors duration-[120ms] mb-2 inline-block"
          >
            ← Back to Home / मुख्य पृष्ठ पर वापस जाएं
          </Link>
          <Bi
            hindi="टाइपोग्राफी और देवनागरी परीक्षण"
            english="Typography & Devanagari Baseline Verification (/dev/type)"
            as="h1"
          />
        </div>

        {/* Viewport Width and Theme Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border border-rule rounded-sm p-0.5 bg-surface text-xs font-medium">
            {(["320px", "768px", "1280px", "100%"] as ViewportWidth[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWidth(w)}
                className={`tap-target px-2.5 py-1 rounded-sm transition-colors duration-[120ms] ${
                  selectedWidth === w
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-text"
                }`}
              >
                {w === "100%" ? "Fluid" : w}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="tap-target px-3 py-1.5 border border-rule hover:border-secondary rounded-sm text-xs font-medium text-text bg-surface transition-colors duration-[120ms]"
          >
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>

      {/* Responsive Viewport Wrapper */}
      <div
        className="mx-auto transition-all duration-[120ms] border border-dashed border-rule p-4 sm:p-8 bg-page"
        style={{ maxWidth: selectedWidth }}
      >
        <div className="mb-6 pb-2 border-b border-rule flex items-center justify-between text-xs text-secondary font-mono">
          <span>Active Test Width: {selectedWidth}</span>
          <span>Baseline Grid: 4px | Line Heights: 1.4 (HI) / 1.25 (EN)</span>
        </div>

        {/* Section 1: Complex Devanagari Conjuncts */}
        <section className="mb-12">
          <h2 className="font-heading font-medium text-xl text-text mb-2">
            1. Complex Devanagari Conjuncts (संयुक्त व्यंजन)
          </h2>
          <p className="font-body text-xs text-secondary mb-4 max-w-prose">
            Verification of glyph ligature rendering, half-forms, vowel attachment, and non-overlap for critical Hindi conjuncts:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { conjunct: "क्ष", name: "ksha", word: "क्षमा (Forgiveness)" },
              { conjunct: "त्र", name: "tra", word: "यात्रा (Journey)" },
              { conjunct: "ज्ञ", name: "gya", word: "ज्ञान (Knowledge)" },
              { conjunct: "श्र", name: "shra", word: "श्रद्धा (Respect)" },
              { conjunct: "द्ध", name: "ddha", word: "प्रसिद्ध (Famous)" },
              { conjunct: "द्व", name: "dva", word: "द्वार (Doorway)" },
              { conjunct: "ष्ट्र", name: "shtra", word: "राष्ट्र (Nation)" },
              { conjunct: "क्र", name: "kra", word: "क्रम (Order)" },
              { conjunct: "र्क", name: "rka", word: "तर्क (Logic)" },
              { conjunct: "त्र्य", name: "trya", word: "त्र्यंबक (Tryambak)" },
            ].map((item) => (
              <div
                key={item.conjunct}
                className="border border-rule p-3 rounded-sm bg-surface text-center"
              >
                <div lang="hi" className="font-heading text-3xl font-medium text-primary mb-1">
                  {item.conjunct}
                </div>
                <div className="font-mono text-xs text-secondary mb-1">
                  {item.name}
                </div>
                <div lang="hi" className="font-body text-xs text-text">
                  {item.word}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Matras and Vowel Diacritics */}
        <section className="mb-12">
          <h2 className="font-heading font-medium text-xl text-text mb-2">
            2. Matras and Diacritics Alignment (मात्राएं और स्वर चिह्न)
          </h2>
          <p className="font-body text-xs text-secondary mb-4 max-w-prose">
            Testing vertical clearance, diacritic stacking, and clipping avoidance for top and bottom matras:
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "क", "का", "कि", "की", "कु", "कू", "कृ", "के", "कै", "को", "कौ", "कं", "कः", "कँ"
            ].map((glyph) => (
              <span
                key={glyph}
                lang="hi"
                className="inline-flex items-center justify-center w-12 h-14 border border-rule bg-surface font-heading text-2xl font-medium text-text rounded-sm"
              >
                {glyph}
              </span>
            ))}
          </div>
        </section>

        {/* Section 3: Numerals (Devanagari & Latin) */}
        <section className="mb-12">
          <h2 className="font-heading font-medium text-xl text-text mb-2">
            3. Numerals Verification (अंक प्रणाली)
          </h2>
          <p className="font-body text-xs text-secondary mb-4 max-w-prose">
            Standardization of Hindi Devanagari numerals alongside Arabic/Latin digits:
          </p>

          <div className="grid grid-cols-10 gap-1 sm:gap-2 text-center">
            {["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"].map((d, idx) => (
              <div key={idx} className="border border-rule p-2 rounded-sm bg-surface">
                <div lang="hi" className="font-heading text-xl font-medium text-text">
                  {d}
                </div>
                <div className="font-mono text-xs text-secondary">
                  {idx}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Mixed Hindi and English Baselines */}
        <section className="mb-12">
          <h2 className="font-heading font-medium text-xl text-text mb-2">
            4. Mixed Hindi and English Baselines (मिश्रित आधार रेखा)
          </h2>
          <p className="font-body text-xs text-secondary mb-4 max-w-prose">
            Hindi body is sized 6% larger than Latin to equalize perceived x-heights. Both scripts share common baselines without vertical jitter:
          </p>

          <div className="space-y-6">
            <div className="border border-rule p-4 rounded-sm bg-surface">
              <span className="block text-xs font-mono text-secondary mb-1">
                Heading 1 (h1 font-heading 500)
              </span>
              <h1 className="font-heading font-medium text-2xl sm:text-3xl text-text">
                <span lang="hi">अतिथि देवो भव</span> — Welcome to India, welcome home.
              </h1>
            </div>

            <div className="border border-rule p-4 rounded-sm bg-surface">
              <span className="block text-xs font-mono text-secondary mb-1">
                Heading 2 (h2 font-heading 500)
              </span>
              <h2 className="font-heading font-medium text-xl sm:text-2xl text-text">
                <span lang="hi">दरभंगा और मधुबनी की सांस्कृतिक विरासत</span> — Heritage of Mithila.
              </h2>
            </div>

            <div className="border border-rule p-4 rounded-sm bg-surface">
              <span className="block text-xs font-mono text-secondary mb-1">
                Body Paragraph (font-body 400 with 66ch max line constraint)
              </span>
              <p className="font-body text-base text-text leading-relaxed max-w-prose">
                <span lang="hi">
                  मिथिला चित्रकला बिहार के मधुबनी और दरभंगा क्षेत्रों की एक प्राचीन कला परंपरा है।
                </span>{" "}
                Mithila painting is a centuries-old cultural tradition practiced across Bihar. Artists use natural pigments derived from flowers, soot, and local plants.
              </p>
            </div>

            <div className="border border-rule p-4 rounded-sm bg-surface">
              <span className="block text-xs font-mono text-secondary mb-1">
                Small UI Caption (font-body text-xs text-secondary)
              </span>
              <p className="font-body text-xs text-secondary">
                <span lang="hi">सत्यापित स्थानीय नागरिक</span> · Verified local resident · Darbhanga, Bihar · ID checked on 10 Nov 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Maximum Line Length (66 characters) */}
        <section>
          <h2 className="font-heading font-medium text-xl text-text mb-2">
            5. Maximum Line Length Enforcement (अधिकतम पंक्ति लंबाई: 66 वर्ण)
          </h2>
          <p className="font-body text-xs text-secondary mb-4">
            Spec requirement: Lines must never exceed 66 characters to maintain comfortable reading cadence.
          </p>

          <div className="border border-rule p-4 rounded-sm bg-surface">
            <p className="font-body text-base text-text max-w-prose border-r-2 border-forest pr-2 leading-relaxed">
              This sentence demonstrates the exact sixty-six character boundary marker. Beyond this width, prose wraps naturally to the next line to ensure comfortable scanning.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

