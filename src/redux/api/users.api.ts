import { API_ROUTES } from "@/constant/routes";
import { baseQueryWithAuth } from "@/utils/RtkApiCall";
import { createApi } from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    baseQuery: baseQueryWithAuth,
    reducerPath: "users",
    tagTypes: ["Users"],
    endpoints: (build: any) => ({
        allUsersList: build.query({
            query: (payload: any) => ({
                url: API_ROUTES.USERS.LIST,
                method: "GET",
                params: payload
            }),
            providesTags: ["Users"]
        }),
    })
})


export const {
    useAllUsersListQuery
} = userApi