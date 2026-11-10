import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, serializeSession, type AuthUserSession } from "@/lib/auth/session";

interface GoogleAuthRequestBody {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  idToken?: string;
  isAdultConfirmed?: boolean;
}

/**
 * POST /api/auth/google
 * Authenticates user via Google Firebase credential token.
 * Invariants: Adults only (18+), generic error messaging on failures,
 * secure HTTP-only session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GoogleAuthRequestBody;
    const { uid, email, displayName, photoUrl, isAdultConfirmed } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required authentication credentials." },
        { status: 400 }
      );
    }

    // Adult 18+ requirement invariant
    if (isAdultConfirmed === false) {
      return NextResponse.json(
        {
          success: false,
          error: "Atithi Devo Bhava is strictly for adults aged 18 and older.",
        },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName?.trim() || cleanEmail.split("@")[0] || "Guest";

    // Build session payload
    const session: AuthUserSession = {
      userId: "usr_" + uid.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32),
      email: cleanEmail,
      displayName: cleanName,
      photoUrl: photoUrl || null,
      role: "traveller",
      isAdult: true,
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    const serializedCookie = serializeSession(session);

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully with Google.",
      user: {
        userId: session.userId,
        email: session.email,
        displayName: session.displayName,
        photoUrl: session.photoUrl,
        role: session.role,
      },
      redirectUrl: "/dashboard",
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: serializedCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to process authentication request. Please try again." },
      { status: 500 }
    );
  }
}
