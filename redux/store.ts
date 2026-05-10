import { configureStore } from "@reduxjs/toolkit";
import { modulesApi, modulesUiSlice } from "./slices/admin/modules.slice";
import { authApi } from "./authService/authSlice";
import { adminAuthApi } from "./authService/adminAuthSlice";
import { citizenApi, citizenUiSlice } from "./slices/citizens.slice";

export const store = configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    modulesUi: modulesUiSlice.reducer,
    citizenUi: citizenUiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(modulesApi.middleware)
      .concat(adminAuthApi.middleware)
      .concat(authApi.middleware)
      .concat(citizenApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;