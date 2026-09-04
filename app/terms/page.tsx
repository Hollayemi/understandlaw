import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight } from "lucide-react";

const LAST_UPDATED = "August 20, 2026";

const SECTIONS: { id: string; title: string; body: (string | string[])[] }[] = [
  {
    id: "about-lawticha",
    title: "1. About LawTicha",
    body: [
      "LawTicha is a legal technology platform that provides access to legal information and resources and helps users connect with legal practitioners.",
      "LawTicha is not a law firm and does not provide legal advice or legal representation. Any legal services obtained through the Platform are provided by independent legal practitioners.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: [
      "You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use the Platform.",
      "You agree to provide accurate and truthful information when creating an account or using our services.",
    ],
  },
  {
    id: "user-accounts",
    title: "3. User Accounts",
    body: [
      "Some features require you to create an account. You are responsible for keeping your login details secure and for activities carried out through your account.",
      "We may suspend or terminate an account where false information is provided, these Terms are breached, or the Platform is used for unlawful or fraudulent purposes.",
    ],
  },
  {
    id: "legal-information",
    title: "4. Legal Information",
    body: [
      "LawTicha provides legal information and educational content for general informational purposes.",
      "We make reasonable efforts to keep our content accurate and current, but we do not guarantee that it is complete, up to date or suitable for your particular circumstances.",
      "Information on LawTicha is not a substitute for advice from a qualified legal practitioner.",
    ],
  },
  {
    id: "lawyers-on-lawticha",
    title: "5. Lawyers on LawTicha",
    body: [
      "LawTicha may allow users to discover and connect with lawyers.",
      "Lawyers on the Platform are independent legal practitioners and are responsible for the legal services and advice they provide. LawTicha does not control or direct their professional judgment.",
      "Where applicable, LawTicha may verify a lawyer's professional credentials. Verification does not guarantee the quality of the lawyer's services or the outcome of any legal matter.",
    ],
  },
  {
    id: "consultations-and-payments",
    title: "6. Consultations and Payments",
    body: [
      "LawTicha may allow users to book consultations with lawyers through the Platform.",
      "Where a consultation requires payment, you may be redirected to a third-party payment service provider to complete the transaction. The applicable fee will be displayed before payment.",
      "LawTicha facilitates the booking process but does not provide the legal service itself. Legal services are provided by the relevant independent lawyer.",
      "Any cancellation or refund will be subject to the applicable terms communicated at the time of booking.",
    ],
  },
  {
    id: "lawyer-client-relationship",
    title: "7. Lawyer-Client Relationship",
    body: [
      "Any lawyer-client relationship formed through the Platform exists between the user and the relevant lawyer.",
      "LawTicha is not a party to that relationship and is not responsible for the legal advice, services, actions or omissions of a lawyer.",
    ],
  },
  {
    id: "payments",
    title: "8. Payments",
    body: [
      "Some services on LawTicha may require payment. Applicable fees will be displayed before payment is made.",
      "Payments may be processed through third-party payment providers. Any refund or cancellation will be subject to the applicable refund or cancellation terms.",
    ],
  },
  {
    id: "acceptable-use",
    title: "9. Acceptable Use",
    body: [
      "You agree not to:",
      [
        "use LawTicha for any unlawful or fraudulent purpose;",
        "provide false or misleading information;",
        "impersonate another person;",
        "harass or abuse other users or lawyers;",
        "attempt to gain unauthorised access to the Platform;",
        "interfere with the operation or security of the Platform; or",
        "copy, scrape or commercially exploit Platform content without our permission.",
      ],
    ],
  },
  {
    id: "intellectual-property",
    title: "10. Intellectual Property",
    body: [
      "The LawTicha name, logo, website, software, original content and other materials on the Platform belong to or are licensed to LawTicha.",
      "You may use the Platform for its intended purpose but may not copy, reproduce, distribute or commercially exploit our proprietary content without our permission.",
    ],
  },
  {
    id: "disclaimer-and-liability",
    title: "11. Disclaimer and Liability",
    body: [
      "LawTicha is provided on an \u201cas is\u201d and \u201cas available\u201d basis.",
      "We do not guarantee uninterrupted access to the Platform or any particular legal outcome.",
      "To the fullest extent permitted by Nigerian law, LawTicha is not responsible for losses arising from your reliance on general legal information, the actions or omissions of independent lawyers, or third-party services.",
    ],
  },
  {
    id: "privacy",
    title: "12. Privacy",
    body: [
      "Your use of LawTicha is also governed by our Privacy Policy, which explains how we collect, use and protect your personal data in accordance with applicable Nigerian data protection law.",
    ],
  },
  {
    id: "termination",
    title: "13. Termination",
    body: [
      "We may suspend or terminate your access to LawTicha where you breach these Terms, misuse the Platform or engage in unlawful activity.",
    ],
  },
  {
    id: "changes-to-these-terms",
    title: "14. Changes to These Terms",
    body: [
      "We may update these Terms from time to time. The updated version will be posted on the Platform with a revised \u201cLast Updated\u201d date.",
      "Your continued use of LawTicha after an update means that you accept the revised Terms.",
    ],
  },
  {
    id: "governing-law",
    title: "15. Governing Law",
    body: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria.",
      "Any dispute arising from these Terms or your use of LawTicha shall be subject to the jurisdiction of the Nigerian courts.",
    ],
  },
  {
    id: "contact",
    title: "16. Contact",
    body: ["For questions about these Terms, please contact:"],
  },
];

export default function TermsPage() {
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
            Terms &amp; <span className="text-maroon-600">Conditions</span>
          </h1>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pb-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-[#F3F3F3] p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Welcome to LawTicha (&quot;LawTicha&quot;, &quot;we&quot;, &quot;our&quot;
              or &quot;us&quot;). These Terms &amp; Conditions govern your access to and
              use of the LawTicha website and web application at{" "}
              <span className="font-medium text-gray-800">www.lawticha.com</span> (the
              &quot;Platform&quot;).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              By accessing or using LawTicha, you agree to these Terms. If you do not
              agree, please do not use the Platform.
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
                Contact us about these Terms
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}