"use client";
import { useState } from "react";
import {
  Clock, Loader2, X, Activity, Gavel, Star, ThumbsUp, ThumbsDown,
  MessageSquare, FileText, CreditCard, LayoutGrid, UploadCloud, BadgeCheck,
  AlertCircle, Eye, Download, CheckCircle2, Info, RefreshCcw,
} from "lucide-react";
import { ConsultStatus, Consultation, MatchRequest } from "@/redux/types/consultation";
import { ConsultationDocumentMeta, PaymentProofMeta, PaymentProofStatus, PaymentProofType } from "@/redux/types/lawyer";
import { STATUS_CFG, MODE_CFG } from "@/app/components/config";
import { ConversationTab, DocumentsPanel, DocumentPreviewModal } from "@/app/dashboard/consultations/components";
import { useUploadPaymentProofMutation } from "@/redux/slices/consultation.slice";
import { formatFileSize } from "@/utils/function";

export function StarRating({ n }: { n: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={11} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
            ))}
        </div>
    );
}

export function StatusBadge({ status }: { status: ConsultStatus }) {
    const cfg = STATUS_CFG[status];
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.text }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

function PaymentProofStatusPill({ status }: { status?: PaymentProofStatus }) {
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
            <Clock size={9} /> Pending review
        </span>
    );
}

