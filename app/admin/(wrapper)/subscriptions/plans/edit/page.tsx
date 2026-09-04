"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useAdminGetPlanByIdQuery,
  useAdminUpdatePlanMutation,
} from "@/redux/slices/admin/subscription.slice";
import { showSuccess, showError } from "@/app/components/ui/sonner";

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { data: planData, isLoading: isLoadingPlan } = useAdminGetPlanByIdQuery(planId);
  const [updatePlan, { isLoading: isUpdating }] = useAdminUpdatePlanMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    interval: "monthly" as "monthly" | "yearly",
    features: [""],
    isActive: true,
    isPopular: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load plan data
  useEffect(() => {
    if (planData?.data) {
      const plan = planData.data;
      setForm({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0,
        interval: plan.interval || "monthly",
        features: plan.features || [""],
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        isPopular: plan.isPopular || false,
      });
    }
  }, [planData]);

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm((prev) => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Plan name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!form.interval) newErrors.interval = "Interval is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.features.some(f => !f.trim())) newErrors.features = "All features must have text";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updatePlan({
        id: planId,
        updates: {
          ...form,
          features: form.features.filter(f => f.trim()),
        },
      }).unwrap();
      showSuccess("Plan updated successfully!");
      router.push(`/admin/subscriptions/plans/${planId}`);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update plan");
    }
  };

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-maroon-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/subscriptions/plans/${planId}`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update subscription plan details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Same form fields as create page */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="e.g. Professional Plan"
              className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none focus:border-maroon-500 transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Describe what this plan offers..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-maroon-500 transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (NGN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateForm("price", parseFloat(e.target.value) || 0)}
                placeholder="e.g. 5000"
                min="0"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none focus:border-maroon-500 transition-colors"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interval <span className="text-red-500">*</span>
              </label>
              <select
                value={form.interval}
                onChange={(e) => updateForm("interval", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none focus:border-maroon-500 transition-colors bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.interval && (
                <p className="text-xs text-red-500 mt-1">{errors.interval}</p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Features</h3>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-1.5 text-sm text-maroon-500 hover:text-[#d02a6e] font-medium"
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>

          <div className="space-y-2">
            {form.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none focus:border-maroon-500 transition-colors"
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {errors.features && (
              <p className="text-xs text-red-500 mt-1">{errors.features}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Options</h3>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateForm("isActive", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => updateForm("isPopular", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
              />
              <span className="text-sm text-gray-700">Popular (show badge)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/admin/subscriptions/plans/${planId}`}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-maroon-500 text-white text-sm font-semibold hover:bg-[#d02a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isUpdating ? "Updating..." : "Update Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}