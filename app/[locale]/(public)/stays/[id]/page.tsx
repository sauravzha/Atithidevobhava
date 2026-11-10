import { notFound } from "next/navigation";
import Link from "next/link";
import { getFeatureFlag } from "@/lib/supabase/flags";
import { createAdminClient } from "@/lib/supabase/admin";
import { StayDetailClient } from "./stay-detail-client";

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function StayDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const isHindi = locale === "hi";

  const staysEnabled = await getFeatureFlag("STAYS_ENABLED");
  const pricesVisible = await getFeatureFlag("PRICES_VISIBLE");

  const adminClient = createAdminClient();

  // Fetch accommodation listing
  const { data: listing, error: lErr } = await adminClient
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
      host_id,
      users!accommodation_listings_host_id_fkey (
        id
      )
    `)
    .eq("id", id)
    .single();

  if (lErr || !listing) {
    // Check fallback pilot demo listing for Madhubani / Darbhanga
    if (id === "pilot-mithila-homestay" || id === "demo-stay-1") {
      const demoListing = {
        id,
        title: "Traditional Maithil Courtyard Guest Room",
        title_hi: "पारंपरिक मैथिल आंगन अतिथि कक्ष",
        accommodation_type: "free_cultural_hospitality",
        room_type: "private_room",
        bathroom_type: "private",
        max_guests: 2,
        room_count: 1,
        food_provided: "Fresh home-cooked Maithil breakfast and evening tea included.",
        general_location: "Ranti Village, near Panchayat Bhavan, Madhubani",
        household_adults_count: 3,
        has_children: false,
        has_pets: false,
        other_residents_description: "Elder artisan parents and host reside in the family quarters across the courtyard.",
        house_rules: "Modest cultural attire requested. No footwear inside the traditional painting rooms. Alcohol and smoking strictly prohibited on family premises.",
        price_per_night_paise: 0,
        status: "approved",
        verification_tier: "tier_2_stay_approved",
        host_id: "p1111111-1111-1111-1111-111111111111",
        host_display_name: "Radha Devi & Family",
      };

      return (
        <div className="site-container py-10 max-w-4xl">
          <Breadcrumbs isHindi={isHindi} title={demoListing.title} />
          <StayDetailClient
            listing={demoListing}
            isHindi={isHindi}
            staysEnabled={staysEnabled}
            pricesVisible={pricesVisible}
          />
        </div>
      );
    }
    notFound();
  }

  // Fetch host display name
  const { data: hostProfile } = await adminClient
    .from("local_member_profiles")
    .select("display_name")
    .eq("user_id", listing.host_id)
    .single();

  const formattedListing = {
    id: listing.id,
    title: listing.title,
    title_hi: listing.title,
    accommodation_type: listing.accommodation_type,
    room_type: listing.room_type,
    bathroom_type: listing.bathroom_type,
    max_guests: listing.max_guests,
    room_count: listing.room_count,
    food_provided: listing.food_provided || "None",
    general_location: listing.general_location,
    household_adults_count: listing.household_adults_count || 1,
    has_children: listing.has_children,
    has_pets: listing.has_pets,
    other_residents_description: listing.other_residents_description || "",
    house_rules: listing.house_rules || "",
    price_per_night_paise: listing.price_per_night_paise,
    status: listing.status,
    verification_tier: listing.verification_tier || "tier_1_day_only",
    host_id: listing.host_id,
    host_display_name: hostProfile?.display_name || "Verified Local Host",
  };

  return (
    <div className="site-container py-10 max-w-4xl">
      <Breadcrumbs isHindi={isHindi} title={formattedListing.title} />
      <StayDetailClient
        listing={formattedListing}
        isHindi={isHindi}
        staysEnabled={staysEnabled}
        pricesVisible={pricesVisible}
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
          <Link href="/explore/stays" className="hover:text-primary transition-colors">
            {isHindi ? "पारिवारिक प्रवास" : "Stays"}
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
