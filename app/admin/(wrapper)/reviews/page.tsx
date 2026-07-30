"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star, StarHalf, MessageSquare, Phone, Video, Flag, Eye, EyeOff,
  CheckCircle, XCircle, AlertTriangle, ThumbsUp, Trash2, Shield,
  Search, Filter, ChevronDown, ChevronUp, Clock, User, Briefcase,
  TrendingUp, TrendingDown, Minus, RefreshCw, Download, ExternalLink,
  Users, Award, Calendar, BarChart3, PieChart, ArrowUpRight,
} from "lucide-react";
import {
  useGetReviewStatsQuery,
  useListReviewsQuery,
  useListLawyerReviewSummariesQuery,
  useFlagReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/slices/admin/dashboard.admin.slice";
import type {
  Review,
  ReviewStats,
  LawyerReviewSummary,
  ListReviewsParams,
  ListLawyerReviewSummariesParams,
  ReviewSortBy,
} from "@/redux/types/reviews";

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && <StarHalf size={size} className="fill-amber-400 text-amber-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
}

function ModeIcon({ mode, size = 14 }: { mode: string; size?: number }) {
  switch (mode) {
    case "message":
      return <MessageSquare size={size} className="text-emerald-500" />;
    case "call":
      return <Phone size={size} className="text-blue-500" />;
    case "video":
      return <Video size={size} className="text-purple-500" />;
    default:
      return <MessageSquare size={size} />;
  }
}

