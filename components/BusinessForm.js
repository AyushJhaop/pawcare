"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/providers";
import {
  addSubmittedBusiness,
  getSubmittedBusinesses,
} from "@/lib/storage";
import VerificationBadge from "@/components/VerificationBadge";

const INITIAL_FORM = {
  businessName: "",
  category: "Veterinary Clinics",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  services: "",
  description: "",
  website: "",
};

export default function BusinessForm({ ownerEmail = "" }) {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    email: ownerEmail || "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    const sync = () => setRecentSubmissions(getSubmittedBusinesses());
    sync();
    window.addEventListener("pawcare-storage-updated", sync);
    return () => window.removeEventListener("pawcare-storage-updated", sync);
  }, []);

  const validate = (values) => {
    const nextErrors = {};
    if (!values.businessName.trim()) {
      nextErrors.businessName =
        "Please enter your business or organization name.";
    }
    if (!values.category) {
      nextErrors.category = "Please select a provider category.";
    }
    if (!values.contactPerson.trim()) {
      nextErrors.contactPerson = "Please enter the contact person's full name.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Please enter a contact email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email =
        "Enter an email address in the format name@organization.com.";
    }
    if (!values.phone.trim()) {
      nextErrors.phone = "Please enter a contact phone number.";
    } else if (values.phone.replace(/[^0-9]/g, "").length < 7) {
      nextErrors.phone =
        "Enter a valid phone number with at least 7 digits (e.g., +1-555-019-2831).";
    }
    if (!values.address.trim()) {
      nextErrors.address = "Please enter the street address.";
    }
    if (!values.city.trim()) {
      nextErrors.city = "Please enter the city or borough.";
    }
    if (!values.services.trim()) {
      nextErrors.services =
        "Please list at least one service offered (comma-separated).";
    }
    if (!values.description.trim() || values.description.trim().length < 20) {
      nextErrors.description =
        "Please provide a description of at least 20 characters.";
    }
    if (
      values.website.trim() &&
      !/^https?:\/\/.+/i.test(values.website.trim())
    ) {
      nextErrors.website =
        "Website URL should start with http:// or https:// (or leave blank).";
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
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(INITIAL_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const created = addSubmittedBusiness({
      ...formData,
      ownerEmail: ownerEmail || formData.email.trim().toLowerCase(),
    });
    setSubmittedRecord(created);
    setFormData({ ...INITIAL_FORM, email: ownerEmail || "" });
    setTouched({});
    setErrors({});
  };

  return (
    <div className="space-y-12">
      {/* Confirmation Banner When Submitted */}
      {submittedRecord && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#142746] text-white rounded-[34px] p-6 sm:p-8 border border-[#F0523B]/40 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F0523B] flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold">
                  Listing Submitted — Awaiting Verification
                </h3>
                <p className="text-xs text-[#EEE7DE]/80">
                  Saved to localStorage for this prototype session
                </p>
              </div>
            </div>
            <VerificationBadge status={submittedRecord.verificationStatus} />
          </div>

          <p className="text-sm text-[#EEE7DE]/90 leading-relaxed">
            Thank you for submitting{" "}
            <strong className="text-white">{submittedRecord.name}</strong> (
            {submittedRecord.category}). In accordance with PawCare&apos;s trust
            standards, new business registrations are never automatically
            verified—your listing is marked{" "}
            <strong className="text-[#F0523B]">Pending Verification</strong>{" "}
            until clinical credentials and licensing documents are reviewed.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/provider/${submittedRecord.slug}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold transition-colors"
            >
              <span>Preview Pending Listing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              <span>View in Discovery Directory</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Onboarding Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 shadow-[0_18px_50px_rgba(20,39,70,0.06)] space-y-6"
      >
        <div className="border-b border-[#142746]/10 pb-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
            Provider Onboarding
          </span>
          <h2 className="font-display-hero uppercase text-3xl sm:text-4xl text-[#142746] mt-1">
            LIST YOUR ANIMAL-CARE ORGANIZATION
          </h2>
          <p className="text-sm text-[#6D6B68] mt-1">
            All new submissions enter the directory with a{" "}
            <strong className="text-[#142746]">Pending Verification</strong>{" "}
            badge until reviewed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label
              htmlFor="biz-name"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Business or Organization Name *
            </label>
            <input
              id="biz-name"
              name="organization"
              type="text"
              autoComplete="organization"
              required
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              onBlur={() => handleBlur("businessName")}
              placeholder="e.g., Gramercy Feline & Canine Clinic"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.businessName && errors.businessName
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.businessName && errors.businessName && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.businessName}</span>
              </p>
            )}
          </div>

          {/* Provider Category */}
          <div>
            <label
              htmlFor="biz-category"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Provider Category *
            </label>
            <select
              id="biz-category"
              name="category"
              required
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm font-semibold text-[#142746] focus:outline-none focus:border-[#142746]"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Person's Name */}
          <div>
            <label
              htmlFor="biz-contact-person"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Contact Person&apos;s Full Name *
            </label>
            <input
              id="biz-contact-person"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              onBlur={() => handleBlur("contactPerson")}
              placeholder="e.g., Dr. Rohan Mehta"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.contactPerson && errors.contactPerson
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.contactPerson && errors.contactPerson && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.contactPerson}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="biz-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Email Address *
            </label>
            <input
              id="biz-email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="clinic@example.com"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.email && errors.email
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="biz-phone"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Phone Number *
            </label>
            <input
              id="biz-phone"
              name="tel"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="+1-555-019-4820"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.phone && errors.phone
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.phone && errors.phone && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Website (Optional) */}
          <div>
            <label
              htmlFor="biz-website"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Website or Social Link{" "}
              <span className="text-[#6D6B68] font-normal">(Optional)</span>
            </label>
            <input
              id="biz-website"
              name="url"
              type="url"
              autoComplete="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              onBlur={() => handleBlur("website")}
              placeholder="https://example.com"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.website && errors.website
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.website && errors.website && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.website}</span>
              </p>
            )}
          </div>

          {/* Full Street Address */}
          <div>
            <label
              htmlFor="biz-address"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Full Street Address *
            </label>
            <input
              id="biz-address"
              name="street-address"
              type="text"
              autoComplete="street-address"
              required
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              placeholder="e.g., 210 Irving Place, Suite 1A"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.address && errors.address
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.address && errors.address && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="biz-city"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              City / Borough *
            </label>
            <input
              id="biz-city"
              name="address-level2"
              type="text"
              autoComplete="address-level2"
              required
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              placeholder="e.g., New York, NY"
              className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
                touched.city && errors.city
                  ? "border-red-600 bg-red-50/50"
                  : "border-[#142746]/15 focus:border-[#142746]"
              }`}
            />
            {touched.city && errors.city && (
              <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>
        </div>

        {/* Services Offered */}
        <div>
          <label
            htmlFor="biz-services"
            className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
          >
            Services Offered (Comma-Separated) *
          </label>
          <span className="block text-xs text-[#6D6B68] mb-2">
            Example: Wellness Exams, Vaccinations, Dental Scaling, Emergency
            Triage
          </span>
          <input
            id="biz-services"
            name="services"
            type="text"
            required
            value={formData.services}
            onChange={(e) => handleChange("services", e.target.value)}
            onBlur={() => handleBlur("services")}
            placeholder="Wellness Exams, Core Vaccinations, Ultrasound, Boarding..."
            className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border text-sm text-[#142746] focus:outline-none ${
              touched.services && errors.services
                ? "border-red-600 bg-red-50/50"
                : "border-[#142746]/15 focus:border-[#142746]"
            }`}
          />
          {touched.services && errors.services && (
            <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.services}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="biz-description"
            className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
          >
            Facility &amp; Care Description *
          </label>
          <span className="block text-xs text-[#6D6B68] mb-2">
            Share your clinical approach, species treated, equipment, and hours
            (minimum 20 characters).
          </span>
          <textarea
            id="biz-description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Describe your veterinary team, facilities, and how you support pets and their caregivers..."
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

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#6D6B68]">
            <Clock className="w-4 h-4 text-[#F0523B] shrink-0" />
            <span>
              Initial status upon submission:{" "}
              <strong className="text-[#142746]">Pending Verification</strong>
            </span>
          </div>

          <button
            type="submit"
            className="bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm px-8 py-4 rounded-full shadow-[0_12px_28px_rgba(240,82,59,0.28)] transition-all cursor-pointer"
          >
            List Your Business
          </button>
        </div>
      </form>

      {/* Pending Submissions Area (Persisted in localStorage) */}
      <section
        aria-labelledby="pending-submissions-heading"
        className="bg-[#EEE7DE] rounded-[34px] p-6 sm:p-8 border border-[#142746]/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h3
              id="pending-submissions-heading"
              className="text-lg font-bold text-[#142746] flex items-center gap-2"
            >
              <Building2 className="w-5 h-5 text-[#F0523B]" />
              <span>Submitted Listings Queue ({recentSubmissions.length})</span>
            </h3>
            <p className="text-xs text-[#6D6B68]">
              Listings submitted from this browser session are stored in{" "}
              <code>localStorage</code> and await Admin verification.
            </p>
          </div>
        </div>

        {recentSubmissions.length === 0 ? (
          <p className="text-xs text-[#6D6B68] bg-[#F8F1E8] p-5 rounded-2xl border border-[#142746]/10">
            No business listings have been submitted in this browser session
            yet. Use the form above to submit a sample clinic, hospital, lab,
            ambulance, boarding facility, or NGO.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentSubmissions.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8F1E8] rounded-2xl p-5 border border-[#142746]/10 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#F0523B]">
                      {item.category}
                    </span>
                    <VerificationBadge status={item.verificationStatus} />
                  </div>
                  <h4 className="text-base font-bold text-[#142746]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#6D6B68] mt-1">
                    {item.address}, {item.city} • {item.phone}
                  </p>
                  <p className="text-xs text-[#6D6B68] mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#142746]/10 flex items-center justify-between text-xs">
                  <span className="text-[#6D6B68]">
                    Contact: {item.contactPerson}
                  </span>
                  <Link
                    href={`/provider/${item.slug}`}
                    className="font-bold text-[#142746] hover:text-[#F0523B] underline"
                  >
                    View Listing →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

