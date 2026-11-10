import { createAdminClient } from "@/lib/supabase/admin";
import { AdminAuditLogsClient } from "./audit-logs-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminAuditLogsPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const adminClient = createAdminClient();
  const { data: logs } = await adminClient
    .from("admin_audit_logs")
    .select(`
      id,
      action,
      target_entity,
      target_id,
      performed_by,
      reason,
      ip_address,
      metadata,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-4">
        <h1 className="font-heading text-2xl text-text font-normal">
          {isHindi ? "अपरिवर्तनीय प्रशासनिक ऑडिट लॉग" : "Immutable Administrative Audit Trail"}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isHindi
            ? "धारा 23: प्रत्येक प्रशासनिक हस्तक्षेप, निलंबन, सत्यापन एवं पहचान दस्तावेज़ देखने का रिकॉर्ड यहां अपरिवर्तनीय रूप से संचित होता है।"
            : "Section 23: Every moderation decision, user suspension, accommodation triage, and identity document view is permanently recorded."}
        </p>
      </header>

      <AdminAuditLogsClient
        logs={logs || []}
        isHindi={isHindi}
      />
    </div>
  );
}
