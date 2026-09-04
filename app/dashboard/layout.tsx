"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  MessageSquare,
  Settings,
  Smartphone,
  Menu,
  MessageSquareText,
  Gavel,
} from "lucide-react";
import RouteGuard from "../components/wrapper/RouteGuard";
import PaymentStatus from "../components/sections/PaymentStatus";
import WelcomeMessage from "../components/sections/WelcomeMessage";
import { useUserData } from "@/hook/useData";
import Logo from "../components/ui/logo";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { userInfo } = useUserData() as any;
  const user = userInfo.user || {}
  
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
    { icon: BookOpen,        label: "Learn",        href: "/dashboard/learn" },
    { icon: BookMarked,      label: "Library",      href: "/dashboard/library" },
    { icon: Gavel,      label: user.role === "lawyer" ? "My Briefs" : "Get a Lawyer",      href: "/dashboard/consultations" },
    // { icon: Scale,           label: "Marketplace",  href: "/dashboard/marketplace" },
    { icon: MessageSquareText,   label: "Chat",     href: "/dashboard/chat" },
    { icon: MessageSquare,   label: "community",     href: "/dashboard/community" },
    // { icon: Award,           label: "Certificates", href: "/dashboard/certificates" },
    { icon: Settings,        label: "Settings",     href: "/dashboard/settings" },
  ];
  
  return (
    <div className="min-h-screen flex" style={{ background: "#F5F2EE", fontFamily: "var(--font-dm-sans)" }}>

      {/*  Mobile overlay  */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/*  Sidebar  */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-[240px] flex-shrink-0 flex flex-col
          bg-white border-r border-gray-100/80 transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Logo showText />
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
                    ? "bg-maroon-600!  text-white shadow-sm" //
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
            style={{ background: "linear-gradient(135deg, #ffd2d8 0%, #ffd4da 100%)" }}
          >
            {/* Decorative blob */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #9B2E3D, transparent)" }}
            />

            {/* 3D-ish icon */}
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, #fcbfc8, #fba6b0)" }}
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
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              <Smartphone size={12} />
              Coming Soon
            </button>
          </div>
        </div>
      </aside>

      {/*  Main  */}
      <RouteGuard actor="user">
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
            Law<span className="text-maroon-600">Ticha</span>
          </span>
          <div className="w-9" />
        </div>

        {children}
      </div>
      </RouteGuard>

      <Suspense fallback={null}>
        <PaymentStatus />
      </Suspense>

      <Suspense fallback={null}>
        <WelcomeMessage />
      </Suspense>
    </div>
  );
}