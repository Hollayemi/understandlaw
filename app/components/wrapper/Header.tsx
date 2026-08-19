"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV = [
  { label: "Legal Topics", href: "/learn" },
  { label: "Legal Library", href: "/library" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop right CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors">
            Login
          </Link>
          <Link href="/register" className="btn-maroon px-5 py-2.5 text-sm">
            Get Started for Free
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}