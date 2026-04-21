import { SectionLabel } from "../ui";


const TESTIMONIALS = [
  {
    quote:
      "My landlord tried to evict me without notice. I read the tenancy article on UnderstandLaw, understood my rights, and held my ground. The eviction attempt stopped completely.",
    name: "Chidinma Okafor",
    role: "Tenant, Enugu",
    initials: "CO",
    color: "#1E3A5F",
    topic: "Tenancy Rights",
  },
  {
    quote:
      "I was retrenched without severance. After using the employment law module, I knew exactly what I was owed and hired a verified lawyer through the platform. I got every kobo.",
    name: "Babatunde Lawal",
    role: "Former Staff, Lagos",
    initials: "BL",
    color: "#2D4A1A",
    topic: "Employment Law",
  },
  {
    quote:
      "As a small business owner, understanding contracts was something I always feared. The plain-English guides changed that. I now read every agreement before signing.",
    name: "Amina Garba",
    role: "SME Owner, Kano",
    initials: "AG",
    color: "#4A2D1A",
    topic: "Business Contracts",
  },
  {
    quote:
      "I was detained at a checkpoint without cause. Knowing my rights — and quoting the law — led to my immediate release. UnderstandLaw gave me the confidence I needed.",
    name: "Ikechukwu Eze",
    role: "Graduate, Port Harcourt",
    initials: "IE",
    color: "#2D1A4A",
    topic: "Police Rights",
  },
];

const PRESS = [
  { name: "TechCabal", logo: "TC" },
  { name: "Nairametrics", logo: "NM" },
  { name: "Techpoint", logo: "TP" },
  { name: "BusinessDay", logo: "BD" },
  { name: "The Punch", logo: "PN" },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#0B1120] py-24 xl:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#C9922A]/3 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 xl:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionLabel light>Real Stories</SectionLabel>
          <h2
            className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Law Changed Their Outcome.{" "}
            <em className="not-italic text-[#E8B04A]">Knowledge Did Too.</em>
          </h2>
          <p className="text-sm text-[#8B9BB4] max-w-xl mx-auto">
            Ordinary Nigerians using UnderstandLaw to protect their rights, resolve disputes, 
            and navigate the legal system with confidence.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-[#0F1D35] border border-white/6 rounded-2xl p-6 xl:p-7 card-hover relative overflow-hidden group"
            >
              {/* Quote mark decoration */}
              <div
                className="absolute top-4 right-6 text-[80px] font-bold leading-none select-none pointer-events-none opacity-5"
                style={{ fontFamily: "'Playfair Display', serif", color: "#C9922A" }}
              >
                "
              </div>

              {/* Topic chip */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9922A]/10 border border-[#C9922A]/15 mb-4">
                <span className="w-1 h-1 rounded-full bg-[#C9922A]" />
                <span className="text-[10px] font-medium text-[#E8B04A] uppercase tracking-wide">{t.topic}</span>
              </div>

              <p className="text-sm text-[#B8C4D6] leading-relaxed mb-5 relative">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, #0B1120)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#8B9BB4]">{t.role}</p>
                </div>
                {/* Stars */}
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#C9922A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Press logos */}
        <div className="border-t border-white/6 pt-12">
          <p className="text-center text-xs text-[#8B9BB4] uppercase tracking-widest mb-8">
            As seen in
          </p>
          <div className="flex items-center justify-center flex-wrap gap-8 xl:gap-12">
            {PRESS.map((p) => (
              <div key={p.name} className="flex items-center gap-2 opacity-30 hover:opacity-60 transition-opacity">
                <div className="w-7 h-7 rounded bg-white/8 flex items-center justify-center text-[10px] font-bold text-white">
                  {p.logo}
                </div>
                <span className="text-sm font-semibold text-white tracking-tight">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
