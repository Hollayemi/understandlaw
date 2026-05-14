"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Users, TrendingUp, Award, Plus, Search,
  MoreHorizontal, Eye, Edit2, Trash2, Filter,
  ChevronRight, Play, Clock, Star, BarChart3,
  Shield, Home, Briefcase, FileText, Building2,
  Heart, Car, Globe, Layers, CheckCircle, ArrowUp,
  Flame, Target, X, Upload, Image as ImageIcon,
  Tag, AlignLeft, Download,
} from "lucide-react";
import { StatBar, FilterBar, Avatar, PageHeader, StatusBadge } from "../_components";
import {
  useGetModulesQuery,
  useGetModuleOverviewStatsQuery,
  useGetDailyActivityStatsQuery,
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useUpdateModuleMutation,
} from "@/redux/slices/admin/modules.slice";
// import { useModulesUiActions, useModulesUiSelectors } from "@/redux/slices/types";
import { Module, ModuleCategory, ModuleStatus, CreateModulePayload } from "@/redux/slices/types";
import { useGetInstructorsQuery } from "@/redux/slices/admin/admin.slice";

// Category Config
const CATEGORY_CONFIG: Record<ModuleCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  criminal: { label: "Police & Criminal", icon: Shield, color: "#3B82F6", bg: "#EFF6FF" },
  tenancy: { label: "Landlord & Tenancy", icon: Home, color: "#10B981", bg: "#ECFDF5" },
  employment: { label: "Employment & Labour", icon: Briefcase, color: "#8B5CF6", bg: "#F5F3FF" },
  contracts: { label: "Contracts & Agreements", icon: FileText, color: "#F59E0B", bg: "#FFFBEB" },
  business: { label: "Business & Commerce", icon: Building2, color: "#06B6D4", bg: "#ECFEFF" },
  family: { label: "Family & Personal", icon: Heart, color: "#EF4444", bg: "#FEF2F2" },
  consumer: { label: "Consumer Rights", icon: Globe, color: "#E8317A", bg: "#FFF0F5" },
  road: { label: "Road Traffic", icon: Car, color: "#F97316", bg: "#FFF7ED" },
};

