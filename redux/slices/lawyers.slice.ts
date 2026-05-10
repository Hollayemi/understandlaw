import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type VerificationStatus =
  | "pending"
  | "credential_check"
  | "training"
  | "assessment"
  | "verified"
  | "rejected";

export type LawyerBadge = "Verified Lawyer" | "Top Rated" | "Responsive";

export type SubscriptionTier = "basic" | "pro";

export type OnboardingStep =
  | "personal"
  | "professional"
  | "specialisms"
  | "fees"
  | "documents"
  | "review";

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface FeeSchedule {
  message: number;
  call: number;
  video: number;
}

export interface VerificationDocument {
  _id?: string;
  label: string;
  filename: string;
  fileUrl: string;
  uploadedAt: string;
  sizeBytes: number;
  /** null = pending review | true = verified | false = failed */
  verified: boolean | null;
}

// ─── Core profile types ───────────────────────────────────────────────────────

export interface LawyerProfile {
  _id: string;
  userId: string;

  // Professional identity
  nbaNumber?: string;
  yearOfCall?: number;
  calledAt?: string;
  title?: string;
  bio?: string;
  specialisms: string[];
  languages: string[];

  // Location
  location?: string;
  state?: string;
  stateCode?: string;

  // Verification (embedded)
  verificationStatus: VerificationStatus;
  verificationRejectedReason?: string;
  verifiedAt?: string;
  verificationDocuments: VerificationDocument[];
  verificationAdminNote?: string;
  verificationReviewedBy?: string;
  verificationReviewedAt?: string;

  // Badges
  badges: LawyerBadge[];

  // Availability & fees
  isAvailable: boolean;
  fees: FeeSchedule;

  // Performance
  ratingAvg: number;
  reviewCount: number;
  consultationCount: number;
  responseTimeLabel: string;

