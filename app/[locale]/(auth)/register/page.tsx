import type { Metadata } from "next";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = {
  title: "Create Account | खाता बनाएं - Atithi Devo Bhava",
  description:
    "Join Atithi Devo Bhava as an international traveller or verified Indian host. Authentic cultural connection with mutual consent and dignity.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  return (
    <div className="site-container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
      <RegisterClient initialRole={role} />
    </div>
  );
}

