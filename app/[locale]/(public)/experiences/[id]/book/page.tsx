import { notFound } from "next/navigation";
import Link from "next/link";
import { getFeatureFlag } from "@/lib/supabase/flags";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookExperienceClient } from "./book-client";

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function BookExperiencePage({ params }: Props) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  const pricesVisible = await getFeatureFlag("PRICES_VISIBLE");
  const paymentsEnabled = await getFeatureFlag("PAYMENTS_ENABLED");

  const adminClient = createAdminClient();

  // Fetch experience
  const { data: exp, error: expErr } = await adminClient
    .from("experiences")
    .select(`
      id,
      slug,
      title_en,
      title_hi,
      category,
      general_meeting_area,
      duration_minutes,
      price_per_person_paise,
      min_participants,
      max_participants,
      status,
      provider_id,
      users!experiences_provider_id_fkey (
        id
      )
    `)
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();

  if (expErr || !exp || exp.status !== "published") {
    // If not in database yet (e.g. pilot demo data), check fallback pilot experiences
    if (id === "darbhanga-mithila-painting" || id === "madhubani-village-culinary") {
      const fallbackExp = {
        id: id === "darbhanga-mithila-painting" ? "91111111-1111-1111-1111-111111111111" : "92222222-2222-2222-2222-222222222222",
        slug: id,
        title_en: id === "darbhanga-mithila-painting" ? "Mithila Painting in Madhubani Courtyard" : "Maithil Village Cooking and Garden Walk",
        title_hi: id === "darbhanga-mithila-painting" ? "मधुबनी आंगन में मिथिला चित्रकला" : "मैथिल ग्रामीण रसोई और बगीचा भ्रमण",
        category: id === "darbhanga-mithila-painting" ? "art_and_handicrafts" : "indian_food_and_cooking",
        general_meeting_area: id === "darbhanga-mithila-painting" ? "Ranti Village Panchayat Bhavan, Madhubani" : "Mangarpatti Chowk, Darbhanga",
        duration_minutes: 180,
        price_per_person_paise: 120000,
        min_participants: 1,
        max_participants: 6,
      };

      const fallbackSchedules = [
        {
          id: "81111111-1111-1111-1111-111111111111",
          start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
          end_time: new Date(Date.now() + 86400000 * 2 + 10800000).toISOString(),
          capacity: 6,
          booked_count: 2,
        },
        {
          id: "82222222-2222-2222-2222-222222222222",
          start_time: new Date(Date.now() + 86400000 * 4).toISOString(),
          end_time: new Date(Date.now() + 86400000 * 4 + 10800000).toISOString(),
          capacity: 6,
          booked_count: 0,
        },
      ];

      return (
        <div className="site-container py-10 max-w-3xl">
          <Breadcrumbs isHindi={isHindi} title={isHindi ? fallbackExp.title_hi : fallbackExp.title_en} />
          <BookExperienceClient
            experience={fallbackExp}
            schedules={fallbackSchedules}
            isHindi={isHindi}
            pricesVisible={pricesVisible}
            paymentsEnabled={paymentsEnabled}
          />
        </div>
      );
    }
    notFound();
  }

  // Fetch available upcoming schedules with remaining capacity
  const now = new Date().toISOString();
  const { data: schedules } = await adminClient
    .from("experience_schedules")
    .select("id, start_time, end_time, capacity, booked_count")
    .eq("experience_id", exp.id)
    .gt("start_time", now)
    .order("start_time", { ascending: true });

  return (
    <div className="site-container py-10 max-w-3xl">
      <Breadcrumbs isHindi={isHindi} title={isHindi ? exp.title_hi : exp.title_en} />
      <BookExperienceClient
        experience={{
          id: exp.id,
          slug: exp.slug,
          title_en: exp.title_en,
          title_hi: exp.title_hi,
          category: exp.category,
          general_meeting_area: exp.general_meeting_area,
          duration_minutes: exp.duration_minutes,
          price_per_person_paise: exp.price_per_person_paise,
          min_participants: exp.min_participants,
          max_participants: exp.max_participants,
        }}
        schedules={schedules || []}
        isHindi={isHindi}
        pricesVisible={pricesVisible}
        paymentsEnabled={paymentsEnabled}
      />
    </div>
  );
}

function Breadcrumbs({ isHindi, title }: { isHindi: boolean; title: string }) {
  return (
    <nav className="text-xs text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            {isHindi ? "होम" : "Home"}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/explore/experiences" className="hover:text-primary transition-colors">
            {isHindi ? "अनुभव" : "Experiences"}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-text font-medium truncate max-w-xs" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
