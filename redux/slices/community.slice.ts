import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse, Pagination } from "../types";
import { CommunityPost, CommunityRoom, Comment, CreatePostInput, CreateCommentInput, CommunityRoomType, CreatePostPayload } from "../types/community";

export const communityApi = createApi({
  reducerPath: "communityApi",
  baseQuery: axiosBaseQuery({ defaultActor: "user" }),
  tagTypes: ["CommunityPosts", "CommunityPost", "CommunityComments", "CommunityRooms"],

  endpoints: (builder) => ({
    // Get community rooms
    getCommunityRooms: builder.query<ApiResponse<CommunityRoom[]>, void>({
      query: () => ({
        url: "/community/rooms",
        method: "GET",
      }),
      providesTags: ["CommunityRooms"],
    }),

    // Get posts by room
    getCommunityPosts: builder.query<
      ApiResponse<Pagination<CommunityPost[]>>,
      { room?: CommunityRoomType; sort?: string; page?: number; pageSize?: number; search?: string }
    >({
      query: (params) => ({
        url: "/community/posts",
        method: "GET",
        params: {
          room: params.room,
          sort: params.sort || "latest",
          page: params.page || 1,
          pageSize: params.pageSize || 20,
          search: params.search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ _id }) => ({ type: "CommunityPosts" as const, id: _id })),
              { type: "CommunityPosts" },
            ]
          : [{ type: "CommunityPosts" }],
    }),

    // Get single post
    getCommunityPost: builder.query<ApiResponse<CommunityPost>, string>({
      query: (postId) => ({
        url: `/community/posts/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CommunityPost", id }],
    }),

    // Create post
    createCommunityPost: builder.mutation<ApiResponse<CommunityPost>, CreatePostPayload>({
      query: (data) => ({
        url: "/community/posts",
        method: "POST",
        data,
      
        // headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["CommunityPosts"],
    }),

    // Create comment
    createCommunityComment: builder.mutation<ApiResponse<Comment>, { postId: string; data: CreateCommentInput }>({
      query: ({ postId, data }) => ({
        url: `/community/posts/${postId}/comments`,
        method: "POST",
        data,
        // headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Like/unlike post
    toggleLikePost: builder.mutation<ApiResponse<{ liked: boolean; likes: number }>, string>({
      query: (postId) => ({
        url: `/community/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "CommunityPost", id }],
    }),

    // Like/unlike comment
    toggleLikeComment: builder.mutation<ApiResponse<{ liked: boolean; likes: number }>, { postId: string; commentId: string }>({
      query: ({ postId, commentId }) => ({
        url: `/community/posts/${postId}/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Accept answer (lawyers only)
    acceptAnswer: builder.mutation<ApiResponse<void>, { postId: string; commentId: string }>({
      query: ({ postId, commentId }) => ({
        url: `/community/posts/${postId}/comments/${commentId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Pin/unpin post (admin/moderator)
    pinPost: builder.mutation<ApiResponse<void>, { postId: string; pinned: boolean }>({
      query: ({ postId, pinned }) => ({
        url: `/community/posts/${postId}/pin`,
        method: "POST",
        data: { pinned },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Lock/unlock post (admin/moderator)
    lockPost: builder.mutation<ApiResponse<void>, { postId: string; locked: boolean }>({
      query: ({ postId, locked }) => ({
        url: `/community/posts/${postId}/lock`,
        method: "POST",
        data: { locked },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Resolve post
    resolvePost: builder.mutation<ApiResponse<void>, { postId: string; resolved: boolean }>({
      query: ({ postId, resolved }) => ({
        url: `/community/posts/${postId}/resolve`,
        method: "POST",
        data: { resolved },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "CommunityPost", id: postId }],
    }),

    // Get posts by reference
    getPostsByReference: builder.query<ApiResponse<CommunityPost[]>, { type: string; id: string }>({
      query: ({ type, id }) => ({
        url: `/community/reference/${type}/${id}`,
        method: "GET",
      }),
      providesTags: ["CommunityPosts"],
    }),
  }),
});

export const {
  useGetCommunityRoomsQuery,
  useGetCommunityPostsQuery,
  useGetCommunityPostQuery,
  useCreateCommunityPostMutation,
  useCreateCommunityCommentMutation,
  useToggleLikePostMutation,
  useToggleLikeCommentMutation,
  useAcceptAnswerMutation,
  usePinPostMutation,
  useLockPostMutation,
  useResolvePostMutation,
  useGetPostsByReferenceQuery,
} = communityApi;