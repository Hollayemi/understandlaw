"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Scale,
  BookOpen,
  Library,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  FileText,
  Star,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin",
        exact: true,
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/admin/analytics",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        icon: Users,
        label: "Citizens",
        href: "/admin/citizens",
        badge: null,
      },
      {
        icon: Scale,
        label: "Lawyers",
        href: "/admin/lawyers",
        badge: "4",
        badgeVariant: "amber" as const,
      },
      {
        icon: ShieldCheck,
        label: "Verifications",
        href: "/admin/verifications",
        badge: "4",
        badgeVariant: "amber" as const,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        icon: BookOpen,
        label: "Modules",
        href: "/admin/modules",
      },
      {
        icon: Library,
        label: "Legal Library",
        href: "/admin/library",
      },
      {
        icon: FileText,
        label: "Community",
        href: "/admin/community",
        badge: "12",
        badgeVariant: "pink" as const,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        icon: MessageSquare,
        label: "Consultations",
        href: "/admin/consultations",
      },
      {
        icon: Star,
        label: "Reviews",
        href: "/admin/reviews",
      },
      {
        icon: AlertTriangle,
        label: "Reports",
        href: "/admin/reports",
        badge: "2",
        badgeVariant: "red" as const,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
      },
    ],
  },
];

const BADGE_STYLES = {
  amber: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" },
  pink:  { bg: "#FCE7F3", text: "#BE185D", border: "#FBCFE8" },
  red:   { bg: "#FEE2E2", text: "#B91C1C", border: "#FECACA" },
};

interface NavItemConfig {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean;
  badge?: string | null;
  badgeVariant?: keyof typeof BADGE_STYLES;
}

function NavItem({
  item,
  collapsed,
  onClick,
}: {
  item: NavItemConfig;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  const Icon = item.icon;
  const badgeStyle = item.badgeVariant ? BADGE_STYLES[item.badgeVariant] : null;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`
        group relative flex items-center gap-3 rounded-xl transition-all duration-150 select-none
        ${collapsed ? "justify-center px-0 py-3 mx-1" : "px-3 py-2.5 mx-0"}
        ${isActive
          ? "bg-[#E8317A]/10 text-[#E8317A]"
          : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50"
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E8317A] rounded-r-full" />
      )}

      <Icon
        size={17}
        className={`flex-shrink-0 transition-colors ${
          isActive ? "text-[#E8317A]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"
        }`}
      />

      {!collapsed && (
        <>
          <span className="flex-1 text-[13px] font-medium leading-none tracking-tight">
            {item.label}
          </span>
          {item.badge && badgeStyle && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border leading-none"
              style={{
                background: badgeStyle.bg,
                color: badgeStyle.text,
                borderColor: badgeStyle.border,
              }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}

      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 hidden group-hover:flex items-center gap-2">
          <div className="bg-gray-900 border border-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
            {item.label}
            {item.badge && (
              <span
                className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  background: badgeStyle?.bg,
                  color: badgeStyle?.text,
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [notifications, setNotifications] = useState(6);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const currentPage = (() => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        const match = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        if (match) return item.label;
      }
    }
    return "Admin";
  })();

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#FFFFFF",
        fontFamily: "var(--font-dm-sans), sans-serif",
      }}
    >

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        style={{
          width: mobileOpen ? 240 : sidebarWidth,
          background: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        }}
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col overflow-hidden
          lg:sticky
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 lg:transition-none
        `}
      >

        <div
          className="flex items-center gap-3 flex-shrink-0 overflow-hidden"
          style={{
            padding: collapsed ? "22px 0" : "22px 20px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderBottom: "1px solid #F3F4F6",
          }}
        >

          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
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

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-gray-900 font-bold text-[15px] leading-none tracking-tight whitespace-nowrap">
                Law<span style={{ color: "#E8317A" }}>Ticha</span>
              </p>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-0.5 whitespace-nowrap"
                style={{ color: "#9CA3AF" }}
              >
                Admin Console
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-5"
          style={{ scrollbarWidth: "none" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 px-4 whitespace-nowrap"
                  style={{ color: "#9CA3AF" }}
                >
                  {group.label}
                </p>
              )}
              {collapsed && (
                <div
                  className="mx-auto mb-1.5"
                  style={{
                    width: 24,
                    height: 1,
                    background: "#E5E7EB",
                  }}
                />
              )}
              <div className={`flex flex-col gap-0.5 ${collapsed ? "px-0" : "px-2"}`}>
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div
          className="flex-shrink-0"
          style={{
            borderTop: "1px solid #F3F4F6",
            padding: collapsed ? "14px 0" : "14px 12px",
          }}
        >
          {collapsed ? (
            <div className="flex justify-center">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
              >
                SA
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
              >
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-[12px] font-semibold truncate">Super Admin</p>
                <p className="text-[11px] truncate" style={{ color: "#9CA3AF" }}>
                  admin@lawticha.ng
                </p>
              </div>
              <Link
                href="/admin/logout"
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                title="Sign out"
              >
                <LogOut size={14} style={{ color: "#9CA3AF" }} />
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full items-center justify-center transition-colors z-10 flex-shrink-0"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            color: "#6B7280",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronsRight size={12} />
            : <ChevronsLeft size={12} />
          }
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">

        <header
          className="sticky top-0 z-30 flex-shrink-0 flex items-center justify-between gap-4"
          style={{
            height: 60,
            padding: "0 24px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #E5E7EB",
          }}
        >

          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#F3F4F6" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X size={16} style={{ color: "#6B7280" }} />
                : <Menu size={16} style={{ color: "#6B7280" }} />
              }
            </button>

            <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
              <span style={{ color: "#9CA3AF" }} className="hidden sm:block">Admin</span>
              <ChevronRight size={13} style={{ color: "#D1D5DB" }} className="hidden sm:block flex-shrink-0" />
              <span className="font-semibold truncate" style={{ color: "#111827" }}>
                {currentPage}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">

            <button
              className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] transition-colors"
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
              }}
            >
              <Search size={13} />
              <span>Search...</span>
              <span
                className="ml-1 text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: "#F3F4F6",
                  color: "#9CA3AF",
                }}
              >
                ⌘K
              </span>
            </button>

            <button
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ border: "1px solid #E5E7EB" }}
              onClick={() => setNotifications(0)}
            >
              <Bell size={15} style={{ color: "#6B7280" }} />
              {notifications > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center leading-none"
                  style={{ background: "#E8317A", color: "white" }}
                >
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #E8317A, #ff6fa8)",
                border: "1px solid rgba(232, 49, 122, 0.2)",
              }}
            >
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}