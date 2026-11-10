"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import { Calendar, Users, MapPin, ShieldCheck, Clock } from "lucide-react";
import { createBookingAction, confirmPaymentAction } from "@/app/actions/bookings";

interface ScheduleItem {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
}

interface ExperienceData {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  category: string;
  general_meeting_area: string;
  duration_minutes: number;
  price_per_person_paise: number;
  min_participants: number;
  max_participants: number;
}

interface Props {
  experience: ExperienceData;
  schedules: ScheduleItem[];
  isHindi: boolean;
  pricesVisible: boolean;
  paymentsEnabled: boolean;
  currentUserId?: string;
}

export function BookExperienceClient({
  experience,
  schedules,
  isHindi,
  pricesVisible,
  paymentsEnabled,
}: Props) {
  const router = useRouter();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules[0]?.id || ""
  );
  const [participantCount, setParticipantCount] = useState<number>(experience.min_participants || 1);
  const [participantNames, setParticipantNames] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dev simulation state
  const [simulatedOrder, setSimulatedOrder] = useState<{
    bookingId: string;
    orderId: string;
    amountPaise: number;
  } | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const availableSlots = selectedSchedule
    ? Math.max(0, selectedSchedule.capacity - selectedSchedule.booked_count)
    : 0;

  const handleCountChange = (newCount: number) => {
    const validCount = Math.max(
      experience.min_participants,
      Math.min(experience.max_participants, newCount)
    );
    setParticipantCount(validCount);
    // Adjust participant names array
    setParticipantNames((prev) => {
      const next = [...prev];
      while (next.length < validCount) next.push("");
      return next.slice(0, validCount);
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setParticipantNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedScheduleId) {
      setErrorMessage(isHindi ? "कृपया एक समय स्लॉट चुनें" : "Please select a schedule slot");
      return;
    }

    if (availableSlots < participantCount) {
      setErrorMessage(
        isHindi
          ? "चुने गए स्लॉट में पर्याप्त सीटें उपलब्ध नहीं हैं"
          : "Not enough spots available for the selected slot"
      );
      return;
    }

    const filledNames = participantNames.filter((n) => n.trim().length >= 2);
    if (filledNames.length !== participantCount) {
      setErrorMessage(
        isHindi
          ? "कृपया प्रत्येक प्रतिभागी का पूरा नाम दर्ज करें"
          : "Please provide the full name for each participant"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `book_${experience.id.slice(0, 8)}_${selectedScheduleId.slice(0, 8)}_${Date.now()}`;
      const res = await createBookingAction({
        experienceId: experience.id,
        scheduleId: selectedScheduleId,
        participantCount,
        participantNames: filledNames,
        idempotencyKey,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Reservation failed");
        setIsSubmitting(false);
        return;
      }

      const { bookingId, orderResult, enquiryMode } = res.data;

      if (enquiryMode || !orderResult) {
        // Direct enquiry booking redirect
        router.push(`/bookings/${bookingId}`);
        return;
      }

      // Check if dev simulation order
      const order = orderResult as { orderId: string; amountPaise: number; isDevSimulation?: boolean };
      if (order.isDevSimulation) {
        setSimulatedOrder({
          bookingId,
          orderId: order.orderId,
          amountPaise: order.amountPaise,
        });
      } else {
        // In real Razorpay mode, open Razorpay checkout modal
        router.push(`/bookings/${bookingId}`);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Booking request error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSimulation = async () => {
    if (!simulatedOrder) return;
    setIsConfirmingPayment(true);
    setErrorMessage(null);

    try {
      const fakePaymentId = `pay_dev_${Date.now()}`;
      // In dev simulation, any signature with 'sig_dev_valid_' is accepted by DevPaymentGatewayProvider
      const fakeSignature = `sig_dev_valid_${Date.now()}`;

      const res = await confirmPaymentAction({
        bookingId: simulatedOrder.bookingId,
        orderId: simulatedOrder.orderId,
        paymentId: fakePaymentId,
        signature: fakeSignature,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to confirm simulated payment");
        setIsConfirmingPayment(false);
        return;
      }

      router.push(`/bookings/${simulatedOrder.bookingId}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Payment confirmation error");
      setIsConfirmingPayment(false);
    }
  };

  const totalPricePaise = experience.price_per_person_paise * participantCount;
  const totalPriceInr = (totalPricePaise / 100).toLocaleString("en-IN");
  const pricePerPersonInr = (experience.price_per_person_paise / 100).toLocaleString("en-IN");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="border-b border-rule pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <StatusLabel
            status={paymentsEnabled ? "Phase 2: Booking Open" : "Phase 1: Enquiry Mode"}
            variant={paymentsEnabled ? "success" : "warning"}
          />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
          {isHindi ? "अनुभव स्लॉट आरक्षण" : "Reserve Experience Slots"}
        </h1>
        <p className="text-sm text-secondary font-sans">
          {isHindi ? experience.title_hi : experience.title_en}
        </p>
      </header>

      {/* Honest Advisory Notice on Feature Flags */}
      {!paymentsEnabled && (
        <Notice variant="warning">
          <strong className="block font-semibold mb-1">
            {isHindi ? "प्रारंभिक चरण: पूछताछ प्रणाली" : "Notice: Cultural Enquiry Mode Active"}
          </strong>
          <p className="text-xs leading-relaxed">
            {isHindi
              ? "वर्तमान में ऑनलाइन भुगतान सुविधा सक्रिय नहीं है। आपका आरक्षण अनुरोध सूत्रधार को भेजा जाएगा और विवरण संदेश कक्ष में साझा किए जाएंगे।"
              : "Online payments are currently disabled in Phase 1. Submitting this form sends an enquiry reservation directly to the host for mutual agreement."}
          </p>
        </Notice>
      )}

      {errorMessage && (
        <Notice variant="error">
          <p className="text-xs">{errorMessage}</p>
        </Notice>
      )}

      <form onSubmit={handleReserve} className="space-y-8">
        {/* Step 1: Schedule Slot Selection */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-text border-b border-rule pb-2 flex items-center gap-2">
            <Calendar size={16} strokeWidth={1.5} className="text-forest" />
            <span>{isHindi ? "1. उपलब्ध स्लॉट चुनें" : "1. Select Available Schedule"}</span>
          </h2>

          {schedules.length === 0 ? (
            <div className="p-6 border border-rule border-dashed rounded-sm text-center text-xs text-secondary">
              {isHindi
                ? "वर्तमान में कोई आगामी स्लॉट उपलब्ध नहीं है। कृपया सूत्रधार से संपर्क करें।"
                : "No upcoming schedule slots are currently open for this experience. Please contact the host."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {schedules.map((s) => {
                const spotsLeft = Math.max(0, s.capacity - s.booked_count);
                const isSelected = selectedScheduleId === s.id;
                const isFull = spotsLeft <= 0;

                const startDate = new Date(s.start_time);
                const formattedDate = startDate.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = startDate.toLocaleTimeString(isHindi ? "hi-IN" : "en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <label
                    key={s.id}
                    className={`block p-4 border rounded-sm transition-all cursor-pointer ${
                      isSelected
                        ? "border-forest bg-warm shadow-xs"
                        : isFull
                        ? "border-rule opacity-50 cursor-not-allowed bg-paper"
                        : "border-rule hover:border-forest/50 bg-paper"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="scheduleSlot"
                          value={s.id}
                          checked={isSelected}
                          disabled={isFull}
                          onChange={() => setSelectedScheduleId(s.id)}
                          className="text-forest focus:ring-forest"
                        />
                        <span className="text-xs font-medium text-text">{formattedDate}</span>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-sm ${
                          isFull
                            ? "bg-terracotta/10 text-terracotta"
                            : "bg-forest/10 text-forest"
                        }`}
                      >
                        {isFull
                          ? isHindi
                            ? "पूर्ण"
                            : "Full"
                          : isHindi
                          ? `${spotsLeft} स्थान शेष`
                          : `${spotsLeft} spots left`}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-secondary flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} strokeWidth={1.5} />
                        {formattedTime} ({experience.duration_minutes} min)
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        {/* Step 2: Participant Count & Names */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-text border-b border-rule pb-2 flex items-center gap-2">
            <Users size={16} strokeWidth={1.5} className="text-forest" />
            <span>{isHindi ? "2. प्रतिभागी विवरण" : "2. Participant Details"}</span>
          </h2>

          <div className="flex items-center gap-4">
            <label className="text-xs font-medium text-text">
              {isHindi ? "प्रतिभागियों की संख्या:" : "Number of Participants:"}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCountChange(participantCount - 1)}
                disabled={participantCount <= experience.min_participants}
                className="w-8 h-8 flex items-center justify-center border border-rule rounded-sm text-xs font-semibold disabled:opacity-40 hover:bg-warm"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-sm text-text font-medium">
                {participantCount}
              </span>
              <button
                type="button"
                onClick={() => handleCountChange(participantCount + 1)}
                disabled={
                  participantCount >= experience.max_participants ||
                  participantCount >= availableSlots
                }
                className="w-8 h-8 flex items-center justify-center border border-rule rounded-sm text-xs font-semibold disabled:opacity-40 hover:bg-warm"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-secondary">
              (Min: {experience.min_participants}, Max: {experience.max_participants})
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-medium text-text">
              {isHindi
                ? "प्रतिभागियों के पूरे नाम (सुरक्षा और सूची हेतु):"
                : "Full Legal Names of Participants (for verified roster):"}
            </label>
            {participantNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-mono text-secondary w-6">#{idx + 1}</span>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? `प्रतिभागी ${idx + 1} का नाम` : `Participant ${idx + 1} full name`}
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: Meeting Landmark & Safety Confirmation */}
        <section className="space-y-3 border-t border-rule pt-6">
          <div className="p-4 bg-warm border border-rule rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text uppercase tracking-wider">
              <MapPin size={14} strokeWidth={1.5} className="text-terracotta" />
              <span>{isHindi ? "सार्वजनिक मिलन स्थल" : "Public Meeting Landmark"}</span>
            </div>
            <p className="text-xs text-secondary font-mono">{experience.general_meeting_area}</p>
            <p className="text-[11px] text-secondary leading-relaxed">
              {isHindi
                ? "सभी गतिविधियाँ पूर्व-निर्धारित सार्वजनिक स्थलों पर ही प्रारंभ होती हैं। निजी आवासीय पते कभी भी सार्वजनिक नहीं किए जाते हैं।"
                : "All cultural interactions assemble in approved public landmarks. Exact home addresses are never published."}
            </p>
          </div>
        </section>

        {/* Step 4: Price Breakdown & Action */}
        <section className="border-t border-rule pt-6 space-y-4">
          <h2 className="font-heading text-lg text-text">
            {isHindi ? "लागत और पुष्टिकरण" : "Summary & Confirmation"}
          </h2>

          {pricesVisible ? (
            <div className="p-4 border border-rule rounded-sm space-y-3 bg-paper">
              <div className="flex justify-between text-xs text-secondary">
                <span>
                  {isHindi ? "प्रति व्यक्ति मूल्य" : "Rate per participant"} (x {participantCount}):
                </span>
                <span className="font-mono">INR {pricePerPersonInr} x {participantCount}</span>
              </div>
              <div className="flex justify-between text-xs text-secondary">
                <span>{isHindi ? "मंच सेवा शुल्क (15% शामिल)" : "Platform service contribution (15% incl.)"}:</span>
                <span className="font-mono text-[11px] text-forest">{isHindi ? "शामिल" : "Included"}</span>
              </div>
              <div className="border-t border-rule pt-2 flex justify-between text-sm font-semibold text-text">
                <span>{isHindi ? "कुल देय राशि" : "Total Amount"}:</span>
                <span className="font-mono text-base text-forest">INR {totalPriceInr}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-warm border border-rule rounded-sm text-xs text-secondary">
              <p>
                {isHindi
                  ? "मूल्य प्रदर्शन चरण 2 में सक्रिय होगा। वर्तमान में यह सेवा पूछताछ आधारित है।"
                  : "Price visibility is disabled under Phase 1. This booking will be created in Cultural Enquiry mode."}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || availableSlots < participantCount || schedules.length === 0}
            >
              {isSubmitting
                ? isHindi
                  ? "प्रसंस्करण..."
                  : "Processing..."
                : paymentsEnabled
                ? isHindi
                  ? `स्थान आरक्षित करें (INR ${totalPriceInr})`
                  : `Reserve & Pay (INR ${totalPriceInr})`
                : isHindi
                ? "पूछताछ आरक्षण भेजें"
                : "Submit Enquiry Reservation"}
            </Button>
          </div>
        </section>
      </form>

      {/* Development Mode Payment Simulator Modal */}
      {simulatedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
        >
          <div className="bg-paper border border-rule max-w-md w-full p-6 rounded-sm shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-rule pb-3">
              <ShieldCheck size={20} strokeWidth={1.5} className="text-forest" />
              <div>
                <h3 className="font-heading text-lg text-text">
                  Development Payment Simulator
                </h3>
                <p className="text-[11px] font-mono text-secondary">
                  Clearly Labelled Simulation Environment
                </p>
              </div>
            </div>

            <Notice variant="default">
              <p className="text-xs leading-relaxed">
                This is a simulation modal. No real credit card, UPI, or net banking transaction will take place. Order reference: <span className="font-mono font-semibold">{simulatedOrder.orderId}</span>
              </p>
            </Notice>

            <div className="p-3 bg-warm border border-rule rounded-sm text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-secondary">Amount:</span>
                <span className="font-mono font-semibold text-text">
                  INR {(simulatedOrder.amountPaise / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Booking ID:</span>
                <span className="font-mono text-[11px] text-secondary truncate max-w-[200px]">
                  {simulatedOrder.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Status:</span>
                <span className="font-mono text-forest">payment_pending</span>
              </div>
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
                onClick={() => setSimulatedOrder(null)}
                disabled={isConfirmingPayment}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="small"
                onClick={handleConfirmSimulation}
                disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "Simulating Capture..." : "Confirm Simulated Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
