import { ApiResponse } from './../../types';
import { axiosBaseQuery } from '@/redux/shared/axiosBaseQuery';
import { createApi } from "@reduxjs/toolkit/query/react";
import { AdminRole, AuditAction, AdminUser, CreateAdminPayload, UpdateAdminPayload, AdminFilters, OnboardingCompletePayload, ChangePasswordPayload, ResetPasswordPayload, InviteAdminPayload, AuditLogEntry, AuditLogFilters, OnboardingStep, AdminOnboardingState, } from "@/redux/types/admin"
import { PaginatedResponse } from '../types';

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery: axiosBaseQuery({ defaultActor: "admin" }),
  tagTypes: [
    "Admin",
    "AdminList",
    "CurrentAdmin",
    "AuditLog",
    "AuditLogList",
    "Invite",
  ],

  endpoints: (builder) => ({
    /**
     * POST /admin/auth/login
     * Login for all admin roles
     */
    login: builder.mutation<
      { token: string; admin: AdminUser; requiresOnboarding: boolean },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/admin/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["CurrentAdmin"],
    }),

    /**
     * POST /admin/auth/logout
     * Logout current admin
     */
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["CurrentAdmin"],
    }),

    /**
     * GET /admin/auth/me
     * Get current logged-in admin with onboarding status
     */
    getCurrentAdmin: builder.query<AdminUser & { onboarding: AdminOnboardingState }, void>({
      query: () => ({
        url: "/admin/auth/me"
      }),
      providesTags: ["CurrentAdmin"],
    }),

    /**
     * POST /admin/auth/onboarding
     * Complete onboarding step
     */
    completeOnboardingStep: builder.mutation<
      { admin: AdminUser; nextStep: OnboardingStep | null; completed: boolean },
      { step: OnboardingStep; data: OnboardingCompletePayload }
    >({
      query: ({ step, data }) => ({
        url: `/admin/auth/onboarding/${step}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["CurrentAdmin"],
    }),

    /**
     * POST /admin/auth/change-password
     * Change password (requires current password)
     */
    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (data) => ({
        url: "/admin/auth/change-password",
        method: "POST",
        data: data,
      }),
    }),

    /**
     * POST /admin/auth/forgot-password
     * Request password reset
     */
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/admin/auth/forgot-password",
        method: "POST",
        data: data,
      }),
    }),

    /**
     * POST /admin/auth/reset-password
     * Reset password using token
     */
    resetPassword: builder.mutation<{ message: string }, ResetPasswordPayload>({
      query: (data) => ({
        url: "/admin/auth/reset-password",
        method: "POST",
        data: data,
      }),
    }),
    /**
     * GET /admin/admins
     * List all admin users with filtering
     */

    getAdmins: builder.query<ApiResponse<PaginatedResponse<AdminUser[]>>, AdminFilters>({
      query: (filters) => ({
        url: "/admin/admins",
        params: {
          ...(filters.role && filters.role !== "all" && { role: filters.role }),
          ...(filters.isActive !== undefined && { isActive: filters.isActive }),
          ...(filters.search && { search: filters.search }),
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 20,
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        },
      }),
      providesTags: [{ type: "AdminList" }],
    }),

    /**
     * GET /admin/admins/:id
     * Get single admin by ID
     */
    getAdminById: builder.query<AdminUser, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`
      }),
      providesTags: (result, error, id) => [{ type: "Admin", id }],
    }),

    /**
     * POST /admin/admins
     * Create new admin (invite or direct create)
     */
    createAdmin: builder.mutation<{ admin: AdminUser; inviteSent?: boolean }, CreateAdminPayload>({
      query: (data) => ({
        url: "/admin/admins",
        method: "POST",
        data,
      }),
      invalidatesTags: ["AdminList"],
    }),

    /**
     * PATCH /admin/admins/:id
     * Update admin details
     */
    updateAdmin: builder.mutation<AdminUser, { id: string; data: UpdateAdminPayload }>({
      query: ({ id, data }) => ({
        url: `/admin/admins/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Admin", id },
        "AdminList",
      ],
    }),

    /**
     * DELETE /admin/admins/:id
     * Soft delete admin (deactivate)
     */
    deleteAdmin: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminList"],
    }),

    /**
     * POST /admin/admins/:id/reactivate
     * Reactivate soft-deleted admin
     */
    reactivateAdmin: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/admin/admins/${id}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Admin", id },
        "AdminList",
      ],
    }),

    /**
     * POST /admin/admins/invite
     * Send invite email to new admin
     */
    inviteAdmin: builder.mutation<{ message: string; inviteId: string }, InviteAdminPayload>({
      query: (data) => ({
        url: "/admin/admins/invite",
        method: "POST",
        data,
      }),
      invalidatesTags: ["AdminList", "Invite"],
    }),

    /**
     * POST /admin/admins/invite/:token/accept
     * Accept invite and complete onboarding
     */
    acceptInvite: builder.mutation<
      { token: string; admin: AdminUser },
      { token: string; password: string; name: string }
    >({
      query: ({ token, ...data }) => ({
        url: `/admin/admins/invite/${token}/accept`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["CurrentAdmin"],
    }),

    /**
     * POST /admin/admins/:id/change-role
     * Change admin role (SUPER_ADMIN only)
     */
    changeAdminRole: builder.mutation<AdminUser, { id: string; role: AdminRole; reason?: string }>({
      query: ({ id, role, reason }) => ({
        url: `/admin/admins/${id}/role`,
        method: "PATCH",
        data: { role, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Admin", id },
        "AdminList",
      ],
    }),

    /**
     * GET /admin/audit-logs
     * Get audit logs with filtering (SUPER_ADMIN only)
     */
    getAuditLogs: builder.query<
      { data: AuditLogEntry[]; total: number; page: number; pageSize: number; totalPages: number },
      AuditLogFilters
    >({
      query: (filters) => ({
        url: "/admin/audit-logs",
        params: {
          ...(filters.adminId && { adminId: filters.adminId }),
          ...(filters.action && { action: filters.action }),
          ...(filters.targetType && { targetType: filters.targetType }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 50,
        },
      }),
      providesTags: ["AuditLogList"],
    }),

    /**
     * GET /admin/audit-logs/my
     * Get current admin's own audit logs
     */
    getMyAuditLogs: builder.query<
      { data: AuditLogEntry[]; total: number; page: number; pageSize: number; totalPages: number },
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 20 }) => ({
        url: "/admin/audit-logs/my",
        params: { page, pageSize },
      }),
      providesTags: ["AuditLog"],
    }),


    
    /**
     * GET /admin/instructors
     * Get all instructors (for module assignment)
     */
    getInstructors: builder.query<ApiResponse<AdminUser[]>, { search?: string; limit?: number }>({
      query: ({ search, limit = 50 }) => ({
        url: "/admin/instructors",
        params: {
          ...(search && { search }),
          limit,
        },
      }),
      providesTags: ["AdminList"],
    }),

    /**
     * GET /admin/instructors/:id/modules
     * Get modules assigned to an instructor
     */
    getInstructorModules: builder.query<
      { moduleId: string; title: string; enrolledCount: number; completionRate: number }[],
      string
    >({
      query: (instructorId) => ({
        url: `/admin/instructors/${instructorId}/modules`
      }),
      providesTags: ["AdminList"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentAdminQuery,
  useCompleteOnboardingStepMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = adminsApi;

// Admin Management
export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useReactivateAdminMutation,
  useInviteAdminMutation,
  useAcceptInviteMutation,
  useChangeAdminRoleMutation,
} = adminsApi;

// Audit Logs
export const {
  useGetAuditLogsQuery,
  useGetMyAuditLogsQuery,
} = adminsApi;

// Role-specific
export const {
  useGetInstructorsQuery,
  useGetInstructorModulesQuery,
} = adminsApi;
