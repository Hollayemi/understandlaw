"use client";
import React, { useState } from "react";
import {
  X, Loader2, Check, Send,
  Calendar, Link as LinkIcon, FileText, Upload, Eye, Download, Sparkles,
  Users, Search, CheckCircle2, AlertCircle, Zap, BadgeCheck,
} from "lucide-react";
import { MatchRequest, RecommendedLawyerRef } from "@/redux/types/consultation";
import { LawyerFull, ConsultationDocumentMeta } from "@/redux/types/lawyer";
import {
  useAdminAcceptMatchRequestMutation,
  useAdminSendMatchMessageMutation,
  useAdminScheduleMatchCallMutation,
  useAdminAddMatchDocumentMutation,
  useAdminRecommendLawyersMutation,
  useAdminUpdateMatchMutation,
} from "@/redux/slices/admin/consultation.slice";
import { useAdminListLawyersQuery } from "@/redux/slices/admin/lawyer.slice";
import { MATCH_STATUS_CFG, MODE_CFG, STATUS_CFG } from "@/app/components/config";
import { DocumentPreviewModal } from "@/app/dashboard/consultations/components";
import { formatFileSize, formatTime } from "@/utils/function";

const MAX_RECOMMENDED = 5;

export function MatchRequestDrawer({ req, onClose, onUpdate }: { req: MatchRequest; onClose: () => void; onUpdate: () => void }) {
  console.log({ req })
  const [status, setStatus] = useState(req.status);
  const [adminMessage, setAdminMessage] = useState(req.adminMessage);
  const [adminMessageAt, setAdminMessageAt] = useState(req.adminMessageAt);
  const [scheduledCall, setScheduledCall] = useState(req.scheduledCall);
  const [documents, setDocuments] = useState<ConsultationDocumentMeta[]>(req.documents || []);
  const [caseBrief, setCaseBrief] = useState<ConsultationDocumentMeta | undefined>(req.caseBrief);
  const [recommendedLawyers, setRecommendedLawyers] = useState<any>(req.recommendedLawyers || []);
  const [activeTab, setActiveTab] = useState<"details" | "handle" | "documents" | "recommend">("details");

  const [acceptRequest, { isLoading: accepting }] = useAdminAcceptMatchRequestMutation();
  const [updateState, { isLoading: updateLoading }] = useAdminUpdateMatchMutation()


  const modeCfg = MODE_CFG[req.mode];
  const ModeIcon = modeCfg.icon;
  const statusCfg = MATCH_STATUS_CFG[status];

  const handleAccept = async () => {
    try {
      await acceptRequest({ matchRequestId: req.id }).unwrap();
      setStatus("in_review");
      onUpdate();
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };


  const handleStatus = async (status: string) => {
    await updateState({ matchRequestId: req.id, status })
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #E8317A, #ff6fa8)" }} />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#9CA3AF]">{req.id}</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: statusCfg.bg, color: statusCfg.text }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                  {statusCfg.label}
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2">{req.specialism.displayName}</h2>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${req.citizen.color}, ${req.citizen.color}80)` }}>
                {req.citizen.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827]">{req.citizen.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">Requested {formatTime(req.createdAt)}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <ModeIcon size={12} style={{ color: modeCfg.color }} />
              <span className="text-[11px] font-semibold" style={{ color: modeCfg.color }}>{modeCfg.label}</span>
            </div>
          </div>

          {req.consultationId && (
            <div className="flex items-center gap-2 mt-4 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl px-3 py-2.5">
              <BadgeCheck size={13} className="text-[#059669] shrink-0" />
              <p className="text-[11px] text-[#065F46] flex-1">
                Matched — this request became <span className="font-mono font-semibold">{req.consultationId}</span>.
              </p>
              <span className="text-[10px] font-bold text-[#065F46] whitespace-nowrap">See Consultations → Payment Proof</span>
            </div>
          )}

          {(status === "pending" || status === "unassigned") && (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              {accepting ? <><Loader2 size={13} className="animate-spin" /> Accepting…</> : <><CheckCircle2 size={13} /> Accept & Start Review</>}
            </button>
          )}
          {(status === "ready_for_call" || status === "in_review") && (
            <button
              onClick={() => handleStatus("recommended")}
              disabled={accepting}
              className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              {accepting ? <><Loader2 size={13} className="animate-spin" /> Matching…</> : <><CheckCircle2 size={13} /> Match Client</>}
            </button>
          )}

          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mt-4">
            {([
              { id: "details" as const, label: "Case" },
              { id: "handle" as const, label: "Handle" },
              { id: "documents" as const, label: "Documents" },
              { id: "recommend" as const, label: "Recommend" },
            ]).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <CaseDetailsTab req={req} />
          )}

          {activeTab === "handle" && (
            <HandleTab
              req={req}
              adminMessage={adminMessage}
              adminMessageAt={adminMessageAt}
              scheduledCall={scheduledCall}
              onMessageSent={(msg, at) => { setAdminMessage(msg); setAdminMessageAt(at); onUpdate(); }}
              onCallScheduled={(call) => { setScheduledCall(call); onUpdate(); }}
            />
          )}

          {activeTab === "documents" && (
            <DocumentsTab
              req={req}
              documents={documents}
              caseBrief={caseBrief}
              onDocumentAdded={(doc, isBrief) => {
                if (isBrief) setCaseBrief(doc);
                else setDocuments(prev => [...prev, doc]);
                onUpdate();
              }}
            />
          )}

          {activeTab === "recommend" && (
            <RecommendTab
              req={req}
              recommendedLawyers={recommendedLawyers}
              onRecommended={(lawyers) => { setRecommendedLawyers(lawyers); setStatus("recommended"); onUpdate(); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tab 1: Case Details ─────────────────────────────────────────────── */

function CaseDetailsTab({ req }: { req: MatchRequest }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Case Snapshot</p>
        <div className="space-y-2 text-[12px]">
          {[
            { l: "Area of Law", v: req.specialism.displayName },
            { l: "Urgency", v: formatTime(req.urgency) },
            { l: "Budget", v: req.budget || "Not specified" },
            { l: "Requested Format", v: MODE_CFG[req.mode].label },
            { l: "Expires", v: formatTime(req.expiresAt) },
          ].map(r => (
            <div key={r.l} className="flex justify-between border-b border-[#F3F4F6] py-2 last:border-0">
              <span className="text-[#9CA3AF]">{r.l}</span>
              <span className="font-semibold text-[#111827] text-right">{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Consultation Summary</p>
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-4">
          <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-wrap">{req.description}</p>
        </div>
      </div>

      {req.notes && (
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Consultation Notes</p>
          <div className="bg-white border border-[#F3F4F6] rounded-xl p-4">
            <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-wrap">{req.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab 2: Handle Consultation ──────────────────────────────────────── */

function HandleTab({
  req, adminMessage, adminMessageAt, scheduledCall, onMessageSent, onCallScheduled,
}: {
  req: MatchRequest;
  adminMessage?: string;
  adminMessageAt?: string;
  scheduledCall?: { dateTime: string; link?: string; note?: string };
  onMessageSent: (msg: string, at: string) => void;
  onCallScheduled: (call: { dateTime: string; link?: string; note?: string }) => void;
}) {
  const [sendMessage, { isLoading: sending }] = useAdminSendMatchMessageMutation();
  const [scheduleCall, { isLoading: scheduling }] = useAdminScheduleMatchCallMutation();

  const [draft, setDraft] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const isMessageMode = req.mode === "message";

  const handleSend = async () => {
    if (!draft.trim()) return;
    try {
      await sendMessage({ matchRequestId: req.id, message: draft }).unwrap();
      onMessageSent(draft, new Date().toISOString());
      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSchedule = async () => {
    if (!dateTime) return;
    try {
      await scheduleCall({ matchRequestId: req.id, dateTime, link: link || undefined, note: note || undefined }).unwrap();
      onCallScheduled({ dateTime, link: link || undefined, note: note || undefined });
    } catch (error) {
      console.error("Failed to schedule call:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
        <Sparkles size={13} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          {isMessageMode
            ? "The citizen asked for a written consultation. Respond here to conduct the initial consultation yourself before recommending lawyers."
            : "The citizen asked for a call/video consultation. Organize a session so you can walk through the case before recommending lawyers."}
        </p>
      </div>

      {isMessageMode ? (
        <>
          {adminMessage && (
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Sent to Citizen</p>
                {adminMessageAt && <p className="text-[10px] text-[#D1D5DB]">{formatTime(adminMessageAt)}</p>}
              </div>
              <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-wrap">{adminMessage}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {adminMessage ? "Send a Follow-Up" : "Consultation Message"}
            </label>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Write your initial assessment and next steps for the citizen..."
              className="w-full h-32 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={sending || !draft.trim()}
              className="w-full mt-3 py-2.5 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              {sending ? <><Loader2 size={13} className="animate-spin" /> Sending…</> : <><Send size={13} /> Send Message</>}
            </button>
          </div>
        </>
      ) : (
        <>
          {scheduledCall && (
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-4 space-y-1.5">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Scheduled</p>
              <div className="flex items-center gap-2 text-[12px] text-[#111827] font-semibold">
                <Calendar size={12} className="text-[#6B7280]" /> {formatTime(scheduledCall.dateTime)}
              </div>
              {scheduledCall.link && (
                <a href={scheduledCall.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[12px] text-[#E8317A] font-semibold hover:underline">
                  <LinkIcon size={12} /> {scheduledCall.link}
                </a>
              )}
              {scheduledCall.note && <p className="text-[11px] text-[#6B7280] mt-1">{scheduledCall.note}</p>}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {scheduledCall ? "Reschedule" : "Date & Time"}
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Meeting Link <span className="font-normal text-gray-400">(optional)</span></label>
              <input
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Note to Citizen <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Please have any relevant documents ready on the call"
                className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm resize-none outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
              />
            </div>
            <button
              onClick={handleSchedule}
              disabled={scheduling || !dateTime}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              {scheduling ? <><Loader2 size={13} className="animate-spin" /> Scheduling…</> : <><Calendar size={13} /> {scheduledCall ? "Update Schedule" : "Schedule Call"}</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Tab 3: Documents ────────────────────────────────────────────────── */

function AdminDocRow({ doc, badge }: { doc: ConsultationDocumentMeta; badge: { label: string; color: string; bg: string } }) {
  const [preview, setPreview] = useState<ConsultationDocumentMeta | null>(null);
  return (
    <>
      {preview && <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-white border border-[#F3F4F6] flex items-center justify-center flex-shrink-0">
          <FileText size={13} className="text-[#6B7280]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[12px] font-semibold text-[#111827] truncate">{doc.label || doc.name}</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF]">{formatFileSize(doc.sizeBytes)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setPreview(doc)} title="Preview" className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
            <Eye size={12} className="text-[#6B7280]" />
          </button>
          {doc.fileUrl ? (
            <a href={doc.fileUrl} download={doc.name} title="Download" className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors">
              <Download size={12} className="text-[#6B7280]" />
            </a>
          ) : (
            <span className="w-7 h-7 rounded-lg flex items-center justify-center opacity-30"><Download size={12} className="text-[#6B7280]" /></span>
          )}
        </div>
      </div>
    </>
  );
}

function DocumentsTab({
  req, documents, caseBrief, onDocumentAdded,
}: {
  req: MatchRequest;
  documents: ConsultationDocumentMeta[];
  caseBrief?: ConsultationDocumentMeta;
  onDocumentAdded: (doc: ConsultationDocumentMeta, isBrief: boolean) => void;
}) {
  const [addDocument, { isLoading }] = useAdminAddMatchDocumentMutation();
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [label, setLabel] = useState("Refined Case Brief");
  const [isBrief, setIsBrief] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const clientDocs = documents.filter(d => d.source !== "firm");

  const handleAttach = async () => {
    setErrorMsg("");
    if (!file && !link) {
      setErrorMsg("Attach a file or paste a document link first.");
      return;
    }
    const document: ConsultationDocumentMeta = {
      name: file?.name || label || "Document",
      sizeBytes: file?.size || 0,
      fileUrl: link || undefined,
      label: label || undefined,
      source: "firm",
      uploadedAt: new Date().toISOString(),
    };
    try {
      await addDocument({ matchRequestId: req.id, document, isCaseBrief: isBrief }).unwrap();
      onDocumentAdded(document, isBrief);
      setFile(null);
      setLink("");
      setLabel("Refined Case Brief");
    } catch (error) {
      console.error("Failed to attach document:", error);
      setErrorMsg("Couldn't attach that document. Please try again.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Client documents */}
      <div>
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
          From the Client {clientDocs.length ? `(${clientDocs.length})` : ""}
        </p>
        {clientDocs.length === 0 ? (
          <div className="text-center py-8 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
            <FileText size={20} className="text-[#D1D5DB] mx-auto mb-2" />
            <p className="text-[12px] text-[#9CA3AF]">No documents were attached at intake</p>
          </div>
        ) : (
          <div className="space-y-2">
            {clientDocs.map((d, i) => (
              <AdminDocRow key={`${d.name}-${i}`} doc={d} badge={{ label: "From client", color: "#374151", bg: "#F3F4F6" }} />
            ))}
          </div>
        )}
      </div>

      {/* Case brief */}
      <div>
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Case Brief for the Lawyer</p>
        {caseBrief && (
          <div className="mb-3">
            <AdminDocRow doc={caseBrief} badge={{ label: "Current brief", color: "#E8317A", bg: "#FFF0F5" }} />
          </div>
        )}

        <div className="border-[1.5px] border-dashed border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-[11px] font-semibold text-gray-600">
            {caseBrief ? "Replace with an updated report" : "Attach your refined report"}
          </p>

          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center gap-2 h-10! px-3 rounded-lg border-[1.5px] border-gray-200 text-xs text-gray-500 cursor-pointer hover:border-gray-300 transition-colors">
              <Upload size={13} className="text-gray-400 shrink-0" />
              <span className="truncate">{file ? file.name : "Choose a file…"}</span>
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="relative">
            <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="…or paste a document link (Drive, Dropbox, etc.)"
              className="w-full h-10 pl-8 pr-3 rounded-lg border-[1.5px] border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
            />
          </div>

          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Label, e.g. Refined Case Brief"
            className="w-full h-10 px-3 rounded-lg border-[1.5px] border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isBrief} onChange={e => setIsBrief(e.target.checked)} className="accent-[#E8317A] w-3.5 h-3.5" />
            <span className="text-[11px] text-gray-600">This is the refined case brief for the assigned lawyer</span>
          </label>

          {errorMsg && (
            <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={11} /> {errorMsg}</p>
          )}

          <button
            onClick={handleAttach}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            {isLoading ? <><Loader2 size={13} className="animate-spin" /> Attaching…</> : <><Upload size={13} /> Attach Document</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tab 4: Recommend Lawyers ────────────────────────────────────────── */

function RecommendTab({
  req, recommendedLawyers, onRecommended,
}: {
  req: MatchRequest;
  recommendedLawyers: string[];
  onRecommended: (lawyers: RecommendedLawyerRef[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(recommendedLawyers);
  const [recommend, { isLoading }] = useAdminRecommendLawyersMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading: loadingLawyers } = useAdminListLawyersQuery({
    verificationStatus: "approved",
    search: search || undefined,
    page: 1,
    pageSize: 20,
  });

  const lawyers: LawyerFull[] = data?.data?.data || [];

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_RECOMMENDED) return prev;
      return [...prev, id];
    });
  };

  const handleSend = async () => {
    setErrorMsg("");
    if (selectedIds.length === 0) {
      setErrorMsg("Select at least one lawyer to recommend.");
      return;
    }
    const picked = lawyers.filter(l => selectedIds.includes(l._id));
    const refs: RecommendedLawyerRef[] = picked.map(l => ({
      id: l._id,
      lawyerId: l.id,
      lawyerProfileId: l._id,
      name: l.fullName,
      picture: l.picture,
      initials: l.avatarInitials,
      color: l.colorA,
      scnNumber: l.scnNumber,
      title: l.title,
      fee: String(l.fees[req.mode]),
      ratingAvg: l.ratingAvg,
      responseTimeLabel: l.responseTime,
    }));
    try {
      await recommend({ matchRequestId: req.id, lawyers: selectedIds }).unwrap();
      onRecommended(refs);
    } catch (error) {
      console.error("Failed to send recommendations:", error);
      setErrorMsg("Couldn't send that shortlist. Please try again.");
    }
  };

  
  return (
    <div className="space-y-4">
      {recommendedLawyers.length > 0 && (
        <div className="bg-[#FFF0F5] border border-[#FBCFE8] rounded-xl p-3.5 flex items-start gap-2.5">
          <Zap size={14} className="text-[#E8317A] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#9D174D] leading-relaxed">
            {recommendedLawyers.length} lawyer{recommendedLawyers.length > 1 ? "s" : ""} already recommended to this citizen.
            Selecting a new shortlist below and sending will replace it.
          </p>
        </div>
      )}

      <p className="text-[11px] text-[#6B7280] leading-relaxed">
        Choose up to {MAX_RECOMMENDED} verified lawyers who fit <strong className="text-[#111827]">{req.specialism.displayName}</strong>.
        The citizen will see this shortlist and pick who to work with.
      </p>

      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search verified lawyers by name…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
        />
      </div>

      {loadingLawyers ? (
        <div className="flex items-center justify-center py-10"><Loader2 size={20} className="animate-spin text-[#E8317A]" /></div>
      ) : lawyers.length === 0 ? (
        <div className="text-center py-10 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
          <Users size={20} className="text-[#D1D5DB] mx-auto mb-2" />
          <p className="text-[12px] text-[#9CA3AF]">No verified lawyers match that search</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {lawyers.map(l => {
            const checked = selectedIds.includes(l._id);
            return (
              <button
                key={l._id}
                onClick={() => toggle(l._id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-[1.5px] text-left transition-all ${checked ? "border-[#E8317A] bg-pink-50/60" : "border-[#F3F4F6] hover:border-gray-300"}`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${l.colorA}, ${l.colorB})` }}>
                  {l.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-bold text-[#111827] truncate">{l.fullName}</p>
                    <BadgeCheck size={11} className="text-[#F59E0B] shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{l.title} · {l.responseTimeLabel}</p>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${checked ? "bg-[#E8317A] border-[#E8317A]" : "border-gray-300"}`}>
                  {checked && <Check size={11} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={11} /> {errorMsg}</p>}

      <button
        onClick={handleSend}
        disabled={isLoading || selectedIds.length === 0}
        className="w-full py-3 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
      >
        {isLoading ? <><Loader2 size={13} className="animate-spin" /> Sending…</> : <>Send Shortlist to Citizen ({selectedIds.length})</>}
      </button>
    </div>
  );
}
