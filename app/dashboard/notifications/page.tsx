// app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  X,
  ChevronLeft,
  Clock,
  Eye,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useTrackClickMutation,
  type Notification,
  type NotificationGroup,
} from '@/redux/slices/notification.slice';
import { getIconForType } from '@/app/components/config';
import { formatTime } from '@/utils/function';

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');

  // Queries
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery();
  const {
    data: notificationsData,
    isLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({
    page,
    limit: 20,
    unreadOnly: selectedFilter === 'unread',
  });

  // Mutations
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [trackClick] = useTrackClickMutation();

  const unreadCount = unreadData?.data?.count || 0;
  const notifications = notificationsData?.data?.notifications || [];
  const pagination = notificationsData?.data?.pagination;
  const hasMore = pagination ? pagination.page < pagination.pages : false;
  const total = pagination?.total || 0;

  // Refetch unread count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUnread();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchUnread]);

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notificationId).unwrap();
    refetchUnread();
    refetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead().unwrap();
    refetchUnread();
    refetchNotifications();
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notificationId).unwrap();
    refetchUnread();
    refetchNotifications();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.unread) {
      await markAsRead(notification._id).unwrap();
      refetchUnread();
    }

    await trackClick(notification._id).unwrap();

    if (notification.clickUrl) {
      // router.push(notification.clickUrl);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const getTimeLabel = (date: string) => {
    try {
      return formatTime(date);
    } catch {
      return '';
    }
  };


  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      {/* Header */}
      <div className="sticky bg-[#F5F2EE] top-14 md:top-0 z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#E8317A] text-white px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#E8317A] hover:text-[#d02b6c] transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-pink-50"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 pb-3">
            <button
              onClick={() => {
                setSelectedFilter('all');
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-[#E8317A] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
              {selectedFilter === 'all' && total > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({total})</span>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedFilter('unread');
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedFilter === 'unread'
                  ? 'bg-[#E8317A] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread
              {selectedFilter === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({unreadCount})</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {isLoading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#E8317A] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-700">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedFilter === 'unread'
                ? "You don't have any unread notifications"
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <>
            {notifications.map((group: NotificationGroup, groupIndex: number) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
                className="mb-4"
              >
                <div className="text-xs font-medium text-gray-500 mb-2 px-1">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.notifications.map((notification: Notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`bg-white rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                        notification.unread
                          ? 'border-pink-200 shadow-sm'
                          : 'border-gray-100'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.unread ? 'bg-pink-50' : 'bg-gray-50'
                            }`}
                          >
                            <Bell size={14} className={getIconForType(notification.type)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {notification.body}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {notification.unread ? (
                                  <span className="w-2 h-2 bg-[#E8317A] rounded-full" />
                                ): null}
                                <button
                                  onClick={(e) => handleDelete(notification._id, e)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label="Delete notification"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">
                                  {getTimeLabel(notification.createdAt)}
                                </span>
                                {notification.unread ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(notification._id, e);
                                    }}
                                    className="text-xs text-[#E8317A] hover:text-[#d02b6c] transition-colors flex items-center gap-1"
                                  >
                                    <Eye size={12} />
                                    Mark as read
                                  </button>
                                ): null}
                              </div>
                              {notification.clickUrl && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <span>View</span>
                                  <ChevronLeft size={12} className="rotate-180" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 text-sm text-[#E8317A] hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#E8317A] border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    'Load more notifications'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}