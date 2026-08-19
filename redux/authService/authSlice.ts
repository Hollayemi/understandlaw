import { createApi } from '@reduxjs/toolkit/query/react';
import {
    AuthResponse,
    RegisterRequest,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendVerificationRequest,
    DeactivateAccountRequest,
    ApiResponse,
    CitizenFull
} from '../types';
import { showError, showSuccess } from '@/app/components/ui/sonner';
import { axiosBaseQuery } from '../shared/axiosBaseQuery';

// NOTE: Sign-in itself is now handled by NextAuth (see /auth.ts and
// app/login/page.tsx, which call `signIn("credentials", ...)` directly)
// so the resulting access token ends up in NextAuth's encrypted session
// cookie instead of localStorage. The endpoints below remain regular
// backend calls that have nothing to do with session storage.

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery({}),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                data: userData,
            }),
              async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if(data.success) {
                        showSuccess("Account created successfully!", data.message || "Welcome back!");
                    }else {
                        showError("Account creation failed", data.message || "An unexpected error occurred. Please try again.");
                    }
                } catch (error) {
                    // console.error('Login failed:', error);
                }
            },
            invalidatesTags: ['User'],
        }),

        // Sign-in and token refresh are handled by NextAuth now:
        //  - sign-in: `signIn("credentials", {...})` from next-auth/react
        //  - refresh: happens transparently inside axiosBaseQuery on a 401

        verifyEmail: builder.mutation<{ message: string }, string>({
            query: (token) => ({
                url: `/verify-email/${token}`,
                method: 'GET',
            }),
        }),

        resendVerification: builder.mutation<{ message: string }, ResendVerificationRequest>({
            query: (data) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                data: data,
            }),
        }),

        forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                data: data,
            }),
        }),

        validateResetPasswordToken: builder.mutation<{ message: string }, string>({
            query: (token) => ({
                url: `/auth/validate-reset-password/${token}`,
                method: 'PATCH',
            }),
        }),

        resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
            query: ({ token, password, confirmPassword }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'PATCH',
                data: { password, confirmPassword },
            }),
        }),

        getMe: builder.query<ApiResponse<CitizenFull>, void>({
            query: () => ({
                url: "/auth/me"
            }),
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<AuthResponse, UpdateProfileRequest>({
            query: (profileData) => ({
                url: '/auth/update-profile',
                method: 'PATCH',
                data: profileData,
            }),
            invalidatesTags: ['User'],
        }),

        updatePassword: builder.mutation<{ message: string }, UpdatePasswordRequest>({
            query: (passwordData) => ({
                url: '/auth/update-password',
                method: 'PATCH',
                data: passwordData,
            }),
        }),

        // Both of these still hit the backend to revoke the refresh-token
        // cookie server-side. Ending the NextAuth session itself is done by
        // the caller with `signOut()` from next-auth/react right after —
        // see app/components/wrapper/AuthGuard.tsx and the account
        // deactivation flow for examples.
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),

        deactivateAccount: builder.mutation<{ message: string }, DeactivateAccountRequest>({
            query: (data) => ({
                url: '/auth/deactivate',
                method: 'DELETE',
                data: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useValidateResetPasswordTokenMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useLogoutMutation,
    useDeactivateAccountMutation,
} = authApi;

export const selectCurrentUser = (state: any) => {
    return authApi.endpoints.getMe.select()(state)?.data;
};