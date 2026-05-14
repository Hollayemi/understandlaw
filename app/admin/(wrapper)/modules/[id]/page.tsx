"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight, ArrowLeft, Plus, Edit2, Trash2, Eye,
  Video, Upload, GripVertical,
  ChevronDown, ChevronUp, Users, Clock, Star, BarChart3,
  BookOpen, CheckCircle, MessageSquare, Heart, 
  X, Save, Image as ImageIcon,
  Layers, Target, Award, SlidersHorizontal, PlayCircle,
} from "lucide-react";
import { StatusBadge } from "../../_components";
import {
  useGetModuleByIdQuery,
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  useUpdateTopicMutation,
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useReorderTopicsMutation,
  useUpdateSubTopicMutation,
  useUpdateSubTopicNotesMutation,
  useDeleteSubTopicMutation,
  useCreateSubTopicMutation,
  useReorderSubTopicsMutation,
  useGetModuleActivityQuery,
  useGetTopLearnersQuery,
  useGetModuleAnalyticsQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useUploadThumbnailMutation,
} from "@/redux/slices/admin/modules.slice";
import type { 
  Topic, 
  SubTopic, 
  TopicStatus, 
  VideoType,
  TopicWithSubTopics,
  Module,
} from "@/redux/slices/types";

// Topic Status Config
const TOPIC_STATUS_CFG: Record<TopicStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  draft:     { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  pending:   { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
};

// Category Config for display
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  criminal:    { label: "Police & Criminal",    color: "#3B82F6", bg: "#EFF6FF" },
  tenancy:     { label: "Landlord & Tenancy",   color: "#10B981", bg: "#ECFDF5" },
  employment:  { label: "Employment & Labour",  color: "#8B5CF6", bg: "#F5F3FF" },
  contracts:   { label: "Contracts & Agreements", color: "#F59E0B", bg: "#FFFBEB" },
  business:    { label: "Business & Commerce",  color: "#06B6D4", bg: "#ECFEFF" },
  family:      { label: "Family & Personal",    color: "#EF4444", bg: "#FEF2F2" },
  consumer:    { label: "Consumer Rights",      color: "#E8317A", bg: "#FFF0F5" },
  road:        { label: "Road Traffic",         color: "#F97316", bg: "#FFF7ED" },
};

