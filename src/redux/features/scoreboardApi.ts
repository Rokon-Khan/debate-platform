/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const scoreboardApi = createApi({
  reducerPath: "scoreboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/scoreboard` }),
  endpoints: (builder) => ({
    getScoreboard: builder.query<any, { filter?: string }>({
      query: ({ filter }) => ({
        url: "/",
        params: filter ? { filter } : undefined,
      }),
    }),
  }),
});

export const { useGetScoreboardQuery } = scoreboardApi;
