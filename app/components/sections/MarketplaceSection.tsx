import React from "react";
import Link from "next/link";

const LAWYERS = [
  {
    name: "Adaeze Okonkwo",
    role: "Employment & Labour Law",
    location: "Lagos",
    rating: 4.9,
    reviews: 38,
    responseTime: "< 1 hour",
    badges: ["Verified Lawyer", "Top Rated", "Responsive"],
    initials: "AO",
    color: "#1E3A5F",
  },
  {
    name: "Emeka Nwosu",
    role: "Property & Tenancy Law",
    location: "Abuja",
    rating: 4.8,
    reviews: 55,
    responseTime: "< 2 hours",
    badges: ["Verified Lawyer", "Top Rated"],
    initials: "EN",
    color: "#2D4A1A",
  },
  {
    name: "Fatimah Bello",
    role: "Family & Domestic Law",
    location: "Kano",
    rating: 4.7,
    reviews: 29,
    responseTime: "< 3 hours",
    badges: ["Verified Lawyer", "Responsive"],
    initials: "FB",
    color: "#4A1A2D",
  },
];

const BADGE_STYLE: Record<string, string> = {
  "Verified Lawyer": "bg-amber-50 border-amber-200 text-amber-700",
  "Top Rated": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "Responsive": "bg-slate-100 border-slate-200 text-slate-600",
};
const BADGE_ICON: Record<string, string> = {
  "Verified Lawyer": "✓",
  "Top Rated": "★",
  "Responsive": "⚡",
};

export default function MarketplaceSection() {
  return (
    <section className="bg-[#FAF7F2] py-24 xl:py-32">
      <div className="max-w-7xl mx-auto px-5 xl:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9922A]">Lawyer Marketplace</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl xl:text-5xl font-bold text-[#0B1120] leading-tight mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Verified Lawyers.{" "}
              <em className="not-italic text-[#C9922A]">Real Expertise.</em>
            </h2>
            <p className="text-sm text-[#6B7A8D] leading-relaxed">
              Every lawyer on LawTicha has been verified against Nigerian Bar Association
              records. Their credentials aren't optional, they're the minimum requirement.
            </p>
          </div>
          <Link href="/marketplace"
            className="self-start md:self-auto flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A] text-[#0B1120] text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200 transition-all">
            Browse All Lawyers
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>

        {/* Verification steps */}
        <div className="grid sm:grid-cols-5 gap-3 mb-12 p-5 bg-[#0F1D35] rounded-2xl border border-white/6">
          {["Registration","Credential Check","Platform Training","Assessment","Badge Assigned"].map((step, i) => (
            <div key={step} className="flex items-center gap-2.5">
              {i > 0 && <div className="hidden sm:block w-full h-px bg-[#C9922A]/20 -ml-1 flex-shrink-0" />}
              <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#C9922A]/15 border border-[#C9922A]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#E8B04A]">{i + 1}</span>
                </div>
                <span className="text-xs font-medium text-[#B8C4D6] whitespace-nowrap">{step}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lawyer cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {LAWYERS.map((lawyer) => (
            <div
              key={lawyer.name}
              className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6 pb-4">
                {/* Avatar + info */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${lawyer.color}, #0B1120)` }}
                  >
                    {lawyer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-[#0B1120] text-base leading-tight truncate"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-[#6B7A8D] mt-0.5">{lawyer.role}</p>
                    <p className="text-xs text-[#8B9BB4] flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {lawyer.location}, Nigeria
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lawyer.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${BADGE_STYLE[badge]}`}
                    >
                      <span className="text-[10px]">{BADGE_ICON[badge]}</span>
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F0EBE3]">
                  {[
                    { value: `★ ${lawyer.rating}`, label: "Rating" },
                    { value: String(lawyer.reviews), label: "Reviews" },
                    { value: lawyer.responseTime, label: "Response" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-sm font-bold text-[#0B1120]">{stat.value}</div>
                      <div className="text-[10px] text-[#8B9BB4]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 mt-auto">
                <Link
                  href={`/marketplace/${lawyer.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A] text-[#0B1120] text-sm font-bold hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-200 transition-all"
                >
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#8B9BB4]">
          {[
            { icon: "🔒", text: "Transparent pricing before booking" },
            { icon: "🛡️", text: "Secure in-platform messaging" },
            { icon: "⭐", text: "Verified post-consultation reviews" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
