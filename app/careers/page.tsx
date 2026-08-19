import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { CTASection } from "@/app/components/sections/OtherSections";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Heart,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const ROLES = [
  {
    title: "Legal Content Editor",
    dept: "Content",
    location: "Remote, Nigeria",
    type: "Full-time",
  },
  {
    title: "Backend Engineer (Node.js)",
    dept: "Engineering",
    location: "Lagos / Remote",
    type: "Full-time",
  },
  {
    title: "Lawyer Community Lead",
    dept: "Marketplace",
    location: "Lagos",
    type: "Full-time",
  },
  {
    title: "Customer Support Associate",
    dept: "Operations",
    location: "Remote, Nigeria",
    type: "Contract",
  },
];

const VALUES = [
  {
    icon: <Sparkles className="w-5 h-5" strokeWidth={2} />,
    title: "Clarity over cleverness",
    desc: "We'd rather ship the plain sentence than the impressive one.",
  },
  {
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
    title: "Built by a small team",
    desc: "Everyone here owns a real slice of the product, not a slide of it.",
  },
  {
    icon: <Heart className="w-5 h-5" strokeWidth={2} />,
    title: "Nigerian problem, Nigerian team",
    desc: "We hire people who've felt the problem we're solving.",
  },
];

const APPLY_STEPS = [
  { title: "Apply", desc: "Send your details and a short note on why this role fits you." },
  { title: "Intro call", desc: "A 20-minute conversation with the hiring lead, no trick questions." },
  { title: "Paid trial task", desc: "A small, compensated task close to the real work." },
  { title: "Offer", desc: "We move fast, most roles close within two weeks of applying." },
];

export default function CareersPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            Careers at LawTicha
          </p>
          <h1
            className="text-[clamp(34px,6vw,54px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Help 70 million Nigerians
            <br />
            <span className="text-maroon-600">understand their rights.</span>
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500 mt-6 max-w-2xl mx-auto">
            You don&apos;t have to be a full-time hire to build this with us. Join the
            team, teach a course, or publish your work, there&apos;s a lane for each.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F3F3F3] py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-5 xl:gap-7">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
              >
                {v.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-white py-16 xl:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--maroon-600)" }}
              >
                Open Roles
              </p>
              <h2
                className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                Full-time positions
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {ROLES.map((r) => (
              <Link
                key={r.title}
                href="/contact"
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 p-5 hover:border-[var(--maroon-600)]/30 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1.5">{r.title}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{r.dept}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {r.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.type}
                    </span>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
                  style={{ color: "var(--maroon-700)" }}
                >
                  Apply
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor + Publisher tracks */}
      <section className="bg-[#121824] py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--rose-400)" }}
            >
              Not Looking for a 9-to-5?
            </p>
            <h2
              className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-white uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Teach what you know. Publish what you&apos;ve written.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Instructor */}
            <div className="rounded-2xl p-7 bg-white/[0.04] border border-white/5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-white"
                style={{ color: "var(--maroon-700)" }}
              >
                <GraduationCap className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Become an instructor</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                If you can explain a legal topic, tenancy, employment, business
                registration, in a short video or module, you can teach it on LawTicha.
                Instructors earn from every citizen who completes their course.
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {["Any Nigerian legal specialisation welcome", "We help you script and record", "Paid per completion, not per upload"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-white/50">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--rose-400)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ color: "var(--maroon-700)" }}
              >
                Apply to teach
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Publisher */}
            <div className="rounded-2xl p-7 bg-white/[0.04] border border-white/5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-white"
                style={{ color: "var(--maroon-700)" }}
              >
                <BookOpen className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Sell your book or journal</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                Published a legal textbook, a law journal, or research on Nigerian law?
                List it in the LawTicha Library and reach citizens and lawyers
                searching for exactly that topic.
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {["You set the price, we handle payment", "Reach verified lawyers directly", "Keep full rights to your work"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-white/50">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--rose-400)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Apply to publish
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How applying works */}
      <section className="bg-white py-16 xl:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2 text-center"
            style={{ color: "var(--maroon-600)" }}
          >
            How It Works
          </p>
          <h2
            className="text-[clamp(26px,4vw,38px)] leading-[1.1] text-gray-900 uppercase font-black text-center mb-12"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            From application to offer
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPLY_STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-4"
                  style={{ background: "rgba(107,18,32,0.1)", color: "var(--maroon-700)" }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </HomeWrapper>
  );
}
