"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Star, MapPin, Clock, BadgeCheck, Award, Zap,
  MessageSquare, Phone, Video, Share2, Bookmark, Check,
  ChevronRight, Shield, Calendar, Users, TrendingUp,
  CheckCircle, X, Send, Loader2, ChevronLeft, Info,
  Copy, ExternalLink, XIcon, Link2, AlertCircle,
  Globe, BookOpen, Scale, Briefcase, Heart, Car, Building2, Home
} from "lucide-react";
import { useGetLawyerByScnNumberQuery, useGetLawyerAvailabilityQuery, useBookConsultationMutation } from "@/redux/slices/lawyers.slice";
import { Specialism } from "@/redux/types/lawyer";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";

// Types
type ConsultMode = "message" | "call" | "video";

interface Review {
  id: string;
  initials: string;
  color: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  specialism: string;
}

const getRandomColor = (id: string) => {
  const colors = [
    { A: "#1E3A5F", B: "#2D5A8E" },
    { A: "#1A3B2E", B: "#2D6A4F" },
    { A: "#2D1A3B", B: "#4A2D6A" },
    { A: "#1A2D3B", B: "#0E4D6A" },
    { A: "#2D1A1A", B: "#7B2828" },
    { A: "#2A2D1A", B: "#5A6A2D" },
  ];
  const index = (id?.length || 0) % colors.length;
  return colors[index];
};

const getBadgeConfig = (badge: string) => {
  const configs: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    "Verified Lawyer": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", icon: BadgeCheck },
    "Top Rated": { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", icon: Award },
    "Responsive": { bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD", icon: Zap },
  };
  return configs[badge] || { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB", icon: Shield };
};

const CONSULT_MODES = [
  { id: "message" as ConsultMode, label: "Written Consultation", icon: MessageSquare, desc: "Async reply within response time" },
  { id: "call" as ConsultMode, label: "Scheduled Call", icon: Phone, desc: "Audio call, you pick the time" },
  { id: "video" as ConsultMode, label: "Video Session", icon: Video, desc: "Face-to-face via secure link" },
];

// Star Rating Component
function StarRating({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= n ? "text-amber-400 fill-amber-400" : "text-[#E5E7EB] fill-[#E5E7EB]"} />
      ))}
    </div>
  );
}

