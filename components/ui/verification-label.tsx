import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationLabelProps = {
  label: string;
  date?: string;
  showDisclaimer?: boolean;
  className?: string;
};

/**
 * Editorial verification badge with ShieldCheck icon and heritage seal styling.
 */
export function VerificationLabel({
  label,
  date,
  showDisclaimer = false,
  className,
}: VerificationLabelProps) {
  return (
    <div className={cn("font-body inline-block", className)}>
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-forest/10 border border-forest/30 text-forest text-xs font-mono uppercase tracking-wider rounded-xs">
        <ShieldCheck
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          className="shrink-0 text-forest"
        />
        <span className="font-medium">{label}</span>
        {date && (
          <time className="text-secondary/80 ml-1 font-normal" dateTime={date}>
            {date}
          </time>
        )}
      </span>

      {showDisclaimer && (
        <p className="text-secondary text-[11px] mt-1 font-heading italic">
          A badge shows what we checked, not a guarantee.
        </p>
      )}
    </div>
  );
}
