import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
  size?: "default" | "small";
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center font-body font-medium rounded-[3px] transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest motion-reduce:transition-none";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover",
  secondary:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
  text: "text-primary underline-offset-4 hover:underline border-none bg-transparent",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "min-h-[44px] min-w-[44px] px-6 py-3 text-base",
  small: "min-h-[44px] min-w-[44px] px-4 py-2 text-sm",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      loading = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          base,
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...rest}
      >
        {loading ? "\u2026" : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
