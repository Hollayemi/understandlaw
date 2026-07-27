// app/admin/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn("admin-credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                const message = result.error;
                if (message.includes("Not authorized as admin")) {
                    toast.error("Access denied", {
                        description: "You don't have admin privileges.",
                    });
                } else if (message.includes("suspended")) {
                    toast.error("Account suspended", {
                        description: "Your admin account has been suspended. Contact support.",
                    });
                } else if (message.includes("Invalid credentials") || message.includes("Invalid email")) {
                    toast.error("Invalid email or password", {
                        description: "Please check your credentials and try again.",
                    });
                } else {
                    toast.error("Sign in failed", { description: message });
                }
                return;
            }

            toast.success("Welcome back!");
            const from =
                typeof window !== "undefined"
                    ? new URLSearchParams(window.location.search).get("from")
                    : null;
            router.push(from || "/admin");
            router.refresh();
        } catch (error: any) {
            console.error("Admin sign in error:", error);
            toast.error("Network error", {
                description: "Please check your internet connection.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}
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
                            className="font-bold text-2xl text-gray-900"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            Law<span style={{ color: "#E8317A" }}>Ticha</span>
                            <span className="text-sm font-normal text-gray-500 ml-2">Admin</span>
                        </span>
                    </Link>
                    <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Secure access for authorized personnel only
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@lawticha.com"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8317A] focus:border-transparent transition-all sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8317A] focus:border-transparent transition-all sm:text-sm pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-[#E8317A] focus:ring-[#E8317A] border-gray-300 rounded"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/admin/forgot-password" className="font-medium text-[#E8317A] hover:text-[#d01f68] transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8317A] transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in to Admin Portal"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Security notice */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Secure Access Only
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-500">
                            <div className="flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    SSL Encrypted
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Monitored Access
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        ← Back to LawTicha
                    </Link>
                </div>
            </div>
        </div>
    );
}