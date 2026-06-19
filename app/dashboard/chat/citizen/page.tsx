"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ChevronRight, Plus, Search, MessageSquare, Loader2, X, RefreshCw,
} from "lucide-react";
import {
  useGetConversationsQuery,
  chatUiActions,
  selectLiveMessages,
  selectTyping,
  selectPresence,
  selectUnread,
  selectSocketConnected,
  selectTotalUnread,
  IConversation,
  IMessage,
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
  colorFromString,
  getInitials,
} from "@/app/components/chat";
import { useGetMeQuery } from "@/redux/authService/authSlice";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CitizenConversationsPage() {
  const dispatch = useDispatch();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Current user
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.data?.user;
  const currentUserId = currentUser?._id ?? "";
  const currentUserName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim();
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Socket
  const chatSocket = useChatSocket({ token: accessToken });
  const socketConnected = useSelector(selectSocketConnected);

  // Conversations list
  const { data: convsData, isLoading, refetch } = useGetConversationsQuery({});
  const conversations: IConversation[] = convsData?.data?.conversations ?? [];

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const other = c.participants.find(p => p.userId !== currentUserId);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  // Active conversation
  const activeConversation = conversations.find(c => c._id === activeConvId) ?? null;

  // Presence
  const allParticipantIds = conversations.flatMap(c => c.participants.map(p => p.userId));

  useEffect(() => {
    if (allParticipantIds.length) chatSocket.getPresence(allParticipantIds);
  }, [conversations.length]); // eslint-disable-line

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const presence = useSelector((s: any) => s.chatUi.presence)
  // const unreadCount = useSelector(selectUnread(conv._id))

  return (
    <div className="flex-1 flex overflow-hidden bg-white" style={{ height: "calc(100vh - 60px)" }}>
      {/* ── Sidebar ── */}
      <div
        className={`flex-shrink-0 border-r border-[#F3F4F6] flex flex-col bg-white transition-all duration-200 ${sidebarOpen ? "w-80" : "w-0 overflow-hidden"
          }`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[15px] font-bold text-[#111827]">Messages</h1>
              <p className="text-[11px] text-[#9CA3AF]">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-[#E5E7EB] text-[12px] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors bg-[#F9FAFB]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={11} className="text-[#9CA3AF]" />
              </button>
            )}
          </div>
        </div>

        {/* Connection state */}
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
              <p className="text-[12px] text-[#9CA3AF]">
                {search ? "No conversations match your search" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filtered.map(conv => (
              <ConversationListItem
                key={conv._id}
                conversation={conv}
                currentUserId={currentUserId}
                isActive={conv._id === activeConvId}
                presence={presence}
                unreadCount={0} //{useSelector(selectUnread(conv._id))}
                onClick={() => handleSelectConversation(conv._id)}
              />
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-[#F3F4F6]">
          <Link
            href="/dashboard/marketplace"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            <Plus size={13} /> Book a Lawyer
          </Link>
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top nav */}
        <div className="flex-shrink-0 h-12 flex items-center px-4 border-b border-[#F3F4F6] bg-[#FAFAFA] gap-2">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-white transition-colors border border-transparent hover:border-[#E5E7EB]"
          >
            <MessageSquare size={13} />
          </button>
          <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
            <Link href="/dashboard" className="hover:text-[#374151] transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={11} className="text-[#D1D5DB]" />
            <span className="text-[#111827] font-semibold">Messages</span>
          </nav>
        </div>

        {activeConversation ? (
          <ChatPanel
            conversation={activeConversation}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            chatSocket={chatSocket}
          />
        ) : (
          <EmptyConversation message="Select a conversation to start chatting" />
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
  chatSocket,
}: {
  conversation: IConversation;
  currentUserId: string;
  currentUserName: string;
  chatSocket: ReturnType<typeof useChatSocket>;
}) {
  const presence = useSelector((s: any) => s.chatUi.presence);

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
    currentUserRole: "citizen",
    chatSocket,
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ConversationHeader
        conversation={conversation}
        currentUserId={currentUserId}
        presence={presence}
        isAdmin={false}
      />

      <ConnectionBanner connected={socketConnected} />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        typingNames={typingNames}
        onDeleteMessage={deleteMessage}
        onReplyMessage={setReplyTo}
        isAdmin={false}
        isLoadingHistory={isLoadingHistory}
      />

      <MessageInput
        onSend={sendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!socketConnected || conversation.status !== "active"}
        placeholder={
          conversation.status === "closed"
            ? "This conversation is closed"
            : "Type a message…"
        }
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}