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

  return (
    <div
      className={cn(
        "w-full border border-rule/90 bg-surface rounded-md p-4 sm:p-6 shadow-xs",
        className
      )}
    >
      {/* Search Mode Segmented Tabs with Semantic Icons */}
      <div
        role="tablist"
        aria-label="Search Mode Selection"
        className="flex items-center gap-2 pb-4 mb-5 border-b border-rule/70 overflow-x-auto text-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "people"}
          onClick={() => setMode("people")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-md font-medium text-xs transition-all duration-150",
            mode === "people"
              ? "bg-[#283827] text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-warm-grey/30"
          )}
        >
          <Users className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "लोग (People)" : "People"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "experiences"}
          onClick={() => setMode("experiences")}
          className={cn(
            "tap-target inline-flex items-center px-4 py-2 rounded-md font-medium text-xs transition-all duration-150",
            mode === "experiences"
              ? "bg-[#283827] text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-warm-grey/30"
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
            "tap-target inline-flex items-center px-4 py-2 rounded-md font-medium text-xs transition-all duration-150",
            mode === "stays"
              ? "bg-[#283827] text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-warm-grey/30"
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
            "tap-target inline-flex items-center px-4 py-2 rounded-md font-medium text-xs transition-all duration-150",
            mode === "places"
              ? "bg-[#283827] text-white shadow-xs"
              : "text-secondary hover:text-text hover:bg-warm-grey/30"
          )}
        >
          <MapPin className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
          <span>{isHindi ? "स्थान (Places)" : "Places"}</span>
        </button>
      </div>

      {/* Dependent Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Dependent State Select */}
          <div>
            <label htmlFor="search-state" className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
              <MapPin className="w-3 h-3 text-terracotta" strokeWidth={1.5} />
              <span>{t("stateLabel")}</span>
            </label>
            <select
              id="search-state"
              value={selectedStateId}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none transition-colors"
            >
              {OFFICIAL_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {isHindi ? s.nameHi : s.name} ({s.kind === "state" ? (isHindi ? "राज्य" : "State") : (isHindi ? "केंद्र शासित" : "UT")})
                </option>
              ))}
            </select>
          </div>

          {/* Dependent District Select */}
          <div>
            <label htmlFor="search-district" className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
              <MapPin className="w-3 h-3 text-terracotta" strokeWidth={1.5} />
              <span>{t("districtLabel")}</span>
            </label>
            <select
              id="search-district"
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none transition-colors"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isHindi ? d.nameHi : d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dependent Town / City Select */}
          <div>
            <label htmlFor="search-city" className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
              <MapPin className="w-3 h-3 text-terracotta" strokeWidth={1.5} />
              <span>{t("cityLabel")}</span>
            </label>
            <select
              id="search-city"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none transition-colors"
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
          <div>
            <label htmlFor="search-date" className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
              <Calendar className="w-3 h-3 text-terracotta" strokeWidth={1.5} />
              <span>{t("dateLabel")}</span>
            </label>
            <input
              id="search-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none transition-colors"
            />
          </div>

          {/* Guests Count (Only for Experiences and Stays) */}
          {(mode === "experiences" || mode === "stays") && (
            <div>
              <label htmlFor="search-guests" className="flex items-center gap-1.5 text-xs font-medium text-secondary mb-1.5">
                <Users className="w-3 h-3 text-terracotta" strokeWidth={1.5} />
                <span>{t("guestsLabel")} (Max 2 for Stays)</span>
              </label>
              <select
                id="search-guests"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none transition-colors"
              >
                <option value={1}>{isHindi ? "1 व्यक्ति (1 Guest)" : "1 Guest"}</option>
                <option value={2}>{isHindi ? "2 व्यक्ति (2 Guests)" : "2 Guests"}</option>
                {mode === "experiences" && (
                  <>
                    <option value={3}>{isHindi ? "3 व्यक्ति (3 Guests)" : "3 Guests"}</option>
                    <option value={4}>{isHindi ? "4 व्यक्ति (4 Guests)" : "4 Guests"}</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>

        {/* Action row: Submit button + Pilot notice badge */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-rule/50">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <CheckCircle2 className="w-4 h-4 text-forest shrink-0" strokeWidth={1.75} />
            <span>
              {isHindi
                ? "पायलट क्षेत्र: उत्तरी बिहार (दरभंगा और मधुबनी) · १००% सत्यापित नागरिक"
                : "Pilot area: Northern Bihar (Darbhanga & Madhubani) · 100% verified residents"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="tap-target px-6 py-2.5 bg-[#283827] hover:bg-[#1f2b1e] text-white rounded-md text-xs font-medium transition-all duration-150 inline-flex items-center justify-center gap-2 shadow-xs hover:shadow-sm"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{isHindi ? "खोजें · Search" : "Search"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

