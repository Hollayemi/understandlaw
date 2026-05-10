"use client";
import React, { useState } from "react";
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

//  Types 
type ModuleCategory =
  | "criminal" | "tenancy" | "employment" | "contracts"
  | "business" | "family" | "consumer" | "road";

type ModuleStatus = "active" | "inactive" | "pending";

interface Module {
  id: string;
  title: string;
  category: ModuleCategory;
  status: ModuleStatus;
  thumbnail: string | null;
  description: string;
  topicCount: number;
  enrolledCount: number;
  completionRate: number;
  avgRating: number;
  reviewCount: number;
  totalWatchTime: string;
  createdAt: string;
  updatedAt: string;
  instructor: string;
  instructorInitials: string;
  instructorColor: string;
  trending: boolean;
}

//  Category Config 
const CATEGORY_CONFIG: Record<ModuleCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  criminal:    { label: "Police & Criminal",    icon: Shield,    color: "#3B82F6", bg: "#EFF6FF" },
  tenancy:     { label: "Landlord & Tenancy",   icon: Home,      color: "#10B981", bg: "#ECFDF5" },
  employment:  { label: "Employment & Labour",  icon: Briefcase, color: "#8B5CF6", bg: "#F5F3FF" },
  contracts:   { label: "Contracts & Agreements", icon: FileText, color: "#F59E0B", bg: "#FFFBEB" },
  business:    { label: "Business & Commerce",  icon: Building2, color: "#06B6D4", bg: "#ECFEFF" },
  family:      { label: "Family & Personal",    icon: Heart,     color: "#EF4444", bg: "#FEF2F2" },
  consumer:    { label: "Consumer Rights",      icon: Globe,     color: "#E8317A", bg: "#FFF0F5" },
  road:        { label: "Road Traffic",         icon: Car,       color: "#F97316", bg: "#FFF7ED" },
};

//  Mock Data 
const MODULES: Module[] = [
  {
    id: "m001", title: "Rights During Arrest & Detention",
    category: "criminal", status: "active", thumbnail: "/images/police_law.jpg",
    description: "Know exactly what police can and cannot do,  Section 35 explained in full.",
    topicCount: 14, enrolledCount: 3842, completionRate: 62, avgRating: 4.3, reviewCount: 284,
    totalWatchTime: "2.1k hrs", createdAt: "Jan 12, 2025", updatedAt: "Apr 20, 2025",
    instructor: "Adaeze Okonkwo", instructorInitials: "AO", instructorColor: "#3B82F6",
    trending: true,
  },
  {
    id: "m002", title: "Tenant Eviction Rights in Nigeria",
    category: "tenancy", status: "active", thumbnail: "/images/tenancy_law.jpg",
    description: "Eviction procedures, notice periods, illegal lockouts and deposit recovery.",
    topicCount: 8, enrolledCount: 2519, completionRate: 48, avgRating: 4.1, reviewCount: 191,
    totalWatchTime: "1.4k hrs", createdAt: "Feb 3, 2025", updatedAt: "Apr 18, 2025",
    instructor: "Emeka Nwosu", instructorInitials: "EN", instructorColor: "#10B981",
    trending: true,
  },
  {
    id: "m003", title: "Wrongful Termination & Severance Pay",
    category: "employment", status: "active", thumbnail: "/images/employment_law.jpg",
    description: "Labour Act rights, severance entitlements, and National Industrial Court.",
    topicCount: 12, enrolledCount: 1987, completionRate: 39, avgRating: 3.8, reviewCount: 143,
    totalWatchTime: "980 hrs", createdAt: "Feb 18, 2025", updatedAt: "Apr 15, 2025",
    instructor: "Fatimah Bello", instructorInitials: "FB", instructorColor: "#8B5CF6",
    trending: false,
  },
  {
    id: "m004", title: "What Makes a Contract Valid?",
    category: "contracts", status: "active", thumbnail: "/images/contract_law.jpg",
    description: "Offer, acceptance, consideration, capacity,  all elements explained plainly.",
    topicCount: 7, enrolledCount: 1644, completionRate: 71, avgRating: 4.6, reviewCount: 209,
    totalWatchTime: "740 hrs", createdAt: "Mar 1, 2025", updatedAt: "Apr 22, 2025",
    instructor: "Chidi Okafor", instructorInitials: "CO", instructorColor: "#F59E0B",
    trending: false,
  },
  {
    id: "m005", title: "Registering a Business in Nigeria",
    category: "business", status: "active", thumbnail: null,
    description: "CAC requirements, business name vs company, registration steps.",
    topicCount: 9, enrolledCount: 1102, completionRate: 55, avgRating: 4.5, reviewCount: 87,
    totalWatchTime: "520 hrs", createdAt: "Mar 14, 2025", updatedAt: "Apr 10, 2025",
    instructor: "Amina Garba", instructorInitials: "AG", instructorColor: "#06B6D4",
    trending: false,
  },
  {
    id: "m006", title: "Domestic Violence & Protection Orders",
    category: "family", status: "active", thumbnail: null,
    description: "VAPP Act rights, how to get a protection order, and legal support pathways.",
    topicCount: 8, enrolledCount: 892, completionRate: 44, avgRating: 4.8, reviewCount: 62,
    totalWatchTime: "390 hrs", createdAt: "Apr 1, 2025", updatedAt: "Apr 21, 2025",
    instructor: "Ngozi Eze", instructorInitials: "NE", instructorColor: "#EF4444",
    trending: false,
  },
  {
    id: "m007", title: "Consumer Protection Rights Nigeria",
    category: "consumer", status: "pending", thumbnail: null,
    description: "CPC Act rights, defective product claims, and consumer dispute resolution.",
    topicCount: 6, enrolledCount: 0, completionRate: 0, avgRating: 0, reviewCount: 0,
    totalWatchTime: "—", createdAt: "Apr 19, 2025", updatedAt: "Apr 21, 2025",
    instructor: "Ikechukwu Eze", instructorInitials: "IE", instructorColor: "#E8317A",
    trending: false,
  },
];

