import React from "react";
import Link from "next/link";

const TOPICS = [
  {
    icon: "🚔",
    accent: "#3B82F6",
    gradientFrom: "#1E3257",
    title: "Police & Law Enforcement",
    topics: ["Rights during arrest", "Lawful search & seizure", "Unlawful detention", "SARS interactions"],
    count: 8,
  },
  {
    icon: "🏠",
    accent: "#10B981",
    gradientFrom: "#1A3B2E",
    title: "Landlord & Tenancy",
    topics: ["Eviction rights", "Rental agreements", "Illegal lockouts", "Deposit recovery"],
    count: 6,
  },
  {
    icon: "💼",
    accent: "#8B5CF6",
    gradientFrom: "#2D1A3B",
    title: "Employment & Labour",
    topics: ["Wrongful termination", "Severance pay", "Workplace harassment", "NSITF rights"],
    count: 7,
  },
  {
    icon: "📝",
    accent: "#F59E0B",
    gradientFrom: "#2D2A1A",
    title: "Contracts & Agreements",
    topics: ["Valid contracts", "Consumer rights", "Breach of contract", "Digital agreements"],
    count: 5,
  },
  {
    icon: "🏢",
    accent: "#06B6D4",
    gradientFrom: "#1A2D3B",
    title: "Business & Commerce",
    topics: ["Business registration", "Tax obligations", "CAC requirements", "IP protection"],
    count: 6,
  },
  {
    icon: "👨‍👩‍👧",
    accent: "#EF4444",
    gradientFrom: "#3B1A1A",
    title: "Family & Personal Rights",
    topics: ["Domestic violence", "Protection orders", "Inheritance", "Child custody"],
    count: 6,
  },
];

export default function TopicsSection() {
  return (
    <section className="bg-[#0B1120] py-24 xl:py-32 relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9922A]/4 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#162543]/80 blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 xl:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            {/* Gold label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9922A]">Legal Topics</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Know What the Law{" "}
              <em className="not-italic text-[#E8B04A]">Says About You</em>
            </h2>
          </div>
          <Link href="/learn"
            className="self-start md:self-auto flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full border-[1.5px] border-white/25 text-white text-sm font-semibold hover:bg-white/8 hover:border-white/45 transition-all">
            View All Topics
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOPICS.map((cat) => (
            <Link
              key={cat.title}
              href={`/learn/${cat.title.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
              className="group relative rounded-2xl p-6 border border-white/6 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${cat.gradientFrom} 0%, #0B1120 100%)` }}
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                style={{ background: cat.accent }}
              />

              <div className="relative">
                {/* Icon + count */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/6 border border-white/8 text-[11px] text-[#8B9BB4]">
                    {cat.count} articles
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold text-white mb-3 group-hover:text-[#E8B04A] transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {cat.title}
                </h3>

                {/* Topics */}
                <ul className="flex flex-col gap-1.5 mb-4">
                  {cat.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C9922A] flex-shrink-0" />
                      <span className="text-xs text-[#8B9BB4]">{topic}</span>
                    </li>
                  ))}
                </ul>

                {/* Explore link */}
                <div className="flex items-center gap-1.5 text-[#C9922A] text-xs font-medium">
                  Explore
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#8B9BB4] mb-3">
            Can't find what you're looking for? Our legal team adds new topics every week.
          </p>
          <Link href="/learn/request"
            className="text-sm font-medium text-[#E8B04A] hover:underline inline-flex items-center gap-1.5">
            Request a Topic
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
