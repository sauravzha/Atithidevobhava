import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";
import { Bi } from "@/components/ui/bi";
import { ScheduleManagerClient } from "./schedule-client";
import { ArrowLeft } from "lucide-react";

interface SchedulePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Manage Experience Schedules | सत्र प्रबंधन - Atithi Devo Bhava",
  };
}

export default async function ExperienceSchedulesPage({
  params,
}: SchedulePageProps) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  const exp = PILOT_EXPERIENCES.find((e) => e.id === id || e.slug === id);

  if (!exp) {
    notFound();
  }

  // Initial sample schedules for demonstration
  const initialSchedules = [
    {
      id: "sch-001",
      experienceId: exp.id,
      startTime: "2026-11-20T09:30:00Z",
      endTime: "2026-11-20T12:30:00Z",
      capacity: exp.maxParticipants,
      bookedCount: 2,
    },
    {
      id: "sch-002",
      experienceId: exp.id,
      startTime: "2026-11-24T14:00:00Z",
      endTime: "2026-11-24T17:00:00Z",
      capacity: exp.maxParticipants,
      bookedCount: 0,
    },
    {
      id: "sch-003",
      experienceId: exp.id,
      startTime: "2026-11-28T09:30:00Z",
      endTime: "2026-11-28T12:30:00Z",
      capacity: exp.maxParticipants,
      bookedCount: 0,
    },
  ];

  return (
    <div className="site-container py-10 max-w-4xl space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/experiences"
        className="text-xs text-secondary hover:text-text inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        <span>{isHindi ? "प्रदाता डैशबोर्ड पर लौटें" : "Back to Provider Dashboard"}</span>
      </Link>

      {/* Header */}
      <header className="border-b border-rule pb-6 space-y-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-primary block">
          {isHindi ? "सत्र एवं समय प्रबंधन" : "Schedules & Capacity Management"}
        </span>
        <Bi
          hindi={exp.titleHi}
          english={exp.titleEn}
          as="h1"
          className="text-2xl font-heading font-normal text-text"
        />
        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-1">
          <span>{isHindi ? exp.districtNameHi : exp.districtName}</span>
          <span>•</span>
          <span>{isHindi ? exp.durationHi : exp.durationEn}</span>
          <span>•</span>
          <span>
            {isHindi
              ? `अधिकतम क्षमता: ${exp.maxParticipants} प्रतिभागी`
              : `Max Capacity: ${exp.maxParticipants} people`}
          </span>
        </div>
      </header>

      {/* Schedule Manager Component */}
      <ScheduleManagerClient
        experienceId={exp.id}
        maxParticipants={exp.maxParticipants}
        initialSchedules={initialSchedules}
        locale={locale}
      />
    </div>
  );
}
