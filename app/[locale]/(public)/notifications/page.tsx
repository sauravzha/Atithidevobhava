import type { Metadata } from "next";
import Link from "next/link";
import { Bi } from "@/components/ui/bi";
import { NotificationsClient } from "./notifications-client";

export const metadata: Metadata = {
  title: "Notifications | सूचनाएं - Atithi Devo Bhava",
  description: "In-app notifications for messages, connections, and safety updates.",
};

interface NotificationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NotificationsPage({
  params,
}: NotificationsPageProps) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  // Initial sample in-app notifications
  const initialNotifications = [
    {
      id: "notif-001",
      type: "new_message",
      title: isHindi ? "नया संदेश प्राप्त हुआ" : "New Message Received",
      body: isHindi
        ? "सुनीता देवी झा ने जितवारपुर कार्यशाला के संबंध में एक संदेश भेजा है।"
        : "Sunita Devi Jha sent a message regarding the Jitwarpur workshop.",
      linkUrl: "/messages/conv-001",
      isRead: false,
      createdAt: "2026-11-09T14:30:00Z",
    },
    {
      id: "notif-002",
      type: "connection_accepted",
      title: isHindi ? "स्थानीय मिलन अनुरोध स्वीकृत" : "Connection Request Accepted",
      body: isHindi
        ? "रामेश्वर चौधरी ने आपका मिलन अनुरोध स्वीकार कर लिया है। आप सुरक्षित चैट शुरू कर सकते हैं।"
        : "Rameshwar Choudhary accepted your meetup request. You may now message each other.",
      linkUrl: "/connections/conn-002",
      isRead: true,
      createdAt: "2026-11-08T11:00:00Z",
    },
    {
      id: "notif-003",
      type: "safety_checkin",
      title: isHindi ? "सुरक्षा चेक-इन अनुस्मारक" : "Safety Check-In Reminder",
      body: isHindi
        ? "कृपया अपने निर्धारित मिलन स्थल पर पहुँचने के पश्चात आगमन की पुष्टि करें।"
        : "Please confirm your safe arrival at the public civic landmark.",
      linkUrl: "/messages/conv-001",
      isRead: true,
      createdAt: "2026-11-07T09:00:00Z",
    },
  ];

  return (
    <div className="site-container py-10 max-w-3xl space-y-8">
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
            {isHindi ? "सूचनाएं" : "Notifications"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-primary block mb-1">
            {isHindi ? "अलर्ट एवं अपडेट" : "Alerts & Updates"}
          </span>
          <Bi
            hindi="मेरी सूचनाएं"
            english="My Notifications"
            as="h1"
            className="text-2xl md:text-3xl font-heading font-normal text-text"
          />
        </div>

        <div className="p-3 border border-rule rounded-sm bg-warm/20 text-xs text-secondary">
          <span className="font-semibold text-text block">
            {isHindi ? "इन-ऐप अलर्ट केंद्र" : "In-App Centre"}
          </span>
        </div>
      </header>

      {/* Interactive Notifications Client Component */}
      <NotificationsClient
        initialNotifications={initialNotifications}
        locale={locale}
      />
    </div>
  );
}
