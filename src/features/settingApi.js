// src/services/taskApi.js
import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";


export const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user.token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
        tagTypes: ["Settings"],


    }),
    endpoints: (builder) => ({
        settings: builder.query({
            query: () => "https://phics.uncw3b.com/api/settings",
            providesTags: ["Settings"]

        }),
        updateSetting: builder.mutation({
            query: (setting) => ({
                url: `https://phics.uncw3b.com/api/settings/updatesettings`,
                method: "PUT",
                body: setting
            }),
            invalidatesTags: ["Settings"]
        })
    })
});

export const {
    useSettingsQuery,
    useUpdateSettingMutation,
} = settingApi;