import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { clearCredentials, setCredentials } from "./auth/authSlice";
import { Navigate } from "react-router-dom";


const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const token = getState().authSlice.token;
        if(token){
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

export const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if(result.error?.status === 401){
        const refreshResult = await baseQuery('/refresh', api, extraOptions);
        if(refreshResult.data){
            await api.dispatch(setCredentials(refreshResult.data))
            result = await baseQuery(args, api, extraOptions);
        }
        if(refreshResult?.error){
            api.dispatch(clearCredentials())
        }
    }
    return result
}