"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, Clock, BookOpen, Search, ChevronRight, Check, 
  Loader2, FileText, Users, Award, PlayCircle, Lock,
  ChevronLeft, Bookmark, Share2, ExternalLink, Sparkles,
  X, RefreshCw, ArrowLeft
} from "lucide-react";
import {
  useGetLearnModuleBySlugQuery,
  useEnrolInModuleMutation,
  useToggleSaveModuleMutation,
} from "@/redux/slices/learn.slice";
import { substringWithMax } from "@/utils/function";

// Types for the summary response
interface SubtopicSummary {
  title: string;
  slug: string;
  summary: string;
  original_word_count: number;
  summary_word_count: number;
}

interface TopicSummary {
  title: string;
  slug: string;
  classification: string | null;
  subtopics: SubtopicSummary[];
  combined_word_count: number;
}

interface SummaryResponse {
  success: boolean;
  module_title: string;
  module_description: string;
  topics: TopicSummary[];
  total_word_count: number;
  summary_word_count: number;
  error: string | null;
}

// Summary View Component
function SummaryView({ 
  summary, 
  onBack,
  isLoading 
}: { 
  summary: SummaryResponse | null; 
  onBack: () => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mt-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sparkles size={48} className="text-[#E5E7EB] mb-4" />
        <p className="text-[15px] text-[#6B7280]">No summary available</p>
        <p className="text-[13px] text-[#9CA3AF] mt-1">This module doesn't have an AI summary yet.</p>
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-maroon-500 hover:bg-maroon-500/10 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Module
        </button>
      </div>
    );
  }

  // Calculate total original word count across all subtopics
  const totalOriginalWords = summary.topics.reduce((acc, topic) => 
    acc + topic.subtopics.reduce((subAcc, subtopic) => 
      subAcc + subtopic.original_word_count, 0
    ), 0
  );

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-start justify-between border-b border-[#F3F4F6] pb-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">{summary.module_title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[12px] text-[#9CA3AF]">
              {totalOriginalWords.toLocaleString()} total words
            </span>
            <span className="text-[12px] text-[#9CA3AF]">
              • {summary.topics.length} topics
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Module Description */}
      <div className="bg-[#F9FAFB] rounded-xl p-4">
        <p className="text-[13px] text-[#6B7280] leading-relaxed">
          {summary.module_description}
        </p>
      </div>

      {/* Topics */}
      {summary.topics.map((topic, idx) => (
        <div key={idx} className="border-t border-[#F3F4F6] pt-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-[15px] font-bold text-[#111827]">{topic.title}</h3>
            {topic.classification && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
                {topic.classification}
              </span>
            )}
            <span className="text-[10px] text-[#9CA3AF] ml-auto">
              {topic.combined_word_count} words summarized
            </span>
          </div>
          
          <div className="space-y-3">
            {topic.subtopics.map((subtopic, subIdx) => (
              <div key={subIdx} className="bg-white rounded-xl p-4 border border-[#F3F4F6]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-[#111827]">
                    {subtopic.title}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    {subtopic.original_word_count.toLocaleString()} words
                  </span>
                </div>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">
                  {subtopic.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="border-t border-[#F3F4F6] pt-4 flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <span>Total: {totalOriginalWords.toLocaleString()} original words</span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-maroon-500" />
          Summary
        </span>
      </div>
    </div>
  );
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [descOpen, setDescOpen] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);

  // Fetch module data
  const { 
    data: moduleData, 
    isLoading: moduleLoading, 
    error: moduleError,
    refetch: refetchModule 
  } = useGetLearnModuleBySlugQuery(slug, {
    skip: !slug,
  });

  const [enrolInModule, { isLoading: isEnrolling }] = useEnrolInModuleMutation();
  const [toggleSaveModule, { isLoading: isTogglingSave }] = useToggleSaveModuleMutation();

  const module = moduleData?.data;
  const topics = module?.topics || [];
  const completedCount = topics.filter((t: any) => t.completed).length;
  const progressPercent = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  // Check if materialSummary exists
  const hasSummary = !!module?.materialSummary;

  // Load existing summary if available
  React.useEffect(() => {
    if (module?.materialSummary && !summaryData) {
      try {
        const parsed = typeof module.materialSummary === 'string' 
          ? JSON.parse(module.materialSummary) 
          : module.materialSummary;
        setSummaryData(parsed);
      } catch (e) {
        console.error('Failed to parse summary:', e);
      }
    }
  }, [module?.materialSummary, summaryData]);

  const handleEnrol = async () => {
    if (!module) return;
    try {
      await enrolInModule(module._id).unwrap();
      refetchModule();
    } catch (error) {
      console.error("Failed to enrol:", error);
    }
  };

  const handleToggleSave = async () => {
    if (!module) return;
    try {
      await toggleSaveModule(module._id).unwrap();
      refetchModule();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleStartTopic = (topicSlug: string) => {
    router.push(`/dashboard/learn/${slug}/${topicSlug}`);
  };

  const handleViewSummary = async () => {
    if (!module) return;
    
    // If summary already loaded, just show it
    if (summaryData) {
      setShowSummary(true);
      return;
    }
    
    // If summary exists in module data but not loaded (shouldn't happen due to useEffect)
    if (module.materialSummary) {
      try {
        const parsed = typeof module.materialSummary === 'string' 
          ? JSON.parse(module.materialSummary) 
          : module.materialSummary;
        setSummaryData(parsed);
        setShowSummary(true);
        return;
      } catch (e) {
        console.error('Failed to parse summary:', e);
      }
    }
    
    // Otherwise, fetch the summary from the API
    setIsSummaryLoading(true);
    try {
      const response = await fetch('https://material-summary.onrender.com/api/v1/summary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: module.slug,
          max_words: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSummaryData(data);
      setShowSummary(true);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      // You could show a toast notification here
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleBackToModule = () => {
    setShowSummary(false);
  };

  if (moduleLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-maroon-500" />
      </div>
    );
  }

  if (moduleError || !module) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Module not found</p>
        <Link href="/dashboard/learn" className="text-maroon-500 font-semibold">
          Back to Learning
        </Link>
      </div>
    );
  }

  const isEnrolled = !!module.enrolledAt;

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/dashboard/learn" className="hover:text-gray-900 transition-colors">Learn</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-900 font-semibold truncate max-w-[300px]">
            {showSummary ? "Summary" : substringWithMax(module.title, 20)}
          </span>
        </nav>
        <div className="flex items-center gap-2">
          {hasSummary && (
            <button 
              onClick={handleViewSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-maroon-500 bg-maroon-500/10 hover:bg-maroon-500/20 transition-colors"
            >
              <Sparkles size={13} />
              {showSummary ? "View Module" : "Quick Summary"}
            </button>
          )}
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Search size={14} className="text-gray-500" />
          </button>
          <button 
            onClick={handleToggleSave}
            disabled={isTogglingSave}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Bookmark size={14} className={module.isSaved ? "text-maroon-500 fill-maroon-500" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden"
        style={{ background: module.gradient, backgroundRepeat: "no-repeat", backgroundSize:"cover", backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 text-center px-4">
          <span 
            className="inline-block text-xs  font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white mb-3"
          >
            {module.categoryLabel}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">
            {showSummary ? "Module Summary" : module.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
            {showSummary 
              ? "A concise overview of all topics and subtopics in this module"
              : (module.description.length > 120 ? module.description.slice(0, 120) + "..." : module.description)
            }
          </p>
          
          {!showSummary && !isEnrolled && (
            <button
              onClick={handleEnrol}
              disabled={isEnrolling}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              {isEnrolling ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
              Start Learning
            </button>
          )}
          
          {!showSummary && isEnrolled && topics.length && (
            <div className="flex gap-3 justify-center flex-wrap">
              {hasSummary && (
                <button
                  onClick={handleViewSummary}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
                >
                  <Sparkles size={14} className="inline mr-2" />
                  Quick Summary
                </button>
              )}
              <Link
                href={`/dashboard/learn/${slug}/${topics.find((t: any) => !t.completed)?.slug || topics[0]?.slug}`}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: hasSummary ? "linear-gradient(135deg, #6B7280, #9CA3AF)" : "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                {hasSummary ? "Dive Deeper" : "Continue Learning"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        
        {showSummary ? (
          // Summary View
          <SummaryView 
            summary={summaryData} 
            onBack={handleBackToModule}
            isLoading={isSummaryLoading}
          />
        ) : (
          // Original Module View
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Clock size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.weeksDuration}</p>
                    <p className="text-xs text-gray-500">Weeks duration</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <BookOpen size={18} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.topics.length}</p>
                    <p className="text-xs text-gray-500">Lessons</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Star size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Rating ({module.reviewCount})</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Users size={18} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.enrolledCount}</p>
                    <p className="text-xs text-gray-500">Users enrolled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor & Progress Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${module.instructor.color}, ${module.instructor.color}80)` }}
                  >
                    {module.instructor.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{module.instructor.name}</p>
                    <p className="text-sm text-gray-500">{module.instructor.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Course Instructor</p>
                  </div>
                </div>
                
                {isEnrolled && (
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Your Progress</span>
                      <span>{Math.floor(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPercent}%`,
                          background: "linear-gradient(90deg, #9B2E3D, #82212D)"
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {completedCount} of {topics.length} lessons completed
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Module Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="font-bold text-gray-900">About This Module</h2>
                <ChevronRight
                  size={18}
                  className={`text-gray-400 transition-transform ${descOpen ? "rotate-90" : ""}`}
                />
              </button>

              {descOpen && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {module.fullDescription || module.description}
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">What you'll learn:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-green-500" />
                        Understand key legal concepts in {module.categoryLabel}
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-green-500" />
                        Practical knowledge applicable to real-life situations
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-green-500" />
                        Rights and obligations under Nigerian law
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Topics / Lessons List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Module Content</h2>
                <p className="text-sm text-gray-500 mt-1">{topics.length} lessons • {module.totalWatchTimeMinutes} min total</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {topics.map((topic: any, index: number) => (
                  <div 
                    key={topic._id}
                    className={`px-6 py-4 ${topic.completed ? 'bg-green-50/20' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {topic.completed ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Check size={16} className="text-green-600" />
                            </div>
                          ) : topic.active ? (
                            <div className="w-8 h-8 rounded-full bg-maroon-500/10 flex items-center justify-center">
                              <PlayCircle size={16} className="text-maroon-500" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Lock size={14} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400">Lesson {index + 1}</span>
                            {topic.completed && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>
                            )}
                            {topic.active && !topic.completed && (
                              <span className="text-[10px] bg-maroon-500/10 text-maroon-500 px-2 py-0.5 rounded-full">Active</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {topic.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {isEnrolled && !topic.completed && (
                        <button
                          onClick={() => handleStartTopic(topic.slug)}
                          className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                          style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
                        >
                          Start Lesson
                        </button>
                      )}

                      {isEnrolled && topic.completed && (
                        <button
                          onClick={() => handleStartTopic(topic.slug)}
                          className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                          style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
                        >
                          Open
                        </button>
                      )}
                    
                      {!isEnrolled && (
                        <div className="flex-shrink-0 text-gray-400 text-xs font-medium">
                          Enrol to start
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Section */}
            {progressPercent === 100 && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-4 flex-wrap justify-between">
                  <div className="flex items-center gap-3">
                    <Award size={32} className="text-amber-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Congratulations!</h3>
                      <p className="text-sm text-gray-600">You've completed all lessons in this module</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Talk to a lawyer */}
            <div className="mt-8 rounded-2xl p-6 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #111827 0%, #1E3A5F 100%)" }}>
              <span className="text-4xl flex-shrink-0">⚖️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Need legal advice about {module.categoryLabel}?</p>
                <p className="text-xs text-gray-400 mt-0.5">Our verified lawyers specialise in this area</p>
              </div>
              <Link
                href="/dashboard/consultation"
                className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                Find my Lawyer
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}