import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isFirebaseConfigured,
  getFirebaseConfig,
  signInWithGoogleFirebase,
} from "@/lib/auth/firebase";
import {
  serializeSession,
  deserializeSession,
  type AuthUserSession,
} from "@/lib/auth/session";

describe("Firebase Google Authentication & Session Bridge", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("Configuration & Fallback Detection", () => {
    it("reports not configured when API key is missing or blank", () => {
      expect(isFirebaseConfigured()).toBe(false);
    });

    it("reports not configured when keys are placeholder values", () => {
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "placeholder";
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "placeholder";
      expect(isFirebaseConfigured()).toBe(false);
    });

    it("reports configured when valid keys are provided", () => {
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyTest123456789";
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "atithi-devo-bhava";
      expect(isFirebaseConfigured()).toBe(true);

      const config = getFirebaseConfig();
      expect(config.apiKey).toBe("AIzaSyTest123456789");
      expect(config.projectId).toBe("atithi-devo-bhava");
    });
  });

  describe("Development Simulation Mode", () => {
    it("produces a valid simulated Google credential without live Firebase credentials", async () => {
      const result = await signInWithGoogleFirebase("test.traveller@example.com");

      expect(result.success).toBe(true);
      expect(result.isDevSimulation).toBe(true);
      expect(result.user?.email).toBe("test.traveller@example.com");
      expect(result.user?.displayName).toContain("Test Traveller");
      expect(result.user?.uid).toContain("dev_google_");
      expect(result.idToken).toBeDefined();
    });
  });

  describe("Session Serialization & Tamper Detection", () => {
    const sampleSession: AuthUserSession = {
      userId: "usr_mock_12345",
      email: "traveller@example.com",
      displayName: "Elena Rostova",
      photoUrl: null,
      role: "traveller",
      isAdult: true,
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    it("serializes and deserializes session successfully", () => {
      const token = serializeSession(sampleSession);
      expect(token).toContain(".");

      const restored = deserializeSession(token);
      expect(restored).not.toBeNull();
      expect(restored?.userId).toBe(sampleSession.userId);
      expect(restored?.email).toBe(sampleSession.email);
      expect(restored?.role).toBe("traveller");
      expect(restored?.isAdult).toBe(true);
      expect(restored?.provider).toBe("google");
    });

    it("rejects tampered session payloads", () => {
      const token = serializeSession(sampleSession);
      const [payload, signature] = token.split(".");

      // Modify base64 payload to tamper data
      const tamperedPayload = payload + "tamper";
      const tamperedToken = `${tamperedPayload}.${signature}`;

      const result = deserializeSession(tamperedToken);
      expect(result).toBeNull();
    });

    it("rejects malformed session tokens without signature", () => {
      expect(deserializeSession("invalid-token-no-dots")).toBeNull();
      expect(deserializeSession("")).toBeNull();
    });
  });
});

