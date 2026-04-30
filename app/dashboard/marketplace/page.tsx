"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Filter, MapPin, Star, Clock, Shield, Zap,
  CheckCircle, MessageSquare, Video, Phone, Calendar,
  ChevronRight, ChevronDown, X, ArrowRight, Send,
  BadgeCheck, Award, TrendingUp, Users, Lock,
  FileText, AlertCircle, ChevronLeft, Loader2,
  SlidersHorizontal, BookOpen, Briefcase, Building2,
  Scale, Home, Heart, Car, Globe, Check, Plus,
  Bell, UserPlus, ClipboardList, Sparkles, Info,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type ConsultMode = "message" | "call" | "video";
type ModalType = "consult" | "request" | "profile" | null;

interface Lawyer {
  id: string;
  name: string;
  initials: string;
  colorA: string;
  colorB: string;
  title: string;
  specialisms: string[];
  location: string;
  state: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  consultations: number;
  fee: { message: number; call: number; video: number };
  badges: string[];
  available: boolean;
  bio: string;
  yearsCall: number;
  languages: string[];
  nbaNumber: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const SPECIALISMS = [
  { id: "all",        label: "All Areas",        icon: Scale },
  { id: "criminal",   label: "Criminal Law",      icon: Shield },
  { id: "property",   label: "Property & Tenancy",icon: Home },
  { id: "employment", label: "Employment",         icon: Briefcase },
  { id: "business",   label: "Business & CAC",     icon: Building2 },
  { id: "family",     label: "Family Law",         icon: Heart },
  { id: "consumer",   label: "Consumer Rights",    icon: Globe },
  { id: "road",       label: "Road Traffic",       icon: Car },
];

const LAWYERS: Lawyer[] = [
  {
    id: "l1",
    name: "Adaeze Okonkwo",
    initials: "AO",
    colorA: "#1E3A5F",
    colorB: "#2D5A8E",
    title: "Criminal & Civil Rights Lawyer",
    specialisms: ["criminal", "employment"],
    location: "Victoria Island",
    state: "Lagos",
    rating: 4.9,
    reviewCount: 84,
    responseTime: "Under 1 hour",
    consultations: 312,
    fee: { message: 5000, call: 12000, video: 18000 },
    badges: ["Verified Lawyer", "Top Rated", "Responsive"],
    available: true,
    bio: "Called to the Nigerian Bar in 2014 with a focus on criminal defence, police accountability, and fundamental rights enforcement. Regularly appears before the Federal High Court and Court of Appeal.",
    yearsCall: 10,
    languages: ["English", "Igbo"],
    nbaNumber: "NBA/LAG/2014/01847",
  },
  {
    id: "l2",
    name: "Emeka Nwosu",
    initials: "EN",
    colorA: "#1A3B2E",
    colorB: "#2D6A4F",
    title: "Property & Tenancy Lawyer",
    specialisms: ["property", "business"],
    location: "Wuse II",
    state: "Abuja",
    rating: 4.8,
    reviewCount: 112,
    responseTime: "Under 2 hours",
    consultations: 487,
    fee: { message: 4500, call: 10000, video: 15000 },
    badges: ["Verified Lawyer", "Top Rated"],
    available: true,
    bio: "Senior associate with 12 years in property transactions, landlord-tenant disputes, and commercial leases across Abuja and Lagos. Former in-house counsel at a major property development firm.",
    yearsCall: 12,
    languages: ["English", "Igbo", "Yoruba"],
    nbaNumber: "NBA/ABJ/2012/00934",
  },
  {
    id: "l3",
    name: "Fatimah Bello",
    initials: "FB",
    colorA: "#2D1A3B",
    colorB: "#4A2D6A",
    title: "Family & Domestic Rights Lawyer",
    specialisms: ["family", "criminal"],
    location: "GRA",
    state: "Kano",
    rating: 4.7,
    reviewCount: 56,
    responseTime: "Under 3 hours",
    consultations: 198,
    fee: { message: 4000, call: 9000, video: 14000 },
    badges: ["Verified Lawyer", "Responsive"],
    available: false,
    bio: "Specialist in domestic violence protection orders, child custody, matrimonial causes, and gender-based violence law. Founding member of the Kano Women's Legal Access Initiative.",
    yearsCall: 8,
    languages: ["English", "Hausa", "Fulfulde"],
    nbaNumber: "NBA/KAN/2016/02211",
  },
  {
    id: "l4",
    name: "Chidi Okafor",
    initials: "CO",
    colorA: "#1A2D3B",
    colorB: "#0E4D6A",
    title: "Business & Commercial Lawyer",
    specialisms: ["business", "consumer"],
    location: "Ikeja",
    state: "Lagos",
    rating: 4.6,
    reviewCount: 73,
    responseTime: "Under 2 hours",
    consultations: 254,
    fee: { message: 6000, call: 15000, video: 22000 },
    badges: ["Verified Lawyer", "Top Rated"],
    available: true,
    bio: "Corporate and commercial lawyer advising SMEs on business registration, contracts, IP, and consumer protection. Previously worked at a top-tier Lagos commercial law firm for 7 years.",
    yearsCall: 9,
    languages: ["English", "Igbo"],
    nbaNumber: "NBA/LAG/2015/03102",
  },
  {
    id: "l5",
    name: "Ngozi Eze",
    initials: "NE",
    colorA: "#2D1A1A",
    colorB: "#7B2828",
    title: "Employment & Labour Lawyer",
    specialisms: ["employment", "consumer"],
    location: "Trans-Amadi",
    state: "Rivers",
    rating: 4.8,
    reviewCount: 49,
    responseTime: "Under 1 hour",
    consultations: 163,
    fee: { message: 4500, call: 11000, video: 16000 },
    badges: ["Verified Lawyer", "Responsive"],
    available: true,
    bio: "Focuses exclusively on employment law: wrongful termination claims, NSITF disputes, workplace harassment, and industrial arbitration. Represents workers at the National Industrial Court.",
    yearsCall: 7,
    languages: ["English", "Igbo"],
    nbaNumber: "NBA/PHC/2017/01563",
  },
  {
    id: "l6",
    name: "Abubakar Sadiq",
    initials: "AS",
    colorA: "#2A2D1A",
    colorB: "#5A6A2D",
    title: "Property & Road Traffic Lawyer",
    specialisms: ["property", "road"],
    location: "Barnawa",
    state: "Kaduna",
    rating: 4.5,
    reviewCount: 38,
    responseTime: "Under 4 hours",
    consultations: 121,
    fee: { message: 3500, call: 8000, video: 12000 },
    badges: ["Verified Lawyer"],
    available: true,
    bio: "General practice with particular depth in Northern Nigerian property law, title registration, and road traffic accident claims. Experienced in multi-party negotiations and out-of-court settlement.",
    yearsCall: 6,
    languages: ["English", "Hausa"],
    nbaNumber: "NBA/KAD/2018/00789",
  },
];

const BADGE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "Verified Lawyer": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Top Rated":       { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7" },
  "Responsive":      { bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD" },
};

