"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ArrowLeft, Plus, Edit2, Trash2, Eye,
  Video, Upload, FileText, GripVertical,
  ChevronDown, ChevronUp, Users, Clock, Star, BarChart3,
  BookOpen, CheckCircle, MessageSquare, Heart, Flame,
  Play, X, Save, AlertCircle, Image as ImageIcon,
  Layers, Target, TrendingUp, Award, MoreHorizontal,
  Mic, AlignLeft, Tag, RefreshCw, Loader2, Info,
  SlidersHorizontal, Download, Filter, Calendar,
  PlayCircle,
} from "lucide-react";
import { Avatar, StatusBadge, PageHeader } from "../../_components";

// ─── Types ────────────────────────────────────────────────────────────────────
type TopicStatus = "published" | "draft" | "pending";

interface SubTopic {
  id: string;
  title: string;
  notes: string;
  duration: string;
  order: number;
  completedBy: number;
}

interface Topic {
  id: string;
  title: string;
  classification: string;
  overview: string;
  status: TopicStatus;
  order: number;
  videoType: "youtube" | "upload" | null;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  watchCount: number;
  completionRate: number;
  likes: number;
  comments: number;
  subtopics: SubTopic[];
}

// ─── Mock Module Data ─────────────────────────────────────────────────────────
const MODULE = {
  id: "m001",
  title: "Rights During Arrest & Detention",
  category: "criminal",
  categoryLabel: "Police & Criminal Rights",
  categoryColor: "#3B82F6",
  categoryBg: "#EFF6FF",
  status: "active",
  thumbnail: "/images/police_law.jpg",
  description: "Know exactly what police officers can and cannot do — and how to protect yourself in any encounter. This module covers Section 35 of the 1999 Constitution in full, alongside practical guidance for every Nigerian.",
  instructor: "Adaeze Okonkwo",
  instructorInitials: "AO",
  instructorColor: "#3B82F6",
  instructorEmail: "adaeze@lawticha.ng",
  enrolledCount: 3842,
  completionRate: 62,
  avgRating: 4.3,
  reviewCount: 284,
  totalWatchTime: "2,104 hrs",
  createdAt: "Jan 12, 2025",
  updatedAt: "Apr 20, 2025",
};

