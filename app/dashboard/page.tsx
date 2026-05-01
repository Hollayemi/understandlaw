"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play, Pause, BookOpen, Flame, Trophy, Clock, ChevronRight,
  Bookmark, Share2, TrendingUp, Zap, Lock, CheckCircle2,
  Bell, Search, Star, ArrowRight, Users, BarChart3,
  MessageCircle, Sparkles, Target, Calendar,
  CarTaxiFront,
  House,
  Briefcase,
  File
} from "lucide-react";

//  Mock user data 
const USER = {
  name: "Adaeze",
  streak: 7,
  xp: 1240,
  level: 4,
  nextLevelXp: 1500,
  joinedDays: 14,
};

const STATS = [
  { icon: BookOpen,   color: "#E8317A", bg: "#FFF0F5", value: 8,     label: "Topics Read"   },
  { icon: Flame,      color: "#F59E0B", bg: "#FFFBEB", value: 7,     label: "Day Streak"    },
  { icon: Trophy,     color: "#10B981", bg: "#ECFDF5", value: 2,     label: "Certificates"  },
  { icon: Clock,      color: "#3B82F6", bg: "#EFF6FF", value: "14h", label: "Time Invested" },
];

const CONTINUE_READING = [
  {
    slug:     "rights-during-arrest",
    icon:     <CarTaxiFront />,
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%)",
    tag:      "Police Rights",
    tagColor: "#3B82F6",
    title:    "Rights During Arrest & Detention",
    progress: 62,
    lastRead: "2 hours ago",
    section:  "Section 3: Your right to remain silent",
    xpReward: 50,
  },
  {
    slug:     "tenant-eviction-rights",
    icon:     <House />,
    gradient: "linear-gradient(135deg, #1A3B2E 0%, #2D6A4F 100%)",
    tag:      "Tenancy Law",
    tagColor: "#10B981",
    title:    "Tenant Eviction Rights in Nigeria",
    progress: 25,
    lastRead: "Yesterday",
    section:  "Section 2: Notice periods explained",
    xpReward: 80,
  },
];

const DAILY_CHALLENGE = {
  title: "Know Your Arrest Rights",
  question: "How long can police legally detain you without charge in Nigeria?",
  options: ["12 hours", "24 hours", "48 hours", "72 hours"],
  correct: 1,
  xpReward: 100,
  completed: false,
};

const TRENDING_TOPICS = [
  { icon: <CarTaxiFront size={15} />, title: "Police Encounter Rights",    reads: "12.4k", hot: true,  slug: "police-encounter" },
  { icon: <House size={15} />, title: "Illegal Eviction Notice",    reads: "9.1k",  hot: true,  slug: "eviction-notice" },
  { icon: <Briefcase size={15} />, title: "Wrongful Termination",       reads: "7.8k",  hot: false, slug: "wrongful-termination" },
  { icon: <File size={15} />, title: "Signing a Rental Agreement", reads: "6.2k",  hot: false, slug: "rental-agreement" },
];

const BOOKMARKS = [
  { title: "Section 35 — Right to Personal Liberty", law: "1999 Constitution",    color: "#E8317A" },
  { title: "Tenancy Law — Notice to Quit Periods",   law: "Lagos Tenancy Law",    color: "#10B981" },
  { title: "Labour Act S.11 — Severance Pay",        law: "Labour Act Cap. L1",   color: "#8B5CF6" },
];

const COMMUNITY_HIGHLIGHTS = [
  { initials: "CI", color: "#3B82F6", name: "Chioma I.",    text: "Just used the arrest rights guide at a checkpoint. It worked!", time: "3h ago",  likes: 47 },
  { initials: "BL", color: "#10B981", name: "Babatunde L.", text: "The eviction law section saved me ₦200k in illegal fees.", time: "1d ago",  likes: 89 },
];

