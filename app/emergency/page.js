"use client";

import Link from "next/link";
import { ShieldAlert, PhoneCall, CheckCircle2, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencySection from "@/components/EmergencySection";

const TRIAGE_TIPS = [
  {
    step: "1. Call Ahead Before Transit",
    detail:
      "Contact the 24/7 emergency hospital or veterinary ambulance first so the clinical triage team can prepare oxygen or trauma equipment.",
  },
  {
    step: "2. Keep Your Companion Calm & Warm",
    detail:
      "Minimize movement for suspected fractures or spinal injuries, and use a firm carrier or blanket stretcher.",
  },
  {
    step: "3. Bring Medication & Packaging",
    detail:
      "If toxin or medication ingestion is suspected, bring the container or plant sample for immediate toxicology review.",
  },
];

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-12">
        <EmergencySection />

        {/* Triage Preparedness Section */}
        <section
          aria-labelledby="triage-guide-heading"
          className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                EMERGENCY PREPAREDNESS
              </span>
              <h2
                id="triage-guide-heading"
                className="font-display-hero uppercase text-3xl sm:text-5xl text-[#142746] mt-1"
              >
                WHAT TO DO DURING A PET EMERGENCY
              </h2>
            </div>
            <Link
              href="/discover?emergency=true"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F0523B] hover:underline"
            >
              <span>Filter all 24/7 providers in Discovery</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRIAGE_TIPS.map((tip) => (
              <div
                key={tip.step}
                className="p-6 rounded-3xl bg-[#F8F1E8] border border-[#142746]/10 space-y-2"
              >
                <div className="flex items-center gap-2 text-[#F0523B] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <h3>{tip.step}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#6D6B68] leading-relaxed">
                  {tip.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

