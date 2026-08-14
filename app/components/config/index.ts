import { ConsultMode, ConsultStatus, MatchRequest } from "@/redux/types/consultation";
import {
  MessageSquare, Phone, Video, MessageCircle, CheckCircle, Gavel, XCircle, RotateCcw, Clock, Clock3,
  Search, UserSearch, Users, CircleCheckBig, CircleX, Bell, X, Eye, Trash2,
  LucideIcon, 
} from "lucide-react"

export const STATUS_CFG: Record<
  ConsultStatus,
  { label: string; bg: string; text: string; dot: string; lawyerLabel: string; userLabel: string; action?: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", lawyerLabel: "Pending", userLabel: "Waiting for payment", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock, action: "pay" },
  paid: { label: "Paid", lawyerLabel: "Paid", userLabel: "Payment confirmed", bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6", icon: CheckCircle },
  processing: { label: "Processing", lawyerLabel: "Processing", userLabel: "Payment confirmed", bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6", icon: CheckCircle },
  awaiting_lawyer: { label: "Awaiting Lawyer", lawyerLabel: "Awaiting Lawyer", userLabel: "Lawyer is reviewing", bg: "#FFF0F5", text: "#9D174D", dot: "#F97316", icon: Clock },
  active: { label: "In Progress", lawyerLabel: "In Progress", userLabel: "Lawyer has responded", bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: MessageCircle },
  completed: { label: "Completed", lawyerLabel: "Completed", userLabel: "Consultation finished", bg: "#F9FAFB", text: "#374151", dot: "#9CA3AF", icon: CheckCircle },
  disputed: { label: "Under Review", lawyerLabel: "Under Review", userLabel: "Admin is reviewing", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: Gavel },
  cancelled: { label: "Cancelled", lawyerLabel: "Cancelled", userLabel: "Consultation cancelled", bg: "#F9FAFB", text: "#6B7280", dot: "#D1D5DB", icon: XCircle },
  refunded: { label: "Refunded", lawyerLabel: "Refunded", userLabel: "Refund processed", bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6", icon: RotateCcw },
};

export const MODE_CFG: Record<ConsultMode, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  sms: { label: "SMS", icon: MessageCircle, color: "#6B7280", bg: "#F9FAFB" },
  message: { label: "In-App Chat", icon: MessageSquare, color: "#6B7280", bg: "#F9FAFB" },
  call: { label: "Scheduled Phone call", icon: Phone, color: "#3B82F6", bg: "#EFF6FF" },
  video: { label: "Video session", icon: Video, color: "#8B5CF6", bg: "#F5F3FF" },
};

export const CONSULT_MODES: { id: ConsultMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "sms", label: "SMS", icon: MessageCircle, desc: "Async — reply within response time" },
  { id: "message", label: "In-App Chat", icon: MessageSquare, desc: "Async — reply within response time" },
  { id: "call", label: "Scheduled Call", icon: Phone, desc: "Audio call, you pick the time slot" },
  { id: "video", label: "Video Session", icon: Video, desc: "Face-to-face via secure video link" },
];

// Journey steps shown inside each card
export const JOURNEY_STEPS: { key: ConsultStatus[]; label: string }[] = [
  { key: ["paid", "pending"], label: "Payment confirmed" },
  { key: ["awaiting_lawyer"], label: "Lawyer reviewing" },
  { key: ["active"], label: "Lawyer responded" },
  { key: ["completed", "disputed", "cancelled", "refunded"], label: "Resolved" },
];


export const MATCH_STATUS_CFG: Record<
  MatchRequest["status"],
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
    icon: LucideIcon;
  }
> = {
  pending: {
    label: "Unassigned", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: Clock3,
  },
  unassigned: {
    label: "Unassigned", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: Clock3,
  },
  in_review: {
    label: "In Review", bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6", icon: Search,
  },
  ready_for_call: {
    label: "Ready for Call", bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: CheckCircle,
  },
  matching: {
    label: "Matching…", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: UserSearch,
  },
  recommended: {
    label: "Recommended", bg: "#FFF0F5", text: "#9D174D", dot: "#F97316", icon: Users,
  },
  matched: {
    label: "Matched", bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: CircleCheckBig,
  },
  expired: {
    label: "Expired", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF", icon: CircleX,
  },
};


export const getIconForType = (type: string) => {
    const icons: any = {
      welcome: "text-purple-500",
      profile_update: "text-blue-500",
      xp_earned: "text-yellow-500",
      account_status: "text-red-500",
      consultation_accepted: "text-green-500",
      consultation_declined: "text-red-500",
      consultation_completed: "text-green-500",
      message_received: "text-blue-500",
      match_accepted: "text-purple-500",
      lawyer_selected: "text-indigo-500",
      dispute_raised: "text-red-500",
      dispute_resolved: "text-green-500",
      refund_requested: "text-yellow-500",
      refund_decision: "text-orange-500",
      verification_submitted: "text-blue-500",
      verification_approved: "text-green-500",
      verification_rejected: "text-red-500",
      review_received: "text-yellow-500",
      module_enrolled: "text-purple-500",
      topic_completed: "text-green-500",
      module_completed: "text-indigo-500",
      comment_received: "text-blue-500",
      reply_received: "text-cyan-500",
      lawyer_responded: "text-purple-500",
      answer_accepted: "text-green-500",
      order_placed: "text-blue-500",
      order_status_updated: "text-indigo-500",
      payment_confirmed: "text-green-500",
      payment_failed: "text-red-500",
      subscription_initiated: "text-blue-500",
      subscription_activated: "text-green-500",
      subscription_cancelled: "text-red-500",
      subscription_reactivated: "text-green-500",
      plan_changed: "text-purple-500",
      subtopic_completed: "text-green-500",
      bookmark_created: "text-yellow-500",
      subtopic_liked: "text-pink-500",
      default: "text-gray-500",
    };
    return icons[type] || icons.default;
  };