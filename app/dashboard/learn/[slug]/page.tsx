"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, Clock, BookOpen, Search, ChevronRight, Check, 
  Loader2, FileText, Users, Award, PlayCircle, Lock,
  ChevronLeft, Bookmark, Share2, ExternalLink
} from "lucide-react";
import {
  useGetLearnModuleBySlugQuery,
  useEnrolInModuleMutation,
  useToggleSaveModuleMutation,
} from "@/redux/slices/learn.slice";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [descOpen, setDescOpen] = useState(true);
  const [showShare, setShowShare] = useState(false);

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

  console.log({topics})

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

  if (moduleLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8317A]" />
      </div>
    );
  }

  if (moduleError || !module) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Module not found</p>
        <Link href="/dashboard/learn" className="text-[#E8317A] font-semibold">
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
          <span className="text-gray-900 font-semibold truncate max-w-[300px]">{module.title}</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Search size={14} className="text-gray-500" />
          </button>
          <button 
            onClick={handleToggleSave}
            disabled={isTogglingSave}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Bookmark size={14} className={module.isSaved ? "text-[#E8317A] fill-[#E8317A]" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden"
        style={{ background: module.gradient }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <span 
            className="inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white mb-3"
          >
            {module.categoryLabel}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">
            {module.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
            {module.description.length > 120 ? module.description.slice(0, 120) + "..." : module.description}
          </p>
          
          {!isEnrolled ? (
            <button
              onClick={handleEnrol}
              disabled={isEnrolling}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              {isEnrolling ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
              Start Learning
            </button>
          ) : topics.length && (
            <div className="flex gap-3 justify-center">
              <Link
                href={`/dashboard/learn/${slug}/${topics.find((t: any) => !t.completed)?.slug || topics[0]?.slug}`}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
              >
                Continue Learning
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        
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
                <p className="text-xs text-gray-500">Students enrolled</p>
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
                      background: "linear-gradient(90deg, #E8317A, #ff6fa8)"
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
                        <div className="w-8 h-8 rounded-full bg-[#E8317A]/10 flex items-center justify-center">
                          <PlayCircle size={16} className="text-[#E8317A]" />
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
                          <span className="text-[10px] bg-[#E8317A]/10 text-[#E8317A] px-2 py-0.5 rounded-full">Active</span>
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
                      style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                    >
                      Start Lesson
                    </button>
                  )}
                  
                  {isEnrolled && topic.completed && (
                    <div className="flex-shrink-0 text-green-600 text-xs font-medium flex items-center gap-1">
                      <Check size={14} /> Completed
                    </div>
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
              <button className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                Download Certificate
              </button>
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
            href="/dashboard/marketplace"
            className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            Find a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}