import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PersonRowProps = {
  displayName: string;
  location: string;
  languages?: string[];
  interests?: string[];
  verified?: boolean;
  href: string;
  className?: string;
};

/**
 * Editorial person directory row.
 * Text-led layout -- no avatars, no decorative circles.
 * Ruled horizontal line, hover transitions the name colour.
 */
export function PersonRow({
  displayName,
  location,
  languages,
  interests,
  verified = false,
  href,
  className,
}: PersonRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block border-b border-rule py-4 transition-colors duration-[120ms] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {/* Name with optional verified indicator */}
        <span className="flex items-center gap-1.5 font-heading font-medium text-text group-hover:text-primary transition-colors duration-[120ms] motion-reduce:transition-none">
          {displayName}
          {verified && (
            <Check
              size={14}
              className="text-forest flex-shrink-0"
              aria-label="Verified"
            />
          )}
        </span>

        {/* Location */}
        <span className="text-sm text-secondary font-body">{location}</span>

        {/* Languages */}
        {languages && languages.length > 0 && (
          <span className="text-sm text-secondary font-body">
            Languages: {languages.join(", ")}
          </span>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <span className="text-sm text-secondary font-body">
            Interests: {interests.join(", ")}
          </span>
        )}
      </div>
    </Link>
  );
}
