"use client";
import React, { useState } from "react";
import {
  MapPin, Clock, Shield, 
  CheckCircle, MessageSquare, 
  ChevronRight, X, Send,
  ChevronLeft, Loader2,
  Check, ClipboardList, Info,
} from "lucide-react";
import { ConsultMode, Lawyer } from "./types";
import { useRouter } from "next/navigation";
import { BADGE_ICON, BADGE_STYLE, CONSULT_MODES, SPECIALISMS } from "./data";

export function VerificationSteps() {
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

export function LawyerCard({
  lawyer,
  onConsult,
  onProfile,
}: {
  lawyer: Lawyer;
  onConsult: (l: Lawyer) => void;
  onProfile: (l: Lawyer) => void;
}) {
  const router = useRouter();
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
            onClick={() => router.push(`/dashboard/marketplace/${lawyer.nbaNumber.replaceAll("/", "-")}`)}
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

//  Consult Modal 
export function ConsultModal({ lawyer, onClose }: { lawyer: Lawyer; onClose: () => void }) {
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

//  Request a Lawyer Modal 
export function RequestLawyerModal({ onClose }: { onClose: () => void }) {
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
