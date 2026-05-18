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

  console.log("expired")

  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ reason: "unauthorized" | "forbidden" }>).detail;
    cb(detail.reason);
  };

  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}
