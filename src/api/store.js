import { configureStore } from "@reduxjs/toolkit";
import { authSliceReducer } from "./auth/authSlice";
import { authApi } from "./auth/authApi";
import { taskSliceReducer } from "./tasks/taskSlice";
import { taskApi } from "./tasks/taskApi";

const store = configureStore({
    reducer: {
        authSlice: authSliceReducer,
        taskSlice: taskSliceReducer,
        [authApi.reducerPath]: authApi.reducer,
        [taskApi.reducerPath]: taskApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, taskApi.middleware)
})

export default store;