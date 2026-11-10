import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ListingRowProps = {
  title: string;
  /** Hindi title -- displayed above the English title when provided. */
  titleHi?: string;
  subtitle: string;
  location: string;
  meta?: string;
  href: string;
  className?: string;
};

/**
 * Editorial experience listing row.
 * Ruled horizontal line, text-only, hover transitions the title colour.
 */
export function ListingRow({
  title,
  titleHi,
  subtitle,
  location,
  meta,
  href,
  className,
}: ListingRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block border-b border-rule py-4 transition-colors duration-[120ms] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {/* Title area */}
        <div>
          {titleHi && (
            <span
              lang="hi"
              className="block font-heading font-medium text-lg text-text group-hover:text-primary transition-colors duration-[120ms] motion-reduce:transition-none"
            >
              {titleHi}
            </span>
          )}
          <span
            className={cn(
              "block font-heading font-medium text-text group-hover:text-primary transition-colors duration-[120ms] motion-reduce:transition-none",
              titleHi ? "text-sm" : "text-lg",
            )}
          >
            {title}
          </span>
        </div>

        {/* Subtitle */}
        <span className="text-sm text-secondary font-body">{subtitle}</span>

        {/* Location and meta on one line */}
        <div className="flex flex-wrap items-center gap-x-3 text-sm text-secondary font-body">
          <span>{location}</span>
          {meta && (
            <>
              <span aria-hidden="true" className="text-rule">
                |
              </span>
              <span>{meta}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
