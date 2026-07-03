import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse } from "../types";

// ============================================
// TYPES BASED ON DASHBOARD COMPONENT DATA
// ============================================

export interface ContinueReadingItem {
  slug: string;
  icon: React.ReactNode;
  gradient: string;
  tag: string;
  tagColor: string;
  title: string;
  progress: number;
  lastRead: string;
  section: string;
  xpReward: number;
}

export interface DailyChallenge {
  title: string;
  question: string;
  options: string[];
  correct: number;
  xpReward: number;
  completed: boolean;
}

export interface TrendingTopic {
  icon: React.ReactNode;
  title: string;
  reads: string;
  hot: boolean;
  slug: string;
}

export interface BookmarkItem {
  title: string;
  law: string;
  color: string;
}

export interface CommunityHighlight {
  initials: string;
  color: string;
  name: string;
  text: string;
  time: string;
  likes: number;
}

export interface DashboardStat {
  icon: React.ReactNode;
  color: string;
  bg: string;
  value: number | string;
  label: string;
}

export interface TaskItem {
  done: boolean;
  text: string;
}

export interface NextGoal {
  title: string;
  description: string;
  progress: number; // 0-100
  total: number;
  completed: number;
  tasks: TaskItem[];
}

export interface UserStats {
  topicsCompletedCount: number;
  streakDays: number;
  certificatesCount: number;
  totalStudyMinutes: number;
  xpTotal: number;
  xpLevel: number;
}

export interface DashboardData {
  stats: UserStats;
  continueReading: ContinueReadingItem[];
  dailyChallenge: DailyChallenge;
  trendingTopics: TrendingTopic[];
  bookmarks: BookmarkItem[];
  communityHighlights: CommunityHighlight[];
  nextGoal: NextGoal;
  welcomeVideo: {
    title: string;
    duration: string;
    views: number;
    url?: string;
  };
}

// ============================================
// STATE INTERFACE
// ============================================

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  videoPlaying: boolean;
  selectedQuizOption: number | null;
  quizRevealed: boolean;
  quizCompleted: boolean;
  activeTab: 'overview' | 'learn' | 'bookmarks' | 'community';
  streakDays: number;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  videoPlaying: false,
  selectedQuizOption: null,
  quizRevealed: false,
  quizCompleted: false,
  activeTab: 'overview',
  streakDays: 0,
};

