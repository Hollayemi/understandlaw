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
  UploadBookPayload,
} from "@/redux/types/library";
import { ApiResponse, PaginatedResponse } from "../types";

export const adminLibraryApi = createApi({
  reducerPath: "adminLibraryApi",
  baseQuery: axiosBaseQuery({ baseUrl: "", defaultActor: "admin" }),
  tagTypes: ["AdminBooks", "AdminBookDetail", "AdminOrders", "AdminOrderDetail", "AdminStats"],

  endpoints: (builder) => ({
    // Books endpoints
    adminListBooks: builder.query<PaginatedResponse<Book[]>, ListBooksParams>({
      query: (params) => ({
        url: "/admin/library/books",
        method: "GET",
        params,
      }),
      providesTags: ["AdminBooks"],
    }),

    adminGetBookStats: builder.query<ApiResponse<LibraryStats>, void>({
      query: () => ({
        url: "/admin/library/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    adminGetBookById: builder.query<ApiResponse<Book>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminBookDetail", id }],
    }),

    adminUploadBook: builder.mutation<ApiResponse<Book>, UploadBookPayload>({
      query: (formData) => ({
        url: "/admin/library/books",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["AdminBooks", "AdminStats"],
    }),

    adminUpdateBook: builder.mutation<ApiResponse<Book>, UpdateBookPayload>({
      query: ({ id, updates }) => ({
        url: `/admin/library/books/${id}`,
        method: "PATCH",
        data: { updates },
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminBooks",
        "AdminStats",
        { type: "AdminBookDetail", id },
      ],
    }),

    adminDeleteBook: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminBooks", "AdminStats"],
    }),

    adminToggleBookFeatured: builder.mutation<ApiResponse<{ featured: boolean }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, bookId) => [
        "AdminBooks",
        "AdminStats",
        { type: "AdminBookDetail", id: bookId },
      ],
    }),

    adminToggleBookStatus: builder.mutation<ApiResponse<{ status: BookStatus }>, string>({
      query: (bookId) => ({
        url: `/admin/library/books/${bookId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, bookId) => [
        "AdminBooks",
        "AdminStats",
        { type: "AdminBookDetail", id: bookId },
      ],
    }),

    // Orders endpoints
    adminListOrders: builder.query<PaginatedResponse<BookOrder[]>, ListOrdersParams>({
      query: (params) => ({
        url: "/admin/library/orders",
        method: "GET",
        params,
      }),
      providesTags: ["AdminOrders"],
    }),

    adminGetOrderById: builder.query<ApiResponse<BookOrder>, string>({
      query: (orderId) => ({
        url: `/admin/library/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminOrderDetail", id }],
    }),

    adminUpdateOrderStatus: builder.mutation<ApiResponse<BookOrder>, UpdateOrderStatusPayload>({
      query: ({ orderId, status, trackingNumber }) => ({
        url: `/admin/library/orders/${orderId}/status`,
        method: "PATCH",
        data: { status, trackingNumber },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        "AdminOrders",
        "AdminStats",
        { type: "AdminOrderDetail", id: orderId },
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