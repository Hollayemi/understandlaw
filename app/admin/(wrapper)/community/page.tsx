"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  MessageSquare, TrendingUp, Star, AlertTriangle, Plus,
  MoreHorizontal, Eye, Trash2, Pin, PinOff, Megaphone,
  CheckCircle, XCircle, BarChart3, Users, ChevronDown,
  ChevronUp, Edit2, Flag, RotateCcw, Filter, Search,
  Scale, Vote, BookOpen, Newspaper, FileText, Loader2,
  Check, X, Save, Info, Clock, Heart, Share2, Bookmark,
  RefreshCw, ShieldAlert, Send, Award, Flame,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useListAdminPostsQuery,
  useApprovePostMutation,
  useRejectPostMutation,
  usePinPostMutation,
  usePromotePostMutation,
  useDemotePostMutation,
  useRemovePostMutation,
  useRestorePostMutation,
  useGetCommunityStatsQuery,
  useBulkModeratePostsMutation,
  type AdminPost,
  type PostStatus,
  type PostType,
} from "@/redux/slices/admin/community.slice";

// Helper functions
function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatNumber(num: number=0): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString();
}

const POST_TYPE_CONFIG: Record<PostType, { label: string; color: string; bg: string }> = {
  discussion: { label: "Discussion", color: "#3B82F6", bg: "#EFF6FF" },
  argument: { label: "Argument", color: "#8B5CF6", bg: "#F5F3FF" },
  poll: { label: "Poll", color: "#10B981", bg: "#ECFDF5" },
  announcement: { label: "Announcement", color: "#F97316", bg: "#FFF0F5" },
  case_study: { label: "Case Study", color: "#F59E0B", bg: "#FFFBEB" },
};

