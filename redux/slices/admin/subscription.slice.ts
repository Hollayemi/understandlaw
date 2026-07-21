import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import {
  SubscriptionPlan,
  Subscription,
  BillingHistory,
  SubscriptionStats,
  ListPlansParams,
  CreatePlanPayload,
  UpdatePlanPayload,
  ListSubscribersParams,
  UpdateSubscriberPayload,
  ListInvoicesParams,
  UpdateInvoicePayload,
} from "@/redux/types/subscription";
import { ApiResponse, PaginatedResponse } from "../types";

export const adminSubscriptionApi = createApi({
  reducerPath: "adminSubscriptionApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "admin" }),
  tagTypes: [
    "AdminPlans",
    "AdminPlanDetail",
    "AdminSubscribers",
    "AdminSubscriberDetail",
    "AdminInvoices",
    "AdminInvoiceDetail",
    "AdminSubscriptionStats",
  ],

  endpoints: (builder) => ({
    // Plans endpoints
    adminListPlans: builder.query<PaginatedResponse<SubscriptionPlan[]>, ListPlansParams>({
      query: (params) => ({
        url: "/admin/subscriptions/plans",
        method: "GET",
        params,
      }),
      providesTags: ["AdminPlans"],
    }),

    adminGetSubscriptionStats: builder.query<ApiResponse<SubscriptionStats>, void>({
      query: () => ({
        url: "/admin/subscriptions/stats",
        method: "GET",
      }),
      providesTags: ["AdminSubscriptionStats"],
    }),

    adminGetPlanById: builder.query<ApiResponse<SubscriptionPlan>, string>({
      query: (planId) => ({
        url: `/admin/subscriptions/plans/${planId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminPlanDetail", id }],
    }),

    adminCreatePlan: builder.mutation<ApiResponse<SubscriptionPlan>, CreatePlanPayload>({
      query: (payload) => ({
        url: "/admin/subscriptions/plans",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["AdminPlans", "AdminSubscriptionStats"],
    }),

    adminUpdatePlan: builder.mutation<ApiResponse<SubscriptionPlan>, UpdatePlanPayload>({
      query: ({ id, updates }) => ({
        url: `/admin/subscriptions/plans/${id}`,
        method: "PATCH",
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminPlans",
        "AdminSubscriptionStats",
        { type: "AdminPlanDetail", id },
      ],
    }),

    adminDeletePlan: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (planId) => ({
        url: `/admin/subscriptions/plans/${planId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminPlans", "AdminSubscriptionStats"],
    }),

    // Subscribers endpoints
    adminListSubscribers: builder.query<PaginatedResponse<Subscription[]>, ListSubscribersParams>({
      query: (params) => ({
        url: "/admin/subscriptions/subscribers",
        method: "GET",
        params,
      }),
      providesTags: ["AdminSubscribers"],
    }),

    adminGetSubscriberById: builder.query<ApiResponse<Subscription>, string>({
      query: (subscriptionId) => ({
        url: `/admin/subscriptions/subscribers/${subscriptionId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminSubscriberDetail", id }],
    }),

    adminUpdateSubscriber: builder.mutation<ApiResponse<Subscription>, UpdateSubscriberPayload>({
      query: ({ id, updates }) => ({
        url: `/admin/subscriptions/subscribers/${id}`,
        method: "PATCH",
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminSubscribers",
        "AdminSubscriptionStats",
        { type: "AdminSubscriberDetail", id },
      ],
    }),

    adminDeleteSubscriber: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (subscriptionId) => ({
        url: `/admin/subscriptions/subscribers/${subscriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminSubscribers", "AdminSubscriptionStats"],
    }),

    // Invoices endpoints
    adminListInvoices: builder.query<PaginatedResponse<BillingHistory[]>, ListInvoicesParams>({
      query: (params) => ({
        url: "/admin/subscriptions/invoices",
        method: "GET",
        params,
      }),
      providesTags: ["AdminInvoices"],
    }),

    adminGetInvoiceById: builder.query<ApiResponse<BillingHistory>, string>({
      query: (invoiceId) => ({
        url: `/admin/subscriptions/invoices/${invoiceId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminInvoiceDetail", id }],
    }),

    adminUpdateInvoice: builder.mutation<ApiResponse<BillingHistory>, UpdateInvoicePayload>({
      query: ({ id, updates }) => ({
        url: `/admin/subscriptions/invoices/${id}`,
        method: "PATCH",
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminInvoices",
        { type: "AdminInvoiceDetail", id },
      ],
    }),

    adminDeleteInvoice: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (invoiceId) => ({
        url: `/admin/subscriptions/invoices/${invoiceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminInvoices"],
    }),
  }),
});

// Export hooks
export const {

  // Plans
  useAdminListPlansQuery,
  useAdminGetSubscriptionStatsQuery,
  useAdminGetPlanByIdQuery,
  useAdminCreatePlanMutation,
  useAdminUpdatePlanMutation,
  useAdminDeletePlanMutation,

  // Subscribers
  useAdminListSubscribersQuery,
  useAdminGetSubscriberByIdQuery,
  useAdminUpdateSubscriberMutation,
  useAdminDeleteSubscriberMutation,

  // Invoices
  useAdminListInvoicesQuery,
  useAdminGetInvoiceByIdQuery,
  useAdminUpdateInvoiceMutation,
  useAdminDeleteInvoiceMutation,

} = adminSubscriptionApi;