  // Platform
  subscriptionTier: SubscriptionTier;
  colorA: string;
  colorB: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface LawyerUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: "lawyer";
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface LawyerFull {
  user: LawyerUser;
  profile: LawyerProfile | null;
}

// ─── Onboarding state (client-side wizard) ────────────────────────────────────

export interface OnboardingPersonal {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
}

export interface OnboardingProfessional {
  nbaNumber: string;
  yearOfCall: number | "";
  calledAt: string;
  title: string;
  bio: string;
  location: string;
  state: string;
  stateCode: string;
  languages: string[];
}

export interface OnboardingSpecialisms {
  specialisms: string[];
}

export interface OnboardingFees {
  fees: FeeSchedule;
}

export interface OnboardingDocuments {
  /** Each item corresponds to a required document slot */
  documents: {
    label: string;
    file: File | null;
    fileUrl: string;
    filename: string;
    sizeBytes: number;
    uploaded: boolean;
    uploading: boolean;
    error: string | null;
  }[];
}

// ─── API Payload types ────────────────────────────────────────────────────────

export interface SubmitVerificationPayload {
  nbaNumber: string;
  yearOfCall: number;
  calledAt: string;
  title?: string;
  bio?: string;
  location?: string;
  state?: string;
  stateCode?: string;
  languages?: string[];
  specialisms?: string[];
  fees?: Partial<FeeSchedule>;
  documents?: {
    label: string;
    filename: string;
    fileUrl: string;
    sizeBytes: number;
  }[];
}

export interface UpdateLawyerProfilePayload {
  title?: string;
  bio?: string;
  specialisms?: string[];
  languages?: string[];
  location?: string;
  state?: string;
  stateCode?: string;
  fees?: Partial<FeeSchedule>;
}

export interface SetAvailabilityPayload {
  available: boolean;
}

// Admin payloads
export interface ListLawyersParams {
  verificationStatus?: VerificationStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
  isAvailable?: boolean;
}

export interface AdvanceVerificationPayload {
  profileId: string;
  note?: string;
}

export interface RejectVerificationPayload {
  profileId: string;
  reason: string;
}

export interface VerifyDocumentPayload {
  profileId: string;
  documentId: string;
  verified: boolean;
}

export interface UpdateLawyerStatusPayload {
  profileId: string;
  action: "suspend" | "reactivate";
  reason: string;
}

export interface EmailLawyerPayload {
  profileId: string;
  subject: string;
  body: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedLawyers {
  data: LawyerFull[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LawyerStats {
  total: number;
  byStatus: Record<VerificationStatus, number>;
  avgRating: number;
}

// ─── RTK Query API ────────────────────────────────────────────────────────────

export const lawyerApi = createApi({
  reducerPath: "lawyerApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: [
    "LawyerMe",
    "LawyerProfile",
    "LawyerList",
    "LawyerStats",
  ],

  endpoints: (builder) => ({

    // ══════════════════════════════════════════════════════════════════════════
    //  LAWYER-FACING ENDPOINTS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/v1/lawyers/me/profile
     * Returns the signed-in lawyer's user record + embedded profile.
     * Use this on the dashboard home and onboarding pages.
     */
    getMyLawyerProfile: builder.query<ApiResponse<LawyerFull>, void>({
      query: () => ({ url: "/lawyers/me/profile", method: "GET" }),
      providesTags: ["LawyerMe"],
    }),

    /**
     * POST /api/v1/lawyers/me/verification
     * Submit (or re-submit) the lawyer's verification application.
     * Accepts NBA number, year of call, documents array, specialisms, fees, bio, etc.
     *
     * Blocked if verificationStatus is in [training, assessment, verified].
     */
    submitVerification: builder.mutation<
      ApiResponse<LawyerProfile>,
      SubmitVerificationPayload
    >({
      query: (data) => ({
        url: "/lawyers/me/verification",
        method: "POST",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),

    /**
     * PATCH /api/v1/lawyers/me/profile
     * Update non-verification profile fields: bio, specialisms, languages, fees, location.
     */
    updateMyLawyerProfile: builder.mutation<
      ApiResponse<LawyerProfile>,
      UpdateLawyerProfilePayload
    >({
      query: (data) => ({
        url: "/lawyers/me/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),

    /**
     * PATCH /api/v1/lawyers/me/availability
     * Toggle availability. Only allowed when verificationStatus === 'verified'.
     */
    setAvailability: builder.mutation<
      ApiResponse<{ isAvailable: boolean }>,
      SetAvailabilityPayload
    >({
      query: (data) => ({
        url: "/lawyers/me/availability",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["LawyerMe"],
    }),

    /**
     * POST /api/v1/lawyers/me/documents/upload
     * Upload a single verification document.
     * Send as multipart/form-data with field: file + label.
     * Returns the document object with fileUrl to include in submitVerification.
     */
    uploadDocument: builder.mutation<
      ApiResponse<{
        fileUrl: string;
        filename: string;
        sizeBytes: number;
        label: string;
      }>,
      FormData
    >({
      query: (formData) => ({
        url: "/lawyers/me/documents/upload",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),

    // ══════════════════════════════════════════════════════════════════════════
    //  PUBLIC MARKETPLACE ENDPOINTS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/v1/marketplace/lawyers
     * Public list of verified + available lawyers.
     * Supports filtering by specialism, state, sortBy.
     */
    getMarketplaceLawyers: builder.query<
      ApiResponse<PaginatedLawyers>,
      {
        specialism?: string;
        state?: string;
        search?: string;
        sortBy?: "rating" | "reviews" | "response" | "fee";
        page?: number;
        pageSize?: number;
      }
    >({
      query: (params) => ({
        url: "/marketplace/lawyers",
        method: "GET",
        params,
      }),
      providesTags: ["LawyerList"],
    }),

    /**
     * GET /api/v1/marketplace/lawyers/:nbaNumber
     * Public: get a single verified lawyer by NBA number slug.
     * Used on the full profile page e.g. /dashboard/marketplace/NBA-LAG-2014-01847
     */
    getLawyerByNbaNumber: builder.query<ApiResponse<LawyerFull>, string>({
      query: (nbaNumber) => ({
        url: `/marketplace/lawyers/${nbaNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, nba) => [{ type: "LawyerProfile", id: nba }],
    }),

    // ══════════════════════════════════════════════════════════════════════════
    //  ADMIN ENDPOINTS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/v1/admin/lawyers
     * Admin: paginated list of all lawyers with optional verificationStatus filter.
     */
    adminListLawyers: builder.query<ApiResponse<PaginatedLawyers>, ListLawyersParams>({
      query: (params) => ({
        url: "/admin/lawyers",
        method: "GET",
        params: {
          ...(params.verificationStatus && params.verificationStatus !== "all" && {
            verificationStatus: params.verificationStatus,
          }),
          ...(params.search     && { search: params.search }),
          ...(params.page       && { page: params.page }),
          ...(params.pageSize   && { pageSize: params.pageSize }),
          ...(params.isAvailable !== undefined && { isAvailable: params.isAvailable }),
        },
      }),
      providesTags: ["LawyerList"],
    }),

    /**
     * GET /api/v1/admin/lawyers/stats
     * Admin: aggregate verification stats for dashboard.
     */
    adminGetLawyerStats: builder.query<ApiResponse<LawyerStats>, void>({
      query: () => ({ url: "/admin/lawyers/stats", method: "GET" }),
      providesTags: ["LawyerStats"],
    }),

    /**
     * GET /api/v1/admin/lawyers/:profileId
     * Admin: get a single lawyer profile by Mongoose _id.
     * Populates the userId field with user document.
     */
    adminGetLawyerById: builder.query<ApiResponse<LawyerFull>, string>({
      query: (profileId) => ({
        url: `/admin/lawyers/${profileId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LawyerProfile", id }],
    }),

    /**
     * POST /api/v1/admin/lawyers/:profileId/verification/advance
     * Admin: advance the verification to the next stage.
     * Stages: pending → credential_check → training → assessment → verified
     * Automatically assigns "Verified Lawyer" badge on final advance.
     */
    adminAdvanceVerification: builder.mutation<
      ApiResponse<LawyerProfile>,
      AdvanceVerificationPayload
    >({
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

    /**
     * POST /api/v1/admin/lawyers/:profileId/verification/reject
     * Admin: reject the verification with a mandatory reason.
     * Sets verificationStatus → 'rejected' and isAvailable → false.
     */
    adminRejectVerification: builder.mutation<
      ApiResponse<LawyerProfile>,
      RejectVerificationPayload
    >({
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

    /**
     * PATCH /api/v1/admin/lawyers/:profileId/documents/:documentId
     * Admin: mark a single verification document as verified (true) or failed (false).
     */
    adminVerifyDocument: builder.mutation<
      ApiResponse<{ message: string }>,
      VerifyDocumentPayload
    >({
      query: ({ profileId, documentId, verified }) => ({
        url: `/admin/lawyers/${profileId}/documents/${documentId}`,
        method: "PATCH",
        data: { verified },
      }),
      invalidatesTags: (result, error, { profileId }) => [
        { type: "LawyerProfile", id: profileId },
      ],
    }),

    /**
     * PATCH /api/v1/admin/lawyers/:profileId/status
     * Admin: suspend or reactivate a lawyer (sets user.isActive).
     * Suspending also sets profile.isAvailable = false.
     */
    adminUpdateLawyerStatus: builder.mutation<
      ApiResponse<{ message: string }>,
      UpdateLawyerStatusPayload
    >({
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

    /**
     * POST /api/v1/admin/lawyers/:profileId/email
     * Admin: send a direct email to a lawyer.
     */
    adminEmailLawyer: builder.mutation<
      ApiResponse<{ message: string }>,
      EmailLawyerPayload
    >({
      query: ({ profileId, subject, body }) => ({
        url: `/admin/lawyers/${profileId}/email`,
        method: "POST",
        data: { subject, body },
      }),
    }),
  }),
});

export const {
  // Lawyer-facing
  useGetMyLawyerProfileQuery,
  useSubmitVerificationMutation,
  useUpdateMyLawyerProfileMutation,
  useSetAvailabilityMutation,
  useUploadDocumentMutation,
  // Public
  useGetMarketplaceLawyersQuery,
  useGetLawyerByNbaNumberQuery,
  // Admin
  useAdminListLawyersQuery,
  useAdminGetLawyerStatsQuery,
  useAdminGetLawyerByIdQuery,
  useAdminAdvanceVerificationMutation,
  useAdminRejectVerificationMutation,
  useAdminVerifyDocumentMutation,
  useAdminUpdateLawyerStatusMutation,
  useAdminEmailLawyerMutation,
} = lawyerApi;

// ─── Onboarding local slice ───────────────────────────────────────────────────

export const REQUIRED_DOCUMENTS = [
  { label: "Call to Bar Certificate",  hint: "Your official certificate from the Nigerian Law School" },
  { label: "Law School Certificate",   hint: "Degree certificate from an accredited law faculty" },
  { label: "Practicing License 2025",  hint: "Current Supreme Court practicing certificate for 2025" },
  { label: "Government-Issued ID",     hint: "National ID, International Passport, or Voter's Card" },
] as const;

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

// Document slot type for onboarding state
type DocSlot = {
  label: string;
  hint: string;
  fileUrl: string;
  filename: string;
  sizeBytes: number;
  uploaded: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
};

interface LawyerOnboardingState {
  // Which step is active
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];

  // Form data per step
  personal: OnboardingPersonal;
  professional: OnboardingProfessional;
  specialisms: string[];
  fees: FeeSchedule;
  documents: DocSlot[];

  // Submission
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;

  // Validation errors (field → message)
  errors: Record<string, string>;
}

const STEP_ORDER: OnboardingStep[] = [
  "personal", "professional", "specialisms", "fees", "documents", "review",
];

const initialDocuments: DocSlot[] = REQUIRED_DOCUMENTS.map((d) => ({
  label:          d.label,
  hint:           d.hint,
  fileUrl:        "",
  filename:       "",
  sizeBytes:      0,
  uploaded:       false,
  uploading:      false,
  uploadProgress: 0,
  error:          null,
}));

const initialOnboardingState: LawyerOnboardingState = {
  currentStep:    "personal",
  completedSteps: [],

  personal: {
    firstName: "",
    lastName:  "",
    phone:     "",
    avatarUrl: "",
  },
  professional: {
    nbaNumber:  "",
    yearOfCall: "",
    calledAt:   "",
    title:      "",
    bio:        "",
    location:   "",
    state:      "",
    stateCode:  "",
    languages:  ["English"],
  },
  specialisms: [],
  fees: {
    message: 5000,
    call:    12000,
    video:   18000,
  },
  documents: initialDocuments,

  submitting:    false,
  submitError:   null,
  submitSuccess: false,
  errors:        {},
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const NBA_REGEX = /^NBA\/[A-Z]{3}\/\d{4}\/\d{5}$/;

function validatePersonal(data: OnboardingPersonal): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.firstName.trim())  e.firstName = "First name is required";
  if (!data.lastName.trim())   e.lastName  = "Last name is required";
  if (!data.phone.trim())      e.phone     = "Phone number is required";
  else if (!/^(\+234|0)[789][01]\d{8}$/.test(data.phone.replace(/\s/g, ""))) {
    e.phone = "Enter a valid Nigerian phone number (e.g. 08012345678)";
  }
  return e;
}

function validateProfessional(data: OnboardingProfessional): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.nbaNumber.trim())         e.nbaNumber  = "NBA number is required";
  else if (!NBA_REGEX.test(data.nbaNumber.trim().toUpperCase())) {
    e.nbaNumber = "Format: NBA/LAG/2014/01847 (state code · year · 5 digits)";
  }
  if (!data.yearOfCall)               e.yearOfCall = "Year of call is required";
  else if (Number(data.yearOfCall) < 1960 || Number(data.yearOfCall) > new Date().getFullYear()) {
    e.yearOfCall = "Enter a valid year of call";
  }
  if (!data.calledAt.trim())          e.calledAt   = "Year called is required";
  if (!data.title.trim())             e.title      = "Professional title is required";
  if (!data.bio.trim())               e.bio        = "Bio is required";
  else if (data.bio.trim().length < 100) e.bio     = "Bio must be at least 100 characters";
  if (!data.state)                    e.state      = "State is required";
  if (data.languages.length === 0)    e.languages  = "Select at least one language";
  return e;
}

function validateSpecialisms(items: string[]): Record<string, string> {
  const e: Record<string, string> = {};
  if (items.length === 0) e.specialisms = "Select at least one practice area";
  if (items.length > 5)   e.specialisms = "Select no more than 5 practice areas";
  return e;
}

function validateFees(fees: FeeSchedule): Record<string, string> {
  const e: Record<string, string> = {};
  if (!fees.message || fees.message < 500)  e.feeMessage = "Minimum NGN 500 for written consultations";
  if (!fees.call    || fees.call    < 2000) e.feeCall    = "Minimum NGN 2,000 for calls";
  if (!fees.video   || fees.video   < 3000) e.feeVideo   = "Minimum NGN 3,000 for video sessions";
  return e;
}

function validateDocuments(docs: DocSlot[]): Record<string, string> {
  const e: Record<string, string> = {};
  const missing = docs.filter((d) => !d.uploaded).map((d) => d.label);
  if (missing.length > 0) {
    e.documents = `Upload all required documents. Missing: ${missing.join(", ")}`;
  }
  return e;
}

// ─── Onboarding slice ─────────────────────────────────────────────────────────

export const lawyerOnboardingSlice = createSlice({
  name: "lawyerOnboarding",
  initialState: initialOnboardingState,
  reducers: {

    // ── Navigation ────────────────────────────────────────────────────────────

    goToStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
      state.errors = {};
    },

    /**
     * Validate the current step and advance if valid.
     * Returns without advancing if there are validation errors.
     */
    advanceStep(state) {
      let errors: Record<string, string> = {};

      switch (state.currentStep) {
        case "personal":      errors = validatePersonal(state.personal);           break;
        case "professional":  errors = validateProfessional(state.professional);   break;
        case "specialisms":   errors = validateSpecialisms(state.specialisms);     break;
        case "fees":          errors = validateFees(state.fees);                   break;
        case "documents":     errors = validateDocuments(state.documents);         break;
        default: break;
      }

      state.errors = errors;
      if (Object.keys(errors).length > 0) return;

      const idx = STEP_ORDER.indexOf(state.currentStep);
      if (idx < STEP_ORDER.length - 1) {
        if (!state.completedSteps.includes(state.currentStep)) {
          state.completedSteps.push(state.currentStep);
        }
        state.currentStep = STEP_ORDER[idx + 1];
      }
    },

    goBack(state) {
      const idx = STEP_ORDER.indexOf(state.currentStep);
      if (idx > 0) {
        state.currentStep = STEP_ORDER[idx - 1];
        state.errors = {};
      }
    },

    // ── Field setters ─────────────────────────────────────────────────────────

    setPersonal(state, action: PayloadAction<Partial<OnboardingPersonal>>) {
      state.personal = { ...state.personal, ...action.payload };
      // Clear field-level errors as user types
      const keys = Object.keys(action.payload) as (keyof OnboardingPersonal)[];
      keys.forEach((k) => { delete state.errors[k]; });
    },

    setProfessional(state, action: PayloadAction<Partial<OnboardingProfessional>>) {
      state.professional = { ...state.professional, ...action.payload };
      const keys = Object.keys(action.payload) as (keyof OnboardingProfessional)[];
      keys.forEach((k) => { delete state.errors[k]; });
    },

    toggleSpecialism(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.specialisms.indexOf(id);
      if (idx > -1) {
        state.specialisms.splice(idx, 1);
      } else if (state.specialisms.length < 5) {
        state.specialisms.push(id);
      }
      delete state.errors.specialisms;
    },

    setFee(state, action: PayloadAction<{ mode: keyof FeeSchedule; value: number }>) {
      state.fees[action.payload.mode] = action.payload.value;
      delete state.errors[`fee${action.payload.mode.charAt(0).toUpperCase() + action.payload.mode.slice(1)}`];
    },

    toggleLanguage(state, action: PayloadAction<string>) {
      const lang = action.payload;
      const idx = state.professional.languages.indexOf(lang);
      if (idx > -1 && state.professional.languages.length > 1) {
        state.professional.languages.splice(idx, 1);
      } else if (idx === -1) {
        state.professional.languages.push(lang);
      }
      delete state.errors.languages;
    },

    // ── Document upload state machine ─────────────────────────────────────────

    setDocumentUploading(state, action: PayloadAction<{ index: number; uploading: boolean }>) {
      const doc = state.documents[action.payload.index];
      if (doc) {
        doc.uploading = action.payload.uploading;
        doc.error = null;
      }
    },

    setDocumentProgress(state, action: PayloadAction<{ index: number; progress: number }>) {
      const doc = state.documents[action.payload.index];
      if (doc) doc.uploadProgress = action.payload.progress;
    },

    setDocumentUploaded(
      state,
      action: PayloadAction<{
        index: number;
        fileUrl: string;
        filename: string;
        sizeBytes: number;
      }>
    ) {
      const doc = state.documents[action.payload.index];
      if (doc) {
        doc.fileUrl        = action.payload.fileUrl;
        doc.filename       = action.payload.filename;
        doc.sizeBytes      = action.payload.sizeBytes;
        doc.uploaded       = true;
        doc.uploading      = false;
        doc.uploadProgress = 100;
        doc.error          = null;
      }
      delete state.errors.documents;
    },

    setDocumentError(state, action: PayloadAction<{ index: number; error: string }>) {
      const doc = state.documents[action.payload.index];
      if (doc) {
        doc.error          = action.payload.error;
        doc.uploading      = false;
        doc.uploadProgress = 0;
      }
    },

    removeDocument(state, action: PayloadAction<number>) {
      const doc = state.documents[action.payload];
      if (doc) {
        doc.fileUrl        = "";
        doc.filename       = "";
        doc.sizeBytes      = 0;
        doc.uploaded       = false;
        doc.uploadProgress = 0;
        doc.error          = null;
      }
    },

    // ── Submission state ──────────────────────────────────────────────────────

    setSubmitting(state, action: PayloadAction<boolean>) {
      state.submitting = action.payload;
    },

    setSubmitError(state, action: PayloadAction<string | null>) {
      state.submitError = action.payload;
      state.submitting  = false;
    },

    setSubmitSuccess(state) {
      state.submitSuccess = true;
      state.submitting    = false;
      state.submitError   = null;
      state.completedSteps = [...STEP_ORDER.slice(0, -1)] as OnboardingStep[];
    },

    clearErrors(state) {
      state.errors = {};
    },

    resetOnboarding() {
      return initialOnboardingState;
    },
  },
});

export const lawyerOnboardingActions = lawyerOnboardingSlice.actions;

// ─── Admin UI slice ───────────────────────────────────────────────────────────

interface LawyerAdminUiState {
  search:             string;
  page:               number;
  pageSize:           number;
  verificationFilter: VerificationStatus | "all";
  selectedProfileId:  string | null;
  // Modals
  advanceModalOpen:   boolean;
  rejectModalOpen:    boolean;
  emailModalOpen:     boolean;
  statusModalOpen:    boolean;
}

const initialAdminUi: LawyerAdminUiState = {
  search:             "",
  page:               1,
  pageSize:           20,
  verificationFilter: "pending",
  selectedProfileId:  null,
  advanceModalOpen:   false,
  rejectModalOpen:    false,
  emailModalOpen:     false,
  statusModalOpen:    false,
};

export const lawyerAdminUiSlice = createSlice({
  name: "lawyerAdminUi",
  initialState: initialAdminUi,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page   = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setVerificationFilter(state, action: PayloadAction<VerificationStatus | "all">) {
      state.verificationFilter = action.payload;
      state.page               = 1;
    },
    setSelectedProfile(state, action: PayloadAction<string | null>) {
      state.selectedProfileId = action.payload;
    },
    openAdvanceModal(state, action: PayloadAction<string>) {
      state.selectedProfileId = action.payload;
      state.advanceModalOpen  = true;
    },
    openRejectModal(state, action: PayloadAction<string>) {
      state.selectedProfileId = action.payload;
      state.rejectModalOpen   = true;
    },
    openEmailModal(state, action: PayloadAction<string>) {
      state.selectedProfileId = action.payload;
      state.emailModalOpen    = true;
    },
    openStatusModal(state, action: PayloadAction<string>) {
      state.selectedProfileId = action.payload;
      state.statusModalOpen   = true;
    },
    closeAllModals(state) {
      state.advanceModalOpen = false;
      state.rejectModalOpen  = false;
      state.emailModalOpen   = false;
      state.statusModalOpen  = false;
    },
  },
});

export const lawyerAdminUiActions = lawyerAdminUiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

// Onboarding
export const selectOnboarding      = (s: any) => s.lawyerOnboarding as LawyerOnboardingState;
export const selectCurrentStep     = (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).currentStep;
export const selectCompletedSteps  = (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).completedSteps;
export const selectOnboardingErrors= (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).errors;
export const selectOnboardingDocs  = (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).documents;
export const selectSubmitSuccess   = (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).submitSuccess;
export const selectSubmitting      = (s: any) => (s.lawyerOnboarding as LawyerOnboardingState).submitting;

// Derive: is a step accessible (previous steps complete)
export const selectIsStepAccessible = (step: OnboardingStep) => (s: any) => {
  const state = s.lawyerOnboarding as LawyerOnboardingState;
  const idx = STEP_ORDER.indexOf(step);
  if (idx === 0) return true;
  return STEP_ORDER.slice(0, idx).every((prev) => state.completedSteps.includes(prev));
};

// Derive: build the submit payload from onboarding state
export const selectVerificationPayload = (s: any): SubmitVerificationPayload => {
  const state = s.lawyerOnboarding as LawyerOnboardingState;
  return {
    nbaNumber:   state.professional.nbaNumber.trim().toUpperCase(),
    yearOfCall:  Number(state.professional.yearOfCall),
    calledAt:    state.professional.calledAt.trim(),
    title:       state.professional.title.trim(),
    bio:         state.professional.bio.trim(),
    location:    state.professional.location.trim(),
    state:       state.professional.state,
    stateCode:   state.professional.stateCode,
    languages:   state.professional.languages,
    specialisms: state.specialisms,
    fees:        state.fees,
    documents:   state.documents
      .filter((d) => d.uploaded)
      .map((d) => ({
        label:     d.label,
        filename:  d.filename,
        fileUrl:   d.fileUrl,
        sizeBytes: d.sizeBytes,
      })),
  };
};

// Admin UI
export const selectAdminLawyerUi = (s: any) => s.lawyerAdminUi as LawyerAdminUiState;

// Derive: params to pass to adminListLawyers query
export const selectAdminListParams = (s: any): ListLawyersParams => {
  const ui = s.lawyerAdminUi as LawyerAdminUiState;
  return {
    verificationStatus: ui.verificationFilter,
    search:             ui.search || undefined,
    page:               ui.page,
    pageSize:           ui.pageSize,
  };
};

// Verification stage order (for progress display)
export const VERIFICATION_STAGES: { status: VerificationStatus; label: string; desc: string }[] = [
  { status: "pending",          label: "Application",       desc: "Submitted, awaiting review"     },
  { status: "credential_check", label: "Credential Check",  desc: "NBA & documents being verified" },
  { status: "training",         label: "Platform Training", desc: "Orientation module"             },
  { status: "assessment",       label: "Assessment",        desc: "Competency evaluation"          },
  { status: "verified",         label: "Verified",          desc: "Live on the marketplace"        },
];

export const getVerificationStageIndex = (status: VerificationStatus): number => {
  if (status === "rejected") return -1;
  return VERIFICATION_STAGES.findIndex((s) => s.status === status);
};