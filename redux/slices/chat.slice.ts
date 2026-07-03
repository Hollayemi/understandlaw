import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "@/redux/shared/axiosBaseQuery";

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ParticipantRole = "citizen" | "lawyer" | "admin";
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "image" | "file" | "system";
export type ConversationStatus = "active" | "closed" | "archived";

export interface IAttachment {
  url: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderRole: ParticipantRole;
  senderName: string;
  type: MessageType;
  content: string;
  attachments: IAttachment[];
  status: MessageStatus;
  readBy: { userId: string; readAt: string }[];
  isDeleted: boolean;
  deletedAt?: string;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
  // Optimistic UI helper
  _pending?: boolean;
  _failed?: boolean;
}

export interface IParticipant {
  userId: string;
  role: ParticipantRole;
  name: string;
  avatarUrl?: string;
  joinedAt: string;
  lastSeenAt?: string;
  isOnline?: boolean;
  unreadCount: number;
}

export interface IConversation {
  _id: string;
  contextType?: string;
  contextId?: string;
  participants: IParticipant[];
  status: ConversationStatus;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    type: MessageType;
    createdAt: string;
  };
  lastActivityAt: string;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IPresence {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

interface ApiOk<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── RTK Query API ────────────────────────────────────────────────────────────

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery({ defaultActor: "user" }),
  tagTypes: ["Conversations", "Conversation", "Messages", "Presence"],

  endpoints: (builder) => ({
    // GET /chat/conversations
    getConversations: builder.query<
      ApiOk<{ conversations: IConversation[]; total: number }>,
      { status?: ConversationStatus; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/chat/conversations",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Conversations", id: "LIST" }],
    }),

    // POST /chat/conversations  (find or create)
    createConversation: builder.mutation<
      ApiOk<{ conversation: IConversation; created: boolean }>,
      {
        targetUserId: string;
        targetUserName: string;
        targetUserRole: ParticipantRole;
        targetAvatarUrl?: string;
        contextType?: string;
        contextId?: string;
        metadata?: Record<string, unknown>;
      }
    >({
      query: (data) => ({
        url: "/chat/conversations",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }],
    }),

    // GET /chat/conversations/:id
    getConversation: builder.query<ApiOk<{ conversation: IConversation }>, string>({
      query: (id) => ({ url: `/chat/conversations/${id}`, method: "GET" }),
      providesTags: (r, e, id) => [{ type: "Conversation", id }],
    }),

    // GET /chat/conversations/:id/messages
    getMessages: builder.query<
      ApiOk<{ messages: IMessage[] }>,
      { conversationId: string; before?: string; limit?: number, isAdmin?: boolean }
    >({
      query: ({ conversationId, before, limit, isAdmin }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "GET",
        endpointActor: !isAdmin ? "user" : "admin",
        params: { before, limit },
      }),
      providesTags: (r, e, { conversationId }) => [{ type: "Messages", id: conversationId }],
    }),

    // GET /chat/conversations/:id/presence
    getConversationPresence: builder.query<
      ApiOk<{ presence: Record<string, IPresence> }>,
      string
    >({
      query: (id) => ({ url: `/chat/conversations/${id}/presence`, method: "GET" }),
      providesTags: (r, e, id) => [{ type: "Presence", id }],
    }),

    // GET /chat/presence?userIds=a,b,c
    getPresence: builder.query<
      ApiOk<{ presence: Record<string, IPresence> }>,
      string[]
    >({
      query: (userIds) => ({
        url: "/chat/presence",
        method: "GET",
        params: { userIds: userIds.join(",") },
      }),
      providesTags: ["Presence"],
    }),

    // POST /chat/conversations/:id/close  (admin)
    closeConversation: builder.mutation<ApiOk<null>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/chat/conversations/${id}/close`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (r, e, { id }) => [
        { type: "Conversation", id },
        { type: "Conversations", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useGetConversationPresenceQuery,
  useGetPresenceQuery,
  useCloseConversationMutation,
} = chatApi;

// ─── Local UI Slice ───────────────────────────────────────────────────────────
// Stores real-time socket state: live messages, typing, presence.
// This is updated directly by the socket hook — NOT by RTK Query.

interface ChatUiState {
  // activeConversationId: which chat room is open
  activeConversationId: string | null;

  // Live messages keyed by conversationId
  // Merged with the REST-fetched history so new messages appear immediately
  liveMessages: Record<string, IMessage[]>;

  // Typing indicators  { [conversationId]: { [userId]: userName } }
  typing: Record<string, Record<string, string>>;

  // Presence map  { [userId]: IPresence }
  presence: Record<string, IPresence>;

  // Unread counts per conversation (drives the badge in the sidebar)
  unread: Record<string, number>;

  // Socket connection state
  socketConnected: boolean;
  socketError: string | null;
}

const initialState: ChatUiState = {
  activeConversationId: null,
  liveMessages: {},
  typing: {},
  presence: {},
  unread: {},
  socketConnected: false,
  socketError: null,
};

export const chatUiSlice = createSlice({
  name: "chatUi",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      if (action.payload) {
        state.unread[action.payload] = 0;
      }
    },

    // Called when socket receives "message:received"
   receiveMessage(state, action: PayloadAction<{ message: IMessage; conversationId: string }>) {
  const { message, conversationId } = action.payload;
  if (!state.liveMessages[conversationId]) {
    state.liveMessages[conversationId] = [];
  }
  // Deduplicate by _id AND by checking if a confirmed message already exists
  const exists = state.liveMessages[conversationId].some(
    m => m._id === message._id || 
    (m._id === message._id.toString()) // handle ObjectId vs string mismatch
  );
  if (!exists) {
    state.liveMessages[conversationId].push(message);
  }
  if (state.activeConversationId !== conversationId) {
    state.unread[conversationId] = (state.unread[conversationId] ?? 0) + 1;
  }
},
    // Optimistic send — adds a pending message immediately
    optimisticSend(state, action: PayloadAction<IMessage>) {
      const msg = action.payload;
      const cid = msg.conversationId;
      if (!state.liveMessages[cid]) state.liveMessages[cid] = [];
      state.liveMessages[cid].push(msg);
    },

    // Replace a pending message with the confirmed one (or mark failed)
    confirmMessage(
  state,
  action: PayloadAction<{ tempId: string; conversationId: string; confirmed?: IMessage }>
) {
  const { tempId, conversationId, confirmed } = action.payload;
  const msgs = state.liveMessages[conversationId];
  if (!msgs) return;
  const idx = msgs.findIndex(m => m._id === tempId);
  if (idx === -1) return;
  if (confirmed) {
    msgs[idx] = { ...confirmed, _pending: false };
  } else {
    msgs[idx] = { ...msgs[idx], _failed: true, _pending: false };
  }
},

    // Merge REST history into liveMessages (called after getMessages)
    hydrateMessages(
      state,
      action: PayloadAction<{ conversationId: string; messages: IMessage[] }>
    ) {
      const { conversationId, messages } = action.payload;
      const existing = state.liveMessages[conversationId] ?? [];
      const existingIds = new Set(existing.map(m => m._id));
      const newOnes = messages.filter(m => !existingIds.has(m._id));
      // History goes at the front; live messages at the back
      state.liveMessages[conversationId] = [...newOnes, ...existing];
    },

    deleteMessage(
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) {
      const { conversationId, messageId } = action.payload;
      const msgs = state.liveMessages[conversationId];
      if (!msgs) return;
      const idx = msgs.findIndex(m => m._id === messageId);
      if (idx !== -1) {
        msgs[idx] = { ...msgs[idx], isDeleted: true, content: "[Message deleted]" };
      }
    },

    setTyping(
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        userName: string;
        isTyping: boolean;
      }>
    ) {
      const { conversationId, userId, userName, isTyping } = action.payload;
      if (!state.typing[conversationId]) state.typing[conversationId] = {};
      if (isTyping) {
        state.typing[conversationId][userId] = userName;
      } else {
        delete state.typing[conversationId][userId];
      }
    },

    updatePresence(state, action: PayloadAction<IPresence>) {
      state.presence[action.payload.userId] = action.payload;
    },

    bulkUpdatePresence(state, action: PayloadAction<Record<string, IPresence>>) {
      Object.assign(state.presence, action.payload);
    },

    updateMessageStatus(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageIds: string[];
        status: MessageStatus;
      }>
    ) {
      const { conversationId, messageIds, status } = action.payload;
      const msgs = state.liveMessages[conversationId];
      if (!msgs) return;
      const idSet = new Set(messageIds);
      msgs.forEach(m => {
        if (idSet.has(m._id)) m.status = status;
      });
    },

    setSocketConnected(state, action: PayloadAction<boolean>) {
      state.socketConnected = action.payload;
      if (action.payload) state.socketError = null;
    },

    setSocketError(state, action: PayloadAction<string | null>) {
      state.socketError = action.payload;
    },

    clearUnread(state, action: PayloadAction<string>) {
      state.unread[action.payload] = 0;
    },

    resetChat(state) {
      return initialState;
    },
  },
});

export const chatUiActions = chatUiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectActiveConversationId = (s: any) =>
  (s.chatUi as ChatUiState).activeConversationId;

export const selectLiveMessages = (conversationId: string) => (s: any) =>
  (s.chatUi as ChatUiState).liveMessages[conversationId] ?? [];

export const selectTyping = (conversationId: string) => (s: any) => {
  const t = (s.chatUi as ChatUiState).typing[conversationId] ?? {};
  return Object.values(t);
};

export const selectPresence = (userId: string) => (s: any) =>
  (s.chatUi as ChatUiState).presence[userId];

export const selectUnread = (conversationId: string) => (s: any) =>
  (s.chatUi as ChatUiState).unread[conversationId] ?? 0;

export const selectTotalUnread = (s: any) =>
  Object.values((s.chatUi as ChatUiState).unread).reduce((a: number, b) => a + (b as number), 0);

export const selectSocketConnected = (s: any) =>
  (s.chatUi as ChatUiState).socketConnected;