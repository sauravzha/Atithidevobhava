# Google Firebase Authentication Setup Guide

This document describes how to configure Google Firebase Authentication for **Atithi Devo Bhava (अतिथि देवो भवः)**.

---

## 1. Overview and Invariants

Atithi Devo Bhava uses Google Firebase Authentication to provide quick, passwordless sign-in for international travellers and Indian residents.

Key security and privacy rules:
- **Strictly Adults Only (18+)**: All users must confirm adult status before authentication completes.
- **Zero Ad Trackers**: Firebase Auth is used exclusively for identity verification. No Google Analytics for Firebase, remarketing pixels, or third-party trackers are bundled.
- **Privacy First (DPDP Act Compliance)**: Contact details (phone numbers and full email addresses) remain strictly private behind dual mutual consent (`can_reveal()`).
- **Development Simulation Mode**: When Firebase credentials are not provided in `.env.local`, the platform automatically uses simulated Google authentication for local development and automated testing.

---

## 2. Firebase Console Configuration Steps

To configure real Google Sign-In credentials:

### Step 1: Create or Select a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and enter a name (e.g. `atithi-devo-bhava`).
3. You can disable Google Analytics for the project to maintain the zero-tracker standard.

### Step 2: Enable Google Authentication Provider
1. In the Firebase Console left navigation, select **Build** > **Authentication**.
2. Click **Get Started** if this is your first time.
3. In the **Sign-in method** tab, select **Google** from the list of providers.
4. Toggle **Enable**.
5. Select a project support email from the dropdown list.
6. Click **Save**.

### Step 3: Add Authorized Domains
1. In the **Authentication** section, click the **Settings** tab.
2. Select **Authorized domains**.
3. Ensure `localhost` is listed for local development.
4. Add your production domain (e.g. `atithidevobhava.in`).

### Step 4: Register a Web Application
1. In the Project Overview page, click the **Web** icon (`</>`) to register an application.
2. Enter an app nickname (e.g. `Atithi Devo Bhava Web`).
3. Do not check Firebase Hosting unless you intend to use it.
4. Click **Register app**.
5. Copy the configuration object values provided by Firebase.

---

## 3. Environment Variables Configuration

Create or update `.env.local` in the project root with the values from your Firebase Web App:

```bash
# Google Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="atithi-devo-bhava.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="atithi-devo-bhava"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="atithi-devo-bhava.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

---

## 4. Development Simulation Mode

When the `NEXT_PUBLIC_FIREBASE_API_KEY` environment variable is omitted or left blank:
- The `/login` and `/register` pages automatically display a subtle notice: `Development simulation mode active`.
- Clicking **Continue with Google** simulates a verified Google profile (`dev.traveller@example.com`) without network calls to external Google servers.
- The server issues an authenticated `adb_session` cookie, allowing end-to-end testing of authenticated dashboards, bookings, and connections.

---

## 5. Session Architecture

1. **Client**: Authenticates via `signInWithGoogleFirebase()` using Firebase `signInWithPopup()`.
2. **Bridge**: Client sends the credential token to `POST /api/auth/google`.
3. **Server Validation**: The server verifies the adult (18+) status confirmation and creates an `adb_session` cookie.
4. **Cookie Security**:
   - `httpOnly: true` (inaccessible to JavaScript)
   - `sameSite: "lax"` (CSRF defense)
   - `secure: true` (in production over HTTPS)
   - Cross-Origin-Opener-Policy: `same-origin-allow-popups` (allows OAuth popup completion)

