import { configureStore } from "@reduxjs/toolkit";
import { modulesApi, modulesUiSlice } from "./slices/admin/modules.slice";
import { authApi } from "./authService/authSlice";
import { adminAuthApi } from "./authService/adminAuthSlice";
import { citizenApi, citizenUiSlice } from "./slices/citizens.slice";
import { learnApi } from "./slices/learn.slice";
import { othersApi } from "./slices/others.slice";
import { communityApi } from "./slices/community.slice";
import { adminCommunityApi } from "./slices/admin/community.slice";
import { libraryApi } from "./slices/library.slice";
import { adminLibraryApi } from "./slices/admin/library.slice";
import { lawyerApi } from "./slices/lawyers.slice";
import { adminConsultationApi } from "./slices/admin/consultation.slice";
import { adminLawyerApi } from "./slices/admin/lawyer.slice";
import { adminDashboardApi } from "./slices/admin/dashboard.admin.slice";
import { adminsApi } from "./slices/admin/admin.slice";


export const store = configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [othersApi.reducerPath]: othersApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    [lawyerApi.reducerPath]: lawyerApi.reducer,
    [adminLawyerApi.reducerPath]: adminLawyerApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [learnApi.reducerPath]: learnApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [adminLibraryApi.reducerPath]: adminLibraryApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [adminCommunityApi.reducerPath]: adminCommunityApi.reducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    [adminConsultationApi.reducerPath]: adminConsultationApi.reducer,
    modulesUi: modulesUiSlice.reducer,
    citizenUi: citizenUiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(othersApi.middleware)
      .concat(modulesApi.middleware)
      .concat(adminAuthApi.middleware)
      .concat(authApi.middleware)
      .concat(citizenApi.middleware)
      .concat(adminLawyerApi.middleware)
      .concat(lawyerApi.middleware)
      .concat(learnApi.middleware)
      .concat(communityApi.middleware)
      .concat(libraryApi.middleware)
      .concat(adminLibraryApi.middleware)
      .concat(adminCommunityApi.middleware)
      .concat(adminDashboardApi.middleware)
      .concat(adminConsultationApi.middleware)
      .concat(adminsApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;