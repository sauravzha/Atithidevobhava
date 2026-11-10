import * as React from "react";
import { cn } from "@/lib/utils";

export type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  lang?: string;
};

/**
 * Form field wrapper -- label, input slot, helper / error messaging.
 * Error state adds a red left border so the field is identifiable without relying on colour alone.
 */
export function Field({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  children,
  className,
  lang,
}: FieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const helperId = helperText && !error ? `${htmlFor}-helper` : undefined;
  const errorPrefix = lang === "hi" ? "\u0924\u094D\u0930\u0941\u091F\u093F: " : "Error: ";

  return (
    <div
      className={cn(
        "flex flex-col gap-0",
        error && "border-l-2 border-l-error pl-3",
        className,
      )}
      lang={lang}
    >
      <label htmlFor={htmlFor} className="font-body font-medium text-sm text-text mb-1">
        {label}
        {required && (
          <span className="text-secondary ml-1 font-normal">(required)</span>
        )}
      </label>

      {children}

      {error && (
        <p id={errorId} role="alert" className="text-error text-sm mt-1 font-body">
          {errorPrefix}
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-secondary text-sm mt-1 font-body">
          {helperText}
        </p>
      )}
    </div>
  );
}