const TOPICS_DATA: Topic[] = [
  {
    id: "t001", title: "Understanding the Basics of Arrest",
    classification: "Foundational", order: 1,
    overview: "What constitutes a lawful arrest in Nigeria, and the constitutional basis for personal liberty protections.",
    status: "published", videoType: "youtube", videoUrl: "https://youtube.com/watch?v=example1",
    thumbnailUrl: "", duration: "4:32", watchCount: 3421, completionRate: 88, likes: 247, comments: 34,
    subtopics: [
      { id: "st001", title: "What is an Arrest?", notes: "Cover the legal definition of arrest under Nigerian law. Explain voluntary vs involuntary surrender. Reference Section 35(1) of the 1999 Constitution.", duration: "1:20", order: 1, completedBy: 3200 },
      { id: "st002", title: "Types of Arrest in Nigeria", notes: "Distinguish: (1) arrest with warrant, (2) arrest without warrant, (3) citizen's arrest. Use real-world examples for each type.", duration: "1:45", order: 2, completedBy: 3100 },
      { id: "st003", title: "Constitutional Basis", notes: "Walk through Section 35 line by line. Highlight the key subsections that limit police power. Connect to ECOWAS Charter.", duration: "1:27", order: 3, completedBy: 2890 },
    ],
  },
  {
    id: "t002", title: "What Police Must Tell You",
    classification: "Rights", order: 2,
    overview: "The mandatory disclosures officers must make at the point of arrest — and what your silence means legally.",
    status: "published", videoType: "upload", videoUrl: "",
    thumbnailUrl: "", duration: "3:15", watchCount: 3189, completionRate: 82, likes: 198, comments: 21,
    subtopics: [
      { id: "st004", title: "The Right to Know the Reason for Arrest", notes: "Officers MUST state the reason for arrest at the time of arrest, or as soon as practicable after. Cite Section 35(3)(a). Role-play the correct scenario.", duration: "1:10", order: 1, completedBy: 2900 },
      { id: "st005", title: "Right to Remain Silent (Caution)", notes: "Explain the police caution format. Distinguish between voluntary statements and statements under duress. Warn about the dangers of unsigned statements.", duration: "1:00", order: 2, completedBy: 2700 },
      { id: "st006", title: "Right to Speak to a Lawyer", notes: "Section 35(3)(c) guarantees access to a legal practitioner. Explain how to invoke this right calmly and what happens if it is denied.", duration: "1:05", order: 3, completedBy: 2500 },
    ],
  },
  {
    id: "t003", title: "Your Right to Remain Silent",
    classification: "Rights", order: 3,
    overview: "How to invoke your right to silence, what it protects you from, and when it can be used in court.",
    status: "published", videoType: "youtube", videoUrl: "https://youtube.com/watch?v=example3",
    thumbnailUrl: "", duration: "5:01", watchCount: 2876, completionRate: 74, likes: 312, comments: 48,
    subtopics: [
      { id: "st007", title: "What the Right Covers", notes: "The right to silence is not absolute — explain exceptions under Nigerian law. Cover self-incrimination protections.", duration: "1:30", order: 1, completedBy: 2500 },
      { id: "st008", title: "Invoking the Right", notes: "Practical script: exactly what to say and how to say it. Tone, body language, and the importance of not being aggressive.", duration: "2:00", order: 2, completedBy: 2300 },
      { id: "st009", title: "Silence in Court", notes: "Explain that silence cannot be used as evidence of guilt in Nigeria. Contrast with UK law. Address common misconceptions citizens have.", duration: "1:31", order: 3, completedBy: 2100 },
    ],
  },
  {
    id: "t004", title: "24-Hour Detention Rule",
    classification: "Procedural", order: 4,
    overview: "When detention becomes unlawful, how to count the 24-hour period, and what remedies are available.",
    status: "draft", videoType: null, videoUrl: "",
    thumbnailUrl: "", duration: "—", watchCount: 0, completionRate: 0, likes: 0, comments: 0,
    subtopics: [
      { id: "st010", title: "The 24/48-Hour Rule Explained", notes: "Section 35(4) and (5) — different rules for ordinary offences vs capital offences. Map out the timeline clearly.", duration: "—", order: 1, completedBy: 0 },
      { id: "st011", title: "What to Do After 24 Hours", notes: "Habeas corpus application process. Who can file it (detainee, family member, lawyer). Which court to approach.", duration: "—", order: 2, completedBy: 0 },
    ],
  },
  {
    id: "t005", title: "Lawful vs Unlawful Arrest",
    classification: "Foundational", order: 5,
    overview: "How to tell the difference between a lawful and unlawful arrest — and your immediate options when arrested unlawfully.",
    status: "pending", videoType: null, videoUrl: "",
    thumbnailUrl: "", duration: "—", watchCount: 0, completionRate: 0, likes: 0, comments: 0,
    subtopics: [],
  },
];

const RECENT_ACTIVITY = [
  { user: "Chidinma O.", initials: "CO", color: "#3B82F6", action: "completed", topic: "Understanding Basics of Arrest", time: "5 min ago" },
  { user: "Babatunde L.", initials: "BL", color: "#10B981", action: "liked", topic: "Your Right to Remain Silent", time: "12 min ago" },
  { user: "Amina G.", initials: "AG", color: "#8B5CF6", action: "commented on", topic: "What Police Must Tell You", time: "28 min ago" },
  { user: "Ikechukwu E.", initials: "IE", color: "#F59E0B", action: "enrolled in", topic: "this module", time: "1 hr ago" },
  { user: "Funmilayo A.", initials: "FA", color: "#EF4444", action: "completed", topic: "What Police Must Tell You", time: "2 hrs ago" },
  { user: "Emeka O.", initials: "EO", color: "#06B6D4", action: "completed", topic: "Understanding Basics of Arrest", time: "3 hrs ago" },
];

const TOP_LEARNERS = [
  { name: "Adaeze Onyekachi", initials: "AO", color: "#6366F1", progress: 100, topics: 14 },
  { name: "Chukwuemeka N.", initials: "CN", color: "#F97316", progress: 86, topics: 12 },
  { name: "Mustapha I.", initials: "MI", color: "#14B8A6", progress: 71, topics: 10 },
  { name: "Halima Y.", initials: "HY", color: "#EC4899", progress: 64, topics: 9 },
];

