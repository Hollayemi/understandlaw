"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useUserData } from "@/hook/useData";
import { Menu, X, ArrowRight, ChevronDown, LayoutDashboard, Settings, LogOut } from "lucide-react";

const NAV = [
  { label: "About Us", href: "/about" },
  { label: "Legal Library", href: "/library" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Marketplace", href: "/marketplace" },
  // { label: "Pricing", href: "/pricing" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { status } = useSession();
  const { userInfo } = useUserData() as any;
  const authed = status === "authenticated";

  const user = userInfo?.user || {};
  const fullName: string =
    user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const firstName: string = user.firstName || fullName.split(" ")[0] || "Account";
  const avatarUrl: string = user.avatarUrl || "";
  const initials = getInitials(fullName || "U");

  // Close the dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setMobileOpen(false)}>
          <img src="/images/icon.jpg" alt="LawTicha Logo" className="w-9 h-9 rounded-full flex-shrink-0" />
          <span
            className="text-[19px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-dm-sans)", color: "var(--maroon-700)" }}
          >
            LawTicha
          </span>
        </Link>

        {/* Desktop nav, visible from lg up */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-[var(--maroon-700)] hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {authed ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || "Profile"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: "var(--maroon-700)" }}
                  >
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                  {firstName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl border border-gray-100 shadow-xl py-2 animate-fade-up">
                  <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{fullName || "Your account"}</p>
                    {user.email && <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>}
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn-maroon px-5 py-2.5 text-sm">
                Get Started for Free
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger, only below lg */}
        <button
          className="lg:hidden w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors flex-shrink-0"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-gray-700" strokeWidth={2} />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-1">
            {authed && (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors mb-2"
                onClick={() => setMobileOpen(false)}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName || "Profile"} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "var(--maroon-700)" }}
                  >
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{fullName || "Your account"}</p>
                  <p className="text-xs text-gray-400">View dashboard</p>
                </div>
              </Link>
            )}

            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[var(--maroon-700)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-3 pt-4 flex flex-col sm:flex-row gap-2.5">
              {authed ? (
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-sm font-semibold text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2} />
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center px-5 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/register" className="btn-maroon flex-1 px-5 py-3 text-sm" onClick={() => setMobileOpen(false)}>
                    Get Started for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}