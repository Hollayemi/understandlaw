"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useAdminGetPlanByIdQuery,
  useAdminDeletePlanMutation,
} from "@/redux/slices/admin/subscription.slice";
import { showSuccess, showError } from "@/app/components/ui/sonner";

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { data: planData, isLoading } = useAdminGetPlanByIdQuery(planId);
  const [deletePlan, { isLoading: isDeleting }] = useAdminDeletePlanMutation();

  const plan = planData?.data;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await deletePlan(planId).unwrap();
      showSuccess("Plan deleted successfully!");
      router.push("/admin/subscriptions");
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete plan");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[#F97316]" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Plan not found</p>
        <Link
          href="/admin/subscriptions"
          className="text-[#F97316] hover:underline mt-2"
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
            <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/subscriptions/plans/${planId}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Edit size={16} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-gray-900">₦{plan.price?.toLocaleString()}</p>
            </div>
            <DollarSign size={20} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Interval</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{plan.interval}</p>
            </div>
            <Clock size={20} className="text-blue-600" />
          </div>
        </div>

        {/* <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subscribers</p>
              <p className="text-xl font-bold text-gray-900">{plan.subscriberCount || 0}</p>
            </div>
            <Users size={20} className="text-purple-600" />
          </div>
        </div> */}

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {plan.isActive ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className={`text-sm font-semibold ${plan.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
        <ul className="space-y-2">
          {plan.features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
          {(!plan.features || plan.features.length === 0) && (
            <p className="text-sm text-gray-500">No features listed</p>
          )}
        </ul>
      </div>

      {/* Badges */}
      <div className="flex gap-4">
        {plan.isPopular && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-[#F97316] border border-pink-200">
            Popular
          </span>
        )}
      </div>
    </div>
  );
}