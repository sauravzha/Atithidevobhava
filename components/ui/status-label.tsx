import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusLabelProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
};

const variantStyles: Record<NonNullable<StatusLabelProps["variant"]>, string> = {
  default: "border-rule text-text",
  success: "border-forest text-forest",
  warning: "border-terracotta-text text-terracotta-text",
  error: "border-error text-error",
  info: "border-secondary text-secondary",
};

/**
 * Bordered status indicator -- no pills, no coloured backgrounds, no shadows.
 * Purely a 1px-bordered inline label for editorial restraint.
 */
export function StatusLabel({ status, variant = "default", className }: StatusLabelProps) {
  return (
    <span
      className={cn(
        "inline-block border text-sm font-body px-2 py-0.5 rounded-sm",
        variantStyles[variant],
        className,
      )}
    >
      {status}
    </span>
  );
}
