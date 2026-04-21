import Link from "next/link";
import { SectionLabel } from "../ui";

const TOPIC_CATEGORIES = [
  {
    icon: "🚔",
    color: "#1E3257",
    accent: "#3B5998",
    title: "Police & Law Enforcement",
    topics: ["Rights during arrest", "Lawful search & seizure", "Unlawful detention", "SARS interactions"],
    count: 8,
  },
  {
    icon: "🏠",
    color: "#1A3B2E",
    accent: "#2D6A4F",
    title: "Landlord & Tenancy",
    topics: ["Eviction rights", "Rental agreements", "Illegal lockouts", "Deposit recovery"],
    count: 6,
  },
  {
    icon: "💼",
    color: "#2D1A3B",
    accent: "#6A2D8F",
    title: "Employment & Labour",
    topics: ["Wrongful termination", "Severance pay", "Workplace harassment", "NSITF rights"],
    count: 7,
  },
  {
    icon: "📝",
    color: "#2D2A1A",
    accent: "#8F7A2D",
    title: "Contracts & Agreements",
    topics: ["Valid contracts", "Consumer rights", "Breach of contract", "Digital agreements"],
    count: 5,
  },
  {
    icon: "🏢",
    color: "#1A2D3B",
    accent: "#2D6A8F",
    title: "Business & Commerce",
    topics: ["Business registration", "Tax obligations", "CAC requirements", "IP protection"],
    count: 6,
  },
  {
    icon: "👨‍👩‍👧",
    color: "#3B1A1A",
    accent: "#8F2D2D",
    title: "Family & Personal Rights",
    topics: ["Domestic violence", "Protection orders", "Inheritance", "Child custody"],
    count: 6,
  },
];

export default function TopicsSection() {
  return (
    <section className="bg-[#0B1120] py-24 xl:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9922A]/4 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#162543]/80 blur-[60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <SectionLabel light>Legal Topics</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Know What the Law{" "}
              <em className="not-italic text-[#E8B04A]">Says About You</em>
            </h2>
          </div>
          <Link
            href="/learn"
            className="btn-outline inline-flex items-center gap-2 self-start md:self-auto flex-shrink-0"
          >
            View All Topics
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Topic grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOPIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={`/learn/${cat.title.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
              className="group relative rounded-2xl p-6 border border-white/6 overflow-hidden card-hover cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #0B1120 100%)` }}
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                style={{ background: cat.accent }}
              />

              <div className="relative">
                {/* Icon + count */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="badge-chip bg-white/6 border border-white/8 text-[#8B9BB4] text-[11px]">
                    {cat.count} articles
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold text-white mb-3 group-hover:text-[#E8B04A] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.title}
                </h3>

                {/* Topics list */}
                <ul className="flex flex-col gap-1.5">
                  {cat.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C9922A] flex-shrink-0" />
                      <span className="text-xs text-[#8B9BB4]">{topic}</span>
                    </li>
                  ))}
                </ul>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1.5 text-[#C9922A] text-xs font-medium">
                  Explore
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#8B9BB4] mb-4">
            Can't find what you're looking for? Our legal team adds new topics every week.
          </p>
          <Link href="/learn/request" className="text-sm font-medium text-[#E8B04A] hover:underline inline-flex items-center gap-1.5">
            Request a Topic
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