// Share Modal Component
function ShareModal({ lawyer, onClose }: { lawyer: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#111827] text-sm">Share Profile</h3>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
              {lawyer.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-[#111827] truncate">{lawyer.fullName}</p>
              <p className="text-[11px] text-[#9CA3AF] truncate">{lawyer.title || lawyer.specialisms?.[0] || "Legal Practitioner"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#F3F4F6] rounded-xl mb-4">
            <Link2 size={13} className="text-[#9CA3AF] flex-shrink-0" />
            <span className="text-[11px] text-[#6B7280] truncate flex-1 font-mono">{profileUrl}</span>
          </div>

          <button onClick={copy}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors w-full">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F9FAFB]">
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-[#6B7280]" />}
            </div>
            <span className="text-[13px] font-semibold text-[#374151]">
              {copied ? "Copied!" : "Copy link"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Booking Modal Component
function BookingModal({ lawyer, onClose, refetch }: { lawyer: any; onClose: () => void; refetch: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<ConsultMode>("message");
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [bookConsultation, { isLoading: isBooking }] = useBookConsultationMutation();

  // Fetch availability slots for call/video modes
  const { data: availabilityData, isLoading: isLoadingSlots } = useGetLawyerAvailabilityQuery(
    { scnNumber: lawyer.scnNumber.replaceAll("/", "-"), date: undefined },
    { skip: mode === "message" }
  );

  const availabilitySlots = availabilityData?.data || [];
  const timeSlots = availabilitySlots.map(slot => 
    new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const selectedMode = CONSULT_MODES.find(m => m.id === mode)!;
  const fee = mode === "message" ? lawyer.feeMessage : mode === "call" ? lawyer.feeCall : lawyer.feeVideo;

  const submit = async () => {
    setSubmitting(true);
    try {
      await bookConsultation({
        lawyerScnNumber: lawyer.scnNumber,
        mode: mode,
        topic: topic,
        description: detail,
        preferredTimeSlot: (mode === "call" || mode === "video") ? slot : undefined,
      }).unwrap();
      setStep(3);
      refetch(); // Refresh lawyer data to update stats
    } catch (error) {
      console.error("Booking failed:", error);
      // Handle error here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="h-1 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${lawyer.colorA}, ${lawyer.colorB})` }} />

        {step === 3 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#6EE7B7] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#10B981]" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-1">Request Sent!</h3>
            <p className="text-sm text-[#6B7280] mb-1">Your request has been sent to {lawyer.fullName}.</p>
            <p className="text-xs text-[#9CA3AF] mb-6">Expected response: Under {lawyer.responseTime || 2} hours</p>

            <div className="bg-[#F9FAFB] rounded-xl p-4 text-left mb-5 space-y-2 text-xs">
              {[
                { l: "Format", v: selectedMode.label },
                { l: "Topic", v: topic },
                { l: "Fee", v: `NGN ${fee?.toLocaleString() || 0}` },
              ].map(r => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-[#9CA3AF]">{r.l}</span>
                  <span className="font-semibold text-[#111827] truncate max-w-[180px]">{r.v}</span>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#111827] text-[13px] font-bold text-white hover:bg-gray-800 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
                    {lawyer.avatarInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Book a Consultation</p>
                    <p className="text-[11px] text-[#9CA3AF]">{lawyer.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? "bg-[#F97316] text-white" : "bg-[#111827] text-white"}`}>
                      {step > 1 ? <Check size={11} /> : "1"}
                    </div>
                    <div className="w-5 h-px bg-[#E5E7EB]" />
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? "bg-[#F97316] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      2
                    </div>
                  </div>
                  <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Consultation Format</label>
                    <div className="flex flex-col gap-2">
                      {CONSULT_MODES.map(m => {
                        const Icon = m.icon;
                        const active = mode === m.id;
                        const modeFee = m.id === "message" ? lawyer.feeMessage : m.id === "call" ? lawyer.feeCall : lawyer.feeVideo;
                        return (
                          <button key={m.id} onClick={() => setMode(m.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-[1.5px] text-left transition-all ${active ? "border-[#F97316] bg-pink-50/60" : "border-[#E5E7EB] hover:border-[#9CA3AF]"}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-[#F97316]/10" : "bg-[#F3F4F6]"}`}>
                              <Icon size={16} className={active ? "text-[#F97316]" : "text-[#6B7280]"} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[13px] font-semibold ${active ? "text-[#F97316]" : "text-[#111827]"}`}>{m.label}</p>
                              <p className="text-[11px] text-[#9CA3AF]">{m.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[13px] font-bold text-[#111827]">NGN {modeFee?.toLocaleString() || 0}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Legal Topic</label>
                    <input value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. My landlord is trying to evict me without notice"
                      className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#F97316] placeholder:text-[#D1D5DB] transition-colors"
                    />
                  </div>

                  <button onClick={() => setStep(2)} disabled={!topic.trim()}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}>
                    Continue →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#111827] transition-colors mb-1">
                    ← Back
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Describe your situation <span className="font-normal text-[#9CA3AF]">(optional)</span></label>
                    <textarea value={detail} onChange={e => setDetail(e.target.value)}
                      placeholder="Provide details that will help the lawyer prepare..."
                      className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#F97316] placeholder:text-[#D1D5DB] transition-colors"
                    />
                  </div>

                  {(mode === "call" || mode === "video") && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Preferred Time Slot</label>
                      {isLoadingSlots ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 size={20} className="animate-spin text-[#F97316]" />
                        </div>
                      ) : timeSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map(s => (
                            <button key={s} onClick={() => setSlot(s)}
                              className={`py-2.5 px-3 rounded-xl border-[1.5px] text-[11px] font-medium text-left transition-all ${slot === s ? "border-[#F97316] bg-pink-50/60 text-[#F97316]" : "border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]"}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#9CA3AF] py-2">No availability slots found. Please try another day.</p>
                      )}
                    </div>
                  )}

                  <div className="bg-[#F9FAFB] rounded-xl p-4 text-xs space-y-2">
                    <p className="font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Booking Summary</p>
                    {[
                      { l: "Format", v: selectedMode.label },
                      { l: "Topic", v: topic },
                      { l: "Total", v: `NGN ${fee?.toLocaleString() || 0}` },
                    ].map(r => (
                      <div key={r.l} className="flex justify-between">
                        <span className="text-[#9CA3AF]">{r.l}</span>
                        <span className="font-semibold text-[#111827] truncate max-w-[180px]">{r.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                    <Info size={13} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#92400E] leading-relaxed">
                      Payment processed via Paystack after the lawyer accepts. No charge until then.
                    </p>
                  </div>

                  <button onClick={submit}
                    disabled={submitting || isBooking || ((mode === "call" || mode === "video") && !slot)}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}>
                    {(submitting || isBooking) ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : <><Send size={13} /> Send Request</>}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const scnNumber = params.scnNumber as string;
  const normalizedScnNumber = scnNumber;
  const {data:loadSpecialism} = useListSpecialismsQuery();

  const specialismConfig = loadSpecialism?.data || []

  console.log(specialismConfig)
  
  const [tab, setTab] = useState<"overview" | "reviews" | "faq">("overview");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { data: lawyerResponse, isLoading, error, refetch } = useGetLawyerByScnNumberQuery(normalizedScnNumber);
  console.log({lawyerResponse})
  const lawyer = lawyerResponse?.data;



  // Generate dynamic data from API response
  const colors = getRandomColor(lawyer?.id || scnNumber);
  const initials = lawyer?.avatarInitials;
  
  const badges = [];
  if (lawyer?.verificationStatus === "approved") badges.push("Verified Lawyer");
  if (lawyer?.rating && lawyer.rating >= 4.7) badges.push("Top Rated");
  if (lawyer?.responseTime && lawyer.responseTime < 2) badges.push("Responsive");


  // Mock reviews for now - these would come from a separate endpoint
  const reviews: Review[] = [];

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#F5F2EE] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-gray-500">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="flex-1 bg-[#F5F2EE] flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-4">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg mb-2">Lawyer Not Found</p>
          <p className="text-sm text-gray-500 mb-6">
            The lawyer you're looking for doesn't exist or has been removed from the platform.
          </p>
          <button
            onClick={() => router.push("/dashboard/marketplace")}
            className="px-4 py-2 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#c81e6b] transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {bookingOpen && <BookingModal lawyer={{ ...lawyer, ...colors }} onClose={() => setBookingOpen(false)} refetch={refetch} />}
      {shareOpen && <ShareModal lawyer={{ ...lawyer, ...colors }} onClose={() => setShareOpen(false)} />}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/dashboard/marketplace" className="flex items-center gap-1 hover:text-[#111827] transition-colors">
              <ArrowLeft size={13} /> Marketplace
            </Link>
            <ChevronRight size={11} className="text-[#D1D5DB]" />
            <span className="font-semibold text-[#111827] truncate max-w-[160px]">{lawyer.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
              <Share2 size={13} /> Share
            </button>
            <button onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border transition-colors ${bookmarked ? "border-[#F97316] bg-pink-50 text-[#F97316]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#9CA3AF]"}`}>
              <Bookmark size={15} className={bookmarked ? "fill-[#F97316]" : ""} />
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 xl:px-8 py-7">
          {/* Hero Card */}
          <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden mb-5">
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${colors.A} 0%, ${colors.B} 60%, ${colors.A}80 100%)` }} />
            <div className="p-6 xl:p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${colors.A}, ${colors.B})` }}>
                      {initials}
                    </div>
                    {lawyer.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-[#ECFDF5] border border-[#6EE7B7] rounded-full px-2 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-[9px] font-bold text-[#065F46]">Available</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-[#111827] leading-tight mb-1">{lawyer.fullName}</h1>
                    <p className="text-sm text-[#6B7280] mb-1">{lawyer.title || lawyer.specialisms?.join(", ") || "Legal Practitioner"}</p>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-3">
                      <MapPin size={12} className="flex-shrink-0" />
                      {lawyer.location || "Nigeria"}, {lawyer.state || ""}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {badges.map(badge => {
                        const config = getBadgeConfig(badge);
                        const Icon = config.icon;
                        return (
                          <span key={badge} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                            style={{ background: config.bg, color: config.text, borderColor: config.border }}>
                            <Icon size={9} /> {badge}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 text-[12px]">
                      <div className="flex items-center gap-1">
                        <StarRating n={Math.round(lawyer.rating || 4.5)} size={12} />
                        <span className="font-bold text-[#111827] ml-1">{lawyer.rating || 4.5}</span>
                        <span className="text-[#9CA3AF]">({lawyer.reviewCount || 0} reviews)</span>
                      </div>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="text-[#6B7280]">{lawyer.consultationCount || 0} sessions</span>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="text-[#6B7280]">Responds under {lawyer.responseTime || 2} hours</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col gap-2 flex-shrink-0">
                  <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6] mb-1">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Consultation Fees</p>
                    {[
                      { label: "Written Message", fee: lawyer.fees.message, icon: MessageSquare },
                      { label: "Scheduled Call", fee: lawyer.fees.call, icon: Phone },
                      { label: "Video Session", fee: lawyer.fees.video, icon: Video },
                    ].map(m => {
                      const Icon = m.icon;
                      return (
                        <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6] last:border-0">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                            <Icon size={11} className="text-[#9CA3AF]" /> {m.label}
                          </div>
                          <span className="text-[12px] font-bold text-[#111827]">NGN {m.fee?.toLocaleString() || 0}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setBookingOpen(true)} disabled={!lawyer.isAvailable}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:translate-y-0"
                    style={{ background: lawyer.isAvailable ? "linear-gradient(135deg, #F97316, #EA580C)" : "#9CA3AF" }}>
                    <Calendar size={14} />
                    {lawyer.isAvailable ? "Book a Consultation" : "Currently Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="grid xl:grid-cols-[1fr_280px] gap-5">
            <div>
              <div className="flex gap-1 bg-white border border-[#F3F4F6] rounded-xl p-1 mb-5 shadow-sm">
                {([
                  { id: "overview" as const, label: "Overview" },
                  { id: "reviews" as const, label: `Reviews (${reviews.length})` },
                  { id: "faq" as const, label: "FAQ" },
                ]).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all ${tab === t.id ? "bg-[#111827] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <h2 className="text-[14px] font-bold text-[#111827] mb-3">About</h2>
                    <div className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">
                      {lawyer.bio || "No bio provided yet."}
                    </div>
                  </div>

                  {lawyer.specialisms && lawyer.specialisms.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                      <h2 className="text-[14px] font-bold text-[#111827] mb-4">Practice Areas</h2>
                      <div className="flex flex-col gap-3">
                        {lawyer.specialisms.map((specialism: Specialism) => {
                          // const cfg = specialismConfig[specialism];
                          // if (!cfg) return null;
                          // const Icon = cfg.icon;
                          return (
                            <div key={specialism._id} className="flex items-center gap-3 p-3 rounded-xl border border-[#F3F4F6]">
                              
                              {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: cfg.bg }}>
                                <Icon size={15} style={{ color: cfg.color }} />
                              </div> */}
                              <span className="text-[13px] font-semibold text-[#111827]">{specialism.displayName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                      <Shield size={18} className="text-[#10B981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#111827]">SCN Verified</p>
                      <p className="text-[11px] text-[#9CA3AF] font-mono">{lawyer.scnNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#6EE7B7] px-2 py-0.5 rounded-full">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>
              )}

              {tab === "reviews" && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Scale size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No reviews yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to leave a review after your consultation</p>
                </div>
              )}

              {tab === "faq" && (
                <div className="flex flex-col gap-3">
                  {[
                    { q: "How does a written consultation work?", a: "You send your question and any relevant details. The lawyer responds with a comprehensive written analysis within their stated response time. You can follow up with clarifying questions at no extra charge within 48 hours of the initial reply." },
                    { q: "What if I need a lawyer to appear in court for me?", a: "Written consultations and calls on this platform are advisory services. For court representation, contact the lawyer directly after your consultation to discuss fees and availability for in-person legal representation." },
                    { q: "Are consultations confidential?", a: "Yes. All consultations are covered by legal professional privilege and attorney-client confidentiality under Nigerian law. Your information will never be shared with any third party." },
                    { q: "What happens if I'm unhappy with the consultation?", a: "LawTicha has a dispute resolution process. If you feel the advice was inadequate, you can raise a dispute within 7 days and the platform will review the consultation and determine if a refund is appropriate." },
                  ].map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden">
                      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[13px] font-semibold text-[#111827] hover:text-[#F97316] transition-colors">
                        {faq.q}
                        <ChevronRight size={14} className="text-[#9CA3AF] group-open:rotate-90 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-5 pb-5 text-[13px] text-[#6B7280] leading-relaxed border-t border-[#F9FAFB] pt-4">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
                <h3 className="text-[12px] font-bold text-[#111827] mb-4">Quick Facts</h3>
                <div className="flex flex-col gap-3 text-[12px]">
                  {[
                    { label: "Response time", value: `Under ${lawyer.responseTime || 2} hours`, icon: Clock },
                    { label: "Sessions done", value: `${lawyer.consultationCount || 0}+`, icon: Users },
                    { label: "Year called", value: lawyer.yearOfCall || "N/A", icon: Award },
                    { label: "Languages", value: lawyer.languages?.join(", ") || "English", icon: Globe },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center justify-between py-2 border-b border-[#F9FAFB] last:border-0">
                        <div className="flex items-center gap-2 text-[#9CA3AF]">
                          <Icon size={12} />
                          <span>{s.label}</span>
                        </div>
                        <span className="font-semibold text-[#111827] text-right max-w-[120px]">{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 border border-white/6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#F97316]/10 blur-2xl" />
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1">Ready to start?</p>
                <p className="text-[14px] font-bold text-white mb-3 leading-snug">Get expert legal advice in your next session</p>
                <button onClick={() => setBookingOpen(true)}
                  className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}>
                  Book Consultation
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#111827] mb-3">Know someone who needs this?</p>
                <p className="text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">Share this profile with someone who could benefit from legal advice.</p>
                <button onClick={() => setShareOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] flex items-center justify-center gap-1.5 transition-all">
                  <Share2 size={12} /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
