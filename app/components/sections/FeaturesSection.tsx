import React from "react";
import Link from "next/link";
import { File, BookSearchIcon, Scale  } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: <BookSearchIcon />,
    tag: "Legal Learning Module",
    title: "Understand Before\nYou Act",
    desc: "Short scenario-driven videos and plain-English articles covering police encounters, tenancy rights, employment law, contracts, and more — built for everyday Nigerians.",
    bullets: ["1–3 min video lessons", "Scenario walkthroughs", "Plain-text summaries", "Topic recommendations"],
    cta: "Browse Topics",
    href: "/learn",
    accent: "#E8317A",
    accentBg: "bg-pink-50",
    accentBorder: "border-pink-100",
    stepColor: "text-[#E8317A]",
  },
  {
    num: "02",
    icon: <File />,
    tag: "Legal Library",
    title: "The Law, In\nYour Language",
    desc: "A searchable repository of Nigerian Acts and subsidiary legislation — each presented with a plain-English summary alongside the authoritative statutory text.",
    bullets: ["Full-text search", "Plain + statutory text side-by-side", "Filter by topic & jurisdiction", "Bookmarking for registered users"],
    cta: "Explore Library",
    href: "/library",
    accent: "#3B82F6",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    stepColor: "text-blue-500",
  },
  {
    num: "03",
    icon: <Scale />,
    tag: "Lawyer Marketplace",
    title: "Expert Help,\nWhen You're Ready",
    desc: "Browse NBA-verified lawyers by speciality, rating, and availability. Book via secure messaging, scheduled call, or video — transparent pricing, no hidden charges.",
    bullets: ["NBA-verified only", "Transparent fee schedule", "Messaging + video calls", "Verified reviews"],
    cta: "Find a Lawyer",
    href: "/marketplace",
    accent: "#10B981",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    stepColor: "text-emerald-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#F3F3F3] py-20 xl:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#E8317A] mb-2">How It Works</p>
            <h2
              className="text-[clamp(36px,5vw,56px)] leading-none tracking-[0.01em] text-gray-900 uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              FROM CONFUSION TO CLARITY<br />IN THREE STEPS
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            UnderstandLaw guides you from knowing your rights, to reading the law,
            to getting professional help — all in one platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-2xl p-7 flex flex-col border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon + step badge */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.accentBg} border ${s.accentBorder}`}
                >
                  {s.icon}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${s.stepColor}`}>
                  STEP {s.num}
                </span>
              </div>

              {/* Tag */}
              <p className={`text-xs font-semibold mb-1.5 ${s.stepColor}`}>{s.tag}</p>

              {/* Title */}
              <h3
                className="text-xl font-bold text-gray-900 mb-3 whitespace-pre-line leading-snug"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {s.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{s.desc}</p>

              {/* Bullets */}
              <ul className="flex flex-col gap-2 mb-6">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                      style={{ color: s.accent }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs text-gray-500">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: s.accent }}
              >
                {s.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
