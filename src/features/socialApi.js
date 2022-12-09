// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const socialApi = createApi({
    reducerPath: "socialApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["Socials"],


    }),
    endpoints: (builder) => ({
        socials: builder.query({
            query: () => "/api/socials/",
            providesTags: ["Socials"]

        }),
        addSocial: builder.mutation({
            query: (social) => ({
                url: `/api/socials/add`,
                method: "POST",
                body: social
            }),
            invalidatesTags: ["Socials"]
        }),
        updateSocial: builder.mutation({
            query: (social) => ({
                url: `/api/socials/update`,
                method: "PUT",
                body: social
            }),
            invalidatesTags: ["Socials"]
        }),
        deleteSocial: builder.mutation({
            query: (id) => ({
                url: `/api/socials/delete`,
                method: "DELETE",
                body: { id: id }
            }),
            invalidatesTags: ["Socials"]
        })
    })
});

export const {
    useSocialsQuery,
    useAddSocialMutation,
    useUpdateSocialMutation,
    useDeleteSocialMutation
} = socialApi;