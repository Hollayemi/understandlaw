"use client";
import React, { useState } from "react";
import {
  MessageSquare, Video, Phone, Clock, CheckCircle, XCircle,
  AlertTriangle, Star, Eye, Flag, ChevronRight, Loader2, X, Check, RotateCcw,
  Zap, Activity, Timer, Gavel, FileText, Download, BadgeCheck, AlertCircle,
  CheckCircle2, ShieldAlert, Receipt,
} from "lucide-react";
import {
  useAdminUpdateConsultationStatusMutation,
  useAdminResolveDisputeMutation,
  useAdminFlagConsultationMutation,
  useAdminApproveRefundMutation,
  useAdminVerifyPaymentProofMutation,
  useAdminAssignLawyerToMatchMutation,
  useAdminAutoMatchMutation,
} from "@/redux/slices/admin/consultation.slice";
import { ConsultStatus, ConsultMode, Consultation, MatchRequest } from "@/redux/types/consultation";
import { PaymentProofMeta, PaymentProofStatus } from "@/redux/types/lawyer";
import { ConversationTab, DocumentPreviewModal } from "@/app/dashboard/consultations/components";
import { formatTime, formatFileSize, substringWithMax } from "@/utils/function";
import { MATCH_STATUS_CFG, MODE_CFG, STATUS_CFG } from "@/app/components/config";


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

// Payment proof status pill
function ProofStatusPill({ status }: { status?: PaymentProofStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] flex-shrink-0">
        <BadgeCheck size={9} /> Verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#991B1B] flex-shrink-0">
        <AlertCircle size={9} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] flex-shrink-0">
      <Clock size={9} /> Awaiting review
    </span>
  );
}

