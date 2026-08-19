import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { CTASection } from "@/app/components/sections/OtherSections";
import {
  BookOpen,
  Scale,
  Briefcase,
  Languages,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

const STATS = [
  { number: "70M+", label: "Nigerians who don't know their basic legal rights" },
  { number: "100K+", label: "Users helped understand their rights" },
  { number: "200+", label: "SCN-verified lawyers on the platform" },
  { number: "40+", label: "Legal Acts translated into plain English" },
];

const PILLARS = [
  {
    icon: <BookOpen className="w-5 h-5" strokeWidth={2} />,
    title: "Learn your rights",
    desc: "Free, plain-English guides and a searchable library of Nigerian law, organised by real-life situation, not by statute number.",
  },
  {
    icon: <Scale className="w-5 h-5" strokeWidth={2} />,
    title: "Find a verified lawyer",
    desc: "When a guide isn't enough, book a SCN-verified lawyer directly on the platform, with upfront pricing and no back-and-forth.",
  },
  {
    icon: <Briefcase className="w-5 h-5" strokeWidth={2} />,
    title: "Grow a law practice",
    desc: "Lawyers build a public profile, get matched to clients by specialisation, and manage consultations and cases in one dashboard.",
  },
];

const VALUES = [
  {
    icon: <Languages className="w-5 h-5" strokeWidth={2} />,
    title: "Plain English, always",
    desc: "If a guide needs a law degree to understand, we haven't finished writing it.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" strokeWidth={2} />,
    title: "Verified, not just listed",
    desc: "Every lawyer on LawTicha is checked against the Supreme Court of Nigeria roll before they can take a client.",
  },
  {
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
    title: "Built for every Nigerian",
    desc: "Regardless of education, income, or location, the free tier stays free. Forever.",
  },
];

export default function AboutPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            About LawTicha
          </p>
          <h1
            className="text-[clamp(34px,6vw,56px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            The law was written for everyone.
            <br />
            Most Nigerians just <span className="text-maroon-600">can&apos;t read it.</span>
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500 mt-6 max-w-2xl mx-auto">
            LawTicha translates Nigerian law into plain English, then connects you to a
            verified lawyer the moment a guide isn&apos;t enough. One platform, for
            citizens who want to know where they stand, and lawyers who want clients
            that already understand the basics.
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section className="bg-[#121824] py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <div
                className="text-[clamp(28px,4vw,40px)] font-black text-white leading-none"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {s.number}
              </div>
              <p className="text-xs text-white/50 mt-2 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--maroon-600)" }}
            >
              What We Do
            </p>
            <h2
              className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              One platform, two sides of the same problem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 xl:gap-7">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="bg-[#F3F3F3] py-16 xl:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--maroon-600)" }}
              >
                Our Mission
              </p>
              <h2
                className="text-[clamp(28px,4vw,42px)] leading-[1.1] text-gray-900 uppercase font-black mb-5"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                Explain the law in
                <br />
                <span className="text-maroon-600">common English.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-600 mb-4">
                Nigerian law is written in legal English, a dialect most citizens never
                learn. That gap is where people get evicted without knowing they had a
                defence, dismissed from work without their severance, or arrested
                without understanding what &quot;lawful search&quot; actually means.
              </p>
              <p className="text-[15px] leading-relaxed text-gray-600">
                Our mission is to close that gap: rewrite Nigerian law in plain,
                everyday English, and put a verified lawyer one tap away for the
                situations plain English alone can&apos;t resolve.
              </p>
            </div>

            {/* Signature element: legal jargon vs plain English, side by side */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Section 24(1), Labour Act
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    &quot;Where the contract of employment is terminated by an employer
                    without notice, the employer shall pay to the worker a sum equal to
                    the amount of the wages which would have accrued to the worker
                    during the period of the notice.&quot;
                  </p>
                </div>
                <div className="p-6" style={{ background: "rgba(107,18,32,0.04)" }}>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "var(--maroon-600)" }}
                  >
                    LawTicha, plain English
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    If your employer fires you on the spot with no notice, they still
                    owe you the pay you&apos;d have earned during your notice period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2 text-center"
            style={{ color: "var(--maroon-600)" }}
          >
            What We Stand For
          </p>
          <h2
            className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black text-center mb-12"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Principles we don&apos;t bend on
          </h2>

          <div className="grid md:grid-cols-3 gap-5 xl:gap-7">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col items-start">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--maroon-700)", color: "#fff" }}
                >
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: "var(--maroon-700)" }}
            >
              We&apos;re building this with a small team, see open roles
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </HomeWrapper>
  );
}
