import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";

const TIERS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    badge: null,
    highlight: false,
    desc: "Everything you need to understand Nigerian law,  at no cost. No card. No catch.",
    features: [
      { text: "Full Legal Learning Module", included: true },
      { text: "Browse all 40+ Legal Acts", included: true },
      { text: "Plain-English summaries", included: true },
      { text: "Full-text legislation search", included: true },
      { text: "Topic recommendations", included: true },
      { text: "Community forum access", included: true },
      { text: "Bookmarking & reading history", included: false },
      { text: "Lawyer consultations", included: false },
      { text: "Document templates", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth?tab=register",
  },
  {
    name: "Marketplace",
    price: "Pay-per-use",
    period: "per consultation",
    badge: "Most Popular",
    highlight: true,
    desc: "When you need more than education,  book a verified Nigerian lawyer at transparent, upfront pricing.",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Browse all lawyer profiles & badges", included: true },
      { text: "Secure in-platform messaging", included: true },
      { text: "Scheduled audio & video calls", included: true },
      { text: "Transparent fee schedule", included: true },
      { text: "Post-consultation reviews", included: true },
      { text: "Consultation history log", included: true },
      { text: "Priority lawyer matching", included: false },
      { text: "Document templates", included: false },
    ],
    cta: "Find a Lawyer",
    href: "/marketplace",
  },
  {
    name: "Premium",
    price: "Coming Soon",
    period: "Phase 3",
    badge: "Coming Phase 3",
    highlight: false,
    desc: "For power users,  advanced guides, downloadable templates, AI legal query tool, and completion certificates.",
    features: [
      { text: "Everything in Marketplace", included: true },
      { text: "Deep-dive advanced legal guides", included: true },
      { text: "Downloadable document templates", included: true },
      { text: "AI-assisted legal query tool", included: true },
      { text: "Priority lawyer matching", included: true },
      { text: "Gamified learning + certificates", included: true },
      { text: "Voice-based content (low-literacy)", included: true },
      { text: "Offline content access", included: true },
      { text: "Early access to new features", included: true },
    ],
    cta: "Join Waitlist",
    href: "/waitlist",
  },
];

const LAWYER_TIERS = [
  {
    name: "Basic (Phase 1)",
    price: "Free",
    desc: "Get verified, listed, and start receiving consultation requests.",
    features: ["Verified Lawyer badge", "Public lawyer profile", "Consultation booking", "In-platform messaging", "Rating & review system"],
    cta: "Apply as a Lawyer",
    href: "/lawyers/join",
    active: true,
  },
  {
    name: "Pro (Phase 2)",
    price: "Coming",
    desc: "Priority placement, analytics, and enhanced profile features.",
    features: ["Everything in Basic", "Priority listing placement", "Profile analytics dashboard", "Featured listing placement", "Custom availability settings"],
    cta: "Join Waitlist",
    href: "/waitlist",
    active: false,
  },
];

const FAQS = [
  {
    q: "Is the Free plan really unlimited?",
    a: "Yes. The Legal Learning Module and Legal Library are completely free with no content gates, no daily limits, and no expiry. We believe legal knowledge should be accessible to every Nigerian.",
  },
  {
    q: "How does pay-per-use work for consultations?",
    a: "When you book a consultation with a lawyer, you pay the lawyer's stated fee. LawTicha deducts a platform commission (10–15%) before passing the remainder to the lawyer. All fees are displayed upfront before you confirm a booking.",
  },
  {
    q: "When is the Premium plan launching?",
    a: "Premium (Phase 3) is planned for months 10–18 of the platform roadmap. Join the waitlist to be notified first and receive early-adopter pricing.",
  },
  {
    q: "How are lawyer subscription prices set?",
    a: "Lawyer subscription pricing will be announced at Phase 2 launch. Early-adopter lawyers who join during Phase 1 will receive discounted rates as a reward for building the initial marketplace supply.",
  },
];

