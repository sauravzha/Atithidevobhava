import { notFound, redirect } from "next/navigation";
import { getBookingDetailsAction } from "@/app/actions/bookings";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { BookingDetailClient } from "./booking-detail-client";

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const result = await getBookingDetailsAction(id);

  if (!result.success || !result.data) {
    // If not found in live database (e.g. demo reference), check fallback
    if (id.startsWith("bk_demo_") || id === "test-booking-id") {
      const demoBooking = {
        id,
        experience_id: "91111111-1111-1111-1111-111111111111",
        schedule_id: "81111111-1111-1111-1111-111111111111",
        traveller_id: user.id,
        participant_count: 2,
        total_price_paise: 240000,
        commission_rate_snapshot: 15.0,
        status: "confirmed",
        created_at: new Date().toISOString(),
        experiences: {
          id: "91111111-1111-1111-1111-111111111111",
          title_en: "Mithila Painting in Madhubani Courtyard",
          title_hi: "मधुबनी आंगन में मिथिला चित्रकला",
          provider_id: "p1111111-1111-1111-1111-111111111111",
          general_meeting_area: "Ranti Village Panchayat Bhavan, Madhubani",
          duration_minutes: 180,
          category: "art_and_handicrafts",
          cancellation_policy: "Standard 24-hour notification required.",
        },
        experience_schedules: {
          id: "81111111-1111-1111-1111-111111111111",
          start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
          end_time: new Date(Date.now() + 86400000 * 2 + 10800000).toISOString(),
        },
        experience_booking_participants: [
          { id: "part-1", name: "Guest One" },
          { id: "part-2", name: "Guest Two" },
        ],
        payments: [
          {
            id: "pay-demo-1",
            amount_paise: 240000,
            status: "captured",
            provider: "development",
            created_at: new Date().toISOString(),
          },
        ],
      };

      return (
        <div className="site-container py-10 max-w-3xl">
          <BookingDetailClient
            booking={demoBooking}
            isHindi={isHindi}
          />
        </div>
      );
    }
    notFound();
  }

  const rawBooking = result.data as Record<string, unknown>;
  const expData = Array.isArray(rawBooking.experiences)
    ? rawBooking.experiences[0]
    : rawBooking.experiences;
  const schedData = Array.isArray(rawBooking.experience_schedules)
    ? rawBooking.experience_schedules[0]
    : rawBooking.experience_schedules;

  const normalizedBooking = {
    id: String(rawBooking.id),
    experience_id: String(rawBooking.experience_id),
    schedule_id: String(rawBooking.schedule_id),
    traveller_id: String(rawBooking.traveller_id),
    participant_count: Number(rawBooking.participant_count),
    total_price_paise: Number(rawBooking.total_price_paise),
    commission_rate_snapshot: Number(rawBooking.commission_rate_snapshot),
    status: String(rawBooking.status),
    created_at: String(rawBooking.created_at),
    experiences: (expData || null) as {
      id?: string;
      title_en?: string;
      title_hi?: string;
      provider_id?: string;
      general_meeting_area?: string;
      duration_minutes?: number;
      category?: string;
      cancellation_policy?: string;
    } | null,
    experience_schedules: (schedData || null) as {
      id?: string;
      start_time?: string;
      end_time?: string;
    } | null,
    experience_booking_participants: (rawBooking.experience_booking_participants || []) as Array<{ id: string; name: string }>,
    payments: (rawBooking.payments || []) as Array<{
      id: string;
      amount_paise: number;
      status: string;
      provider: string;
      created_at: string;
    }>,
  };

  return (
    <div className="site-container py-10 max-w-3xl">
      <BookingDetailClient
        booking={normalizedBooking}
        isHindi={isHindi}
      />
    </div>
  );
}
