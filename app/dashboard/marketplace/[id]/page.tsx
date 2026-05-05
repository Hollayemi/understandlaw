"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, Clock, BadgeCheck, Award, Zap,
  MessageSquare, Phone, Video, Share2, Bookmark, Check,
  ChevronRight, Shield, Calendar, Users, TrendingUp,
  CheckCircle, X, Send, Loader2, ChevronLeft, Info,
  Copy, ExternalLink, XIcon, Link2,
  Globe, BookOpen, Scale, Briefcase, Heart, Car,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LAWYER = {
  id: "l1",
  name: "Adaeze Okonkwo",
  initials: "AO",
  colorA: "#1E3A5F",
  colorB: "#2D5A8E",
  title: "Criminal & Civil Rights Lawyer",
  subtitle: "Senior Associate · 10 Years Called",
  location: "Victoria Island, Lagos",
  state: "Lagos",
  rating: 4.9,
  reviewCount: 84,
  responseTime: "Under 1 hour",
  consultations: 312,
  yearsCall: 10,
  calledAt: "2014",
  nbaNumber: "NBA/LAG/2014/01847",
  available: true,
  bio: `Called to the Nigerian Bar in 2014 with a focus on criminal defence, police accountability, and fundamental rights enforcement. I regularly appear before the Federal High Court and Court of Appeal across Lagos and Abuja.

My practice is built on one principle: every Nigerian deserves to know their rights, and to have those rights enforced. I work with individuals who have experienced unlawful detention, wrongful termination, and violations of constitutional freedoms.

I am passionate about making the law accessible. I co-authored the LawTicha Police Rights module and have trained over 200 community legal advocates.`,
  specialisms: ["criminal", "employment", "constitutional"],
  specialismLabels: ["Criminal Law", "Employment & Labour", "Constitutional Rights"],
  languages: ["English", "Igbo", "Yoruba"],
  badges: ["Verified Lawyer", "Top Rated", "Responsive"],
  fee: { message: 5000, call: 12000, video: 18000 },
  education: [
    { institution: "University of Lagos", degree: "LLB (Hons)", year: "2013" },
    { institution: "Nigerian Law School", degree: "BL", year: "2014" },
    { institution: "University of London", degree: "LLM – Human Rights", year: "2018" },
  ],
  notableWork: [
    "Represented 14 defendants in landmark Section 35 enforcement action against IGP (2022)",
    "Co-authored LawTicha Police Rights educational module",
    "Trained 200+ community legal advocates in Lagos and Enugu",
    "Published in Nigerian Bar Association Journal on wrongful detention remedies",
  ],
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    initials: "CI",
    color: "#3B82F6",
    name: "Chioma I.",
    rating: 5,
    text: "Adaeze was extraordinary. She explained my Section 35 rights in plain terms and drafted a formal demand letter that stopped the police harassment immediately. Worth every naira.",
    date: "3 weeks ago",
    specialism: "Criminal Law",
  },
  {
    id: "r2",
    initials: "BL",
    color: "#10B981",
    name: "Babatunde L.",
    rating: 5,
    text: "Professional, thorough, and responded faster than expected. She walked me through my wrongful termination claim step by step. Got me ₦180,000 in severance I didn't know I was owed.",
    date: "1 month ago",
    specialism: "Employment Law",
  },
  {
    id: "r3",
    initials: "AG",
    color: "#8B5CF6",
    name: "Aminu G.",
    rating: 4,
    text: "Very knowledgeable. Explained the ACJA provisions in a way I could actually understand and act on. Communication was excellent throughout.",
    date: "6 weeks ago",
    specialism: "Criminal Law",
  },
  {
    id: "r4",
    initials: "FO",
    color: "#F59E0B",
    name: "Funke O.",
    rating: 5,
    text: "I came to Adaeze in a panic. My employer had deducted salary without notice for three months. She sent a legal letter within 24 hours of our session. The deductions stopped the next payroll.",
    date: "2 months ago",
    specialism: "Employment Law",
  },
];

