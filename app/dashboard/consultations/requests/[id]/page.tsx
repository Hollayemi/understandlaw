// page.tsx - Updated version

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight, ChevronLeft, Loader2, Clock, CheckCircle2, Sparkles,
  MessageSquare, Calendar, Link as LinkIcon, AlertCircle,
  BadgeCheck, ArrowRight, Upload, FileText, Info, XCircle,
  User, Briefcase, Star, Award
} from "lucide-react";

import {
  useGetCitizenMatchRequestQuery,
  useAddCitizenMatchDocumentMutation,
  useSelectRecommendedLawyerMutation,
  useGetRequestSuggestedLawyerQuery,
} from "@/redux/slices/consultation.slice";
import { DocumentsPanel } from "@/app/dashboard/consultations/components";
import { MODE_CFG } from "@/app/components/config";
import { MatchStatus, RecommendedLawyerRef } from "@/redux/types/consultation";
import { formatTime } from "@/utils/function";
import { LawyerRecommendations } from "../../components/LawyerRecommendations";

const MATCH_STATUS_CFG: Record<MatchStatus, { label: string; sub: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Submitted", sub: "Your request is in the queue, waiting for our team to pick it up.", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  unassigned: { label: "Submitted", sub: "Your request is in the queue, waiting for our team to pick it up.", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  in_review: { label: "Being Reviewed", sub: "Our team is looking at your case now.", bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  ready_for_call: { label: "Ready for call", sub: "Our team has reviewed your case and is ready to schedule a call with you.", bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  matching: { label: "Matching", sub: "We're lining up lawyers who fit your case.", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  recommended: { label: "Lawyers Ready", sub: "We've found lawyers for you — pick who you'd like to work with.", bg: "#FFF0F5", text: "#9D174D", dot: "#9B2E3D" },
  matched: { label: "Matched", sub: "You're all set with your chosen lawyer.", bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  expired: { label: "Expired", sub: "This request has expired. You can start a new one anytime.", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
};


function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MatchRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isFetching, error } = useGetCitizenMatchRequestQuery(id, {
    pollingInterval: 20000,
  });
  const request = data?.data;
  const [selectLawyer, { isLoading: isSelectingLawyer }] = useSelectRecommendedLawyerMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const STEPS: { key: MatchStatus[]; label: string }[] = [
    { key: ["pending", "unassigned"] as MatchStatus[], label: "Submitted" },
    { key: ["in_review", "matching"] as MatchStatus[], label: "Being Reviewed" },
    ...(request?.mode === "message" ? [] : [{ key: ["ready_for_call"] as MatchStatus[], label: "Ready For Call" }]),
    { key: ["recommended"] as MatchStatus[], label: "Lawyers Ready" },
    { key: ["matched"] as MatchStatus[], label: "Matched" },
  ];


  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F2EE]">
        <Loader2 size={24} className="animate-spin text-maroon-500" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F2EE] gap-3 px-6 text-center">
        <XCircle size={28} className="text-gray-300" />
        <p className="text-sm font-semibold text-gray-600">We couldn't load this request</p>
        <Link href="/dashboard/consultations" className="text-xs font-bold text-maroon-500 hover:underline">
          Back to My Consultations
        </Link>
      </div>
    );
  }

  const statusCfg = MATCH_STATUS_CFG[request.status];
  const modeCfg = MODE_CFG[request.mode];
  const ModeIcon = modeCfg.icon;
  const currentStepIndex = STEPS.findIndex(s => s.key.includes(request.status));
  const isExpired = request.status === "expired";
  const isRecommended = request.status === "recommended";

  const handleSelectLawyer = async (lawyerProfileId: string) => {
    setErrorMsg("");
    try {
      const res = await selectLawyer({ matchRequestId: request.id, lawyerProfileId }).unwrap();
      const paymentUrl = (res as any)?.data?.payment?.data?.authorization_url;
      if (paymentUrl) {
        router.push(paymentUrl);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Couldn't select that lawyer. Please try again.");
      throw err; // Re-throw for the component to handle
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-2 xl:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <Link href="/dashboard/consultations" className="hover:text-gray-800 transition-colors">My Consultations</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-semibold text-gray-800">Request</span>
        </div>
        {isFetching && <Loader2 size={13} className="animate-spin text-gray-300" />}
      </div>

      <div className="max-w-3xl mx-auto px-2 xl:px-8 md:py-8">
        <button
          onClick={() => router.push("/dashboard/consultations")}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-5"
        >
          <ChevronLeft size={12} /> Back to My Consultations
        </button>

        {/* Header + status */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 mb-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Legal Issue</p>
              <h1 className="text-lg font-bold text-[#111827]">{request.topic}</h1>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shrink-0" style={{ background: statusCfg.bg, color: statusCfg.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
              {statusCfg.label}
            </span>
          </div>

          <p className="text-[12px] text-gray-500 mb-5">{statusCfg.sub}</p>

          {/* Progress steps */}
          {!isExpired && (
            <div className="flex items-center mb-1">
              {STEPS.map((step, i) => {
                const done = i < currentStepIndex;
                const current = i === currentStepIndex;
                return (
                  <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${done ? "bg-[#111827] text-white" : current ? "text-white" : "bg-gray-100 text-gray-300"
                          }`}
                        style={current ? { background: "linear-gradient(135deg, #9B2E3D, #82212D)" } : undefined}
                      >
                        {done ? <CheckCircle2 size={11} /> : i + 1}
                      </div>
                      <span className={`text-[9px] font-semibold whitespace-nowrap hidden sm:block ${current ? "text-[#111827]" : "text-gray-400"}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`h-[2px]! flex-1 mx-2 ${done ? "bg-[#111827]" : "bg-gray-200"}`} />}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
            <span>Submitted {formatTime(request.createdAt)}</span>
            <span className="flex items-center gap-1"><ModeIcon size={11} /> {modeCfg.label}</span>
          </div>
        </div>

        {isExpired && (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 mb-5 text-center">
            <Clock size={22} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600 mb-3">This request has expired</p>
            <Link
              href="/dashboard/consultations/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              Start a New Request
            </Link>
          </div>
        )}

        {/* Matched success state */}
        {request.status === "matched" && (
          <div className="bg-white rounded-2xl border border-[#A7F3D0] p-6 mb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-[#10B981]" />
              </div>
              <div>
                <div className="relative shrink-0">
                  <div className="flex items-start gap-4">
                    {request?.matchedLawyerId?.picture ? (
                      <img src={request.matchedLawyerId.picture} alt="" className="w-6 h-6 border border-gray-100 rounded-xl object-cover" />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-xl flex capitalise items-center justify-center text-white text-sm font-bold"
                      >
                        {request?.matchedLawyerId?.initials}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900 capitalize truncate">{request?.matchedLawyerId?.name}</h4>
                      <BadgeCheck className="text-yellow-500 shrink-0" size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-3">Head to My Cases to continue the conversation.</p>
              </div>
            </div>
            <Link
              href="/dashboard/consultations"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
            >
              Open Case <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* ===== LAWYER RECOMMENDATIONS SECTION ===== */}
        {/* Placed prominently right after status and matched states */}
        {isRecommended && (
          <div className="mb-5">
            <LawyerRecommendations
              matchRequestId={request.id}
              onSelect={handleSelectLawyer}

            />
          </div>
        )}

        {/* Show a friendly message when in matching state */}
        {request.status === "matching" && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-6 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="text-pink-500" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Finding the Perfect Lawyer for You</h3>
                <p className="text-sm text-gray-600">
                  Our team is carefully reviewing your case and matching you with experienced lawyers
                  who specialize in {request.topic}. We'll notify you as soon as we have recommendations ready.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-xs text-gray-500">This usually takes 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin message (message-mode) */}
        {request.mode === "message" && request.adminMessage && (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={11} /> Message from Our Team
              </p>
              {request.adminMessageAt && <p className="text-[10px] text-gray-300">{formatTime(request.adminMessageAt)}</p>}
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{request.adminMessage}</p>
          </div>
        )}

        {/* Scheduled call (call/video mode) */}
        {(request.mode === "call" || request.mode === "video") && request.scheduledCall && (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 mb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar size={11} /> Your Scheduled {request.mode === "video" ? "Video" : "Call"} Session
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[#111827] mb-1.5">
              <Calendar size={14} className="text-gray-400" /> {formatTime(request.scheduledCall.dateTime, "datetime")}
            </div>
            {request.scheduledCall.note && (
              <p className="text-[12px] text-gray-500 mb-3">{request.scheduledCall.note}</p>
            )}
            {request.scheduledCall.link && (
              <a
                href={request.scheduledCall.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
              >
                <LinkIcon size={12} /> Join Session
              </a>
            )}
          </div>
        )}

        {/* Case details */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 mb-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Your Case Summary</p>
          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] mb-5 overflow-hidden">
          <div className="px-5 pt-5 flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Documents</p>
          </div>
          <DocumentsPanel
            documents={request.documents}
            caseBrief={request.caseBrief}
            notes={request.notes}
            urgencyLabel={request.urgency}
            viewerRole="citizen"
          />
          {!isExpired && request.status !== "matched" && (
            <AddDocumentForm matchRequestId={request.id} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Add another document ────────────────────────────────────────────── */

function AddDocumentForm({ matchRequestId }: { matchRequestId: string }) {
  const [addDocument, { isLoading }] = useAddCitizenMatchDocumentMutation();
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select a file.");
      return;
    }

    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("matchRequestId", matchRequestId);
      formData.append("name", file.name);
      formData.append("sizeBytes", file.size.toString());
      formData.append("file", file);

      await addDocument({ matchRequestId, formData }).unwrap();

      setFile(null);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.message || "Couldn't upload that file. Please try again."
      );
    }
  };

  if (!open) {
    return (
      <div className="p-5 pt-3">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-[1.5px] border-dashed border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 transition-colors"
        >
          <Upload size={12} /> Attach another document
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 pt-3 space-y-3">
      <label className="flex items-center gap-2 h-10 px-3 rounded-lg border-[1.5px] border-gray-200 text-xs text-gray-500 cursor-pointer hover:border-gray-300 transition-colors">
        <FileText size={13} className="text-gray-400 shrink-0" />
        <span className="truncate">{file ? file.name : "Choose a file…"}</span>
        <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
      </label>
      {errorMsg && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={11} /> {errorMsg}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => { setOpen(false); setFile(null); setErrorMsg(""); }}
          className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="flex-1 py-2 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}
        >
          {isLoading ? <Loader2 size={12} className="animate-spin" /> : "Upload"}
        </button>
      </div>
    </div>
  );
}