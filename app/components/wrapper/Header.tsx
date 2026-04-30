"use client";
import React, { useState } from "react";
import Link from "next/link";

const NAV = [
  {
    label: "Products",
    href: "/learn",
    sub: [
      { label: "Legal Learning", href: "/learn", desc: "Plain-English legal guides" },
      { label: "Legal Library", href: "/library", desc: "Searchable Nigerian legislation" },
    ],
  },
  {
    label: "Resources",
    href: "/library",
    sub: [
      { label: "Blog", href: "/blog", desc: "Legal tips and updates" },
      { label: "FAQ", href: "/faq", desc: "Common legal questions" },
    ],
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    sub: [
      { label: "For Citizens", href: "/how-it-works#citizens", desc: "Learn and stay informed" },
      { label: "For Lawyers", href: "/how-it-works#lawyers", desc: "Join the marketplace" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F3F3F3] py-4 px-4 sm:px-6 lg:px-8">
      {/* Pill navbar */}
      <div className="max-w-6xl mx-auto bg-white rounded-full shadow-[0_2px_16px_rgba(0,0,0,0.07)] h-[60px] flex items-center justify-between px-6 gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="5" cy="8" r="1" fill="white" />
              <circle cx="19" cy="8" r="1" fill="white" />
              <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <line x1="9" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-[17px] text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Law<span className="text-[#E8317A]">Ticha</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <div key={item.label}
              className="relative"
              onMouseEnter={() => item.sub && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}>

              <Link href={item.href}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-[#E8317A] hover:bg-gray-50 transition-colors whitespace-nowrap">
                {item.label}
                {item.sub && (
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {item.sub && openMenu === item.label && (
                // Removed mt-2 and added -mt-px to close the gap
                <div className="absolute top-full left-0 -mt-px w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2">
                    {item.sub.map((s) => (
                      <Link key={s.label} href={s.href}
                        className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-semibold text-gray-900">{s.label}</span>
                        <span className="text-xs text-gray-500">{s.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link href="/auth#login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors">
            Login
          </Link>
          <Link href="/auth#register"
            className="flex items-center gap-2 bg-white border-[1.5px] border-gray-200 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all whitespace-nowrap">
            Get Started for Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-6xl mx-auto">
          <div className="p-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              <Link href="/auth" className="px-4 py-3 rounded-xl text-sm font-medium text-gray-900 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/auth"
                className="flex items-center justify-center gap-2 bg-[#E8317A] text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-[#d01f68] transition-colors"
                onClick={() => setMobileOpen(false)}>
                Get Started for Free →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
