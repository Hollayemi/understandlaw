import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";

const FEATURED_ACTS = [
  {
    title: "Labour Act",
    chapter: "Cap. L1, Laws of the Federation",
    year: "2004",
    category: "Employment",
    color: "#8B5CF6",
    sections: 91,
    summary: "Governs conditions of employment, contracts of service, and worker protections in Nigeria.",
    tags: ["Contracts", "Wages", "Termination", "Leave"],
  },
  {
    title: "Tenancy Law of Lagos State",
    chapter: "Lagos State No. 5",
    year: "2011",
    category: "Tenancy",
    color: "#10B981",
    sections: 43,
    summary: "Regulates landlord and tenant relationships in Lagos — including eviction procedures and notice periods.",
    tags: ["Eviction", "Rent", "Notice", "Repairs"],
  },
  {
    title: "Constitution of Nigeria",
    chapter: "Cap. C23, LFN",
    year: "1999 (as amended)",
    category: "Fundamental Rights",
    color: "#E8317A",
    sections: 320,
    summary: "The supreme law of Nigeria. Chapter IV covers Fundamental Rights including freedom from arbitrary arrest.",
    tags: ["Rights", "Arrest", "Due Process", "Freedom"],
  },
  {
    title: "Consumer Protection Council Act",
    chapter: "Cap. C25, LFN",
    year: "2004",
    category: "Consumer Rights",
    color: "#F59E0B",
    sections: 36,
    summary: "Establishes the Consumer Protection Council and protects Nigerians from unfair trade practices.",
    tags: ["Refunds", "Defective Products", "Complaints"],
  },
  {
    title: "Companies and Allied Matters Act",
    chapter: "CAMA 2020",
    year: "2020",
    category: "Business",
    color: "#06B6D4",
    sections: 869,
    summary: "The primary legislation governing companies in Nigeria — from registration to dissolution.",
    tags: ["CAC", "Registration", "Directors", "Shares"],
  },
  {
    title: "Violence Against Persons Prohibition Act",
    chapter: "VAPP Act",
    year: "2015",
    category: "Family Law",
    color: "#EF4444",
    sections: 46,
    summary: "Prohibits all forms of violence against persons, including domestic violence and sexual abuse.",
    tags: ["Domestic Violence", "Protection", "GBV"],
  },
];

const CATEGORIES = [
  { label: "All", count: 40, active: true },
  { label: "Employment", count: 8 },
  { label: "Tenancy", count: 6 },
  { label: "Criminal", count: 7 },
  { label: "Business", count: 9 },
  { label: "Family", count: 5 },
  { label: "Consumer", count: 5 },
];

export default function LibraryPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-14 pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">Legal Library</p>
              <h1
                className="text-[clamp(48px,7vw,76px)] leading-none tracking-[0.01em] text-gray-900 uppercase"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                THE LAW,<br />
                <span style={{ color: "#E8317A" }}>IN YOUR LANGUAGE</span>
              </h1>
            </div>
            <div>
              <p className="text-base text-gray-500 leading-relaxed">
                Every Act in the UnderstandLaw library comes with a plain-English summary alongside the authoritative
                statutory text. Highlight key sections. Bookmark what matters. Search across the entire library in seconds.
              </p>
              <div className="flex items-center gap-6 mt-5">
                {[
                  { value: "40+", label: "Acts & Legislation" },
                  { value: "100%", label: "Plain-English Summaries" },
                  { value: "Free", label: "Open Access" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-bebas)" }}>
                      {s.value}
                    </p>
                    <p className="text-[11px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + filters */}
      <section className="bg-[#F3F3F3] py-6 border-b border-gray-200 sticky top-[76px] z-30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search legislation — e.g. 'Labour Act', 'Section 35 Constitution'..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
              />
            </div>
            <select className="h-12 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-[#E8317A] transition-colors">
              <option>All Jurisdictions</option>
              <option>Federal</option>
              <option>Lagos State</option>
              <option>Abuja FCT</option>
              <option>Rivers State</option>
            </select>
          </div>
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  cat.active
                    ? "bg-[#E8317A] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat.label}
                <span
                  className={`text-[10px] font-normal ${cat.active ? "text-white/80" : "text-gray-400"}`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Acts grid */}
      <section className="bg-[#F3F3F3] py-12 xl:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <strong className="text-gray-900">40</strong> pieces of legislation
            </p>
            <select className="h-9 px-3 rounded-lg border-[1.5px] border-gray-200 text-xs text-gray-700 bg-white outline-none focus:border-[#E8317A]">
              <option>Most Relevant</option>
              <option>Recently Updated</option>
              <option>Most Viewed</option>
              <option>A–Z</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {FEATURED_ACTS.map((act) => (
              <Link
                key={act.title}
                href={`/library/${act.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${act.color}, ${act.color}80)` }}
                  >
                    ⚖
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${act.color}12`, color: act.color }}
                  >
                    {act.category}
                  </span>
                </div>

                <h3
                  className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#E8317A] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {act.title}
                </h3>
                <p className="text-[11px] text-gray-400 mb-3">
                  {act.chapter} · {act.year} · {act.sections} sections
                </p>

                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{act.summary}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {act.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium text-gray-500 bg-gray-50 border border-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-1.5 text-sm font-semibold mt-auto"
                  style={{ color: act.color }}
                >
                  Read Act
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-10">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-[1.5px] border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-white transition-all">
              Load More Legislation
            </button>
          </div>
        </div>
      </section>

      {/* Register CTA for bookmarks */}
      <section className="bg-[#111827] py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">Registered Users</p>
          <h2
            className="text-[clamp(28px,4vw,44px)] leading-none text-white uppercase mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            BOOKMARK ACTS. TRACK YOUR READING.
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Create a free account to bookmark legislation, save your reading progress, and get notified when Acts are updated.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-900/30"
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </HomeWrapper>
  );
}