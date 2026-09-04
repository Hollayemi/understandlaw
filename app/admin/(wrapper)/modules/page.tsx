"use client";
import { useState } from "react";
import {
  BookOpen, Users, Plus, Layers, ArrowUp, Target, Download,
} from "lucide-react";
import { StatBar, FilterBar, PageHeader } from "../_components";
import {
  useGetModulesQuery,
  useGetModuleOverviewStatsQuery,
  useGetDailyActivityStatsQuery,
  useDeleteModuleMutation,
} from "@/redux/slices/admin/modules.slice";
import { Module } from "@/redux/slices/types";
import { CATEGORY_CONFIG, CreateModuleModal, EditModuleModal, ModuleCard } from "./_components";


export default function AdminModulesPage() {
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
    { label: "Total Modules", value: statsData?.data?.totalModules ?? 0, icon: BookOpen, color: "#9B2E3D", bg: "#FFF0F5" },
    { label: "Total Topics", value: statsData?.data?.totalTopics ?? 0, icon: Layers, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Total Enrolled", value: (statsData?.data?.totalEnrolled ?? 0).toLocaleString(), icon: Users, color: "#10B981", bg: "#ECFDF5" },
    { label: "Avg Completion", value: `${statsData?.data?.avgCompletion ?? 0}%`, icon: Target, color: "#F59E0B", bg: "#FFFBEB" },
  ];

  // Daily activity items
  const dailyItems = [
    { label: "Lessons watched today", value: dailyStatsData?.data?.lessonsWatchedToday?.toLocaleString() ?? "0", change: dailyStatsData?.data?.lessonsWatchedChange ?? 0, up: (dailyStatsData?.data?.lessonsWatchedChange ?? 0) >= 0 },
    { label: "New enrolments today", value: dailyStatsData?.data?.newEnrolmentsToday?.toLocaleString() ?? "0", change: dailyStatsData?.data?.newEnrolmentsChange ?? 0, up: (dailyStatsData?.data?.newEnrolmentsChange ?? 0) >= 0 },
    { label: "Completions today", value: dailyStatsData?.data?.completionsToday?.toLocaleString() ?? "0", change: dailyStatsData?.data?.completionsChange ?? 0, up: (dailyStatsData?.data?.completionsChange ?? 0) >= 0 },
    { label: "Avg session duration", value: `${dailyStatsData?.data?.avgSessionDurationMinutes ?? 0} min`, change: dailyStatsData?.data?.avgSessionDurationChange ?? 0, up: (dailyStatsData?.data?.avgSessionDurationChange ?? 0) >= 0 },
  ];

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
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-maroon-500 hover:bg-maroon-600 transition-colors">
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
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-maroon-500 transition-colors">
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
              className="rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-8 text-center hover:border-maroon-500/40 hover:bg-pink-50/20 transition-all group min-h-[320px]">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                <Plus size={18} className="text-[#9CA3AF] group-hover:text-maroon-500 transition-colors" />
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