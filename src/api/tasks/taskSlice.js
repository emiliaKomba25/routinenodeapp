import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: "taskSlice",
    initialState: {tasks: null, user: null},
    reducers: {
        setStateTasks: (state, { payload }) => {
            state.tasks = payload
        },
        clearStateTasks: (state) => {
            state.tasks = null
        },
        setStateUser: (state, { payload }) => {
            state.user = payload
        },
        clearStateUser: (state) => {
            state.user = null
        }
    }
})

export const {
    setStateTasks,
    clearStateTasks,
    setStateUser,
    clearStateUser
} = taskSlice.actions

export const taskSliceReducer = taskSlice.reducer