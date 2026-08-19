/**
 * RouteGuard.tsx
 *
 * A higher-order component / wrapper for pages that need client-side auth
 * verification BEYOND what the middleware does.
 *
 * Use this when you want to:
 *  - Show a proper loading spinner instead of a flash of protected content
 *  - Validate the token client-side before rendering (useful when you can't
 *    read httpOnly cookies from middleware, i.e. localStorage-only setup)
 *  - Redirect to a specific URL after login ("from" param)
 *
 * Usage:
 *   // app/dashboard/layout.tsx
 *   export default function DashboardLayout({ children }) {
 *     return <RouteGuard actor="user">{children}</RouteGuard>;
 *   }
 *
 *   // app/admin/(wrapper)/layout.tsx
 *   export default function AdminLayout({ children }) {
 *     return <RouteGuard actor="admin">{children}</RouteGuard>;
 *   }
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface RouteGuardProps {
  children: React.ReactNode;
  /** Which token to check */
  actor: "user" | "admin";
  /** Override the default redirect target */
  loginPath?: string;
  /** Custom loading element shown while checking */
  fallback?: React.ReactNode;
}

const DEFAULT_LOGIN: Record<string, string> = {
  user: "/login",
  admin: "/admin/login",
};

const DefaultSpinner = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 border-maroon-500 border-t-transparent animate-spin"
        role="status"
        aria-label="Checking authentication"
      />
      <p className="text-sm text-gray-500 font-medium">Loading…</p>
    </div>
  </div>
);

export default function RouteGuard({
  children,
  actor,
  loginPath,
  fallback = <DefaultSpinner />,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const authed = status === "authenticated" && session?.actor === actor;
  const checking = status === "loading";

  useEffect(() => {
    if (checking) return;
    if (authed) return;

    const target = loginPath ?? DEFAULT_LOGIN[actor];
    const redirectUrl = `${target}?from=${encodeURIComponent(pathname)}`;
    router.replace(redirectUrl);
  }, [actor, authed, checking, loginPath, pathname, router]);

  if (checking || !authed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
