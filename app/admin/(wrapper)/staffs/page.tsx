"use client";
import React, { useState, useCallback } from "react";
import {
  Plus, Search, MoreHorizontal, Edit2, Trash2, UserPlus,
  Shield, UserCog, GraduationCap, Eye, EyeOff, CheckCircle,
  XCircle, RefreshCw, Mail, X, Filter, Users,
  UserCheck, UserX, RotateCcw,
} from "lucide-react";
import { PageHeader, StatusBadge } from "../_components";
import {
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useReactivateAdminMutation,
  useUpdateAdminMutation,
  useCreateAdminMutation
} from "@/redux/slices/admin/admin.slice";

import { AdminRole,  AdminUser,  AdminFilters} from "@/redux/types/admin"

// Role configuration
const ROLE_CONFIG: Record<AdminRole, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  [AdminRole.SUPER_ADMIN]: { label: "Super Admin", icon: Shield, color: "#8B5CF6", bg: "#F5F3FF" },
  [AdminRole.ADMIN]: { label: "Admin", icon: UserCog, color: "#3B82F6", bg: "#EFF6FF" },
  [AdminRole.INSTRUCTOR]: { label: "Instructor", icon: GraduationCap, color: "#10B981", bg: "#ECFDF5" },
  [AdminRole.MODERATOR]: { label: "Moderator", icon: Users, color: "#F59E0B", bg: "#FFFBEB" },
  [AdminRole.ANALYST]: { label: "Analyst", icon: UserCheck, color: "#06B6D4", bg: "#ECFEFF" },
  [AdminRole.SUPPORT]: { label: "Support", icon: UserX, color: "#E8317A", bg: "#FFF0F5" },
};

// Role options for dropdown
const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  ...Object.entries(ROLE_CONFIG).map(([key, val]) => ({ value: key, label: val.label })),
];

