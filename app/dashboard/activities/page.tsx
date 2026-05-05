"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, MessageSquare, Video, Phone, Clock,
  CheckCircle, XCircle, AlertCircle, Calendar,
  Star, Download, RefreshCw, Filter, Search,
  ChevronDown, ArrowRight, Scale, BadgeCheck,
  FileText, MapPin, Loader2, Send, X, Eye,
  TrendingUp, Users, RotateCcw, Banknote,
  Bell, ClipboardList, UserPlus, ChevronUp,
} from "lucide-react";
import { REQUESTS, STATUS_META } from "./_components/data";
import { ConsultCard, LawyerRequestCard } from "./_components";

//  Types 
type RequestStatus = "pending" | "accepted" | "completed" | "declined" | "cancelled" | "matched";
type RequestKind   = "consultation" | "lawyer_request";
type ConsultMode   = "message" | "call" | "video";

interface TimelineEvent {
  time: string;
  label: string;
  note?: string;
}

interface ConsultRequest {
  id: string;
  kind: "consultation";
  lawyerName: string;
  lawyerInitials: string;
  lawyerColorA: string;
  lawyerColorB: string;
  lawyerTitle: string;
  mode: ConsultMode;
  topic: string;
  detail: string;
  status: RequestStatus;
  fee: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  timeline: TimelineEvent[];
  nbaNumber: string;
  receiptId?: string;
}

interface LawyerRequest {
  id: string;
  kind: "lawyer_request";
  specialism: string;
  urgency: string;
  location: string;
  budget: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  matchedLawyerName?: string;
  matchedLawyerInitials?: string;
  matchedLawyerColorA?: string;
  matchedLawyerColorB?: string;
  matchedAt?: string;
  timeline: TimelineEvent[];
}

type AnyRequest = ConsultRequest | LawyerRequest;


//  Main page 
export default function RequestsPage() {
  const [tab, setTab] = useState<"all" | "consultation" | "lawyer_request">("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");

  const stats = {
    total:     REQUESTS.length,
    active:    REQUESTS.filter(r => r.status === "pending" || r.status === "accepted" || r.status === "matched").length,
    completed: REQUESTS.filter(r => r.status === "completed").length,
    spent:     REQUESTS.filter((r): r is ConsultRequest => r.kind === "consultation" && r.status === "completed")
                       .reduce((s, r) => s + r.fee, 0),
  };

  const filtered = REQUESTS.filter(r => {
    if (tab !== "all" && r.kind !== tab) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (r.kind === "consultation") {
        return r.topic.toLowerCase().includes(q) || r.lawyerName.toLowerCase().includes(q);
      } else {
        return r.specialism.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      }
    }
    return true;
  });

  const statusOptions: (RequestStatus | "all")[] = ["all", "pending", "accepted", "matched", "completed", "declined"];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-semibold text-gray-800">My Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/marketplace"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
            New Request
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 xl:px-8 py-7">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Requests</h1>
          <p className="text-sm text-gray-500">Track every consultation and lawyer request in one place.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { icon: ClipboardList, color: "#E8317A", bg: "#FFF0F5", border: "#FCE7F3", v: stats.total,     l: "Total Requests"   },
            { icon: RefreshCw,     color: "#3B82F6", bg: "#EFF6FF", border: "#DBEAFE", v: stats.active,    l: "Active"           },
            { icon: CheckCircle,   color: "#10B981", bg: "#ECFDF5", border: "#D1FAE5", v: stats.completed, l: "Completed"        },
            { icon: Banknote,      color: "#F59E0B", bg: "#FFFBEB", border: "#FEF3C7", v: `NGN ${stats.spent.toLocaleString()}`, l: "Total Spent" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.l} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3.5"
                style={{ borderColor: s.border }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 leading-none">{s.v}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{s.l}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by topic, lawyer, or issue..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
              />
            </div>

            {/* Kind tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0">
              {([["all","All"], ["consultation","Consultations"], ["lawyer_request","Lawyer Requests"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${tab === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {statusOptions.map(s => {
              const active = statusFilter === s;
              const meta = s !== "all" ? STATUS_META[s] : null;
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    active ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                  }`}>
                  {s === "all" ? "All Status" : meta?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ClipboardList size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 mb-1">No requests found</p>
            <p className="text-xs text-gray-400 mb-5">Try adjusting your filters or start a new request.</p>
            <Link href="/dashboard/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              Browse Lawyers <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Pinned: active requests */}
            {filtered.some(r => r.status === "pending" || r.status === "accepted" || r.status === "matched") && (
              <div className="mb-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 rounded-full bg-[#E8317A]" />
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active</p>
                  <span className="text-[10px] bg-[#E8317A] text-white font-bold px-2 py-0.5 rounded-full">
                    {filtered.filter(r => ["pending","accepted","matched"].includes(r.status)).length}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {filtered
                    .filter(r => ["pending","accepted","matched"].includes(r.status))
                    .map(r => r.kind === "consultation"
                      ? <ConsultCard key={r.id} req={r as ConsultRequest} />
                      : <LawyerRequestCard key={r.id} req={r as LawyerRequest} />
                    )}
                </div>
              </div>
            )}

            {/* Past */}
            {filtered.some(r => !["pending","accepted","matched"].includes(r.status)) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 rounded-full bg-gray-300" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Past</p>
                </div>
                <div className="flex flex-col gap-4">
                  {filtered
                    .filter(r => !["pending","accepted","matched"].includes(r.status))
                    .map(r => r.kind === "consultation"
                      ? <ConsultCard key={r.id} req={r as ConsultRequest} />
                      : <LawyerRequestCard key={r.id} req={r as LawyerRequest} />
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
