"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { MessageSquare, Check, CheckCircle, AlertTriangle, Star, Send, Loader2, X, RotateCcw, Gavel, ArrowRight, Shield, FileText, ThumbsUp, HelpCircle, ExternalLink, BadgeCheck, Cog, Download, Eye, FileImage, File as FileIcon, Lock, Sparkles, Paperclip, AlertCircle, } from "lucide-react";
import { Consultation2 as Consultation, ConsultStatus } from "@/redux/types/consultation";
import { ConsultationDocumentMeta } from "@/redux/types/lawyer";
import { STATUS_CFG, MODE_CFG } from "@/app/components/config";
import { usePayConsultationMutation } from "@/redux/slices/consultation.slice";
import { useRouter } from "next/navigation";
import { useGetMessagesQuery } from "@/redux/slices/chat.slice";
import { formatTime, formatFileSize } from "@/utils/function";

export function getJourneyStep(status: ConsultStatus): number {
  if (status === "pending") return 0;
  if (status === "paid") return 1;
  if (status === "awaiting_lawyer") return 2;
  if (status === "active") return 3;
  return 4;
}

// ─── StarRating ───────────────────────────────────────────────────────────────

export function StarRating({ value, onChange, size = 18 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "transition-transform hover:scale-110" : ""}
        >
          <Star
            size={size}
            className={(hovered || value) >= i ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-100"}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Journey tracker (the signature element) ─────────────────────────────────

export function JourneyTracker({ status }: { status: ConsultStatus }) {
  const step = getJourneyStep(status);
  const labels = ["Paid", "With Lawyer", "Responded", "Done"];
  const cancelled = status === "cancelled";
  const disputed = status === "disputed";

  return (
    <div className="flex items-center gap-0 w-full">
      {labels.map((label, i) => {
        const done = step > i + 1;
        const active = step === i + 1;
        const isLast = i === labels.length - 1;

        const dotColor = cancelled
          ? i === 0 ? "#E8317A" : "#E5E7EB"
          : disputed && i >= 3
            ? "#EF4444"
            : done || (active && !isLast)
              ? "#E8317A"
              : active
                ? "#E8317A"
                : "#E5E7EB";

        const lineColor = done ? "#E8317A" : "#E5E7EB";

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: done ? "#E8317A" : active ? "#FFF0F5" : "#F3F4F6",
                  border: `2px solid ${dotColor}`,
                }}
              >
                {done ? (
                  <CheckCircle size={10} className="text-white fill-white" style={{ color: "white" }} />
                ) : active ? (
                  <span className="w-2 h-2 rounded-full bg-[#E8317A]" />
                ) : null}
              </div>
              <span
                className="text-[9px] font-semibold whitespace-nowrap"
                style={{ color: done || active ? "#E8317A" : "#9CA3AF" }}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className="flex-1 h-[2px]! mb-4 mx-1 rounded-full transition-all"
                style={{ background: lineColor }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Case Documents (shared between citizen & lawyer drawers) ────────────────

function guessKind(name: string): "image" | "pdf" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

function DocIcon({ name, className }: { name: string; className?: string }) {
  const kind = guessKind(name);
  if (kind === "image") return <FileImage size={13} className={className} />;
  if (kind === "pdf") return <FileText size={13} className={className} />;
  return <FileIcon size={13} className={className} />;
}

export function DocumentPreviewModal({ doc, onClose }: { doc: ConsultationDocumentMeta; onClose: () => void }) {
  const kind = guessKind(doc.name);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center flex-shrink-0">
              <DocIcon name={doc.name} className="text-[#6B7280]" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#111827] truncate">{doc.label || doc.name}</p>
              <p className="text-[10px] text-[#9CA3AF]">{formatFileSize(doc.sizeBytes)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {doc.fileUrl && (
              <a
                href={doc.fileUrl}
                download={doc.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
              >
                <Download size={11} /> Download
              </a>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <X size={14} className="text-[#6B7280]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#F5F2EE] flex items-center justify-center p-4">
          {!doc.fileUrl ? (
            <div className="text-center py-10">
              <FileIcon size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Preview unavailable</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                This file hasn't finished processing yet. Check back shortly.
              </p>
            </div>
          ) : kind === "image" ? (
            <img src={doc.fileUrl} alt={doc.name} className="max-w-full max-h-full rounded-lg object-contain" />
          ) : kind === "pdf" ? (
            <iframe src={doc.fileUrl} title={doc.name} className="w-full h-[65vh] rounded-lg bg-white" />
          ) : (
            <div className="text-center py-10">
              <FileIcon size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">No inline preview for this file type</p>
              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8317A] hover:underline mt-2">
                Open in new tab <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc, badge }: { doc: ConsultationDocumentMeta; badge?: { label: string; color: string; bg: string } }) {
  const [preview, setPreview] = useState<ConsultationDocumentMeta | null>(null);
  return (
    <>
      {preview && <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-white border border-[#F3F4F6] flex items-center justify-center flex-shrink-0">
          <DocIcon name={doc.name} className="text-[#6B7280]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[12px] font-semibold text-[#111827] truncate">{doc.label || doc.name}</p>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#9CA3AF]">{formatFileSize(doc.sizeBytes)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setPreview(doc)}
            title="Preview"
            className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors"
          >
            <Eye size={12} className="text-[#6B7280]" />
          </button>
          {doc.fileUrl ? (
            <a
              href={doc.fileUrl}
              download={doc.name}
              title="Download"
              className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-[#F3F4F6] flex items-center justify-center transition-colors"
            >
              <Download size={12} className="text-[#6B7280]" />
            </a>
          ) : (
            <span title="Not ready yet" className="w-7 h-7 rounded-lg flex items-center justify-center opacity-30">
              <Download size={12} className="text-[#6B7280]" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export function DocumentsPanel({
  documents,
  caseBrief,
  notes,
  urgencyLabel,
  viewerRole,
}: {
  documents?: ConsultationDocumentMeta[];
  caseBrief?: ConsultationDocumentMeta;
  notes?: string;
  urgencyLabel?: string;
  viewerRole: "citizen" | "lawyer";
}) {
  const clientDocs = (documents || []).filter(d => d.source !== "firm");
  const firmDocs = (documents || []).filter(d => d.source === "firm");
  const hasAnything = !!caseBrief || clientDocs.length > 0 || firmDocs.length > 0 || !!notes;

  return (
    <div className="p-5 space-y-4">
      {urgencyLabel && (
        <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF]">
          <AlertCircle size={11} />
          <span>Urgency: <strong className="text-[#374151]">{urgencyLabel}</strong></span>
        </div>
      )}

      {caseBrief && (
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
            {viewerRole === "citizen" ? "Our Case Brief" : "Case Brief — From LawTicha"}
          </p>
          <div className="rounded-xl border-[1.5px] border-[#FBCFE8] bg-[#FFF0F5] p-1">
            <DocRow doc={caseBrief} badge={{ label: "Prepared by our team", color: "#E8317A", bg: "#FFFFFF" }} />
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed flex items-start gap-1.5">
            <Sparkles size={11} className="shrink-0 mt-0.5" />
            {viewerRole === "citizen"
              ? "This is the refined summary our team put together from your intake and shared with your matched lawyer."
              : "A refined summary prepared by the LawTicha team from the client's intake — a quick way to get up to speed."}
          </p>
        </div>
      )}

      {notes && (
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Consultation Notes</p>
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-4">
            <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-wrap">{notes}</p>
          </div>
        </div>
      )}

      {(clientDocs.length > 0 || firmDocs.length > 0) && (
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
            Attached Documents {documents?.length ? `(${documents.length})` : ""}
          </p>
          <div className="space-y-2">
            {clientDocs.map((d, i) => (
              <DocRow
                key={`${d.name}-${i}`}
                doc={d}
                badge={
                  viewerRole === "lawyer"
                    ? { label: "From client", color: "#374151", bg: "#F3F4F6" }
                    : { label: "You attached this", color: "#374151", bg: "#F3F4F6" }
                }
              />
            ))}
            {firmDocs.map((d, i) => (
              <DocRow key={`${d.name}-firm-${i}`} doc={d} badge={{ label: "From our team", color: "#E8317A", bg: "#FFF0F5" }} />
            ))}
          </div>
        </div>
      )}

      {!hasAnything && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-3">
            <Paperclip size={20} className="text-[#D1D5DB]" />
          </div>
          <p className="text-sm font-semibold text-[#9CA3AF]">No documents yet</p>
          <p className="text-[11px] text-[#D1D5DB] mt-1 max-w-xs mx-auto">
            {viewerRole === "citizen"
              ? "Anything you attach at booking, or that our team prepares for your lawyer, will show up here."
              : "Any documents or notes the client shared at intake will show up here."}
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
        <Lock size={13} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          {viewerRole === "citizen"
            ? "Documents are only visible to you and the lawyer(s) assigned to this consultation."
            : "These documents were shared specifically for this consultation — please treat them as confidential."}
        </p>
      </div>
    </div>
  );
}

// ─── Consultation Detail Drawer ───────────────────────────────────────────────

export const ConversationTab = ({ consult, isAdmin = false }: { consult: Consultation; isAdmin?: boolean }) => {
  console.log({consult})
  const router = useRouter()
  const { data: rawMessages, isLoading } = useGetMessagesQuery({ conversationId: consult.conversationId, isAdmin })
  const messages = rawMessages?.data?.messages || []
  console.log({ messages })

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={20} className="text-[#D1D5DB]" />
            </div>
            <p className="text-sm font-semibold text-[#9CA3AF]">No messages yet</p>
            <p className="text-[11px] text-[#D1D5DB] mt-1">
              {consult.status === "awaiting_lawyer"
                ? "Your lawyer is reviewing your request and will respond shortly."
                : "The conversation will appear here once it starts."}
            </p>
            {consult.status === "awaiting_lawyer" && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#E8317A] font-semibold">
                <Loader2 size={11} className="animate-spin" />
                Awaiting lawyer response…
              </div>
            )}
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg._id}
              className={`flex gap-2.5 ${msg.senderRole !== "lawyer" ? "flex-row-reverse" : ""}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{
                  background:
                    msg.senderRole === "citizen"
                      ? "linear-gradient(135deg, #6B7280, #9CA3AF)"
                      : `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)`,
                }}
              >
                {msg.senderRole === "citizen" ? "You" : consult.lawyer.initials}
              </div>
              <div className={`flex max-w-[85%] flex flex-col ${msg.senderRole === "lawyer" ? "items-end" : ""}`}>
                <div className={`flex items-center gap-2 mb-1 ${msg.senderRole === "lawyer" ? "flex-row-reverse" : ""}`}>
                  <p className="text-[10px] font-semibold text-[#9CA3AF]">{msg.senderName}</p>
                  <p className="text-[10px] text-[#D1D5DB]">{formatTime(msg.createdAt)}</p>
                </div>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${msg.senderRole === "citizen"
                    ? "bg-[#F3F4F6] text-[#374151] rounded-tl-sm"
                    : "text-white rounded-tr-sm"
                    }`}
                  style={
                    msg.senderRole === "lawyer"
                      ? { background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}cc)` }
                      : {}
                  }
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4">
        <button onClick={() => router.push("/dashboard/chat")} className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
          Open Conversation
        </button>
      </div>
    </div>
  )
}

export function ConsultationDrawer({
  consult,
  onClose,
  onRaiseDispute,
  onRequestRefund,
  onSubmitRating,
}: {
  consult: Consultation;
  onClose: () => void;
  onRaiseDispute: (id: string, reason: string) => void;
  onRequestRefund: (id: string) => void;
  onSubmitRating: (id: string, rating: number, note: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"conversation" | "documents" | "details" | "help">("conversation");
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [rating, setRating] = useState(consult.rating ?? 0);
  const [ratingNote, setRatingNote] = useState(consult.ratingNote ?? "");
  const [ratingSubmitted, setRatingSubmitted] = useState(!!consult.rating);
  const [loading, setLoading] = useState(false);


  const cfg = STATUS_CFG[consult.status];
  const StatusIcon = cfg.icon;

  console.log(consult)

  const handleRatingSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onSubmitRating(consult.id, rating, ratingNote);
    setRatingSubmitted(true);
    setLoading(false);
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onRaiseDispute(consult.id, disputeReason);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">
        {/* Accent bar */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{
            background:
              consult.status === "disputed" ? "#EF4444"
                : consult.status === "completed" ? "#10B981"
                  : consult.status === "cancelled" ? "#9CA3AF"
                    : "linear-gradient(90deg, #E8317A, #ff6fa8)",
          }}
        />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              {/* <p className="text-[10px] font-mono font-bold text-[#9CA3AF] mb-1">{consult.id}</p> */}
              <h2 className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-2">{consult.topic}</h2>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors flex-shrink-0 mt-0.5">
              <X size={16} />
            </button>
          </div>

          {/* Lawyer row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)` }}
            >
              {consult.lawyer.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-semibold text-[#111827]">{consult.lawyer.name}</p>
                <BadgeCheck size={12} className="text-amber-500 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.specialisms[0].displayName}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: cfg.bg, color: cfg.text }}
              >
                <StatusIcon size={9} />
                {cfg.userLabel}
              </span>
            </div>
          </div>

          {/* Journey */}
          {consult.status !== "cancelled" && (
            <div className="mb-4">
              <JourneyTracker status={consult.status} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
            {([
              { id: "conversation" as const, label: "Chat" },
              { id: "documents" as const, label: "Documents" },
              { id: "details" as const, label: "Details" },
              { id: "help" as const, label: consult.status === "completed" ? "Review" : "Help" },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Conversation ── */}
          {activeTab === "conversation" && (
            <ConversationTab consult={consult} />
          )}

          {/* ── Documents ── */}
          {activeTab === "documents" && (
            <DocumentsPanel
              documents={consult.documents}
              caseBrief={consult.caseBrief}
              notes={consult.notes}
              urgencyLabel={consult.urgencyLabel}
              viewerRole="citizen"
            />
          )}

          {/* ── Details & Receipt ── */}
          {activeTab === "details" && (
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Consultation Details</p>
                <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] divide-y divide-[#F3F4F6] text-[12px]">
                  {[
                    { l: "Mode", v: MODE_CFG[consult.mode].label },
                    { l: "Requested", v: formatTime(consult.createdAt) },
                    ...(consult.scheduledAt ? [{ l: "Scheduled for", v: formatTime(consult.scheduledAt) }] : []),
                    ...(consult.completedAt ? [{ l: "Completed", v: formatTime(consult.completedAt) }] : []),
                    { l: "Payment ref", v: consult.receiptId ?? "—" },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between items-center px-4 py-3">
                      <span className="text-[#9CA3AF]">{r.l}</span>
                      <span className="font-semibold text-[#111827] text-right max-w-[200px] truncate">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Fee Breakdown</p>
                <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                  <div className="space-y-2.5 text-[13px]">
                    {[
                      { l: "Consultation fee", v: `NGN ${consult.fee.toLocaleString()}`, bold: false },
                      { l: "Platform service fee", v: `NGN ${consult.platformFee.toLocaleString()}`, bold: false, note: "Covers secure payments & platform" },
                      { l: "Total charged", v: `NGN ${(consult.fee).toLocaleString()}`, bold: true },
                    ].map(r => (
                      <div key={r.l} className={`flex justify-between items-start py-1.5 ${r.bold ? "border-t border-[#E5E7EB] pt-2.5 mt-1" : ""}`}>
                        <div>
                          <span className={r.bold ? "font-bold text-[#111827]" : "text-[#9CA3AF]"}>{r.l}</span>
                          {r.note && <p className="text-[10px] text-[#D1D5DB] mt-0.5">{r.note}</p>}
                        </div>
                        <span className={r.bold ? "font-bold text-[#111827] text-[14px]" : "font-medium text-[#374151]"}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lawyer card */}
              <div>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Your Lawyer</p>
                <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)` }}
                  >
                    {consult.lawyer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-bold text-[#111827]">{consult.lawyer.name}</p>
                      <BadgeCheck size={12} className="text-amber-500" />
                    </div>
                    <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.nbaNumber}</p>
                  </div>
                  <Link
                    href={`/dashboard/marketplace/${consult.lawyer.nbaNumber.replaceAll("/", "-")}`}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline flex-shrink-0"
                  >
                    Profile <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Rate & Review / Help ── */}
          {activeTab === "help" && (
            <div className="p-5 space-y-4">

              {/* Rate & Review — only for completed */}
              {consult.status === "completed" && (
                <div>
                  {ratingSubmitted ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center">
                      <div className="flex justify-center mb-2">
                        <StarRating value={rating} size={20} />
                      </div>
                      <p className="text-[13px] font-bold text-[#92400E] mb-1">Review submitted</p>
                      {ratingNote && (
                        <p className="text-[12px] text-[#92400E] leading-relaxed">"{ratingNote}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-5">
                      <p className="text-[12px] font-bold text-[#111827] mb-1">How was your consultation?</p>
                      <p className="text-[11px] text-[#9CA3AF] mb-4">Your review helps other Nigerians find the right lawyer.</p>
                      <div className="flex justify-center mb-4">
                        <StarRating value={rating} onChange={setRating} size={28} />
                      </div>
                      <textarea
                        value={ratingNote}
                        onChange={e => setRatingNote(e.target.value)}
                        placeholder="Tell us what was helpful (optional)…"
                        className="w-full h-18 px-3 py-2.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors mb-3"
                        rows={3}
                      />
                      <button
                        onClick={handleRatingSubmit}
                        disabled={!rating || loading}
                        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 hover:-translate-y-0.5 transition-all"
                        style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                      >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} />}
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(consult.status === "active" || consult.status === "completed") && !consult.disputed && (
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={13} className="text-[#EF4444]" />
                    <p className="text-[12px] font-bold text-[#991B1B]">Not satisfied?</p>
                  </div>
                  <p className="text-[11px] text-[#6B7280] mb-3 leading-relaxed">
                    If you believe the advice given was incorrect or insufficient, you can raise a dispute within 7 days. An admin will review the consultation.
                  </p>
                  {!showDisputeForm ? (
                    <button
                      onClick={() => setShowDisputeForm(true)}
                      className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] hover:bg-[#FEE2E2] transition-colors"
                    >
                      Raise a Dispute
                    </button>
                  ) : (
                    <div className="space-y-2.5">
                      <textarea
                        value={disputeReason}
                        onChange={e => setDisputeReason(e.target.value)}
                        placeholder="Describe the issue clearly. What was wrong or missing from the advice?"
                        className="w-full h-20 px-3 py-2.5 rounded-xl border-[1.5px] border-[#FCA5A5] text-[12px] text-[#111827] resize-none outline-none focus:border-[#EF4444] placeholder:text-[#D1D5DB] transition-colors"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDisputeForm(false)}
                          className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDispute}
                          disabled={!disputeReason.trim() || loading}
                          className="flex-1 py-2 rounded-xl text-[11px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? <Loader2 size={10} className="animate-spin" /> : <Gavel size={10} />}
                          Submit Dispute
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Disputed status */}
              {consult.disputed && (
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel size={13} className="text-[#EF4444]" />
                    <p className="text-[12px] font-bold text-[#991B1B]">Dispute submitted — under admin review</p>
                  </div>
                  <p className="text-[12px] text-[#374151] leading-relaxed">{consult.disputeReason}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-2">
                    Our team reviews disputes within 48–72 hours. You will be notified of the outcome.
                  </p>
                </div>
              )}

              {/* Refund request */}
              {consult.status === "awaiting_lawyer" && (
                <div className="bg-[#F5F3FF] border border-[#C4B5FD] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw size={13} className="text-[#8B5CF6]" />
                    <p className="text-[12px] font-bold text-[#4C1D95]">Cancel & request refund</p>
                  </div>
                  <p className="text-[11px] text-[#6B7280] mb-3 leading-relaxed">
                    If the lawyer has not responded within 24 hours, you can cancel and receive a full refund.
                  </p>
                  <button
                    onClick={() => onRequestRefund(consult.id)}
                    className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-[#8B5CF6] border border-[#C4B5FD] hover:bg-[#EDE9FE] transition-colors"
                  >
                    Request Refund
                  </button>
                </div>
              )}

              {/* Help links */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Need more help?</p>
                {[
                  { icon: HelpCircle, label: "How consultations work", href: "/faq#consultations" },
                  { icon: Shield, label: "Your privacy & security", href: "/legal/privacy" },
                  { icon: FileText, label: "Refund & dispute policy", href: "/legal/terms#disputes" },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:bg-[#F9FAFB] hover:border-[#E5E7EB] transition-all group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0 group-hover:bg-white">
                        <Icon size={13} className="text-[#9CA3AF]" />
                      </div>
                      <span className="text-[12px] font-medium text-[#374151] flex-1">{item.label}</span>
                      <ArrowRight size={12} className="text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ─── Consultation Card ────────────────────────────────────────────────────────

export function ConsultationCard({
  consult,
  onClick,
}: {
  consult: Consultation;
  onClick: () => void;
}) {
  const cfg = STATUS_CFG[consult.status];
  const StatusIcon = cfg.icon;
  const ModeIcon = MODE_CFG[consult.mode].icon;
  const modeColor = MODE_CFG[consult.mode].color;
  const urgent = consult.status === "active" || consult.status === "awaiting_lawyer";
  const hasUnread = consult.status === "active" && consult.transcript.some(m => m.sender === "lawyer");
  const [payConsultation, { isLoading }] = usePayConsultationMutation()
  const router = useRouter()

  const handlePayment = async () => {
    const res = await payConsultation({ id: consult.id }).unwrap()
    const paymentUrl = res.data.data.authorization_url
    router.push(paymentUrl)
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden group ${urgent ? "border-[#FBCFE8]" : consult.status === "disputed" ? "border-[#FCA5A5]" : "border-[#F3F4F6]"
        }`}
    >
      {/* Urgency stripe */}
      {urgent && (
        <div
          className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, #E8317A, #ff6fa8, #E8317A)" }}
        />
      )}

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${consult.lawyer.color}, ${consult.lawyer.color}80)` }}
            >
              {consult.lawyer.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-bold text-[#111827] truncate">{consult.lawyer.name}</p>
                <BadgeCheck size={11} className="text-amber-500 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-[#9CA3AF]">{consult.lawyer.specialisms[0].displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasUnread && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#E8317A] bg-[#FFF0F5] border border-[#FBCFE8] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8317A]" />
                New reply
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: cfg.bg, color: cfg.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
              {cfg.userLabel}
            </span>
            {cfg.action === "pay" && (
              <div
                className="bg-green-700 text-white inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                onClick={handlePayment}
              >
                {isLoading ? <Cog size={10} className="text-white rotate" /> : <>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-800" />
                  Pay Now
                </>}
              </div>
            )}
          </div>
        </div>

        {/* Topic */}
        <p className="text-[13px] font-semibold text-[#374151] leading-snug mb-3 line-clamp-2">{consult.topic}</p>
        {/* Journey tracker */}
        {consult.status !== "cancelled" && consult.status !== "refunded" && (
          <div className="mb-4">
            <JourneyTracker status={consult.status} />
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
            <div className="flex items-center gap-1" style={{ color: modeColor }}>
              <ModeIcon size={11} />
              <span className="font-semibold">{MODE_CFG[consult.mode].label}</span>
            </div>
            <span>·</span>
            <span>NGN {consult.fee.toLocaleString()}</span>
            <span>·</span>
            <span>{consult.createdAt}</span>
          </div>

          {/* Rating for completed */}
          {consult.status === "completed" && consult.rating && (
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-[#9CA3AF]">{consult.rating}/5</span>
            </div>
          )}

          {consult.status === "completed" && !consult.rating && (
            <span className="text-[11px] font-semibold text-[#E8317A]">Leave a review →</span>
          )}
        </div>
      </div>
    </button>
  );
}



interface ConfidentialityConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CONSENT_STORAGE_KEY = 'lexinova_consultation_consent';
const CONSENT_DATE_KEY = 'lexinova_consultation_consent_date';

export function ConfidentialityConsent({ onAccept, onDecline }: ConfidentialityConsentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if consent was already given today
    const checkConsent = () => {
      try {
        const consentGiven = localStorage.getItem(CONSENT_STORAGE_KEY);
        const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
        const today = new Date().toDateString();

        if (consentGiven === 'true' && consentDate === today) {
          // Consent already given today, don't show
          setIsOpen(false);
        } else {
          // Show consent popup
          setIsOpen(true);
        }
      } catch (error) {
        // If localStorage fails, show the popup as a fallback
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkConsent();
  }, []);

  const handleAccept = () => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
      localStorage.setItem(CONSENT_DATE_KEY, today);
    } catch (error) {
      console.error('Failed to save consent:', error);
    }

    setIsOpen(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setIsOpen(false);
    onDecline?.();
  };

  if (isLoading) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleDecline}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
                <button
                  onClick={handleDecline}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8317A]/10 flex items-center justify-center">
                    <Shield size={20} className="text-[#E8317A]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Confidentiality & Privacy
                    </h2>
                    <p className="text-xs text-gray-500">Please review before proceeding</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">
                    By continuing with this consultation, you agree to the following:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Attorney-Client Privilege</p>
                        <p className="text-xs text-gray-500">
                          All communications are protected by attorney-client privilege and will remain confidential.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Data Protection</p>
                        <p className="text-xs text-gray-500">
                          Your personal information and case details are encrypted and stored securely in compliance with data protection regulations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">No Legal Advice Without Engagement</p>
                        <p className="text-xs text-gray-500">
                          This consultation does not create a formal attorney-client relationship until both parties agree to proceed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Confidentiality of Shared Documents</p>
                        <p className="text-xs text-gray-500">
                          Any documents, evidence, or information shared during this consultation will be treated with the utmost confidentiality.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        This consent is valid for today. You'll be asked to confirm again tomorrow for your security.
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#E8317A] hover:bg-[#d02b6c] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Shield size={16} />
                  I Understand & Agree
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}