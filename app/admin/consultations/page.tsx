"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare, Video, Phone, Clock, CheckCircle, XCircle,
  AlertTriangle, DollarSign, TrendingUp, Users, Star,
  MoreHorizontal, Eye, Flag, RefreshCw, Shield, Filter,
  Search, ChevronRight, ChevronDown, ChevronUp, Download,
  Loader2, X, Check, Send, ArrowUpRight, Scale,
  Banknote, Calendar, MapPin, BadgeCheck, RotateCcw,
  Info, Zap, Award, BarChart3, CircleDot, Activity,
  UserCheck, UserX, Timer, Gavel, FileText, Plus,
} from "lucide-react";
import {
  StatBar, FilterBar, Table, StatusBadge, Avatar, PageHeader,
} from "../_components";

//  Types 
type ConsultStatus =
  | "pending_payment" | "awaiting_lawyer" | "active"
  | "completed" | "disputed" | "cancelled" | "refunded";
type ConsultMode = "message" | "call" | "video";
type MatchStatus = "unassigned" | "matching" | "matched" | "expired";

interface Message {
  id: string;
  sender: "citizen" | "lawyer";
  senderName: string;
  text: string;
  time: string;
}

interface Consultation {
  id: string;
  citizen: { id: string; name: string; initials: string; color: string; email: string; state: string };
  lawyer:  { id: string; name: string; initials: string; color: string; specialisms: string[]; nbaNumber: string };
  mode: ConsultMode;
  topic: string;
  detail: string;
  status: ConsultStatus;
  fee: number;
  platformFee: number;
  lawyerPayout: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  ratingNote?: string;
  duration?: string;
  disputed: boolean;
  disputeReason?: string;
  transcript: Message[];
  flagged: boolean;
  flagReason?: string;
  refundRequested: boolean;
}

interface MatchRequest {
  id: string;
  citizen: { name: string; initials: string; color: string; email: string; state: string };
  specialism: string;
  urgency: string;
  budget: string;
  description: string;
  status: MatchStatus;
  createdAt: string;
  expiresAt: string;
  matchedLawyer?: string;
}

