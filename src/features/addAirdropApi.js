// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const addAirdropApi = createApi({
    reducerPath: "addAirdropApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["Airdrops"],


    }),
    endpoints: (builder) => ({
        airdrops: builder.query({
            query: () => "/api/airdrop/",
            providesTags: ["Airdrops"]

        }),
        addAirdrop: builder.mutation({
            query: (airdrop) => ({
                url: `/api/airdrop/add`,
                method: "POST",
                body: airdrop
            }),
            invalidatesTags: ["Airdrops"]
        }),
        updateAirdrop: builder.mutation({
            query: (airdrop) => ({
                url: `/api/airdrop/update`,
                method: "PUT",
                body: airdrop
            }),
            invalidatesTags: ["Airdrops"]
        }),
        deleteAirdrop: builder.mutation({
            query: (id) => ({
                url: `/api/airdrop/delete`,
                method: "DELETE",
                body: { id: id }
            }),
            invalidatesTags: ["Airdrops"]
        })
    })
});

export const {
    useAirdropsQuery,
    useAddAirdropMutation,
    useUpdateAirdropMutation,
    useDeleteAirdropMutation
} = addAirdropApi;