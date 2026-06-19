"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  chatUiActions,
  selectLiveMessages,
  selectTyping,
  selectSocketConnected,
  IMessage,
  IConversation,
} from "@/redux/slices/chat.slice";
import { ChatSocket } from "./useChatSocket";

interface UseChatRoomOptions {
  conversation: IConversation | null;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "citizen" | "lawyer" | "admin";
  chatSocket: ChatSocket;
}

export function useChatRoom({
  conversation,
  currentUserId,
  currentUserName,
  currentUserRole,
  chatSocket,
}: UseChatRoomOptions) {
  const dispatch = useDispatch();
  const conversationId = conversation?._id ?? "";

  const messages = useSelector(selectLiveMessages(conversationId));
  const typingNames = useSelector(selectTyping(conversationId));
  const socketConnected = useSelector(selectSocketConnected);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [replyTo, setReplyTo] = useState<IMessage | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const hasJoined = useRef(false);

  // ── Join room + load history ───────────────────────────────────────────────

  useEffect(() => {
    if (!conversationId || !socketConnected) return;

    if (!hasJoined.current) {
      chatSocket.joinConversation(conversationId);
      hasJoined.current = true;
    }

    dispatch(chatUiActions.setActiveConversation(conversationId));

    // Load history if we don't have any messages yet
    if (messages.length === 0) {
      setIsLoadingHistory(true);
      chatSocket.fetchHistory(conversationId, { limit: 50 }).then((msgs) => {
        if (msgs.length) {
          dispatch(chatUiActions.hydrateMessages({ conversationId, messages: msgs }));
        }
        if (msgs.length < 50) setHasMore(false);
        setIsLoadingHistory(false);
      });
    }

    // Get presence for participants
    const participantIds = conversation?.participants.map(p => p.userId) ?? [];
    if (participantIds.length) chatSocket.getPresence(participantIds);

    return () => {
      hasJoined.current = false;
    };
  }, [conversationId, socketConnected]); // eslint-disable-line

  // ── Leave room on unmount / conversation change ───────────────────────────

  useEffect(() => {
    return () => {
      if (conversationId) {
        chatSocket.leaveConversation(conversationId);
        dispatch(chatUiActions.setActiveConversation(null));
      }
    };
  }, [conversationId]); // eslint-disable-line

  // ── Auto-mark unread messages as read ────────────────────────────────────

  useEffect(() => {
    if (!conversationId || !messages.length) return;
    const unread = messages.filter(
      m => m.senderId !== currentUserId && m.status !== "read" && !m._pending
    );
    if (unread.length) {
      chatSocket.markRead(conversationId, unread.map(m => m._id));
    }
  }, [messages, conversationId, currentUserId]); // eslint-disable-line

  // ── Load more history (pagination) ───────────────────────────────────────

  const loadMore = useCallback(async () => {
    if (!conversationId || isLoadingHistory || !hasMore) return;
    const oldest = messages[0];
    if (!oldest) return;

    setIsLoadingHistory(true);
    const older = await chatSocket.fetchHistory(conversationId, {
      before: oldest._id,
      limit: 50,
    });

    if (older.length) {
      dispatch(chatUiActions.hydrateMessages({ conversationId, messages: older }));
    }
    if (older.length < 50) setHasMore(false);
    setIsLoadingHistory(false);
  }, [conversationId, isLoadingHistory, hasMore, messages, chatSocket, dispatch]);

  // ── Send message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim() || currentUserRole === "admin") return;

      const tempId = `temp_${uuidv4()}`;
      const now = new Date().toISOString();

      // Optimistic message
      const optimistic: IMessage = {
        _id: tempId,
        conversationId,
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        type: "text",
        content: content.trim(),
        attachments: [],
        status: "sent",
        readBy: [],
        isDeleted: false,
        replyTo: replyTo?._id,
        createdAt: now,
        updatedAt: now,
        _pending: true,
      };

      dispatch(chatUiActions.optimisticSend(optimistic));
      setReplyTo(null);

      const result = await chatSocket.sendMessage({
        conversationId,
        content: content.trim(),
        type: "text",
        replyTo: replyTo?._id,
      });

      if (!result.success) {
        dispatch(
          chatUiActions.confirmMessage({ tempId, conversationId })
        );
      }
      // On success the socket will emit "message:received" which updates liveMessages
    },
    [conversationId, currentUserId, currentUserName, currentUserRole, replyTo, chatSocket, dispatch]
  );

  // ── Typing handlers ───────────────────────────────────────────────────────

  const handleTypingStart = useCallback(() => {
    if (conversationId) chatSocket.startTyping(conversationId);
  }, [conversationId, chatSocket]);

  const handleTypingStop = useCallback(() => {
    if (conversationId) chatSocket.stopTyping(conversationId);
  }, [conversationId, chatSocket]);

  // ── Delete message ────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (conversationId) chatSocket.deleteMessage(conversationId, messageId);
    },
    [conversationId, chatSocket]
  );

  return {
    messages,
    typingNames,
    isLoadingHistory,
    replyTo,
    setReplyTo,
    hasMore,
    loadMore,
    sendMessage,
    handleTypingStart,
    handleTypingStop,
    deleteMessage,
    socketConnected,
  };
}