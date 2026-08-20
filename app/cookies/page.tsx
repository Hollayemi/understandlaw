import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight } from "lucide-react";

const LAST_UPDATED = "August 20, 2026";

const SECTIONS: { id: string; title: string; body: (string | string[])[] }[] = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies",
    body: [
      "Cookies are small text files placed on your device when you visit a website. They help the website remember information about your visit, such as your preferences and how you interact with the site.",
      "We also use similar technologies, such as local storage and pixels, which work in a comparable way to cookies. In this Cookie Policy, we refer to all of these collectively as \u201ccookies.\u201d",
    ],
  },
  {
    id: "how-we-use-cookies",
    title: "2. How We Use Cookies",
    body: [
      "LawTicha uses cookies to:",
      [
        "keep you signed in to your account;",
        "remember your preferences and settings;",
        "understand how users navigate and use the Platform;",
        "measure and improve the performance of our pages and features;",
        "help detect and prevent fraud or misuse of the Platform; and",
        "support payment and consultation booking flows where applicable.",
      ],
    ],
  },
  {
    id: "types-of-cookies-we-use",
    title: "3. Types of Cookies We Use",
    body: [
      "Strictly Necessary Cookies: required for the Platform to function, such as keeping you logged in and enabling core features. These cannot be switched off without affecting how the Platform works.",
      "Performance and Analytics Cookies: help us understand how visitors use LawTicha, such as which guides are most read, so we can improve the Platform.",
      "Functionality Cookies: remember choices you make, such as bookmarked content or display preferences, to give you a more personalised experience.",
      "Third-Party Cookies: set by service providers we work with, such as analytics or payment providers, to support their part of the Platform's functionality.",
    ],
  },
  {
    id: "third-party-cookies",
    title: "4. Third-Party Cookies",
    body: [
      "Some cookies on LawTicha are placed by third-party service providers, including analytics providers and, where applicable, payment providers used to process consultation payments.",
      "These third parties may use cookies in accordance with their own privacy and cookie policies. LawTicha does not control how these third parties use the information collected through their cookies.",
    ],
  },
  {
    id: "managing-your-cookie-preferences",
    title: "5. Managing Your Cookie Preferences",
    body: [
      "Most browsers let you view, manage, delete and block cookies through their settings. You can also set your browser to notify you when a cookie is placed on your device.",
      "If you disable strictly necessary cookies, some parts of LawTicha, such as staying signed in or completing a booking, may not work properly.",
      "Where required by applicable law, we will ask for your consent before placing non-essential cookies and give you a way to manage your preferences on the Platform.",
    ],
  },
  {
    id: "how-long-cookies-last",
    title: "6. How Long Cookies Last",
    body: [
      "Session cookies exist only while your browser is open and are deleted once you close it.",
      "Persistent cookies remain on your device for a set period, or until you delete them, so the Platform can recognise you on a return visit.",
    ],
  },
  {
    id: "changes-to-this-cookie-policy",
    title: "7. Changes to This Cookie Policy",
    body: [
      "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated \u201cLast Updated\u201d date.",
    ],
  },
  {
    id: "related-policies",
    title: "8. Related Policies",
    body: [
      "This Cookie Policy should be read together with our Privacy Policy, which explains more broadly how we collect, use and protect your personal information.",
    ],
  },
  {
    id: "contact-us",
    title: "9. Contact Us",
    body: [
      "If you have questions about this Cookie Policy or how we use cookies, please contact:",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-10 lg:pt-20 lg:pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            Legal
          </p>
          <h1
            className="text-[clamp(30px,5vw,46px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Cookie <span className="text-maroon-600">Policy</span>
          </h1>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pb-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-[#F3F3F3] p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              This Cookie Policy explains how LawTicha uses cookies and similar
              technologies when you visit our website and web application at{" "}
              <span className="font-medium text-gray-800">www.lawticha.com</span> (the
              &quot;Platform&quot;).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              By continuing to use LawTicha, you agree to our use of cookies as
              described in this Cookie Policy, except where we ask for your consent
              separately.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white pb-16 xl:pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[240px_1fr] gap-10">
          {/* Jump nav, desktop only */}
          <nav className="hidden lg:block sticky top-24 h-fit">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              On This Page
            </p>
            <ul className="flex flex-col gap-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1.5 text-[13px] text-gray-500 hover:text-[var(--maroon-700)] transition-colors leading-snug"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="max-w-3xl flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
                <div className="flex flex-col gap-3">
                  {s.body.map((block, i) =>
                    Array.isArray(block) ? (
                      <ul key={i} className="flex flex-col gap-2 pl-1">
                        {block.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                            <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--maroon-600)" }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">
                        {block}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Contact card */}
            <div className="rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-gray-900 mb-1">LawTicha</p>
              <p className="text-sm text-gray-500 mb-4">Website: www.lawticha.com</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--maroon-700)" }}
              >
                Contact us about cookies
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}