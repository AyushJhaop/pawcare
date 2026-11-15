"use client";

import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Heart,
  ShieldAlert,
  Eye,
} from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { getGoogleMapsDirectionsUrl } from "@/lib/search";

export default function ProviderCard({
  provider,
  isSaved = false,
  onToggleSave,
  onViewDetails,
}) {
  const directionsUrl = getGoogleMapsDirectionsUrl(provider);

  return (
    <article className="group bg-white rounded-[32px] overflow-hidden border border-[#142746]/10 hover:border-[#142746]/25 shadow-[0_12px_35px_rgba(20,39,70,0.06)] hover:shadow-[0_22px_50px_rgba(20,39,70,0.12)] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Header with Category, Save Button & Emergency Pill */}
        <div className="relative h-60 w-full overflow-hidden bg-[#EEE7DE]">
          <img
            src={provider.image || "/images/card-vet-clinic.jpg"}
            alt={`${provider.name} — ${provider.category}`}
            loading="lazy"
            width={600}
            height={420}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Bar: Category & Save Heart */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#142746]/90 backdrop-blur-md text-white text-xs font-bold tracking-wide">
              {provider.category}
            </span>

            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave(provider.id)}
              aria-label={
                isSaved
                  ? `Remove ${provider.name} from saved providers`
                  : `Save ${provider.name}`
              }
              aria-pressed={isSaved}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isSaved
                  ? "bg-[#F0523B] text-white scale-105"
                  : "bg-white/95 text-[#142746] hover:bg-[#F0523B] hover:text-white"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`}
              />
            </button>
          </div>

          {/* Bottom Image Overlay: Verification + Emergency */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <VerificationBadge status={provider.verificationStatus} />
            {provider.emergencyAvailable && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0523B] text-white text-[11px] font-bold shadow">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>24/7 Emergency</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6">
          {/* Rating + Open Status */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
            <span className="inline-flex items-center gap-1 font-bold text-[#142746]">
              <Star className="w-4 h-4 fill-[#F0523B] text-[#F0523B]" />
              <span>{provider.rating}</span>
              <span className="text-[#6D6B68] font-normal">
                ({provider.reviewCount} demo reviews)
              </span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                provider.isOpen
                  ? "bg-emerald-950/10 text-emerald-900"
                  : "bg-[#EEE7DE] text-[#6D6B68]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  provider.isOpen ? "bg-emerald-600" : "bg-[#6D6B68]"
                }`}
              />
              {provider.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          {/* Provider Title */}
          <h3 className="text-xl font-bold text-[#142746] group-hover:text-[#F0523B] transition-colors">
            <Link href={`/provider/${provider.slug}`}>{provider.name}</Link>
          </h3>

          {/* Address & Hours */}
          <div className="mt-2 space-y-1 text-xs text-[#6D6B68]">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F0523B] shrink-0" />
              <span>
                {provider.address}, {provider.city}
                {typeof provider.distanceMiles === "number" && (
                  <strong className="text-[#142746] ml-1">
                    • {provider.distanceMiles} mi
                  </strong>
                )}
              </span>
            </p>
            {provider.openingHours && (
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#142746] shrink-0" />
                <span className="truncate">{provider.openingHours}</span>
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-[#6D6B68] leading-relaxed mt-3 line-clamp-2">
            {provider.description}
          </p>

          {/* Available Services Pills */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {(provider.services || []).slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2.5 py-1 rounded-full bg-[#F8F1E8] text-[#142746] text-[11px] font-semibold border border-[#142746]/[0.07]"
              >
                {service}
              </span>
            ))}
            {(provider.services || []).length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-[#EEE7DE] text-[#6D6B68] text-[11px] font-semibold">
                +{provider.services.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="px-6 pb-6 pt-4 border-t border-[#142746]/[0.08] space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {onViewDetails ? (
            <button
              type="button"
              onClick={() => onViewDetails(provider)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#142746] hover:bg-[#1f3b68] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#F0523B]" />
              <span>View Details</span>
            </button>
          ) : (
            <Link
              href={`/provider/${provider.slug}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#142746] hover:bg-[#1f3b68] text-white text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#F0523B]" />
              <span>View Details</span>
            </Link>
          )}

          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call (Demo)</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-[#142746] text-xs font-semibold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#F0523B]" />
            <span>Get Directions</span>
          </a>

          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave(provider.id)}
            className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
              isSaved
                ? "bg-[#EEE7DE] border-[#142746] text-[#142746]"
                : "border-[#142746]/20 hover:bg-[#EEE7DE] text-[#142746]"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isSaved ? "fill-[#F0523B] text-[#F0523B]" : "text-[#F0523B]"
              }`}
            />
            <span>{isSaved ? "Saved" : "Save Provider"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

