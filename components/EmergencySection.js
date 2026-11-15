"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Phone,
  Navigation,
  MapPin,
  Clock,
  Truck,
  Building2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { getAllProviders } from "@/lib/storage";
import { getGoogleMapsDirectionsUrl } from "@/lib/search";
import VerificationBadge from "@/components/VerificationBadge";

export default function EmergencySection({ compact = false }) {
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [emergencyProviders, setEmergencyProviders] = useState([]);

  useEffect(() => {
    const syncProviders = () => {
      const all = getAllProviders();
      setEmergencyProviders(
        all.filter(
          (p) =>
            p.emergencyAvailable ||
            p.category === "Veterinary Ambulances" ||
            p.category === "Animal Hospitals"
        )
      );
    };
    syncProviders();
    window.addEventListener("pawcare-storage-updated", syncProviders);
    return () =>
      window.removeEventListener("pawcare-storage-updated", syncProviders);
  }, []);

  const filtered = emergencyProviders.filter((prov) => {
    if (activeTab === "hospitals" && prov.category !== "Animal Hospitals") {
      return false;
    }
    if (
      activeTab === "ambulances" &&
      prov.category !== "Veterinary Ambulances"
    ) {
      return false;
    }
    if (locationQuery.trim()) {
      const q = locationQuery.trim().toLowerCase();
      const hay = `${prov.name} ${prov.address} ${prov.city} ${
        prov.area || ""
      }`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });

  return (
    <section
      aria-labelledby="emergency-care-heading"
      className="bg-[#142746] text-[#F8F1E8] rounded-[40px] sm:rounded-[48px] p-6 sm:p-10 lg:p-14 border border-white/10 shadow-[0_24px_60px_rgba(20,39,70,0.22)] relative overflow-hidden"
    >
      {/* Subtle Ambient Coral Glow */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#F0523B]/15 blur-3xl pointer-events-none"
      />

      {/* Demo Emergency Disclaimer Banner */}
      <div className="relative z-10 mb-8 p-4 rounded-2xl bg-[#F0523B]/15 border border-[#F0523B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-[#F8F1E8]">
          <AlertTriangle className="w-5 h-5 text-[#F0523B] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Demo Prototype Notice:</strong> All emergency phone numbers,
            hospitals, and ambulance units listed below are illustrative sample
            data (`+1-555-...`) for product demonstration only.
          </span>
        </div>
        <Link
          href="/discover?emergency=true"
          className="shrink-0 text-xs font-bold text-[#F0523B] hover:text-white underline underline-offset-4"
        >
          Open in Discovery Filter →
        </Link>
      </div>

      {/* Header & Location Filter */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-[0.18em] mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>24/7 Urgent Triage &amp; Transport</span>
          </span>
          <h2
            id="emergency-care-heading"
            className="font-display-hero uppercase text-white text-4xl sm:text-6xl tracking-tight leading-[0.92]"
          >
            NEED URGENT HELP FOR YOUR PET?
          </h2>
          <p className="font-script-accent text-[#F0523B] text-3xl sm:text-4xl mt-1">
            Because every second matters.
          </p>
          <p className="text-sm sm:text-base text-[#EEE7DE]/80 leading-relaxed mt-3 max-w-xl">
            Find emergency veterinary support and animal-care assistance—from
            24/7 trauma hospitals to oxygen-equipped mobile veterinary
            ambulances.
          </p>
        </div>

        {/* Location Filter Box */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15">
          <label
            htmlFor="emergency-location-search"
            className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#EEE7DE] mb-2"
          >
            Filter Emergency Support by Location or Area
          </label>
          <div className="flex items-center gap-2 bg-[#F8F1E8] text-[#142746] rounded-2xl px-3.5 py-2.5">
            <MapPin className="w-4 h-4 text-[#F0523B] shrink-0" />
            <input
              id="emergency-location-search"
              type="search"
              enterKeyHint="search"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Search area (e.g., West Village, Chelsea, Queens)..."
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#142746] placeholder:text-[#6D6B68] focus:outline-none"
            />
            {locationQuery && (
              <button
                type="button"
                onClick={() => setLocationQuery("")}
                className="text-xs font-bold text-[#F0523B] hover:underline px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {[
              { id: "all", label: "All Urgent Care" },
              { id: "hospitals", label: "24/7 Emergency Hospitals", icon: Building2 },
              { id: "ambulances", label: "Veterinary Ambulances", icon: Truck },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#F0523B] text-white"
                    : "bg-white/10 text-[#EEE7DE] hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Providers Grid */}
      {filtered.length > 0 ? (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(compact ? filtered.slice(0, 3) : filtered).map((prov) => {
            const directionsUrl = getGoogleMapsDirectionsUrl(prov);
            return (
              <article
                key={prov.id}
                className="bg-[#F8F1E8] text-[#142746] rounded-[30px] p-6 flex flex-col justify-between shadow-lg border border-white/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#F0523B] text-white text-[11px] font-bold">
                      {prov.category}
                    </span>
                    <VerificationBadge status={prov.verificationStatus} />
                  </div>

                  <h3 className="text-xl font-bold text-[#142746]">
                    {prov.name}
                  </h3>

                  <div className="mt-2.5 space-y-1.5 text-xs text-[#6D6B68]">
                    <p className="flex items-center gap-1.5 font-medium text-[#142746]">
                      <MapPin className="w-3.5 h-3.5 text-[#F0523B] shrink-0" />
                      <span>
                        {prov.address}, {prov.city}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#142746] shrink-0" />
                      <span>{prov.openingHours}</span>
                    </p>
                  </div>

                  <p className="text-xs text-[#6D6B68] leading-relaxed mt-3">
                    {prov.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {(prov.services || []).slice(0, 3).map((srv) => (
                      <span
                        key={srv}
                        className="px-2.5 py-1 rounded-full bg-[#EEE7DE] text-[#142746] text-[11px] font-semibold"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#142746]/10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${prov.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now (Demo)</span>
                    </a>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-[#142746] hover:bg-[#1f3b68] text-white text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#F0523B]" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                  <Link
                    href={`/provider/${prov.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-[#142746] text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F0523B]" />
                    <span>View Emergency Protocol &amp; Details</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="relative z-10 bg-white/10 rounded-3xl p-8 text-center">
          <p className="text-base font-bold text-white">
            No sample emergency providers matched &ldquo;{locationQuery}&rdquo;.
          </p>
          <p className="text-xs text-[#EEE7DE]/75 mt-1">
            Try clearing the location filter to view all borough-wide 24/7
            emergency hospitals and veterinary ambulances.
          </p>
          <button
            type="button"
            onClick={() => {
              setLocationQuery("");
              setActiveTab("all");
            }}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#F0523B] text-white text-xs font-bold cursor-pointer"
          >
            Show All Emergency Providers
          </button>
        </div>
      )}
    </section>
  );
}

