// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const emailSettingsApi = createApi({
    reducerPath: "emailSettingsApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["EmailSettings"],


    }),
    endpoints: (builder) => ({
        emailSettings: builder.query({
            query: () => "/api/mail",
            providesTags: ["EmailSettings"]

        }),
        testEmailSetting: builder.mutation({
            query: (emailSettings) => ({
                url: `/api/mail/test`,
                method: "POST",
                body: emailSettings
            }),
            invalidatesTags: ["EmailSettings"]
        }),
        updateEmailSetting: builder.mutation({
            query: (emailSettings) => ({
                url: `/api/mail/update`,
                method: "PUT",
                body: emailSettings
            }),
            invalidatesTags: ["EmailSettings"]
        })
    })
});

export const {
    useEmailSettingsQuery,
    useUpdateEmailSettingMutation,
    useTestEmailSettingMutation,
} = emailSettingsApi;