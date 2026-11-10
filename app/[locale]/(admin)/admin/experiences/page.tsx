import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";
import { AdminModerationClient } from "./admin-moderation-client";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Experience Moderation | अनुभव समीक्षा - Atithi Devo Bhava",
  description:
    "Editorial moderation queue for cultural experience listings. Granular permission-governed approval, change requests, and append-only audit logging.",
};

interface AdminExperiencesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminExperiencesPage({
  params,
}: AdminExperiencesPageProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // Prepare moderation queue items from pilot data
  const initialItems = PILOT_EXPERIENCES.map((exp, idx) => ({
    id: exp.id,
    titleEn: exp.titleEn,
    titleHi: exp.titleHi,
    categoryNameEn: exp.categoryNameEn,
    categoryNameHi: exp.categoryNameHi,
    hostName: exp.hostName,
    hostNameHi: exp.hostNameHi,
    hostRole: exp.hostRoleEn,
    districtName: exp.districtName,
    generalMeetingArea: exp.generalAreaEn,
    durationEn: exp.durationEn,
    maxParticipants: exp.maxParticipants,
    descriptionEn: exp.descriptionEn,
    descriptionHi: exp.descriptionHi,
    status:
      idx === 0
        ? ("published" as const)
        : idx === 1
        ? ("pending_review" as const)
        : ("pending_review" as const),
    submittedAt: "2026-11-09T08:00:00Z",
  }));

  // Initial audit log items
  const initialAuditLogs = [
    {
      id: "log-001",
      adminName: "Senior Moderator (MFA AAL2)",
      action: "experience_moderated",
      targetTitle: "Mithila Painting and Natural Pigment Craft in Jitwarpur",
      decision: "approve",
      reason: "Artisan credentials and public meeting venue verified in Jitwarpur",
      timestamp: "2026-11-09T11:45:00Z",
    },
  ];

  return (
    <div className="site-container py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-secondary" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "संपादकीय एवं सुरक्षा समीक्षा" : "Admin Moderation Centre"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary mb-1">
            <ShieldCheck size={14} strokeWidth={1.5} />
            <span>{isHindi ? "संपादकीय प्रशासन" : "Content & Safety Moderation"}</span>
          </div>
          <Bi
            hindi="सांस्कृतिक अनुभव समीक्षा कतार"
            english="Experience Approval & Moderation Queue"
            as="h1"
            className="text-2xl md:text-3xl font-heading font-normal text-text"
          />
          <p className="text-xs text-secondary mt-1 max-w-prose">
            {isHindi
              ? "सार्वजनिक प्रकाशन से पूर्व प्रत्येक सांस्कृतिक सूची का सत्यापन। प्रत्येक संपादकीय निर्णय अनिवार्य ऑडिट लॉग के साथ सुरक्षित किया जाता है।"
              : "Review cultural listings prior to public discovery. Every moderation decision is enforced with an append-only audit trail."}
          </p>
        </div>

        <div className="text-xs text-secondary bg-warm/20 p-3 border border-rule rounded-sm max-w-xs">
          <strong className="text-text block mb-1">
            {isHindi ? "ऑडिट लॉग बाध्यता" : "Mandatory Audit Logging"}
          </strong>
          {isHindi
            ? "धारा 23: प्रत्येक अनुमोदन, अस्वीकृति या परिवर्तन अनुरोध का कारण डेटाबेस में अपरिवर्तनीय रूप से दर्ज होता है।"
            : "Section 23: Reason is strictly required for rejections and change requests. Recorded to append-only audit log."}
        </div>
      </header>

      {/* Interactive Admin Moderation Client Component */}
      <AdminModerationClient
        initialItems={initialItems}
        initialLogs={initialAuditLogs}
        locale={locale}
      />
    </div>
  );
}
