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
        params: payload,
      }),
      providesTags: ["Users"],
    }),
    userDetails: build.query({
      query: (id: any) => ({
        url: `${API_ROUTES.USERS.USEDETAILS}${id}/`,
        method: "GET",
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
      transformResponse: (response: any) => {
        console.log('response :>> ', response);
        return response?.user_detail;
      }
    }),

    userPurchaseHistory: build.query({
      query: (id: any) => ({
        url: `${API_ROUTES.USERS.PURCHASEHISTORY}${id}/`,
        method: "GET",
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),

    userCreditUsage: build.query({
      query: (id: any) => ({
        url: `${API_ROUTES.USERS.CREDITUSAGE}${id}/`,
        method: "GET",
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),
  }),
});

export const {
  useAllUsersListQuery,
  useUserDetailsQuery,
  useUserPurchaseHistoryQuery,
  useUserCreditUsageQuery,
} = userApi;