//  Quiz component 
function DailyQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 border border-white/8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#E8317A]/15 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-amber-400" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Daily Challenge</span>
        <span className="ml-auto text-[11px] bg-amber-400/15 text-amber-400 font-semibold px-2 py-0.5 rounded-full">+{DAILY_CHALLENGE.xpReward} XP</span>
      </div>

      <p className="text-sm font-semibold text-white mb-4 leading-snug">{DAILY_CHALLENGE.question}</p>

      <div className="flex flex-col gap-2">
        {DAILY_CHALLENGE.options.map((opt, i) => {
          let cls = "border border-white/10 text-gray-300 hover:border-white/30";
          if (revealed) {
            if (i === DAILY_CHALLENGE.correct) cls = "border-[#10B981] bg-[#10B981]/15 text-[#10B981] font-semibold";
            else if (i === selected && i !== DAILY_CHALLENGE.correct) cls = "border-red-400/60 bg-red-400/10 text-red-400 line-through opacity-60";
            else cls = "border-white/6 text-gray-500 opacity-40";
          } else if (selected === i) {
            cls = "border-[#E8317A] bg-[#E8317A]/10 text-[#E8317A]";
          }
          return (
            <button
              key={opt}
              onClick={() => { if (!revealed) setSelected(i); }}
              className={`text-left text-xs px-4 py-2.5 rounded-xl transition-all ${cls} ${!revealed ? "cursor-pointer" : "cursor-default"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && !revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors"
        >
          Submit Answer
        </button>
      )}
      {revealed && (
        <div className={`mt-3 text-xs font-semibold text-center py-2 rounded-xl ${selected === DAILY_CHALLENGE.correct ? "bg-[#10B981]/15 text-[#10B981]" : "bg-red-400/10 text-red-400"}`}>
          {selected === DAILY_CHALLENGE.correct ? "✓ Correct! +100 XP earned" : "✗ Correct answer: 24 hours (Section 35)"}
        </div>
      )}
    </div>
  );
}

//  XP Progress bar 
function XPBar() {
  const pct = (USER.xp / USER.nextLevelXp) * 100;
  return (
    <div className="hidden md:block flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#E8317A]/15 border border-[#E8317A]/20 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-[#E8317A]">{USER.level}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-gray-500">Level {USER.level}</span>
          <span className="text-[10px] text-gray-400">{USER.xp} / {USER.nextLevelXp} XP</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E8317A, #ff6fa8)" }} />
        </div>
      </div>
    </div>
  );
}

//  Main 
export default function UserDashboardOverview() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good Afternoon");
    else if (h >= 17) setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

      {/*  Top bar  */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-5 xl:px-8 h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Flame size={13} className="text-amber-500" />
            <span className="text-xs font-bold text-amber-700">{USER.streak} day streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <XPBar />
          <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 transition-colors shadow-sm">
            <Search size={15} className="text-gray-500" />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <Bell size={15} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8317A] rounded-full" />
          </button>
        </div>
      </div>

      <div className="p-5 xl:p-8 max-w-7xl mx-auto">

        {/*  Welcome + Video  */}
        <div className="grid xl:grid-cols-[1fr_420px] gap-5 mb-7">

          {/* Left: greeting */}
          <div className="flex flex-col justify-between">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8317A] mb-1">
                {greeting}, {USER.name} 👋
              </p>
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Your rights are worth<br />
                <span style={{ color: "#E8317A" }}>knowing.</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                You've been learning for {USER.joinedDays} days. Keep going — knowledge is the
                most powerful legal tool you have.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: s.bg }}>
                      <Icon size={17} style={{ color: s.color }} />
                    </div>
                    <p className="text-xl font-bold text-gray-900 leading-none">{s.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Welcome video */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 min-h-[240px]"
            style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E3A5F 50%, #0B1120 100%)" }}>

            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-[#E8317A]/10 blur-3xl" />
              <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full bg-[#3B82F6]/10 blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-4 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setVideoPlaying(!videoPlaying)}>
                {videoPlaying
                  ? <Pause size={20} className="text-white" />
                  : <Play size={20} className="text-white ml-1" />
                }
              </div>

              {videoPlaying ? (
                <div className="space-y-1">
                  <p className="text-white font-semibold text-sm">Welcome to LawTicha</p>
                  <p className="text-gray-400 text-xs">Playing introduction...</p>
                  <div className="w-40 h-1 bg-white/10 rounded-full mt-3 mx-auto overflow-hidden">
                    <div className="h-1 bg-[#E8317A] rounded-full animate-pulse" style={{ width: "30%" }} />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white font-bold text-base mb-1">Welcome to LawTicha</p>
                  <p className="text-gray-400 text-xs max-w-[200px] leading-relaxed mb-4">
                    Watch this 2-min intro to get the most from the platform
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><Play size={10} /> 2:14 min</span>
                    <span className="flex items-center gap-1"><Users size={10} /> 48k views</span>
                  </div>
                </>
              )}
            </div>

            {/* Badges at bottom */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {["Free Forever", "No Jargon", "🇳🇬 Nigerian Law"].map((b) => (
                <span key={b} className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/*  Continue Reading  */}
        <section className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#E8317A] inline-block" />
              Continue Where You Left Off
            </h2>
            <Link href="/dashboard/learn" className="text-xs font-semibold text-[#E8317A] hover:underline flex items-center gap-1">
              All Modules <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {CONTINUE_READING.map((item) => (
              <Link key={item.slug} href={`/dashboard/learn/${item.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex">

                {/* Color strip */}
                <div className="w-1.5 flex-shrink-0" style={{ background: item.tagColor }} />

                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.tagColor }}>{item.tag}</span>
                      <h3 className="font-bold text-gray-900 text-sm mt-0.5 leading-snug group-hover:text-[#E8317A] transition-colors">{item.title}</h3>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xl flex-shrink-0"
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Last position */}
                  <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1.5">
                    <BookOpen size={11} className="text-gray-400" />
                    {item.section}
                  </p>

                  {/* Progress */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.progress}%`, background: item.tagColor }} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">{item.progress}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {item.lastRead}
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                      <Zap size={9} /> +{item.xpReward} XP to finish
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/*  Middle grid: Quiz + Trending + Bookmarks  */}
        <div className="grid xl:grid-cols-3 gap-5 mb-7">

          {/* Daily Quiz */}
          <DailyQuiz />

          {/* Trending Topics */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-[#E8317A]" />
              <h3 className="font-bold text-gray-900 text-sm">Trending in Nigeria</h3>
            </div>
            <div className="flex flex-col gap-2">
              {TRENDING_TOPICS.map((t, i) => (
                <Link key={t.slug} href={`/dashboard/learn/${t.slug}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className="text-gray-400 text-[11px] font-bold w-4">{i + 1}</span>
                  <span className="text-base">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-[#E8317A] transition-colors truncate">{t.title}</p>
                    <p className="text-[10px] text-gray-400">{t.reads} reads</p>
                  </div>
                  {t.hot && (
                    <span className="text-[9px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded-full border border-red-100 flex-shrink-0">HOT</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Saved Highlights & Bookmarks */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark size={14} className="text-[#E8317A]" />
                <h3 className="font-bold text-gray-900 text-sm">My Bookmarks</h3>
              </div>
              <Link href="/dashboard/bookmarks" className="text-[10px] text-[#E8317A] font-semibold hover:underline">View all</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {BOOKMARKS.map((b) => (
                <div key={b.title} className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-1 h-8 rounded-full flex-shrink-0 mt-0.5" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-[#E8317A] transition-colors leading-snug line-clamp-1">{b.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{b.law}</p>
                  </div>
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-[#E8317A] flex-shrink-0 mt-1 transition-colors" />
                </div>
              ))}
              <Link href="/dashboard/learn"
                className="flex items-center gap-2 text-[11px] text-[#E8317A] font-semibold mt-1 hover:gap-3 transition-all">
                <span>Start reading to add more</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/*  Community + Achievement row  */}
        <div className="grid xl:grid-cols-[1fr_300px] gap-5 mb-7">

          {/* Community */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#E8317A]" />
                <h3 className="font-bold text-gray-900 text-sm">Community Wins</h3>
              </div>
              <Link href="/dashboard/community" className="text-[10px] text-[#E8317A] font-semibold hover:underline">Join discussion</Link>
            </div>
            <div className="flex flex-col gap-3">
              {COMMUNITY_HIGHLIGHTS.map((c) => (
                <div key={c.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}80)` }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">"{c.text}"</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-gray-500">{c.likes} found this helpful</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Goal / Achievement */}
          <div className="bg-gradient-to-br from-[#111827] to-[#0B1120] rounded-2xl p-5 border border-white/8 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#E8317A]/8 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Your Next Goal</span>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-amber-400" />
                <p className="text-sm font-bold text-white">Law Aware Citizen</p>
              </div>
              <p className="text-xs text-gray-400 mb-3">Complete 3 more topics to unlock this badge</p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= 2 ? "bg-amber-400" : "bg-white/10"}`} />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">2 / 5 topics done</p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { done: true,  text: "Complete first topic" },
                { done: true,  text: "Read 5 sections" },
                { done: false, text: "Share a legal insight" },
                { done: false, text: "Try a daily quiz" },
              ].map((task) => (
                <div key={task.text} className="flex items-center gap-2">
                  {task.done
                    ? <CheckCircle2 size={13} className="text-[#10B981] flex-shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                  }
                  <span className={`text-xs ${task.done ? "text-gray-400 line-through" : "text-gray-300"}`}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  Explore Topics CTA  */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #E8317A 0%, #ff6fa8 50%, #E8317A 100%)" }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <div className="relative">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Ready to explore?</p>
            <h3 className="text-white font-bold text-lg">Browse All Legal Topics</h3>
            <p className="text-white/70 text-xs mt-1">40+ topics covering every area of Nigerian law</p>
          </div>
          <Link href="/dashboard/learn"
            className="relative flex-shrink-0 flex items-center gap-2 bg-white text-[#E8317A] text-sm font-bold px-6 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Explore Now
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  );
}