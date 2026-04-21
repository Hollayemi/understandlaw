"use client";
import React, { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────
type Category = "All" | "Police" | "Tenancy" | "Employment" | "Contracts" | "Business" | "Family";

// ── Data ──────────────────────────────────────────────────────────────────
const USER = { name: "Stephen", initials: "SO", progress: 3, totalModules: 30 };

const FEATURED_MODULE = {
  category: "Police & Law Enforcement",
  categoryColor: "#3B82F6",
  title: "Your Rights During Arrest & Detention",
  desc: "Section 35 of the 1999 Constitution guarantees your personal liberty. This module walks through exactly what a police officer can and cannot do — and how to assert your rights without escalating the situation.",
  duration: "4 min read",
  format: "Article + Scenario",
  icon: "🚔",
  slug: "rights-during-arrest",
};

const CONTINUE_MODULES = [
  { icon: "🏠", color: "#10B981", title: "Tenant Eviction Rights", progress: 65, category: "Tenancy", slug: "tenant-eviction-rights" },
  { icon: "💼", color: "#8B5CF6", title: "Wrongful Termination in Nigeria", progress: 30, category: "Employment", slug: "wrongful-termination" },
];

const ALL_MODULES = [
  { icon: "🚔", color: "#3B82F6", category: "Police" as Category, title: "Rights During Arrest", duration: "4 min", format: "Article", difficulty: "Beginner", slug: "rights-during-arrest", new: false },
  { icon: "🔍", color: "#3B82F6", category: "Police" as Category, title: "Lawful Search & Seizure", duration: "5 min", format: "Video", difficulty: "Beginner", slug: "search-and-seizure", new: true },
  { icon: "🏠", color: "#10B981", category: "Tenancy" as Category, title: "Eviction Rights & Notice Periods", duration: "6 min", format: "Article", difficulty: "Beginner", slug: "eviction-rights", new: false },
  { icon: "🔑", color: "#10B981", category: "Tenancy" as Category, title: "Illegal Lockouts by Landlord", duration: "3 min", format: "Scenario", difficulty: "Intermediate", slug: "illegal-lockout", new: false },
  { icon: "💼", color: "#8B5CF6", category: "Employment" as Category, title: "Wrongful Termination Explained", duration: "7 min", format: "Article", difficulty: "Beginner", slug: "wrongful-termination", new: false },
  { icon: "💰", color: "#8B5CF6", category: "Employment" as Category, title: "Severance Pay & Redundancy", duration: "5 min", format: "Video", difficulty: "Intermediate", slug: "severance-pay", new: false },
  { icon: "📝", color: "#F59E0B", category: "Contracts" as Category, title: "What Makes a Contract Valid?", duration: "6 min", format: "Article", difficulty: "Beginner", slug: "valid-contract", new: true },
  { icon: "🏢", color: "#06B6D4", category: "Business" as Category, title: "Registering a Business in Nigeria", duration: "8 min", format: "Article", difficulty: "Beginner", slug: "business-registration", new: false },
  { icon: "👨‍👩‍👧", color: "#EF4444", category: "Family" as Category, title: "Domestic Violence & Protection Orders", duration: "5 min", format: "Scenario", difficulty: "Intermediate", slug: "domestic-violence-protection", new: false },
];

const QUICK_TIPS = [
  { icon: "⚡", tip: "The police cannot hold you for more than 24 hours without charging you.", tag: "Police Rights" },
  { icon: "📋", tip: "Any tenancy agreement longer than 3 years must be in writing under Nigerian law.", tag: "Tenancy" },
  { icon: "💡", tip: "An employer must give written notice before termination — length depends on your contract.", tag: "Employment" },
];

const CATEGORIES: { label: Category; icon: string }[] = [
  { label: "All", icon: "📚" },
  { label: "Police", icon: "🚔" },
  { label: "Tenancy", icon: "🏠" },
  { label: "Employment", icon: "💼" },
  { label: "Contracts", icon: "📝" },
  { label: "Business", icon: "🏢" },
  { label: "Family", icon: "👨‍👩‍👧" },
];

const FORMAT_COLOR: Record<string, string> = {
  Article: "bg-blue-50 text-blue-600",
  Video: "bg-pink-50 text-pink-600",
  Scenario: "bg-amber-50 text-amber-600",
};

// ── Component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = activeCategory === "All"
    ? ALL_MODULES
    : ALL_MODULES.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col" style={{ fontFamily: "var(--font-dm-sans)" }}>

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="5" cy="8" r="1" fill="white" />
              <circle cx="19" cy="8" r="1" fill="white" />
              <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <line x1="9" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-[15px] text-gray-900">
            Understand<span style={{ color: "#E8317A" }}>Law</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Learn", href: "/dashboard", active: true },
            { label: "Library", href: "/library" },
            { label: "Marketplace", href: "/marketplace" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                item.active
                  ? "bg-pink-50 text-[#E8317A]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8317A] text-white text-xs font-semibold hover:bg-[#d01f68] transition-colors"
          >
            ⚖️ Talk to a Lawyer
          </Link>
          <button className="w-8 h-8 rounded-full bg-[#E8317A]/10 flex items-center justify-center text-[#E8317A] text-xs font-bold">
            {USER.initials}
          </button>
          <button className="md:hidden w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Sidebar ── */}
        <aside className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-64px)]
          w-60 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col overflow-y-auto
          transition-transform duration-200 md:transition-none
        `}>
          <div className="p-4 flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setActiveCategory(cat.label); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeCategory === cat.label
                    ? "bg-pink-50 text-[#E8317A]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
                {activeCategory === cat.label && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8317A]" />
                )}
              </button>
            ))}
          </div>

          {/* Progress block */}
          <div className="mt-auto p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-1">Your Progress</p>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-bebas)" }}>
                {USER.progress}/{USER.totalModules}
              </p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 mb-1">
                <div
                  className="h-1.5 rounded-full bg-[#E8317A]"
                  style={{ width: `${(USER.progress / USER.totalModules) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">modules completed</p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 p-5 xl:p-8 flex flex-col gap-7">

          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Good day, {USER.name} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                You've completed <strong className="text-gray-900">{USER.progress}</strong> modules. Keep going.
              </p>
            </div>
            <Link
              href="/learn/request"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Request a topic →
            </Link>
          </div>

          {/* Featured module */}
          <div
            className="rounded-2xl p-7 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #111827 0%, #1E3A5F 100%)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#3B82F6]/10 blur-[60px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  Featured Today
                </span>
                <span className="text-[10px] font-medium text-gray-400">{FEATURED_MODULE.category}</span>
              </div>
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                    {FEATURED_MODULE.title}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed mb-5 max-w-lg">
                    {FEATURED_MODULE.desc}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      href={`/learn/${FEATURED_MODULE.slug}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-900/40 transition-all"
                    >
                      Start Reading
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <span className="text-xs text-gray-400">{FEATURED_MODULE.duration} · {FEATURED_MODULE.format}</span>
                  </div>
                </div>
                <div className="text-7xl hidden md:block opacity-20">{FEATURED_MODULE.icon}</div>
              </div>
            </div>
          </div>

          {/* Continue learning */}
          {CONTINUE_MODULES.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Continue Where You Left Off</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {CONTINUE_MODULES.map((mod) => (
                  <Link
                    key={mod.slug}
                    href={`/learn/${mod.slug}`}
                    className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${mod.color}15` }}>
                        {mod.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{mod.category}</p>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E8317A] transition-colors leading-snug truncate">
                          {mod.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${mod.progress}%`, background: mod.color }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500">{mod.progress}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick tips */}
          <div className="grid sm:grid-cols-3 gap-3">
            {QUICK_TIPS.map((tip, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tip.icon}</span>
                  <span className="text-[10px] font-semibold text-[#E8317A] uppercase tracking-wide">{tip.tag}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>

          {/* All modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                {activeCategory === "All" ? "All Modules" : `${activeCategory} Modules`}
                <span className="ml-2 text-gray-400 font-normal">({filtered.length})</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((mod) => (
                <Link
                  key={mod.slug}
                  href={`/learn/${mod.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${mod.color}15` }}>
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold text-gray-400">{mod.category}</span>
                        {mod.new && (
                          <span className="text-[9px] font-bold text-[#E8317A] bg-pink-50 px-1.5 py-0.5 rounded-full border border-pink-100">NEW</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E8317A] transition-colors leading-snug">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${FORMAT_COLOR[mod.format]}`}>
                      {mod.format}
                    </span>
                    <span className="text-[10px] text-gray-400">{mod.duration}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">{mod.difficulty}</span>
                    <svg
                      className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#E8317A] group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Lawyer nudge */}
          <div className="bg-[#111827] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8317A]/15 border border-[#E8317A]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Need professional legal help?</p>
                <p className="text-xs text-gray-400 mt-0.5">Browse NBA-verified lawyers. Transparent pricing. Book in minutes.</p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] transition-colors whitespace-nowrap"
            >
              Find a Lawyer →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}