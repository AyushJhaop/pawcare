"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  X,
  RotateCcw,
  AlertCircle,
  Flag,
  PlusCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import FilterPanel from "@/components/FilterPanel";
import ProviderCard from "@/components/ProviderCard";
import ProviderDetails from "@/components/ProviderDetails";
import { SERVICE_CATEGORIES } from "@/data/providers";
import {
  getAllProviders,
  getSavedProviderIds,
  toggleSavedProvider,
} from "@/lib/storage";
import { filterAndSortProviders } from "@/lib/search";

function DiscoverContent() {
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Filter states initialized from URL query params when navigating from homepage/links
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [location, setLocation] = useState(
    () => searchParams.get("location") || ""
  );
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [openNow, setOpenNow] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(
    () => searchParams.get("emergency") === "true"
  );
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Optional browser geolocation state
  const [userCoords, setUserCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("");

  // Quick detail modal state (preserves search/filter state)
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const syncData = () => {
      setProviders(getAllProviders());
      setSavedIds(getSavedProviderIds());
    };
    syncData();
    window.addEventListener("pawcare-storage-updated", syncData);
    return () =>
      window.removeEventListener("pawcare-storage-updated", syncData);
  }, []);

  const handleToggleSave = (providerId) => {
    const res = toggleSavedProvider(providerId);
    setSavedIds(res.savedIds);
  };

  const handleClearSearch = () => {
    setQuery("");
    setLocation("");
    setUserCoords(null);
    setGeoStatus("");
  };

  const handleClearAllFilters = () => {
    setQuery("");
    setLocation("");
    setCategory("All");
    setOpenNow(false);
    setEmergencyOnly(false);
    setMinRating(0);
    setSortBy("relevance");
    setUserCoords(null);
    setGeoStatus("");
  };

  const handleUseGeolocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("Browser geolocation is unavailable on this device.");
      return;
    }
    setGeoStatus("Requesting browser GPS permission...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setSortBy("distance");
        setGeoStatus("GPS active — showing distance to sample NYC coordinates");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus(
            "GPS permission denied. Using text-based neighborhood search instead."
          );
        } else {
          setGeoStatus(
            "Could not determine live GPS position. Use the location input above."
          );
        }
      },
      { timeout: 8000 }
    );
  };

  const filteredProviders = filterAndSortProviders(providers, {
    query,
    location,
    category,
    openNow,
    emergencyOnly,
    minRating,
    sortBy,
    userCoords,
  });

  const hasActiveFilters =
    Boolean(query.trim()) ||
    Boolean(location.trim()) ||
    category !== "All" ||
    openNow ||
    emergencyOnly ||
    minRating > 0;

  return (
    <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE7DE] text-[#F0523B] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Discovery Directory</span>
          </span>
          <h1 className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9]">
            FIND THE RIGHT CARE FOR EVERY PAW.
          </h1>
          <p className="text-[#6D6B68] text-base sm:text-lg mt-2.5 max-w-2xl">
            Discover trusted animal-care professionals and services near you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/list-business"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#142746] hover:bg-[#1f3b68] text-white text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#F0523B]" />
            <span>List Your Business</span>
          </Link>
          <Link
            href="/submit-correction"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-[#142746] text-xs font-bold transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-[#F0523B]" />
            <span>Submit a Correction</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        query={query}
        location={location}
        onQueryChange={setQuery}
        onLocationChange={setLocation}
        onClear={handleClearSearch}
        onUseGeolocation={handleUseGeolocation}
        geoStatus={geoStatus}
      />

      {/* 6 Service Categories Grid */}
      <section aria-labelledby="discovery-categories-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="discovery-categories-heading"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#142746]"
          >
            Browse by Service Category (6 Pillars)
          </h2>
          {category !== "All" && (
            <button
              type="button"
              onClick={() => setCategory("All")}
              className="text-xs font-bold text-[#F0523B] hover:underline cursor-pointer"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {SERVICE_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={category === cat.id}
              onSelect={(selectedId) =>
                setCategory((prev) =>
                  prev === selectedId ? "All" : selectedId
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Filter Panel */}
      <FilterPanel
        category={category}
        openNow={openNow}
        emergencyOnly={emergencyOnly}
        minRating={minRating}
        sortBy={sortBy}
        onToggleOpenNow={() => setOpenNow((prev) => !prev)}
        onToggleEmergency={() => setEmergencyOnly((prev) => !prev)}
        onRatingChange={setMinRating}
        onSortChange={setSortBy}
        onClearAll={handleClearAllFilters}
        totalResults={filteredProviders.length}
        hasUserCoords={Boolean(userCoords)}
      />

      {/* Visible Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6D6B68] mr-1">
            Active Filters:
          </span>
          {category !== "All" && (
            <button
              type="button"
              onClick={() => setCategory("All")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746] text-white text-xs font-semibold cursor-pointer"
            >
              <span>Category: {category}</span>
              <X className="w-3.5 h-3.5 text-[#F0523B]" />
            </button>
          )}
          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746] text-white text-xs font-semibold cursor-pointer"
            >
              <span>Keyword: &ldquo;{query.trim()}&rdquo;</span>
              <X className="w-3.5 h-3.5 text-[#F0523B]" />
            </button>
          )}
          {location.trim() && (
            <button
              type="button"
              onClick={() => setLocation("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746] text-white text-xs font-semibold cursor-pointer"
            >
              <span>Area: &ldquo;{location.trim()}&rdquo;</span>
              <X className="w-3.5 h-3.5 text-[#F0523B]" />
            </button>
          )}
          {openNow && (
            <button
              type="button"
              onClick={() => setOpenNow(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746] text-white text-xs font-semibold cursor-pointer"
            >
              <span>Open Now</span>
              <X className="w-3.5 h-3.5 text-[#F0523B]" />
            </button>
          )}
          {emergencyOnly && (
            <button
              type="button"
              onClick={() => setEmergencyOnly(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0523B] text-white text-xs font-semibold cursor-pointer"
            >
              <span>24/7 Emergency Only</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {minRating > 0 && (
            <button
              type="button"
              onClick={() => setMinRating(0)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746] text-white text-xs font-semibold cursor-pointer"
            >
              <span>{minRating}+ ★</span>
              <X className="w-3.5 h-3.5 text-[#F0523B]" />
            </button>
          )}
        </div>
      )}

      {/* Demo Data Notice */}
      <div className="p-4 rounded-2xl bg-[#EEE7DE]/70 border border-[#142746]/10 flex items-center gap-2.5 text-xs text-[#6D6B68]">
        <AlertCircle className="w-4 h-4 text-[#F0523B] shrink-0" />
        <span>
          All provider records, ratings, phone numbers, opening hours, and
          verification badges shown below are{" "}
          <strong className="text-[#142746]">illustrative demo data</strong>.
        </span>
      </div>

      {/* Results Grid or Empty State */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isSaved={savedIds.includes(provider.id)}
              onToggleSave={handleToggleSave}
              onViewDetails={(prov) => setSelectedProvider(prov)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[36px] p-12 text-center border border-[#142746]/10 max-w-xl mx-auto my-8">
          <h3 className="font-display-hero uppercase text-3xl text-[#142746]">
            NO MATCHING PROVIDERS FOUND
          </h3>
          <p className="text-sm text-[#6D6B68] mt-2 leading-relaxed">
            No sample providers matched your current combination of search terms
            and filters. Try clearing one or more filters to broaden your
            search.
          </p>
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

      {/* Detail Modal so users can inspect & return without losing filter state */}
      {selectedProvider && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${selectedProvider.name}`}
          className="fixed inset-0 z-50 bg-[#142746]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <ProviderDetails
              provider={selectedProvider}
              isSaved={savedIds.includes(selectedProvider.id)}
              onToggleSave={handleToggleSave}
              onBack={() => setSelectedProvider(null)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-[1380px] mx-auto px-6 py-20 text-center text-sm text-[#6D6B68]">
              Loading PawCare service discovery...
            </div>
          }
        >
          <DiscoverContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
