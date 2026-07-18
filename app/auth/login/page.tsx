"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSignInMutation } from "@/redux/authService/authSlice";
import { showError, showSuccess } from "@/app/components/ui/sonner";
import AuthCard from "../auth_components/AuthCard";
import SocialButtons from "../auth_components/SocialButtons";
import PasswordInput from "../auth_components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, { isLoading }] = useSignInMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn({ email, password }).unwrap();

      if (result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        showSuccess("Welcome Back!", result.message || "Welcome back!");
        router.replace("/dashboard");
      } else {
        showError("Sign in failed", result.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showError(
        "Login failed",
        error?.data?.message || "Please check your credentials and try again."
      );
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg, #E8317A, #ff6fa8)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <line
                  x1="12"
                  y1="3"
                  x2="12"
                  y2="20"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <line
                  x1="5"
                  y1="8"
                  x2="19"
                  y2="8"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="5" cy="8" r="1" fill="white" />
                <circle cx="19" cy="8" r="1" fill="white" />
                <path
                  d="M3 11 Q5 15 7 11"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M17 11 Q19 15 21 11"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <line
                  x1="9"
                  y1="20"
                  x2="15"
                  y2="20"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className="font-bold text-xl text-gray-900"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Law<span style={{ color: "#E8317A" }}>Ticha</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Continue learning. Your rights don&apos;t take a break.
          </p>
        </motion.div>

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
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#E8317A] hover:underline font-medium"
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
              className="w-full h-12 mt-2 rounded-full bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-60 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
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
              href="/auth/register"
              className="text-[#E8317A] font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </AuthCard>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-5 mt-6"
        >
          {[
            { icon: "🔒", text: "Secure & private" },
            { icon: "🇳🇬", text: "Nigerian law only" },
            { icon: "✓", text: "Free forever" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-1.5 text-xs text-gray-400"
            >
              <span>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}