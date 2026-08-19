"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Bell, Bookmark, ChevronLeft, ChevronRight, Clock, BookOpen, Star, Loader2, Play, Pause, X } from "lucide-react";
import {
  useListLearnModulesQuery,
  useGetContinueReadingQuery,
  useGetFeaturedTopicsQuery,
  useToggleSaveModuleMutation,
  useEnrolInModuleMutation,
} from "@/redux/slices/learn.slice";
import { useUserData } from "@/hook/useData";
import { NotificationBell } from "../../components/sections/NotificationBell";

type TabKey = "all" | "active" | "complete" | "saved";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Lessons" },
  { key: "complete", label: "Complete" },
  { key: "saved", label: "Saved" },
];

// Auto-sliding carousel component
function AutoSlideCarousel({
  items,
  renderItem,
  itemsPerView = 3,
  onSlideChange,
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemsPerView?: number;
  onSlideChange?: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const getItemsPerView = () => {
    if (typeof window === 'undefined') return itemsPerView;
    const width = window.innerWidth;
    if (width < 480) return 1.2;
    if (width < 640) return 1.5;
    if (width < 768) return 2;
    if (width < 1024) return 2.5;
    if (width < 1280) return 3;
    return itemsPerView;
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newItemsPerView = getItemsPerView();
        setCurrentItemsPerView(newItemsPerView);
        if (currentIndex >= items.length - newItemsPerView) {
          setCurrentIndex(Math.max(0, items.length - newItemsPerView));
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [items.length, currentIndex]);

  const totalItems = items.length;
  const totalSlides = Math.ceil(totalItems / currentItemsPerView);
  const currentSlide = Math.floor(currentIndex / currentItemsPerView);
  const itemWidth = 100 / currentItemsPerView;
  const translateX = -(currentIndex * itemWidth);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const clampedIndex = Math.max(0, Math.min(index, totalItems - currentItemsPerView));
    setCurrentIndex(clampedIndex);
    if (onSlideChange) onSlideChange(clampedIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    const nextIndex = currentIndex + currentItemsPerView;
    if (nextIndex >= totalItems) {
      goToSlide(0);
    } else {
      goToSlide(nextIndex);
    }
  };

  const prevSlide = () => {
    const prevIndex = currentIndex - currentItemsPerView;
    if (prevIndex < 0) {
      const lastSlideIndex = Math.max(0, totalItems - currentItemsPerView);
      goToSlide(lastSlideIndex);
    } else {
      goToSlide(prevIndex);
    }
  };

  useEffect(() => {
    if (isPlaying && !isHovered && totalItems > currentItemsPerView) {
      intervalRef.current = setInterval(() => nextSlide(), 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isHovered, currentIndex, totalItems, currentItemsPerView]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) nextSlide();
    else if (touchEndX - touchStartX > 50) prevSlide();
  };

  if (totalItems === 0) return null;
  const showControls = totalItems > currentItemsPerView;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showControls && (
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm flex-shrink-0"
            >
              {isPlaying ? <Pause size={12} className="md:text-sm text-gray-600" /> : <Play size={12} className="md:text-sm text-maroon-500" />}
            </button>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-medium hidden sm:inline">
              {isPlaying ? "Auto-sliding" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={prevSlide}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm flex-shrink-0"
            >
              <ChevronLeft size={12} className="md:text-sm text-gray-600" />
            </button>
            <div className="hidden sm:flex gap-1.5 px-1 md:px-2">
              {Array.from({ length: Math.min(totalSlides, 8) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx * currentItemsPerView)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-maroon-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm flex-shrink-0"
            >
              <ChevronRight size={12} className="md:text-sm text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div
        className="overflow-hidden -mx-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isTransitioning ? 'transform 500ms ease-in-out' : 'transform 500ms ease-in-out'
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item._id || item.slug || idx}
              className="flex-shrink-0 px-1.5 sm:px-2"
              style={{ width: `${itemWidth}%` }}
            >
              <div className="h-full">{renderItem(item, idx)}</div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="flex justify-center gap-1 mt-3 sm:hidden">
          {Array.from({ length: Math.min(totalSlides, 6) }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => goToSlide(idx * currentItemsPerView)}
              className={`h-1.5! rounded-full transition-all duration-300 ${idx === currentSlide ? "w-4 bg-maroon-500" : "w-1.5 bg-gray-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLearnPage() {
  const { userInfo } = useUserData() as any;
  const [tab, setTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const user = userInfo.user || {};

  const {
    data: modulesData,
    isLoading: modulesLoading,
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
    refetch: refetchContinue
  } = useGetContinueReadingQuery(undefined, {
    skip: tab !== "all",
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

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  // Close search on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchTerm("");
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSearch]);

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

  const getTabCount = (tabKey: TabKey) => {
    if (tabKey === "all") return modulesData?.data?.total || 0;
    return modules.filter((m: any) => {
      if (tabKey === "complete") return m.userTab === "complete";
      if (tabKey === "saved") return m.isSaved;
      return true;
    }).length;
  };

  const renderContinueItem = (item: any) => (
    <Link
      href={`/dashboard/learn/${item.moduleSlug}`}
      className="block bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="relative h-24 sm:h-28 md:h-32 flex items-center justify-center" style={{ background: item.gradient }}>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
          <div className="text-center w-full">
            <p className="text-white text-[10px] sm:text-xs font-medium">{item.progressPercent}% Complete</p>
            <div className="w-24 sm:w-32 h-1.5 bg-white/30 rounded-full mt-1.5 mx-auto">
              <div className="h-1.5 rounded-full bg-maroon-500" style={{ width: `${item.progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide" style={{ color: item.tagColor }}>
          {item.tag}
        </span>
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug mt-0.5 sm:mt-1 mb-0.5 line-clamp-2">{item.title}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">{item.currentSectionTitle}</p>
        <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1.5">{item.lastReadLabel}</p>
      </div>
    </Link>
  );

  const renderModuleItem = (mod: any) => (
    <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-32 sm:h-36 md:h-44 flex items-center justify-center" style={{ background: mod.gradient }}>
        {mod.thumbnailUrl ? (
          <img src={mod.thumbnailUrl} alt={mod.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-3xl sm:text-4xl font-bold text-white/20">{mod.categoryLabel[0]}</div>
        )}
        {mod.progressPercent > 0 && mod.progressPercent < 100 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
            {mod.progressPercent}% Complete
          </div>
        )}
        {mod.progressPercent === 100 && (
          <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
            Completed ✓
          </div>
        )}
        <button
          onClick={() => toggleSave(mod._id, mod.isSaved)}
          disabled={isTogglingSave}
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-50"
        >
          <Bookmark size={12} className={mod.isSaved ? "text-maroon-500 fill-maroon-500" : "text-gray-500"} />
        </button>
      </div>

      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: mod.categoryColor }}>
          {mod.categoryLabel}
        </span>
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug mb-1 line-clamp-2">{mod.title}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mb-2 flex-1 line-clamp-2">{mod.description}</p>

        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 text-[10px] sm:text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-0.5 sm:gap-1 font-semibold text-amber-500">
            <Star size={10} className="fill-amber-400 text-amber-400" />{mod.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Clock size={10} className="text-gray-400" />{mod.weeksDuration}w
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <BookOpen size={10} className="text-gray-400" />{mod.lessonCount} lessons
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-50">
          <div
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${mod.instructor.color}, ${mod.instructor.color}80)` }}
          >
            {mod.instructor.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{mod.instructor.name}</p>
          </div>
          {mod.enrolledAt ? (
            <Link
              href={`/dashboard/learn/${mod.slug}`}
              className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              <ChevronRight size={12} />
            </Link>
          ) : (
            <button
              onClick={() => handleEnrol(mod._id)}
              disabled={isEnrolling}
              className="flex-shrink-0 text-[9px] sm:text-[10px] font-semibold text-maroon-500 hover:text-maroon-500/80"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (modulesLoading && !modulesData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-maroon-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 sm:p-5 xl:p-8 overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-7">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Our Lessons</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button - only visible when search is closed */}
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 shadow-sm transition-colors"
              aria-label="Open search"
            >
              <Search size={14} className="text-gray-500" />
            </button>
          )}
          <NotificationBell />

          {user.role !== "lawyer" && (
            <Link
              href="/dashboard/consultations"
              className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[10px] sm:text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              Find my Lawyer
            </Link>
          )}
        </div>
      </div>

      {/* Absolute Search Overlay - Mobile & Desktop */}
      {showSearch && (
        <div className="absolute top-0 left-0 right-0 z-50 p-3 sm:p-5 xl:p-8 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-lg max-w-2xl mx-auto">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm outline-none bg-transparent w-full text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchTerm("");
              }}
              className="text-gray-400 hover:text-gray-600 font-medium text-xs flex-shrink-0 px-2"
            >
              Cancel
            </button>
          </div>
          {/* Backdrop click to close */}
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => {
              setShowSearch(false);
              setSearchTerm("");
            }}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-0.5 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const count = getTabCount(t.key);
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${tab === t.key
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
            >
              {t.label}
              <span className={`text-[10px] sm:text-[11px] font-medium ${tab === t.key ? "text-gray-500" : "text-gray-300"}`}>
                ({String(count).padStart(2, "0")})
              </span>
            </button>
          );
        })}
      </div>

      {/* Content with padding when search is open */}
      <div className={showSearch ? "opacity-50 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
        {/* Continue Reading Section */}
        {tab === "all" && continueReading.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Continue Reading</h2>
            <AutoSlideCarousel
              items={continueReading}
              itemsPerView={3}
              renderItem={renderContinueItem}
            />
          </div>
        )}

        {/* Module cards */}
        {modulesLoading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 animate-spin text-maroon-500" />
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm">No lessons found</p>
            {tab !== "all" && (
              <button
                onClick={() => setTab("all")}
                className="mt-2 text-maroon-500 text-xs sm:text-sm font-semibold"
              >
                View all lessons
              </button>
            )}
          </div>
        ) : (
          <div className="mb-6 sm:mb-10">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
              {tab === "all" ? "All Lessons" :
                tab === "complete" ? "Completed Lessons" : "Saved Lessons"}
            </h2>
            <AutoSlideCarousel
              items={modules}
              itemsPerView={3}
              renderItem={renderModuleItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}