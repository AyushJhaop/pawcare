"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PawPrint,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";
import {
  getCurrentUser,
  logoutUser,
  ROLES,
  getDashboardRouteForRole,
  getRoleDisplayLabel,
} from "@/lib/auth";
import { getSavedProviderIds } from "@/lib/storage";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncState = () => {
      setUser(getCurrentUser());
      setSavedCount(getSavedProviderIds().length);
    };
    syncState();
    window.addEventListener("pawcare-auth-updated", syncState);
    window.addEventListener("pawcare-storage-updated", syncState);
    return () => {
      window.removeEventListener("pawcare-auth-updated", syncState);
      window.removeEventListener("pawcare-storage-updated", syncState);
    };
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    router.push("/");
  };

  // Role-intelligent navigation links per Section 18 requirements
  const getNavLinks = () => {
    if (!user) {
      // Public navigation: Home, About, Services, How It Works, Find Care, Emergency
      return [
        { href: "/", label: "Home" },
        { href: "/#about", label: "About" },
        { href: "/#services", label: "Services" },
        { href: "/#how-it-works", label: "How It Works" },
        { href: "/discover", label: "Find Care" },
        { href: "/emergency", label: "Emergency Care", isUrgent: true },
      ];
    }

    if (user.role === ROLES.PET_PARENT) {
      // Pet Parent navigation: Home, Find Care, Emergency Care, Saved Providers, Profile
      return [
        { href: "/", label: "Home" },
        { href: "/discover", label: "Find Care" },
        { href: "/emergency", label: "Emergency Care", isUrgent: true },
        {
          href: "/saved",
          label: "Saved Providers",
          badge: savedCount,
        },
        { href: "/dashboard/pet-parent", label: "Profile & Dashboard" },
      ];
    }

    if (user.role === ROLES.SERVICE_PROVIDER) {
      // Service Provider navigation: Dashboard, Business Profile, Manage Listing, Settings
      return [
        { href: "/dashboard/provider", label: "Dashboard" },
        {
          href: "/dashboard/provider?tab=profile",
          label: "Business Profile",
        },
        {
          href: "/dashboard/provider?tab=manage",
          label: "Manage Listing",
        },
        {
          href: "/dashboard/provider?tab=settings",
          label: "Settings",
        },
        { href: "/discover", label: "Directory" },
      ];
    }

    if (user.role === ROLES.ADMIN) {
      // Admin navigation: Dashboard, Providers, Verification Requests, Corrections
      return [
        { href: "/dashboard/admin", label: "Dashboard" },
        { href: "/dashboard/admin?tab=providers", label: "Providers" },
        {
          href: "/dashboard/admin?tab=verification",
          label: "Verification Requests",
        },
        { href: "/dashboard/admin?tab=corrections", label: "Corrections" },
        { href: "/discover", label: "Public View" },
      ];
    }

    return [{ href: "/", label: "Home" }];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-[#F8F1E8]/95 backdrop-blur-md border-b border-[#142746]/[0.08]">
      <nav
        aria-label="Primary Navigation"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4"
      >
        {/* Left: Coral Paw Logo + Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
        >
          <span className="w-9 h-9 rounded-full bg-[#F0523B]/12 flex items-center justify-center text-[#F0523B] transition-transform duration-300 group-hover:scale-105">
            <PawPrint className="w-5 h-5 fill-[#F0523B] text-[#F0523B]" />
          </span>
          <span className="font-display-hero text-2xl sm:text-[26px] tracking-tight text-[#142746]">
            PAWCARE<span className="text-[#F0523B]">.</span>
          </span>
        </Link>

        {/* Center: Dynamic Role-Aware Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 text-[14px] font-semibold text-[#142746]">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("?")[0]) &&
                  item.href !== "/#about" &&
                  item.href !== "/#services" &&
                  item.href !== "/#how-it-works";

            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`inline-flex items-center gap-1.5 transition-colors py-1 ${
                  item.isUrgent
                    ? "text-[#F0523B] hover:text-[#142746] font-bold"
                    : isActive
                    ? "text-[#F0523B] underline decoration-2 underline-offset-8"
                    : "text-[#142746] hover:text-[#F0523B]"
                }`}
              >
                {item.isUrgent && <ShieldAlert className="w-4 h-4" />}
                <span>{item.label}</span>
                {typeof item.badge === "number" && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#F0523B] text-white text-[11px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Auth / Saved / Primary CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {!user ? (
            <>
              <Link
                href="/saved"
                aria-label={`Saved providers (${savedCount})`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#142746]/15 text-xs font-bold text-[#142746] hover:bg-[#EEE7DE] transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-[#F0523B] fill-[#F0523B]" />
                <span>Saved ({savedCount})</span>
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#142746] hover:text-[#F0523B] px-3.5 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-[#142746] border border-[#142746]/25 hover:border-[#142746] hover:bg-[#EEE7DE] px-4 py-2.5 rounded-full transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/discover"
                className="bg-[#F0523B] hover:bg-[#d9432d] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_8px_20px_rgba(240,82,59,0.28)] transition-all"
              >
                Find a Vet
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href={getDashboardRouteForRole(user.role)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEE7DE] hover:bg-[#142746] hover:text-white text-[#142746] text-xs font-bold transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F0523B]" />
                <span>{user.name.split(" ")[0]}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#142746] text-white text-[10px] uppercase tracking-wider">
                  {getRoleDisplayLabel(user.role)}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#142746]/20 text-xs font-semibold text-[#142746] hover:bg-[#F0523B] hover:text-white hover:border-[#F0523B] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/saved"
            aria-label={`Saved providers (${savedCount})`}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#EEE7DE] text-xs font-bold text-[#142746]"
          >
            <Heart className="w-3.5 h-3.5 text-[#F0523B] fill-[#F0523B]" />
            <span>{savedCount}</span>
          </Link>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#142746]/15 text-[#142746] hover:bg-[#EEE7DE] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F1E8] border-b border-[#142746]/15 px-6 pt-3 pb-6 space-y-4 shadow-xl">
          {user && (
            <div className="p-3.5 rounded-2xl bg-[#EEE7DE] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#142746] text-white flex items-center justify-center text-xs font-bold">
                  <User className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#142746]">{user.name}</p>
                  <p className="text-[11px] text-[#F0523B] font-semibold">
                    {getRoleDisplayLabel(user.role)} (Demo Session)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-[#142746] underline"
              >
                Log Out
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-2 text-base font-semibold text-[#142746]">
            {navLinks.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#142746]/10 flex items-center justify-between hover:text-[#F0523B]"
              >
                <span>{item.label}</span>
                {typeof item.badge === "number" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F0523B] text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/list-business"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-[#142746]/10 hover:text-[#F0523B]"
            >
              List Your Business
            </Link>
            <Link
              href="/submit-correction"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-[#142746]/10 hover:text-[#F0523B]"
            >
              Submit a Correction
            </Link>
          </div>

          {!user ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-full border border-[#142746]/25 font-bold text-sm text-[#142746]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-full bg-[#142746] text-white font-bold text-sm"
              >
                Sign Up
              </Link>
              <Link
                href="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 text-center py-3.5 rounded-full bg-[#F0523B] text-white font-bold text-sm shadow-md"
              >
                Find a Vet
              </Link>
            </div>
          ) : (
            <Link
              href={getDashboardRouteForRole(user.role)}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3.5 rounded-full bg-[#F0523B] text-white font-bold text-sm shadow-md"
            >
              Open {getRoleDisplayLabel(user.role)} Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 bg-[#F8F1E8]/95 backdrop-blur-md border-b border-[#142746]/[0.08] h-20" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
