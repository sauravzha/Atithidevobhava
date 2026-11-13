"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  Users,
  Compass,
  Home,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Palette,
  UtensilsCrossed,
  Landmark,
  TreePine,
} from "lucide-react";
import {
  OFFICIAL_STATES,
  getDistricts,
  getCities,
  type DistrictData,
  type CityData,
} from "@/lib/location/data";
import { cn } from "@/lib/utils";

export type SearchMode = "people" | "experiences" | "stays" | "places";

export function UnifiedSearch({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("search");
  const isHindi = locale === "hi";

  const [mode, setMode] = useState<SearchMode>("people");
  const [selectedStateId, setSelectedStateId] = useState<string>("st-br"); // Default to pilot state Bihar
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("dst-darbhanga");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const districts: DistrictData[] = getDistricts(selectedStateId);
  const cities: CityData[] = getCities(selectedDistrictId);

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const newDistricts = getDistricts(stateId);
    if (newDistricts.length > 0 && newDistricts[0]) {
      setSelectedDistrictId(newDistricts[0].id);
      const newCities = getCities(newDistricts[0].id);
      setSelectedCityId(newCities.length > 0 && newCities[0] ? newCities[0].id : "");
    } else {
      setSelectedDistrictId("");
      setSelectedCityId("");
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const newCities = getCities(districtId);
    setSelectedCityId(newCities.length > 0 && newCities[0] ? newCities[0].id : "");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (selectedStateId) params.set("state", selectedStateId);
    if (selectedDistrictId) params.set("district", selectedDistrictId);
    if (selectedCityId) params.set("city", selectedCityId);
    if (selectedDate) params.set("date", selectedDate);
    if (mode === "experiences" || mode === "stays") {
      params.set("guests", guestCount.toString());
    }

    if (mode === "people") {
      router.push(`/explore/people?${params.toString()}`);
    } else if (mode === "experiences") {
      router.push(`/explore/experiences?${params.toString()}`);
    } else if (mode === "stays") {
      router.push(`/explore/stays?${params.toString()}`);
    } else {
      router.push(`/india?${params.toString()}`);
    }
  };

  const quickChips = [
    { labelEn: "Mithila Painting", labelHi: "मिथिला चित्रकला", icon: Palette, state: "st-br", district: "dst-madhubani", mode: "experiences" as SearchMode },
    { labelEn: "Maithili Cuisine", labelHi: "पारंपरिक खान-पान", icon: UtensilsCrossed, state: "st-br", district: "dst-madhubani", mode: "experiences" as SearchMode },
    { labelEn: "Darbhanga Raj Complex", labelHi: "राज परिसर पदयात्रा", icon: Landmark, state: "st-br", district: "dst-darbhanga", mode: "experiences" as SearchMode },
    { labelEn: "Sacred Makhana Harvest", labelHi: "मखाना जल कृषि", icon: TreePine, state: "st-br", district: "dst-darbhanga", mode: "experiences" as SearchMode },
    { labelEn: "Meet Local Residents", labelHi: "स्थानीय नागरिक", icon: Users, state: "st-br", district: "dst-madhubani", mode: "people" as SearchMode },
  ];

  return (
    <div
      className={cn(
        "w-full liquid-glass rounded-sm p-5 sm:p-7 space-y-5 transition-all border border-rule/90 shadow-card",
        className
      )}
    >
      {/* Search Mode Segmented Tabs with Semantic Icons */}
      <div
        role="tablist"
        aria-label="Search Mode Selection"
        className="flex items-center gap-1 p-1 neumorph-inset rounded-xs overflow-x-auto text-xs font-mono uppercase tracking-wider"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "people"}
          onClick={() => setMode("people")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-xs font-semibold text-[11px] transition-all duration-150 shrink-0 tactile-button",
            mode === "people"
              ? "bg-primary text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-surface/60"
          )}
        >
          <Users className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "नागरिक (Meet Locals)" : "Meet Locals"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "experiences"}
          onClick={() => setMode("experiences")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-xs font-semibold text-[11px] transition-all duration-150 shrink-0 tactile-button",
            mode === "experiences"
              ? "bg-primary text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-surface/60"
          )}
        >
          <Compass className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "अनुभव (Experiences)" : "Experiences"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "stays"}
          onClick={() => setMode("stays")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-xs font-semibold text-[11px] transition-all duration-150 shrink-0 tactile-button",
            mode === "stays"
              ? "bg-primary text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-surface/60"
          )}
        >
          <Home className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "प्रवास (Stays)" : "Stays"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "places"}
          onClick={() => setMode("places")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-xs font-semibold text-[11px] transition-all duration-150 shrink-0 tactile-button",
            mode === "places"
              ? "bg-primary text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-surface/60"
          )}
        >
          <MapPin className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "क्षेत्र (Places)" : "Places"}</span>
        </button>
      </div>

      {/* Dependent Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Dependent State Select */}
          <div className="space-y-1.5">
            <label htmlFor="search-state" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-medium text-secondary">
              <MapPin className="w-3.5 h-3.5 text-terracotta" strokeWidth={1.75} />
              <span>{t("stateLabel")}</span>
            </label>
            <select
              id="search-state"
              value={selectedStateId}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-11 w-full px-3.5 text-xs bg-surface text-text border border-rule rounded-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors shadow-2xs font-medium"
            >
              {OFFICIAL_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {isHindi ? s.nameHi : s.name} ({s.kind === "state" ? (isHindi ? "राज्य" : "State") : (isHindi ? "केंद्र शासित" : "UT")})
                </option>
              ))}
            </select>
          </div>

          {/* Dependent District Select */}
          <div className="space-y-1.5">
            <label htmlFor="search-district" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-medium text-secondary">
              <MapPin className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
              <span>{t("districtLabel")}</span>
            </label>
            <select
              id="search-district"
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-11 w-full px-3.5 text-xs bg-surface text-text border border-rule rounded-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors shadow-2xs font-medium"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isHindi ? d.nameHi : d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dependent Town / City Select */}
          <div className="space-y-1.5">
            <label htmlFor="search-city" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-medium text-secondary">
              <MapPin className="w-3.5 h-3.5 text-terracotta" strokeWidth={1.75} />
              <span>{t("cityLabel")}</span>
            </label>
            <select
              id="search-city"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="h-11 w-full px-3.5 text-xs bg-surface text-text border border-rule rounded-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors shadow-2xs font-medium"
            >
              <option value="">{isHindi ? "सभी नगर (All Towns)" : "All Towns"}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {isHindi ? c.nameHi : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label htmlFor="search-date" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-medium text-secondary">
              <Calendar className="w-3.5 h-3.5 text-forest" strokeWidth={1.75} />
              <span>{t("dateLabel")}</span>
            </label>
            <input
              id="search-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-11 w-full px-3.5 text-xs bg-surface text-text border border-rule rounded-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors shadow-2xs font-medium"
            />
          </div>

          {/* Guest Count for Experiences / Stays */}
          {(mode === "experiences" || mode === "stays") && (
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
              <div className="flex items-center justify-between text-xs text-secondary font-mono">
                <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-terracotta" strokeWidth={1.75} />
                  <span>{t("guestsLabel")} (Max {mode === "stays" ? "2" : "6"})</span>
                </span>
                <span className="font-semibold text-text">{guestCount} {guestCount === 1 ? "Guest" : "Guests"}</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].slice(0, mode === "stays" ? 2 : 6).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={cn(
                      "px-3 py-1.5 rounded-xs border text-xs font-mono font-medium transition-all tactile-button",
                      guestCount === num
                        ? "bg-forest text-white border-forest shadow-xs font-semibold"
                        : "bg-surface text-text border-rule hover:border-forest/50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action row: Submit button + Pilot badge */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-rule/60">
          <div className="flex items-center gap-2 text-xs text-secondary font-mono">
            <CheckCircle2 className="w-4 h-4 text-forest shrink-0" strokeWidth={1.75} />
            <span>
              {isHindi
                ? "उत्तरी बिहार पायलट (दरभंगा व मधुबनी) · १००% व्यक्तिगत सत्यापित स्थानीय नागरिक"
                : "North Bihar Pilot (Darbhanga & Madhubani) • 100% ID-checked local residents"}
            </span>
          </div>

          <button
            type="submit"
            className="tap-target px-7 py-3 bg-primary hover:bg-primary-hover text-white rounded-xs text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 inline-flex items-center justify-center gap-2 shadow-xs tactile-button"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{isHindi ? "खोजें व जानें" : "Search & Discover"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick Cultural Exploration Chips */}
      <div className="pt-2 border-t border-rule/50 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider font-medium text-secondary shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-terracotta" />
          <span>{isHindi ? "लोकप्रिय खोज:" : "Trending:"}</span>
        </span>
        {quickChips.map((chip, idx) => {
          const ChipIcon = chip.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMode(chip.mode);
                setSelectedStateId(chip.state);
                setSelectedDistrictId(chip.district);
                const params = new URLSearchParams();
                params.set("mode", chip.mode);
                params.set("state", chip.state);
                params.set("district", chip.district);
                if (chip.mode === "people") router.push(`/explore/people?${params.toString()}`);
                else router.push(`/explore/experiences?${params.toString()}`);
              }}
              className="clay-pill px-3 py-1 bg-surface hover:bg-warm/70 border border-rule/80 hover:border-forest/50 text-[11px] text-text shrink-0 transition-colors shadow-2xs font-medium inline-flex items-center gap-1.5 tactile-button font-mono"
            >
              <ChipIcon className="w-3 h-3 text-terracotta shrink-0" strokeWidth={1.75} />
              <span>{isHindi ? chip.labelHi : chip.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
