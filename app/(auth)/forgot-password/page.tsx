"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { showError, showSuccess } from "@/app/components/ui/sonner";
import AuthCard from "../auth_components/AuthCard";
import { useForgotPasswordMutation } from "@/redux/authService/authSlice";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await forgotPassword({ email }).unwrap();
      
      // The API returns { message: string } on success
      showSuccess(
        "Check your email",
        result.message || "If an account exists with this email, you'll receive a password reset link."
      );
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
      // Handle error from RTK Query
      const errorMessage = error?.data?.message || error?.message || "Please try again later.";
      showError("Request failed", errorMessage);
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
        <AuthCard 
          title="Forgot Password" 
          subtitle="Enter your email to receive a password reset link"
        >
          {!isSubmitted ? (
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
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
              <p className="text-gray-600 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>
                <br />
                Please check your inbox (and spam folder).
              </p>
            </div>
          )}

          {/* Back to Login */}
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
        </AuthCard>
      </motion.div>
    </div>
  );
}