// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const galleryApi = createApi({
    reducerPath: "galleryApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ['Gallery'],


    }),
    endpoints: (builder) => ({
        gallery: builder.query({
            query: () => "https://phics.uncw3b.com/api/gallery/",
            providesTags: ['Gallery']

        }),
        addGallery: builder.mutation({
            query: (gallery) => ({
                url: `https://phics.uncw3b.com/api/gallery/add`,
                method: "POST",
                body: gallery
            }),
            invalidatesTags: ['Gallery']
        }),
        updateGallery: builder.mutation({
            query: (gallery) => ({
                url: `https://phics.uncw3b.com/api/gallery/update`,
                method: "PUT",
                body: gallery
            }),
            invalidatesTags: ['Gallery']
        }),
        deleteGallery: builder.mutation({
            query: (id) => ({
                url: `https://phics.uncw3b.com/api/gallery/delete`,
                method: "DELETE",
                body: { id: id }
            }),
            invalidatesTags: ['Gallery']
        })
    })
});

export const {
    useGalleryQuery,
    useAddGalleryMutation,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation
} = galleryApi;