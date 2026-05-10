import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    AdminAuthResponse,
    SignInRequest,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    ResetPasswordRequest,
    ApiResponse,
    CitizenFull
} from '../types';
import { showError, showSuccess } from '@/app/components/ui/sonner';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/v1/auth/admin`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem('adminAccessToken');
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
            { url: '/refresh-token', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as AdminAuthResponse;
            localStorage.setItem('adminAccessToken', accessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            localStorage.removeItem('adminAccessToken');
        }
    }

    return result;
};

export const adminAuthApi = createApi({
    reducerPath: 'adminAuthApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        adminLogin: builder.mutation<ApiResponse<AdminAuthResponse>, SignInRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('adminAccessToken', data.data.accessToken);
                    if (data.success) {
                        showSuccess("Welcome Back!", data.message || "Welcome back!");
                    } else {
                        showError("Sign in failed", data.message || "An unexpected error occurred. Please try again.");
                    }
                } catch (error) {

                }
            },
            invalidatesTags: ['User'],
        }),


        resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
            query: ({ token, password, confirmPassword }) => ({
                url: `/reset-password/${token}`,
                method: 'PATCH',
                body: { password, confirmPassword },
            }),
        }),

        getMe: builder.query<ApiResponse<CitizenFull>, void>({
            query: () => '/me',
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<AdminAuthResponse, UpdateProfileRequest>({
            query: (profileData) => ({
                url: '/update-profile',
                method: 'PATCH',
                body: profileData,
            }),
            invalidatesTags: ['User'],
        }),

        updatePassword: builder.mutation<{ message: string }, UpdatePasswordRequest>({
            query: (passwordData) => ({
                url: '/update-password',
                method: 'PATCH',
                body: passwordData,
            }),
        }),

          logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('adminAccessToken');
                } catch (error) {
                    // console.error('Logout failed:', error);
                }
            },
            invalidatesTags: ['User'],
        })
    }),
});

export const {
    useAdminLoginMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useLogoutMutation,
} = adminAuthApi;

export const selectCurrentUser = (state: any) => {
    return adminAuthApi.endpoints.getMe.select()(state)?.data;
};

export const selectIsAuthenticated = (state: any) => {
    return !!localStorage.getItem('adminAccessToken');
};