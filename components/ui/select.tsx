"use client";

import React, { useState, useId } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  searchable?: boolean;
  className?: string;
  id?: string;
}

/**
 * Editorial select component built on Radix UI primitive.
 * Completely restyled with flat borders, 3px radius, 44px minimum tap target,
 * keyboard accessibility, and optional client-side option search.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  error = false,
  searchable = false,
  className,
  id: providedId,
}: SelectProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  return (
    <div className={cn("w-full relative", className)}>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-label={label}
          className={cn(
            "h-[44px] w-full px-4 text-left font-body text-sm",
            "bg-surface text-text border rounded-sm",
            "flex items-center justify-between gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
            "transition-colors duration-[120ms]",
            error
              ? "border-error text-error"
              : "border-rule hover:border-secondary",
            disabled && "opacity-50 cursor-not-allowed bg-warm-grey/30"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="w-4 h-4 text-secondary shrink-0" strokeWidth={1.5} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)] max-h-[280px]",
              "bg-surface text-text border border-rule rounded-sm overflow-hidden",
              "animate-none shadow-none"
            )}
          >
            {searchable && (
              <div className="p-2 border-b border-rule bg-page">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to filter..."
                  aria-label="Filter options"
                  className={cn(
                    "w-full h-[36px] px-3 text-sm bg-surface text-text",
                    "border border-rule rounded-sm",
                    "focus:outline-none focus:border-forest"
                  )}
                  onKeyDown={(e) => {
                    // Prevent Radix Select from closing when typing space
                    e.stopPropagation();
                  }}
                />
              </div>
            )}

            <SelectPrimitive.Viewport className="p-1 max-h-[220px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-secondary">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <SelectPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      "relative flex items-center justify-between px-3 py-2 text-sm",
                      "rounded-sm select-none cursor-pointer outline-none",
                      "hover:bg-warm-grey focus:bg-warm-grey focus:text-text",
                      "transition-colors duration-[120ms]"
                    )}
                  >
                    <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator>
                      <Check className="w-4 h-4 text-forest shrink-0 ml-2" strokeWidth={1.5} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

