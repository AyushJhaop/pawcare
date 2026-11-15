"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Navigation,
  Heart,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Flag,
} from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { getGoogleMapsDirectionsUrl } from "@/lib/search";

export default function ProviderDetails({
  provider,
  isSaved = false,
  onToggleSave,
  onBack,
  isModal = false,
}) {
  if (!provider) return null;

  const directionsUrl = getGoogleMapsDirectionsUrl(provider);

  return (
    <div
      className={`${
        isModal
          ? "bg-[#F8F1E8] rounded-[36px] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl border border-[#142746]/15"
          : "bg-white rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(20,39,70,0.08)] border border-[#142746]/10"
      }`}
    >
      {/* Cover Image Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-[#142746]">
        <img
          src={provider.image || "/images/card-vet-clinic.jpg"}
          alt={provider.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142746] via-[#142746]/30 to-transparent" />

        {/* Top Bar Actions */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F1E8]/95 hover:bg-white text-[#142746] text-xs font-bold shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#F0523B]" />
              <span>Back to Results</span>
            </button>
          ) : (
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F1E8]/95 hover:bg-white text-[#142746] text-xs font-bold shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-[#F0523B]" />
              <span>Back to Discovery</span>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {!isModal && (
              <Link
                href={`/provider/${provider.slug}`}
                className="hidden sm:inline-flex px-3.5 py-2 rounded-full bg-[#142746]/80 text-white text-xs font-semibold"
              >
                {provider.category}
              </Link>
            )}
            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave(provider.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-colors cursor-pointer ${
                isSaved
                  ? "bg-[#F0523B] text-white"
                  : "bg-[#F8F1E8]/95 hover:bg-white text-[#142746]"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
              <span>{isSaved ? "Saved Provider" : "Save Provider"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3.5 py-1 rounded-full bg-[#F0523B] text-white text-xs font-bold">
              {provider.category}
            </span>
            <VerificationBadge status={provider.verificationStatus} />
            {provider.emergencyAvailable && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#142746] text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F0523B]" />
                24/7 Emergency Support
              </span>
            )}
          </div>
          <h1 className="font-display-hero uppercase text-3xl sm:text-5xl tracking-tight text-white">
            {provider.name}
          </h1>
        </div>
      </div>

      {/* Illustrative Demo Data Banner */}
      <div className="bg-[#EEE7DE] px-6 sm:px-10 py-3.5 border-b border-[#142746]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#142746]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#F0523B] shrink-0" />
          <span>
            <strong>Illustrative Demo Record:</strong> Contact details, ratings,
            opening hours, and verification status are sample data for the
            PawCare MVP prototype.
          </span>
        </div>
        <Link
          href={`/submit-correction?provider=${encodeURIComponent(
            provider.name
          )}`}
          className="inline-flex items-center gap-1 font-bold text-[#F0523B] hover:underline"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Submit a Correction</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): About, Services, Emergency Info, Sample Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Rating & Status Bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-[#F8F1E8] border border-[#142746]/10">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-[#F0523B] text-[#F0523B]" />
              <span className="text-lg font-bold text-[#142746]">
                {provider.rating}
              </span>
              <span className="text-xs text-[#6D6B68]">
                ({provider.reviewCount} illustrative sample reviews)
              </span>
            </div>
            <span className="text-[#142746]/20">|</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                provider.isOpen ? "text-emerald-800" : "text-[#6D6B68]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  provider.isOpen ? "bg-emerald-600" : "bg-[#6D6B68]"
                }`}
              />
              {provider.isOpen
                ? "Currently Open (Sample Schedule)"
                : "Currently Closed (Sample Schedule)"}
            </span>
          </div>

          {/* About Section */}
          <section aria-labelledby="provider-about-heading">
            <h2
              id="provider-about-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B] mb-2"
            >
              About This Provider
            </h2>
            <p className="text-base text-[#142746] leading-relaxed">
              {provider.about || provider.description}
            </p>
          </section>

          {/* Services Offered */}
          <section aria-labelledby="provider-services-heading">
            <h2
              id="provider-services-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B] mb-3"
            >
              Services Offered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(provider.services || []).map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/10 text-sm font-semibold text-[#142746]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F0523B] shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency Support Information */}
          <section
            aria-labelledby="provider-emergency-heading"
            className={`p-5 rounded-3xl border ${
              provider.emergencyAvailable
                ? "bg-[#142746] text-white border-[#142746]"
                : "bg-[#EEE7DE] text-[#142746] border-[#142746]/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#F0523B] shrink-0 mt-0.5" />
              <div>
                <h2
                  id="provider-emergency-heading"
                  className="text-sm font-bold"
                >
                  {provider.emergencyAvailable
                    ? "24/7 Emergency & Critical Support Available (Demo)"
                    : "Standard Appointment Hours Only"}
                </h2>
                <p
                  className={`text-xs leading-relaxed mt-1 ${
                    provider.emergencyAvailable
                      ? "text-[#EEE7DE]/85"
                      : "text-[#6D6B68]"
                  }`}
                >
                  {provider.emergencyAvailable
                    ? "This sample provider accepts urgent trauma, triage, or emergency transport requests. Call the demo dispatch number before arrival so the clinical team can prepare."
                    : "This provider operates during scheduled outpatient hours. For urgent life-threatening situations, visit the PawCare Emergency Care directory."}
                </p>
              </div>
            </div>
          </section>

          {/* Sample Reviews Section */}
          <section aria-labelledby="provider-reviews-heading">
            <div className="flex items-center justify-between mb-3">
              <h2
                id="provider-reviews-heading"
                className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]"
              >
                Sample Pet Parent Feedback (Illustrative Demo Data)
              </h2>
            </div>

            {provider.sampleReviews && provider.sampleReviews.length > 0 ? (
              <div className="space-y-3">
                {provider.sampleReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-[#F8F1E8] border border-[#142746]/10"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-bold text-[#142746]">
                          {rev.author}
                        </p>
                        <p className="text-xs text-[#6D6B68]">{rev.pet}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#EEE7DE] text-[11px] font-semibold text-[#6D6B68]">
                        {rev.date}
                      </span>
                    </div>
                    <p className="text-sm text-[#142746]/90 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6D6B68] bg-[#F8F1E8] p-4 rounded-2xl border border-[#142746]/10">
                Sample rating of {provider.rating} ★ across{" "}
                {provider.reviewCount} illustrative consultations.
              </p>
            )}
          </section>
        </div>

        {/* Right Column (4 cols): Contact, Hours, Verification Explainer & CTAs */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Action Card */}
          <div className="bg-[#F8F1E8] rounded-[30px] p-6 border border-[#142746]/12 space-y-4">
            <h3 className="text-base font-bold text-[#142746]">
              Connect with Provider
            </h3>

            <div className="space-y-3 text-xs text-[#142746]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Address</p>
                  <p className="text-[#6D6B68]">
                    {provider.address}, {provider.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Opening Hours (Sample)</p>
                  <p className="text-[#6D6B68]">{provider.openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Demo Phone</p>
                  <p className="text-[#6D6B68]">{provider.phone} (Demo Only)</p>
                </div>
              </div>

              {provider.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Demo Email</p>
                    <p className="text-[#6D6B68] break-all">{provider.email}</p>
                  </div>
                </div>
              )}

              {provider.website && (
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-[#F0523B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Website</p>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0523B] underline break-all"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 space-y-2.5">
              <a
                href={`tel:${provider.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-sm font-bold shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now ({provider.phone})</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#142746] hover:bg-[#1f3b68] text-white text-sm font-bold transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#F0523B]" />
                <span>Get Directions</span>
              </a>

              <button
                type="button"
                onClick={() => onToggleSave && onToggleSave(provider.id)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-[#142746]/25 hover:bg-[#EEE7DE] text-[#142746] text-xs font-bold transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved
                      ? "fill-[#F0523B] text-[#F0523B]"
                      : "text-[#F0523B]"
                  }`}
                />
                <span>
                  {isSaved ? "Remove from Saved" : "Save Provider for Later"}
                </span>
              </button>
            </div>
          </div>

          {/* Trust & Verification System Explainer Card */}
          <div className="bg-[#EEE7DE] rounded-[28px] p-5 border border-[#142746]/10 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#142746]">
              PawCare Verification Status
            </p>
            <VerificationBadge
              status={provider.verificationStatus}
              showExplainer={true}
            />
            <div className="pt-2 border-t border-[#142746]/10">
              <Link
                href={`/submit-correction?provider=${encodeURIComponent(
                  provider.name
                )}`}
                className="text-xs font-bold text-[#F0523B] hover:underline inline-flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Notice outdated details? Submit a Correction</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