const POST_STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5", border: "#D1FAE5" },
  promoted: { label: "Promoted", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  pending: { label: "Pending", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2", border: "#FEE2E2" },
  removed: { label: "Removed", color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB" },
};

function PostTypeBadge({ type }: { type: PostType }) {
  const cfg = POST_TYPE_CONFIG[type];
  const icons: Record<PostType, React.ElementType> = {
    discussion: MessageSquare,
    argument: Scale,
    poll: BarChart3,
    announcement: Megaphone,
    case_study: BookOpen,
  };
  const Icon = icons[type];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function PostStatusChip({ status }: { status: PostStatus }) {
  const cfg = POST_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {status === "promoted" && <Star size={9} />}
      {status === "active" && <CheckCircle size={9} />}
      {status === "pending" && <Clock size={9} />}
      {status === "removed" && <XCircle size={9} />}
      {status === "rejected" && <XCircle size={9} />}
      {cfg.label}
    </span>
  );
}

// Moderate Modal Component
function ModerateModal({
  post,
  action,
  onClose,
  onSubmit,
  isLoading,
}: {
  post: AdminPost;
  action: "remove" | "reject" | "restore" | "approve" | "promote" | "unpin" | "pin" | "demote";
  onClose: () => void;
  onSubmit: (reason?: string) => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState("");

 const META = {
  remove: { 
    title: "Remove Post", 
    color: "#EF4444", 
    icon: XCircle, 
    btn: "Remove Post", 
    btnCls: "bg-red-500 hover:bg-red-600", 
    requireReason: true,
    confirmMessage: "This post will be removed from public view and flagged as removed."
  },
  reject: { 
    title: "Reject Post", 
    color: "#EF4444", 
    icon: XCircle, 
    btn: "Reject Post", 
    btnCls: "bg-red-500 hover:bg-red-600", 
    requireReason: true,
    confirmMessage: "This post will be rejected and the author will be notified."
  },
  restore: { 
    title: "Restore Post", 
    color: "#3B82F6", 
    icon: RotateCcw, 
    btn: "Restore Post", 
    btnCls: "bg-blue-500 hover:bg-blue-600", 
    requireReason: false,
    confirmMessage: "This post will be restored to public view."
  },
  approve: { 
    title: "Approve Post", 
    color: "#10B981", 
    icon: CheckCircle, 
    btn: "Approve Post", 
    btnCls: "bg-green-500 hover:bg-green-600", 
    requireReason: false,
    confirmMessage: "This post will be published and visible to all users."
  },
  promote: { 
    title: "Promote Post", 
    color: "#F59E0B", 
    icon: Star, 
    btn: "Promote Post", 
    btnCls: "bg-amber-500 hover:bg-amber-600", 
    requireReason: false,
    confirmMessage: "This post will be featured prominently in the community feed for 7 days.",
    extraFields: [
      { name: "duration", label: "Promotion Duration (days)", type: "number", defaultValue: 7, min: 1, max: 30 }
    ]
  },
  demote: { 
    title: "Remove Promotion", 
    color: "#6B7280", 
    icon: Star, 
    btn: "Remove Promotion", 
    btnCls: "bg-gray-500 hover:bg-gray-600", 
    requireReason: false,
    confirmMessage: "Promotion will be removed from this post."
  },
  pin: { 
    title: "Pin Post", 
    color: "#8B5CF6", 
    icon: Pin, 
    btn: "Pin Post", 
    btnCls: "bg-purple-500 hover:bg-purple-600", 
    requireReason: false,
    confirmMessage: "This post will be pinned to the top of the community feed."
  },
  unpin: { 
    title: "Unpin Post", 
    color: "#6B7280", 
    icon: PinOff, 
    btn: "Unpin Post", 
    btnCls: "bg-gray-500 hover:bg-gray-600", 
    requireReason: false,
    confirmMessage: "This post will be unpinned from the top of the feed."
  }
}[action];

  const Icon = META.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full" style={{ background: META.color }} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${META.color}15` }}>
              <Icon size={18} style={{ color: META.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#111827] text-sm">{META.title}</h3>
              <p className="text-[11px] text-[#9CA3AF] truncate">{post.title}</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827]">
              <X size={16} />
            </button>
          </div>

          {META.requireReason && (
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Reason for {action} *
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={`Explain why this post is being ${action}ed...`}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#F97316] placeholder:text-[#D1D5DB] transition-colors"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onSubmit(reason)}
              disabled={isLoading || (META.requireReason && !reason.trim())}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${META.btnCls}`}
            >
              {isLoading ? <><Loader2 size={13} className="animate-spin" /> Processing...</> : META.btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({
  post,
  onAction,
}: {
  post: AdminPost;
  onAction: (action: string, post: AdminPost, reason?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalPollVotes = post.pollOptions?.reduce((s, o) => s + o.votes, 0) ?? 0;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md"
    }`}>
      <div className="h-0.5 w-full" style={{ background: POST_TYPE_CONFIG[post.type || "discussion"]?.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: post.author?.color || "#F97316" }}>
            {post.author?.initials || post.author?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[13px] font-bold text-[#111827]">{post.author?.name}</span>
              {post.author?.isVerified && (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Award size={8} /> Verified
                </span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                post.author?.role === "admin" ? "bg-pink-50 text-[#F97316]"
                : post.author?.role === "lawyer" ? "bg-blue-50 text-[#3B82F6]"
                : "bg-gray-100 text-[#6B7280]"
              }`}>
                {post.author?.role}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PostTypeBadge type={post.type} />
              <PostStatusChip status={post.status} />
              {post.isPinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                  <Pin size={9} /> Pinned
                </span>
              )}
              <span className="text-[11px] text-[#9CA3AF]">{formatRelative(post.createdAt)}</span>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative flex-shrink-0">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 overflow-hidden">
                  {post.status === "pending" && (
                    <button onClick={() => { onAction("approve", post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#10B981] text-left">
                      <CheckCircle size={13} /> Approve Post
                    </button>
                  )}
                  {post.status === "pending" && (
                    <button onClick={() => { onAction("reject", post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#EF4444] text-left">
                      <XCircle size={13} /> Reject Post
                    </button>
                  )}
                  {post.status !== "removed" && post.status !== "rejected" && (
                    post.isPromoted ? (
                      <button onClick={() => { onAction("demote", post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Star size={13} /> Remove Promotion
                      </button>
                    ) : (
                      <button onClick={() => { onAction("promote", post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Star size={13} /> Promote Post
                      </button>
                    )
                  )}
                  {post.status !== "removed" && post.status !== "rejected" && (
                    post.isPinned ? (
                      <button onClick={() => { onAction("unpin", post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <PinOff size={13} /> Unpin Post
                      </button>
                    ) : (
                      <button onClick={() => { onAction("pin", post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Pin size={13} /> Pin to Top
                      </button>
                    )
                  )}
                  {(post.status === "removed" || post.status === "rejected") && (
                    <button onClick={() => { onAction("restore", post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#3B82F6] text-left">
                      <RotateCcw size={13} /> Restore Post
                    </button>
                  )}
                  {post.status !== "removed" && post.status !== "rejected" && (
                    <button onClick={() => { onAction("remove", post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#EF4444] text-left">
                      <Trash2 size={13} /> Remove Post
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-[15px] font-bold text-[#111827] mb-2 leading-snug">{post.title}</h3>

        {post.status !== "removed" && post.status !== "rejected" ? (
          <p className="text-[13px] text-[#6B7280] leading-relaxed line-clamp-2 mb-3">{post.content}</p>
        ) : (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl mb-3">
            <p className="text-[11px] font-bold text-[#991B1B] mb-1">
              {post.status === "removed" ? "Post Removed" : "Post Rejected"}
            </p>
            <p className="text-[11px] text-[#9CA3AF]">{post.rejectionReason || post.adminNote || "No reason provided"}</p>
            <p className="text-[10px] text-[#D1D5DB] mt-1">
              {post.status === "removed" ? "Removed" : "Rejected"} by {post.rejectedBy || post.removedBy || "Admin"}
            </p>
          </div>
        )}

        {/* Poll preview */}
        {post.type === "poll" && post.pollOptions && totalPollVotes > 0 && (
          <div className="space-y-1.5 mb-3">
            {post.pollOptions.map(opt => {
              const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
              return (
                <div key={opt.id} className="bg-[#F9FAFB] rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280] font-medium">{opt.text}</span>
                    <span className="text-[#111827] font-bold">{pct}%</span>
                  </div>
                  <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-1 rounded-full bg-[#8B5CF6]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-[#9CA3AF] mt-1">{totalPollVotes.toLocaleString()} total votes</p>
          </div>
        )}

        {/* Admin note */}
        {post.adminNote && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-3">
            <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700">{post.adminNote}</p>
          </div>
        )}

        {/* Reports */}
        {post.reportCount > 0 && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-xl mb-3">
            <ShieldAlert size={12} className="text-[#EF4444] flex-shrink-0" />
            <p className="text-[11px] text-[#EF4444] font-semibold">
              {post.reportCount} report{post.reportCount > 1 ? "s" : ""} filed
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-[11px] text-[#EF4444] font-semibold hover:underline">
              Review →
            </button>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 5).map(t => (
              <span key={t} className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">#{t}</span>
            ))}
            {post.tags.length > 5 && (
              <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">+{post.tags.length - 5}</span>
            )}
          </div>
        )}

        {/* Engagement stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
            <span className="flex items-center gap-1"><Heart size={11} /> {formatNumber(post.likes)}</span>
            <span className="flex items-center gap-1"><MessageSquare size={11} /> {formatNumber(post.commentCount)}</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {formatNumber(post.viewCount)}</span>
            <span className="flex items-center gap-1"><Share2 size={11} /> {formatNumber(post.shares)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] bg-[#F9FAFB] px-2 py-0.5 rounded-md capitalize">{post.room}</span>
            {post.commentCount > 0 && (
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] px-2.5 py-1 rounded-lg hover:border-[#9CA3AF] transition-all">
                <Eye size={11} />
                {expanded ? "Hide" : `${formatNumber(post.commentCount)} Comments`}
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded: Comments + Reports */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-4">
            {/* Reports */}
            {post.reports.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Reports</p>
                <div className="space-y-2">
                  {post.reports.map(r => (
                    <div key={r._id} className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <ShieldAlert size={13} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[#EF4444]">{r.reporterName}</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">{r.reason}</p>
                        {r.description && <p className="text-[10px] text-[#9CA3AF] mt-0.5">{r.description}</p>}
                        <p className="text-[10px] text-[#D1D5DB] mt-0.5">{formatRelative(r.createdAt)}</p>
                      </div>
                      {!r.resolved && (
                        <span className="text-[10px] font-bold bg-red-100 text-[#EF4444] px-2 py-0.5 rounded-full flex-shrink-0">Open</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Preview */}
            {post.comments.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Recent Comments</p>
                <div className="space-y-2">
                  {post.comments.slice(0, 3).map(comment => (
                    <div key={comment._id} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      comment.isRemoved ? "bg-[#FEF2F2] border-[#FCA5A5]" : "bg-[#F9FAFB] border-[#F3F4F6]"
                    }`}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: comment.author?.color || "#9CA3AF" }}>
                        {comment.author?.initials || comment.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[12px] font-semibold text-[#111827]">{comment.author?.name}</span>
                          {comment.isAcceptedAnswer && (
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                              <CheckCircle size={8} /> Accepted
                            </span>
                          )}
                          {comment.isRemoved && (
                            <span className="text-[10px] bg-red-50 text-[#EF4444] border border-red-200 px-1.5 py-0.5 rounded-full font-bold">Removed</span>
                          )}
                          <span className="text-[10px] text-[#9CA3AF]">{formatRelative(comment.createdAt)}</span>
                        </div>
                        {comment.isRemoved ? (
                          <p className="text-[11px] text-[#9CA3AF] italic">[Comment removed: {comment.removalReason}]</p>
                        ) : (
                          <p className="text-[12px] text-[#374151] leading-relaxed line-clamp-2">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {post.comments.length > 3 && (
                    <p className="text-[11px] text-[#F97316] text-center font-semibold">+{post.comments.length - 3} more comments</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar for pending posts */}
      {post.status === "pending" && (
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={() => onAction("approve", post)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
            <Check size={12} /> Approve
          </button>
          <button onClick={() => onAction("reject", post)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
            <X size={12} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function AdminCommunityPage() {
  const router = useRouter();
  
  // Filters state
  const [tab, setTab] = useState<PostStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<PostType | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // UI state
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [moderateTarget, setModerateTarget] = useState<{ post: AdminPost; action: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // RTK Query hooks
  const { data: postsData, isLoading, refetch } = useListAdminPostsQuery({
    status: tab,
    type: typeFilter,
    search: search || undefined,
    page,
    limit: 20,
  });

  const { data: statsData } = useGetCommunityStatsQuery();

  // Mutation hooks
  const [approvePost, { isLoading: approving }] = useApprovePostMutation();
  const [rejectPost, { isLoading: rejecting }] = useRejectPostMutation();
  const [pinPost, { isLoading: pinning }] = usePinPostMutation();
  const [promotePost, { isLoading: promoting }] = usePromotePostMutation();
  const [demotePost, { isLoading: demoting }] = useDemotePostMutation();
  const [removePost, { isLoading: removing }] = useRemovePostMutation();
  const [restorePost, { isLoading: restoring }] = useRestorePostMutation();
  const [bulkModerate, { isLoading: bulkModerating }] = useBulkModeratePostsMutation();

  console.log(postsData?.data)

  const {data:posts = [], ...pagination} = postsData?.data || {};

  const stats = statsData?.data;

  const showFeedback = (msg: string, isError = false) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAction = useCallback(async (action: string, post: AdminPost, reason?: string) => {
    try {
      let result;
      switch (action) {
        case "approve":
          result = await approvePost(post._id).unwrap();
          showFeedback(`Post "${post.title}" approved ✓`);
          break;
        case "reject":
          if (!reason) return;
          result = await rejectPost({ postId: post._id, reason }).unwrap();
          showFeedback(`Post "${post.title}" rejected`);
          break;
        case "pin":
          result = await pinPost({ postId: post._id, pinned: true }).unwrap();
          showFeedback(`Post "${post.title}" pinned ✓`);
          break;
        case "unpin":
          result = await pinPost({ postId: post._id, pinned: false }).unwrap();
          showFeedback(`Post "${post.title}" unpinned`);
          break;
        case "promote":
          result = await promotePost({ postId: post._id, duration: 7 }).unwrap();
          showFeedback(`Post "${post.title}" promoted for 7 days ✓`);
          break;
        case "demote":
          result = await demotePost(post._id).unwrap();
          showFeedback(`Promotion removed from "${post.title}"`);
          break;
        case "remove":
          if (!reason) return;
          result = await removePost({ postId: post._id, reason }).unwrap();
          showFeedback(`Post "${post.title}" removed`);
          break;
        case "restore":
          result = await restorePost(post._id).unwrap();
          showFeedback(`Post "${post.title}" restored ✓`);
          break;
      }
      setModerateTarget(null);
      refetch();
    } catch (error: any) {
      showFeedback(error?.data?.message || `Failed to ${action} post`, true);
    }
  }, [approvePost, rejectPost, pinPost, promotePost, demotePost, removePost, restorePost, refetch]);

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) return;
    
    try {
      let result;
      switch (action) {
        case "pin":
          result = await bulkModerate({ postIds: selectedPosts, action: "pin", data: { pinned: true } }).unwrap();
          showFeedback(`${selectedPosts.length} posts pinned ✓`);
          break;
        case "unpin":
          result = await bulkModerate({ postIds: selectedPosts, action: "unpin" }).unwrap();
          showFeedback(`${selectedPosts.length} posts unpinned`);
          break;
        case "promote":
          result = await bulkModerate({ postIds: selectedPosts, action: "promote" }).unwrap();
          showFeedback(`${selectedPosts.length} posts promoted ✓`);
          break;
        case "demote":
          result = await bulkModerate({ postIds: selectedPosts, action: "demote" }).unwrap();
          showFeedback(`${selectedPosts.length} posts demoted`);
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
            result = await bulkModerate({ postIds: selectedPosts, action: "delete" }).unwrap();
            showFeedback(`${selectedPosts.length} posts deleted`);
          }
          break;
      }
      setSelectedPosts([]);
      setShowBulkSelect(false);
      refetch();
    } catch (error: any) {
      showFeedback(error?.data?.message || `Failed to perform bulk ${action}`, true);
    }
  };

  const toggleSelectPost = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const selectAllPosts = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(p => p._id));
    }
  };

  const statsItems = [
    { label: "Total Posts", value: stats?.overview.totalPosts || 0, icon: MessageSquare, color: "#F97316", bg: "#FFF0F5" },
    { label: "Promoted", value: stats?.overview.promotedPosts || 0, icon: Star, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Pending Review", value: stats?.overview.pendingPosts || 0, icon: Clock, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Reported", value: stats?.overview.reportedPosts || 0, icon: Flag, color: "#EF4444", bg: "#FEF2F2" },
  ];

  const typeOptions: { value: PostType | "all"; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "discussion", label: "Discussions" },
    { value: "argument", label: "Arguments" },
    { value: "poll", label: "Polls" },
    { value: "announcement", label: "Announcements" },
    { value: "case_study", label: "Case Studies" },
  ];

  const isLoadingAction = approving || rejecting || pinning || promoting || demoting || removing || restoring || bulkModerating;

  console.log({moderateTarget})

  return (
    <>
      {moderateTarget && (
        <ModerateModal
          post={moderateTarget.post}
          action={moderateTarget.action as any}
          onClose={() => setModerateTarget(null)}
          onSubmit={(reason) => handleAction(moderateTarget.action, moderateTarget.post, reason)}
          isLoading={isLoadingAction}
        />
      )}

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-[13px] font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-up">
          {feedback.includes("✓") ? <Check size={14} className="text-[#10B981]" /> : <AlertTriangle size={14} className="text-[#F59E0B]" />}
          {feedback}
        </div>
      )}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Community Moderation</h1>
            <p className="text-[13px] text-[#6B7280] mt-1">Manage posts, moderate discussions, and maintain community standards</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsItems.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-[#F3F4F6] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <span className="text-2xl font-bold text-[#111827]">{stat.value.toLocaleString()}</span>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-2">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Bulk Actions Bar */}
        {showBulkSelect && selectedPosts.length > 0 && (
          <div className="bg-[#F3F4F6] rounded-xl p-3 mb-4 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#111827]">{selectedPosts.length} posts selected</span>
            <div className="flex gap-2">
              <button onClick={() => handleBulkAction("pin")} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]">Pin All</button>
              <button onClick={() => handleBulkAction("unpin")} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]">Unpin All</button>
              <button onClick={() => handleBulkAction("promote")} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]">Promote All</button>
              <button onClick={() => handleBulkAction("demote")} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]">Demote All</button>
              <button onClick={() => handleBulkAction("delete")} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">Delete All</button>
              <button onClick={() => { setSelectedPosts([]); setShowBulkSelect(false); }} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#6B7280] hover:bg-white">Cancel</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts, authors, tags..."
              className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#F97316] placeholder:text-[#D1D5DB] transition-colors"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
            {(["all", "active", "promoted", "pending", "rejected", "removed"] as const).map(s => {
              const count = s === "all" ? stats?.overview.totalPosts || 0 : 
                s === "pending" ? stats?.overview.pendingPosts || 0 :
                s === "promoted" ? stats?.overview.promotedPosts || 0 : 0;
              return (
                <button key={s} onClick={() => { setTab(s); setPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                    tab === s ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
                  }`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    tab === s ? "bg-[#F97316] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value as PostType | "all"); setPage(1); }}
            className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#F97316] transition-colors"
          >
            {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Bulk select toggle */}
          {/* <button
            onClick={() => setShowBulkSelect(!showBulkSelect)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              showBulkSelect ? "bg-[#F97316] text-white" : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
            }`}
          >
            <CheckSquare size={12} />
            Bulk Select
          </button> */}
        </div>

        {/* Post list */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <Loader2 size={36} className="text-[#F97316] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF]">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <MessageSquare size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No posts found</p>
            <p className="text-[12px] text-[#D1D5DB]">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {showBulkSelect && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-xl">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onChange={selectAllPosts}
                  className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
                />
                <span className="text-[12px] text-[#6B7280]">Select All ({posts.length})</span>
              </div>
            )}
            {posts.map(post => (
              <div key={post._id} className="relative">
                {showBulkSelect && (
                  <div className="absolute left-3 top-5 z-10">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => toggleSelectPost(post._id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
                    />
                  </div>
                )}
                <div className={showBulkSelect ? "pl-8" : ""}>
                  <PostCard post={post} onAction={(action, post) => setModerateTarget({ post, action })} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {/* {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-[12px] text-[#9CA3AF]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#F97316] text-white">
                {pagination.page}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}

// Missing CheckSquare icon import
function CheckSquare(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
  );
}