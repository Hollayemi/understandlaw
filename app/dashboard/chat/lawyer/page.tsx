"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ChevronRight, Search, MessageSquare, Loader2, X, RefreshCw,
  Filter, Clock, CheckCircle, AlertTriangle,
} from "lucide-react";
import {
  useGetConversationsQuery,
  selectUnread,
  selectSocketConnected,
  IConversation,
  ConversationStatus,
} from "@/redux/slices/chat.slice";
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LawyerConversationsPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("all");
  const [sidebarOpen, setSidebarOpen]   = useState(true);

  const { data: meData } = useGetMeQuery();
  const currentUser     = meData?.data?.user;
  const currentUserId   = currentUser?._id ?? "";
  const currentUserName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim();
  const accessToken     = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const chatSocket      = useChatSocket({ token: accessToken });
  const socketConnected = useSelector(selectSocketConnected);

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
  const activeCount   = conversations.filter(c => c.status === "active").length;
  const unreadTotal   = conversations.reduce((n, c) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return n + (c.participants.find(p => p.userId !== currentUserId)?.unreadCount ?? 0);
  }, 0);

  const activeConversation = conversations.find(c => c._id === activeConvId) ?? null;

  useEffect(() => {
    const ids = conversations.flatMap(c => c.participants.map(p => p.userId));
    if (ids.length) chatSocket.getPresence(ids);
  }, [conversations.length]); // eslint-disable-line

  const presence = useSelector((s: any) => s.chatUi.presence);

  return (
    <div className="flex-1 flex overflow-hidden bg-white" style={{ height: "calc(100vh - 60px)" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div
        className={`flex-shrink-0 border-r border-[#F3F4F6] flex flex-col bg-white transition-all duration-200 ${
          sidebarOpen ? "w-80" : "w-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[15px] font-bold text-[#111827]">Client Messages</h1>
              <p className="text-[11px] text-[#9CA3AF]">
                {activeCount} active · {conversations.length} total
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Active",  value: activeCount,  color: "#10B981", icon: CheckCircle },
              { label: "Unread",  value: unreadTotal,  color: "#E8317A", icon: MessageSquare },
              { label: "Total",   value: conversations.length, color: "#6B7280", icon: Clock },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-[#F9FAFB] rounded-xl p-2 text-center">
                  <p className="text-[14px] font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by client name…"
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-[#E5E7EB] text-[12px] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors bg-[#F9FAFB]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={11} className="text-[#9CA3AF]" />
              </button>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 bg-[#F9FAFB] rounded-xl p-1">
            {(["all", "active", "closed"] as const).map(s => (
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
        </div>

        <ConnectionBanner connected={socketConnected} />

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[#E8317A]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare size={24} className="text-[#E5E7EB] mx-auto mb-2" />
              <p className="text-[12px] text-[#9CA3AF]">No conversations found</p>
            </div>
          ) : (
            filtered.map(conv => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const unread = 0 // useSelector(selectUnread(conv._id));
              return (
                <div key={conv._id} className="relative">
                  <ConversationListItem
                    conversation={conv}
                    currentUserId={currentUserId}
                    presence={presence}
                    isActive={conv._id === activeConvId}
                    unreadCount={unread}
                    onClick={() => {
                      setActiveConvId(conv._id);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  />
                  {/* Status indicator */}
                  {conv.status !== "active" && (
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
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 h-12 flex items-center px-4 border-b border-[#F3F4F6] bg-[#FAFAFA] gap-2">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-white transition-colors border border-transparent hover:border-[#E5E7EB]"
          >
            <MessageSquare size={13} />
          </button>
          <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
            <Link href="/dashboard" className="hover:text-[#374151] transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-[#D1D5DB]" />
            <span className="text-[#111827] font-semibold">Client Messages</span>
          </nav>
        </div>

        {activeConversation ? (
          <LawyerChatPanel
            conversation={activeConversation}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            chatSocket={chatSocket}
          />
        ) : (
          <EmptyConversation message="Select a client conversation" />
        )}
      </div>
    </div>
  );
}

// ─── LawyerChatPanel ──────────────────────────────────────────────────────────

function LawyerChatPanel({
  conversation,
  currentUserId,
  currentUserName,
  chatSocket,
}: {
  conversation: IConversation;
  currentUserId: string;
  currentUserName: string;
  chatSocket: ReturnType<typeof useChatSocket>;
}) {
  const presence = useSelector((s: any) => s.chatUi.presence);
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
    currentUserRole: "lawyer",
    chatSocket,
  });

  // Consultation metadata
  const citizen = conversation.participants.find(p => p.role === "citizen");
  const meta    = conversation.metadata as any;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ConversationHeader
        conversation={conversation}
        currentUserId={currentUserId}
        presence={presence}
        isAdmin={false}
      />

      {/* Consultation context banner */}
      {conversation.contextType === "consultation" && (
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

      <ConnectionBanner connected={socketConnected} />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        typingNames={typingNames}
        onDeleteMessage={deleteMessage}
        onReplyMessage={setReplyTo}
        isLoadingHistory={isLoadingHistory}
      />

      <MessageInput
        onSend={sendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!socketConnected || isClosed}
        placeholder={
          isClosed
            ? "This consultation has ended"
            : `Reply to ${citizen?.name ?? "client"}…`
        }
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}