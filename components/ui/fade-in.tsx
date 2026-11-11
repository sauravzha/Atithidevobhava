"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  threshold?: number;
  /** When false, the element will fade out when scrolled out of view and fade in when entering */
  once?: boolean;
}

/**
 * FadeIn component for smooth viewport entrance and exit animations.
 * Observes element visibility and animates smoothly with fade-in and fade-out effects.
 * Respects prefers-reduced-motion user settings.
 */
export function FadeIn({
  children,
  delayMs = 0,
  durationMs = 700,
  direction = "up",
  className,
  threshold = 0.1,
  once = true,
  style,
  ...props
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
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
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // Fade out when scrolling out of viewport
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getTransformStyle = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    if (direction === "up") return "translate3d(0, 24px, 0)";
    if (direction === "down") return "translate3d(0, -24px, 0)";
    if (direction === "left") return "translate3d(24px, 0, 0)";
    if (direction === "right") return "translate3d(-24px, 0, 0)";
    return "none";
  };

  return (
    <div
      ref={elementRef}
      className={cn("transition-all ease-out will-change-transform will-change-opacity", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * HoverFadeCard component for interactive elements that smoothly fade in/out hover states.
 */
export function HoverFadeCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
