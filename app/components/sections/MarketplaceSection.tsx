import React from "react";
import Link from "next/link";
import { BadgeChip, SectionLabel } from "../ui";

const SAMPLE_LAWYERS = [
  {
    name: "Adaeze Okonkwo",
    role: "Employment & Labour Law",
    location: "Lagos",
    rating: 4.9,
    reviews: 38,
    responseTime: "< 1 hour",
    consultations: 124,
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
    consultations: 210,
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
    consultations: 87,
    badges: ["Verified Lawyer", "Responsive"],
    initials: "FB",
    color: "#4A1A2D",
  },
];

const BADGE_CONFIG: Record<string, { icon: string; variant: "gold" | "green" | "slate" }> = {
  "Verified Lawyer": { icon: "✓", variant: "gold" },
  "Top Rated": { icon: "★", variant: "green" },
  "Responsive": { icon: "⚡", variant: "slate" },
  "Practice Specialism": { icon: "⚖️", variant: "slate" },
};

export default function MarketplaceSection() {
  return (
    <section className="bg-[#FAF7F2] py-24 xl:py-32">
      <div className="max-w-7xl mx-auto px-5 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <SectionLabel>Lawyer Marketplace</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl xl:text-5xl font-bold text-[#0B1120] leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Verified Lawyers.{" "}
              <em className="not-italic text-[#C9922A]">Real Expertise.</em>
            </h2>
            <p className="text-sm text-[#6B7A8D] leading-relaxed">
              Every lawyer on UnderstandLaw has been verified against Nigerian Bar Association 
              records. Their credentials aren't optional — they're the minimum requirement.
            </p>
          </div>
          <Link href="/marketplace" className="btn-primary inline-flex items-center gap-2 self-start md:self-auto flex-shrink-0 text-sm">
            Browse All Lawyers
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Verification steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12 p-5 bg-[#0F1D35] rounded-2xl border border-white/6">
          {[
            { step: "1", label: "Registration", icon: "📋" },
            { step: "2", label: "Credential Check", icon: "🔍" },
            { step: "3", label: "Platform Training", icon: "🎓" },
            { step: "4", label: "Assessment", icon: "✅" },
            { step: "5", label: "Badge Assigned", icon: "🏅" },
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center gap-2.5">
              {idx > 0 && (
                <div className="hidden lg:block w-full h-px bg-[#C9922A]/20 -ml-1 flex-shrink-0" />
              )}
              <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#C9922A]/15 border border-[#C9922A]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#E8B04A]">{s.step}</span>
                </div>
                <span className="text-xs font-medium text-[#B8C4D6] whitespace-nowrap">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lawyer cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {SAMPLE_LAWYERS.map((lawyer) => (
            <div
              key={lawyer.name}
              className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden card-hover flex flex-col"
            >
              {/* Card header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${lawyer.color}, #0B1120)` }}
                  >
                    {lawyer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-[#0B1120] text-base leading-tight truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-[#6B7A8D] mt-0.5">{lawyer.role}</p>
                    <p className="text-xs text-[#8B9BB4] flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {lawyer.location}, Nigeria
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lawyer.badges.map((badge) => (
                    <BadgeChip
                      key={badge}
                      variant={BADGE_CONFIG[badge]?.variant ?? "slate"}
                      icon={<span className="text-[10px]">{BADGE_CONFIG[badge]?.icon}</span>}
                    >
                      {badge}
                    </BadgeChip>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F0EBE3]">
                  {[
                    { value: lawyer.rating.toString(), label: "Rating", icon: "★" },
                    { value: lawyer.reviews.toString(), label: "Reviews" },
                    { value: lawyer.responseTime, label: "Response" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-sm font-bold text-[#0B1120]">
                        {stat.icon && <span className="text-[#C9922A]">{stat.icon}</span>} {stat.value}
                      </div>
                      <div className="text-[10px] text-[#8B9BB4]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 mt-auto">
                <Link
                  href={`/marketplace/${lawyer.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="w-full btn-primary text-sm flex items-center justify-center gap-2"
                >
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#8B9BB4]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9922A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transparent pricing before booking
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9922A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure in-platform messaging
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9922A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Verified post-consultation reviews
          </div>
        </div>
      </div>
    </section>
  );
}
