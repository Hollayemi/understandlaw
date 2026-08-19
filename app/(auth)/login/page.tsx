"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { showError, showSuccess } from "@/app/components/ui/sonner";
import AuthCard from "../auth_components/AuthCard";
import SocialButtons from "../auth_components/SocialButtons";
import PasswordInput from "../auth_components/PasswordInput";
import Logo from "@/app/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Google sign-in succeeds at the NextAuth level even if the backend
  // doesn't know how to handle OAuth users yet (see BACKEND_OAUTH_SPEC.md).
  // Until that endpoint exists, catch that case here instead of silently
  // bouncing the person between /dashboard and /login.
  useEffect(() => {
    if (session?.error === "OAuthBackendError") {
      showError(
        "Google sign-in isn't fully set up yet",
        "The backend doesn't support Google accounts yet. Please sign in with email and password for now."
      );
      signOut({ redirect: false });
    }
  }, [session?.error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showError("Login failed", result.error);
        return;
      }

      showSuccess("Welcome Back!", "Welcome back!");
      const from =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("from")
          : null;
      router.replace(from || "/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      showError("Login failed", "Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F3F3] to-[#faf0f3] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}

        {/* Auth Card */}
      
        <AuthCard title="Welcome Back" subtitle="Sign in to continue your journey">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-maroon-500 placeholder:text-gray-300 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-maroon-500 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-full bg-maroon-500 hover:bg-maroon-600 disabled:opacity-60 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In to LawTicha"
              )}
            </motion.button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <SocialButtons />
          </div>

          {/* Switch to Register */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-maroon-500 font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </AuthCard>
      </motion.div>
    </div>
  );
}