// Single invoice/receipt row with admin verify/reject controls
function PaymentProofRow({ consultationId, proof }: { consultationId: string; proof: PaymentProofMeta }) {
  const [preview, setPreview] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [verifyProof, { isLoading }] = useAdminVerifyPaymentProofMutation();

  const handleVerify = async (verified: boolean, reason?: string) => {
    try {
      await verifyProof({ consultationId, proofId: proof.id || proof.name, verified, reason }).unwrap();
      setShowRejectForm(false);
      setRejectReason("");
    } catch (error) {
      console.error("Failed to verify payment proof:", error);
    }
  };

  return (
    <>
      {preview && <DocumentPreviewModal doc={proof} onClose={() => setPreview(false)} />}
      <div className="border-[1.5px] border-[#F3F4F6] rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-[#6B7280]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[12px] font-bold text-[#111827] truncate capitalize">{proof.type}</p>
              <ProofStatusPill status={proof.status} />
            </div>
            <p className="text-[10px] text-[#9CA3AF] truncate">{proof.label || proof.name} · {formatFileSize(proof.sizeBytes)}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setPreview(true)} title="Preview" className="w-7 h-7 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
              <Eye size={12} className="text-[#6B7280]" />
            </button>
            {proof.fileUrl && (
              <a href={proof.fileUrl} download={proof.name} title="Download" className="w-7 h-7 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
                <Download size={12} className="text-[#6B7280]" />
              </a>
            )}
          </div>
        </div>

        {proof.status === "rejected" && proof.rejectionReason && (
          <p className="text-[10px] text-[#991B1B] bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg px-2.5 py-1.5">
            You rejected this: {proof.rejectionReason}
          </p>
        )}

        {proof.status !== "verified" && !showRejectForm && (
          <div className="flex gap-2">
            <button
              onClick={() => handleVerify(true)}
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg text-[11px] font-bold text-white bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              {isLoading ? <Loader2 size={11} className="animate-spin" /> : <BadgeCheck size={11} />}
              Verify
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-[#EF4444] border border-[#FCA5A5] hover:bg-[#FEF2F2] disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          </div>
        )}

        {showRejectForm && (
          <div className="space-y-2">
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Why doesn't this document work? e.g. Amount doesn't match, blurry image…"
              className="w-full h-16 px-2.5 py-2 rounded-lg border-[1.5px] border-[#FCA5A5] text-[11px] text-[#111827] resize-none outline-none focus:border-[#EF4444] placeholder:text-[#D1D5DB] transition-colors"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowRejectForm(false)} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleVerify(false, rejectReason)}
                disabled={isLoading || !rejectReason.trim()}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
              >
                {isLoading ? <Loader2 size={10} className="animate-spin" /> : null}
                Confirm Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Transcript Drawer with API mutations
export function TranscriptDrawer({ consult, onClose }: { consult: Consultation; onClose: () => void }) {
  const [flagNote, setFlagNote] = useState("");
  const [flagging, setFlagging] = useState(false);
  const [flagged, setFlagged] = useState(consult.flagged);
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "financials" | "payment" | "dispute">("transcript");

  const [flagConsultation] = useAdminFlagConsultationMutation();
  const [approveRefund] = useAdminApproveRefundMutation();
  const [resolveDispute] = useAdminResolveDisputeMutation();
  const [updateStatus] = useAdminUpdateConsultationStatusMutation();

  const proofs = consult.paymentProofs || [];
  const invoiceProof = proofs.filter(p => p.type === "invoice").slice(-1)[0];
  const receiptProof = proofs.filter(p => p.type === "receipt").slice(-1)[0];
  const bothVerified = invoiceProof?.status === "verified" && receiptProof?.status === "verified";
  const alreadyCompleted = consult.status === "completed";

  const handleMarkCompleted = async () => {
    setCompleting(true);
    try {
      await updateStatus({
        consultationId: consult.id,
        status: "completed",
        note: bothVerified
          ? "Payment invoice & receipt verified by admin — consultation closed out."
          : "Marked completed by admin.",
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to mark consultation completed:", error);
    } finally {
      setCompleting(false);
    }
  };

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
              : "linear-gradient(90deg, #7C3AED, #5B21B6)"
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
                <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.scnNumber}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              {/* <ModeIcon size={12} style={{ color: modeConfig.color }} /> */}
              <span className="text-[11px] font-semibold" style={{ color: modeConfig.color }}>{modeConfig.label}</span>
            </div>
          </div>

          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mt-4">
            {([
              { id: "transcript", label: "Transcript" },
              { id: "financials", label: "Financials" },
              { id: "payment", label: "Payment Proof" },
              { id: "dispute", label: consult.disputed ? "⚠ Dispute" : "Actions" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                {t.label}
                {t.id === "payment" && proofs.length > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${bothVerified ? "bg-[#10B981]" : "bg-[#F59E0B]"}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Transcript Tab - same as original */}
         
          {activeTab === "transcript" && (
            <ConversationTab consult={consult} isAdmin />
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
                  { l: "Payment Ref", v: consult.receiptId },
                  { l: "Initiated", v: formatTime(consult.createdAt) },
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

          {/* Payment Proof Tab — verify lawyer-uploaded invoice/receipt, then close out the consultation */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                <Receipt size={13} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  The lawyer uploads an invoice and a payment receipt here once the client has paid. Verify both are legitimate, then mark the consultation completed to round everything up.
                </p>
              </div>

              {proofs.length === 0 ? (
                <div className="text-center py-12 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
                  <FileText size={22} className="text-[#D1D5DB] mx-auto mb-2" />
                  <p className="text-[12px] font-semibold text-[#9CA3AF]">Nothing uploaded yet</p>
                  <p className="text-[11px] text-[#D1D5DB] mt-1 max-w-xs mx-auto">The lawyer hasn&apos;t submitted a payment invoice or receipt for this consultation yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoiceProof ? (
                    <PaymentProofRow consultationId={consult.id} proof={invoiceProof} />
                  ) : (
                    <div className="text-center py-6 bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
                      <p className="text-[11px] text-[#9CA3AF]">Invoice not uploaded yet</p>
                    </div>
                  )}
                  {receiptProof ? (
                    <PaymentProofRow consultationId={consult.id} proof={receiptProof} />
                  ) : (
                    <div className="text-center py-6 bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
                      <p className="text-[11px] text-[#9CA3AF]">Receipt not uploaded yet</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-[#F3F4F6]">
                {alreadyCompleted ? (
                  <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3.5">
                    <CheckCircle2 size={14} className="text-[#9CA3AF] shrink-0" />
                    <p className="text-[11px] font-semibold text-[#6B7280]">This consultation is already marked completed.</p>
                  </div>
                ) : (
                  <>
                    {!bothVerified && (
                      <div className="flex items-start gap-2 mb-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3">
                        <ShieldAlert size={13} className="text-[#F59E0B] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#92400E] leading-relaxed">
                          Invoice and receipt aren&apos;t both verified yet. You can still mark this completed if you&apos;re satisfied another way — just double-check the transcript first.
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleMarkCompleted}
                      disabled={completing}
                      className="w-full py-3 rounded-xl text-[12px] font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style={{ background: bothVerified ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #111827, #1E3A5F)" }}
                    >
                      {completing ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      {bothVerified ? "Verify & Mark Completed" : "Mark as Completed"}
                    </button>
                  </>
                )}
              </div>
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
                {!alreadyCompleted && (
                  <button onClick={() => setActiveTab("payment")}
                    className="w-full py-2.5 rounded-xl text-[12px] font-semibold border transition-colors text-left px-4 flex items-center justify-between"
                    style={{ color: "#065F46", borderColor: "#6EE7B7", background: "#ECFDF5" }}>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Verify Payment &amp; Mark Completed</span>
                    <ChevronRight size={12} />
                  </button>
                )}
                {[
                  { label: "Send Warning to Lawyer", onClick: handleSendWarning, color: "#F59E0B", border: "#FDE68A", bg: "#FFFBEB" },
                  { label: "Suspend Lawyer Account", onClick: () => { }, color: "#EF4444", border: "#FCA5A5", bg: "#FEF2F2" },
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
export function MatchCard({ req, onUpdate, onOpen }: { req: MatchRequest; onUpdate: () => void; onOpen: () => void }) {
  console.log({req})
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

  const modeCfg = MODE_CFG[req.mode];
  const ModeIcon = modeCfg.icon;

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
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.text }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
          <button onClick={onOpen} title="Open" className="w-6 h-6 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
            <Eye size={12} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-[11px] text-[#6B7280] mb-3">
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Needs:</span><span className="font-semibold text-[#111827]" title={req.topic}>{substringWithMax(req.topic, 40)}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Area:</span><span className="font-semibold text-[#111827]">{req.specialism.displayName}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Urgency:</span><span className="font-semibold text-[#EF4444]">{req.urgency}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Format:</span><span className="font-semibold flex items-center gap-1" style={{ color: modeCfg.color }}><ModeIcon size={10} />{modeCfg.label}</span></div>
      </div>

      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">{req.description}</p>

      {req.matchedLawyer && (
        <div className="flex items-center gap-2 p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl mb-3">
          <CheckCircle size={12} className="text-[#10B981]" />
          <p className="text-[11px] font-semibold text-[#065F46]">Matched: {req.matchedLawyer}</p>
        </div>
      )}

      {req.status === "recommended" && (
        <div className="flex items-center gap-2 p-2.5 bg-[#FFF0F5] border border-[#FBCFE8] rounded-xl mb-3">
          <Zap size={12} className="text-[#7C3AED]" />
          <p className="text-[11px] font-semibold text-[#9D174D]">
            {req.recommendedLawyers?.length || 0} lawyer{(req.recommendedLawyers?.length || 0) === 1 ? "" : "s"} recommended, awaiting citizen's pick
          </p>
        </div>
      )}

      {(req.status === "pending" || req.status === "unassigned") && (
        <div className="flex gap-2">
          <button onClick={onOpen} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#7C3AED] hover:bg-[#5B21B6] transition-colors flex items-center justify-center gap-1">
            <Eye size={10} /> Accept & Review
          </button>
          <button onClick={handleAutoMatch} className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1">
            <Zap size={10} /> Auto-Match
          </button>
        </div>
      )}

      {req.status === "in_review" && (
        <button onClick={onOpen} className="w-full py-2 rounded-xl text-[11px] font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-1.5">
          <Activity size={10} /> Continue Review
        </button>
      )}

      {req.status === "matching" && (
        <div className="flex items-center gap-2 py-2">
          <Loader2 size={12} className="text-[#F59E0B] animate-spin" />
          <p className="text-[11px] text-[#F59E0B] font-semibold">Searching for available lawyers…</p>
        </div>
      )}

      {(req.status === "matched" || req.status === "recommended") && (
        <button onClick={onOpen} className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
          View Details
        </button>
      )}
    </div>
  );
}

// Lawyer Performance Row ===>
export function LawyerPerformanceRow({ lawyer, stats }: {
  lawyer: { id: string; name: string; initials: string; color: string; scnNumber: string };
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
            <p className="text-[10px] text-[#9CA3AF]">{lawyer.scnNumber}</p>
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