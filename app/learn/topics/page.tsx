import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { 
  Home, 
  Briefcase, 
  Shield, 
  FileText, 
  Users, 
  Building, 
  Scale, 
  BookOpen,
  ChevronRight,
  Search
} from "lucide-react";

const TOPICS = [
  {
    icon: <Home className="w-6 h-6" />,
    title: "Tenancy & Housing",
    desc: "Know your rights as a tenant, including eviction procedures, rent increases, and landlord obligations under Nigerian law.",
    slug: "tenancy",
    color: "#9B2E3D",
    count: 12,
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Employment & Labour",
    desc: "Understand your employment rights, wrongful termination, severance pay, and workplace discrimination laws.",
    slug: "employment",
    color: "#3B82F6",
    count: 8,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Police & Human Rights",
    desc: "Learn about your rights during police encounters, arrest procedures, and fundamental human rights under the Nigerian Constitution.",
    slug: "police-rights",
    color: "#10B981",
    count: 10,
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Contracts & Agreements",
    desc: "Everything you need to know about contract formation, breach, and enforcement under Nigerian contract law.",
    slug: "contracts",
    color: "#F59E0B",
    count: 6,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Family & Matrimonial",
    desc: "Navigate marriage, divorce, child custody, and inheritance laws with our plain-English family law guides.",
    slug: "family",
    color: "#8B5CF6",
    count: 9,
  },
  {
    icon: <Building className="w-6 h-6" />,
    title: "Business & Corporate",
    desc: "From business registration to corporate governance, understand the legal framework for running a business in Nigeria.",
    slug: "business",
    color: "#EC4899",
    count: 7,
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Criminal Law",
    desc: "Understand criminal offences, court procedures, and your rights if you're charged with a crime in Nigeria.",
    slug: "criminal",
    color: "#EF4444",
    count: 5,
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Consumer Protection",
    desc: "Your rights as a consumer, product liability, and how to seek redress for defective goods or unfair practices.",
    slug: "consumer",
    color: "#06B6D4",
    count: 4,
  },
];

export default function LegalTopicsPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-10 lg:pt-20 lg:pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--maroon-600)" }}
            >
              Learn
            </p>
            <h1
              className="text-[clamp(34px,6vw,56px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Legal Topics <span className="text-maroon-600">A-Z</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-500 mt-4 max-w-xl mx-auto">
              Browse our library of plain-English legal guides organised by the situations 
              you actually face in everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* Topics grid */}
      <section className="bg-white py-12 xl:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Search */}
          <div className="max-w-lg mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-maroon-500/20 focus:border-maroon-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/learn/topics/${topic.slug}`}
                className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${topic.color}15`, color: topic.color }}
                >
                  {topic.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-maroon-600 transition-colors">
                    {topic.title}
                  </h3>
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {topic.count} guides
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-maroon-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore topic <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Don't see your topic?</h2>
          <p className="text-gray-500 text-sm mb-4">
            We're constantly adding new guides. Let us know what you need.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-maroon-600 hover:text-maroon-700"
          >
            Request a topic →
          </Link>
        </div>
      </section>
    </HomeWrapper>
  );
}