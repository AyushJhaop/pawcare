"use client";

import { Search, MapPin, Navigation, X } from "lucide-react";

export default function SearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSubmit,
  onClear,
  onUseGeolocation,
  geoStatus,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  const hasInputs = Boolean(query?.trim() || location?.trim());

  return (
    <div className="bg-white rounded-[30px] p-3 sm:p-4 shadow-[0_18px_45px_rgba(20,39,70,0.08)] border border-[#142746]/10">
      <form
        onSubmit={handleFormSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
      >
        {/* Service / Provider / Keyword Input */}
        <div className="lg:col-span-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-transparent focus-within:border-[#142746]/30">
          <Search className="w-5 h-5 text-[#F0523B] shrink-0" />
          <div className="w-full">
            <label
              htmlFor="discovery-search-query"
              className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6D6B68]"
            >
              Service, Provider, or Keyword
            </label>
            <input
              id="discovery-search-query"
              name="query"
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="e.g., dental, ultrasound, ambulance, Atelier..."
              className="w-full bg-transparent text-sm font-medium text-[#142746] placeholder:text-[#6D6B68]/70 focus:outline-none mt-0.5"
            />
          </div>
        </div>

        {/* Location or Area Input */}
        <div className="lg:col-span-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-transparent focus-within:border-[#142746]/30">
          <MapPin className="w-5 h-5 text-[#142746] shrink-0" />
          <div className="w-full">
            <label
              htmlFor="discovery-search-location"
              className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6D6B68]"
            >
              Location, Area, or Borough
            </label>
            <input
              id="discovery-search-location"
              name="location"
              type="text"
              enterKeyHint="search"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="e.g., SoHo, Brooklyn, Chelsea, Queens..."
              className="w-full bg-transparent text-sm font-medium text-[#142746] placeholder:text-[#6D6B68]/70 focus:outline-none mt-0.5"
            />
          </div>
          {onUseGeolocation && (
            <button
              type="button"
              onClick={onUseGeolocation}
              title="Request browser GPS permission to calculate distance to sample providers"
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EEE7DE] hover:bg-[#142746] text-[#142746] hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Navigation className="w-3 h-3 text-[#F0523B]" />
              <span>GPS</span>
            </button>
          )}
        </div>

        {/* Submit & Clear Buttons */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <button
            type="submit"
            className="flex-1 bg-[#F0523B] hover:bg-[#d9432d] text-white font-semibold text-sm py-4 px-5 rounded-2xl shadow-[0_10px_25px_rgba(240,82,59,0.28)] transition-all cursor-pointer"
          >
            Search Care
          </button>
          {hasInputs && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search inputs"
              className="px-4 py-4 rounded-2xl border border-[#142746]/20 text-xs font-bold text-[#142746] hover:bg-[#EEE7DE] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </form>

      {/* Geolocation or Location Status Feedback */}
      {(geoStatus || location?.trim()) && (
        <div className="mt-3 pt-2.5 border-t border-[#142746]/10 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-[#6D6B68]">
          <div className="flex items-center gap-2">
            {location?.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7DE] text-[#142746] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#F0523B]" />
                Filtering area: &ldquo;{location.trim()}&rdquo; (Text filter)
              </span>
            )}
            {geoStatus && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746]/10 text-[#142746] font-medium">
                <Navigation className="w-3.5 h-3.5 text-[#F0523B]" />
                {geoStatus}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#6D6B68]">
            Quick areas:{" "}
            {["SoHo", "West Village", "Brooklyn", "Chelsea", "Queens"].map(
              (area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => onLocationChange(area)}
                  className="underline hover:text-[#F0523B] mr-2 cursor-pointer"
                >
                  {area}
                </button>
              )
            )}
          </span>
        </div>
      )}
    </div>
  );
}

