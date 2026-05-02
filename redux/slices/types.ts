export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
  };
}

// ─── Enum / Union Types ───────────────────────────────────────────────────────

export type ModuleCategory =
  | "criminal"
  | "tenancy"
  | "employment"
  | "contracts"
  | "business"
  | "family"
  | "consumer"
  | "road";

export type ModuleStatus = "active" | "inactive" | "pending";
export type TopicStatus = "published" | "draft" | "pending";
export type VideoType = "youtube" | "upload";
export type ActivityAction =
  | "completed"
  | "enrolled"
  | "liked"
  | "commented"
  | "watched"
  | "started";
export type TargetType = "topic" | "module" | "subtopic";
export type ModuleDetailSection = "topics" | "activity" | "settings";
export type TopicDetailTab = "content" | "analytics" | "comments";

// ─── Module Types ─────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  title: string;
  category: ModuleCategory;
  status: ModuleStatus;
  thumbnail: string | null;
  description: string;
  topicCount: number;
  enrolledCount: number;
  completionRate: number; // 0–100
  avgRating: number; // 0–5
  reviewCount: number;
  totalWatchTimeHours: number;
  instructor: string;
  instructorId: string;
  instructorInitials: string;
  instructorColor: string;
  trending: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateModulePayload {
  title: string;
  category: ModuleCategory;
  description: string;
  instructorId: string;
  /** Provide one of thumbnailUrl OR handle upload separately via uploadThumbnail */
  thumbnailUrl?: string;
  status?: ModuleStatus;
}

export interface UpdateModulePayload {
  title?: string;
  category?: ModuleCategory;
  description?: string;
  instructorId?: string;
  thumbnailUrl?: string;
  status?: ModuleStatus;
  trending?: boolean;
}

