"use client";
import React, { useState } from "react";
import {
  ShieldCheck, Clock, CheckCircle, XCircle, FileText,
  Eye, Download, MessageSquare, ChevronRight, AlertCircle,
  BadgeCheck, Calendar, MapPin, Award, Phone, Mail,
  Upload, Loader2, X, Check, Info, Scale, Users,
} from "lucide-react";
import { StatBar, FilterBar, Avatar, PageHeader, StatusBadge } from "../_components";

//  Types 
type VerificationStatus = "pending" | "approved" | "rejected" | "info_requested";

interface Document {
  id: string;
  label: string;
  filename: string;
  uploadedAt: string;
  size: string;
  verified: boolean | null; // null = not yet reviewed
}

interface VerificationRequest {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  state: string;
  nbaNumber: string;
  yearsCall: number;
  calledAt: string;
  specialisms: string[];
  submittedAt: string;
  status: VerificationStatus;
  documents: Document[];
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

//  Mock Data 
const REQUESTS: VerificationRequest[] = [
  {
    id: "v001",
    name: "Obiageli Nwachukwu", initials: "ON", color: "#1E4040",
    email: "obi.n@email.com", phone: "07077665544", state: "Anambra",
    nbaNumber: "NBA/AWK/2019/00456", yearsCall: 5, calledAt: "2019",
    specialisms: ["Family Law", "Employment"],
    submittedAt: "Apr 21, 2025 · 09:14",
    status: "pending",
    documents: [
      { id: "d1", label: "Call to Bar Certificate",   filename: "call_to_bar_nwachukwu.pdf",   uploadedAt: "Apr 21", size: "1.2 MB", verified: null },
      { id: "d2", label: "Law School Certificate",    filename: "law_school_cert.pdf",          uploadedAt: "Apr 21", size: "980 KB", verified: null },
      { id: "d3", label: "Practicing License 2025",   filename: "practicing_license_2025.pdf",  uploadedAt: "Apr 21", size: "2.1 MB", verified: null },
      { id: "d4", label: "Government-Issued ID",      filename: "national_id_on.jpg",           uploadedAt: "Apr 21", size: "640 KB", verified: null },
    ],
  },
  {
    id: "v002",
    name: "Tunde Adesanya",     initials: "TA", color: "#3B1A4A",
    email: "tunde.a@law.ng",   phone: "08033114455", state: "Oyo",
    nbaNumber: "NBA/IBD/2020/00712", yearsCall: 4, calledAt: "2020",
    specialisms: ["Business Law", "Consumer Rights"],
    submittedAt: "Apr 20, 2025 · 14:33",
    status: "pending",
    documents: [
      { id: "d5", label: "Call to Bar Certificate",   filename: "bar_cert_tunde.pdf",           uploadedAt: "Apr 20", size: "1.5 MB", verified: null },
      { id: "d6", label: "Law School Certificate",    filename: "law_school_tunde.pdf",          uploadedAt: "Apr 20", size: "1.1 MB", verified: null },
      { id: "d7", label: "Practicing License 2025",   filename: "license_tunde_2025.pdf",       uploadedAt: "Apr 20", size: "1.8 MB", verified: null },
      { id: "d8", label: "Government-Issued ID",      filename: "passport_tunde.jpg",            uploadedAt: "Apr 20", size: "512 KB", verified: null },
    ],
  },
  {
    id: "v003",
    name: "Chinyere Okeke",     initials: "CO", color: "#1A3B1A",
    email: "chinyere.o@gmail.com", phone: "09055112233", state: "Enugu",
    nbaNumber: "NBA/ENU/2021/00289", yearsCall: 3, calledAt: "2021",
    specialisms: ["Property Law", "Contracts"],
    submittedAt: "Apr 19, 2025 · 11:05",
    status: "info_requested",
    adminNote: "The practicing license uploaded appears to be for 2024. Please resubmit the 2025 Supreme Court practicing license.",
    documents: [
      { id: "d9",  label: "Call to Bar Certificate",  filename: "bar_cert_chinyere.pdf",        uploadedAt: "Apr 19", size: "1.3 MB", verified: true  },
      { id: "d10", label: "Law School Certificate",   filename: "law_school_chinyere.pdf",       uploadedAt: "Apr 19", size: "890 KB", verified: true  },
      { id: "d11", label: "Practicing License",       filename: "license_chinyere_2024.pdf",    uploadedAt: "Apr 19", size: "2.0 MB", verified: false },
      { id: "d12", label: "Government-Issued ID",     filename: "intl_passport_co.jpg",         uploadedAt: "Apr 19", size: "720 KB", verified: true  },
    ],
  },
  {
    id: "v004",
    name: "Suleiman Balarabe",  initials: "SB", color: "#2A1A3B",
    email: "suleiman.b@email.com", phone: "08077334455", state: "Katsina",
    nbaNumber: "NBA/KAT/2018/00501", yearsCall: 6, calledAt: "2018",
    specialisms: ["Criminal Law", "Road Traffic"],
    submittedAt: "Apr 18, 2025 · 16:22",
    status: "approved",
    reviewedBy: "Super Admin", reviewedAt: "Apr 19, 2025 · 10:15",
    documents: [
      { id: "d13", label: "Call to Bar Certificate",  filename: "bar_cert_sb.pdf",              uploadedAt: "Apr 18", size: "1.1 MB", verified: true },
      { id: "d14", label: "Law School Certificate",   filename: "law_school_sb.pdf",             uploadedAt: "Apr 18", size: "1.0 MB", verified: true },
      { id: "d15", label: "Practicing License 2025",  filename: "license_sb_2025.pdf",          uploadedAt: "Apr 18", size: "1.9 MB", verified: true },
      { id: "d16", label: "Government-Issued ID",     filename: "nimc_sb.jpg",                   uploadedAt: "Apr 18", size: "480 KB", verified: true },
    ],
  },
  {
    id: "v005",
    name: "Blessing Igwe",      initials: "BI", color: "#3B1A1A",
    email: "blessing.i@email.com", phone: "08099223344", state: "Delta",
    nbaNumber: "NBA/WAR/2022/00134", yearsCall: 2, calledAt: "2022",
    specialisms: ["Family Law"],
    submittedAt: "Apr 17, 2025 · 09:47",
    status: "rejected",
    adminNote: "NBA registration number could not be verified with the Nigerian Bar Association records. Application rejected.",
    reviewedBy: "Super Admin", reviewedAt: "Apr 18, 2025 · 14:30",
    documents: [
      { id: "d17", label: "Call to Bar Certificate",  filename: "bar_cert_bi.pdf",              uploadedAt: "Apr 17", size: "900 KB", verified: false },
      { id: "d18", label: "Law School Certificate",   filename: "law_school_bi.pdf",             uploadedAt: "Apr 17", size: "820 KB", verified: true  },
      { id: "d19", label: "Practicing License 2025",  filename: "license_bi_2025.pdf",          uploadedAt: "Apr 17", size: "1.6 MB", verified: false },
      { id: "d20", label: "Government-Issued ID",     filename: "voters_card_bi.jpg",            uploadedAt: "Apr 17", size: "560 KB", verified: true  },
    ],
  },
];

//  Status Config 
const STATUS_CFG = {
  pending:        { label: "Pending Review", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B", icon: Clock },
  approved:       { label: "Approved",       bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", dot: "#10B981", icon: CheckCircle },
  rejected:       { label: "Rejected",       bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", dot: "#EF4444", icon: XCircle },
  info_requested: { label: "Info Requested", bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD", dot: "#3B82F6", icon: MessageSquare },
};

function StatusChip({ status }: { status: VerificationStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

//  Document Row 
function DocRow({ doc }: { doc: Document }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] hover:bg-white transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        doc.verified === true  ? "bg-[#ECFDF5]" :
        doc.verified === false ? "bg-[#FEF2F2]" :
        "bg-[#F3F4F6]"
      }`}>
        <FileText size={14} className={
          doc.verified === true  ? "text-[#10B981]" :
          doc.verified === false ? "text-[#EF4444]" :
          "text-[#9CA3AF]"
        } />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-[#111827]">{doc.label}</p>
        <p className="text-[10px] text-[#9CA3AF]">{doc.filename} · {doc.size} · {doc.uploadedAt}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.verified === true  && <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">✓ Verified</span>}
        {doc.verified === false && <span className="text-[10px] font-bold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded-full">✗ Issue</span>}
        <button className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
          <Eye size={12} />
        </button>
        <button className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
          <Download size={12} />
        </button>
      </div>
    </div>
  );
}

//  Review Modal 
function ReviewModal({
  request,
  action,
  onClose,
  onSubmit,
}: {
  request: VerificationRequest;
  action: "approve" | "reject" | "info";
  onClose: () => void;
  onSubmit: (note?: string) => void;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const META = {
    approve: { title: "Approve Verification",    icon: CheckCircle,  color: "#10B981", btnLabel: "Confirm Approval",      btnStyle: "bg-[#10B981] hover:bg-[#059669]" },
    reject:  { title: "Reject Application",      icon: XCircle,      color: "#EF4444", btnLabel: "Reject Application",    btnStyle: "bg-[#EF4444] hover:bg-[#DC2626]" },
    info:    { title: "Request More Information", icon: MessageSquare,color: "#3B82F6", btnLabel: "Send Request",          btnStyle: "bg-[#3B82F6] hover:bg-[#2563EB]" },
  }[action];

  const Icon = META.icon;

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSubmit(note || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full" style={{ background: META.color }} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${META.color}15` }}>
              <Icon size={18} style={{ color: META.color }} />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-sm">{META.title}</h3>
              <p className="text-[11px] text-[#9CA3AF]">{request.name} · {request.nbaNumber}</p>
            </div>
            <button onClick={onClose} className="ml-auto text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          {action === "approve" && (
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 mb-4">
              <p className="text-[12px] text-[#065F46] font-medium flex items-start gap-2">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                Approving will grant this lawyer full marketplace access, the Verified Lawyer badge, and allow them to receive consultation requests.
              </p>
            </div>
          )}

          {action === "reject" && (
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 mb-4">
              <p className="text-[12px] text-[#991B1B] font-medium flex items-start gap-2">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                Rejecting will notify the applicant by email. They may reapply after 30 days.
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
              {action === "approve" ? "Internal Note (optional)" : action === "reject" ? "Reason for Rejection *" : "Information Requested *"}
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={
                action === "approve" ? "Add a private note for your records…" :
                action === "reject"  ? "Explain why this application was rejected…" :
                "Specify what additional information or documents are needed…"
              }
              className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading || ((action === "reject" || action === "info") && !note.trim())}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${META.btnStyle}`}
            >
              {loading ? <><Loader2 size={13} className="animate-spin" /> Processing…</> : META.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//  Request Card 
function RequestCard({
  req,
  onAction,
}: {
  req: VerificationRequest;
  onAction: (req: VerificationRequest, action: "approve" | "reject" | "info") => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md hover:-translate-y-0.5"
    }`}>
      {/* Status accent */}
      <div className="h-0.5 w-full" style={{ background: STATUS_CFG[req.status].dot }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar initials={req.initials} color={req.color} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-[14px] font-bold text-[#111827] leading-tight">{req.name}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{req.nbaNumber}</p>
              </div>
              <StatusChip status={req.status} />
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { icon: MapPin,    value: req.state },
            { icon: Award,     value: `Called ${req.calledAt} (${req.yearsCall}yr)` },
            { icon: Calendar,  value: req.submittedAt.split("·")[0].trim() },
            { icon: Scale,     value: req.specialisms.join(", ") },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <Icon size={11} className="text-[#9CA3AF] flex-shrink-0" /> {value}
            </div>
          ))}
        </div>

