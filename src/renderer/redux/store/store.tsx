import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "src/redux/slice/authentication/AuthenticationSlice";
import errorReducer from "src/redux/slice/error/ErrorSlice";
import asyncTaskReducer from "src/redux/slice/asyncTask/AsyncTaskSlice";
import { api } from "../api/api";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    error: errorReducer,
    asyncTaskState: asyncTaskReducer,
    // We modify the existing store.tsx file to add the API slice's
    // cache reducer to the state. Also, the API slice generates a custom middleware
    // that needs to be added to the store. This middleware must be added as well - it manages cache lifetimes and expiration.
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Opt-out of the check
    }).concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
