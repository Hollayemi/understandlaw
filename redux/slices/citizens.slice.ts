import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { 
  ApiResponse, 
  CitizenFull, 
  UpdateCitizenProfilePayload, 
  CitizenProfile, 
  Pagination, 
  UpdateNotificationsPayload, 
  UpdatePrivacyPayload, 
  AwardXPPayload,
} from "@/redux/types";
import { SubscriptionPlan,   Subscription,
  BillingHistory,
  SubscriptionPayload } from "@/app/dashboard/settings/_components/types";

export interface ListCitizensParams {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}

export interface CitizenStats {
  total: number;
  active: number;
  inactive: number;
  avgXP: number;
  totalStudyHours: number;
}

export const citizenApi = createApi({
  reducerPath: "citizenApi",
  baseQuery: axiosBaseQuery({ defaultActor: "admin" }),
  tagTypes: [
    "CitizenMe", 
    "CitizenProfile", 
    "CitizenList", 
    "CitizenStats", 
    "Subscription", 
    "BillingHistory"
  ],

  endpoints: (builder) => ({

    /**
     * GET /api/v1/citizens/me
     * Returns the signed-in citizen's user + profile document.
     */
    getMyProfile: builder.query<ApiResponse<CitizenFull>, void>({
      query: () => ({ url: "/citizens/me", method: "GET" }),
      providesTags: ["CitizenMe"],
    }),

    /**
     * PATCH /api/v1/citizens/me/profile
     * Update preferences, appearance, location.
     */
    updateMyProfile: builder.mutation<ApiResponse<CitizenProfile>, UpdateCitizenProfilePayload>({
      query: (data) => ({ url: "/citizen/me/profile", method: "PATCH", data, endpointActor: "user" }),
      invalidatesTags: ["CitizenMe", "CitizenProfile"],
    }),

    /**
     * PATCH /api/v1/citizens/me/notifications
     * Update notification preferences.
     */
    updateNotifications: builder.mutation<ApiResponse<CitizenProfile>, UpdateNotificationsPayload>({
      query: (data) => ({ url: "/citizens/me/notifications", method: "PATCH", data }),
      invalidatesTags: ["CitizenMe"],
    }),

    /**
     * PATCH /api/v1/citizens/me/privacy
     * Update privacy settings.
     */
    updatePrivacy: builder.mutation<ApiResponse<CitizenProfile>, UpdatePrivacyPayload>({
      query: (data) => ({ url: "/citizens/me/privacy", method: "PATCH", data }),
      invalidatesTags: ["CitizenMe"],
    }),

    /**
     * POST /api/v1/citizens/me/xp
     * Award XP to the current citizen. Triggers level-up check server-side.
     */
    awardXP: builder.mutation<ApiResponse<CitizenProfile>, AwardXPPayload>({
      query: (data) => ({ url: "/citizens/me/xp", method: "POST", data }),
      invalidatesTags: ["CitizenMe"],
    }),


    // ============================================================
    // SUBSCRIPTION & BILLING ENDPOINTS (Lawyer Only)
    // ============================================================

    /**
     * GET /api/v1/citizens/subscription
     * Get current subscription details
     */
    getMySubscription: builder.query<ApiResponse<Subscription>, void>({
      query: () => ({ 
        url: "/citizens/subscription", 
        method: "GET" 
      }),
      providesTags: ["Subscription"],
    }),

    /**
     * GET /api/v1/citizens/billing-history
     * Get billing history with pagination
     */
    getBillingHistory: builder.query<ApiResponse<BillingHistory[]>, { limit?: number; offset?: number }>({
      query: (params) => ({
        url: "/citizens/billing-history",
        method: "GET",
        params: {
          ...(params.limit && { limit: params.limit }),
          ...(params.offset && { offset: params.offset }),
        },
      }),
      providesTags: ["BillingHistory"],
    }),

    /**
     * GET /api/v1/citizens/subscription/plans
     * Get available subscription plans
     */
    getSubscriptionPlans: builder.query<ApiResponse<SubscriptionPlan[]>, void>({
      query: () => ({ 
        url: "/citizens/subscription/plans", 
        method: "GET" 
      }),
      providesTags: ["Subscription"],
    }),

    /**
     * POST /api/v1/citizens/subscription/subscribe
     * Subscribe to a plan
     */
    subscribeToPlan: builder.mutation<
      ApiResponse<{ subscriptionId: string; paymentUrl?: string }>, 
      SubscriptionPayload
    >({
      query: (data) => ({
        url: "/citizens/subscription/subscribe",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Subscription", "BillingHistory"],
    }),

    /**
     * POST /api/v1/citizens/subscription/cancel
     * Cancel current subscription
     */
    cancelSubscription: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: "/citizens/subscription/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * POST /api/v1/citizens/subscription/reactivate
     * Reactivate a cancelled subscription
     */
    reactivateSubscription: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: "/citizens/subscription/reactivate",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * PUT /api/v1/citizens/subscription/auto-renew
     * Update auto-renew setting
     */
    updateAutoRenew: builder.mutation<
      ApiResponse<{ autoRenew: boolean }>, 
      { autoRenew: boolean }
    >({
      query: (data) => ({
        url: "/citizens/subscription/auto-renew",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * GET /api/v1/citizens/subscription/invoice/:invoiceId
     * Get invoice URL for a specific billing entry
     */
    getInvoice: builder.query<ApiResponse<{ invoiceUrl: string }>, string>({
      query: (invoiceId) => ({
        url: `/citizens/subscription/invoice/${invoiceId}`,
        method: "GET",
      }),
    }),

    /**
     * POST /api/v1/citizens/subscription/change-plan
     * Change to a different subscription plan
     */
    changePlan: builder.mutation<
      ApiResponse<{ subscriptionId: string; paymentUrl?: string }>,
      { planId: string; interval: 'monthly' | 'yearly' }
    >({
      query: (data) => ({
        url: "/citizens/subscription/change-plan",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Subscription", "BillingHistory"],
    }),

    /**
     * GET /api/v1/admin/citizens
     * Admin: paginated list of citizens with optional filters.
     */
    listCitizens: builder.query<ApiResponse<Pagination<CitizenFull[]>>, ListCitizensParams>({
      query: (params) => ({
        url: "/admin/citizens",
        method: "GET",
        params: {
          ...(params.search   && { search: params.search }),
          ...(params.page     && { page: params.page }),
          ...(params.pageSize && { pageSize: params.pageSize }),
          ...(params.isActive !== undefined && { isActive: params.isActive }),
        },
      }),
      providesTags: ["CitizenList"],
    }),

    /**
     * GET /api/v1/admin/citizens/stats
     * Admin: aggregate stats for dashboard.
     */
    getCitizenStats: builder.query<ApiResponse<CitizenStats>, void>({
      query: () => ({ url: "/admin/citizens/stats", method: "GET" }),
      providesTags: ["CitizenStats"],
    }),

    /**
     * GET /api/v1/admin/citizens/:userId
     * Admin: get single citizen by userId.
     */
    getCitizenById: builder.query<ApiResponse<CitizenFull>, string>({
      query: (userId) => ({ url: `/admin/citizens/${userId}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "CitizenProfile", id }],
    }),

    /**
     * PATCH /api/v1/admin/citizens/:userId/status
     * Admin: suspend or reactivate a citizen account.
     */
    updateCitizenStatus: builder.mutation<
      ApiResponse<{ userId: string; isActive: boolean }>,
      { userId: string; action: "suspend" | "reactivate"; reason: string }
    >({
      query: ({ userId, ...data }) => ({
        url: `/admin/citizens/${userId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        "CitizenList",
        "CitizenStats",
        { type: "CitizenProfile", id: userId },
      ],
    }),

    /**
     * POST /api/v1/admin/citizens/:userId/email
     * Admin: send a direct email to a citizen.
     */
    emailCitizen: builder.mutation<
      ApiResponse<{ message: string }>,
      { userId: string; subject: string; body: string }
    >({
      query: ({ userId, ...data }) => ({
        url: `/admin/citizens/${userId}/email`,
        method: "POST",
        data,
      }),
    }),
  }),
});

// ─── Export hooks ─────────────────────────────────────────────────────────────

export const {
  // Citizen-facing
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateNotificationsMutation,
  useUpdatePrivacyMutation,
  useAwardXPMutation,
  
  // Admin-facing
  useListCitizensQuery,
  useGetCitizenStatsQuery,
  useGetCitizenByIdQuery,
  useUpdateCitizenStatusMutation,
  useEmailCitizenMutation,
  
  // Subscription & Billing
  useGetMySubscriptionQuery,
  useGetBillingHistoryQuery,
  useGetSubscriptionPlansQuery,
  useSubscribeToPlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useUpdateAutoRenewMutation,
  useGetInvoiceQuery,
  useChangePlanMutation,
} = citizenApi;