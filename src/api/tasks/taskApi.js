import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQueryWithReAuth";
import { IdCardLanyardIcon } from "lucide-react";

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Task', 'User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (userId) => ({
                url: `/users/${userId}`,
            }),
            providesTags: ['User']
        }),
        getTask: builder.query({
            query: (userId) => ({
                url: `/task/${userId}`,
            }),
            providesTags: (result) => result ? [...result.map(task => ({type: 'Task', id: task._id})), 'Task'] : ['Task']
        }),
        getSingleTask: builder.query({
            query: (id) => ({
                url: `/task/single/${id}`,
            }),
            providesTags: (result) => result ? [{type: 'Task', id: result._id}, 'Task'] : ['Task']
        }),
        checkTask: builder.mutation({
            query: (id) => ({
                url: `/task/check/${id}`,
                method: "POST"
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Task', id: arg}]
        }),
        addTask: builder.mutation({
            query: (taskData) => ({
                url: '/task',
                method: 'POST',
                body: taskData
            }),
            invalidatesTags: ['Task']
        }),
        updateUser: builder.mutation({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData
            }),
            invalidatesTags: ['User']
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/task/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Task']
        }),
        updateTask: builder.mutation({
            query: (taskData) => ({
                url: `/task`,
                method: 'PATCH',
                body: taskData
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Task', id: arg.id}]
        })
    })
})

export const {
    useAddTaskMutation,
    useDeleteTaskMutation,
    useCheckTaskMutation,
    useGetTaskQuery,
    useGetSingleTaskQuery,
    useUpdateTaskMutation,

    useGetUserQuery,
    useUpdateUserMutation
} = taskApi