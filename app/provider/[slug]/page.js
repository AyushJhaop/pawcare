"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderDetails from "@/components/ProviderDetails";
import {
  getProviderBySlug,
  getSavedProviderIds,
  toggleSavedProvider,
} from "@/lib/storage";

function ProviderDetailContent() {
  const params = useParams();
  const slug = params?.slug;

  const [provider, setProvider] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setProvider(getProviderBySlug(slug));
      setSavedIds(getSavedProviderIds());
      setLoaded(true);
    };
    sync();
    window.addEventListener("pawcare-storage-updated", sync);
    return () => window.removeEventListener("pawcare-storage-updated", sync);
  }, [slug]);

  const handleToggleSave = (providerId) => {
    const res = toggleSavedProvider(providerId);
    setSavedIds(res.savedIds);
  };

  if (!loaded) {
    return (
      <div className="p-12 text-center text-sm text-[#6D6B68]">
        Loading provider details...
      </div>
    );
  }

  if (provider) {
    return (
      <ProviderDetails
        provider={provider}
        isSaved={savedIds.includes(provider.id)}
        onToggleSave={handleToggleSave}
      />
    );
  }

  return (
    <div className="bg-white rounded-[36px] p-12 text-center border border-[#142746]/10 max-w-xl mx-auto">
      <h1 className="font-display-hero uppercase text-4xl text-[#142746]">
        PROVIDER NOT FOUND
      </h1>
      <p className="text-sm text-[#6D6B68] mt-2">
        We couldn&apos;t find a provider matching &ldquo;{slug}&rdquo;.
      </p>
      <Link
        href="/discover"
        className="mt-6 inline-block px-6 py-3.5 rounded-full bg-[#F0523B] text-white text-xs font-bold"
      >
        Return to Discovery Directory
      </Link>
    </div>
  );
}

export default function ProviderDetailPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[#6D6B68]">
              Loading provider details...
            </div>
          }
        >
          <ProviderDetailContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
