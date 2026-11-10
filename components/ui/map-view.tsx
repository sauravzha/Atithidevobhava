"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapCoordinate {
  latitude: number;
  longitude: number;
  label?: string;
  isApproximate?: boolean;
}

export interface MapViewProps {
  locationName: string;
  coordinate?: MapCoordinate;
  district?: string;
  state?: string;
  className?: string;
  lang?: "en" | "hi";
}

/**
 * Editorial MapView component.
 * Strict Privacy Rule: Never displays exact residential coordinates. Coordinates
 * are snapped to town or locality centroids. Shows privacy notice on public areas.
 */
export function MapView({
  locationName,
  coordinate,
  district,
  state,
  className,
  lang = "en",
}: MapViewProps) {
  const isHindi = lang === "hi";

  // Coordinates rounded to 2 decimal places (approximately 1.1 km precision) to protect residential privacy
  const roundedLat = coordinate ? coordinate.latitude.toFixed(2) : null;
  const roundedLng = coordinate ? coordinate.longitude.toFixed(2) : null;

  return (
    <div
      role="region"
      aria-label={isHindi ? `${locationName} का अनुमानित मानचित्र` : `Approximate location map for ${locationName}`}
      className={cn("w-full border border-rule rounded-sm bg-surface overflow-hidden", className)}
    >
      <div className="p-4 border-b border-rule flex items-center justify-between bg-page">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-forest shrink-0" strokeWidth={1.5} />
          <span className="font-heading font-medium text-sm text-text">
            {locationName}
          </span>
          {(district || state) && (
            <span className="text-xs text-secondary font-body">
              ({[district, state].filter(Boolean).join(", ")})
            </span>
          )}
        </div>
        <span className="text-xs text-secondary font-body border border-rule px-2 py-0.5 rounded-sm">
          {isHindi ? "केवल अनुमानित क्षेत्र" : "Approximate area only"}
        </span>
      </div>

      <div className="relative h-48 sm:h-64 w-full bg-warm-grey/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-sm border border-rule bg-surface flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <p className="font-heading font-medium text-base text-text mb-1">
          {locationName}
        </p>
        <p className="font-body text-xs text-secondary max-w-prose mb-3">
          {isHindi
            ? "सुरक्षा और गोपनीयता कारणों से सटीक आवासीय पते कभी भी सार्वजनिक मानचित्र पर प्रदर्शित नहीं किए जाते हैं। मिलने का स्थान केवल सार्वजनिक क्षेत्र में होगा।"
            : "For safety and privacy, exact residential coordinates are never displayed. Meeting points are established strictly in designated public areas."}
        </p>
        {roundedLat && roundedLng && (
          <p className="font-mono text-xs text-secondary/70">
            {isHindi ? "अनुमानित केंद्रक" : "Locality centroid"}: {roundedLat} N, {roundedLng} E
          </p>
        )}
      </div>

      <div className="p-3 bg-page border-t border-rule text-xs text-secondary flex items-center justify-between">
        <span>OpenStreetMap contributors (Local Government Directory boundary)</span>
        <span className="font-medium text-primary">Atithi Devo Bhava</span>
      </div>
    </div>
  );
}
