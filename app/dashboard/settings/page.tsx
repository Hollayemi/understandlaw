"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Scale,
  LogOut,
  Camera,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  AlertTriangle,
  Loader2,
  Save,
  ExternalLink,
  X,
  CreditCard,
  Briefcase,
  IdCard,
} from "lucide-react";
import { useUserData } from "@/hook/useData";
import {
  Section,
  Field,
  ToggleSwitch,
  ToggleRow,
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  AppearanceSettings,
  LegalSettings,
  SubscriptionSettings,
} from "./_components";
import { SettingsTab } from "./_components/types";
import { signOut } from "next-auth/react";
import { LawyerProfileUpdate } from "./_components/lawyer_update"
import { useLogoutMutation } from "@/redux/authService/authSlice";
import { LawyerIdCard } from "./_components/idCard"


const VALID_TABS: SettingsTab[] = [
  "profile",
  "notifications",
  "privacy",
  "security",
  "appearance",
  "legal",
  "subscription",
  "lawyer-profile",
  "id-card",
];

function SettingsPageContent() {
  const { userInfo } = useUserData();
  const user = (userInfo as any)?.user ?? {};
  const profile = (userInfo as any)?.profile ?? {};
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as SettingsTab | null;
  const [tab, setTab] = useState<SettingsTab>(
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile"
  );
  const [logout] = useLogoutMutation();

  // Keep the active tab in sync if the ?tab= param changes after mount
  // (e.g. navigating here again from the welcome message links).
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setTab(tabParam);
    }
  }, [tabParam]);

  const handleLogout = async () => {
  await logout();
  await signOut({ callbackUrl: "/login" });
};

  // Define tabs based on user role
  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Data", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    // Only show lawyer-specific tabs for lawyers
    ...(user?.role === "lawyer"
      ? [
          { id: "id-card" as SettingsTab, label: "ID Card", icon: IdCard },
          { id: "subscription" as SettingsTab, label: "Subscription", icon: CreditCard },
          { id: "lawyer-profile" as SettingsTab, label: "Lawyer Profile", icon: Briefcase },
        ]
      : []),
    // { id: "appearance", label: "Appearance", icon: Palette },
    { id: "legal", label: "Legal Preferences", icon: Scale },
  ];

  // If current tab is lawyer-specific but user is not a lawyer, redirect to profile
  useEffect(() => {
    if ((tab === "subscription" || tab === "lawyer-profile" || tab === "id-card") && user?.role !== "lawyer") {
      setTab("profile");
    }
  }, [user?.role, tab]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-800 transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-semibold text-gray-800">Settings</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-5 xl:px-8 py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account, preferences, and privacy.
          </p>
        </div>

        <div className="grid xl:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar nav */}
          <div className="hidden xl:flex flex-col gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 self-start sticky top-24">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all ${
                    active
                      ? "bg-gray-900 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={15} className={active ? "text-white" : "text-gray-400"} />
                  {t.label}
                </button>
              );
            })}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-all w-full text-left">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile tab scroll */}
          <div className="xl:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap transition-all border ${
                    active
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Icon size={12} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div>
            {tab === "profile" && <ProfileSettings user={user} profile={profile} />}
            {tab === "notifications" && <NotificationSettings user={user} />}
            {tab === "privacy" && <PrivacySettings user={user} />}
            {tab === "security" && <SecuritySettings profile={profile} />}
            {tab === "appearance" && <AppearanceSettings profile={profile} />}
            {tab === "legal" && <LegalSettings user={user} profile={profile} />}
            {tab === "subscription" && <SubscriptionSettings user={user} />}
            {tab === "lawyer-profile" && <LawyerProfileUpdate />}
            {tab === "id-card" && <LawyerIdCard user={user} profile={profile} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export (Suspense boundary for useSearchParams)
export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}