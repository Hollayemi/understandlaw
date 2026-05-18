import { configureStore } from "@reduxjs/toolkit";
import { modulesApi, modulesUiSlice } from "./slices/admin/modules.slice";
import { authApi } from "./authService/authSlice";
import { adminAuthApi } from "./authService/adminAuthSlice";
import { citizenApi, citizenUiSlice } from "./slices/citizens.slice";
import { learnApi } from "./slices/learn.slice";
import { communityApi } from "./slices/community.slice";
import { adminCommunityApi } from "./slices/admin/community.slice";
import { lawyerApi } from "./slices/lawyers.slice";
import { adminLawyerApi } from "./slices/admin/lawyer.slice";
import { adminsApi } from "./slices/admin/admin.slice";


export const store = configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    [lawyerApi.reducerPath]: lawyerApi.reducer,
    [adminLawyerApi.reducerPath]: adminLawyerApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [learnApi.reducerPath]: learnApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [adminCommunityApi.reducerPath]: adminCommunityApi.reducer,
    modulesUi: modulesUiSlice.reducer,
    citizenUi: citizenUiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(modulesApi.middleware)
      .concat(adminAuthApi.middleware)
      .concat(authApi.middleware)
      .concat(citizenApi.middleware)
      .concat(adminLawyerApi.middleware)
      .concat(lawyerApi.middleware)
      .concat(learnApi.middleware)
      .concat(communityApi.middleware)
      .concat(adminCommunityApi.middleware)
      .concat(adminsApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;