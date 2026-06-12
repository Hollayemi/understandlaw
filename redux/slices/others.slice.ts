import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse } from "../types";

export const othersApi = createApi({
    reducerPath: "othersApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["GetSpecialisms"],
    endpoints: (builder) => ({
        listSpecialisms: builder.query<ApiResponse<any[]>, void>({
            query: () => ({
                url: "/specialisms",
                method: "GET"
            }),
            providesTags: [{ type: "GetSpecialisms" }],
        }),
    })
});

export const { useListSpecialismsQuery } = othersApi;