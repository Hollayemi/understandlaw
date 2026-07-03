"use client";
import { useState } from "react";
import { Clock, Loader2, X, Activity, Gavel, Star, ThumbsUp, ThumbsDown, } from "lucide-react";
import { ConsultStatus, Consultation, MatchRequest } from "@/redux/types/consultation";
import { STATUS_CFG, MODE_CFG } from "@/app/components/config";
import { useRouter } from "next/navigation";

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

export function ConsultationDrawer({
    consult,
    onClose,
    onAccept,
    onReject,
}: {
    consult: Consultation;
    onClose: () => void;
    onAccept: (id: string, reason?: string) => void;
    onReject: (id: string) => void;
}) {
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const modeConfig = MODE_CFG[consult.mode];
    const ModeIcon = modeConfig.icon;

    const router = useRouter();

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

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                <div className="h-1 w-full flex-shrink-0" style={{
                    background: consult.status === "disputed"
                        ? "#EF4444"
                        : consult.status === "completed"
                            ? "#10B981"
                            : "linear-gradient(90deg, #E8317A, #ff6fa8)"
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
                </div>

                <div className="flex-1 p-6 space-y-5">
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
                                <p className="text-[12px] text-[#92400E] mt-2 leading-relaxed">"{consult.ratingNote}"</p>
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
                            <button onClick={() => router.push("/dashboard/chat")} className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
                                Open Conversation
                            </button>
                        </div>
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
                    <p className="font-semibold text-[#111827]">{req.specialism}</p>
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
                        style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
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