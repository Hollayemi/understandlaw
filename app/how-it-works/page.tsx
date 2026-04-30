import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import {
  BookOpen,
  Video,
  ClipboardList,
  Scale,
  FileText,
  Search,
  GraduationCap,
  BadgeCheck,
  User
} from "lucide-react";

const CITIZEN_STEPS = [
  {
    num: "01",
    icon: <BookOpen />,
    title: "Pick a Topic",
    desc: "Browse categories like Tenancy, Employment, Police Rights, or Contracts. Everything is organised by situation — not by statute.",
    color: "#E8317A",
  },
  {
    num: "02",
    icon: <Video />,
    title: "Watch & Read",
    desc: "Short 1–3 min videos and plain-English articles walk you through what the law actually says. No jargon. No guesswork.",
    color: "#3B82F6",
  },
  {
    num: "03",
    icon: <ClipboardList />,
    title: "Read the Actual Law",
    desc: "Go deeper in the Legal Library — every Act has a plain-English summary sitting right next to the authoritative statutory text.",
    color: "#10B981",
  },
  {
    num: "04",
    icon: <Scale />,
    title: "Get a Lawyer If Needed",
    desc: "When your situation needs professional advice, book a verified Nigerian lawyer directly on the platform. Transparent pricing. No surprises.",
    color: "#F59E0B",
  },
];

const LAWYER_STEPS = [
  {
    num: "01",
    icon: <FileText />,
    title: "Register & Submit Credentials",
    desc: "Fill out your profile with your NBA number, year of call, and practice areas. Upload supporting documents.",
    color: "#E8317A",
  },
  {
    num: "02",
    icon: <Search />,
    title: "Credential Verification",
    desc: "Our team verifies your Nigerian Bar Association membership and specialisations within 48–72 hours.",
    color: "#3B82F6",
  },
  {
    num: "03",
    icon: <GraduationCap />,
    title: "Platform Orientation",
    desc: "A short online orientation covers platform standards, client communication expectations, and ethical obligations.",
    color: "#10B981",
  },
  {
    num: "04",
    icon: <BadgeCheck />,
    title: "Badges & Go Live",
    desc: "Receive your verified badges, configure your availability and pricing, and start receiving consultation requests.",
    color: "#8B5CF6",
  },
];

const STATS = [
  { value: "48hrs", label: "Lawyer verification turnaround" },
  { value: "30+", label: "Legal topics at MVP launch" },
  { value: "200+", label: "Lawyers targeted in Year 1" },
  { value: "Free", label: "For all citizens, forever" },
];

const FAQS = [
  {
    q: "Is the content on LawTicha actual legal advice?",
    a: "No. All content is educational and informational. It explains what the law says in plain English. For advice specific to your situation, use the Lawyer Marketplace to consult a verified professional.",
  },
  {
    q: "How do I know the lawyers are qualified?",
    a: "Every lawyer on LawTicha goes through a multi-step verification process: NBA membership check, credential review, platform orientation, and a competency assessment. Only approved lawyers receive a Verified Lawyer badge and can accept consultations.",
  },
  {
    q: "Is the platform really free?",
    a: "Yes. The Legal Learning Module and Legal Library are completely free, forever. You only pay when you book a paid consultation with a lawyer. Pricing is displayed upfront — no hidden charges.",
  },
  {
    q: "What laws does LawTicha cover?",
    a: "LawTicha covers Nigerian federal and state legislation relevant to everyday life — tenancy, employment, police encounters, contracts, business registration, family law, and more. Content is updated as laws change.",
  },
  {
    q: "Can I use LawTicha if I'm a lawyer?",
    a: "Yes. Lawyers join through the Lawyer Marketplace path — they create a verified profile, complete onboarding, and start receiving clients. We also offer subscription plans with analytics and priority placement (Phase 2).",
  },
];

export default function HowItWorksPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-14 pb-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-3">How It Works</p>
          <h1
            className="text-[clamp(48px,7vw,80px)] leading-none tracking-[0.01em] text-gray-900 uppercase mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            FROM CONFUSION<br />
            <span style={{ color: "#E8317A" }}>TO CLARITY</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            LawTicha is designed around one idea: everyone deserves to understand the law that governs their life.
            Here's exactly how the platform works, for citizens and for lawyers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#F3F3F3] py-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-[clamp(28px,4vw,40px)] leading-none text-gray-900 mb-1"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Citizens */}
      <section id="citizens" className="bg-white py-20 xl:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full mb-4">
              <span className="text-sm"><User /></span>
              <span className="text-xs font-semibold text-[#E8317A]">For Citizens</span>
            </div>
            <h2
              className="text-[clamp(32px,5vw,52px)] leading-none text-gray-900 uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              UNDERSTAND. LEARN. ACT.
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg">
              Whether you're facing an eviction notice, a wrongful termination, or a police encounter —
              LawTicha gives you the knowledge to respond correctly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CITIZEN_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {i < CITIZEN_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 z-10">
                    <svg className="w-6 h-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${step.color}15` }}
                >
                  {step.icon}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>
                  Step {step.num}
                </p>
                <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200 transition-all"
            >
              Start Learning Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Find a Verified Lawyer
            </Link>
          </div>
        </div>
      </section>

      {/* For Lawyers */}
      <section id="lawyers" className="bg-[#F3F3F3] py-20 xl:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full mb-4">
              <span className="text-sm"><Scale /></span>
              <span className="text-xs font-semibold text-gray-700">For Nigerian Lawyers</span>
            </div>
            <h2
              className="text-[clamp(32px,5vw,52px)] leading-none text-gray-900 uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              BUILD YOUR<br />
              <span style={{ color: "#E8317A" }}>CLIENT BASE</span>
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg">
              LawTicha connects you with Nigerians who are already educated on the law and ready to take action.
              These are informed clients — not cold calls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {LAWYER_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${step.color}15` }}
                >
                  {step.icon}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>
                  Step {step.num}
                </p>
                <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Lawyer value props */}
          <div className="bg-[#111827] rounded-2xl p-7 grid md:grid-cols-3 gap-5">
            {[
              { icon: "📈", title: "Analytics Dashboard", desc: "See your profile views, consultation rate, and response metrics. Phase 2." },
              { icon: "🏅", title: "Badge System", desc: "Earn Verified, Top Rated, and Responsive badges based on your performance." },
              { icon: "💰", title: "Subscription Plans", desc: "Priority listing placement and advanced features. Subscription from Phase 2." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/lawyers/join"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E8317A] text-white text-sm font-bold hover:bg-[#d01f68] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200 transition-all"
            >
              Apply as a Lawyer →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 xl:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">FAQ</p>
            <h2
              className="text-[clamp(32px,5vw,52px)] leading-none text-gray-900 uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              COMMON QUESTIONS
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-gray-500 mb-3">Still have questions?</p>
            <Link href="/contact" className="text-sm font-semibold text-[#E8317A] hover:underline">
              Contact our team →
            </Link>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-sm text-gray-900 hover:text-[#E8317A] transition-colors">
        {q}
        <svg
          className="w-4 h-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
        {a}
      </div>
    </details>
  );
}