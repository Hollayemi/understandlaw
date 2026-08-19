"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

// This component isolates the useSearchParams() call so it can be wrapped
// in a <Suspense> boundary from the layout without affecting the rest of
// the dashboard shell (sidebar, nav, etc.), which render immediately.
export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const paymentMessage = searchParams.get("message");

  if (payment !== "success") return null;

  return <SuccessMessage message={paymentMessage || ""} />;
}

interface SuccessMessageProps {
  message?: string;
}

function SuccessMessage({ message = "Payment verified successfully." }: SuccessMessageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  const removeSearchParams = useCallback(() => {
    // Remove all search params by navigating to the current path without them
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        removeSearchParams();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [removeSearchParams]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      removeSearchParams();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="mx-4 w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="rounded-xl bg-white p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50">
              <CheckCircle className="h-10 w-10 text-maroon-500" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful!</h2>

            {/* Message */}
            <p className="mb-6 text-gray-600">{message}</p>

            {/* Close/continue button */}
            <button
              onClick={removeSearchParams}
              className="w-full rounded-lg bg-maroon-500 px-6 py-3 font-medium text-white transition-colors hover:bg-[#d02a6e] focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}