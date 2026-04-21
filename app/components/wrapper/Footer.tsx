"use client"
import React from "react";
import Link from "next/link";

const LINKS = {
  Learn: [
    { label: "Legal Topics",   href: "/learn/topics"    },
    { label: "Video Guides",   href: "/learn/videos"    },
    { label: "Know Your Rights", href: "/learn/rights"  },
    { label: "Scenario Guides", href: "/learn/scenarios" },
  ],
  Library: [
    { label: "Browse Acts",       href: "/library/browse"     },
    { label: "Search Legislation", href: "/library/search"    },
    { label: "Bookmarks",         href: "/library/bookmarks"  },
    { label: "Recent Updates",    href: "/library/updates"    },
  ],
  Marketplace: [
    { label: "Find a Lawyer",     href: "/marketplace"                },
    { label: "By Speciality",     href: "/marketplace/specialties"    },
    { label: "For Lawyers",       href: "/lawyers"                    },
    { label: "Verification",      href: "/lawyers/verification"       },
  ],
  Company: [
    { label: "About Us",   href: "/about"    },
    { label: "Our Mission", href: "/about#mission" },
    { label: "Blog",       href: "/blog"     },
    { label: "Careers",    href: "/careers"  },
    { label: "Contact",    href: "/contact"  },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto !px-6 lg:!px-8">

        {/* ── Main grid ── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#E8317A,#ff6fa8)" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="5" cy="8" r="1" fill="white"/>
                  <circle cx="19" cy="8" r="1" fill="white"/>
                  <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  <line x1="9" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:17, color:"#111827" }}>
                Understand<span style={{ color:"#E8317A" }}>Law</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              Making Nigerian law simple, accessible, and actionable for every citizen — 
              regardless of education, income, or location.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2">
              {[
                { label:"X", icon:<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
                { label:"LinkedIn", icon:<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/> },
                { label:"Instagram", icon:<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5 fill-gray-600" viewBox="0 0 24 24">{s.icon}</svg>
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
                    <Link href={l.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter banner ── */}
        <div className="py-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-gray-50 rounded-2xl !px-6 !py-6">
            <div>
              <p className="text-xs font-semibold text-[#E8317A] uppercase tracking-wider mb-1">Weekly Digest</p>
              <h3 className="text-base font-bold text-gray-900">Know Your Rights — Every Week</h3>
              <p className="text-sm text-gray-500 mt-0.5">Plain-English legal updates, no jargon.</p>
            </div>
            <form className="flex gap-2.5 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address"
                className="email-input w-full md:w-60"/>
              <button type="submit" className="btn-pink text-sm flex-shrink-0">Subscribe</button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} UnderstandLaw.</span>
            <span>Built for Nigeria 🇳🇬</span>
          </div>
          <div className="flex items-center gap-4">
            {["Privacy Policy","Terms of Use","Content Disclaimer","Cookies"].map((l, i, arr) => (
              <span key={l} className="flex items-center gap-4">
                <Link href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{l}</Link>
                {i < arr.length - 1 && <span className="text-gray-200">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ── Legal disclaimer ── */}
        <div className="pb-6">
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-3xl">
            <strong className="font-semibold text-gray-500">Disclaimer:</strong>{" "}
            Content on UnderstandLaw is provided for general informational and educational purposes only.
            It does not constitute legal advice. Consult a qualified lawyer for advice specific to your situation.
          </p>
        </div>
      </div>
    </footer>
  );
}
