"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, MessageCircle, Eye, Pin, Lock, CheckCircle,
  Share2, Flag, MoreVertical, ChevronLeft, Send,
  Image as ImageIcon, X, ThumbsUp, Award, Star,
  Bookmark, AlertTriangle, Users, Clock, ChevronRight
} from "lucide-react";
import {
  useGetCommunityPostQuery,
  useCreateCommunityCommentMutation,
  useToggleLikePostMutation,
  useToggleLikeCommentMutation,
  useAcceptAnswerMutation,
  useResolvePostMutation,
  usePinPostMutation,
  useLockPostMutation,
} from "@/redux/slices/community.slice";
import { getInitial } from "@/utils/function";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.postId as string;

  const [commentText, setCommentText] = useState("");
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useGetCommunityPostQuery(postId);
  const [createComment] = useCreateCommunityCommentMutation();
  const [toggleLikePost] = useToggleLikePostMutation();
  const [toggleLikeComment] = useToggleLikeCommentMutation();
  const [acceptAnswer] = useAcceptAnswerMutation();
  const [resolvePost] = useResolvePostMutation();
  const [pinPost] = usePinPostMutation();
  const [lockPost] = useLockPostMutation();

  const post = data?.data;
  console.log({ post })

  const handleLikePost = async () => {
    try {
      await toggleLikePost(postId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await toggleLikeComment({ postId, commentId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleAcceptAnswer = async (commentId: string) => {
    try {
      await acceptAnswer({ postId, commentId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to accept answer:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() && commentImages.length === 0) return;

    const payload = {
      content: commentText,
      ...(replyingTo && { parentId: replyingTo }),
      images: commentImages,
    };

    try {
      await createComment({ postId, data: payload }).unwrap();
      setCommentText("");
      setCommentImages([]);
      setReplyingTo(null);
      refetch();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (commentImages.length + files.length <= 3) {
      setCommentImages([...commentImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setCommentImages(commentImages.filter((_, i) => i !== index));
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-[#E8317A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Post not found</p>
        <Link href="/dashboard/community" className="text-[#E8317A] font-semibold">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 md:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 size={16} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Flag size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Post Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {(post.isPinned || post.isLocked || post.isResolved) && (
              <>
                {post.isPinned && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
                    <Pin size={12} /> Pinned
                  </span>
                )}
                {post.isLocked && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    <Lock size={12} /> Locked
                  </span>
                )}
                {post.isResolved && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                    <CheckCircle size={12} /> Resolved
                  </span>
                )}
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Author Info */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              // style={{ background: `linear-gradient(135deg, ${post.author.color}, ${post.author.color}80)` }}
              >
                {post.author.name}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{post.author.name}</span>
                  {post.author.role === 'lawyer' && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award size={10} /> Verified Lawyer
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span>Posted {getTimeAgo(post.createdAt)}</span>
                  <span>•</span>
                  <span>{post.viewCount} views</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-1 text-sm ${post.likedBy?.includes(post.author._id)
                    ? "text-[#E8317A]"
                    : "text-gray-500 hover:text-[#E8317A]"
                  }`}
              >
                <Heart size={16} className={post.likedBy?.includes(post.author._id) ? "fill-[#E8317A]" : ""} />
                {post.likes}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post image ${idx + 1}`}
                  className="max-w-full rounded-lg border border-gray-200 max-h-64 object-cover"
                />
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Comments ({post.comments.length})
            </h2>
          </div>

          {/* Add Comment */}
          {!post.isLocked && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={replyingTo ? "Write your reply..." : "Write a comment..."}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8317A] resize-none"
                  />

                  {/* Image Previews */}
                  {commentImages.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {commentImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                    >
                      <ImageIcon size={14} /> Add image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() && commentImages.length === 0}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
                isLawyer={comment.author.role === 'lawyer'}
                isAccepted={comment.isAcceptedAnswer}
                isPostResolved={post.isResolved}
                onLike={() => handleLikeComment(comment._id)}
                onAccept={() => handleAcceptAnswer(comment._id)}
                onReply={() => setReplyingTo(comment._id)}
                onRefresh={refetch}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Comment Item Component
const CommentItem = ({
  comment,
  postId,
  isLawyer,
  isAccepted,
  isPostResolved,
  onLike,
  onAccept,
  onReply,
  onRefresh
}: any) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImages, setReplyImages] = useState<File[]>([]);

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${comment.author.color}, ${comment.author.color}80)` }}
        >
          {getInitial(comment.author.name)}
        </div>

        <div className="flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm text-gray-900">{comment.author.name}</span>
            {comment.author.role === 'lawyer' && (
              <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Award size={8} /> Lawyer
              </span>
            )}
            {isAccepted && (
              <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle size={8} /> Accepted Answer
              </span>
            )}
            <span className="text-[10px] text-gray-400">{getTimeAgo(comment.createdAt)}</span>
          </div>

          {/* Comment Content */}
          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

          {/* Images */}
          {comment.images && comment.images.length > 0 && (
            <div className="flex gap-2 mb-2">
              {comment.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt="Comment" className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <button onClick={onLike} className="flex items-center gap-1 hover:text-[#E8317A]">
              <Heart size={12} /> {comment.likes}
            </button>
            <button onClick={() => setShowReply(!showReply)} className="hover:text-[#E8317A]">
              Reply
            </button>
            {isLawyer && !isPostResolved && (
              <button onClick={onAccept} className="hover:text-green-600 flex items-center gap-1">
                <CheckCircle size={12} /> Mark as Answer
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReply && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8317A]"
              />
              <button className="px-3 py-2 bg-[#E8317A] text-white rounded-lg">
                <Send size={14} />
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  isLawyer={reply.author.role === 'lawyer'}
                  isAccepted={false}
                  isPostResolved={isPostResolved}
                  onLike={() => { }}
                  onAccept={() => { }}
                  onReply={() => { }}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};