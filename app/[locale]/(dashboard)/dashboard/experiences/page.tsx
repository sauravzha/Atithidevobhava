import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { StatusLabel } from "@/components/ui/status-label";
import { PILOT_EXPERIENCES } from "@/lib/data/pilot-experiences";
import { EnquiriesManager } from "./enquiries-manager";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Provider Dashboard | अनुभव प्रबंधन - Atithi Devo Bhava",
  description:
    "Manage your cultural experience listings, review incoming traveler enquiries, and coordinate schedules.",
};

interface ProviderDashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function ProviderExperiencesDashboard({
  params,
}: ProviderDashboardProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // Mock initial provider listings based on pilot catalog
  const listings = PILOT_EXPERIENCES.slice(0, 2).map((exp, idx) => ({
    id: exp.id,
    slug: exp.slug,
    titleEn: exp.titleEn,
    titleHi: exp.titleHi,
    categoryNameEn: exp.categoryNameEn,
    categoryNameHi: exp.categoryNameHi,
    districtName: exp.districtName,
    districtNameHi: exp.districtNameHi,
    durationEn: exp.durationEn,
    durationHi: exp.durationHi,
    maxParticipants: exp.maxParticipants,
    status: idx === 0 ? "published" : "pending_review",
    enquiriesCount: idx === 0 ? 2 : 0,
  }));

  // Initial demo enquiries for the pilot experience
  const sampleEnquiries = [
    {
      id: "enq-001",
      experienceId: "exp-br-01",
      experienceTitleEn: "Mithila Painting and Natural Pigment Craft in Jitwarpur",
      experienceTitleHi: "जितवारपुर में मिथिला चित्रकला और प्राकृतिक रंग निर्माण",
      travellerName: "Elena Rostova",
      travellerResidence: "France",
      participantCount: 2,
      proposedDate: "2026-11-20",
      preferredLanguage: "English",
      message:
        "Hello Sunita-ji, I am a textile researcher visiting Madhubani. I would be honored to observe the natural dye preparation and line painting techniques.",
      status: "pending" as const,
      createdAt: "2026-11-09T10:30:00Z",
    },
    {
      id: "enq-002",
      experienceId: "exp-br-01",
      experienceTitleEn: "Mithila Painting and Natural Pigment Craft in Jitwarpur",
      experienceTitleHi: "जितवारपुर में मिथिला चित्रकला और प्राकृतिक रंग निर्माण",
      travellerName: "Marcus Vance",
      travellerResidence: "Australia",
      participantCount: 1,
      proposedDate: "2026-11-24",
      preferredLanguage: "English",
      message:
        "Namaste. I am visiting Bihar for cultural documentation. Could we schedule a morning session on the 24th?",
      status: "accepted" as const,
      createdAt: "2026-11-08T14:15:00Z",
    },
  ];

  return (
    <div className="site-container py-10 space-y-10">
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
            {isHindi ? "अनुभव प्रदाता डैशबोर्ड" : "Provider Dashboard"}
          </li>
        </ol>
      </nav>

      {/* Header & Primary Action */}
      <header className="border-b border-rule pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
            {isHindi ? "उत्पाद 2: सांस्कृतिक सूत्रधार केंद्र" : "Product B: Cultural Host Centre"}
          </span>
          <Bi
            hindi="अनुभव प्रबंधन डैशबोर्ड"
            english="Experience Host Dashboard"
            as="h1"
            className="text-2xl md:text-3xl font-heading font-normal text-text"
          />
          <p className="text-xs text-secondary mt-1 max-w-prose">
            {isHindi
              ? "अपनी सांस्कृतिक सूचियों की समीक्षा करें, नए सत्र तय करें और यात्रियों की पूछताछ का उत्तर दें।"
              : "Oversee your cultural listings, manage calendar slots, and respond to incoming traveler enquiries."}
          </p>
        </div>

        <Link
          href="/experiences/new"
          className="tap-target inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
        >
          <Plus size={14} strokeWidth={1.5} />
          <span>{isHindi ? "नया अनुभव बनाएं" : "Create New Experience"}</span>
        </Link>
      </header>

      {/* Statistics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-rule rounded-sm bg-warm/15 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-secondary block font-medium">
            {isHindi ? "कुल सूचियां" : "Total Listings"}
          </span>
          <span className="text-2xl font-heading font-normal text-text">
            {listings.length}
          </span>
        </div>

        <div className="p-4 border border-rule rounded-sm bg-warm/15 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-secondary block font-medium">
            {isHindi ? "प्रकाशित" : "Published"}
          </span>
          <span className="text-2xl font-heading font-normal text-forest">
            {listings.filter((l) => l.status === "published").length}
          </span>
        </div>

        <div className="p-4 border border-rule rounded-sm bg-warm/15 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-secondary block font-medium">
            {isHindi ? "समीक्षाधीन" : "Under Review"}
          </span>
          <span className="text-2xl font-heading font-normal text-terracotta">
            {listings.filter((l) => l.status === "pending_review").length}
          </span>
        </div>

        <div className="p-4 border border-rule rounded-sm bg-warm/15 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-secondary block font-medium">
            {isHindi ? "सक्रिय पूछताछ" : "Active Enquiries"}
          </span>
          <span className="text-2xl font-heading font-normal text-text">
            {sampleEnquiries.filter((e) => e.status === "pending").length}
          </span>
        </div>
      </section>

      {/* Section 1: Listings Directory */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <h2 className="font-heading text-xl font-medium text-text">
            {isHindi ? "मेरी सांस्कृतिक सूचियां" : "My Cultural Listings"}
          </h2>
          <span className="text-xs text-secondary">
            {listings.length} {isHindi ? "सूचियां" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {listings.map((item) => (
            <div
              key={item.id}
              className="p-5 border border-rule rounded-sm bg-page hover:border-primary/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-warm text-secondary border border-rule rounded-sm">
                    {isHindi ? item.categoryNameHi : item.categoryNameEn}
                  </span>
                  <StatusLabel
                    status={
                      item.status === "published"
                        ? isHindi
                          ? "प्रकाशित"
                          : "Published"
                        : isHindi
                        ? "संपादकीय समीक्षाधीन"
                        : "Under Editorial Review"
                    }
                    variant={item.status === "published" ? "success" : "warning"}
                  />
                </div>

                <h3 className="font-heading text-lg font-medium text-text">
                  {isHindi ? item.titleHi : item.titleEn}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} strokeWidth={1.5} className="text-primary" />
                    {isHindi ? item.districtNameHi : item.districtName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={1.5} className="text-primary" />
                    {isHindi ? item.durationHi : item.durationEn}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} strokeWidth={1.5} className="text-primary" />
                    {isHindi ? `अधिकतम ${item.maxParticipants} प्रतिभागी` : `Max ${item.maxParticipants} people`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                <Link
                  href={`/experiences/${item.id}`}
                  className="tap-target px-3 py-1.5 border border-rule hover:border-text text-text rounded-sm text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={12} strokeWidth={1.5} />
                  <span>{isHindi ? "सूची देखें" : "View Listing"}</span>
                </Link>

                <Link
                  href={`/dashboard/experiences/${item.id}/schedules`}
                  className="tap-target px-3 py-1.5 border border-rule hover:border-text text-text rounded-sm text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Calendar size={12} strokeWidth={1.5} />
                  <span>{isHindi ? "सत्र कैलेंडर" : "Schedules"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Incoming Enquiries Manager */}
      <section className="space-y-4 pt-4 border-t border-rule">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-medium text-text">
              {isHindi ? "आगंतुक पूछताछ प्रबंधन (चरण 1)" : "Incoming Cultural Enquiries (Phase 1)"}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              {isHindi
                ? "यात्रियों से सीधे अनुरोध। पूछताछ स्वीकार करने पर सुरक्षित संवाद चैनल खुल जाता है।"
                : "Direct requests from visitors. Accepting an enquiry opens a verified messaging channel to finalize public arrangements."}
            </p>
          </div>
        </div>

        <EnquiriesManager initialEnquiries={sampleEnquiries} locale={locale} />
      </section>
    </div>
  );
}
