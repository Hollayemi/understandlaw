import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import { ApiResponse } from "../../types";
import {
  Review,
  ReviewStats,
  ListReviewsParams,
  ListLawyerReviewSummariesParams,
  PaginatedReviews,
  PaginatedLawyerSummaries,
} from "@/redux/types/reviews"

import {
  DashboardOverviewStats,
  DashboardAnalytics,
} from "@/redux/types/dashboard"

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: axiosBaseQuery({ defaultActor: "admin" }),
  tagTypes: [
    "DashboardOverview",
    "DashboardAnalytics",
    "Reviews",
    "ReviewStats",
    "LawyerReviewSummaries",
    "ReviewDetail",
  ],

  endpoints: (builder) => ({

    // ── Dashboard ──────────────────────────────────────────────────

    /**
     * GET /admin/dashboard/overview
     * High-level counts for all stat cards.
     */
    getDashboardOverview: builder.query<ApiResponse<DashboardOverviewStats>, void>({
      query: () => ({ url: "/admin/dashboard/overview", method: "GET" }),
      providesTags: ["DashboardOverview"],
    }),

    /**
     * GET /admin/dashboard/analytics?period=30d
     * Time-series charts, top lawyers, activity feed, pending actions.
     */
    getDashboardAnalytics: builder.query<
      ApiResponse<DashboardAnalytics>,
      { period?: "7d" | "30d" | "90d" | "1y" }
    >({
      query: ({ period = "30d" }) => ({
        url: "/admin/dashboard/analytics",
        method: "GET",
        params: { period },
      }),
      providesTags: ["DashboardAnalytics"],
    }),

    // ── Reviews ────────────────────────────────────────────────────

    /**
     * GET /admin/reviews/stats
     * Aggregate review statistics.
     */
    getReviewStats: builder.query<ApiResponse<ReviewStats>, void>({
      query: () => ({ url: "/admin/reviews/stats", method: "GET" }),
      providesTags: ["ReviewStats"],
    }),

    /**
     * GET /admin/reviews
     * Paginated list of all reviews with optional filters.
     */
    listReviews: builder.query<ApiResponse<PaginatedReviews>, ListReviewsParams>({
      query: (params) => ({
        url: "/admin/reviews",
        method: "GET",
        params: {
          ...(params.lawyerId && { lawyerId: params.lawyerId }),
          ...(params.rating && { rating: params.rating }),
          ...(params.isFlagged !== undefined && { isFlagged: params.isFlagged }),
          ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
          ...(params.mode && { mode: params.mode }),
          ...(params.search && { search: params.search }),
          sortBy: params.sortBy ?? "newest",
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
        },
      }),
      providesTags: [{ type: "Reviews" }],
    }),

    /**
     * GET /admin/reviews/lawyers
     * Per-lawyer review aggregations for the lawyer rankings table.
     */
    listLawyerReviewSummaries: builder.query<
      ApiResponse<PaginatedLawyerSummaries>,
      ListLawyerReviewSummariesParams
    >({
      query: (params) => ({
        url: "/admin/reviews/lawyers",
        method: "GET",
        params: {
          ...(params.search && { search: params.search }),
          ...(params.minRating !== undefined && { minRating: params.minRating }),
          ...(params.maxRating !== undefined && { maxRating: params.maxRating }),
          sortBy: params.sortBy ?? "reviews_desc",
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
        },
      }),
      providesTags: ["LawyerReviewSummaries"],
    }),

    /**
     * GET /admin/reviews/:reviewId
     * Full detail of one review.
     */
    getReviewById: builder.query<ApiResponse<Review>, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ReviewDetail", id }],
    }),

    /**
     * PATCH /admin/reviews/:reviewId/visibility
     * Show or hide a review from the public marketplace.
     */
    setReviewVisibility: builder.mutation<
      ApiResponse<{ isVisible: boolean }>,
      { reviewId: string; isVisible: boolean; reason?: string }
    >({
      query: ({ reviewId, isVisible, reason }) => ({
        url: `/admin/reviews/${reviewId}/visibility`,
        method: "PATCH",
        data: { isVisible, reason },
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        "Reviews",
        "ReviewStats",
        "LawyerReviewSummaries",
        { type: "ReviewDetail", id: reviewId },
      ],
    }),

    /**
     * PATCH /admin/reviews/:reviewId/flag
     * Flag a review for investigation or clear an existing flag.
     */
    flagReview: builder.mutation<
      ApiResponse<{ isFlagged: boolean }>,
      { reviewId: string; isFlagged: boolean; reason?: string }
    >({
      query: ({ reviewId, isFlagged, reason }) => ({
        url: `/admin/reviews/${reviewId}/flag`,
        method: "PATCH",
        data: { isFlagged, reason },
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        "Reviews",
        "ReviewStats",
        { type: "ReviewDetail", id: reviewId },
      ],
    }),

    /**
     * DELETE /admin/reviews/:reviewId
     * Permanently delete a review. Irreversible.
     */
    deleteReview: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews", "ReviewStats", "LawyerReviewSummaries"],
    }),
  }),
});

// ─── Export hooks ─────────────────────────────────────────────────────────────

export const {
  // Dashboard
  useGetDashboardOverviewQuery,
  useGetDashboardAnalyticsQuery,

  // Reviews
  useGetReviewStatsQuery,
  useListReviewsQuery,
  useListLawyerReviewSummariesQuery,
  useGetReviewByIdQuery,
  useSetReviewVisibilityMutation,
  useFlagReviewMutation,
  useDeleteReviewMutation,
} = adminDashboardApi;