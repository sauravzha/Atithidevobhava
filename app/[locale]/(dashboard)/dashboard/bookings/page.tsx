import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingsListClient } from "./bookings-list-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardBookingsPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/onboarding`);
  }

  const adminClient = createAdminClient();

  // Fetch bookings where user is traveller or provider
  const { data: rawBookings } = await adminClient
    .from("experience_bookings")
    .select(`
      id,
      experience_id,
      schedule_id,
      traveller_id,
      participant_count,
      total_price_paise,
      status,
      created_at,
      experiences (
        id,
        title_en,
        title_hi,
        general_meeting_area,
        category,
        provider_id
      ),
      experience_schedules (
        id,
        start_time,
        end_time
      )
    `)
    .or(`traveller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const normalizedBookings = (rawBookings || []).map((b: Record<string, unknown>) => {
    const expData = Array.isArray(b.experiences) ? b.experiences[0] : b.experiences;
    const schedData = Array.isArray(b.experience_schedules) ? b.experience_schedules[0] : b.experience_schedules;

    return {
      id: String(b.id),
      experience_id: String(b.experience_id),
      schedule_id: String(b.schedule_id),
      traveller_id: String(b.traveller_id),
      participant_count: Number(b.participant_count),
      total_price_paise: Number(b.total_price_paise),
      status: String(b.status),
      created_at: String(b.created_at),
      experiences: (expData || null) as {
        id?: string;
        title_en?: string;
        title_hi?: string;
        general_meeting_area?: string;
        category?: string;
        provider_id?: string;
      } | null,
      experience_schedules: (schedData || null) as {
        id?: string;
        start_time?: string;
        end_time?: string;
      } | null,
    };
  });

  return (
    <div className="site-container py-10 max-w-4xl space-y-8">
      {/* Header */}
      <header className="border-b border-rule pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-text font-normal">
            {isHindi ? "मेरे आरक्षण और बुकिंग" : "Bookings & Cultural Reservations"}
          </h1>
          <p className="text-xs text-secondary mt-1">
            {isHindi
              ? "आपके द्वारा आरक्षित सभी सांस्कृतिक अनुभवों और मुलाकातों का विवरण।"
              : "All your experience bookings, active slots, and historical receipts."}
          </p>
        </div>
        <Link
          href="/explore/experiences"
          className="text-xs font-medium text-forest hover:underline"
        >
          {isHindi ? "+ नया अनुभव खोजें" : "+ Browse Experiences"}
        </Link>
      </header>

      <BookingsListClient
        bookings={normalizedBookings}
        isHindi={isHindi}
      />
    </div>
  );
}
