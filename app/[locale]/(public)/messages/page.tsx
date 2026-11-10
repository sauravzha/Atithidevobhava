import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { VerificationLabel } from "@/components/ui/verification-label";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages | संदेश - Atithi Devo Bhava",
  description:
    "Private text messaging for accepted connections and cultural experience enquiries.",
};

interface MessagesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MessagesInboxPage({
  params,
}: MessagesPageProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // Demo conversations based on pilot interactions
  const conversations = [
    {
      id: "conv-001",
      counterpartId: "usr-sunita-jha",
      counterpartName: "Sunita Devi Jha",
      counterpartRole: isHindi ? "वरिष्ठ शिल्पकार" : "Master Artisan",
      districtName: isHindi ? "मधुबनी" : "Madhubani",
      contextType: isHindi ? "अनुभव पूछताछ" : "Experience Enquiry",
      contextTitle: isHindi
        ? "जितवारपुर में मिथिला चित्रकला और प्राकृतिक रंग निर्माण"
        : "Mithila Painting and Natural Pigment Craft in Jitwarpur",
      lastMessage: isHindi
        ? "नमस्ते, आपकी पूछताछ स्वीकार कर ली गई है। आइए मिलकर नागरिक मिलन स्थल और समय तय करें।"
        : "Greetings, your cultural enquiry is accepted. Let us coordinate the public meeting time and details.",
      lastMessageAt: "2026-11-09T14:30:00Z",
      unreadCount: 1,
      isActive: true,
    },
    {
      id: "conv-002",
      counterpartId: "usr-rameshwar-choudhary",
      counterpartName: "Rameshwar Choudhary",
      counterpartRole: isHindi ? "तालाब कृषक" : "Pond Cultivator",
      districtName: isHindi ? "दरभंगा" : "Darbhanga",
      contextType: isHindi ? "स्थानीय मिलन" : "Meet a Local",
      contextTitle: isHindi ? "हराही झील के पास मिलन" : "Meetup near Harahi Lake",
      lastMessage: isHindi
        ? "हम 24 तारीख को सुबह 9 बजे हराही झील के उत्तरी द्वार पर मिल सकते हैं।"
        : "We can meet at 9:00 AM by the northern gate of Harahi Lake.",
      lastMessageAt: "2026-11-08T11:20:00Z",
      unreadCount: 0,
      isActive: true,
    },
  ];

  return (
    <div className="site-container py-10 max-w-4xl space-y-8">
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
            {isHindi ? "संदेश" : "Messages"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
            {isHindi ? "सुरक्षित संचार" : "Protected Communication"}
          </span>
          <Bi
            hindi="मेरे संदेश और संवाद"
            english="Messages & Conversations"
            as="h1"
            className="text-2xl md:text-3xl font-heading font-normal text-text"
          />
          <p className="text-xs text-secondary mt-1 max-w-prose">
            {isHindi
              ? "स्वीकृत संपर्कों और सांस्कृतिक अनुभवों के लिए निजी टेक्स्ट संदेश। कोई फाइल अटैचमेंट नहीं, लिंक केवल सादे पाठ के रूप में दिखते हैं।"
              : "Private text messaging for accepted connections. Pure text only, no attachments, links render as plain text."}
          </p>
        </div>

        <div className="text-xs text-secondary bg-warm/20 p-2.5 border border-rule rounded-sm max-w-xs">
          <span className="font-semibold text-text block mb-0.5 flex items-center gap-1.5">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-forest" />
            {isHindi ? "सुरक्षा नियम (धारा 10)" : "Security Invariant (Section 10)"}
          </span>
          {isHindi
            ? "चैट केवल स्वीकृत सदस्यों के बीच खुली रहती है। ब्लॉक या रद्दीकरण पर चैट तुरंत बंद हो जाती है।"
            : "Protected by RLS. Active solely between accepted participants. Terminated on block or cancellation."}
        </div>
      </header>

      {/* Conversation List */}
      <section className="space-y-3">
        {conversations.length === 0 ? (
          <div className="p-12 border border-dashed border-rule rounded-sm text-center">
            <p className="text-xs text-secondary">
              {isHindi
                ? "अभी कोई सक्रिय संवाद नहीं है। जब कोई स्थानीय संपर्क या अनुभव पूछताछ स्वीकार होगी, तो चैट यहाँ प्रदर्शित होगी।"
                : "No active conversations yet. Once a connection request or enquiry is accepted, your chat will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-rule border border-rule rounded-sm bg-page">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="p-5 block hover:bg-warm/15 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-base font-medium text-text group-hover:text-primary transition-colors">
                      {conv.counterpartName}
                    </h2>
                    <VerificationLabel label={isHindi ? "सत्यापित" : "Verified"} />
                    <span className="text-xs text-secondary">
                      • {conv.districtName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span>
                      {new Date(conv.lastMessageAt).toLocaleDateString(
                        isHindi ? "hi-IN" : "en-IN",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-white rounded-sm">
                        {conv.unreadCount} {isHindi ? "नया" : "new"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-2">
                  {conv.contextType}:{" "}
                  <span className="text-text normal-case">{conv.contextTitle}</span>
                </div>

                <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                  {conv.lastMessage}
                </p>

                <div className="flex justify-end pt-2">
                  <span className="text-xs text-primary font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{isHindi ? "चैट खोलें" : "Open Conversation"}</span>
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
