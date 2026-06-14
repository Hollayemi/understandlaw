"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle, ChevronRight, Bell, Search, Plus, ArrowRight, MessageCircle, Zap, Receipt, Lock } from "lucide-react";
import { Consultation, ConsultStatus } from "@/redux/types/consultation";
import { getJourneyStep, StarRating, JourneyTracker, ConsultationDrawer, ConsultationCard } from "./components";
import {
  useGetCitizenConsultationsQuery,
  useGetCitizenStatsQuery,
  useRaiseDisputeMutation,
  useRequestRefundMutation,
  useSubmitRatingMutation,
} from "@/redux/slices/consultation.slice";

export default function CitizenConsultationsPage() {
  const [tab, setTab] = useState<ConsultStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Query params
  const queryParams = useMemo(() => ({
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
  } = useGetCitizenConsultationsQuery(queryParams);
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats 
  } = useGetCitizenStatsQuery();
  
  const [raiseDispute] = useRaiseDisputeMutation();
  const [requestRefund] = useRequestRefundMutation();
  const [submitRating] = useSubmitRatingMutation();

  const consultations = consultationsData?.data?.data || [];
  const stats = statsData?.data || {
    active: 0,
    awaitingLawyer: 0,
    completed: 0,
    totalSpent: 0,
    total: 0,
    cancelled: 0,
    disputed: 0,
    refunded: 0,
  };

  // UI Stats from API data
  const uiStats = useMemo(() => ({
    active: stats.active || 0,
    waiting: stats.awaitingLawyer || 0,
    completed: stats.completed || 0,
    totalSpent: stats?.total || 0,
  }), [stats]);

  const filtered = useMemo(() => {
    // API already filters, this is just for local search refinement
    if (!search) return consultations;
    const q = search.toLowerCase();
    return consultations.filter(c => 
      c.topic.toLowerCase().includes(q) ||
      c.lawyer?.name?.toLowerCase().includes(q)
    );
  }, [consultations, search]);

  const handleRaiseDispute = async (id: string, reason: string) => {
    try {
      await raiseDispute({ consultationId: id, reason }).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to raise dispute:", error);
    }
  };

  const handleRequestRefund = async (id: string, reason?: string) => {
    try {
      await requestRefund({ consultationId: id, reason }).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to request refund:", error);
    }
  };

  const handleSubmitRating = async (id: string, rating: number, comment: string) => {
    try {
      await submitRating({ consultationId: id, rating, comment }).unwrap();
      refetchConsultations();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const needsAction = consultations.filter(
    c => c.status === "active" || c.status === "awaiting_lawyer" || (c.status === "completed" && !c.rating)
  ).length;

  if (isLoadingConsultations || isLoadingStats) {
    return (
      <div className="flex-1 bg-[#F5F2EE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8317A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
          onRaiseDispute={handleRaiseDispute}
          onRequestRefund={handleRequestRefund}
          onSubmitRating={handleSubmitRating}
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
            {needsAction > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] text-[11px] font-bold text-[#E8317A]">
                <Bell size={11} />
                {needsAction} need{needsAction === 1 ? "s" : ""} attention
              </div>
            )}
            <Link
              href="/dashboard/marketplace"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              <Plus size={13} />
              Book a Lawyer
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 xl:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#111827]">My Consultations</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Track your legal consultations, read replies, and review your lawyers.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Active", value: uiStats.active, color: "#10B981", bg: "#ECFDF5", icon: MessageCircle },
              { label: "Awaiting", value: uiStats.waiting, color: "#E8317A", bg: "#FFF0F5", icon: Clock, pulse: uiStats.waiting > 0 },
              { label: "Completed", value: uiStats.completed, color: "#3B82F6", bg: "#EFF6FF", icon: CheckCircle },
              { label: "Total Spent", value: `NGN ${(uiStats.totalSpent / 1000).toFixed(0)}k`, color: "#6B7280", bg: "#F9FAFB", icon: Receipt },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`bg-white rounded-2xl border p-4 ${s.pulse ? "border-[#FBCFE8]" : "border-[#F3F4F6]"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                      <Icon size={13} style={{ color: s.color }} />
                    </div>
                    {s.pulse && <span className="w-2 h-2 rounded-full bg-[#E8317A] animate-pulse" />}
                  </div>
                  <p className="text-[18px] font-bold text-[#111827]">{s.value}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-3 p-4 bg-white border border-[#F3F4F6] rounded-2xl mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
              <Lock size={13} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#111827]">Your consultations are confidential</p>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-0.5">
                Everything said between you and your lawyer is protected by attorney-client privilege under Nigerian law. LawTicha staff cannot read your conversations.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by topic or lawyer name…"
                className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors bg-white"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 overflow-x-auto flex-shrink-0">
              {([
                { v: "all", l: "All" },
                { v: "awaiting_lawyer", l: "Waiting" },
                { v: "active", l: "Active" },
                { v: "completed", l: "Done" },
                { v: "disputed", l: "Disputed" },
              ] as const).map(opt => {
                const count = consultations.filter(c => opt.v === "all" ? true : c.status === opt.v).length;
                return (
                  <button
                    key={opt.v}
                    onClick={() => setTab(opt.v)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      tab === opt.v ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    {opt.l}
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1 py-0.5 rounded-full font-bold ${
                          tab === opt.v ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} className="text-[#D1D5DB]" />
              </div>
              <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No consultations yet</p>
              <p className="text-[12px] text-[#D1D5DB] mb-5 leading-relaxed max-w-xs mx-auto">
                When you book a lawyer, your consultation will appear here so you can track it.
              </p>
              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
              >
                <Zap size={13} /> Find a Lawyer
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(c => (
                <ConsultationCard
                  key={c.id}
                  consult={c}
                  onClick={() => setSelected(c)}
                />
              ))}
              
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
            </div>
          )}

          {/* Book another CTA */}
          {filtered.length > 0 && (
            <div className="mt-6 bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-0.5">Need legal help?</p>
                <p className="text-[14px] font-bold text-white leading-snug">Browse 200+ verified lawyers</p>
              </div>
              <Link
                href="/dashboard/marketplace"
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border border-white/20 hover:bg-white/10 transition-all whitespace-nowrap"
              >
                Book Now <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}