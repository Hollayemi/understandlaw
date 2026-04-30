import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import {
  Shield,
  Home,
  Briefcase,
  FileText,
  Building2,
  Users,
  Video,
  BookOpen,
  Theater,
  Library
} from "lucide-react";

const CATEGORIES = [
  {
    icon: <Shield />,
    color: "#3B82F6",
    bg: "#EFF6FF",
    title: "Police & Law Enforcement",
    slug: "police-law-enforcement",
    count: 8,
    featured: [
      "Rights during arrest",
      "Unlawful detention",
      "Lawful search & seizure",
      "SARS interactions",
      "Right to silence",
      "Police bail",
      "Resisting unlawful arrest",
    ],
    desc: "Know exactly what police officers can and cannot do — and how to protect yourself in any encounter.",
  },
  {
    icon: <Home />,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Landlord & Tenancy",
    slug: "landlord-tenancy",
    count: 6,
    featured: [
      "Eviction rights & procedures",
      "Rental agreement clauses",
      "Illegal lockouts",
      "Security deposit recovery",
      "Subletting rules",
      "Quiet enjoyment",
    ],
    desc: "Understand your rights as a tenant in Nigeria — from signing a lease to defending against illegal eviction.",
  },
  {
    icon: <Briefcase />,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    title: "Employment & Labour",
    slug: "employment-labour",
    count: 7,
    featured: [
      "Wrongful termination",
      "Severance & redundancy pay",
      "Workplace harassment",
      "NSITF & pension rights",
      "Employment contracts",
      "Maternity leave",
      "Minimum wage",
    ],
    desc: "From your first employment contract to a dispute with your employer — know your labour rights.",
  },
  {
    icon: <FileText />,
    color: "#F59E0B",
    bg: "#FFFBEB",
    title: "Contracts & Agreements",
    slug: "contracts-agreements",
    count: 5,
    featured: [
      "What makes a contract valid",
      "Consumer protection rights",
      "Breach of contract",
      "Digital & online agreements",
      "Oral contracts in Nigeria",
    ],
    desc: "Understand what you're signing before you sign it — and what to do when agreements are broken.",
  },
  {
    icon: <Building2 />,
    color: "#06B6D4",
    bg: "#ECFEFF",
    title: "Business & Commerce",
    slug: "business-commerce",
    count: 6,
    featured: [
      "Business registration (CAC)",
      "Tax obligations for SMEs",
      "Intellectual property basics",
      "Consumer protection act",
      "Partnership agreements",
      "E-commerce rules",
    ],
    desc: "Navigate Nigerian business regulations, taxes, and commercial law without needing a full-time lawyer.",
  },
  {
    icon: <Users />,
    color: "#EF4444",
    bg: "#FEF2F2",
    title: "Family & Personal Rights",
    slug: "family-personal-rights",
    count: 6,
    featured: [
      "Domestic violence & protection",
      "Protection orders",
      "Inheritance & succession",
      "Child custody rights",
      "Divorce proceedings",
      "Gender-based violence law",
    ],
    desc: "Your personal and family rights under Nigerian law — including protection from abuse and custody guidance.",
  },
];

const FORMATS = [
  {
    icon: <Video />,
    label: "Short Videos",
    desc: "1–3 min plain-English explainers",
  },
  {
    icon: <BookOpen />,
    label: "Text Summaries",
    desc: "Read offline on slow connections",
  },
  {
    icon: <Theater />, // optional fallback below
    label: "Scenario Walkthroughs",
    desc: "See the law in real-life context",
  },
  {
    icon: <Library />,
    label: "Library Links",
    desc: "Jump to the actual statutory text",
  },
];

export default function LearnPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-14 pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">Legal Learning Module</p>
              <h1
                className="text-[clamp(48px,7vw,76px)] leading-none tracking-[0.01em] text-gray-900 uppercase"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                KNOW WHAT<br />THE LAW SAYS<br />
                <span style={{ color: "#E8317A" }}>ABOUT YOU</span>
              </h1>
            </div>
            <div>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Short scenario-driven videos and plain-English articles covering every area of Nigerian law
                that affects your daily life. No jargon. No legal training required.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FORMATS.map((f) => (
                  <div key={f.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{f.label}</p>
                      <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-[#F3F3F3] py-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search topics — e.g. 'eviction notice', 'wrongful termination'..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
              />
            </div>
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 h-12 rounded-xl bg-[#E8317A] text-white text-sm font-semibold hover:bg-[#d01f68] transition-colors whitespace-nowrap flex-shrink-0"
            >
              Save Progress
            </Link>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="bg-[#F3F3F3] py-16 xl:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2
            className="text-2xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Browse by Category
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/learn/${cat.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Icon + count */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: cat.bg }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {cat.count} articles
                  </span>
                </div>

                <h3
                  className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#E8317A] transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{cat.desc}</p>

                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {cat.featured.slice(0, 4).map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-xs text-gray-500">{topic}</span>
                    </li>
                  ))}
                  {cat.featured.length > 4 && (
                    <li className="text-xs font-medium" style={{ color: cat.color }}>
                      +{cat.featured.length - 4} more
                    </li>
                  )}
                </ul>

                <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color: cat.color }}>
                  Explore Category
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">Can't find it?</p>
          <h2
            className="text-[clamp(28px,4vw,40px)] leading-none text-gray-900 uppercase mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            WE ADD NEW TOPICS EVERY WEEK
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our legal team reviews and publishes new content weekly. Request a topic and we'll prioritise it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/learn/request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200"
            >
              Request a Topic
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-[1.5px] border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Browse Legal Library →
            </Link>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}