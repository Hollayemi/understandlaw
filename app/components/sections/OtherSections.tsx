"use client";
import React from "react";
import Link from "next/link";
import {
  Shield,
  Home,
  Briefcase,
  FileText,
  Building2,
  Users,
  MapPin,
  Star,
  Check,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useGetMarketplaceLawyersQuery } from "@/redux/slices/lawyers.slice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { LawyerFull, Specialism } from "@/redux/types/lawyer";
import { LawyerCard } from "@/app/marketplace/page"

/* ------------------------------ PRODUCT PREVIEW ------------------------------ */

export function ProductPreviewSection() {
  return (
    <section className="bg-white py-16 xl:py-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--maroon-600)" }}
          >
            See It In Action
          </p>
          <h2
            className="text-[clamp(20px,3vw,36px)] leading-[1.05] text-gray-900 uppercase font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            One dashboard. Every right,
            <br />
            tracked and understood.
          </h2>
          <p className="text-[15px] leading-relaxed text-gray-500 mt-5">
            Your reading streak, certificates, and saved topics, all in one
            place, whether you&apos;re on a laptop or your phone between
            meetings.
          </p>
        </motion.div>

        {/* Stacked Images */}
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop screenshot — floating and rotating gently */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 150,
              damping: 25,
            }}
            whileHover={{
              scale: 1.02,
              y: -8,
              rotateX: 2,
              transition: { duration: 0.3 },
            }}
            className="relative rounded-2xl border border-gray-200 shadow-2xl shadow-gray-900/10 overflow-hidden bg-white"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="ml-3 text-[11px] text-gray-400 font-medium">
                lawticha.com/dashboard
              </span>
            </div>
            <motion.img
              src="/images/dashboard.png"
              alt="LawTicha dashboard showing reading streak, certificates, and legal modules"
              className="w-full h-auto block"
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.3 },
              }}
            />
          </motion.div>

          {/* Mobile screenshot — floating on top with its own animation */}
          <motion.div
            initial={{ opacity: 0, y: -40, rotate: -6, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
            whileHover={{
              y: -16,
              rotate: -3,
              scale: 1.05,
              transition: { duration: 0.25, type: "spring", stiffness: 300 },
            }}
            className="absolute -top-6 -left-6 md:-top-10 md:-left-10 z-10 w-[120px] sm:w-[140px] md:w-[170px] lg:w-[200px] xl:w-[220px] drop-shadow-2xl"
          >
            <motion.div
              className="rounded-[22px] border-[6px] border-gray-900 shadow-xl overflow-hidden bg-gray-900"
              whileHover={{
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                transition: { duration: 0.2 },
              }}
            >
              <motion.img
                src="/images/mobile_dashboard.png"
                alt="LawTicha mobile dashboard"
                className="w-full h-auto block rounded-[16px]"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/register" className="btn-maroon px-6 py-3 text-sm">
              Get Started for Free
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-[1.5px] border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              See How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated background blobs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-maroon-50/30 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-50/20 rounded-full blur-3xl -z-10"
      />
    </section>
  );
}


const TOPICS = [
  {
    icon: <Shield className="w-5 h-5" strokeWidth={2} />,
    title: "Police & Arrest in Nigeria",
    count: 8,
    topics: ["Police Powers in Nigeria", "Detention After Arrest", "Police Interrogation", "Your Rights During Arrest"],
    gradient: "from-rose-50 to-red-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
  },
  {
    icon: <Home className="w-5 h-5" strokeWidth={2} />,
    title: "Landlord & Tenancy",
    count: 6,
    topics: ["Eviction rights", "Rental agreements", "Illegal lockouts", "Deposit recovery"],
    gradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    icon: <Briefcase className="w-5 h-5" strokeWidth={2} />,
    title: "Employment & Labour",
    count: 7,
    topics: ["Wrongful termination", "Severance pay", "Workplace harassment", "NSITF rights"],
    gradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    icon: <FileText className="w-5 h-5" strokeWidth={2} />,
    title: "Contracts & Agreements",
    count: 6,
    topics: ["Valid contracts", "Consumer rights", "Breach of contract", "Digital agreements"],
    gradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    icon: <Building2 className="w-5 h-5" strokeWidth={2} />,
    title: "Business & Commerce",
    count: 6,
    topics: ["Business registration", "Tax obligations", "CAC requirements", "IP protection"],
    gradient: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
    title: "Family & Personal Rights",
    count: 6,
    topics: ["Domestic violence", "Protection orders", "Inheritance", "Child custody"],
    gradient: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-700",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.5,
    },
  },
};

