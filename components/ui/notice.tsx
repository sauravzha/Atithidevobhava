import * as React from "react";
import { cn } from "@/lib/utils";

export type NoticeProps = {
  children: React.ReactNode;
  variant?: "default" | "warning" | "error" | "info";
  className?: string;
};

const variantStyles: Record<NonNullable<NoticeProps["variant"]>, string> = {
  default: "border-l-primary bg-warm/30 border-t border-r border-b border-rule/60 text-text",
  warning: "border-l-terracotta bg-[#C85A32]/5 border-t border-r border-b border-rule/60 text-text",
  error: "border-l-error bg-red-50/50 dark:bg-red-950/20 border-t border-r border-b border-red-200/60 dark:border-red-900/40 text-text",
  info: "border-l-forest bg-[#234033]/5 border-t border-r border-b border-rule/60 text-text",
};

/**
 * Editorial callout for supplementary notices.
 * Designed with a subtle journal paper feel and refined left accent rule.
 */
export function Notice({ children, variant = "default", className }: NoticeProps) {
  return (
    <aside
      className={cn(
        "border-l-2 pl-4 pr-4 py-3.5 text-xs sm:text-sm font-body rounded-xs shadow-2xs leading-relaxed",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </aside>
  );
}
