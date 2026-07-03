// consultations.slice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import {
  Consultation,
  ConsultationStats,
  PaginatedConsultations,
  PaginatedMatchRequests,
  ListConsultationsParams,
  ListMatchRequestsParams,
  UpdateConsultationStatusPayload,
  ResolveDisputePayload,
  FlagConsultationPayload,
  ApproveRefundPayload,
  AssignLawyerToMatchPayload,
  AutoMatchPayload,
  BulkActionPayload,
  AdminActionResult,
  ExportConsultationsParams,
  LawyerPerformanceStats,
  DashboardStats,
  MatchRequest,
} from "@/redux/types/consultation";
import { ApiResponse } from "@/redux/types/lawyer";

export const consultationsApi = createApi({
  reducerPath: "consultationsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: [
    // Citizen consultation tags
    "CitizenConsultations",
    "CitizenConsultation",
    "CitizenStats",
    
    // Lawyer consultation tags
    "LawyerConsultations",
    "LawyerConsultation",
    "LawyerStats",
    
    // Match request tags
    "MatchRequests",
    "MatchRequest",
    
    // Admin tags
    "AdminConsultations",
    "Disputes",
    "Refunds",
    "Flags",
    "LawyerPerformance",
    "DashboardStats",
  ],

  endpoints: (builder) => ({
    // ========== CITIZEN (USER) ENDPOINTS ==========

    // Pay Consultation Fee
    payConsultation: builder.mutation<ApiResponse<any>, {id: string}>({
      query: ({id}) => ({
        url: `/consultations/pay/${id}`,
        method: "PATCH",
      }),
    }),

    // Get all consultations for the logged-in citizen
    getCitizenConsultations: builder.query<
      ApiResponse<PaginatedConsultations>,
      ListConsultationsParams
    >({
      query: (params) => ({
        url: "/consultations/citizen",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({ type: "CitizenConsultation" as const, id })),
              { type: "CitizenConsultations", id: "LIST" },
            ]
          : [{ type: "CitizenConsultations", id: "LIST" }],
    }),

    // Get single consultation for citizen
    getCitizenConsultation: builder.query<ApiResponse<Consultation>, string>({
      query: (id) => ({
        url: `/consultations/citizen/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CitizenConsultation", id }],
    }),

    // Get citizen consultation stats (counts by status, total spent)
    getCitizenStats: builder.query<ApiResponse<ConsultationStats>, void>({
      query: () => ({
        url: "/consultations/citizen/stats",
        method: "GET",
      }),
      providesTags: ["CitizenStats"],
    }),

    // Raise a dispute on a consultation (citizen)
    raiseDispute: builder.mutation<
      ApiResponse<Consultation>,
      { consultationId: string; reason: string }
    >({
      query: ({ consultationId, reason }) => ({
        url: `/consultations/citizen/${consultationId}/dispute`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "CitizenConsultation", id: consultationId },
        "CitizenConsultations",
        "CitizenStats",
      ],
    }),

    // Request refund for a consultation (citizen)
    requestRefund: builder.mutation<
      ApiResponse<Consultation>,
      { consultationId: string; reason?: string }
    >({
      query: ({ consultationId, reason }) => ({
        url: `/consultations/citizen/${consultationId}/refund-request`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "CitizenConsultation", id: consultationId },
        "CitizenConsultations",
        "CitizenStats",
      ],
    }),

    // Submit rating for a completed consultation (citizen)
    submitRating: builder.mutation<
      ApiResponse<Consultation>,
      { consultationId: string; rating: number; comment?: string }
    >({
      query: ({ consultationId, rating, comment }) => ({
        url: `/consultations/citizen/${consultationId}/rating`,
        method: "POST",
        data: { rating, comment },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "CitizenConsultation", id: consultationId },
        "CitizenConsultations",
        "CitizenStats",
      ],
    }),

    // Send a follow-up message in active consultation
    sendMessage: builder.mutation<
      ApiResponse<{ message: any; consultationId: string }>,
      { consultationId: string; text: string }
    >({
      query: ({ consultationId, text }) => ({
        url: `/consultations/citizen/${consultationId}/messages`,
        method: "POST",
        data: { text },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "CitizenConsultation", id: consultationId },
      ],
    }),

    // ========== LAWYER ENDPOINTS ==========

    // Get all consultations for the logged-in lawyer
    getLawyerConsultations: builder.query<
      ApiResponse<PaginatedConsultations>,
      ListConsultationsParams
    >({
      query: (params) => ({
        url: "/consultations/lawyer",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({ type: "LawyerConsultation" as const, id })),
              { type: "LawyerConsultations", id: "LIST" },
            ]
          : [{ type: "LawyerConsultations", id: "LIST" }],
    }),

    // Get single consultation for lawyer
    getLawyerConsultation: builder.query<ApiResponse<Consultation>, string>({
      query: (id) => ({
        url: `/consultations/lawyer/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LawyerConsultation", id }],
    }),

    // Get lawyer consultation stats
    getLawyerStats: builder.query<
      ApiResponse<{
        total: number;
        active: number;
        awaitingLawyer: number;
        completed: number;
        disputed: number;
        cancelled: number;
        totalEarnings: number;
        averageRating: number;
        completionRate: number;
      }>,
      void
    >({
      query: () => ({
        url: "/consultations/lawyer/stats",
        method: "GET",
      }),
      providesTags: ["LawyerStats"],
    }),

    // Accept a consultation request (lawyer)
    acceptConsultation: builder.mutation<ApiResponse<Consultation>, string>({
      query: (id) => ({
        url: `/consultations/lawyer/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LawyerConsultation", id },
        "LawyerConsultations",
        "LawyerStats",
        "MatchRequests",
      ],
    }),

    // Reject a consultation request (lawyer)
    rejectConsultation: builder.mutation<
      ApiResponse<Consultation>,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/consultations/lawyer/${id}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LawyerConsultation", id },
        "LawyerConsultations",
        "LawyerStats",
      ],
    }),

    // Lawyer sends a message in active consultation
    sendLawyerMessage: builder.mutation<
      ApiResponse<{ message: any; consultationId: string }>,
      { consultationId: string; text: string }
    >({
      query: ({ consultationId, text }) => ({
        url: `/consultations/lawyer/${consultationId}/messages`,
        method: "POST",
        data: { text },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "LawyerConsultation", id: consultationId },
      ],
    }),

    // Mark consultation as completed (lawyer)
    completeConsultation: builder.mutation<ApiResponse<Consultation>, string>({
      query: (id) => ({
        url: `/consultations/lawyer/${id}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LawyerConsultation", id },
        "LawyerConsultations",
        "LawyerStats",
      ],
    }),

    // ========== MATCH REQUEST ENDPOINTS ==========

    // Get match requests for lawyer
    getMatchRequests: builder.query<
      ApiResponse<PaginatedMatchRequests>,
      ListMatchRequestsParams
    >({
      query: (params) => ({
        url: "/consultations/matches",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({ type: "MatchRequest" as const, id })),
              { type: "MatchRequests", id: "LIST" },
            ]
          : [{ type: "MatchRequests", id: "LIST" }],
    }),

    // Accept a match request (lawyer)
    acceptMatchRequest: builder.mutation<ApiResponse<MatchRequest>, string>({
      query: (id) => ({
        url: `/consultations/matches/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "MatchRequest", id },
        "MatchRequests",
        "LawyerConsultations",
      ],
    }),

    // Reject a match request (lawyer)
    rejectMatchRequest: builder.mutation<
      ApiResponse<{ success: boolean }>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/consultations/matches/${id}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MatchRequest", id },
        "MatchRequests",
      ],
    }),

    // ========== ADMIN ENDPOINTS ==========

    // Get all consultations (admin)
    getAdminConsultations: builder.query<
      ApiResponse<PaginatedConsultations>,
      ListConsultationsParams & { lawyerId?: string; citizenId?: string }
    >({
      query: (params) => ({
        url: "/admin/consultations",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({ type: "AdminConsultations" as const, id })),
              { type: "AdminConsultations", id: "LIST" },
            ]
          : [{ type: "AdminConsultations", id: "LIST" }],
    }),

    // Update consultation status (admin)
    updateConsultationStatus: builder.mutation<
      ApiResponse<Consultation>,
      UpdateConsultationStatusPayload
    >({
      query: ({ consultationId, status, note }) => ({
        url: `/admin/consultations/${consultationId}/status`,
        method: "PATCH",
        data: { status, note },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "AdminConsultations", id: consultationId },
        { type: "LawyerConsultation", id: consultationId },
        { type: "CitizenConsultation", id: consultationId },
        "AdminConsultations",
        "LawyerConsultations",
        "CitizenConsultations",
        "LawyerStats",
        "CitizenStats",
      ],
    }),

    // Resolve a dispute (admin)
    resolveDispute: builder.mutation<
      ApiResponse<Consultation>,
      ResolveDisputePayload
    >({
      query: ({ consultationId, decision, refundAmount, reason }) => ({
        url: `/admin/consultations/${consultationId}/dispute/resolve`,
        method: "POST",
        data: { decision, refundAmount, reason },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "AdminConsultations", id: consultationId },
        { type: "LawyerConsultation", id: consultationId },
        { type: "CitizenConsultation", id: consultationId },
        "AdminConsultations",
        "LawyerConsultations",
        "CitizenConsultations",
        "Disputes",
      ],
    }),

    // Flag a consultation for review (admin)
    flagConsultation: builder.mutation<
      ApiResponse<Consultation>,
      FlagConsultationPayload
    >({
      query: ({ consultationId, reason, severity }) => ({
        url: `/admin/consultations/${consultationId}/flag`,
        method: "POST",
        data: { reason, severity },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "AdminConsultations", id: consultationId },
        "AdminConsultations",
        "Flags",
      ],
    }),

    // Approve or reject a refund request (admin)
    approveRefund: builder.mutation<
      ApiResponse<Consultation>,
      ApproveRefundPayload
    >({
      query: ({ consultationId, approved, adminNote }) => ({
        url: `/admin/consultations/${consultationId}/refund`,
        method: "POST",
        data: { approved, adminNote },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "AdminConsultations", id: consultationId },
        { type: "LawyerConsultation", id: consultationId },
        { type: "CitizenConsultation", id: consultationId },
        "AdminConsultations",
        "Refunds",
        "LawyerStats",
        "CitizenStats",
      ],
    }),

    // Get all disputed consultations (admin)
    getDisputes: builder.query<
      ApiResponse<PaginatedConsultations>,
      { status?: "pending" | "resolved"; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/admin/consultations/disputes",
        method: "GET",
        params,
      }),
      providesTags: ["Disputes"],
    }),

    // Get all refund requests (admin)
    getRefundRequests: builder.query<
      ApiResponse<PaginatedConsultations>,
      { status?: "pending" | "approved" | "rejected"; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/admin/consultations/refunds",
        method: "GET",
        params,
      }),
      providesTags: ["Refunds"],
    }),

    // Get flagged consultations (admin)
    getFlaggedConsultations: builder.query<
      ApiResponse<PaginatedConsultations>,
      { severity?: "low" | "medium" | "high"; resolved?: boolean; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/admin/consultations/flagged",
        method: "GET",
        params,
      }),
      providesTags: ["Flags"],
    }),

    // Bulk action on consultations (admin)
    bulkAction: builder.mutation<ApiResponse<AdminActionResult>, BulkActionPayload>({
      query: ({ consultationIds, action, reason }) => ({
        url: "/admin/consultations/bulk",
        method: "POST",
        data: { consultationIds, action, reason },
      }),
      invalidatesTags: (result) =>
        result?.data?.affectedCount
          ? [
              "AdminConsultations",
              "LawyerConsultations",
              "CitizenConsultations",
              "Disputes",
              "Refunds",
              "Flags",
            ]
          : [],
    }),

    // Get lawyer performance stats (admin)
    getLawyerPerformance: builder.query<
      ApiResponse<LawyerPerformanceStats[]>,
      { startDate?: string; endDate?: string; minSessions?: number }
    >({
      query: (params) => ({
        url: "/admin/analytics/lawyer-performance",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerPerformance"],
    }),

    // Get dashboard stats (admin)
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => ({
        url: "/admin/consultations/dashboard",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),

    // Export consultations to CSV/Excel (admin)
    exportConsultations: builder.query<
      { url: string },
      ExportConsultationsParams
    >({
      query: (params) => ({
        url: "/admin/consultations/export",
        method: "GET",
        params,
        responseHandler: "blob",
      }),
    }),

    // Assign lawyer to match request (admin)
    assignLawyerToMatch: builder.mutation<
      ApiResponse<MatchRequest>,
      AssignLawyerToMatchPayload
    >({
      query: ({ matchRequestId, lawyerId }) => ({
        url: `/admin/matches/${matchRequestId}/assign`,
        method: "POST",
        data: { lawyerId },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        "MatchRequests",
      ],
    }),

    // Trigger auto-matching for a request (admin)
    autoMatch: builder.mutation<
      ApiResponse<{ matchedLawyerId?: string }>,
      AutoMatchPayload
    >({
      query: ({ matchRequestId }) => ({
        url: `/admin/matches/${matchRequestId}/auto-match`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        "MatchRequests",
      ],
    }),

    // ========== UTILITY ENDPOINTS ==========

    // Get all available statuses for filtering
    getAvailableStatuses: builder.query<
      ApiResponse<{ value: string; label: string; count?: number }[]>,
      { role: "citizen" | "lawyer" | "admin" }
    >({
      query: ({ role }) => ({
        url: `/consultations/statuses/${role}`,
        method: "GET",
      }),
    }),
  }),
});

// ========== EXPORTED HOOKS ==========

// Citizen hooks
export const {
  usePayConsultationMutation,
  useGetCitizenConsultationsQuery,
  useGetCitizenConsultationQuery,
  useGetCitizenStatsQuery,
  useRaiseDisputeMutation,
  useRequestRefundMutation,
  useSubmitRatingMutation,
  useSendMessageMutation,
} = consultationsApi;

// Lawyer hooks
export const {
  useGetLawyerConsultationsQuery,
  useGetLawyerConsultationQuery,
  useGetLawyerStatsQuery,
  useAcceptConsultationMutation,
  useRejectConsultationMutation,
  useSendLawyerMessageMutation,
  useCompleteConsultationMutation,
} = consultationsApi;

// Match request hooks
export const {
  useGetMatchRequestsQuery,
  useAcceptMatchRequestMutation,
  useRejectMatchRequestMutation,
} = consultationsApi;

// Admin hooks
export const {
  useGetAdminConsultationsQuery,
  useUpdateConsultationStatusMutation,
  useResolveDisputeMutation,
  useFlagConsultationMutation,
  useApproveRefundMutation,
  useGetDisputesQuery,
  useGetRefundRequestsQuery,
  useGetFlaggedConsultationsQuery,
  useBulkActionMutation,
  useGetLawyerPerformanceQuery,
  useGetDashboardStatsQuery,
  useLazyExportConsultationsQuery,
  useAssignLawyerToMatchMutation,
  useAutoMatchMutation,
} = consultationsApi;

// Utility hooks
export const {
  useGetAvailableStatusesQuery,
} = consultationsApi;