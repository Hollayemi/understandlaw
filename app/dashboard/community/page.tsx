"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MessageCircle, Heart, Eye, Pin, Lock, CheckCircle, 
  Users, TrendingUp, Award, Clock, ChevronRight, 
  Search, Filter, Plus, ThumbsUp, ThumbsDown,
  AlertCircle, BookOpen, Briefcase, Scale, UserCheck,
  MessageSquare, Hash, Sparkles
} from "lucide-react";
import {
  useGetCommunityRoomsQuery,
  useGetCommunityPostsQuery,
  useToggleLikePostMutation,
} from "@/redux/slices/community.slice";
import CreatePostModal from "./_components";


const roomIcons: Record<string, any> = {
  general: MessageSquare,
  "legal-advice": Scale,
  "case-study": BookOpen,
  "law-students": Users,
  "lawyers-lounge": Briefcase,
  "ask-lawyer": UserCheck,
};

const roomColors: Record<string, string> = {
  general: "#3B82F6",
  "legal-advice": "#10B981",
  "case-study": "#F59E0B",
  "law-students": "#8B5CF6",
  "lawyers-lounge": "#9B2E3D",
  "ask-lawyer": "#06B6D4",
};

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "unanswered", label: "Unanswered" },
];

export default function CommunityPage() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: roomsData } = useGetCommunityRoomsQuery();
  const { data: postsData, isLoading, refetch } = useGetCommunityPostsQuery({
    room: selectedRoom === "all" ? undefined : selectedRoom as any,
    sort: sortBy,
    search: searchQuery || undefined,
  });

  const [toggleLike] = useToggleLikePostMutation();

  const rooms = roomsData?.data || [];
  const posts = postsData?.data?.data || [];

  const handleLike = async (postId: string) => {
    try {
      await toggleLike(postId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to like:", error);
    }
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

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon-500 rounded-2xl to-maroon-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Legal Community</h1>
              <p className="text-white/80 text-sm md:text-base">
                Connect with lawyers, share experiences, and get legal insights
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-maroon-500 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Start Discussion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-500"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedRoom("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedRoom === "all"
                  ? "bg-maroon-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Hash size={14} />
              All Discussions
            </button>
            {rooms.map((room: any) => {
              const Icon = roomIcons[room.id] || MessageSquare;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedRoom === room.id
                      ? "text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  style={selectedRoom === room.id ? { background: room.color } : {}}
                >
                  <Icon size={14} />
                  {room.name}
                  <span className="text-xs opacity-80">({room.postCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-maroon-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            posts.map((post:any) => {
              const RoomIcon = roomIcons[post.room] || MessageSquare;
              const roomColor = roomColors[post.room] || "#6B7280";
              
              return (
                <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="p-5">
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Room Badge */}
                        <div 
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: `${roomColor}15`, color: roomColor }}
                        >
                          <RoomIcon size={10} />
                          {rooms.find((r:any) => r.id === post.room)?.name}
                        </div>
                        
                        {/* Pinned Badge */}
                        {post.isPinned && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                            <Pin size={10} /> Pinned
                          </div>
                        )}
                        
                        {/* Locked Badge */}
                        {post.isLocked && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <Lock size={10} /> Locked
                          </div>
                        )}
                        
                        {/* Resolved Badge */}
                        {post.isResolved && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                            <CheckCircle size={10} /> Resolved
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {getTimeAgo(post.createdAt)}
                      </div>
                    </div>
                    
                    {/* Post Title */}
                    <Link href={`/dashboard/community/${post._id}`}>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-maroon-500 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    
                    {/* Post Preview */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    {/* Reference Context */}
                    {post.reference && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-lg border-l-4 border-maroon-500">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Related to</p>
                        <p className="text-xs text-gray-700">
                          {post.reference.moduleTitle && `${post.reference.moduleTitle} › `}
                          {post.reference.title}
                        </p>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag:any) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Post Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: `linear-gradient(135deg, ${post.author.color}, ${post.author.color}80)` }}
                          >
                            {post.author.initials}
                          </div>
                          <span className="text-xs text-gray-600">{post.author.name}</span>
                          {post.author.role === 'lawyer' && (
                            <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                              Lawyer
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className="flex items-center gap-1 hover:text-maroon-500 transition-colors"
                        >
                          <Heart size={14} /> {post.likes}
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.comments.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {post.viewCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Post Modal (to be implemented) */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} onSuccess={refetch} />
      )}
    </div>
  );
}