import * as React from "react";
import { cn } from "@/lib/utils";

export type BiProps = {
  hindi: string;
  english: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

/* Size pairings: Hindi line gets the heading size, English sits below at a smaller scale */
const sizeMap: Record<NonNullable<BiProps["as"]>, { hindi: string; english: string }> = {
  h1: { hindi: "text-4xl", english: "text-xl" },
  h2: { hindi: "text-3xl", english: "text-lg" },
  h3: { hindi: "text-2xl", english: "text-base" },
  h4: { hindi: "text-xl", english: "text-sm" },
};

/**
 * Bilingual heading -- Hindi first, English beneath in a single semantic heading element.
 * The `lang` attribute on the Hindi span lets screen readers switch pronunciation.
 */
export function Bi({ hindi, english, as: Tag = "h2", className }: BiProps) {
  const sizes = sizeMap[Tag];

  return (
    <Tag className={cn("font-heading leading-tight", className)}>
      <span lang="hi" className={cn(sizes.hindi, "block")}>
        {hindi}
      </span>
      <span className={cn(sizes.english, "block font-heading text-secondary mt-1")}>
        {english}
      </span>
    </Tag>
  );
}
