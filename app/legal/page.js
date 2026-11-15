"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, FileText } from "lucide-react";

function LegalContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "privacy";

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
          PAWCARE PLATFORM POLICIES (DEMO PROTOTYPE)
        </span>
        <h1 className="font-display-hero uppercase text-4xl sm:text-6xl text-[#142746] mt-2">
          {tab === "terms" ? "TERMS AND CONDITIONS" : "PRIVACY POLICY"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/legal?tab=privacy"
          className={`px-5 py-2.5 rounded-full text-xs font-bold ${
            tab !== "terms"
              ? "bg-[#142746] text-white"
              : "bg-[#EEE7DE] text-[#142746]"
          }`}
        >
          Privacy Policy
        </Link>
        <Link
          href="/legal?tab=terms"
          className={`px-5 py-2.5 rounded-full text-xs font-bold ${
            tab === "terms"
              ? "bg-[#142746] text-white"
              : "bg-[#EEE7DE] text-[#142746]"
          }`}
        >
          Terms &amp; Conditions
        </Link>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#142746]/10 space-y-6 text-sm text-[#6D6B68] leading-relaxed">
        {tab === "terms" ? (
          <>
            <div className="flex items-center gap-2 text-[#142746] font-bold text-base">
              <FileText className="w-5 h-5 text-[#F0523B]" />
              <h2>1. Illustrative Product Prototype Notice</h2>
            </div>
            <p>
              PawCare is an interactive product MVP prototype developed for
              demonstration purposes. All veterinary clinics, animal hospitals,
              boarding facilities, diagnostic laboratories, veterinary
              ambulances, and animal welfare NGOs displayed in the directory are
              illustrative sample listings.
            </p>
            <h2 className="text-base font-bold text-[#142746]">
              2. Verification &amp; User Submissions
            </h2>
            <p>
              New business listings submitted through the platform are assigned
              a <strong>Pending Verification</strong> status and stored locally
              in the user&apos;s browser (<code>localStorage</code>). Correction
              requests are assigned a <strong>Pending Review</strong> status.
            </p>
            <h2 className="text-base font-bold text-[#142746]">
              3. Emergency Medical Disclaimer
            </h2>
            <p>
              Sample phone numbers (`+1-555-...`) are non-working demonstration
              numbers. In an actual veterinary emergency, always contact a
              licensed local veterinary hospital directly.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[#142746] font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[#F0523B]" />
              <h2>1. Client-Side Demo Storage</h2>
            </div>
            <p>
              In this MVP prototype, saved providers, demo authentication
              sessions, submitted business listings, and correction reports are
              stored locally in your browser&apos;s <code>localStorage</code>.
              No personal data is transmitted to external third-party servers.
            </p>
            <h2 className="text-base font-bold text-[#142746]">
              2. Optional Browser Geolocation
            </h2>
            <p>
              When you click the optional GPS button in the Discovery search
              bar, PawCare requests browser permission to read your coordinates
              solely to calculate illustrative distance to sample providers. You
              can use text-based neighborhood filtering at any time without
              granting GPS permission.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
          <LegalContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

