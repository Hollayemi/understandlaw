"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Clock,
  Calendar,
  Star, Download, 
  ArrowRight, Scale, BadgeCheck,
  FileText, MapPin, Loader2, Send, X, Eye,
  Banknote,
  UserPlus, ChevronUp,
} from "lucide-react";
import { MODE_META, STATUS_META } from "./data";
import { ConsultRequest, LawyerRequest, RequestStatus, TimelineEvent } from "./types";

export function StatusBadge({ status }: { status: RequestStatus }) {
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

export function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

//  Timeline 
export function Timeline({ events }: { events: TimelineEvent[] }) {
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
export function ConsultCard({ req }: { req: ConsultRequest }) {
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
export function LawyerRequestCard({ req }: { req: LawyerRequest }) {
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
