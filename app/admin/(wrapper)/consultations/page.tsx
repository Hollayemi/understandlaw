"use client";
import React, { useState } from "react";
import {
  MessageSquare, AlertTriangle, DollarSign, TrendingUp, Eye, Flag, Search, Download,Loader2, Zap, BarChart3, Activity, Timer, Gavel,
} from "lucide-react";
import {
  StatBar, PageHeader,
} from "../_components";
import {
  useAdminListConsultationsQuery,
  useAdminGetConsultationStatsQuery,
  useAdminListMatchRequestsQuery,
  useAdminGetLawyerPerformanceQuery,
  useAdminBulkAutoMatchMutation,
} from "@/redux/slices/admin/consultation.slice";
import { ConsultStatus, ConsultMode, Consultation, MatchRequest } from "@/redux/types/consultation";
import {  ConsultStatusBadge, TranscriptDrawer, MatchCard, LawyerPerformanceRow, } from "./components"
import { MODE_CFG } from "@/app/components/config";
import { MatchRequestDrawer } from "./matchDrawer";

export default function ConsultationsPage() {
  const [tab, setTab] = useState<"all" | ConsultStatus>("all");
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<ConsultMode | "all">("all");
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchRequest | null>(null);
  const [activeSection, setActiveSection] = useState<"consultations" | "matches" | "performance">("consultations");
  const [matchRefreshKey, setMatchRefreshKey] = useState(0);

  const { data: consultationsData, isLoading: consultationsLoading } = useAdminListConsultationsQuery({
    status: tab === "all" ? undefined : tab,
    mode: modeFilter === "all" ? undefined : modeFilter,
    search: search || undefined,
  });

  const { data: statsData } = useAdminGetConsultationStatsQuery();
  const { data: matchRequestsData, refetch: refetchMatches } = useAdminListMatchRequestsQuery({});
  const { data: performanceData } = useAdminGetLawyerPerformanceQuery({});
  const [bulkAutoMatch] = useAdminBulkAutoMatchMutation();

  
  const consultations = consultationsData?.data?.data || [];
  const matchRequests = matchRequestsData?.data?.data || [];
  const lawyerStats = performanceData?.data || [];
  console.log({matchRequests})

  const refreshMatches = () => {
    refetchMatches();
    setMatchRefreshKey(prev => prev + 1);
  };

  const handleBulkAutoMatch = async () => {
    try {
      await bulkAutoMatch().unwrap();
      refreshMatches();
    } catch (error) {
      console.error("Failed to bulk auto-match:", error);
    }
  };

  // Stats from API or computed fallback
  const total = statsData?.total || consultations.length;
  const active = statsData?.active || consultations.filter(c => c.status === "active" || c.status === "awaiting_lawyer").length;
  const disputed = statsData?.disputed || consultations.filter(c => c.disputed).length;
  const totalRev = statsData?.totalRevenue || 0;
  const platformRev = statsData?.platformRevenue || 0;
  const unassignedCount = matchRequests.filter(m => m.status === "unassigned").length;

  const filtered = consultations;

  React.useEffect(() => {
  }, [tab, modeFilter, search]);

  return (
    <>
      {selectedConsult && (
        <TranscriptDrawer consult={selectedConsult} onClose={() => setSelectedConsult(null)} />
      )}

      {selectedMatch && (
        <MatchRequestDrawer
          req={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onUpdate={refreshMatches}
        />
      )}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Consultations"
          subtitle="Monitor all citizen-lawyer sessions, manage disputes, and review lawyer performance."
          action={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
              <Download size={13} /> Export CSV
            </button>
          }
        />

        <StatBar items={[
          { label: "Total Sessions", value: total, icon: MessageSquare, color: "#7C3AED", bg: "#FFF0F5" },
          { label: "Active", value: active, icon: Activity, color: "#10B981", bg: "#ECFDF5" },
          { label: "Disputed", value: disputed, icon: Gavel, color: "#EF4444", bg: "#FEF2F2" },
          { label: "Unassigned", value: unassignedCount, icon: Timer, color: "#F59E0B", bg: "#FFFBEB" },
        ]} />

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gross Consultation Revenue</p>
              <p className="text-2xl font-bold text-white">NGN {totalRev.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign size={18} className="text-[#7C3AED]" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#065F46] to-[#0D9488] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Platform Commission Earned</p>
              <p className="text-2xl font-bold text-white">NGN {platformRev.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-300" />
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
          {([
            { id: "consultations", label: "Consultations", icon: MessageSquare, count: consultations.length },
            { id: "matches", label: "Match Requests", icon: Zap, count: matchRequests.filter(m => m.status !== "matched").length },
            { id: "performance", label: "Lawyer Performance", icon: BarChart3, count: null },
          ] as const).map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeSection === s.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                <Icon size={13} /> {s.label}
                {s.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeSection === s.id ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeSection === "consultations" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by ID, name, or topic…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 overflow-x-auto">
                {([
                  { v: "all", l: "All" },
                  { v: "active", l: "Active" },
                  { v: "awaiting_lawyer", l: "Awaiting" },
                  { v: "completed", l: "Completed" },
                  { v: "disputed", l: "Disputed" },
                  { v: "pending", l: "Pending" },
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

              <select value={modeFilter} onChange={e => setModeFilter(e.target.value as ConsultMode | "all")}
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#7C3AED] transition-colors ml-auto">
                <option value="all">All Modes</option>
                <option value="message">Written</option>
                <option value="call">Call</option>
                <option value="video">Video</option>
              </select>
            </div>

            {consultationsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#7C3AED]" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        {["ID", "Citizen", "Lawyer", "Topic", "Mode", "Fee", "Status", "Date", ""].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F9FAFB]">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-5 py-16 text-center">
                            <MessageSquare size={32} className="text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-sm text-[#9CA3AF]">No consultations match your filters.</p>
                          </td>
                        </tr>
                      ) : filtered.map((c, i) => {
                        const ModeIcon = MODE_CFG[c.mode].icon;
                        return (
                          <tr key={c.id} className={`hover:bg-[#F9FAFB] transition-colors ${c.disputed ? "bg-red-50/30" : ""}`}>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-mono font-bold text-[#9CA3AF]">{i+1}</span>
                                {c.flagged && <Flag size={11} className="text-[#EF4444]" />}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${c.citizen.color}, ${c.citizen.color}80)` }}>
                                  {c.citizen.initials}
                                </div>
                                <div>
                                  <p className="text-[12px] font-semibold text-[#111827]">{c.citizen.name}</p>
                                  {/* <p className="text-[10px] text-[#9CA3AF]">{c.citizen.state}</p> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${c.lawyer.color}, ${c.lawyer.color}80)` }}>
                                  {c.lawyer.initials}
                                </div>
                                <p className="text-[12px] font-semibold text-[#111827]">{c.lawyer.name}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 max-w-[180px]">
                              <p className="text-[12px] text-[#374151] truncate">{c.topic}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5" style={{ color: MODE_CFG[c.mode].color }}>
                                <ModeIcon size={11} />
                                <span className="text-[11px] font-semibold">{MODE_CFG[c.mode].label}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-[12px] flex flex-nowrap font-bold text-[#111827]">
                                NGN {c.fee.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <ConsultStatusBadge status={c.status} />
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-[11px] text-[#9CA3AF] whitespace-nowrap">{c.createdAt.split("·")[0].trim()}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <button onClick={() => setSelectedConsult(c)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
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
            )}

            <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
              <span>Showing {filtered.length} of {consultations.length} consultations</span>
            </div>
          </>
        )}

        {activeSection === "matches" && (
          <>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[15px] font-bold text-[#111827]">Lawyer Match Requests</h2>
                <span className="text-[11px] text-[#9CA3AF]">{matchRequests.filter(m => m.status === "unassigned").length} need attention</span>
              </div>
              <p className="text-[12px] text-[#9CA3AF]">
                Citizens who used "Request a Lawyer", unassigned requests require a manual or auto-match.
              </p>
            </div>

            {matchRequests.some(m => m.status === "unassigned") && (
              <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl mb-5">
                <AlertTriangle size={15} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-[#991B1B] mb-0.5">
                    {matchRequests.filter(m => m.status === "unassigned").length} unassigned request{matchRequests.filter(m => m.status === "unassigned").length > 1 ? "s" : ""}, action required
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">Urgent requests expire after 24 hours. Citizens are waiting for a match.</p>
                </div>
                <button onClick={handleBulkAutoMatch} className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors flex-shrink-0">
                  <Zap size={11} /> Auto-Match All
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchRequests.map(req => (
                <MatchCard key={`${req.id}-${matchRefreshKey}`} req={req} onUpdate={refreshMatches} onOpen={() => setSelectedMatch(req)} />
              ))}
            </div>
          </>
        )}

        {activeSection === "performance" && (
          <>
            <div className="mb-5">
              <h2 className="text-[15px] font-bold text-[#111827] mb-1">Lawyer Performance Metrics</h2>
              <p className="text-[12px] text-[#9CA3AF]">Based on all consultation data. Used to sort marketplace listings and award badges.</p>
            </div>

            {lawyerStats.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {lawyerStats.slice(0, 3).map((s, i) => (
                  <div key={s.lawyerId} className={`rounded-2xl p-4 border ${i === 0 ? "bg-gradient-to-br from-amber-50 to-white border-amber-200" : "bg-white border-[#F3F4F6]"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 0 ? "bg-amber-400 text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                        {i + 1}
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: `linear-gradient(135deg, ${s.lawyerColor}, ${s.lawyerColor}80)` }}>
                        {s.lawyerInitials}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#111827]">{s.lawyerName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[13px] font-bold text-[#111827]">{s.totalSessions}</p>
                        <p className="text-[9px] text-[#9CA3AF]">Sessions</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#10B981]">{s.averageRating > 0 ? s.averageRating.toFixed(1) : "—"}</p>
                        <p className="text-[9px] text-[#9CA3AF]">Rating</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#111827]">NGN {(s.totalRevenue / 1000).toFixed(0)}k</p>
                        <p className="text-[9px] text-[#9CA3AF]">Earned</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <h3 className="text-[13px] font-bold text-[#111827]">All Lawyer Metrics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F3F4F6]">
                      {["Lawyer", "Sessions", "Completion", "Avg Rating", "Disputes", "Total Payout"].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lawyerStats.map(s => (
                      <LawyerPerformanceRow
                        key={s.lawyerId}
                        lawyer={{
                          id: s.lawyerId,
                          name: s.lawyerName,
                          initials: s.lawyerInitials,
                          color: s.lawyerColor,
                          scnNumber: s.scnNumber,
                        }}
                        stats={{
                          total: s.totalSessions,
                          completed: s.completedSessions,
                          disputed: s.disputedSessions,
                          avgRating: s.averageRating,
                          totalRevenue: s.totalRevenue,
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}