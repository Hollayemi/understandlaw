/**
 * authEvents.ts
 *
 * A tiny event bus that lets the RTK Query base query signal "401 received"
 * to any listener (the auth provider, a toast, etc.) without creating
 * circular imports between the Redux store and React components.
 *
 * Usage:
 *   emitAuthExpired()          — called from axiosBaseQuery on 401
 *   onAuthExpired(callback)    — called from AuthGuard / root layout
 *   offAuthExpired(callback)   — cleanup in useEffect
 */

type AuthExpiredCallback = (reason: "unauthorized" | "forbidden") => void;

const AUTH_EXPIRED_EVENT = "lawticha:auth_expired";

/** Fire once when a 401 / 403 lands. */
export function emitAuthExpired(reason: "unauthorized" | "forbidden" = "unauthorized") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { reason } }));
}

/** Subscribe to the event. Returns an unsubscribe function. */
export function onAuthExpired(cb: AuthExpiredCallback): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ reason: "unauthorized" | "forbidden" }>).detail;
    cb(detail.reason);
  };

  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}

/**
 * Fires the instant a valid access token is written to localStorage
 * (sign in, register, lawyer verification submit, token refresh, etc).
 *
 * Without this, anything that checks `isAuthenticated()` only re-evaluates
 * on the next full mount/reload — so RTK Query hooks that are `skip`ped
 * based on that check (e.g. `useGetMeQuery`) never fire after a client-side
 * navigation, and the user's profile only shows up after a manual refresh.
 */
const AUTH_LOGIN_EVENT = "lawticha:auth_login";

type AuthLoginCallback = (actor: "user" | "admin") => void;

export function emitAuthLogin(actor: "user" | "admin" = "user") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_LOGIN_EVENT, { detail: { actor } }));
}

export function onAuthLogin(cb: AuthLoginCallback): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ actor: "user" | "admin" }>).detail;
    cb(detail.actor);
  };

  window.addEventListener(AUTH_LOGIN_EVENT, handler);
  return () => window.removeEventListener(AUTH_LOGIN_EVENT, handler);
}
