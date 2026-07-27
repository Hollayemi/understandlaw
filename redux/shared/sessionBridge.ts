/**
 * sessionBridge.ts
 *
 * RTK Query's `axiosBaseQuery` is a plain function, not a React hook, so it
 * can't call `useSession()` directly. `<SessionSync />` (mounted once near
 * the root) subscribes to `useSession()` and mirrors the current backend
 * access token into this module-level object, which `axiosBaseQuery` reads
 * synchronously on every request.
 *
 * This never touches localStorage — the token only ever lives in memory on
 * the client and inside NextAuth's encrypted httpOnly session cookie.
 */

type ActorType = "user" | "admin";

const state: Record<ActorType, string | null> = {
  user: null,
  admin: null,
};

export function setBridgeToken(actor: ActorType, token: string | null) {
  state[actor] = token;
}

export function getBridgeToken(actor: ActorType): string | null {
  return state[actor];
}

export function clearBridgeTokens() {
  state.user = null;
  state.admin = null;
}
