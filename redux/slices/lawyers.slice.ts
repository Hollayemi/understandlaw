import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import {
  LawyerFull,
  SubmitVerificationPayload,
  UpdateLawyerProfilePayload,
  SetAvailabilityPayload,
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

export const lawyerApi = createApi({
  reducerPath: "lawyerApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: ["LawyerMe", "LawyerProfile", "LawyerList", "LawyerStats"],

  endpoints: (builder) => ({
    getMyLawyerProfile: builder.query<ApiResponse<LawyerFull>, void>({
      query: () => ({ url: "/lawyers/me/profile", method: "GET" }),
      providesTags: ["LawyerMe"],
    }),
    
    submitVerification: builder.mutation<ApiResponse<LawyerFull>, SubmitVerificationPayload>({
      query: (data) => ({
        url: "/citizen/lawyer-profile",
        method: "POST",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),
    
    updateMyLawyerProfile: builder.mutation<ApiResponse<LawyerFull>, UpdateLawyerProfilePayload>({
      query: (data) => ({
        url: "/lawyers/me/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),

    setAvailability: builder.mutation<ApiResponse<{ isAvailable: boolean }>, SetAvailabilityPayload>({
      query: (data) => ({
        url: "/lawyers/me/availability",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),

    uploadDocument: builder.mutation<
      ApiResponse<{ fileUrl: string; filename: string; sizeBytes: number; label: string }>,
      FormData
    >({
      query: (formData) => ({
        url: "/lawyers/me/documents/upload",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    // Public marketplace endpoints
    getMarketplaceLawyers: builder.query<
      ApiResponse<PaginatedLawyers>,
      { specialism?: string; state?: string; search?: string; sortBy?: "rating" | "reviews" | "response" | "fee"; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/marketplace/lawyers",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerList"],
    }),

    getLawyerByNbaNumber: builder.query<ApiResponse<LawyerFull>, string>({
      query: (nbaNumber) => ({
        url: `/marketplace/lawyers/${nbaNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, nba) => [{ type: "LawyerProfile", id: nba }],
    }),

    // Admin endpoints (keep if you have admin panel)
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
      query: ({ profileId, reason }) => ({
        url: `/admin/lawyers/${profileId}/verification/reject`,
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
  useGetMyLawyerProfileQuery,
  useSubmitVerificationMutation,
  useUpdateMyLawyerProfileMutation,
  useSetAvailabilityMutation,
  useUploadDocumentMutation,
  useGetMarketplaceLawyersQuery,
  useGetLawyerByNbaNumberQuery,
  useAdminListLawyersQuery,
  useAdminGetLawyerStatsQuery,
  useAdminGetLawyerByIdQuery,
  useAdminAdvanceVerificationMutation,
  useAdminRejectVerificationMutation,
  useAdminVerifyDocumentMutation,
  useAdminUpdateLawyerStatusMutation,
  useAdminEmailLawyerMutation,
} = lawyerApi;

// Keep constants that are used across the app
export const AVAILABLE_SPECIALISMS = [
  { id: "criminal",       label: "Criminal Law",            group: "Litigation"    },
  { id: "employment",     label: "Employment & Labour",     group: "Litigation"    },
  { id: "property",       label: "Property & Tenancy",      group: "Transactions"  },
  { id: "family",         label: "Family Law",              group: "Litigation"    },
  { id: "business",       label: "Business & Commerce",     group: "Transactions"  },
  { id: "constitutional", label: "Constitutional Rights",   group: "Litigation"    },
  { id: "consumer",       label: "Consumer Protection",     group: "Advisory"      },
  { id: "road",           label: "Road Traffic",            group: "Advisory"      },
  { id: "contracts",      label: "Contracts & Agreements",  group: "Transactions"  },
  { id: "tax",            label: "Tax & Revenue",           group: "Advisory"      },
  { id: "ip",             label: "Intellectual Property",   group: "Transactions"  },
  { id: "immigration",    label: "Immigration",             group: "Advisory"      },
] as const;

export const NIGERIAN_STATES = [
  { code: "abia",       label: "Abia"           },
  { code: "adamawa",    label: "Adamawa"        },
  { code: "akwa-ibom",  label: "Akwa Ibom"      },
  { code: "anambra",    label: "Anambra"        },
  { code: "bauchi",     label: "Bauchi"         },
  { code: "bayelsa",    label: "Bayelsa"        },
  { code: "benue",      label: "Benue"          },
  { code: "borno",      label: "Borno"          },
  { code: "cross-river",label: "Cross River"    },
  { code: "delta",      label: "Delta"          },
  { code: "ebonyi",     label: "Ebonyi"         },
  { code: "edo",        label: "Edo"            },
  { code: "ekiti",      label: "Ekiti"          },
  { code: "enugu",      label: "Enugu"          },
  { code: "fct",        label: "FCT (Abuja)"    },
  { code: "gombe",      label: "Gombe"          },
  { code: "imo",        label: "Imo"            },
  { code: "jigawa",     label: "Jigawa"         },
  { code: "kaduna",     label: "Kaduna"         },
  { code: "kano",       label: "Kano"           },
  { code: "katsina",    label: "Katsina"        },
  { code: "kebbi",      label: "Kebbi"          },
  { code: "kogi",       label: "Kogi"           },
  { code: "kwara",      label: "Kwara"          },
  { code: "lagos",      label: "Lagos"          },
  { code: "nasarawa",   label: "Nasarawa"       },
  { code: "niger",      label: "Niger"          },
  { code: "ogun",       label: "Ogun"           },
  { code: "ondo",       label: "Ondo"           },
  { code: "osun",       label: "Osun"           },
  { code: "oyo",        label: "Oyo"            },
  { code: "plateau",    label: "Plateau"        },
  { code: "rivers",     label: "Rivers"         },
  { code: "sokoto",     label: "Sokoto"         },
  { code: "taraba",     label: "Taraba"         },
  { code: "yobe",       label: "Yobe"           },
  { code: "zamfara",    label: "Zamfara"        },
] as const;

export const LANGUAGES = [
  "English", "Hausa", "Yoruba", "Igbo", "Fulfulde",
  "Kanuri", "Ijaw", "Tiv", "Ibibio", "Efik",
] as const;