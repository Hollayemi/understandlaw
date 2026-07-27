import { createApi } from '@reduxjs/toolkit/query/react';
import {
    AdminAuthResponse,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    ResetPasswordRequest,
    ApiResponse,
    CitizenFull
} from '../types';
import { axiosBaseQuery } from '../shared/axiosBaseQuery';

// NOTE: Admin sign-in is handled by NextAuth's "admin-credentials" provider
// (see /auth.ts and app/admin/login/page.tsx), so the admin access token
// lives in NextAuth's encrypted session cookie, not localStorage. These
// endpoints share the same 401-retry logic as the citizen/lawyer API via
// `axiosBaseQuery({ defaultActor: "admin" })`.

export const adminAuthApi = createApi({
    reducerPath: 'adminAuthApi',
    baseQuery: axiosBaseQuery({ defaultActor: 'admin' }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
            query: ({ token, password, confirmPassword }) => ({
                url: `/auth/admin/reset-password/${token}`,
                method: 'PATCH',
                data: { password, confirmPassword },
            }),
        }),

        getMe: builder.query<ApiResponse<CitizenFull>, void>({
            query: () => ({ url: '/auth/admin/me' }),
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<AdminAuthResponse, UpdateProfileRequest>({
            query: (profileData) => ({
                url: '/auth/admin/update-profile',
                method: 'PATCH',
                data: profileData,
            }),
            invalidatesTags: ['User'],
        }),

        updatePassword: builder.mutation<{ message: string }, UpdatePasswordRequest>({
            query: (passwordData) => ({
                url: '/auth/admin/update-password',
                method: 'PATCH',
                data: passwordData,
            }),
        }),

        // Still calls the backend to revoke the refresh-token cookie
        // server-side. Callers should also call `signOut()` from
        // next-auth/react right after to end the NextAuth session itself.
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/admin/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        })
    }),
});

export const {
    useGetMeQuery,
    useLazyGetMeQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useLogoutMutation,
} = adminAuthApi;

export const selectCurrentUser = (state: any) => {
    return adminAuthApi.endpoints.getMe.select()(state)?.data;
};