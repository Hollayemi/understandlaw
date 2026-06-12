import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import {
  Book,
  BookOrder,
  LibraryStats,
  ListBooksParams,
} from "@/redux/types/library";
import { ApiResponse, PaginatedResponse } from "./types";
import { Pagination } from "@/redux/types";

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "user" }),
  tagTypes: ["UserBooks", "UserOrders", "UserStats"],

  endpoints: (builder) => ({
    listBooks: builder.query<PaginatedResponse<Book[]>, ListBooksParams>({
      query: (params) => ({
        url: "/library/books",
        method: "GET",
        params: {
          ...params,
          status: "active", // Only show active books to users
        },
      }),
      providesTags: ["UserBooks"],
    }),

    getBookById: builder.query<ApiResponse<Book>, string>({
      query: (bookId) => ({
        url: `/library/books/${bookId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UserBooks", id }],
    }),

    getLibraryStats: builder.query<ApiResponse<LibraryStats>, void>({
      query: () => ({
        url: "/library/books/stats",
        method: "GET",
      }),
      providesTags: ["UserStats"],
    }),

    downloadBook: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (bookId) => ({
        url: `/library/books/${bookId}/download`,
        method: "POST",
      }),
      invalidatesTags: (result, error, bookId) => [
        { type: "UserBooks", id: bookId },
        "UserStats",
      ],
    }),

    createOrder: builder.mutation<ApiResponse<{order:BookOrder; payment: any}>, Partial<BookOrder>>({
      query: (orderData) => ({
        url: "/library/orders",
        method: "POST",
        data: orderData,
      }),
      invalidatesTags: ["UserOrders", "UserStats"],
    }),

    getUserOrders: builder.query<ApiResponse<Pagination<BookOrder>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/library/orders/me",
        method: "GET",
        params,
      }),
      providesTags: ["UserOrders"],
    }),

    getUserOrderById: builder.query<ApiResponse<BookOrder>, string>({
      query: (orderId) => ({
        url: `/library/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UserOrders", id }],
    }),
  }),
});

// Export hooks
export const {
  useListBooksQuery,
  useGetBookByIdQuery,
  useGetLibraryStatsQuery,
  useDownloadBookMutation,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetUserOrderByIdQuery,
} = libraryApi;