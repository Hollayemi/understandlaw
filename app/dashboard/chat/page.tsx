"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ChevronRight, Plus, Search, MessageSquare, Loader2, X, RefreshCw,
  Menu, Clock, CheckCircle, AlertTriangle, Filter,
} from "lucide-react";
import {
  useGetConversationsQuery,
  selectSocketConnected,
  IConversation,
  ConversationStatus,
} from "@/redux/slices/chat.slice";
import { useDispatch } from "react-redux";
import { useChatSocket } from "@/hook/useChatSocket";
import { useChatRoom } from "@/hook/useChatRoom";
import {
  ConversationListItem,
  ConversationHeader,
  MessageList,
  MessageInput,
  EmptyConversation,
  ConnectionBanner,
} from "@/app/components/chat";
import { useGetMeQuery } from "@/redux/authService/authSlice";

// ─── Status badge helper ──────────────────────────────────────────────────────

const CONV_STATUS: Record<ConversationStatus, { label: string; color: string; bg: string }> = {
  active:   { label: "Active",   color: "#065F46", bg: "#ECFDF5" },
  closed:   { label: "Closed",   color: "#6B7280", bg: "#F9FAFB" },
  archived: { label: "Archived", color: "#92400E", bg: "#FEF3C7" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConversationsPage() {
  const dispatch = useDispatch();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Current user
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.data?.user;
  const currentUserId = currentUser?._id ?? "";
  const currentUserName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim();
  const userRole = (currentUser?.role ?? "citizen") as "citizen" | "lawyer" | "admin";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Socket
  const chatSocket = useChatSocket({ token: accessToken });
  const socketConnected = useSelector(selectSocketConnected);

  // Conversations list
  const { data: convsData, isLoading, refetch } = useGetConversationsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const conversations: IConversation[] = convsData?.data?.conversations ?? [];

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const other = c.participants.find(p => p.userId !== currentUserId);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  // Stats
  const activeCount = conversations.filter(c => c.status === "active").length;
  const unreadTotal = conversations.reduce((n, c) => {
    return n + (c.participants.find(p => p.userId !== currentUserId)?.unreadCount ?? 0);
  }, 0);

  // Active conversation
  const activeConversation = conversations.find(c => c._id === activeConvId) ?? null;

  // Handle responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Presence
  const allParticipantIds = conversations.flatMap(c => c.participants.map(p => p.userId));

  useEffect(() => {
    if (allParticipantIds.length) chatSocket.getPresence(allParticipantIds);
  }, [conversations.length]); // eslint-disable-line

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const presence = useSelector((s: any) => s.chatUi.presence);

  // ─── Role-specific configurations ──────────────────────────────────────────

  const isLawyer = userRole === "lawyer";
  const isCitizen = userRole === "citizen";

  // Lawyer-specific: status filter tabs
  const statusTabs = isLawyer ? ["all", "active", "closed"] as const : ["all"] as const;

  // Stats for lawyer
  const stats = isLawyer ? [
    { label: "Active", value: activeCount, color: "#10B981", icon: CheckCircle },
    { label: "Unread", value: unreadTotal, color: "#E8317A", icon: MessageSquare },
    { label: "Total", value: conversations.length, color: "#6B7280", icon: Clock },
  ] : [
    { label: "Total", value: conversations.length, color: "#6B7280", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col md:flex-row flex-1 bg-gradient-to-br from-gray-50 to-white h-screen overflow-hidden">
      {/* ── Overlay for mobile ── */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 flex-shrink-0 border-r border-gray-200/60 bg-white/95 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none
          ${sidebarOpen ? "w-[340px] max-w-[85vw] translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden"}
        `}
      >
        {/* Sidebar Header - Fixed */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100/80 bg-gradient-to-r from-white to-gray-50/50 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8317A] to-[#ff6fa8] flex items-center justify-center shadow-lg shadow-[#E8317A]/20">
                <MessageSquare size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-[16px] font-bold text-gray-900">
                  {isLawyer ? "Client Messages" : "Messages"}
                </h1>
                <p className="text-[11px] text-gray-400 font-medium">
                  {isLawyer 
                    ? `${activeCount} active · ${conversations.length} total`
                    : `${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#E8317A] hover:bg-[#E8317A]/10 transition-all duration-200 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Quick stats strip - Lawyer only */}
          {isLawyer && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-[#F9FAFB] rounded-xl p-2 text-center">
                    <p className="text-[14px] font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{s.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isLawyer ? "Search by client name…" : "Search conversations…"}
              className="w-full h-9 pl-9 pr-9 rounded-xl border border-gray-200/80 text-[13px] outline-none focus:border-[#E8317A] focus:ring-2 focus:ring-[#E8317A]/20 placeholder:text-gray-400 transition-all duration-200 bg-gray-50/80 hover:bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Status filter tabs - Lawyer only */}
          {isLawyer && (
            <div className="flex gap-1 bg-[#F9FAFB] rounded-xl p-1 mt-3">
              {statusTabs.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all ${
                    statusFilter === s
                      ? "bg-white text-[#111827] shadow-sm"
                      : "text-[#6B7280] hover:text-[#374151]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connection state */}
        <div className="flex-shrink-0">
          <ConnectionBanner connected={socketConnected} />
        </div>

        {/* List - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-1.5 py-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-[#E8317A]" />
              <p className="text-xs text-gray-400 mt-3">Loading conversations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={20} className="text-gray-400" />
              </div>
              <p className="text-[13px] font-medium text-gray-600">
                {search ? "No conversations match your search" : isLawyer ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {search ? "Try adjusting your search" : isLawyer ? "Select a conversation to start" : "Start chatting with lawyers"}
              </p>
            </div>
          ) : (
            filtered.map(conv => {
              const unread = conv.participants.find(p => p.userId !== currentUserId)?.unreadCount ?? 0;
              return (
                <div key={conv._id} className="relative">
                  <ConversationListItem
                    conversation={conv}
                    currentUserId={currentUserId}
                    isActive={conv._id === activeConvId}
                    presence={presence}
                    unreadCount={unread}
                    onClick={() => handleSelectConversation(conv._id)}
                  />
                  {/* Status indicator - Lawyer only */}
                  {isLawyer && conv.status !== "active" && (
                    <span
                      className="absolute top-3 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: CONV_STATUS[conv.status]?.bg,
                        color: CONV_STATUS[conv.status]?.color,
                      }}
                    >
                      {CONV_STATUS[conv.status]?.label}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTA - Citizen only */}
        {isCitizen && (
          <div className="flex-shrink-0 p-4 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-white sticky bottom-0">
            <Link
              href="/dashboard/marketplace"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-[13px] font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#E8317A]/25 hover:shadow-xl hover:shadow-[#E8317A]/35"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              <Plus size={15} /> Book a Lawyer
            </Link>
          </div>
        )}
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-hidden">
        {/* Top nav - Fixed */}
        <div className="flex-shrink-0 h-14 flex items-center px-4 md:px-6 border-b border-gray-100/80 bg-white/95 backdrop-blur-xl gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100/80 hover:text-[#E8317A] transition-all duration-200 md:hidden"
          >
            <Menu size={18} />
          </button>
          <nav className="flex items-center gap-2 text-[12px] text-gray-400">
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-700 font-semibold">
              {isLawyer ? "Client Messages" : "Messages"}
            </span>
          </nav>
          
          {activeConversation && (
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium text-gray-600">
                  {socketConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          )}
        </div>

        {activeConversation ? (
          <ChatPanel
            conversation={activeConversation}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            userRole={userRole}
            chatSocket={chatSocket}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyConversation 
              message={isLawyer ? "Select a client conversation" : "Select a conversation to start chatting"} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────

function ChatPanel({
  conversation,
  currentUserId,
  currentUserName,
  userRole,
  chatSocket,
}: {
  conversation: IConversation;
  currentUserId: string;
  currentUserName: string;
  userRole: 'citizen' | 'lawyer' | 'admin';
  chatSocket: ReturnType<typeof useChatSocket>;
}) {
  const presence = useSelector((s: any) => s.chatUi.presence);
  const isLawyer = userRole === "lawyer";
  const isClosed = conversation.status !== "active";

  const {
    messages,
    typingNames,
    isLoadingHistory,
    replyTo,
    setReplyTo,
    sendMessage,
    handleTypingStart,
    handleTypingStop,
    deleteMessage,
    socketConnected,
  } = useChatRoom({
    conversation,
    currentUserId,
    currentUserName,
    currentUserRole: userRole,
    chatSocket,
  });

  // Consultation metadata
  const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
  const meta = conversation.metadata as any;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30 overflow-hidden">
      {/* Conversation Header - Fixed */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-100/80">
        <ConversationHeader
          conversation={conversation}
          currentUserId={currentUserId}
          presence={presence}
          isAdmin={false}
        />
      </div>

      {/* Consultation context banner - Lawyer only */}
      {isLawyer && conversation.contextType === "consultation" && (
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#EFF6FF] border-b border-[#BFDBFE] flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
          <p className="text-[11px] text-[#1E40AF] font-semibold flex-1 min-w-0">
            Consultation chat
            {meta?.mode && ` · ${meta.mode} mode`}
            {meta?.feePaid && ` · NGN ${Number(meta.feePaid).toLocaleString()}`}
          </p>
          {isClosed && (
            <span className="text-[9px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
              CLOSED
            </span>
          )}
        </div>
      )}

      {/* Connection Banner */}
      <div className="flex-shrink-0">
        <ConnectionBanner connected={socketConnected} />
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar md:px-4 py-4">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          typingNames={typingNames}
          onDeleteMessage={deleteMessage}
          onReplyMessage={setReplyTo}
          isAdmin={false}
          isLoadingHistory={isLoadingHistory}
        />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100/80 px-4 py-3">
        <MessageInput
          onSend={sendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={!socketConnected || isClosed}
          placeholder={
            isClosed
              ? isLawyer 
                ? "This consultation has ended"
                : "This conversation is closed"
              : `Reply to ${otherParticipant?.name ?? "client"}…`
          }
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}