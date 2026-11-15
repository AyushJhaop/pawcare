"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  ShieldAlert,
  Heart,
  User,
  Settings,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderCard from "@/components/ProviderCard";
import {
  getCurrentUser,
  updateCurrentUserProfile,
  logoutUser,
  ROLES,
  getDashboardRouteForRole,
  getRoleDisplayLabel,
} from "@/lib/auth";
import {
  getAllProviders,
  getSavedProviderIds,
  toggleSavedProvider,
} from "@/lib/storage";

export default function PetParentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [savedProviders, setSavedProviders] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [petName, setPetName] = useState("");
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  useEffect(() => {
    const sync = () => {
      const current = getCurrentUser();
      setUser(current);
      if (current) {
        setName(current.name || "");
        setPhone(current.phone || "");
        setCity(current.city || "");
        setPetName(current.petName || "");
      }
      const ids = getSavedProviderIds();
      const all = getAllProviders();
      setSavedIds(ids);
      setSavedProviders(all.filter((p) => ids.includes(p.id)));
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateCurrentUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      petName: petName.trim(),
    });
    if (updated) {
      setProfileSavedMsg("Personal profile & companion details updated.");
      setTimeout(() => setProfileSavedMsg(""), 4000);
    }
  };

  const handleToggleSave = (providerId) => {
    toggleSavedProvider(providerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-12 text-sm text-[#6D6B68]">
          Loading Pet Parent workspace...
        </main>
        <Footer />
      </div>
    );
  }

  // Unauthenticated guard
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-5 py-20 text-center">
          <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
            <span className="w-12 h-12 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
              AUTHENTICATION REQUIRED
            </h1>
            <p className="text-sm text-[#6D6B68]">
              Please sign in with a Pet Parent account to access your personal
              dashboard, saved providers, and companion profile.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-full bg-[#142746] text-white text-xs font-bold"
              >
                Create Pet Parent Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Role-based access restriction guard
  if (user.role !== ROLES.PET_PARENT) {
    return (
      <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-5 py-20 text-center">
          <div className="bg-white rounded-[36px] p-10 border border-[#142746]/10 shadow-lg space-y-4">
            <span className="w-12 h-12 rounded-full bg-[#EEE7DE] text-[#F0523B] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="font-display-hero uppercase text-3xl text-[#142746]">
              PET PARENT ROLE REQUIRED
            </h1>
            <p className="text-sm text-[#6D6B68]">
              You are currently signed in as{" "}
              <strong className="text-[#142746]">
                {getRoleDisplayLabel(user.role)}
              </strong>{" "}
              ({user.email}). This dashboard is exclusively for Pet Parent
              accounts.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href={getDashboardRouteForRole(user.role)}
                className="px-6 py-3 rounded-full bg-[#F0523B] text-white text-xs font-bold"
              >
                Go to {getRoleDisplayLabel(user.role)} Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const QUICK_LAUNCH_CARDS = [
    {
      title: "Find Veterinary Care",
      subtitle: "Preventive checkups, boosters & dental",
      href: "/discover?category=Veterinary+Clinics",
      icon: Stethoscope,
    },
    {
      title: "Discover Animal Hospitals",
      subtitle: "24/7 specialty & surgical centers",
      href: "/discover?category=Animal+Hospitals",
      icon: Building2,
    },
    {
      title: "Find Pet Boarding",
      subtitle: "Cage-free suites, daycare & grooming",
      href: "/discover?category=Pet+Boarding",
      icon: Home,
    },
    {
      title: "Explore Diagnostic Labs",
      subtitle: "Ultrasound, X-ray & blood chemistry",
      href: "/discover?category=Diagnostics+%26+Labs",
      icon: Microscope,
    },
    {
      title: "Find Emergency Assistance",
      subtitle: "24/7 urgent trauma triage & ambulances",
      href: "/emergency",
      icon: ShieldAlert,
      urgent: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-10">
        {/* Personalized Welcome Header */}
        <section className="bg-[#142746] text-white rounded-[38px] p-7 sm:p-10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-wider">
              Pet Parent Dashboard (Demo Session)
            </span>
            <h1 className="font-display-hero uppercase text-4xl sm:text-5xl text-white">
              WELCOME BACK, {user.name.toUpperCase()}
            </h1>
            <p className="text-sm text-[#EEE7DE]/85">
              Companion profile:{" "}
              <strong className="text-[#F0523B]">
                {user.petName || "Cooper & Mochi"}
              </strong>{" "}
              • Location: {user.city || "New York, NY"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { id: "overview", label: "Overview & Care", icon: Heart },
              {
                id: "saved",
                label: `Saved Providers (${savedProviders.length})`,
                icon: Heart,
              },
              { id: "profile", label: "Personal Profile", icon: User },
              { id: "settings", label: "Account Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#F0523B] text-white"
                      : "bg-white/10 text-[#EEE7DE] hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Care Discovery Shortcuts */}
        {activeTab === "overview" && (
          <>
            <section aria-labelledby="quick-care-heading">
              <h2
                id="quick-care-heading"
                className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B] mb-4"
              >
                Quick Care Discovery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {QUICK_LAUNCH_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.title}
                      href={card.href}
                      className={`group rounded-[28px] p-5 border transition-all flex flex-col justify-between ${
                        card.urgent
                          ? "bg-[#F0523B] text-white border-[#F0523B] shadow-md"
                          : "bg-white text-[#142746] border-[#142746]/10 hover:border-[#142746] shadow-sm"
                      }`}
                    >
                      <div>
                        <span
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                            card.urgent
                              ? "bg-white/20 text-white"
                              : "bg-[#EEE7DE] text-[#F0523B]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <h3 className="text-base font-bold">{card.title}</h3>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            card.urgent ? "text-white/85" : "text-[#6D6B68]"
                          }`}
                        >
                          {card.subtitle}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-bold">
                        <span>Open</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Saved Providers Preview */}
            <section aria-labelledby="dashboard-saved-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    id="dashboard-saved-heading"
                    className="text-2xl font-bold text-[#142746]"
                  >
                    Your Saved Providers ({savedProviders.length})
                  </h2>
                  <p className="text-xs text-[#6D6B68]">
                    Bookmarked clinics and hospitals synced with localStorage
                  </p>
                </div>
                <Link
                  href="/discover"
                  className="text-xs font-bold text-[#F0523B] hover:underline"
                >
                  Browse More Providers →
                </Link>
              </div>

              {savedProviders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProviders.map((prov) => (
                    <ProviderCard
                      key={prov.id}
                      provider={prov}
                      isSaved={true}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-[#142746]/10">
                  <p className="text-sm font-bold text-[#142746]">
                    You haven&apos;t saved any providers yet.
                  </p>
                  <Link
                    href="/discover"
                    className="mt-3 inline-block px-5 py-2.5 rounded-full bg-[#F0523B] text-white text-xs font-bold"
                  >
                    Explore Discovery Directory
                  </Link>
                </div>
              )}
            </section>
          </>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[#142746]">
              Saved Providers ({savedProviders.length})
            </h2>
            {savedProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProviders.map((prov) => (
                  <ProviderCard
                    key={prov.id}
                    provider={prov}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#142746]/10">
                <p className="text-sm font-bold text-[#142746]">
                  No providers saved yet.
                </p>
                <Link
                  href="/discover"
                  className="mt-3 inline-block px-5 py-2.5 rounded-full bg-[#F0523B] text-white text-xs font-bold"
                >
                  Find Care
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Personal Profile Tab */}
        {activeTab === "profile" && (
          <section className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 max-w-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F0523B]">
                PET PARENT PROFILE
              </span>
              <h2 className="text-2xl font-bold text-[#142746] mt-1">
                Personal &amp; Companion Details
              </h2>
            </div>

            {profileSavedMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/10 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="pp-name"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Full Name
                </label>
                <input
                  id="pp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>

              <div>
                <label
                  htmlFor="pp-pet"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                >
                  Companion Name(s) &amp; Species
                </label>
                <input
                  id="pp-pet"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pp-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="pp-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pp-city"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1"
                  >
                    Primary City / Neighborhood
                  </label>
                  <input
                    id="pp-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </section>
        )}

        {/* Account Settings Tab */}
        {activeTab === "settings" && (
          <section className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 max-w-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F0523B]">
                ACCOUNT SETTINGS
              </span>
              <h2 className="text-2xl font-bold text-[#142746] mt-1">
                Session &amp; Role Access
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-[#EEE7DE] text-xs space-y-1.5 text-[#142746]">
              <p>
                <strong>Signed-in Email:</strong> {user.email}
              </p>
              <p>
                <strong>Assigned Role:</strong> Pet Parent (Personal Account)
              </p>
              <p>
                <strong>Role Permissions:</strong> Access to Care Discovery,
                Saved Providers, Emergency Support, and Community Corrections.
                Provider Management and Admin routes are restricted.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#142746] hover:bg-[#F0523B] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Pet Parent Session</span>
            </button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

