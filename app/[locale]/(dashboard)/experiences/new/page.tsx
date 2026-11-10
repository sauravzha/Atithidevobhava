import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";
import { ExperienceCreationForm } from "./form";

export const metadata: Metadata = {
  title: "Publish a Cultural Experience | अनुभव प्रकाशित करें - Atithi Devo Bhava",
  description:
    "List a cultural experience, craft demonstration, or guided walk for international travelers and cultural visitors. Undergoes editorial and safety review before publication.",
};

interface CreateExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateExperiencePage({
  params,
}: CreateExperiencePageProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  return (
    <div className="site-container py-10 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/dashboard/experiences" className="hover:text-primary transition-colors">
              {isHindi ? "अनुभव प्रबंधन" : "Provider Dashboard"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "नया अनुभव बनाएं" : "Create New Experience"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 mb-8 space-y-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-primary block">
          {isHindi ? "उत्पाद 2: सांस्कृतिक अनुभव" : "Product B: Cultural Experience"}
        </span>
        <Bi
          hindi="नया सांस्कृतिक अनुभव सूचीबद्ध करें"
          english="List a Cultural Experience"
          as="h1"
          className="text-2xl md:text-3xl font-heading font-normal text-text"
        />
        <p className="text-xs text-secondary max-w-prose leading-relaxed">
          {isHindi
            ? "कारीगरों, रसोइयों, लोक इतिहासकारों और निवासियों के लिए। प्रत्येक सूची का प्रकाशन से पूर्व हमारी संपादकीय टीम द्वारा सत्यापन किया जाता है।"
            : "For local artisans, home cooks, historians, and residents. Every listing undergoes verification by our editorial team before being published."}
        </p>
      </header>

      {/* Editorial Standards Notice */}
      <div className="mb-8 space-y-4">
        <Notice variant="default">
          <strong className="block mb-1 font-semibold text-text">
            {isHindi ? "संपादकीय एवं सुरक्षा मानक" : "Editorial & Safety Invariants"}
          </strong>
          <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4">
            <li>
              <strong className="text-text">
                {isHindi ? "केवल सार्वजनिक मिलन स्थल: " : "Public Meeting Venues Only: "}
              </strong>
              {isHindi
                ? "निजी आवासीय पते कभी सार्वजनिक रूप से प्रदर्शित नहीं होंगे। बैठक स्थल किसी प्रसिद्ध सार्वजनिक या नागरिक स्थल पर होना चाहिए।"
                : "Exact residential addresses are strictly confidential. Initial meeting points must be designated at recognizable public landmarks."}
            </li>
            <li>
              <strong className="text-text">
                {isHindi ? "वास्तविक तस्वीरें: " : "Authentic Photography: "}
              </strong>
              {isHindi
                ? "केवल वास्तविक, स्व-स्वामित्व वाली या लाइसेंस प्राप्त तस्वीरें स्वीकार्य हैं। स्टॉक तस्वीरों की अनुमति नहीं है।"
                : "Real, licensed, or host-owned photographs only. Generic promotional or stock photography is not permitted."}
            </li>
            <li>
              <strong className="text-text">
                {isHindi ? "चरण 1 केवल पूछताछ: " : "Phase 1 Enquiry Model: "}
              </strong>
              {isHindi
                ? "प्रारंभिक पायलट चरण में मूल्य छुपाए जाते हैं और केवल पूछताछ स्वीकार की जाती है।"
                : "During our pilot phase, listings operate in enquiry mode to prioritize authentic cultural compatibility."}
            </li>
          </ul>
        </Notice>
      </div>

      {/* Form Component */}
      <ExperienceCreationForm locale={locale} />
    </div>
  );
}