function TrendIcon({ trend, size = 14 }: { trend: "up" | "down" | "stable"; size?: number }) {
  if (trend === "up") return <TrendingUp size={size} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={size} className="text-red-500" />;
  return <Minus size={size} className="text-gray-400" />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: ReviewStats }) {
  const growth = ((stats.reviewsThisMonth - stats.reviewsLastMonth) / (stats.reviewsLastMonth || 1)) * 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <MessageSquare size={18} className="text-pink-500" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReviews)}</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-gray-400">
            {stats.reviewsThisMonth} this month ({growth > 0 ? "+" : ""}{growth.toFixed(1)}% vs last month)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Star size={18} className="fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <RatingStars rating={stats.averageRating} size={12} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Flag size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Flagged</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.flaggedCount)}</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-gray-400">
            {((stats.flaggedCount / stats.totalReviews) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <EyeOff size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Hidden</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.hiddenCount)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <ThumbsUp size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Avg. Helpfulness</p>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingDistribution({ distribution }: { distribution: ReviewStats["ratingDistribution"] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Rating Distribution</h3>
      <div className="space-y-3">
        {distribution.map((item) => (
          <div key={item.rating}>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{item.rating} ★</span>
                <span className="text-gray-400">{item.count} reviews</span>
              </div>
              <span className="font-semibold text-gray-900">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review, onModerate, onFlag, onDelete }: {
  review: Review;
  onModerate: (id: string, visible: boolean) => void;
  onFlag: (id: string, flag: boolean, reason?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  return (
    <div className={`bg-white rounded-xl border p-4 transition-all ${!review.isVisible ? "border-gray-200 bg-gray-50/30" : review.isFlagged ? "border-red-200" : "border-gray-100"}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${review.author.color}, ${review.author.color}80)` }}
          >
            {review.author.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{review.author.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                {review.author.state}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars rating={review.rating} size={12} />
              <span className="text-[9px] text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50">
            <ModeIcon mode={review.mode} size={12} />
            <span className="text-[10px] text-gray-500 capitalize">{review.mode}</span>
          </div>
          
          {review.isFlagged && (
            <div className="px-2 py-1 rounded-lg bg-red-50 flex items-center gap-1">
              <Flag size={12} className="text-red-500" />
              <span className="text-[10px] text-red-600 font-medium">Flagged</span>
            </div>
          )}
          
          {!review.isVisible && (
            <div className="px-2 py-1 rounded-lg bg-gray-100 flex items-center gap-1">
              <EyeOff size={12} className="text-gray-500" />
              <span className="text-[10px] text-gray-600">Hidden</span>
            </div>
          )}

          <button
            onClick={() => onDelete(review._id)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Lawyer Info */}
      <div className="mb-3 p-2.5 rounded-lg bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-semibold"
            style={{ background: `linear-gradient(135deg, ${review.lawyer.colorA}, ${review.lawyer.colorA}80)` }}
          >
            {review.lawyer.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-900">{review.lawyer.fullName}</p>
              <span className="text-[9px] text-gray-400">{review.lawyer.scnNumber}</span>
            </div>
            <div className="flex gap-1 mt-0.5">
              {review.lawyer.specialisms.slice(0, 2).map(s => (
                <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <ExternalLink size={12} className="text-gray-300" />
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <ThumbsUp size={10} /> {review.helpfulVotes} helpful
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {timeAgo(review.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {review.isFlagged && review.flagReason && (
            <span className="text-[9px] text-red-500 truncate max-w-[150px]">
              Reason: {review.flagReason}
            </span>
          )}
          
          <button
            onClick={() => onModerate(review._id, !review.isVisible)}
            className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
              review.isVisible
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {review.isVisible ? "Hide" : "Show"}
          </button>

          <button
            onClick={() => setShowFlagModal(true)}
            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-red-50 text-red-600 hover:bg-red-100"
          >
            {review.isFlagged ? "Update Flag" : "Flag"}
          </button>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFlagModal(false)}>
          <div className="bg-white rounded-xl p-5 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-3">Flag Review</h3>
            <textarea
              placeholder="Reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onFlag(review._id, true, flagReason);
                  setShowFlagModal(false);
                  setFlagReason("");
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
              >
                Flag
              </button>
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LawyerSummaryCard({ lawyer, onView }: {
  lawyer: LawyerReviewSummary;
  onView: (lawyerId: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => onView(lawyer.lawyerId)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorA}80)` }}
          >
            {lawyer.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{lawyer.fullName}</p>
            <p className="text-[10px] text-gray-400">{lawyer.scnNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={lawyer.trend} size={14} />
          <span className={`text-[10px] font-semibold ${lawyer.trend === "up" ? "text-emerald-600" : lawyer.trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {lawyer.trendDelta > 0 ? "+" : ""}{lawyer.trendDelta}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 pt-3 border-t border-gray-50">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Rating</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{lawyer.averageRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Reviews</p>
          <p className="font-bold text-gray-900">{formatNumber(lawyer.reviewCount)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Flagged</p>
          <p className={`font-bold ${lawyer.flaggedReviews > 0 ? "text-red-500" : "text-gray-900"}`}>
            {lawyer.flaggedReviews}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {lawyer.specialisms.slice(0, 3).map(s => (
          <div key={s} className="text-[9px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded inline-block mr-1">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [view, setView] = useState<"reviews" | "lawyers">("reviews");
  const [selectedLawyer, setSelectedLawyer] = useState<string | null>(null);
  
  // Filters for reviews list
  const [filters, setFilters] = useState<ListReviewsParams>({
    page: 1,
    pageSize: 20,
    sortBy: "newest",
  });
  
  // Filters for lawyer summaries
  const [lawyerFilters, setLawyerFilters] = useState<ListLawyerReviewSummariesParams>({
    page: 1,
    pageSize: 12,
    sortBy: "reviews_desc",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Queries
  const { data: statsData, isLoading: statsLoading } = useGetReviewStatsQuery();
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useListReviewsQuery(filters);
  const { data: lawyersData, isLoading: lawyersLoading, refetch: refetchLawyers } = useListLawyerReviewSummariesQuery(lawyerFilters);
  
  // Mutations
//   const [moderateReview] = useModerateReviewMutation();
  const [flagReview] = useFlagReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  
  const stats = statsData?.data;
  const reviews = reviewsData?.data;
  const lawyers = lawyersData?.data;
  
  const handleModerate = async (id: string, visible: boolean) => {
    // await moderateReview({ id, isVisible: visible });
    refetchReviews();
  };
  
  const handleFlag = async (id: string, flagged: boolean, reason?: string) => {
    await flagReview({ reviewId: id, isFlagged: flagged, reason });
    refetchReviews();
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      refetchReviews();
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and moderate client feedback</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          <Download size={14} /> Export
        </button>
      </div>
      
      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}
      
      {/* Rating Distribution (only in reviews view) */}
      {view === "reviews" && stats && (
        <div className="mb-6">
          <RatingDistribution distribution={stats.ratingDistribution} />
        </div>
      )}
      
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("reviews")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              view === "reviews" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={14} /> All Reviews
            </span>
          </button>
          <button
            onClick={() => setView("lawyers")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              view === "lawyers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users size={14} /> Lawyer Summaries
            </span>
          </button>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Filter size={14} /> Filters
          <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && view === "reviews" && (
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ReviewSortBy, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
            
            <select
              value={filters.rating || ""}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={filters.mode || ""}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value as any, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="">All Modes</option>
              <option value="message">Message</option>
              <option value="call">Call</option>
              <option value="video">Video</option>
            </select>
            
            <select
              value={filters.isFlagged === undefined ? "" : filters.isFlagged ? "flagged" : "not-flagged"}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({
                  ...filters,
                  isFlagged: val === "" ? undefined : val === "flagged",
                  page: 1,
                });
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="">All Reviews</option>
              <option value="flagged">Flagged Only</option>
              <option value="not-flagged">Not Flagged</option>
            </select>
          </div>
          
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search by comment or author..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            />
            <button
              onClick={() => setFilters({ page: 1, pageSize: 20, sortBy: "newest" })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Lawyers Filters */}
      {showFilters && view === "lawyers" && (
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={lawyerFilters.sortBy}
              onChange={(e) => setLawyerFilters({ ...lawyerFilters, sortBy: e.target.value as any, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="reviews_desc">Most Reviews</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="rating_asc">Lowest Rated</option>
              <option value="flagged_desc">Most Flagged</option>
            </select>
            
            <input
              type="number"
              placeholder="Min Rating"
              value={lawyerFilters.minRating || ""}
              onChange={(e) => setLawyerFilters({ ...lawyerFilters, minRating: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              step="0.5"
              min="0"
              max="5"
            />
            
            <input
              type="number"
              placeholder="Max Rating"
              value={lawyerFilters.maxRating || ""}
              onChange={(e) => setLawyerFilters({ ...lawyerFilters, maxRating: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              step="0.5"
              min="0"
              max="5"
            />
            
            <input
              type="text"
              placeholder="Search lawyers..."
              value={lawyerFilters.search || ""}
              onChange={(e) => setLawyerFilters({ ...lawyerFilters, search: e.target.value, page: 1 })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            />
          </div>
        </div>
      )}
      
      {/* Content */}
      {view === "reviews" ? (
        <>
          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading && (
              <div className="text-center py-12">
                <div className="animate-pulse">Loading reviews...</div>
              </div>
            )}
            
            {reviews?.data.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onModerate={handleModerate}
                onFlag={handleFlag}
                onDelete={handleDelete}
              />
            ))}
            
            {reviews?.data.length === 0 && !reviewsLoading && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews found</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {reviews && reviews.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(reviews.page - 1) * reviews.pageSize + 1} to {Math.min(reviews.page * reviews.pageSize, reviews.total)} of {reviews.total} reviews
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
                  disabled={filters.page === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
                  disabled={filters.page === reviews.totalPages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Lawyer Summaries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lawyersLoading && (
              <div className="col-span-full text-center py-12">Loading lawyers...</div>
            )}
            
            {lawyers?.data.map((lawyer) => (
              <LawyerSummaryCard
                key={lawyer.lawyerId}
                lawyer={lawyer}
                onView={(id) => {
                  setSelectedLawyer(id);
                  setView("reviews");
                  setFilters({ ...filters, lawyerId: id, page: 1 });
                }}
              />
            ))}
            
            {lawyers?.data.length === 0 && !lawyersLoading && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                <Users size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No lawyer summaries found</p>
              </div>
            )}
          </div>
          
          {/* Pagination for lawyers */}
          {lawyers && lawyers.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(lawyers.page - 1) * lawyers.pageSize + 1} to {Math.min(lawyers.page * lawyers.pageSize, lawyers.total)} of {lawyers.total} lawyers
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLawyerFilters({ ...lawyerFilters, page: lawyerFilters.page! - 1 })}
                  disabled={lawyerFilters.page === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setLawyerFilters({ ...lawyerFilters, page: lawyerFilters.page! + 1 })}
                  disabled={lawyerFilters.page === lawyers.totalPages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}