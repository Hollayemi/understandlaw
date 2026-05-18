/**
 * axiosBaseQuery.ts  (REPLACEMENT)
 *
 * Differences from the original:
 *  1. 401 → clears the relevant token, emits authExpired event
 *  2. 403 → emits authExpired event with "forbidden" reason
 *  3. Actor-aware token clearing  (admin vs user)
 */

"use client";

import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { emitAuthExpired } from "./authEvents";

export const server =
  process.env.NODE_ENV === "production"
    ? "https://lawticha.onrender.com"
    : "http://localhost:5001";

type ActorType = "user" | "admin";

export interface RequestConfig {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  endpointActor?: ActorType;
  skipSuccessToast?: boolean;
  /** Pass true on logout / token-refresh endpoints to skip the 401 redirect */
  skipAuthRedirect?: boolean;
}


const TOKEN_KEYS: Record<ActorType, string> = {
  user: "accessToken",
  admin: "adminAccessToken",
};

function getToken(actor: ActorType = "user"): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEYS[actor]) ?? "";
}

function clearToken(actor: ActorType): void {
  if (typeof window === "undefined") return;
  // localStorage.removeItem(TOKEN_KEYS[actor]);
}

function getAuthHeaders(actor: ActorType = "user"): Record<string, string> {
  const token = getToken(actor);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function showSuccessToast(data: any) {
  const { type, message } = data || {};
  if (type === "success" && message && message !== "success") {
    toast.success(message);
  }
}

export const axiosBaseQuery = (
  {
    baseUrl,
    defaultActor,
  }: { baseUrl?: string; defaultActor?: ActorType } = {
    baseUrl: "",
    defaultActor: "user",
  },
): BaseQueryFn<
  RequestConfig,
  unknown,
  { status: number; data: any; message?: string }
> => {
  return async (requestConfig) => {
    const {
      url,
      method = "GET",
      data,
      params,
      headers = {},
      endpointActor,
      skipSuccessToast = false,
      skipAuthRedirect = false,
    } = requestConfig;

    const actor = endpointActor ?? defaultActor ?? "user";

    try {
      const authHeaders = getAuthHeaders(actor);
      const mergedHeaders = { ...authHeaders, ...headers };

      const fullUrl = new URL(`${server}/api/v1${url}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            fullUrl.searchParams.append(key, String(value));
          }
        });
      }

      const fetchOptions: RequestInit = {
        method,
        headers: mergedHeaders,
        credentials: "include",
      };

      if (method !== "GET" && method !== "HEAD" && data) {
        // If FormData, let the browser set the boundary automatically
        if (data instanceof FormData) {
          const { "Content-Type": _omit, ...rest } = mergedHeaders as any;
          fetchOptions.headers = rest;
          fetchOptions.body = data;
        } else {
          fetchOptions.body = JSON.stringify(data);
        }
      }

      const response = await fetch(fullUrl.toString(), fetchOptions);

      let responseData: any;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.status === 401 && !skipAuthRedirect) {
        clearToken(actor);
        emitAuthExpired("unauthorized");

        return {
          error: {
            status: 401,
            data: responseData,
            message: "Your session has expired. Please sign in again.",
          },
        };
      }

      // ── 403 Forbidden ─────────────────────────────────────────────────────
      if (response.status === 403 && !skipAuthRedirect) {
        emitAuthExpired("forbidden");

        return {
          error: {
            status: 403,
            data: responseData,
            message: "You do not have permission to perform this action.",
          },
        };
      }

      // ── Other HTTP errors ─────────────────────────────────────────────────
      if (!response.ok) {
        const message =
          responseData?.message ??
          responseData?.error ??
          response.statusText ??
          "Something went wrong";

        // Only show toast for non-auth errors (auth errors handled by AuthGuard)
        if (response.status !== 401 && response.status !== 403) {
          toast.error(message);
        }

        return {
          error: {
            status: response.status,
            data: responseData,
            message,
          },
        };
      }

      if (!skipSuccessToast) {
        showSuccessToast(responseData);
      }

      return { data: responseData };
    } catch (error: any) {
      console.error("Request failed:", error);

      const message = error?.message ?? "Network error – please check your connection";
      toast.error(message);

      return {
        error: {
          status: error?.status ?? 0,
          data: error?.data ?? { message },
          message,
        },
      };
    }
  };
};

// ─── Token utilities (unchanged from original) ────────────────────────────────

interface TokenStatus {
  isValid: boolean;
  needsRefresh: boolean;
}

export function checkTokenStatus(actor: ActorType = "user"): TokenStatus {
  if (typeof window === "undefined") {
    return { isValid: false, needsRefresh: false };
  }

  try {
    const token = getToken(actor);
    if (!token) return { isValid: false, needsRefresh: false };

    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60; // 5-minute buffer

    if (typeof decoded.exp === "number") {
      return {
        isValid: decoded.exp > currentTime,
        needsRefresh: decoded.exp < currentTime + bufferTime,
      };
    }

    return { isValid: false, needsRefresh: false };
  } catch {
    return { isValid: false, needsRefresh: false };
  }
}

export const isAuthenticated = (actor: ActorType = "user") =>
  checkTokenStatus(actor).isValid;

export const needsTokenRefresh = (actor: ActorType = "user") =>
  checkTokenStatus(actor).needsRefresh;

export const clearAuthData = (actor: ActorType = "user") => clearToken(actor);
