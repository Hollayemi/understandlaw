"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setBridgeToken, clearBridgeTokens } from "@/redux/shared/sessionBridge";
import { emitAuthLogin } from "@/redux/shared/authEvents";

/**
 * Mounted once inside <SessionProvider> (see redux/provider.tsx). Keeps
 * redux/shared/sessionBridge.ts in sync with the live NextAuth session so
 * axiosBaseQuery always has the current backend access token, without
 * touching localStorage.
 */
export default function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.accessToken) {
      const actor = session.actor === "admin" ? "admin" : "user";
      setBridgeToken(actor, session.accessToken);
      emitAuthLogin(actor);
    } else {
      clearBridgeTokens();
    }
  }, [status, session?.accessToken, session?.actor]);

  return null;
}
