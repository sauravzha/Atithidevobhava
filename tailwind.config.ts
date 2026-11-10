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
    /* Override default max-width to editorial grid width */
    maxWidth: {
      none: "none",
      full: "100%",
      site: "1120px",
    },
    /* Override default border radius to 3px editorial flat */
    borderRadius: {
      none: "0",
      sm: "3px",
      DEFAULT: "3px",
      lg: "3px",
    },
    extend: {
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
      maxWidth: {
        prose: "66ch",
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

