import { NextResponse } from "next/server";
import { getCurrentSession, serializeSession, SESSION_COOKIE_NAME, type AuthUserSession } from "@/lib/auth/session";

/**
 * GET /api/auth/me
 * Returns current authenticated user and session status.
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        photoUrl: session.photoUrl || null,
        role: session.role,
        provider: session.provider,
        isAdult: session.isAdult,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

/**
 * POST /api/auth/me
 * Quick demo sign-in or session update.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, id, email, displayName, name, role, photoUrl, provider } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = displayName || name ? String(displayName || name).trim() : cleanEmail.split("@")[0] || "Guest";
    const isAdminEmail =
      cleanEmail === "jhasaurav562@gmail.com" ||
      cleanEmail.includes("admin") ||
      cleanEmail.includes("moderator");
    const userRole = role || (isAdminEmail ? "admin" : "traveller");
    const uid = userId || id || "usr_" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
    const authProvider = provider || "credentials";

    const session: AuthUserSession = {
      userId: uid,
      email: cleanEmail,
      displayName: cleanName,
      photoUrl: photoUrl || null,
      role: userRole,
      isAdult: true,
      provider: authProvider,
      createdAt: new Date().toISOString(),
    };

    const serializedCookie = serializeSession(session);
    const response = NextResponse.json({
      success: true,
      message: "Session authenticated successfully",
      user: session,
    });

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
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

