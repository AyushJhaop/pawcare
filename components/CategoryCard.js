"use client";

import {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Truck,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";

const ICON_MAP = {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Truck,
  HeartHandshake,
};

export default function CategoryCard({
  category,
  isSelected = false,
  onSelect,
  variant = "card",
}) {
  const IconComponent = ICON_MAP[category.iconName] || Stethoscope;

  if (variant === "pill") {
    return (
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect && onSelect(category.id)}
        className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isSelected
            ? "bg-[#F0523B] text-white border border-[#F0523B] shadow-[0_8px_20px_rgba(240,82,59,0.32)] scale-[1.02]"
            : "bg-transparent text-[#142746] border border-[#142746]/25 hover:border-[#142746] hover:bg-[#F8F1E8]/60"
        }`}
      >
        <IconComponent
          className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#F0523B]"}`}
        />
        <span>{category.name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect && onSelect(category.id)}
      className={`group text-left rounded-[28px] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
        isSelected
          ? "bg-[#142746] text-white border-[#142746] shadow-[0_18px_40px_rgba(20,39,70,0.18)]"
          : "bg-white/90 hover:bg-white text-[#142746] border-[#142746]/10 hover:border-[#F0523B]/50 hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-[#F0523B] text-white"
                : "bg-[#EEE7DE] text-[#F0523B] group-hover:bg-[#F0523B] group-hover:text-white"
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </span>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isSelected
                ? "bg-white/15 text-[#EEE7DE]"
                : "bg-[#EEE7DE] text-[#6D6B68]"
            }`}
          >
            {category.accentCount}
          </span>
        </div>

        <h3
          className={`text-base sm:text-lg font-bold ${
            isSelected ? "text-white" : "text-[#142746]"
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`text-xs leading-relaxed mt-1.5 line-clamp-2 ${
            isSelected ? "text-[#EEE7DE]/80" : "text-[#6D6B68]"
          }`}
        >
          {category.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-bold">
        <span className={isSelected ? "text-[#F0523B]" : "text-[#142746]"}>
          {isSelected ? "Selected Category" : "Filter Providers"}
        </span>
        <ArrowUpRight
          className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            isSelected ? "text-[#F0523B]" : "text-[#142746]"
          }`}
        />
      </div>
    </button>
  );
}

