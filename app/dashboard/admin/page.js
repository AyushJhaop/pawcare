"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  Flag,
  Building2,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationBadge from "@/components/VerificationBadge";
import {
  getCurrentUser,
  logoutUser,
  ROLES,
  getDashboardRouteForRole,
  getRoleDisplayLabel,
} from "@/lib/auth";
import {
  getAllProviders,
  setProviderVerificationStatus,
  getCorrectionRequests,
  updateCorrectionStatus,
} from "@/lib/storage";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") || "overview"
  );

  const [providers, setProviders] = useState([]);
  const [corrections, setCorrections] = useState([]);

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser());
      setProviders(getAllProviders());
      setCorrections(getCorrectionRequests());
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

  const handleStatusChange = (providerId, newStatus) => {
    setProviderVerificationStatus(providerId, newStatus);
  };

  const handleCorrectionStatusChange = (correctionId, newStatus) => {
    updateCorrectionStatus(correctionId, newStatus);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#6D6B68]">
        Loading Internal Admin Console...
      </div>
    );
  }

  // Unauthenticated guard
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
          <span className="w-12 h-12 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
            RESTRICTED INTERNAL ADMIN ROUTE
          </h1>
          <p className="text-sm text-[#6D6B68]">
            You must sign in with an authorized Internal Platform Admin account
            to access verification workflows and correction queues.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Strict RBAC: Block Pet Parents and Service Providers from accessing Admin routes
  if (user.role !== ROLES.ADMIN) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
          <span className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
            UNAUTHORIZED — INTERNAL ADMIN ONLY
          </h1>
          <p className="text-sm text-[#6D6B68]">
            Your current role is{" "}
            <strong className="text-[#142746]">
              {getRoleDisplayLabel(user.role)}
            </strong>{" "}
            ({user.email}). Pet Parents and Service Providers are not permitted
            to access internal platform administration routes.
          </p>
          <Link
            href={getDashboardRouteForRole(user.role)}
            className="inline-block px-6 py-3 rounded-full bg-[#142746] text-white text-xs font-bold"
          >
            Return to {getRoleDisplayLabel(user.role)} Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pendingProviders = providers.filter(
    (p) => p.verificationStatus === "Pending Verification"
  );
  const verifiedProviders = providers.filter(
    (p) => p.verificationStatus === "Verified"
  );
  const pendingCorrections = corrections.filter(
    (c) => c.status === "Pending Review"
  );

  return (
    <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-10">
      {/* Admin Header */}
      <section className="bg-[#142746] text-white rounded-[38px] p-7 sm:p-10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-wider">
            Restricted Internal Trust &amp; Safety Console
          </span>
          <h1 className="font-display-hero uppercase text-4xl sm:text-5xl text-white">
            PAWCARE ADMIN GOVERNANCE
          </h1>
          <p className="text-sm text-[#EEE7DE]/85">
            Review provider registrations, manage verification statuses, and
            resolve community correction reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "overview", label: "Overview" },
            {
              id: "verification",
              label: `Verification Queue (${pendingProviders.length})`,
            },
            { id: "providers", label: `All Providers (${providers.length})` },
            {
              id: "corrections",
              label: `Corrections (${pendingCorrections.length})`,
            },
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

      {/* Platform Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#142746]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6D6B68]">
            Total Directory Listings
          </p>
          <p className="font-display-hero text-5xl text-[#142746] mt-2">
            {providers.length}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#142746]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F0523B]">
            Pending Verification
          </p>
          <p className="font-display-hero text-5xl text-[#F0523B] mt-2">
            {pendingProviders.length}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#142746]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#142746]">
            Verified Providers (Demo)
          </p>
          <p className="font-display-hero text-5xl text-[#142746] mt-2">
            {verifiedProviders.length}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#142746]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#142746]">
            Pending Corrections
          </p>
          <p className="font-display-hero text-5xl text-[#142746] mt-2">
            {pendingCorrections.length}
          </p>
        </div>
      </div>

      {/* Pending Verification Queue */}
      {(activeTab === "overview" || activeTab === "verification") && (
        <section className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#142746]/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#142746] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F0523B]" />
                <span>
                  Pending Verification Requests ({pendingProviders.length})
                </span>
              </h2>
              <p className="text-xs text-[#6D6B68]">
                Approve listings after credential checks, or mark as Unverified
                / Rejected.
              </p>
            </div>
          </div>

          {pendingProviders.length === 0 ? (
            <p className="text-xs text-[#6D6B68] bg-[#F8F1E8] p-5 rounded-2xl">
              All pending verification requests have been processed.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="p-5 rounded-3xl bg-[#F8F1E8] border border-[#142746]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#F0523B]">
                        {prov.category}
                      </span>
                      <VerificationBadge status={prov.verificationStatus} />
                      {prov.isUserSubmitted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#142746] text-white text-[10px] font-bold">
                          New User Submission
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#142746]">
                      {prov.name}
                    </h3>
                    <p className="text-xs text-[#6D6B68]">
                      {prov.address}, {prov.city} • {prov.phone} • {prov.email}
                    </p>
                    <p className="text-xs text-[#6D6B68] max-w-2xl">
                      {prov.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(prov.id, "Verified")}
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-[#142746] hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F0523B]" />
                      <span>Approve (Verified)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(prov.id, "Unverified")}
                      className="px-4 py-2.5 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-xs font-bold text-[#142746] cursor-pointer"
                    >
                      Set Unverified
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(prov.id, "Rejected")}
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* All Providers Management Table */}
      {(activeTab === "overview" || activeTab === "providers") && (
        <section className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#142746]/10 space-y-5">
          <h2 className="text-xl font-bold text-[#142746] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#F0523B]" />
            <span>Manage All Provider Listing Statuses ({providers.length})</span>
          </h2>

          <div className="space-y-3">
            {providers.map((prov) => (
              <div
                key={prov.id}
                className="p-4 rounded-2xl bg-[#F8F1E8] border border-[#142746]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#142746]">
                      {prov.name}
                    </h3>
                    <VerificationBadge status={prov.verificationStatus} />
                  </div>
                  <p className="text-xs text-[#6D6B68] mt-0.5">
                    {prov.category} • {prov.address}, {prov.city}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label={`Change verification status for ${prov.name}`}
                    value={prov.verificationStatus}
                    onChange={(e) =>
                      handleStatusChange(prov.id, e.target.value)
                    }
                    className="px-3 py-2 rounded-full bg-white border border-[#142746]/20 text-xs font-bold text-[#142746] cursor-pointer"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">
                      Pending Verification
                    </option>
                    <option value="Unverified">Unverified</option>
                    <option value="Rejected">Rejected (Hidden)</option>
                  </select>
                  <Link
                    href={`/provider/${prov.slug}`}
                    className="p-2 rounded-full bg-[#EEE7DE] hover:bg-[#142746] hover:text-white text-[#142746] transition-colors"
                    title="Inspect Listing"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Corrections Queue */}
      {(activeTab === "overview" || activeTab === "corrections") && (
        <section className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#142746]/10 space-y-5">
          <h2 className="text-xl font-bold text-[#142746] flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#F0523B]" />
            <span>Community Correction Submissions ({corrections.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corrections.map((corr) => (
              <div
                key={corr.id}
                className="p-5 rounded-3xl bg-[#F8F1E8] border border-[#142746]/10 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
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
                  <h3 className="text-base font-bold text-[#142746]">
                    {corr.providerName}
                  </h3>
                  <p className="text-xs text-[#6D6B68] leading-relaxed">
                    {corr.description}
                  </p>
                  {corr.correctInfo && (
                    <p className="text-xs font-medium text-[#142746] bg-[#EEE7DE] p-2.5 rounded-xl">
                      Suggested fix: {corr.correctInfo}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#142746]/10">
                  <span className="text-[11px] text-[#6D6B68]">
                    Reporter: {corr.contactEmail || "Anonymous caregiver"}
                  </span>
                  <div className="flex items-center gap-2">
                    {corr.status !== "Resolved" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCorrectionStatusChange(corr.id, "Resolved")
                        }
                        className="px-3.5 py-1.5 rounded-full bg-[#142746] hover:bg-[#F0523B] text-white text-xs font-bold cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleCorrectionStatusChange(
                            corr.id,
                            "Pending Review"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-full border border-[#142746]/20 text-xs font-bold text-[#142746] cursor-pointer"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-[#6D6B68]">
              Loading Admin Console...
            </div>
          }
        >
          <AdminDashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
