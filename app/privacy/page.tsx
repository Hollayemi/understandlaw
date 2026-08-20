import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { ArrowRight } from "lucide-react";

const LAST_UPDATED = "August 20, 2026";

const SECTIONS: { id: string; title: string; body: (string | string[])[] }[] = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    body: [
      "We may collect information you provide when you:",
      [
        "create or use a LawTicha account;",
        "subscribe to our newsletter;",
        "save or bookmark legal content;",
        "use our legal guides, library and other learning features;",
        "book or request a lawyer consultation;",
        "create a lawyer profile or apply for verification; or",
        "contact us.",
      ],
      "This may include your name, email address, phone number, location, account information, professional information, consultation details and other information you choose to provide.",
      "We may also automatically collect technical information such as your IP address, browser type, device information and how you use the Platform.",
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "2. How We Use Your Information",
    body: [
      "We use your information to:",
      [
        "create and manage your account;",
        "provide access to LawTicha's legal resources and dashboard;",
        "save your bookmarks, learning progress and preferences;",
        "provide certificates and other learning features;",
        "connect users with lawyers;",
        "facilitate consultation requests and bookings;",
        "verify lawyers and display relevant professional information;",
        "send newsletters, updates and service communications;",
        "improve and secure the Platform; and",
        "comply with applicable law.",
      ],
    ],
  },
  {
    id: "consultations-and-payments",
    title: "3. Consultations and Payments",
    body: [
      "LawTicha may allow users to request and book consultations with lawyers through the Platform.",
      "To facilitate a consultation, we may collect information such as your name, contact details, booking details, selected lawyer, consultation date and time, and other information you choose to provide in connection with the consultation.",
      "Where payment is required, you may be redirected to a third-party payment service provider to complete the transaction. LawTicha does not control the processing of your payment information by such third parties and does not intend to store your full payment card or banking details.",
      "We may receive and retain limited transaction information, such as the transaction reference, amount, payment status and date of payment, for the purpose of confirming and administering the transaction.",
      "Third-party payment providers may collect and process your payment information in accordance with their own privacy policies and terms. We encourage you to review those policies before completing a payment.",
    ],
  },
  {
    id: "lawyer-information",
    title: "4. Lawyer Information",
    body: [
      "Lawyers who use LawTicha may be required to provide information for our verification process, including information necessary to check their professional credentials.",
      "Verified lawyer profiles may display information such as the lawyer's name, speciality, location, verification status, ratings, reviews and response time.",
      "We only display information that is appropriate for the relevant Platform feature.",
    ],
  },
  {
    id: "sharing-your-information",
    title: "5. Sharing Your Information",
    body: [
      "We do not sell your personal information.",
      "We may share relevant information with lawyers where necessary to provide a service you have requested, and with service providers who help us operate LawTicha, including hosting, technology, communication and payment providers where applicable.",
      "We may also disclose information where required by law or to protect the rights, security and integrity of LawTicha and its users.",
    ],
  },
  {
    id: "cookies-and-similar-technologies",
    title: "6. Cookies and Similar Technologies",
    body: [
      "LawTicha may use cookies and similar technologies to keep the Platform functioning, remember your preferences, understand how users interact with the Platform and improve our services.",
      "You may manage cookies through your browser settings.",
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security",
    body: [
      "We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, misuse or disclosure.",
      "However, no online service can guarantee complete security.",
    ],
  },
  {
    id: "data-retention",
    title: "8. Data Retention",
    body: [
      "We retain personal information only for as long as reasonably necessary to provide our services, maintain your account, comply with legal obligations, resolve disputes and protect our legitimate interests.",
      "Where information is no longer required, we will take reasonable steps to delete or anonymise it where appropriate.",
    ],
  },
  {
    id: "your-rights",
    title: "9. Your Rights",
    body: [
      "Subject to applicable law, you may have the right to request access to, correction or deletion of your personal information and to exercise other rights available to you under Nigerian data-protection law.",
      "You may contact us to exercise your rights or ask questions about how your information is handled.",
    ],
  },
  {
    id: "third-party-services",
    title: "10. Third-Party Services",
    body: [
      "LawTicha may use third-party services or contain links to third-party websites. These services may have their own privacy policies, and LawTicha is not responsible for the privacy practices of third parties that it does not control.",
    ],
  },
  {
    id: "childrens-information",
    title: "11. Children's Information",
    body: [
      "LawTicha is intended for users who are legally capable of using the Platform. We do not knowingly collect personal information from children where such collection is prohibited by applicable law.",
    ],
  },
  {
    id: "changes-to-this-privacy-policy",
    title: "12. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated \u201cLast Updated\u201d date.",
    ],
  },
  {
    id: "nigerian-data-protection-law",
    title: "13. Nigerian Data Protection Law",
    body: [
      "LawTicha will process personal information in accordance with applicable Nigerian data-protection laws, including the Nigeria Data Protection Act 2023 and applicable regulations and guidance issued by the Nigeria Data Protection Commission.",
    ],
  },
  {
    id: "contact-us",
    title: "14. Contact Us",
    body: [
      "If you have questions, concerns or requests regarding this Privacy Policy or your personal information, please contact:",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy <span className="text-maroon-600">Policy</span>
          </h1>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pb-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-[#F3F3F3] p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              At LawTicha, we respect your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect, use
              and protect information when you use our website and web application at{" "}
              <span className="font-medium text-gray-800">www.lawticha.com</span> (the
              &quot;Platform&quot;).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              By using LawTicha, you agree to the practices described in this Privacy
              Policy.
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
                Contact us about your data
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}