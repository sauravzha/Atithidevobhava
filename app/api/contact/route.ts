import { NextResponse } from "next/server";
import { submitContactInquiry } from "@/lib/supabase/services/contact";
import { getAuthenticatedUser } from "@/lib/auth/server-user";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let subject = "";
    let message = "";
    let phone: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name || "";
      email = body.email || "";
      subject = body.subject || body.topic || "General Inquiry";
      message = body.message || "";
      phone = body.phone;
    } else {
      const formData = await request.formData();
      name = String(formData.get("name") || "");
      email = String(formData.get("email") || "");
      subject = String(formData.get("topic") || formData.get("subject") || "General Inquiry");
      message = String(formData.get("message") || "");
      phone = formData.get("phone") ? String(formData.get("phone")) : undefined;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const user = await getAuthenticatedUser();

    const res = await submitContactInquiry({
      userId: user?.id,
      name,
      email,
      phone,
      subject,
      message,
    });

    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error || "Failed to record inquiry." },
        { status: 500 }
      );
    }

    // If submitted via standard form action, redirect back with query flag
    const referer = request.headers.get("referer");
    if (referer && !contentType.includes("application/json")) {
      const redirectUrl = new URL(referer);
      redirectUrl.searchParams.set("submitted", "true");
      return NextResponse.redirect(redirectUrl.toString(), 303);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us. Your message has been received.",
      submissionId: res.submissionId,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Error processing message" },
      { status: 500 }
    );
  }
}

