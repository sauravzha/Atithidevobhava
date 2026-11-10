"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhotoUploaderProps {
  onPhotoSelected?: (file: File) => void;
  currentPhotoUrl?: string;
  label?: string;
  helperText?: string;
  error?: string;
  maxSizeBytes?: number;
  className?: string;
  lang?: "en" | "hi";
}

/**
 * Accessible photo upload component.
 * Informs the user that EXIF metadata and GPS coordinates are automatically stripped
 * on upload to preserve privacy and safety.
 */
export function PhotoUploader({
  onPhotoSelected,
  currentPhotoUrl,
  label = "Upload profile photo",
  helperText = "JPG, PNG, or WebP. Maximum size 5 MB.",
  error,
  maxSizeBytes = 5 * 1024 * 1024,
  className,
  lang = "en",
}: PhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl ?? null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isHindi = lang === "hi";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setInternalError(
        isHindi
          ? "त्रुटि: केवल जेपीजी, पीएनजी या वेबपी प्रारूप स्वीकृत हैं।"
          : "Error: Only JPG, PNG, or WebP image formats are accepted."
      );
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setInternalError(
        isHindi
          ? "त्रुटि: फ़ाइल का आकार 5 एमबी से कम होना चाहिए।"
          : "Error: File size must not exceed 5 MB."
      );
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    if (onPhotoSelected) {
      onPhotoSelected(file);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeError = error || internalError;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <span className="block font-body text-sm font-medium text-text">
        {label}
      </span>

      <div
        className={cn(
          "relative border border-dashed rounded-sm p-4 transition-colors duration-[120ms]",
          activeError ? "border-error bg-error/5" : "border-rule hover:border-secondary bg-surface"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id="photo-upload-input"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-sm overflow-hidden border border-rule bg-warm-grey">
              <Image
                src={previewUrl}
                alt={isHindi ? "अपलोड की गई फ़ोटो का पूर्वावलोकन" : "Uploaded photo preview"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleClear}
                className="tap-target inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-rule hover:border-secondary rounded-sm transition-colors duration-[120ms] text-text"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{isHindi ? "फ़ोटो हटाएं" : "Remove photo"}</span>
              </button>
              <p className="text-xs text-secondary max-w-prose">
                {isHindi
                  ? "ईएक्सआईएफ और जीपीएस डेटा अपलोड करने पर हटा दिया जाएगा।"
                  : "EXIF metadata and GPS coordinates will be stripped on upload."}
              </p>
            </div>
          </div>
        ) : (
          <label
            htmlFor="photo-upload-input"
            className="flex flex-col items-center justify-center p-6 cursor-pointer text-center"
          >
            <Upload className="w-6 h-6 text-secondary mb-2" strokeWidth={1.5} />
            <span className="font-body text-sm font-medium text-primary hover:text-primary-hover underline underline-offset-4 mb-1">
              {isHindi ? "फ़ोटो चुनें या यहां खींचें" : "Choose photo or drag file here"}
            </span>
            <span className="font-body text-xs text-secondary">
              {helperText}
            </span>
          </label>
        )}
      </div>

      <div className="border-l-2 border-forest pl-3 py-1 bg-page">
        <p className="font-body text-xs text-secondary leading-relaxed">
          {isHindi
            ? "गोपनीयता सूचना: सभी छवियों से कैमरे का विवरण और स्थान निर्देशांक (जीपीएस) हटा दिए जाते हैं।"
            : "Privacy notice: All camera specifications, device tags, and GPS coordinates are removed upon upload."}
        </p>
      </div>

      {activeError && (
        <p role="alert" className="flex items-center gap-1 text-xs text-error font-body">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          <span>{activeError}</span>
        </p>
      )}
    </div>
  );
}
