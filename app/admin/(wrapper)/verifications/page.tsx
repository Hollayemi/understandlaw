"use client";
import { useState } from "react";
import {
  ShieldCheck, Clock, CheckCircle, XCircle, FileText,
  Eye, Download, MessageSquare, AlertCircle,
  Calendar, MapPin, Award, 
  Loader2, X, Check, Info, Scale,
} from "lucide-react";
import { StatBar, FilterBar, Avatar, PageHeader } from "../_components";
import {
  useAdminListLawyersQuery,
  useAdminGetLawyerStatsQuery,
  useAdminAdvanceVerificationMutation,
  useAdminRejectVerificationMutation,
  useAdminVerifyDocumentMutation,
} from "@/redux/slices/admin/lawyer.slice";
import type { LawyerFull, VerificationStatus as ApiVerificationStatus, Specialism } from "@/redux/types/lawyer";
import { formatFileSize } from "@/utils/function";

type UIStatus = "pending" | "approved" | "rejected" | "info_requested";

interface VerificationRequest {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  state: string;
  scnNumber: string;
  yearsCall: number;
  calledAt: string;
  specialisms: Specialism[];
  submittedAt: string;
  status: UIStatus;
  documents: Document[];
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  lawyerData?: LawyerFull;
}

interface Document {
  id: string;
  label: string;
  filename: string;
  uploadedAt: string;
  size: string;
  verified: boolean | null;
  fileUrl?: string;
  sizeBytes?: number;
}

