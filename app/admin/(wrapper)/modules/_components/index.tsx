"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  MoreHorizontal, Edit2, Trash2,
  ChevronRight, Star,
  Shield, Home, Briefcase, FileText, Building2,
  Heart, Car, Globe,
  Flame, X,
  Upload
  ,
} from "lucide-react";
import { StatusBadge } from "../../_components";
import {
  useCreateModuleMutation,
  useUpdateModuleMutation,
} from "@/redux/slices/admin/modules.slice";
import { Module, ModuleCategory, ModuleStatus } from "@/redux/slices/types";
import { useGetInstructorsQuery } from "@/redux/slices/admin/admin.slice";
import ThumbnailUpload, { UploadedImage } from "@/app/components/ui/fileUploader";

// Category Config
export const CATEGORY_CONFIG: Record<ModuleCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  criminal: { label: "Police & Criminal", icon: Shield, color: "#3B82F6", bg: "#EFF6FF" },
  tenancy: { label: "Landlord & Tenancy", icon: Home, color: "#10B981", bg: "#ECFDF5" },
  employment: { label: "Employment & Labour", icon: Briefcase, color: "#8B5CF6", bg: "#F5F3FF" },
  contracts: { label: "Contracts & Agreements", icon: FileText, color: "#F59E0B", bg: "#FFFBEB" },
  business: { label: "Business & Commerce", icon: Building2, color: "#06B6D4", bg: "#ECFEFF" },
  family: { label: "Family & Personal", icon: Heart, color: "#EF4444", bg: "#FEF2F2" },
  consumer: { label: "Consumer Rights", icon: Globe, color: "#7C3AED", bg: "#FFF0F5" },
  road: { label: "Road Traffic", icon: Car, color: "#7C3AED", bg: "#FFF7ED" },
};



// Create Module Modal Component
export function CreateModuleModal({ onClose }: { onClose: () => void }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "criminal" as ModuleCategory,
    description: "",
    instructorId: "",
    thumbnailUrl: "",
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [createModule, { isLoading }] = useCreateModuleMutation();


  const { data: instructorsData, isLoading: instructorsLoading } = useGetInstructorsQuery({});

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
        thumbnailFile: images[0]?.base64 || undefined,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]" />
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
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${step === n ? "bg-[#7C3AED] text-white" : step > n ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
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
                  className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#7C3AED] transition-colors bg-white">
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Brief Overview</label>
                <textarea value={form.description} onChange={set("description")}
                  placeholder="Describe what citizens will learn in this module..."
                  className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="">
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Instructor ID</label>
                <select value={form.instructorId} onChange={set("instructorId")}
                  className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] w-full text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#7C3AED] transition-colors">
                  <option value="all">All Categories</option>
                  {instructors.map((each, i) => (
                    <option key={each?._id} value={each?._id}>{each.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => setStep(2)} disabled={!form.title || !form.description || !form.instructorId}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#7C3AED] hover:bg-[#5B21B6] disabled:opacity-40 transition-colors">
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
              <p className="text-center text-gray-400">OR</p>
              <ThumbnailUpload images={images} setImages={setImages} maxImages={1}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
                  <Upload size={11} /> Upload Thumbnail
                </div>
                <p className="text-[10px] text-[#D1D5DB]">JPG or PNG, 1280×720px recommended</p>
              </ThumbnailUpload>

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
export function ModuleCard({ mod, onDelete, onEdit }: { mod: Module; onDelete: (id: string) => void; onEdit: (mod: Module) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_CONFIG[mod.category as ModuleCategory];
  const CatIcon = cat?.icon || BookOpen;

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <div className="relative h-36 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat?.color || '#7C3AED'}20, ${cat?.color || '#7C3AED'}08)` }}>
        {mod.thumbnail ? (
          <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon size={40} style={{ color: cat?.color || '#7C3AED', opacity: 0.25 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cat?.bg || '#FFF0F5', color: cat?.color || '#7C3AED' }}>
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
          className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all">
          Manage Module <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// Edit Module Modal
export function EditModuleModal({ module, onClose }: { module: Module; onClose: () => void }) {
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

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]" />
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
                className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#7C3AED]"
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
