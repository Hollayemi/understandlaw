"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight, ArrowLeft, Plus, Trash2,   
  Users, Star, BarChart3,
  BookOpen, MessageSquare, Heart, 
  Save, Image as ImageIcon,
  Layers, Target, Award, SlidersHorizontal,
} from "lucide-react";
import { StatusBadge } from "../../_components";
import {
  useGetModuleByIdQuery,
  useGetTopicsQuery,
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useGetModuleActivityQuery,
  useGetTopLearnersQuery,
  useGetModuleAnalyticsQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from "@/redux/slices/admin/modules.slice";
import type { 
  TopicStatus, 
  TopicWithSubTopics,
} from "@/redux/slices/types";
import { CATEGORY_CONFIG } from "../_components";
import { TOPIC_STATUS_CFG, TopicCard } from "../_components/subtopic";


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