// app/reset-password/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  useResetPasswordMutation, 
  useValidateResetPasswordTokenMutation 
} from "@/redux/authService/authSlice";
import { showError, showSuccess } from "@/app/components/ui/sonner";
import AuthCard from "../auth_components/AuthCard";
import PasswordInput from "../auth_components/PasswordInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // RTK Query hooks
  const [validateToken, { isLoading: isValidating }] = useValidateResetPasswordTokenMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      showError("Invalid link", "The password reset link is missing or invalid.");
      return;
    }

    const validateTokenAsync = async () => {
      try {
        await validateToken(token).unwrap();
        setIsTokenValid(true);
      } catch (error: any) {
        setIsTokenValid(false);
        const errorMessage = error?.data?.message || "This password reset link is invalid or has expired.";
        showError("Invalid link", errorMessage);
      }
    };

    validateTokenAsync();
  }, [token, validateToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (password !== confirmPassword) {
      showError("Passwords don't match", "Please make sure both passwords match.");
      return;
    }

    if (password.length < 8) {
      showError("Password too short", "Password must be at least 8 characters.");
      return;
    }

    try {
      const result = await resetPassword({ 
        token: token!, 
        password, 
        confirmPassword 
      }).unwrap();

      showSuccess("Password Reset!", result.message || "Your password has been successfully reset.");
      setIsSubmitted(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      const errorMessage = error?.data?.message || "Please try again later.";
      showError("Reset failed", errorMessage);
    }
  };

  // Show loading state while validating token
  if (isValidating || isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F3F3] to-[#faf0f3] flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-maroon-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Show invalid token state
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F3F3] to-[#faf0f3] flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AuthCard title="Invalid Link" subtitle="This password reset link is invalid or expired">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                The password reset link you clicked is invalid or has expired.
                <br />
                Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full h-12 rounded-full bg-maroon-500 hover:bg-maroon-600 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center"
              >
                Request New Link
              </Link>
            </div>
          </AuthCard>
        </motion.div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F3F3] to-[#faf0f3] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard title="Reset Password" subtitle="Create a new password for your account">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isResetting}
                className="w-full h-12 mt-2 rounded-full bg-maroon-500 hover:bg-maroon-600 disabled:opacity-60 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
              >
                {isResetting ? (
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 text-sm mb-6">
                Your password has been reset successfully.
                <br />
                Redirecting you to login...
              </p>
            </div>
          )}

          {/* Back to Login */}
          {!isSubmitted && (
            <p className="text-center text-xs text-gray-500 mt-6">
              <Link
                href="/login"
                className="text-maroon-500 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Sign In
              </Link>
            </p>
          )}
        </AuthCard>
      </motion.div>
    </div>
  );
}