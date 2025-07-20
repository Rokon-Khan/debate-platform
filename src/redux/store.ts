import { configureStore } from "@reduxjs/toolkit";
import { argumentApi } from "./features/argumentApi";
import { authApi } from "./features/authApi";
import { debateApi } from "./features/debateApi";
import { scoreboardApi } from "./features/scoreboardApi";
import { voteApi } from "./features/voteApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [debateApi.reducerPath]: debateApi.reducer,
    [argumentApi.reducerPath]: argumentApi.reducer,
    [voteApi.reducerPath]: voteApi.reducer,
    [scoreboardApi.reducerPath]: scoreboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(debateApi.middleware)
      .concat(argumentApi.middleware)
      .concat(voteApi.middleware)
      .concat(scoreboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
