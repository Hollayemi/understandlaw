"use client";
import React from "react";
import HomeWrapper from "@/app/components/wrapper";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: <Phone className="w-5 h-5" strokeWidth={2} />,
    label: "Phone",
    value: "+234 802 345 6789",
    href: "tel:+2348023456789",
  },
  {
    icon: <MessageCircle className="w-5 h-5" strokeWidth={2} />,
    label: "WhatsApp",
    value: "+234 802 345 6789",
    href: "https://wa.me/2348023456789",
  },
  {
    icon: <Mail className="w-5 h-5" strokeWidth={2} />,
    label: "Email",
    value: "hello@lawticha.com",
    href: "mailto:hello@lawticha.com",
  },
{
  icon: <MapPin className="w-5 h-5" strokeWidth={2} />,
  label: "Office",
  value: "Suite 1B and 1C, 1st Floor, Hajarah House, Plot 8 Onyeabo C. Obi Street, behind the FCT High Court, Gudu, Abuja, Nigeria",
  href: "https://maps.google.com/?q=Suite+1B+and+1C,+1st+Floor,+Hajarah+House,+Plot+8+Onyeabo+C.+Obi+Street,+behind+the+FCT+High+Court,+Gudu,+Abuja,+Nigeria",
},
];

const REASONS = [
  { label: "General enquiry", value: "general" },
  { label: "I need a lawyer", value: "lawyer" },
  { label: "I'm a lawyer, I want to join", value: "join-lawyer" },
  { label: "Careers, instructor or publishing", value: "careers" },
  { label: "Press & media", value: "press" },
];

export default function ContactPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            Contact
          </p>
          <h1
            className="text-[clamp(34px,6vw,54px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Talk to <span className="text-maroon-600">us.</span>
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500 mt-6 max-w-xl mx-auto">
            Questions about your rights, a lawyer application, or something else
            entirely, reach us however works for you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-white pb-16 xl:pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACT_CARDS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Office" ? "_blank" : undefined}
              rel={c.label === "Office" ? "noopener noreferrer" : undefined}
              className="group rounded-2xl border border-gray-100 p-6 hover:border-[var(--maroon-600)]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
              >
                {c.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {c.label}
              </p>
              <p className="text-sm font-medium text-gray-900 leading-snug">{c.value}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + details */}
      <section className="bg-[#F3F3F3] py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-7 sm:p-9">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>
            <p className="text-sm text-gray-500 mb-7">
              We reply within one business day, faster for lawyer and press enquiries.
            </p>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Chidinma Okafor"
                    className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  What&apos;s this about?
                </label>
                <select className="w-full h-12 px-4 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 transition-colors">
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us a bit more..."
                  className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors resize-none"
                />
              </div>

              <button type="submit" className="btn-maroon h-12 px-6 text-sm self-start">
                Send message
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Side details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="rounded-2xl p-7" style={{ background: "var(--maroon-900)" }}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-white text-sm mb-3">Support hours</h3>
              <div className="flex flex-col gap-2 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Monday, Friday</span>
                  <span className="text-white font-medium">8:00am, 6:00pm WAT</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white font-medium">9:00am, 2:00pm WAT</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/50">Closed</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-4 leading-relaxed">
                WhatsApp is the fastest way to reach us outside these hours.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
              >
                <MapPin className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Our office</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Suite 1B and 1C, 1st Floor, Hajarah House, 
                <br />
                Plot 8 Onyeabo C. Obi Street,
                <br />
                behind the FCT High Court,
                <br />
                Gudu, Abuja,
                <br />
                Nigeria
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Visits by appointment only, please reach out first.
              </p>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}
