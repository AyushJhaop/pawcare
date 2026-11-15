"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Heart,
  Building2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICE_CATEGORIES } from "@/data/providers";
import { registerAccount, ROLES } from "@/lib/auth";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState(() =>
    searchParams.get("role") === ROLES.SERVICE_PROVIDER
      ? ROLES.SERVICE_PROVIDER
      : ROLES.PET_PARENT
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Pet Parent optional details
  const [petName, setPetName] = useState("");

  // Service Provider details
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Veterinary Clinics");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("New York, NY");
  const [services, setServices] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Please choose a password with at least 6 characters.");
      return;
    }

    if (role === ROLES.SERVICE_PROVIDER) {
      if (!businessName.trim()) {
        setError("Please enter your business or organization name.");
        return;
      }
      if (!phone.trim()) {
        setError("Please enter a business contact phone number.");
        return;
      }
      if (!address.trim()) {
        setError("Please enter your business street address.");
        return;
      }
    }

    const result = registerAccount({
      name,
      email,
      password,
      role,
      petName,
      businessName,
      category,
      phone,
      address,
      city,
      services,
      description,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(result.redirectTo);
  };

  return (
    <div className="max-w-[920px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <div className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 shadow-[0_18px_50px_rgba(20,39,70,0.06)] space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
            CREATE DEMO ACCOUNT
          </span>
          <h1 className="font-display-hero uppercase text-4xl sm:text-5xl text-[#142746] mt-1">
            JOIN PAWCARE
          </h1>
          <p className="text-sm text-[#6D6B68] mt-1">
            Select your account type below. Your session is persisted in{" "}
            <code>localStorage</code> for this demonstration prototype.
          </p>
        </div>

        {/* Account Type Selector (Pet Parent vs Service Provider) */}
        <div
          role="radiogroup"
          aria-label="Select Account Type"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <button
            type="button"
            role="radio"
            aria-checked={role === ROLES.PET_PARENT}
            onClick={() => setRole(ROLES.PET_PARENT)}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              role === ROLES.PET_PARENT
                ? "bg-[#142746] text-white border-[#142746] shadow-md"
                : "bg-[#F8F1E8] text-[#142746] border-[#142746]/15 hover:border-[#142746]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-2xl bg-[#F0523B] text-white flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F0523B]">
                Personal Account
              </span>
            </div>
            <h2 className="text-base font-bold">Pet Parent Account</h2>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                role === ROLES.PET_PARENT
                  ? "text-[#EEE7DE]/80"
                  : "text-[#6D6B68]"
              }`}
            >
              Discover clinics &amp; emergency care, save favourite providers,
              and manage your pet parent profile.
            </p>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={role === ROLES.SERVICE_PROVIDER}
            onClick={() => setRole(ROLES.SERVICE_PROVIDER)}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
              role === ROLES.SERVICE_PROVIDER
                ? "bg-[#142746] text-white border-[#142746] shadow-md"
                : "bg-[#F8F1E8] text-[#142746] border-[#142746]/15 hover:border-[#142746]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-2xl bg-[#F0523B] text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F0523B]">
                Organization Account
              </span>
            </div>
            <h2 className="text-base font-bold">Service Provider Account</h2>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                role === ROLES.SERVICE_PROVIDER
                  ? "text-[#EEE7DE]/80"
                  : "text-[#6D6B68]"
              }`}
            >
              Register your veterinary clinic, hospital, lab, boarding studio,
              ambulance, or NGO and manage your listing.
            </p>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Your Full Name *
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jordan Taylor"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="signup-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746]"
              >
                New Password (6+ characters) *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F0523B] hover:underline cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide password</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show password</span>
                  </>
                )}
              </button>
            </div>
            <input
              id="signup-password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              enterKeyHint="done"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
            />
          </div>

          {/* Conditional Role Fields */}
          {role === ROLES.PET_PARENT ? (
            <div>
              <label
                htmlFor="signup-pet-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Your Companion&apos;s Name &amp; Breed{" "}
                <span className="text-[#6D6B68] font-normal">(Optional)</span>
              </label>
              <input
                id="signup-pet-name"
                name="petName"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g., Milo (Golden Retriever) & Luna (Siamese)"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
              />
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-[#EEE7DE] border border-[#142746]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142746]">
                  Service Provider Listing Details
                </h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0523B]/15 text-[#142746] text-[11px] font-bold">
                  <Clock className="w-3 h-3 text-[#F0523B]" />
                  Starts as Pending Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prov-business-name"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    Business / Organization Name *
                  </label>
                  <input
                    id="prov-business-name"
                    type="text"
                    autoComplete="organization"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Mercer Vet Studio"
                    className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prov-category"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    Service Category *
                  </label>
                  <select
                    id="prov-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm font-semibold text-[#142746]"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="prov-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    Business Phone *
                  </label>
                  <input
                    id="prov-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-019-3300"
                    className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prov-city"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    City / Borough *
                  </label>
                  <input
                    id="prov-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York, NY"
                    className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="prov-address"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Street Address *
                </label>
                <input
                  id="prov-address"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="120 Greene Street, SoHo"
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>

              <div>
                <label
                  htmlFor="prov-services"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Services Offered (Comma-Separated)
                </label>
                <input
                  id="prov-services"
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="Wellness Exams, Vaccinations, Dental Care..."
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>

              <div>
                <label
                  htmlFor="prov-description"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Practice Description
                </label>
                <textarea
                  id="prov-description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of your animal-care services..."
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm py-4 rounded-full shadow-[0_12px_28px_rgba(240,82,59,0.28)] transition-all cursor-pointer"
          >
            {role === ROLES.SERVICE_PROVIDER
              ? "Create Provider Account (Pending Verification)"
              : "Create Pet Parent Account"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#142746]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6D6B68]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F0523B]" />
            <span>
              Internal Admin accounts are restricted and cannot be registered
              publicly.
            </span>
          </div>
          <Link
            href="/login"
            className="font-bold text-[#142746] hover:text-[#F0523B] underline"
          >
            Already have an account? Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[#6D6B68]">
              Loading registration...
            </div>
          }
        >
          <SignUpContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