//  Mock Data 
const CONSULTATIONS: Consultation[] = [
  {
    id: "CSL-0041",
    citizen: { id: "u001", name: "Chidinma Okafor", initials: "CO", color: "#3B82F6", email: "chidinma@gmail.com", state: "Enugu" },
    lawyer:  { id: "l001", name: "Adaeze Okonkwo",  initials: "AO", color: "#1E3A5F", specialisms: ["Criminal", "Employment"], nbaNumber: "NBA/LAG/2014/01847" },
    mode: "video", topic: "My landlord locked me out without a court order",
    detail: "The landlord changed the locks on Saturday evening without any notice or court order. I have 4 months left on my tenancy agreement signed in December 2024.",
    status: "completed", fee: 18000, platformFee: 2700, lawyerPayout: 15300,
    createdAt: "Apr 14, 2025 · 09:22", scheduledAt: "Apr 15, 2025 · 14:00",
    completedAt: "Apr 15, 2025 · 14:48", rating: 5, ratingNote: "Extremely thorough. Gave me the exact sections to quote.",
    duration: "48 min", disputed: false, refundRequested: false, flagged: false,
    transcript: [
      { id: "m1", sender: "citizen", senderName: "Chidinma Okafor", text: "Good afternoon, my landlord locked me out this morning. What are my rights?", time: "14:01" },
      { id: "m2", sender: "lawyer",  senderName: "Adaeze Okonkwo",  text: "Good afternoon Chidinma. Under the Lagos Tenancy Law 2011, a landlord cannot evict a tenant without a court order. This is an unlawful eviction. Section 21 specifically prohibits self-help eviction.", time: "14:03" },
      { id: "m3", sender: "citizen", senderName: "Chidinma Okafor", text: "Can I break the lock and re-enter?", time: "14:08" },
      { id: "m4", sender: "lawyer",  senderName: "Adaeze Okonkwo",  text: "Technically yes, as a tenant with a valid agreement you have a right to peaceful enjoyment. However I recommend first sending a formal letter via your phone's camera as evidence, then contacting the police. I will draft the letter for you now.", time: "14:10" },
    ],
  },
  {
    id: "CSL-0042",
    citizen: { id: "u002", name: "Babatunde Lawal", initials: "BL", color: "#10B981", email: "babatunde@yahoo.com", state: "Lagos" },
    lawyer:  { id: "l002", name: "Emeka Nwosu",     initials: "EN", color: "#1A3B2E", specialisms: ["Property", "Business"], nbaNumber: "NBA/ABJ/2012/00934" },
    mode: "message", topic: "Severance pay after retrenchment,  employer refusing to pay",
    detail: "I was retrenched two weeks ago. Employer claims I am not entitled because I was on probation. I have worked for 18 months.",
    status: "active", fee: 4500, platformFee: 675, lawyerPayout: 3825,
    createdAt: "Apr 19, 2025 · 16:44", disputed: false, refundRequested: false, flagged: false,
    transcript: [
      { id: "m5", sender: "citizen", senderName: "Babatunde Lawal", text: "My employer says because I was 'on probation' for the full 18 months I get nothing. Is this legal?", time: "16:50" },
      { id: "m6", sender: "lawyer",  senderName: "Emeka Nwosu",     text: "A probationary period cannot legally exceed 3 months under Nigerian Labour Act. After 3 months you automatically become a full employee with all attendant rights, including severance under Section 18.", time: "17:05" },
    ],
  },
  {
    id: "CSL-0043",
    citizen: { id: "u003", name: "Amina Garba", initials: "AG", color: "#8B5CF6", email: "amina.g@hotmail.com", state: "Kano" },
    lawyer:  { id: "l003", name: "Fatimah Bello", initials: "FB", color: "#2D1A3B", specialisms: ["Family", "Criminal"], nbaNumber: "NBA/KAN/2016/02211" },
    mode: "call", topic: "Child custody arrangement after separation",
    detail: "Separated 3 months ago. Need clarity on what custody arrangement I can request and the correct process under Nigerian law.",
    status: "awaiting_lawyer", fee: 9000, platformFee: 1350, lawyerPayout: 7650,
    createdAt: "Apr 21, 2025 · 11:05", disputed: false, refundRequested: false, flagged: false,
    transcript: [],
  },
  {
    id: "CSL-0044",
    citizen: { id: "u004", name: "Ikechukwu Eze", initials: "IE", color: "#F59E0B", email: "ikechukwu@gmail.com", state: "Port Harcourt" },
    lawyer:  { id: "l002", name: "Emeka Nwosu",   initials: "EN", color: "#1A3B2E", specialisms: ["Property", "Business"], nbaNumber: "NBA/ABJ/2012/00934" },
    mode: "message", topic: "Agent collected 2 years rent + caution fee, disappeared",
    detail: "An agent collected one year rent plus two years caution totaling ₦620,000 and has gone unreachable. Property was never handed over.",
    status: "disputed", fee: 4500, platformFee: 675, lawyerPayout: 3825,
    createdAt: "Apr 17, 2025 · 13:15",
    disputed: true, disputeReason: "Citizen claims lawyer gave incorrect legal advice leading to financial loss. Lawyer denies claim.",
    refundRequested: true, flagged: true, flagReason: "Active dispute,  payments on hold pending review.",
    transcript: [
      { id: "m7", sender: "citizen", senderName: "Ikechukwu Eze", text: "The agent has disappeared with ₦620k. What can I do right now?", time: "13:20" },
      { id: "m8", sender: "lawyer",  senderName: "Emeka Nwosu",   text: "You should report to the police immediately and also file a report with EFCC as this constitutes obtaining money under false pretenses (Advance Fee Fraud).", time: "13:45" },
      { id: "m9", sender: "citizen", senderName: "Ikechukwu Eze", text: "I went to the police and they asked me for ₦50,000 before opening an investigation. You didn't warn me this would happen. I want a refund.", time: "Apr 18 · 09:00" },
    ],
  },
  {
    id: "CSL-0045",
    citizen: { id: "u005", name: "Funmilayo Adeyemi", initials: "FA", color: "#EF4444", email: "funmi.a@gmail.com", state: "Ibadan" },
    lawyer:  { id: "l004", name: "Chidi Okafor", initials: "CO", color: "#1A2D3B", specialisms: ["Business", "Consumer"], nbaNumber: "NBA/LAG/2015/03102" },
    mode: "video", topic: "Workplace harassment,  hostile environment claim",
    detail: "",
    status: "cancelled", fee: 18000, platformFee: 0, lawyerPayout: 0,
    createdAt: "Apr 10, 2025 · 08:33", disputed: false, refundRequested: false, flagged: false,
    transcript: [],
  },
  {
    id: "CSL-0046",
    citizen: { id: "u006", name: "Emeka Obi", initials: "EO", color: "#06B6D4", email: "emekaobi@live.com", state: "Anambra" },
    lawyer:  { id: "l005", name: "Ngozi Eze",   initials: "NE", color: "#2D1A1A", specialisms: ["Employment", "Consumer"], nbaNumber: "NBA/PHC/2017/01563" },
    mode: "message", topic: "NSITF deductions not remitted by employer",
    detail: "My employer has been deducting NSITF from my salary for 3 years but I have no NSITF number and no record of remittance.",
    status: "completed", fee: 4500, platformFee: 675, lawyerPayout: 3825,
    createdAt: "Apr 8, 2025 · 10:00", completedAt: "Apr 9, 2025 · 15:30",
    rating: 4, ratingNote: "Clear and fast.",
    duration: "Message thread", disputed: false, refundRequested: false, flagged: false,
    transcript: [],
  },
  {
    id: "CSL-0047",
    citizen: { id: "u007", name: "Halima Yusuf", initials: "HY", color: "#EC4899", email: "halima.y@gmail.com", state: "Kaduna" },
    lawyer:  { id: "l003", name: "Fatimah Bello", initials: "FB", color: "#2D1A3B", specialisms: ["Family"], nbaNumber: "NBA/KAN/2016/02211" },
    mode: "call", topic: "VAPP Act,  obtaining a protection order",
    detail: "I need to understand the process for applying for a protection order under the VAPP Act.",
    status: "pending_payment", fee: 9000, platformFee: 1350, lawyerPayout: 7650,
    createdAt: "Apr 21, 2025 · 16:55", disputed: false, refundRequested: false, flagged: false,
    transcript: [],
  },
];

