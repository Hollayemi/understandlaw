// redux/slices/admin/community.admin.slice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import { ApiResponse, Pagination } from "../../types";

export type PostType = "discussion" | "argument" | "poll" | "announcement" | "case_study";
export type PostStatus = "active" | "pending" | "promoted" | "rejected" | "removed";
export type UserRole = "citizen" | "lawyer" | "admin" | "moderator";

export interface CommunityUser {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  badge?: string;
  lawFirm?: string;
  yearsOfExperience?: number;
  initials?: string;
  color?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedBy: string[];
}

export interface PostReport {
  _id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description?: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  resolutionAction?: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: CommunityUser;
  images: string[];
  likes: number;
  likedBy: string[];
  parentId: string | null;
  replies: Comment[];
  isLawyerAnswer: boolean;
  isAcceptedAnswer: boolean;
  isRemoved: boolean;
  removalReason?: string;
  removedAt?: string;
  removedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPost {
  _id: string;
  title: string;
  content: string;
  author: CommunityUser;
  room: string;
  type: PostType;
  status: PostStatus;
  tags: string[];
  images: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  commentCount: number;
  viewCount: number;
  shares: number;
  bookmarks: number;
  bookmarkedBy: string[];
  isPinned: boolean;
  pinnedAt?: string;
  pinnedBy?: string;
  isLocked: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  removedBy?: string;
  resolvedAt?: string;
  isPromoted: boolean;
  promotedAt?: string;
  promotedUntil?: string;
  promotedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  reportCount: number;
  reports: PostReport[];
  adminNote?: string;
  pollOptions?: PollOption[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface CommunityStats {
  overview: {
    totalPosts: number;
    totalComments: number;
    totalUsers: number;
    pendingPosts: number;
    reportedPosts: number;
    promotedPosts: number;
    pinnedPosts: number;
  };
  postsByRoom: Record<string, number>;
  activityLast30Days: Array<{ _id: string; count: number }>;
}

export interface ListPostsParams {
  status?: PostStatus | "all";
  type?: PostType | "all";
  room?: string | "all";
  search?: string;
  sortBy?: "latest" | "oldest" | "most_liked" | "most_commented" | "most_reported";
  page?: number;
  limit?: number;
}

export interface ListCommentsParams {
  postId?: string;
  status?: "all" | "active" | "removed";
  search?: string;
  page?: number;
  limit?: number;
}

export interface BulkModeratePayload {
  postIds: string[];
  action: "delete" | "pin" | "unpin" | "promote" | "demote";
  data?: {
    pinned?: boolean;
  };
}

export const adminCommunityApi = createApi({
  reducerPath: "adminCommunityApi",
  baseQuery: axiosBaseQuery({ defaultActor: "admin" }),
  tagTypes: ["AdminPosts", "AdminPost", "AdminComments", "AdminReports", "AdminStats"],

  endpoints: (builder) => ({
    // ──────────────────────────────────────────────────────────────────
    // Posts Management
    // ──────────────────────────────────────────────────────────────────

    listAdminPosts: builder.query<ApiResponse<Pagination<AdminPost[]>>, ListPostsParams>({
      query: (params) => ({
        url: "/admin/community/posts",
        method: "GET",
        params: {
          status: params.status === "all" ? undefined : params.status,
          type: params.type === "all" ? undefined : params.type,
          room: params.room === "all" ? undefined : params.room,
          search: params.search,
          sortBy: params.sortBy,
          page: params.page || 1,
          limit: params.limit || 20,
        },
      }),
      providesTags: [{ type: "AdminPosts" }],
    }),

    getAdminPostDetails: builder.query<ApiResponse<AdminPost>, string>({
      query: (postId) => ({
        url: `/admin/community/posts/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminPost", id }],
    }),

    approvePost: builder.mutation<ApiResponse<AdminPost>, string>({
      query: (postId) => ({
        url: `/admin/community/posts/${postId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "AdminPosts",
        { type: "AdminPost", id },
        "AdminStats",
      ],
    }),

    rejectPost: builder.mutation<ApiResponse<AdminPost>, { postId: string; reason: string }>({
      query: ({ postId, reason }) => ({
        url: `/admin/community/posts/${postId}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { postId }) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
        "AdminStats",
      ],
    }),

    pinPost: builder.mutation<ApiResponse<{ isPinned: boolean }>, { postId: string; pinned: boolean }>({
      query: ({ postId, pinned }) => ({
        url: `/admin/community/posts/${postId}/pin`,
        method: "POST",
        data: { pinned },
      }),
      invalidatesTags: (result, error, { postId }) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
      ],
    }),

    promotePost: builder.mutation<ApiResponse<AdminPost>, { postId: string; duration?: number }>({
      query: ({ postId, duration = 7 }) => ({
        url: `/admin/community/posts/${postId}/promote`,
        method: "POST",
        data: { duration },
      }),
      invalidatesTags: (result, error, { postId }) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
        "AdminStats",
      ],
    }),

    demotePost: builder.mutation<ApiResponse<AdminPost>, string>({
      query: (postId) => ({
        url: `/admin/community/posts/${postId}/demote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
        "AdminStats",
      ],
    }),

    removePost: builder.mutation<ApiResponse<AdminPost>, { postId: string; reason: string }>({
      query: ({ postId, reason }) => ({
        url: `/admin/community/posts/${postId}/remove`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { postId }) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
        "AdminStats",
      ],
    }),

    restorePost: builder.mutation<ApiResponse<AdminPost>, string>({
      query: (postId) => ({
        url: `/admin/community/posts/${postId}/restore`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        "AdminPosts",
        { type: "AdminPost", id: postId },
        "AdminStats",
      ],
    }),

    // ──────────────────────────────────────────────────────────────────
    // Comments Management
    // ──────────────────────────────────────────────────────────────────

    listAdminComments: builder.query<ApiResponse<Pagination<Comment[]>>, ListCommentsParams>({
      query: (params) => ({
        url: "/admin/community/comments",
        method: "GET",
        params: {
          postId: params.postId,
          status: params.status === "all" ? undefined : params.status,
          search: params.search,
          page: params.page || 1,
          limit: params.limit || 20,
        },
      }),
      providesTags: ["AdminComments"],
    }),

    removeComment: builder.mutation<ApiResponse<Comment>, { commentId: string; reason: string }>({
      query: ({ commentId, reason }) => ({
        url: `/admin/community/comments/${commentId}`,
        method: "DELETE",
        data: { reason },
      }),
      invalidatesTags: ["AdminPosts", "AdminComments", "AdminStats"],
    }),

    restoreComment: builder.mutation<ApiResponse<Comment>, string>({
      query: (commentId) => ({
        url: `/admin/community/comments/${commentId}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["AdminPosts", "AdminComments", "AdminStats"],
    }),

    // ──────────────────────────────────────────────────────────────────
    // Reports Management
    // ──────────────────────────────────────────────────────────────────

    listReports: builder.query<
      ApiResponse<{ reports: Array<{ postId: string; title: string; report: PostReport; reportCount: number }>; pagination: any }>,
      { status?: "pending" | "resolved"; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/admin/community/reports",
        method: "GET",
        params: {
          status: params.status || "pending",
          page: params.page || 1,
          limit: params.limit || 20,
        },
      }),
      providesTags: ["AdminReports"],
    }),

    resolveReport: builder.mutation<
      ApiResponse<PostReport>,
      { reportId: string; action: string; note?: string }
    >({
      query: ({ reportId, action, note }) => ({
        url: `/admin/community/reports/${reportId}/resolve`,
        method: "POST",
        data: { action, note },
      }),
      invalidatesTags: ["AdminPosts", "AdminReports", "AdminStats"],
    }),

    // ──────────────────────────────────────────────────────────────────
    // Analytics & Stats
    // ──────────────────────────────────────────────────────────────────

    getCommunityStats: builder.query<ApiResponse<CommunityStats>, void>({
      query: () => ({
        url: "/admin/community/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    getActivityReport: builder.query<
      ApiResponse<{
        postsOverTime: Array<{ _id: string; posts: number }>;
        commentsOverTime: Array<{ _id: string; comments: number }>;
        topContributors: Array<{ _id: string; name: string; postCount: number; totalLikes: number }>;
        topPosts: Array<{ _id: string; title: string; likes: number; commentCount: number; engagement: number }>;
      }>,
      { period?: "week" | "month" | "year" }
    >({
      query: ({ period = "week" }) => ({
        url: "/admin/community/activity",
        method: "GET",
        params: { period },
      }),
      providesTags: ["AdminStats"],
    }),

    // ──────────────────────────────────────────────────────────────────
    // Bulk Actions
    // ──────────────────────────────────────────────────────────────────

    bulkModeratePosts: builder.mutation<ApiResponse<{ modifiedCount: number; action: string }>, BulkModeratePayload>({
      query: (payload) => ({
        url: "/admin/community/bulk/moderate",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["AdminPosts", "AdminStats"],
    }),
  }),
});

// Export hooks
export const {
  // Posts
  useListAdminPostsQuery,
  useGetAdminPostDetailsQuery,
  useApprovePostMutation,
  useRejectPostMutation,
  usePinPostMutation,
  usePromotePostMutation,
  useDemotePostMutation,
  useRemovePostMutation,
  useRestorePostMutation,

  // Comments
  useListAdminCommentsQuery,
  useRemoveCommentMutation,
  useRestoreCommentMutation,

  // Reports
  useListReportsQuery,
  useResolveReportMutation,

  // Analytics
  useGetCommunityStatsQuery,
  useGetActivityReportQuery,

  // Bulk
  useBulkModeratePostsMutation,
} = adminCommunityApi;