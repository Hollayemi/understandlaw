"use client";

import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { emitAuthExpired, emitAuthLogin } from "./authEvents";
import { getBridgeToken, setBridgeToken } from "./sessionBridge";
import { server } from "./backendUrl";

// Re-exported for backward compatibility — every existing `import { server }
// from "@/redux/shared/axiosBaseQuery"` across the redux slices keeps
// working unchanged. New server-side code (auth.ts, middleware.ts) should
// import { server } from "@/redux/shared/backendUrl" directly instead, since
// this file is "use client" and must never be imported from server/edge code.
export { server };

type ActorType = "user" | "admin";

export interface RequestConfig {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  endpointActor?: ActorType;
  skipSuccessToast?: boolean;
  skipAuthRedirect?: boolean;
}


function getToken(actor: ActorType = "user"): string {
  if (typeof window === "undefined") return "";
  return getBridgeToken(actor) ?? "";
}

function clearToken(actor: ActorType): void {
  if (typeof window === "undefined") return;
  setBridgeToken(actor, null);
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

// The backend issues the refresh token as an httpOnly cookie scoped to its
// own domain. Calling these endpoints directly from the browser (as below)
// is what lets that cookie be sent — a server-side NextAuth callback could
// never read it, since the browser only attaches a domain's cookies to
// requests it makes to that same domain.
const REFRESH_PATHS: Record<ActorType, string> = {
  user: "/auth/refresh-token",
  admin: "/auth/admin/refresh-token",
};

async function tryRefreshToken(actor: ActorType): Promise<boolean> {
  try {
    const res = await fetch(`${server}/api/v1${REFRESH_PATHS[actor]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) return false;

    const json = await res.json();
    const accessToken = json?.data?.accessToken;
    if (!accessToken) return false;

    setAuthToken(accessToken, actor);
    return true;
  } catch {
    return false;
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
  const performRequest = async (
    requestConfig: RequestConfig,
    isRetry = false,
  ): Promise<{ data?: any; error?: { status: number; data: any; message?: string } }> => {
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
        if (!isRetry) {
          const refreshed = await tryRefreshToken(actor);
          if (refreshed) {
            return performRequest(requestConfig, true);
          }
        }

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

  return (requestConfig: RequestConfig) => performRequest(requestConfig, false);
};

// ─── Token utilities ────────────────────────────────────────────────────────
// The access token itself now lives in NextAuth's encrypted, httpOnly
// session cookie (never localStorage). `redux/shared/sessionBridge.ts` +
// `<SessionSync />` mirror it into memory here so RTK Query's non-hook base
// query can read it synchronously.

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

/**
 * Manually push a token into the session bridge and notify listeners.
 * In normal flows `<SessionSync />` does this automatically whenever the
 * NextAuth session changes — this is only for the rare case (e.g. right
 * after a manual backend refresh-token call) where you have a fresher
 * token than the session has picked up yet.
 */
export function setAuthToken(token: string, actor: ActorType = "user"): void {
  if (typeof window === "undefined" || !token) return;
  setBridgeToken(actor, token);
  emitAuthLogin(actor);
}

export const needsTokenRefresh = (actor: ActorType = "user") =>
  checkTokenStatus(actor).needsRefresh;

export const clearAuthData = (actor: ActorType = "user") => clearToken(actor);
