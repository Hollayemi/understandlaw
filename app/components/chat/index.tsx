"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Smile, MoreVertical, Phone, Video,
  Check, CheckCheck, Clock, AlertCircle, Trash2, Reply,
  Shield, X, ChevronDown, Circle, Loader2, MessageSquare,
  Image as ImageIcon, File as FileIcon, Lock,
} from "lucide-react";
import { IMessage, IConversation, IParticipant, IPresence, MessageType } from "@/redux/slices/chat.slice";
import { formatTime } from "@/utils/function";

// ─── Helpers ──────────────────────────────────────────────────────────────────



export function formatFullTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function colorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360},50%,40%)`;
}

// ─── PresenceDot ─────────────────────────────────────────────────────────────

export function PresenceDot({
  isOnline,
  size = 8,
}: {
  isOnline?: boolean;
  size?: number;
}) {
  return (
    <span
      className="rounded-full flex-shrink-0 ring-2 ring-white"
      style={{
        width: size, height: size,
        background: isOnline ? "#10B981" : "#D1D5DB",
      }}
    />
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({
  name,
  avatarUrl,
  isOnline,
  size = 36,
}: {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  size?: number;
}) {
  const initials = getInitials(name);
  const color = colorFromString(name);
  const dotSize = size > 32 ? 10 : 8;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center text-white font-bold w-full h-full"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}99)`,
            fontSize: size * 0.33,
          }}
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className="absolute bottom-0 right-0 rounded-full ring-2 ring-white"
          style={{
            width: dotSize, height: dotSize,
            background: isOnline ? "#10B981" : "#D1D5DB",
          }}
        />
      )}
    </div>
  );
}

// ─── MessageStatusIcon ────────────────────────────────────────────────────────

export function MessageStatusIcon({
  status,
  pending,
  failed,
}: {
  status: IMessage["status"];
  pending?: boolean;
  failed?: boolean;
}) {
  if (failed) return <AlertCircle size={11} className="text-red-400" />;
  if (pending) return <Clock size={11} className="text-white/50" />;
  if (status === "read") return <CheckCheck size={11} className="text-[#93C5FD]" />;
  if (status === "delivered") return <CheckCheck size={11} className="text-white/60" />;
  return <Check size={11} className="text-white/50" />;
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────

export function TypingIndicator({ names }: { names: string[] }) {
  if (!names.length) return null;
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]"
            style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

// ─── SystemMessage ────────────────────────────────────────────────────────────

export function SystemMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-center my-2">
      <span className="text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-3 py-1 rounded-full">
        {content}
      </span>
    </div>
  );
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────

