import { createAdminClient } from "@/lib/supabase/admin";
import { AdminReportsClient } from "./reports-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminReportsPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const adminClient = createAdminClient();
  const { data: reports } = await adminClient
    .from("reports")
    .select(`
      id,
      reporter_id,
      reported_user_id,
      reason,
      target_entity,
      target_id,
      details,
      snapshot_messages,
      is_urgent,
      status,
      resolution_notes,
      created_at
    `)
    .order("is_urgent", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-4">
        <h1 className="font-heading text-2xl text-text font-normal">
          {isHindi ? "सुरक्षा एवं घटना ट्राइएज कतार" : "Safety & Incident Triage Queue"}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isHindi
            ? "सुरक्षा घटनाओं, उत्पीड़न एवं आचार संहिता उल्लंघनों की जांच करें। 20-संदेश स्नैपशॉट का विश्लेषण करें।"
            : "Investigate safety reports, harassment claims, and conduct violations. Inspect 20-message transcript snapshots and enforce corrective actions."}
        </p>
      </header>

      <AdminReportsClient
        reports={reports || []}
        isHindi={isHindi}
      />
    </div>
  );
}
