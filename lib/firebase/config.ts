/**
 * Firebase Client Initialization for Atithi Devo Bhava (अतिथि देवो भवः).
 * Integrates Firebase Auth and Cloud Firestore.
 * Spec reference: Section 2, 5, 20 of docs/SPEC.md.
 * Invariants: Zero tracking cookies, safe browser/server boundary handling,
 * clear fallback when environment variables are not configured.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyB1aCoJ2044BNDWaZ7PLXz_V6Sf-6I7Hhk",
  authDomain: "aatihidevobhava.firebaseapp.com",
  projectId: "aatihidevobhava",
  storageBucket: "aatihidevobhava.firebasestorage.app",
  messagingSenderId: "362634097507",
  appId: "1:362634097507:web:14a150e9f07d99c0815956",
};

export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  };
}

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

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isFirebaseConfigured()) {
    return null;
  }

  if (appInstance) {
    return appInstance;
  }

  if (getApps().length > 0) {
    appInstance = getApp();
    return appInstance;
  }

  const config = getFirebaseConfig();
  appInstance = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });

  return appInstance;
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  authInstance = getAuth(app);
  return authInstance;
}

export function getFirebaseDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  dbInstance = getFirestore(app);
  return dbInstance;
}

