"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import {
  Play, Pause, BookOpen, Flame, Trophy, Clock, ChevronRight,
  Bookmark, TrendingUp, Zap, CheckCircle2,
  Bell, Search, Star, ArrowRight, Users,
  MessageCircle, Target, Calendar,
  CarTaxiFront,
  House,
  Briefcase,
  File,
  ChevronLeft
} from "lucide-react";
import { useUserData } from "@/hook/useData";
import { CitizenFull } from "@/redux/types";
import {
  useGetDashboardDataQuery,
  useGetUserStatsQuery,
  useGetContinueReadingQuery,
  useGetDailyChallengeQuery,
  useGetTrendingTopicsQuery,
  useGetBookmarksQuery,
  useGetCommunityHighlightsQuery,
  useGetNextGoalQuery,
  useSubmitQuizAnswerMutation,
} from "@/redux/slices/dashboard.slice";
import { useListBookmarksForSubtopicQuery } from "@/redux/slices/learn.slice";
import { formatTime, substringWithMax } from "@/utils/function";
import { NotificationBell } from "../components/sections/NotificationBell";

// Helper to get icons based on slug or type
const getIconForTopic = (slug: string = '') => {
  if (slug.includes("arrest") || slug.includes("police")) return <CarTaxiFront size={16} />;
  if (slug.includes("eviction") || slug.includes("tenancy") || slug.includes("tenant")) return <House size={16} />;
  if (slug.includes("employment") || slug.includes("termination") || slug.includes("labour")) return <Briefcase size={16} />;
  if (slug.includes("contract") || slug.includes("agreement") || slug.includes("rental")) return <File size={16} />;
  return <BookOpen size={16} />;
};

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    "Police Rights": "#7C3AED",
    "Tenancy Law": "#7C3AED",
    "Employment Law": "#5B21B6",
    "Business Law": "#7C3AED",
    "Family Law": "#7C3AED",
    "Contract Law": "#5B21B6",
  };
  return colors[tag] || "#7C3AED";
};

