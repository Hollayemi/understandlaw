import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useUserData } from "@/hook/useData";
import { ArrowRight, Star } from "lucide-react";
import CardStrip from "./CardStrip";

const AVATAR_COLORS = ["#6B1220", "#3B6FC4", "#0F9D58", "#E8A82A"];

export default function HeroSection() {
  const [email, setEmail] = React.useState("");
  const { status } = useSession();
  const { userInfo } = useUserData() as any;
  const authed = status === "authenticated";
  const user = userInfo?.user || {};
  return (
    <section className="bg-white overflow-hidden max-w-7xl mx-auto px-1 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 pt-12 pb-16 lg:pt-14 pl-4 sm:pl-8 lg:pl-[max(1.5rem,calc((100vw-1152px)/2+1.5rem))] overflow-hidden!">
        {/* LEFT, headline + form */}
        <div className="w-full lg:w-[400px] xl:w-[430px] flex-shrink-0 pr-6 lg:pr-0 animate-fade-up">
          <h1
            className="text-[30px] sm:text-[36px] leading-[1.06] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Know your rights.
            <br />
            Own your <span className="text-maroon-500">future.</span>
          </h1>

          {/* Stars + avatars */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <div className="flex items-center -space-x-2">
              {AVATAR_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ background: color, zIndex: 4 - i }}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">4.9/5 from 1.2K+ Users</span>
          </div>

          <p className="text-[15px] leading-relaxed text-gray-500 mt-6 max-w-md">
            From plain-English legal guides to verified lawyer consultations,
            LawTicha gives every Nigerian everything they need to know their
            rights, navigate the law, and get professional help. All in one place.
          </p>

          {/* Email + CTA */}
          {!authed ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="sm:flex-1 min-w-0 h-[52px] px-5 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
              />
              <Link href={`/register?email=${email}`} className="btn-maroon flex-shrink-0 h-[52px] px-6 text-sm whitespace-nowrap">
                Get Started for Free
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          ) : <Link href="/dashboard" className="btn-maroon mt-5 flex-shrink-0 h-[52px] px-6 text-sm whitespace-nowrap">
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>}

          <p className="text-xs text-gray-400 mt-4">
            By proceeding you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-gray-600 transition-colors">
              Platform Terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/legal/privacy" className="underline hover:text-gray-600 transition-colors">
              Privacy Notice
            </Link>
            .
          </p>
        </div>

        {/* RIGHT, card strip bleeding to the viewport edge */}
        <div className="flex-1 min-w-0 animate-fade-up delay-200">
          <CardStrip />
        </div>
      </div>
    </section>
  );
}