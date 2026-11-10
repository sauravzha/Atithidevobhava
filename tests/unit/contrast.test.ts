import { describe, it, expect } from "vitest";
import {
  calculateContrastRatio,
  getFullContrastAudit,
  evaluateColorPair,
} from "@/lib/contrast";

describe("WCAG 2.2 AA Contrast Ratio Engine", () => {
  it("calculates black on white as 21:1", () => {
    const ratio = calculateContrastRatio("#000000", "#FFFFFF");
    expect(Math.round(ratio)).toBe(21);
  });

  it("calculates identical colors as 1:1", () => {
    const ratio = calculateContrastRatio("#F7F5F0", "#F7F5F0");
    expect(Math.round(ratio)).toBe(1);
  });

  it("proves body text (#252723) on page (#F7F5F0) exceeds WCAG AA 4.5:1 requirement", () => {
    const result = evaluateColorPair(
      "Body on Page",
      "Charcoal",
      "#252723",
      "Ivory",
      "#F7F5F0",
      "light"
    );
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.normalTextPass).toBe(true);
  });

  it("proves secondary text (#66655F) on page (#F7F5F0) passes WCAG AA 4.5:1 requirement", () => {
    const result = evaluateColorPair(
      "Secondary Text on Page",
      "Secondary Text",
      "#66655F",
      "Ivory",
      "#F7F5F0",
      "light"
    );
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.normalTextPass).toBe(true);
  });

  it("proves dark mode body text (#ECE9E2) on dark paper (#141613) exceeds WCAG AA 4.5:1", () => {
    const result = evaluateColorPair(
      "Dark Body on Paper",
      "Text Light",
      "#ECE9E2",
      "Paper Dark",
      "#141613",
      "dark"
    );
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.normalTextPass).toBe(true);
  });

  it("proves dark mode secondary text (#A8A69D) on dark paper (#141613) exceeds WCAG AA 4.5:1", () => {
    const result = evaluateColorPair(
      "Dark Secondary on Paper",
      "Secondary Light",
      "#A8A69D",
      "Paper Dark",
      "#141613",
      "dark"
    );
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.normalTextPass).toBe(true);
  });

  it("validates that all documented text and interactive UI pairs pass WCAG AA requirements", () => {
    const audit = getFullContrastAudit();
    expect(audit.length).toBeGreaterThan(0);

    for (const pair of audit) {
      if (pair.category === "normal-text") {
        // Normal text requires minimum 4.5:1
        expect(pair.ratio).toBeGreaterThanOrEqual(4.5);
        expect(pair.normalTextPass).toBe(true);
      } else if (pair.category === "large-text-ui") {
        // Large text and active UI components require minimum 3.0:1
        expect(pair.ratio).toBeGreaterThanOrEqual(3.0);
        expect(pair.uiComponentPass).toBe(true);
      }
    }
  });
});
