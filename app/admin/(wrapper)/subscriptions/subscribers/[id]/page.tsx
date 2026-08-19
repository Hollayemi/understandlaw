"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import {
  useAdminGetSubscriberByIdQuery,
  useAdminDeleteSubscriberMutation,
} from "@/redux/slices/admin/subscription.slice";
import { showSuccess, showError } from "@/app/components/ui/sonner";

export default function SubscriberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriberId = params.id as string;

  const { data: subscriberData, isLoading } = useAdminGetSubscriberByIdQuery(subscriberId);
  const [deleteSubscriber, { isLoading: isDeleting }] = useAdminDeleteSubscriberMutation();

  const subscriber = subscriberData?.data;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await deleteSubscriber(subscriberId).unwrap();
      showSuccess("Subscription deleted successfully!");
      router.push("/admin/subscriptions");
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete subscription");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelled': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'expired': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-maroon-500" />
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Subscriber not found</p>
        <Link
          href="/admin/subscriptions"
          className="text-maroon-500 hover:underline mt-2"
        >
          Back to subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/subscriptions"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              #{subscriber.id?.slice(0, 8)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
          Cancel Subscription
        </button>
      </div>

      {/* Status */}
      <div className="mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(subscriber.status)}`}>
          {subscriber.status?.toUpperCase() || 'UNKNOWN'}
        </span>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{subscriber?.userId?.lastName || 'N/A'}</p>
              <p className="text-xs text-gray-500">User ID: {subscriber?.userId?.id || 'N/A'}</p>
            </div>
          </div>
          {subscriber?.userId?.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700">{subscriber?.userId?.email }</p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Subscription Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-sm font-medium text-gray-900">{subscriber.planName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-sm font-medium text-gray-900">₦{subscriber.price?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Interval</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{subscriber.interval || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Started</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(subscriber.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Renews / Expires</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(subscriber.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Auto-Renew</p>
              <p className="text-sm font-medium text-gray-900">
                {subscriber.autoRenew ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/subscriptions"
          className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Back
        </Link>
      </div>
    </div>
  );
}