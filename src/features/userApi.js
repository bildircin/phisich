// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["Users"],


    }),
    endpoints: (builder) => ({
        users: builder.query({
            query: () => "https://phics.uncw3b.com/api/users",
            providesTags: ["Users"]

        }),
        addUser: builder.mutation({
            query: (user) => ({
                url: `https://phics.uncw3b.com/api/users/add`,
                method: "POST",
                body: user
            }),
            invalidatesTags: ["Users"]
        }),
        updateUser: builder.mutation({
            query: (user) => ({
                url: `https://phics.uncw3b.com/api/users/update`,
                method: "PUT",
                body: user
            }),
            invalidatesTags: ["Users"]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `https://phics.uncw3b.com/api/users/delete`,
                method: "DELETE",
                body: { id: id }
            }),
            invalidatesTags: ["Users"]
        })
    })
});

export const {
    useUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApi;