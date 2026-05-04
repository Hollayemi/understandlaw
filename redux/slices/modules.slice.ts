import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
    ApiResponse,
    PaginatedResponse,
    Module,
    CreateModulePayload,
    UpdateModulePayload,
    ModuleFilters,
    ModuleOverviewStats,
    DailyActivityStats,
    Topic,
    TopicWithSubTopics,
    CreateTopicPayload,
    UpdateTopicPayload,
    ReorderTopicsPayload,
    SubTopic,
    CreateSubTopicPayload,
    UpdateSubTopicPayload,
    ReorderSubTopicsPayload,
    ActivityItem,
    ModuleActivityParams,
    ModuleAnalytics,
    TopicAnalytics,
    Learner,
    TopLearner,
    LearnersParams,
    Comment,
    CommentsParams,
    ResolveCommentPayload,
    DeleteCommentPayload,
    UploadResponse,
    VideoUploadResponse,
    UploadThumbnailPayload,
    UploadVideoPayload,
    ModuleDetailSection,
    TopicDetailTab,
} from "./types";


const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
    prepareHeaders: (headers) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("lawticha_admin_token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
}) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

//  RTK Query API Slice 

export const modulesApi = createApi({
    reducerPath: "modulesApi",
    baseQuery,
    tagTypes: [
        "Module",
        "ModuleList",
        "ModuleStats",
        "DailyStats",
        "Topic",
        "TopicList",
        "SubTopic",
        "SubTopicList",
        "Activity",
        "ModuleAnalytics",
        "TopicAnalytics",
        "Comment",
        "CommentList",
        "Learner",
        "LearnerList",
        "TopLearners",
    ],

    endpoints: (builder) => ({
        // ════════════════════════════════════════════════════════════
        //  MODULE ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules
         * List all modules with optional filtering, search and pagination.
         */
        getModules: builder.query<PaginatedResponse<Module>, ModuleFilters>({
            query: (filters) => ({
                url: "/admin/modules",
                params: {
                    ...(filters.status && filters.status !== "all" && { status: filters.status }),
                    ...(filters.category && filters.category !== "all" && { category: filters.category }),
                    ...(filters.search && { search: filters.search }),
                    page: filters.page ?? 1,
                    pageSize: filters.pageSize ?? 20,
                    ...(filters.sortBy && { sortBy: filters.sortBy }),
                    ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: "Module" as const, id })),
                        { type: "ModuleList" },
                    ]
                    : [{ type: "ModuleList" }],
        }),

        /**
         * GET /admin/modules/stats
         * Aggregate counts for the stats bar: totalModules, totalTopics, totalEnrolled, avgCompletion.
         */
        getModuleOverviewStats: builder.query<ModuleOverviewStats, void>({
            query: () => "/admin/modules/stats",
            providesTags: ["ModuleStats"],
        }),

        /**
         * GET /admin/modules/daily-stats
         * Today's activity strip numbers (views, enrolments, completions, avg session).
         */
        getDailyActivityStats: builder.query<DailyActivityStats, void>({
            query: () => "/admin/modules/daily-stats",
            providesTags: ["DailyStats"],
        }),

        /**
         * GET /admin/modules/:id
         * Fetch a single module by ID.
         */
        getModuleById: builder.query<ApiResponse<Module>, string>({
            query: (id) => `/admin/modules/${id}`,
            providesTags: (result, error, id) => [{ type: "Module", id }],
        }),

        /**
         * POST /admin/modules
         * Create a new module. Returns the created Module object.
         */
        createModule: builder.mutation<ApiResponse<Module>, CreateModulePayload>({
            query: (body) => ({
                url: "/admin/modules",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ModuleList", "ModuleStats"],
        }),

        /**
         * PATCH /admin/modules/:id
         * Partially update a module (title, category, description, status, thumbnail, etc.).
         */
        updateModule: builder.mutation<
            ApiResponse<Module>,
            { id: string; data: UpdateModulePayload }
        >({
            query: ({ id, data }) => ({
                url: `/admin/modules/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Module", id },
                "ModuleList",
                "ModuleStats",
            ],
        }),

        /**
         * DELETE /admin/modules/:id
         * Permanently delete a module and all its topics, subtopics, activity, and analytics.
         */
        deleteModule: builder.mutation<{ message: string; success: boolean }, string>({
            query: (id) => ({
                url: `/admin/modules/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ModuleList", "ModuleStats"],
        }),

        // ════════════════════════════════════════════════════════════
        //  TOPIC ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/topics
         * List all topics for a module, ordered by `order` ASC.
         * Each topic object includes subtopicCount but NOT subtopic body (use getTopicById for that).
         */
        getTopics: builder.query<Topic[], string>({
            query: (moduleId) => `/admin/modules/${moduleId}/topics`,
            providesTags: (result, error, moduleId) => [
                { type: "TopicList", id: moduleId },
                ...(result ?? []).map(({ id }) => ({ type: "Topic" as const, id })),
            ],
        }),

        /**
         * GET /admin/modules/:moduleId/topics/:topicId
         * Fetch a single topic including its embedded subtopics array.
         */
        getTopicById: builder.query<
            ApiResponse<TopicWithSubTopics>,
            { moduleId: string; topicId: string }
        >({
            query: ({ moduleId, topicId }) =>
                `/admin/modules/${moduleId}/topics/${topicId}`,
            providesTags: (result, error, { topicId }) => [{ type: "Topic", id: topicId }],
        }),

        /**
         * POST /admin/modules/:moduleId/topics
         * Create a new topic within a module.
         */
        createTopic: builder.mutation<ApiResponse<Topic>, CreateTopicPayload>({
            query: ({ moduleId, ...body }) => ({
                url: `/admin/modules/${moduleId}/topics`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { moduleId }) => [
                { type: "TopicList", id: moduleId },
                { type: "Module", id: moduleId },
                "ModuleStats",
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/:topicId
         * Update topic fields: title, classification, overview, status, videoType,
         * videoUrl, thumbnailUrl, order, tags.
         */
        updateTopic: builder.mutation<ApiResponse<Topic>, UpdateTopicPayload>({
            query: ({ moduleId, topicId, ...body }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { moduleId, topicId }) => [
                { type: "Topic", id: topicId },
                { type: "TopicList", id: moduleId },
                { type: "Module", id: moduleId },
            ],
        }),

        /**
         * DELETE /admin/modules/:moduleId/topics/:topicId
         * Delete a topic and all its subtopics. Remaining topics are re-indexed automatically.
         */
        deleteTopic: builder.mutation<
            { message: string },
            { moduleId: string; topicId: string }
        >({
            query: ({ moduleId, topicId }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { moduleId }) => [
                { type: "TopicList", id: moduleId },
                { type: "Module", id: moduleId },
                "ModuleStats",
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/reorder
         * Supply the full ordered array of topic IDs; backend persists new `order` values.
         */
        reorderTopics: builder.mutation<{ message: string }, ReorderTopicsPayload>({
            query: ({ moduleId, orderedIds }) => ({
                url: `/admin/modules/${moduleId}/topics/reorder`,
                method: "PATCH",
                body: { orderedIds },
            }),
            invalidatesTags: (result, error, { moduleId }) => [
                { type: "TopicList", id: moduleId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  SUBTOPIC ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/topics/:topicId/subtopics
         * List all subtopics for a topic, ordered by `order` ASC.
         */
        getSubTopics: builder.query<
            SubTopic[],
            { moduleId: string; topicId: string }
        >({
            query: ({ moduleId, topicId }) =>
                `/admin/modules/${moduleId}/topics/${topicId}/subtopics`,
            providesTags: (result, error, { topicId }) => [
                { type: "SubTopicList", id: topicId },
                ...(result ?? []).map(({ id }) => ({ type: "SubTopic" as const, id })),
            ],
        }),

        /**
         * POST /admin/modules/:moduleId/topics/:topicId/subtopics
         * Create a new subtopic. `order` defaults to last position if omitted.
         */
        createSubTopic: builder.mutation<ApiResponse<SubTopic>, CreateSubTopicPayload>({
            query: ({ moduleId, topicId, ...body }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/subtopics`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { topicId }) => [
                { type: "SubTopicList", id: topicId },
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId
         * Update any combination of: title, notes (instructor script), duration, order.
         */
        updateSubTopic: builder.mutation<ApiResponse<SubTopic>, UpdateSubTopicPayload>({
            query: ({ moduleId, topicId, subtopicId, ...body }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/subtopics/${subtopicId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { topicId, subtopicId }) => [
                { type: "SubTopic", id: subtopicId },
                { type: "SubTopicList", id: topicId },
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId/notes
         * Dedicated notes-only update endpoint (lighter payload, no status side-effects).
         */
        updateSubTopicNotes: builder.mutation<
            ApiResponse<Pick<SubTopic, "id" | "notes" | "updatedAt">>,
            { moduleId: string; topicId: string; subtopicId: string; notes: string }
        >({
            query: ({ moduleId, topicId, subtopicId, notes }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/subtopics/${subtopicId}/notes`,
                method: "PATCH",
                body: { notes },
            }),
            invalidatesTags: (result, error, { subtopicId, topicId }) => [
                { type: "SubTopic", id: subtopicId },
                { type: "SubTopicList", id: topicId },
            ],
        }),

        /**
         * DELETE /admin/modules/:moduleId/topics/:topicId/subtopics/:subtopicId
         * Delete a subtopic. Remaining subtopics are re-indexed automatically.
         */
        deleteSubTopic: builder.mutation<
            { message: string },
            { moduleId: string; topicId: string; subtopicId: string }
        >({
            query: ({ moduleId, topicId, subtopicId }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/subtopics/${subtopicId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { topicId }) => [
                { type: "SubTopicList", id: topicId },
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/:topicId/subtopics/reorder
         * Reorder all subtopics by supplying the complete ordered ID array.
         */
        reorderSubTopics: builder.mutation<{ message: string }, ReorderSubTopicsPayload>({
            query: ({ moduleId, topicId, orderedIds }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/subtopics/reorder`,
                method: "PATCH",
                body: { orderedIds },
            }),
            invalidatesTags: (result, error, { topicId }) => [
                { type: "SubTopicList", id: topicId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  ACTIVITY ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/activity
         * Recent activity feed for a module (enrolments, completions, likes, comments).
         * Supports cursor-based pagination via `before` ISO timestamp.
         */
        getModuleActivity: builder.query<ActivityItem[], ModuleActivityParams>({
            query: ({ moduleId, limit = 20, before }) => ({
                url: `/admin/modules/${moduleId}/activity`,
                params: { limit, ...(before && { before }) },
            }),
            providesTags: (result, error, { moduleId }) => [
                { type: "Activity", id: moduleId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  ANALYTICS ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/analytics
         * Full module analytics: progress distribution, per-topic performance table.
         */
        getModuleAnalytics: builder.query<ModuleAnalytics, string>({
            query: (moduleId) => `/admin/modules/${moduleId}/analytics`,
            providesTags: (result, error, moduleId) => [
                { type: "ModuleAnalytics", id: moduleId },
            ],
        }),

        /**
         * GET /admin/modules/:moduleId/topics/:topicId/analytics
         * Full topic analytics: daily views chart, sub-topic drop-off, state breakdown,
         * weekly engagement metrics (like rate, comment rate, avg duration).
         */
        getTopicAnalytics: builder.query<
            TopicAnalytics,
            { moduleId: string; topicId: string }
        >({
            query: ({ moduleId, topicId }) =>
                `/admin/modules/${moduleId}/topics/${topicId}/analytics`,
            providesTags: (result, error, { topicId }) => [
                { type: "TopicAnalytics", id: topicId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  LEARNER ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/learners
         * Paginated list of enrolled learners with progress.
         */
        getModuleLearners: builder.query<PaginatedResponse<Learner>, LearnersParams>({
            query: ({ moduleId, page = 1, pageSize = 20, search, sortBy, sortOrder }) => ({
                url: `/admin/modules/${moduleId}/learners`,
                params: {
                    page,
                    pageSize,
                    ...(search && { search }),
                    ...(sortBy && { sortBy }),
                    ...(sortOrder && { sortOrder }),
                },
            }),
            providesTags: (result, error, { moduleId }) => [
                { type: "LearnerList", id: moduleId },
            ],
        }),

        /**
         * GET /admin/modules/:moduleId/learners/top
         * Top N learners by progress percentage. Used in the activity sidebar.
         */
        getTopLearners: builder.query<
            TopLearner[],
            { moduleId: string; limit?: number }
        >({
            query: ({ moduleId, limit = 5 }) => ({
                url: `/admin/modules/${moduleId}/learners/top`,
                params: { limit },
            }),
            providesTags: (result, error, { moduleId }) => [
                { type: "TopLearners", id: moduleId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  COMMENT ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * GET /admin/modules/:moduleId/topics/:topicId/comments
         * Fetch all comments for a topic. Pass `resolved` to filter open/closed.
         */
        getComments: builder.query<Comment[], CommentsParams>({
            query: ({ moduleId, topicId, resolved }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/comments`,
                params: {
                    ...(resolved !== undefined && { resolved }),
                },
            }),
            providesTags: (result, error, { topicId }) => [
                { type: "CommentList", id: topicId },
                ...(result ?? []).map(({ id }) => ({ type: "Comment" as const, id })),
            ],
        }),

        /**
         * PATCH /admin/modules/:moduleId/topics/:topicId/comments/:commentId/resolve
         * Toggle a comment's resolved status. Pass `resolved: true` or `false`.
         */
        resolveComment: builder.mutation<ApiResponse<Comment>, ResolveCommentPayload>({
            query: ({ moduleId, topicId, commentId, resolved }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/comments/${commentId}/resolve`,
                method: "PATCH",
                body: { resolved },
            }),
            invalidatesTags: (result, error, { topicId, commentId }) => [
                { type: "Comment", id: commentId },
                { type: "CommentList", id: topicId },
            ],
        }),

        /**
         * DELETE /admin/modules/:moduleId/topics/:topicId/comments/:commentId
         * Permanently delete a comment and all its replies.
         */
        deleteComment: builder.mutation<{ message: string }, DeleteCommentPayload>({
            query: ({ moduleId, topicId, commentId }) => ({
                url: `/admin/modules/${moduleId}/topics/${topicId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { topicId }) => [
                { type: "CommentList", id: topicId },
            ],
        }),

        // ════════════════════════════════════════════════════════════
        //  UPLOAD ENDPOINTS
        // ════════════════════════════════════════════════════════════

        /**
         * POST /admin/uploads/thumbnail
         * Multipart form-data upload for module or topic thumbnail.
         * Returns a public CDN URL in the response.
         */
        uploadThumbnail: builder.mutation<UploadResponse, UploadThumbnailPayload>({
            query: ({ file, moduleId, topicId }) => {
                const formData = new FormData();
                formData.append("file", file);
                if (moduleId) formData.append("moduleId", moduleId);
                if (topicId) formData.append("topicId", topicId);
                return {
                    url: "/admin/uploads/thumbnail",
                    method: "POST",
                    body: formData,
                    // Do NOT set Content-Type; browser sets multipart/form-data with boundary automatically
                };
            },
        }),

        /**
         * POST /admin/uploads/video
         * Multipart form-data upload for a topic video.
         * Returns CDN URL + duration extracted server-side.
         * For large files, prefer a presigned-URL flow (see doc.md §Uploads).
         */
        uploadVideo: builder.mutation<VideoUploadResponse, UploadVideoPayload>({
            query: ({ file, moduleId, topicId }) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("moduleId", moduleId);
                formData.append("topicId", topicId);
                return {
                    url: "/admin/uploads/video",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { topicId }) => [
                { type: "Topic", id: topicId },
            ],
        }),

        /**
         * POST /admin/uploads/presign
         * Request a presigned S3 URL for direct large-file upload from the browser.
         * Use this for videos > 100 MB to avoid routing through the API server.
         */
        getPresignedUploadUrl: builder.mutation<
            { uploadUrl: string; fileKey: string; expiresAt: string },
            { filename: string; mimeType: string; sizeBytes: number }
        >({
            query: (body) => ({
                url: "/admin/uploads/presign",
                method: "POST",
                body,
            }),
        }),
    }),
});

//  Export RTK Query Hooks 
// Modules
export const {
    useGetModulesQuery,
    useGetModuleOverviewStatsQuery,
    useGetDailyActivityStatsQuery,
    useGetModuleByIdQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
} = modulesApi;

// Topics
export const {
    useGetTopicsQuery,
    useGetTopicByIdQuery,
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation,
    useReorderTopicsMutation,
} = modulesApi;

// SubTopics
export const {
    useGetSubTopicsQuery,
    useCreateSubTopicMutation,
    useUpdateSubTopicMutation,
    useUpdateSubTopicNotesMutation,
    useDeleteSubTopicMutation,
    useReorderSubTopicsMutation,
} = modulesApi;

// Activity
export const { useGetModuleActivityQuery } = modulesApi;

// Analytics
export const { useGetModuleAnalyticsQuery, useGetTopicAnalyticsQuery } = modulesApi;

// Learners
export const { useGetModuleLearnersQuery, useGetTopLearnersQuery } = modulesApi;

// Comments
export const {
    useGetCommentsQuery,
    useResolveCommentMutation,
    useDeleteCommentMutation,
} = modulesApi;

// Uploads
export const {
    useUploadThumbnailMutation,
    useUploadVideoMutation,
    useGetPresignedUploadUrlMutation,
} = modulesApi;

//  Local UI Slice (non-server state) 

interface ModulesUiState {
    //  Modules list page 
    showCreateModal: boolean;
    createModalStep: 1 | 2;
    selectedModuleId: string | null;
    modulesTab: string; // 'all' | 'active' | 'pending' | 'inactive'
    modulesSearch: string;
    modulesCategoryFilter: string; // 'all' | ModuleCategory
    modulesPage: number;

    //  Module detail page 
    moduleDetailSection: ModuleDetailSection;
    expandedTopicIds: string[];
    topicVideoEditorId: string | null; // which topic has video editor open

    //  Topic detail page 
    topicDetailTab: TopicDetailTab;
    expandedSubTopicIds: string[];
}

const initialUiState: ModulesUiState = {
    showCreateModal: false,
    createModalStep: 1,
    selectedModuleId: null,
    modulesTab: "all",
    modulesSearch: "",
    modulesCategoryFilter: "all",
    modulesPage: 1,
    moduleDetailSection: "topics",
    expandedTopicIds: [],
    topicVideoEditorId: null,
    topicDetailTab: "content",
    expandedSubTopicIds: [],
};

export const modulesUiSlice = createSlice({
    name: "modulesUi",
    initialState: initialUiState,
    reducers: {
        // Create modal
        openCreateModal(state) {
            state.showCreateModal = true;
            state.createModalStep = 1;
        },
        closeCreateModal(state) {
            state.showCreateModal = false;
            state.createModalStep = 1;
        },
        advanceCreateModalStep(state) {
            state.createModalStep = 2;
        },
        backCreateModalStep(state) {
            state.createModalStep = 1;
        },

        // Module selection
        setSelectedModuleId(state, action: PayloadAction<string | null>) {
            state.selectedModuleId = action.payload;
        },

        // Modules list filters
        setModulesTab(state, action: PayloadAction<string>) {
            state.modulesTab = action.payload;
            state.modulesPage = 1;
        },
        setModulesSearch(state, action: PayloadAction<string>) {
            state.modulesSearch = action.payload;
            state.modulesPage = 1;
        },
        setModulesCategoryFilter(state, action: PayloadAction<string>) {
            state.modulesCategoryFilter = action.payload;
            state.modulesPage = 1;
        },
        setModulesPage(state, action: PayloadAction<number>) {
            state.modulesPage = action.payload;
        },

        // Module detail
        setModuleDetailSection(state, action: PayloadAction<ModuleDetailSection>) {
            state.moduleDetailSection = action.payload;
        },
        toggleExpandedTopic(state, action: PayloadAction<string>) {
            const idx = state.expandedTopicIds.indexOf(action.payload);
            if (idx > -1) {
                state.expandedTopicIds.splice(idx, 1);
            } else {
                state.expandedTopicIds.push(action.payload);
            }
        },
        collapseAllTopics(state) {
            state.expandedTopicIds = [];
        },
        expandAllTopics(state, action: PayloadAction<string[]>) {
            state.expandedTopicIds = action.payload;
        },
        setTopicVideoEditorId(state, action: PayloadAction<string | null>) {
            state.topicVideoEditorId = action.payload;
        },

        // Topic detail
        setTopicDetailTab(state, action: PayloadAction<TopicDetailTab>) {
            state.topicDetailTab = action.payload;
        },
        toggleExpandedSubTopic(state, action: PayloadAction<string>) {
            const idx = state.expandedSubTopicIds.indexOf(action.payload);
            if (idx > -1) {
                state.expandedSubTopicIds.splice(idx, 1);
            } else {
                state.expandedSubTopicIds.push(action.payload);
            }
        },
        collapseAllSubTopics(state) {
            state.expandedSubTopicIds = [];
        },
    },
});

export const modulesUiActions = modulesUiSlice.actions;

//  Selectors 

export const selectModulesUi = (state: RootState) => state.modulesUi;
export const selectShowCreateModal = (state: RootState) =>
    state.modulesUi.showCreateModal;
export const selectCreateModalStep = (state: RootState) =>
    state.modulesUi.createModalStep;
export const selectModulesFilters = (state: RootState) => ({
    tab: state.modulesUi.modulesTab,
    search: state.modulesUi.modulesSearch,
    category: state.modulesUi.modulesCategoryFilter,
    page: state.modulesUi.modulesPage,
});
export const selectModuleDetailSection = (state: RootState) =>
    state.modulesUi.moduleDetailSection;
export const selectExpandedTopicIds = (state: RootState) =>
    state.modulesUi.expandedTopicIds;
export const selectTopicDetailTab = (state: RootState) =>
    state.modulesUi.topicDetailTab;
export const selectExpandedSubTopicIds = (state: RootState) =>
    state.modulesUi.expandedSubTopicIds;