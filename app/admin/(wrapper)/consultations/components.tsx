"use client";
import React, { useState, useMemo } from "react";
import {
  MessageSquare, Video, Phone, Clock, CheckCircle, XCircle,
  AlertTriangle, DollarSign, TrendingUp, Star,
  Eye, Flag, Search, ChevronRight, Download,
  Loader2, X, Check, RotateCcw,
  Zap, BarChart3, Activity, UserCheck, Timer, Gavel,
} from "lucide-react";
import {
  StatBar, PageHeader,
} from "../_components";
import {
  useAdminListConsultationsQuery,
  useAdminGetConsultationStatsQuery,
  useAdminListMatchRequestsQuery,
  useAdminGetLawyerPerformanceQuery,
  useAdminUpdateConsultationStatusMutation,
  useAdminResolveDisputeMutation,
  useAdminFlagConsultationMutation,
  useAdminApproveRefundMutation,
  useAdminAssignLawyerToMatchMutation,
  useAdminAutoMatchMutation,
  useAdminBulkAutoMatchMutation,
} from "@/redux/slices/admin/consultation.slice";
import { ConsultStatus, ConsultMode, Consultation, MatchRequest } from "@/redux/types/consultation";


export const STATUS_CFG: Record<ConsultStatus, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  pending: { label: "Pending Payment", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock },
  paid: { label: "Paid", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock },
  processing: { label: "Awaiting Lawyer", bg: "#87CEFA", text: "#0000FF", dot: "#F59E0B", icon: Clock },
  awaiting_lawyer: { label: "Awaiting Lawyer", bg: "#87CEFA", text: "#0000FF", dot: "#0000FF", icon: Timer },
  active: { label: "Active", bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: Activity },
  completed: { label: "Completed", bg: "#F9FAFB", text: "#374151", dot: "#9CA3AF", icon: CheckCircle },
  disputed: { label: "Disputed", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: Gavel },
  cancelled: { label: "Cancelled", bg: "#F9FAFB", text: "#6B7280", dot: "#D1D5DB", icon: XCircle },
  refunded: { label: "Refunded", bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6", icon: RotateCcw },
};

export const MODE_CFG: Record<ConsultMode, { label: string; icon: React.ElementType; color: string }> = {
  message: { label: "Written", icon: MessageSquare, color: "#6B7280" },
  call: { label: "Call", icon: Phone, color: "#3B82F6" },
  video: { label: "Video", icon: Video, color: "#8B5CF6" },
};

export const MATCH_STATUS_CFG: Record<MatchRequest["status"], { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Unassigned", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  unassigned: { label: "Unassigned", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  matching: { label: "Matching…", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  matched: { label: "Matched", bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  expired: { label: "Expired", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
};

