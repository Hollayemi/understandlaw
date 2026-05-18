import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    AuthResponse,
    RegisterRequest,
    SignInRequest,
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

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/v1/auth`,
    credentials: 'include', 
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            { url: '/auth/refresh-token', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as AuthResponse;
            localStorage.setItem('accessToken', accessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    return result;
};

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
                    localStorage.setItem('accessToken', data.data.accessToken);

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

        signIn: builder.mutation<ApiResponse<AuthResponse>, SignInRequest>({
            query: (credentials) => ({
                url: '/auth/signin',
                method: 'POST',
                data: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                // try {
                //     const { data } = await queryFulfilled;
                //     console.log(data.data.accessToken)
                //     localStorage.setItem('accessToken', data.data.accessToken);
                //     if(data.success) {
                //         showSuccess("Welcome Back!", data.message || "Welcome back!")
                //     }else {
                //         showError("Sign in failed", data.message || "An unexpected error occurred. Please try again.");
                //     }
                // } catch (error) {   
                // }
            },
            invalidatesTags: ['User'],
        }),

        refreshToken: builder.mutation<ApiResponse<AuthResponse>, void>({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('accessToken', data.data.accessToken);
                } catch (error) {
                    // console.error('Token refresh failed:', error);
                }
            },
        }),

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

        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('accessToken');
                } catch (error) {
                    // console.error('Logout failed:', error);
                }
            },
            invalidatesTags: ['User'],
        }),

        deactivateAccount: builder.mutation<{ message: string }, DeactivateAccountRequest>({
            query: (data) => ({
                url: '/auth/deactivate',
                method: 'DELETE',
                data: data,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('accessToken');
                } catch (error) {
                    // console.error('Account deactivation failed:', error);
                }
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useSignInMutation,
    useRefreshTokenMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,

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

export const selectIsAuthenticated = (state: any) => {
    return !!localStorage.getItem('accessToken');
};