"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Sparkles, ArrowUpRight, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderCard from "@/components/ProviderCard";
import {
  getAllProviders,
  getSavedProviderIds,
  toggleSavedProvider,
  removeSavedProvider,
} from "@/lib/storage";

export default function SavedProvidersPage() {
  const [savedProviders, setSavedProviders] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const sync = () => {
      const ids = getSavedProviderIds();
      const all = getAllProviders();
      setSavedIds(ids);
      setSavedProviders(all.filter((p) => ids.includes(p.id)));
    };
    sync();
    window.addEventListener("pawcare-storage-updated", sync);
    return () => window.removeEventListener("pawcare-storage-updated", sync);
  }, []);

  const handleToggleSave = (providerId) => {
    toggleSavedProvider(providerId);
  };

  const handleClearAllSaved = () => {
    savedIds.forEach((id) => removeSavedProvider(id));
  };

  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#142746]/10 pb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE7DE] text-[#F0523B] text-xs font-bold uppercase tracking-[0.18em] mb-3">
              <Heart className="w-3.5 h-3.5 fill-[#F0523B]" />
              <span>Personal Care Shortlist</span>
            </span>
            <h1 className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl tracking-tight leading-[0.9]">
              SAVED PROVIDERS ({savedProviders.length})
            </h1>
            <p className="text-[#6D6B68] text-base mt-2">
              Your bookmarked veterinary clinics, 24/7 hospitals, ambulances,
              and care specialists—persisted in your browser.
            </p>
          </div>

          {savedProviders.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllSaved}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-xs font-bold text-[#142746] self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#F0523B]" />
              <span>Clear Saved List</span>
            </button>
          )}
        </div>

        {savedProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {savedProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isSaved={true}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[36px] p-12 text-center border border-[#142746]/10 max-w-xl mx-auto my-8">
            <span className="w-14 h-14 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </span>
            <h2 className="font-display-hero uppercase text-3xl text-[#142746]">
              NO SAVED PROVIDERS YET
            </h2>
            <p className="text-sm text-[#6D6B68] mt-2 leading-relaxed">
              Bookmark your trusted veterinary clinics, 24/7 hospitals,
              boarding studios, or emergency ambulances while browsing so you
              can reach them in one tap anytime.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>Explore Care Directory</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