function PaymentProofSlot({
    consultId,
    type,
    title,
    description,
    existing,
}: {
    consultId: string;
    type: PaymentProofType;
    title: string;
    description: string;
    existing?: PaymentProofMeta;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProof, { isLoading }] = useUploadPaymentProofMutation();
    const [errorMsg, setErrorMsg] = useState("");
    const [preview, setPreview] = useState<ConsultationDocumentMeta | null>(null);

    const needsReupload = existing?.status === "rejected";

    const handleUpload = async () => {
        if (!file) {
            setErrorMsg(`Choose a ${type} file first.`);
            return;
        }
        setErrorMsg("");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        try {
            await uploadProof({ consultationId: consultId, formData }).unwrap();
            setFile(null);
        } catch (error) {
            console.error(`Failed to upload ${type}:`, error);
            setErrorMsg(`Couldn't upload the ${type}. Please try again.`);
        }
    };

    return (
        <div className="border-[1.5px] border-[#F3F4F6] rounded-xl p-4 space-y-3">
            {preview && <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[12px] font-bold text-[#111827]">{title}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{description}</p>
                </div>
                {existing && <PaymentProofStatusPill status={existing.status} />}
            </div>

            {existing && (
                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                        <FileText size={13} className="text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#111827] truncate">{existing.label || existing.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{formatFileSize(existing.sizeBytes)}</p>
                        {existing.status === "rejected" && existing.rejectionReason && (
                            <p className="text-[10px] text-[#991B1B] mt-1">Reason: {existing.rejectionReason}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setPreview(existing)} title="Preview" className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
                            <Eye size={12} className="text-[#6B7280]" />
                        </button>
                        {existing.fileUrl && (
                            <a href={existing.fileUrl} download={existing.name} title="Download" className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
                                <Download size={12} className="text-[#6B7280]" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {(!existing || needsReupload) && (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 h-10 px-3 rounded-lg border-[1.5px] border-dashed border-[#E5E7EB] text-[11px] text-[#9CA3AF] cursor-pointer hover:border-[#F97316] transition-colors">
                        <UploadCloud size={13} className="text-[#9CA3AF] shrink-0" />
                        <span className="truncate">{file ? file.name : `Choose ${type} file…`}</span>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    {errorMsg && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errorMsg}</p>}
                    <button
                        onClick={handleUpload}
                        disabled={isLoading || !file}
                        className="w-full py-2 rounded-lg text-[11px] font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                    >
                        {isLoading
                            ? <><Loader2 size={11} className="animate-spin" /> Uploading…</>
                            : <>{needsReupload ? <RefreshCcw size={11} /> : <UploadCloud size={11} />} {needsReupload ? "Re-upload" : `Upload ${title}`}</>}
                    </button>
                </div>
            )}
        </div>
    );
}

function PaymentProofPanel({ consult }: { consult: Consultation }) {
    const proofs = consult.paymentProofs || [];
    const invoice = proofs.filter(p => p.type === "invoice").slice(-1)[0];
    const receipt = proofs.filter(p => p.type === "receipt").slice(-1)[0];
    const bothVerified = invoice?.status === "verified" && receipt?.status === "verified";

    return (
        <div className="p-5 space-y-4">
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                <Info size={13} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                    Upload the client&apos;s payment invoice and receipt once the fee has been settled. Our admin team verifies both before the consultation is closed out as completed and payouts are finalized.
                </p>
            </div>

            {bothVerified && (
                <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl p-3">
                    <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />
                    <p className="text-[11px] font-semibold text-[#065F46]">Both documents verified — you&apos;re all set to mark this consultation complete.</p>
                </div>
            )}

            <PaymentProofSlot
                consultId={consult.id}
                type="invoice"
                title="Invoice"
                description="The invoice you issued to the client for this consultation."
                existing={invoice}
            />
            <PaymentProofSlot
                consultId={consult.id}
                type="receipt"
                title="Payment Receipt"
                description="Proof that the client's payment was received (bank alert, Paystack receipt, etc.)."
                existing={receipt}
            />
        </div>
    );
}

export function ConsultationDrawer({
    consult,
    onClose,
    onAccept,
    onReject,
    onComplete,
}: {
    consult: Consultation;
    onClose: () => void;
    onAccept: (id: string, reason?: string) => void;
    onReject: (id: string) => void;
    onComplete?: (id: string) => void;
}) {
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "chat" | "documents" | "payment">("overview");
    const modeConfig = MODE_CFG[consult.mode];
    const ModeIcon = modeConfig.icon;

    const proofs = consult.paymentProofs || [];
    const verifiedProofCount = proofs.filter(p => p.status === "verified").length;
    const hasAnyProof = proofs.length > 0;

    const handleAccept = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        onAccept(consult.id);
        setLoading(false);
        onClose();
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        onReject(consult.id);
        setLoading(false);
        onClose();
    };

    const handleComplete = async () => {
        if (!onComplete) return;
        setCompleting(true);
        try {
            await onComplete(consult.id);
            onClose();
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
                <div className="h-1 w-full flex-shrink-0" style={{
                    background: consult.status === "disputed"
                        ? "#EF4444"
                        : consult.status === "completed"
                            ? "#10B981"
                            : "linear-gradient(90deg, #F97316, #EA580C)"
                }} />

                <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[11px] font-mono font-bold text-[#9CA3AF]">{consult.id}</span>
                                <StatusBadge status={consult.status} />
                            </div>
                            <h2 className="text-sm font-bold text-[#111827] leading-snug">{consult.topic}</h2>
                        </div>
                        <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${consult.citizen.color}, ${consult.citizen.color}80)` }}>
                            {consult.citizen.initials}
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-[#111827]">{consult.citizen.name}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{consult.citizen.state} · {consult.createdAt}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <ModeIcon size={12} style={{ color: modeConfig.color }} />
                            <span className="text-[11px] font-semibold" style={{ color: modeConfig.color }}>{modeConfig.label}</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mt-4">
                        {([
                            { id: "overview" as const, label: "Overview", icon: LayoutGrid },
                            { id: "chat" as const, label: "Chat", icon: MessageSquare },
                            { id: "documents" as const, label: "Documents", icon: FileText },
                            { id: "payment" as const, label: "Payment", icon: CreditCard },
                        ]).map(t => {
                            const TabIcon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
                                >
                                    <TabIcon size={11} />
                                    {t.label}
                                    {t.id === "payment" && hasAnyProof && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${verifiedProofCount === 2 ? "bg-[#10B981]" : "bg-[#F59E0B]"}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* ── Overview ── */}
                    {activeTab === "overview" && (
                        <div className="p-6 space-y-5">
                            {/* Fee breakdown */}
                            <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Fee Breakdown</p>
                                <div className="space-y-2 text-[13px]">
                                    {[
                                        { l: "Gross Fee", v: `NGN ${consult.fee.toLocaleString()}`, bold: false },
                                        { l: "Platform Commission", v: `– NGN ${consult.platformFee.toLocaleString()}`, bold: false },
                                        { l: "Your Payout", v: `NGN ${consult.lawyerPayout.toLocaleString()}`, bold: true },
                                    ].map(r => (
                                        <div key={r.l} className={`flex justify-between items-center py-1.5 ${r.bold ? "border-t border-[#E5E7EB] pt-2.5 mt-1" : ""}`}>
                                            <span className="text-[#9CA3AF]">{r.l}</span>
                                            <span className={r.bold ? "font-bold text-[#111827] text-[14px]" : "font-medium text-[#374151]"}>{r.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] divide-y divide-[#F3F4F6] text-[12px]">
                                {[
                                    { l: "Requested", v: consult.createdAt },
                                    ...(consult.scheduledAt ? [{ l: "Scheduled for", v: consult.scheduledAt }] : []),
                                    ...(consult.duration ? [{ l: "Duration", v: consult.duration }] : []),
                                    ...(consult.completedAt ? [{ l: "Completed", v: consult.completedAt }] : []),
                                ].map(r => (
                                    <div key={r.l} className="flex justify-between items-center px-4 py-3">
                                        <span className="text-[#9CA3AF]">{r.l}</span>
                                        <span className="font-semibold text-[#111827] text-right max-w-[200px] truncate">{r.v}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Disputed section */}
                            {consult.disputed && (
                                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gavel size={13} className="text-[#EF4444]" />
                                        <p className="text-[12px] font-bold text-[#991B1B]">Dispute Raised</p>
                                    </div>
                                    <p className="text-[12px] text-[#374151] leading-relaxed">{consult.disputeReason}</p>
                                    <p className="text-[11px] text-[#9CA3AF] mt-2">An admin will review and contact you. Respond within 48 hours.</p>
                                </div>
                            )}

                            {/* Rating */}
                            {consult.status === "completed" && consult.rating && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Citizen Review</p>
                                    <StarRating n={consult.rating} />
                                    {consult.ratingNote && (
                                        <p className="text-[12px] text-[#92400E] mt-2 leading-relaxed">&quot;{consult.ratingNote}&quot;</p>
                                    )}
                                </div>
                            )}

                            {/* Action buttons for new requests */}
                            {consult.status === "awaiting_lawyer" && !showRejectForm && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Your Response</p>
                                    <button
                                        onClick={handleAccept}
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                                        style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                                    >
                                        {loading ? <Loader2 size={13} className="animate-spin" /> : <ThumbsUp size={13} />}
                                        Accept Consultation
                                    </button>
                                    <button
                                        onClick={() => setShowRejectForm(true)}
                                        className="w-full py-3 rounded-xl text-[13px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors"
                                    >
                                        Decline Request
                                    </button>
                                </div>
                            )}

                            {/* Reject form */}
                            {showRejectForm && (
                                <div className="space-y-3">
                                    <p className="text-[12px] font-bold text-[#374151]">Reason for declining</p>
                                    <p className="text-[11px] text-[#9CA3AF]">The citizen will see this reason. Be professional.</p>
                                    <textarea
                                        value={rejectReason}
                                        onChange={e => setRejectReason(e.target.value)}
                                        placeholder="e.g. Outside my area of practice, scheduling conflict…"
                                        className="w-full h-20 px-3 py-2.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] resize-none outline-none focus:border-[#EF4444] placeholder:text-[#D1D5DB] transition-colors"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowRejectForm(false)}
                                            className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={loading || !rejectReason.trim()}
                                            className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            {loading ? <Loader2 size={11} className="animate-spin" /> : <ThumbsDown size={11} />}
                                            Confirm Decline
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Active consultation */}
                            {consult.status === "active" && (
                                <div className="bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity size={13} className="text-[#10B981]" />
                                        <p className="text-[12px] font-bold text-[#065F46]">Consultation in progress</p>
                                    </div>
                                    <p className="text-[11px] text-[#6B7280] mb-3">Respond within your stated response time to maintain your rating.</p>
                                    <button
                                        onClick={() => setActiveTab("chat")}
                                        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors mb-2"
                                    >
                                        Open Conversation
                                    </button>

                                    {!hasAnyProof && (
                                        <div className="flex items-start gap-2 bg-white/70 border border-[#A7F3D0] rounded-lg p-2.5 mb-2">
                                            <Info size={12} className="text-[#059669] shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-[#065F46] leading-relaxed">
                                                Once you&apos;ve been paid, upload the invoice and receipt from the <button onClick={() => setActiveTab("payment")} className="font-bold underline">Payment tab</button> before closing this out.
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleComplete}
                                        disabled={completing || !onComplete}
                                        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                                        style={{ background: "linear-gradient(135deg, #111827, #1E3A5F)" }}
                                    >
                                        {completing ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                        Mark as Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Chat ── */}
                    {activeTab === "chat" && (
                        <ConversationTab consult={consult} viewerRole="lawyer" />
                    )}

                    {/* ── Documents ── */}
                    {activeTab === "documents" && (
                        <DocumentsPanel
                            documents={consult.documents}
                            caseBrief={consult.caseBrief}
                            notes={consult.notes}
                            urgencyLabel={consult.urgencyLabel}
                            viewerRole="lawyer"
                        />
                    )}

                    {/* ── Payment (invoice & receipt upload) ── */}
                    {activeTab === "payment" && (
                        <PaymentProofPanel consult={consult} />
                    )}
                </div>
            </div>
        </div>
    );
}

export function MatchRequestCard({
    req,
    onAccept,
    onReject,
}: {
    req: MatchRequest;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}) {
    const [acting, setActing] = useState<"accept" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showReject, setShowReject] = useState(false);

    const urgencyColor = req.urgency === "Today" ? "#EF4444" : req.urgency === "This week" ? "#F59E0B" : "#6B7280";

    const handleAccept = async () => {
        setActing("accept");
        await new Promise(r => setTimeout(r, 800));
        onAccept(req.id);
        setActing(null);
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) return;
        setActing("reject");
        await new Promise(r => setTimeout(r, 800));
        onReject(req.id);
        setActing(null);
    };

    return (
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${req.citizen.color}, ${req.citizen.color}80)` }}>
                        {req.citizen.initials}
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-[#111827]">{req.citizen.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{req.citizen.state} · {req.createdAt}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={10} style={{ color: urgencyColor }} />
                    <span className="text-[10px] font-bold" style={{ color: urgencyColor }}>Expires {req.expiresAt}</span>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-[#F9FAFB] rounded-lg px-2.5 py-1.5">
                    <p className="text-[#9CA3AF]">Needs</p>
                    <p className="font-semibold text-[#111827]">{req.specialism?.displayName || ""}</p>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg px-2.5 py-1.5">
                    <p className="text-[#9CA3AF]">Budget</p>
                    <p className="font-semibold text-[#111827]">{req.budget}</p>
                </div>
            </div>

            <p className="text-[12px] text-[#6B7280] leading-relaxed mb-4 line-clamp-3">{req.description}</p>

            {/* Actions */}
            {!showReject ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        disabled={acting !== null}
                        className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                    >
                        {acting === "accept" ? <Loader2 size={11} className="animate-spin" /> : <ThumbsUp size={11} />}
                        Accept
                    </button>
                    <button
                        onClick={() => setShowReject(true)}
                        disabled={acting !== null}
                        className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] transition-colors"
                    >
                        <ThumbsDown size={11} className="inline mr-1" />
                        Decline
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Brief reason for declining (optional)…"
                        className="w-full h-16 px-3 py-2 rounded-xl border-[1.5px] border-[#E5E7EB] text-[11px] resize-none outline-none focus:border-[#EF4444] placeholder:text-[#D1D5DB] transition-colors"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowReject(false)}
                            className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={acting !== null}
                            className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
                        >
                            {acting === "reject" ? <Loader2 size={10} className="animate-spin" /> : null}
                            Confirm Decline
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}