import React from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

/**
 * Global Next.js App Router Loading UI.
 * Displays during page transitions and server-side rendering.
 */
export default function Loading() {
  return <LoadingScreen fullScreen />;
}