export default function PricingPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-14 pb-14 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">Pricing</p>
          <h1
            className="text-[clamp(48px,7vw,80px)] leading-none tracking-[0.01em] text-gray-900 uppercase mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            START FREE.<br />
            <span style={{ color: "#E8317A" }}>SCALE WHEN READY.</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Legal knowledge is free,  forever. Only pay when you need a professional lawyer.
            No subscriptions. No hidden charges. Nigerian law, simplified.
          </p>
        </div>
      </section>

      {/* Phase indicator */}
      <section className="bg-[#F3F3F3] py-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Roadmap:</span>
            {[
              { label: "Phase 1 – MVP", sub: "Months 1–4", active: true, done: false },
              { label: "Phase 2 – Marketplace", sub: "Months 5–9", active: false, done: false },
              { label: "Phase 3 – Growth", sub: "Months 10–18", active: false, done: false },
            ].map((phase) => (
              <div
                key={phase.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  phase.active
                    ? "bg-[#E8317A] text-white"
                    : "bg-white border border-gray-200 text-gray-500"
                }`}
              >
                {phase.active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                <span>{phase.label}</span>
                <span className={phase.active ? "text-white/70" : "text-gray-400"}>·</span>
                <span className={phase.active ? "text-white/80 font-normal" : "text-gray-400 font-normal"}>{phase.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User tiers */}
      <section className="bg-[#F3F3F3] py-16 xl:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">For Citizens & Users</h2>

          <div className="grid md:grid-cols-3 gap-5 xl:gap-7">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                  tier.highlight
                    ? "bg-[#111827] shadow-2xl shadow-gray-900/20 scale-[1.02]"
                    : "bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {tier.badge && (
                  <div
                    className={`absolute -top-px left-0 right-0 h-1 ${
                      tier.highlight ? "bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" : "bg-gradient-to-r from-gray-200 to-gray-300"
                    }`}
                  />
                )}
                {tier.badge && (
                  <div className={`absolute top-3 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    tier.highlight ? "bg-[#E8317A] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${tier.highlight ? "text-[#E8317A]" : "text-gray-400"}`}>
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={`text-3xl font-bold leading-none ${tier.highlight ? "text-white" : "text-gray-900"}`}
                      style={{ fontFamily: "var(--font-bebas)", fontSize: 38 }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs text-gray-400">/ {tier.period}</span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-6 ${tier.highlight ? "text-gray-400" : "text-gray-500"}`}>
                    {tier.desc}
                  </p>

                  <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E8317A]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={`text-xs leading-relaxed ${
                          !f.included
                            ? "text-gray-300"
                            : tier.highlight
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      tier.highlight
                        ? "bg-[#E8317A] text-white hover:bg-[#d01f68] hover:shadow-lg hover:shadow-pink-900/30"
                        : "border-[1.5px] border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {tier.cta}
                    {tier.highlight && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer tiers */}
      <section className="bg-white py-16 xl:py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">For Nigerian Lawyers</p>
              <h2
                className="text-[clamp(28px,4vw,44px)] leading-none text-gray-900 uppercase"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                GROW YOUR<br />PRACTICE
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl">
            {LAWYER_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border ${
                  tier.active
                    ? "bg-white border-gray-200 shadow-md"
                    : "bg-gray-50 border-gray-100 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{tier.name}</p>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      tier.active ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tier.active ? "● Live Now" : "Phase 2"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  {tier.price}
                </p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{tier.desc}</p>
                <ul className="flex flex-col gap-2 mb-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#E8317A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                    tier.active
                      ? "bg-[#E8317A] text-white hover:bg-[#d01f68]"
                      : "border border-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F3F3F3] py-16 xl:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">FAQ</p>
            <h2
              className="text-[clamp(28px,4vw,44px)] leading-none text-gray-900 uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              PRICING QUESTIONS
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-sm font-semibold text-gray-900 hover:text-[#E8317A] transition-colors">
                  {faq.q}
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}