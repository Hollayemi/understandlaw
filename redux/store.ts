import { configureStore } from "@reduxjs/toolkit";
import { modulesApi, modulesUiSlice } from "./slices/modules.slice";

export const store = configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
    modulesUi: modulesUiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(modulesApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;