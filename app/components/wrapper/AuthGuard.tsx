/**
 * AuthGuard.tsx
 *
 * Wraps your app (or a section of it) and:
 *  1. Listens for the "lawticha:auth_expired" event fired by axiosBaseQuery
 *  2. Shows a toast notification ("Session expired")
 *  3. Redirects the user to the correct login page
 *
 * Place this inside ProviderWrapper (or directly in app/layout.tsx) so it
 * wraps all pages that need protection.
 *
 * Usage:
 *   // app/layout.tsx
 *   <ProviderWrapper>
 *     <UserDataProvider>
 *       <AuthGuard>
 *         {children}
 *       </AuthGuard>
 *     </UserDataProvider>
 *   </ProviderWrapper>
 */

"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { onAuthExpired } from "@/redux/shared/authEvents";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Routes that should redirect to /admin/login on 401
const ADMIN_PREFIXES = ["/admin"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Prevent duplicate toasts on rapid 401s
  const redirectedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthExpired((reason) => {
      // Only act once per "session expired" burst
      if (redirectedRef.current) return;
      redirectedRef.current = true;

      console.log("here")

      const isAdminRoute = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

      if (reason === "unauthorized") {
        toast.error("Session expired", {
          description: "Please sign in again to continue.",
          duration: 4000,
        });

        if (isAdminRoute) {
          // Small delay so the toast is visible before navigation
          setTimeout(() => {
            router.push(`/admin/login?from=${encodeURIComponent(pathname)}`);
          }, 500);
        } else {
          setTimeout(() => {
            router.push(`/auth/login?from=${encodeURIComponent(pathname)}`);
          }, 500);
        }
      } else if (reason === "forbidden") {
        toast.error("Access denied", {
          description: "You don't have permission to perform this action.",
          duration: 4000,
        });
      }

      // Allow new redirects after 5 seconds (e.g. on next page visit)
      setTimeout(() => {
        redirectedRef.current = false;
      }, 5000);
    });

    return unsubscribe;
  }, [pathname, router]);

  return <>{children}</>;
}
