"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CorrectionForm from "@/components/CorrectionForm";

function CorrectionPageContent() {
  const searchParams = useSearchParams();
  const providerParam = searchParams.get("provider") || "";

  return (
    <CorrectionForm
      key={providerParam}
      initialProviderName={providerParam}
    />
  );
}

export default function SubmitCorrectionPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-[1140px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[#6D6B68]">
              Loading correction form...
            </div>
          }
        >
          <CorrectionPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
