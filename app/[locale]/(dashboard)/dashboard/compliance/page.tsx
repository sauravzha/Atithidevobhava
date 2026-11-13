import { redirect } from "next/navigation";
import Link from "next/link";
import { getHostComplianceRecordsAction } from "@/app/actions/accommodation";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { HostComplianceClient } from "./compliance-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HostCompliancePage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const result = await getHostComplianceRecordsAction();

  return (
    <div className="site-container py-10 max-w-4xl space-y-8">
      {/* Navigation */}
      <nav className="text-xs text-secondary flex items-center justify-between border-b border-rule pb-4">
        <Link
          href="/dashboard/experiences"
          className="hover:text-primary transition-colors"
        >
          &larr; {isHindi ? "डैशबोर्ड पर वापस जाएं" : "Back to Dashboard"}
        </Link>
        <span className="font-mono text-[11px] text-forest">
          {isHindi ? "अनुपालन एवं विदेशी नागरिक पंजी" : "Host Compliance & Foreign Guest Registry"}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
          {isHindi ? "मेजबान अनुपालन केंद्र (फॉर्म-सी / फॉर्म III)" : "Host Compliance Centre (Form C / Form III)"}
        </h1>
        <p className="text-xs text-secondary leading-relaxed max-w-2xl">
          {isHindi
            ? "भारतीय कानून के अंतर्गत विदेशी अतिथियों के आगमन की सूचना 24 घंटे के भीतर विदेशी क्षेत्रीय पंजीकरण कार्यालय (e-FRRO) को देना प्रत्येक मेजबान का अनिवार्य वैधानिक दायित्व है।"
            : "Under Indian law, every host accommodating foreign visitors has a statutory obligation to report their arrival within 24 hours to the Foreigners Regional Registration Office (e-FRRO)."}
        </p>
      </header>

      <HostComplianceClient
        compliance={result.data?.compliance || null}
        guestRecords={result.data?.guestRecords || []}
        isHindi={isHindi}
        userId={user.id}
      />
    </div>
  );
}

