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

//  Mock data 
const REQUESTS: AnyRequest[] = [
  {
    id: "c001",
    kind: "consultation",
    lawyerName: "Adaeze Okonkwo",
    lawyerInitials: "AO",
    lawyerColorA: "#1E3A5F",
    lawyerColorB: "#2D5A8E",
    lawyerTitle: "Criminal & Civil Rights Lawyer",
    mode: "video",
    topic: "My landlord locked me out without a court order",
    detail: "The landlord changed the locks on Saturday evening without any notice or court order. I have 4 months left on my tenancy agreement.",
    status: "completed",
    fee: 18000,
    createdAt: "Apr 14, 2025 · 09:22",
    scheduledAt: "Apr 15, 2025 · 14:00",
    completedAt: "Apr 15, 2025 · 14:48",
    rating: 5,
    nbaNumber: "NBA/LAG/2014/01847",
    receiptId: "RCP-2025-04140098",
    timeline: [
      { time: "Apr 14 · 09:22", label: "Request sent" },
      { time: "Apr 14 · 10:08", label: "Lawyer accepted", note: "Adaeze confirmed and sent a pre-session briefing." },
      { time: "Apr 14 · 10:15", label: "Payment processed", note: "NGN 18,000 charged via Paystack." },
      { time: "Apr 15 · 14:00", label: "Video session started" },
      { time: "Apr 15 · 14:48", label: "Session completed", note: "Duration: 48 minutes." },
      { time: "Apr 15 · 15:02", label: "You submitted a review" },
    ],
  },
  {
    id: "c002",
    kind: "consultation",
    lawyerName: "Emeka Nwosu",
    lawyerInitials: "EN",
    lawyerColorA: "#1A3B2E",
    lawyerColorB: "#2D6A4F",
    lawyerTitle: "Property & Tenancy Lawyer",
    mode: "message",
    topic: "Severance pay entitlement after retrenchment",
    detail: "I was retrenched two weeks ago and my employer claims I am not entitled to severance because I was on a probationary contract.",
    status: "accepted",
    fee: 4500,
    createdAt: "Apr 19, 2025 · 16:44",
    scheduledAt: undefined,
    nbaNumber: "NBA/ABJ/2012/00934",
    timeline: [
      { time: "Apr 19 · 16:44", label: "Request sent" },
      { time: "Apr 19 · 18:30", label: "Lawyer accepted", note: "Emeka confirmed. Written consultation in progress." },
      { time: "Apr 19 · 18:35", label: "Payment processed", note: "NGN 4,500 charged via Paystack." },
    ],
  },
  {
    id: "c003",
    kind: "consultation",
    lawyerName: "Fatimah Bello",
    lawyerInitials: "FB",
    lawyerColorA: "#2D1A3B",
    lawyerColorB: "#4A2D6A",
    lawyerTitle: "Family & Domestic Rights Lawyer",
    mode: "call",
    topic: "Child custody arrangement after separation",
    detail: "Separated 3 months ago. Need clarity on what custody arrangement I can request and the correct process.",
    status: "pending",
    fee: 9000,
    createdAt: "Apr 21, 2025 · 11:05",
    scheduledAt: undefined,
    nbaNumber: "NBA/KAN/2016/02211",
    timeline: [
      { time: "Apr 21 · 11:05", label: "Request sent", note: "Awaiting lawyer confirmation." },
    ],
  },
  {
    id: "c004",
    kind: "consultation",
    lawyerName: "Ngozi Eze",
    lawyerInitials: "NE",
    lawyerColorA: "#2D1A1A",
    lawyerColorB: "#7B2828",
    lawyerTitle: "Employment & Labour Lawyer",
    mode: "message",
    topic: "Workplace harassment — NSITF contribution dispute",
    detail: "",
    status: "declined",
    fee: 4500,
    createdAt: "Apr 10, 2025 · 08:33",
    nbaNumber: "NBA/PHC/2017/01563",
    timeline: [
      { time: "Apr 10 · 08:33", label: "Request sent" },
      { time: "Apr 10 · 20:17", label: "Lawyer declined", note: "Ngozi is at capacity. No charge was made." },
    ],
  },
  {
    id: "lr001",
    kind: "lawyer_request",
    specialism: "Employment Law",
    urgency: "This week",
    location: "Lagos",
    budget: "NGN 5,000 - 15,000",
    description: "My employer deducted an undisclosed amount from my salary for three months and refuses to give an explanation. I need a labour lawyer to send a formal letter.",
    status: "matched",
    createdAt: "Apr 17, 2025 · 13:15",
    matchedLawyerName: "Ngozi Eze",
    matchedLawyerInitials: "NE",
    matchedLawyerColorA: "#2D1A1A",
    matchedLawyerColorB: "#7B2828",
    matchedAt: "Apr 17, 2025 · 15:04",
    timeline: [
      { time: "Apr 17 · 13:15", label: "Request submitted" },
      { time: "Apr 17 · 13:16", label: "Matching in progress", note: "Searching verified lawyers in Lagos with Employment Law specialism." },
      { time: "Apr 17 · 15:04", label: "Lawyer matched", note: "Ngozi Eze accepted your request." },
    ],
  },
  {
    id: "lr002",
    kind: "lawyer_request",
    specialism: "Property & Tenancy",
    urgency: "Today (urgent)",
    location: "Abuja",
    budget: "NGN 5,000 - 15,000",
    description: "Agent collected one year rent plus two years caution and has gone dark. Need a property lawyer today.",
    status: "pending",
    createdAt: "Apr 21, 2025 · 07:48",
    timeline: [
      { time: "Apr 21 · 07:48", label: "Request submitted" },
      { time: "Apr 21 · 07:49", label: "Matching in progress", note: "Searching verified lawyers in Abuja with Property specialism." },
    ],
  },
];