// ============================================
// API ENDPOINTS
// ============================================

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Dashboard", "DashboardStats", "DashboardContent", "DashboardProgress"],
  endpoints: (builder) => ({
    // Get complete dashboard data
    getDashboardData: builder.query<ApiResponse<DashboardData>, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "Dashboard" }],
    }),

    // Get user stats
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: [{ type: "DashboardStats" }],
    }),

    // Get continue reading items
    getContinueReading: builder.query<ApiResponse<ContinueReadingItem[]>, void>({
      query: () => ({
        url: "/dashboard/continue-reading",
        method: "GET",
      }),
      providesTags: [{ type: "DashboardContent", id: "reading" }],
    }),

    // Get daily challenge
    getDailyChallenge: builder.query<ApiResponse<DailyChallenge>, void>({
      query: () => ({
        url: "/dashboard/daily-challenge",
        method: "GET",
      }),
      providesTags: [{ type: "DashboardContent", id: "challenge" }],
    }),

    // Get trending topics
    getTrendingTopics: builder.query<ApiResponse<TrendingTopic[]>, { limit?: number }>({
      query: (params) => ({
        url: "/dashboard/trending",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DashboardContent", id: "trending" }],
    }),

    // Get bookmarks
    getBookmarks: builder.query<ApiResponse<BookmarkItem[]>, void>({
      query: () => ({
        url: "/dashboard/bookmarks",
        method: "GET",
      }),
      providesTags: [{ type: "DashboardContent", id: "bookmarks" }],
    }),

    // Get community highlights
    getCommunityHighlights: builder.query<ApiResponse<CommunityHighlight[]>, { limit?: number }>({
      query: (params) => ({
        url: "/dashboard/community",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DashboardContent", id: "community" }],
    }),

    // Get next goal
    getNextGoal: builder.query<ApiResponse<NextGoal>, void>({
      query: () => ({
        url: "/dashboard/goal",
        method: "GET",
      }),
      providesTags: [{ type: "DashboardProgress" }],
    }),

    // Submit quiz answer
    submitQuizAnswer: builder.mutation<ApiResponse<{ correct: boolean; xpEarned: number }>, { questionId: string; answer: number }>({
      query: (body) => ({
        url: "/dashboard/quiz/submit",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "DashboardContent", id: "challenge" }, { type: "DashboardStats" }],
    }),

    // Update reading progress
    updateReadingProgress: builder.mutation<ApiResponse<{ progress: number }>, { slug: string; progress: number }>({
      query: (body) => ({
        url: "/dashboard/progress",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [{ type: "DashboardContent", id: "reading" }, { type: "DashboardProgress" }],
    }),

    // Add bookmark
    addBookmark: builder.mutation<ApiResponse<BookmarkItem>, { title: string; law: string }>({
      query: (body) => ({
        url: "/dashboard/bookmarks",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "DashboardContent", id: "bookmarks" }],
    }),

    // Remove bookmark
    removeBookmark: builder.mutation<ApiResponse<void>, { title: string }>({
      query: (body) => ({
        url: "/dashboard/bookmarks",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: [{ type: "DashboardContent", id: "bookmarks" }],
    }),
  }),
});

// ============================================
// DASHBOARD SLICE
// ============================================

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // ===== DATA SETTERS =====
    setDashboardData: (state, action: PayloadAction<DashboardData>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setStats: (state, action: PayloadAction<UserStats>) => {
      if (state.data) {
        state.data.stats = action.payload;
      }
    },

    setContinueReading: (state, action: PayloadAction<ContinueReadingItem[]>) => {
      if (state.data) {
        state.data.continueReading = action.payload;
      }
    },

    setDailyChallenge: (state, action: PayloadAction<DailyChallenge>) => {
      if (state.data) {
        state.data.dailyChallenge = action.payload;
      }
    },

    setTrendingTopics: (state, action: PayloadAction<TrendingTopic[]>) => {
      if (state.data) {
        state.data.trendingTopics = action.payload;
      }
    },

    setBookmarks: (state, action: PayloadAction<BookmarkItem[]>) => {
      if (state.data) {
        state.data.bookmarks = action.payload;
      }
    },

    setCommunityHighlights: (state, action: PayloadAction<CommunityHighlight[]>) => {
      if (state.data) {
        state.data.communityHighlights = action.payload;
      }
    },

    setNextGoal: (state, action: PayloadAction<NextGoal>) => {
      if (state.data) {
        state.data.nextGoal = action.payload;
      }
    },

    // ===== UI STATE =====
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setVideoPlaying: (state, action: PayloadAction<boolean>) => {
      state.videoPlaying = action.payload;
    },

    toggleVideo: (state) => {
      state.videoPlaying = !state.videoPlaying;
    },

    setSelectedQuizOption: (state, action: PayloadAction<number | null>) => {
      state.selectedQuizOption = action.payload;
    },

    setQuizRevealed: (state, action: PayloadAction<boolean>) => {
      state.quizRevealed = action.payload;
    },

    setQuizCompleted: (state, action: PayloadAction<boolean>) => {
      state.quizCompleted = action.payload;
    },

    resetQuiz: (state) => {
      state.selectedQuizOption = null;
      state.quizRevealed = false;
      state.quizCompleted = false;
    },

    setActiveTab: (state, action: PayloadAction<DashboardState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    setStreakDays: (state, action: PayloadAction<number>) => {
      state.streakDays = action.payload;
    },

    // ===== USER ACTIONS =====
    markTaskComplete: (state, action: PayloadAction<string>) => {
      if (state.data?.nextGoal) {
        const task = state.data.nextGoal.tasks.find(t => t.text === action.payload);
        if (task && !task.done) {
          task.done = true;
          state.data.nextGoal.completed += 1;
          state.data.nextGoal.progress = (state.data.nextGoal.completed / state.data.nextGoal.total) * 100;
        }
      }
    },

    updateReadingItemProgress: (state, action: PayloadAction<{ slug: string; progress: number }>) => {
      if (state.data?.continueReading) {
        const item = state.data.continueReading.find(i => i.slug === action.payload.slug);
        if (item) {
          item.progress = action.payload.progress;
        }
      }
    },

    // ===== RESET =====
    resetDashboardState: (state) => {
      Object.assign(state, initialState);
    },

    clearData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
});

// ============================================
// EXPORT ACTIONS
// ============================================

export const {
  setDashboardData,
  setStats,
  setContinueReading,
  setDailyChallenge,
  setTrendingTopics,
  setBookmarks,
  setCommunityHighlights,
  setNextGoal,
  setLoading,
  setError,
  setVideoPlaying,
  toggleVideo,
  setSelectedQuizOption,
  setQuizRevealed,
  setQuizCompleted,
  resetQuiz,
  setActiveTab,
  setStreakDays,
  markTaskComplete,
  updateReadingItemProgress,
  resetDashboardState,
  clearData,
} = dashboardSlice.actions;

// ============================================
// EXPORT API HOOKS
// ============================================

export const {
  useGetDashboardDataQuery,
  useGetUserStatsQuery,
  useGetContinueReadingQuery,
  useGetDailyChallengeQuery,
  useGetTrendingTopicsQuery,
  useGetBookmarksQuery,
  useGetCommunityHighlightsQuery,
  useGetNextGoalQuery,
  useSubmitQuizAnswerMutation,
  useUpdateReadingProgressMutation,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = dashboardApi;

// ============================================
// SELECTORS
// ============================================

// Basic selectors
export const selectDashboardData = (state: { dashboard: DashboardState }) => state.dashboard.data;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectVideoPlaying = (state: { dashboard: DashboardState }) => state.dashboard.videoPlaying;
export const selectSelectedQuizOption = (state: { dashboard: DashboardState }) => state.dashboard.selectedQuizOption;
export const selectQuizRevealed = (state: { dashboard: DashboardState }) => state.dashboard.quizRevealed;
export const selectQuizCompleted = (state: { dashboard: DashboardState }) => state.dashboard.quizCompleted;
export const selectActiveTab = (state: { dashboard: DashboardState }) => state.dashboard.activeTab;
export const selectStreakDays = (state: { dashboard: DashboardState }) => state.dashboard.streakDays;

// Section selectors
export const selectStats = (state: { dashboard: DashboardState }) => state.dashboard.data?.stats;
export const selectContinueReading = (state: { dashboard: DashboardState }) => state.dashboard.data?.continueReading || [];
export const selectDailyChallenge = (state: { dashboard: DashboardState }) => state.dashboard.data?.dailyChallenge;
export const selectTrendingTopics = (state: { dashboard: DashboardState }) => state.dashboard.data?.trendingTopics || [];
export const selectBookmarks = (state: { dashboard: DashboardState }) => state.dashboard.data?.bookmarks || [];
export const selectCommunityHighlights = (state: { dashboard: DashboardState }) => state.dashboard.data?.communityHighlights || [];
export const selectNextGoal = (state: { dashboard: DashboardState }) => state.dashboard.data?.nextGoal;
export const selectWelcomeVideo = (state: { dashboard: DashboardState }) => state.dashboard.data?.welcomeVideo;

// Computed selectors
export const selectHotTopics = (state: { dashboard: DashboardState }) => {
  const topics = state.dashboard.data?.trendingTopics || [];
  return topics.filter(t => t.hot);
};

export const selectInProgressReading = (state: { dashboard: DashboardState }) => {
  const items = state.dashboard.data?.continueReading || [];
  return items.filter(item => item.progress > 0 && item.progress < 100);
};

export const selectCompletedReading = (state: { dashboard: DashboardState }) => {
  const items = state.dashboard.data?.continueReading || [];
  return items.filter(item => item.progress >= 100);
};

export const selectTotalXP = (state: { dashboard: DashboardState }) => {
  return state.dashboard.data?.stats.xpTotal || 0;
};

export const selectXPProgress = (state: { dashboard: DashboardState }) => {
  const stats = state.dashboard.data?.stats;
  if (!stats) return 0;
  return (stats.xpTotal / stats.xpLevel) * 100;
};

export const selectTasksRemaining = (state: { dashboard: DashboardState }) => {
  const goal = state.dashboard.data?.nextGoal;
  if (!goal) return 0;
  return goal.tasks.filter(t => !t.done).length;
};

export const selectAllTasksCompleted = (state: { dashboard: DashboardState }) => {
  const goal = state.dashboard.data?.nextGoal;
  if (!goal) return false;
  return goal.tasks.every(t => t.done);
};

// Combined selector for dashboard overview
export const selectDashboardOverview = (state: { dashboard: DashboardState }) => {
  const data = state.dashboard.data;
  if (!data) return null;
  
  return {
    stats: data.stats,
    greeting: getGreeting(),
    continueReading: data.continueReading.slice(0, 2),
    dailyChallenge: data.dailyChallenge,
    trendingTopics: data.trendingTopics.slice(0, 4),
    bookmarks: data.bookmarks.slice(0, 3),
    communityHighlights: data.communityHighlights.slice(0, 2),
    nextGoal: data.nextGoal,
  };
};

// Helper function
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default dashboardSlice.reducer;