// Status options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Create/Edit Admin Modal
function AdminModal({
  isOpen,
  onClose,
  editingAdmin,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingAdmin?: AdminUser | null;
  onSuccess?: () => void;
}) {
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const [form, setForm] = useState({
    name: editingAdmin?.name || "",
    email: editingAdmin?.email || "",
    role: editingAdmin?.role || AdminRole.INSTRUCTOR,
    password: "",
    sendInvite: true,
  });

  const isLoading = isCreating || isUpdating;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [k]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await updateAdmin({
          id: editingAdmin.id,
          data: {
            name: form.name,
            role: form.role,
          },
        }).unwrap();
      } else {
        await createAdmin({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || undefined,
          sendInvite: form.sendInvite,
        }).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save admin:", error);
    }
  };

  if (!isOpen) return null;

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {editingAdmin ? "Update admin details" : "Invite a new admin to the platform"}
              </p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={set("name")}
                required
                className={inputCls}
                placeholder="e.g. John Doe"
              />
            </div>

            {!editingAdmin && (
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  className={inputCls}
                  placeholder="john@example.com"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select value={form.role} onChange={set("role")} className={inputCls}>
                {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            {!editingAdmin && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                    Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={set("password")}
                    className={inputCls}
                    placeholder="Leave blank to send invite"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={form.sendInvite}
                    onChange={set("sendInvite")}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#E8317A] focus:ring-[#E8317A]"
                  />
                  <label htmlFor="sendInvite" className="text-[12px] text-[#6B7280]">
                    Send invitation email
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-40 transition-colors"
              >
                {isLoading ? "Saving..." : (editingAdmin ? "Save Changes" : "Create Admin")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  isOpen,
  onClose,
  admin,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onConfirm: () => void;
}) {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <h3 className="font-bold text-[#111827] text-sm mb-2">Delete Admin</h3>
          <p className="text-[12px] text-[#6B7280] mb-6">
            Are you sure you want to deactivate <span className="font-semibold text-[#111827]}">{admin.name}</span>?
            They will no longer be able to access the admin panel.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reactivate Confirmation Modal
function ReactivateConfirmModal({
  isOpen,
  onClose,
  admin,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onConfirm: () => void;
}) {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={20} className="text-green-500" />
          </div>
          <h3 className="font-bold text-[#111827] text-sm mb-2">Reactivate Admin</h3>
          <p className="text-[12px] text-[#6B7280] mb-6">
            Are you sure you want to reactivate <span className="font-semibold text-[#111827]}">{admin.name}</span>?
            They will regain access to the admin panel with their previous permissions.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-green-500 hover:bg-green-600 transition-colors"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Card Component
function AdminCard({
  admin,
  onEdit,
  onDelete,
  onReactivate,
}: {
  admin: AdminUser;
  onEdit: (admin: AdminUser) => void;
  onDelete: (admin: AdminUser) => void;
  onReactivate: (admin: AdminUser) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const roleConfig = ROLE_CONFIG[admin.role] || ROLE_CONFIG[AdminRole.ADMIN];
  const RoleIcon = roleConfig.icon;
  const isActive = admin.isActive && !admin.removedAt;

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${roleConfig.color}, ${roleConfig.color}80)` }}
            >
              {admin.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#111827]">{admin.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RoleIcon size={10} style={{ color: roleConfig.color }} />
                <span className="text-[10px] font-medium" style={{ color: roleConfig.color }}>
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(admin);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-[#111827]"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  {isActive ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(admin);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-red-500"
                    >
                      <Trash2 size={12} /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onReactivate(admin);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-green-500"
                    >
                      <RotateCcw size={12} /> Reactivate
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 mb-3 text-[11px] text-[#6B7280]">
          <Mail size={12} />
          <span className="truncate">{admin.email}</span>
        </div>

        {/* Status and Last Login */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <XCircle size={10} /> Inactive
              </span>
            )}
          </div>
          {admin.lastLogin && (
            <span className="text-[9px] text-[#9CA3AF]">
              Last login: {new Date(admin.lastLogin).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Admin Management Page
export default function AdminManagementPage() {
  // Filters state
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);
  const [reactivatingAdmin, setReactivatingAdmin] = useState<AdminUser | null>(null);

  // RTK Query hooks
  const filters: AdminFilters = {
    role: roleFilter !== "all" ? roleFilter as AdminRole : undefined,
    isActive: statusFilter !== "all" ? statusFilter === "active" : undefined,
    search: search || undefined,
    page,
    pageSize,
  };

  const { data: adminsData, isLoading, refetch } = useGetAdminsQuery(filters);
  const [deleteAdmin] = useDeleteAdminMutation();
  const [reactivateAdmin] = useReactivateAdminMutation();

  const admins = adminsData?.data?.data || [];
  const total = adminsData?.data?.total || 0;
  const totalPages = adminsData?.data?.totalPages || 0;

  const handleDelete = async () => {
    if (deletingAdmin) {
      try {
        await deleteAdmin(deletingAdmin.id).unwrap();
        refetch();
        setDeletingAdmin(null);
      } catch (error) {
        console.error("Failed to delete admin:", error);
      }
    }
  };

  const handleReactivate = async () => {
    if (reactivatingAdmin) {
      try {
        await reactivateAdmin(reactivatingAdmin.id).unwrap();
        refetch();
        setReactivatingAdmin(null);
      } catch (error) {
        console.error("Failed to reactivate admin:", error);
      }
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingAdmin(null);
  };

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateModal(false);
  };

  return (
    <>
      {/* Modals */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <AdminModal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        editingAdmin={editingAdmin}
        onSuccess={handleEditSuccess}
      />
      <DeleteConfirmModal
        isOpen={!!deletingAdmin}
        onClose={() => setDeletingAdmin(null)}
        admin={deletingAdmin}
        onConfirm={handleDelete}
      />
      <ReactivateConfirmModal
        isOpen={!!reactivatingAdmin}
        onClose={() => setReactivatingAdmin(null)}
        admin={reactivatingAdmin}
        onConfirm={handleReactivate}
      />

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Admin Management"
          subtitle="Manage system administrators, instructors, and support staff."
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors"
            >
              <UserPlus size={13} /> Add Admin
            </button>
          }
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-[#F3F4F6] p-3.5">
            <p className="text-[10px] text-[#9CA3AF] font-medium">Total Admins</p>
            <p className="text-[18px] font-bold text-[#111827]">{total}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#F3F4F6] p-3.5">
            <p className="text-[10px] text-[#9CA3AF] font-medium">Active</p>
            <p className="text-[18px] font-bold text-green-600">
              {admins.filter((a:any) => a.isActive && !a.removedAt).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#F3F4F6] p-3.5">
            <p className="text-[10px] text-[#9CA3AF] font-medium">Inactive</p>
            <p className="text-[18px] font-bold text-red-500">
              {admins.filter((a:any) => !a.isActive || a.removedAt).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#F3F4F6] p-3.5">
            <p className="text-[10px] text-[#9CA3AF] font-medium">Instructors</p>
            <p className="text-[18px] font-bold text-[#10B981]">
              {admins.filter((a:any) => a.role === AdminRole.INSTRUCTOR).length}
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-[#F3F4F6] p-3 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E7EB] text-[12px] outline-none focus:border-[#E8317A] transition-colors"
                />
              </div>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors"
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              className="h-9 w-9 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Admin Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#F3F4F6] p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <Users size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No admins found</p>
            <p className="text-[12px] text-[#D1D5DB]">Try adjusting your filters or add a new admin.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {admins.map((admin:AdminUser) => (
                <AdminCard
                  key={admin.id}
                  admin={admin}
                  onEdit={handleEdit}
                  onDelete={setDeletingAdmin}
                  onReactivate={setReactivatingAdmin}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-[12px] text-[#9CA3AF]">
                  Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total} admins
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] disabled:opacity-40 hover:bg-[#F9FAFB] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-[12px] text-[#6B7280]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] disabled:opacity-40 hover:bg-[#F9FAFB] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}