"use client";
import React from "react";
import Link from "next/link";

const LINKS = {
  Learn: [
    { label: "Legal Topics", href: "/learn/topics" },
    { label: "Video Guides", href: "/learn/videos" },
    { label: "Know Your Rights", href: "/learn/rights" },
    { label: "Scenario Guides", href: "/learn/scenarios" },
  ],
  // Library: [
  //   { label: "Browse Acts", href: "/library/browse" },
  //   { label: "Search Legislation", href: "/library/search" },
  //   { label: "Bookmarks", href: "/library/bookmarks" },
  //   { label: "Recent Updates", href: "/library/updates" },
  // ],
  Marketplace: [
    { label: "Find a Lawyer", href: "/marketplace" },
    { label: "By Speciality", href: "/marketplace/specialties" },
    { label: "For Lawyers", href: "/lawyers" },
    { label: "Verification", href: "/lawyers/verification" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/about#mission" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

/* Small flag icon, used in place of an emoji */
function NigeriaFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect x="0" y="0" width="8" height="16" fill="#008751" />
      <rect x="8" y="0" width="8" height="16" fill="#ffffff" />
      <rect x="16" y="0" width="8" height="16" fill="#008751" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/images/icon.jpg" alt="LawTicha Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
              <span
                className="font-bold text-[17px] tracking-tight"
                style={{ fontFamily: "var(--font-dm-sans)", color: "var(--maroon-700)" }}
              >
                LawTicha
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              Making Nigerian law simple, accessible, and actionable for every citizen.
              Regardless of education, income, or location.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2">
              {[
                { label: "X", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /> },
                { label: "Instagram", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-gray-600" viewBox="0 0 24 24">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">{cat}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Weekly digest */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--maroon-500)" }}>
              Weekly Digest
            </p>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Know Your Rights, Every Week.</h4>
            <p className="text-xs text-gray-500 mb-4">Plain-English legal updates, no jargon.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="h-11 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
              />
              <button type="submit" className="btn-maroon h-11 text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} LawTicha.</span>
            <span className="flex items-center gap-1.5">
              Built for Nigeria
              <NigeriaFlagIcon className="w-4 h-3 rounded-[1px]" />
            </span>
          </div>
          <div className="flex justify-center flex-wrap items-center gap-1 md:gap-4">
            {["Privacy Policy", "Terms of Use", "Content Disclaimer", "Cookies"].map((l, i, arr) => (
              <span key={l} className="flex items-center gap-1 md:gap-4">
                <Link href={`/${l.toLowerCase().split(" ")[0]}`} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {l}
                </Link>
                {i < arr.length - 1 && <span className="text-gray-200">&middot;</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="pb-6">
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-3xl">
            <strong className="font-semibold text-gray-500">Disclaimer:</strong>{" "}
            Content on LawTicha is provided for general informational and educational purposes only.
            It does not constitute legal advice. Consult a qualified lawyer for advice specific to your situation.
          </p>
        </div>
      </div>
    </footer>
  );
}