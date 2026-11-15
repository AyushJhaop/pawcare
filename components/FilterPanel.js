"use client";

import { Clock, ShieldAlert, Star, ArrowUpDown, RotateCcw } from "lucide-react";

export default function FilterPanel({
  category,
  openNow,
  emergencyOnly,
  minRating,
  sortBy,
  onToggleOpenNow,
  onToggleEmergency,
  onRatingChange,
  onSortChange,
  onClearAll,
  totalResults,
  hasUserCoords = false,
}) {
  const activeFilterCount =
    (category && category !== "All" ? 1 : 0) +
    (openNow ? 1 : 0) +
    (emergencyOnly ? 1 : 0) +
    (Number(minRating) > 0 ? 1 : 0);

  return (
    <div className="bg-[#EEE7DE] rounded-[28px] p-4 sm:p-5 border border-[#142746]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Left: Interactive Filter Toggles */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Open Now Filter */}
        <button
          type="button"
          aria-pressed={openNow}
          onClick={onToggleOpenNow}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            openNow
              ? "bg-[#142746] text-white shadow-sm"
              : "bg-white text-[#142746] border border-[#142746]/15 hover:border-[#142746]"
          }`}
        >
          <Clock
            className={`w-3.5 h-3.5 ${
              openNow ? "text-[#F0523B]" : "text-[#142746]"
            }`}
          />
          <span>Open Now</span>
        </button>

        {/* Emergency Services Filter */}
        <button
          type="button"
          aria-pressed={emergencyOnly}
          onClick={onToggleEmergency}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            emergencyOnly
              ? "bg-[#F0523B] text-white shadow-sm"
              : "bg-white text-[#142746] border border-[#142746]/15 hover:border-[#F0523B]"
          }`}
        >
          <ShieldAlert
            className={`w-3.5 h-3.5 ${
              emergencyOnly ? "text-white" : "text-[#F0523B]"
            }`}
          />
          <span>24/7 Emergency Services</span>
        </button>

        {/* Rating Filter */}
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#142746]/15">
          <Star className="w-3.5 h-3.5 text-[#F0523B] fill-[#F0523B]" />
          <label htmlFor="filter-min-rating" className="sr-only">
            Minimum Rating
          </label>
          <select
            id="filter-min-rating"
            value={minRating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-[#142746] focus:outline-none cursor-pointer"
          >
            <option value={0}>All Ratings</option>
            <option value={4.8}>4.8 ★ &amp; above</option>
            <option value={4.9}>4.9 ★ &amp; above</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#142746]/15">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#142746]" />
          <label htmlFor="filter-sort-by" className="text-xs text-[#6D6B68]">
            Sort:
          </label>
          <select
            id="filter-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#142746] focus:outline-none cursor-pointer"
          >
            <option value="relevance">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            {hasUserCoords && <option value="distance">Nearest (GPS)</option>}
          </select>
        </div>
      </div>

      {/* Right: Results Count & Clear All Filters */}
      <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#142746]/10">
        <span className="text-xs font-bold text-[#142746]">
          Showing <span className="text-[#F0523B]">{totalResults}</span>{" "}
          {totalResults === 1 ? "provider" : "providers"}{" "}
          <span className="text-[#6D6B68] font-normal">(Demo Data)</span>
        </span>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#142746] text-white hover:bg-[#F0523B] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters ({activeFilterCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}

