import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse, Pagination } from "../types";
import { ModuleCategory, TopicWithSubTopics } from "./types";

export type LearnModuleStatus = "active" | "inactive";
export type LearnTopicStatus = "published" | "draft";
export type LearnTabKey = "all" | "active" | "complete" | "saved";

export interface LearnInstructor {
  _id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

export interface LearnModule {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: ModuleCategory;
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  materialSummary: any
  status: LearnModuleStatus;
  thumbnailUrl: string | null;
  gradient: string;
  tag: string;
  tagColor: string;
  price: "Free" | string;
  instructor: LearnInstructor;
  rating: number;
  reviewCount: number;
  weeksDuration: number;
  lessonCount: number;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
  enrolledAt?: string | null;
  progressPercent?: number;
  userTab?: LearnTabKey;
  isSaved?: boolean;
}

export interface LearnModuleDetail extends LearnModule {
  fullDescription: string;
  topics: LearnTopicSummary[];
  totalWatchTimeMinutes: number;
  enrolledCount: number;
  completionRate: number;
}

export interface LearnTopicSummary {
  _id: string;
  slug: string;
  title: string;
  order: number;
  duration: string;
  status: LearnTopicStatus;
  completed: boolean;
  active: boolean;
}

export interface LearnSubTopicSummary {
  _id: string;
  title: string;
  order: number;
  duration: string;
  completedBy: number;
}

export interface LearnTopicDetail {
  _id: string;
  slug: string;
  moduleId: string;
  moduleTitle: string;
  moduleSlug: string;
  title: string;
  tag: string;
  tagColor: string;
  classification: string;
  overview: string;
  status: LearnTopicStatus;
  order: number;
  videoType: "youtube" | "upload" | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: string;
  durationSeconds: number;
  currentTime: string;
  progressPercent: number;
  watchCount: number;
  completionRate: number;
  likes: number;
  comments: number;
  rating: number;
  instructor: LearnInstructor;
  weeksDuration: number;
  lessonCount: number;
  subtopics: LearnSubTopicSummary[];
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

export interface ContinueReadingItem {
  slug: string;
  moduleSlug: string;
  title: string;
  tag: string;
  tagColor: string;
  gradient: string;
  progressPercent: number;
  lastReadAt: string;
  lastReadLabel: string;
  currentSectionTitle: string;
  xpRewardOnCompletion: number;
}

export interface FeaturedTopic {
  _id: string;
  slug: string;
  title: string;
  instructor: Pick<LearnInstructor, "name" | "email" | "initials" | "color">;
}

export interface SaveModuleResponse {
  moduleId: string;
  saved: boolean;
}

export interface MarkTopicCompleteResponse {
  topicId: string;
  completed: boolean;
  xpTotal: number;
  xpAwarded: number;
  streakDays: number;
  moduleProgressPercent: number;
  certificateUnlocked: boolean;
}

// ============================================
// SUBTOPIC INTERACTION TYPES
// ============================================

export interface SubtopicLikeResponse {
  subtopicId: string;
  liked: boolean;
  likesCount: number;
}

export interface SubtopicCompleteResponse {
  subtopicId: string;
  completed: boolean;
  completedBy: number;
}

// Add these types to your learn.slice.ts

export interface SubtopicState {
  id: string;
  title: string;
  order: number;
  likesCount: number;
  completedBy: number;
  liked: boolean;
  completed: boolean;
}

export interface SubtopicWithStatus {
  id: string;
  title: string;
  order: number;
  duration: string;
  completed: boolean;
  liked: boolean;
}

export interface TopicProgress {
  id: string;
  title: string;
  totalSubtopics: number;
  completedSubtopics: number;
  progressPercent: number;
  completedSubtopicIds: string[];
  subtopics: SubtopicWithStatus[];
}

export interface SubtopicStateResponse {
  currentSubtopic: SubtopicState;
  topic: TopicProgress;
}

// ============================================
// BOOKMARK TYPES
// ============================================

export interface Bookmark {
  id: string;
  subtopicId: string;
  url: string;
  topicId: string;
  moduleId: string;
  subtopicTitle: string;
  topicTitle: string;
  moduleTitle: string;
  highlightedText: string;
  comment: string;
  startOffset?: number;
  endOffset?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkRequest {
  highlightedText: string;
  comment?: string;
  url: string;
  startOffset?: number;
  endOffset?: number;
}

export interface UpdateBookmarkRequest {
  highlightedText?: string;
  comment?: string;
  startOffset?: number;
  endOffset?: number;
}

export interface ListBookmarksParams {
  moduleId?: string;
  topicId?: string;
  page?: number;
  pageSize?: number;
}

export interface ListLearnModulesParams {
  tab?: LearnTabKey;
  search?: string;
  category?: ModuleCategory | "all";
  page?: number;
  status?: string;
  pageSize?: number;
}

export const learnApi = createApi({
  reducerPath: "learnApi",
  baseQuery: axiosBaseQuery({ defaultActor: "user" }),
  tagTypes: [
    "LearnModuleList",
    "LearnModuleDetail",
    "LearnTopicDetail",
    "ContinueReading",
    "FeaturedTopics",
    "SavedModules",
    "Bookmarks",
    "SubtopicState",
  ],

  endpoints: (builder) => ({
    // ============================================
    // EXISTING ENDPOINTS
    // ============================================

    listLearnModules: builder.query<
      ApiResponse<Pagination<LearnModule[]>>,
      ListLearnModulesParams
    >({
      query: (params) => ({
        url: "/learn/modules",
        method: "GET",
        params: {
          ...(params.tab && params.tab !== "all" && { tab: params.tab }),
          ...(params.search && { search: params.search }),
          ...(params.category && params.category !== "all" && { category: params.category }),
          page: params.page ?? 1,
          status: 'active',
          pageSize: params.pageSize ?? 20,
        },
      }),
      providesTags: [{ type: "LearnModuleList" }],
    }),

    getLearnModuleBySlug: builder.query<ApiResponse<LearnModuleDetail>, string>({
      query: (slug) => ({
        url: `/learn/modules/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "LearnModuleDetail", id: slug },
      ],
    }),

    getLearnTopicBySlug: builder.query<
      ApiResponse<LearnTopicDetail>,
      { moduleSlug: string; topicSlug: string }
    >({
      query: ({ moduleSlug, topicSlug }) => ({
        url: `/learn/modules/${moduleSlug}/topics/${topicSlug}`,
        method: "GET",
      }),
      providesTags: (result, error, { topicSlug }) => [
        { type: "LearnTopicDetail", id: topicSlug },
      ],
    }),

    listTopics: builder.query<ApiResponse<TopicWithSubTopics[]>, { moduleId?: string }>({
      query: (params) => ({
        url: `/learn/modules/${params?.moduleId}/topics`,
        method: "GET",
      }),
    }),

    getContinueReading: builder.query<ApiResponse<ContinueReadingItem[]>, void>({
      query: () => ({
        url: "/learn/continue-reading",
        method: "GET",
      }),
      providesTags: ["ContinueReading"],
    }),

    getFeaturedTopics: builder.query<ApiResponse<FeaturedTopic[]>, void>({
      query: () => ({
        url: "/learn/featured-topics",
        method: "GET",
      }),
      providesTags: ["FeaturedTopics"],
    }),

    toggleSaveModule: builder.mutation<
      ApiResponse<SaveModuleResponse>,
      string
    >({
      query: (moduleId) => ({
        url: `/learn/modules/${moduleId}/save`,
        method: "POST",
      }),
      invalidatesTags: (result, error, moduleId) => [
        { type: "LearnModuleDetail", id: moduleId },
        { type: "LearnModuleList" },
        "SavedModules",
      ],
    }),

    enrolInModule: builder.mutation<
      ApiResponse<Pick<LearnModule, "_id" | "enrolledAt" | "progressPercent" | "userTab">>,
      string
    >({
      query: (moduleId) => ({
        url: `/learn/modules/${moduleId}/enrol`,
        method: "POST",
      }),
      invalidatesTags: (result, error, moduleId) => [
        { type: "LearnModuleDetail", id: moduleId },
        { type: "LearnModuleList" },
        "ContinueReading",
      ],
    }),

    markTopicComplete: builder.mutation<
      ApiResponse<MarkTopicCompleteResponse>,
      { moduleId: string; topicId: string }
    >({
      query: ({ moduleId, topicId }) => ({
        url: `/learn/modules/${moduleId}/topics/${topicId}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { moduleId, topicId }) => [
        { type: "LearnTopicDetail", id: topicId },
        { type: "LearnModuleDetail", id: moduleId },
        "ContinueReading",
      ],
    }),

    saveVideoProgress: builder.mutation<
      ApiResponse<{ topicId: string; currentTimeSeconds: number }>,
      { moduleId: string; topicId: string; currentTimeSeconds: number }
    >({
      query: ({ moduleId, topicId, currentTimeSeconds }) => ({
        url: `/learn/modules/${moduleId}/topics/${topicId}/progress`,
        method: "PATCH",
        data: { currentTimeSeconds },
      }),
    }),

    // ============================================
    // SUBTOPIC INTERACTION ENDPOINTS
    // ============================================

    /**
     * POST /learn/subtopics/:subtopicId/like
     * Toggle like on a subtopic
     */
    toggleLikeSubtopic: builder.mutation<
      ApiResponse<SubtopicLikeResponse>,
      string
    >({
      query: (subtopicId) => ({
        url: `/learn/subtopics/${subtopicId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, subtopicId) => [
        { type: "SubtopicState", id: subtopicId },
      ],
    }),

    /**
     * POST /learn/subtopics/:subtopicId/complete
     * Toggle complete status on a subtopic
     */
    toggleCompleteSubtopic: builder.mutation<
      ApiResponse<SubtopicCompleteResponse>,
      string
    >({
      query: (subtopicId) => ({
        url: `/learn/subtopics/${subtopicId}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, subtopicId) => [
        { type: "SubtopicState", id: subtopicId },
      ],
    }),

    /**
     * GET /learn/subtopics/:subtopicId/state
     * Get the current user's state for a subtopic
     */
    getSubtopicState: builder.query<
      ApiResponse<SubtopicStateResponse>,
      string
    >({
      query: (subtopicId) => ({
        url: `/learn/subtopics/${subtopicId}/state`,
        method: "GET",
      }),
      providesTags: (result, error, subtopicId) => [
        { type: "SubtopicState", id: subtopicId },
      ],
    }),

    // ============================================
    // BOOKMARK ENDPOINTS
    // ============================================

    /**
     * POST /learn/subtopics/:subtopicId/bookmarks
     * Create a new bookmark for a subtopic
     */
    createBookmark: builder.mutation<
      ApiResponse<Bookmark>,
      { subtopicId: string; data: CreateBookmarkRequest }
    >({
      query: ({ subtopicId, data }) => ({
        url: `/learn/subtopics/${subtopicId}/bookmarks`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { subtopicId }) => [
        { type: "Bookmarks", id: subtopicId },
      ],
    }),

    /**
     * GET /learn/subtopics/:subtopicId/bookmarks
     * Get all bookmarks for a subtopic
     */
    listBookmarksForSubtopic: builder.query<
      ApiResponse<Bookmark[]>,
      string
    >({
      query: (subtopicId) => ({
        url: `/learn/subtopics/${subtopicId}/bookmarks`,
        method: "GET",
      }),
      providesTags: (result, error, subtopicId) => [
        { type: "Bookmarks", id: subtopicId },
      ],
    }),

    /**
     * GET /learn/bookmarks
     * Get all bookmarks for the authenticated user with pagination
     */
    listMyBookmarks: builder.query<
      ApiResponse<Pagination<Bookmark[]>>,
      ListBookmarksParams
    >({
      query: (params) => ({
        url: "/learn/bookmarks",
        method: "GET",
        params: {
          ...(params.moduleId && { moduleId: params.moduleId }),
          ...(params.topicId && { topicId: params.topicId }),
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
        },
      }),
      providesTags: ["Bookmarks"],
    }),

    /**
     * GET /learn/bookmarks/:bookmarkId
     * Get a single bookmark by ID
     */
    getBookmarkById: builder.query<
      ApiResponse<Bookmark>,
      string
    >({
      query: (bookmarkId) => ({
        url: `/learn/bookmarks/${bookmarkId}`,
        method: "GET",
      }),
      providesTags: (result, error, bookmarkId) => [
        { type: "Bookmarks", id: bookmarkId },
      ],
    }),

    /**
     * PUT /learn/bookmarks/:bookmarkId
     * Update a bookmark
     */
    updateBookmark: builder.mutation<
      ApiResponse<Bookmark>,
      { bookmarkId: string; data: UpdateBookmarkRequest }
    >({
      query: ({ bookmarkId, data }) => ({
        url: `/learn/bookmarks/${bookmarkId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { bookmarkId }) => [
        { type: "Bookmarks", id: bookmarkId },
      ],
    }),

    /**
     * DELETE /learn/bookmarks/:bookmarkId
     * Delete a bookmark
     */
    deleteBookmark: builder.mutation<
      ApiResponse<void>,
      string
    >({
      query: (bookmarkId) => ({
        url: `/learn/bookmarks/${bookmarkId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, bookmarkId) => [
        { type: "Bookmarks", id: bookmarkId },
      ],
    }),
  }),
});

export const {
  // Existing hooks
  useListLearnModulesQuery,
  useGetLearnModuleBySlugQuery,
  useGetLearnTopicBySlugQuery,
  useListTopicsQuery,
  useGetContinueReadingQuery,
  useGetFeaturedTopicsQuery,
  useToggleSaveModuleMutation,
  useEnrolInModuleMutation,
  useMarkTopicCompleteMutation,
  useSaveVideoProgressMutation,

  // Subtopic interaction hooks
  useToggleLikeSubtopicMutation,
  useToggleCompleteSubtopicMutation,
  useGetSubtopicStateQuery,

  // Bookmark hooks
  useCreateBookmarkMutation,
  useListBookmarksForSubtopicQuery,
  useListMyBookmarksQuery,
  useGetBookmarkByIdQuery,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
} = learnApi;