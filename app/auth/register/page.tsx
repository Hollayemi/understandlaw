"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/authService/authSlice";
import AuthCard from "../auth_components/AuthCard";
import PasswordInput from "../auth_components/PasswordInput";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: "citizen" | "lawyer";
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "citizen",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role,
      }).unwrap();

      if (result?.success) {
        toast.success("Account created successfully!", {
          description: "Welcome to LawTicha!",
        });
        router.push(
          formData.role === "citizen"
            ? "/dashboard"
            : "/auth/lawyer-setup"
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error?.data?.message) {
        if (error.data.message.includes("email already exists")) {
          toast.error("Email already registered", {
            description:
              "Try signing in instead or use a different email.",
            action: {
              label: "Sign In",
              onClick: () => router.push("/auth/login"),
            },
          });
        } else {
          toast.error("Registration failed", {
            description: error.data.message,
          });
        }
      } else {
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
      }
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
            Free forever. No card required. Nigerian law, simplified.
          </p>
        </motion.div>

        {/* Auth Card */}
        <AuthCard title="Create Account" subtitle="Start your legal journey today">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Adaeze"
                  required
                  className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Okafor"
                  required
                  className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Phone Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 h-11 px-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm text-gray-600 flex-shrink-0">
                  🇳🇬 +234
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="080 0000 0000"
                  className="flex-1 h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-[#E8317A] placeholder:text-gray-300 transition-colors"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                I am a
              </label>
              <div className="flex items-center gap-6">
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    formData.role === "citizen"
                      ? "text-[#E8317A]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="citizen"
                    checked={formData.role === "citizen"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#E8317A]"
                  />
                  Citizen
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    formData.role === "lawyer"
                      ? "text-[#E8317A]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="lawyer"
                    checked={formData.role === "lawyer"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#E8317A]"
                  />
                  Lawyer
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <PasswordInput
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Must be at least 8 characters
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#E8317A] flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/legal/terms"
                  className="text-[#E8317A] hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  className="text-[#E8317A] hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                . Content is educational only, not legal advice.
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-1 rounded-full bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-60 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center gap-2"
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#E8317A] font-semibold hover:underline"
            >
              Sign in
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