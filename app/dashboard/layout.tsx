"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Scale,
  MessageSquare,
  Award,
  Settings,
  ChevronRight,
  Smartphone,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",    href: "/dashboard" },
  { icon: BookOpen,        label: "Learn",        href: "/dashboard/learn" },
  { icon: BookMarked,      label: "Library",      href: "/dashboard/library" },
  { icon: Scale,           label: "Marketplace",  href: "/dashboard/marketplace" },
  { icon: MessageSquare,   label: "Messages",     href: "/dashboard/messages" },
  { icon: Award,           label: "Certificates", href: "/dashboard/certificates" },
  { icon: Settings,        label: "Settings",     href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F2EE", fontFamily: "var(--font-dm-sans)" }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-[240px] flex-shrink-0 flex flex-col
          bg-white border-r border-gray-100/80 transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}
            >
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
            <span className="font-bold text-[17px] tracking-tight text-gray-900">
              Understand<span style={{ color: "#E8317A" }}>Law</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium
                  transition-all duration-200
                  ${active
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-700"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-6 pt-4">
          <div
            className="relative rounded-2xl p-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #FFF5F0 0%, #FFF0F5 100%)" }}
          >
            {/* Decorative blob */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #E8317A, transparent)" }}
            />

            {/* 3D-ish icon */}
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, #FFE4EE, #FFD0E3)" }}
              >
                📱
              </div>
            </div>

            <p className="text-xs font-bold text-gray-900 text-center mb-1">Download Our App</p>
            <p className="text-[10px] text-gray-500 text-center mb-3 leading-relaxed">
              Learn Nigerian law on the go
            </p>
            <button
              className="w-full h-8 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              <Smartphone size={12} />
              Coming Soon
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} className="text-gray-600" />
          </button>
          <span className="font-bold text-[15px] text-gray-900">
            Understand<span style={{ color: "#E8317A" }}>Law</span>
          </span>
          <div className="w-9" />
        </div>

        {children}
      </div>
    </div>
  );
}
