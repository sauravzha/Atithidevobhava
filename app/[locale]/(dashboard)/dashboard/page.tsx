import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { DashboardClient } from "./dashboard-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export const metadata = {
  title: "Dashboard | डैशबोर्ड - Atithi Devo Bhava",
  description: "Manage your cultural itineraries, connections, experiences, and safety check-ins.",
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="site-container py-8 sm:py-12">
      <DashboardClient user={user} locale={locale} />
    </div>
  );
}

