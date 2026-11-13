import Link from "next/link";
import { adminGetMetricsAction } from "@/app/actions/admin";
import {
  Users,
  ShieldAlert,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminOverviewPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const metricsRes = await adminGetMetricsAction();
  const metrics = (metricsRes.data || {
    total_users: 0,
    users_by_role: {
      travellers: 0,
      local_members: 0,
      experience_providers: 0,
      accommodation_hosts: 0,
    },
    active_experiences: 0,
    active_stays: 0,
    pending_verifications: 0,
    pending_reports: 0,
    bookings: { total: 0, confirmed: 0 },
    financials: { gross_booking_paise: 0, platform_commission_paise: 0 },
  }) as {
    total_users: number;
    users_by_role: {
      travellers: number;
      local_members: number;
      experience_providers: number;
      accommodation_hosts: number;
    };
    active_experiences: number;
    active_stays: number;
    pending_verifications: number;
    pending_reports: number;
    bookings: { total: number; confirmed: number };
    financials: { gross_booking_paise: number; platform_commission_paise: number };
  };

  const grossInr = (metrics.financials.gross_booking_paise / 100).toLocaleString("en-IN");
  const commissionInr = (metrics.financials.platform_commission_paise / 100).toLocaleString("en-IN");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="border-b border-rule pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text font-normal">
            {isHindi ? "प्रशासनिक सिंहावलोकन एवं सांख्यिकी" : "Administrative Operations Overview"}
          </h1>
          <p className="text-xs text-secondary mt-1">
            {isHindi
              ? "प्लेटफ़ॉर्म की वास्तविक डेटा सांख्यिकी, सक्रिय कतारें और वित्तीय सारांश।"
              : "Real live metrics directly computed from PostgreSQL database tables. Zero simulated data."}
          </p>
        </div>
        <span className="font-mono text-[11px] text-secondary">
          {isHindi ? "अद्यतन समय: अभी" : "Real-time Telemetry"}
        </span>
      </header>

      {/* Critical Queue Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/${locale}/admin/reports`}
          className="p-5 border border-rule/80 rounded-sm postcard-paper hover:border-terracotta transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} strokeWidth={1.5} />
              {isHindi ? "सुरक्षा एवं घटना कतार" : "Safety Incident Triage Queue"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold text-text">
                {metrics.pending_reports}
              </span>
              <span className="text-xs text-secondary font-mono">
                {isHindi ? "लंबित रिपोर्टें" : "unresolved reports"}
              </span>
            </div>
          </div>
          <ArrowRight size={16} strokeWidth={1.5} className="text-secondary group-hover:text-terracotta transition-colors" />
        </Link>

        <Link
          href={`/${locale}/admin/verifications`}
          className="p-5 border border-rule/80 rounded-sm postcard-paper hover:border-forest transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-forest flex items-center gap-1.5 font-mono">
              <Users size={14} strokeWidth={1.5} />
              {isHindi ? "पहचान सत्यापन कतार" : "Identity Verification Queue"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold text-text">
                {metrics.pending_verifications}
              </span>
              <span className="text-xs text-secondary font-mono">
                {isHindi ? "लंबित दस्तावेज़" : "pending reviews"}
              </span>
            </div>
          </div>
          <ArrowRight size={16} strokeWidth={1.5} className="text-secondary group-hover:text-forest transition-colors" />
        </Link>
      </div>

      {/* Core Operational Metrics Grid */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2">
          {isHindi ? "समुदाय एवं इन्वेंट्री सारांश" : "Community & Catalog Summary"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-5 border border-rule rounded-sm journal-paper space-y-1.5 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] font-mono block">
              {isHindi ? "कुल उपयोगकर्ता" : "Total Registered Users"}
            </span>
            <p className="font-mono text-2xl font-semibold text-text">{metrics.total_users}</p>
            <p className="text-[11px] text-secondary font-mono">
              {metrics.users_by_role.travellers} travellers • {metrics.users_by_role.local_members} locals
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm journal-paper space-y-1.5 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] font-mono block">
              {isHindi ? "सक्रिय सांस्कृतिक अनुभव" : "Published Experiences"}
            </span>
            <p className="font-mono text-2xl font-semibold text-forest">{metrics.active_experiences}</p>
            <p className="text-[11px] text-secondary font-mono">
              by {metrics.users_by_role.experience_providers} providers
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm journal-paper space-y-1.5 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] font-mono block">
              {isHindi ? "सक्रिय पारिवारिक आवास" : "Approved Stay Listings"}
            </span>
            <p className="font-mono text-2xl font-semibold text-forest">{metrics.active_stays}</p>
            <p className="text-[11px] text-secondary font-mono">
              by {metrics.users_by_role.accommodation_hosts} hosts
            </p>
          </div>

          <div className="p-5 border border-rule rounded-sm journal-paper space-y-1.5 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] font-mono block">
              {isHindi ? "आरक्षण एवं बुकिंग" : "Bookings Created"}
            </span>
            <p className="font-mono text-2xl font-semibold text-text">{metrics.bookings.total}</p>
            <p className="text-[11px] text-forest font-mono">
              {metrics.bookings.confirmed} confirmed
            </p>
          </div>
        </div>
      </section>

      {/* Financial Telemetry (from real payments only) */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2 flex items-center gap-2">
          <CreditCard size={16} strokeWidth={1.5} className="text-forest" />
          <span>{isHindi ? "वित्तीय खाता-बही सारांश (वास्तविक भुगतान डेटा)" : "Financial Ledger Telemetry (Real Payments Only)"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-6 border border-rule rounded-sm postcard-paper space-y-2 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-mono">
              <TrendingUp size={13} strokeWidth={1.5} className="text-forest" />
              {isHindi ? "सकल बुकिंग मूल्य (INR)" : "Gross Booking Volume (Captured)"}
            </span>
            <p className="font-mono text-3xl font-semibold text-text">INR {grossInr}</p>
            <p className="text-[11px] text-secondary font-mono">
              Derived from payments table status = &apos;captured&apos;
            </p>
          </div>

          <div className="p-6 border border-rule rounded-sm postcard-paper space-y-2 shadow-xs">
            <span className="text-secondary uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-mono">
              <TrendingUp size={13} strokeWidth={1.5} className="text-forest" />
              {isHindi ? "मंच सेवा योगदान (15% कमीशन राजस्व)" : "Platform Commission Revenue (15% Ledger)"}
            </span>
            <p className="font-mono text-3xl font-semibold text-forest">INR {commissionInr}</p>
            <p className="text-[11px] text-secondary font-mono">
              Derived from double-entry ledger_entries account = &apos;platform_commission&apos;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
