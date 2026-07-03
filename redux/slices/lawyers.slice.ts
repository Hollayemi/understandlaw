import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import {
  LawyerFull,
  SubmitVerificationPayload,
  UpdateLawyerProfilePayload,
  SetAvailabilityPayload,
  ApiResponse,
  MarketplaceStats,
  BookConsultationPayload,
  BookingResponse,
  RequestMatchPayload,
  MatchResponse,
  AvailabilitySlot,
  SubmitReviewPayload,
  ReviewResponse,
} from "@/redux/types/lawyer"
import { PaginatedResponse } from "./types";

export const lawyerApi = createApi({
  reducerPath: "lawyerApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: [
    "LawyerMe", 
    "LawyerProfile", 
    "LawyerList", 
    "LawyerStats",
    "MarketplaceStats",
    "MarketplaceStates",
    "MarketplaceSpecialisms",
    "FilterCounts",
    "LawyerAvailability",
  ],

  endpoints: (builder) => ({
    // Existing endpoints
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
    getMarketplaceLawyers: builder.query<PaginatedResponse<LawyerFull[]>,
      { specialism?: string; state?: string; search?: string; sortBy?: "rating" | "reviews" | "response" | "fee"; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "/marketplace/lawyers",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerList"],
    }),


    // ========== NEW MARKETPLACE ENDPOINTS ==========

    getLawyerByNbaNumber: builder.query<ApiResponse<LawyerFull>, string>({
      query: (nbaNumber) => ({
        url: `/marketplace/lawyers/${nbaNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, nba) => [{ type: "LawyerProfile", id: nba }],
    }),

    // Get marketplace stats for hero section
    getMarketplaceStats: builder.query<ApiResponse<MarketplaceStats>, void>({
      query: () => ({
        url: "/marketplace/stats",
        method: "GET",
      }),
      providesTags: ["MarketplaceStats"],
    }),


    // Book a consultation with a lawyer
    bookConsultation: builder.mutation<ApiResponse<{booking: BookingResponse; payment: any }>, BookConsultationPayload>({
      query: (data) => ({
        url: "/marketplace/consultations",
        method: "POST",
        data,
      }),
      invalidatesTags: ["LawyerList", "LawyerProfile"],
    }),

    // Request a lawyer match (when user isn't sure who to pick)
    requestLawyerMatch: builder.mutation<ApiResponse<any>, RequestMatchPayload>({
      query: (data) => ({
        url: "/marketplace/match-requests",
        method: "POST",
        data,
      }),
    }),

    // Get lawyer's available time slots for booking
    getLawyerAvailability: builder.query<ApiResponse<AvailabilitySlot[]>, { nbaNumber: string; date?: string }>({
      query: ({ nbaNumber, date }) => ({
        url: `/marketplace/lawyers/${nbaNumber}/availability`,
        method: "GET",
        params: date ? { date } : undefined,
      }),
      providesTags: (result, error, { nbaNumber }) => [{ type: "LawyerAvailability", id: nbaNumber }],
    }),

    // Submit a review after consultation
    submitReview: builder.mutation<ApiResponse<ReviewResponse>, SubmitReviewPayload>({
      query: ({ nbaNumber, consultationId, rating, comment, tags }) => ({
        url: `/marketplace/lawyers/${nbaNumber}/reviews`,
        method: "POST",
        data: { consultationId, rating, comment, tags },
      }),
      invalidatesTags: (result, error, { nbaNumber }) => [
        { type: "LawyerProfile", id: nbaNumber },
        "LawyerList",
      ],
    }),
  }),
});

export const {
  // Existing hooks
  useGetMyLawyerProfileQuery,
  useSubmitVerificationMutation,
  useUpdateMyLawyerProfileMutation,
  useSetAvailabilityMutation,
  useUploadDocumentMutation,
  useGetMarketplaceLawyersQuery,
  useGetLawyerByNbaNumberQuery,
  
  // New hooks
  useGetMarketplaceStatsQuery,
  useBookConsultationMutation,
  useRequestLawyerMatchMutation,
  useGetLawyerAvailabilityQuery,
  useSubmitReviewMutation,
} = lawyerApi;


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