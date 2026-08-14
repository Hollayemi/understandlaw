"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Play, Pause, Volume2, Maximize2, Star, Clock, BookOpen,
  Search, ChevronRight, Check, Loader2, FileText, Award,
  ChevronLeft, Bookmark, Share2, List, Lock, Circle,
  GraduationCap, Zap, Menu, X, ChevronDown, ChevronUp,
  User, Calendar, Eye, ThumbsUp, MessageCircle,
  Users
} from "lucide-react";
import {
  useGetLearnModuleBySlugQuery,
  useGetLearnTopicBySlugQuery,
  useMarkTopicCompleteMutation,
  useSaveVideoProgressMutation,
} from "@/redux/slices/learn.slice";
import AskQuestionButton from "@/app/dashboard/community/_components/AskQuestionButton";
import ReadAloudButton from "@/app/components/ui/ReadAloudButton";

// Subtopic Component for rendering individual subtopic content
const SubtopicContent = ({
  subtopic,
  isActive,
  onComplete,
  isCompleted
}: {
  subtopic: any;
  isActive: boolean;
  onComplete?: () => void;
  isCompleted?: boolean;
}) => {
  const [expanded, setExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setExpanded(true);
    }
  }, [isActive]);

  return (
    <div
      className={`border rounded-xl transition-all duration-300 ${isActive
        ? "border-[#F97316] shadow-md bg-white"
        : "border-gray-200 bg-white hover:border-gray-300"
        }`}
    >
      <button

        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCompleted
            ? "bg-green-100"
            : isActive
              ? "bg-[#F97316]/10"
              : "bg-gray-100"
            }`}>
            {isCompleted ? (
              <Check size={12} className="text-green-600" />
            ) : isActive ? (
              <div className="w-2 h-2 rounded-full bg-[#F97316]" />
            ) : (
              <span className="text-[10px] text-gray-400">
                {subtopic.order || "•"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${isActive ? "text-[#F97316]" : "text-gray-900"
              }`}>
              {subtopic.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {subtopic.duration}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Users size={10} /> {subtopic.completedBy || 0} completed
              </span>
            </div>
          </div>
          <div className="flex items-center">

            <ReadAloudButton
              text={`
                  ${subtopic.title}.
                  ${subtopic.notes}.
              `}
            />

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center ml-3 justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2"
              aria-label="Voice settings"
            >
              {expanded ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="prose prose-sm max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[#F97316]" />
                <span className="text-xs font-semibold text-gray-700">Notes</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {subtopic.notes || "No additional notes for this section."}
              </p>
            </div>

            {subtopic.resources && subtopic.resources.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Resources:</p>
                <div className="flex gap-2">
                  {subtopic.resources.map((resource: any, i: number) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#F97316] hover:underline flex items-center gap-1"
                    >
                      <FileText size={10} /> {resource.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {onComplete && !isCompleted && (
            <button
              onClick={onComplete}
              className="mt-3 text-xs text-[#F97316] font-semibold hover:underline"
            >
              Mark this section as complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const topicSlug = params?.topicSlug as string;

  const [playing, setPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<string>>(new Set());
  const [descExpanded, setDescExpanded] = useState(true);
  const videoProgressInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch module data for context
  const {
    data: moduleData,
    isLoading: moduleLoading
  } = useGetLearnModuleBySlugQuery(slug, {
    skip: !slug,
  });

  // Fetch current topic data
  const {
    data: topicData,
    isLoading: topicLoading,
    refetch: refetchTopic
  } = useGetLearnTopicBySlugQuery(
    { moduleSlug: slug, topicSlug: topicSlug },
    { skip: !slug || !topicSlug }
  );

  const [markTopicComplete, { isLoading: isCompleting }] = useMarkTopicCompleteMutation();
  const [saveVideoProgress] = useSaveVideoProgressMutation();

  const module = moduleData?.data;
  const topic = topicData?.data;
  const topics = module?.topics || [];
  const subtopics = topic?.subtopics || [];

  console.log("Topic Data:", topic);
  console.log("Subtopics:", subtopics);

  // Set first subtopic as active by default
  // useEffect(() => {
  //   if (subtopics.length > 0 && !activeSubtopicId) {
  //     setActiveSubtopicId(subtopics[0]._id);
  //   }
  // }, [subtopics]);

  // Find current topic index and next/prev topics
  const currentIndex = topics.findIndex((t: any) => t.slug === topicSlug);
  const currentTopic = topics[currentIndex];
  const nextTopic = topics[currentIndex + 1];
  const prevTopic = topics[currentIndex - 1];
  const completedCount = topics.filter((t: any) => t.completed).length;
  const moduleProgressPercent = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  // Auto-save video progress
  useEffect(() => {
    if (playing && topic) {
      videoProgressInterval.current = setInterval(() => {
        // Simulate progress - in real app, get from video element
        const mockProgress = Math.min((topic.progressPercent || 0) + 1, 100);
      }, 5000);
    } else if (videoProgressInterval.current) {
      clearInterval(videoProgressInterval.current);
      videoProgressInterval.current = null;
    }

    return () => {
      if (videoProgressInterval.current) {
        clearInterval(videoProgressInterval.current);
      }
    };
  }, [playing, topic]);

  const handleMarkComplete = async () => {
    if (!module || !topic) return;

    try {
      const result = await markTopicComplete({
        moduleId: module._id,
        topicId: topic._id,
      }).unwrap();

      if (result.data?.certificateUnlocked) {
        alert("🎉 Congratulations! You've unlocked your certificate!");
      }

      refetchTopic();

      // Auto-navigate to next topic
      if (nextTopic) {
        setTimeout(() => {
          router.push(`/dashboard/learn/${slug}/topic/${nextTopic.slug}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to mark topic complete:", error);
    }
  };

  const handleSubtopicComplete = (subtopicId: string) => {
    setCompletedSubtopics(prev => new Set([...prev, subtopicId]));
  };

  const getYouTubeEmbedUrl = () => {
    if (!topic?.videoUrl) return "";
    const videoId = topic.videoUrl.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&enablejsapi=1`;
  };

  const subtopicProgress = subtopics.length > 0
    ? (completedSubtopics.size / subtopics.length) * 100
    : 0;
  const isCompleted = topic?.completed || false;

  if (moduleLoading || topicLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  if (!module || !topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Topic not found</p>
        <Link href={`/dashboard/learn/${slug}`} className="text-[#F97316] font-semibold">
          Back to Module
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 md:px-6 py-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto">
          <Link href="/dashboard/learn" className="hover:text-gray-900 transition-colors whitespace-nowrap">
            Learn
          </Link>
          <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
          <Link
            href={`/dashboard/learn/${slug}`}
            className="hover:text-gray-900 transition-colors truncate max-w-[120px] md:max-w-[200px] whitespace-nowrap"
          >
            {module.title}
          </Link>
          <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
          <span className="text-gray-900 font-semibold truncate max-w-[150px] md:max-w-[300px] whitespace-nowrap">
            {topic.title}
          </span>
        </nav>
        <div className="flex items-center gap-2">
          {/* <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Search size={14} className="text-gray-600" />
          </button> */}
          {/* <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button> */}
        </div>
      </div>

      {/* Module Progress Bar */}
      <div className="sticky hidden top-[57px] z-10 bg-white border-b border-gray-100 px-4 md:px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
              <span>Module Progress</span>
              <span>{Math.floor(moduleProgressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${moduleProgressPercent}%`,
                  background: "linear-gradient(90deg, #F97316, #EA580C)"
                }}
              />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 whitespace-nowrap">
            {completedCount}/{topics.length} lessons
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Video Player Section */}
        <div className="bg-white  rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-6">
          <div className="relative w-" style={{ aspectRatio: "4/3" }}>
            {topic.videoType === "youtube" && topic.videoUrl ? (
              <iframe
                src={getYouTubeEmbedUrl()}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : topic.videoType === "upload" && topic.videoUrl ? (
              <video
                src={topic.videoUrl}
                className="w-full h-full"
                controls
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ background: module.gradient }}
              >
                <FileText size={64} className="text-white/30 mb-4" />
                <p className="text-white/60 text-sm">No video content. Continue to reading material.</p>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN - Topic Content */}
          <div className={`flex-1 ${sidebarOpen ? 'lg:pr-4' : ''}`}>

            {/* Topic Header */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-5">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={22} className="text-[#F97316]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      Lesson {currentIndex + 1} of {topics.length}
                    </span>
                    <h1 className="font-bold text-gray-900 text-xl md:text-2xl mt-1">
                      {topic.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {topic.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {topic.watchCount || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} /> {topic.likes || 0} likes
                      </span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleting}
                    className="px-5 hidden py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2 shadow-md"
                    style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                  >
                    {isCompleting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                    Mark Lesson Complete
                  </button>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                    <Check size={18} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-5 overflow-hidden">
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#F97316]" />
                  <h2 className="font-bold text-gray-900">Lesson Overview</h2>
                </div>
                {descExpanded ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>

              {descExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {topic.overview || topic.classification || "No overview available for this lesson."}
                    </p>
                  </div>

                  {/* Instructor info */}
                  <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${module.instructor.color}, ${module.instructor.color}80)` }}
                    >
                      {module.instructor.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{module.instructor.name}</p>
                      <p className="text-[10px] text-gray-500">Course Instructor</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subtopics Section - Main learning content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <List size={18} className="text-[#F97316]" />
                      Lesson Content
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {subtopics.length} sections • {subtopicProgress.toFixed(0)}% complete
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col items-end">
                      {subtopics?.[0]?._id && <Link href={`/dashboard/learn/${slug}/${topicSlug}/${subtopics?.[0]?._id}`} className="text-sm text-right! underline text-[#F97316]">Open Lesson</Link>}
                      {/* <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${subtopicProgress}%`,
                              background: "linear-gradient(90deg, #F97316, #EA580C)"
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#F97316]">
                          {completedSubtopics.size}/{subtopics.length}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {subtopics.map((subtopic: any) => (
                  <SubtopicContent
                    key={subtopic._id}
                    subtopic={subtopic}
                    isActive={activeSubtopicId === subtopic._id}
                    isCompleted={completedSubtopics.has(subtopic._id)}
                    onComplete={() => handleSubtopicComplete(subtopic._id)}
                  />
                ))}

                {subtopics.length === 0 && (
                  <div className="text-center py-8">
                    <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No subtopics available for this lesson.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Discussion Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-5">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#F97316]" />
                  Discussion
                </h3>
              </div>
              <div className="p-5  text-gray-500">
                <p className="text-sm text-center">Have questions about this lesson?</p>
                <div className="w-full mx-auto py-3">
                  <AskQuestionButton />
                </div>
                {/* <button className="mt-2 text-sm text-[#F97316] font-semibold hover:underline">
                  Ask a question
                </button> */}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Quick Navigation (Desktop) */}
          {sidebarOpen && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-28 space-y-5">

                {/* Lesson Progress Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Your Progress</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-[#F97316]">{subtopicProgress.toFixed(0)}%</div>
                      <p className="text-xs text-gray-500">Lesson Complete</p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${subtopicProgress}%`,
                          background: "linear-gradient(90deg, #F97316, #EA580C)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Subtopic Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <Menu size={14} className="text-[#F97316]" />
                      Jump to Section
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {subtopics.map((subtopic: any, idx: number) => (
                      <button
                        key={subtopic._id}
                        onClick={() => {
                          setActiveSubtopicId(subtopic._id);
                          document.getElementById(`subtopic-${subtopic._id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }}
                        className={`w-full flex items-center gap-2 p-3 text-left transition-colors hover:bg-gray-50 ${activeSubtopicId === subtopic._id ? 'bg-pink-50/50' : ''
                          }`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${completedSubtopics.has(subtopic._id)
                          ? "bg-green-100"
                          : activeSubtopicId === subtopic._id
                            ? "bg-[#F97316]/10"
                            : "bg-gray-100"
                          }`}>
                          {completedSubtopics.has(subtopic._id) ? (
                            <Check size={10} className="text-green-600" />
                          ) : (
                            <span className="text-[9px] text-gray-500">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`text-xs flex-1 truncate ${activeSubtopicId === subtopic._id ? 'font-semibold text-[#F97316]' : 'text-gray-600'
                          }`}>
                          {subtopic.title}
                        </span>
                        <span className="text-[9px] text-gray-400">{subtopic.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next/Prev Navigation */}
                <div className="space-y-2">
                  {prevTopic && (
                    <Link
                      href={`/dashboard/learn/${slug}/topic/${prevTopic.slug}`}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all group"
                    >
                      <ChevronLeft size={16} className="text-gray-400 group-hover:text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400">Previous Lesson</p>
                        <p className="text-xs font-medium text-gray-700 truncate">{prevTopic.title}</p>
                      </div>
                    </Link>
                  )}

                  {nextTopic && !isCompleted && (
                    <button
                      onClick={() => router.push(`/dashboard/learn/${slug}/topic/${nextTopic.slug}`)}
                      className="w-full flex items-center justify-end gap-2 p-3 rounded-xl bg-gradient-to-r from-[#F97316]/10 to-[#EA580C]/10 border border-[#F97316]/20 transition-all group"
                    >
                      <div className="flex-1 text-right min-w-0">
                        <p className="text-[10px] text-[#F97316]">Next Lesson</p>
                        <p className="text-xs font-medium text-gray-700 truncate">{nextTopic.title}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#F97316]" />
                    </button>
                  )}
                </div>

                {/* XP Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Zap size={18} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-700">Complete this lesson</p>
                      <p className="text-[10px] text-amber-600">Earn +50 XP and maintain your streak!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}