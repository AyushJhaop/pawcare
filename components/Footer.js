"use client";

import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#142746] text-[#F8F1E8] border-t border-white/10">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        {/* Demo Prototype Notice Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F0523B] shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm text-[#EEE7DE]/90 leading-relaxed">
              <strong className="text-white">Illustrative MVP Prototype:</strong>{" "}
              All provider listings, ratings, phone numbers, opening hours, and
              verification badges on PawCare are demonstration data. Never rely
              on demo numbers for real-world veterinary emergencies.
            </p>
          </div>
          <Link
            href="/submit-correction"
            className="shrink-0 text-xs font-bold text-[#F0523B] hover:text-white underline underline-offset-4"
          >
            Submit a Correction →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Column 1: About PawCare */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#F0523B] flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5 fill-white" />
              </span>
              <span className="font-display-hero text-2xl tracking-tight text-white">
                PAWCARE<span className="text-[#F0523B]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#EEE7DE]/75 leading-relaxed max-w-sm">
              PawCare is a centralized animal-care discovery platform connecting
              pet parents and community rescuers with veterinary clinics, 24/7
              animal hospitals, boarding suites, diagnostic labs, ambulances, and
              welfare NGOs.
            </p>
            <p className="font-script-accent text-[#F0523B] text-2xl">
              Better care for every paw.
            </p>
          </div>

          {/* Column 2: Explore Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
              Explore Services
            </h3>
            <ul className="space-y-2.5 text-sm text-[#EEE7DE]/80">
              <li>
                <Link
                  href="/discover?category=Veterinary+Clinics"
                  className="hover:text-white transition-colors"
                >
                  Veterinary Clinics
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?category=Animal+Hospitals"
                  className="hover:text-white transition-colors"
                >
                  24/7 Animal Hospitals
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?category=Pet+Boarding"
                  className="hover:text-white transition-colors"
                >
                  Pet Boarding &amp; Spa
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?category=Diagnostics+%26+Labs"
                  className="hover:text-white transition-colors"
                >
                  Diagnostics &amp; Labs
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?category=Veterinary+Ambulances"
                  className="hover:text-white transition-colors"
                >
                  Veterinary Ambulances
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?category=Animal+NGOs+%26+Rescues"
                  className="hover:text-white transition-colors"
                >
                  Animal NGOs &amp; Rescues
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & For Service Providers */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
              Platform &amp; Providers
            </h3>
            <ul className="space-y-2.5 text-sm text-[#EEE7DE]/80">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-white transition-colors"
                >
                  About PawCare
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency"
                  className="text-[#F0523B] font-semibold hover:text-white transition-colors"
                >
                  Emergency Care Support
                </Link>
              </li>
              <li>
                <Link
                  href="/list-business"
                  className="hover:text-white transition-colors"
                >
                  For Service Providers (List Business)
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-correction"
                  className="hover:text-white transition-colors"
                >
                  Submit a Correction
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  className="hover:text-white transition-colors"
                >
                  Saved Providers
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>{" "}
                /{" "}
                <Link
                  href="/signup"
                  className="hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
              Contact (Demo)
            </h3>
            <ul className="space-y-3 text-xs text-[#EEE7DE]/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                <span>240 Mercer St, Suite 400, New York, NY 10012 (Demo)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F0523B] shrink-0" />
                <a
                  href="tel:+15550109999"
                  className="hover:text-white transition-colors"
                >
                  +1 (555) 010-9999 (Demo)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F0523B] shrink-0" />
                <a
                  href="mailto:care@demo.pawcare"
                  className="hover:text-white transition-colors"
                >
                  care@demo.pawcare
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EEE7DE]/60">
          <p>
            © 2026 PAWCARE. Product MVP Prototype. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/legal?tab=privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal?tab=terms"
              className="hover:text-white transition-colors"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/submit-correction"
              className="hover:text-white transition-colors"
            >
              Report Data Issue
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