//  Helpers 
const STATUS_META: Record<RequestStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",    bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", icon: Clock       },
  accepted:  { label: "In Progress",bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD", icon: RefreshCw   },
  completed: { label: "Completed",  bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", icon: CheckCircle },
  declined:  { label: "Declined",   bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", icon: XCircle     },
  cancelled: { label: "Cancelled",  bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB", icon: X           },
  matched:   { label: "Matched",    bg: "#F5F3FF", text: "#4C1D95", border: "#C4B5FD", icon: BadgeCheck  },
};

const MODE_META: Record<ConsultMode, { icon: React.ElementType; label: string }> = {
  message: { icon: MessageSquare, label: "Written Message" },
  call:    { icon: Phone,         label: "Scheduled Call"  },
  video:   { icon: Video,         label: "Video Session"   },
};

function StatusBadge({ status }: { status: RequestStatus }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
      style={{ background: m.bg, color: m.text, borderColor: m.border }}>
      <Icon size={10} />
      {m.label}
    </span>
  );
}

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

//  Timeline 
function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="flex flex-col gap-0">
      {events.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${i === events.length - 1 ? "bg-[#E8317A]" : "bg-gray-300"}`} />
            {i < events.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-gray-400 font-medium">{e.time}</span>
              <span className="text-xs font-semibold text-gray-900">{e.label}</span>
            </div>
            {e.note && <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{e.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

//  Consult Card 
function ConsultCard({ req }: { req: ConsultRequest }) {
  const [expanded, setExpanded] = useState(false);
  const ModeIcon = MODE_META[req.mode].icon;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${expanded ? "border-gray-200 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}>
      {/* Accent line */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${req.lawyerColorA}, ${req.lawyerColorB})` }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${req.lawyerColorA}, ${req.lawyerColorB})` }}>
            {req.lawyerInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{req.lawyerName}</p>
                <p className="text-[11px] text-gray-500">{req.lawyerTitle}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>
          </div>
        </div>

        {/* Topic */}
        <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Topic</p>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{req.topic}</p>
          {req.detail && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{req.detail}</p>}
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
            <ModeIcon size={11} className="text-gray-400" />
            {MODE_META[req.mode].label}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
            <Calendar size={11} className="text-gray-400" />
            {req.createdAt}
          </div>
          {req.fee > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg"
              style={{ color: req.status === "declined" ? "#9CA3AF" : "#065F46" }}>
              <Banknote size={11} />
              {req.status === "declined" ? "No charge" : `NGN ${req.fee.toLocaleString()}`}
            </div>
          )}
          {req.rating && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
              <StarRating n={req.rating} />
            </div>
          )}
        </div>

        {/* Receipt */}
        {req.receiptId && req.status === "completed" && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText size={12} className="text-gray-400" />
              Receipt <span className="font-mono text-gray-700">{req.receiptId}</span>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline">
              <Download size={10} /> Download
            </button>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2">
          {req.status === "accepted" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              <MessageSquare size={12} /> Open Messages
            </button>
          )}
          {req.status === "pending" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
              <X size={12} /> Cancel Request
            </button>
          )}
          {req.status === "completed" && !req.rating && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              <Star size={12} /> Leave a Review
            </button>
          )}
          {req.status === "declined" && (
            <Link href="/dashboard/marketplace"
              className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              <ArrowRight size={12} /> Find Another Lawyer
            </Link>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            {expanded ? <><ChevronUp size={12} /> Hide</> : <><Eye size={12} /> Timeline</>}
          </button>
        </div>

        {/* Timeline (expanded) */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Activity Timeline</p>
            <Timeline events={req.timeline} />
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BadgeCheck size={12} className="text-[#E8317A]" />
                NBA Registration: <span className="font-mono text-gray-700">{req.nbaNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//  Lawyer Request Card 
function LawyerRequestCard({ req }: { req: LawyerRequest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${expanded ? "border-gray-200 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}>
      <div className="h-0.5 w-full bg-gradient-to-r from-[#0B1120] to-[#E8317A]" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <UserPlus size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Lawyer Match Request</p>
              <p className="text-[11px] text-gray-500">{req.specialism}</p>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Issue</p>
          <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{req.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { icon: Scale,    v: req.specialism },
            { icon: Clock,    v: req.urgency    },
            { icon: MapPin,   v: req.location || "Any state" },
            { icon: Banknote, v: req.budget     },
          ].map(({ icon: Icon, v }) => (
            <div key={v} className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
              <Icon size={10} className="text-gray-400" />
              {v}
            </div>
          ))}
        </div>

        {/* Matched lawyer */}
        {req.status === "matched" && req.matchedLawyerName && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border mb-4"
            style={{ background: "#F5F3FF", borderColor: "#C4B5FD" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${req.matchedLawyerColorA}, ${req.matchedLawyerColorB})` }}>
              {req.matchedLawyerInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-purple-900">Matched with {req.matchedLawyerName}</p>
              <p className="text-[10px] text-purple-600">{req.matchedAt}</p>
            </div>
            <BadgeCheck size={16} className="text-purple-500 flex-shrink-0" />
          </div>
        )}

        {req.status === "pending" && (
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
            <Loader2 size={13} className="text-amber-600 animate-spin flex-shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium">Searching for a verified match...</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {req.status === "matched" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              <Send size={12} /> Contact Lawyer
            </button>
          )}
          {req.status === "pending" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
              <X size={12} /> Cancel
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            {expanded ? <><ChevronUp size={12} /> Hide</> : <><Eye size={12} /> Timeline</>}
          </button>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Activity Timeline</p>
            <Timeline events={req.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}

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
