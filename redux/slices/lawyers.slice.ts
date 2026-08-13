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
    "MatchRequestStatus",
    "MyMatchRequests",
  ],

  endpoints: (builder) => ({
    // Existing endpoints
    getMyLawyerProfile: builder.query<ApiResponse<any>, void>({
      query: () => ({ url: "/lawyers/me/profile", method: "GET" }),
      providesTags: ["LawyerMe"],
    }),
    
    submitVerification: builder.mutation<ApiResponse<LawyerFull>, FormData>({
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
      {
        specialism?: string; state?: string; search?: string; sortBy?: "rating" | "reviews" | "response" | "fee"; page?: number; pageSize?: number;
        // When true, only lawyers on a paid subscription tier (eligible for
        // direct booking, bypassing the firm-assisted intake) are returned.
        subscribedOnly?: boolean;
      }
    >({
      query: (params) => ({
        url: "/marketplace/lawyers",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerList"],
    }),


    // ========== NEW MARKETPLACE ENDPOINTS ==========

    getLawyerByScnNumber: builder.query<ApiResponse<LawyerFull>, string>({
      query: (scnNumber) => ({
        url: `/marketplace/lawyers/${scnNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, scn) => [{ type: "LawyerProfile", id: scn }],
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

    // Request a lawyer match (when user isn't sure who to pick) — kicks off
    // the firm-assisted flow: our team reviews the intake, then attaches
    // recommended lawyers to this request for the citizen to choose from.
    requestLawyerMatch: builder.mutation<ApiResponse<MatchResponse>, RequestMatchPayload>({
      query: (data) => ({
        url: "/marketplace/match-requests",
        method: "POST",
        data,
      }),
      invalidatesTags: ["MyMatchRequests"],
    }),

    // Upload a supporting document (tenancy agreement, letter, evidence) to
    // attach to a match request before or during intake.
    uploadMatchDocument: builder.mutation<
      ApiResponse<{ fileUrl: string; filename: string; sizeBytes: number; label?: string }>,
      FormData
    >({
      query: (formData) => ({
        url: "/marketplace/match-requests/documents/upload",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    // Poll a single match request — used on the "finding your lawyer" status
    // page to detect when the firm has attached recommended lawyers.
    getMatchRequestStatus: builder.query<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/marketplace/match-requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MatchRequestStatus", id }],
    }),

    // All of the current citizen's match requests (so an in-progress request
    // isn't lost if they navigate away before a lawyer is selected).
    getMyMatchRequests: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/consultations/citizen/match-requests",
        method: "GET",
      }),
      providesTags: ["MyMatchRequests"],
    }),

    // Citizen picks one of the firm-recommended lawyers, converting the
    // match request into an actual booked consultation.
    selectRecommendedLawyer: builder.mutation<
      ApiResponse<{ booking: BookingResponse; payment: any }>,
      { requestId: string; lawyerId: string }
    >({
      query: ({ requestId, lawyerId }) => ({
        url: `/marketplace/match-requests/${requestId}/select`,
        method: "POST",
        data: { lawyerId },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "MatchRequestStatus", id: requestId },
        "MyMatchRequests",
      ],
    }),

    // Get lawyer's available time slots for booking
    getLawyerAvailability: builder.query<ApiResponse<AvailabilitySlot[]>, { scnNumber: string; date?: string }>({
      query: ({ scnNumber, date }) => ({
        url: `/marketplace/lawyers/${scnNumber}/availability`,
        method: "GET",
        params: date ? { date } : undefined,
      }),
      providesTags: (result, error, { scnNumber }) => [{ type: "LawyerAvailability", id: scnNumber }],
    }),

    // Submit a review after consultation
    submitReview: builder.mutation<ApiResponse<ReviewResponse>, SubmitReviewPayload>({
      query: ({ scnNumber, consultationId, rating, comment, tags }) => ({
        url: `/marketplace/lawyers/${scnNumber}/reviews`,
        method: "POST",
        data: { consultationId, rating, comment, tags },
      }),
      invalidatesTags: (result, error, { scnNumber }) => [
        { type: "LawyerProfile", id: scnNumber },
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
  useGetLawyerByScnNumberQuery,
  
  // New hooks
  useGetMarketplaceStatsQuery,
  useBookConsultationMutation,
  useRequestLawyerMatchMutation,
  useGetLawyerAvailabilityQuery,
  useSubmitReviewMutation,

  // Assisted-consultation flow hooks
  useUploadMatchDocumentMutation,
  useGetMatchRequestStatusQuery,
  useGetMyMatchRequestsQuery,
  useSelectRecommendedLawyerMutation,
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
  "English", "French", "Hausa", "Yoruba", "Igbo", "Fulfulde",
  "Kanuri", "Ijaw", "Tiv", "Ibibio", "Efik",
] as const;