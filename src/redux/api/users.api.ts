import { API_ROUTES } from "@/constant/routes";
import { baseQueryWithAuth } from "@/utils/RtkApiCall";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "users",
  tagTypes: ["Users", "Price", "Privacy", "Contact"],
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
      query: (payload: any) => ({
        url: `${API_ROUTES.USERS.PURCHASEHISTORY}${payload?.userId}/`,
        method: "GET",
        params: payload,
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),
    userCreditUsage: build.query({
      query: (payload: any) => ({
        url: `${API_ROUTES.USERS.CREDITUSAGE}${payload?.userId}/`,
        method: "GET",
        params: payload,
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),
    userJobList: build.query({
      query: (payload: any) => ({
        url: `${API_ROUTES.USERS.JOBLIST}${payload?.userId}/`,
        method: "GET",
        params: payload,
      }),
      providesTags: (result: any) => [{ type: "Users", id: +result?.id }],
    }),
    getPriceLists: build.query({
      query: (payload: any) => ({
        url: API_ROUTES.PRICING.GETPRICELIST,
        method: "GET",
        params: payload,
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
        },
      }),
      invalidatesTags: (result: any, error: any, { id }: any) => {
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
    getPrivacyList: build.query({
      query: (payload: any) => ({
        url: API_ROUTES.PRIVACY.GETPRIVACY,
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),
    updatePrivacy: build.mutation({
      query: (payload: any) => {
        let body: Record<string, any> = {};

        if (payload.type === "privacy_text") {
          body.privacy_text = payload.value;
        } else if (payload.type === "terms_condition_text") {
          body.terms_condition_text = payload.value;
        } else if (payload.type === "f_a_q") {
          body.f_a_q = payload.value;
        }

        return {
          url: `${API_ROUTES.PRIVACY.UPDATEPRIVACY}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Privacy"],
    }),
    getContactUsList: build.query({
      query: (payload: any) => ({
        url: API_ROUTES.CONTACTUS.GETCONTACTUS,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Contact"],
    }),
    updateContactUs: build.mutation({
      query: (payload: any) => ({
        url: `${API_ROUTES.CONTACTUS.UPDATECONTACTUS}${payload.id}/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Contact"],
    }),
    getFAQList: build.query({
      query: (payload: any) => ({
        url: API_ROUTES.PRIVACY.GETFAQ,
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),
    CreateFAQ: build.mutation({
      query: (payload: any) => ({
        url: API_ROUTES.PRIVACY.CREATEFAQ,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Privacy"],
    }),
    updateFAQ: build.mutation({
      query: (payload: { id: string; body: Record<string, any> }) => {
        const { id, body } = payload;

        return {
          url: `${API_ROUTES.PRIVACY.UPDATEFAQ}${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Privacy"],
    }),
    deleteFAQ: build.mutation({
      query: (id: any) => ({
        url: `${API_ROUTES.PRIVACY.DELETEFAQ}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Privacy"],
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

  //privacy
  useGetPrivacyListQuery,
  useUpdatePrivacyMutation,

  // contactus
  useGetContactUsListQuery,
  useUpdateContactUsMutation,

  //FAQ
  useGetFAQListQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation
} = userApi;
