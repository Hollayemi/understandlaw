import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse, CitizenFull, UpdateCitizenProfilePayload, CitizenProfile, Pagination, UpdateNotificationsPayload, UpdatePrivacyPayload, AwardXPPayload } from "@/redux/types";



export interface ListCitizensParams {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}


export interface CitizenStats {
  total: number;
  active: number;
  inactive: number;
  avgXP: number;
  totalStudyHours: number;
}
export const citizenApi = createApi({
  reducerPath: "citizenApi",
  baseQuery: axiosBaseQuery({ defaultActor: "admin" }),
  tagTypes: ["CitizenMe", "CitizenProfile", "CitizenList", "CitizenStats"],

  endpoints: (builder) => ({


    /**
     * GET /api/v1/citizens/me
     * Returns the signed-in citizen's user + profile document.
     */
    getMyProfile: builder.query<ApiResponse<CitizenFull>, void>({
      query: () => ({ url: "/citizens/me", method: "GET" }),
      providesTags: ["CitizenMe"],
    }),

    /**
     * PATCH /api/v1/citizens/me/profile
     * Update preferences, appearance, location.
     */
    updateMyProfile: builder.mutation<ApiResponse<CitizenProfile>, UpdateCitizenProfilePayload>({
      query: (data) => ({ url: "/citizen/me/profile", method: "PATCH", data, endpointActor: "user" }),
      invalidatesTags: ["CitizenMe", "CitizenProfile"],
    }),

    /**
     * PATCH /api/v1/citizens/me/notifications
     * Update notification preferences.
     */
    updateNotifications: builder.mutation<ApiResponse<CitizenProfile>, UpdateNotificationsPayload>({
      query: (data) => ({ url: "/citizens/me/notifications", method: "PATCH", data }),
      invalidatesTags: ["CitizenMe"],
    }),

    /**
     * PATCH /api/v1/citizens/me/privacy
     * Update privacy settings.
     */
    updatePrivacy: builder.mutation<ApiResponse<CitizenProfile>, UpdatePrivacyPayload>({
      query: (data) => ({ url: "/citizens/me/privacy", method: "PATCH", data }),
      invalidatesTags: ["CitizenMe"],
    }),

    /**
     * POST /api/v1/citizens/me/xp
     * Award XP to the current citizen. Triggers level-up check server-side.
     */
    awardXP: builder.mutation<ApiResponse<CitizenProfile>, AwardXPPayload>({
      query: (data) => ({ url: "/citizens/me/xp", method: "POST", data }),
      invalidatesTags: ["CitizenMe"],
    }),
    /**
     * GET /api/v1/admin/citizens
     * Admin: paginated list of citizens with optional filters.
     */
    listCitizens: builder.query<ApiResponse<Pagination<CitizenFull[]>>, ListCitizensParams>({
      query: (params) => ({
        url: "/admin/citizens",
        method: "GET",
        params: {
          ...(params.search   && { search: params.search }),
          ...(params.page     && { page: params.page }),
          ...(params.pageSize && { pageSize: params.pageSize }),
          ...(params.isActive !== undefined && { isActive: params.isActive }),
        },
      }),
      providesTags: ["CitizenList"],
    }),

    /**
     * GET /api/v1/admin/citizens/stats
     * Admin: aggregate stats for dashboard.
     */
    getCitizenStats: builder.query<ApiResponse<CitizenStats>, void>({
      query: () => ({ url: "/admin/citizens/stats", method: "GET" }),
      providesTags: ["CitizenStats"],
    }),

    /**
     * GET /api/v1/admin/citizens/:userId
     * Admin: get single citizen by userId.
     */
    getCitizenById: builder.query<ApiResponse<CitizenFull>, string>({
      query: (userId) => ({ url: `/admin/citizens/${userId}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "CitizenProfile", id }],
    }),

    /**
     * PATCH /api/v1/admin/citizens/:userId/status
     * Admin: suspend or reactivate a citizen account.
     */
    updateCitizenStatus: builder.mutation<
      ApiResponse<{ userId: string; isActive: boolean }>,
      { userId: string; action: "suspend" | "reactivate"; reason: string }
    >({
      query: ({ userId, ...data }) => ({
        url: `/admin/citizens/${userId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        "CitizenList",
        "CitizenStats",
        { type: "CitizenProfile", id: userId },
      ],
    }),

    /**
     * POST /api/v1/admin/citizens/:userId/email
     * Admin: send a direct email to a citizen.
     */
    emailCitizen: builder.mutation<
      ApiResponse<{ message: string }>,
      { userId: string; subject: string; body: string }
    >({
      query: ({ userId, ...data }) => ({
        url: `/admin/citizens/${userId}/email`,
        method: "POST",
        data,
      }),
    }),
  }),
});

// ─── Export hooks ─────────────────────────────────────────────────────────────

export const {
  // Citizen-facing
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateNotificationsMutation,
  useUpdatePrivacyMutation,
  useAwardXPMutation,
  // Admin-facing
  useListCitizensQuery,
  useGetCitizenStatsQuery,
  useGetCitizenByIdQuery,
  useUpdateCitizenStatusMutation,
  useEmailCitizenMutation,
} = citizenApi;

// ─── Local UI slice ───────────────────────────────────────────────────────────

interface CitizenUiState {
  // Profile edit
  profileDirty: boolean;
  activeSettingsTab: "profile" | "notifications" | "privacy" | "appearance" | "security" | "legal";
  // Admin list
  adminSearch: string;
  adminPage: number;
  adminFilter: "all" | "active" | "inactive";
  adminSelectedId: string | null;
}

const initialUiState: CitizenUiState = {
  profileDirty: false,
  activeSettingsTab: "profile",
  adminSearch: "",
  adminPage: 1,
  adminFilter: "all",
  adminSelectedId: null,
};

export const citizenUiSlice = createSlice({
  name: "citizenUi",
  initialState: initialUiState,
  reducers: {
    setProfileDirty(state, action: PayloadAction<boolean>) {
      state.profileDirty = action.payload;
    },
    setActiveSettingsTab(state, action: PayloadAction<CitizenUiState["activeSettingsTab"]>) {
      state.activeSettingsTab = action.payload;
    },
    setAdminSearch(state, action: PayloadAction<string>) {
      state.adminSearch = action.payload;
      state.adminPage = 1;
    },
    setAdminPage(state, action: PayloadAction<number>) {
      state.adminPage = action.payload;
    },
    setAdminFilter(state, action: PayloadAction<CitizenUiState["adminFilter"]>) {
      state.adminFilter = action.payload;
      state.adminPage = 1;
    },
    setAdminSelectedId(state, action: PayloadAction<string | null>) {
      state.adminSelectedId = action.payload;
    },
  },
});

export const citizenUiActions = citizenUiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCitizenUi        = (s: any) => s.citizenUi as CitizenUiState;
export const selectActiveSettingsTab = (s: any) => (s.citizenUi as CitizenUiState).activeSettingsTab;
export const selectAdminCitizenFilter = (s: any) => ({
  search:   (s.citizenUi as CitizenUiState).adminSearch,
  page:     (s.citizenUi as CitizenUiState).adminPage,
  filter:   (s.citizenUi as CitizenUiState).adminFilter,
  selected: (s.citizenUi as CitizenUiState).adminSelectedId,
});