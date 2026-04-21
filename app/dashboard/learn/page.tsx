"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Bookmark, ChevronLeft, ChevronRight, Clock, BookOpen, Star } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────
type TabKey = "all" | "active" | "complete" | "saved";

// ── Mock modules ──────────────────────────────────────────────────────────
const MODULES = [
  {
    slug:        "rights-during-arrest",
    icon:        "🚔",
    gradient:    "linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%)",
    tag:         "Police Rights",
    tagColor:    "#3B82F6",
    title:       "Rights During Arrest & Detention",
    desc:        "Know exactly what the police can and cannot do — and how to protect yourself without escalating.",
    rating:      4.3,
    weeks:       4,
    lessons:     10,
    instructor:  { name: "Adaeze Okonkwo", email: "adaeze@understandlaw.ng", initials: "AO", color: "#3B82F6" },
    price:       "Free",
    tab:         "active" as TabKey,
  },
  {
    slug:        "tenant-eviction-rights",
    icon:        "🏠",
    gradient:    "linear-gradient(135deg, #1A3B2E 0%, #2D6A4F 100%)",
    tag:         "Tenancy Law",
    tagColor:    "#10B981",
    title:       "Tenant Eviction Rights in Nigeria",
    desc:        "Designing a fair and legal rental experience — know notice periods, illegal lockouts, and court options.",
    rating:      4.3,
    weeks:       6,
    lessons:     8,
    instructor:  { name: "Emeka Nwosu", email: "emeka@understandlaw.ng", initials: "EN", color: "#10B981" },
    price:       "Free",
    tab:         "active" as TabKey,
  },
  {
    slug:        "employment-termination",
    icon:        "💼",
    gradient:    "linear-gradient(135deg, #2D1A3B 0%, #5B3080 100%)",
    tag:         "Employment Law",
    tagColor:    "#8B5CF6",
    title:       "Wrongful Termination & Severance",
    desc:        "Understand your rights when you are dismissed — redundancy, severance pay, and labour court remedies.",
    rating:      3.8,
    weeks:       5,
    lessons:     12,
    instructor:  { name: "Fatimah Bello", email: "fatimah@understandlaw.ng", initials: "FB", color: "#8B5CF6" },
    price:       "Free",
    tab:         "all" as TabKey,
  },
  {
    slug:        "valid-contracts",
    icon:        "📝",
    gradient:    "linear-gradient(135deg, #2D2A1A 0%, #78570A 100%)",
    tag:         "Contracts",
    tagColor:    "#F59E0B",
    title:       "What Makes a Contract Valid?",
    desc:        "Spot a legally binding agreement before you sign one — offer, acceptance, consideration, and capacity explained.",
    rating:      4.6,
    weeks:       3,
    lessons:     7,
    instructor:  { name: "Chidi Okafor", email: "chidi@understandlaw.ng", initials: "CO", color: "#F59E0B" },
    price:       "Free",
    tab:         "complete" as TabKey,
  },
  {
    slug:        "business-registration",
    icon:        "🏢",
    gradient:    "linear-gradient(135deg, #1A2D3B 0%, #0E7490 100%)",
    tag:         "Business Law",
    tagColor:    "#06B6D4",
    title:       "Registering a Business in Nigeria",
    desc:        "CAC requirements, business name vs company, registration steps, and common mistakes — all in plain English.",
    rating:      4.5,
    weeks:       4,
    lessons:     9,
    instructor:  { name: "Amina Garba", email: "amina@understandlaw.ng", initials: "AG", color: "#06B6D4" },
    price:       "Free",
    tab:         "saved" as TabKey,
  },
  {
    slug:        "domestic-violence-protection",
    icon:        "🛡️",
    gradient:    "linear-gradient(135deg, #3B1A1A 0%, #991B1B 100%)",
    tag:         "Family Law",
    tagColor:    "#EF4444",
    title:       "Domestic Violence & Protection Orders",
    desc:        "Your rights under the VAPP Act — how to get a protection order and what the law says about domestic abuse.",
    rating:      4.8,
    weeks:       4,
    lessons:     8,
    instructor:  { name: "Ngozi Eze", email: "ngozi@understandlaw.ng", initials: "NE", color: "#EF4444" },
    price:       "Free",
    tab:         "all" as TabKey,
  },
];

