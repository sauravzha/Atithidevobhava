"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delayMs?: number;
  direction?: "up" | "down" | "none";
  className?: string;
  threshold?: number;
}

/**
 * FadeIn component for smooth viewport entrance animations.
 * Observes element visibility and animates smoothly into view.
 * Respects prefers-reduced-motion user settings.
 */
export function FadeIn({
  children,
  delayMs = 0,
  direction = "up",
  className,
  threshold = 0.1,
  style,
  ...props
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getTransformStyle = () => {
    if (isVisible) return "translateY(0px)";
    if (direction === "up") return "translateY(24px)";
    if (direction === "down") return "translateY(-24px)";
    return "none";
  };

  return (
    <div
      ref={elementRef}
      className={cn("transition-all duration-700 ease-out will-change-transform", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transitionDelay: `${delayMs}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
