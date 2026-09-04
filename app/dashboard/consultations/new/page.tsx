"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight, ChevronLeft, Sparkles, UserSearch, Shield,
  MessageSquare, Phone, Video, Check, X, Upload, FileText,
  Clock, AlertCircle, Info, Loader2, CheckCircle, ArrowRight, Search,
  MapPin, BadgeCheck, Lock, ClipboardList, Zap,
} from "lucide-react";

import { LawyerFull } from "@/redux/types/lawyer";
import { ConsultMode } from "@/redux/types/consultation";
import {
  NIGERIAN_STATES,
  LANGUAGES,
  useGetMarketplaceLawyersQuery,
  useBookConsultationMutation,
  useRequestLawyerMatchMutation,
} from "@/redux/slices/lawyers.slice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { CONSULT_MODES } from "@/app/components/config";
import { ConfidentialityConsent } from "../components";


const MAX_FILE_MB = 10;
const MAX_FILES = 6;

type Path = "firm" | "direct" | null;
type LocalDoc = { file: File; id: string };

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Small shared bits                                                      */
/* ─────────────────────────────────────────────────────────────────────── */

function StepRail({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="flex items-center mb-7">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < active;
        const current = n === active;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${done
                  ? "bg-[#111827] text-white"
                  : current
                    ? "text-white"
                    : "bg-white text-gray-300 border-[1.5px] border-gray-200"
                  }`}
                style={current ? { background: "linear-gradient(135deg, #9B2E3D, #82212D)" } : undefined}
              >
                {done ? <Check size={12} /> : n}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block ${current ? "text-[#111827]" : "text-gray-400"
                  }`}
              >
                {label}
              </span>
            </div>
            {n < steps.length && (
              <div className={`h-px! flex-1 mx-2 ${done ? "bg-[#111827]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-700 mb-2">{children}</label>;
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-xs border-b border-gray-100 last:border-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}

export default function NewConsultationPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const selectedLawyerId = searchParams.get('selected');

  console.log("Selected Lawyer ID:", searchParams); // Debugging line

  const [path, setPath] = useState<Path>(selectedLawyerId ? "direct" : null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    setPath(selectedLawyerId ? "direct" : null);
  }, [selectedLawyerId, searchParams]);

  const handleConsentAccept = () => {
    setConsentAccepted(true);
  };

  const handleConsentDecline = () => {
    router.back();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">
      {/* Confidentiality Consent - Shows on mount */}
      <ConfidentialityConsent
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <Link href="/dashboard/consultations" className="hover:text-gray-800 transition-colors">My Cases</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-semibold text-gray-800">New Case</span>
        </div>
        {path && (
          <button
            onClick={() => setPath(null)}
            className="text-[11px] font-semibold text-gray-500 hover:text-[#111827] transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Change approach
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-5 xl:px-8 py-8">
        {!path ? (
          <PathPicker onPick={setPath} />
        ) : path === "firm" ? (
          <FirmAssistedFlow onDone={() => router.push("/dashboard/consultations")} />
        ) : (
          <DirectBookingFlow onDone={() => router.push("/dashboard/consultations")} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Step 0 — choose how to get help                                        */
/* ─────────────────────────────────────────────────────────────────────── */

function PathPicker({ onPick }: { onPick: (p: Path) => void }) {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-[#111827]">Find a Lawyer?</h1>
        <p className="text-[13px] text-[#6B7280] mt-1 max-w-lg">
          Pick whichever feels right. Either way, only verified lawyers ever handle your case.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Firm-assisted */}
        <button
          onClick={() => onPick("firm")}
          className="group text-left bg-white rounded-2xl border-[1.5px] border-[#F3F4F6] hover:border-maroon-500 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden"
        >
          <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0F5] text-maroon-500 border border-[#FBCFE8]">
            Recommended
          </span>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1">Help me choose</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Tell us what's going on. Our team reviews your case first, then recommends a short list of
            lawyers who genuinely fit, you pick who you want to work with.
          </p>
          <ul className="space-y-2 mb-1">
            {[
              "A real person reviews your case, not just an algorithm",
              "Your documents and notes go to your lawyer, prepared and ready",
              "You still choose from the recommended lawyers",
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-[11px] text-gray-600">
                <CheckCircle size={12} className="text-[#10B981] shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-maroon-500">
            Start here <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Direct */}
        <button
          onClick={() => onPick("direct")}
          className="group text-left bg-white rounded-2xl border-[1.5px] border-[#F3F4F6] hover:border-gray-300 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
            <UserSearch size={18} className="text-white" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1">Choose Myself</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Prefer to pick directly? Browse profiles and book instantly with any of our subscribed,
            verified lawyers. no waiting on a referral.
          </p>
          <ul className="space-y-2 mb-1">
            {[
              "See full profiles, ratings and response times upfront",
              "Only subscribed, SCN-verified lawyers are listed",
              "Book and message directly, on your terms",
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-[11px] text-gray-600">
                <CheckCircle size={12} className="text-[#10B981] shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-800">
            Browse lawyers <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Trust footer */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-white border border-[#F3F4F6] rounded-2xl">
        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <Shield size={13} className="text-[#3B82F6]" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#111827]">How matching stays fair</p>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-0.5">
            Recommendations are based on specialism fit, response speed and track record, never on who
            pays the most. Every lawyer on LawTicha, matched or self-selected, is SCN-verified.
          </p>
        </div>
      </div>
    </div>
  );
}

//  Path A — Firm-assisted intake  

function FirmAssistedFlow({ onDone }: { onDone: () => void }) {
  const router = useRouter()

  const [step, setStep] = useState(1);
  const steps = ["Legal Issue", "Case Details", "Documents", "Review"];

  const { data: loadSpecialism } = useListSpecialismsQuery();
  const SPECIALISMS = loadSpecialism?.data || [];
  const [requestMatch, { isLoading }] = useRequestLawyerMatchMutation();
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");
  const [budget, setBudget] = useState("");
  const [specialism, setSpecialism] = useState("");
  const [topic, setTopic] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [mode, setMode] = useState<ConsultMode>("message");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whenHappened, setWhenHappened] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [waiver, setWaiver] = useState(false);
  const [waiverReason, setWaiverReason] = useState("");

  const prices = ["100", "250", "500", "1000"];

  const specialismLabel = SPECIALISMS.find((s: any) => s._id === specialism)?.displayName || "";

  const Safeties = ["Moderately", "Very Safe", "Not Safe"]

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    setErrorMsg("");
    const incoming = Array.from(fileList);
    setDocs(prev => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        setErrorMsg(`You can attach up to ${MAX_FILES} documents.`);
        return prev;
      }
      const accepted: LocalDoc[] = [];
      for (const f of incoming.slice(0, room)) {
        if (f.size > MAX_FILE_MB * 1024 * 1024) {
          setErrorMsg(`"${f.name}" is over ${MAX_FILE_MB}MB and wasn't added.`);
          continue;
        }
        accepted.push({ file: f, id: `${f.name}-${f.size}-${f.lastModified}` });
      }
      return [...prev, ...accepted];
    });
  }, []);

  const removeDoc = (id: string) => setDocs(prev => prev.filter(d => d.id !== id));

  const budgets = ["Under NGN 5,000", "NGN 5,000 - 15,000", "NGN 15,000 - 30,000", "Above NGN 30,000"];

  const submit = async () => {
    setErrorMsg("");
    try {
      const payload = {
        specialism,
        mode,
        topic,
        location,
        urgency,
        waiver,
        waiverReason,
        budgetRange: budget,
        whenHappened,
        description: summary,
        notes: notes || undefined,
        documents: docs.map(d => ({ name: d.file.name, sizeBytes: d.file.size })),
      };
      const res = await requestMatch(payload as any).unwrap();

      const paymentUrl = (res as any)?.data?.paymentResult?.data?.authorization_url;

      if (paymentUrl) {
        router.push(paymentUrl);
      } else {
        onDone();
      }

      if (res?.success !== false) setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Something went wrong sending your request. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-8 text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#FFF0F5] border-2 border-[#FBCFE8] flex items-center justify-center mx-auto mb-4">
          <ClipboardList size={26} className="text-maroon-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Your request is with our team</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
          We're reviewing your case now. Within a few hours you'll get a short list of lawyers who fit
          your summary, documents and notes go with the referral, so nobody starts from zero.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-1">
          <SummaryRow label="Legal issue" value={specialismLabel || "-"} />
          <SummaryRow label="Safety" value={urgency} />
          <SummaryRow label="Location" value={location} />
          <SummaryRow label="Billing" value={waiver ? "Requested of Waiver" : budget} />
          <SummaryRow label="Format" value={CONSULT_MODES.find(m => m.label === mode)?.label} />
          <SummaryRow label="Documents attached" value={`${docs.length} file${docs.length === 1 ? "" : "s"}`} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onDone}
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            Go to My Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#111827]">Tell us what's going on</h1>
        <p className="text-[13px] text-[#6B7280] mt-1">
          We'll use this to line you up with lawyers who actually handle cases like yours.
        </p>
      </div>

      <StepRail steps={steps} active={step} />

      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
        {step === 1 && (
          <div className="space-y-5">
            {/* <div>
              <SectionLabel>Area of Law</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALISMS.map((s: any) => (
                  <button
                    key={s._id}
                    onClick={() => setSpecialism(s._id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-[1.5px] text-left text-xs font-medium transition-all ${specialism === s._id
                      ? "border-maroon-500 bg-pink-50/60 text-maroon-500"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${specialism === s._id ? "bg-maroon-500" : "bg-gray-200"}`} />
                    {s.displayName}
                  </button>
                ))}
              </div>
            </div> */}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Area of Law <span className="font-normal text-gray-400">(optional)</span></label>
              <select value={specialism} onChange={(e) => setSpecialism(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              >
                <option value="">Select Area of Law</option>
                {SPECIALISMS.map((e: any, i: number) => <option key={i} value={e._id}>{e.displayName}</option>)}
              </select>
            </div>

            <div>
              <SectionLabel>What's the issue?</SectionLabel>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. My landlord is trying to evict me without notice"
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              />
            </div>
            <div>
              <SectionLabel>When did this happen?</SectionLabel>
              <input
                value={whenHappened}
                type="date"
                onChange={e => setWhenHappened(e.target.value)}
                placeholder="e.g. My landlord is trying to evict me without notice"
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Urgency<span className="font-normal text-gray-400">(optional)</span></label>
              <select value={urgency} onChange={(s) => setUrgency(s.target.value)}
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              >
                <option value="">Are you safe ?</option>
                {Safeties.map((e: any, i: number) => <option key={i} value={e}>{e}</option>)}
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!specialism || !topic.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              Continue <ChevronRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <SectionLabel>Tell us your story</SectionLabel>
              <p className="text-[11px] text-gray-400 -mt-1.5 mb-2">
                This is what your matched lawyer will read first. The more context, the better prepared they'll be.
              </p>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Walk us through what happened, what you've tried so far, and what outcome you're hoping for..."
                className="w-full h-28 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div>
              <SectionLabel>
                Additional Notes <span className="font-normal text-gray-400">(optional)</span>
              </SectionLabel>
              <p className="text-[11px] text-gray-400 -mt-1.5 mb-2">
                Anything else your lawyer should know?. Deadlines, other parties involved, prior legal advice.
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Court date is on the 14th, I already spoke to the other party's lawyer once..."
                className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Location <span className="font-normal text-gray-400">(optional)</span></label>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              >
                <option value="">Any State</option>
                {NIGERIAN_STATES.map((e: any, i: number) => <option key={i} value={e.code}>{e.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Language <span className="font-normal text-gray-400">(optional)</span></label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
              >
                {/* <option value="">English</option> */}
                {LANGUAGES.map((e: any, i: number) => <option key={i} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <SectionLabel>Preferred Communication Mode</SectionLabel>
              <p className="text-[11px] text-gray-400 -mt-1.5 mb-4">
                Your selected communication preference will <span className="font-bold text-maroon-500! ">expire in 2 hours</span>.
              </p>
              <div className="grid  grid-cols-2  md:grid-cols-4 gap-2">
                {CONSULT_MODES.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-[1.5px] transition-all ${mode === m.id ? "border-maroon-500 bg-pink-50/60" : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <Icon size={15} className={mode === m.id ? "text-maroon-500" : "text-gray-500"} />
                      <span className={`text-[11px] font-semibold ${mode === m.id ? "text-maroon-500" : "text-gray-700"}`}>{m.label}</span>
                      <span className={`text-[11px] font-semibold ${mode === m.id ? "text-maroon-500" : "text-gray-700"}`}>NGN {1000 * (i + 1)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waiver Toggle */}
            <div className="mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={waiver}
                  onChange={(e) => setWaiver(e.target.checked)}
                  className="w-4 h-4 text-maroon-500 border-gray-300 rounded focus:ring-maroon-500"
                />
                Cannot Pay? Request Waiver
              </label>
            </div>

            {/* Waiver Reason (shown when waiver is selected) */}
            {waiver && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Reason for Waiver <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  placeholder="Please explain why you're requesting a waiver..."
                  className="w-full px-3 py-2 text-sm border-[1.5px] border-gray-200 rounded-xl focus:border-maroon-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={12} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!summary.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <SectionLabel>
                Supporting Documents <span className="font-normal text-gray-400">(optional)</span>
              </SectionLabel>
              <FileDropzone onFiles={addFiles} />
              {errorMsg && (
                <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={11} /> {errorMsg}
                </p>
              )}
              {docs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {docs.map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <FileText size={13} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{d.file.name}</p>
                        <p className="text-[10px] text-gray-400">{fmtSize(d.file.size)}</p>
                      </div>
                      <button onClick={() => removeDoc(d.id)} className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                        <X size={12} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Lock size={13} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Documents are only shared with the lawyer(s) you're matched with, alongside your summary and notes.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={12} /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What we'll send your matched lawyer</p>

            <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              <div className="p-4 space-y-0.5">
                <SummaryRow label="Legal issue" value={specialismLabel || "-"} />
                <SummaryRow label="Topic" value={topic || "-"} />
                <SummaryRow label="Safety" value={urgency} />
                <SummaryRow label="Billing" value={waiver ? "Requested of Waiver" : budget} />
                <SummaryRow label="Preferred mode" value={CONSULT_MODES.find(m => m.id === mode)?.label} />
                <SummaryRow label="Documents" value={docs.length ? `${docs.length} attached` : "None"} />
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Case Summary</p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
              {notes && (
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Case Notes</p>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 accent-maroon-500 w-3.5 h-3.5 shrink-0"
              />
              <span className="text-[11px] text-gray-500 leading-relaxed">
                I understand our team will review this before recommending lawyers, and that I'll get to choose
                who I work with from the shortlist.
              </span>
            </label>

            {errorMsg && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button onClick={() => setStep(3)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={12} /> Back
              </button>
              <button
                onClick={submit}
                disabled={!agreed || isLoading}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                {isLoading ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <>Submit Request <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function FileDropzone({ onFiles }: { onFiles: (files: FileList | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${dragging ? "border-maroon-500 bg-pink-50/50" : "border-gray-200 hover:border-gray-300 bg-gray-50/60"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => onFiles(e.target.files)}
      />
      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2.5">
        <Upload size={14} className="text-gray-400" />
      </div>
      <p className="text-xs font-semibold text-gray-700">Click to upload, or drag files here</p>
      <p className="text-[10px] text-gray-400 mt-1">PDF, DOCX or images · up to {MAX_FILE_MB}MB each · {MAX_FILES} files max</p>
    </div>
  );
}


//  Path B — Direct booking with a subscribed lawyer                       

// Path B — Direct booking with a subscribed lawyer

function DirectBookingFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  const steps = ["Pick a Lawyer", "Booking Details", "Review"];

  const [chosen, setChosen] = useState<LawyerFull | null>(null);
  const [mode, setMode] = useState<ConsultMode>("message");
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingLawyer, setIsLoadingLawyer] = useState(false);

  const [bookConsultation, { isLoading }] = useBookConsultationMutation();
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const selectedLawyerId = searchParams.get('selected');

  // Fetch the specific lawyer when ID is provided in URL
  const { data: lawyerData, isLoading: lawyerLoading } = useGetMarketplaceLawyersQuery(
    {
      page: 1,
      pageSize: 1,
      search: selectedLawyerId || undefined,
    },
    { skip: !selectedLawyerId }
  );

  const pickLawyer = (l: LawyerFull) => {
    setChosen(l);
    setStep(2);
  };

  const submit = async () => {
    if (!chosen) return;
    setErrorMsg("");
    try {
      const payload = {
        lawyerScnNumber: chosen.scnNumber,
        mode,
        topic,
        description: detail,
        preferredTimeSlot: new Date().toISOString(),
        timezone: new Date().toISOString(),
      };
      const booked = await bookConsultation(payload).unwrap();
      const paymentUrl = (booked as any)?.data?.payment?.data?.authorization_url;
      if (paymentUrl) {
        router.push(paymentUrl);
      } else {
        onDone();
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Couldn't send that booking. Please try again.");
    }
  };

  // Loading state while fetching the pre-selected lawyer
  if (selectedLawyerId && lawyerLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-maroon-500" />
        <span className="ml-2 text-gray-500">Loading lawyer details...</span>
      </div>
    );
  }

  return (
    <div className={step === 1 ? "" : "max-w-2xl mx-auto"}>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#111827]">
          {step === 1 ? "Choose a lawyer to work with" : "Book your consultation"}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">
          {step === 1
            ? "Only subscribed, SCN-verified lawyers are listed here."
            : `You're booking directly with ${chosen?.fullName}.`}
        </p>
      </div>

      <StepRail steps={steps} active={step} />

      {step === 1 && <SubscribedLawyerPicker onPick={pickLawyer} />}

      {step === 2 && chosen && (
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 space-y-5">
          <ChosenLawyerBanner lawyer={chosen} onChange={() => setStep(1)} />

          <div>
            <SectionLabel>Case Format</SectionLabel>
            <div className="flex flex-col gap-2">
              {CONSULT_MODES.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] text-left transition-all ${mode === m.id ? "border-maroon-500 bg-pink-50/60" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${mode === m.id ? "bg-maroon-500/10" : "bg-gray-100"}`}>
                      <Icon size={16} className={mode === m.id ? "text-maroon-500" : "text-gray-500"} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${mode === m.id ? "text-maroon-500" : "text-gray-900"}`}>{m.label}</p>
                      <p className="text-[11px] text-gray-500">{m.desc}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">NGN {chosen?.fees?.[m.id]?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">per session</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Legal Topic</SectionLabel>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. My landlord is trying to evict me without notice"
              className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
            />
          </div>

          <div>
            <SectionLabel>
              Describe your situation <span className="font-normal text-gray-400">(optional but helpful)</span>
            </SectionLabel>
            <textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="Provide any relevant details that will help the lawyer prepare..."
              className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft size={12} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!topic.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              Continue <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && chosen && (
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 space-y-5">
          <ChosenLawyerBanner lawyer={chosen} onChange={() => setStep(1)} />

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Summary</p>
            <div className="space-y-1.5">
              <SummaryRow label="Lawyer" value={chosen.fullName} />
              <SummaryRow label="Format" value={CONSULT_MODES.find(m => m.id === mode)?.label} />
              <SummaryRow label="Topic" value={topic} />
              <div className="flex justify-between pt-2 mt-1.5 border-t border-gray-200">
                <span className="text-gray-500 font-semibold text-xs">Total</span>
                <span className="font-bold text-maroon-500 text-sm">NGN {chosen?.fees?.[mode]?.toLocaleString?.()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Payment is processed securely via Paystack after you confirm. You'll be redirected next.
            </p>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft size={12} /> Back
            </button>
            <button
              onClick={submit}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              {isLoading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Confirm & Pay <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChosenLawyerBanner({ lawyer, onChange }: { lawyer: LawyerFull; onChange: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}
      >
        {lawyer.avatarInitials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{lawyer.fullName}</p>
        <p className="text-xs text-gray-500 truncate">{lawyer.title}</p>
      </div>
      <button onClick={onChange} className="text-[11px] font-semibold text-maroon-500 hover:underline shrink-0">
        Change
      </button>
    </div>
  );
}

function SubscribedLawyerPicker({ onPick }: { onPick: (l: LawyerFull) => void }) {
  const [search, setSearch] = useState("");
  const [filterSpecialism, setFilterSpecialism] = useState("all");
  const { data: loadSpecialism } = useListSpecialismsQuery();
  const [location, setLocation] = useState("");
  const SPECIALISMS = loadSpecialism?.data || [];

  // Get the selected ID from URL
  const searchParams = useSearchParams();
  const selectedLawyerId = searchParams.get('selected');

  // Track if we've already auto-selected
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  const queryParams = {
    specialism: filterSpecialism !== "all" ? filterSpecialism : undefined,
    search: search || undefined,
    sortBy: "rating" as const,
    location,
    page: 1,
    pageSize: 30,
  };

  const { data: lawyersResponse, isLoading, isFetching } = useGetMarketplaceLawyersQuery(queryParams);
  const raw: LawyerFull[] = lawyersResponse?.data?.data || [];
  const LAWYERS = raw.filter(l => (l as any).subscriptionTier ? (l as any).subscriptionTier !== "basic" : true);

  // Auto-select the lawyer when data loads and we have a selected ID
  useEffect(() => {
    if (selectedLawyerId && LAWYERS.length > 0 && !hasAutoSelected) {
      const selectedLawyer = LAWYERS.find(l => l._id === selectedLawyerId);
      if (selectedLawyer) {
        // Check if the lawyer is available
        if (selectedLawyer.isAvailable) {
          onPick(selectedLawyer);
          setHasAutoSelected(true);

          // Remove the selected parameter from URL
          const url = new URL(window.location.href);
          url.searchParams.delete('selected');
          window.history.replaceState({}, '', url.toString());
        } else {
          // Optionally show a message that the lawyer is unavailable
          console.warn('Selected lawyer is not available');
        }
      }
    }
  }, [selectedLawyerId, LAWYERS, onPick, hasAutoSelected]);

  return (
    <div>
      <div className="flex items-start gap-3 p-4 bg-white border border-[#F3F4F6] rounded-2xl mb-5">
        <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] flex items-center justify-center shrink-0">
          <BadgeCheck size={13} className="text-maroon-500" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#111827]">Subscribed & verified only</p>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-0.5">
            Everyone below has passed SCN verification and actively subscribes to take direct bookings,
            so you know they're set up to respond.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
          />
        </div>
        <div>
          <select value={location} onChange={e => setLocation(e.target.value)}
            className="h-10 px-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-maroon-500 transition-colors font-medium"
          >
            <option value="">Any State</option>
            {NIGERIAN_STATES.map((e: any, i: number) => <option key={i} value={e.code}>{e.label}</option>)}
          </select>
        </div>
        <select
          value={filterSpecialism}
          onChange={e => setFilterSpecialism(e.target.value)}
          className="h-10 px-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-maroon-500 transition-colors font-medium"
        >
          <option value="all">All Areas of Law</option>
          {SPECIALISMS.map((s: any) => (
            <option key={s._id} value={s._id}>{s.displayName}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-maroon-500" />
        </div>
      ) : LAWYERS.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <UserSearch size={28} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No subscribed lawyers match this filter yet</p>
          <p className="text-xs text-gray-400 mt-1">Try a different area of law, or let our team match you instead.</p>
        </div>
      ) : (
        <>
          {isFetching && <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> Updating...</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            {LAWYERS.map(l => (
              <DirectLawyerCard
                key={l._id}
                lawyer={l}
                onSelect={() => onPick(l)}
                isSelected={l._id === selectedLawyerId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DirectLawyerCard({
  lawyer,
  onSelect,
  isSelected = false
}: {
  lawyer: LawyerFull;
  onSelect: () => void;
  isSelected?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={!lawyer.isAvailable}
      className={`text-left bg-white rounded-2xl border-[1.5px] p-4 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-gray-100 disabled:cursor-not-allowed ${isSelected
        ? "border-maroon-500 bg-pink-50/60 shadow-md"
        : "border-gray-100 hover:border-maroon-500"
        }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          {lawyer.picture ? (
            <img src={lawyer.picture} alt="" className="w-11 h-11 rounded-xl object-cover" />
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}
            >
              {lawyer.avatarInitials}
            </div>
          )}
          {lawyer.isAvailable && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{lawyer.fullName}</p>
          <p className="text-[11px] text-gray-500 truncate">{lawyer.title}</p>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
            <MapPin size={9} /> {lawyer.location}, {lawyer.state}
          </div>
        </div>
        {isSelected && (
          <div className="shrink-0">
            <Check size={16} className="text-maroon-500" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]">
          <BadgeCheck size={9} /> Verified
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]">
          <Zap size={9} /> Subscribed
        </span>
        {!lawyer.isAvailable && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-400 border-gray-200">
            <Clock size={9} /> Unavailable
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-500">
          From <strong className="text-gray-900">NGN {lawyer?.fees?.message?.toLocaleString()}</strong>
        </span>
        <span className={`font-bold flex items-center gap-0.5 ${isSelected ? "text-maroon-500" : "text-gray-500"}`}>
          {isSelected ? "Selected" : "Select"} <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
}