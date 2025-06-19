import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: null,
    isAuthLoading: true
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.token = payload.token;
            state.user = payload.user;
            state.isAuthLoading = false
        },
        clearCredentials: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthLoading = false
        },
        setIsAuthLoading: (state, { payload }) => {
            state.isAuthLoading = payload
        }
    }
})

export const {
    setCredentials,
    clearCredentials,
    setIsAuthLoading
} = authSlice.actions;

export const authSliceReducer = authSlice.reducer;