import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusLabelProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
};

const variantStyles: Record<NonNullable<StatusLabelProps["variant"]>, string> = {
  default: "border-rule bg-warm/30 text-text",
  success: "border-forest/40 bg-forest/5 text-forest font-medium",
  warning: "border-terracotta/40 bg-[#C85A32]/5 text-[#A84522] dark:text-[#E87A52] font-medium",
  error: "border-error/40 bg-red-50/60 dark:bg-red-950/30 text-error font-medium",
  info: "border-secondary/40 bg-surface text-secondary",
};

/**
 * Editorial bordered status indicator with subtle heritage stamp inspiration.
 */
export function StatusLabel({ status, variant = "default", className }: StatusLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-2xs",
        variantStyles[variant],
        className,
      )}
    >
      {status}
    </span>
  );
}
