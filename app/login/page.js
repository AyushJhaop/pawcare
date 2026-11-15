"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  loginWithCredentials,
  DEMO_ACCOUNTS,
  getRoleDisplayLabel,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setIsSubmitting(true);
    const result = loginWithCredentials(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(result.redirectTo);
  };

  const handleQuickDemoLogin = (demoUser) => {
    setError("");
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    const result = loginWithCredentials(demoUser.email, demoUser.password);
    if (result.ok) {
      router.push(result.redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-[1180px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (7 cols): Sign-In Form */}
          <div className="lg:col-span-7 bg-white rounded-[36px] p-6 sm:p-10 border border-[#142746]/10 shadow-[0_18px_50px_rgba(20,39,70,0.06)]">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7DE] text-[#F0523B] text-xs font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Demo Authentication Prototype</span>
              </span>
              <h1 className="font-display-hero uppercase text-4xl sm:text-5xl text-[#142746]">
                SIGN IN TO PAWCARE
              </h1>
              <p className="text-sm text-[#6D6B68] mt-1.5">
                Access your Pet Parent shortlist, Service Provider listing
                portal, or Internal Admin console.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold uppercase tracking-wider text-[#142746] mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@demo.pawcare"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#142746]"
                  >
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="done"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F1E8] border border-[#142746]/15 text-sm text-[#142746] focus:outline-none focus:border-[#142746]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm py-4 rounded-full shadow-[0_12px_28px_rgba(240,82,59,0.28)] transition-all cursor-pointer"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#142746]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6D6B68]">
              <span>Don&apos;t have a PawCare account yet?</span>
              <Link
                href="/signup"
                className="font-bold text-[#142746] hover:text-[#F0523B] underline"
              >
                Create a Pet Parent or Provider Account →
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): 1-Click Demo Role Switcher Cards */}
          <aside className="lg:col-span-5 bg-[#142746] text-white rounded-[36px] p-6 sm:p-8 space-y-5 shadow-xl">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                INSTANT PROTOTYPE ACCESS
              </span>
              <h2 className="font-display-hero uppercase text-2xl sm:text-3xl text-white mt-1">
                1-CLICK DEMO ACCOUNTS
              </h2>
              <p className="text-xs text-[#EEE7DE]/80 leading-relaxed mt-1.5">
                Click any role card below to sign in immediately and test
                role-based dashboards, navigation, and access control.
              </p>
            </div>

            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((acct) => {
                const Icon =
                  acct.role === "admin"
                    ? ShieldCheck
                    : acct.role === "service_provider"
                    ? Building2
                    : UserCheck;
                return (
                  <div
                    key={acct.id}
                    className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-xl bg-[#F0523B] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider text-[#F0523B]">
                            {getRoleDisplayLabel(acct.role)}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-1">
                            {acct.name}
                          </h3>
                          <p className="text-xs text-[#EEE7DE]/75">
                            {acct.email} • Pass: <code>{acct.password}</code>
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(acct)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#F0523B] hover:bg-[#d9432d] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>
                        Sign In as {getRoleDisplayLabel(acct.role)}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-[11px] text-[#EEE7DE]/75 leading-relaxed">
              <strong className="text-white">Architecture Note:</strong> This
              MVP uses a <code>localStorage</code> session layer for offline
              evaluation. Admin accounts are provisioned internally and cannot
              be created via public registration.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

