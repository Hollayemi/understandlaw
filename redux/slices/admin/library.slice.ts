import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/axiosBaseQuery";
import {
  Book,
  BookOrder,
  LibraryStats,
  BookStatus,
  ListBooksParams,
  UpdateBookPayload,
  ListOrdersParams,
  UpdateOrderStatusPayload,
} from "@/redux/types/library";
import { ApiResponse } from "../types";
import { Pagination } from "@/redux/types";

// Additional types for API params and payloads

export const adminLibraryApi = createApi({
  reducerPath: "adminLibraryApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "admin" }),
  tagTypes: ["BookList", "BookDetail", "OrderList", "OrderDetail", "LibraryStats"],

  endpoints: (builder) => ({

    // Books endpoints
    adminListBooks: builder.query<ApiResponse<Pagination<Book>>, ListBooksParams>({
      query: (params) => ({
        url: "/admin/library/books",
        method: "GET",
        params,
      }),
      providesTags: ["BookList"],
    }),

    adminGetBookStats: builder.query<ApiResponse<LibraryStats>, void>({
      query: () => ({
        url: "/admin/library/stats",
        method: "GET",
      }),
      providesTags: ["LibraryStats"],
    }),

    adminGetBookById: builder.query<ApiResponse<Book>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BookDetail", id }],
    }),

    adminUploadBook: builder.mutation<ApiResponse<Book>, FormData>({
      query: (formData) => ({
        url: "/admin/library/books",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["BookList", "LibraryStats"],
    }),

    adminUpdateBook: builder.mutation<ApiResponse<Book>, UpdateBookPayload>({
      query: ({ id, updates }) => ({
        url: `/admin/library/books/${id}`,
        method: "PATCH",
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        "BookList",
        "LibraryStats",
        { type: "BookDetail", id },
      ],
    }),

    adminDeleteBook: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookList", "LibraryStats"],
    }),

    adminToggleBookFeatured: builder.mutation<ApiResponse<{ featured: boolean }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, bookId) => [
        "BookList",
        "LibraryStats",
        { type: "BookDetail", id: bookId },
      ],
    }),

    adminToggleBookStatus: builder.mutation<ApiResponse<{ status: BookStatus }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, bookId) => [
        "BookList",
        "LibraryStats",
        { type: "BookDetail", id: bookId },
      ],
    }),

    // Orders endpoints
    adminListOrders: builder.query<ApiResponse<Pagination<BookOrder>>, ListOrdersParams>({
      query: (params) => ({
        url: "/admin/library/orders",
        method: "GET",
        params,
      }),
      providesTags: ["OrderList"],
    }),

    adminGetOrderById: builder.query<ApiResponse<BookOrder>, string>({
      query: (orderId) => ({
        url: `/admin/library/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "OrderDetail", id }],
    }),

    adminUpdateOrderStatus: builder.mutation<ApiResponse<BookOrder>, UpdateOrderStatusPayload>({
      query: ({ orderId, status, trackingNumber }) => ({
        url: `/admin/library/orders/${orderId}/status`,
        method: "PATCH",
        data: { status, trackingNumber },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        "OrderList",
        "LibraryStats",
        { type: "OrderDetail", id: orderId },
      ],
    }),
  }),
});

// Export hooks
export const {
  // Books
  useAdminListBooksQuery,
  useAdminGetBookStatsQuery,
  useAdminGetBookByIdQuery,
  useAdminUploadBookMutation,
  useAdminUpdateBookMutation,
  useAdminDeleteBookMutation,
  useAdminToggleBookFeaturedMutation,
  useAdminToggleBookStatusMutation,
  
  // Orders
  useAdminListOrdersQuery,
  useAdminGetOrderByIdQuery,
  useAdminUpdateOrderStatusMutation,
} = adminLibraryApi;