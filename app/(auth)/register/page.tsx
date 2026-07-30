"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRegisterMutation } from "@/redux/authService/authSlice";
import AuthCard from "../auth_components/AuthCard";
import PasswordInput from "../auth_components/PasswordInput";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: "citizen" | "lawyer";
}

type FieldErrors = Partial<Record<keyof FormData | "terms", string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NG_PHONE_REGEX = /^(\+234|0)[789][01]\d{8}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "citizen",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [register, { isLoading }] = useRegisterMutation();

  const passwordStrength = useMemo(() => {
    const pw = formData.password;
    if (!pw) return { score: 0, label: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const labels = ["Too short", "Weak", "Okay", "Good", "Strong", "Excellent"];
    return { score, label: labels[score] };
  }, [formData.password]);

  const validateField = (name: keyof FormData, data: FormData): string | undefined => {
    switch (name) {
      case "firstName":
        return data.firstName.trim().length < 2 ? "Enter your first name" : undefined;
      case "lastName":
        return data.lastName.trim().length < 2 ? "Enter your last name" : undefined;
      case "email":
        if (!data.email.trim()) return "Email is required";
        if (!EMAIL_REGEX.test(data.email.trim())) return "Enter a valid email address";
        return undefined;
      case "phone":
        if (!data.phone.trim()) return undefined; // optional
        return NG_PHONE_REGEX.test(data.phone.replace(/\s/g, ""))
          ? undefined
          : "Enter a valid Nigerian number, e.g. 0803 123 4567";
      case "password":
        return data.password.length < 8 ? "Password must be at least 8 characters" : undefined;
      case "confirmPassword":
        return data.confirmPassword !== data.password ? "Passwords don't match" : undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (data: FormData): FieldErrors => {
    const next: FieldErrors = {};
    (["firstName", "lastName", "email", "phone", "password", "confirmPassword"] as (keyof FormData)[]).forEach(
      (field) => {
        const err = validateField(field, data);
        if (err) next[field] = err;
      }
    );
    if (!agreeTerms) next.terms = "Please agree to the Terms of Service and Privacy Policy";
    return next;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const next = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(next);

    // Live-validate only fields the user has already interacted with
    if (touched[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormData, next) }));
    }
    // Re-check confirmPassword whenever password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateField("confirmPassword", next) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormData, formData) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateAll(formData);
    setErrors(fieldErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(fieldErrors).length > 0) {
      if (fieldErrors.terms) toast.error(fieldErrors.terms);
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        role: formData.role,
      }).unwrap();

      if (result?.success) {
        // Backend account is created — now establish a real NextAuth
        // session (instead of a raw token in localStorage) by signing in
        // with the same credentials the person just chose.
        const signInResult = await signIn("credentials", {
          email: formData.email.trim(),
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          // Extremely unlikely right after a successful registration, but
          // don't strand the person — send them to log in manually.
          toast.success("Account created!", {
            description: "Please sign in to continue.",
          });
          router.push("/login");
          return;
        }

        toast.success("Account created successfully!", {
          description: "Welcome to LawTicha!",
        });

        // Citizens land on their dashboard; lawyers complete a short
        // verification flow (SCN number, documents, etc.) before theirs
        // unlocks.
        router.push(
          formData.role === "citizen"
            ? "/dashboard"
            : "/lawyer-setup"
        );
        router.refresh();
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
              onClick: () => router.push("/login"),
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

  const inputClass = (hasError?: string) =>
    `w-full h-11 px-4 rounded-xl border-[1.5px] text-sm text-gray-900 bg-white outline-none placeholder:text-gray-300 transition-colors ${
      hasError
        ? "border-red-300 focus:border-red-400"
        : "border-gray-200 focus:border-[#E8317A]"
    }`;

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
                <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="5" cy="8" r="1" fill="white" />
                <circle cx="19" cy="8" r="1" fill="white" />
                <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <line x1="9" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
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
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                  onBlur={handleBlur}
                  placeholder="Adaeze"
                  className={inputClass(errors.firstName)}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.firstName}</p>
                )}
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
                  onBlur={handleBlur}
                  placeholder="Okafor"
                  className={inputClass(errors.lastName)}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.lastName}</p>
                )}
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
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={inputClass(errors.email)}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
              )}
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
                  onBlur={handleBlur}
                  placeholder="080 0000 0000"
                  className={`flex-1 ${inputClass(errors.phone)}`}
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "citizen", label: "Citizen", desc: "Learn your rights" },
                    { value: "lawyer", label: "Lawyer", desc: "Offer consultations" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 cursor-pointer transition-colors ${
                      formData.role === option.value
                        ? "border-[#E8317A] bg-[#FDF1F6]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 accent-[#E8317A] flex-shrink-0"
                    />
                    <span>
                      <span
                        className={`block text-sm font-semibold ${
                          formData.role === option.value ? "text-[#E8317A]" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="block text-[11px] text-gray-400">{option.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
              {formData.role === "lawyer" && (
                <p className="text-[11px] text-gray-400 mt-1.5">
                  You&apos;ll complete a short verification step right after this.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <PasswordInput
                value={formData.password}
                onChange={(e) => handleInputChange(e as any)}
                placeholder="Min. 8 characters"
                minLength={8}
                name="password"
                error={!!errors.password}
                onBlur={handleBlur as any}
              />
              {errors.password ? (
                <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
              ) : (
                formData.password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          background:
                            passwordStrength.score <= 1
                              ? "#EF4444"
                              : passwordStrength.score <= 3
                              ? "#F59E0B"
                              : "#10B981",
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {passwordStrength.label}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e as any)}
                placeholder="Re-enter your password"
                name="confirmPassword"
                error={!!errors.confirmPassword}
                onBlur={handleBlur as any}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setErrors((prev) => ({
                    ...prev,
                    terms: e.target.checked ? undefined : prev.terms,
                  }));
                }}
                className="mt-0.5 w-4 h-4 rounded accent-[#E8317A] flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the{" "}
                <Link href="/legal/terms" className="text-[#E8317A] hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-[#E8317A] hover:underline font-medium">
                  Privacy Policy
                </Link>
                . Content is educational only, not legal advice.
              </label>
            </div>
            {errors.terms && (
              <p className="text-[11px] text-red-500 -mt-2">{errors.terms}</p>
            )}

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
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E8317A] font-semibold hover:underline">
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
            <div key={item.text} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
