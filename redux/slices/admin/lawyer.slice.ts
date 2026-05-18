import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import {
  LawyerFull,
  ListLawyersParams,
  AdvanceVerificationPayload,
  RejectVerificationPayload,
  VerifyDocumentPayload,
  UpdateLawyerStatusPayload,
  EmailLawyerPayload,
  ApiResponse,
  PaginatedLawyers,
  LawyerStats,
} from "@/redux/types/lawyer"

export const adminLawyerApi = createApi({
  reducerPath: "adminLawyerApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "admin" }),
  tagTypes: ["LawyerProfile", "LawyerList", "LawyerStats"],

  endpoints: (builder) => ({

    adminListLawyers: builder.query<ApiResponse<PaginatedLawyers>, ListLawyersParams>({
      query: (params) => ({
        url: "/admin/lawyers",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerList"],
    }),

    adminGetLawyerStats: builder.query<ApiResponse<LawyerStats>, void>({
      query: () => ({ url: "/admin/lawyers/stats", method: "GET" }),
      providesTags: ["LawyerStats"],
    }),

    adminGetLawyerById: builder.query<ApiResponse<LawyerFull>, string>({
      query: (profileId) => ({
        url: `/admin/lawyers/${profileId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LawyerProfile", id }],
    }),

    adminAdvanceVerification: builder.mutation<ApiResponse<LawyerFull>, AdvanceVerificationPayload>({
      query: ({ profileId, note }) => ({
        url: `/admin/lawyers/${profileId}/verification/advance`,
        method: "POST",
        data: { note },
      }),
      invalidatesTags: (result, error, { profileId }) => [
        "LawyerList",
        "LawyerStats",
        { type: "LawyerProfile", id: profileId },
      ],
    }),

    adminRejectVerification: builder.mutation<ApiResponse<LawyerFull>, RejectVerificationPayload>({
      query: ({ profileId, reason, infoNeeded }) => ({
        url: `/admin/lawyers/${profileId}/verification/reject?infoNeeded=${infoNeeded}`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { profileId }) => [
        "LawyerList",
        "LawyerStats",
        { type: "LawyerProfile", id: profileId },
      ],
    }),

    adminVerifyDocument: builder.mutation<ApiResponse<{ message: string }>, VerifyDocumentPayload>({
      query: ({ profileId, documentId, verified }) => ({
        url: `/admin/lawyers/${profileId}/documents/${documentId}`,
        method: "PATCH",
        data: { verified },
      }),
      invalidatesTags: (result, error, { profileId }) => [
        { type: "LawyerProfile", id: profileId },
      ],
    }),

    adminUpdateLawyerStatus: builder.mutation<ApiResponse<{ message: string }>, UpdateLawyerStatusPayload>({
      query: ({ profileId, action, reason }) => ({
        url: `/admin/lawyers/${profileId}/status`,
        method: "PATCH",
        data: { action, reason },
      }),
      invalidatesTags: (result, error, { profileId }) => [
        "LawyerList",
        "LawyerStats",
        { type: "LawyerProfile", id: profileId },
      ],
    }),

    adminEmailLawyer: builder.mutation<ApiResponse<{ message: string }>, EmailLawyerPayload>({
      query: ({ profileId, subject, body }) => ({
        url: `/admin/lawyers/${profileId}/email`,
        method: "POST",
        data: { subject, body },
      }),
    }),
  }),
});

export const {
  useAdminListLawyersQuery,
  useAdminGetLawyerStatsQuery,
  useAdminGetLawyerByIdQuery,
  useAdminAdvanceVerificationMutation,
  useAdminRejectVerificationMutation,
  useAdminVerifyDocumentMutation,
  useAdminUpdateLawyerStatusMutation,
  useAdminEmailLawyerMutation,
} = adminLawyerApi;
