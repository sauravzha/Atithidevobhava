"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarRangeProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  lang?: string;
}

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];

const WEEKDAY_NAMES_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const WEEKDAY_NAMES_HI = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];

/**
 * Editorial range calendar starting on Monday.
 * Full keyboard navigation, 44px tap targets, WCAG 2.2 AA compliant.
 * Spec: Section 18 - range Calendar (keyboard accessible, Monday start).
 */
export function CalendarRange({
  startDate = null,
  endDate = null,
  onRangeChange,
  minDate,
  maxDate,
  disabled = false,
  className,
  lang = "en",
}: CalendarRangeProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : new Date()
  );

  const monthNames = lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const weekdayNames = lang === "hi" ? WEEKDAY_NAMES_HI : WEEKDAY_NAMES_EN;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of month (0 = Sun, 1 = Mon ... 6 = Sat)
  const firstDay = new Date(year, month, 1).getDay();
  // Monday start offset: if Sun (0), shift to 6; otherwise day - 1
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (disabled) return true;
      if (minDate) {
        const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        if (date < min) return true;
      }
      if (maxDate) {
        const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        if (date > max) return true;
      }
      return false;
    },
    [disabled, minDate, maxDate]
  );

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!startDate || (startDate && endDate)) {
      // Start a new range
      onRangeChange(date, null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        // Clicked date is earlier than start: make it the new start
        onRangeChange(date, null);
      } else {
        // Complete the range
        onRangeChange(startDate, date);
      }
    }
  };

  const today = new Date();

  return (
    <div
      role="region"
      aria-label={lang === "hi" ? "तारीख चयन कैलेंडर" : "Date selection calendar"}
      className={cn("w-full max-w-[340px] p-4 bg-surface border border-rule rounded-sm font-body", className)}
    >
      {/* Month / Year header with navigation */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-rule">
        <h2 className="font-heading font-medium text-base text-text">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={disabled}
            aria-label={lang === "hi" ? "पिछला महीना" : "Previous month"}
            className="w-[36px] h-[36px] flex items-center justify-center border border-rule hover:border-secondary rounded-sm text-text transition-colors duration-[120ms]"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={disabled}
            aria-label={lang === "hi" ? "अगला महीना" : "Next month"}
            className="w-[36px] h-[36px] flex items-center justify-center border border-rule hover:border-secondary rounded-sm text-text transition-colors duration-[120ms]"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Weekday headers starting on Monday */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center" role="row">
        {weekdayNames.map((d, i) => (
          <div
            key={i}
            role="columnheader"
            aria-label={d}
            className="text-xs font-medium text-secondary uppercase py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {/* Leading blanks for startOffset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`blank-${i}`} aria-hidden="true" className="w-[44px] h-[44px]" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const date = new Date(year, month, dayNumber);
          const isStart = isSameDay(date, startDate);
          const isEnd = isSameDay(date, endDate);
          const isInRange =
            startDate &&
            endDate &&
            date > startDate &&
            date < endDate;
          const isToday = isSameDay(date, today);
          const isOff = isDateDisabled(date);

          return (
            <button
              key={dayNumber}
              type="button"
              role="gridcell"
              disabled={isOff}
              onClick={() => handleDateClick(date)}
              aria-label={`${dayNumber} ${monthNames[month]} ${year}${
                isStart ? " (Selected start)" : ""
              }${isEnd ? " (Selected end)" : ""}`}
              aria-selected={Boolean(isStart || isEnd || isInRange)}
              className={cn(
                "w-[44px] h-[44px] flex items-center justify-center text-sm font-medium",
                "rounded-sm transition-colors duration-[120ms]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-1",
                /* Range styling */
                (isStart || isEnd) && "bg-primary text-white font-semibold",
                isInRange && "bg-forest/15 text-text rounded-none",
                !isStart && !isEnd && !isInRange && !isOff && "text-text hover:bg-warm-grey",
                /* Today indicator (1px border if not selected) */
                isToday && !isStart && !isEnd && "border border-primary",
                /* Disabled state */
                isOff && "text-secondary/40 cursor-not-allowed"
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

