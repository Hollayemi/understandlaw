import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { 
  Users, 
  Briefcase, 
  MessageCircle, 
  BarChart3, 
  Shield, 
  Star,
  Clock,
  FileText,
  CheckCircle,
  ArrowRight,
  Building,
  Award,
  DollarSign
} from "lucide-react";

const FEATURES = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Connect with Informed Clients",
    desc: "Your clients come to you already educated on the law. They understand the basics, so you can focus on delivering expert advice.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Manage Cases & Briefs",
    desc: "Organize consultations, track case progress, and manage client communications all from one dashboard.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Built-in Chat System",
    desc: "Communicate securely with clients before, during, and after consultations. All conversations are logged and private.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Performance Analytics",
    desc: "Track your profile views, consultation requests, response rates, and client satisfaction scores.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "SCN Verification",
    desc: "Get verified against the Supreme Court of Nigeria roll. Earn trust badges that set you apart.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Build Your Reputation",
    desc: "Earn ratings and reviews from clients. Build a digital reputation that brings in more business.",
  },
];

const BADGES = [
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Verified Lawyer",
    desc: "SCN membership verified and credentials approved.",
    color: "#10B981",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Top Rated",
    desc: "Consistently high ratings and client satisfaction.",
    color: "#F59E0B",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Responsive",
    desc: "Quick response times to consultation requests.",
    color: "#3B82F6",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Subject Matter Expert",
    desc: "Demonstrated expertise in specific practice areas.",
    color: "#8B5CF6",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Profile listing",
      "Basic verification badge",
      "Consultation requests",
      "Client messaging",
      "Case management",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₦15,000/mo",
    features: [
      "All Basic features",
      "Priority listing",
      "Advanced analytics",
      "Instructor access",
      "Video lesson uploads",
      "Earn from course content",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Team member accounts",
      "Practice group listing",
      "Custom branding options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LawyersPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-[#121824] pt-16 pb-16 lg:pt-20 lg:pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--maroon-400)" }}
              >
                For Lawyers
              </p>
              <h1
                className="text-[clamp(34px,6vw,56px)] leading-[1.05] tracking-tight uppercase text-white font-black"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                Build Your <span className="text-maroon-400">Practice</span>
                <br />
                <span className="text-white/70">the Modern Way</span>
              </h1>
              <p className="text-[15px] leading-relaxed text-white/60 mt-4 max-w-lg">
                LawTicha connects you with Nigerians who are educated, informed, and ready 
                to take action. Turn educated citizens into paying clients.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/lawyers/join"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-maroon-500 text-white text-sm font-bold hover:bg-maroon-600 transition-all hover:-translate-y-0.5"
                >
                  Apply as a Lawyer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                >
                  See Features
                </Link>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                    200+
                  </p>
                  <p className="text-xs text-white/50">Lawyers on platform</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                    100K+
                  </p>
                  <p className="text-xs text-white/50">Users educated</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                    48hrs
                  </p>
                  <p className="text-xs text-white/50">Verification time</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                    4.9★
                  </p>
                  <p className="text-xs text-white/50">Average rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--maroon-600)" }}
            >
              Features
            </p>
            <h2
              className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Everything You Need to <span className="text-maroon-600">Grow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="bg-[#F3F3F3] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl font-bold text-gray-900">Earn Trust Badges</h2>
            <p className="text-sm text-gray-500 mt-1">
              Build credibility and stand out to potential clients
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
              <div
                key={badge.title}
                className="bg-white rounded-2xl p-5 border border-gray-100 text-center"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${badge.color}15`, color: badge.color }}
                >
                  {badge.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-white py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--maroon-600)" }}
            >
              Pricing
            </p>
            <h2
              className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Choose Your <span className="text-maroon-600">Plan</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.popular
                    ? "border-maroon-500 shadow-lg shadow-maroon-500/10 bg-white"
                    : "border-gray-100 bg-white"
                } hover:-translate-y-1 transition-all duration-300`}
              >
                {plan.popular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-maroon-600 px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mt-2">{plan.name}</h3>
                <p className="text-3xl font-black text-gray-900 mt-1" style={{ fontFamily: "var(--font-archivo-black)" }}>
                  {plan.price}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-maroon-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/lawyers/join"}
                  className={`inline-flex w-full items-center justify-center mt-6 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                    plan.popular
                      ? "bg-maroon-500 text-white hover:bg-maroon-600"
                      : "border border-gray-300 text-gray-700 hover:border-maroon-500 hover:text-maroon-500"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#121824] py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Grow Your Practice?</h2>
          <p className="text-white/60 text-sm mb-6">
            Join 200+ lawyers already connecting with informed clients on LawTicha.
          </p>
          <Link
            href="/lawyers/join"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon-500 text-white text-sm font-bold hover:bg-maroon-600 transition-all hover:-translate-y-0.5"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </HomeWrapper>
  );
}