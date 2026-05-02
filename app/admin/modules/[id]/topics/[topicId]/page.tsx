"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ArrowLeft, Save, Edit2, Trash2, Plus, Upload, Video, Play, X, Eye, Heart,
  MessageSquare, CheckCircle, Clock, Users, Star,
  GripVertical, ChevronDown, ChevronUp, BookOpen,
  Image as ImageIcon, Layers, Target, BarChart3,
  FileText, AlignLeft, Tag, Info, AlertCircle,
  Flame, Award, TrendingUp, MoreHorizontal,
  Loader2, Check, RefreshCw, Download, Calendar,
  Shield, Home, Briefcase, Globe, Building2,
  PlayCircle,
} from "lucide-react";
import { Avatar, StatusBadge } from "../../../../_components";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubTopic {
  id: string;
  title: string;
  notes: string;
  duration: string;
  order: number;
  completedBy: number;
  viewCount: number;
}

interface Comment {
  id: string;
  user: string;
  initials: string;
  color: string;
  text: string;
  time: string;
  likes: number;
  resolved: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const TOPIC = {
  id: "t003",
  moduleId: "m001",
  moduleTitle: "Rights During Arrest & Detention",
  title: "Your Right to Remain Silent",
  classification: "Rights",
  overview: "How to invoke your right to silence, what it protects you from, and when it can be used in court. This topic walks through the exact language to use and the common misconceptions citizens hold.",
  status: "published" as const,
  order: 3,
  videoType: "youtube" as "youtube" | "upload" | null,
  videoUrl: "https://youtube.com/watch?v=example3",
  thumbnailUrl: "/images/police_law.jpg",
  duration: "5:01",
  watchCount: 2876,
  completionRate: 74,
  likes: 312,
  comments: 48,
  createdAt: "Jan 22, 2025",
  updatedAt: "Apr 20, 2025",
};

const SUBTOPICS: SubTopic[] = [
  {
    id: "st007", title: "What the Right Covers", order: 1, duration: "1:30", completedBy: 2500, viewCount: 2700,
    notes: `The right to silence is not absolute — explain exceptions under Nigerian law.

Key points to cover:
1. Section 35(5) of the 1999 Constitution
2. Distinguish between the right during arrest vs. the right during trial
3. The privilege against self-incrimination (Evidence Act 2011, S.167)
4. Situations where silence CAN be commented on by courts

Common misconceptions to address:
- "Saying nothing means you're guilty" — FALSE under Nigerian law
- The right applies to EVERYONE regardless of actual guilt

Use a real SARS encounter scenario as a case study.`,
  },
  {
    id: "st008", title: "How to Invoke the Right — The Exact Script", order: 2, duration: "2:00", completedBy: 2300, viewCount: 2500,
    notes: `Practical, word-for-word guidance. This sub-topic is the most practically valuable.

SCRIPT FOR LEARNERS (to be displayed on screen):

"I am exercising my right to remain silent under Section 35 of the Constitution of the Federal Republic of Nigeria. I will not answer any questions without my lawyer present."

Delivery guidance:
- Say it calmly, once
- Do not repeat it aggressively
- Make eye contact but do not be confrontational
- Do not add "I didn't do anything" — this opens a door

Instructor note: Role-play this with a colleague in the video. Show both a nervous and a calm delivery. Reinforce that tone matters as much as the words.`,
  },
  {
    id: "st009", title: "Silence in Court — What Nigerian Law Says", order: 3, duration: "1:31", completedBy: 2100, viewCount: 2300,
    notes: `Address what happens AFTER the arrest — does your silence at the time of arrest affect your trial?

Nigerian law position:
- Pre-trial silence generally cannot be used as evidence of guilt
- Contrast: UK Criminal Justice and Public Order Act 1994 allows adverse inference — Nigeria does NOT have equivalent legislation
- Evidence Act 2011 position on confessional statements

Section references to cite:
- Section 35 CFRN 1999
- Evidence Act 2011, Sections 28–29 (confessions)
- Section 167 (right against self-incrimination)

Common student question: "What if I already spoke before knowing about this right?" 
Answer: Statements made without proper caution may be challenged as inadmissible. A lawyer can apply to exclude them.`,
  },
];

const COMMENTS: Comment[] = [
  { id: "c1", user: "Chidinma Okafor", initials: "CO", color: "#3B82F6", text: "Really helpful breakdown. Could you add a section on what to do if the officer ignores your invocation of the right?", time: "2 days ago", likes: 14, resolved: false },
  { id: "c2", user: "Babatunde Lawal", initials: "BL", color: "#10B981", text: "The script in sub-topic 2 is exactly what I needed. Used it last week. It works.", time: "1 week ago", likes: 29, resolved: true },
  { id: "c3", user: "Amina Garba", initials: "AG", color: "#8B5CF6", text: "Is this right different in Sharia states? The module doesn't address northern Nigeria specifically.", time: "2 weeks ago", likes: 7, resolved: false },
];

const WEEKLY_VIEWS = [
  { day: "Mon", views: 340 }, { day: "Tue", views: 420 }, { day: "Wed", views: 385 },
  { day: "Thu", views: 510 }, { day: "Fri", views: 480 }, { day: "Sat", views: 290 }, { day: "Sun", views: 220 },
];
const MAX_VIEWS = Math.max(...WEEKLY_VIEWS.map(w => w.views));

// ─── Notes Editor ─────────────────────────────────────────────────────────────
function NotesEditor({ st, onSave }: { st: SubTopic; onSave: (notes: string) => void }) {
  const [notes, setNotes] = useState(st.notes);
  const [title, setTitle] = useState(st.title);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    onSave(notes);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F9FAFB] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        onClick={() => setExpanded(!expanded)}>
        <GripVertical size={15} className="text-[#D1D5DB] flex-shrink-0 cursor-grab" />
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#E8317A] to-[#ff6fa8] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          {st.order}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#111827] truncate">{title}</p>
          <p className="text-[10px] text-[#9CA3AF] flex items-center gap-2 mt-0.5">
            <Clock size={9} /> {st.duration}
            <span className="flex items-center gap-1 ml-1"><CheckCircle size={9} className="text-[#10B981]" /> {st.completedBy.toLocaleString()} completed</span>
            <span className="flex items-center gap-1"><Eye size={9} /> {st.viewCount.toLocaleString()} views</span>
          </p>
        </div>
        {expanded ? <ChevronUp size={15} className="text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown size={15} className="text-[#9CA3AF] flex-shrink-0" />}
      </div>

      {expanded && (
        <div className="p-5">
          {/* Title field */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Sub-Topic Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors" />
          </div>

          {/* Notes/Script editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Instructor Notes & Script
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF]">{notes.length} chars</span>
                <span className="text-[10px] text-[#9CA3AF]">~{Math.ceil(notes.split(/\s+/).length / 150)} min read</span>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={`Write detailed notes, script points, talking points, and key concepts for this sub-topic.\n\nYou can include:\n• Legal citations and section references\n• Word-for-word scripts\n• Common questions and answers\n• Real-world examples`}
                className="w-full h-56 px-4 py-3.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] leading-relaxed resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors font-mono"
              />
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E8317A]" />
                <span className="text-[10px] text-[#9CA3AF]">Notes are private — visible only to the admin and instructor</span>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-60 transition-colors">
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TopicDetailPage({ params }: { params: { id: string; topicId: string } }) {
  const [subtopics, setSubtopics] = useState(SUBTOPICS);
  const [comments, setComments] = useState(COMMENTS);
  const [activeTab, setActiveTab] = useState<"content" | "analytics" | "comments">("content");
  const [videoType, setVideoType] = useState(TOPIC.videoType);
  const [videoUrl, setVideoUrl] = useState(TOPIC.videoUrl);
  const [status, setStatus] = useState(TOPIC.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveNotes = (stId: string) => (notes: string) => {
    setSubtopics(prev => prev.map(s => s.id === stId ? { ...s, notes } : s));
  };

  const addSubTopic = () => {
    const newSt: SubTopic = {
      id: `st${Date.now()}`, title: "New Sub-Topic", notes: "",
      duration: "—", order: subtopics.length + 1, completedBy: 0, viewCount: 0,
    };
    setSubtopics([...subtopics, newSt]);
  };

  const resolveComment = (id: string) =>
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));

  const handlePublish = async () => {
    setSavingStatus(true);
    await new Promise(r => setTimeout(r, 1000));
    setStatus("published");
    setSavingStatus(false);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const statusCfg = {
    published: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981", label: "Published" },
    draft:     { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF", label: "Draft" },
    pending:   { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", label: "Pending Review" },
  };
  const scfg = statusCfg[status];

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-5 flex-wrap">
        <Link href="/admin/modules" className="hover:text-[#111827] transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Modules
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <Link href={`/admin/modules/${TOPIC.moduleId}`} className="hover:text-[#111827] transition-colors truncate max-w-[200px]">
          {TOPIC.moduleTitle}
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <span className="text-[#111827] font-semibold">{TOPIC.title}</span>
      </div>

      {/* Topic hero */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden mb-6">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #E8317A, #ff6fa8)" }} />
        <div className="p-5 flex flex-col lg:flex-row gap-5">

          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-bold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">Topic {TOPIC.order}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                style={{ background: scfg.bg, color: scfg.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: scfg.dot }} />
                {scfg.label}
              </span>
              <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{TOPIC.classification}</span>
            </div>

            <h1 className="text-[18px] font-bold text-[#111827] mb-2 leading-tight">{TOPIC.title}</h1>
            <p className="text-[12px] text-[#6B7280] leading-relaxed max-w-2xl mb-3">{TOPIC.overview}</p>

            <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><Clock size={10} /> {TOPIC.duration}</span>
              <span className="flex items-center gap-1"><Layers size={10} /> {subtopics.length} sub-topics</span>
              <span>Updated {TOPIC.updatedAt}</span>
            </div>
          </div>

          {/* Right: stats + actions */}
          <div className="flex flex-col gap-3 lg:items-end">
            {/* Key metrics */}
            <div className="flex gap-3">
              {[
                { v: TOPIC.watchCount.toLocaleString(), l: "Views",     c: "#3B82F6" },
                { v: `${TOPIC.completionRate}%`,        l: "Complete",  c: "#10B981" },
                { v: TOPIC.likes,                       l: "Likes",     c: "#EF4444" },
                { v: TOPIC.comments,                    l: "Comments",  c: "#F59E0B" },
              ].map(s => (
                <div key={s.l} className="bg-[#F9FAFB] rounded-xl px-3 py-2 text-center border border-[#F3F4F6]">
                  <p className="text-[14px] font-bold" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-[9px] text-[#9CA3AF]">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Publish action */}
            <div className="flex items-center gap-2">
              <select value={status} onChange={e => setStatus(e.target.value as any)}
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
              </select>
              <button onClick={handlePublish} disabled={savingStatus}
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
          { id: "content",   label: "Content & Notes",   icon: BookOpen },
          { id: "analytics", label: "Analytics",         icon: BarChart3 },
          { id: "comments",  label: `Comments (${comments.filter(c => !c.resolved).length} open)`, icon: MessageSquare },
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

      {/* ─── CONTENT TAB ─────────────────────────────────────────────────── */}
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
                  { id: "upload",  icon: Upload,  label: "Upload Video",  color: "text-[#6B7280]" },
                ] as const).map(t => (
                  <button key={t.id}
                    onClick={() => setVideoType(t.id as "youtube" | "upload")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${videoType === t.id ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF]"}`}>
                    <t.icon size={13} className={videoType === t.id ? "text-[#E8317A]" : t.color} />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Current video status */}
              {TOPIC.videoType && (
                <div className="flex items-center gap-3 p-3.5 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl mb-4">
                  <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-[#065F46]">
                      {TOPIC.videoType === "youtube" ? "YouTube video linked" : "Video uploaded"} · {TOPIC.duration}
                    </p>
                    <p className="text-[10px] text-[#6EE7B7] mt-0.5 truncate">{TOPIC.videoUrl}</p>
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
                      <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full h-11 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors" />
                    </div>
                    <button className="px-4 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-[#1F2937] transition-colors">
                      Save
                    </button>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-1.5">
                    Supports standard YouTube links, shorts, and embeds. Videos are embedded — learners stay on LawTicha.
                  </p>
                </div>
              )}

              {videoType === "upload" && (
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Video File</label>
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#E8317A] transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] group-hover:bg-pink-50 flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Video size={20} className="text-[#9CA3AF] group-hover:text-[#E8317A] transition-colors" />
                    </div>
                    <p className="text-[13px] font-semibold text-[#6B7280]">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-[#D1D5DB] mt-1">MP4, MOV or WebM · Max 500MB · 1080p recommended</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
                        <Upload size={12} /> Browse Files
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
              <h3 className="text-[13px] font-bold text-[#111827] mb-4">Topic Thumbnail</h3>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                  {TOPIC.thumbnailUrl ? (
                    <img src={TOPIC.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center">
                      <ImageIcon size={20} className="text-[#D1D5DB]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#111827] mb-1">Module thumbnail in use</p>
                  <p className="text-[11px] text-[#9CA3AF] mb-2.5">You can override this with a topic-specific image.</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                      <Upload size={11} /> Upload Custom
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                      <ImageIcon size={11} /> Use URL
                    </button>
                  </div>
                </div>
              </div>
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
                  <Plus size={12} /> Add Sub-Topic
                </button>
              </div>

              {subtopics.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-10 text-center">
                  <Layers size={28} className="text-[#E5E7EB] mx-auto mb-3" />
                  <p className="text-[13px] font-semibold text-[#9CA3AF] mb-1">No sub-topics yet</p>
                  <p className="text-[11px] text-[#D1D5DB] mb-4">Break this topic into focused segments with instructor notes.</p>
                  <button onClick={addSubTopic}
                    className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
                    <Plus size={12} /> Add First Sub-Topic
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {subtopics.map(st => (
                    <NotesEditor key={st.id} st={st} onSave={handleSaveNotes(st.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Topic settings */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Topic Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Classification</label>
                  <select defaultValue="Rights"
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                    {["Foundational", "Rights", "Procedural", "Advanced", "Scenario", "Case Study"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Topic Order</label>
                  <input type="number" defaultValue={TOPIC.order} min={1}
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                  <input type="text" defaultValue="silence, arrest, Section 35"
                    className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors" />
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-bold hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-1.5">
                  <Save size={11} /> Save Settings
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Quick Stats</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Total views", value: TOPIC.watchCount.toLocaleString(), icon: Eye, c: "#3B82F6" },
                  { label: "Completion rate", value: `${TOPIC.completionRate}%`, icon: Target, c: "#10B981" },
                  { label: "Likes", value: TOPIC.likes, icon: Heart, c: "#EF4444" },
                  { label: "Comments", value: TOPIC.comments, icon: MessageSquare, c: "#F59E0B" },
                  { label: "Duration", value: TOPIC.duration, icon: Clock, c: "#9CA3AF" },
                  { label: "Sub-topics", value: subtopics.length, icon: Layers, c: "#E8317A" },
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
              <button className="w-full py-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] text-[12px] font-semibold text-[#EF4444] hover:bg-[#FEE2E2] transition-colors flex items-center justify-center gap-1.5">
                <Trash2 size={11} /> Delete Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ANALYTICS TAB ───────────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-5">

            {/* Weekly views chart */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-bold text-[#111827]">Daily Views — Last 7 Days</h3>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total: {WEEKLY_VIEWS.reduce((s, w) => s + w.views, 0).toLocaleString()} views</p>
                </div>
                <select className="h-8 px-2 rounded-lg border border-[#E5E7EB] text-[11px] text-[#6B7280] bg-white outline-none">
                  <option>Last 7 days</option><option>Last 30 days</option>
                </select>
              </div>
              <div className="flex items-end gap-2 h-32">
                {WEEKLY_VIEWS.map((w, i) => {
                  const h = Math.round((w.views / MAX_VIEWS) * 100);
                  const isHighest = w.views === MAX_VIEWS;
                  return (
                    <div key={w.day} className="flex flex-col items-center gap-1.5 flex-1 group">
                      <span className="text-[9px] text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">{w.views}</span>
                      <div
                        className="w-full rounded-t-lg transition-all group-hover:opacity-90"
                        style={{ height: `${h}%`, background: isHighest ? "#E8317A" : "#F3F4F6", minHeight: 4 }}
                      />
                      <span className="text-[10px] text-[#9CA3AF]">{w.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-topic performance */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F9FAFB]">
                <h3 className="text-[14px] font-bold text-[#111827]">Sub-Topic Completion</h3>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">Drop-off analysis across sub-topics</p>
              </div>
              <div className="p-5 space-y-4">
                {subtopics.map((st, i) => {
                  const dropPct = i === 0 ? 100 : Math.round((st.completedBy / subtopics[0].completedBy) * 100);
                  return (
                    <div key={st.id}>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#E8317A]/10 flex items-center justify-center text-[9px] font-bold text-[#E8317A]">{st.order}</span>
                          <span className="font-semibold text-[#111827]">{st.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#9CA3AF]">
                          <span>{st.viewCount.toLocaleString()} views</span>
                          <span className="font-bold text-[#111827]">{st.completedBy.toLocaleString()} completions</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-2 rounded-full bg-[#E8317A] transition-all"
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
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Engagement Summary</h4>
              <div className="space-y-3">
                {[
                  { label: "Watch-through rate", value: "74%", trend: "+6% this week", up: true },
                  { label: "Avg watch duration", value: "3m 42s", trend: "+12% this week", up: true },
                  { label: "Like rate", value: "10.8%", trend: "+2% this week", up: true },
                  { label: "Comment rate", value: "1.7%", trend: "-0.3% this week", up: false },
                ].map(s => (
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

            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4">
              <h4 className="text-[12px] font-bold text-[#111827] mb-3">Top States (Learners)</h4>
              {[
                { state: "Lagos", pct: 32, count: 920 },
                { state: "Abuja", pct: 18, count: 518 },
                { state: "Rivers", pct: 11, count: 316 },
                { state: "Kano", pct: 8, count: 230 },
                { state: "Others", pct: 31, count: 892 },
              ].map(s => (
                <div key={s.state} className="mb-2.5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium text-[#6B7280]">{s.state}</span>
                    <span className="font-bold text-[#111827]">{s.count.toLocaleString()} <span className="text-[#9CA3AF] font-normal">({s.pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full bg-[#E8317A]/60" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── COMMENTS TAB ─────────────────────────────────────────────────── */}
      {activeTab === "comments" && (
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[12px] text-[#9CA3AF]">
            <span>{comments.length} total · {comments.filter(c => !c.resolved).length} open · {comments.filter(c => c.resolved).length} resolved</span>
          </div>

          {comments.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${c.resolved ? "border-[#F3F4F6] opacity-70" : "border-[#E5E7EB] shadow-sm"}`}>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}80)` }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[13px] font-bold text-[#111827]">{c.user}</span>
                      <span className="text-[11px] text-[#9CA3AF]">{c.time}</span>
                      {c.resolved && (
                        <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={9} /> Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#374151] leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                        <Heart size={11} /> {c.likes} likes
                      </span>
                      <button className="text-[11px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">
                        Reply
                      </button>
                      <button onClick={() => resolveComment(c.id)}
                        className={`text-[11px] font-semibold transition-colors ${c.resolved ? "text-[#9CA3AF] hover:text-[#EF4444]" : "text-[#10B981] hover:text-[#059669]"}`}>
                        {c.resolved ? "Re-open" : "✓ Mark Resolved"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}