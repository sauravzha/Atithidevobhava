import { createAdminClient } from "@/lib/supabase/admin";
import { AdminVerificationsClient } from "./verifications-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminVerificationsPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const adminClient = createAdminClient();
  const { data: records } = await adminClient
    .from("verification_records")
    .select(`
      id,
      user_id,
      verification_type,
      status,
      provider,
      id_document_image_path,
      selfie_image_path,
      reviewed_by,
      reviewed_at,
      decision_reason,
      auto_purge_scheduled_at,
      created_at,
      users (
        email
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-4">
        <h1 className="font-heading text-2xl text-text font-normal">
          {isHindi ? "पहचान सत्यापन एवं सुरक्षा समीक्षा" : "Identity Verification & Document Review"}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isHindi
            ? "सुरक्षित पहचान सत्यापन कतार। धारा 23: प्रत्येक दस्तावेज़ देखने पर लिखित कारण अनिवार्य है एवं ऑडिट लॉग में दर्ज होता है।"
            : "Secure identity verification queue. Section 23: Written justification is mandatory before viewing any identity document. Every single view is permanently recorded in the immutable audit log."}
        </p>
      </header>

      <AdminVerificationsClient
        records={records || []}
        isHindi={isHindi}
      />
    </div>
  );
}
