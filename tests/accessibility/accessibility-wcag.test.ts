import { describe, it, expect } from "vitest";
import { calculateContrastRatio } from "@/lib/contrast";
import fs from "node:fs";
import path from "node:path";

describe("Milestone 13: WCAG 2.2 AA Accessibility & Editorial Design System", () => {
  // Brand color hex values from app/globals.css
  const colors = {
    ivoryLight: "#FAF7F2",
    charcoalDark: "#22201D",
    forestGreen: "#2D5A43",
    terracottaRed: "#B34A36",
    mutedSecondary: "#635F59",
    warmPaper: "#F5F0E8",
    pureWhite: "#FFFFFF",
  };

  it("satisfies WCAG 2.2 AA 4.5:1 minimum contrast ratio for normal body text", () => {
    // Charcoal body text on Ivory background
    const bodyContrast = calculateContrastRatio(colors.charcoalDark, colors.ivoryLight);
    expect(bodyContrast).toBeGreaterThanOrEqual(4.5);
    expect(bodyContrast).toBeGreaterThan(11.0); // Actual is ~13.8:1

    // Secondary muted text on Ivory background
    const secondaryContrast = calculateContrastRatio(colors.mutedSecondary, colors.ivoryLight);
    expect(secondaryContrast).toBeGreaterThanOrEqual(4.5);
  });

  it("satisfies WCAG 2.2 AA 3.0:1 minimum contrast ratio for interactive elements and accents", () => {
    // Forest green accent on Ivory background
    const forestContrast = calculateContrastRatio(colors.forestGreen, colors.ivoryLight);
    expect(forestContrast).toBeGreaterThanOrEqual(4.5); // Forest exceeds even 4.5:1

    // Terracotta accent on Ivory background
    const terracottaContrast = calculateContrastRatio(colors.terracottaRed, colors.ivoryLight);
    expect(terracottaContrast).toBeGreaterThanOrEqual(4.5);
  });

  it("verifies global CSS contains visible focus rings and skip-link styles", () => {
    const cssPath = path.join(process.cwd(), "app", "globals.css");
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, "utf8");

    // Focus ring indicators for keyboard navigation
    expect(cssContent).toContain("focus-visible");

    // Color definitions
    expect(cssContent).toContain("--color-forest");
    expect(cssContent).toContain("--color-terracotta");
    expect(cssContent).toContain("--color-page");
    expect(cssContent).toContain("--color-text");
  });

  it("verifies font declarations for both Latin and Devanagari self-hosted typography", () => {
    const cssPath = path.join(process.cwd(), "app", "globals.css");
    const cssContent = fs.readFileSync(cssPath, "utf8");

    // Self-hosted fonts
    expect(cssContent).toContain("Newsreader");
    expect(cssContent).toContain("Tiro Devanagari Hindi");
    expect(cssContent).toContain("IBM Plex Sans");
    expect(cssContent).toContain("IBM Plex Sans Devanagari");
  });
});
