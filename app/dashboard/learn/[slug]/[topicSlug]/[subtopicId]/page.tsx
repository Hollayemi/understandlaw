"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronRight, Check, Loader2, FileText, Award,
  ChevronLeft, Bookmark, Share2, List, Circle,
  GraduationCap, Zap, Menu, X, ChevronDown, ChevronUp,
  User, Calendar, Eye, ThumbsUp, MessageCircle, Heart,
  Flag, Copy, Link as LinkIcon,
  Send, Volume2, Maximize2, Clock, Users, Star
} from "lucide-react";
import {
  useGetLearnModuleBySlugQuery,
  useGetLearnTopicBySlugQuery,
  useMarkTopicCompleteMutation,
  useSaveVideoProgressMutation,
} from "@/redux/slices/learn.slice";

// Types
interface Subtopic {
  _id: string;
  title: string;
  notes: string;
  duration: string;
  durationSeconds: number;
  order: number;
  completed: boolean;
  completedBy: number;
  resources?: { name: string; url: string }[];
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

// Subtopic Navigation Item Component
const SubtopicNavItem = ({ 
  subtopic, 
  index, 
  isActive, 
  isCompleted,
  onClick 
}: { 
  subtopic: Subtopic;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${
        isActive 
          ? "bg-gradient-to-r from-[#E8317A]/10 to-transparent border-l-4 border-[#E8317A]" 
          : "hover:bg-gray-50"
      }`}
    >
      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={12} className="text-green-600" />
          </div>
        ) : isActive ? (
          <div className="w-6 h-6 rounded-full bg-[#E8317A]/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#E8317A]" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] font-medium text-gray-500">{index + 1}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          {subtopic.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock size={10} /> {subtopic.duration}
          </span>
          {subtopic.completedBy > 0 && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Users size={10} /> {subtopic.completedBy} completed
            </span>
          )}
        </div>
      </div>
      
      {/* Progress indicator if active */}
      {isActive && (
        <ChevronRight size={14} className="text-[#E8317A] flex-shrink-0" />
      )}
    </button>
  );
};


// Main Component
export default function SubtopicContentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const topicSlug = params?.topicSlug as string;
  const subtopicId = params?.subtopicId as string;
  
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch module and topic data
  const { data: moduleData, isLoading: moduleLoading } = useGetLearnModuleBySlugQuery(slug, {
    skip: !slug,
  });

  const { data: topicData, isLoading: topicLoading, refetch: refetchTopic } = useGetLearnTopicBySlugQuery(
    { moduleSlug: slug, topicSlug: topicSlug },
    { skip: !slug || !topicSlug }
  );

  const [markTopicComplete] = useMarkTopicCompleteMutation();

  const module = moduleData?.data;
  const topic = topicData?.data;
  const topics = module?.topics || [];

  // Initialize subtopics from fetched data
  useEffect(() => {
    if (topic?.subtopics) {
      const formattedSubtopics = topic.subtopics.map((st: any) => ({
        ...st,
        completed: completedSubtopics.has(st._id)
      }));
      setSubtopics(formattedSubtopics);
      
      // Set active subtopic
      if (subtopicId) {
        const found = formattedSubtopics.find((st: any) => st._id === subtopicId);
        if (found) setActiveSubtopic(found);
      } else if (formattedSubtopics.length > 0) {
        setActiveSubtopic(formattedSubtopics[0]);
      }
    }
  }, [topic, subtopicId, completedSubtopics]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock likes count
    setLikesCount(topic?.likes || 245);
    
    // Mock comments
    setComments([
      {
        _id: "1",
        userId: "user1",
        userName: "Chidi Okonkwo",
        userInitials: "CO",
        userColor: "#3B82F6",
        text: "This is really helpful! Thanks for breaking it down so clearly.",
        likes: 12,
        createdAt: new Date().toISOString(),
        replies: [
          {
            _id: "1-1",
            userId: "user2",
            userName: "Ada Eze",
            userInitials: "AE",
            userColor: "#10B981",
            text: "I agree! The examples make it much easier to understand.",
            likes: 3,
            createdAt: new Date().toISOString(),
          }
        ]
      },
      {
        _id: "2",
        userId: "user3",
        userName: "Emeka Nwosu",
        userInitials: "EN",
        userColor: "#F59E0B",
        text: "What happens if the police don't follow these procedures?",
        likes: 8,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]);
  }, [topic]);

  const currentIndex = topics.findIndex((t: any) => t.slug === topicSlug);
  const prevTopic = topics[currentIndex - 1];
  const nextTopic = topics[currentIndex + 1];
  const completedCount = topics.filter((t: any) => t.completed).length;
  const moduleProgressPercent = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;
  const subtopicProgress = subtopics.length > 0 ? (completedSubtopics.size / subtopics.length) * 100 : 0;

  const handleSubtopicComplete = async (subtopic: Subtopic) => {
    if (completedSubtopics.has(subtopic._id)) return;
    
    setCompletedSubtopics(prev => new Set([...prev, subtopic._id]));
    
    // Update completed count in UI
    setSubtopics(prev => prev.map(st => 
      st._id === subtopic._id ? { ...st, completed: true } : st
    ));
    
    // In production, call API to mark subtopic complete
    // await markSubtopicComplete(subtopic._id);
  };

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
    // In production, call API to like/unlike
  };

  const handleSave = () => {
    setSaved(!saved);
    // In production, call API to save
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      userInitials: "YO",
      userColor: "#E8317A",
      text: newComment,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleTopicComplete = async () => {
    if (!module || !topic) return;
    
    try {
      await markTopicComplete({
        moduleId: module._id,
        topicId: topic._id,
      }).unwrap();
      
      refetchTopic();
      
      if (nextTopic) {
        router.push(`/dashboard/learn/${slug}/${nextTopic.slug}`);
      }
    } catch (error) {
      console.error("Failed to mark topic complete:", error);
    }
  };

  const navigateToSubtopic = (subtopic: Subtopic) => {
    setActiveSubtopic(subtopic);
    router.push(`/dashboard/learn/${slug}/${topicSlug}/${subtopic._id}`, { scroll: false });
    
    // Smooth scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const allSubtopicsCompleted = completedSubtopics.size === subtopics.length && subtopics.length > 0;

  if (moduleLoading || topicLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8317A]" />
      </div>
    );
  }

  if (!module || !topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Content not found</p>
        <Link href={`/dashboard/learn/${slug}`} className="text-[#E8317A] font-semibold">
          Back to Module
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto">
            <Link href="/dashboard/learn" className="hover:text-gray-900 whitespace-nowrap">Learn</Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href={`/dashboard/learn/${slug}`} className="hover:text-gray-900 truncate max-w-[120px] md:max-w-[200px] whitespace-nowrap">
              {module.title}
            </Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href={`/dashboard/learn/${slug}/${topicSlug}`} className="hover:text-gray-900 truncate max-w-[100px] md:max-w-[150px] whitespace-nowrap">
              {topic.title}
            </Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-[120px] whitespace-nowrap">
              {activeSubtopic?.title || "Reading"}
            </span>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Bookmark size={14} className={saved ? "text-[#E8317A] fill-[#E8317A]" : "text-gray-600"} />
            </button>
            
            <div className="relative">
              <button 
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Share2 size={14} className="text-gray-600" />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                  <button onClick={copyLink} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LinkIcon size={14} /> Copy Link
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {/* <Twitter size={14} /> Share on Twitter */}
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {/* <Facebook size={14} /> Share on Facebook */}
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {/* <Linkedin size={14} /> Share on LinkedIn */}
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
        
        {/* Module Progress Bar */}
        <div className="border-t border-gray-100 px-4 md:px-6 py-2">
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
                    background: "linear-gradient(90deg, #E8317A, #ff6fa8)"
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {completedCount}/{topics.length} lessons
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN - Main Content */}
          <div className={`flex-1 ${sidebarOpen ? 'lg:pr-4' : ''}`}>
            <div ref={contentRef}>
              
              {/* Content Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Section {activeSubtopic?.order || 1} of {subtopics.length}
                        </span>
                        {completedSubtopics.has(activeSubtopic?._id || "") && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {activeSubtopic?.title || "Loading..."}
                      </h1>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {activeSubtopic?.duration || "0:00"} read
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {activeSubtopic?.completedBy || 0} completed
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                          liked 
                            ? "bg-[#E8317A]/10 text-[#E8317A]" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Heart size={14} className={liked ? "fill-[#E8317A]" : ""} />
                        <span>{likesCount}</span>
                      </button>
                      
                      {!completedSubtopics.has(activeSubtopic?._id || "") && (
                        <button
                          onClick={() => activeSubtopic && handleSubtopicComplete(activeSubtopic)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                        >
                          <Check size={14} /> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Main Content Body */}
                <div className="p-6 md:p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {activeSubtopic?.notes || (
                        <div className="text-center py-12 text-gray-400">
                          <FileText size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No content available for this section.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Resources Section */}
                  {activeSubtopic?.resources && activeSubtopic.resources.length > 0 && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <FileText size={14} className="text-blue-600" />
                        Additional Resources
                      </h3>
                      <div className="space-y-2">
                        {activeSubtopic.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <LinkIcon size={12} /> {resource.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Navigation Between Subtopics */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    {/* Previous Subtopic */}
                    <div>
                      {subtopics.findIndex(s => s._id === activeSubtopic?._id) > 0 && (
                        <button
                          onClick={() => {
                            const currentIdx = subtopics.findIndex(s => s._id === activeSubtopic?._id);
                            navigateToSubtopic(subtopics[currentIdx - 1]);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#E8317A] transition-colors"
                        >
                          <ChevronLeft size={16} /> Previous Section
                        </button>
                      )}
                    </div>
                    
                    {/* Next Subtopic */}
                    <div>
                      {subtopics.findIndex(s => s._id === activeSubtopic?._id) < subtopics.length - 1 && (
                        <button
                          onClick={() => {
                            const currentIdx = subtopics.findIndex(s => s._id === activeSubtopic?._id);
                            navigateToSubtopic(subtopics[currentIdx + 1]);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#E8317A] transition-colors"
                        >
                          Next Section <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Lesson Completion Card */}
              {allSubtopicsCompleted && !topic.completed && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Award size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Congratulations!</h3>
                        <p className="text-sm text-gray-600">You've completed all sections in this lesson.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleTopicComplete}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                    >
                      Complete Lesson & Continue
                    </button>
                  </div>
                </div>
              )}
              
              {/* Like and Discussion Section */}
              <div className="mt-6">
                {/* Like/Share Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                          liked 
                            ? "bg-[#E8317A]/10 text-[#E8317A]" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Heart size={16} className={liked ? "fill-[#E8317A]" : ""} />
                        Like ({likesCount})
                      </button>
                      
                      <button
                        onClick={() => setShowDiscussion(!showDiscussion)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <MessageCircle size={16} />
                        Discussion ({comments.length})
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                        <Flag size={12} /> Report
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Comments Section */}
                {/* {showDiscussion && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Discussion ({comments.length})</h3>
                    </div>
                    
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          Y
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts or ask a question..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E8317A] resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handleCommentSubmit}
                              className="px-4 py-2 bg-[#E8317A] text-white rounded-lg text-sm font-semibold hover:bg-[#E8317A]/90 transition-all"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    
                  </div>
                )} */}
              </div>
              
              {/* Next/Prev Lesson Navigation */}
              <div className="mt-6 flex justify-between gap-3">
                {prevTopic && (
                  <Link
                    href={`/dashboard/learn/${slug}/${prevTopic.slug}`}
                    className="flex-1 flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all group"
                  >
                    <ChevronLeft size={16} className="text-gray-400 group-hover:text-gray-600" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Previous Lesson</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{prevTopic.title}</p>
                    </div>
                  </Link>
                )}
                
                {nextTopic && (
                  <Link
                    href={`/dashboard/learn/${slug}/${nextTopic.slug}`}
                    className={`flex-1 flex items-center justify-end gap-2 p-4 rounded-xl transition-all group ${
                      allSubtopicsCompleted
                        ? "bg-gradient-to-r from-[#E8317A]/10 to-[#ff6fa8]/10 border border-[#E8317A]/20"
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Next Lesson</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{nextTopic.title}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* RIGHT SIDEBAR - Subtopics Navigation */}
          {sidebarOpen && (
            <div className="lg:w-80 flex-shrink-0 sticky top-28">
              <div className="sticky top-28 space-y-5">
                
                {/* Lesson Progress Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Lesson Progress</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-[#E8317A]">{subtopicProgress.toFixed(0)}%</div>
                      <p className="text-xs text-gray-500">
                        {completedSubtopics.size} of {subtopics.length} sections completed
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${subtopicProgress}%`,
                          background: "linear-gradient(90deg, #E8317A, #ff6fa8)"
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sections List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <List size={14} className="text-[#E8317A]" />
                      Lesson Sections
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {subtopics.map((subtopic, idx) => (
                      <SubtopicNavItem
                        key={subtopic._id}
                        subtopic={subtopic}
                        index={idx}
                        isActive={activeSubtopic?._id === subtopic._id}
                        isCompleted={completedSubtopics.has(subtopic._id)}
                        onClick={() => navigateToSubtopic(subtopic)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* AI Help Chat Button */}
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] text-white hover:shadow-lg transition-all"
                >
                  <MessageCircle size={18} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">Ask AI Assistant</p>
                    <p className="text-[10px] opacity-80">Get help understanding this topic</p>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Learning Assistant</h3>
            </div>
            <button onClick={() => setShowAIChat(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600">Hi! I can help explain concepts in this lesson. What would you like to know?</p>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8317A]"
              />
              <button className="px-3 py-2 bg-[#E8317A] text-white rounded-lg">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}