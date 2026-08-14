// app/(admin)/admin/subscriptions/page.tsx

"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  useAdminListPlansQuery,
  useAdminGetSubscriptionStatsQuery,
  useAdminListSubscribersQuery,
  useAdminListInvoicesQuery,
} from "@/redux/slices/admin/subscription.slice";

type TabType = "overview" | "plans" | "subscribers" | "invoices";

export default function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch data
  const { data: statsData, isLoading: isLoadingStats } = useAdminGetSubscriptionStatsQuery();
  const { data: plansData, isLoading: isLoadingPlans } = useAdminListPlansQuery({ 
    page, 
    pageSize,
    search: searchTerm || undefined,
  });
  const { data: subscribersData, isLoading: isLoadingSubscribers } = useAdminListSubscribersQuery({
    page,
    pageSize,
    search: searchTerm || undefined,
  });
  const { data: invoicesData, isLoading: isLoadingInvoices } = useAdminListInvoicesQuery({
    page,
    pageSize,
    search: searchTerm || undefined,
  });

  const stats = statsData?.data;
  const plans = plansData?.data?.data || [];
  const subscribers = subscribersData?.data?.data || [];
  const invoices = invoicesData?.data?.data || [];
  const totalPages = plansData?.data?.totalPages || 1;

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "plans", label: "Plans", icon: CreditCard },
    { id: "subscribers", label: "Subscribers", icon: Users },
    { id: "invoices", label: "Invoices", icon: FileText },
  ];

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
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage subscription plans, subscribers, and billing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/subscriptions/plans/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-[#d02a6e] transition-colors"
          >
            <Plus size={16} />
            Create Plan
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F97316] transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{stats?.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <DollarSign size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">This month</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.activeSubscribers || 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {stats?.activeSubscribers || 0}% of total
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalSubscribers || 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Users size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {stats?.activePlans || 0}% growth
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalPlans || 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard size={20} className="text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {stats?.activePlans || 0} active plans
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Subscribers */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Subscribers</h3>
              <div className="space-y-3">
                {subscribers.slice(0, 5).map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.userName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{sub.planName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(sub.status)}`}>
                      {sub.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No subscribers yet</p>
                )}
              </div>
              <Link
                href="/admin/subscriptions?tab=subscribers"
                className="block text-center text-sm text-[#F97316] font-semibold hover:underline mt-4"
              >
                View all subscribers →
              </Link>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Invoices</h3>
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(invoice.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₦{invoice.amount?.toLocaleString() || 0}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No invoices yet</p>
                )}
              </div>
              <Link
                href="/admin/subscriptions?tab=invoices"
                className="block text-center text-sm text-[#F97316] font-semibold hover:underline mt-4"
              >
                View all invoices →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Interval</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribers</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan: any) => (
                  <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-gray-900">₦{plan.price?.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 capitalize">{plan.interval}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{plan.subscriberCount || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${plan.isActive ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/subscriptions/plans/${plan.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97316] hover:bg-pink-50 transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/subscriptions/plans/${plan.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No plans found. Create your first plan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Started</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Renews</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub: any) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sub.userName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{sub.userEmail || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{sub.planName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{formatDate(sub.startDate)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{formatDate(sub.endDate)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(sub.status)}`}>
                        {sub.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/subscriptions/subscribers/${sub.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97316] hover:bg-pink-50 transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-mono text-gray-600">#{invoice.id?.slice(0, 8)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{invoice.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-gray-900">₦{invoice.amount?.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{invoice.paymentMethod || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/subscriptions/invoices/${invoice.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97316] hover:bg-pink-50 transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        {invoice.invoiceUrl && (
                          <a
                            href={invoice.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <FileText size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}