const BADGE_ICON: Record<string, React.ElementType> = {
  "Verified Lawyer": BadgeCheck,
  "Top Rated":       Award,
  "Responsive":      Zap,
};

const CONSULT_MODES: { id: ConsultMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "message", label: "Written Message",  icon: MessageSquare, desc: "Async — reply within response time" },
  { id: "call",    label: "Scheduled Call",   icon: Phone,         desc: "Audio call, you pick the time slot" },
  { id: "video",   label: "Video Session",    icon: Video,         desc: "Face-to-face via secure video link" },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function VerificationSteps() {
  const steps = [
    { n: "01", title: "NBA Check",         desc: "Bar membership confirmed" },
    { n: "02", title: "Document Review",   desc: "Credentials validated" },
    { n: "03", title: "Platform Training", desc: "Standards orientation" },
    { n: "04", title: "Assessment",        desc: "Competency verified" },
    { n: "05", title: "Badge Issued",      desc: "Profile goes live" },
  ];
  return (
    <div className="bg-[#0B1120] rounded-2xl p-5 border border-white/6">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={14} className="text-[#E8317A]" />
        <span className="text-xs font-bold text-white uppercase tracking-widest">Verification Process</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && (
              <div className="absolute top-4 left-[calc(50%+14px)] right-0 h-px bg-white/10" />
            )}
            <div className="w-8 h-8 rounded-full bg-[#E8317A]/15 border border-[#E8317A]/30 flex items-center justify-center mb-2 relative z-10">
              <span className="text-[10px] font-bold text-[#E8317A]">{s.n}</span>
            </div>
            <p className="text-[10px] font-semibold text-white leading-tight">{s.title}</p>
            <p className="text-[9px] text-gray-500 leading-tight mt-0.5 hidden sm:block">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LawyerCard({
  lawyer,
  onConsult,
  onProfile,
}: {
  lawyer: Lawyer;
  onConsult: (l: Lawyer) => void;
  onProfile: (l: Lawyer) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${lawyer.colorA}, ${lawyer.colorB})` }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}
            >
              {lawyer.initials}
            </div>
            {lawyer.available && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" title="Available now" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-[15px] leading-tight truncate group-hover:text-[#E8317A] transition-colors">
              {lawyer.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{lawyer.title}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
              <MapPin size={10} className="flex-shrink-0" />
              {lawyer.location}, {lawyer.state}
            </div>
          </div>

          {/* Rating pill */}
          {/* <div className="flex-shrink-0 flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
            <Star size={11} className="text-amber-500 fill-amber-400" />
            <span className="text-xs font-bold text-amber-700">{lawyer.rating}</span>
          </div> */}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lawyer.badges.map((badge) => {
            const s = BADGE_STYLE[badge];
            const Icon = BADGE_ICON[badge];
            return (
              <span
                key={badge}
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{ background: s.bg, color: s.text, borderColor: s.border }}
              >
                <Icon size={9} />
                {badge}
              </span>
            );
          })}
          {!lawyer.available && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-400 border-gray-200">
              <Clock size={9} /> Unavailable
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl mb-4 text-center">
          <div>
            <p className="text-sm font-bold text-gray-900">{lawyer.reviewCount}</p>
            <p className="text-[10px] text-gray-400">Reviews</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{lawyer.responseTime.replace("Under ", "<")}</p>
            <p className="text-[10px] text-gray-400">Response</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{lawyer.consultations}</p>
            <p className="text-[10px] text-gray-400">Sessions</p>
          </div>
        </div>

        {/* Fee preview */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <MessageSquare size={11} className="text-gray-400 flex-shrink-0" />
          <span>From <strong className="text-gray-900">NGN {lawyer.fee.message.toLocaleString()}</strong> / written consultation</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onProfile(lawyer)}
            className="flex-1 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            View Profile
          </button>
          <button
            onClick={() => onConsult(lawyer)}
            disabled={!lawyer.available}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{
              background: lawyer.available
                ? `linear-gradient(135deg, #E8317A, #ff6fa8)`
                : "#9CA3AF",
            }}
          >
            {lawyer.available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Consult Modal ──────────────────────────────────────────────────────────
function ConsultModal({ lawyer, onClose }: { lawyer: Lawyer; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<ConsultMode>("message");
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fee = lawyer.fee[mode];

  const slots = ["Today, 2:00 PM", "Today, 5:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 3:00 PM", "Thu, 11:00 AM"];

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    setStep(3);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #E8317A, #ff6fa8)" }} />

        <div className="p-6">
          {/* Close */}
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10">
            <X size={14} />
          </button>

          {step === 3 ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Request Sent</h3>
              <p className="text-sm text-gray-500 mb-2">Your consultation request has been sent to {lawyer.name}.</p>
              <p className="text-xs text-gray-400 mb-6">Expected response: <strong className="text-gray-700">{lawyer.responseTime.toLowerCase()}</strong></p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500">Lawyer</span>
                  <span className="font-semibold text-gray-900">{lawyer.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500">Format</span>
                  <span className="font-semibold text-gray-900">{CONSULT_MODES.find(m => m.id === mode)?.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500">Topic</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[180px]">{topic}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-bold text-[#E8317A]">NGN {fee.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors">
                Go to Messages
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
                  {lawyer.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Book a Consultation</h3>
                  <p className="text-xs text-gray-500">{lawyer.name} - {lawyer.title}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step === 1 ? "bg-[#E8317A] text-white" : "bg-gray-100 text-gray-400"}`}>1</span>
                  <div className="w-4 h-px bg-gray-200" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step === 2 ? "bg-[#E8317A] text-white" : "bg-gray-100 text-gray-400"}`}>2</span>
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Consultation Format</label>
                    <div className="flex flex-col gap-2">
                      {CONSULT_MODES.map((m) => {
                        const Icon = m.icon;
                        return (
                          <button key={m.id} onClick={() => setMode(m.id)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] text-left transition-all ${mode === m.id ? "border-[#E8317A] bg-pink-50/60" : "border-gray-200 hover:border-gray-300"}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${mode === m.id ? "bg-[#E8317A]/10" : "bg-gray-100"}`}>
                              <Icon size={16} className={mode === m.id ? "text-[#E8317A]" : "text-gray-500"} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${mode === m.id ? "text-[#E8317A]" : "text-gray-900"}`}>{m.label}</p>
                              <p className="text-[11px] text-gray-500">{m.desc}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm font-bold text-gray-900">NGN {lawyer.fee[m.id].toLocaleString()}</p>
                              <p className="text-[10px] text-gray-400">per session</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Legal Topic</label>
                    <input value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. My landlord is trying to evict me without notice"
                      className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!topic.trim()}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    Continue
                    <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors mb-2">
                    <ChevronLeft size={12} /> Back
                  </button>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Describe your situation <span className="font-normal text-gray-400">(optional but helpful)</span></label>
                    <textarea value={detail} onChange={e => setDetail(e.target.value)}
                      placeholder="Provide any relevant details that will help the lawyer prepare..."
                      className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 resize-none outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                    />
                  </div>

                  {(mode === "call" || mode === "video") && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Preferred Time Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map(s => (
                          <button key={s} onClick={() => setSlot(s)}
                            className={`py-2.5 px-3 rounded-xl border-[1.5px] text-xs font-medium transition-all text-left ${slot === s ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Summary</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Lawyer</span><span className="font-semibold text-gray-900">{lawyer.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Format</span><span className="font-semibold">{CONSULT_MODES.find(m => m.id === mode)?.label}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Topic</span><span className="font-semibold truncate max-w-[180px]">{topic}</span></div>
                      <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
                        <span className="text-gray-500 font-semibold">Total</span>
                        <span className="font-bold text-[#E8317A] text-sm">NGN {fee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Payment is processed securely via Paystack after the lawyer accepts your request. No charge until then.
                    </p>
                  </div>

                  <button
                    onClick={submit}
                    disabled={submitting || ((mode === "call" || mode === "video") && !slot)}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <>Send Request <Send size={13} /></>}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Request a Lawyer Modal ─────────────────────────────────────────────────
function RequestLawyerModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [specialism, setSpecialism] = useState("");
  const [urgency, setUrgency] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const urgencies = ["Today (urgent)", "This week", "Within 2 weeks", "No rush"];
  const budgets = ["Under NGN 5,000", "NGN 5,000 - 15,000", "NGN 15,000 - 30,000", "Above NGN 30,000"];

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setStep(3);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0B1120, #E8317A)" }} />
        <div className="p-6">
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10">
            <X size={14} />
          </button>

          {step === 3 ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={26} className="text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Request Submitted</h3>
              <p className="text-sm text-gray-500 mb-1">We will match you with a verified lawyer within 2 hours.</p>
              <p className="text-xs text-gray-400 mb-6">You will receive a notification when a lawyer accepts your request.</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-5 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Specialism</span><span className="font-semibold text-gray-900">{specialism}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Urgency</span><span className="font-semibold text-gray-900">{urgency}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-semibold text-gray-900">{location || "Any"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-semibold text-gray-900">{budget}</span></div>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900">Request a Lawyer</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Tell us what you need and we will match you</p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2].map(n => (
                    <React.Fragment key={n}>
                      <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${step === n ? "bg-[#E8317A] text-white" : step > n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>
                        {step > n ? <Check size={11} /> : n}
                      </span>
                      {n < 2 && <div className="w-4 h-px bg-gray-200" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Area of Law Needed</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SPECIALISMS.filter(s => s.id !== "all").map(s => {
                        const Icon = s.icon;
                        return (
                          <button key={s.id} onClick={() => setSpecialism(s.label)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-[1.5px] text-left text-xs font-medium transition-all ${specialism === s.label ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                            <Icon size={14} className={specialism === s.label ? "text-[#E8317A]" : "text-gray-400"} />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">How Urgent Is This?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {urgencies.map(u => (
                        <button key={u} onClick={() => setUrgency(u)}
                          className={`py-2.5 px-3 rounded-xl border-[1.5px] text-xs font-medium transition-all ${urgency === u ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!specialism || !urgency}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    Continue
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={12} /> Back
                  </button>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred State / Location <span className="font-normal text-gray-400">(optional)</span></label>
                    <input value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Lagos, Abuja, Port Harcourt"
                      className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Budget Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgets.map(b => (
                        <button key={b} onClick={() => setBudget(b)}
                          className={`py-2.5 px-3 rounded-xl border-[1.5px] text-xs font-medium transition-all ${budget === b ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Brief Description of Your Issue</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Describe your legal situation briefly so we can find the right match..."
                      className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                    />
                  </div>

                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <Shield size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Your request is visible only to verified lawyers matching your criteria. Your personal details are never shared without your consent.
                    </p>
                  </div>

                  <button
                    onClick={submit}
                    disabled={submitting || !budget || !description.trim()}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0"
                    style={{ background: "linear-gradient(90deg, #0B1120, #1E3A5F)" }}
                  >
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Matching...</> : <><ClipboardList size={14} /> Submit Request</>}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Profile Modal ──────────────────────────────────────────────────────────
function ProfileModal({ lawyer, onConsult, onClose }: { lawyer: Lawyer; onConsult: () => void; onClose: () => void }) {
  const [tab, setTab] = useState<"about" | "reviews">("about");

  const reviews = [
    { initials: "CI", color: "#3B82F6", name: "Chioma I.", rating: 5, text: "Extremely clear and direct. Gave me exactly the advice I needed for my police detention situation.", date: "2 weeks ago" },
    { initials: "BL", color: "#10B981", name: "Babatunde L.", rating: 5, text: "Professional, thorough and responded faster than expected. Will use again.", date: "1 month ago" },
    { initials: "AG", color: "#8B5CF6", name: "Aminu G.", rating: 4, text: "Very knowledgeable. Explained the ACJA provisions in a way I could actually understand.", date: "6 weeks ago" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top color bar */}
        <div className="h-1.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${lawyer.colorA}, ${lawyer.colorB})` }} />

        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10">
              <X size={14} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}>
                  {lawyer.initials}
                </div>
                {lawyer.available && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900">{lawyer.name}</h2>
                  <span className="flex items-center gap-1 text-[11px] bg-amber-50 border border-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    <Star size={10} className="fill-amber-400" /> {lawyer.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{lawyer.title}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <MapPin size={11} /> {lawyer.location}, {lawyer.state}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {lawyer.badges.map(badge => {
                const s = BADGE_STYLE[badge];
                const Icon = BADGE_ICON[badge];
                return (
                  <span key={badge} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                    style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                    <Icon size={10} /> {badge}
                  </span>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { v: lawyer.rating.toString(), l: "Rating" },
                { v: lawyer.reviewCount.toString(), l: "Reviews" },
                { v: `${lawyer.yearsCall}yr`, l: "Called" },
                { v: lawyer.consultations.toString(), l: "Sessions" },
              ].map(s => (
                <div key={s.l} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-gray-900">{s.v}</p>
                  <p className="text-[10px] text-gray-400">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
              {(["about", "reviews"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "reviews" ? `Reviews (${lawyer.reviewCount})` : "About"}
                </button>
              ))}
            </div>

            {tab === "about" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">{lawyer.bio}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Specialisms</p>
                    <div className="flex flex-wrap gap-1">
                      {lawyer.specialisms.map(id => {
                        const sp = SPECIALISMS.find(s => s.id === id);
                        return sp ? <span key={id} className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-medium">{sp.label}</span> : null;
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {lawyer.languages.map(l => (
                        <span key={l} className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-medium">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">NBA Registration</p>
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={14} className="text-[#E8317A]" />
                    <span className="text-xs font-mono text-gray-700">{lawyer.nbaNumber}</span>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold ml-auto">Verified</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Consultation Fees</p>
                  <div className="grid grid-cols-3 gap-2">
                    {CONSULT_MODES.map(m => {
                      const Icon = m.icon;
                      return (
                        <div key={m.id} className="bg-gray-50 rounded-xl p-3 text-center">
                          <Icon size={14} className="text-gray-400 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-500 mb-1">{m.label.split(" ")[0]}</p>
                          <p className="text-xs font-bold text-gray-900">NGN {lawyer.fee[m.id].toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}80)` }}>
                          {r.initials}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{r.name}</p>
                          <p className="text-[10px] text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0 bg-white">
          <button
            onClick={() => { onClose(); onConsult(); }}
            disabled={!lawyer.available}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 flex items-center justify-center gap-2"
            style={{ background: lawyer.available ? "linear-gradient(135deg, #E8317A, #ff6fa8)" : "#9CA3AF" }}
          >
            {lawyer.available ? <><Calendar size={14} /> Book a Consultation</> : "Lawyer Currently Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Marketplace Page ──────────────────────────────────────────────────
export default function MarketplacePage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [activeLawyer, setActiveLawyer] = useState<Lawyer | null>(null);
  const [filterSpecialism, setFilterSpecialism] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const openConsult = useCallback((l: Lawyer) => { setActiveLawyer(l); setModal("consult"); }, []);
  const openProfile = useCallback((l: Lawyer) => { setActiveLawyer(l); setModal("profile"); }, []);
  const closeModal = useCallback(() => { setModal(null); setActiveLawyer(null); }, []);

  const states = ["all", "Lagos", "Abuja", "Rivers", "Kano", "Kaduna"];

  const filtered = LAWYERS
    .filter(l => {
      if (filterSpecialism !== "all" && !l.specialisms.includes(filterSpecialism)) return false;
      if (filterState !== "all" && l.state !== filterState) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.state.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "response") return a.responseTime.localeCompare(b.responseTime);
      if (sortBy === "fee") return a.fee.message - b.fee.message;
      return 0;
    });

  return (
    <>
      {/* ── Modals ── */}
      {modal === "consult" && activeLawyer && <ConsultModal lawyer={activeLawyer} onClose={closeModal} />}
      {modal === "request" && <RequestLawyerModal onClose={closeModal} />}
      {modal === "profile" && activeLawyer && (
        <ProfileModal lawyer={activeLawyer} onConsult={() => openConsult(activeLawyer)} onClose={closeModal} />
      )}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-semibold text-gray-800">Lawyer Marketplace</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm">
              <Bell size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 xl:px-8 py-7">

          {/* ── Hero band ── */}
          <div className="rounded-2xl overflow-hidden mb-7 relative"
            style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E3A5F 60%, #0B1120 100%)" }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#E8317A]/8 blur-[80px] pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 p-6 xl:p-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck size={14} className="text-[#E8317A]" />
                  <span className="text-xs font-bold text-[#E8317A] uppercase tracking-widest">Verified Lawyers Only</span>
                </div>
                <h1 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2">
                  Find the Right Lawyer for Your Situation
                </h1>
                <p className="text-sm text-gray-400 max-w-lg leading-relaxed mb-5">
                  Every lawyer on this platform has been verified against Nigerian Bar Association records. Browse, compare, and book a consultation in minutes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setModal("request")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    <UserPlus size={14} />
                    Request a Lawyer
                  </button>
                  <button
                    onClick={() => setModal("request")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/8 hover:border-white/40 transition-all"
                  >
                    <ClipboardList size={14} />
                    Post a Legal Request
                  </button>
                </div>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[160px]">
                {[
                  { icon: Users,      v: "6",    l: "Verified lawyers" },
                  { icon: Star,       v: "4.7",  l: "Average rating" },
                  { icon: CheckCircle,v: "1.5k+",l: "Consultations done" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.l} className="bg-white/6 border border-white/8 rounded-xl p-3 flex items-center gap-2.5">
                      <Icon size={14} className="text-[#E8317A] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{s.v}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{s.l}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Verification steps ── */}
          <VerificationSteps />

          <div className="mt-7 grid xl:grid-cols-[260px_1fr] gap-6">

            {/* ── LEFT: Filters ── */}
            <div className="hidden xl:flex flex-col gap-5">

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or area..."
                  className="w-full h-11 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                />
              </div>

              {/* Specialism filter */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Area of Law</p>
                <div className="flex flex-col gap-0.5">
                  {SPECIALISMS.map(s => {
                    const Icon = s.icon;
                    const active = filterSpecialism === s.id;
                    const count = s.id === "all" ? LAWYERS.length : LAWYERS.filter(l => l.specialisms.includes(s.id)).length;
                    return (
                      <button key={s.id} onClick={() => setFilterSpecialism(s.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${active ? "bg-pink-50 text-[#E8317A] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                        <Icon size={14} className={active ? "text-[#E8317A]" : "text-gray-400"} />
                        <span className="flex-1">{s.label}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${active ? "bg-pink-100 text-[#E8317A]" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State filter */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">State</p>
                <div className="flex flex-col gap-0.5">
                  {states.map(s => {
                    const active = filterState === s;
                    const count = s === "all" ? LAWYERS.length : LAWYERS.filter(l => l.state === s).length;
                    return (
                      <button key={s} onClick={() => setFilterState(s)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${active ? "bg-pink-50 text-[#E8317A] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                        <span>{s === "all" ? "All States" : s}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${active ? "bg-pink-100 text-[#E8317A]" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Request box */}
              <div className="bg-[#0B1120] rounded-2xl p-5 border border-white/6">
                <div className="w-9 h-9 rounded-xl bg-[#E8317A]/15 border border-[#E8317A]/20 flex items-center justify-center mb-3">
                  <Sparkles size={15} className="text-[#E8317A]" />
                </div>
                <p className="text-sm font-bold text-white mb-1">Not sure who to pick?</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Describe your situation and we will match you with the best-suited verified lawyer.
                </p>
                <button
                  onClick={() => setModal("request")}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                >
                  <UserPlus size={12} /> Request a Match
                </button>
              </div>
            </div>

            {/* ── RIGHT: Lawyer grid ── */}
            <div>
              {/* Sort + mobile filter bar */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 relative xl:hidden">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search lawyers..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                  />
                </div>

                <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{filtered.length}</span> lawyers found
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <SlidersHorizontal size={12} /> Filter
                  </button>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-[#E8317A] transition-colors font-medium"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="response">Fastest Response</option>
                    <option value="fee">Lowest Fee</option>
                  </select>
                </div>
              </div>

              {/* Mobile filter pills */}
              {filtersOpen && (
                <div className="xl:hidden bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
                  <div className="flex flex-wrap gap-2">
                    {SPECIALISMS.map(s => (
                      <button key={s.id} onClick={() => setFilterSpecialism(s.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterSpecialism === s.id ? "bg-[#E8317A] text-white border-[#E8317A]" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lawyer cards */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Scale size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No lawyers found for this filter</p>
                  <button onClick={() => { setFilterSpecialism("all"); setFilterState("all"); setSearchQuery(""); }}
                    className="mt-3 text-xs text-[#E8317A] font-semibold hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(l => (
                    <LawyerCard key={l.id} lawyer={l} onConsult={openConsult} onProfile={openProfile} />
                  ))}

                  {/* Request card */}
                  <div
                    className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#E8317A]/40 hover:bg-pink-50/30 transition-all group"
                    onClick={() => setModal("request")}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                      <Plus size={18} className="text-gray-400 group-hover:text-[#E8317A] transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-gray-500 group-hover:text-gray-800 transition-colors">Request a Lawyer</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Describe your need and get matched with the right lawyer</p>
                  </div>
                </div>
              )}

              {/* Trust footer */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
                {[
                  { icon: Lock,         t: "Secure payments via Paystack" },
                  { icon: Shield,       t: "NBA-verified credentials" },
                  { icon: FileText,     t: "Transparent pricing before booking" },
                  { icon: AlertCircle,  t: "Refund policy for unsatisfactory sessions" },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Icon size={12} className="text-gray-300" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}