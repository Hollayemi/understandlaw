import { configureStore } from "@reduxjs/toolkit";
import { modulesApi, modulesUiSlice } from "./slices/admin/modules.slice";
import { authApi } from "./authService/authSlice";
import { dashboardSlice, dashboardApi } from "./slices/dashboard.slice";
import { adminAuthApi } from "./authService/adminAuthSlice";
import { citizenApi } from "./slices/citizens.slice";
import { subscriptionApi } from "./slices/subscription.slice";
import { learnApi } from "./slices/learn.slice";
import { othersApi } from "./slices/others.slice";
import { communityApi } from "./slices/community.slice";
import { notificationApi } from "./slices/notification.slice";
import { adminCommunityApi } from "./slices/admin/community.slice";
import { libraryApi } from "./slices/library.slice";
import { adminLibraryApi } from "./slices/admin/library.slice";
import { lawyerApi } from "./slices/lawyers.slice";
import { adminConsultationApi } from "./slices/admin/consultation.slice";
import { adminLawyerApi } from "./slices/admin/lawyer.slice";
import { adminDashboardApi } from "./slices/admin/dashboard.admin.slice";
import { adminSubscriptionApi  } from "./slices/admin/subscription.slice"
import { adminsApi } from "./slices/admin/admin.slice";
import { consultationsApi } from "./slices/consultation.slice";
import { chatApi, chatUiSlice } from "./slices/chat.slice";


export const store = configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [othersApi.reducerPath]: othersApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [lawyerApi.reducerPath]: lawyerApi.reducer,
    [adminLawyerApi.reducerPath]: adminLawyerApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [learnApi.reducerPath]: learnApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [adminLibraryApi.reducerPath]: adminLibraryApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [adminCommunityApi.reducerPath]: adminCommunityApi.reducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    [adminConsultationApi.reducerPath]: adminConsultationApi.reducer,
    [adminSubscriptionApi.reducerPath]: adminSubscriptionApi.reducer,
    [consultationsApi.reducerPath]: consultationsApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    modulesUi: modulesUiSlice.reducer,
    // citizenUi: citizenUiSlice.reducer,
    chatUi: chatUiSlice.reducer,
    dashboardUi: dashboardSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(othersApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(modulesApi.middleware)
      .concat(adminAuthApi.middleware)
      .concat(authApi.middleware)
      .concat(citizenApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(adminLawyerApi.middleware)
      .concat(lawyerApi.middleware)
      .concat(learnApi.middleware)
      .concat(notificationApi.middleware)
      .concat(communityApi.middleware)
      .concat(libraryApi.middleware)
      .concat(adminLibraryApi.middleware)
      .concat(adminCommunityApi.middleware)
      .concat(adminDashboardApi.middleware)
      .concat(adminConsultationApi.middleware)
      .concat(adminSubscriptionApi.middleware)
      .concat(consultationsApi.middleware)
      .concat(chatApi.middleware)
      .concat(adminsApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;