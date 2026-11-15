"use client";

import { ShieldCheck, Clock, HelpCircle, XCircle } from "lucide-react";

export default function VerificationBadge({
  status = "Pending Verification",
  size = "sm",
  showExplainer = false,
}) {
  const normalized = String(status || "Pending Verification");

  const config =
    normalized === "Verified"
      ? {
          label: "Verified (Demo)",
          icon: ShieldCheck,
          classes:
            "bg-[#142746] text-white border border-[#142746]",
          iconClasses: "text-[#F0523B]",
          explainer:
            "Illustrative verified status for this prototype. In production, Verified providers complete clinical license, facility, and veterinary board credential checks.",
        }
      : normalized === "Pending Verification"
      ? {
          label: "Pending Verification",
          icon: Clock,
          classes:
            "bg-[#F0523B]/15 text-[#142746] border border-[#F0523B]/40",
          iconClasses: "text-[#F0523B]",
          explainer:
            "This listing was recently submitted or updated and is awaiting Trust & Safety credential review before receiving Verified status.",
        }
      : normalized === "Rejected"
      ? {
          label: "Rejected",
          icon: XCircle,
          classes: "bg-red-100 text-red-900 border border-red-300",
          iconClasses: "text-red-600",
          explainer:
            "This submission did not pass platform review and is hidden from public discovery.",
        }
      : {
          label: "Unverified",
          icon: HelpCircle,
          classes:
            "bg-[#EEE7DE] text-[#6D6B68] border border-[#142746]/15",
          iconClasses: "text-[#6D6B68]",
          explainer:
            "Community-sourced demo listing whose license documents have not yet been submitted for review.",
        };

  const Icon = config.icon;
  const paddingClass =
    size === "lg"
      ? "px-4 py-1.5 text-xs gap-2"
      : "px-3 py-1 text-[11px] gap-1.5";

  return (
    <div className="inline-flex flex-col items-start">
      <span
        title={config.explainer}
        className={`inline-flex items-center rounded-full font-bold tracking-wide ${paddingClass} ${config.classes}`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconClasses}`} />
        <span>{config.label}</span>
      </span>
      {showExplainer && (
        <p className="text-xs text-[#6D6B68] mt-2 leading-relaxed">
          {config.explainer}
        </p>
      )}
    </div>
  );
}

