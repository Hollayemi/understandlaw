import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import {
  Consultation,
  MatchRequest,
  ConsultationStats,
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
  LawyerPerformanceParams,
  DashboardStats,
  RecommendedLawyerRef,
} from "@/redux/types/consultation";
import { ConsultationDocumentMeta } from "@/redux/types/lawyer";
import { PaginatedResponse, ApiResponse } from "../types";

export const adminConsultationApi = createApi({
  reducerPath: "adminConsultationApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "admin" }),
  tagTypes: [
    "Consultation",
    "ConsultationList",
    "ConsultationStats",
    "MatchRequest",
    "MatchRequestList",
    "LawyerPerformance",
    "DashboardStats",
  ],

  endpoints: (builder) => ({

    // ─── Consultation Endpoints ────────────────────────────────────────────────

    /**
     * Get paginated list of consultations with filters
     */
    adminListConsultations: builder.query<PaginatedResponse<Consultation[]>, ListConsultationsParams>({
      query: (params) => ({
        url: "/admin/consultations",
        method: "GET",
        params,

      }),
      providesTags: [{ type: "ConsultationList", id: "LIST" }],
    }),

    /**
     * Get single consultation by ID
     */
    adminGetConsultationById: builder.query<Consultation, string>({
      query: (consultationId) => ({
        url: `/admin/consultations/${consultationId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Consultation", id }],
    }),

    /**
     * Get consultation statistics
     */
    adminGetConsultationStats: builder.query<ConsultationStats, void>({
      query: () => ({
        url: "/admin/consultations/stats",
        method: "GET",
      }),
      providesTags: ["ConsultationStats"],
    }),

    /**
     * Update consultation status
     */
    adminUpdateConsultationStatus: builder.mutation<
      Consultation,
      UpdateConsultationStatusPayload
    >({
      query: ({ consultationId, status, note }) => ({
        url: `/admin/consultations/${consultationId}/status`,
        method: "PATCH",
        data: { status, note },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        "ConsultationStats",
        { type: "Consultation", id: consultationId },
        { type: "ConsultationList", id: "LIST" },
      ],
    }),

    /**
     * Resolve a dispute in favor of citizen or lawyer
     */
    adminResolveDispute: builder.mutation<Consultation, ResolveDisputePayload>({
      query: ({ consultationId, decision, refundAmount, reason }) => ({
        url: `/admin/consultations/${consultationId}/dispute/resolve`,
        method: "POST",
        data: { decision, refundAmount, reason },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        "ConsultationStats",
        { type: "Consultation", id: consultationId },
        { type: "ConsultationList", id: "LIST" },
      ],
    }),

    /**
     * Flag a consultation for quality review
     */
    adminFlagConsultation: builder.mutation<Consultation, FlagConsultationPayload>({
      query: ({ consultationId, reason, severity }) => ({
        url: `/admin/consultations/${consultationId}/flag`,
        method: "POST",
        data: { reason, severity },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: "Consultation", id: consultationId },
        { type: "ConsultationList", id: "LIST" },
      ],
    }),

    /**
     * Approve or reject refund request
     */
    adminApproveRefund: builder.mutation<Consultation, ApproveRefundPayload>({
      query: ({ consultationId, approved, adminNote }) => ({
        url: `/admin/consultations/${consultationId}/refund`,
        method: "POST",
        data: { approved, adminNote },
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        "ConsultationStats",
        { type: "Consultation", id: consultationId },
        { type: "ConsultationList", id: "LIST" },
      ],
    }),

    /**
     * Send warning to lawyer
     */
    adminSendLawyerWarning: builder.mutation<
      { message: string },
      { consultationId: string; lawyerId: string; reason: string }
    >({
      query: ({ consultationId, lawyerId, reason }) => ({
        url: `/admin/consultations/${consultationId}/lawyer/${lawyerId}/warn`,
        method: "POST",
        data: { reason },
      }),
    }),

    /**
     * Bulk action on multiple consultations
     */
    adminBulkAction: builder.mutation<AdminActionResult, BulkActionPayload>({
      query: ({ consultationIds, action, reason }) => ({
        url: "/admin/consultations/bulk",
        method: "POST",
        data: { consultationIds, action, reason },
      }),
      invalidatesTags: ["ConsultationList", "ConsultationStats"],
    }),

    /**
     * Export consultations to CSV/Excel
     */
    adminExportConsultations: builder.query<Blob, ExportConsultationsParams>({
      query: (params) => ({
        url: "/admin/consultations/export",
        method: "GET",
        params,
        responseHandler: (response: any) => response.blob(),
      }),
    }),

    // ─── Match Request Endpoints ───────────────────────────────────────────────

    /**
     * Get paginated list of match requests
     */
    adminListMatchRequests: builder.query<PaginatedResponse<MatchRequest[]>, ListMatchRequestsParams>({
      query: (params) => ({
        url: "/admin/consultations/request/match-requests",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "MatchRequestList", id: "LIST" }],
    }),

    /**
     * Get single match request by ID
     */
    adminGetMatchRequestById: builder.query<MatchRequest, string>({
      query: (matchRequestId) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MatchRequest", id }],
    }),

    /**
     * Assign a lawyer to a match request manually
     */
    adminAssignLawyerToMatch: builder.mutation<MatchRequest, AssignLawyerToMatchPayload>({
      query: ({ matchRequestId, lawyerId }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/assign`,
        method: "POST",
        data: { lawyerId },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Auto-match a lawyer to a match request
     */
    adminAutoMatch: builder.mutation<MatchRequest, AutoMatchPayload>({
      query: ({ matchRequestId }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/auto-match`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Bulk auto-match all unassigned requests
     */
    adminBulkAutoMatch: builder.mutation<
      { success: boolean; matchedCount: number; failedIds: string[] },
      void
    >({
      query: () => ({
        url: "/admin/consultations/match-requests/bulk-auto-match",
        method: "POST",
      }),
      invalidatesTags: ["MatchRequestList"],
    }),

    /**
     * Expire a match request
     */
    adminExpireMatchRequest: builder.mutation<MatchRequest, string>({
      query: (matchRequestId) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/expire`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "MatchRequest", id },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Accept a match request and begin the firm's review (pending/unassigned -> in_review)
     */
    adminAcceptMatchRequest: builder.mutation<MatchRequest, { matchRequestId: string }>({
      query: ({ matchRequestId }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Send the firm's own consultation message to the citizen (message-mode requests)
     */
    adminSendMatchMessage: builder.mutation<MatchRequest, { matchRequestId: string; message: string }>({
      query: ({ matchRequestId, message }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/message`,
        method: "POST",
        data: { message },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Organize a call/video session with the citizen (call/video-mode requests)
     */
    adminScheduleMatchCall: builder.mutation<
      MatchRequest,
      { matchRequestId: string; dateTime: string; link?: string; note?: string }
    >({
      query: ({ matchRequestId, ...data }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/schedule-call`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Attach a document to a match request — either a supporting file or the firm's refined case brief
     */
    adminAddMatchDocument: builder.mutation<
      MatchRequest,
      { matchRequestId: string; document: ConsultationDocumentMeta; isCaseBrief?: boolean }
    >({
      query: ({ matchRequestId, document, isCaseBrief }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/documents`,
        method: "POST",
        data: { ...document, isCaseBrief },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    adminUpdateMatch: builder.mutation<ApiResponse<MatchRequest>, { matchRequestId: string; status: string; note?: string }>({
      query: ({ matchRequestId, status, note }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/status`,
        method: "PATCH",
        data: { status, note },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    /**
     * Send the citizen a shortlist of recommended, vetted lawyers to choose from
     */
    adminRecommendLawyers: builder.mutation<
      MatchRequest,
      { matchRequestId: string; lawyers: string[] }
    >({
      query: ({ matchRequestId, lawyers }) => ({
        url: `/admin/consultations/match-requests/${matchRequestId}/recommend`,
        method: "POST",
        data: { lawyers },
      }),
      invalidatesTags: (result, error, { matchRequestId }) => [
        { type: "MatchRequest", id: matchRequestId },
        { type: "MatchRequestList", id: "LIST" },
      ],
    }),

    // ─── Lawyer Performance Endpoints ──────────────────────────────────────────

    /**
     * Get lawyer performance metrics
     */
    adminGetLawyerPerformance: builder.query<ApiResponse<LawyerPerformanceStats[]>, LawyerPerformanceParams>({
      query: (params) => ({
        url: "/admin/consultations/lawyers/performance",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerPerformance"],
    }),

    /**
     * Get top performing lawyers
     */
    adminGetTopLawyers: builder.query<
      LawyerPerformanceStats[],
      { limit?: number; sortBy?: "revenue" | "rating" | "sessions" }
    >({
      query: ({ limit = 10, sortBy = "sessions" }) => ({
        url: "/admin/consultations/lawyers/top-performers",
        method: "GET",
        params: { limit, sortBy },
      }),
      providesTags: ["LawyerPerformance"],
    }),

    // ─── Dashboard Endpoints ───────────────────────────────────────────────────

    /**
     * Get complete dashboard statistics
     */
    adminGetDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "/admin/consultations/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats", "ConsultationStats", "MatchRequestList"],
    }),

    /**
     * Get recent activity feed
     */
    adminGetRecentActivity: builder.query<
      DashboardStats["recentActivity"],
      { limit?: number }
    >({
      query: ({ limit = 20 }) => ({
        url: "/admin/consultations/activity/recent",
        method: "GET",
        params: { limit },
      }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

// Export hooks
export const {
  // Consultation hooks
  useAdminListConsultationsQuery,
  useAdminGetConsultationByIdQuery,
  useAdminGetConsultationStatsQuery,
  useAdminUpdateConsultationStatusMutation,
  useAdminResolveDisputeMutation,
  useAdminFlagConsultationMutation,
  useAdminApproveRefundMutation,
  useAdminSendLawyerWarningMutation,
  useAdminBulkActionMutation,
  useAdminExportConsultationsQuery,

  // Match request hooks
  useAdminListMatchRequestsQuery,
  useAdminGetMatchRequestByIdQuery,
  useAdminAssignLawyerToMatchMutation,
  useAdminAutoMatchMutation,
  useAdminBulkAutoMatchMutation,
  useAdminExpireMatchRequestMutation,
  useAdminAcceptMatchRequestMutation,
  useAdminSendMatchMessageMutation,
  useAdminScheduleMatchCallMutation,
  useAdminAddMatchDocumentMutation,
  useAdminUpdateMatchMutation,
  useAdminRecommendLawyersMutation,

  // Lawyer performance hooks
  useAdminGetLawyerPerformanceQuery,
  useAdminGetTopLawyersQuery,

  // Dashboard hooks
  useAdminGetDashboardStatsQuery,
  useAdminGetRecentActivityQuery,
} = adminConsultationApi;