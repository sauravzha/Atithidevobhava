"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  lang?: string;
}

/**
 * 6-digit accessible OTP input.
 * Individual boxes for digits, automatic focus progression, backspace handling,
 * and multi-character paste distribution.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
  lang = "en",
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    if (value) {
      const chars = value.split("").slice(0, length);
      while (chars.length < length) chars.push("");
      return chars;
    }
    return Array(length).fill("");
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Accept only numeric characters
    const numericChar = val.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = numericChar;
    setDigits(newDigits);

    const combined = newDigits.join("");
    onChange?.(combined);

    if (numericChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !newDigits.includes("")) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i] ?? "";
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasteData.length === length) {
      onComplete(pasteData);
    }
  };

  return (
    <div
      role="group"
      aria-label={lang === "hi" ? "ओटीपी सत्यापन कोड" : "One-time verification code"}
      className={cn("flex items-center gap-2", className)}
    >
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          aria-label={
            lang === "hi"
              ? `ओटीपी अंक ${idx + 1} कुल ${length}`
              : `Verification code digit ${idx + 1} of ${length}`
          }
          className={cn(
            "w-[44px] h-[52px] text-center font-body text-lg font-medium",
            "border bg-surface text-text rounded-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
            "transition-colors duration-[120ms]",
            error
              ? "border-error text-error"
              : "border-rule hover:border-secondary focus:border-forest",
            disabled && "opacity-50 cursor-not-allowed bg-warm-grey/30"
          )}
        />
      ))}
    </div>
  );
}

