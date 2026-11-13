import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: {
        site: "1280px",
        container: "1360px",
        prose: "66ch",
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        xs: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 25px -4px rgba(89, 107, 87, 0.25)",
        "glow-terracotta": "0 0 25px -4px rgba(164, 94, 70, 0.25)",
      },
      colors: {
        /* Light palette */
        ivory: "var(--color-ivory)",
        charcoal: "var(--color-charcoal)",
        forest: "var(--color-forest)",
        "forest-hover": "var(--color-forest-hover)",
        terracotta: "var(--color-terracotta)",
        "terracotta-text": "var(--color-terracotta-text)",
        "warm-grey": "var(--color-warm-grey)",
        secondary: "var(--color-secondary)",
        error: "var(--color-error)",

        /* Semantic aliases */
        page: "var(--color-page)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-secondary)",
        rule: "var(--color-rule)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
      },
      fontFamily: {
        heading: [
          "Newsreader",
          "Tiro Devanagari Hindi",
          "Georgia",
          "serif",
        ],
        body: [
          "IBM Plex Sans",
          "IBM Plex Sans Devanagari",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        /* Hindi body is 6% larger than Latin to match x-heights */
        "body-hi": ["1.0625rem", { lineHeight: "1.65" }],
        "body-en": ["1rem", { lineHeight: "1.5" }],
      },
      lineHeight: {
        "heading-hi": "1.4",
        "heading-en": "1.25",
        "body-hi": "1.65",
        "body-en": "1.5",
      },
      spacing: {
        /* Design system spacing scale: 4, 8, 12, 16, 24, 32, 48, 72, 96 */
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "18": "72px",
        "24": "96px",
      },
      ringWidth: {
        focus: "2px",
      },
      ringOffsetWidth: {
        focus: "2px",
      },
      transitionDuration: {
        DEFAULT: "120ms",
      },
    },
  },
  plugins: [],
};

export default config;

