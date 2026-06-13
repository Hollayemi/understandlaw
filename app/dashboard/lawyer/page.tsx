"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare, Phone, Video, Clock, CheckCircle, XCircle,
  ChevronRight, Eye, AlertTriangle, DollarSign, TrendingUp,
  Loader2, X, Check, RotateCcw, Activity, Timer, Gavel,
  Star, ChevronDown, Bell, Calendar, Search, User, Zap,
  ArrowUpRight, BadgeCheck, Ban, ThumbsUp, ThumbsDown,
  Filter, BarChart3, Inbox, RefreshCw,
} from "lucide-react";
import { ConsultMode, ConsultStatus, Consultation, MatchRequest } from "@/redux/types/consultation";
import { STATUS_CFG } from "@/app/components/config";
import { MOCK_CONSULTATIONS, MOCK_MATCH_REQUESTS } from "./components/data";



const MODE_CFG: Record<ConsultMode, { label: string; icon: React.ElementType; color: string }> = {
  message: { label: "Written", icon: MessageSquare, color: "#6B7280" },
  call: { label: "Call", icon: Phone, color: "#3B82F6" },
  video: { label: "Video", icon: Video, color: "#8B5CF6" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ConsultStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ─── Consultation Detail Drawer ───────────────────────────────────────────────

function ConsultationDrawer({
  consult,
  onClose,
  onAccept,
  onReject,
}: {
  consult: Consultation;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const modeConfig = MODE_CFG[consult.mode];
  const ModeIcon = modeConfig.icon;

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
              <button className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
                Open Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Match Request Card ───────────────────────────────────────────────────────

function MatchRequestCard({
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

export default function LawyerConsultationsPage() {
  const [activeSection, setActiveSection] = useState<"consultations" | "matches">("consultations");
  const [tab, setTab] = useState<ConsultStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Consultation | null>(null);

  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>(MOCK_MATCH_REQUESTS);

  // Computed stats
  const stats = useMemo(() => {
    const total = consultations.length;
    const active = consultations.filter(c => c.status === "active").length;
    const pending = consultations.filter(c => c.status === "awaiting_lawyer").length;
    const completed = consultations.filter(c => c.status === "completed").length;
    const disputed = consultations.filter(c => c.status === "disputed").length;
    const earned = consultations.filter(c => c.status === "completed").reduce((s, c) => s + c.lawyerPayout, 0);
    const avgRating = (() => {
      const rated = consultations.filter(c => c.rating);
      return rated.length ? (rated.reduce((s, c) => s + (c.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
    })();
    return { total, active, pending, completed, disputed, earned, avgRating };
  }, [consultations]);

  const filtered = useMemo(() => {
    return consultations.filter(c => {
      if (tab !== "all" && c.status !== tab) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.topic.toLowerCase().includes(q) ||
          c.citizen.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [consultations, tab, search]);

  const handleAcceptConsultation = (id: string) => {
    setConsultations(prev =>
      prev.map(c => c.id === id ? { ...c, status: "active" as ConsultStatus } : c)
    );
  };

  const handleRejectConsultation = (id: string) => {
    setConsultations(prev =>
      prev.map(c => c.id === id ? { ...c, status: "cancelled" as ConsultStatus } : c)
    );
  };

  const handleAcceptMatch = (id: string) => {
    setMatchRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "matched" as const } : r)
    );
  };

  const handleRejectMatch = (id: string) => {
    setMatchRequests(prev => prev.filter(r => r.id !== id));
  };

  const pendingMatches = matchRequests.filter(r => r.status === "pending");

  return (
    <>
      {selected && (
        <ConsultationDrawer
          consult={selected}
          onClose={() => setSelected(null)}
          onAccept={handleAcceptConsultation}
          onReject={handleRejectConsultation}
        />
      )}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-semibold text-gray-800">My Consultations</span>
          </div>
          <div className="flex items-center gap-2">
            {stats.pending > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] text-[11px] font-bold text-[#E8317A]">
                <Bell size={11} />
                {stats.pending} action{stats.pending > 1 ? "s" : ""} needed
              </div>
            )}
            <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm">
              <Bell size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 xl:px-8 py-7">

          {/* Page header */}
          <div className="mb-7">
            <h1 className="text-xl font-bold text-[#111827]">My Consultations</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Manage consultation requests, track active sessions, and review your earnings.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Action Required",
                value: stats.pending,
                icon: Timer,
                color: "#E8317A",
                bg: "#FFF0F5",
                urgent: stats.pending > 0,
              },
              {
                label: "Active Sessions",
                value: stats.active,
                icon: Activity,
                color: "#10B981",
                bg: "#ECFDF5",
                urgent: false,
              },
              {
                label: "Completed",
                value: stats.completed,
                icon: CheckCircle,
                color: "#3B82F6",
                bg: "#EFF6FF",
                urgent: false,
              },
              {
                label: "Avg Rating",
                value: stats.avgRating,
                icon: Star,
                color: "#F59E0B",
                bg: "#FFFBEB",
                urgent: false,
              },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`bg-white rounded-2xl border p-4 transition-all ${s.urgent ? "border-[#FBCFE8] shadow-pink-100 shadow-md" : "border-[#F3F4F6]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                      <Icon size={14} style={{ color: s.color }} />
                    </div>
                    {s.urgent && (
                      <span className="w-2 h-2 rounded-full bg-[#E8317A] animate-pulse" />
                    )}
                  </div>
                  <p className="text-[22px] font-bold text-[#111827]">{s.value}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Earnings card */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Earnings (Completed)</p>
                <p className="text-2xl font-bold text-white">NGN {stats.earned.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <DollarSign size={18} className="text-[#E8317A]" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {stats.total > 0
                    ? `${Math.round((stats.completed / stats.total) * 100)}%`
                    : "—"}
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{stats.completed} of {stats.total} sessions</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                <TrendingUp size={18} className="text-[#10B981]" />
              </div>
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
            {([
              { id: "consultations" as const, label: "Consultations", icon: MessageSquare, count: consultations.length },
              { id: "matches" as const, label: "Match Requests", icon: Zap, count: pendingMatches.length },
            ]).map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeSection === s.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                  <Icon size={13} />
                  {s.label}
                  {s.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeSection === s.id ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {s.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Consultations section ─────────────────────────────────── */}
          {activeSection === "consultations" && (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative max-w-xs flex-1">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by topic, client, or ID…"
                    className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 overflow-x-auto">
                  {([
                    { v: "all", l: "All" },
                    { v: "awaiting_lawyer", l: "Action Needed" },
                    { v: "active", l: "Active" },
                    { v: "completed", l: "Completed" },
                    { v: "disputed", l: "Disputed" },
                    { v: "cancelled", l: "Cancelled" },
                  ] as const).map(opt => {
                    const count = opt.v === "all"
                      ? consultations.length
                      : consultations.filter(c => c.status === opt.v).length;
                    return (
                      <button key={opt.v} onClick={() => setTab(opt.v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${tab === opt.v ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                        {opt.l}
                        <span className={`text-[10px] px-1 py-0.5 rounded-full font-bold ${tab === opt.v ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        {["Client", "Topic", "Mode", "Payout", "Status", "Date", ""].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F9FAFB]">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-16 text-center">
                            <Inbox size={32} className="text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-sm text-[#9CA3AF]">No consultations match your filters.</p>
                          </td>
                        </tr>
                      ) : filtered.map(c => {
                        const ModeIcon = MODE_CFG[c.mode].icon;
                        return (
                          <tr key={c.id}
                            className={`hover:bg-[#F9FAFB] transition-colors cursor-pointer ${c.status === "disputed" ? "bg-red-50/30" : c.status === "awaiting_lawyer" ? "bg-pink-50/20" : ""}`}
                            onClick={() => setSelected(c)}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${c.citizen.color}, ${c.citizen.color}80)` }}>
                                  {c.citizen.initials}
                                </div>
                                <div>
                                  <p className="text-[12px] font-semibold text-[#111827]">{c.citizen.name}</p>
                                  <p className="text-[10px] text-[#9CA3AF]">{c.citizen.state}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 max-w-[220px]">
                              <p className="text-[12px] text-[#374151] truncate">{c.topic}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5" style={{ color: MODE_CFG[c.mode].color }}>
                                <ModeIcon size={11} />
                                <span className="text-[11px] font-semibold">{MODE_CFG[c.mode].label}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-[12px] font-bold text-[#111827]">NGN {c.lawyerPayout.toLocaleString()}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <StatusBadge status={c.status} />
                                {c.status === "awaiting_lawyer" && (
                                  <span className="w-2 h-2 rounded-full bg-[#E8317A] animate-pulse flex-shrink-0" />
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-[11px] text-[#9CA3AF] whitespace-nowrap">{c.createdAt}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={e => { e.stopPropagation(); setSelected(c); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
                <span>Showing {filtered.length} of {consultations.length} consultations</span>
              </div>
            </>
          )}

          {/* ── Match Requests section ────────────────────────────────── */}
          {activeSection === "matches" && (
            <>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[15px] font-bold text-[#111827]">Match Requests</h2>
                  <span className="text-[11px] text-[#9CA3AF]">{pendingMatches.length} pending your response</span>
                </div>
                <p className="text-[12px] text-[#9CA3AF]">
                  Citizens who requested a lawyer matching your specialisms. Accept to proceed with a consultation.
                </p>
              </div>

              {pendingMatches.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-[#FFF0F5] border border-[#FBCFE8] rounded-2xl mb-5">
                  <AlertTriangle size={14} className="text-[#E8317A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-bold text-[#9D174D] mb-0.5">
                      {pendingMatches.length} match request{pendingMatches.length > 1 ? "s" : ""} awaiting your decision
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">Requests expire after 24 hours. Citizens are waiting for a lawyer.</p>
                  </div>
                </div>
              )}

              {matchRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
                  <Inbox size={32} className="text-[#E5E7EB] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#9CA3AF]">No match requests right now</p>
                  <p className="text-[11px] text-[#D1D5DB] mt-1">New requests matching your specialisms will appear here.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {matchRequests.map(req => (
                    <MatchRequestCard
                      key={req.id}
                      req={req}
                      onAccept={handleAcceptMatch}
                      onReject={handleRejectMatch}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}