// Quiz component with local state
function DailyQuiz({
  challenge,
  onQuizComplete
}: {
  challenge: any;
  onQuizComplete?: () => void
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitQuiz] = useSubmitQuizAnswerMutation();

  const handleSelect = (index: number) => {
    if (!revealed && !completed) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption !== null && !revealed) {
      setRevealed(true);

      try {
        const result = await submitQuiz({
          questionId: challenge?.id || "daily",
          answer: selectedOption
        }).unwrap();

        if (result.data?.correct) {
          setCompleted(true);
          if (onQuizComplete) onQuizComplete();
        }
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setRevealed(false);
    setCompleted(false);
  };

  if (!challenge) return null;

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 border border-white/8 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-purple-400" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400">Daily Challenge</span>
        <span className="ml-auto text-[11px] bg-purple-400/15 text-purple-400 font-semibold px-2 py-0.5 rounded-full">+{challenge.xpReward} XP</span>
      </div>

      <p className="text-sm font-semibold text-white mb-4 leading-snug">{challenge.question}</p>

      <div className="flex flex-col gap-2">
        {challenge.options?.map((opt: string, i: number) => {
          let cls = "border border-white/10 text-gray-300 hover:border-white/30";
          if (revealed || completed) {
            if (i === challenge.correct) cls = "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold";
            else if (i === selectedOption && i !== challenge.correct) cls = "border-red-400/60 bg-red-400/10 text-red-400 line-through opacity-60";
            else cls = "border-white/6 text-gray-500 opacity-40";
          } else if (selectedOption === i) {
            cls = "border-purple-500 bg-purple-500/10 text-purple-400";
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(i)}
              disabled={revealed || completed}
              className={`text-left text-xs px-4 py-2.5 rounded-xl transition-all ${cls} ${!revealed && !completed ? "cursor-pointer" : "cursor-default"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && !revealed && !completed && (
        <button
          onClick={handleSubmit}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          Submit Answer
        </button>
      )}

      {(revealed || completed) && (
        <div className="mt-3">
          <div className={`text-xs font-semibold text-center py-2 rounded-xl ${selectedOption === challenge.correct ? "bg-emerald-500/15 text-emerald-400" : "bg-red-400/10 text-red-400"
            }`}>
            {selectedOption === challenge.correct
              ? `✓ Correct! +${challenge.xpReward} XP earned`
              : `✗ Correct answer: ${challenge.options[challenge.correct]}`
            }
          </div>
          {completed && (
            <button
              onClick={handleReset}
              className="mt-2 w-full py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              Reset Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// XP Progress bar
function XPBar({ xpTotal, xpLevel }: { xpTotal: number; xpLevel: number }) {
  const pct = Math.min((xpTotal / xpLevel) * 100, 100);
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-purple-500">{xpLevel}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-gray-500">Level {xpLevel}</span>
          <span className="text-[10px] text-gray-400">{xpTotal} / {xpLevel} XP</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7C3AED, #5B21B6)" }} />
        </div>
      </div>
    </div>
  );
}

// Auto-sliding carousel component
function AutoSlideCarousel({ items, onSlideChange }: { items: any[], onSlideChange?: (index: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemsPerPage = 2;

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage);

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (onSlideChange) onSlideChange(index);
  };

  // Navigate to next page
  const nextSlide = () => {
    const nextIndex = Math.min(currentIndex + itemsPerPage, items.length - itemsPerPage);
    if (currentIndex + itemsPerPage >= items.length) {
      // Loop back to start
      goToSlide(0);
    } else {
      goToSlide(nextIndex);
    }
  };

  // Navigate to previous page
  const prevSlide = () => {
    const prevIndex = Math.max(currentIndex - itemsPerPage, 0);
    goToSlide(prevIndex);
  };

  // Auto-slide logic
  useEffect(() => {
    if (isPlaying && !isHovered && items.length > itemsPerPage) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000); // Slide every 5 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, currentIndex, items.length]);

  // Get current items to display
  const currentItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-purple-500 transition-colors shadow-sm"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause size={14} className="text-gray-600" /> : <Play size={14} className="text-purple-500" />}
          </button>
          <span className="text-[10px] text-gray-400 font-medium">
            {isPlaying ? "Auto-sliding" : "Paused"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-colors shadow-sm ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:border-purple-500"
              }`}
            aria-label="Previous slide"
          >
            <ChevronLeft size={14} className="text-gray-600" />
          </button>

          {/* Page indicators */}
          <div className="flex gap-1.5 px-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx * itemsPerPage)}
                className={`h-1.5 rounded-full transition-all ${idx === currentPage ? "w-6 bg-purple-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex + itemsPerPage >= items.length}
            className={`w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-colors shadow-sm ${currentIndex + itemsPerPage >= items.length ? "opacity-40 cursor-not-allowed" : "hover:border-purple-500"
              }`}
            aria-label="Next slide"
          >
            <ChevronRight size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div className="grid md:grid-cols-2 gap-4 transition-all duration-500">
        {currentItems.map((item) => (
          <Link key={item.slug} href={`/dashboard/learn/${item.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex">
            <div className="w-1.5 flex-shrink-0" style={{ background: item.tagColor || getTagColor(item.tag) }} />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.tagColor || getTagColor(item.tag) }}>
                    {item.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5 leading-snug group-hover:text-purple-500 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                  {getIconForTopic(item.slug)}
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1.5">
                <BookOpen size={11} className="text-gray-400" />
                {item.section || "Continue reading..."}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.progress || 0}%`, background: item.tagColor || getTagColor(item.tag) }} />
                </div>
                <span className="text-[10px] font-semibold text-gray-500">{item.progress || 0}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {item.lastRead || "Recently"}
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
                  <Zap size={9} /> +{item.xpReward || 50} XP to finish
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function UserDashboardOverview() {
  const { userInfo } = useUserData();
  const router = useRouter()
  const { user, profile } = userInfo as CitizenFull;

  // Local state
  const [greeting, setGreeting] = useState("Good Morning");
  const [videoPlaying, setVideoPlaying] = useState(false);

  // API hooks
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetDashboardDataQuery();
  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery();
  const { data: readingData, isLoading: readingLoading } = useGetContinueReadingQuery();
  const { data: challengeData, isLoading: challengeLoading } = useGetDailyChallengeQuery();
  const { data: trendingData, isLoading: trendingLoading } = useGetTrendingTopicsQuery({ limit: 4 });
  const { data: bookmarksData, isLoading: bookmarksLoading } = useListBookmarksForSubtopicQuery("all");
  const { data: communityData, isLoading: communityLoading } = useGetCommunityHighlightsQuery({ limit: 2 });
  const { data: goalData, isLoading: goalLoading } = useGetNextGoalQuery();

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good Afternoon");
    else if (h >= 17) setGreeting("Good Evening");
  }, []);

  // Handle video toggle
  const handleVideoToggle = () => {
    setVideoPlaying(!videoPlaying);
  };

  // Get data from API or fallback to defaults
  const stats = statsData?.data || profile || {
    topicsCompletedCount: 0,
    streakDays: 0,
    certificatesCount: 0,
    totalStudyMinutes: 0,
    xpTotal: 0,
    xpLevel: 1,
  };

  const readingItems = readingData?.data || [];
  const challenge = challengeData?.data || null;
  const trending = trendingData?.data || [];
  const bookmarks = bookmarksData?.data || [];
  const community = communityData?.data || [];
  const goal = goalData?.data || null;

  const sortedBookmarks = [...bookmarks].sort((a, b) => (b.startOffset || 0) - (a.startOffset || 0));

  // Stats configuration
  const STATS = [
    { icon: BookOpen, color: "#7C3AED", bg: "#EDE9FE", value: stats?.topicsCompletedCount ?? 0, label: "Topics Read" },
    { icon: Flame, color: "#7C3AED", bg: "#EDE9FE", value: stats?.streakDays ?? 0, label: "Day Streak" },
    { icon: Trophy, color: "#7C3AED", bg: "#EDE9FE", value: stats?.certificatesCount ?? 0, label: "Certificates" },
    { icon: Clock, color: "#5B21B6", bg: "#EDE9FE", value: `${stats?.totalStudyMinutes ?? 0}m`, label: "Time Invested" },
  ];

  // Loading state
  if (dashboardLoading || statsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F2EE]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F2EE]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="text-purple-500 hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-5 xl:px-8 h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
            <Flame size={13} className="text-purple-500" />
            <span className="text-xs font-bold text-purple-700">{stats?.streakDays || 0} day streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <XPBar xpTotal={stats?.xpTotal || 0} xpLevel={stats?.xpLevel || 1} />
          <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 transition-colors shadow-sm">
            <Search size={15} className="text-gray-500" />
          </button>
            <NotificationBell />
        </div>
      </div>

      <div className="p-5 xl:p-8 max-w-7xl mx-auto">

        {/* Welcome + Video */}
        <div className="grid xl:grid-cols-[1fr_420px] gap-5 mb-7">

          {/* Left: greeting */}
          <div className="flex flex-col justify-between">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-1">
                {greeting}, {user?.firstName || "User"} 👋
              </p>
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Your rights are worth<br />
                <span className="text-purple-500">knowing.</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                You've been learning for {stats?.streakDays || 0} days. Keep going, knowledge is the
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

            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl" />
            </div>

            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-4 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
                onClick={handleVideoToggle}>
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
                    <div className="h-1 bg-purple-500 rounded-full animate-pulse" style={{ width: "30%" }} />
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

            <div className="absolute bottom-4 left-4 flex gap-2">
              {["Free Forever", "No Jargon", "🇳🇬 Nigerian Law"].map((b) => (
                <span key={b} className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Reading with Auto-sliding Carousel */}
        <section className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-purple-500 inline-block" />
              Continue Where You Left Off
            </h2>
            <Link href="/dashboard/learn" className="text-xs font-semibold text-purple-500 hover:underline flex items-center gap-1">
              All Modules <ChevronRight size={12} />
            </Link>
          </div>
          {readingItems.length > 0 ? (
            <AutoSlideCarousel items={readingItems} />
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-100">
              <p>No reading in progress. Start learning today!</p>
              <Link href="/dashboard/learn" className="text-purple-500 hover:underline text-sm mt-2 inline-block">
                Browse topics →
              </Link>
            </div>
          )}
        </section>

        {/* Middle grid: Quiz + Trending + Bookmarks */}
        <div className="grid xl:grid-cols-3 gap-5 mb-7">

          {/* Daily Quiz */}
          <DailyQuiz challenge={challenge} />

          {/* Trending Topics */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-purple-500" />
              <h3 className="font-bold text-gray-900 text-sm">Trending in Nigeria</h3>
            </div>
            <div className="flex flex-col gap-2">
              {trending.length > 0 ? (
                trending.map((t, i) => (
                  <Link key={i} href={`/dashboard/learn/${t.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-400 text-[11px] font-bold w-4">{i + 1}</span>
                    <span className="text-base">{getIconForTopic(t.slug)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 group-hover:text-purple-500 transition-colors truncate">{t.title}</p>
                      <p className="text-[10px] text-gray-400">{t.reads || "0"} reads</p>
                    </div>
                    {t.hot && (
                      <span className="text-[9px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded-full border border-red-100 flex-shrink-0">HOT</span>
                    )}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No trending topics yet</p>
              )}
            </div>
          </div>

          {/* Saved Highlights & Bookmarks */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark size={14} className="text-purple-500" />
                <h3 className="font-bold text-gray-900 text-sm">My Bookmarks</h3>
              </div>
              <Link href="/dashboard/bookmarks" className="text-[10px] text-purple-500 font-semibold hover:underline">View all</Link>
            </div>
            <div className="flex flex-col h-full">
              {/* Bookmark List */}
              <div className="overflow-y-auto min-h-0">
                {bookmarks.length > 0 ? (
                  <div className="space-y-3 pr-1">
                    {bookmarks.map((bookmark) => (
                      <div
                        onClick={()=> router.push(bookmark.url)}
                        key={bookmark.id}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
                      >
                        <p className="text-sm text-gray-800 font-medium line-clamp-2">
                          "{substringWithMax(bookmark.highlightedText, 20)}"
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar size={10} className="flex-shrink-0" />
                            {formatTime(bookmark.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Bookmark size={40} className="text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 text-center">No bookmarks yet</p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Highlight text in the article to save it
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Link */}
              <div className="flex-shrink-0 pt-3 border-t border-gray-100 mt-2">
                <Link
                  href="/dashboard/learn"
                  className="inline-flex items-center gap-2 text-[11px] text-purple-500 font-semibold hover:gap-3 transition-all duration-200 group"
                >
                  <span>Start reading to add more</span>
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Community + Achievement row */}
        <div className="grid xl:grid-cols-[1fr_300px] gap-5 mb-7">

          {/* Community */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-purple-500" />
                <h3 className="font-bold text-gray-900 text-sm">Community Wins</h3>
              </div>
              <Link href="/dashboard/community" className="text-[10px] text-purple-500 font-semibold hover:underline">Join discussion</Link>
            </div>
            <div className="flex flex-col gap-3">
              {community.length > 0 ? (
                community.map((c) => (
                  <div key={c.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.color || "#7C3AED"}, ${c.color || "#7C3AED"}80)` }}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                        <span className="text-[10px] text-gray-400">{c.time || "Recently"}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">"{c.text}"</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-gray-500">{c.likes || 0} found this helpful</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No community highlights yet</p>
              )}
            </div>
          </div>

          {/* Next Goal / Achievement */}
          <div className="bg-gradient-to-br from-[#111827] to-[#0B1120] rounded-2xl p-5 border border-white/8 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-purple-500/8 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-purple-400" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Your Next Goal</span>
            </div>

            {goal ? (
              <>
                <div className="bg-white/5 border border-white/8 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={16} className="text-purple-400" />
                    <p className="text-sm font-bold text-white">{goal.title || "Law Aware Citizen"}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{goal.description || "Complete topics to unlock this badge"}</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: goal.total || 5 }, (_, i) => (
                      <div key={i} className={`flex-1 h-1.5 rounded-full ${i < (goal.completed || 0) ? "bg-purple-400" : "bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">{goal.completed || 0} / {goal.total || 5} tasks done</p>
                </div>

                <div className="flex flex-col gap-2">
                  {goal.tasks?.map((task: any) => (
                    <div key={task.text} className="flex items-center gap-2">
                      {task.done
                        ? <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        : <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                      }
                      <span className={`text-xs ${task.done ? "text-gray-400 line-through" : "text-gray-300"}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Complete topics to unlock your next goal!</p>
              </div>
            )}
          </div>
        </div>

        {/* Explore Topics CTA */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)" }}
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
            className="relative flex-shrink-0 flex items-center gap-2 bg-white text-purple-600 text-sm font-bold px-6 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Explore Now
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  );
}