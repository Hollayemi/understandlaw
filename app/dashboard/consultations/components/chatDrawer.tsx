"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    X, Loader2, BadgeCheck, Star, Gavel, MessageSquare, Clock, CheckCircle, Phone, Video
} from "lucide-react";
import { useGetConversationsQuery, selectLiveMessages, selectTyping, selectSocketConnected, IConversation, IMessage } from "@/redux/slices/chat.slice";
import { useGetMeQuery } from "@/redux/authService/authSlice";
import { useChatSocket } from "@/hook/useChatSocket";
import { useChatRoom } from "@/hook/useChatRoom";
import { MessageList, MessageInput, ConnectionBanner } from "@/app/components/chat";
import { Consultation } from "@/redux/types/consultation";


function JourneyTracker({ status }: { status: string }) {
    const steps = ["awaiting_lawyer", "active", "completed"];
    const currentIdx = steps.indexOf(status);

    return (
        <div className="flex items-center gap-2">
            {steps.map((s, i) => (
                <React.Fragment key={s}>
                    <div className="flex items-center gap-1.5">
                        <div
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${i <= currentIdx
                                    ? "bg-maroon-500 ring-2 ring-maroon-500/20"
                                    : "bg-[#E5E7EB]"
                                }`}
                        />
                        <span
                            className={`text-[9px] font-medium capitalize ${i <= currentIdx ? "text-[#374151]" : "text-[#D1D5DB]"
                                }`}
                        >
                            {s === "awaiting_lawyer" ? "Awaiting" : s}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={`flex-1 h-[2px] transition-all ${i < currentIdx ? "bg-maroon-500" : "bg-[#E5E7EB]"
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; userLabel: string; text: string; bg: string; icon: any }> = {
    awaiting_lawyer: {
        label: "Awaiting Lawyer",
        userLabel: "Awaiting",
        text: "#B45309",
        bg: "#FEF3C7",
        icon: Clock,
    },
    active: {
        label: "Active",
        userLabel: "Active",
        text: "#065F46",
        bg: "#ECFDF5",
        icon: MessageSquare,
    },
    completed: {
        label: "Completed",
        userLabel: "Completed",
        text: "#065F46",
        bg: "#ECFDF5",
        icon: CheckCircle,
    },
    cancelled: {
        label: "Cancelled",
        userLabel: "Cancelled",
        text: "#6B7280",
        bg: "#F9FAFB",
        icon: X,
    },
    disputed: {
        label: "Disputed",
        userLabel: "Disputed",
        text: "#991B1B",
        bg: "#FEF2F2",
        icon: Gavel,
    },
};

const MODE_CFG: Record<string, { label: string; icon: any }> = {
    chat: { label: "Chat", icon: MessageSquare },
    voice: { label: "Voice Call", icon: Phone },
    video: { label: "Video Call", icon: Video },
};

// ─── Main Drawer ─────────────────────────────────────────────────────────────

export function ConsultationDrawer({
    consult,
    onClose,
    onRaiseDispute,
    onRequestRefund,
    onSubmitRating,
}: {
    consult: Consultation;
    onClose: () => void;
    onRaiseDispute: (id: string, reason: string) => void;
    onRequestRefund: (id: string) => void;
    onSubmitRating: (id: string, rating: number, note: string) => void;
}) {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<"conversation" | "details" | "help">("conversation");
    const [disputeReason, setDisputeReason] = useState("");
    const [showDisputeForm, setShowDisputeForm] = useState(false);
    const [rating, setRating] = useState(consult.rating ?? 0);
    const [ratingNote, setRatingNote] = useState(consult.ratingNote ?? "");
    const [ratingSubmitted, setRatingSubmitted] = useState(!!consult.rating);
    const [loading, setLoading] = useState(false);

    console.log({ consult })

    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const chatSocket = useChatSocket({ token: accessToken });
    const socketConnected = useSelector(selectSocketConnected);

    // Get current user info (assuming you have this from your auth)
    const { data: meData } = useGetMeQuery();
    const currentUser = meData?.data?.user;
    const currentUserId = currentUser?._id ?? "";
    const currentUserName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim();

    // Find or create conversation for this consultation
    // You'll need to map consult to a conversation - assuming consult has a conversationId or you need to create one
    const conversationId = consult.conversationId; // Add this to your Consultation type

    // Get conversation if it exists
    const { data: convsData } = useGetConversationsQuery({});
    const conversations: IConversation[] = convsData?.data?.conversations ?? [];

    const conversation = conversations.find(
        c => c.contextId === consult.id || c._id === conversationId
    ) ?? null;
    console.log({ conversation, conversationId })

    const chatRoom = conversation ? useChatRoom({
        conversation,
        currentUserId,
        currentUserName,
        currentUserRole: "citizen",
        chatSocket,
    }) : null;

    // Get live messages
    const liveMessages = useSelector(selectLiveMessages(conversation?._id ?? ""));
    const typingNames = useSelector(selectTyping(conversation?._id ?? ""));

    // ─── Handlers ──────────────────────────────────────────────────────────────

    const handleRatingSubmit = async () => {
        if (!rating) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onSubmitRating(consult.id, rating, ratingNote);
        setRatingSubmitted(true);
        setLoading(false);
    };

    const handleDispute = async () => {
        if (!disputeReason.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        onRaiseDispute(consult.id, disputeReason);
        setLoading(false);
        onClose();
    };

    // For sending messages
    const [newMessage, setNewMessage] = useState("");
    const [replyTo, setReplyTo] = useState<IMessage | null>(null);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !chatRoom) return;
        chatRoom.sendMessage(newMessage.trim());
        setNewMessage("");
        setReplyTo(null);
    };

    const cfg = STATUS_CFG[consult.status] || STATUS_CFG.active;
    const StatusIcon = cfg.icon;
    const ModeIcon = MODE_CFG[consult.mode]?.icon || MessageSquare;

    // Determine if chat is active
    const isChatActive = consult.status === "active" || consult.status === "awaiting_lawyer";
    const isClosed = consult.status === "completed" || consult.status === "cancelled" || consult.status === "disputed";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">
                {/* Accent bar */}
                <div
                    className="h-1 w-full flex-shrink-0"
                    style={{
                        background:
                            consult.status === "disputed" ? "#EF4444"
                                : consult.status === "completed" ? "#10B981"
                                    : consult.status === "cancelled" ? "#9CA3AF"
                                        : "linear-gradient(90deg, #9B2E3D, #82212D)",
                    }}
                />

                {/* Header */}
                <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono font-bold text-[#9CA3AF] mb-1">{consult.id}</p>
                            <h2 className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-2">{consult.topic}</h2>
                        </div>
                        <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors flex-shrink-0 mt-0.5">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Lawyer row */}
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)` }}
                        >
                            {consult.lawyer.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-[12px] font-semibold text-[#111827]">{consult.lawyer.name}</p>
                                <BadgeCheck size={12} className="text-amber-500 flex-shrink-0" />
                            </div>
                            <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.specialisms?.[0]?.displayName || ""}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{ background: cfg.bg, color: cfg.text }}
                            >
                                <StatusIcon size={9} />
                                {cfg.userLabel}
                            </span>
                        </div>
                    </div>

                    {/* Journey */}
                    {consult.status !== "cancelled" && (
                        <div className="mb-4">
                            <JourneyTracker status={consult.status} />
                        </div>
                    )}

                    {/* Connection banner for chat */}
                    {activeTab === "conversation" && (
                        <div className="mb-2">
                            <ConnectionBanner connected={socketConnected} />
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                        {([
                            { id: "conversation" as const, label: "Conversation" },
                            { id: "details" as const, label: "Details & Receipt" },
                            { id: "help" as const, label: consult.status === "completed" ? "Rate & Review" : "Get Help" },
                        ]).map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── Conversation ── */}
                    {activeTab === "conversation" && (
                        <div className="flex flex-col h-full">
                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                                {conversation ? (
                                    <MessageList
                                        messages={liveMessages}
                                        currentUserId={currentUserId}
                                        typingNames={typingNames}
                                        onDeleteMessage={chatRoom?.deleteMessage}
                                        onReplyMessage={setReplyTo}
                                        isAdmin={false}
                                        isLoadingHistory={chatRoom?.isLoadingHistory ?? false}
                                    />
                                ) : (
                                    // Fallback to static transcript if no conversation
                                    <div className="space-y-4">
                                        {consult.transcript.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-3">
                                                    <MessageSquare size={20} className="text-[#D1D5DB]" />
                                                </div>
                                                <p className="text-sm font-semibold text-[#9CA3AF]">No messages yet</p>
                                                <p className="text-[11px] text-[#D1D5DB] mt-1">
                                                    {consult.status === "awaiting_lawyer"
                                                        ? "Your lawyer is reviewing your request and will respond shortly."
                                                        : "The conversation will appear here once it starts."}
                                                </p>
                                                {consult.status === "awaiting_lawyer" && (
                                                    <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-maroon-500 font-semibold">
                                                        <Loader2 size={11} className="animate-spin" />
                                                        Awaiting lawyer response…
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            consult.transcript.map(msg => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex gap-2.5 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}
                                                >
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5"
                                                        style={{
                                                            background:
                                                                msg.sender === "citizen"
                                                                    ? "linear-gradient(135deg, #6B7280, #9CA3AF)"
                                                                    : `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)`,
                                                        }}
                                                    >
                                                        {msg.sender === "citizen" ? "You" : consult.lawyer.initials}
                                                    </div>
                                                    <div className={`flex-1 max-w-[85%] flex flex-col ${msg.sender === "lawyer" ? "items-end" : ""}`}>
                                                        <div className={`flex items-center gap-2 mb-1 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}>
                                                            <p className="text-[10px] font-semibold text-[#9CA3AF]">{msg.senderName}</p>
                                                            <p className="text-[10px] text-[#D1D5DB]">{msg.time}</p>
                                                        </div>
                                                        <div
                                                            className={`rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${msg.sender === "citizen"
                                                                ? "bg-[#F3F4F6] text-[#374151] rounded-tl-sm"
                                                                : "text-white rounded-tr-sm"
                                                                }`}
                                                            style={
                                                                msg.sender === "lawyer"
                                                                    ? { background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}cc)` }
                                                                    : {}
                                                            }
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Reply input */}
                            {isChatActive && conversation ? (
                                <div className="flex-shrink-0 border-t border-[#F3F4F6] px-4 py-3 bg-white/95">
                                    <MessageInput
                                        onSend={handleSendMessage}
                                        onTypingStart={() => chatRoom?.handleTypingStart?.()}
                                        onTypingStop={() => chatRoom?.handleTypingStop?.()}
                                        disabled={!socketConnected || isClosed}
                                        placeholder={
                                            isClosed
                                                ? "This consultation has ended"
                                                : `Reply to ${consult.lawyer.name}…`
                                        }
                                        replyTo={replyTo}
                                        onCancelReply={() => setReplyTo(null)}
                                    />
                                    <p className="text-[10px] text-[#9CA3AF] mt-1.5">Follow-up questions within 48 hours are included at no extra charge.</p>
                                </div>
                            ) : isChatActive && !conversation ? (
                                <div className="flex-shrink-0 border-t border-[#F3F4F6] px-4 py-3">
                                    <div className="flex items-center justify-center gap-2 text-[11px] text-[#9CA3AF]">
                                        <Loader2 size={11} className="animate-spin text-maroon-500" />
                                        Loading conversation…
                                    </div>
                                </div>
                            ) : isClosed ? (
                                <div className="flex-shrink-0 border-t border-[#F3F4F6] px-4 py-3">
                                    <div className="text-center text-[11px] text-[#9CA3AF] py-2">
                                        {consult.status === "completed"
                                            ? "This consultation has been completed. Thank you for using LawPavilion!"
                                            : consult.status === "cancelled"
                                                ? "This consultation has been cancelled."
                                                : "This consultation has been closed."}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* ── Details & Receipt ── */}
                    {activeTab === "details" && (
                        <div className="p-5 space-y-4">
                            {/* ... keep your existing details content ... */}
                        </div>
                    )}

                    {/* ── Rate & Review / Help ── */}
                    {activeTab === "help" && (
                        <div className="p-5 space-y-4">
                            {/* ... keep your existing help content ... */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
