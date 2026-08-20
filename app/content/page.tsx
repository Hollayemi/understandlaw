import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight } from "lucide-react";

const LAST_UPDATED = "August 20, 2026";

const SECTIONS: { id: string; title: string; body: (string | string[])[] }[] = [
  {
    id: "general-information-only",
    title: "1. General Information Only",
    body: [
      "The content on LawTicha, including our legal guides, library, articles, explainers, videos and any other learning materials (\u201cContent\u201d), is provided for general informational and educational purposes only.",
      "Content on the Platform is not, and should not be treated as, legal advice, legal opinion or a substitute for advice from a qualified lawyer. Laws change and are applied differently depending on the specific facts of a situation, so Content that is accurate in one context may not apply to yours.",
    ],
  },
  {
    id: "no-lawyer-client-relationship",
    title: "2. No Lawyer-Client Relationship",
    body: [
      "Using LawTicha, reading our Content, or booking a consultation through the Platform does not create a lawyer-client relationship between you and LawTicha or between you and any lawyer listed on the Platform, unless and until that lawyer expressly agrees to represent you.",
      "Any information you share with a lawyer before such a relationship is formed may not be treated as privileged or confidential.",
    ],
  },
  {
    id: "no-guarantee-of-accuracy",
    title: "3. No Guarantee of Accuracy or Completeness",
    body: [
      "We make reasonable efforts to keep Content accurate, current and clearly written, but we do not warrant or guarantee that any Content is complete, accurate, up to date or applicable to your particular circumstances.",
      "Legislation, regulations, case law and government guidance referenced in our Content may have changed since publication. You should independently verify any information before relying on it.",
    ],
  },
  {
    id: "third-party-lawyers-and-listings",
    title: "4. Third-Party Lawyers and Listings",
    body: [
      "LawTicha may allow verified lawyers to create profiles and connect with users who wish to book a consultation.",
      "Lawyer profiles, ratings, reviews and response times are provided by lawyers themselves or by users, and LawTicha does not independently verify every statement made in a profile beyond our stated verification process.",
      "We do not endorse, recommend or guarantee the quality, competence or outcome of any consultation or engagement with a lawyer found through the Platform. Any engagement you enter into with a lawyer is a matter between you and that lawyer.",
    ],
  },
  {
    id: "user-generated-and-community-content",
    title: "5. User-Generated and Community Content",
    body: [
      "Where the Platform allows reviews, comments, ratings or other user-submitted content, such content reflects the views of the individual who submitted it and not the views of LawTicha.",
      "We do not verify the accuracy of user-generated content and are not responsible for it.",
    ],
  },
  {
    id: "no-liability",
    title: "6. Limitation of Liability",
    body: [
      "To the fullest extent permitted by applicable law, LawTicha, its officers, employees and affiliates will not be liable for any loss or damage arising from your use of, or reliance on, Content or any consultation booked through the Platform.",
      "This includes, without limitation, decisions made or actions taken (or not taken) on the basis of information found on LawTicha.",
      "Nothing in this Disclaimer limits or excludes liability that cannot lawfully be limited or excluded under applicable Nigerian law.",
    ],
  },
  {
    id: "seek-professional-advice",
    title: "7. Always Seek Professional Advice",
    body: [
      "If you have a specific legal issue or need advice on a particular matter, you should consult a qualified lawyer who can review the full facts of your situation.",
      "You can use LawTicha's consultation feature to connect with a verified lawyer for advice tailored to your circumstances.",
    ],
  },
  {
    id: "external-links",
    title: "8. Links to External Resources",
    body: [
      "Content on LawTicha may link to external websites, statutes, judgments or resources maintained by third parties. We do not control and are not responsible for the accuracy or availability of that external material.",
    ],
  },
  {
    id: "changes-to-this-disclaimer",
    title: "9. Changes to This Disclaimer",
    body: [
      "We may update this Content Disclaimer from time to time. Any changes will be posted on this page with an updated \u201cLast Updated\u201d date.",
    ],
  },
  {
    id: "contact-us",
    title: "10. Contact Us",
    body: [
      "If you have questions about this Content Disclaimer or about any Content on the Platform, please contact:",
    ],
  },
];

export default function ContentDisclaimerPage() {
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
            Content <span className="text-maroon-600">Disclaimer</span>
          </h1>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pb-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-[#F3F3F3] p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              LawTicha helps people understand the law through plain-language guides,
              articles and access to verified lawyers on our website and web
              application at{" "}
              <span className="font-medium text-gray-800">www.lawticha.com</span> (the
              &quot;Platform&quot;). This Content Disclaimer explains the limits of the
              Content we provide and what it does not replace.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              By using LawTicha, you agree to the terms described in this Content
              Disclaimer.
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
                Contact us about our Content
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}