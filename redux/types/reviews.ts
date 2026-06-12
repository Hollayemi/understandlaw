export type ReviewSortBy = "newest" | "oldest" | "highest" | "lowest" | "most_helpful";

export interface ReviewAuthor {
  userId: string;
  name: string;
  initials: string;
  color: string;
  state: string;
}

export interface ReviewLawyer {
  lawyerId: string;
  fullName: string;
  initials: string;
  colorA: string;
  nbaNumber: string;
  specialisms: string[];
}

export interface Review {
  _id: string;
  consultationId: string;
  author: ReviewAuthor;
  lawyer: ReviewLawyer;
  rating: number;
  comment: string;
  tags: string[];
  mode: "message" | "call" | "video";
  isVisible: boolean;
  isFlagged: boolean;
  flagReason?: string;
  flaggedAt?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  helpfulVotes: number;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
  flaggedCount: number;
  hiddenCount: number;
  reviewsThisMonth: number;
  reviewsLastMonth: number;
}

export interface LawyerReviewSummary {
  lawyerId: string;
  fullName: string;
  initials: string;
  colorA: string;
  nbaNumber: string;
  specialisms: string[];
  averageRating: number;
  reviewCount: number;
  ratingDistribution: { rating: number; count: number }[];
  flaggedReviews: number;
  recentReviews: Review[];
  trend: "up" | "down" | "stable";
  trendDelta: number;
}

export interface ListReviewsParams {
  lawyerId?: string;
  rating?: number;
  isFlagged?: boolean;
  isVisible?: boolean;
  mode?: "message" | "call" | "video";
  search?: string;
  sortBy?: ReviewSortBy;
  page?: number;
  pageSize?: number;
}

export interface ListLawyerReviewSummariesParams {
  search?: string;
  sortBy?: "rating_asc" | "rating_desc" | "reviews_desc" | "flagged_desc";
  minRating?: number;
  maxRating?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedLawyerSummaries {
  data: LawyerReviewSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
