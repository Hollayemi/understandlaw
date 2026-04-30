"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Tab = "login" | "register";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "login" || hash === "register") {
        setTab(hash as Tab);
      }
    };

    // Set initial tab based on URL hash
    handleHashChange();

    // Listen for hash changes (when user clicks browser back/forward)
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col">
      {/* Header */}
      {/* <div className="px-6 py-5">
        
      </div> */}

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Left panel headline (visible on larger screens via layout trick) */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="5" cy="8" r="1" fill="white" />
                  <circle cx="19" cy="8" r="1" fill="white" />
                  <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <line x1="9" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <span
                className="font-bold text-[17px] text-gray-900"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Law<span style={{ color: "#E8317A" }}>Ticha</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              {tab === "register"
                ? "Free forever. No card required. Nigerian law, simplified."
                : "Continue learning. Your rights don't take a break."}
            </p>
          </div>



          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Tab toggle */}
            <div className="flex border-b border-gray-100">
              {(["register", "login"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === t
                      ? "text-[#E8317A] border-b-2 border-[#E8317A] bg-pink-50/40"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {t === "register" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            <div className="p-7">
              {/* Social login */}
              <button className="w-full flex items-center justify-center gap-3 border-[1.5px] border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all mb-5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {tab === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name</label>
                      <input
                        type="text"
                        placeholder="Adaeze"
                        required
                        className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        placeholder="Okafor"
                        required
                        className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                  />
                </div>

                {tab === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 h-11 px-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm text-gray-600 flex-shrink-0">
                        🇳🇬 +234
                      </div>
                      <input
                        type="tel"
                        placeholder="080 0000 0000"
                        className="flex-1 h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Password</label>
                    {tab === "login" && (
                      <Link href="/forgot-password" className="text-xs text-[#E8317A] hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={tab === "register" ? "Min. 8 characters" : "Enter your password"}
                      required
                      className="w-full h-11 px-4 pr-11 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {tab === "register" && (
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 w-4 h-4 rounded accent-[#E8317A] flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/legal/terms" className="text-[#E8317A] hover:underline font-medium">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/legal/privacy" className="text-[#E8317A] hover:underline font-medium">Privacy Policy</Link>.
                      Content is educational only, not legal advice.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-1 rounded-full bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-60 text-white text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : tab === "register" ? (
                    <>
                      Create Free Account
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  ) : (
                    "Sign In to LawTicha"
                  )}
                </button>
              </form>

              {/* Switch tab */}
              <p className="text-center text-xs text-gray-500 mt-5">
                {tab === "register" ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setTab(tab === "register" ? "login" : "register")}
                  className="text-[#E8317A] font-semibold hover:underline"
                >
                  {tab === "register" ? "Sign in" : "Create one free"}
                </button>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-5 mt-6">
            {[
              { icon: "🔒", text: "Secure & private" },
              { icon: "🇳🇬", text: "Nigerian law only" },
              { icon: "✓", text: "Free forever" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}