const FEATURED = [
  { slug: "search-and-seizure",      title: "Lawful Search & Seizure",          instructor: "Adaeze Okonkwo",  email: "adaeze@understandlaw.ng",  initials: "AO", color: "#3B82F6" },
  { slug: "severance-pay",           title: "Severance Pay & Redundancy",        instructor: "Chidi Okafor",    email: "chidi@understandlaw.ng",    initials: "CO", color: "#F59E0B" },
  { slug: "consumer-protection-act", title: "Consumer Protection Rights",        instructor: "Fatimah Bello",   email: "fatimah@understandlaw.ng",  initials: "FB", color: "#10B981" },
];

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: "all",      label: "All Modules",  count: 6  },
  { key: "active",   label: "Active",       count: 2  },
  { key: "complete", label: "Complete",     count: 1  },
  { key: "saved",    label: "Saved",        count: 1  },
];

// ── Component ─────────────────────────────────────────────────────────────
export default function DashboardLearnPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set(["business-registration"]));

  const filtered =
    tab === "all"
      ? MODULES
      : MODULES.filter((m) => m.tab === tab);

  const toggleSave = (slug: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <div className="flex-1 p-5 xl:p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-bold text-gray-900">Our Modules</h1>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 shadow-sm transition-colors">
            <Search size={16} className="text-gray-500" />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 shadow-sm transition-colors">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8317A] rounded-full" />
          </button>
          <Link
            href="/dashboard/marketplace"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            Find a Lawyer
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t.key
                ? "text-gray-900 border-gray-900"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            {t.label}
            <span className={`text-[11px] font-medium ${tab === t.key ? "text-gray-500" : "text-gray-300"}`}>
              ({String(t.count).padStart(2, "0")})
            </span>
          </button>
        ))}
      </div>

      {/* Module cards carousel */}
      <div className="relative mb-10">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
          {filtered.map((mod) => (
            <div
              key={mod.slug}
              className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-44 flex items-center justify-center" style={{ background: mod.gradient }}>
                <span className="text-6xl opacity-80">{mod.icon}</span>
                {/* Price badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {mod.price}
                </div>
                {/* Bookmark */}
                <button
                  onClick={() => toggleSave(mod.slug)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <Bookmark
                    size={14}
                    className={saved.has(mod.slug) ? "text-[#E8317A] fill-[#E8317A]" : "text-gray-500"}
                  />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Tag */}
                <span
                  className="text-[10px] font-bold uppercase tracking-wide mb-2"
                  style={{ color: mod.tagColor }}
                >
                  {mod.tag}
                </span>

                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5">{mod.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">{mod.desc}</p>

                {/* Stats row */}
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star size={11} className="fill-amber-400 text-amber-400" />{mod.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-gray-400" />{mod.weeks}w
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} className="text-gray-400" />{mod.lessons} lessons
                  </span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${mod.instructor.color}, ${mod.instructor.color}80)` }}
                  >
                    {mod.instructor.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{mod.instructor.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{mod.instructor.email}</p>
                  </div>
                  <Link
                    href={`/dashboard/learn/${mod.slug}`}
                    className="ml-auto flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Topics */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Featured Topics</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURED.map((f) => (
            <Link
              key={f.slug}
              href={`/dashboard/learn/${f.slug}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3 className="font-bold text-gray-900 text-sm leading-snug">{f.title}</h3>
              <div className="flex items-center gap-2 mt-auto">
                <p className="text-[10px] text-[#E8317A] font-semibold uppercase tracking-wide">Taught By</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}80)` }}
                >
                  {f.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{f.instructor}</p>
                  <p className="text-[10px] text-gray-400 truncate">{f.email}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
