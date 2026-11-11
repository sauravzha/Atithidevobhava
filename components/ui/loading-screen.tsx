"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Cultural loading screen with traditional lotus geometry and bilingual greeting.
 * Used for initial application boot, page transitions, and async operations.
 */
export function LoadingScreen({
  message,
  subMessage,
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className={cn(
        "flex flex-col items-center justify-center bg-page text-text transition-opacity duration-500",
        fullScreen ? "fixed inset-0 z-50 min-h-screen w-full" : "w-full py-16",
        className
      )}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center animate-fade-in">
        {/* Brand Logo with gentle breathing pulse */}
        <div className="relative mb-6">
          <Image
            src="/images/logo.png"
            alt="Atithi Devo Bhava"
            width={220}
            height={75}
            priority
            className="h-12 sm:h-14 w-auto object-contain animate-pulse-gently"
          />
        </div>

        {/* Concentric Traditional Sacred Lotus Geometry */}
        <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-terracotta/40 animate-spin" style={{ animationDuration: "8s" }} />

          {/* Middle counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-forest/50 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />

          {/* Inner pulsing lotus blossom mark */}
          <svg
            className="w-7 h-7 text-terracotta animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3c-1.5 3-3 6-3 9 0 3 1.5 5 3 6 1.5-1 3-3 3-6 0-3-1.5-6-3-9z" fill="currentColor" fillOpacity="0.2" />
            <path d="M7 8c-2 2-3 5-3 7 0 2 1 3 3 4 1-1 2-3 2-5 0-2-1-4-2-6z" fill="currentColor" fillOpacity="0.1" />
            <path d="M17 8c2 2 3 5 3 7 0 2-1 3-3 4-1-1-2-3-2-5 0-2 1-4 2-6z" fill="currentColor" fillOpacity="0.1" />
            <path d="M12 21v-3" />
          </svg>
        </div>

        {/* Devanagari Inscription */}
        <div className="space-y-1 mb-3">
          <h2 lang="hi" className="font-heading text-lg font-medium text-text tracking-wide">
            {message || "अतिथि देवो भवः"}
          </h2>
          <p className="font-heading text-xs text-secondary italic">
            {subMessage || "The guest is equivalent to the divine"}
          </p>
        </div>

        {/* Progress indicator bar */}
        <div className="w-36 h-0.5 bg-rule/80 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "65%" }} />
        </div>
      </div>
    </div>
  );
}
