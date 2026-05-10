"use client";
// app/admin/page.tsx
//  Placeholder page,  replace with real dashboard content 
// This file only exists to confirm the layout wrapper renders correctly.
// Delete or replace once you build the real admin overview page.

export default function AdminPlaceholderPage() {
  return (
    <div
      className="flex items-center justify-center min-h-full"
      style={{ padding: "48px 24px" }}
    >
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "rgba(232,49,122,0.10)",
            border: "1px solid rgba(232,49,122,0.20)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
            <line x1="12" y1="3" x2="12" y2="20" stroke="#E8317A" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="5" y1="8" x2="19" y2="8" stroke="#E8317A" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="5" cy="8" r="1" fill="#E8317A" />
            <circle cx="19" cy="8" r="1" fill="#E8317A" />
            <path d="M3 11 Q5 15 7 11" stroke="#E8317A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M17 11 Q19 15 21 11" stroke="#E8317A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <line x1="9" y1="20" x2="15" y2="20" stroke="#E8317A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h1
          className="text-lg font-semibold mb-1"
          style={{ color: "#8B9BB4" }}
        >
          Admin Dashboard
        </h1>
        <p className="text-sm" style={{ color: "#3A4A6A" }}>
          Layout wrapper is working. Build your content here.
        </p>
      </div>
    </div>
  );
}
