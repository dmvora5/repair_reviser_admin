import { API_ROUTES } from "@/constant/routes";
import { baseQueryWithAuth } from "@/utils/RtkApiCall";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "users",
  tagTypes: ["Users", "Price"],
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
        return {
          user: response?.user_detail,
          company: response?.company_users,
        };
      },
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
    userJobList: build.query({
      query: (id: any) => ({
        url: `${API_ROUTES.USERS.JOBLIST}${id}/`,
        method: "GET",
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),
    getPriceLists: build.query({
      query: () => ({
        url: API_ROUTES.PRICING.GETPRICELIST,
        method: "GET",
      }),
      providesTags: (result: any) =>
        result?.results
          ? [
              { type: "Price", id: "LIST" },
              ...result.results.map(({ id }: any) => ({ type: "Price", id })),
            ]
          : [{ type: "Price", id: "LIST" }],
    }),
    deletePrice: build.mutation({
      query: (id: any) => ({
        url: API_ROUTES.PRICING.DELETEPRICE + id + "/",
        method: "DELETE",
      }),
      invalidatesTags: (result: any, error: any, { id }: any) => [
        { type: "Price", id: "LIST" },
        { type: "Price", id: +id },
      ],
    }),
    addPrice: build.mutation({
      query: (payload: any) => ({
        url: API_ROUTES.PRICING.CREATEPRICE,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Price", id: "LIST" }],
    }),
    updatePrice: build.mutation({
      query: (payload: any) => ({
        url: `${API_ROUTES.PRICING.UPDATEPRICE}${payload.id}/`,
        method: "PATCH",
        body: {
          credit_amount: payload?.credit_amount,
          price: payload?.price,
          // company: payload?.company,
        },
      }),
      invalidatesTags: (result: any, error: any, { id }: any) => {
        console.log("id", id);
        return [
          { type: "Price", id: "LIST" },
          { type: "Price", id: +id },
        ];
      },
    }),
    getCompanyList: build.query({
      query: (id: any) => ({
        url: API_ROUTES.PRICING.COMPANYLIST,
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
  useUserJobListQuery,

  //pricing
  useGetPriceListsQuery,
  useDeletePriceMutation,
  useAddPriceMutation,
  useUpdatePriceMutation,
  useGetCompanyListQuery,
} = userApi;