// SubTopic Editor Component
function SubTopicEditor({ 
  st, 
  moduleId, 
  topicId, 
  onDelete, 
  onUpdate 
}: { 
  st: SubTopic; 
  moduleId: string; 
  topicId: string;
  onDelete: (id: string) => void; 
  onUpdate: (st: SubTopic) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(st.notes);
  const [title, setTitle] = useState(st.title);
  const [editing, setEditing] = useState(false);
  const [updateSubTopicNotes, { isLoading: notesLoading }] = useUpdateSubTopicNotesMutation();
  const [updateSubTopic] = useUpdateSubTopicMutation();

  const handleSaveNotes = async () => {
    try {
      const result = await updateSubTopicNotes({
        moduleId,
        topicId,
        subtopicId: st.id,
        notes,
      }).unwrap();
      onUpdate({ ...st, notes: result.data?.notes });
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  console.log({
     moduleId,
        topicId,
        subtopicId: st.id,
  })

  const handleSaveTitle = async () => {
    try {
      const result = await updateSubTopic({
        moduleId,
        topicId,
        subtopicId: st.id,
        title,
      }).unwrap();
      onUpdate({ ...st, title: result.data.title });
      setEditing(false);
    } catch (error) {
      console.error("Failed to save title:", error);
    }
  };

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
            onBlur={handleSaveTitle}
            onKeyDown={e => e.key === "Enter" && handleSaveTitle()}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-[12px] font-semibold text-[#111827] bg-white border border-[#E8317A] rounded-lg px-2 py-0.5 outline-none"
            autoFocus
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
            <Clock size={9} /> {st.duration || "—"}
          </span>
          <button onClick={e => { e.stopPropagation(); setEditing(!editing); }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
            <Edit2 size={11} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(st.id); }}
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
              <button 
                onClick={handleSaveNotes}
                disabled={notesLoading}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline disabled:opacity-50">
                <Save size={11} /> {notesLoading ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Topic Card Component (expanded editor)
function TopicCard({ 
  topic, 
  moduleId, 
  onUpdate, 
  onDelete,
  index 
}: { 
  topic: TopicWithSubTopics; 
  moduleId: string; 
  onUpdate: () => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [subtopics, setSubtopics] = useState(topic?.subtopics || []);
  const [videoType, setVideoType] = useState<VideoType | null>(topic.videoType);
  const [videoUrl, setVideoUrl] = useState(topic.videoUrl);
  const [updateTopic] = useUpdateTopicMutation();
  const [createSubTopic] = useCreateSubTopicMutation();
  const [deleteSubTopicMutation] = useDeleteSubTopicMutation();
  const cfg = TOPIC_STATUS_CFG[topic.status];

  const addSubTopic = async () => {
    try {
      const result = await createSubTopic({
        moduleId,
        topicId: topic.id,
        title: "New Sub-Topic",
        notes: "",
      }).unwrap();
      setSubtopics([...subtopics, result.data]);
      onUpdate();
    } catch (error) {
      console.error("Failed to create subtopic:", error);
    }
  };

  const deleteSubTopic = async (id: string) => {
    try {
      await deleteSubTopicMutation({
        moduleId,
        topicId: topic.id,
        subtopicId: id,
      }).unwrap();
      setSubtopics(subtopics.filter(s => s.id !== id));
      onUpdate();
    } catch (error) {
      console.error("Failed to delete subtopic:", error);
    }
  };

  const handleSaveVideo = async () => {
    try {
      await updateTopic({
        moduleId,
        topicId: topic.id,
        videoType,
        videoUrl: videoUrl || undefined,
      }).unwrap();
      onUpdate();
    } catch (error) {
      console.error("Failed to save video settings:", error);
    }
  };

  const updateSubTopicInList = (updated: SubTopic) => {
    setSubtopics(subtopics.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md"}`}>
      <div className="h-0.5 w-full" style={{ background: topic.status === "published" ? "#10B981" : topic.status === "draft" ? "#9CA3AF" : "#F59E0B" }} />

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
          <span className="flex items-center gap-1"><Layers size={11} /> {subtopics?.length || 0} sub-topics</span>
          {topic.videoType && (
            <span className="flex items-center gap-1 text-emerald-600">
              {topic.videoType === "youtube" ? <PlayCircle size={11} /> : <Video size={11} />}
              {topic.videoType === "youtube" ? "YouTube" : "Video"}
            </span>
          )}
        </div>

        {expanded ? <ChevronUp size={16} className="text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#9CA3AF] flex-shrink-0" />}
      </div>

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
                      onClick={() => setVideoType(t.id)}
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
                    <button 
                      onClick={handleSaveVideo}
                      className="px-4 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-[#1F2937] transition-colors">
                      Save
                    </button>
                  </div>
                )}

                {videoType === "upload" && (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#E8317A] transition-colors cursor-pointer">
                    <Upload size={20} className="text-[#D1D5DB] mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-[#9CA3AF]">Click to upload video</p>
                    <p className="text-[10px] text-[#D1D5DB] mt-0.5">MP4, MOV or WebM, max 500MB</p>
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
                    {subtopics?.map(st => (
                      <SubTopicEditor 
                        key={st.id} 
                        st={st} 
                        moduleId={moduleId}
                        topicId={topic.id}
                        onDelete={deleteSubTopic} 
                        onUpdate={updateSubTopicInList}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Stats + settings */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Topic Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Classification</label>
                    <select 
                      defaultValue={topic.classification}
                      className="w-full h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                      {["Foundational", "Rights", "Procedural", "Advanced", "Scenario"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Status</label>
                    <select 
                      defaultValue={topic.status}
                      className="w-full h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                      {["published", "draft", "pending"].map(s => (
                        <option key={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-[#111827] text-white text-[12px] font-bold hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-1.5">
                    <Save size={11} /> Save Settings
                  </button>
                </div>
              </div>

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

              <div className="flex flex-col gap-1.5">
                <Link href={`/admin/modules/${moduleId}/topics/${topic.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
                  <Eye size={12} /> View Full Topic Page
                </Link>
                <button 
                  onClick={() => onDelete(topic.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
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

// Main Page
export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.id as string;
  
  const [activeSection, setActiveSection] = useState<"topics" | "activity" | "settings">("topics");
  const [topics, setTopics] = useState<TopicWithSubTopics[]>([]);
  
  // RTK Query hooks
  const { data: moduleData, isLoading: moduleLoading, refetch: refetchModule } = useGetModuleByIdQuery(moduleId);
  const { data: topicsData, isLoading: topicsLoading, refetch: refetchTopics } = useGetTopicsQuery(moduleId);
  const { data: activityData } = useGetModuleActivityQuery({ moduleId, limit: 10 });
  const { data: topLearnersData } = useGetTopLearnersQuery({ moduleId, limit: 5 });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetModuleAnalyticsQuery(moduleId, {
    skip: activeSection !== "activity",
  });
  
  const [createTopic] = useCreateTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  const module = moduleData?.data;

  console.log(topicsData)
  
  useEffect(() => {
    if (topicsData) {
      setTopics(topicsData.data);
    }
  }, [topicsData]);

  const addTopic = async () => {
    try {
      await createTopic({
        moduleId,
        title: "New Topic",
        classification: "Foundational",
        overview: "Add a description for this topic.",
        status: "draft",
      }).unwrap();
      refetchTopics();
    } catch (error) {
      console.error("Failed to create topic:", error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      try {
        await deleteTopic({ moduleId, topicId }).unwrap();
        refetchTopics();
      } catch (error) {
        console.error("Failed to delete topic:", error);
      }
    }
  };

  const handleDeleteModule = async () => {
    if (confirm("Are you sure you want to delete this module? All topics, subtopics, and analytics will be permanently deleted.")) {
      try {
        await deleteModule(moduleId).unwrap();
        router.push("/admin/modules");
      } catch (error) {
        console.error("Failed to delete module:", error);
      }
    }
  };

  const handleUpdateModule = async (formData: any) => {
    try {
      await updateModule({
        id: moduleId,
        data: formData,
      }).unwrap();
      refetchModule();
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  };

  if (moduleLoading || topicsLoading) {
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

  if (!module) {
    return (
      <div className="p-6 xl:p-8 max-w-7xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16">
          <BookOpen size={48} className="text-[#E5E7EB] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#111827] mb-2">Module Not Found</h2>
          <p className="text-[13px] text-[#9CA3AF] mb-6">The module you're looking for doesn't exist or has been deleted.</p>
          <Link href="/admin/modules" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8317A] text-white text-[13px] font-semibold">
            <ArrowLeft size={14} /> Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[module.category] || { label: module.category, color: "#E8317A", bg: "#FFF0F5" };

  // Transform analytics data for display
  const progressDistribution = analyticsData?.progressDistribution || [];
  const topicPerformance = analyticsData?.topicPerformance || [];
  const recentActivity = activityData || [];
  const topLearners = topLearnersData || [];

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-5">
        <Link href="/admin/modules" className="hover:text-[#111827] transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Modules
        </Link>
        <ChevronRight size={11} className="text-[#D1D5DB]" />
        <span className="text-[#111827] font-semibold">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden mb-6">
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${categoryConfig.color}, ${categoryConfig.color}60)` }} />
        <div className="p-5 grid lg:grid-cols-[1fr_auto] gap-5">
          <div className="flex items-start gap-4">
            <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F4F6] border border-[#E5E7EB]">
              {module.thumbnail ? (
                <img src={module.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={18} className="text-[#D1D5DB]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[17px] font-bold text-[#111827]">{module.title}</h1>
                <StatusBadge status={module.status || "pending"} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: categoryConfig.bg, color: categoryConfig.color }}>
                  {categoryConfig.label}
                </span>
              </div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed max-w-2xl mb-2">{module.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${module.instructorColor}, ${module.instructorColor}80)` }}>
                    {module.instructorInitials}
                  </div>
                  <span className="font-medium text-[#6B7280]">{module.instructor}</span>
                </div>
                <span>Updated {new Date(module.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { v: topics.length, l: "Topics", icon: Layers, c: "#E8317A" },
              { v: module.enrolledCount?.toLocaleString(), l: "Enrolled", icon: Users, c: "#3B82F6" },
              { v: `${module.completionRate}%`, l: "Complete", icon: Target, c: "#10B981" },
              { v: module.avgRating?.toFixed(1), l: "Rating", icon: Star, c: "#F59E0B" },
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
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Click to expand and edit.</p>
            </div>
            <button onClick={addTopic}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
              <Plus size={13} /> Add Topic
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {topics.map((topic, i) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                moduleId={moduleId}
                onUpdate={refetchTopics}
                onDelete={handleDeleteTopic}
                index={i}
              />
            ))}
          </div>

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
                    {topicPerformance.map(t => (
                      <tr key={t.topicId} className="hover:bg-[#F9FAFB] transition-colors">
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
                            style={{ background: TOPIC_STATUS_CFG[t.status as TopicStatus]?.bg || "#F3F4F6", color: TOPIC_STATUS_CFG[t.status as TopicStatus]?.text || "#6B7280" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: TOPIC_STATUS_CFG[t.status as TopicStatus]?.dot || "#9CA3AF" }} />
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
            {progressDistribution.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
                <h3 className="text-[14px] font-bold text-[#111827] mb-4">Learner Progress Distribution</h3>
                <div className="space-y-3">
                  {progressDistribution.map(s => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-medium text-[#6B7280]">{s.label}</span>
                        <span className="font-bold text-[#111827]">{s.count.toLocaleString()} <span className="text-[#9CA3AF] font-normal">({s.percentage}%)</span></span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-2 rounded-full" style={{ width: `${s.percentage}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {recentActivity.length === 0 ? (
                  <p className="text-[11px] text-[#9CA3AF] text-center py-4">No recent activity</p>
                ) : (
                  recentActivity.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${a.userColor}, ${a.userColor}80)` }}>
                        {a.userInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#111827] leading-snug">
                          <span className="font-semibold">{a.userName}</span>{" "}
                          <span className="text-[#9CA3AF]">{a.action}</span>{" "}
                          <span className="font-medium truncate">{a.targetTitle}</span>
                        </p>
                        <p className="text-[10px] text-[#D1D5DB]">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top learners */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F9FAFB]">
                <h3 className="text-[13px] font-bold text-[#111827]">Top Learners</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {topLearners.length === 0 ? (
                  <p className="text-[11px] text-[#9CA3AF] text-center py-4">No learners yet</p>
                ) : (
                  topLearners.map((l, i) => (
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
                            <div className="h-1 rounded-full bg-[#E8317A]" style={{ width: `${l.progressPercentage}%` }} />
                          </div>
                          <span className="text-[9px] text-[#9CA3AF]">{l.progressPercentage}%</span>
                        </div>
                      </div>
                      {l.progressPercentage === 100 && <Award size={13} className="text-amber-400 flex-shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeSection === "settings" && (
        <div className="max-w-2xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdateModule({
              title: formData.get("title"),
              category: formData.get("category"),
              description: formData.get("description"),
              status: formData.get("status"),
            });
          }}>
            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F9FAFB]">
                <h3 className="text-[14px] font-bold text-[#111827]">Module Settings</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Module Title</label>
                  <input name="title" defaultValue={module.title}
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Category</label>
                  <select name="category" defaultValue={module.category}
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Overview / Description</label>
                  <textarea name="description" defaultValue={module.description}
                    className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Publication Status</label>
                  <select name="status" defaultValue={module.status}
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <button type="button"
                    onClick={handleDeleteModule}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[#EF4444] hover:underline">
                    <Trash2 size={12} /> Delete Module
                  </button>
                  <button type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
                    <Save size={13} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}