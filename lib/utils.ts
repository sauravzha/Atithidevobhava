import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names with conditional support.
 * Thin wrapper over clsx - avoids importing clsx everywhere.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