export interface ModuleFilters {
  /** 'all' returns everything; otherwise filters by status */
  status?: ModuleStatus | "all";
  /** 'all' returns everything; otherwise filters by category */
  category?: ModuleCategory | "all";
  /** Free-text search against title + instructor name */
  search?: string;
  page?: number;
  pageSize?: number;
  /** 'enrolledCount' | 'completionRate' | 'avgRating' | 'createdAt' */
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Module Stats Types ───────────────────────────────────────────────────────

export interface ModuleOverviewStats {
  totalModules: number;
  totalTopics: number;
  totalEnrolled: number;
  avgCompletion: number;
}

export interface DailyActivityStats {
  lessonsWatchedToday: number;
  lessonsWatchedChange: number; // percentage vs yesterday
  newEnrolmentsToday: number;
  newEnrolmentsChange: number;
  completionsToday: number;
  completionsChange: number;
  avgSessionDurationMinutes: number;
  avgSessionDurationChange: number;
}

// ─── Topic Types ──────────────────────────────────────────────────────────────

export interface Topic {
  id: string;
  moduleId: string;
  title: string;
  classification: string;
  overview: string;
  status: TopicStatus;
  order: number; // 1-indexed sort order within module
  videoType: VideoType | null;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string; // e.g. "4:32"
  durationSeconds: number;
  watchCount: number;
  completionRate: number;
  likes: number;
  comments: number;
  tags: string[];
  subtopicCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Full topic including embedded subtopics — returned on single-topic fetch */
export interface TopicWithSubTopics extends Topic {
  subtopics: SubTopic[];
}

export interface CreateTopicPayload {
  moduleId: string;
  title: string;
  classification: string;
  overview: string;
  status?: TopicStatus;
  order?: number;
  videoType?: VideoType;
  videoUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface UpdateTopicPayload {
  moduleId: string;
  topicId: string;
  title?: string;
  classification?: string;
  overview?: string;
  status?: TopicStatus;
  order?: number;
  videoType?: VideoType | null;
  videoUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface ReorderTopicsPayload {
  moduleId: string;
  /** Array of topic IDs in desired display order */
  orderedIds: string[];
}

// ─── SubTopic Types ───────────────────────────────────────────────────────────

export interface SubTopic {
  id: string;
  topicId: string;
  moduleId: string;
  title: string;
  /** Private instructor notes / script visible only to admin */
  notes: string;
  duration: string;
  durationSeconds: number;
  order: number;
  viewCount: number;
  completedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubTopicPayload {
  moduleId: string;
  topicId: string;
  title: string;
  notes?: string;
  duration?: string;
  order?: number;
}

export interface UpdateSubTopicPayload {
  moduleId: string;
  topicId: string;
  subtopicId: string;
  title?: string;
  /** Update notes/script content */
  notes?: string;
  duration?: string;
  order?: number;
}

export interface ReorderSubTopicsPayload {
  moduleId: string;
  topicId: string;
  orderedIds: string[];
}

// ─── Activity Types ───────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  action: ActivityAction;
  targetTitle: string;
  targetType: TargetType;
  targetId: string;
  moduleId: string;
  createdAt: string;
}

export interface ModuleActivityParams {
  moduleId: string;
  limit?: number;
  before?: string; // ISO timestamp cursor for pagination
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface ProgressDistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopicPerformanceRow {
  topicId: string;
  title: string;
  classification: string;
  order: number;
  watchCount: number;
  completionRate: number;
  likes: number;
  comments: number;
  status: TopicStatus;
  duration: string;
}

export interface ModuleAnalytics {
  moduleId: string;
  enrolledCount: number;
  completionRate: number;
  avgRating: number;
  totalWatchTimeHours: number;
  progressDistribution: ProgressDistributionItem[];
  topicPerformance: TopicPerformanceRow[];
  updatedAt: string;
}

export interface DailyViewEntry {
  day: string; // e.g. "Mon", "Tue"
  date: string; // ISO date
  views: number;
}

export interface SubTopicCompletionRow {
  subtopicId: string;
  title: string;
  order: number;
  viewCount: number;
  completedBy: number;
  dropOffPercentage: number;
}

export interface StateBreakdownItem {
  state: string;
  count: number;
  percentage: number;
}

export interface EngagementMetric {
  label: string;
  value: string;
  trend: string;
  up: boolean;
}

export interface TopicAnalytics {
  topicId: string;
  watchCount: number;
  completionRate: number;
  likes: number;
  comments: number;
  avgWatchDurationSeconds: number;
  likeRate: number; // percentage
  commentRate: number; // percentage
  dailyViews: DailyViewEntry[];
  subtopicCompletion: SubTopicCompletionRow[];
  topStates: StateBreakdownItem[];
  weeklyEngagement: EngagementMetric[];
  updatedAt: string;
}

// ─── Learner Types ────────────────────────────────────────────────────────────

export interface Learner {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  state: string;
  enrolledAt: string;
  progressPercentage: number;
  topicsCompleted: number;
  totalTopics: number;
  lastActiveAt: string;
}

export interface TopLearner {
  id: string;
  name: string;
  initials: string;
  color: string;
  progressPercentage: number;
  topicsCompleted: number;
  certificateEarned: boolean;
}

export interface LearnersParams {
  moduleId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "enrolledAt" | "progress" | "lastActiveAt";
  sortOrder?: "asc" | "desc";
}

// ─── Comment Types ────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  topicId: string;
  moduleId: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  likes: number;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  parentId?: string; // null = top-level; present = reply
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentsParams {
  moduleId: string;
  topicId: string;
  /** undefined = all; true = open only; false = resolved only */
  resolved?: boolean;
}

export interface ResolveCommentPayload {
  moduleId: string;
  topicId: string;
  commentId: string;
  resolved: boolean;
}

export interface DeleteCommentPayload {
  moduleId: string;
  topicId: string;
  commentId: string;
}

// ─── Upload Types ─────────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
  key: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

export interface VideoUploadResponse extends UploadResponse {
  duration: string; // e.g. "4:32"
  durationSeconds: number;
  thumbnailUrl: string; // auto-generated poster frame
}

export interface UploadThumbnailPayload {
  file: File;
  moduleId?: string;
  topicId?: string;
}

export interface UploadVideoPayload {
  file: File;
  moduleId: string;
  topicId: string;
}
