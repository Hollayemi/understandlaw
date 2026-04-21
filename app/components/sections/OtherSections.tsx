import React from "react";
import Link from "next/link";

// ── TOPICS ────────────────────────────────────────────────────────────────
const TOPICS = [
  { icon:"🚔", color:"#3B82F6", bg:"#EFF6FF", title:"Police & Law Enforcement",   count:8,  topics:["Rights during arrest","Unlawful detention","Lawful search & seizure","SARS interactions"] },
  { icon:"🏠", color:"#10B981", bg:"#ECFDF5", title:"Landlord & Tenancy",          count:6,  topics:["Eviction rights","Rental agreements","Illegal lockouts","Deposit recovery"] },
  { icon:"💼", color:"#8B5CF6", bg:"#F5F3FF", title:"Employment & Labour",         count:7,  topics:["Wrongful termination","Severance pay","Workplace harassment","NSITF rights"] },
  { icon:"📝", color:"#F59E0B", bg:"#FFFBEB", title:"Contracts & Agreements",      count:5,  topics:["Valid contracts","Consumer rights","Breach of contract","Digital agreements"] },
  { icon:"🏢", color:"#06B6D4", bg:"#ECFEFF", title:"Business & Commerce",         count:6,  topics:["Business registration","Tax obligations","CAC requirements","IP protection"] },
  { icon:"👨‍👩‍👧", color:"#EF4444", bg:"#FEF2F2", title:"Family & Personal Rights",     count:6,  topics:["Domestic violence","Protection orders","Inheritance","Child custody"] },
];

