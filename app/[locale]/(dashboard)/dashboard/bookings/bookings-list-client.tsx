"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusLabel } from "@/components/ui/status-label";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

interface BookingItem {
  id: string;
  experience_id: string;
  schedule_id: string;
  traveller_id: string;
  participant_count: number;
  total_price_paise: number;
  status: string;
  created_at: string;
  experiences: {
    id?: string;
    title_en?: string;
    title_hi?: string;
    general_meeting_area?: string;
    category?: string;
    provider_id?: string;
  } | null;
  experience_schedules: {
    id?: string;
    start_time?: string;
    end_time?: string;
  } | null;
}

interface Props {
  bookings: BookingItem[];
  isHindi: boolean;
  currentUserId?: string;
}

export function BookingsListClient({ bookings, isHindi }: Props) {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return b.status === "confirmed";
    if (filter === "pending") return b.status === "pending" || b.status === "payment_pending";
    if (filter === "cancelled") return b.status === "cancelled" || b.status === "refunded";
    return true;
  });

  const getStatusVariant = (status: string): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
      case "payment_pending":
        return "warning";
      case "cancelled":
      case "refunded":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-rule pb-2 text-xs">
        {[
          { key: "all", labelEn: "All Bookings", labelHi: "सभी आरक्षण" },
          { key: "confirmed", labelEn: "Confirmed", labelHi: "पुष्ट" },
          { key: "pending", labelEn: "Pending / Enquiry", labelHi: "लंबित / पूछताछ" },
          { key: "cancelled", labelEn: "Cancelled", labelHi: "रद्द" },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                isActive
                  ? "bg-warm text-text font-medium border border-rule"
                  : "text-secondary hover:text-text"
              }`}
            >
              {isHindi ? tab.labelHi : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-10 border border-rule border-dashed rounded-sm text-center space-y-3">
          <p className="text-xs text-secondary">
            {isHindi ? "कोई आरक्षण नहीं मिला।" : "No bookings found matching this filter."}
          </p>
          <Link
            href="/explore/experiences"
            className="inline-block text-xs font-medium text-forest hover:underline"
          >
            {isHindi ? "अनुभव खोजें" : "Browse Experiences"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const exp = b.experiences;
            const sched = b.experience_schedules;
            const startDate = sched?.start_time ? new Date(sched.start_time) : null;
            const formattedDate = startDate
              ? startDate.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "To be confirmed";

            const formattedTime = startDate
              ? startDate.toLocaleTimeString(isHindi ? "hi-IN" : "en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            const totalInr = (b.total_price_paise / 100).toLocaleString("en-IN");

            return (
              <div
                key={b.id}
                className="p-5 border border-rule rounded-sm bg-paper hover:border-forest/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <StatusLabel
                      status={b.status.replace("_", " ").toUpperCase()}
                      variant={getStatusVariant(b.status)}
                    />
                    <span className="font-mono text-[11px] text-secondary">
                      #{b.id.slice(0, 8)}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-medium text-text">
                    {isHindi ? exp?.title_hi : exp?.title_en}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} strokeWidth={1.5} className="text-forest" />
                      {formattedDate} {formattedTime && `at ${formattedTime}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} strokeWidth={1.5} />
                      {b.participant_count} {isHindi ? "प्रतिभागी" : "guest(s)"}
                    </span>
                    {exp?.general_meeting_area && (
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin size={13} strokeWidth={1.5} className="text-terracotta" />
                        {exp.general_meeting_area}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-rule">
                  {b.total_price_paise > 0 ? (
                    <span className="font-mono font-semibold text-text text-sm">
                      INR {totalInr}
                    </span>
                  ) : (
                    <span className="text-[11px] text-secondary font-mono">
                      {isHindi ? "पूछताछ" : "Enquiry"}
                    </span>
                  )}

                  <Link
                    href={`/bookings/${b.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:underline"
                  >
                    <span>{isHindi ? "विवरण देखें" : "View Details"}</span>
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
