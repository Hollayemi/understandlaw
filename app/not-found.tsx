import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight, Search, Scale, BookOpen } from "lucide-react";

const QUICK_LINKS = [
  { label: "Legal Topics", href: "/learn", icon: <BookOpen className="w-4 h-4" strokeWidth={2} /> },
  { label: "Find a Lawyer", href: "/marketplace", icon: <Scale className="w-4 h-4" strokeWidth={2} /> },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
      <section className="bg-white py-20 xl:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p
            className="text-[clamp(90px,18vw,160px)] leading-none font-black tracking-tight"
            style={{ fontFamily: "var(--font-archivo-black)", color: "var(--maroon-600)" }}
          >
            404
          </p>

          {/* <h1
            className="text-[clamp(24px,4vw,34px)] leading-[1.15] uppercase text-gray-900 font-black mt-2 mb-4"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Case dismissed. This page was never filed.
          </h1> */}

          <p className="text-[15px] leading-relaxed text-gray-500 max-w-md mx-auto mb-9">
            The page you&apos;re looking for doesn&apos;t exist, it may have moved, or the
            link might just be wrong. Let&apos;s get you back on record.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/" className="btn-maroon h-12 px-6 text-sm">
              Back to Home
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border-[1.5px] border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              <Search className="w-4 h-4" strokeWidth={2} />
              Browse Legal Topics
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Or try one of these
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}