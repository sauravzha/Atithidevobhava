/**
 * Firebase Authentication Service for Atithi Devo Bhava.
 * Supports Email/Password Authentication and Google Sign-In with popup.
 * Invariants: Strictly 18+ adult verification, zero trackers, clear error messaging.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";
import { syncUserProfile, getUserProfile } from "./firestore";

export interface AuthResponse {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    displayName: string;
    role: "traveller" | "local" | "artisan" | "admin";
    verified?: boolean;
    photoURL?: string | null;
  };
  idToken?: string;
  error?: string;
  errorCode?: string;
}

/**
 * Format raw Firebase Auth error codes into human-friendly explanations.
 */
export function formatAuthError(errorCode?: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address provided is not in a valid format.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify and try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please log in instead.";
    case "auth/weak-password":
      return "Password should be at least 8 characters long.";
    case "auth/operation-not-allowed":
      return "This sign-in provider is not enabled in Firebase.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Please allow popups for localhost.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth in Firebase Console.";
    default:
      return "Authentication failed. Please check your credentials and try again.";
  }
}

/**
 * Synchronize Firebase Auth user with server session cookie (`adb_session`).
 */
async function setServerSession(
  user: {
    uid: string;
    email: string;
    displayName: string;
    role: "traveller" | "local" | "artisan" | "admin";
  },
  provider: "credentials" | "google"
): Promise<void> {
  try {
    await fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.role,
        provider,
      }),
    });
  } catch (err) {
    console.warn("Failed to set server session cookie:", err);
  }
}

/**
 * Sign in with Email and Password.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return {
      success: false,
      error: "Firebase Authentication is not configured or not available in this environment.",
    };
  }

  try {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const idToken = await cred.user.getIdToken();

    // Retrieve or default profile from Firestore (only jhasaurav562@gmail.com is granted admin)
    const userEmail = (cred.user.email || email).trim().toLowerCase();
    const isOwner = userEmail === "jhasaurav562@gmail.com";
    const existingProfile = await getUserProfile(cred.user.uid);
    const role: "traveller" | "local" | "artisan" | "admin" = isOwner
      ? "admin"
      : existingProfile?.role === "admin"
      ? "traveller"
      : (existingProfile?.role || "traveller");
    const displayName = cred.user.displayName || existingProfile?.displayName || email.split("@")[0] || "User";

    const userObj = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role,
      verified: existingProfile?.verified || cred.user.emailVerified,
      photoURL: cred.user.photoURL,
    };

    // Update server session cookie
    await setServerSession(userObj, "credentials");

    return {
      success: true,
      user: userObj,
      idToken,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      errorCode: error.code,
      error: formatAuthError(error.code),
    };
  }
}

/**
 * Sign up a new user with Email, Password, Display Name, and Role.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: "traveller" | "local" | "artisan" = "traveller"
): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return {
      success: false,
      error: "Firebase Authentication is not configured.",
    };
  }

  try {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const idToken = await cred.user.getIdToken();

    const userEmail = email.trim().toLowerCase();
    const isOwner = userEmail === "jhasaurav562@gmail.com";
    const assignedRole: "traveller" | "local" | "artisan" | "admin" = isOwner
      ? "admin"
      : role;

    // Update Firebase Auth profile
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // Save profile to Cloud Firestore
    await syncUserProfile({
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: assignedRole,
      photoURL: null,
    });

    const userObj = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName,
      role: assignedRole,
      verified: false,
      photoURL: null,
    };

    // Update server session cookie
    await setServerSession(userObj, "credentials");

    return {
      success: true,
      user: userObj,
      idToken,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      errorCode: error.code,
      error: formatAuthError(error.code),
    };
  }
}

/**
 * Sign in with Google (Firebase popup).
 */
export async function signInWithGoogle(
  preferredRole: "traveller" | "local" | "artisan" = "traveller"
): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return {
      success: false,
      error: "Firebase Authentication is not configured.",
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({ prompt: "select_account" });

    const cred: UserCredential = await signInWithPopup(auth, provider);
    const idToken = await cred.user.getIdToken();

    // Retrieve or create profile in Cloud Firestore (only jhasaurav562@gmail.com is granted admin)
    const userEmail = (cred.user.email || "").trim().toLowerCase();
    const isOwner = userEmail === "jhasaurav562@gmail.com";
    const existingProfile = await getUserProfile(cred.user.uid);
    const role: "traveller" | "local" | "artisan" | "admin" = isOwner
      ? "admin"
      : existingProfile?.role === "admin"
      ? "traveller"
      : (existingProfile?.role || preferredRole);
    const displayName = cred.user.displayName || "Google User";

    if (!existingProfile) {
      await syncUserProfile({
        uid: cred.user.uid,
        email: cred.user.email || "",
        displayName,
        role,
        photoURL: cred.user.photoURL,
      });
    }

    const userObj = {
      uid: cred.user.uid,
      email: cred.user.email || "",
      displayName,
      role,
      verified: true,
      photoURL: cred.user.photoURL,
    };

    // Update server session cookie
    await setServerSession(userObj, "google");

    return {
      success: true,
      user: userObj,
      idToken,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      errorCode: error.code,
      error: formatAuthError(error.code),
    };
  }
}

/**
 * Sign out from Firebase and clear the server session.
 */
export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase sign out error:", err);
    }
  }

  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    console.warn("Failed to clear server session cookie:", err);
  }
}
