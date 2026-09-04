"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  X,
  BookOpen,
  BookMarked,
  Gavel,
  MessageSquareText,
  MessageSquare,
  Settings,
  ShieldCheck,
  CreditCard,
  IdCard,
  ArrowRight,
  PartyPopper,
  Zap,
  Percent,
  Crown,
} from "lucide-react";
import { useUserData } from "@/hook/useData";

// This component isolates the useSearchParams() call so it can be wrapped
// in a <Suspense> boundary from the dashboard layout without affecting the
// rest of the shell (sidebar, nav, etc.), which render immediately.
// Target routes: /dashboard?welcome=user and /dashboard?welcome=lawyer
export default function WelcomeMessage() {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome");

  if (welcome !== "user" && welcome !== "lawyer") return null;

  return <WelcomeModal welcome={welcome} />;
}

interface NavBriefItem {
  icon: React.ElementType;
  label: string;
  desc: string;
}

function WelcomeModal({ welcome }: { welcome: "user" | "lawyer" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useUserData() as any;
  const user = userInfo?.user || {};

  // Only show the lawyer-specific setup checklist when the account is
  // actually a lawyer account, even if the URL says ?welcome=lawyer.
  const isLawyer = welcome === "lawyer" && user.role === "lawyer";

  const [showWelcome, setShowWelcome] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    // Show subscription popup for lawyers after dismissing welcome
    if (isLawyer) {
      setShowSubscriptionPopup(true);
    } else {
      router.replace(pathname, { scroll: false });
    }
  }, [router, pathname, isLawyer]);

  const dismissSubscription = useCallback(() => {
    setShowSubscriptionPopup(false);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const navBrief: NavBriefItem[] = isLawyer
    ? [
        {
          icon: Gavel,
          label: "My Briefs",
          desc: "View and respond to consultation requests from citizens.",
        },
        {
          icon: BookOpen,
          label: "Learn",
          desc: "Browse learning resources and training material.",
        },
        {
          icon: MessageSquareText,
          label: "Chat",
          desc: "Message citizens and the admin team.",
        },
        {
          icon: MessageSquare,
          label: "Community",
          desc: "Join discussions with other lawyers.",
        },
        {
          icon: Settings,
          label: "Settings",
          desc: "Manage your profile, KYC, and subscription.",
        },
      ]
    : [
        {
          icon: Gavel,
          label: "Get a Lawyer",
          desc: "Request a consultation with an NBA-verified lawyer.",
        },
        {
          icon: BookOpen,
          label: "Learn",
          desc: "Learn Nigerian law at your own pace.",
        },
        {
          icon: BookMarked,
          label: "Library",
          desc: "Browse the legal document library.",
        },
        {
          icon: MessageSquareText,
          label: "Chat",
          desc: "Message your lawyer once you're matched.",
        },
        {
          icon: MessageSquare,
          label: "Community",
          desc: "Ask questions and connect with others.",
        },
      ];

  // Calculate discount percentage
  const originalPrice = 24000;
  const discountedPrice = 4999;
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && dismissWelcome()}
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="relative px-6 pt-7 pb-5 border-b border-gray-50">
              <button
                onClick={dismissWelcome}
                aria-label="Dismiss welcome message"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
              </button>

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "linear-gradient(135deg, #ffd2d8 0%, #ffd4da 100%)",
                }}
              >
                <PartyPopper size={22} className="text-maroon-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Welcome to LawTicha
                {user.firstName ? `, ${user.firstName}` : ""}!
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLawyer
                  ? "Here's a quick look around your dashboard before you get started."
                  : "Here's a quick look around your dashboard."}
              </p>
            </div>

            {/* Nav brief */}
            <div className="px-6 py-5 space-y-3">
              {navBrief.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-maroon-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lawyer setup checklist */}
            {isLawyer && (
              <div className="px-6 pb-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-xs font-bold text-gray-900 mb-3">
                    Finish setting up your account
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard/settings?tab=lawyer-profile"
                      onClick={dismissWelcome}
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-gray-100 hover:border-maroon-200 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-gray-800">
                        <ShieldCheck size={14} className="text-maroon-600" />
                        Complete your KYC verification
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-gray-300 group-hover:text-maroon-500 transition-colors"
                      />
                    </Link>

                    <Link
                      href="/dashboard/settings?tab=subscription"
                      onClick={dismissWelcome}
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-gray-100 hover:border-maroon-200 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-gray-800">
                        <CreditCard size={14} className="text-maroon-600" />
                        Subscribe to unlock all features
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-gray-300 group-hover:text-maroon-500 transition-colors"
                      />
                    </Link>

                    <Link
                      href="/dashboard/settings?tab=id-card"
                      onClick={dismissWelcome}
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-gray-100 hover:border-maroon-200 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-gray-800">
                        <IdCard size={14} className="text-maroon-600" />
                        Get your lawyer ID card
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-gray-300 group-hover:text-maroon-500 transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 pb-6 pt-4">
              <button
                onClick={dismissWelcome}
                className="w-full rounded-lg bg-maroon-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d02a6e]"
              >
                {isLawyer
                  ? "Got it, take me to my dashboard"
                  : "Got it, let's go"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Popup for Lawyers */}
      {showSubscriptionPopup && isLawyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && dismissSubscription()}
        >
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="relative px-6 pt-7 pb-5 border-b border-gray-50">
              <button
                onClick={dismissSubscription}
                aria-label="Dismiss subscription offer"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
              </button>

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                }}
              >
                <Zap size={22} className="text-amber-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Exclusive NBA Conference Offer
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Unlock your full potential on LawTicha
              </p>
            </div>

            {/* Offer Details */}
            <div className="px-6 py-5 space-y-4">
              <div className="bg-gradient-to-br from-maroon-50 to-amber-50 rounded-xl p-5 border border-maroon-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Annual Subscription
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    <Percent size={12} />
                    {discountPercentage}% OFF
                  </span>
                </div>

                <div className="flex items-end gap-3">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ₦{discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">/ year</span>
                  </div>
                  <span className="text-sm text-gray-400 line-through mb-1">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Crown size={14} className="text-amber-500" />
                  <span>
                    Special NBA conference rate • Limited time offer
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  What you'll get:
                </p>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-maroon-500 mt-0.5">•</span>
                    Full access to all legal learning resources
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-maroon-500 mt-0.5">•</span>
                    Priority consultation requests from citizens
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-maroon-500 mt-0.5">•</span>
                    Premium support and lawyer ID card
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-maroon-500 mt-0.5">•</span>
                    Early access to new features
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-700">
                  <span className="font-bold">⚡ Limited time:</span> This
                  exclusive offer is available only during the ongoing NBA
                  conference. Don't miss out on this 79% discount!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-2 space-y-3">
              <Link
                href="/dashboard/settings?tab=subscription"
                onClick={dismissSubscription}
                className="w-full rounded-lg bg-gradient-to-r from-maroon-600 to-maroon-500 px-6 py-3.5 text-sm font-bold text-white text-center transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Subscribe Now  ₦{discountedPrice.toLocaleString()}
              </Link>

              <button
                onClick={dismissSubscription}
                className="w-full rounded-lg px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}