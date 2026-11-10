"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
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
    <div className={cn("w-full border border-rule bg-surface rounded-sm p-4 sm:p-6", className)}>
      {/* Search Mode Tabs */}
      <div
        role="tablist"
        aria-label="Search Mode Selection"
        className="flex items-center gap-1 pb-4 mb-4 border-b border-rule overflow-x-auto text-xs font-medium"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "people"}
          onClick={() => setMode("people")}
          className={cn(
            "tap-target px-3 py-1.5 rounded-sm transition-colors duration-[120ms]",
            mode === "people"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-text"
          )}
        >
          {isHindi ? "स्थानीय नागरिक (People)" : "People"}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "experiences"}
          onClick={() => setMode("experiences")}
          className={cn(
            "tap-target px-3 py-1.5 rounded-sm transition-colors duration-[120ms]",
            mode === "experiences"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-text"
          )}
        >
          {isHindi ? "अनुभव (Experiences)" : "Experiences"}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "stays"}
          onClick={() => setMode("stays")}
          className={cn(
            "tap-target px-3 py-1.5 rounded-sm transition-colors duration-[120ms]",
            mode === "stays"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-text"
          )}
        >
          {isHindi ? "प्रवास (Stays)" : "Stays"}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "places"}
          onClick={() => setMode("places")}
          className={cn(
            "tap-target px-3 py-1.5 rounded-sm transition-colors duration-[120ms]",
            mode === "places"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-text"
          )}
        >
          {isHindi ? "स्थान (Places)" : "Places"}
        </button>
      </div>

      {/* Dependent Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Dependent State Select */}
          <div>
            <label htmlFor="search-state" className="block text-xs font-medium text-secondary mb-1">
              {t("stateLabel")}
            </label>
            <select
              id="search-state"
              value={selectedStateId}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
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
            <label htmlFor="search-district" className="block text-xs font-medium text-secondary mb-1">
              {t("districtLabel")}
            </label>
            <select
              id="search-district"
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
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
            <label htmlFor="search-city" className="block text-xs font-medium text-secondary mb-1">
              {t("cityLabel")}
            </label>
            <select
              id="search-city"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
            >
              <option value="">{isHindi ? "सभी नगर (All Towns)" : "All Towns"}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {isHindi ? c.nameHi : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker (Optional) */}
          <div>
            <label htmlFor="search-date" className="block text-xs font-medium text-secondary mb-1">
              {t("dateLabel")}
            </label>
            <input
              id="search-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
            />
          </div>

          {/* Guests Count (Only for Experiences and Stays) */}
          {(mode === "experiences" || mode === "stays") && (
            <div>
              <label htmlFor="search-guests" className="block text-xs font-medium text-secondary mb-1">
                {t("guestsLabel")} (Max 2 for Stays)
              </label>
              <select
                id="search-guests"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                className="h-[44px] w-full px-3 text-xs bg-page text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
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

        {/* Action row: Submit button + Secondary link */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="submit"
            className="tap-target px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-sm text-xs font-medium transition-colors duration-[120ms] text-center"
          >
            {isHindi ? "भारत देखें / Explore India" : "Explore India / भारत देखें"}
          </button>

          <Link
            href="/become-a-host"
            className="text-xs font-medium text-secondary hover:text-primary underline underline-offset-4 transition-colors duration-[120ms]"
          >
            {isHindi ? "स्थानीय मेज़बान बनें" : "Become a local host"}
          </Link>
        </div>
      </form>
    </div>
  );
}
