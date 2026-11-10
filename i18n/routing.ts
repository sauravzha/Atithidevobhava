import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Supported languages: English (default) and Hindi
  locales: ["en", "hi"],
  defaultLocale: "en",
  localePrefix: "as-needed", // English default at '/', Hindi at '/hi'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
