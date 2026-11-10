import * as React from "react";
import { cn } from "@/lib/utils";

export type NoticeProps = {
  children: React.ReactNode;
  variant?: "default" | "warning" | "error";
  className?: string;
};

const variantStyles: Record<NonNullable<NoticeProps["variant"]>, string> = {
  default: "border-l-primary",
  warning: "border-l-terracotta",
  error: "border-l-error",
};

/**
 * Left-bordered callout for supplementary notices.
 * Kept deliberately simple -- no icons, no background fills.
 */
export function Notice({ children, variant = "default", className }: NoticeProps) {
  return (
    <aside
      className={cn(
        "border-l-2 pl-4 py-3 text-sm text-text font-body",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </aside>
  );
}
