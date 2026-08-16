"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, CheckCircle, ChevronRight, Eye, AlertTriangle, DollarSign, TrendingUp, Activity, Timer, Star, Bell, Search, Zap, Inbox } from "lucide-react";
import { ConsultStatus, Consultation, MatchRequest } from "@/redux/types/consultation";
import { MODE_CFG } from "@/app/components/config";
import { StarRating, StatusBadge, MatchRequestCard } from "../components/lawyer";
import { ConsultationDrawer } from "../components/lawyer";
import {
  useGetLawyerConsultationsQuery,
  useGetLawyerStatsQuery,
  useGetMatchRequestsQuery,
  useAcceptConsultationMutation,
  useRejectConsultationMutation,
  useAcceptMatchRequestMutation,
  useRejectMatchRequestMutation,
  useCompleteConsultationMutation,
} from "@/redux/slices/consultation.slice";

export default function LawyerConsultationsPage() {
  const [activeSection, setActiveSection] = useState<"consultations" | "matches">("consultations");
  const [tab, setTab] = useState<ConsultStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Query params
  const consultationParams = useMemo(() => ({
    status: tab === "all" ? undefined : tab,
    search: search || undefined,
    page,
    pageSize,
  }), [tab, search, page, pageSize]);

  // RTK Query hooks
  const { 
    data: consultationsData, 
    isLoading: isLoadingConsultations,
    refetch: refetchConsultations 
  } = useGetLawyerConsultationsQuery(consultationParams);
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats 
  } = useGetLawyerStatsQuery();
  
  const { 
    data: matchRequestsData, 
    isLoading: isLoadingMatches,
    refetch: refetchMatches 
  } = useGetMatchRequestsQuery({ status: "pending", page, pageSize });
  
  const [acceptConsultation] = useAcceptConsultationMutation();
  const [rejectConsultation] = useRejectConsultationMutation();
  const [acceptMatchRequest] = useAcceptMatchRequestMutation();
  const [rejectMatchRequest] = useRejectMatchRequestMutation();
  const [completeConsultation] = useCompleteConsultationMutation();

  const consultations = consultationsData?.data?.data || [];
  const matchRequests = matchRequestsData?.data?.data || [];
  
  const stats = statsData?.data || {
    total: 0,
    active: 0,
    awaitingLawyer: 0,
    completed: 0,
    disputed: 0,
    cancelled: 0,
    totalEarnings: 0,
    averageRating: 0,
    completionRate: 0,
  };

  const filtered = useMemo(() => {
    if (!search) return consultations;
    const q = search.toLowerCase();
    return consultations.filter(c => 
      c.topic.toLowerCase().includes(q) ||
      c.citizen.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [consultations, search]);

  const handleAcceptConsultation = async (id: string) => {
    try {
      await acceptConsultation(id).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to accept consultation:", error);
    }
  };

  const handleRejectConsultation = async (id: string, reason?: string) => {
    try {
      await rejectConsultation({ id, reason: reason || "" }).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to reject consultation:", error);
    }
  };

  const handleCompleteConsultation = async (id: string) => {
    try {
      await completeConsultation(id).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to complete consultation:", error);
    }
  };

  const handleAcceptMatch = async (id: string) => {
    try {
      await acceptMatchRequest(id).unwrap();
      refetchMatches();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to accept match request:", error);
    }
  };

  const handleRejectMatch = async (id: string, reason?: string) => {
    try {
      await rejectMatchRequest({ id, reason }).unwrap();
      refetchMatches();
    } catch (error) {
      console.error("Failed to reject match request:", error);
    }
  };

  const pendingMatches = matchRequests.filter(r => r.status === "pending");

  if (isLoadingConsultations || isLoadingStats || isLoadingMatches) {
    return (
      <div className="flex-1 bg-[#F5F2EE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading your consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selected && (
        <ConsultationDrawer
          consult={selected}
          onClose={() => setSelected(null)}
          onAccept={handleAcceptConsultation}
          onReject={handleRejectConsultation}
          // onComplete={handleCompleteConsultation}
        />
      )}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-semibold text-gray-800">My Briefs</span>
          </div>
          <div className="flex items-center gap-2">
            {stats.awaitingLawyer > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] text-[11px] font-bold text-[#7C3AED]">
                <Bell size={11} />
                {stats.awaitingLawyer} action{stats.awaitingLawyer > 1 ? "s" : ""} needed
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
            <h1 className="text-xl font-bold text-[#111827]">My Briefs</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Manage briefing requests, track active sessions, and review your earnings.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Action Required",
                value: stats.awaitingLawyer,
                icon: Timer,
                color: "#7C3AED",
                bg: "#FFF0F5",
                urgent: stats.awaitingLawyer > 0,
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
                value: stats.averageRating ? stats.averageRating.toFixed(1) : "—",
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
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
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
                <p className="text-2xl font-bold text-white">NGN {stats.totalEarnings?.toLocaleString() || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <DollarSign size={18} className="text-[#7C3AED]" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {stats.completionRate ? `${Math.round(stats.completionRate)}%` : "—"}
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
              { id: "consultations" as const, label: "Briefs", icon: MessageSquare, count: consultations.length },
              // { id: "matches" as const, label: "Matched Requests", icon: Zap, count: pendingMatches.length },
            ]).map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeSection === s.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                  <Icon size={13} />
                  {s.label}
                  {s.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeSection === s.id ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
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
                    className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors bg-white"
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
                        <span className={`text-[10px] px-1 py-0.5 rounded-full font-bold ${tab === opt.v ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{count}</span>
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
                            <p className="text-sm text-[#9CA3AF]">No briefs match your filters.</p>
                          </td>
                        </tr>
                      ) : filtered.map(c => {
                        const ModeIcon = MODE_CFG[c.mode]?.icon || MessageSquare;
                        return (
                          <tr key={c.id}
                            className={`hover:bg-[#F9FAFB] transition-colors cursor-pointer ${c.status === "disputed" ? "bg-red-50/30" : c.status === "awaiting_lawyer" ? "bg-pink-50/20" : ""}`}
                            onClick={() => setSelected(c)}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${c.citizen?.color || "#7C3AED"}, ${c.citizen?.color || "#7C3AED"}80)` }}>
                                  {c.citizen?.initials || c.citizen?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <p className="text-[12px] font-semibold text-[#111827]">{c.citizen?.name}</p>
                                  <p className="text-[10px] text-[#9CA3AF]">{c.citizen?.state}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 max-w-[220px]">
                              <p className="text-[12px] text-[#374151] truncate">{c.topic}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5" style={{ color: MODE_CFG[c.mode]?.color || "#6B7280" }}>
                                <ModeIcon size={11} />
                                <span className="text-[11px] font-semibold">{MODE_CFG[c.mode]?.label || c.mode}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-[12px] font-bold text-[#111827]">NGN {c.lawyerPayout?.toLocaleString() || 0}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <StatusBadge status={c.status} />
                                {c.status === "awaiting_lawyer" && (
                                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse flex-shrink-0" />
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

              {/* Pagination */}
              {consultationsData?.data?.total && (
                <div className="flex items-center justify-between mt-4 pt-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#6B7280] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#111827] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[12px] text-[#9CA3AF]">
                    Page {page} of {Math.ceil(consultationsData.data.total / pageSize)}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(consultationsData.data.total / pageSize)}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#6B7280] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#111827] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
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
                  Citizens who requested a lawyer matching your specialisms. Accept to proceed with a brief.
                </p>
              </div>

              {pendingMatches.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-[#FFF0F5] border border-[#FBCFE8] rounded-2xl mb-5">
                  <AlertTriangle size={14} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
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