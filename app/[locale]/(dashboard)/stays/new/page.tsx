import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { CreateStayListingForm } from "./form";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function NewAccommodationListingPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="site-container py-10 max-w-3xl space-y-8">
      {/* Navigation */}
      <nav className="text-xs text-secondary flex items-center justify-between border-b border-rule pb-4">
        <Link
          href="/explore/stays"
          className="hover:text-primary transition-colors"
        >
          &larr; {isHindi ? "पारिवारिक आवास सूची पर वापस" : "Back to Stays"}
        </Link>
        <span className="font-mono text-[11px] text-forest">
          {isHindi ? "चरण 3: आवास पंजीकरण" : "Phase 3: Host Listing Editor"}
        </span>
      </nav>

      <header className="space-y-2">
        <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
          {isHindi ? "नया पारिवारिक आवास सूचीबद्ध करें" : "Publish Accommodation Listing"}
        </h1>
        <p className="text-xs text-secondary leading-relaxed">
          {isHindi
            ? "अपने पारिवारिक घर या होमस्टे में अतिथियों के स्वागत हेतु विवरण दर्ज करें। आवासीय पते की गोपनीयता और सुरक्षा नियमों का पालन अनिवार्य है।"
            : "List your guest quarters or family homestay. Address privacy, household transparency, and safety compliance are strictly required."}
        </p>
      </header>

      <CreateStayListingForm isHindi={isHindi} />
    </div>
  );
}

