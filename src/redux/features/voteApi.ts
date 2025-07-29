/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const voteApi = createApi({
  reducerPath: "voteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/votes`,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as any).auth?.token;
    //   if (token) headers.set("Authorization", `Bearer ${token}`);
    //   return headers;
    // },
    prepareHeaders: (headers) => {
      const token = Cookies.get("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    voteArgument: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useVoteArgumentMutation } = voteApi;