const MATCH_REQUESTS: MatchRequest[] = [
  {
    id: "MR-001",
    citizen: { name: "Adaeze Onyekachi", initials: "AO", color: "#6366F1", email: "adaeze.o@email.ng", state: "Abuja" },
    specialism: "Employment Law", urgency: "Today (urgent)", budget: "NGN 5,000 - 15,000",
    description: "My employer deducted an undisclosed amount from salary for 3 months. Refusing to explain. Need a lawyer to send a formal demand letter.",
    status: "unassigned", createdAt: "Apr 21, 2025 · 14:30", expiresAt: "Apr 22, 2025 · 14:30",
  },
  {
    id: "MR-002",
    citizen: { name: "Chukwuemeka Nwosu", initials: "CN", color: "#F97316", email: "c.nwosu@gmail.com", state: "Lagos" },
    specialism: "Property & Tenancy", urgency: "Today (urgent)", budget: "NGN 5,000 - 15,000",
    description: "Agent collected rent and caution for property in Lekki, gone unreachable. Need advice on recovery options urgently.",
    status: "matching", createdAt: "Apr 21, 2025 · 11:18", expiresAt: "Apr 22, 2025 · 11:18",
  },
  {
    id: "MR-003",
    citizen: { name: "Mustapha Ibrahim", initials: "MI", color: "#14B8A6", email: "mustapha.i@gmail.com", state: "Sokoto" },
    specialism: "Criminal Law", urgency: "This week", budget: "Under NGN 5,000",
    description: "My brother was detained at a checkpoint 4 days ago without formal charge. Police are not granting bail. Need urgent legal guidance.",
    status: "matched", createdAt: "Apr 20, 2025 · 09:40", expiresAt: "Apr 21, 2025 · 09:40",
    matchedLawyer: "Adaeze Okonkwo",
  },
];

