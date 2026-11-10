import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationLabelProps = {
  label: string;
  date?: string;
  showDisclaimer?: boolean;
  className?: string;
};

/**
 * Verification badge -- check glyph, label, optional date.
 * Disclaimer is opt-in to avoid cluttering compact layouts.
 */
export function VerificationLabel({
  label,
  date,
  showDisclaimer = false,
  className,
}: VerificationLabelProps) {
  return (
    <div className={cn("font-body", className)}>
      <span className="inline-flex items-center gap-1.5 text-forest text-sm">
        <Check
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0"
        />
        <span>{label}</span>
        {date && (
          <time className="text-secondary ml-1" dateTime={date}>
            {date}
          </time>
        )}
      </span>

      {showDisclaimer && (
        <p className="text-secondary text-xs mt-1">
          A badge shows what we checked, not a guarantee.
        </p>
      )}
    </div>
  );
}