// Helper to map API verification status to UI status
const mapApiStatusToUI = (status: string): UIStatus => {
  switch (status) {
    case "pending":
    case "credential_check":
    case "training":
    case "assessment":
      return "pending";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

// Status Config
const STATUS_CFG: Record<UIStatus, { label: string; bg: string; text: string; border: string; dot: string; icon: any }> = {
  pending: { label: "Pending Review", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B", icon: Clock },
  approved: { label: "Approved", bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", dot: "#10B981", icon: CheckCircle },
  rejected: { label: "Rejected", bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", dot: "#EF4444", icon: XCircle },
  info_requested: { label: "Info Requested", bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD", dot: "#3B82F6", icon: MessageSquare },
};

function StatusChip({ status }: { status: UIStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

// Document Row Component
function DocRow({ 
  doc, 
  profileId, 
  onVerify 
}: { 
  doc: Document; 
  profileId: string;
  onVerify: (documentId: string, verified: boolean) => void;
}) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (verified: boolean) => {
    setIsVerifying(true);
    await onVerify(doc.id, verified);
    setIsVerifying(false);
  };

  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] hover:bg-white transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        doc.verified === true ? "bg-[#ECFDF5]" :
        doc.verified === false ? "bg-[#FEF2F2]" :
        "bg-[#F3F4F6]"
      }`}>
        <FileText size={14} className={
          doc.verified === true ? "text-[#10B981]" :
          doc.verified === false ? "text-[#EF4444]" :
          "text-[#9CA3AF]"
        } />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-[#111827]">{doc.label}</p>
        <p className="text-[10px] text-[#9CA3AF]">{doc.filename} · {doc.size} · {doc.uploadedAt}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.verified === true && (
          <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">✓ Verified</span>
        )}
        {doc.verified === false && (
          <span className="text-[10px] font-bold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded-full">✗ Issue</span>
        )}
        {doc.verified === null && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVerify(true)}
              disabled={isVerifying}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981] hover:bg-[#D1FAE5] transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
            >
              Reject
            </button>
          </div>
        )}
        {doc.fileUrl && (
          <>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#9CA3AF] transition-colors"
            >
              <Eye size={12} />
            </a>
            <a
              href={doc.fileUrl}
              download={doc.filename}
              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#9CA3AF] transition-colors"
            >
              <Download size={12} />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

// Review Modal Component
function ReviewModal({
  request,
  action,
  onClose,
  onSubmit,
  isLoading,
}: {
  request: VerificationRequest;
  action: "approve" | "reject" | "info";
  onClose: () => void;
  onSubmit: (note?: string) => void;
  isLoading: boolean;
}) {
  const [note, setNote] = useState("");

  const META = {
    approve: { title: "Approve Verification", icon: CheckCircle, color: "#10B981", btnLabel: "Confirm Approval", btnStyle: "bg-[#10B981] hover:bg-[#059669]" },
    reject: { title: "Reject Application", icon: XCircle, color: "#EF4444", btnLabel: "Reject Application", btnStyle: "bg-[#EF4444] hover:bg-[#DC2626]" },
    info: { title: "Request More Information", icon: MessageSquare, color: "#3B82F6", btnLabel: "Send Request", btnStyle: "bg-[#3B82F6] hover:bg-[#2563EB]" },
  }[action];

  const Icon = META.icon;

  const handleSubmit = () => {
    if (action === "reject" && !note.trim()) return;
    if (action === "info" && !note.trim()) return;
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
              <p className="text-[11px] text-[#9CA3AF]">{request.name} · {request.scnNumber}</p>
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
                action === "reject" ? "Explain why this application was rejected…" :
                "Specify what additional information or documents are needed…"
              }
              className="w-full h-24 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || ((action === "reject" || action === "info") && !note.trim())}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${META.btnStyle}`}
            >
              {isLoading ? <><Loader2 size={13} className="animate-spin" /> Processing…</> : META.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Request Card Component
function RequestCard({
  req,
  profileId,
  onAction,
  onDocumentVerify,
  isActionLoading,
}: {
  req: VerificationRequest;
  profileId: string;
  onAction: (req: VerificationRequest, action: "approve" | "reject" | "info") => void;
  onDocumentVerify: (documentId: string, verified: boolean) => void;
  isActionLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md hover:-translate-y-0.5"
    }`}>
      <div className="h-0.5 w-full" style={{ background: STATUS_CFG[req.status].dot }} />

      <div className="p-5">
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar initials={req.initials} color={req.color} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-[14px] font-bold text-[#111827] leading-tight">{req.name}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{req.scnNumber}</p>
              </div>
              <StatusChip status={req.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { icon: MapPin, value: req.state },
            { icon: Award, value: `Called ${req.calledAt} (${req.yearsCall}yr)` },
            { icon: Calendar, value: req.submittedAt.split("·")[0].trim() },
            { icon: Scale, value: req.specialisms.join(", ") },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <Icon size={11} className="text-[#9CA3AF] flex-shrink-0" /> {value}
            </div>
          ))}
        </div>

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

        {req.reviewedBy && (
          <p className="text-[11px] text-[#9CA3AF] mb-4">
            Reviewed by <strong className="text-[#6B7280]">{req.reviewedBy}</strong> on {req.reviewedAt}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Documents ({req.documents.filter(d => d.verified === true).length}/{req.documents.length} verified)
          </p>
          <div className="flex items-center gap-1">
            {req.documents.map(d => (
              <div key={d.id} className={`w-2 h-2 rounded-full ${
                d.verified === true ? "bg-[#10B981]" :
                d.verified === false ? "bg-[#EF4444]" :
                "bg-[#E5E7EB]"
              }`} title={d.label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {req.status === "pending" && (
            <>
              <button
                onClick={() => onAction(req, "approve")}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 transition-colors">
                <Check size={12} /> Approve
              </button>
              <button
                onClick={() => onAction(req, "info")}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#3B82F6] border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] disabled:opacity-50 transition-colors">
                <MessageSquare size={12} /> Request Info
              </button>
              <button
                onClick={() => onAction(req, "reject")}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors">
                <X size={12} /> Reject
              </button>
            </>
          )}

          {req.status === "info_requested" && (
            <>
              <button
                onClick={() => onAction(req, "approve")}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 transition-colors">
                <Check size={12} /> Approve Now
              </button>
              <button
                onClick={() => onAction(req, "reject")}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 px-4 justify-center py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors">
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

        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-2">
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Submitted Documents</p>
            {req.documents.map(doc => (
              <DocRow 
                key={doc.id} 
                doc={doc} 
                profileId={profileId}
                onVerify={onDocumentVerify}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to transform API LawyerFull to VerificationRequest
const transformToVerificationRequest = (lawyer: LawyerFull): VerificationRequest => {
  const fullName = lawyer?.fullName;
  const initials = fullName.split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2);
  
  // Extract documents from verificationDocuments
  const documents: Document[] = (lawyer.verificationDocuments || []).map((doc: any, index: number) => ({
    id: doc._id || `doc_${index}`,
    label: doc.label || "Document",
    filename: doc.filename || "document.pdf",
    uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Unknown",
    size: formatFileSize(doc.sizeBytes || 0),
    verified: doc.verified ?? null,
    fileUrl: doc.fileUrl,
    sizeBytes: doc.sizeBytes,
  }));

  // Add required document templates if missing
  const requiredDocs = ["Call to Bar Certificate", "Law School Certificate", "Practicing License", "Government-Issued ID"];
  for (const required of requiredDocs) {
    if (!documents.some(d => d.label === required)) {
      documents.push({
        id: `missing_${required}`,
        label: required,
        filename: "Not uploaded",
        uploadedAt: "",
        size: "0 B",
        verified: null,
      });
    }
  }
  return {
    id: lawyer._id,
    name: fullName,
    initials,
    color: lawyer.colorA || "#1E4040",
    email: lawyer?.email || "",
    phone: "",
    state: lawyer.state || "",
    scnNumber: lawyer.scnNumber || "",
    yearsCall: lawyer.yearOfCall ? new Date().getFullYear() - lawyer.yearOfCall : 0,
    calledAt: lawyer.calledAt?.toString() || "",
    specialisms: lawyer.specialisms || [],
    submittedAt: lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString() : "Unknown",
    status: mapApiStatusToUI(lawyer.verificationStatus),
    documents,
    reviewedBy: undefined,
    reviewedAt: undefined,
    lawyerData: lawyer,
  };
};

// Main Page Component
export default function VerificationsPage() {
  const [tab, setTab] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<{
    req: VerificationRequest;
    action: "approve" | "reject" | "info";
  } | null>(null);

  // Build query params
  const queryParams = {
    page,
    pageSize: 10,
    search: search || undefined,
    verificationStatus: tab === "all" ? undefined : tab as ApiVerificationStatus,
  };

  // RTK Query hooks
  const { data: lawyersData, isLoading: isLoadingList, refetch } = useAdminListLawyersQuery(queryParams);
  const { data: statsData, refetch: refetchStats } = useAdminGetLawyerStatsQuery();
  
  const [advanceVerification, { isLoading: isAdvancing }] = useAdminAdvanceVerificationMutation();
  const [rejectVerification, { isLoading: isRejecting }] = useAdminRejectVerificationMutation();
  const [verifyDocument, { isLoading: isVerifyingDoc }] = useAdminVerifyDocumentMutation();

  const isActionLoading = isAdvancing || isRejecting || isVerifyingDoc;

  // Transform API data to VerificationRequest array
  const requests: VerificationRequest[] = lawyersData?.data?.data?.map(transformToVerificationRequest) || [];

  // Stats from API
  const stats = [
    { label: "Total Lawyers", value: statsData?.data?.total || 0, icon: FileText, color: "#7C3AED", bg: "#FFF0F5" },
    { label: "Pending Review", value: statsData?.data?.byStatus?.pending || 0, icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Approved", value: statsData?.data?.byStatus?.approved || 0, icon: CheckCircle, color: "#10B981", bg: "#ECFDF5" },
    { label: "Rejected", value: statsData?.data?.byStatus?.rejected || 0, icon: XCircle, color: "#EF4444", bg: "#FEF2F2" },
  ];

  // Filter requests by tab (client-side filter for pending/info_requested distinction)
  const filteredRequests = requests.filter(req => {
    if (tab === "pending") return req.status === "pending";
    if (tab === "approved") return req.status === "approved";
    if (tab === "rejected") return req.status === "rejected";
    if (tab === "info_requested") return req.status === "info_requested";
    return true;
  });

  // Tab counts
  const tabCounts = {
    pending: requests.filter(r => r.status === "pending").length,
    info_requested: requests.filter(r => r.status === "info_requested").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    all: requests.length,
  };

  const handleAdvance = async (req: VerificationRequest, note?: string) => {
    try {
      await advanceVerification({ profileId: req.id, note }).unwrap();
      refetch();
      refetchStats();
      setModalState(null);
    } catch (error) {
      console.error("Failed to advance verification:", error);
    }
  };

  const handleReject = async (req: VerificationRequest, reason?: string) => {
    try {
      await rejectVerification({ profileId: req.id, reason: reason || "No reason provided" }).unwrap();
      refetch();
      refetchStats();
      setModalState(null);
    } catch (error) {
      console.error("Failed to reject verification:", error);
    }
  };

  const handleRequestInfo = async (req: VerificationRequest, note?: string) => {
    // For info_requested, we can use the reject endpoint with a note
    // Or implement a separate endpoint if available
    try {
      await rejectVerification({ profileId: req.id, reason: note || "Additional information required", infoNeeded: "true" }).unwrap();
      refetch();
      refetchStats();
      setModalState(null);
    } catch (error) {
      console.error("Failed to request info:", error);
    }
  };

  const handleDocumentVerify = async (profileId: string, documentId: string, verified: boolean) => {
    try {
      await verifyDocument({ profileId, documentId, verified }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to verify document:", error);
    }
  };

  const handleModalSubmit = (note?: string) => {
    if (!modalState) return;
    const { req, action } = modalState;
    
    switch (action) {
      case "approve":
        handleAdvance(req, note);
        break;
      case "reject":
        handleReject(req, note);
        break;
      case "info":
        handleRequestInfo(req, note);
        break;
    }
  };

  return (
    <>
      {modalState && (
        <ReviewModal
          request={modalState.req}
          action={modalState.action}
          onClose={() => setModalState(null)}
          onSubmit={handleModalSubmit}
          isLoading={isActionLoading}
        />
      )}

      <div className="p-6 xl:p-8 max-w-5xl mx-auto">
        <PageHeader
          title="Lawyer Verifications"
          subtitle="Review and approve lawyer credential applications before they go live on the marketplace."
        />

        <div className="mb-6 flex items-start gap-3 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl">
          <ShieldCheck size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#92400E]">
            <strong>Verification checklist:</strong> Call to Bar certificate · Nigerian Law School certificate · Current (2025) Supreme Court practicing license · Government-issued ID. All four documents must be present and valid before approving.
          </div>
        </div>

        <StatBar items={stats} />

        <FilterBar
          options={[
            { value: "all", label: "All", count: statsData?.data?.total || 0 },
            { value: "pending", label: "Pending", count: statsData?.data?.byStatus?.pending || 0 },
            { value: "info_requested", label: "Info Needed", count: statsData?.data?.byStatus?.pending || 0 },
            { value: "approved", label: "Approved", count: statsData?.data?.byStatus?.approved || 0 },
            { value: "rejected", label: "Rejected", count: statsData?.data?.byStatus?.rejected || 0 },
          ]}
          value={tab}
          onChange={setTab}
          searchPlaceholder="Search by name, SCN number, or state…"
          searchValue={search}
          onSearchChange={setSearch}
        />

        {isLoadingList ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <Loader2 size={36} className="text-[#7C3AED] mx-auto mb-3 animate-spin" />
            <p className="text-sm font-semibold text-[#9CA3AF]">Loading verifications...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <ShieldCheck size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No requests found</p>
            <p className="text-[12px] text-[#D1D5DB]">All clear in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredRequests.map(req => (
              <RequestCard
                key={req.id}
                req={req}
                profileId={req.id}
                onAction={(r, action) => setModalState({ req: r, action })}
                onDocumentVerify={(docId, verified) => handleDocumentVerify(req.id, docId, verified)}
                isActionLoading={isActionLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {lawyersData?.data && lawyersData.data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] disabled:opacity-50 hover:bg-[#F9FAFB] transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-[12px] text-[#6B7280]">
              Page {page} of {lawyersData.data.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(lawyersData.data.totalPages, p + 1))}
              disabled={page === lawyersData.data.totalPages}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] disabled:opacity-50 hover:bg-[#F9FAFB] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}