// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["Menus"],


    }),
    endpoints: (builder) => ({
        menus: builder.query({
            query: () => "https://phics.uncw3b.com/api/menu/",
            providesTags: ["Menus"]

        }),
        addMenu: builder.mutation({
            query: (menu) => ({
                url: `https://phics.uncw3b.com/api/menu/add`,
                method: "POST",
                body: menu
            }),
            invalidatesTags: ["Menus"]
        }),
        updateMenu: builder.mutation({
            query: (menu) => ({
                url: `https://phics.uncw3b.com/api/menu/update`,
                method: "PUT",
                body: menu
            }),
            invalidatesTags: ["Menus"]
        }),
        deleteMenu: builder.mutation({
            query: (id) => ({
                url: `https://phics.uncw3b.com/api/menu/delete`,
                method: "DELETE",
                body: { id: id }
            }),
            invalidatesTags: ["Menus"]
        })
    })
});

export const {
    useMenusQuery,
    useAddMenuMutation,
    useUpdateMenuMutation,
    useDeleteMenuMutation
} = menuApi;