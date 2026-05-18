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
  status: LearnModuleStatus;
  thumbnailUrl: string | null;
  /** gradient string for thumbnail fallback */
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
  /** Citizen-specific fields — only present when authenticated */
  enrolledAt?: string | null;
  /** 0–100 */
  progressPercent?: number;
  /** "active" | "complete" | "saved" */
  userTab?: LearnTabKey;
  isSaved?: boolean;
}

// ─── Module detail (single) ───────────────────────────────────────────────────

export interface LearnModuleDetail extends LearnModule {
  fullDescription: string;
  topics: LearnTopicSummary[];
  totalWatchTimeMinutes: number;
  enrolledCount: number;
  completionRate: number;
}

// ─── Topic summary (inside module detail) ────────────────────────────────────

export interface LearnTopicSummary {
  _id: string;
  slug: string;
  title: string;
  order: number;
  duration: string;
  status: LearnTopicStatus;
  /** Whether the authenticated citizen has completed this topic */
  completed: boolean;
  /** true if this is the citizen's current in-progress topic */
  active: boolean;
}

// ─── Topic detail ─────────────────────────────────────────────────────────────

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
  /** seconds for the player */
  durationSeconds: number;
  /** e.g. "00:46" */
  currentTime: string;
  /** 0–100 float for progress bar */
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
  /** Whether the authenticated citizen has completed this topic */
  completed: boolean;
}

// ─── "Continue reading" item (dashboard overview) ────────────────────────────

export interface ContinueReadingItem {
  slug: string;
  moduleSlug: string;
  title: string;
  tag: string;
  tagColor: string;
  gradient: string;
  /** 0–100 */
  progressPercent: number;
  lastReadAt: string;
  /** Human-readable e.g. "2 hours ago" */
  lastReadLabel: string;
  currentSectionTitle: string;
  xpRewardOnCompletion: number;
}

// ─── Featured topic (learn list page) ────────────────────────────────────────

export interface FeaturedTopic {
  _id: string;
  slug: string;
  title: string;
  instructor: Pick<LearnInstructor, "name" | "email" | "initials" | "color">;
}

// ─── Save / unsave response ───────────────────────────────────────────────────

export interface SaveModuleResponse {
  moduleId: string;
  saved: boolean;
}

export interface MarkTopicCompleteResponse {
  topicId: string;
  completed: boolean;
  /** updated XP total */
  xpTotal: number;
  xpAwarded: number;
  /** updated streak */
  streakDays: number;
  /** updated module progress */
  moduleProgressPercent: number;
  /** whether the certificate was unlocked */
  certificateUnlocked: boolean;
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
  ],

  endpoints: (builder) => ({
    /**
     * GET /learn/modules
     * Paginated list of published modules for the dashboard learn page.
     * When authenticated, returns citizen-specific fields:
     * progressPercent, userTab ("active" | "complete" | "saved"), isSaved, enrolledAt.
     */
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

    /**
     * GET /learn/modules/:slug
     * Full module detail including ordered topics with citizen progress.
     * Used on the /dashboard/learn/[slug] page.
     */
    getLearnModuleBySlug: builder.query<ApiResponse<LearnModuleDetail>, string>({
      query: (slug) => ({
        url: `/learn/modules/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "LearnModuleDetail", id: slug },
      ],
    }),

    /**
     * GET /learn/modules/:moduleSlug/topics/:topicSlug
     * Full topic detail: video info, subtopics, citizen progress state.
     * Used on the /dashboard/learn/[slug] video/topic view page.
     */
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

    /**
     * GET /learn/continue-reading
     * Returns the citizen's in-progress modules (max 2 for the dashboard strip).
     * Requires authentication.
     */
    getContinueReading: builder.query<ApiResponse<ContinueReadingItem[]>, void>({
      query: () => ({
        url: "/learn/continue-reading",
        method: "GET",
      }),
      providesTags: ["ContinueReading"],
    }),

    /**
     * GET /learn/featured-topics
     * A curated list of featured topics shown at the bottom of the learn page.
     */
    getFeaturedTopics: builder.query<ApiResponse<FeaturedTopic[]>, void>({
      query: () => ({
        url: "/learn/featured-topics",
        method: "GET",
      }),
      providesTags: ["FeaturedTopics"],
    }),

    /**
     * POST /learn/modules/:moduleId/save
     * Toggle save/unsave a module to the citizen's saved list.
     * Returns the updated saved state.
     */
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

    /**
     * POST /learn/modules/:moduleId/enrol
     * Enrol the citizen in a module.
     * Returns the updated module with enrolledAt and progressPercent.
     */
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

    /**
     * POST /learn/modules/:moduleId/topics/:topicId/complete
     * Mark a topic as completed for the authenticated citizen.
     * Awards XP, updates streak, and checks for certificate unlock.
     */
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

    /**
     * PATCH /learn/modules/:moduleId/topics/:topicId/progress
     * Save the citizen's current video watch position.
     * Called periodically while the video is playing.
     * Body: { currentTimeSeconds: number }
     */
    saveVideoProgress: builder.mutation<
      ApiResponse<{ topicId: string; currentTimeSeconds: number }>,
      { moduleId: string; topicId: string; currentTimeSeconds: number }
    >({
      query: ({ moduleId, topicId, currentTimeSeconds }) => ({
        url: `/learn/modules/${moduleId}/topics/${topicId}/progress`,
        method: "PATCH",
        data: { currentTimeSeconds },
      }),
      // Intentionally no tag invalidation — this is a silent background save
    }),
  }),
});

export const {
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
} = learnApi;