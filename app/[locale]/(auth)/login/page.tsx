import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Sign In | प्रवेश करें - Atithi Devo Bhava",
  description:
    "Sign in to Atithi Devo Bhava using Google Firebase authentication or verified OTP to manage your cultural itineraries, connections, and stays.",
};

export default function LoginPage() {
  return (
    <div className="site-container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
      <LoginClient />
    </div>
  );
}

