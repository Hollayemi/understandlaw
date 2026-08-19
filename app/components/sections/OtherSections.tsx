import React from "react";
import Link from "next/link";
import {
  Shield,
  Home,
  Briefcase,
  FileText,
  Building2,
  Users,
  MapPin,
  Star,
  Check,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

/* ---------------------------------- TOPICS ---------------------------------- */

const TOPICS = [
  {
    icon: <Shield className="w-5 h-5" strokeWidth={2} />,
    title: "Police & Law Enforcement",
    count: 8,
    topics: ["Rights during arrest", "Unlawful detention", "Lawful search & seizure", "SARS interactions"],
  },
  {
    icon: <Home className="w-5 h-5" strokeWidth={2} />,
    title: "Landlord & Tenancy",
    count: 6,
    topics: ["Eviction rights", "Rental agreements", "Illegal lockouts", "Deposit recovery"],
  },
  {
    icon: <Briefcase className="w-5 h-5" strokeWidth={2} />,
    title: "Employment & Labour",
    count: 7,
    topics: ["Wrongful termination", "Severance pay", "Workplace harassment", "NSITF rights"],
  },
  {
    icon: <FileText className="w-5 h-5" strokeWidth={2} />,
    title: "Contracts & Agreements",
    count: 6,
    topics: ["Valid contracts", "Consumer rights", "Breach of contract", "Digital agreements"],
  },
  {
    icon: <Building2 className="w-5 h-5" strokeWidth={2} />,
    title: "Business & Commerce",
    count: 6,
    topics: ["Business registration", "Tax obligations", "CAC requirements", "IP protection"],
  },
  {
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
    title: "Family & Personal Rights",
    count: 6,
    topics: ["Domestic violence", "Protection orders", "Inheritance", "Child custody"],
  },
];

export function TopicsSection() {
  return (
    <section className="relative bg-[#121824] py-16 xl:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--rose-400)" }}
            >
              Legal Topics
            </p>
            <h2
              className="text-[clamp(28px,4vw,44px)] leading-[1.05] text-white uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Know what the law
              <br />
              says <span style={{ color: "var(--rose-400)" }}>about you</span>
            </h2>
          </div>
          <Link
            href="/learn"
            className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors shrink-0"
          >
            <span>View all topics</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <Link
              key={t.title}
              href={`/learn/${t.title.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
              className="group block rounded-xl p-5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-[var(--maroon-600)]/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
                  <span style={{ color: "var(--maroon-700)" }}>{t.icon}</span>
                </div>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-white"
                  style={{ color: "var(--maroon-700)" }}
                >
                  {t.count}
                </span>
              </div>

              <h3 className="font-semibold text-white text-[15px] mb-3">{t.title}</h3>

              <ul className="space-y-1.5">
                {t.topics.slice(0, 3).map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--rose-400)" }} />
                    {topic}
                  </li>
                ))}
                {t.topics.length > 3 && (
                  <li className="text-xs pl-3.5" style={{ color: "var(--rose-400)" }}>
                    +{t.topics.length - 3} more
                  </li>
                )}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- MARKETPLACE -------------------------------- */

const LAWYERS = [
  { name: "Adaeze Okonkwo", role: "Employment & Labour Law", city: "Lagos", rating: 4.9, reviews: 38, response: "< 1hr", initials: "AO", badges: ["Verified", "Top Rated"] },
  { name: "Emeka Nwosu", role: "Property & Tenancy Law", city: "Abuja", rating: 4.8, reviews: 55, response: "< 2hrs", initials: "EN", badges: ["Verified", "Top Rated"] },
  { name: "Fatimah Bello", role: "Family & Domestic Law", city: "Kano", rating: 4.7, reviews: 29, response: "< 3hrs", initials: "FB", badges: ["Verified", "Responsive"] },
];

const VERIFICATION_STEPS = ["Registration", "Credential Check", "Platform Training", "Assessment", "Badge Assigned"];

export function MarketplaceSection() {
  return (
    <section className="bg-white py-20 xl:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--maroon-600)" }}>
              Lawyer Marketplace
            </p>
            <h2
              className="text-[clamp(28px,4vw,44px)] leading-[1.05] text-gray-900 uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Verified Lawyers.
              <br />
              Real Expertise.
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors shrink-0"
          >
            <span>Browse All Lawyers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Verification steps */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Verification Process</p>
          <div className="flex flex-wrap gap-3">
            {VERIFICATION_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(107,18,32,0.1)" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: "var(--maroon-700)" }}>
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lawyer cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {LAWYERS.map((l) => (
            <div
              key={l.name}
              className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[var(--maroon-600)]/25 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "var(--maroon-700)" }}
                    >
                      {l.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">{l.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{l.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{l.city}, Nigeria</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {l.badges.map((b) => {
                    const configs = {
                      Verified: { icon: Check, bg: "bg-emerald-50", text: "text-emerald-600" },
                      "Top Rated": { icon: Star, bg: "bg-amber-50", text: "text-amber-600" },
                      Responsive: { icon: Zap, bg: "bg-emerald-50", text: "text-emerald-600" },
                    };
                    const config = configs[b as keyof typeof configs] || configs["Verified"];
                    const Icon = config.icon;
                    return (
                      <span
                        key={b}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}
                      >
                        <Icon className="w-3 h-3" />
                        {b}
                      </span>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-bold" style={{ color: "var(--maroon-700)" }}>
                      <Star className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                      {l.rating}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{l.reviews}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{l.response}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Response</div>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="px-6 pb-6 pt-1">
                <Link
                  href={`/marketplace/${l.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group/btn w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[1.5px] font-semibold text-sm transition-colors hover:bg-[var(--maroon-700)] hover:text-white hover:border-[var(--maroon-700)]"
                  style={{ borderColor: "#EAC7CE", color: "var(--maroon-600)" }}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- FINAL CTA ----------------------------------- */

export function CTASection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--maroon-900)" }}>
      <div className="absolute inset-y-0 left-0 w-40 dot-grid" />
      <div className="absolute inset-y-0 right-0 w-40 dot-grid" />
      <div className="relative max-w-3xl mx-auto px-6 py-20 xl:py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Get Started Today</p>
        <h2
          className="text-[clamp(32px,5vw,52px)] leading-[1.05] text-white uppercase font-black mb-5"
          style={{ fontFamily: "var(--font-archivo-black)" }}
        >
          Your rights don&apos;t change.
          <br />
          <span style={{ color: "var(--rose-400)" }}>Your awareness should.</span>
        </h2>
        <p className="text-sm text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
          Join thousands of Nigerians learning the law, protecting their rights, and making informed decisions every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
            style={{ color: "var(--maroon-700)" }}
          >
            Start Learning, It&apos;s Free
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white text-[15px] font-semibold hover:bg-white/5 transition-colors"
          >
            Talk to a Lawyer
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/50">
          No credit card required &bull; Free forever &bull; Nigerian law only
        </p>
      </div>
    </section>
  );
}