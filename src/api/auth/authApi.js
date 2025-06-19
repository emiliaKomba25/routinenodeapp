import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReAuth } from '../baseQueryWithReAuth'
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData
            })
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/auth",
                method: "POST",
                body: credentials
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/signout",
                method: "POST",
            })
        }),
        verifyUser: builder.query({
            query: (token) => ({
                url: `/verify/${token}`
            })
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useVerifyUserQuery
} = authApi