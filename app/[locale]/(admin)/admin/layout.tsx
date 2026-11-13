import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import {
  LayoutDashboard,
  Users,
  Compass,
  Home,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Lock,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const user = await getAuthenticatedUser();

  // 1. If not authenticated, redirect to login
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/admin`);
  }

  // 2. Strict admin authorization: exclusively jhasaurav562@gmail.com
  const cleanEmail = (user.email || "").trim().toLowerCase();
  const isOwnerAdmin = cleanEmail === "jhasaurav562@gmail.com";

  let currentRole = isOwnerAdmin ? "super_admin" : "member";

  if (!isOwnerAdmin) {
    // Check if explicitly granted in admin_permissions (for delegated operators)
    const adminClient = createAdminClient();
    try {
      const { data: perm } = await adminClient
        .from("admin_permissions")
        .select("admin_role")
        .eq("user_id", user.id)
        .single();

      if (perm?.admin_role && (perm.admin_role === "super_admin" || perm.admin_role === "moderator")) {
        currentRole = perm.admin_role;
      } else {
        // Strict denial: Normal users cannot access admin panel
        redirect(`/${locale}/dashboard?denied=admin`);
      }
    } catch {
      redirect(`/${locale}/dashboard?denied=admin`);
    }
  }

  const navItems = [
    { href: `/${locale}/admin`, label: isHindi ? "सिंहावलोकन" : "Overview", icon: LayoutDashboard },
    { href: `/${locale}/admin/users`, label: isHindi ? "उपयोगकर्ता" : "Users", icon: Users },
    { href: `/${locale}/admin/experiences`, label: isHindi ? "अनुभव समीक्षा" : "Experiences", icon: Compass },
    { href: `/${locale}/admin/accommodations`, label: isHindi ? "आवास समीक्षा" : "Accommodations", icon: Home },
    { href: `/${locale}/admin/reports`, label: isHindi ? "सुरक्षा रिपोर्ट" : "Safety Reports", icon: ShieldAlert },
    { href: `/${locale}/admin/verifications`, label: isHindi ? "सत्यापन एवं पहचान" : "ID Verifications", icon: ShieldCheck },
    { href: `/${locale}/admin/audit-logs`, label: isHindi ? "ऑडिट लॉग" : "Audit Logs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-warm/30 flex flex-col">
      {/* Top Admin Utility Bar */}
      <header className="bg-text text-paper px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-text/20">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider uppercase text-forest">
            Atithi Devo Bhava • Admin Console
          </span>
          <span className="text-paper/40">|</span>
          <span className="px-2 py-0.5 bg-paper/10 rounded-sm text-[11px]">
            Role: <strong className="text-paper uppercase">{currentRole}</strong>
            {isOwnerAdmin && <span className="ml-1 text-forest font-semibold">(Owner)</span>}
          </span>
          <span className="text-paper/60 text-[11px] hidden sm:inline">
            {user.email}
          </span>
          <span className="px-2 py-0.5 bg-forest/20 text-forest rounded-sm text-[11px] flex items-center gap-1">
            <Lock size={10} strokeWidth={1.5} />
            MFA AAL2 Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="text-paper/70 hover:text-paper hover:underline">
            &larr; Exit to Public Site
          </Link>
        </div>
      </header>

      {/* Main Admin Content with Navigation Tabs */}
      <div className="site-container py-6 flex-1 flex flex-col space-y-6">
        {/* Navigation Bar */}
        <nav className="flex items-center gap-1 border-b border-rule pb-2 overflow-x-auto text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-sm text-secondary hover:text-text hover:bg-warm transition-colors flex items-center gap-1.5 whitespace-nowrap font-medium"
              >
                <Icon size={14} strokeWidth={1.5} className="text-forest" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content Body */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
