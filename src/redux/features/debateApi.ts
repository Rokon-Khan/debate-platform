// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export interface DebateCreateInput {
//   title: string;
//   description: string;
//   tags?: string[];
//   category: string;
//   image?: string;
//   duration: number;
// }
// export interface DebateJoinInput {
//   side: "support" | "oppose";
// }

// export const debateApi = createApi({
//   reducerPath: "debateApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${BASE_URL}/debates`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as any).auth?.token;
//       if (token) headers.set("Authorization", `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     createDebate: builder.mutation<any, DebateCreateInput>({
//       query: (body) => ({
//         url: "/",
//         method: "POST",
//         body,
//       }),
//     }),
//     joinDebate: builder.mutation<
//       any,
//       { id: string; side: DebateJoinInput["side"] }
//     >({
//       query: ({ id, side }) => ({
//         url: `/${id}/join`,
//         method: "POST",
//         body: { side },
//       }),
//     }),
//     getDebate: builder.query<any, string>({
//       query: (id) => `/${id}`,
//     }),
//     listDebates: builder.query<any[], void>({
//       query: () => "/",
//     }),
//   }),
// });

// export const {
//   useCreateDebateMutation,
//   useJoinDebateMutation,
//   useGetDebateQuery,
//   useListDebatesQuery,
// } = debateApi;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DebateCreateInput {
  title: string;
  description: string;
  tags?: string[];
  category: string;
  image?: string;
  duration: number;
}
export interface DebateJoinInput {
  side: "support" | "oppose";
}

export const debateApi = createApi({
  reducerPath: "debateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/debates`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createDebate: builder.mutation<any, DebateCreateInput>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    joinDebate: builder.mutation<
      any,
      { id: string; side: DebateJoinInput["side"] }
    >({
      query: ({ id, side }) => ({
        url: `/${id}/join`,
        method: "POST",
        body: { side },
      }),
    }),
    getDebate: builder.query<any, string>({
      query: (id) => `/${id}`,
    }),
    listDebates: builder.query<any[], void>({
      query: () => "/",
    }),
  }),
});

export const {
  useCreateDebateMutation,
  useJoinDebateMutation,
  useGetDebateQuery,
  useListDebatesQuery,
} = debateApi;
