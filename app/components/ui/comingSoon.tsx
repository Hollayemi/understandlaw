import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight, Clock } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <HomeWrapper>
      <section className="bg-white py-24 xl:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-7"
            style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
          >
            <Clock className="w-6 h-6" strokeWidth={2} />
          </div>

          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            Coming Soon
          </p>

          <h1
            className="text-[clamp(30px,5vw,46px)] leading-[1.1] tracking-tight uppercase text-gray-900 font-black mb-5"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            We&apos;re building this <span className="text-maroon-600">right now.</span>
          </h1>

          <p className="text-[15px] leading-relaxed text-gray-500 max-w-md mx-auto mb-9">
            This part of LawTicha isn&apos;t ready yet, but the rest of the platform is.
            Check back soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-maroon h-12 px-6 text-sm">
              Back to Home
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border-[1.5px] border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              Browse Legal Topics
            </Link>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}