const CONSULT_MODES = [
  { id: "message" as ConsultMode, label: "Written Consultation", icon: MessageSquare, desc: "Async reply within response time", fee: 5000 },
  { id: "call" as ConsultMode,    label: "Scheduled Call",       icon: Phone,         desc: "Audio call, you pick the time",  fee: 12000 },
  { id: "video" as ConsultMode,   label: "Video Session",        icon: Video,         desc: "Face-to-face via secure link",   fee: 18000 },
];

const BADGE_STYLE: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  "Verified Lawyer": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", icon: BadgeCheck },
  "Top Rated":       { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", icon: Award      },
  "Responsive":      { bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD", icon: Zap        },
};

const SPECIALISM_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  criminal:      { label: "Criminal Law",          color: "#3B82F6", bg: "#EFF6FF", icon: Shield    },
  employment:    { label: "Employment & Labour",   color: "#8B5CF6", bg: "#F5F3FF", icon: Briefcase },
  constitutional:{ label: "Constitutional Rights", color: "#E8317A", bg: "#FFF0F5", icon: Scale     },
};

const TIME_SLOTS = [
  "Today, 2:00 PM", "Today, 5:00 PM",
  "Tomorrow, 10:00 AM", "Tomorrow, 2:00 PM",
  "Thu, 9:00 AM", "Thu, 3:00 PM",
];

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ lawyer, onClose }: { lawyer: typeof LAWYER; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://lawticha.ng/lawyers/${lawyer.id}`;

  const copy = () => {
    navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      label: "Copy link",
      icon: copied ? Check : Copy,
      color: "#111827",
      bg: "#F9FAFB",
      action: copy,
    },
    {
      label: "Share on Twitter",
      icon: XIcon,
      color: "#1DA1F2",
      bg: "#EFF6FF",
      action: () => window.open(`https://twitter.com/intent/tweet?text=Check out ${lawyer.name} on LawTicha&url=${profileUrl}`, "_blank"),
    },
    {
      label: "Share on LinkedIn",
      icon: XIcon,
      color: "#0A66C2",
      bg: "#EFF6FF",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${profileUrl}`, "_blank"),
    },
    {
      label: "Open in new tab",
      icon: ExternalLink,
      color: "#6B7280",
      bg: "#F9FAFB",
      action: () => window.open(profileUrl, "_blank"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#111827] text-sm">Share Profile</h3>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Profile preview */}
          <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
              {lawyer.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-[#111827] truncate">{lawyer.name}</p>
              <p className="text-[11px] text-[#9CA3AF] truncate">{lawyer.title}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[12px] font-bold text-[#111827]">{lawyer.rating}</span>
            </div>
          </div>

          {/* URL bar */}
          <div className="flex items-center gap-2 p-3 bg-[#F3F4F6] rounded-xl mb-4">
            <Link2 size={13} className="text-[#9CA3AF] flex-shrink-0" />
            <span className="text-[11px] text-[#6B7280] truncate flex-1 font-mono">{profileUrl}</span>
          </div>

          {/* Share options */}
          <div className="flex flex-col gap-2">
            {shareOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button key={opt.label} onClick={opt.action}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: opt.bg }}>
                    <Icon size={14} style={{ color: opt.color }} />
                  </div>
                  <span className="text-[13px] font-semibold text-[#374151]">
                    {opt.label === "Copy link" && copied ? "Copied!" : opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({ lawyer, onClose }: { lawyer: typeof LAWYER; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<ConsultMode>("message");
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedMode = CONSULT_MODES.find(m => m.id === mode)!;

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    setStep(3);
    setSubmitting(false);
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
            <p className="text-sm text-[#6B7280] mb-1">Your request has been sent to {lawyer.name}.</p>
            <p className="text-xs text-[#9CA3AF] mb-6">Expected response: <strong className="text-[#374151]">{lawyer.responseTime.toLowerCase()}</strong></p>

            <div className="bg-[#F9FAFB] rounded-xl p-4 text-left mb-5 space-y-2 text-xs">
              {[
                { l: "Format", v: selectedMode.label },
                { l: "Topic",  v: topic              },
                { l: "Fee",    v: `NGN ${selectedMode.fee.toLocaleString()}` },
              ].map(r => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-[#9CA3AF]">{r.l}</span>
                  <span className="font-semibold text-[#111827] truncate max-w-[180px]">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                Close
              </button>
              <Link href="/dashboard/activities"
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white text-center transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                View My Requests
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
                    {lawyer.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Book a Consultation</p>
                    <p className="text-[11px] text-[#9CA3AF]">{lawyer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? "bg-[#E8317A] text-white" : "bg-[#111827] text-white"}`}>
                      {step > 1 ? <Check size={11} /> : "1"}
                    </div>
                    <div className="w-5 h-px bg-[#E5E7EB]" />
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
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
                  {/* Mode selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Consultation Format</label>
                    <div className="flex flex-col gap-2">
                      {CONSULT_MODES.map(m => {
                        const Icon = m.icon;
                        const active = mode === m.id;
                        return (
                          <button key={m.id} onClick={() => setMode(m.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-[1.5px] text-left transition-all ${active ? "border-[#E8317A] bg-pink-50/60" : "border-[#E5E7EB] hover:border-[#9CA3AF]"}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-[#E8317A]/10" : "bg-[#F3F4F6]"}`}>
                              <Icon size={16} className={active ? "text-[#E8317A]" : "text-[#6B7280]"} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[13px] font-semibold ${active ? "text-[#E8317A]" : "text-[#111827]"}`}>{m.label}</p>
                              <p className="text-[11px] text-[#9CA3AF]">{m.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[13px] font-bold text-[#111827]">NGN {m.fee.toLocaleString()}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Legal Topic</label>
                    <input value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. My landlord is trying to evict me without notice"
                      className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                    />
                  </div>

                  <button onClick={() => setStep(2)} disabled={!topic.trim()}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
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
                      className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                    />
                  </div>

                  {(mode === "call" || mode === "video") && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Preferred Time Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map(s => (
                          <button key={s} onClick={() => setSlot(s)}
                            className={`py-2.5 px-3 rounded-xl border-[1.5px] text-[11px] font-medium text-left transition-all ${slot === s ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-[#F9FAFB] rounded-xl p-4 text-xs space-y-2">
                    <p className="font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Booking Summary</p>
                    {[
                      { l: "Format",  v: selectedMode.label },
                      { l: "Topic",   v: topic              },
                      { l: "Total",   v: `NGN ${selectedMode.fee.toLocaleString()}` },
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
                    disabled={submitting || ((mode === "call" || mode === "video") && !slot)}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                    {submitting ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : <><Send size={13} /> Send Request</>}
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

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= n ? "text-amber-400 fill-amber-400" : "text-[#E5E7EB] fill-[#E5E7EB]"} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LawyerProfilePage() {
  const [tab, setTab] = useState<"overview" | "reviews" | "faq">("overview");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const lawyer = LAWYER;

  return (
    <>
      {bookingOpen  && <BookingModal lawyer={lawyer} onClose={() => setBookingOpen(false)} />}
      {shareOpen    && <ShareModal   lawyer={lawyer} onClose={() => setShareOpen(false)}  />}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

        {/* ── Top navigation bar ───────────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/dashboard/marketplace" className="flex items-center gap-1 hover:text-[#111827] transition-colors">
              <ArrowLeft size={13} /> Marketplace
            </Link>
            <ChevronRight size={11} className="text-[#D1D5DB]" />
            <span className="font-semibold text-[#111827] truncate max-w-[160px]">{lawyer.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
              <Share2 size={13} /> Share
            </button>
            <button onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border transition-colors ${bookmarked ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#9CA3AF]"}`}>
              <Bookmark size={15} className={bookmarked ? "fill-[#E8317A]" : ""} />
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 xl:px-8 py-7">

          {/* ── Hero card ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden mb-5">
            {/* Color band */}
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${lawyer.colorA} 0%, ${lawyer.colorB} 60%, ${lawyer.colorA}80 100%)` }} />

            <div className="p-6 xl:p-8">
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Avatar + basic info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
                      {lawyer.initials}
                    </div>
                    {lawyer.available && (
                      <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-[#ECFDF5] border border-[#6EE7B7] rounded-full px-2 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-[9px] font-bold text-[#065F46]">Available</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap mb-1">
                      <h1 className="text-xl font-bold text-[#111827] leading-tight">{lawyer.name}</h1>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-1">{lawyer.title}</p>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-3">
                      <MapPin size={12} className="flex-shrink-0" />
                      {lawyer.location}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {lawyer.badges.map(badge => {
                        const s = BADGE_STYLE[badge];
                        const Icon = s.icon;
                        return (
                          <span key={badge} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                            style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                            <Icon size={9} /> {badge}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-[12px]">
                      <div className="flex items-center gap-1">
                        <StarRating n={Math.round(lawyer.rating)} size={12} />
                        <span className="font-bold text-[#111827] ml-1">{lawyer.rating}</span>
                        <span className="text-[#9CA3AF]">({lawyer.reviewCount} reviews)</span>
                      </div>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="text-[#6B7280]">{lawyer.consultations} sessions</span>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="text-[#6B7280]">Responds {lawyer.responseTime.toLowerCase()}</span>
                    </div>
                  </div>
                </div>

                {/* CTA panel */}
                <div className="lg:w-64 flex flex-col gap-2 flex-shrink-0">
                  <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6] mb-1">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Consultation Fees</p>
                    {CONSULT_MODES.map(m => {
                      const Icon = m.icon;
                      return (
                        <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6] last:border-0">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                            <Icon size={11} className="text-[#9CA3AF]" /> {m.label}
                          </div>
                          <span className="text-[12px] font-bold text-[#111827]">NGN {m.fee.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setBookingOpen(true)} disabled={!lawyer.available}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:translate-y-0"
                    style={{ background: lawyer.available ? "linear-gradient(135deg, #E8317A, #ff6fa8)" : "#9CA3AF" }}>
                    <Calendar size={14} />
                    {lawyer.available ? "Book a Consultation" : "Currently Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs + content ───────────────────────────────────────────── */}
          <div className="grid xl:grid-cols-[1fr_280px] gap-5">

            {/* Main content */}
            <div>
              {/* Tab bar */}
              <div className="flex gap-1 bg-white border border-[#F3F4F6] rounded-xl p-1 mb-5 shadow-sm">
                {([
                  { id: "overview", label: "Overview" },
                  { id: "reviews",  label: `Reviews (${REVIEWS.length})` },
                  { id: "faq",      label: "FAQ" },
                ] as const).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all ${tab === t.id ? "bg-[#111827] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Overview */}
              {tab === "overview" && (
                <div className="flex flex-col gap-5">
                  {/* Bio */}
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <h2 className="text-[14px] font-bold text-[#111827] mb-3">About</h2>
                    <div className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">
                      {lawyer.bio}
                    </div>
                  </div>

                  {/* Specialisms */}
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <h2 className="text-[14px] font-bold text-[#111827] mb-4">Practice Areas</h2>
                    <div className="flex flex-col gap-3">
                      {lawyer.specialisms.map(id => {
                        const cfg = SPECIALISM_CONFIG[id];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return (
                          <div key={id} className="flex items-center gap-3 p-3 rounded-xl border border-[#F3F4F6]"
                            style={{ background: `${cfg.bg}60` }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: cfg.bg }}>
                              <Icon size={15} style={{ color: cfg.color }} />
                            </div>
                            <span className="text-[13px] font-semibold text-[#111827]">{cfg.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <h2 className="text-[14px] font-bold text-[#111827] mb-4">Education & Qualifications</h2>
                    <div className="flex flex-col gap-4">
                      {lawyer.education.map((e, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <BookOpen size={13} className="text-[#6B7280]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111827]">{e.degree}</p>
                            <p className="text-[11px] text-[#6B7280]">{e.institution} · {e.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notable work */}
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <h2 className="text-[14px] font-bold text-[#111827] mb-4">Notable Work</h2>
                    <div className="flex flex-col gap-3">
                      {lawyer.notableWork.map((w, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E8317A] flex-shrink-0 mt-2" />
                          <p className="text-[13px] text-[#374151] leading-relaxed">{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NBA verification */}
                  <div className="bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                      <Shield size={18} className="text-[#10B981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#111827]">NBA Verified</p>
                      <p className="text-[11px] text-[#9CA3AF] font-mono">{lawyer.nbaNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#6EE7B7] px-2 py-0.5 rounded-full">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {tab === "reviews" && (
                <div className="flex flex-col gap-4">
                  {/* Rating summary */}
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-[#111827]">{lawyer.rating}</p>
                        <StarRating n={5} size={14} />
                        <p className="text-[11px] text-[#9CA3AF] mt-1">{lawyer.reviewCount} reviews</p>
                      </div>
                      <div className="flex-1">
                        {[5,4,3,2,1].map(n => {
                          const pct = n === 5 ? 72 : n === 4 ? 18 : n === 3 ? 7 : n === 2 ? 2 : 1;
                          return (
                            <div key={n} className="flex items-center gap-2 mb-1.5">
                              <span className="text-[11px] text-[#9CA3AF] w-2">{n}</span>
                              <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                              <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-[#9CA3AF] w-7">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {REVIEWS.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}80)` }}>
                          {r.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-[13px] font-semibold text-[#111827]">{r.name}</p>
                              <p className="text-[10px] text-[#9CA3AF]">{r.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">{r.specialism}</span>
                              <StarRating n={r.rating} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#374151] leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ */}
              {tab === "faq" && (
                <div className="flex flex-col gap-3">
                  {[
                    { q: "How does a written consultation work?", a: "You send your question and any relevant details. I typically respond with a comprehensive written analysis within my stated response time. You can follow up with clarifying questions at no extra charge within 48 hours of my initial reply." },
                    { q: "What if I need a lawyer to appear in court for me?", a: "Written consultations and calls on this platform are advisory services. For court representation, contact me directly after our consultation to discuss fees and availability for in-person legal representation." },
                    { q: "Are consultations confidential?", a: "Yes. All consultations are covered by legal professional privilege and attorney-client confidentiality under Nigerian law. Your information will never be shared with any third party." },
                    { q: "What happens if I'm unhappy with the consultation?", a: "LawTicha has a dispute resolution process. If you feel the advice was inadequate, you can raise a dispute within 7 days and the platform will review the consultation and determine if a refund is appropriate." },
                    { q: "Can you advise on cases outside Lagos?", a: "Yes. While I am based in Lagos and primarily appear in Lagos courts, I advise clients across Nigeria on federal law matters, and on state-specific issues in states I'm familiar with." },
                  ].map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden">
                      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[13px] font-semibold text-[#111827] hover:text-[#E8317A] transition-colors">
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

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
                <h3 className="text-[12px] font-bold text-[#111827] mb-4">Quick Facts</h3>
                <div className="flex flex-col gap-3 text-[12px]">
                  {[
                    { label: "Response time", value: lawyer.responseTime, icon: Clock    },
                    { label: "Sessions done", value: `${lawyer.consultations}+`,icon: Users },
                    { label: "Year called",   value: lawyer.calledAt,    icon: Award    },
                    { label: "Languages",     value: lawyer.languages.join(", "), icon: Globe },
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

              {/* Book again CTA (compact) */}
              <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 border border-white/6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#E8317A]/10 blur-2xl" />
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1">Ready to start?</p>
                <p className="text-[14px] font-bold text-white mb-3 leading-snug">Get expert legal advice in your next session</p>
                <button onClick={() => setBookingOpen(true)}
                  className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                  Book Consultation
                </button>
              </div>

              {/* Share card */}
              <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#111827] mb-3">Know someone who needs this?</p>
                <p className="text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">Share this profile with someone who could benefit from legal advice.</p>
                <button onClick={() => setShareOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] flex items-center justify-center gap-1.5 transition-all">
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