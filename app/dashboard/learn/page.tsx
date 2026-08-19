"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Bell, Bookmark, ChevronLeft, ChevronRight, Clock, BookOpen, Star, Loader2, Play, Pause } from "lucide-react";
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
  // { key: "active",   label: "Active" },
  { key: "complete", label: "Complete" },
  { key: "saved", label: "Saved" },
];

// Auto-sliding carousel component with smooth sliding and responsive items
function AutoSlideCarousel({
  items,
  renderItem,
  itemsPerView = 3,
  onSlideChange
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

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return itemsPerView;
    const width = window.innerWidth;
    if (width < 640) return 1.5; // Mobile: show 1.5 items
    if (width < 1024) return 2; // Tablet: show 2 items
    return itemsPerView; // Desktop: show configured items
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getItemsPerView());

  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = items.length;
  const totalSlides = Math.ceil(totalItems / currentItemsPerView);
  const currentSlide = Math.floor(currentIndex / currentItemsPerView);

  // Calculate the width of each item
  const itemWidth = 100 / currentItemsPerView;
  const translateX = -(currentIndex * itemWidth);

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    if (onSlideChange) onSlideChange(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Navigate to next slide
  const nextSlide = () => {
    const nextIndex = currentIndex + currentItemsPerView;
    if (nextIndex >= totalItems) {
      goToSlide(0);
    } else {
      goToSlide(nextIndex);
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    const prevIndex = currentIndex - currentItemsPerView;
    if (prevIndex < 0) {
      const lastSlideIndex = Math.max(0, totalItems - currentItemsPerView);
      goToSlide(lastSlideIndex);
    } else {
      goToSlide(prevIndex);
    }
  };

  // Auto-slide logic
  useEffect(() => {
    if (isPlaying && !isHovered && totalItems > currentItemsPerView) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, currentIndex, totalItems, currentItemsPerView]);

  // Reset to first slide when items change
  useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(false);
  }, [items.length]);

  if (totalItems === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Controls */}
      {totalItems > currentItemsPerView && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={14} className="text-gray-600" /> : <Play size={14} className="text-maroon-500" />}
            </button>
            <span className="text-[10px] text-gray-400 font-medium">
              {isPlaying ? "Auto-sliding" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={14} className="text-gray-600" />
            </button>

            {/* Slide indicators */}
            <div className="hidden md:flex  gap-1.5 px-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx * currentItemsPerView)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-maroon-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-maroon-500 transition-colors shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Slide content with smooth sliding */}
      <div className="overflow-hidden">
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
              className="flex-shrink-0 px-2"
              style={{ width: `${itemWidth}%` }}
            >
              <div className="h-full">
                {renderItem(item, idx)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLearnPage() {
  const { userInfo } = useUserData() as any
  const [tab, setTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState<string>("all");

  const user = userInfo.user || {}



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

  console.log(featuredTopics)

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
      // if (tabKey === "active") return m.userTab === "active";
      if (tabKey === "complete") return m.userTab === "complete";
      if (tabKey === "saved") return m.isSaved;
      return true;
    }).length;
  };

  // Render continue reading item
  const renderContinueItem = (item: any) => (
    <Link
      href={`/dashboard/learn/${item.moduleSlug}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="relative h-32 flex items-center justify-center" style={{ background: item.gradient }}>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xs font-medium">{item.progressPercent}% Complete</p>
            <div className="w-32 h-1.5 bg-white/30 rounded-full mt-2 mx-auto">
              <div
                className="h-1.5 rounded-full bg-maroon-500"
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
  );

  // Render module item
  const renderModuleItem = (mod: any) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            className={mod.isSaved ? "text-maroon-500 fill-maroon-500" : "text-gray-500"}
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
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              <ChevronRight size={13} />
            </Link>
          ) : (
            <button
              onClick={() => handleEnrol(mod._id)}
              disabled={isEnrolling}
              className="flex-shrink-0 text-[10px] font-semibold text-maroon-500 hover:text-maroon-500/80"
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
    <div className="flex-1 p-5 xl:p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-bold text-gray-900">Our Lessons</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch ? (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
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
          <NotificationBell />

          {user.role !== "lawyer" && <Link
            href="/dashboard/consultations"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
          >
            Find my Lawyer
          </Link>}
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
              className={`flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${tab === t.key
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
          <AutoSlideCarousel
            items={continueReading}
            itemsPerView={3}
            renderItem={renderContinueItem}
          />
        </div>
      )}

      {/* Module cards */}
      {modulesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-maroon-500" />
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No lessons found</p>
          {tab !== "all" && (
            <button
              onClick={() => setTab("all")}
              className="mt-2 text-maroon-500 text-sm font-semibold"
            >
              View all lessions
            </button>
          )}
        </div>
      ) : (
        <div className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {tab === "all" ? "All Lessons" :
              tab === "active" ? "Active Lessons" :
                tab === "complete" ? "Completed Lessons" : "Saved Lessons"}
          </h2>
          <AutoSlideCarousel
            items={modules}
            itemsPerView={3}
            renderItem={renderModuleItem}
          />
        </div>
      )}

      {/* Featured Topics */}
      <div className="hidden">
        <h2 className="text-base font-bold text-gray-900 mb-4">Featured Topics</h2>
        {featuredLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-maroon-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {featuredTopics.map((f: any) => (
              <Link
                key={f._id}
                href={`/dashboard/learn/${f.module}/${f.slug}`}
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