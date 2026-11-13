/**
 * Predefined verified demo profiles for one-click testing and demonstration.
 * Client-safe: Contains zero server-side dependencies.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string | null;
  role: "traveller" | "local_member" | "experience_provider" | "accommodation_host" | "admin";
  isAdult: boolean;
  provider: "google" | "otp" | "demo";
}

export interface DemoProfile {
  id: string;
  name: string;
  nameHi: string;
  email: string;
  role: AuthenticatedUser["role"];
  roleLabelEn: string;
  roleLabelHi: string;
  locationEn: string;
  locationHi: string;
  avatar: string;
  bioEn: string;
  bioHi: string;
}

export const PRESET_DEMO_ACCOUNTS: DemoProfile[] = [];

