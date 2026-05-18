// types/community.types.ts

export type CommunityRoomType = 'general' | 'legal-advice' | 'case-study' | 'law-students' | 'lawyers-lounge' | 'ask-lawyer';
export type ReferenceType = 'module' | 'topic' | 'subtopic';

export type PostType = "discussion" | "argument" | "poll" | "announcement" | "case_study";
export type PostStatus = "active" | "promoted" | "pending" | "removed";
export type UserRole = "citizen" | "lawyer" | "admin";
export type ReactionType = "like" | "insightful" | "helpful";

export interface CommunityUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  color: string;
  role: 'citizen' | 'lawyer' | 'admin' | 'moderator';
  isVerified?: boolean;
  badge?: string;
  lawFirm?: string;
  yearsOfExperience?: number;
}

export interface CommunityReference {
  type: ReferenceType;
  id: string;
  title: string;
  slug?: string;
  moduleTitle?: string;
  topicTitle?: string;
  excerpt?: string;
  thumbnail?: string;
}

export interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  author: CommunityUser;
  room: CommunityRoomType;
  reference?: CommunityReference;
  tags: string[];
  images: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: CommunityUser;
  images: string[];
  likes: number;
  likedBy: string[];
  replies: Comment[];
  parentId?: string;
  isLawyerAnswer?: boolean;
  isAcceptedAnswer?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityRoom {
  id: CommunityRoomType;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  postCount: number;
  memberCount: number;
  isPrivate?: boolean;
  allowedRoles?: ('citizen' | 'lawyer' | 'admin')[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  room: CommunityRoomType;
  reference?: {
    type: ReferenceType;
    id: string;
    title: string;
  };
  tags: string[];
  images?: File[];
}

export interface ReferenceProp {
  type: ReferenceType;
  id: string;
  title: string;
  moduleId?: string;
  moduleTitle?: string;
  topicId?: string;
  topicTitle?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  room: string;
  tags: string[];
  reference?: ReferenceProp;
  images: string[];
}

export interface CreateCommentInput {
  content: string;
  images?: File[];
  parentId?: string;
}

export interface ListPostsParams {
  type?: PostType | "all";
  status?: PostStatus | "all";
  category?: string;
  search?: string;
  sortBy?: "latest" | "popular" | "trending" | "most_commented";
  page?: number;
  limit?: number;
}

export interface AddCommentPayload {
  postId: string;
  content: string;
}

export interface AddReplyPayload {
  postId: string;
  commentId: string;
  content: string;
}

export interface ModerateCommentPayload {
  postId: string;
  commentId: string;
  reason: string;
}

export interface ModeratePostPayload {
  postId: string;
  reason: string;
}

export interface ReportPostPayload {
  postId: string;
  reason: string;
}

export interface ReportCommentPayload {
  postId: string;
  commentId: string;
  reason: string;
}

export interface VotePollPayload {
  postId: string;
  optionId: string;
}

export interface ToggleLikePayload {
  postId: string;
}

export interface ToggleCommentLikePayload {
  postId: string;
  commentId: string;
}

export interface ToggleBookmarkPayload {
  postId: string;
}
