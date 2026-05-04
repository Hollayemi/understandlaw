import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-14 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* LEFT,  headline + social proof */}
          <div className="animate-fade-up">
            <h1
              className="text-[clamp(52px,6vw,40px)] md:text-[clamp(62px,8vw,76px)] leading-[0.93] tracking-[0.01em] uppercase text-gray-900 font-normal"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              KNOW YOUR
              RIGHTS.<br />
              OWN YOUR{" "}<br className="hidden md:block" />
              FUTURE.
            </h1>

            {/* Stars + avatars */}
            <div className="flex items-center gap-3 mt-7">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <div className="flex items-center -space-x-2">
                {["#E8317A","#3B82F6","#10B981","#F59E0B"].map((color, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: color, zIndex: 4 - i }}>
                    {["A","B","C","D"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">4.9/5 from 1.2K+ Users</span>
            </div>
          </div>

          {/* RIGHT,  description + form */}
          <div className="animate-fade-up delay-200 flex flex-col gap-6 lg:pt-3">
            <p className="text-[15px] leading-relaxed text-gray-500 max-w-md">
              From Plain-English Legal Guides To Verified Lawyer Consultations,
              LawTicha Gives Every Nigerian Everything They Need To Know Their
              Rights, Navigate The Law, And Get Professional Help. All In One Place.
            </p>

            {/* Email + CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="md:flex-1 min-w-0 h-[52px] !px-5 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
              />
              <Link href="/dashboard"
                className="flex-shrink-0 flex items-center justify-center gap-2 h-[52px] px-6 bg-[#E8317A] hover:bg-[#d01f68] text-white text-sm font-semibold rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200 whitespace-nowrap">
                Get Started for Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>

            <p className="text-xs text-gray-400">
              By proceeding you agree to our{" "}
              <Link href="/legal/terms" className="underline hover:text-gray-600 transition-colors">Platform Terms</Link>
              {" "}&{" "}
              <Link href="/legal/privacy" className="underline hover:text-gray-600 transition-colors">Privacy Notice</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