// Create Module Modal Component
function CreateModuleModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    category: "criminal" as ModuleCategory,
    description: "",
    instructorId: "",
    thumbnailUrl: "",
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [createModule, { isLoading }] = useCreateModuleMutation();

  
  const { data: instructorsData, isLoading:instructorsLoading } = useGetInstructorsQuery({});

  const instructors = instructorsData?.data || []

  console.log(instructors)


  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    try {
      await createModule({
        title: form.title,
        category: form.category,
        description: form.description,
        instructorId: form.instructorId,
        thumbnailUrl: form.thumbnailUrl || undefined,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">Create New Module</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Step {step} of 2</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-5">
            {[1, 2].map(n => (
              <React.Fragment key={n}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${step === n ? "bg-[#E8317A] text-white" : step > n ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                  }`}>{n}</div>
                {n < 2 && <div className="flex-1 h-px bg-[#E5E7EB]" />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Module Title</label>
                <input value={form.title} onChange={set("title")} placeholder="e.g. Rights During Arrest & Detention" className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Category / Classification</label>
                <select value={form.category} onChange={set("category")}
                  className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] transition-colors bg-white">
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Brief Overview</label>
                <textarea value={form.description} onChange={set("description")}
                  placeholder="Describe what citizens will learn in this module..."
                  className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="">
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Instructor ID</label>
                <select value={form.instructorId} onChange={set("instructorId")}
                  className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] w-full text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors">
                  <option value="all">All Categories</option>
                  {instructors.map((each, i) => (
                    <option key={each?._id} value={each?._id}>{each.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => setStep(2)} disabled={!form.title || !form.description || !form.instructorId}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-40 transition-colors">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Module Thumbnail URL (Optional)</label>
                <input value={form.thumbnailUrl} onChange={set("thumbnailUrl")}
                  placeholder="https://example.com/thumbnail.jpg" className={inputCls} />
              </div>

              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6]">
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Summary</p>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Title</span><span className="font-semibold text-[#111827] truncate max-w-[200px]">{form.title || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Category</span><span className="font-semibold text-[#111827]">{CATEGORY_CONFIG[form.category].label}</span></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                  Back
                </button>
                <button onClick={handleCreate} disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-40 transition-colors">
                  {isLoading ? "Creating..." : "Create Module"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Module Card Component
function ModuleCard({ mod, onDelete, onEdit }: { mod: Module; onDelete: (id: string) => void; onEdit: (mod: Module) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_CONFIG[mod.category as ModuleCategory];
  const CatIcon = cat?.icon || BookOpen;

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <div className="relative h-36 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat?.color || '#E8317A'}20, ${cat?.color || '#E8317A'}08)` }}>
        {mod.thumbnail ? (
          <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon size={40} style={{ color: cat?.color || '#E8317A', opacity: 0.25 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cat?.bg || '#FFF0F5', color: cat?.color || '#E8317A' }}>
            {cat?.label || mod.category}
          </span>
          {mod.trending && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded-full">
              <Flame size={9} /> Trending
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-40 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1">
                  <button onClick={() => { setMenuOpen(false); onEdit(mod); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-left text-[#111827]">
                    <Edit2 size={12} /> Edit Module
                  </button>
                  <button onClick={() => { setMenuOpen(false); onDelete(mod.id); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-left text-[#EF4444]">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <StatusBadge status={mod.status} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-bold text-[#111827] leading-snug mb-1 line-clamp-2">{mod.title}</h3>
        <p className="text-[11px] text-[#9CA3AF] leading-relaxed mb-3 line-clamp-2 flex-1">{mod.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-3 bg-[#F9FAFB] rounded-xl p-2.5">
          <div className="text-center">
            <p className="text-[12px] font-bold text-[#111827]">{mod.topicCount}</p>
            <p className="text-[9px] text-[#9CA3AF]">Topics</p>
          </div>
          <div className="text-center border-x border-[#F3F4F6]">
            <p className="text-[12px] font-bold text-[#111827]">{mod.enrolledCount > 0 ? mod.enrolledCount.toLocaleString() : "—"}</p>
            <p className="text-[9px] text-[#9CA3AF]">Enrolled</p>
          </div>
          <div className="text-center">
            <p className="text-[12px] font-bold text-[#111827]">{mod.completionRate > 0 ? `${mod.completionRate}%` : "—"}</p>
            <p className="text-[9px] text-[#9CA3AF]">Complete</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${mod.instructorColor}, ${mod.instructorColor}80)` }}>
              {mod.instructorInitials}
            </div>
            <span className="text-[10px] text-[#9CA3AF] truncate max-w-[80px]">{mod.instructor}</span>
          </div>
          {mod.avgRating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-[#111827]">{mod.avgRating}</span>
              <span className="text-[10px] text-[#9CA3AF]">({mod.reviewCount})</span>
            </div>
          )}
        </div>

        <Link href={`/admin/modules/${mod.id}`}
          className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
          Manage Module <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// Edit Module Modal
function EditModuleModal({ module, onClose }: { module: Module; onClose: () => void }) {
  const [form, setForm] = useState({
    title: module.title,
    category: module.category,
    description: module.description,
    status: module.status,
    thumbnailUrl: module.thumbnail || "",
  });
  const [updateModule, { isLoading }] = useUpdateModuleMutation();

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleUpdate = async () => {
    try {
      await updateModule({
        id: module.id,
        data: {
          title: form.title,
          category: form.category as ModuleCategory,
          description: form.description,
          status: form.status as ModuleStatus,
          thumbnailUrl: form.thumbnailUrl || undefined,
        },
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">Edit Module</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Update module details</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Module Title</label>
              <input value={form.title} onChange={set("title")} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280} uppercase tracking-wider mb-1.5">Category</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={set("status")} className={inputCls}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={form.description} onChange={set("description")}
                className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Thumbnail URL</label>
              <input value={form.thumbnailUrl} onChange={set("thumbnailUrl")} placeholder="https://example.com/image.jpg" className={inputCls} />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-40 transition-colors">
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function AdminModulesPage() {
  // UI State from Redux slice (optional - can also use local state)
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);


  // RTK Query hooks
  const { data: modulesData, isLoading: modulesLoading, refetch } = useGetModulesQuery({
    status: tab as any,
    category: categoryFilter as any,
    search: search || undefined,
    page,
    pageSize: 20,
  });

  const { data: statsData, isLoading: statsLoading } = useGetModuleOverviewStatsQuery();
  const { data: dailyStatsData, isLoading: dailyStatsLoading } = useGetDailyActivityStatsQuery();
  const [deleteModule] = useDeleteModuleMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      try {
        await deleteModule(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete module:", error);
      }
    }
  };

  console.log(modulesData)

  const modules = modulesData?.data?.data || [] as any;
  const totalModules = modulesData?.data?.total || 0;

  console.log(modules)

  // Stats for StatBar
  const stats = [
    { label: "Total Modules", value: statsData?.totalModules ?? 0, icon: BookOpen, color: "#E8317A", bg: "#FFF0F5" },
    { label: "Total Topics", value: statsData?.totalTopics ?? 0, icon: Layers, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Total Enrolled", value: (statsData?.totalEnrolled ?? 0).toLocaleString(), icon: Users, color: "#10B981", bg: "#ECFDF5" },
    { label: "Avg Completion", value: `${statsData?.avgCompletion ?? 0}%`, icon: Target, color: "#F59E0B", bg: "#FFFBEB" },
  ];

  // Daily activity items
  const dailyItems = [
    { label: "Lessons watched today", value: dailyStatsData?.lessonsWatchedToday?.toLocaleString() ?? "0", change: dailyStatsData?.lessonsWatchedChange ?? 0, up: (dailyStatsData?.lessonsWatchedChange ?? 0) >= 0 },
    { label: "New enrolments today", value: dailyStatsData?.newEnrolmentsToday?.toLocaleString() ?? "0", change: dailyStatsData?.newEnrolmentsChange ?? 0, up: (dailyStatsData?.newEnrolmentsChange ?? 0) >= 0 },
    { label: "Completions today", value: dailyStatsData?.completionsToday?.toLocaleString() ?? "0", change: dailyStatsData?.completionsChange ?? 0, up: (dailyStatsData?.completionsChange ?? 0) >= 0 },
    { label: "Avg session duration", value: `${dailyStatsData?.avgSessionDurationMinutes ?? 0} min`, change: dailyStatsData?.avgSessionDurationChange ?? 0, up: (dailyStatsData?.avgSessionDurationChange ?? 0) >= 0 },
  ];

  // Filter counts for FilterBar
  // Note: In a real app, you'd want separate API calls for these counts
  const filterCounts = {
    all: totalModules,
    active: modules.filter((m:any) => m.status === "active").length,
    pending: modules.filter((m:any) => m.status === "pending").length,
    inactive: modules.filter((m:any) => m.status === "inactive").length,
  };

  if (modulesLoading || statsLoading || dailyStatsLoading) {
    return (
      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showCreate && <CreateModuleModal onClose={() => setShowCreate(false)} />}
      {editingModule && <EditModuleModal module={editingModule} onClose={() => setEditingModule(null)} />}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Learning Modules"
          subtitle="Manage all legal education modules, topics, and content."
          action={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                <Download size={13} /> Export
              </button>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
                <Plus size={13} /> New Module
              </button>
            </div>
          }
        />

        <StatBar items={stats} />

        {/* Activity summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {dailyItems.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#F3F4F6] p-3.5 flex flex-col gap-1">
              <p className="text-[10px] text-[#9CA3AF] font-medium">{s.label}</p>
              <p className="text-[15px] font-bold text-[#111827]">{s.value}</p>
              <div className={`flex items-center gap-1 text-[10px] font-semibold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                <ArrowUp size={10} className={s.up ? "" : "rotate-180"} />
                {s.change > 0 ? `+${s.change}` : s.change}% vs yesterday
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FilterBar
          options={[
            { value: "all", label: "All", count: filterCounts.all },
            { value: "active", label: "Active", count: filterCounts.active },
            { value: "pending", label: "Pending", count: filterCounts.pending },
            { value: "inactive", label: "Inactive", count: filterCounts.inactive },
          ]}
          value={tab}
          onChange={setTab}
          searchPlaceholder="Search modules or instructors…"
          searchValue={search}
          onSearchChange={setSearch}
          rightSlot={
            <div className="flex items-center gap-2">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors">
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          }
        />

        {/* Module Grid */}
        {modules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <BookOpen size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No modules found</p>
            <p className="text-[12px] text-[#D1D5DB]">Try adjusting your filters or create a new module.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map((mod:any) => (
              <ModuleCard key={mod.id} mod={mod} onDelete={handleDelete} onEdit={setEditingModule} />
            ))}
            {/* Add new card */}
            <button onClick={() => setShowCreate(true)}
              className="rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-8 text-center hover:border-[#E8317A]/40 hover:bg-pink-50/20 transition-all group min-h-[320px]">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                <Plus size={18} className="text-[#9CA3AF] group-hover:text-[#E8317A] transition-colors" />
              </div>
              <p className="text-[13px] font-bold text-[#9CA3AF] group-hover:text-[#111827] transition-colors">New Module</p>
              <p className="text-[11px] text-[#D1D5DB] mt-1">Create a new learning module</p>
            </button>
          </div>
        )}

        {/* Pagination */}
        {modulesData && modulesData?.data?.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-[12px] text-[#9CA3AF]">
              Showing {modules.length} of {modulesData?.data?.total} modules
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-[12px] text-[#6B7280]">
                Page {page} of {modulesData.data?.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(modulesData.data?.totalPages, p + 1))}
                disabled={page === modulesData.data?.totalPages}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}