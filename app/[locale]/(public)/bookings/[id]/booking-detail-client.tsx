"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  AlertTriangle,
  Printer,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { cancelBookingAction } from "@/app/actions/bookings";

interface Props {
  booking: {
    id: string;
    experience_id: string;
    schedule_id: string;
    traveller_id: string;
    participant_count: number;
    total_price_paise: number;
    commission_rate_snapshot: number;
    status: string;
    created_at: string;
    experiences: {
      id?: string;
      title_en?: string;
      title_hi?: string;
      provider_id?: string;
      general_meeting_area?: string;
      duration_minutes?: number;
      category?: string;
      cancellation_policy?: string;
    } | null;
    experience_schedules: {
      id?: string;
      start_time?: string;
      end_time?: string;
    } | null;
    experience_booking_participants: Array<{ id: string; name: string }>;
    payments: Array<{
      id: string;
      amount_paise: number;
      status: string;
      provider: string;
      created_at: string;
    }>;
  };
  isHindi: boolean;
  currentUserId?: string;
}

export function BookingDetailClient({ booking, isHindi }: Props) {
  const router = useRouter();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const exp = booking.experiences;
  const schedule = booking.experience_schedules;
  const isCancellable = ["pending", "payment_pending", "confirmed"].includes(
    booking.status
  );

  const payment = booking.payments && booking.payments[0];

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelReason.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कृपया कम से कम 5 अक्षरों का कारण लिखें"
          : "Please provide a reason of at least 5 characters"
      );
      return;
    }

    setIsCancelling(true);
    setErrorMessage(null);

    try {
      const res = await cancelBookingAction({
        bookingId: booking.id,
        reason: cancelReason.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to cancel booking");
        setIsCancelling(false);
        return;
      }

      setIsCancelModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Cancellation error");
      setIsCancelling(false);
    }
  };

  const startDate = schedule?.start_time ? new Date(schedule.start_time) : null;
  const formattedDate = startDate
    ? startDate.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Flexible / To be agreed";

  const formattedTime = startDate
    ? startDate.toLocaleTimeString(isHindi ? "hi-IN" : "en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const totalPriceInr = (booking.total_price_paise / 100).toLocaleString("en-IN");

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "confirmed":
        return "success";
      case "payment_pending":
      case "pending":
        return "warning";
      case "cancelled":
      case "refunded":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="text-xs text-secondary flex items-center justify-between border-b border-rule pb-4">
        <Link
          href="/dashboard/experiences"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          &larr; {isHindi ? "अनुभव डैशबोर्ड" : "Back to Experiences"}
        </Link>
        <button
          onClick={() => window.print()}
          className="hover:text-primary transition-colors flex items-center gap-1.5 font-mono text-[11px]"
        >
          <Printer size={12} strokeWidth={1.5} />
          {isHindi ? "रसीद प्रिंट करें" : "Print Receipt"}
        </button>
      </nav>

      {/* Header Banner */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-secondary">
              ID: {booking.id.slice(0, 13)}
            </span>
            <StatusLabel
              status={booking.status.replace("_", " ").toUpperCase()}
              variant={getStatusVariant(booking.status)}
            />
          </div>
          <span className="text-xs text-secondary">
            {isHindi ? "आरक्षण तिथि: " : "Booked on: "}
            {new Date(booking.created_at).toLocaleDateString(
              isHindi ? "hi-IN" : "en-IN"
            )}
          </span>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
          {isHindi ? exp?.title_hi || "सांस्कृतिक अनुभव" : exp?.title_en || "Cultural Experience"}
        </h1>
      </header>

      {/* Primary Booking Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-rule rounded-sm bg-paper">
        {/* Date and Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium uppercase tracking-wider">
            <Calendar size={13} strokeWidth={1.5} className="text-forest" />
            <span>{isHindi ? "तारीख और समय" : "Date & Scheduled Time"}</span>
          </div>
          <p className="text-sm font-medium text-text">{formattedDate}</p>
          {formattedTime && (
            <p className="text-xs text-secondary flex items-center gap-1">
              <Clock size={12} strokeWidth={1.5} />
              {formattedTime} ({exp?.duration_minutes || 120} min)
            </p>
          )}
        </div>

        {/* Meeting Area */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium uppercase tracking-wider">
            <MapPin size={13} strokeWidth={1.5} className="text-terracotta" />
            <span>{isHindi ? "सार्वजनिक मिलन स्थल" : "Public Assembly Point"}</span>
          </div>
          <p className="text-sm font-medium text-text">
            {exp?.general_meeting_area || "Approved public landmark"}
          </p>
          <p className="text-[11px] text-secondary">
            {isHindi
              ? "पहला मिलन सदैव सार्वजनिक स्थल पर होता है।"
              : "Exact residential addresses are never published."}
          </p>
        </div>
      </div>

      {/* Participant Roster */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2 flex items-center gap-2">
          <Users size={16} strokeWidth={1.5} className="text-forest" />
          <span>
            {isHindi
              ? `पंजीकृत प्रतिभागी (${booking.participant_count})`
              : `Registered Participants (${booking.participant_count})`}
          </span>
        </h2>

        <div className="p-4 border border-rule rounded-sm bg-paper space-y-2">
          {booking.experience_booking_participants &&
          booking.experience_booking_participants.length > 0 ? (
            <ul className="divide-y divide-rule text-xs">
              {booking.experience_booking_participants.map((p, idx) => (
                <li key={p.id} className="py-2 flex items-center justify-between">
                  <span className="font-medium text-text">{p.name}</span>
                  <span className="font-mono text-secondary text-[11px]">
                    {isHindi ? `प्रतिभागी #${idx + 1}` : `Participant #${idx + 1}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-secondary">
              {isHindi ? "कोई व्यक्तिगत नाम दर्ज नहीं है।" : "No separate participant names listed."}
            </p>
          )}
        </div>
      </section>

      {/* Financial Breakdown & Receipt */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg text-text border-b border-rule pb-2 flex items-center gap-2">
          <CreditCard size={16} strokeWidth={1.5} className="text-forest" />
          <span>{isHindi ? "भुगतान और रसीद विवरण" : "Financial Details & Receipt"}</span>
        </h2>

        <div className="p-4 border border-rule rounded-sm bg-warm space-y-3 text-xs">
          <div className="flex justify-between text-secondary">
            <span>
              {isHindi ? "कुल स्लॉट मूल्य" : "Experience Rate"} ({booking.participant_count} pax):
            </span>
            <span className="font-mono font-medium text-text">INR {totalPriceInr}</span>
          </div>

          <div className="flex justify-between text-secondary">
            <span>
              {isHindi
                ? `मंच सेवा शुल्क दर (${booking.commission_rate_snapshot}%)`
                : `Platform service rate snapshot (${booking.commission_rate_snapshot}%)`}:
            </span>
            <span className="font-mono text-secondary">
              {isHindi ? "कुल मूल्य में सम्मिलित" : "Included in total"}
            </span>
          </div>

          {payment && (
            <div className="pt-2 border-t border-rule space-y-1">
              <div className="flex justify-between text-secondary text-[11px]">
                <span>{isHindi ? "भुगतान प्रदाता" : "Payment Provider"}:</span>
                <span className="font-mono uppercase">{payment.provider}</span>
              </div>
              <div className="flex justify-between text-secondary text-[11px]">
                <span>{isHindi ? "लेनदेन संदर्भ" : "Transaction ID"}:</span>
                <span className="font-mono">{payment.id.slice(0, 16)}</span>
              </div>
            </div>
          )}

          <div className="border-t border-rule pt-2 flex justify-between font-semibold text-text text-sm">
            <span>{isHindi ? "कुल भुगतान" : "Total Amount"}:</span>
            <span className="font-mono text-forest">INR {totalPriceInr}</span>
          </div>
        </div>
      </section>

      {/* Safety & Helplines */}
      <section className="p-4 bg-paper border border-rule rounded-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-text uppercase tracking-wider">
          <ShieldAlert size={14} strokeWidth={1.5} className="text-terracotta" />
          <span>{isHindi ? "सुरक्षा सहायता और हेल्पलाइन" : "Official Safety Helplines"}</span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          {isHindi
            ? "आपातकालीन स्थिति में तुरंत राष्ट्रीय आपात नंबर 112 पर कॉल करें। महिला हेल्पलाइन 1091, पर्यटक हेल्पलाइन 1363 (24x7 टोल-फ्री)।"
            : "In any emergency, immediately dial 112 (National Emergency). Women's Helpline: 1091. Tourist Support: 1363 (toll-free 24x7)."}
        </p>
      </section>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-rule">
        <Link href="/messages" className="text-xs text-forest hover:underline flex items-center gap-1.5">
          <MessageSquare size={14} strokeWidth={1.5} />
          {isHindi ? "सूत्रधार से संपर्क करें" : "Open Conversation with Host"}
        </Link>

        {isCancellable && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsCancelModalOpen(true)}
          >
            {isHindi ? "आरक्षण रद्द करें" : "Cancel Booking"}
          </Button>
        )}
      </div>

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
        >
          <div className="bg-paper border border-rule max-w-md w-full p-6 rounded-sm shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-rule pb-3">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-terracotta" />
              <h3 className="font-heading text-lg text-text">
                {isHindi ? "आरक्षण रद्दीकरण पुष्टि" : "Confirm Booking Cancellation"}
              </h3>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              {isHindi
                ? "रद्द करने पर आरक्षित स्लॉट तुरंत अन्य यात्रियों के लिए उपलब्ध करा दिया जाएगा। रद्दीकरण कारण ऑडिट लॉग में दर्ज होगा।"
                : "Cancelling will immediately restore schedule capacity for other travellers. A cancellation reason is required for administrative audit logging."}
            </p>

            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "रद्दीकरण का कारण (अनिवार्य):" : "Cancellation Reason (Mandatory):"}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    isHindi
                      ? "कम से कम 5 अक्षरों में कारण लिखें..."
                      : "Please explain briefly why you need to cancel..."
                  }
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              {errorMessage && (
                <Notice variant="error">
                  <p className="text-xs">{errorMessage}</p>
                </Notice>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-rule">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                >
                  {isHindi ? "वापस जाएं" : "Keep Booking"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={isCancelling || cancelReason.trim().length < 5}
                >
                  {isCancelling
                    ? isHindi
                      ? "रद्द हो रहा है..."
                      : "Cancelling..."
                    : isHindi
                    ? "रद्द करें"
                    : "Confirm Cancellation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