// Sub-components (same as original)
export function ConsultStatusBadge({ status }: { status: ConsultStatus }) {
  console.log(status)
  const cfg = STATUS_CFG[status];
  console.log(cfg)
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center flex-nowrap gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

// Transcript Drawer with API mutations
export function TranscriptDrawer({ consult, onClose }: { consult: Consultation; onClose: () => void }) {
  const [flagNote, setFlagNote] = useState("");
  const [flagging, setFlagging] = useState(false);
  const [flagged, setFlagged] = useState(consult.flagged);
  const [activeTab, setActiveTab] = useState<"transcript" | "financials" | "dispute">("transcript");

  const [flagConsultation] = useAdminFlagConsultationMutation();
  const [approveRefund] = useAdminApproveRefundMutation();
  const [resolveDispute] = useAdminResolveDisputeMutation();
  const [updateStatus] = useAdminUpdateConsultationStatusMutation();

  const handleFlag = async () => {
    if (!flagNote.trim()) return;
    setFlagging(true);
    try {
      await flagConsultation({
        consultationId: consult.id,
        reason: flagNote,
        severity: "medium",
      }).unwrap();
      setFlagged(true);
    } catch (error) {
      console.error("Failed to flag consultation:", error);
    } finally {
      setFlagging(false);
    }
  };

  const handleApproveRefund = async (approved: boolean) => {
    try {
      await approveRefund({
        consultationId: consult.id,
        approved,
        adminNote: approved ? "Refund approved by admin" : "Refund rejected by admin",
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to process refund:", error);
    }
  };

  const handleResolveDispute = async (decision: "citizen" | "lawyer") => {
    try {
      await resolveDispute({
        consultationId: consult.id,
        decision,
        reason: `Admin ruled in favor of ${decision}`,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to resolve dispute:", error);
    }
  };

  const handleSendWarning = async () => {
    try {
      await updateStatus({
        consultationId: consult.id,
        status: consult.status,
        note: "Warning sent to lawyer for quality review",
      }).unwrap();
      alert("Warning sent to lawyer");
    } catch (error) {
      console.error("Failed to send warning:", error);
    }
  };

  const modeConfig = MODE_CFG[consult.mode];
  const ModeIcon = modeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header content - same as original */}
        <div className="h-1 w-full flex-shrink-0" style={{
          background: consult.disputed
            ? "#EF4444"
            : consult.status === "completed"
            ? "#10B981"
            : "linear-gradient(90deg, #E8317A, #ff6fa8)"
        }} />

        <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
          {/* Header content - same as original */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#9CA3AF]">{consult.id}</span>
                <ConsultStatusBadge status={consult.status} />
                {consult.flagged && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    <Flag size={8} /> Flagged
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2">{consult.topic}</h2>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Parties and tabs - same as original */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${consult.citizen.color}, ${consult.citizen.color}80)` }}>
                {consult.citizen.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827]">{consult.citizen.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{consult.citizen.state}</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-[#D1D5DB] flex-shrink-0" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)` }}>
                {consult.lawyer.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827]">{consult.lawyer.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.nbaNumber}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <ModeIcon size={12} style={{ color: modeConfig.color }} />
              <span className="text-[11px] font-semibold" style={{ color: modeConfig.color }}>{modeConfig.label}</span>
            </div>
          </div>

          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mt-4">
            {([
              { id: "transcript", label: "Transcript" },
              { id: "financials", label: "Financials" },
              { id: "dispute", label: consult.disputed ? "⚠ Dispute" : "Actions" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Transcript Tab - same as original */}
          {activeTab === "transcript" && (
            <div>
              {consult.transcript.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={28} className="text-[#E5E7EB] mx-auto mb-2" />
                  <p className="text-sm text-[#9CA3AF]">No messages yet</p>
                  <p className="text-[11px] text-[#D1D5DB] mt-1">
                    {consult.status === "awaiting_lawyer" ? "Waiting for lawyer to accept." : "Consultation has not started."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Full Message Transcript · {consult.transcript.length} messages
                  </p>
                  {consult.transcript.map(msg => (
                    <div key={msg.id} className={`flex gap-2.5 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5`}
                        style={{
                          background: msg.sender === "citizen"
                            ? `linear-gradient(135deg, ${consult.citizen.color}, ${consult.citizen.color}80)`
                            : `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)`
                        }}>
                        {msg.sender === "citizen" ? consult.citizen.initials : consult.lawyer.initials}
                      </div>
                      <div className={`flex-1 max-w-[85%] ${msg.sender === "lawyer" ? "items-end" : ""} flex flex-col`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}>
                          <p className="text-[10px] font-semibold text-[#9CA3AF]">{msg.senderName}</p>
                          <p className="text-[10px] text-[#D1D5DB]">{msg.time}</p>
                        </div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                          msg.sender === "citizen"
                            ? "bg-[#F3F4F6] text-[#374151] rounded-tl-sm"
                            : "text-white rounded-tr-sm"
                        }`}
                          style={msg.sender === "lawyer" ? { background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}cc)` } : {}}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {consult.status === "completed" && consult.rating && (
                <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Citizen Review</p>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <StarRating n={consult.rating} />
                    {consult.ratingNote && (
                      <p className="text-[12px] text-[#92400E] mt-2 leading-relaxed">"{consult.ratingNote}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Financials Tab - same as original */}
          {activeTab === "financials" && (
            <div className="space-y-4">
              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Fee Breakdown</p>
                <div className="space-y-2 text-[13px]">
                  {[
                    { l: "Gross Fee", v: `NGN ${consult.fee.toLocaleString()}`, bold: false },
                    { l: "Platform Commission (15%)", v: `– NGN ${consult.platformFee.toLocaleString()}`, bold: false },
                    { l: "Lawyer Payout", v: `NGN ${consult.lawyerPayout.toLocaleString()}`, bold: true },
                  ].map(r => (
                    <div key={r.l} className={`flex justify-between items-center py-1.5 ${r.bold ? "border-t border-[#E5E7EB] pt-2.5 mt-1" : ""}`}>
                      <span className="text-[#9CA3AF]">{r.l}</span>
                      <span className={r.bold ? "font-bold text-[#111827] text-[14px]" : "font-medium text-[#374151]"}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-[12px]">
                {[
                  { l: "Payment Method", v: "Paystack" },
                  { l: "Payment Ref", v: `PAY-2025-${consult.id}` },
                  { l: "Initiated", v: consult.createdAt },
                  { l: "Completed", v: consult.completedAt ?? "—" },
                  { l: "Duration", v: consult.duration ?? "—" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between border-b border-[#F9FAFB] py-2.5">
                    <span className="text-[#9CA3AF]">{r.l}</span>
                    <span className="font-semibold text-[#111827]">{r.v}</span>
                  </div>
                ))}
              </div>

              {consult.refundRequested && (
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={13} className="text-[#EF4444]" />
                    <p className="text-[12px] font-bold text-[#991B1B]">Refund Requested</p>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-3">Citizen has requested a refund. Review transcript before approving.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveRefund(true)} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors">
                      Approve Refund
                    </button>
                    <button onClick={() => handleApproveRefund(false)} className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                      Reject Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dispute/Actions Tab with mutations */}
          {activeTab === "dispute" && (
            <div className="space-y-4">
              {consult.disputed && (
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel size={14} className="text-[#EF4444]" />
                    <p className="text-[12px] font-bold text-[#991B1B]">Active Dispute</p>
                  </div>
                  <p className="text-[12px] text-[#374151] leading-relaxed">{consult.disputeReason}</p>
                  <div className="mt-3 pt-3 border-t border-[#FCA5A5] flex flex-col gap-2">
                    <button onClick={() => handleResolveDispute("citizen")} className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors">
                      Rule in Citizen's Favour
                    </button>
                    <button onClick={() => handleResolveDispute("lawyer")} className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#1A2D3B] hover:bg-[#111827] transition-colors">
                      Rule in Lawyer's Favour
                    </button>
                    <button className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                      Mark as Mediated
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flag size={13} className="text-[#F59E0B]" />
                  <p className="text-[12px] font-bold text-[#92400E]">Quality Audit Flag</p>
                </div>
                <p className="text-[11px] text-[#92400E] mb-3">Flag this consultation for quality review. The lawyer's response may be reviewed by the compliance team.</p>
                {consult.flagReason && (
                  <div className="bg-white/60 rounded-lg p-2.5 mb-3 border border-[#FDE68A]">
                    <p className="text-[11px] text-[#92400E]">{consult.flagReason}</p>
                  </div>
                )}
                <textarea
                  value={flagNote}
                  onChange={e => setFlagNote(e.target.value)}
                  placeholder="Reason for flagging (e.g. incorrect legal advice, inappropriate language)..."
                  className="w-full h-16 px-3 py-2.5 rounded-xl border-[1.5px] border-[#FDE68A] text-[11px] text-[#111827] resize-none outline-none focus:border-[#F59E0B] placeholder:text-[#D1D5DB] transition-colors bg-white mb-2"
                />
                <button onClick={handleFlag} disabled={flagging || flagged || !flagNote.trim()}
                  className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5">
                  {flagging ? <><Loader2 size={11} className="animate-spin" /> Flagging…</>
                  : flagged ? <><Check size={11} /> Flagged</>
                  : <><Flag size={11} /> Flag for Review</>}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Admin Actions</p>
                {[
                  { label: "Send Warning to Lawyer", onClick: handleSendWarning, color: "#F59E0B", border: "#FDE68A", bg: "#FFFBEB" },
                  { label: "Suspend Lawyer Account", onClick: () => {}, color: "#EF4444", border: "#FCA5A5", bg: "#FEF2F2" },
                  { label: "Cancel & Refund", onClick: () => handleApproveRefund(true), color: "#8B5CF6", border: "#C4B5FD", bg: "#F5F3FF" },
                ].map(a => (
                  <button key={a.label} onClick={a.onClick}
                    className="w-full py-2.5 rounded-xl text-[12px] font-semibold border transition-colors text-left px-4"
                    style={{ color: a.color, borderColor: a.border, background: a.bg }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Match Card with API mutations
export function MatchCard({ req, onUpdate }: { req: MatchRequest; onUpdate: () => void }) {
  const cfg = MATCH_STATUS_CFG[req.status];
  const [assignLawyer] = useAdminAssignLawyerToMatchMutation();
  const [autoMatch] = useAdminAutoMatchMutation();

  const handleAutoMatch = async () => {
    try {
      await autoMatch({ matchRequestId: req.id }).unwrap();
      onUpdate();
    } catch (error) {
      console.error("Failed to auto-match:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${req.citizen.color}, ${req.citizen.color}80)` }}>
            {req.citizen.initials}
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#111827]">{req.citizen.name}</p>
            {/* <p className="text-[10px] text-[#9CA3AF]">{req.citizen.state} · {req.createdAt}</p> */}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] text-[#6B7280] mb-3">
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Needs:</span><span className="font-semibold text-[#111827]">{req.specialism}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Urgency:</span><span className="font-semibold text-[#EF4444]">{req.urgency}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Budget:</span><span>{req.budget}</span></div>
      </div>

      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">{req.description}</p>

      {req.matchedLawyer && (
        <div className="flex items-center gap-2 p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl mb-3">
          <CheckCircle size={12} className="text-[#10B981]" />
          <p className="text-[11px] font-semibold text-[#065F46]">Matched: {req.matchedLawyer}</p>
        </div>
      )}

      {req.status === "unassigned" && (
        <div className="flex gap-2">
          <button onClick={handleAutoMatch} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors flex items-center justify-center gap-1">
            <Zap size={10} /> Auto-Match
          </button>
          <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1">
            <UserCheck size={10} /> Assign Manually
          </button>
        </div>
      )}

      {req.status === "matching" && (
        <div className="flex items-center gap-2 py-2">
          <Loader2 size={12} className="text-[#F59E0B] animate-spin" />
          <p className="text-[11px] text-[#F59E0B] font-semibold">Searching for available lawyers…</p>
        </div>
      )}

      {req.status === "matched" && (
        <button className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
          View Match Details
        </button>
      )}
    </div>
  );
}

