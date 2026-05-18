"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Plus, Edit2, Trash2, Eye,
  Video, Upload, GripVertical,
  ChevronDown, ChevronUp, Clock, 
  CheckCircle, MessageSquare, Heart, 
  X, Save, Image as ImageIcon,
  Layers, PlayCircle,
} from "lucide-react";
import {
  useUpdateTopicMutation,
  useUpdateSubTopicMutation,
  useUpdateSubTopicNotesMutation,
  useDeleteSubTopicMutation,
  useCreateSubTopicMutation,
} from "@/redux/slices/admin/modules.slice";
import type { 
  SubTopic, 
  TopicStatus, 
  VideoType,
  TopicWithSubTopics,
} from "@/redux/slices/types";


// Topic Status Config
export const TOPIC_STATUS_CFG: Record<TopicStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  draft:     { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  pending:   { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
};

// SubTopic Editor Component
export function SubTopicEditor({ 
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
export function TopicCard({ 
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
