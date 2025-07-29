/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ArgumentPostInput {
  content: string;
}
export interface ArgumentEditInput {
  content: string;
}

export const argumentApi = createApi({
  reducerPath: "argumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/arguments`,
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
    postArgument: builder.mutation<any, { debateId: string; content: string }>({
      query: ({ debateId, content }) => ({
        url: `/${debateId}`,
        method: "POST",
        body: { content },
      }),
    }),
    listArguments: builder.query<any[], string>({
      query: (debateId) => `/${debateId}`,
    }),
    editArgument: builder.mutation<any, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: { content },
      }),
    }),
    deleteArgument: builder.mutation<any, string>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  usePostArgumentMutation,
  useListArgumentsQuery,
  useEditArgumentMutation,
  useDeleteArgumentMutation,
} = argumentApi;
