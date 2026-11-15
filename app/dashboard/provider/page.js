"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Clock,
  Settings,
  CheckCircle2,
  Lock,
  Plus,
  X,
  Eye,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import BusinessForm from "@/components/BusinessForm";
import { SERVICE_CATEGORIES } from "@/data/providers";
import {
  getCurrentUser,
  logoutUser,
  ROLES,
  getDashboardRouteForRole,
  getRoleDisplayLabel,
} from "@/lib/auth";
import {
  getAllProviders,
  updateProviderListing,
} from "@/lib/storage";

function ProviderDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") || "overview"
  );

  const [myProviders, setMyProviders] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  // Editable listing fields
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Veterinary Clinics");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editOpeningHours, setEditOpeningHours] = useState("");
  const [editIsOpen, setEditIsOpen] = useState(true);
  const [editEmergency, setEditEmergency] = useState(false);
  const [editServices, setEditServices] = useState([]);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const populateEditor = (listing) => {
    if (!listing) return;
    setSelectedListing(listing);
    setEditName(listing.name || "");
    setEditCategory(listing.category || "Veterinary Clinics");
    setEditDescription(listing.description || "");
    setEditAddress(listing.address || "");
    setEditCity(listing.city || "");
    setEditPhone(listing.phone || "");
    setEditEmail(listing.email || "");
    setEditWebsite(listing.website || "");
    setEditOpeningHours(listing.openingHours || "");
    setEditIsOpen(Boolean(listing.isOpen));
    setEditEmergency(Boolean(listing.emergencyAvailable));
    setEditServices(listing.services || []);
  };

  useEffect(() => {
    const sync = () => {
      const current = getCurrentUser();
      setUser(current);
      if (current && current.role === ROLES.SERVICE_PROVIDER) {
        const all = getAllProviders();
        const owned = all.filter(
          (p) =>
            p.id === current.linkedProviderId ||
            (p.ownerEmail &&
              p.ownerEmail.toLowerCase() === current.email.toLowerCase())
        );
        const list = owned.length > 0 ? owned : [all[0]];
        setMyProviders(list);
        populateEditor(list[0]);
      }
      setLoading(false);
    };
    sync();
    window.addEventListener("pawcare-auth-updated", sync);
    window.addEventListener("pawcare-storage-updated", sync);
    return () => {
      window.removeEventListener("pawcare-auth-updated", sync);
      window.removeEventListener("pawcare-storage-updated", sync);
    };
  }, []);

  const handleSaveListingChanges = (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    updateProviderListing(selectedListing.id, {
      name: editName.trim(),
      category: editCategory,
      description: editDescription.trim(),
      about: editDescription.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      website: editWebsite.trim(),
      openingHours: editOpeningHours.trim(),
      isOpen: editIsOpen,
      emergencyAvailable: editEmergency,
      services: editServices,
    });

    setSaveMessage(
      "Business profile, contact details, services, and opening hours saved."
    );
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleAddServiceTag = () => {
    const trimmed = newServiceInput.trim();
    if (!trimmed) return;
    if (!editServices.includes(trimmed)) {
      setEditServices([...editServices, trimmed]);
    }
    setNewServiceInput("");
  };

  const handleRemoveServiceTag = (srv) => {
    setEditServices(editServices.filter((s) => s !== srv));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#6D6B68]">
        Loading Service Provider portal...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
          <span className="w-12 h-12 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
            PROVIDER AUTHENTICATION REQUIRED
          </h1>
          <p className="text-sm text-[#6D6B68]">
            Please sign in with a Service Provider account to manage your
            business profile, services, and verification status.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/signup?role=service_provider"
              className="px-6 py-3 rounded-full bg-[#142746] text-white text-xs font-bold"
            >
              Register Provider Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Strict RBAC: Pet parents and non-providers cannot access provider management
  if (user.role !== ROLES.SERVICE_PROVIDER) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
          <span className="w-12 h-12 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
            ACCESS RESTRICTED — SERVICE PROVIDER ONLY
          </h1>
          <p className="text-sm text-[#6D6B68]">
            You are signed in as{" "}
            <strong className="text-[#142746]">
              {getRoleDisplayLabel(user.role)}
            </strong>
            . Pet Parents cannot access Service Provider business management
            routes.
          </p>
          <Link
            href={getDashboardRouteForRole(user.role)}
            className="inline-block px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold"
          >
            Return to {getRoleDisplayLabel(user.role)} Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-10">
      {/* Provider Header */}
      <section className="bg-[#142746] text-white rounded-[38px] p-7 sm:p-10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-wider">
            Service Provider Portal
          </span>
          <h1 className="font-display-hero uppercase text-4xl sm:text-5xl text-white">
            {selectedListing?.name || user.businessName || user.name}
          </h1>
          <p className="text-sm text-[#EEE7DE]/85">
            Provider Representative:{" "}
            <strong className="text-white">{user.name}</strong> ({user.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {[
            { id: "overview", label: "Business Overview" },
            { id: "profile", label: "Business Profile & Hours" },
            { id: "manage", label: "Submit Additional Listing" },
            { id: "settings", label: "Account Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#F0523B] text-white"
                  : "bg-white/10 text-[#EEE7DE] hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Listing Selector if Provider has multiple listings */}
      {myProviders.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 bg-[#EEE7DE] p-4 rounded-2xl">
          <span className="text-xs font-bold text-[#142746] mr-2">
            Select Active Listing:
          </span>
          {myProviders.map((prov) => (
            <button
              key={prov.id}
              type="button"
              onClick={() => populateEditor(prov)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                selectedListing?.id === prov.id
                  ? "bg-[#142746] text-white"
                  : "bg-white text-[#142746]"
              }`}
            >
              {prov.name} ({prov.verificationStatus})
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: BUSINESS OVERVIEW & VERIFICATION STATUS */}
      {activeTab === "overview" && selectedListing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[34px] p-7 border border-[#142746]/10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142746]/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F0523B]">
                    {selectedListing.category}
                  </span>
                  <h2 className="text-2xl font-bold text-[#142746]">
                    {selectedListing.name}
                  </h2>
                </div>
                <VerificationBadge status={selectedListing.verificationStatus} />
              </div>

              <p className="text-sm text-[#6D6B68] leading-relaxed">
                {selectedListing.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F1E8] p-4 rounded-2xl">
                <div>
                  <p className="font-bold text-[#142746]">Address</p>
                  <p className="text-[#6D6B68]">
                    {selectedListing.address}, {selectedListing.city}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#142746]">Contact Phone</p>
                  <p className="text-[#6D6B68]">{selectedListing.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-[#142746]">Opening Hours</p>
                  <p className="text-[#6D6B68]">
                    {selectedListing.openingHours}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#142746]">Current Status</p>
                  <p className="text-[#6D6B68]">
                    {selectedListing.isOpen ? "Open Now" : "Closed"} •{" "}
                    {selectedListing.emergencyAvailable
                      ? "24/7 Emergency Enabled"
                      : "Standard Hours"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#142746] mb-2">
                  Active Services ({(selectedListing.services || []).length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {(selectedListing.services || []).map((srv) => (
                    <span
                      key={srv}
                      className="px-3 py-1 rounded-full bg-[#EEE7DE] text-[#142746] text-xs font-semibold"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold cursor-pointer"
                >
                  Edit Business Information &amp; Hours
                </button>
                <Link
                  href={`/provider/${selectedListing.slug}`}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#142746] text-white text-xs font-bold"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F0523B]" />
                  <span>View Public Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Verification & Submission Status Explainer */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-[#EEE7DE] rounded-[32px] p-6 border border-[#142746]/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#142746]">
                <ShieldCheck className="w-4 h-4 text-[#F0523B]" />
                <span>Listing Verification Status</span>
              </div>
              <VerificationBadge
                status={selectedListing.verificationStatus}
                size="lg"
                showExplainer={true}
              />
              <div className="p-4 rounded-2xl bg-[#F8F1E8] text-xs text-[#6D6B68] space-y-1.5">
                <p className="font-bold text-[#142746]">
                  Listing Submission Status:
                </p>
                <p>
                  {selectedListing.verificationStatus === "Verified"
                    ? "Approved & active in public directory."
                    : "Submitted and awaiting Internal Admin credential verification."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* TAB 2: MANAGE BUSINESS INFORMATION, SERVICES, CONTACT & HOURS */}
      {activeTab === "profile" && selectedListing && (
        <form
          onSubmit={handleSaveListingChanges}
          className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#142746]/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F0523B]">
                MANAGE BUSINESS PROFILE
              </span>
              <h2 className="text-2xl font-bold text-[#142746]">
                Update Information, Services &amp; Opening Hours
              </h2>
            </div>
            <VerificationBadge status={selectedListing.verificationStatus} />
          </div>

          {saveMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950/10 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="edit-biz-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Business Name
              </label>
              <input
                id="edit-biz-name"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-cat"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Provider Category
              </label>
              <select
                id="edit-biz-cat"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm font-semibold text-[#142746]"
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
                htmlFor="edit-biz-phone"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Contact Phone (Demo)
              </label>
              <input
                id="edit-biz-phone"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Public Contact Email
              </label>
              <input
                id="edit-biz-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-address"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                Street Address
              </label>
              <input
                id="edit-biz-address"
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-city"
                className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
              >
                City / Borough
              </label>
              <input
                id="edit-biz-city"
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
              />
            </div>
          </div>

          {/* Manage Opening Hours & Availability */}
          <div className="p-5 rounded-3xl bg-[#EEE7DE] space-y-4">
            <h3 className="text-sm font-bold text-[#142746]">
              Manage Opening Hours &amp; Emergency Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label
                  htmlFor="edit-biz-hours"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Opening Hours Schedule
                </label>
                <input
                  id="edit-biz-hours"
                  type="text"
                  value={editOpeningHours}
                  onChange={(e) => setEditOpeningHours(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#142746] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsOpen}
                    onChange={(e) => setEditIsOpen(e.target.checked)}
                    className="w-4 h-4 accent-[#F0523B]"
                  />
                  <span>Currently Open Now</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#142746] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.checked)}
                    className="w-4 h-4 accent-[#F0523B]"
                  />
                  <span>24/7 Emergency Support Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Manage Services */}
          <div className="space-y-3">
            <label
              htmlFor="add-service-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746]"
            >
              Manage Services Offered
            </label>
            <div className="flex flex-wrap gap-2">
              {editServices.map((srv) => (
                <span
                  key={srv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#142746] text-white text-xs font-semibold"
                >
                  <span>{srv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveServiceTag(srv)}
                    aria-label={`Remove ${srv}`}
                    className="hover:text-[#F0523B] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <input
                id="add-service-input"
                type="text"
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                placeholder="Add a service (e.g., Puppy Socialization)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-xs text-[#142746]"
              />
              <button
                type="button"
                onClick={handleAddServiceTag}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-[#142746] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F0523B]" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-biz-desc"
              className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
            >
              Practice Description
            </label>
            <textarea
              id="edit-biz-desc"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-sm font-bold shadow-md cursor-pointer"
          >
            Save Business Changes
          </button>
        </form>
      )}

      {/* TAB 3: SUBMIT NEW LISTING */}
      {activeTab === "manage" && <BusinessForm ownerEmail={user.email} />}

      {/* TAB 4: ACCOUNT SETTINGS */}
      {activeTab === "settings" && (
        <section className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 max-w-2xl space-y-5">
          <h2 className="text-2xl font-bold text-[#142746]">
            Provider Account Settings
          </h2>
          <div className="p-4 rounded-2xl bg-[#EEE7DE] text-xs space-y-1.5 text-[#142746]">
            <p>
              <strong>Provider Account Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> Service Provider
            </p>
            <p>
              <strong>Access Control Note:</strong> Service Provider accounts
              can manage their own listings and submit new locations (which
              enter <em>Pending Verification</em>), but cannot access Internal
              Admin approval controls.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              logoutUser();
              router.push("/login");
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#142746] hover:bg-[#F0523B] text-white text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </section>
      )}
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[#6D6B68]">
              Loading Provider Dashboard...
            </div>
          }
        >
          <ProviderDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
