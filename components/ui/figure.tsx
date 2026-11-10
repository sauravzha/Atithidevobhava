import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type FigureProps = {
  src: string;
  alt: string;
  credit: string;
  licence: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Editorial image figure that enforces accessibility and attribution.
 * Renders nothing when alt, credit, or licence is missing -- images
 * without proper metadata should never appear on the page.
 */
export function Figure({
  src,
  alt,
  credit,
  licence,
  caption,
  width,
  height,
  className,
}: FigureProps) {
  const isMissingMeta = alt === "" || credit === "" || licence === "";

  if (isMissingMeta) {
    if (process.env.NODE_ENV === "development") {
      // warn so the developer notices during local development
      console.warn(
        `[Figure] Refused to render image "${src}" -- alt, credit, and licence are all required.`,
      );
    }
    return null;
  }

  return (
    <figure className={cn("font-body", className)}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 600}
        className="border border-rule rounded-[3px] w-full h-auto"
      />

      <figcaption className="mt-2 text-sm text-secondary leading-snug">
        {caption && <span className="block">{caption}</span>}
        <span className="block">
          Photo: {credit} ({licence})
        </span>
      </figcaption>
    </figure>
  );
}
