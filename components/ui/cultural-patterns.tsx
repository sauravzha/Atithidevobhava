import React from "react";
import { cn } from "@/lib/utils";

/**
 * Traditional Indian cultural pattern accents.
 * Provides authentic Madhubani folk borders, Aripan geometry,
 * Jharokha arch motifs, and sacred lotus accents.
 */

export function MadhubaniBorder({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-full overflow-hidden flex items-center justify-center my-4 opacity-60 dark:opacity-40", className)}
      aria-hidden="true"
    >
      <svg
        className="w-full max-w-xl h-4 text-terracotta"
        viewBox="0 0 600 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="8" x2="600" y2="8" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
        <circle cx="300" cy="8" r="4" fill="currentColor" />
        <circle cx="280" cy="8" r="2" fill="currentColor" />
        <circle cx="320" cy="8" r="2" fill="currentColor" />
        <circle cx="260" cy="8" r="1.5" fill="currentColor" />
        <circle cx="340" cy="8" r="1.5" fill="currentColor" />
        <path d="M290 8 L300 2 L310 8 L300 14 Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <path d="M270 8 Q275 4 280 8 Q275 12 270 8 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <path d="M330 8 Q325 4 320 8 Q325 12 330 8 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  );
}

export function JharokhaMotif({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-6 h-6 text-terracotta shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C7 5 4 8 4 13v7h16v-7c0-5-3-8-8-11z" />
      <path d="M12 6c-2.5 1.5-4 3.5-4 6v5h8v-5c0-2.5-1.5-4.5-4-6z" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function LotusMotif({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-5 h-5 text-terracotta shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3c-1.5 3-4 6-4 9 0 3 1.8 5 4 6 2.2-1 4-3 4-6 0-3-2.5-6-4-9z" />
      <path d="M8 12c-2.5 0-5 1.5-5 4.5S6 20 9 20c1.5 0 2.5-.5 3-1" />
      <path d="M16 12c2.5 0 5 1.5 5 4.5S18 20 15 20c-1.5 0-2.5-.5-3-1" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

export function DiyaMotif({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-5 h-5 text-terracotta shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Earthen bowl */}
      <path d="M4 14c0 4 3.6 7 8 7s8-3 8-7H4z" />
      {/* Flame */}
      <path d="M12 3c-1.5 2-2 3.5-2 5 0 1.5 1 3 2 3s2-1.5 2-3c0-1.5-.5-3-2-5z" fill="currentColor" />
    </svg>
  );
}

export function AripanDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-full flex items-center justify-center gap-2 py-3 text-terracotta/70", className)}
      aria-hidden="true"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent flex-1 max-w-xs" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1 h-1 rounded-full bg-terracotta/60" />
        <span className="w-1.5 h-1.5 rotate-45 border border-terracotta/80" />
        <LotusMotif className="w-4 h-4 text-terracotta" />
        <span className="w-1.5 h-1.5 rotate-45 border border-terracotta/80" />
        <span className="w-1 h-1 rounded-full bg-terracotta/60" />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent flex-1 max-w-xs" />
    </div>
  );
}
