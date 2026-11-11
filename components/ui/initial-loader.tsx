"use client";

import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./loading-screen";

/**
 * Initial page loading screen that gracefully fades out once the page is interactive.
 */
export function InitialLoader() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Begin fade out after a brief moment
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 600);

    // Remove from DOM after transition completes
    const removeTimer = setTimeout(() => {
      setRemoved(true);
    }, 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted || removed) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 pointer-events-none ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <LoadingScreen fullScreen />
    </div>
  );
}