//  Create Module Modal 
function CreateModuleModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", category: "criminal" as ModuleCategory,
    description: "", instructor: "",
    thumbnailType: "upload" as "upload" | "url",
    thumbnailUrl: "",
  });
  const [step, setStep] = useState<1 | 2>(1);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">Create New Module</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Step {step} of 2</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-5">
            {[1, 2].map(n => (
              <React.Fragment key={n}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                  step === n ? "bg-[#E8317A] text-white" : step > n ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
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
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Instructor / Legal Expert</label>
                <input value={form.instructor} onChange={set("instructor")} placeholder="e.g. Adaeze Okonkwo" className={inputCls} />
              </div>
              <button onClick={() => setStep(2)} disabled={!form.title || !form.description}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-40 transition-colors">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Module Thumbnail</label>
                <div className="flex gap-2 mb-3">
                  {(["upload", "url"] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, thumbnailType: t }))}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${form.thumbnailType === t ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                      {t === "upload" ? <Upload size={12} /> : <ImageIcon size={12} />}
                      {t === "upload" ? "Upload File" : "Image URL"}
                    </button>
                  ))}
                </div>
                {form.thumbnailType === "upload" ? (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#E8317A] transition-colors cursor-pointer">
                    <Upload size={24} className="text-[#D1D5DB] mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-[#9CA3AF]">Click to upload or drag & drop</p>
                    <p className="text-[10px] text-[#D1D5DB] mt-1">JPG, PNG or WebP, max 5MB</p>
                  </div>
                ) : (
                  <input value={form.thumbnailUrl} onChange={set("thumbnailUrl")}
                    placeholder="https://example.com/image.jpg" className={inputCls} />
                )}
              </div>

              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6]">
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Summary</p>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Title</span><span className="font-semibold text-[#111827] truncate max-w-[200px]">{form.title || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Category</span><span className="font-semibold text-[#111827]">{CATEGORY_CONFIG[form.category].label}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Instructor</span><span className="font-semibold text-[#111827]">{form.instructor || "—"}</span></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                  Back
                </button>
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] transition-colors">
                  Create Module
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//  Module Card 
function ModuleCard({ mod }: { mod: Module }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_CONFIG[mod.category];
  const CatIcon = cat.icon;

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-36 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}08)` }}>
        {mod.thumbnail ? (
          <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon size={40} style={{ color: cat.color, opacity: 0.25 }} />
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
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
                  {[
                    { icon: Eye, label: "View Details", color: "#111827" },
                    { icon: Edit2, label: "Edit Module", color: "#111827" },
                    { icon: Trash2, label: "Delete", color: "#EF4444" },
                  ].map(({ icon: Icon, label, color }) => (
                    <button key={label}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-left"
                      style={{ color }} onClick={() => setMenuOpen(false)}>
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Status badge bottom-left */}
        <div className="absolute bottom-3 left-3">
          <StatusBadge status={mod.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-bold text-[#111827] leading-snug mb-1 line-clamp-2">{mod.title}</h3>
        <p className="text-[11px] text-[#9CA3AF] leading-relaxed mb-3 line-clamp-2 flex-1">{mod.description}</p>

        {/* Stats row */}
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

        {/* Rating + instructor */}
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

        {/* View link */}
        <Link href={`/admin/modules/${mod.id}`}
          className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
          Manage Module <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

//  Main Page 
export default function AdminModulesPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const totalEnrolled = MODULES.reduce((s, m) => s + m.enrolledCount, 0);
  const totalTopics   = MODULES.reduce((s, m) => s + m.topicCount, 0);
  const avgCompletion = Math.round(MODULES.filter(m => m.enrolledCount > 0)
    .reduce((s, m) => s + m.completionRate, 0) / MODULES.filter(m => m.enrolledCount > 0).length);

  const stats = [
    { label: "Total Modules",  value: MODULES.length,                                        icon: BookOpen,   color: "#E8317A", bg: "#FFF0F5" },
    { label: "Total Topics",   value: totalTopics,                                            icon: Layers,     color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Total Enrolled", value: totalEnrolled.toLocaleString(),                        icon: Users,      color: "#10B981", bg: "#ECFDF5" },
    { label: "Avg Completion", value: `${avgCompletion}%`,                                   icon: Target,     color: "#F59E0B", bg: "#FFFBEB" },
  ];

  const filtered = MODULES.filter(m => {
    if (tab === "active"  && m.status !== "active")  return false;
    if (tab === "pending" && m.status !== "pending") return false;
    if (tab === "inactive"&& m.status !== "inactive")return false;
    if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.instructor.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      {showCreate && <CreateModuleModal onClose={() => setShowCreate(false)} />}

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
          {[
            { label: "Lessons watched today", value: "1,247", change: "+12%", up: true },
            { label: "New enrolments today",  value: "84",    change: "+8%",  up: true },
            { label: "Completions today",     value: "31",    change: "-3%",  up: false },
            { label: "Avg session duration",  value: "18 min",change: "+5%",  up: true },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#F3F4F6] p-3.5 flex flex-col gap-1">
              <p className="text-[10px] text-[#9CA3AF] font-medium">{s.label}</p>
              <p className="text-[15px] font-bold text-[#111827]">{s.value}</p>
              <div className={`flex items-center gap-1 text-[10px] font-semibold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                <ArrowUp size={10} className={s.up ? "" : "rotate-180"} />
                {s.change} vs yesterday
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FilterBar
          options={[
            { value: "all",      label: "All",      count: MODULES.length },
            { value: "active",   label: "Active",   count: MODULES.filter(m => m.status === "active").length },
            { value: "pending",  label: "Pending",  count: MODULES.filter(m => m.status === "pending").length },
            { value: "inactive", label: "Inactive", count: MODULES.filter(m => m.status === "inactive").length },
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <BookOpen size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No modules found</p>
            <p className="text-[12px] text-[#D1D5DB]">Try adjusting your filters or create a new module.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
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
        <div className="flex items-center justify-between mt-6 text-[12px] text-[#9CA3AF]">
          <span>Showing {filtered.length} of {MODULES.length} modules</span>
        </div>
      </div>
    </>
  );
}