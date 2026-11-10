/**
 * Firebase Client and Google Authentication Integration.
 * Spec reference: Section 2, 5, 20, and 29 of docs/SPEC.md.
 * Invariants: Strictly 18+ adult verification, clearly labelled development fallback
 * when credentials are not configured, zero trackers, safe server-side bundling.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface GoogleAuthResult {
  success: boolean;
  isDevSimulation?: boolean;
  errorCode?: string;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  idToken?: string;
  error?: string;
}

/**
 * Read client Firebase configuration from public environment variables.
 */
export function getFirebaseConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

/**
 * Check whether valid, non-placeholder Firebase configuration keys exist.
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(
    config.apiKey &&
      config.apiKey.trim() !== "" &&
      config.apiKey !== "placeholder" &&
      config.projectId &&
      config.projectId.trim() !== "" &&
      config.projectId !== "placeholder"
  );
}

/**
 * Initialize or retrieve the singleton Firebase App instance in the browser.
 * Returns null when running on the server or when credentials are missing.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isFirebaseConfigured()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  const config = getFirebaseConfig();
  return initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
}

/**
 * Get the Firebase Auth instance.
 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return getAuth(app);
}

/**
 * Authenticate using Google Firebase.
 *
 * In production / configured environments:
 *   Opens Firebase Google OAuth popup and returns verified user credential and ID token.
 *
 * In development fallback mode (no Firebase credentials in .env.local):
 *   Returns a clearly labelled simulated credential so developers and testers can verify
 *   the authentication flow and session cookies without external cloud setup.
 */
export async function signInWithGoogleFirebase(
  simulatedEmail?: string,
  options?: { forceSimulation?: boolean }
): Promise<GoogleAuthResult> {
  // Check for client environment, active configuration, or forced simulation
  if (options?.forceSimulation || !isFirebaseConfigured() || typeof window === "undefined") {
    // Development fallback simulation mode
    const email = simulatedEmail || "dev.traveller@example.com";
    const name = email.split("@")[0]?.replace(/[._]/g, " ") || "Verified Traveller";
    const capitalisedName = name.replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      success: true,
      isDevSimulation: true,
      user: {
        uid: "dev_google_" + Math.random().toString(36).substring(2, 10),
        email,
        displayName: capitalisedName,
        photoURL: null,
      },
      idToken: "dev_firebase_id_token_" + Date.now().toString(36),
    };
  }

  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return {
        success: false,
        error: "Unable to initialize Firebase authentication client.",
      };
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({ prompt: "select_account" });

    const credential: UserCredential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();

    return {
      success: true,
      isDevSimulation: false,
      user: {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
      },
      idToken,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    const code = error.code || "";
    const rawMessage = error.message || "";

    if (code === "auth/popup-closed-by-user") {
      return {
        success: false,
        errorCode: code,
        error: "Google sign-in window was closed before completion.",
      };
    }
    if (code === "auth/cancelled-popup-request") {
      return {
        success: false,
        errorCode: code,
        error: "Sign-in request was cancelled. Please try again.",
      };
    }
    if (code === "auth/configuration-not-found" || rawMessage.includes("configuration-not-found")) {
      return {
        success: false,
        errorCode: "auth/configuration-not-found",
        error:
          "Firebase Authentication has not been enabled in your Firebase Console yet. Click 'Get Started' and enable Google in Build > Authentication > Sign-in method.",
      };
    }
    if (code === "auth/operation-not-allowed" || rawMessage.includes("operation-not-allowed")) {
      return {
        success: false,
        errorCode: "auth/operation-not-allowed",
        error:
          "Google Sign-In is not enabled in Firebase Console. Please enable Google under Build > Authentication > Sign-in method.",
      };
    }
    if (code === "auth/unauthorized-domain" || rawMessage.includes("unauthorized-domain")) {
      return {
        success: false,
        errorCode: "auth/unauthorized-domain",
        error:
          "This domain (localhost) is not in your Firebase Authorized domains list. Add it in Firebase Console > Authentication > Settings > Authorized domains.",
      };
    }
    if (code === "auth/popup-blocked" || rawMessage.includes("popup-blocked")) {
      return {
        success: false,
        errorCode: "auth/popup-blocked",
        error:
          "Sign-in popup was blocked by your browser. Please allow popups for localhost and try again.",
      };
    }

    return {
      success: false,
      errorCode: code,
      error: rawMessage || "Failed to complete Google sign-in. Please try again.",
    };
  }
}

/**
 * Sign out user from Firebase client.
 */
export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await signOut(auth);
  }
}

