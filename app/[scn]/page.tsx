"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import HomeWrapper from "@/app/components/wrapper";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Video,
  Languages,
  BadgeCheck,
  Loader2,
  Scale,
  ArrowRight,
  CalendarClock,
} from "lucide-react";
import { useGetLawyerByScnNumberQuery } from "@/redux/slices/lawyers.slice";
import { LawyerFull, Specialism } from "@/redux/types/lawyer";

function formatNaira(amount?: number) {
  if (!amount) return null;
  return `₦${amount.toLocaleString("en-NG")}`;
}

function deriveBadges(lawyer: LawyerFull): string[] {
  if (Array.isArray(lawyer.badges) && lawyer.badges.length > 0) return lawyer.badges as string[];
  const badges: string[] = [];
  if (lawyer.verificationStatus === "approved") badges.push("Verified");
  const rating = lawyer.ratingAvg || (lawyer as unknown as { rating?: number }).rating || 0;
  if (rating >= 4.5 && lawyer.reviewCount >= 5) badges.push("Top Rated");
  if (lawyer.responseTime && lawyer.responseTime <= 2) badges.push("Responsive");
  return badges;
}

const FEE_MODES: { key: keyof import("@/redux/types/lawyer").LawyerFees; label: string; icon: typeof MessageSquare }[] = [
  { key: "message", label: "Message Consultation", icon: MessageSquare },
  { key: "call", label: "Phone Call", icon: Phone },
  { key: "video", label: "Video Call", icon: Video },
];

export default function LawyerProfilePage() {
  const params = useParams<{ scn: string }>();
  const scn = decodeURIComponent(params.scn);

  const { data: response, isLoading, error, refetch } = useGetLawyerByScnNumberQuery(scn);
  const lawyer = response?.data as LawyerFull | undefined;

  if (isLoading) {
    return (
      <HomeWrapper>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: "var(--maroon-600)" }} />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </HomeWrapper>
    );
  }

  if (error || !lawyer) {
    return (
      <HomeWrapper>
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <Scale className="w-10 h-10 text-gray-200 mb-4" />
          <h1 className="text-lg font-bold text-gray-900 mb-1">Lawyer profile not found</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            This profile may have moved, or the link might be incorrect.
          </p>
          <div className="flex gap-3">
            <button onClick={() => refetch()} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Try again
            </button>
            <Link href="/marketplace" className="btn-maroon px-5 py-2.5 text-sm">
              Browse Marketplace
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </HomeWrapper>
    );
  }

  const badges = deriveBadges(lawyer);
  const rating = lawyer.ratingAvg || lawyer.rating || 0;

  return (
    <HomeWrapper>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      <section className="bg-[#F3F3F3] py-10 xl:py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="relative flex-shrink-0">
                  {lawyer.picture ? (
                    <img
                      src={lawyer.picture}
                      alt={lawyer.fullName}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                      style={{
                        background: lawyer.colorA
                          ? `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})`
                          : "linear-gradient(135deg, var(--maroon-600), var(--maroon-900))",
                      }}
                    >
                      {lawyer.avatarInitials}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-white ${
                      lawyer.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-xl font-bold text-gray-900">{lawyer.fullName}</h1>
                    {badges.includes("Verified") && (
                      <BadgeCheck className="w-5 h-5" style={{ color: "var(--maroon-600)" }} />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{lawyer.title}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {lawyer.location ? `${lawyer.location}, ` : ""}
                      {lawyer.state}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {rating > 0 ? rating.toFixed(1) : "New"}
                      {lawyer.reviewCount > 0 && ` (${lawyer.reviewCount} reviews)`}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Responds within {lawyer.responseTime}h
                    </span>
                  </div>

                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={
                            b === "Verified"
                              ? { background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }
                              : b === "Top Rated"
                              ? { background: "#FEF3C7", color: "#92400E" }
                              : { background: "#DCFCE7", color: "#166534" }
                          }
                        >
                          {b === "Verified" && <ShieldCheck className="w-3 h-3" />}
                          {b === "Top Rated" && <Star className="w-3 h-3" />}
                          {b === "Responsive" && <Zap className="w-3 h-3" />}
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {lawyer.bio && (
              <div className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{lawyer.bio}</p>
              </div>
            )}

            {/* Specialisms */}
            {lawyer.specialisms?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Specialisations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.specialisms.map((s: Specialism) => (
                    <span
                      key={s._id}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100"
                    >
                      {s.displayName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience + languages */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Experience &amp; Languages
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
                  >
                    <CalendarClock className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {(lawyer as unknown as { yearsCall?: number }).yearsCall
                        ? `${(lawyer as unknown as { yearsCall?: number }).yearsCall} years of practice`
                        : "Practice years N/A"}
                    </p>
                    {lawyer.yearOfCall && (
                      <p className="text-xs text-gray-500">Called to Bar in {lawyer.yearOfCall}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }}
                  >
                    <Languages className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Languages</p>
                    <p className="text-xs text-gray-500">{lawyer.languages?.join(", ") || "English"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Reviews {lawyer.reviewCount > 0 && `(${lawyer.reviewCount})`}
              </h2>
              {lawyer.reviewCount > 0 ? (
                <p className="text-sm text-gray-500">
                  This lawyer has an average rating of {rating.toFixed(1)} from {lawyer.reviewCount}{" "}
                  clients.
                </p>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No reviews yet, be the first to work with {lawyer.firstName}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: booking card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Consultation Fees</h3>
              <div className="flex flex-col gap-3 mb-6">
                {FEE_MODES.map(({ key, label, icon: Icon }) => {
                  const amount = lawyer.fees?.[key];
                  if (!amount) return null;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-medium text-gray-600">
                        <Icon className="w-4 h-4 text-gray-400" strokeWidth={2} />
                        {label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{formatNaira(amount)}</span>
                    </div>
                  );
                })}
              </div>

              <Link href={`/register?next=/${scn}`} className="btn-maroon w-full justify-center py-3 text-sm mb-3">
                Book Consultation
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <p className="text-center text-xs text-gray-400">
                Already have an account?{" "}
                <Link href={`/login?next=/${scn}`} className="font-semibold" style={{ color: "var(--maroon-700)" }}>
                  Log in
                </Link>
              </p>

              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                Payments are secured and only released after your consultation.
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}