export function TopicsSection() {
  return (
    <section className="bg-white !py-20 xl:py-28">
      <div className="max-w-6xl mx-auto !px-6 lg:!px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">Legal Topics</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,56px)", lineHeight:1, color:"#111827", letterSpacing:"0.01em" }}>
              KNOW WHAT THE LAW<br />SAYS ABOUT YOU
            </h2>
          </div>
          <Link href="/learn" className="btn-cta self-start md:self-auto">
            View All Topics →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <Link key={t.title} href={`/learn/${t.title.toLowerCase().replace(/\s+&\s+/g,"-").replace(/\s+/g,"-")}`}
              className="group rounded-2xl !p-5 border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: t.bg }}>
                  {t.icon}
                </div>
                <span className="text-[11px] font-medium !px-2.5 !py-1 rounded-full"
                  style={{ background: t.bg, color: t.color }}>
                  {t.count} articles
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-[15px] mb-2 group-hover:text-[#E8317A] transition-colors">
                {t.title}
              </h3>
              <ul className="flex flex-col gap-1">
                {t.topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: t.color }}/>
                    {topic}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LAWYER CARDS ──────────────────────────────────────────────────────────
const LAWYERS = [
  { name:"Adaeze Okonkwo",  role:"Employment & Labour Law", city:"Lagos",  rating:4.9, reviews:38,  response:"< 1hr",  consults:124, color:"#3B82F6", initials:"AO", badges:["Verified","Top Rated","Responsive"] },
  { name:"Emeka Nwosu",     role:"Property & Tenancy Law",  city:"Abuja",  rating:4.8, reviews:55,  response:"< 2hrs", consults:210, color:"#10B981", initials:"EN", badges:["Verified","Top Rated"] },
  { name:"Fatimah Bello",   role:"Family & Domestic Law",   city:"Kano",   rating:4.7, reviews:29,  response:"< 3hrs", consults:87,  color:"#8B5CF6", initials:"FB", badges:["Verified","Responsive"] },
];

export function MarketplaceSection() {
  return (
    <section className="bg-[#F3F3F3] !py-20 xl:py-28">
      <div className="max-w-6xl mx-auto !px-6 lg:!px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">Lawyer Marketplace</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,56px)", lineHeight:1, color:"#111827", letterSpacing:"0.01em" }}>
              VERIFIED LAWYERS.<br />REAL EXPERTISE.
            </h2>
          </div>
          <Link href="/marketplace" className="btn-pink self-start md:self-auto text-sm">
            Browse All Lawyers →
          </Link>
        </div>

        {/* Verification steps */}
        <div className="bg-white rounded-2xl border border-gray-100 !p-5 mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Verification Process</p>
          <div className="flex flex-wrap gap-3">
            {["Registration","Credential Check","Platform Training","Assessment","Badge Assigned"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <svg className="w-4 h-4 text-gray-300 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#E8317A]/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#E8317A]">{i+1}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lawyer cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {LAWYERS.map((l) => (
            <div key={l.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${l.color},${l.color}99)` }}>
                    {l.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 text-sm truncate">{l.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{l.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {l.city}, Nigeria</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {l.badges.map((b) => (
                    <span key={b} className="text-[11px] font-medium !px-2 !py-0.5 rounded-full"
                      style={{ background:`${l.color}15`, color:l.color }}>
                      {b === "Verified" ? "✓ " : b === "Top Rated" ? "★ " : "⚡ "}{b}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 !py-3 border-t border-gray-100">
                  {[
                    { v:`★ ${l.rating}`, lbl:"Rating" },
                    { v:l.reviews.toString(), lbl:"Reviews" },
                    { v:l.response,  lbl:"Response" },
                  ].map((s) => (
                    <div key={s.lbl} className="text-center">
                      <div className="text-sm font-bold text-gray-900">{s.v}</div>
                      <div className="text-[10px] text-gray-400">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="!px-6 pb-6">
                <Link href={`/marketplace/${l.name.toLowerCase().replace(/\s+/g,"-")}`}
                  className="btn-pink w-full justify-center text-sm">
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote:"My landlord tried to evict me without notice. I read the tenancy guide on UnderstandLaw, understood my rights, and held my ground. The eviction attempt stopped completely.", name:"Chidinma Okafor", role:"Tenant, Enugu", topic:"Tenancy Rights", color:"#3B82F6", initials:"CO" },
  { quote:"I was retrenched without severance. After using the employment law module, I knew exactly what I was owed. I hired a verified lawyer through the platform and got every kobo.", name:"Babatunde Lawal", role:"Former Staff, Lagos", topic:"Employment Law", color:"#10B981", initials:"BL" },
  { quote:"As a small business owner, understanding contracts was something I always feared. The plain-English guides changed that. I now read every agreement before signing.", name:"Amina Garba", role:"SME Owner, Kano", topic:"Business Law", color:"#8B5CF6", initials:"AG" },
  { quote:"I was detained at a checkpoint without cause. Knowing my rights — and quoting the law — led to my immediate release. UnderstandLaw gave me the confidence I needed.", name:"Ikechukwu Eze", role:"Graduate, Port Harcourt", topic:"Police Rights", color:"#F59E0B", initials:"IE" },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white !py-20 xl:py-28">
      <div className="max-w-6xl mx-auto !px-6 lg:!px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">Real Stories</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,56px)", lineHeight:1, color:"#111827", letterSpacing:"0.01em" }}>
            THE LAW CHANGED THEIR OUTCOME.<br />KNOWLEDGE DID TOO.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-100 !p-6 hover:shadow-md transition-all duration-300">
              <span className="inline-block text-[11px] font-semibold !px-2.5 !py-1 rounded-full mb-4"
                style={{ background:`${t.color}12`, color:t.color }}>
                {t.topic}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${t.color},${t.color}80)` }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i)=>(
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING + FINAL CTA ───────────────────────────────────────────────────
const TIERS = [
  {
    name:"Free", price:"₦0", period:"forever",
    desc:"Full legal education — at no cost.",
    features:["Full Legal Learning Module","Browse Legal Library","Full-text search","Topic recommendations"],
    cta:"Get Started Free", href:"/register", highlight:false,
  },
  {
    name:"Marketplace", price:"Pay-per-use", period:"per consultation",
    desc:"Access verified lawyers when you need them.",
    features:["Everything in Free","Browse lawyer profiles","Book consultations","Transparent pricing","Consultation history"],
    cta:"Find a Lawyer", href:"/marketplace", highlight:true, badge:"Most Popular",
  },
  {
    name:"Premium", price:"Coming Soon", period:"Phase 3",
    desc:"Deep-dive guides, templates, AI assistant.",
    features:["Everything in Marketplace","Advanced legal guides","Document templates","AI legal query tool","Completion certificates"],
    cta:"Join Waitlist", href:"/waitlist", highlight:false, badge:"Phase 3",
  },
];

export function CTASection() {
  return (
    <>
      {/* Pricing */}
      <section className="bg-[#F3F3F3] !py-20 xl:py-28">
        <div className="max-w-6xl mx-auto !px-6 lg:!px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-2">Pricing</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,56px)", lineHeight:1, color:"#111827", letterSpacing:"0.01em" }}>
              START FREE. SCALE WHEN READY.
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Legal knowledge should be free. Start learning today — no card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div key={t.name}
                className={`relative rounded-2xl !p-7 flex flex-col transition-all duration-300 ${
                  t.highlight
                    ? "bg-[#111827] border-2 border-[#E8317A] shadow-xl scale-[1.02]"
                    : "bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5"
                }`}>
                {t.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 !px-3 !py-0.5 rounded-full text-[11px] font-semibold ${
                    t.highlight ? "bg-[#E8317A] text-white" : "bg-gray-200 text-gray-600"
                  }`}>{t.badge}</div>
                )}
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${t.highlight ? "text-[#E8317A]" : "text-gray-400"}`}>{t.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:t.highlight?"#fff":"#111827", lineHeight:1 }}>{t.price}</span>
                  <span className={`text-xs ${t.highlight ? "text-gray-400" : "text-gray-400"}`}>/ {t.period}</span>
                </div>
                <p className={`text-xs mb-5 ${t.highlight ? "text-gray-400" : "text-gray-500"}`}>{t.desc}</p>
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E8317A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className={`text-xs leading-relaxed ${t.highlight ? "text-gray-300" : "text-gray-500"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={t.href}
                  className={`w-full !py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    t.highlight ? "btn-pink" : "border border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                  }`}>
                  {t.cta}
                  {t.highlight && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>}
                </Link>
              </div>
            ))}
          </div>

          {/* For lawyers CTA */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 !px-6 !py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Are you a Nigerian lawyer?</p>
              <p className="text-xs text-gray-500 mt-0.5">Get verified, build your client base. Subscription plans from Phase 2.</p>
            </div>
            <Link href="/lawyers/join" className="btn-cta flex-shrink-0 text-sm">Apply as a Lawyer →</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#111827] !py-20 xl:py-24">
        <div className="max-w-3xl mx-auto !px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-4">Get Started Today</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,72px)", lineHeight:0.95, color:"#fff", letterSpacing:"0.01em" }}
            className="mb-5">
            YOUR RIGHTS DON'T CHANGE.<br />
            <span style={{ color:"#E8317A" }}>YOUR AWARENESS SHOULD.</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerians learning the law, protecting their rights, and making informed decisions every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href="/register" className="btn-pink text-[15px]">
              Start Learning — It's Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
            <Link href="/marketplace"
              className="inline-flex items-center justify-center gap-2 !px-6 !py-3.5 rounded-full border border-white/20 text-white text-[15px] font-semibold hover:bg-white/5 transition-colors">
              Talk to a Lawyer
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-600">No credit card required · Free forever · Nigerian law only</p>
        </div>
      </section>
    </>
  );
}
