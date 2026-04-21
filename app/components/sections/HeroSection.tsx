import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-20">

        {/* ── Two-column hero ── */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* LEFT — massive headline + star rating */}
          <div className="anim-fade-up d1">
            <h1 className="hero-headline uppercase">
              KNOW YOUR<br />
              RIGHTS.<br />
              OWN YOUR<br />
              FUTURE.
            </h1>

            {/* Star rating row */}
            <div className="flex items-center gap-2.5 mt-6">
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              {/* Avatar stack */}
              <div className="flex items-center -space-x-2">
                {["#E8317A","#3B82F6","#10B981","#F59E0B"].map((color, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: color, zIndex: 4 - i }}>
                    {["A","B","C","D"][i]}
                  </div>
                ))}
              </div>

              <span className="text-sm font-medium text-gray-600">
                4.9/5 from 1.2K+ Users
              </span>
            </div>
          </div>

          {/* RIGHT — body copy + email form + CTA */}
          <div className="anim-fade-up d3 flex flex-col gap-6 lg:pt-2">
            <p className="text-base leading-relaxed text-gray-600 max-w-md">
              From Plain-English Legal Guides To Verified Lawyer Consultations, 
              UnderstandLaw Gives Every Nigerian Everything They Need To Know Their 
              Rights, Navigate The Law, And Get Professional Help — All In One Place.
            </p>

            {/* Email + CTA row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="email-input"
              />
              <Link href="/register" className="btn-pink flex-shrink-0">
                Get Started for Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400">
              By proceeding you agree to our{" "}
              <Link href="/legal/terms" className="underline hover:text-gray-600 transition-colors">
                Platform Terms
              </Link>{" "}
              &{" "}
              <Link href="/legal/privacy" className="underline hover:text-gray-600 transition-colors">
                Privacy Notice
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
