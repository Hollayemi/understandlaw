"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Bookmark, ChevronLeft, ChevronRight, Clock, BookOpen, Star, Loader2 } from "lucide-react";
import {
  useListLearnModulesQuery,
  useGetContinueReadingQuery,
  useGetFeaturedTopicsQuery,
  useToggleSaveModuleMutation,
  useEnrolInModuleMutation,
} from "@/redux/slices/learn.slice";

type TabKey = "all" | "active" | "complete" | "saved";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",      label: "All Modules" },
  { key: "active",   label: "Active" },
  { key: "complete", label: "Complete" },
  { key: "saved",    label: "Saved" },
];

export default function DashboardLearnPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState<string>("all");

  // RTK Query hooks
  const { 
    data: modulesData, 
    isLoading: modulesLoading, 
    error: modulesError,
    refetch: refetchModules 
  } = useListLearnModulesQuery({
    tab: tab === "all" ? undefined : tab,
    search: searchTerm || undefined,
    category: category as any,
    page: 1,
    pageSize: 20,
  });

  const { 
    data: continueReadingData, 
    isLoading: continueLoading,
    refetch: refetchContinue 
  } = useGetContinueReadingQuery(undefined, {
    skip: tab !== "all", // Only fetch on "all" tab
  });

  const { 
    data: featuredData, 
    isLoading: featuredLoading 
  } = useGetFeaturedTopicsQuery(undefined);

  const [toggleSaveModule, { isLoading: isTogglingSave }] = useToggleSaveModuleMutation();
  const [enrolInModule, { isLoading: isEnrolling }] = useEnrolInModuleMutation();

  const modules = modulesData?.data?.data || [];
  const featuredTopics = featuredData?.data || [];
  const continueReading = continueReadingData?.data || [];

  const toggleSave = async (moduleId: string, isCurrentlySaved: boolean) => {
    try {
      await toggleSaveModule(moduleId).unwrap();
      refetchModules();
      if (tab === "all") refetchContinue();
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const handleEnrol = async (moduleId: string) => {
    try {
      await enrolInModule(moduleId).unwrap();
      refetchModules();
      refetchContinue();
    } catch (error) {
      console.error("Failed to enrol:", error);
    }
  };

  // Get counts for tabs
  const getTabCount = (tabKey: TabKey) => {
    if (tabKey === "all") return modulesData?.data?.total || 0;
    return modules.filter((m: any) => {
      if (tabKey === "active") return m.userTab === "active";
      if (tabKey === "complete") return m.userTab === "complete";
      if (tabKey === "saved") return m.isSaved;
      return true;
    }).length;
  };

  if (modulesLoading && !modulesData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8317A]" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 xl:p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-bold text-gray-900">Our Modules</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch ? (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm outline-none bg-transparent w-48"
                autoFocus
              />
              <button onClick={() => {
                setShowSearch(false);
                setSearchTerm("");
              }} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 shadow-sm transition-colors"
            >
              <Search size={16} className="text-gray-500" />
            </button>
          )}
          
          <button className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 shadow-sm transition-colors">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8317A] rounded-full" />
          </button>
          <Link
            href="/dashboard/marketplace"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            Find a Lawyer
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 mb-6 border-b border-gray-200">
        {TABS.map((t) => {
          const count = getTabCount(t.key);
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                tab === t.key
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t.label}
              <span className={`text-[11px] font-medium ${tab === t.key ? "text-gray-500" : "text-gray-300"}`}>
                ({String(count).padStart(2, "0")})
              </span>
            </button>
          );
        })}
      </div>

      {/* Continue Reading Section - Only show on "all" tab */}
      {tab === "all" && continueReading.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Continue Reading</h2>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {continueReading.map((item: any) => (
              <Link
                key={item.slug}
                href={`/dashboard/learn/${item.moduleSlug}`}
                className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-32 flex items-center justify-center" style={{ background: item.gradient }}>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-xs font-medium">{item.progressPercent}% Complete</p>
                      <div className="w-32 h-1.5 bg-white/30 rounded-full mt-2 mx-auto">
                        <div 
                          className="h-1.5 rounded-full bg-[#E8317A]"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.tagColor }}>
                    {item.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mt-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.currentSectionTitle}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{item.lastReadLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Module cards */}
      {modulesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#E8317A]" />
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No modules found</p>
          {tab !== "all" && (
            <button 
              onClick={() => setTab("all")}
              className="mt-2 text-[#E8317A] text-sm font-semibold"
            >
              View all modules
            </button>
          )}
        </div>
      ) : (
        <div className="relative mb-10">
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {modules.map((mod: any) => (
              <div
                key={mod._id}
                className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-44 flex items-center justify-center" style={{ background: mod.gradient }}>
                  {mod.thumbnailUrl ? (
                    <img src={mod.thumbnailUrl} alt={mod.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-bold text-white/20">{mod.categoryLabel[0]}</div>
                  )}
                  {/* Progress badge for enrolled modules */}
                  {mod.progressPercent > 0 && mod.progressPercent < 100 && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {mod.progressPercent}% Complete
                    </div>
                  )}
                  {mod.progressPercent === 100 && (
                    <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      Completed ✓
                    </div>
                  )}
                  {/* Bookmark */}
                  <button
                    onClick={() => toggleSave(mod._id, mod.isSaved)}
                    disabled={isTogglingSave}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Bookmark
                      size={14}
                      className={mod.isSaved ? "text-[#E8317A] fill-[#E8317A]" : "text-gray-500"}
                    />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide mb-2"
                    style={{ color: mod.categoryColor }}
                  >
                    {mod.categoryLabel}
                  </span>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{mod.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">{mod.description}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star size={11} className="fill-amber-400 text-amber-400" />{mod.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-gray-400" />{mod.weeksDuration}w
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} className="text-gray-400" />{mod.lessonCount} lessons
                    </span>
                  </div>

                  {/* Instructor & Action */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${mod.instructor.color}, ${mod.instructor.color}80)` }}
                    >
                      {mod.instructor.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{mod.instructor.name}</p>
                    </div>
                    {mod.enrolledAt ? (
                      <Link
                        href={`/dashboard/learn/${mod.slug}`}
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                      >
                        <ChevronRight size={13} />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnrol(mod._id)}
                        disabled={isEnrolling}
                        className="flex-shrink-0 text-[10px] font-semibold text-[#E8317A] hover:text-[#E8317A]/80"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Topics */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Featured Topics</h2>
        {featuredLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#E8317A]" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {featuredTopics.map((f: any) => (
              <Link
                key={f._id}
                href={`/dashboard/learn/${f.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{f.title}</h3>
                <div className="flex items-center gap-2.5 mt-auto">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${f.instructor.color}, ${f.instructor.color}80)` }}
                  >
                    {f.instructor.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{f.instructor.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{f.instructor.email}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}