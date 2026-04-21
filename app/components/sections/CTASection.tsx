import React from "react";
import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Everything you need to understand Nigerian law — at no cost.",
    features: ["Full access to Legal Learning Module", "Browse Legal Library", "Full-text legislation search", "Topic recommendations", "Community forum access"],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Marketplace",
    price: "Pay-per-use",
    period: "per consultation",
    desc: "Access verified lawyers when you need professional advice.",
    features: ["Everything in Free", "Browse lawyer profiles & badges", "Book consultations (messaging/call/video)", "Transparent fee schedule", "Post-consultation reviews", "Consultation history log"],
    cta: "Find a Lawyer",
    href: "/marketplace",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "Coming Soon",
    period: "Phase 3",
    desc: "Advanced guides, document templates, and deep-dive content.",
    features: ["Everything in Marketplace", "Deep-dive legal guides", "Downloadable document templates", "Priority lawyer matching", "Legal query AI assistant", "Completion certificates"],
    cta: "Join Waitlist",
    href: "/waitlist",
    highlight: false,
    badge: "Coming Phase 3",
  },
];

export default function CTASection() {
  return (
    <>
      {/* ── Pricing ── */}
      <section className="bg-[#FAF7F2] py-24 xl:py-32">
        <div className="max-w-7xl mx-auto px-5 xl:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9922A]">Pricing</span>
              <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#E8B04A] to-[#C9922A]" />
            </div>
            <h2
              className="text-3xl sm:text-4xl xl:text-5xl font-bold text-[#0B1120] leading-tight mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Start Free.{" "}
              <em className="not-italic text-[#C9922A]">Scale When Ready.</em>
            </h2>
            <p className="text-sm text-[#6B7A8D] max-w-lg mx-auto">
              We believe legal knowledge should be free. Start learning today — no card required.
            </p>
          </div>

          {/* Tiers */}
          <div className="grid md:grid-cols-3 gap-6 xl:gap-8">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-7 xl:p-8 flex flex-col border transition-all duration-300 ${
                  tier.highlight
                    ? "bg-[#0B1120] border-[#C9922A]/25 shadow-2xl shadow-amber-900/10 scale-[1.02]"
                    : "bg-white border-[#E8E2D9] hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                    tier.highlight
                      ? "bg-gradient-to-r from-[#C9922A] to-[#E8B04A] text-[#0B1120]"
                      : "bg-[#E8E2D9] text-[#6B7A8D]"
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="mb-5">
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${tier.highlight ? "text-[#C9922A]" : "text-[#8B9BB4]"}`}>
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={`text-3xl font-bold ${tier.highlight ? "text-white" : "text-[#0B1120]"}`}
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#8B9BB4]">/ {tier.period}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${tier.highlight ? "text-[#8B9BB4]" : "text-[#6B7A8D]"}`}>
                    {tier.desc}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C9922A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className={`text-xs leading-relaxed ${tier.highlight ? "text-[#B8C4D6]" : "text-[#6B7A8D]"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`w-full text-sm font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 ${
                    tier.highlight
                      ? "bg-gradient-to-r from-[#C9922A] to-[#E8B04A] text-[#0B1120] hover:shadow-lg hover:shadow-amber-900/20 hover:-translate-y-0.5"
                      : "border border-[#C9922A]/40 text-[#C9922A] hover:bg-[#C9922A]/5"
                  }`}
                >
                  {tier.cta}
                  {tier.highlight && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* For lawyers */}
          <div className="mt-10 p-6 bg-[#0F1D35] rounded-2xl border border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C9922A]/15 border border-[#C9922A]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚖️</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Are you a Nigerian lawyer?</p>
                <p className="text-xs text-[#8B9BB4]">Join UnderstandLaw, get verified, build your client base.</p>
              </div>
            </div>
            <Link href="/lawyers/join"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full border-[1.5px] border-white/25 text-white text-sm font-semibold hover:bg-white/8 hover:border-white/45 transition-all whitespace-nowrap">
              Apply as a Lawyer →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section
        className="relative overflow-hidden py-20 xl:py-28"
        style={{ background: "linear-gradient(135deg, #0B1120 0%, #162543 60%, #0B1120 100%)" }}
      >
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9922A]/8 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#162543] blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(201,146,42,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 xl:px-8 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#C9922A]/15 border border-[#C9922A]/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-[#E8B04A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
            </svg>
          </div>

          <h2
            className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Rights Don't Change.{" "}
            <em className="not-italic text-[#E8B04A]">Your Awareness Should.</em>
          </h2>
          <p className="text-base text-[#B8C4D6] mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerians who are learning the law, protecting their rights,
            and making informed decisions every day. It starts with one topic.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A] text-[#0B1120] text-[15px] font-bold hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/30 transition-all">
              Start Learning — It's Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
            <Link href="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-[1.5px] border-white/25 text-white text-[15px] font-semibold hover:bg-white/8 hover:border-white/45 transition-all">
              Talk to a Lawyer Today
            </Link>
          </div>

          <p className="mt-5 text-xs text-[#8B9BB4]">
            No credit card required · Free forever · Nigerian law only
          </p>
        </div>
      </section>
    </>
  );
}
