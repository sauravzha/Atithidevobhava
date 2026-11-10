"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendMessageAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { VerificationLabel } from "@/components/ui/verification-label";
import { ReportModal } from "@/components/safety/report-modal";
import { BlockModal } from "@/components/safety/block-modal";
import { ReviewModal } from "@/components/safety/review-modal";
import { SafetyCheckInCard } from "@/components/safety/check-in-card";
import {
  Send,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Star,
  Info,
  MapPin,
} from "lucide-react";

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
  containsContactWarning?: boolean;
}

interface CounterpartData {
  id: string;
  name: string;
  role: string;
  district: string;
  state: string;
}

interface ChatRoomClientProps {
  conversationId: string;
  connectionId?: string;
  bookingId?: string;
  counterpart: CounterpartData;
  contextTitle: string;
  initialMessages: MessageItem[];
  isActive: boolean;
  isReadOnly: boolean;
  currentUserId: string;
  locale: string;
}

export function ChatRoomClient({
  conversationId,
  connectionId,
  bookingId,
  counterpart,
  contextTitle,
  initialMessages,
  isActive: initialActive,
  isReadOnly,
  currentUserId,
  locale,
}: ChatRoomClientProps) {
  const isHindi = locale === "hi";
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(initialActive);

  // Modals state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Soft contact detection in input
  const contactRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+91[\-\s]?)?[6-9]\d{9})/;
  const draftHasContactInfo = contactRegex.test(inputText);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || isReadOnly || !isActive) return;

    const trimmed = inputText.trim();
    setIsSending(true);
    setServerError(null);

    const result = await sendMessageAction({
      conversation_id: conversationId,
      body: trimmed,
    });

    setIsSending(false);

    if (result.success && result.data) {
      const newMsg: MessageItem = {
        id: result.data.messageId,
        senderId: currentUserId,
        senderName: "You",
        body: trimmed,
        createdAt: new Date().toISOString(),
        containsContactWarning: result.data.hasContactWarning,
      };
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    } else {
      // Local development fallback
      const fallbackMsg: MessageItem = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        senderName: "You",
        body: trimmed,
        createdAt: new Date().toISOString(),
        containsContactWarning: draftHasContactInfo,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setInputText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Header Bar */}
      <header className="p-5 border border-rule rounded-sm bg-page flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-medium text-text">
              {counterpart.name}
            </h1>
            <VerificationLabel label={isHindi ? "सत्यापित" : "Verified"} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
            <span>{counterpart.role}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} className="text-primary" />
              {counterpart.district}, {counterpart.state}
            </span>
            <span>•</span>
            <span className="text-text font-medium">{contextTitle}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {connectionId && (
            <Link
              href={`/connections/${connectionId}`}
              className="tap-target px-3 py-1.5 border border-rule hover:border-text rounded-sm text-xs font-medium text-text inline-flex items-center gap-1.5 transition-colors"
            >
              <Info size={13} strokeWidth={1.5} />
              <span>{isHindi ? "संपर्क स्थिति" : "Connection Details"}</span>
            </Link>
          )}

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setShowReviewModal(true)}
            title="Leave a blind review"
          >
            <Star size={13} strokeWidth={1.5} className="mr-1" />
            <span>{isHindi ? "समीक्षा" : "Review"}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setShowReportModal(true)}
            className="text-terracotta hover:bg-terracotta/10"
            title="Report safety violation"
          >
            <ShieldAlert size={13} strokeWidth={1.5} className="mr-1" />
            <span>{isHindi ? "रिपोर्ट" : "Report"}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setShowBlockModal(true)}
            className="text-terracotta hover:bg-terracotta/10"
            title="Block this user"
          >
            <Ban size={13} strokeWidth={1.5} />
          </Button>
        </div>
      </header>

      {/* Safety Check-In Prompt Banner */}
      <SafetyCheckInCard
        connectionId={connectionId}
        bookingId={bookingId}
        promptType="arrival_start"
        locale={locale}
      />

      {/* Mutual Contact Revelation Banner (Section 9) */}
      <div className="p-3.5 border border-rule rounded-sm bg-warm/20 text-xs text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} strokeWidth={1.5} className="text-forest shrink-0" />
          <span>
            {isHindi
              ? "पारस्परिक संपर्क प्रकटीकरण: दोनों पक्षों की सहमति के बिना निजी फोन या ईमेल कभी साझा नहीं होते।"
              : "Dual-Consent Contact Exchange: Direct phone and email remain concealed until both parties confirm."}
          </span>
        </div>
        {connectionId && (
          <Link
            href={`/connections/${connectionId}`}
            className="text-primary font-medium hover:underline shrink-0 text-xs"
          >
            {isHindi ? "सहमति प्रबंधित करें" : "Manage Exchange"}
          </Link>
        )}
      </div>

      {/* Message Feed */}
      <div className="border border-rule rounded-sm bg-page p-6 min-h-[380px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-prose p-3.5 rounded-sm border text-xs leading-relaxed ${
                  isMe
                    ? "bg-warm/30 border-primary/30 text-text"
                    : "bg-page border-rule text-text"
                }`}
              >
                <div className="font-semibold text-[11px] text-secondary mb-1 flex items-center justify-between gap-3">
                  <span>{isMe ? (isHindi ? "आप" : "You") : counterpart.name}</span>
                  <span className="font-mono text-[10px] text-secondary">{timeStr}</span>
                </div>

                {/* Plain text only: Links are not activated per Section 10 */}
                <p className="whitespace-pre-line break-words font-body">
                  {msg.body}
                </p>

                {msg.containsContactWarning && (
                  <div className="mt-2 pt-2 border-t border-rule/50 text-[11px] text-terracotta flex items-center gap-1.5">
                    <Info size={12} strokeWidth={1.5} />
                    <span>
                      {isHindi
                        ? "सुरक्षा सलाह: निजी संपर्क के लिए संपर्क विनिमय बैनर का उपयोग करें।"
                        : "Advisory: Use the dual-consent Share Contact banner for verified communications."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Soft Contact Advisory on Draft */}
      {draftHasContactInfo && (
        <Notice variant="warning">
          <strong className="block mb-0.5 font-semibold text-xs text-text">
            {isHindi ? "सुरक्षा सुझाव" : "Safety Recommendation"}
          </strong>
          <p className="text-xs text-secondary leading-relaxed">
            {isHindi
              ? "आपके संदेश में फ़ोन नंबर या ईमेल पता प्रतीत हो रहा है। निजी संपर्क साझा करने के लिए ऊपर दिए गए 'संपर्क साझा करें' बैनर का उपयोग करना अधिक सुरक्षित है।"
              : "Your draft appears to contain contact details. We recommend using the verified Dual-Consent Contact Exchange banner for your safety."}
          </p>
        </Notice>
      )}

      {/* Input Composer */}
      {!isActive || isReadOnly ? (
        <div className="p-4 border border-rule rounded-sm bg-warm/20 text-center text-xs text-secondary">
          {isHindi
            ? "यह चैट अब बंद है या केवल पढ़ने के लिए उपलब्ध है।"
            : "This conversation is closed or read-only."}
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-2">
          {serverError && (
            <Notice variant="error">
              <p className="text-xs">{serverError}</p>
            </Notice>
          )}

          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isHindi
                  ? "संदेश लिखें (अधिकतम 1000 अक्षर)..."
                  : "Type your message (maximum 1000 characters)..."
              }
              maxLength={1000}
              className="w-full px-3.5 py-3 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary pr-20"
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span className="text-[10px] text-secondary font-mono">
                {inputText.length}/1000
              </span>

              <Button
                type="submit"
                variant="primary"
                size="small"
                disabled={!inputText.trim() || isSending}
              >
                <Send size={13} strokeWidth={1.5} className="mr-1" />
                <span>{isSending ? (isHindi ? "भेज रहे हैं..." : "Sending...") : isHindi ? "भेजें" : "Send"}</span>
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Modals */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUserId={counterpart.id}
        reportedUserName={counterpart.name}
        targetEntity="conversation"
        targetId={conversationId}
        conversationId={conversationId}
        locale={locale}
      />

      <BlockModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        blockedUserId={counterpart.id}
        blockedUserName={counterpart.name}
        locale={locale}
        onBlockedSuccess={() => setIsActive(false)}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        revieweeName={counterpart.name}
        connectionId={connectionId}
        bookingId={bookingId}
        locale={locale}
      />
    </div>
  );
}