        {/* Admin note (for info_requested / rejected) */}
        {req.adminNote && (
          <div className={`flex items-start gap-2.5 p-3 rounded-xl mb-4 border text-[12px] ${
            req.status === "info_requested"
              ? "bg-[#EFF6FF] border-[#93C5FD] text-[#1E3A8A]"
              : "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
          }`}>
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{req.adminNote}</p>
          </div>
        )}

        {/* Reviewed info */}
        {req.reviewedBy && (
          <p className="text-[11px] text-[#9CA3AF] mb-4">
            Reviewed by <strong className="text-[#6B7280]">{req.reviewedBy}</strong> on {req.reviewedAt}
          </p>
        )}

        {/* Document progress */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Documents ({req.documents.filter(d => d.verified === true).length}/{req.documents.length} verified)
          </p>
          <div className="flex items-center gap-1">
            {req.documents.map(d => (
              <div key={d.id} className={`w-2 h-2 rounded-full ${
                d.verified === true  ? "bg-[#10B981]" :
                d.verified === false ? "bg-[#EF4444]" :
                "bg-[#E5E7EB]"
              }`} title={d.label} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {req.status === "pending" && (
            <>
              <button
                onClick={() => onAction(req, "approve")}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
                <Check size={12} /> Approve
              </button>
              <button
                onClick={() => onAction(req, "info")}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#3B82F6] border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors">
                <MessageSquare size={12} /> Request Info
              </button>
              <button
                onClick={() => onAction(req, "reject")}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
                <X size={12} /> Reject
              </button>
            </>
          )}

          {req.status === "info_requested" && (
            <>
              <button
                onClick={() => onAction(req, "approve")}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
                <Check size={12} /> Approve Now
              </button>
              <button
                onClick={() => onAction(req, "reject")}
                className="flex items-center gap-1.5 px-4 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
                <X size={12} /> Reject
              </button>
            </>
          )}

          {(req.status === "approved" || req.status === "rejected") && (
            <div className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold ${
              req.status === "approved" ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#FEF2F2] text-[#991B1B]"
            }`}>
              {req.status === "approved" ? <><CheckCircle size={12} /> Approved</> : <><XCircle size={12} /> Rejected</>}
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] hover:bg-[#F9FAFB] transition-all"
          >
            <Eye size={12} /> {expanded ? "Hide" : "Documents"}
          </button>
        </div>

        {/* Documents expanded */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-2">
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Submitted Documents</p>
            {req.documents.map(doc => <DocRow key={doc.id} doc={doc} />)}

            <div className="mt-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
              <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                <BadgeCheck size={12} className="text-[#E8317A]" />
                NBA Cross-check: <span className="font-mono text-[#111827] ml-1">{req.nbaNumber}</span>
                <a href="#" className="ml-auto text-[#E8317A] font-semibold hover:underline flex items-center gap-1">
                  Verify on NBA Portal <ChevronRight size={11} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//  Main Page 
export default function VerificationsPage() {
  const [tab, setTab]           = useState("pending");
  const [search, setSearch]     = useState("");
  const [modalState, setModalState] = useState<{
    req: VerificationRequest;
    action: "approve" | "reject" | "info";
  } | null>(null);
  const [statuses, setStatuses] = useState<Record<string, VerificationStatus>>({});

  const getStatus = (req: VerificationRequest): VerificationStatus =>
    statuses[req.id] ?? req.status;

  const stats = [
    { label: "Total Requests",   value: REQUESTS.length,                                                                   icon: FileText,   color: "#E8317A", bg: "#FFF0F5" },
    { label: "Pending Review",   value: REQUESTS.filter(r => getStatus(r) === "pending").length,                           icon: Clock,      color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Approved",         value: REQUESTS.filter(r => getStatus(r) === "approved").length,                          icon: CheckCircle,color: "#10B981", bg: "#ECFDF5" },
    { label: "Info Requested",   value: REQUESTS.filter(r => getStatus(r) === "info_requested").length,                    icon: MessageSquare, color: "#3B82F6", bg: "#EFF6FF" },
  ];

  const filtered = REQUESTS.filter(r => {
    const s = getStatus(r);
    if (tab === "pending"        && s !== "pending")        return false;
    if (tab === "info_requested" && s !== "info_requested") return false;
    if (tab === "approved"       && s !== "approved")       return false;
    if (tab === "rejected"       && s !== "rejected")       return false;
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.nbaNumber.toLowerCase().includes(q) || r.state.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSubmit = (note?: string) => {
    if (!modalState) return;
    const newStatus: VerificationStatus =
      modalState.action === "approve" ? "approved" :
      modalState.action === "reject"  ? "rejected"  :
      "info_requested";
    setStatuses(prev => ({ ...prev, [modalState.req.id]: newStatus }));
    setModalState(null);
  };

  return (
    <>
      {modalState && (
        <ReviewModal
          request={modalState.req}
          action={modalState.action}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="p-6 xl:p-8 max-w-5xl mx-auto">
        <PageHeader
          title="Lawyer Verifications"
          subtitle="Review and approve lawyer credential applications before they go live on the marketplace."
        />

        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl">
          <ShieldCheck size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#92400E]">
            <strong>Verification checklist:</strong> Call to Bar certificate · Nigerian Law School certificate · Current (2025) Supreme Court practicing license · Government-issued ID. All four documents must be present and valid before approving.
          </div>
        </div>

        <StatBar items={stats} />

        <FilterBar
          options={[
            { value: "pending",        label: "Pending",      count: REQUESTS.filter(r => getStatus(r) === "pending").length },
            { value: "info_requested", label: "Info Needed",  count: REQUESTS.filter(r => getStatus(r) === "info_requested").length },
            { value: "approved",       label: "Approved",     count: REQUESTS.filter(r => getStatus(r) === "approved").length },
            { value: "rejected",       label: "Rejected",     count: REQUESTS.filter(r => getStatus(r) === "rejected").length },
            { value: "all",            label: "All" },
          ]}
          value={tab}
          onChange={setTab}
          searchPlaceholder="Search by name, NBA number, or state…"
          searchValue={search}
          onSearchChange={setSearch}
        />

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <ShieldCheck size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No requests found</p>
            <p className="text-[12px] text-[#D1D5DB]">All clear in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(req => (
              <RequestCard
                key={req.id}
                req={{ ...req, status: getStatus(req) }}
                onAction={(r, action) => setModalState({ req: r, action })}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