// ─── Topic Status Config ──────────────────────────────────────────────────────
const TOPIC_STATUS_CFG: Record<TopicStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  draft:     { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  pending:   { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
};

// ─── Sub Topic Editor ─────────────────────────────────────────────────────────
function SubTopicEditor({ st, onDelete }: { st: SubTopic; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(st.notes);
  const [title, setTitle] = useState(st.title);
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F3F4F6] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical size={14} className="text-[#D1D5DB] flex-shrink-0 cursor-grab" />
        <div className="w-5 h-5 rounded-full bg-[#E8317A]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[9px] font-bold text-[#E8317A]">{st.order}</span>
        </div>
        {editing ? (
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-[12px] font-semibold text-[#111827] bg-white border border-[#E8317A] rounded-lg px-2 py-0.5 outline-none"
          />
        ) : (
          <span className="flex-1 text-[12px] font-semibold text-[#111827]">{title}</span>
        )}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {st.completedBy > 0 && (
            <span className="text-[10px] text-[#9CA3AF] hidden sm:block">
              {st.completedBy.toLocaleString()} completed
            </span>
          )}
          <span className="text-[10px] text-[#9CA3AF] flex items-center gap-0.5">
            <Clock size={9} /> {st.duration}
          </span>
          <button onClick={e => { e.stopPropagation(); setEditing(!editing); }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
            <Edit2 size={11} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 transition-colors">
            <Trash2 size={11} />
          </button>
          {expanded ? <ChevronUp size={13} className="text-[#9CA3AF]" /> : <ChevronDown size={13} className="text-[#9CA3AF]" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#F3F4F6]">
          <div className="mt-3">
            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
              Instructor Notes / Script
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add detailed notes, script points, or key concepts for this sub-topic..."
              className="w-full h-28 px-3 py-2.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors bg-white"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-[#9CA3AF]">{notes.length} characters</span>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline">
                <Save size={11} /> Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Topic Card (expanded editor) ─────────────────────────────────────────────
function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [subtopics, setSubtopics] = useState(topic.subtopics);
  const [videoType, setVideoType] = useState(topic.videoType);
  const [videoUrl, setVideoUrl] = useState(topic.videoUrl);
  const cfg = TOPIC_STATUS_CFG[topic.status];

  const addSubTopic = () => {
    const newSt: SubTopic = {
      id: `st${Date.now()}`, title: "New Sub-Topic", notes: "",
      duration: "—", order: subtopics.length + 1, completedBy: 0,
    };
    setSubtopics([...subtopics, newSt]);
  };

  const deleteSubTopic = (id: string) => setSubtopics(subtopics.filter(s => s.id !== id));

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md"}`}>
      {/* Accent line */}
      <div className="h-0.5 w-full" style={{ background: topic.status === "published" ? "#10B981" : topic.status === "draft" ? "#9CA3AF" : "#F59E0B" }} />

      {/* Header */}
      <div
        className="flex items-center gap-3.5 p-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical size={16} className="text-[#D1D5DB] flex-shrink-0 cursor-grab" />
        <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-bold text-[#6B7280]">{topic.order}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] font-bold text-[#111827]">{topic.title}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
              style={{ background: cfg.bg, color: cfg.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
              {topic.status.charAt(0).toUpperCase() + topic.status.slice(1)}
            </span>
            {topic.classification && (
              <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{topic.classification}</span>
            )}
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate max-w-[400px]">{topic.overview}</p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 text-[11px] text-[#9CA3AF] hidden sm:flex">
          {topic.watchCount > 0 && (
            <>
              <span className="flex items-center gap-1"><Eye size={11} /> {topic.watchCount.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Heart size={11} /> {topic.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={11} /> {topic.comments}</span>
            </>
          )}
          <span className="flex items-center gap-1"><Layers size={11} /> {subtopics.length} sub-topics</span>
          {topic.videoType && (
            <span className="flex items-center gap-1 text-emerald-600">
              {topic.videoType === "youtube" ? <PlayCircle size={11} /> : <Video size={11} />}
              {topic.videoType === "youtube" ? "YouTube" : "Video"}
            </span>
          )}
        </div>

        {expanded ? <ChevronUp size={16} className="text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#9CA3AF] flex-shrink-0" />}
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="border-t border-[#F3F4F6]">
          <div className="p-5 grid lg:grid-cols-[1fr_320px] gap-6">

            {/* LEFT: Sub-topics */}
            <div>
              {/* Video section */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Video Content</h4>
                <div className="flex gap-2 mb-3">
                  {([
                    { id: "youtube", icon: PlayCircle, label: "YouTube Link" },
                    { id: "upload",  icon: Upload,  label: "Upload Video" },
                  ] as const).map(t => (
                    <button key={t.id}
                      onClick={() => setVideoType(t.id as "youtube" | "upload")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${videoType === t.id ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF]"}`}>
                      <t.icon size={12} /> {t.label}
                    </button>
                  ))}
                  {videoType && (
                    <button onClick={() => setVideoType(null)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[12px] text-[#9CA3AF] hover:border-red-200 hover:text-red-400 transition-colors">
                      <X size={11} /> Clear
                    </button>
                  )}
                </div>

                {videoType === "youtube" && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <PlayCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                      <input
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                      />
                    </div>
                    <button className="px-4 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-[#1F2937] transition-colors">
                      Save
                    </button>
                  </div>
                )}

                {videoType === "upload" && (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#E8317A] transition-colors cursor-pointer">
                    <Upload size={20} className="text-[#D1D5DB] mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-[#9CA3AF]">Click to upload video</p>
                    <p className="text-[10px] text-[#D1D5DB] mt-0.5">MP4, MOV or WebM — max 500MB</p>
                  </div>
                )}

                {!videoType && topic.videoType && (
                  <div className="flex items-center gap-3 p-3 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl">
                    <CheckCircle size={14} className="text-[#10B981] flex-shrink-0" />
                    <span className="text-[12px] text-[#065F46] font-medium">
                      {topic.videoType === "youtube" ? "YouTube video linked" : "Video uploaded"} · {topic.duration}
                    </span>
                    <button className="ml-auto text-[11px] text-[#10B981] font-semibold hover:underline">Replace</button>
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Thumbnail</h4>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {topic.thumbnailUrl ? (
                      <img src={topic.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={18} className="text-[#D1D5DB]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                      <Upload size={11} /> Upload Thumbnail
                    </button>
                    <p className="text-[10px] text-[#D1D5DB]">JPG or PNG, 1280×720px recommended</p>
                  </div>
                </div>
              </div>

              {/* Sub-topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Sub-Topics ({subtopics.length})
                  </h4>
                  <button onClick={addSubTopic}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline">
                    <Plus size={11} /> Add Sub-Topic
                  </button>
                </div>

                {subtopics.length === 0 ? (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center">
                    <Layers size={20} className="text-[#D1D5DB] mx-auto mb-2" />
                    <p className="text-[12px] text-[#9CA3AF]">No sub-topics yet. Add some to break this topic down further.</p>
                    <button onClick={addSubTopic}
                      className="mt-3 flex items-center gap-1.5 mx-auto text-[12px] font-semibold text-[#E8317A] hover:underline">
                      <Plus size={11} /> Add First Sub-Topic
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {subtopics.map(st => (
                      <SubTopicEditor key={st.id} st={st} onDelete={() => deleteSubTopic(st.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Stats + settings */}
            <div className="flex flex-col gap-4">
              {/* Topic settings */}
              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Topic Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Classification</label>
                    <select className="w-full h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                      {["Foundational", "Rights", "Procedural", "Advanced", "Scenario"].map(c => (
                        <option key={c} selected={c === topic.classification}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Status</label>
                    <select className="w-full h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                      {["published", "draft", "pending"].map(s => (
                        <option key={s} selected={s === topic.status}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-[#111827] text-white text-[12px] font-bold hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-1.5">
                    <Save size={11} /> Save Settings
                  </button>
                </div>
              </div>

              {/* Topic stats */}
              {topic.watchCount > 0 && (
                <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                  <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Performance</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Views", value: topic.watchCount.toLocaleString(), icon: Eye, color: "#3B82F6" },
                      { label: "Likes", value: topic.likes, icon: Heart, color: "#EF4444" },
                      { label: "Comments", value: topic.comments, icon: MessageSquare, color: "#10B981" },
                      { label: "Completion", value: `${topic.completionRate}%`, icon: CheckCircle, color: "#F59E0B" },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="bg-white rounded-xl p-3 border border-[#F3F4F6] text-center">
                          <Icon size={14} style={{ color: s.color }} className="mx-auto mb-1" />
                          <p className="text-[13px] font-bold text-[#111827]">{s.value}</p>
                          <p className="text-[9px] text-[#9CA3AF]">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Completion bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] mb-1">
                      <span>Completion rate</span><span>{topic.completionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full bg-[#10B981] transition-all"
                        style={{ width: `${topic.completionRate}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex flex-col gap-1.5">
                <Link href={`/admin/modules/${MODULE.id}/topics/${topic.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
                  <Eye size={12} /> View Full Topic Page
                </Link>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                  <Trash2 size={12} className="text-[#EF4444]" /> <span className="text-[#EF4444]">Delete Topic</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const [topics, setTopics] = useState(TOPICS_DATA);
  const [activeSection, setActiveSection] = useState<"topics" | "activity" | "settings">("topics");

  const addTopic = () => {
    const newTopic: Topic = {
      id: `t${Date.now()}`, title: "New Topic", classification: "Foundational",
      overview: "Add a description for this topic.", status: "draft", order: topics.length + 1,
      videoType: null, videoUrl: "", thumbnailUrl: "", duration: "—",
      watchCount: 0, completionRate: 0, likes: 0, comments: 0, subtopics: [],
    };
    setTopics([...topics, newTopic]);
  };

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-5">
        <Link href="/admin/modules" className="hover:text-[#111827] transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Modules
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <span className="text-[#111827] font-semibold">{MODULE.title}</span>
      </div>

      {/* Module header */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden mb-6">
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${MODULE.categoryColor}, ${MODULE.categoryColor}60)` }} />
        <div className="p-5 grid lg:grid-cols-[1fr_auto] gap-5">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F4F6] border border-[#E5E7EB]">
              {MODULE.thumbnail ? (
                <img src={MODULE.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={18} className="text-[#D1D5DB]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[17px] font-bold text-[#111827]">{MODULE.title}</h1>
                <StatusBadge status={MODULE.status as any} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: MODULE.categoryBg, color: MODULE.categoryColor }}>
                  {MODULE.categoryLabel}
                </span>
              </div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed max-w-2xl mb-2">{MODULE.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${MODULE.instructorColor}, ${MODULE.instructorColor}80)` }}>
                    {MODULE.instructorInitials}
                  </div>
                  <span className="font-medium text-[#6B7280]">{MODULE.instructor}</span>
                </div>
                <span>Updated {MODULE.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { v: topics.length, l: "Topics", icon: Layers, c: "#E8317A" },
              { v: MODULE.enrolledCount.toLocaleString(), l: "Enrolled", icon: Users, c: "#3B82F6" },
              { v: `${MODULE.completionRate}%`, l: "Complete", icon: Target, c: "#10B981" },
              { v: MODULE.avgRating, l: "Rating", icon: Star, c: "#F59E0B" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.l} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#F3F4F6]">
                  <Icon size={14} style={{ color: s.c }} className="mx-auto mb-1" />
                  <p className="text-[14px] font-bold text-[#111827]">{s.v}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{s.l}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
        {([
          { id: "topics",   label: "Topics & Content",  icon: BookOpen },
          { id: "activity", label: "Activity & Learners", icon: BarChart3 },
          { id: "settings", label: "Module Settings",   icon: SlidersHorizontal },
        ] as const).map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveSection(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeSection === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TOPICS SECTION */}
      {activeSection === "topics" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-[#111827]">Topics ({topics.length})</h2>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Drag to reorder. Click to expand and edit.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/modules/${params?.id || MODULE.id}/topics/new`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
                <Plus size={13} /> Add Topic
              </Link>
            </div>
          </div>

          {/* Topics list */}
          <div className="flex flex-col gap-3">
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>

          {/* Add topic inline */}
          <button onClick={addTopic}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[#E5E7EB] text-[12px] font-semibold text-[#9CA3AF] hover:border-[#E8317A] hover:text-[#E8317A] hover:bg-pink-50/20 transition-all">
            <Plus size={14} /> Add New Topic
          </button>
        </div>
      )}

      {/* ACTIVITY SECTION */}
      {activeSection === "activity" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="flex flex-col gap-5">

            {/* Per-topic performance table */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <h3 className="text-[14px] font-bold text-[#111827]">Topic Performance</h3>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Views, completions, and engagement per topic</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F9FAFB]">
                      {["Topic", "Views", "Completion", "Likes", "Comments", "Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9FAFB]">
                    {topics.filter(t => t.watchCount > 0).map(t => (
                      <tr key={t.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#9CA3AF] w-4">{t.order}</span>
                            <div>
                              <p className="text-[12px] font-semibold text-[#111827] max-w-[200px] truncate">{t.title}</p>
                              <p className="text-[10px] text-[#9CA3AF]">{t.classification}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] font-medium text-[#6B7280]">{t.watchCount.toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div className="h-1.5 rounded-full bg-[#10B981]" style={{ width: `${t.completionRate}%` }} />
                            </div>
                            <span className="text-[11px] font-semibold text-[#6B7280]">{t.completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                            <Heart size={11} className="text-[#EF4444]" /> {t.likes}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                            <MessageSquare size={11} className="text-[#3B82F6]" /> {t.comments}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: TOPIC_STATUS_CFG[t.status].bg, color: TOPIC_STATUS_CFG[t.status].text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: TOPIC_STATUS_CFG[t.status].dot }} />
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Completion funnel */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
              <h3 className="text-[14px] font-bold text-[#111827] mb-4">Learner Progress Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: "Completed all topics", count: 1141, pct: 30, color: "#10B981" },
                  { label: "More than half done", count: 1226, pct: 32, color: "#3B82F6" },
                  { label: "Less than half done", count: 958,  pct: 25, color: "#F59E0B" },
                  { label: "Just enrolled", count: 517,  pct: 13, color: "#9CA3AF" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#6B7280]">{s.label}</span>
                      <span className="font-bold text-[#111827]">{s.count.toLocaleString()} <span className="text-[#9CA3AF] font-normal">({s.pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-2 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-4">

            {/* Live activity feed */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F9FAFB] flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-[#111827]">Live Activity</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] text-[#10B981] font-semibold">Live</span>
                </div>
              </div>
              <div className="p-3 flex flex-col gap-2.5">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}80)` }}>
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#111827] leading-snug">
                        <span className="font-semibold">{a.user}</span>{" "}
                        <span className="text-[#9CA3AF]">{a.action}</span>{" "}
                        <span className="font-medium truncate">{a.topic}</span>
                      </p>
                      <p className="text-[10px] text-[#D1D5DB]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top learners */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F9FAFB]">
                <h3 className="text-[13px] font-bold text-[#111827]">Top Learners</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {TOP_LEARNERS.map((l, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-[#D1D5DB] w-4">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${l.color}, ${l.color}80)` }}>
                      {l.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#111827] truncate">{l.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div className="h-1 rounded-full bg-[#E8317A]" style={{ width: `${l.progress}%` }} />
                        </div>
                        <span className="text-[9px] text-[#9CA3AF]">{l.progress}%</span>
                      </div>
                    </div>
                    {l.progress === 100 && <Award size={13} className="text-amber-400 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeSection === "settings" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F9FAFB]">
              <h3 className="text-[14px] font-bold text-[#111827]">Module Settings</h3>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Module Title", value: MODULE.title },
                { label: "Instructor", value: MODULE.instructor },
                { label: "Category", value: MODULE.categoryLabel },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input defaultValue={f.value}
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Overview / Description</label>
                <textarea defaultValue={MODULE.description}
                  className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Publication Status</label>
                <select className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                  <option>Active</option><option>Inactive</option><option>Pending Review</option>
                </select>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#EF4444] hover:underline">
                  <Trash2 size={12} /> Delete Module
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
                  <Save size={13} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}