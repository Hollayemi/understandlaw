import { ConsultMode, ConsultStatus } from "@/redux/types/consultation";
import { MessageSquare, Phone, Video,  MessageCircle, CheckCircle, Gavel, XCircle, RotateCcw, Clock } from "lucide-react"

export const STATUS_CFG: Record<
  ConsultStatus,
  { label: string; bg: string; text: string; dot: string; lawyerLabel:string; userLabel: string; action?: string; icon: React.ElementType }
> = {
  pending:         { label: "Pending",          lawyerLabel: "Pending",            userLabel: "Waiting for payment",      bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B",  icon: Clock,           action: "pay" },
  paid:            { label: "Paid",             lawyerLabel: "Paid",               userLabel: "Payment confirmed",         bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6",  icon: CheckCircle },
  processing:      { label: "Processing",       lawyerLabel: "Processing",         userLabel: "Payment confirmed",         bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6",  icon: CheckCircle },
  awaiting_lawyer: { label: "Awaiting Lawyer",  lawyerLabel: "Awaiting Lawyer",    userLabel: "Lawyer is reviewing",      bg: "#FFF0F5", text: "#9D174D", dot: "#E8317A",  icon: Clock },
  active:          { label: "In Progress",      lawyerLabel: "In Progress",        userLabel: "Lawyer has responded",     bg: "#ECFDF5", text: "#065F46", dot: "#10B981",  icon: MessageCircle },
  completed:       { label: "Completed",        lawyerLabel: "Completed",          userLabel: "Consultation finished",    bg: "#F9FAFB", text: "#374151", dot: "#9CA3AF",  icon: CheckCircle },
  disputed:        { label: "Under Review",     lawyerLabel: "Under Review",       userLabel: "Admin is reviewing",       bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444",  icon: Gavel },
  cancelled:       { label: "Cancelled",        lawyerLabel: "Cancelled",          userLabel: "Consultation cancelled",   bg: "#F9FAFB", text: "#6B7280", dot: "#D1D5DB",  icon: XCircle },
  refunded:        { label: "Refunded",         lawyerLabel: "Refunded",           userLabel: "Refund processed",         bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6",  icon: RotateCcw },
};

export const MODE_CFG: Record<ConsultMode, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  message: { label: "Written reply",    icon: MessageSquare, color: "#6B7280", bg: "#F9FAFB" },
  call:    { label: "Scheduled call",   icon: Phone,         color: "#3B82F6", bg: "#EFF6FF" },
  video:   { label: "Video session",    icon: Video,         color: "#8B5CF6", bg: "#F5F3FF" },
};

// Journey steps shown inside each card
export const JOURNEY_STEPS: { key: ConsultStatus[]; label: string }[] = [
  { key: ["paid", "pending"],                       label: "Payment confirmed" },
  { key: ["awaiting_lawyer"],                       label: "Lawyer reviewing" },
  { key: ["active"],                                label: "Lawyer responded" },
  { key: ["completed", "disputed", "cancelled", "refunded"], label: "Resolved" },
];