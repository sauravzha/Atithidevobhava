import type { Metadata } from "next";
import Link from "next/link";
import { ChatRoomClient } from "./chat-room";
import { ArrowLeft } from "lucide-react";

interface ChatPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Conversation | संवाद - Atithi Devo Bhava",
  };
}

export default async function ChatRoomPage({ params }: ChatPageProps) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  // Demo active conversation state
  const conversation = {
    id,
    connectionId: "conn-001",
    bookingId: undefined,
    counterpart: {
      id: "usr-sunita-jha",
      name: "Sunita Devi Jha",
      role: isHindi ? "वरिष्ठ शिल्पकार" : "Master Artisan",
      district: isHindi ? "मधुबनी" : "Madhubani",
      state: isHindi ? "बिहार" : "Bihar",
    },
    contextTitle: isHindi
      ? "जितवारपुर में मिथिला चित्रकला कार्यशाला"
      : "Mithila Painting Workshop in Jitwarpur",
    isActive: true,
    isReadOnly: false,
    messages: [
      {
        id: "msg-001",
        senderId: "usr-traveller-01",
        senderName: "Elena Rostova",
        body: "Greetings Sunita-ji. I am excited to visit Jitwarpur and observe the natural pigment preparation.",
        createdAt: "2026-11-09T10:30:00Z",
        containsContactWarning: false,
      },
      {
        id: "msg-002",
        senderId: "usr-sunita-jha",
        senderName: "Sunita Devi Jha",
        body: "नमस्ते Elena. You are warmly welcome to Jitwarpur. Let us coordinate to meet at the Village Panchayat Bhavan gate at 9:30 AM.",
        createdAt: "2026-11-09T11:15:00Z",
        containsContactWarning: false,
      },
    ],
  };

  return (
    <div className="site-container py-8 max-w-4xl space-y-6">
      {/* Navigation */}
      <Link
        href="/messages"
        className="text-xs text-secondary hover:text-text inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        <span>{isHindi ? "सभी संदेशों पर लौटें" : "Back to Messages"}</span>
      </Link>

      {/* Main Interactive Chat Client */}
      <ChatRoomClient
        conversationId={conversation.id}
        connectionId={conversation.connectionId}
        counterpart={conversation.counterpart}
        contextTitle={conversation.contextTitle}
        initialMessages={conversation.messages}
        isActive={conversation.isActive}
        isReadOnly={conversation.isReadOnly}
        currentUserId="usr-traveller-01"
        locale={locale}
      />
    </div>
  );
}
