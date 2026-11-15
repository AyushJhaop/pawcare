"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessForm from "@/components/BusinessForm";
import { ShieldCheck, Clock, HelpCircle } from "lucide-react";

export default function ListBusinessPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-[1140px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-10">
        {/* Verification Trust Banner */}
        <div className="bg-[#EEE7DE] rounded-[32px] p-6 sm:p-8 border border-[#142746]/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#F0523B] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-[#142746]">
                1. Pending Verification
              </h2>
              <p className="text-xs text-[#6D6B68] mt-1 leading-relaxed">
                All newly submitted businesses start as{" "}
                <strong>Pending Verification</strong> and are never
                automatically verified.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#142746] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-[#142746]">
                2. Credential Review
              </h2>
              <p className="text-xs text-[#6D6B68] mt-1 leading-relaxed">
                In a production deployment, veterinary licenses and facility
                registrations are reviewed by the Admin team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#6D6B68] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-[#142746]">
                3. Community Corrections
              </h2>
              <p className="text-xs text-[#6D6B68] mt-1 leading-relaxed">
                Pet parents and caregivers can flag outdated hours or phone
                numbers at any time.
              </p>
            </div>
          </div>
        </div>

        <BusinessForm />
      </main>
      <Footer />
    </div>
  );
}

