import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text" | "outline" | "glass";
  size?: "default" | "small" | "large";
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center font-body font-medium rounded-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest motion-reduce:transition-none tactile-button select-none";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover shadow-xs active:shadow-none",
  secondary:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white active:bg-primary-hover",
  outline:
    "bg-surface text-text border border-rule hover:border-secondary hover:text-primary shadow-xs active:shadow-none",
  glass:
    "organic-glass text-text border border-rule/80 hover:border-primary/60 hover:text-primary shadow-xs",
  text: "text-primary underline-offset-4 hover:underline border-none bg-transparent hover:bg-warm/30",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  small: "min-h-[38px] px-3.5 py-1.5 text-xs tracking-wide",
  default: "min-h-[44px] min-w-[44px] px-5 py-2.5 text-sm tracking-wide",
  large: "min-h-[50px] min-w-[48px] px-7 py-3 text-base tracking-wide",
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
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none shadow-none",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="opacity-90">{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
