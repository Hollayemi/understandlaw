import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { 
  AlertCircle, 
  Home, 
  Briefcase, 
  Shield, 
  FileText, 
  Users,
  ChevronRight,
  Clock
} from "lucide-react";

const SCENARIOS = [
  {
    icon: <Home className="w-6 h-6" />,
    title: "Your Landlord Wants to Evict You",
    desc: "Step-by-step guide on what to do when you receive an eviction notice, including your legal rights and options.",
    slug: "eviction",
    category: "Tenancy",
    readTime: "5 min",
    color: "#9B2E3D",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "You've Been Wrongfully Terminated",
    desc: "What to do if you've been fired without proper notice or cause. Understand your severance rights.",
    slug: "wrongful-termination",
    category: "Employment",
    readTime: "4 min",
    color: "#3B82F6",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Police Stop and Search",
    desc: "What police can legally do during a stop and search, and what your rights are.",
    slug: "police-search",
    category: "Rights",
    readTime: "3 min",
    color: "#10B981",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Signing a Contract",
    desc: "What to look for before signing any contract, and how to spot unfair terms.",
    slug: "signing-contract",
    category: "Contracts",
    readTime: "6 min",
    color: "#F59E0B",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Going Through a Divorce",
    desc: "Understanding the divorce process, child custody, and property division in Nigeria.",
    slug: "divorce",
    category: "Family",
    readTime: "7 min",
    color: "#8B5CF6",
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: "You've Been Scammed",
    desc: "What to do if you've been defrauded, how to report it, and your legal options for recovery.",
    slug: "scammed",
    category: "Consumer",
    readTime: "4 min",
    color: "#EF4444",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Starting a Business",
    desc: "Legal requirements for starting a business in Nigeria, from registration to compliance.",
    slug: "start-business",
    category: "Business",
    readTime: "8 min",
    color: "#EC4899",
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: "Disputes with Your Neighbour",
    desc: "How to handle neighbour disputes legally, from noise complaints to boundary issues.",
    slug: "neighbour-dispute",
    category: "Property",
    readTime: "4 min",
    color: "#06B6D4",
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: "Arrested by the Police",
    desc: "What to do if you're arrested, your rights during detention, and how to get legal help.",
    slug: "arrested",
    category: "Rights",
    readTime: "5 min",
    color: "#F59E0B",
  },
];

export default function ScenarioGuidesPage() {
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
              Scenario <span className="text-maroon-600">Guides</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-500 mt-4 max-w-xl mx-auto">
              Real-life situations explained. Know what to do, what to say, and who to call.
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios grid */}
      <section className="bg-white py-12 xl:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
            {SCENARIOS.map((scenario) => (
              <Link
                key={scenario.slug}
                href={`/learn/scenarios/${scenario.slug}`}
                className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${scenario.color}15`, color: scenario.color }}
                >
                  {scenario.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-maroon-600 bg-pink-50 px-2 py-0.5 rounded">
                    {scenario.category}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {scenario.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-maroon-600 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{scenario.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-maroon-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read guide <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Need a specific scenario?</h2>
          <p className="text-gray-500 text-sm mb-4">
            Tell us what you're facing and we'll create a guide for it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-maroon-600 hover:text-maroon-700"
          >
            Request a scenario →
          </Link>
        </div>
      </section>
    </HomeWrapper>
  );
}