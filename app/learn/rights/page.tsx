import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { 
  Shield, 
  Scale, 
  User, 
  Home, 
  Briefcase, 
  BookOpen,
  ChevronRight,
  CheckCircle
} from "lucide-react";

const RIGHTS_CATEGORIES = [
  {
    icon: <User className="w-6 h-6" />,
    title: "KNOW YOUR RIGHTS",
    desc: "Let's talk about something very important but often confusing: your rights when dealing with the police. ",
    slug: "know-your-rights",
    color: "#9B2E3D",
  },
];

const FEATURED_RIGHTS = [
  {
    title: "Right to a Fair Hearing",
    desc: "Everyone is entitled to a fair and public hearing within a reasonable time by an independent and impartial court.",
    source: "Section 36, Nigerian Constitution",
  },
  {
    title: "Right to Dignity",
    desc: "No one shall be subjected to torture, inhuman or degrading treatment.",
    source: "Section 34, Nigerian Constitution",
  },
  {
    title: "Right to Freedom of Expression",
    desc: "Every person shall be entitled to freedom of expression, including freedom to hold opinions and receive ideas.",
    source: "Section 39, Nigerian Constitution",
  },
  {
    title: "Right to Private Life",
    desc: "The privacy of citizens, their homes, correspondence, and communications is guaranteed.",
    source: "Section 37, Nigerian Constitution",
  },
];

export default function KnowYourRightsPage() {
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
              Know Your <span className="text-maroon-600">Rights</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-500 mt-4 max-w-xl mx-auto">
              Understand your fundamental rights under Nigerian law and how to protect them.
            </p>
          </div>
        </div>
      </section>

      {/* Featured rights */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Fundamental Rights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURED_RIGHTS.map((right) => (
              <div key={right.title} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-maroon-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{right.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{right.desc}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{right.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rights categories */}
      <section className="bg-white py-12 xl:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Explore Your Rights by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RIGHTS_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/dashboard/learn/${cat.slug}`}
                className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${cat.color}15`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-maroon-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-maroon-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}