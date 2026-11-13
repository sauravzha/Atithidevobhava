/**
 * Cloud Firestore Database Operations for Atithi Devo Bhava.
 * Invariants: Least privilege, 18+ adult verification, zero storage of Aadhaar/Passport,
 * sanitized public models, safe handling when offline or unconfigured.
 */

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: "traveller" | "local" | "artisan" | "admin";
  verified: boolean;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  bio?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FirestoreExperience {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  category: string;
  price: number;
  durationMinutes: number;
  status: "draft" | "pending_approval" | "published" | "paused";
  location: {
    district: string;
    state: string;
    locality?: string;
  };
  meetingSpot?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FirestoreBooking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  hostId: string;
  hostName: string;
  travellerId: string;
  travellerName: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  guestsCount: number;
  totalAmount: number;
  createdAt?: unknown;
}

/**
 * Save or update user profile document in Firestore `users/{uid}`.
 */
export async function syncUserProfile(profile: {
  uid: string;
  email: string;
  displayName: string;
  role?: "traveller" | "local" | "artisan" | "admin";
  photoURL?: string | null;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
}): Promise<FirestoreUserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    const userRef = doc(db, "users", profile.uid);
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      const data = existing.data() as FirestoreUserProfile;
      const updates: Partial<FirestoreUserProfile> = {
        displayName: profile.displayName || data.displayName,
        updatedAt: serverTimestamp(),
      };
      if (profile.photoURL !== undefined) updates.photoURL = profile.photoURL;
      if (profile.phone) updates.phone = profile.phone;
      if (profile.state) updates.state = profile.state;
      if (profile.district) updates.district = profile.district;

      await updateDoc(userRef, updates);
      return { ...data, ...updates };
    }

    const newProfile: FirestoreUserProfile = {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL || null,
      role: profile.role || "traveller",
      verified: false,
      phone: profile.phone || null,
      state: profile.state || "Bihar",
      district: profile.district || "Darbhanga",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (err) {
    console.warn("Failed to sync Firestore user profile:", err);
    return null;
  }
}

/**
 * Fetch a user profile by UID from Firestore.
 */
export async function getUserProfile(uid: string): Promise<FirestoreUserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUserProfile;
  } catch (err) {
    console.warn("Failed to fetch user profile from Firestore:", err);
    return null;
  }
}

/**
 * Fetch published cultural experiences from Firestore.
 */
export async function getPublishedExperiences(): Promise<FirestoreExperience[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const experiencesRef = collection(db, "experiences");
    const q = query(experiencesRef, where("status", "==", "published"));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<FirestoreExperience, "id">),
    }));
  } catch (err) {
    console.warn("Failed to fetch experiences from Firestore:", err);
    return [];
  }
}

/**
 * Fetch bookings for a specific user (either as traveller or host).
 */
export async function getUserBookings(
  userId: string,
  role: "traveller" | "host" = "traveller"
): Promise<FirestoreBooking[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const bookingsRef = collection(db, "bookings");
    const fieldToQuery = role === "host" ? "hostId" : "travellerId";
    const q = query(bookingsRef, where(fieldToQuery, "==", userId));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<FirestoreBooking, "id">),
    }));
  } catch (err) {
    console.warn("Failed to fetch bookings from Firestore:", err);
    return [];
  }
}

/**
 * Create a new booking in Firestore.
 */
export async function createFirestoreBooking(
  bookingData: Omit<FirestoreBooking, "id" | "createdAt">
): Promise<string | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    const bookingId = "bk_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    const bookingRef = doc(db, "bookings", bookingId);

    await setDoc(bookingRef, {
      ...bookingData,
      id: bookingId,
      createdAt: serverTimestamp(),
    });

    return bookingId;
  } catch (err) {
    console.warn("Failed to create Firestore booking:", err);
    return null;
  }
}
