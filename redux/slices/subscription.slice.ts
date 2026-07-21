import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import {
  SubscriptionPlan,
  Subscription,
  BillingHistory,
  SubscribePayload,
  ChangeMyPlanPayload,
  CancelSubscriptionPayload,
  UpdateAutoRenewPayload,
  GetBillingHistoryParams,
  ListPublicPlansParams,
  SubscriptionPaymentResponse,
  BillingInterval,
} from "@/redux/types/subscription";
import { ApiResponse } from "../types";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "user" }),
  tagTypes: [
    "MySubscription",
    "MyBillingHistory",
    "PublicPlans",
    "MyInvoice",
  ],

  endpoints: (builder) => ({

    /**
     * GET /api/v1/citizens/subscription/plans
     * Get all available subscription plans for users
     */
    listPublicPlans: builder.query<ApiResponse<SubscriptionPlan[]>, ListPublicPlansParams>({
      query: (params) => ({
        url: "/citizens/subscription/plans",
        method: "GET",
        params: {
          ...(params.interval && { interval: params.interval }),
        },
      }),
      providesTags: ["PublicPlans"],
    }),

    /**
     * GET /api/v1/citizens/subscription
     * Get the current user's subscription details
     */
    getMySubscription: builder.query<ApiResponse<Subscription>, void>({
      query: () => ({
        url: "/citizens/subscription",
        method: "GET",
      }),
      providesTags: ["MySubscription"],
    }),

    /**
     * POST /api/v1/citizens/subscription/subscribe
     * Subscribe to a plan
     */
    subscribe: builder.mutation<ApiResponse<SubscriptionPaymentResponse>, SubscribePayload>({
      query: (data) => ({
        url: "/citizens/subscription/subscribe",
        method: "POST",
        data,
      }),
      invalidatesTags: ["MySubscription", "MyBillingHistory"],
    }),

    /**
     * POST /api/v1/citizens/subscription/change-plan
     * Change to a different subscription plan
     */
    changePlan: builder.mutation<ApiResponse<SubscriptionPaymentResponse>, ChangeMyPlanPayload>({
      query: (data) => ({
        url: "/citizens/subscription/change-plan",
        method: "POST",
        data,
      }),
      invalidatesTags: ["MySubscription", "MyBillingHistory"],
    }),

    /**
     * POST /api/v1/citizens/subscription/cancel
     * Cancel the current subscription
     */
    cancelSubscription: builder.mutation<ApiResponse<{ message: string; subscription: Subscription }>, CancelSubscriptionPayload>({
      query: (data) => ({
        url: "/citizens/subscription/cancel",
        method: "POST",
        data,
      }),
      invalidatesTags: ["MySubscription"],
    }),

    /**
     * POST /api/v1/citizens/subscription/reactivate
     * Reactivate a cancelled subscription
     */
    reactivateSubscription: builder.mutation<ApiResponse<{ message: string; subscription: Subscription }>, void>({
      query: () => ({
        url: "/citizens/subscription/reactivate",
        method: "POST",
      }),
      invalidatesTags: ["MySubscription"],
    }),

    /**
     * PUT /api/v1/citizens/subscription/auto-renew
     * Update auto-renew setting
     */
    updateAutoRenew: builder.mutation<ApiResponse<{ autoRenew: boolean; subscription: Subscription }>, UpdateAutoRenewPayload>({
      query: (data) => ({
        url: "/citizens/subscription/auto-renew",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["MySubscription"],
    }),

    /**
     * GET /api/v1/citizens/billing-history
     * Get the user's billing history
     */
    getMyBillingHistory: builder.query<ApiResponse<BillingHistory[]>, GetBillingHistoryParams>({
      query: (params) => ({
        url: "/citizens/billing-history",
        method: "GET",
        params: {
          ...(params.page && { page: params.page }),
          ...(params.pageSize && { pageSize: params.pageSize }),
        },
      }),
      providesTags: ["MyBillingHistory"],
    }),

    /**
     * GET /api/v1/citizens/subscription/invoice/:invoiceId
     * Get a specific invoice by ID
     */
    getMyInvoice: builder.query<ApiResponse<BillingHistory>, string>({
      query: (invoiceId) => ({
        url: `/citizens/subscription/invoice/${invoiceId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MyInvoice", id }],
    }),

  }),
});

// Export hooks
export const {
  // Public plans
  useListPublicPlansQuery,
  
  // Subscription management
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useChangePlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useUpdateAutoRenewMutation,
  
  // Billing
  useGetMyBillingHistoryQuery,
  useGetMyInvoiceQuery,
} = subscriptionApi;