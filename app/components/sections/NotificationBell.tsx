'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  type Notification,
  type NotificationGroup,
} from '@/redux/slices/notification.slice';
import { formatTime } from '@/utils/function';
import { getIconForType } from '../config';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Queries
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery();
  const {
    data: notificationsData,
    isLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({ page, limit: 20 });

  // Mutations
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const unreadCount = unreadData?.data?.count || 0;
  const notifications = notificationsData?.data?.notifications || [];
  const hasMore = notificationsData?.data?.pagination
    ? notificationsData.data.pagination.page < notificationsData.data.pagination.pages
    : false;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refetch unread count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUnread();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchUnread]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId).unwrap();
    refetchUnread();
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

    // if (notification.clickUrl) {
    //   router.push(notification.clickUrl);
    // }
    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/dashboard/notifications');
  };

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
      // Reset loading state after fetch
      setTimeout(() => setIsLoadingMore(false), 500);
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
        aria-label="Notifications"
      >
        <Bell size={15} className="text-gray-500" />
        {unreadCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full animate-pulse" />
        ) : null}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[90vw] md:w-90 max-h-[480px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-[#7C3AED] text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#7C3AED] hover:text-[#d02b6c] transition-colors flex items-center gap-1"
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[350px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                <>
                  {notifications.map((group: NotificationGroup) => (
                    <div key={group.label}>
                      <div className="px-4 py-1.5 bg-gray-50 text-xs font-medium text-gray-500">
                        {group.label}
                      </div>
                      {group.notifications.map((notification: Notification) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                            notification.unread ? 'bg-pink-50/30' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Bell size={14} className={getIconForType(notification.type)} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                  {notification.title}
                                </p>
                                <button
                                  onClick={(e) => handleDelete(notification._id, e)}
                                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                {notification.body}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-gray-400">
                                  {getTimeLabel(notification.createdAt)}
                                </span>
                                {notification.unread ? (
                                  <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full" />
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}

                  {/* Load More */}
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="w-full py-2 text-xs text-[#7C3AED] hover:bg-gray-50 transition-colors border-t border-gray-100 disabled:opacity-50"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        'Load more'
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-xs text-[#7C3AED] hover:text-[#d02b6c] transition-colors font-medium"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}