export function TopicsSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#F8F8F8] to-[#F3F3F3] py-16 xl:py-24 overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-maroon-50/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-50/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--maroon-600)" }}
            >
              Legal Topics
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[clamp(28px,4vw,44px)] leading-[1.05] text-gray-900 uppercase font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Know what the law
              <br />
              says <span className="text-maroon-600">about you</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[15px] text-gray-500 mt-3 max-w-lg"
            >
              Explore essential legal topics that affect your daily life, with
              clear guides and actionable insights.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              href="/learn"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-full hover:bg-white/50 backdrop-blur-sm"
            >
              <span>View all topics</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:scale-110" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TOPICS.map((t, index) => (
            <motion.div
              key={t.title}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="group"
            >
              <Link
                href={`/dashboard/learn/know-your-rights`}
                className="relative flex flex-col h-full rounded-2xl p-6 bg-white/80 backdrop-blur-sm border border-gray-100/80 hover:border-[var(--maroon-600)]/30 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Subtle gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                {/* Shine effect */}
                <div className="absolute -inset-full group-hover:inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12" />

                <div className="relative z-10">
                  {/* Icon & Count */}
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: -5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${t.iconBg} ${t.iconColor} transition-all duration-300 group-hover:shadow-lg`}
                    >
                      {t.icon}
                    </motion.div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      {t.count} guides
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-[17px] mb-4 group-hover:text-[var(--maroon-700)] transition-colors duration-300">
                    {t.title}
                  </h3>

                  {/* Topics List */}
                  <ul className="flex flex-col gap-2.5 mb-6">
                    {t.topics.slice(0, 3).map((topic) => (
                      <motion.li
                        key={topic}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-2.5 text-[13.5px] text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                      >
                        <Check
                          className="w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
                          style={{ color: "var(--maroon-600)" }}
                          strokeWidth={2.5}
                        />
                        <span>{topic}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Explore Link */}
                  <motion.span
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold pt-4 border-t border-gray-100/80 group-hover:border-[var(--maroon-600)]/20 transition-colors duration-300"
                    style={{ color: "var(--maroon-700)" }}
                  >
                    <span>Explore topic</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-110" />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Decorative Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
        />
      </div>
    </section>
  );
}

/* -------------------------------- MARKETPLACE -------------------------------- */

const LAWYERS = [
  { name: "Adaeze Okonkwo", role: "Employment & Labour Law", city: "Lagos", rating: 4.9, reviews: 38, response: "< 1hr", initials: "AO", badges: ["Verified", "Top Rated"] },
  { name: "Emeka Nwosu", role: "Property & Tenancy Law", city: "Abuja", rating: 4.8, reviews: 55, response: "< 2hrs", initials: "EN", badges: ["Verified", "Top Rated"] },
  { name: "Fatimah Bello", role: "Family & Domestic Law", city: "Kano", rating: 4.7, reviews: 29, response: "< 3hrs", initials: "FB", badges: ["Verified", "Responsive"] },
];

const VERIFICATION_STEPS = ["Registration", "Credential Check", "Platform Training", "Assessment", "Badge Assigned"];

export function MarketplaceSection() {
  const { data: response, isLoading, isFetching, error, refetch } =
      useGetMarketplaceLawyersQuery({});
    const { data: specialismsResponse } = useListSpecialismsQuery();

    const SPECIALISMS = specialismsResponse?.data || [];
  
    const lawyers: LawyerFull[] = response?.data?.data || [];
  return (
    <section className="bg-white py-20 xl:py-28">
     {/* Grid */}
          {!isLoading && !error && lawyers.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lawyers.map((l) => (
                <LawyerCard key={l._id || l.id} lawyer={l} />
              ))}
            </div>
          )}
    </section>
  );
}

/* ----------------------------------- FINAL CTA ----------------------------------- */

export function CTASection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--maroon-900)" }}>
      <div className="absolute inset-y-0 left-0 w-40 dot-grid" />
      <div className="absolute inset-y-0 right-0 w-40 dot-grid" />
      <div className="relative max-w-3xl mx-auto px-6 py-20 xl:py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-white/80">Get Started Today</p>
        <h2
          className="text-[clamp(32px,5vw,52px)] leading-[1.05] text-white uppercase font-black mb-5"
          style={{ fontFamily: "var(--font-archivo-black)" }}
        >
          Your rights don&apos;t change.
          <br />
          <span style={{ color: "var(--rose-400)" }}>Your awareness should.</span>
        </h2>
        <p className="text-sm text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
          Join thousands of Nigerians learning the law, protecting their rights, and making informed decisions every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
            style={{ color: "var(--maroon-700)" }}
          >
            Start Learning, It&apos;s Free
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white text-[15px] font-semibold hover:bg-white/5 transition-colors"
          >
            Talk to a Lawyer
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/50">
          No credit card required &bull; Free forever &bull; Nigerian law only
        </p>
      </div>
    </section>
  );
}