"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import { Check } from "lucide-react";
import {
  getConnectionById,
  acceptConnectionAction,
  declineConnectionAction,
  withdrawConnectionAction,
  scheduleConnectionAction,
  completeConnectionAction,
  cancelConnectionAction,
  updateContactExchangeConsentAction,
  type StoredConnection,
} from "@/app/actions/connections";

interface ConnectionPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ConnectionDetailPage({ params }: ConnectionPageProps) {
  const locale = useLocale();
  const isHindi = locale === "hi";

  const [connectionId, setConnectionId] = useState<string>("conn-demo-01");
  const [connection, setConnection] = useState<StoredConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Contact exchange state
  const [shareEmail, setShareEmail] = useState(true);
  const [sharePhone, setSharePhone] = useState(false);
  const [shareWhatsapp, setShareWhatsapp] = useState(false);
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);

  // Scheduling inputs
  const [scheduleDateTime, setScheduleDateTime] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16)
  );
  const [scheduleVenue, setScheduleVenue] = useState("");

  const loadData = async (id: string) => {
    setIsLoading(true);
    const conn = await getConnectionById(id);
    if (conn) {
      setConnection(conn);
      setScheduleVenue(conn.suggestedPublicPlace);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    params.then((p) => {
      setConnectionId(p.id);
      loadData(p.id);
    });
  }, [params]);

  // Actions
  const handleAccept = async () => {
    setActionError(null);
    const res = await acceptConnectionAction(connectionId);
    if (res.success) {
      setActionNotice(res.message || "Accepted.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to accept.");
    }
  };

  const handleDecline = async () => {
    setActionError(null);
    const res = await declineConnectionAction({
      connectionId,
      declineReason: "busy_schedule",
    });
    if (res.success) {
      setActionNotice(res.message || "Declined.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to decline.");
    }
  };

  const handleWithdraw = async () => {
    setActionError(null);
    const res = await withdrawConnectionAction(connectionId);
    if (res.success) {
      setActionNotice(res.message || "Withdrawn.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to withdraw.");
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    const res = await scheduleConnectionAction({
      connectionId,
      scheduledAt: new Date(scheduleDateTime).toISOString(),
      confirmedPublicPlace: scheduleVenue,
    });
    if (res.success) {
      setActionNotice(res.message || "Scheduled.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to schedule.");
    }
  };

  const handleComplete = async () => {
    setActionError(null);
    const res = await completeConnectionAction(connectionId);
    if (res.success) {
      setActionNotice(res.message || "Completed.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to complete.");
    }
  };

  const handleCancel = async () => {
    setActionError(null);
    const res = await cancelConnectionAction(connectionId);
    if (res.success) {
      setActionNotice(res.message || "Cancelled.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to cancel.");
    }
  };

  const handleConsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setIsUpdatingConsent(true);

    const res = await updateContactExchangeConsentAction(
      {
        connectionId,
        shareEmail,
        sharePhone,
        shareWhatsapp,
        emailValue: "traveller@example.com",
        phoneValue: "+919876543210",
        whatsappValue: "+919876543210",
      },
      "local" // Simulated as the local respondent for interactive preview
    );

    setIsUpdatingConsent(false);
    if (res.success) {
      setActionNotice(res.message || "Contact preference recorded.");
      loadData(connectionId);
    } else {
      setActionError(res.error || "Failed to update contact preferences.");
    }
  };

  if (isLoading || !connection) {
    return (
      <div className="site-container py-12 text-xs text-secondary">
        {isHindi ? "अनुरोध विवरण लोड हो रहा है..." : "Loading connection details..."}
      </div>
    );
  }

  const isAcceptedOrScheduled =
    connection.status === "ACCEPTED" || connection.status === "SCHEDULED";
  const bothConfirmed = connection.contactExchange?.bothConfirmed === true;

  return (
    <div className="site-container py-12 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-secondary mb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "होम" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/connections" className="hover:text-primary transition-colors">
              {isHindi ? "सभी मुलाकातें" : "Connections"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text font-medium" aria-current="page">
            {connection.id}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                {isHindi ? "मुलाकात अनुरोध" : "Meet a Local Request"}
              </span>
              <span className="text-xs text-secondary">•</span>
              <StatusLabel status={connection.status.toLowerCase() as any} />
            </div>

            <h1 className="font-heading text-xl font-medium text-text">
              {connection.travellerName} & {connection.localMemberName}
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              {isHindi ? "अनुरोध तिथि: " : "Requested on "}
              {new Date(connection.createdAt).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="text-xs font-medium px-3 py-1.5 border border-rule rounded-sm bg-warm/30 self-start sm:self-auto">
            {isHindi ? "निशुल्क सांस्कृतिक संवाद" : "Free Community Exchange"}
          </div>
        </div>
      </header>

      {/* Notifications */}
      {actionNotice && (
        <Notice variant="default">
          <p className="text-xs">{actionNotice}</p>
        </Notice>
      )}

      {actionError && (
        <Notice variant="warning">
          <p className="text-xs">{actionError}</p>
        </Notice>
      )}

      {/* Request Details */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-4">
        <h2 className="font-heading text-base font-medium text-text border-b border-rule pb-2">
          {isHindi ? "प्रस्तावित विवरण" : "Proposed Encounter Details"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-secondary">
          <div>
            <strong className="text-text block mb-0.5">
              {isHindi ? "उद्देश्य:" : "Purpose:"}
            </strong>
            <span className="capitalize">{connection.purpose.replace(/_/g, " ")}</span>
          </div>

          <div>
            <strong className="text-text block mb-0.5">
              {isHindi ? "प्रस्तावित तिथियां:" : "Proposed Dates:"}
            </strong>
            <span>{connection.proposedDates}</span>
          </div>
        </div>

        <div className="text-xs text-secondary">
          <strong className="text-text block mb-0.5">
            {isHindi ? "सुझावित सार्वजनिक मिलन स्थल:" : "Suggested Public Venue:"}
          </strong>
          <span className="p-2 border border-rule/80 bg-warm/20 rounded-sm block text-text font-medium">
            {connection.suggestedPublicPlace}
          </span>
        </div>

        <div className="text-xs text-secondary">
          <strong className="text-text block mb-0.5">
            {isHindi ? "परिचयात्मक संदेश:" : "Introductory Message:"}
          </strong>
          <p className="p-3 border border-rule/60 bg-warm/10 rounded-sm text-text leading-relaxed">
            {connection.initialMessage}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: CONTACT EXCHANGE ENGINE (Appears only after ACCEPTED)         */}
      {/* ========================================================================= */}
      {isAcceptedOrScheduled && (
        <section className="p-6 border-2 border-forest/40 bg-warm/20 rounded-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-forest block mb-1">
                {isHindi ? "धारा 9: आपसी सहमति संपर्क साझाकरण" : "Section 9: Dual Mutual Consent Contact Exchange"}
              </span>
              <h3 className="font-heading text-lg font-medium text-text">
                {bothConfirmed
                  ? isHindi ? "संपर्क विवरण प्रकट हो चुके हैं" : "Contact Details Revealed"
                  : isHindi ? "संपर्क साझा करने के लिए अपनी सहमति दें" : "Select Contact Channels to Share"}
              </h3>
            </div>
            {bothConfirmed ? (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-sm text-xs font-medium flex items-center gap-1">
                <Check size={12} strokeWidth={1.5} aria-hidden="true" />
                {isHindi ? "द्विपक्षीय पुष्टि पूर्ण" : "Mutual Consent Complete"}
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-sm text-xs font-medium">
                {isHindi ? "प्रतीक्षा में" : "Pending Confirmation"}
              </span>
            )}
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            {isHindi
              ? "अतिथि देवो भव पर फ़ोन नंबर कभी भी सीधे प्रकट नहीं होते। दोनों पक्षों द्वारा अलग-अलग सहमति देने के बाद ही चुनी गई जानकारी दिखाई देती है। ब्लॉक करने पर विवरण तत्काल छिप जाते हैं।"
              : "Contacts are revealed strictly when BOTH parties confirm. Prior to mutual confirmation, only 'Waiting for the other person' is displayed. Blocking immediately revokes disclosure."}
          </p>

          {bothConfirmed ? (
            /* Revealed Contacts */
            <div className="p-4 bg-page border border-forest/30 rounded-sm space-y-3">
              <h4 className="font-heading text-sm font-medium text-text">
                {isHindi ? "साझा किए गए संपर्क चैनल:" : "Counterpart Contact Channels:"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-text">
                <div className="p-2 border border-rule rounded-sm bg-warm/30">
                  <span className="block text-[11px] text-secondary font-sans">Email:</span>
                  sarah.j@example.com
                </div>
                <div className="p-2 border border-rule rounded-sm bg-warm/30">
                  <span className="block text-[11px] text-secondary font-sans">Mobile:</span>
                  +91 98765 43210
                </div>
                <div className="p-2 border border-rule rounded-sm bg-warm/30">
                  <span className="block text-[11px] text-secondary font-sans">WhatsApp:</span>
                  Available
                </div>
              </div>
            </div>
          ) : (
            /* Consent Form */
            <form onSubmit={handleConsentSubmit} className="space-y-3 pt-2">
              <div className="flex flex-wrap gap-4 text-xs text-text">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareEmail}
                    onChange={(e) => setShareEmail(e.target.checked)}
                  />
                  <span>{isHindi ? "ईमेल साझा करें" : "Share Email"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharePhone}
                    onChange={(e) => setSharePhone(e.target.checked)}
                  />
                  <span>{isHindi ? "फ़ोन नंबर साझा करें" : "Share Phone Number"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareWhatsapp}
                    onChange={(e) => setShareWhatsapp(e.target.checked)}
                  />
                  <span>{isHindi ? "व्हाट्सएप साझा करें" : "Share WhatsApp"}</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingConsent}
                  className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {isUpdatingConsent
                    ? isHindi ? "सहेज रहे हैं..." : "Saving..."
                    : isHindi ? "अपनी सहमति दर्ज करें" : "Confirm My Contact Channels"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* LIFECYCLE ACTION CONTROLS                                                 */}
      {/* ========================================================================= */}
      <section className="p-6 border border-rule rounded-sm bg-page space-y-4">
        <h3 className="font-heading text-base font-medium text-text border-b border-rule pb-2">
          {isHindi ? "अनुरोध प्रबंधन (Actions)" : "Lifecycle Actions"}
        </h3>

        {/* If PENDING */}
        {connection.status === "PENDING" && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "अनुरोध स्वीकार करें (Accept)" : "Accept Request (Local)"}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="tap-target px-4 py-2 border border-rule hover:border-terracotta text-secondary hover:text-terracotta rounded-sm text-xs font-medium transition-colors"
            >
              {isHindi ? "अस्वीकार करें (Decline)" : "Decline Politely"}
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              className="tap-target px-4 py-2 text-secondary hover:text-text underline text-xs font-medium"
            >
              {isHindi ? "अनुरोध वापस लें (Withdraw)" : "Withdraw Request (Traveller)"}
            </button>
          </div>
        )}

        {/* If ACCEPTED: Schedule form */}
        {connection.status === "ACCEPTED" && (
          <form onSubmit={handleSchedule} className="space-y-4">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">
              {isHindi ? "सार्वजनिक मुलाकात निर्धारित करें:" : "Finalize Scheduled Meetup:"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1">
                  {isHindi ? "मुलाकात की तिथि एवं समय:" : "Scheduled Date & Time:"}
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">
                  {isHindi ? "पुष्टि किया गया सार्वजनिक स्थल:" : "Confirmed Public Venue:"}
                </label>
                <input
                  type="text"
                  value={scheduleVenue}
                  onChange={(e) => setScheduleVenue(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="tap-target px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium transition-colors"
              >
                {isHindi ? "मुलाकात निर्धारित करें (Move to SCHEDULED)" : "Confirm Schedule"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="tap-target px-4 py-2 border border-rule text-secondary hover:text-terracotta rounded-sm text-xs font-medium"
              >
                {isHindi ? "रद्द करें (Cancel)" : "Cancel Connection"}
              </button>
            </div>
          </form>
        )}

        {/* If SCHEDULED */}
        {connection.status === "SCHEDULED" && (
          <div className="space-y-3">
            <div className="p-3 border border-rule bg-warm/30 rounded-sm text-xs text-secondary">
              <strong className="text-text block mb-1">
                {isHindi ? "निर्धारित समय:" : "Scheduled Time:"}
              </strong>
              {connection.scheduledAt
                ? new Date(connection.scheduledAt).toLocaleString(locale === "hi" ? "hi-IN" : "en-IN")
                : "Agreed time"}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleComplete}
                className="tap-target px-4 py-2 bg-forest text-white hover:bg-deep rounded-sm text-xs font-medium transition-colors"
              >
                {isHindi ? "मुलाकात पूरी हुई (Mark as Completed)" : "Mark Meetup as Completed"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="tap-target px-4 py-2 border border-rule text-secondary hover:text-terracotta rounded-sm text-xs font-medium"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Terminal status display */}
        {["DECLINED", "WITHDRAWN", "COMPLETED", "CANCELLED", "EXPIRED"].includes(
          connection.status
        ) && (
          <p className="text-xs text-secondary italic">
            {connection.status === "DECLINED"
              ? isHindi
                ? "यह अनुरोध अस्वीकार किया जा चुका है।"
                : "Unable to meet this request."
              : isHindi
              ? `अनुरोध की स्थिति: ${connection.status}`
              : `Connection is in terminal status: ${connection.status}`}
          </p>
        )}
      </section>

      {/* Safety & Emergency Notice */}
      <section className="p-4 border border-rule rounded-sm bg-warm/10 flex items-center justify-between text-xs text-secondary">
        <div>
          <strong className="text-text block mb-0.5">
            {isHindi ? "सुरक्षा सहायता एवं आपातकाल:" : "Safety & Helplines:"}
          </strong>
          <span>
            {isHindi
              ? "राष्ट्रीय आपातकाल 112 • महिला हेल्पलाइन 1091 • पर्यटक हेल्पलाइन 1363"
              : "National Emergency: 112 • Women: 1091 • Tourist Helpline: 1363"}
          </span>
        </div>
        <Link
          href="/safety"
          className="text-primary hover:underline font-medium"
        >
          {isHindi ? "सुरक्षा दिशानिर्देश" : "Safety Policy"} →
        </Link>
      </section>
    </div>
  );
}
