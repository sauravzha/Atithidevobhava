/**
 * WCAG 2.2 Relative Luminance and Contrast Ratio calculation engine.
 * Implements W3C formula: (L1 + 0.05) / (L2 + 0.05)
 */

export interface ColorPairContrast {
  pairName: string;
  foregroundName: string;
  foregroundHex: string;
  backgroundName: string;
  backgroundHex: string;
  category: "normal-text" | "large-text-ui" | "passive-rule";
  ratio: number;
  ratioFormatted: string;
  normalTextPass: boolean; // >= 4.5:1
  largeTextPass: boolean;  // >= 3.0:1
  uiComponentPass: boolean; // >= 3.0:1
  mode: "light" | "dark";
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

function sRgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function calculateRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = calculateRelativeLuminance(fgHex);
  const l2 = calculateRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluateColorPair(
  pairName: string,
  foregroundName: string,
  foregroundHex: string,
  backgroundName: string,
  backgroundHex: string,
  mode: "light" | "dark",
  category: "normal-text" | "large-text-ui" | "passive-rule" = "normal-text"
): ColorPairContrast {
  const ratio = calculateContrastRatio(foregroundHex, backgroundHex);
  const normalTextPass = ratio >= 4.5;
  const largeTextPass = ratio >= 3.0;
  const uiComponentPass = ratio >= 3.0;

  return {
    pairName,
    foregroundName,
    foregroundHex,
    backgroundName,
    backgroundHex,
    category,
    ratio: Math.round(ratio * 100) / 100,
    ratioFormatted: `${(Math.round(ratio * 100) / 100).toFixed(2)}:1`,
    normalTextPass,
    largeTextPass,
    uiComponentPass,
    mode,
  };
}

/**
 * Standard palette color definitions from Section 18 of docs/SPEC.md.
 * Note: As instructed in the spec, #66655F is used for secondary text to satisfy WCAG AA contrast.
 */
export const PALETTE_PAIRS: Array<{
  pairName: string;
  foregroundName: string;
  foregroundHex: string;
  backgroundName: string;
  backgroundHex: string;
  category: "normal-text" | "large-text-ui" | "passive-rule";
  mode: "light" | "dark";
}> = [
  // Light Mode Pairs
  {
    pairName: "Body Text on Page",
    foregroundName: "Charcoal",
    foregroundHex: "#252723",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Body Text on Surface",
    foregroundName: "Charcoal",
    foregroundHex: "#252723",
    backgroundName: "White",
    backgroundHex: "#FFFFFF",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Secondary Text on Page",
    foregroundName: "Secondary Text",
    foregroundHex: "#66655F",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Secondary Text on Surface",
    foregroundName: "Secondary Text",
    foregroundHex: "#66655F",
    backgroundName: "White",
    backgroundHex: "#FFFFFF",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Primary Forest Green on Page",
    foregroundName: "Forest Green",
    foregroundHex: "#596B57",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "White Text on Primary Button",
    foregroundName: "White",
    foregroundHex: "#FFFFFF",
    backgroundName: "Forest Green",
    backgroundHex: "#596B57",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Terracotta Text on Page",
    foregroundName: "Terracotta-Text",
    foregroundHex: "#8A4A35",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Error Text on Page",
    foregroundName: "Error Red",
    foregroundHex: "#A4332B",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "normal-text",
    mode: "light",
  },
  {
    pairName: "Passive Hairline Rule on Page",
    foregroundName: "Warm Grey (Hairline)",
    foregroundHex: "#E9E5DE",
    backgroundName: "Ivory",
    backgroundHex: "#F7F5F0",
    category: "passive-rule",
    mode: "light",
  },

  // Dark Mode Pairs
  {
    pairName: "Body Text on Paper",
    foregroundName: "Text (Off-white)",
    foregroundHex: "#ECE9E2",
    backgroundName: "Paper Dark",
    backgroundHex: "#141613",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Body Text on Dark Surface",
    foregroundName: "Text (Off-white)",
    foregroundHex: "#ECE9E2",
    backgroundName: "Dark Surface",
    backgroundHex: "#1C1E1A",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Secondary Text on Paper",
    foregroundName: "Secondary Text Dark",
    foregroundHex: "#A8A69D",
    backgroundName: "Paper Dark",
    backgroundHex: "#141613",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Dark Forest Green on Paper",
    foregroundName: "Green Light",
    foregroundHex: "#8FA88C",
    backgroundName: "Paper Dark",
    backgroundHex: "#141613",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Dark Paper on Green Button",
    foregroundName: "Paper Dark",
    foregroundHex: "#141613",
    backgroundName: "Green Light",
    backgroundHex: "#8FA88C",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Terracotta on Paper",
    foregroundName: "Terracotta Dark",
    foregroundHex: "#D08A6E",
    backgroundName: "Paper Dark",
    backgroundHex: "#141613",
    category: "normal-text",
    mode: "dark",
  },
  {
    pairName: "Error Red on Paper",
    foregroundName: "Error Red Dark",
    foregroundHex: "#E0817A",
    backgroundName: "Paper Dark",
    backgroundHex: "#141613",
    category: "normal-text",
    mode: "dark",
  },
];

export function getFullContrastAudit(): ColorPairContrast[] {
  return PALETTE_PAIRS.map((p) =>
    evaluateColorPair(
      p.pairName,
      p.foregroundName,
      p.foregroundHex,
      p.backgroundName,
      p.backgroundHex,
      p.mode,
      p.category
    )
  );
}
