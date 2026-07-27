// notification.slice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse } from "../types";

// Types
export interface Notification {
  _id: string;
  title: string;
  body: string;
  type: string;
  icon?: string;
  image?: string;
  unread: boolean;
  priority?: string;
  createdAt: string;
  typeId?: {
    orderId?: string;
    consultationId?: string;
    [key: string]: any;
  };
  actions?: Array<{ action: string; title: string }>;
  clickUrl?: string;
}

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

export interface NotificationListResponse {
  notifications: NotificationGroup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  unreadCount: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: string | null;
  unreadOnly?: boolean;
}

// API
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notifications", "UnreadCount"],
  endpoints: (builder) => ({
    // Get all notifications with pagination
    getNotifications: builder.query<ApiResponse<NotificationListResponse>, GetNotificationsParams>({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          type: params.type || undefined,
          unreadOnly: params.unreadOnly || undefined,
        },
      }),
      providesTags: ["Notifications"],
    }),

    // Get unread count
    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["UnreadCount"],
    }),

    // Mark a single notification as read
    markAsRead: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),

    // Track notification click
    trackClick: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/click`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),

    // Delete a notification
    deleteNotification: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
  }),
});

// Export hooks from the API
export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useTrackClickMutation,
  useDeleteNotificationMutation,
} = notificationApi;

export default notificationApi.reducer;