//  Config 
const STATUS_CFG: Record<ConsultStatus, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  pending_payment: { label: "Pending Payment",   bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock      },
  awaiting_lawyer: { label: "Awaiting Lawyer",   bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6", icon: Timer      },
  active:          { label: "Active",             bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: Activity   },
  completed:       { label: "Completed",          bg: "#F9FAFB", text: "#374151", dot: "#9CA3AF", icon: CheckCircle},
  disputed:        { label: "Disputed",           bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: Gavel      },
  cancelled:       { label: "Cancelled",          bg: "#F9FAFB", text: "#6B7280", dot: "#D1D5DB", icon: XCircle   },
  refunded:        { label: "Refunded",           bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6", icon: RotateCcw },
};

const MODE_CFG: Record<ConsultMode, { label: string; icon: React.ElementType; color: string }> = {
  message: { label: "Written",  icon: MessageSquare, color: "#6B7280" },
  call:    { label: "Call",     icon: Phone,         color: "#3B82F6" },
  video:   { label: "Video",    icon: Video,         color: "#8B5CF6" },
};

const MATCH_STATUS_CFG: Record<MatchStatus, { label: string; bg: string; text: string; dot: string }> = {
  unassigned: { label: "Unassigned", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  matching:   { label: "Matching…",  bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  matched:    { label: "Matched",    bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  expired:    { label: "Expired",    bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
};

//  Sub-components 
function ConsultStatusBadge({ status }: { status: ConsultStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
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

//  Transcript Drawer 
function TranscriptDrawer({ consult, onClose }: { consult: Consultation; onClose: () => void }) {
  const [flagNote, setFlagNote] = useState("");
  const [flagging, setFlagging] = useState(false);
  const [flagged, setFlagged] = useState(consult.flagged);
  const [activeTab, setActiveTab] = useState<"transcript" | "financials" | "dispute">("transcript");

  const handleFlag = async () => {
    setFlagging(true);
    await new Promise(r => setTimeout(r, 900));
    setFlagged(true);
    setFlagging(false);
  };

  const modeConfig = MODE_CFG[consult.mode];
  const ModeIcon = modeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Accent */}
        <div className="h-1 w-full flex-shrink-0" style={{
          background: consult.disputed
            ? "#EF4444"
            : consult.status === "completed"
            ? "#10B981"
            : "linear-gradient(90deg, #E8317A, #ff6fa8)"
        }} />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
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

          {/* Parties */}
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
                <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.nbaNumber}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <ModeIcon size={12} style={{ color: modeConfig.color }} />
              <span className="text-[11px] font-semibold" style={{ color: modeConfig.color }}>{modeConfig.label}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mt-4">
            {([
              { id: "transcript", label: "Transcript" },
              { id: "financials", label: "Financials" },
              { id: "dispute",    label: consult.disputed ? "⚠ Dispute" : "Actions" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/*  Transcript Tab  */}
          {activeTab === "transcript" && (
            <div>
              {consult.transcript.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={28} className="text-[#E5E7EB] mx-auto mb-2" />
                  <p className="text-sm text-[#9CA3AF]">No messages yet</p>
                  <p className="text-[11px] text-[#D1D5DB] mt-1">
                    {consult.status === "awaiting_lawyer" ? "Waiting for lawyer to accept." : "Consultation has not started."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Full Message Transcript · {consult.transcript.length} messages
                  </p>
                  {consult.transcript.map(msg => (
                    <div key={msg.id} className={`flex gap-2.5 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5`}
                        style={{
                          background: msg.sender === "citizen"
                            ? `linear-gradient(135deg, ${consult.citizen.color}, ${consult.citizen.color}80)`
                            : `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)`
                        }}>
                        {msg.sender === "citizen" ? consult.citizen.initials : consult.lawyer.initials}
                      </div>
                      <div className={`flex-1 max-w-[85%] ${msg.sender === "lawyer" ? "items-end" : ""} flex flex-col`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.sender === "lawyer" ? "flex-row-reverse" : ""}`}>
                          <p className="text-[10px] font-semibold text-[#9CA3AF]">{msg.senderName}</p>
                          <p className="text-[10px] text-[#D1D5DB]">{msg.time}</p>
                        </div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                          msg.sender === "citizen"
                            ? "bg-[#F3F4F6] text-[#374151] rounded-tl-sm"
                            : "text-white rounded-tr-sm"
                        }`}
                          style={msg.sender === "lawyer" ? { background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}cc)` } : {}}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rating if completed */}
              {consult.status === "completed" && consult.rating && (
                <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Citizen Review</p>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <StarRating n={consult.rating} />
                    {consult.ratingNote && (
                      <p className="text-[12px] text-[#92400E] mt-2 leading-relaxed">"{consult.ratingNote}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/*  Financials Tab  */}
          {activeTab === "financials" && (
            <div className="space-y-4">
              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Fee Breakdown</p>
                <div className="space-y-2 text-[13px]">
                  {[
                    { l: "Gross Fee",           v: `NGN ${consult.fee.toLocaleString()}`,         bold: false },
                    { l: "Platform Commission (15%)", v: `– NGN ${consult.platformFee.toLocaleString()}`, bold: false },
                    { l: "Lawyer Payout",        v: `NGN ${consult.lawyerPayout.toLocaleString()}`, bold: true  },
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
                  { l: "Payment Ref",    v: `PAY-2025-${consult.id}` },
                  { l: "Initiated",      v: consult.createdAt },
                  { l: "Completed",      v: consult.completedAt ?? "—" },
                  { l: "Duration",       v: consult.duration ?? "—" },
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
                    <button className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors">
                      Approve Refund
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                      Reject Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/*  Dispute / Actions Tab  */}
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
                    <button className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors">
                      Rule in Citizen's Favour
                    </button>
                    <button className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#1A2D3B] hover:bg-[#111827] transition-colors">
                      Rule in Lawyer's Favour
                    </button>
                    <button className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                      Mark as Mediated
                    </button>
                  </div>
                </div>
              )}

              {/* Flag section */}
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
                  : flagged  ? <><Check size={11} /> Flagged</>
                  : <><Flag size={11} /> Flag for Review</>}
                </button>
              </div>

              {/* Quick admin actions */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Admin Actions</p>
                {[
                  { label: "Send Warning to Lawyer",   color: "#F59E0B", border: "#FDE68A", bg: "#FFFBEB" },
                  { label: "Suspend Lawyer Account",   color: "#EF4444", border: "#FCA5A5", bg: "#FEF2F2" },
                  { label: "Cancel & Refund",          color: "#8B5CF6", border: "#C4B5FD", bg: "#F5F3FF" },
                ].map(a => (
                  <button key={a.label}
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

//  Match Request Card 
function MatchCard({ req }: { req: MatchRequest }) {
  const cfg = MATCH_STATUS_CFG[req.status];
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
            <p className="text-[10px] text-[#9CA3AF]">{req.citizen.state} · {req.createdAt}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] text-[#6B7280] mb-3">
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Needs:</span><span className="font-semibold text-[#111827]">{req.specialism}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Urgency:</span><span className="font-semibold text-[#EF4444]">{req.urgency}</span></div>
        <div className="flex gap-2"><span className="text-[#9CA3AF] w-16 flex-shrink-0">Budget:</span><span>{req.budget}</span></div>
      </div>

      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">{req.description}</p>

      {req.matchedLawyer && (
        <div className="flex items-center gap-2 p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl mb-3">
          <CheckCircle size={12} className="text-[#10B981]" />
          <p className="text-[11px] font-semibold text-[#065F46]">Matched: {req.matchedLawyer}</p>
        </div>
      )}

      {req.status === "unassigned" && (
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors flex items-center justify-center gap-1">
            <Zap size={10} /> Auto-Match
          </button>
          <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1">
            <UserCheck size={10} /> Assign Manually
          </button>
        </div>
      )}

      {req.status === "matching" && (
        <div className="flex items-center gap-2 py-2">
          <Loader2 size={12} className="text-[#F59E0B] animate-spin" />
          <p className="text-[11px] text-[#F59E0B] font-semibold">Searching for available lawyers…</p>
        </div>
      )}

      {req.status === "matched" && (
        <button className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
          View Match Details
        </button>
      )}
    </div>
  );
}

//  Performance Row 
function LawyerPerformanceRow({ lawyer, stats }: {
  lawyer: Consultation["lawyer"];
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
            <p className="text-[10px] text-[#9CA3AF]">{lawyer.nbaNumber}</p>
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

//  Main Page 
export default function ConsultationsPage() {
  const [tab, setTab] = useState<"all" | ConsultStatus>("all");
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<ConsultMode | "all">("all");
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  const [activeSection, setActiveSection] = useState<"consultations" | "matches" | "performance">("consultations");

  // Stats
  const total       = CONSULTATIONS.length;
  const active      = CONSULTATIONS.filter(c => c.status === "active" || c.status === "awaiting_lawyer").length;
  const disputed    = CONSULTATIONS.filter(c => c.disputed).length;
  const totalRev    = CONSULTATIONS.filter(c => c.status === "completed").reduce((s, c) => s + c.fee, 0);
  const platformRev = CONSULTATIONS.filter(c => c.status === "completed").reduce((s, c) => s + c.platformFee, 0);

  const filtered = useMemo(() => CONSULTATIONS.filter(c => {
    if (tab !== "all" && c.status !== tab) return false;
    if (modeFilter !== "all" && c.mode !== modeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.id.toLowerCase().includes(q)
        || c.citizen.name.toLowerCase().includes(q)
        || c.lawyer.name.toLowerCase().includes(q)
        || c.topic.toLowerCase().includes(q);
    }
    return true;
  }), [tab, modeFilter, search]);

  // Lawyer performance aggregation
  const lawyerStats = useMemo(() => {
    const map = new Map<string, {
      lawyer: Consultation["lawyer"];
      total: number; completed: number; disputed: number;
      ratingSum: number; ratingCount: number; totalRevenue: number;
    }>();
    CONSULTATIONS.forEach(c => {
      const key = c.lawyer.id;
      const existing = map.get(key) || { lawyer: c.lawyer, total: 0, completed: 0, disputed: 0, ratingSum: 0, ratingCount: 0, totalRevenue: 0 };
      existing.total++;
      if (c.status === "completed") { existing.completed++; existing.totalRevenue += c.lawyerPayout; }
      if (c.disputed) existing.disputed++;
      if (c.rating) { existing.ratingSum += c.rating; existing.ratingCount++; }
      map.set(key, existing);
    });
    return Array.from(map.values()).map(v => ({
      ...v,
      avgRating: v.ratingCount > 0 ? v.ratingSum / v.ratingCount : 0,
    }));
  }, []);

  return (
    <>
      {selectedConsult && (
        <TranscriptDrawer consult={selectedConsult} onClose={() => setSelectedConsult(null)} />
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

        {/* Stat cards */}
        <StatBar items={[
          { label: "Total Sessions",  value: total,                         icon: MessageSquare, color: "#E8317A", bg: "#FFF0F5" },
          { label: "Active",          value: active,                        icon: Activity,      color: "#10B981", bg: "#ECFDF5" },
          { label: "Disputed",        value: disputed,                      icon: Gavel,         color: "#EF4444", bg: "#FEF2F2" },
          { label: "Unassigned",      value: MATCH_REQUESTS.filter(m => m.status === "unassigned").length, icon: Timer, color: "#F59E0B", bg: "#FFFBEB" },
        ]} />

        {/* Revenue strip */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#111827] to-[#1E3A5F] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gross Consultation Revenue</p>
              <p className="text-2xl font-bold text-white">NGN {totalRev.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign size={18} className="text-[#E8317A]" />
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

        {/* Section tabs */}
        <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
          {([
            { id: "consultations", label: "Consultations",   icon: MessageSquare, count: CONSULTATIONS.length },
            { id: "matches",       label: "Match Requests",  icon: Zap,           count: MATCH_REQUESTS.filter(m => m.status !== "matched").length },
            { id: "performance",   label: "Lawyer Performance", icon: BarChart3,  count: null },
          ] as const).map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeSection === s.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                <Icon size={13} /> {s.label}
                {s.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeSection === s.id ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/*  Consultations Section  */}
        {activeSection === "consultations" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by ID, name, or topic…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>

              {/* Status tabs */}
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 overflow-x-auto">
                {([
                  { v: "all",             l: "All"       },
                  { v: "active",          l: "Active"    },
                  { v: "awaiting_lawyer", l: "Awaiting"  },
                  { v: "completed",       l: "Completed" },
                  { v: "disputed",        l: "Disputed"  },
                  { v: "pending_payment", l: "Pending"   },
                  { v: "cancelled",       l: "Cancelled" },
                ] as const).map(opt => {
                  const count = opt.v === "all"
                    ? CONSULTATIONS.length
                    : CONSULTATIONS.filter(c => c.status === opt.v).length;
                  return (
                    <button key={opt.v} onClick={() => setTab(opt.v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${tab === opt.v ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                      {opt.l}
                      <span className={`text-[10px] px-1 py-0.5 rounded-full font-bold ${tab === opt.v ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mode filter */}
              <select value={modeFilter} onChange={e => setModeFilter(e.target.value as ConsultMode | "all")}
                className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors ml-auto">
                <option value="all">All Modes</option>
                <option value="message">Written</option>
                <option value="call">Call</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Table */}
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
                    ) : filtered.map(c => {
                      const ModeIcon = MODE_CFG[c.mode].icon;
                      return (
                        <tr key={c.id} className={`hover:bg-[#F9FAFB] transition-colors ${c.disputed ? "bg-red-50/30" : ""}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold text-[#9CA3AF]">{c.id}</span>
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
                                <p className="text-[10px] text-[#9CA3AF]">{c.citizen.state}</p>
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
                            <span className="text-[12px] font-bold text-[#111827]">
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

            <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
              <span>Showing {filtered.length} of {CONSULTATIONS.length} consultations</span>
            </div>
          </>
        )}

        {/*  Match Requests Section  */}
        {activeSection === "matches" && (
          <>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[15px] font-bold text-[#111827]">Lawyer Match Requests</h2>
                <span className="text-[11px] text-[#9CA3AF]">{MATCH_REQUESTS.filter(m => m.status === "unassigned").length} need attention</span>
              </div>
              <p className="text-[12px] text-[#9CA3AF]">
                Citizens who used "Request a Lawyer",  unassigned requests require a manual or auto-match.
              </p>
            </div>

            {/* Alert for unassigned */}
            {MATCH_REQUESTS.some(m => m.status === "unassigned") && (
              <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl mb-5">
                <AlertTriangle size={15} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-[#991B1B] mb-0.5">
                    {MATCH_REQUESTS.filter(m => m.status === "unassigned").length} unassigned request{MATCH_REQUESTS.filter(m => m.status === "unassigned").length > 1 ? "s" : ""},  action required
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">Urgent requests expire after 24 hours. Citizens are waiting for a match.</p>
                </div>
                <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors flex-shrink-0">
                  <Zap size={11} /> Auto-Match All
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MATCH_REQUESTS.map(req => <MatchCard key={req.id} req={req} />)}
            </div>
          </>
        )}

        {/*  Performance Section  */}
        {activeSection === "performance" && (
          <>
            <div className="mb-5">
              <h2 className="text-[15px] font-bold text-[#111827] mb-1">Lawyer Performance Metrics</h2>
              <p className="text-[12px] text-[#9CA3AF]">Based on all consultation data. Used to sort marketplace listings and award badges.</p>
            </div>

            {/* Top performers highlight */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {lawyerStats.slice(0, 3).map((s, i) => (
                <div key={s.lawyer.id} className={`rounded-2xl p-4 border ${i === 0 ? "bg-gradient-to-br from-amber-50 to-white border-amber-200" : "bg-white border-[#F3F4F6]"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 0 ? "bg-amber-400 text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ background: `linear-gradient(135deg, ${s.lawyer.color}, ${s.lawyer.color}80)` }}>
                      {s.lawyer.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#111827]">{s.lawyer.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[13px] font-bold text-[#111827]">{s.total}</p>
                      <p className="text-[9px] text-[#9CA3AF]">Sessions</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#10B981]">{s.avgRating > 0 ? s.avgRating.toFixed(1) : "—"}</p>
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

            {/* Full performance table */}
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
                      <LawyerPerformanceRow key={s.lawyer.id} lawyer={s.lawyer} stats={s} />
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