// Lawyer Performance Row
export function LawyerPerformanceRow({ lawyer, stats }: {
  lawyer: { id: string; name: string; initials: string; color: string; nbaNumber: string };
  stats: { total: number; completed: number; disputed: number; avgRating: number; totalRevenue: number };
}) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  return (
    <tr className="hover:bg-[#F9FAFB] transition-colors border-b border-[#F9FAFB]">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: `linear-gradient(135deg, ${lawyer.color}, ${lawyer.color}80)` }}>
            {lawyer.initials}
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#111827]">{lawyer.name}</p>
            <p className="text-[10px] text-[#9CA3AF]">{lawyer.nbaNumber}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-[12px] text-[#6B7280]">{stats.total}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div className="h-1.5 rounded-full bg-[#10B981]" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="text-[11px] font-semibold text-[#6B7280]">{completionRate}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {stats.avgRating > 0 ? (
          <div className="flex items-center gap-1.5">
            <StarRating n={Math.round(stats.avgRating)} />
            <span className="text-[11px] font-semibold text-[#111827]">{stats.avgRating.toFixed(1)}</span>
          </div>
        ) : <span className="text-[11px] text-[#D1D5DB]">—</span>}
      </td>
      <td className="px-5 py-3.5">
        {stats.disputed > 0
          ? <span className="text-[11px] font-bold text-[#EF4444]">{stats.disputed} dispute{stats.disputed > 1 ? "s" : ""}</span>
          : <span className="text-[11px] text-[#10B981] font-semibold">Clean</span>
        }
      </td>
      <td className="px-5 py-3.5 text-[12px] font-bold text-[#111827]">
        NGN {stats.totalRevenue.toLocaleString()}
      </td>
    </tr>
  );
}
