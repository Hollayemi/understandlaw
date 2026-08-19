"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight, ArrowLeft, Save, Edit2, Trash2, Plus, Upload, Video, Eye, Heart,
  MessageSquare, CheckCircle, Clock, 
  GripVertical, ChevronDown, ChevronUp, BookOpen,
  Layers, Target, BarChart3,
  AlertCircle, Loader2, Check, PlayCircle,
} from "lucide-react";
import {
  useGetModuleByIdQuery,
  useGetTopicByIdQuery,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useGetSubTopicsQuery,
  useCreateSubTopicMutation,
  useUpdateSubTopicMutation,
  useUpdateSubTopicNotesMutation,
  useDeleteSubTopicMutation,
  useGetTopicAnalyticsQuery,
  useGetCommentsQuery,
  useResolveCommentMutation,
  useDeleteCommentMutation,
} from "@/redux/slices/admin/modules.slice";
import type { 
  SubTopic, 
  TopicStatus, 
  VideoType,
  Comment,
} from "@/redux/slices/types";

// Topic Status Config
const TOPIC_STATUS_CFG: Record<TopicStatus, { bg: string; text: string; dot: string; label: string }> = {
  published: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981", label: "Published" },
  draft:     { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF", label: "Draft" },
  pending:   { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", label: "Pending Review" },
};

// Category Config for display
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  criminal:    { label: "Police & Criminal",    color: "#3B82F6", bg: "#EFF6FF" },
  tenancy:     { label: "Landlord & Tenancy",   color: "#10B981", bg: "#ECFDF5" },
  employment:  { label: "Employment & Labour",  color: "#8B5CF6", bg: "#F5F3FF" },
  contracts:   { label: "Contracts & Agreements", color: "#F59E0B", bg: "#FFFBEB" },
  business:    { label: "Business & Commerce",  color: "#06B6D4", bg: "#ECFEFF" },
  family:      { label: "Family & Personal",    color: "#EF4444", bg: "#FEF2F2" },
  consumer:    { label: "Consumer Rights",      color: "#9B2E3D", bg: "#FFF0F5" },
  road:        { label: "Road Traffic",         color: "#9B2E3D", bg: "#FFF7ED" },
};

// Notes Editor Component
function NotesEditor({ 
  st, 
  moduleId, 
  topicId, 
  onSave,
  onDelete,
}: { 
  st: SubTopic; 
  moduleId: string; 
  topicId: string;
  onSave: (st: SubTopic) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(st.notes);
  const [title, setTitle] = useState(st.title);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  
  const [updateSubTopicNotes] = useUpdateSubTopicNotesMutation();
  const [updateSubTopic] = useUpdateSubTopicMutation();

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const result = await updateSubTopicNotes({
        moduleId,
        topicId,
        subtopicId: st.id,
        notes,
      }).unwrap();
      onSave({ ...st, notes: result.data.notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTitle = async () => {
    if (title === st.title) {
      setEditingTitle(false);
      return;
    }
    try {
      const result = await updateSubTopic({
        moduleId,
        topicId,
        subtopicId: st.id,
        title,
      }).unwrap();
      onSave({ ...st, title: result.data.title });
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to save title:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F9FAFB] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        onClick={() => setExpanded(!expanded)}>
        <GripVertical size={15} className="text-[#D1D5DB] flex-shrink-0 cursor-grab" />
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-maroon-500 to-maroon-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          {st.order}
        </div>
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={e => e.key === "Enter" && handleSaveTitle()}
              className="text-[13px] font-bold text-[#111827] bg-white border border-maroon-500 rounded-lg px-2 py-0.5 outline-none w-64"
              autoFocus
            />
          ) : (
            <p className="text-[13px] font-bold text-[#111827] truncate">{title}</p>
          )}
          <p className="text-[10px] text-[#9CA3AF] flex items-center gap-2 mt-0.5">
            <Clock size={9} /> {st.duration || "—"}
            <span className="flex items-center gap-1 ml-1"><CheckCircle size={9} className="text-[#10B981]" /> {st.completedBy?.toLocaleString() || 0} completed</span>
            <span className="flex items-center gap-1"><Eye size={9} /> {st.viewCount?.toLocaleString() || 0} views</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={e => { e.stopPropagation(); setEditingTitle(!editingTitle); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <button 
            onClick={e => { e.stopPropagation(); onDelete(st.id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
          </button>
          {expanded ? <ChevronUp size={15} className="text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown size={15} className="text-[#9CA3AF] flex-shrink-0" />}
        </div>
      </div>

      {expanded && (
        <div className="p-5">
          {/* Notes/Script editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Instructor Notes & Script
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF]">{notes?.length || 0} chars</span>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={`Write detailed notes, script points, talking points, and key concepts for this sub-topic.\n\nYou can include:\n• Legal citations and section references\n• Word-for-word scripts\n• Common questions and answers\n• Real-world examples`}
                className="w-full h-56 px-4 py-3.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] leading-relaxed resize-none outline-none focus:border-maroon-500 placeholder:text-[#D1D5DB] transition-colors font-mono"
              />
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-maroon-500" />
                <span className="text-[10px] text-[#9CA3AF]">Notes are private, visible only to the admin and instructor</span>
              </div>
              <button onClick={handleSaveNotes} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-maroon-500 hover:bg-maroon-600 disabled:opacity-60 transition-colors">
                {saving ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                        : saved ? <><Check size={11} /> Saved!</>
                        : <><Save size={11} /> Save Notes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Comment Component
function CommentItem({ 
  comment, 
  onResolve,
  onDelete,
}: { 
  comment: Comment; 
  onResolve: (id: string, resolved: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    setIsResolving(true);
    await onResolve(comment.id, !comment.resolved);
    setIsResolving(false);
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${comment.resolved ? "border-[#F3F4F6] opacity-70" : "border-[#E5E7EB] shadow-sm"}`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${comment.userColor}, ${comment.userColor}80)` }}>
            {comment.userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[13px] font-bold text-[#111827]">{comment.userName}</span>
              <span className="text-[11px] text-[#9CA3AF]">{new Date(comment.createdAt).toLocaleString()}</span>
              {comment.resolved && (
                <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={9} /> Resolved
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#374151] leading-relaxed">{comment.text}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                <Heart size={11} /> {comment.likes} likes
              </span>
              <button 
                onClick={handleResolve}
                disabled={isResolving}
                className={`text-[11px] font-semibold transition-colors ${comment.resolved ? "text-[#9CA3AF] hover:text-[#EF4444]" : "text-[#10B981] hover:text-[#059669]"} disabled:opacity-50`}>
                {comment.resolved ? "Re-open" : "✓ Mark Resolved"}
              </button>
              <button 
                onClick={() => onDelete(comment.id)}
                className="text-[11px] font-semibold text-[#EF4444] hover:text-[#dc2626] transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.id as string;
  const topicId = params?.topicId as string;

  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "analytics" | "comments">("content");
  const [videoType, setVideoType] = useState<VideoType | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState<TopicStatus>("draft");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  // RTK Query hooks
  const { data: moduleData } = useGetModuleByIdQuery(moduleId);
  const { data: topicData, isLoading: topicLoading, refetch: refetchTopic } = useGetTopicByIdQuery({ moduleId, topicId });
  const { data: subtopicsData, isLoading: subtopicsLoading, refetch: refetchSubtopics } = useGetSubTopicsQuery({ moduleId, topicId });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetTopicAnalyticsQuery({ moduleId, topicId }, {
    skip: activeTab !== "analytics",
  });

  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useGetCommentsQuery({ moduleId, topicId });

  const [updateTopic] = useUpdateTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();
  const [createSubTopic] = useCreateSubTopicMutation();
  const [deleteSubTopic] = useDeleteSubTopicMutation();
  const [resolveComment] = useResolveCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const topic = topicData?.data;
  const comments = commentsData?.data || [];

  console.log(topic)

  useEffect(() => {
    if (topic) {
      setVideoType(topic.videoType);
      setVideoUrl(topic.videoUrl);
      setStatus(topic.status);
    }
  }, [topic]);

  useEffect(() => {
    if (subtopicsData) {
      setSubtopics(subtopicsData.data || []);
    }
  }, [subtopicsData]);

  const handleSaveNotes = (updatedSt: SubTopic) => {
    setSubtopics(prev => prev.map(s => s.id === updatedSt.id ? updatedSt : s));
  };

  const handleDeleteSubTopic = async (stId: string) => {
    if (confirm("Are you sure you want to delete this sub-topic?")) {
      try {
        await deleteSubTopic({ moduleId, topicId, subtopicId: stId }).unwrap();
        refetchSubtopics();
      } catch (error) {
        console.error("Failed to delete sub-topic:", error);
      }
    }
  };

  const addSubTopic = async () => {
    try {
      await createSubTopic({
        moduleId,
        topicId,
        title: "New Sub-Topic",
        notes: "",
      }).unwrap();
      refetchSubtopics();
    } catch (error) {
      console.error("Failed to create sub-topic:", error);
    }
  };

  const handleSaveTopicSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setSavingStatus(true);
    try {
      await updateTopic({
        moduleId,
        topicId,
        title: formData.get("title") as string,
        classification: formData.get("classification") as string,
        overview: formData.get("overview") as string,
        status: status,
        order: parseInt(formData.get("order") as string),
        videoType: videoType || undefined,
        videoUrl: videoUrl || undefined,
        tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()),
      }).unwrap();
      refetchTopic();
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (error) {
      console.error("Failed to save topic settings:", error);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveVideo = async () => {
    try {
      await updateTopic({
        moduleId,
        topicId,
        videoType: videoType || undefined,
        videoUrl: videoUrl || undefined,
      }).unwrap();
      refetchTopic();
    } catch (error) {
      console.error("Failed to save video settings:", error);
    }
  };

  const handleDeleteTopic = async () => {
    if (confirm("Are you sure you want to delete this topic? All sub-topics and notes will be permanently deleted.")) {
      try {
        await deleteTopic({ moduleId, topicId }).unwrap();
        router.push(`/admin/modules/${moduleId}`);
      } catch (error) {
        console.error("Failed to delete topic:", error);
      }
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    try {
      await resolveComment({ moduleId, topicId, commentId, resolved }).unwrap();
      refetchComments();
    } catch (error) {
      console.error("Failed to resolve comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment({ moduleId, topicId, commentId }).unwrap();
        refetchComments();
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  if (topicLoading || subtopicsLoading) {
    return (
      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-32 bg-gray-100 rounded-2xl mb-6" />
          <div className="h-10 w-64 bg-gray-200 rounded-xl mb-5" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-6 xl:p-8 max-w-7xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16">
          <BookOpen size={48} className="text-[#E5E7EB] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#111827] mb-2">Topic Not Found</h2>
          <p className="text-[13px] text-[#9CA3AF] mb-6">The topic you're looking for doesn't exist or has been deleted.</p>
          <Link href={`/admin/modules/${moduleId}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maroon-500 text-white text-[13px] font-semibold">
            <ArrowLeft size={14} /> Back to Module
          </Link>
        </div>
      </div>
    );
  }

  const module = moduleData?.data;
  const statusCfg = TOPIC_STATUS_CFG[status || "pending"];
  const openCommentsCount = comments?.filter(c => !c.resolved)?.length;

  // Analytics data
  const dailyViews = analyticsData?.dailyViews || [];
  const subtopicCompletion = analyticsData?.subtopicCompletion || [];
  const weeklyEngagement = analyticsData?.weeklyEngagement || [];
  const topStates = analyticsData?.topStates || [];

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-5 flex-wrap">
        <Link href="/admin/modules" className="hover:text-[#111827] transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Modules
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <Link href={`/admin/modules/${moduleId}`} className="hover:text-[#111827] transition-colors truncate max-w-[200px]">
          {module?.title || "Module"}
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <span className="text-[#111827] font-semibold">{topic.title}</span>
      </div>

      {/* Topic hero */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden mb-6">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #9B2E3D, #82212D)" }} />
        <div className="p-5 flex flex-col lg:flex-row gap-5">

          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-bold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">Topic {topic.order}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                style={{ background: statusCfg.bg, color: statusCfg.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                {statusCfg.label}
              </span>
              <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{topic.classification}</span>
            </div>

            <h1 className="text-[18px] font-bold text-[#111827] mb-2 leading-tight">{topic.title}</h1>
            <p className="text-[12px] text-[#6B7280] leading-relaxed max-w-2xl mb-3">{topic.overview}</p>

            <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><Clock size={10} /> {topic.duration || "—"}</span>
              <span className="flex items-center gap-1"><Layers size={10} /> {subtopics.length} sub-topics</span>
              <span>Updated {new Date(topic.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Right: stats + actions */}
          <div className="flex flex-col gap-3 lg:items-end">
            {/* Key metrics */}
            <div className="flex gap-3">
              {[
                { v: topic.watchCount?.toLocaleString() || "0", l: "Views", c: "#3B82F6" },
                { v: `${topic.completionRate || 0}%`, l: "Complete", c: "#10B981" },
                { v: topic.likes || 0, l: "Likes", c: "#EF4444" },
                { v: topic.comments || 0, l: "Comments", c: "#F59E0B" },
              ].map(s => (
                <div key={s.l} className="bg-[#F9FAFB] rounded-xl px-3 py-2 text-center border border-[#F3F4F6]">
                  <p className="text-[14px] font-bold" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Publish action */}
            <div className="flex items-center gap-2">
              <select value={status} onChange={e => setStatus(e.target.value as TopicStatus)}
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-maroon-500 bg-white transition-colors">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
              </select>
              <button 
                onClick={async () => {
                  setSavingStatus(true);
                  try {
                    await updateTopic({ moduleId, topicId, status }).unwrap();
                    refetchTopic();
                    setSavedStatus(true);
                    setTimeout(() => setSavedStatus(false), 3000);
                  } catch (error) {
                    console.error("Failed to update status:", error);
                  } finally {
                    setSavingStatus(false);
                  }
                }}
                disabled={savingStatus}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-60 transition-colors">
                {savingStatus ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                              : savedStatus ? <><Check size={11} /> Saved</>
                              : <><Save size={11} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
        {([
          { id: "content", label: "Content & Notes", icon: BookOpen },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "comments", label: `Comments (${openCommentsCount} open)`, icon: MessageSquare },
        ] as const).map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT TAB */}
      {activeTab === "content" && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          {/* Main content editor */}
          <div className="flex flex-col gap-5">

            {/* Video section */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
              <h3 className="text-[13px] font-bold text-[#111827] mb-4">Video Content</h3>

              {/* Video type selector */}
              <div className="flex gap-2 mb-4">
                {([
                  { id: "youtube", icon: PlayCircle, label: "YouTube Link", color: "text-red-500" },
                  { id: "upload", icon: Upload, label: "Upload Video", color: "text-[#6B7280]" },
                ] as const).map(t => (
                  <button key={t.id}
                    onClick={() => setVideoType(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${videoType === t.id ? "border-maroon-500 bg-pink-50 text-maroon-500" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF]"}`}>
                    <t.icon size={13} className={videoType === t.id ? "text-maroon-500" : t.color} />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Current video status */}
              {topic.videoType && (
                <div className="flex items-center gap-3 p-3.5 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl mb-4">
                  <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-[#065F46]">
                      {topic.videoType === "youtube" ? "YouTube video linked" : "Video uploaded"} · {topic.duration}
                    </p>
                    <p className="text-[10px] text-[#6EE7B7] mt-0.5 truncate">{topic.videoUrl}</p>
                  </div>
                  <button className="text-[11px] font-semibold text-[#10B981] hover:underline flex-shrink-0">Replace</button>
                </div>
              )}

              {videoType === "youtube" && (
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">YouTube URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <PlayCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                      <input 
                        value={videoUrl} 
                        onChange={e => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full h-11 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-maroon-500 placeholder:text-[#D1D5DB] transition-colors" />
                    </div>
                    <button 
                      onClick={handleSaveVideo}
                      className="px-4 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-[#1F2937] transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              )}

              {videoType === "upload" && (
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Video File</label>
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-maroon-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] group-hover:bg-pink-50 flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Video size={20} className="text-[#9CA3AF] group-hover:text-maroon-500 transition-colors" />
                    </div>
                    <p className="text-[13px] font-semibold text-[#6B7280]">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-[#D1D5DB] mt-1">MP4, MOV or WebM · Max 500MB · 1080p recommended</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-topics with notes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-bold text-[#111827]">Sub-Topics & Notes</h3>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                    {subtopics.length} sub-topics · Expand each to edit notes and scripts
                  </p>
                </div>
                <button onClick={addSubTopic}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-maroon-500 hover:text-maroon-500 transition-all">
                  <Plus size={12} /> Add Sub-Topic
                </button>
              </div>

              {subtopics.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-10 text-center">
                  <Layers size={28} className="text-[#E5E7EB] mx-auto mb-3" />
                  <p className="text-[13px] font-semibold text-[#9CA3AF] mb-1">No sub-topics yet</p>
                  <p className="text-[11px] text-[#D1D5DB] mb-4">Break this topic into focused segments with instructor notes.</p>
                  <button onClick={addSubTopic}
                    className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-maroon-500 hover:bg-maroon-600 transition-colors">
                    <Plus size={12} /> Add First Sub-Topic
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {subtopics?.map(st => (
                    <NotesEditor 
                      key={st.id} 
                      st={st} 
                      moduleId={moduleId}
                      topicId={topicId}
                      onSave={handleSaveNotes}
                      onDelete={handleDeleteSubTopic}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Topic settings form */}
            <form onSubmit={handleSaveTopicSettings} className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Topic Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Topic Title</label>
                  <input name="title" defaultValue={topic.title}
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-maroon-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Classification</label>
                  <select name="classification" defaultValue={topic.classification}
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-maroon-500 bg-white transition-colors">
                    {["Foundational", "Rights", "Procedural", "Advanced", "Scenario", "Case Study"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Topic Order</label>
                  <input name="order" type="number" defaultValue={topic.order} min={1}
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-maroon-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Overview</label>
                  <textarea name="overview" defaultValue={topic.overview}
                    className="w-full h-24 px-3 py-2 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] resize-none outline-none focus:border-maroon-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                  <input name="tags" defaultValue={topic.tags?.join(", ") || ""}
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-maroon-500 transition-colors" />
                </div>
                <button type="submit" disabled={savingStatus}
                  className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-bold hover:bg-[#1F2937] disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5">
                  {savingStatus ? <><Loader2 size={11} className="animate-spin" /> Saving…</> : <><Save size={11} /> Save Settings</>}
                </button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Quick Stats</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Total views", value: topic.watchCount?.toLocaleString() || "0", icon: Eye, c: "#3B82F6" },
                  { label: "Completion rate", value: `${topic.completionRate || 0}%`, icon: Target, c: "#10B981" },
                  { label: "Likes", value: topic.likes || 0, icon: Heart, c: "#EF4444" },
                  { label: "Comments", value: topic.comments || 0, icon: MessageSquare, c: "#F59E0B" },
                  { label: "Duration", value: topic.duration || "—", icon: Clock, c: "#9CA3AF" },
                  { label: "Sub-topics", value: subtopics.length, icon: Layers, c: "#9B2E3D" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                        <Icon size={12} style={{ color: s.c }} />
                        {s.label}
                      </div>
                      <span className="text-[12px] font-bold text-[#111827]">{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-[#FCA5A5] p-4">
              <h4 className="text-[12px] font-bold text-[#EF4444] mb-2 flex items-center gap-1.5">
                <AlertCircle size={12} /> Danger Zone
              </h4>
              <p className="text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">
                Deleting this topic will remove all sub-topics and notes permanently.
              </p>
              <button 
                onClick={handleDeleteTopic}
                className="w-full py-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] text-[12px] font-semibold text-[#EF4444] hover:bg-[#FEE2E2] transition-colors flex items-center justify-center gap-1.5">
                <Trash2 size={11} /> Delete Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-5">

            {/* Weekly views chart */}
            {dailyViews.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111827]">Daily Views, Last 7 Days</h3>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total: {dailyViews.reduce((s, w) => s + w.views, 0).toLocaleString()} views</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {dailyViews.map((w, i) => {
                    const maxViews = Math.max(...dailyViews.map(d => d.views));
                    const h = maxViews > 0 ? Math.round((w.views / maxViews) * 100) : 0;
                    const isHighest = w.views === maxViews;
                    return (
                      <div key={w.day} className="flex flex-col items-center gap-1.5 flex-1 group">
                        <span className="text-[9px] text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">{w.views}</span>
                        <div
                          className="w-full rounded-t-lg transition-all group-hover:opacity-90"
                          style={{ height: `${Math.max(h, 4)}%`, background: isHighest ? "#9B2E3D" : "#F3F4F6", minHeight: 4 }}
                        />
                        <span className="text-[10px] text-[#9CA3AF]">{w.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-topic performance */}
            {subtopicCompletion.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F9FAFB]">
                  <h3 className="text-[14px] font-bold text-[#111827]">Sub-Topic Completion</h3>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Drop-off analysis across sub-topics</p>
                </div>
                <div className="p-5 space-y-4">
                  {subtopicCompletion.map((st, i) => {
                    const firstViews = subtopicCompletion[0]?.viewCount || 1;
                    const dropPct = i === 0 ? 100 : Math.round((st.viewCount / firstViews) * 100);
                    return (
                      <div key={st.subtopicId}>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-maroon-500/10 flex items-center justify-center text-[9px] font-bold text-maroon-500">{st.order}</span>
                            <span className="font-semibold text-[#111827]">{st.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#9CA3AF]">
                            <span>{st.viewCount.toLocaleString()} views</span>
                            <span className="font-bold text-[#111827]">{st.completedBy.toLocaleString()} completions</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div className="h-2 rounded-full bg-maroon-500 transition-all"
                            style={{ width: `${dropPct}%` }} />
                        </div>
                        {i > 0 && (
                          <p className="text-[10px] text-[#9CA3AF] mt-1">
                            {100 - dropPct > 0 ? `${100 - dropPct}% drop-off from previous sub-topic` : "No drop-off"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Sidebar */}
          <div className="flex flex-col gap-4">
            {weeklyEngagement.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
                <h4 className="text-[12px] font-bold text-[#111827] mb-3">Engagement Summary</h4>
                <div className="space-y-3">
                  {weeklyEngagement.map(s => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-[#F9FAFB] last:border-0">
                      <div>
                        <p className="text-[11px] font-semibold text-[#111827]">{s.label}</p>
                        <p className={`text-[10px] font-medium mt-0.5 ${s.up ? "text-emerald-500" : "text-red-500"}`}>
                          {s.trend}
                        </p>
                      </div>
                      <span className="text-[14px] font-bold text-[#111827]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topStates.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
                <h4 className="text-[12px] font-bold text-[#111827] mb-3">Top States (Learners)</h4>
                {topStates.map(s => (
                  <div key={s.state} className="mb-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#6B7280]">{s.state}</span>
                      <span className="font-bold text-[#111827]">{s.count.toLocaleString()} <span className="text-[#9CA3AF] font-normal">({s.percentage}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full bg-maroon-500/60" style={{ width: `${s.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Topic analytics summary */}
            {analyticsData && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
                <h4 className="text-[12px] font-bold text-[#111827] mb-3">Topic Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Like Rate</span>
                    <span className="font-semibold text-[#111827]">{analyticsData.likeRate}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Comment Rate</span>
                    <span className="font-semibold text-[#111827]">{analyticsData.commentRate}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Avg Watch Duration</span>
                    <span className="font-semibold text-[#111827]">{Math.floor(analyticsData.avgWatchDurationSeconds / 60)}m {analyticsData.avgWatchDurationSeconds % 60}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMMENTS TAB */}
      {activeTab === "comments" && (
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[12px] text-[#9CA3AF]">
            <span>{comments.length} total · {comments.filter(c => !c.resolved).length} open · {comments.filter(c => c.resolved).length} resolved</span>
          </div>

          {commentsLoading ? (
            <div className="text-center py-12">
              <Loader2 size={24} className="animate-spin text-[#9CA3AF] mx-auto" />
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-12 text-center">
              <MessageSquare size={32} className="text-[#E5E7EB] mx-auto mb-3" />
              <p className="text-[13px] font-semibold text-[#9CA3AF] mb-1">No comments yet</p>
              <p className="text-[11px] text-[#D1D5DB]">Comments from learners will appear here.</p>
            </div>
          ) : (
            comments.map(c => (
              <CommentItem 
                key={c.id} 
                comment={c} 
                onResolve={handleResolveComment}
                onDelete={handleDeleteComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}