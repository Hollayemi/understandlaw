"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import {
  chatUiActions,
  IMessage,
  IPresence,
  MessageStatus,
  MessageType,
  IAttachment,
} from "@/redux/slices/chat.slice";
import { server } from "@/redux/shared/backendUrl";

const SERVER_URL = server; // imported from redux/shared/backendUrl.ts

interface UseChatSocketOptions {
  token: string | null;
  /** ms between heartbeat pings. Default 20 000 */
  heartbeatInterval?: number;
}

interface SendMessageParams {
  conversationId: string;
  content: string;
  type?: MessageType;
  attachments?: IAttachment[];
  replyTo?: string;
}

export interface ChatSocket {
  /** Whether the socket is currently connected */
  connected: boolean;
  /** Join a conversation room to start receiving its messages */
  joinConversation: (conversationId: string) => void;
  /** Leave a conversation room */
  leaveConversation: (conversationId: string) => void;
  /** Send a message (returns a promise that resolves with the server ack) */
  sendMessage: (params: SendMessageParams) => Promise<{ success: boolean; messageId?: string }>;
  /** Fetch paginated message history for a conversation */
  fetchHistory: (
    conversationId: string,
    opts?: { before?: string; limit?: number }
  ) => Promise<IMessage[]>;
  /** Emit typing:start */
  startTyping: (conversationId: string) => void;
  /** Emit typing:stop */
  stopTyping: (conversationId: string) => void;
  /** Mark messages as read */
  markRead: (conversationId: string, messageIds: string[]) => void;
  /** Delete a message (soft delete — sender only) */
  deleteMessage: (conversationId: string, messageId: string) => void;
  /** Query presence for a list of userIds */
  getPresence: (userIds: string[]) => void;
  /** Raw socket (for advanced use) */
  socket: Socket | null;
}

/** Singleton socket reference shared across hook calls */
let _socket: Socket | null = null;

export function useChatSocket({
  token,
  heartbeatInterval = 20_000,
}: UseChatSocketOptions): ChatSocket {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const joinedRooms = useRef<Set<string>>(new Set());

  // ─── Connect ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) return;

    // Reuse singleton if already connected with same token
    if (_socket?.connected) {
      socketRef.current = _socket;
      dispatch(chatUiActions.setSocketConnected(true));
      return;
    }

    const socket = io(SERVER_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    _socket = socket;
    socketRef.current = socket;

    // ── Connection lifecycle ────────────────────────────────────────────────

    socket.on("connect", () => {
      dispatch(chatUiActions.setSocketConnected(true));
      // Rejoin any rooms we were in before reconnect
      joinedRooms.current.forEach(id => {
        socket.emit("conversation:join", { conversationId: id });
      });
    });

    socket.on("disconnect", () => {
      dispatch(chatUiActions.setSocketConnected(false));
    });

    socket.on("connect_error", (err) => {
      dispatch(chatUiActions.setSocketError(err.message));
      dispatch(chatUiActions.setSocketConnected(false));
    });

    // ── Message events ──────────────────────────────────────────────────────

    socket.on(
      "message:received",
      ({ message, conversationId }: { message: IMessage; conversationId: string }) => {
        dispatch(chatUiActions.receiveMessage({ message, conversationId }));
      }
    );

    socket.on(
      "message:status_updated",
      ({
        conversationId,
        messageIds,
        status,
      }: {
        conversationId: string;
        messageIds: string[];
        status: MessageStatus;
        userId: string;
      }) => {
        dispatch(chatUiActions.updateMessageStatus({ conversationId, messageIds, status }));
      }
    );

    socket.on(
      "message:deleted",
      ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
        dispatch(chatUiActions.deleteMessage({ conversationId, messageId }));
      }
    );

    socket.on(
      "messages:delivered",
      ({ conversationId }: { conversationId: string }) => {
        // Bulk mark delivered — we don't need granular IDs here
        dispatch(
          chatUiActions.updateMessageStatus({
            conversationId,
            messageIds: [],  // handled server-side
            status: "delivered",
          })
        );
      }
    );

    // ── Typing events ───────────────────────────────────────────────────────

    socket.on(
      "typing",
      ({
        conversationId,
        userId,
        userName,
        isTyping,
      }: {
        conversationId: string;
        userId: string;
        userName: string;
        isTyping: boolean;
      }) => {
        dispatch(chatUiActions.setTyping({ conversationId, userId, userName, isTyping }));
        // Auto-clear typing after 4 seconds (safety net if stop event is missed)
        if (isTyping) {
          setTimeout(() => {
            dispatch(
              chatUiActions.setTyping({ conversationId, userId, userName, isTyping: false })
            );
          }, 4000);
        }
      }
    );

    // ── Presence events ─────────────────────────────────────────────────────

    socket.on("presence:update", (p: IPresence) => {
      dispatch(chatUiActions.updatePresence(p));
    });

    // ── Heartbeat ───────────────────────────────────────────────────────────

    heartbeatRef.current = setInterval(() => {
      if (socket.connected) socket.emit("heartbeat");
    }, heartbeatInterval);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      // Don't disconnect on unmount — keep alive for navigation
      // The singleton will be cleaned up on logout
    };
  }, [token, dispatch, heartbeatInterval]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const joinConversation = useCallback((conversationId: string) => {
    joinedRooms.current.add(conversationId);
    socketRef.current?.emit("conversation:join", { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    joinedRooms.current.delete(conversationId);
    socketRef.current?.emit("conversation:leave", { conversationId });
  }, []);

  const sendMessage = useCallback(
    (params: SendMessageParams): Promise<{ success: boolean; messageId?: string }> => {
      return new Promise((resolve) => {
        if (!socketRef.current?.connected) {
          resolve({ success: false });
          return;
        }
        socketRef.current.emit("message:send", params, (ack: any) => {
          resolve(ack ?? { success: false });
        });
      });
    },
    []
  );

  const fetchHistory = useCallback(
    (
      conversationId: string,
      opts?: { before?: string; limit?: number }
    ): Promise<IMessage[]> => {
      return new Promise((resolve) => {
        if (!socketRef.current?.connected) {
          resolve([]);
          return;
        }
        socketRef.current.emit(
          "message:history",
          { conversationId, ...opts },
          (res: { success: boolean; messages: IMessage[] }) => {
            resolve(res?.messages ?? []);
          }
        );
      });
    },
    []
  );

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing:start", { conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing:stop", { conversationId });
  }, []);

  const markRead = useCallback((conversationId: string, messageIds: string[]) => {
    if (!messageIds.length) return;
    socketRef.current?.emit("message:read", { conversationId, messageIds });
    dispatch(chatUiActions.clearUnread(conversationId));
  }, [dispatch]);

  const deleteMessage = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit("message:delete", { conversationId, messageId }, () => {});
  }, []);

  const getPresence = useCallback((userIds: string[]) => {
    socketRef.current?.emit("presence:get", userIds, (res: { presence: Record<string, IPresence> }) => {
      if (res?.presence) {
        dispatch(chatUiActions.bulkUpdatePresence(res.presence));
      }
    });
  }, [dispatch]);

  return {
    connected: socketRef.current?.connected ?? false,
    joinConversation,
    leaveConversation,
    sendMessage,
    fetchHistory,
    startTyping,
    stopTyping,
    markRead,
    deleteMessage,
    getPresence,
    socket: socketRef.current,
  };
}

/** Call this on logout to fully disconnect */
export function disconnectChatSocket() {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}