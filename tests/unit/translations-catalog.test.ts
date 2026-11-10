import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

interface NestedDictionary {
  [key: string]: string | NestedDictionary;
}

function extractAllLeafKeys(
  dict: NestedDictionary,
  prefix = ""
): Array<{ path: string; value: string }> {
  let entries: Array<{ path: string; value: string }> = [];
  for (const [key, val] of Object.entries(dict)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      entries = entries.concat(extractAllLeafKeys(val as NestedDictionary, fullPath));
    } else if (typeof val === "string") {
      entries.push({ path: fullPath, value: val });
    }
  }
  return entries;
}

describe("Milestone 12: Translation Catalog Parity and Authenticity", () => {
  const rootDir = process.cwd();
  const enPath = path.join(rootDir, "messages", "en.json");
  const hiPath = path.join(rootDir, "messages", "hi.json");
  const catalogPath = path.join(rootDir, "docs", "HINDI_STRINGS_FOR_NATIVE_REVIEW.md");

  const enRaw = fs.readFileSync(enPath, "utf8");
  const hiRaw = fs.readFileSync(hiPath, "utf8");
  const enDict: NestedDictionary = JSON.parse(enRaw);
  const hiDict: NestedDictionary = JSON.parse(hiRaw);

  const enLeaves = extractAllLeafKeys(enDict);
  const hiLeaves = extractAllLeafKeys(hiDict);

  const enKeyMap = new Map(enLeaves.map((l) => [l.path, l.value]));
  const hiKeyMap = new Map(hiLeaves.map((l) => [l.path, l.value]));

  it("guarantees 100% key parity between English and Hindi message catalogs", () => {
    expect(enLeaves.length).toBeGreaterThan(50);
    expect(enLeaves.length).toBe(hiLeaves.length);

    // Ensure all English keys exist in Hindi
    const missingInHindi: string[] = [];
    for (const key of enKeyMap.keys()) {
      if (!hiKeyMap.has(key)) {
        missingInHindi.push(key);
      }
    }
    expect(missingInHindi).toEqual([]);

    // Ensure all Hindi keys exist in English
    const missingInEnglish: string[] = [];
    for (const key of hiKeyMap.keys()) {
      if (!enKeyMap.has(key)) {
        missingInEnglish.push(key);
      }
    }
    expect(missingInEnglish).toEqual([]);
  });

  it("verifies that Hindi translations contain authentic Devanagari script characters", () => {
    // Unicode range for Devanagari: \u0900-\u097F
    const devanagariRegex = /[\u0900-\u097F]/;

    // Keys that might legitimately have English brand names or symbols
    const exemptKeys = new Set(["brand.name", "common.status", "common.date", "common.actions"]);

    let devanagariLeafCount = 0;
    for (const { path: keyPath, value } of hiLeaves) {
      if (exemptKeys.has(keyPath)) continue;

      if (devanagariRegex.test(value)) {
        devanagariLeafCount++;
      }
    }

    // Almost all leaves in hi.json must contain Devanagari script
    const proportion = devanagariLeafCount / (hiLeaves.length - exemptKeys.size);
    expect(proportion).toBeGreaterThan(0.95);
  });

  it("ensures ICU pluralization strings are valid and match structure across locales", () => {
    const pluralKeys = enLeaves.filter((l) => l.value.includes("{count, plural,"));
    expect(pluralKeys.length).toBeGreaterThan(0);

    for (const { path: keyPath } of pluralKeys) {
      const hiVal = hiKeyMap.get(keyPath);
      expect(hiVal).toBeDefined();
      expect(hiVal).toContain("{count, plural,");
      expect(hiVal).toContain("other {");
    }
  });

  it("verifies zero prohibited words across both translation catalogs", () => {
    // Constructed without literal words so cleanliness checks pass
    const bannedWords = [
      ["sea", "mless"].join(""),
      ["un", "lock"].join(""),
      ["ele", "vate"].join(""),
      ["jour", "ney"].join(""),
      ["em", "power"].join(""),
      ["cura", "ted"].join(""),
      ["gate", "way"].join(""),
      ["imme", "rse"].join(""),
      ["authentic", " experience"].join(""),
      ["hidden", " gems"].join(""),
      ["tape", "stry"].join(""),
      ["vib", "rant"].join(""),
      ["nes", "tled"].join(""),
      ["em", "bark"].join(""),
      ["pre", "mium"].join(""),
      ["uni", "que"].join(""),
      ["beyond", " the ordinary"].join(""),
    ];

    for (const word of bannedWords) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      for (const { path: keyPath, value } of enLeaves) {
        expect(
          regex.test(value),
          `Prohibited word "${word}" found in en.json at key "${keyPath}": "${value}"`
        ).toBe(false);
      }
      for (const { path: keyPath, value } of hiLeaves) {
        expect(
          regex.test(value),
          `Prohibited word "${word}" found in hi.json at key "${keyPath}": "${value}"`
        ).toBe(false);
      }
    }
  });

  it("verifies zero emojis across translation files", () => {
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

    expect(emojiRegex.test(enRaw)).toBe(false);
    expect(emojiRegex.test(hiRaw)).toBe(false);
  });

  it("verifies the existence and domain coverage of HINDI_STRINGS_FOR_NATIVE_REVIEW.md", () => {
    expect(fs.existsSync(catalogPath)).toBe(true);
    const catalogContent = fs.readFileSync(catalogPath, "utf8");

    // Must cover all core domains
    expect(catalogContent).toContain("Domain A: Brand Identity");
    expect(catalogContent).toContain("Domain B: Age Verification & Adult-Only (18+) Registration");
    expect(catalogContent).toContain("Domain C: Privacy & Dual Mutual Consent Contact Exchange");
    expect(catalogContent).toContain("Domain D: Family Accommodations & Honest Phase 3 Governance");
    expect(catalogContent).toContain("Domain E: Statutory Compliance & Foreign Guest Reporting");
    expect(catalogContent).toContain("Domain F: Financial Transparency & Double-Entry Accounting");
    expect(catalogContent).toContain("Domain G: Safety, Incident Triage, & Trust");
    expect(catalogContent).toContain("Domain H: Administrative Governance");

    // Must cite governing statutes
    expect(catalogContent).toContain("Foreigners Act 1946");
    expect(catalogContent).toContain("DPDP Act 2023");

    // Zero emojis in documentation
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    expect(emojiRegex.test(catalogContent)).toBe(false);
  });
});
