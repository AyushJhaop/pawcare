"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Flag,
} from "lucide-react";
import {
  getAllProviders,
  getCorrectionRequests,
  addCorrectionRequest,
} from "@/lib/storage";

const ISSUE_TYPES = [
  "Incorrect business information",
  "Wrong address",
  "Incorrect phone number",
  "Incorrect opening hours",
  "Permanently closed business",
  "Incorrect service information",
  "Other issues",
];

export default function CorrectionForm({ initialProviderName = "" }) {
  const [providers, setProviders] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [formData, setFormData] = useState({
    providerName: initialProviderName || "",
    issueType: ISSUE_TYPES[0],
    description: "",
    correctInfo: "",
    contactEmail: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedEntry, setSubmittedEntry] = useState(null);

  useEffect(() => {
    const sync = () => {
      setProviders(getAllProviders());
      setCorrections(getCorrectionRequests());
    };
    sync();
    window.addEventListener("pawcare-storage-updated", sync);
    return () => window.removeEventListener("pawcare-storage-updated", sync);
  }, []);

  const validate = (values) => {
    const nextErrors = {};
    if (!values.providerName.trim()) {
      nextErrors.providerName =
        "Please enter or select the provider name you are reporting.";
    }
    if (!values.issueType) {
      nextErrors.issueType = "Please select an issue type.";
    }
    if (!values.description.trim() || values.description.trim().length < 10) {
      nextErrors.description =
        "Please describe the issue in at least 10 characters.";
    }
    if (
      values.contactEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail.trim())
    ) {
      nextErrors.contactEmail =
        "Please enter a valid email address (or leave optional field blank).";
    }
    return nextErrors;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = {
      providerName: true,
      issueType: true,
      description: true,
      correctInfo: true,
      contactEmail: true,
    };
    setTouched(allTouched);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const created = addCorrectionRequest(formData);
    setSubmittedEntry(created);
    setFormData({
      providerName: "",
      issueType: ISSUE_TYPES[0],
      description: "",
      correctInfo: "",
      contactEmail: "",
    });
    setTouched({});
    setErrors({});
  };

  return (
    <div className="space-y-10">
      {/* Submission Confirmation */}
      {submittedEntry && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#142746] text-white rounded-[32px] p-6 sm:p-8 border border-[#F0523B]/40 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F0523B] text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">
                  Correction Report Logged — Pending Review
                </h3>
                <p className="text-xs text-[#EEE7DE]/75">
                  Reference ID: {submittedEntry.id}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0523B]/20 border border-[#F0523B] text-[#F8F1E8] text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-[#F0523B]" />
              <span>{submittedEntry.status}</span>
            </span>
          </div>

          <p className="text-sm text-[#EEE7DE]/90 leading-relaxed">
            Thank you for helping keep PawCare accurate. Your report regarding{" "}
            <strong className="text-white">{submittedEntry.providerName}</strong>{" "}
            ({submittedEntry.issueType}) has been saved with status{" "}
            <strong className="text-[#F0523B]">Pending Review</strong>.
            Corrections are never applied automatically without verification by
            our Trust &amp; Safety team.
          </p>
        </div>
      )}

      {/* Correction Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 shadow-[0_18px_50px_rgba(20,39,70,0.06)] space-y-6"
      >
        <div className="border-b border-[#142746]/10 pb-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
            Community Data Stewardship
          </span>
          <h2 className="font-display-hero uppercase text-3xl sm:text-4xl text-[#142746] mt-1">
            SUBMIT A LISTING CORRECTION
          </h2>
          <p className="text-sm text-[#6D6B68] mt-1">
            Spot an outdated phone number, changed hours, or closed clinic? Let
            us know below. All reports start as{" "}
            <strong className="text-[#142746]">Pending Review</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Name */}
          <div>
            <label
              htmlFor="corr-provider-name"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Provider Name *
            </label>
            <input
              id="corr-provider-name"
              name="providerName"
              list="pawcare-provider-names"
              type="text"
              required
              value={formData.providerName}
              onChange={(e) => handleChange("providerName", e.target.value)}
              onBlur={() => handleBlur("providerName")}
              placeholder="Select or type provider name..."
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.providerName && errors.providerName
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            <datalist id="pawcare-provider-names">
              {providers.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
            {touched.providerName && errors.providerName && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.providerName}</span>
              </p>
            )}
          </div>

          {/* Issue Type */}
          <div>
            <label
              htmlFor="corr-issue-type"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Issue Type *
            </label>
            <select
              id="corr-issue-type"
              name="issueType"
              required
              value={formData.issueType}
              onChange={(e) => handleChange("issueType", e.target.value)}
              onBlur={() => handleBlur("issueType")}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm font-semibold text-[#142746] focus:outline-none focus:border-[#142746]"
            >
              {ISSUE_TYPES.map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description of the Correction */}
        <div>
          <label
            htmlFor="corr-description"
            className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
          >
            Description of the Issue *
          </label>
          <span className="block text-xs text-[#6D6B68] mb-2">
            Explain what information is inaccurate or outdated on the current
            listing.
          </span>
          <textarea
            id="corr-description"
            name="description"
            rows={3}
            required
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="e.g., The clinic moved two blocks north last month and no longer operates at the Mercer St address..."
            className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
              touched.description && errors.description
                ? "border-red-600 bg-red-50/50"
                : "border-[#142746]/15 focus:border-[#142746]"
            }`}
          />
          {touched.description && errors.description && (
            <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Correct Information */}
          <div>
            <label
              htmlFor="corr-correct-info"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Correct Information{" "}
              <span className="text-[#6D6B68] font-normal">
                (Where applicable)
              </span>
            </label>
            <input
              id="corr-correct-info"
              name="correctInfo"
              type="text"
              value={formData.correctInfo}
              onChange={(e) => handleChange("correctInfo", e.target.value)}
              placeholder="e.g., New phone: +1-555-019-9999 or updated hours..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
            />
          </div>

          {/* Contact Email (Optional) */}
          <div>
            <label
              htmlFor="corr-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Your Contact Email{" "}
              <span className="text-[#6D6B68] font-normal">(Optional)</span>
            </label>
            <input
              id="corr-email"
              name="contactEmail"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              onBlur={() => handleBlur("contactEmail")}
              placeholder="you@example.com"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.contactEmail && errors.contactEmail
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.contactEmail && errors.contactEmail && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.contactEmail}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#6D6B68]">
            <Clock className="w-4 h-4 text-[#F0523B] shrink-0" />
            <span>
              Status upon submission:{" "}
              <strong className="text-[#142746]">Pending Review</strong>
            </span>
          </div>

          <button
            type="submit"
            className="bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm px-8 py-4 rounded-full shadow-[0_12px_28px_rgba(240,82,59,0.28)] transition-all cursor-pointer"
          >
            Submit Correction Request
          </button>
        </div>
      </form>

      {/* Logged Correction Requests Queue */}
      <section
        aria-labelledby="logged-corrections-heading"
        className="bg-[#EEE7DE] rounded-[34px] p-6 sm:p-8 border border-[#142746]/10"
      >
        <h3
          id="logged-corrections-heading"
          className="text-lg font-bold text-[#142746] flex items-center gap-2 mb-4"
        >
          <Flag className="w-5 h-5 text-[#F0523B]" />
          <span>Recent Correction Requests ({corrections.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corrections.map((corr) => (
            <div
              key={corr.id}
              className="bg-[#F8F1E8] rounded-2xl p-5 border border-[#142746]/10 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#F0523B]">
                  {corr.issueType}
                </span>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${
                    corr.status === "Resolved"
                      ? "bg-emerald-900/15 text-emerald-900"
                      : "bg-[#142746] text-white"
                  }`}
                >
                  {corr.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#142746]">
                {corr.providerName}
              </h4>
              <p className="text-xs text-[#6D6B68] leading-relaxed">
                {corr.description}
              </p>
              {corr.correctInfo && (
                <p className="text-xs text-[#142746] font-medium bg-[#EEE7DE] px-3 py-1.5 rounded-xl">
                  Suggested update: {corr.correctInfo}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
