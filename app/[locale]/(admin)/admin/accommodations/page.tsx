import { createAdminClient } from "@/lib/supabase/admin";
import { AdminAccommodationsClient } from "./accommodations-client";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminAccommodationsPage({ params }: Props) {
  const { locale } = await params;
  const isHindi = locale === "hi";

  const adminClient = createAdminClient();
  const { data: listings } = await adminClient
    .from("accommodation_listings")
    .select(`
      id,
      title,
      accommodation_type,
      room_type,
      bathroom_type,
      max_guests,
      room_count,
      food_provided,
      general_location,
      household_adults_count,
      has_children,
      has_pets,
      other_residents_description,
      house_rules,
      price_per_night_paise,
      status,
      verification_tier,
      created_at,
      host_id,
      users!accommodation_listings_host_id_fkey (
        email
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-4">
        <h1 className="font-heading text-2xl text-text font-normal">
          {isHindi ? "पारिवारिक आवास समीक्षा कतार" : "Accommodation Moderation Queue"}
        </h1>
        <p className="text-xs text-secondary mt-1">
          {isHindi
            ? "आवास सूची की समीक्षा करें, गृह विवरण, सार्वजनिक लैंडमार्क और पर्यटन पंजीकरण की पुष्टि करें।"
            : "Review accommodation listings, inspect household transparency, verify public landmarks, and approve or request changes."}
        </p>
      </header>

      <AdminAccommodationsClient
        listings={listings || []}
        isHindi={isHindi}
      />
    </div>
  );
}