export function ChatBubble({
  message,
  isMine,
  showAvatar,
  senderName,
  senderColor,
  onDelete,
  onReply,
  isAdmin = false,
}: {
  message: IMessage;
  isMine: boolean;
  showAvatar: boolean;
  senderName: string;
  senderColor?: string;
  onDelete?: (id: string) => void;
  onReply?: (msg: IMessage) => void;
  isAdmin?: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

  if (message.type === "system") return <SystemMessage content={message.content} />;

  if (message.isDeleted) {
    return (
      <div className={`flex gap-2.5 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
        <div className="w-7 flex-shrink-0" />
        <span className="text-[11px] italic text-[#9CA3AF] px-3 py-1.5 bg-[#F3F4F6] rounded-2xl">
          Message deleted
        </span>
      </div>
    );
  }

  const bubbleBg = isMine
    ? "linear-gradient(135deg, #7C3AED, #5B21B6)"
    : "#F3F4F6";
  const textColor = isMine ? "#fff" : "#111827";
  const timeColor = isMine ? "rgba(255,255,255,0.6)" : "#9CA3AF";
  const initials = getInitials(senderName);
  const color = senderColor ?? colorFromString(senderName);

  return (
    <div
      className={`flex gap-1 md:gap-2.5 mb-1 group ${isMine ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="w-7 h-7 flex-shrink-0 self-end">
        {showAvatar && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Bubble + actions */}
      <div className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Sender name (others only) */}
        {!isMine && showAvatar && (
          <span className="text-[10px] font-semibold text-[#6B7280] mb-0.5 ml-1">
            {senderName}
          </span>
        )}

        <div className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : ""}`}>
          {/* Bubble */}
          <div
            className="relative px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words"
            style={{
              background: bubbleBg,
              color: textColor,
              borderBottomRightRadius: isMine ? 4 : undefined,
              borderBottomLeftRadius: !isMine ? 4 : undefined,
            }}
          >
            {message.content}

            {/* Timestamp + status */}
            <div
              className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}
            >
              <span className="text-[10px]" style={{ color: timeColor }}>
                {formatTime(message.createdAt, 'relative')}
              </span>
              {isMine && (
                <MessageStatusIcon
                  status={message.status}
                  pending={message._pending}
                  failed={message._failed}
                />
              )}
            </div>
          </div>

          {/* Hover actions */}
          {showActions && !message._pending && (
            <div
              className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? "flex-row-reverse" : ""}`}
            >
              {onReply && (
                <button
                  onClick={() => onReply(message)}
                  className="w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors shadow-sm"
                  title="Reply"
                >
                  <Reply size={11} className="text-[#6B7280]" />
                </button>
              )}
              {(isMine || isAdmin) && onDelete && (
                <button
                  onClick={() => onDelete(message._id)}
                  className="w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={11} className="text-[#EF4444]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DateDivider ──────────────────────────────────────────────────────────────

export function DateDivider({ date }: { date: string }) {
  const label = (() => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  })();

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#F3F4F6]" />
      <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#F3F4F6]" />
    </div>
  );
}

// ─── ReplyPreview ─────────────────────────────────────────────────────────────

export function ReplyPreview({
  message,
  onCancel,
}: {
  message: IMessage;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F9FAFB] border-t border-[#F3F4F6]">
      <div className="w-0.5 h-8 bg-[#7C3AED] rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-[#7C3AED]">Replying to {message.senderName}</p>
        <p className="text-[11px] text-[#6B7280] truncate">{message.content}</p>
      </div>
      <button onClick={onCancel} className="text-[#9CA3AF] hover:text-[#374151] transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── MessageInput ─────────────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
  replyTo?: IMessage | null;
  onCancelReply?: () => void;
  isAdmin?: boolean;  // admins read-only
}

export function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Type a message…",
  replyTo,
  onCancelReply,
  isAdmin = false,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart();
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop();
    }, 1500);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || isAdmin) return;
    onSend(trimmed);
    setText("");
    if (typingTimer.current) clearTimeout(typingTimer.current);
    isTypingRef.current = false;
    onTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-[#F9FAFB] border-t border-[#F3F4F6]">
        <Shield size={13} className="text-[#9CA3AF] flex-shrink-0" />
        <span className="text-[12px] text-[#9CA3AF]">
          Admin view — you can read this conversation but cannot send messages.
        </span>
      </div>
    );
  }

  return (
    <div className="border-t border-[#F3F4F6] bg-white">
      {replyTo && onCancelReply && (
        <ReplyPreview message={replyTo} onCancel={onCancelReply} />
      )}
      <div className="flex items-end gap-2 px-4 py-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="w-full px-4 py-2.5 rounded-2xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors bg-white leading-relaxed"
            style={{ maxHeight: 120 }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
        >
          <Send size={15} />
        </button>
      </div>
      <p className="text-[10px] text-[#D1D5DB] text-center pb-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

// ─── ConversationHeader ───────────────────────────────────────────────────────

export function ConversationHeader({
  conversation,
  currentUserId,
  presence,
  onClose,
  onViewDetails,
  isAdmin = false,
}: {
  conversation: IConversation;
  currentUserId: string;
  presence: Record<string, IPresence>;
  onClose?: () => void;
  onViewDetails?: () => void;
  isAdmin?: boolean;
}) {
  const other = conversation.participants.find(p => p.userId !== currentUserId);
  const otherPresence = other ? presence[other.userId] : undefined;
  const isOnline = otherPresence?.isOnline ?? false;

  const lastSeenLabel = (() => {
    if (isOnline) return "Online";
    if (!otherPresence?.lastSeenAt) return "Offline";
   
    return formatTime(otherPresence?.lastSeenAt, 'relative')
  })();

  const caseInfo = conversation.caseInfo;
  const otherName = other?.name ?? conversation.groupName ?? "Chat";
  // A case chat is titled by the consultation topic; the avatar/initials
  // still represent the other participant since it's a 1:1 conversation.
  const name = caseInfo?.title ?? otherName;
  const initials = getInitials(otherName);
  const color = colorFromString(otherName);

  return (
    <div className="flex !fixed w-full md:relative top-0 items-center gap-3 px-4 py-3.5 border-b border-[#F3F4F6] bg-white flex-shrink-0">
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
        >
          {initials}
        </div>
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white"
          style={{ background: isOnline ? "#10B981" : "#D1D5DB" }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-bold text-[#111827] truncate">{name}</p>
          {isAdmin && (
            <span className="text-[9px] font-bold text-[#7C3AED] bg-[#FFF0F5] border border-[#FBCFE8] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin View
            </span>
          )}
          {caseInfo && (
            <span className="text-[9px] font-bold text-[#3B82F6] bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Case
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1 truncate">
          {caseInfo && <span className="truncate">with {otherName} ·</span>}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: isOnline ? "#10B981" : "#D1D5DB" }}
          />
          {isOnline ? "Online now" : `Last seen ${lastSeenLabel}`}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors"
          >
            <MoreVertical size={15} />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ConversationListItem({
  conversation,
  currentUserId,
  presence,
  isActive,
  unreadCount,
  onClick,
}: {
  conversation: IConversation;
  currentUserId: string;
  presence: Record<string, IPresence>;
  isActive: boolean;
  unreadCount: number;
  onClick: () => void;
}) {
  const other = conversation.participants.find(p => p.userId !== currentUserId);
  const isOnline = other ? presence[other.userId]?.isOnline ?? false : false;

  const caseInfo = conversation.caseInfo;
  // A case chat is titled by the consultation topic, e.g. "Tenancy Dispute",
  // not by the other participant's name — that's shown as a subtitle instead.
  const name = caseInfo?.title ?? other?.name ?? conversation.groupName ?? "Chat";
  const initials = getInitials(name);
  const color = colorFromString(name);
  const last = conversation.lastMessage;

  const preview = (() => {
    if (!last) return "No messages yet";
    const prefix = last.senderId === currentUserId ? "You: " : "";
    if (last.type === "image") return `${prefix}📷 Image`;
    if (last.type === "file") return `${prefix}📎 File`;
    return `${prefix}${last.content}`;
  })();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-[#F9FAFB] ${
        isActive
          ? "bg-[#FFF0F5] border-l-2 border-l-[#7C3AED]"
          : "hover:bg-[#F9FAFB]"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
        >
          {initials}
        </div>
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white"
          style={{ background: isOnline ? "#10B981" : "#D1D5DB" }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-[13px] truncate ${isActive || unreadCount > 0 ? "font-bold text-[#111827]" : "font-semibold text-[#374151]"}`}>
            {name}
          </p>
          <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">
            {last ? formatTime(last.createdAt, 'relative') : ""}
          </span>
        </div>
        {caseInfo && other?.name && (
          <p className="text-[10.5px] text-[#9CA3AF] truncate">with {other.name}</p>
        )}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={`text-[12px] truncate ${unreadCount > 0 ? "text-[#374151] font-medium" : "text-[#9CA3AF]"}`}>
            {preview}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        {caseInfo && (
          <span className="text-[9px] text-[#3B82F6] font-semibold mt-0.5 inline-block">
            Case · {caseInfo.status.replace(/_/g, " ")}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── EmptyConversation ────────────────────────────────────────────────────────

export function EmptyConversation({
  message = "Select a conversation to start chatting",
}: {
  message?: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF0F5] flex items-center justify-center">
        <MessageSquare size={28} className="text-[#7C3AED]" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-[#374151]">{message}</p>
        <p className="text-[12px] text-[#9CA3AF] mt-1">
          Messages are end-to-end encrypted
        </p>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#D1D5DB]">
        <Lock size={11} />
        <span>Secured by LawTicha</span>
      </div>
    </div>
  );
}

// ─── ConnectionBanner ─────────────────────────────────────────────────────────

export function ConnectionBanner({ connected }: { connected: boolean }) {
  if (connected) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] border-b border-[#FCA5A5]">
      <Loader2 size={12} className="text-[#EF4444] animate-spin flex-shrink-0" />
      <p className="text-[11px] font-semibold text-[#991B1B]">
        Reconnecting to chat…
      </p>
    </div>
  );
}

// ─── MessageList ──────────────────────────────────────────────────────────────

export function MessageList({
  messages,
  currentUserId,
  typingNames,
  onDeleteMessage,
  onReplyMessage,
  isAdmin = false,
  isLoadingHistory = false,
}: {
  messages: IMessage[];
  currentUserId: string;
  typingNames: string[];
  onDeleteMessage?: (id: string) => void;
  onReplyMessage?: (msg: IMessage) => void;
  isAdmin?: boolean;
  isLoadingHistory?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll on new messages
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, typingNames.length, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAutoScroll(nearBottom);
  };

  // Group messages by date and determine avatar visibility
  let lastDate = "";
  let lastSenderId = "";

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto md:px-4 py-4 space-y-0.5"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#E5E7EB transparent" }}
    >
      {isLoadingHistory && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-[#7C3AED]" />
        </div>
      )}

      {messages.map((msg, idx) => {
        const dateStr = new Date(msg.createdAt).toDateString();
        const showDate = dateStr !== lastDate;
        const isMine = msg.senderId === currentUserId;
        const showAvatar = msg.senderId !== lastSenderId || showDate;

        lastDate = dateStr;
        lastSenderId = msg.senderId;

        return (
          <React.Fragment key={msg._id}>
            {showDate && <DateDivider date={msg.createdAt} />}
            <ChatBubble
              message={msg}
              isMine={isMine}
              showAvatar={showAvatar}
              senderName={msg.senderName}
              onDelete={onDeleteMessage}
              onReply={onReplyMessage}
              isAdmin={isAdmin}
            />
          </React.Fragment>
        );
      })}

      <TypingIndicator names={typingNames} />
      <div ref={bottomRef} />

      {/* Scroll to bottom button */}
      {!autoScroll && (
        <button
          onClick={() => {
            setAutoScroll(true);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="fixed bottom-24 right-6 w-8 h-8 rounded-full bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors z-10"
        >
          <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}