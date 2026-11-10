import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { TripShareGenerator } from "./generator";
import { ShieldCheck, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Share Trip Plan with Trusted Contact | यात्रा साझा करें - Atithi Devo Bhava",
  description:
    "Generate a secure, expiring trip share link for a trusted family member or friend. Strictly limited non-sensitive itinerary details.",
};

interface TripSharePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ connectionId?: string; bookingId?: string }>;
}

export default async function TripSharePage({
  params,
  searchParams,
}: TripSharePageProps) {
  const { locale } = await params;
  const { connectionId, bookingId } = await searchParams;
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-10 max-w-xl space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-secondary" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/safety" className="hover:text-primary transition-colors">
              {isHindi ? "सुरक्षा" : "Safety"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "यात्रा योजना साझा करें" : "Share Trip Plan"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary">
          <Share2 size={14} strokeWidth={1.5} />
          <span>{isHindi ? "विश्वसनीय संपर्क उपकरण" : "Trusted Contact Tool"}</span>
        </div>
        <Bi
          hindi="विश्वसनीय संपर्क के साथ यात्रा योजना साझा करें"
          english="Share Itinerary with a Trusted Contact"
          as="h1"
          className="text-2xl font-heading font-normal text-text"
        />
        <p className="text-xs text-secondary leading-relaxed">
          {isHindi
            ? "अपने परिवार के किसी सदस्य या मित्र के साथ सुरक्षित, समय-सीमित लिंक साझा करें ताकि उन्हें आपकी यात्रा की जानकारी रहे।"
            : "Generate a secure, expiring link for a family member or friend so they are informed of your itinerary and general location."}
        </p>
      </header>

      {/* Strict Privacy Governance Notice */}
      <div className="p-4 border border-rule rounded-sm bg-warm/25 space-y-2 text-xs text-secondary">
        <span className="font-semibold text-text block flex items-center gap-1.5">
          <ShieldCheck size={14} strokeWidth={1.5} className="text-forest" />
          {isHindi ? "सख्त गोपनीयता सीमा (धारा 12)" : "Strict Privacy Boundary (Section 12)"}
        </span>
        <p className="leading-relaxed">
          {isHindi
            ? "आपके संपर्क को केवल मेजबान का पहला नाम, जिला और निर्धारित तिथियां दिखाई जाएंगी। निजी आवासीय पते, सटीक जीपीएस निर्देशांक या निजी फोन नंबर कभी साझा नहीं किए जाते।"
            : "Your trusted contact receives strictly high-level non-sensitive details: host first name, district, and interaction dates. Exact residential addresses and private phone numbers are never disclosed."}
        </p>
      </div>

      {/* Generator Form */}
      <TripShareGenerator
        connectionId={connectionId}
        bookingId={bookingId}
        locale={locale}
      />
    </div>
  );
}
